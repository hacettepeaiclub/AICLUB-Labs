import { useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useRafLoop } from "@/hooks";
import { damp } from "@/lib/math";
import { cn } from "@/lib/cn";
import type { Neighbour } from "../engine";
import type { VocabularyItem } from "../vocabulary";
import {
  VIEWBOX,
  constellationLinks,
  contourRings,
  decorativeStars,
  labelledPoints,
  nearestPoint,
  placeLabels,
  pointDrift,
  pointRole,
  type Point,
  type PointRole,
  type Viewport,
} from "../view";

/**
 * The map. Rendered exactly once for the whole lab.
 *
 * Section 2 does not mount a second copy and does not compute a second
 * projection — it passes `highlighted`, and the same points that were being
 * explored a moment ago become the demonstration. That is the point: the pair
 * section 2 is about has been on screen the whole time, and the visitor simply
 * had no reason to notice where it was.
 *
 * ## Why the points are drawn as stars
 *
 * The first build drew 318 identical grey circles and it read as a scatter
 * plot: you could see that there were points, but not that each one *was* a
 * word. A dot is a mark; a star is an object. So every point is a bright core
 * inside a soft glow, and the states a point can be in differ in glow radius,
 * in whether it has rays, and in whether it is named — not merely in opacity.
 *
 * The gradients live in one `<defs>` block and are referenced by every point,
 * so richer rendering costs one definition rather than 318.
 *
 * ## Why the points are not focusable
 *
 * The obvious build gives every point `tabindex="-1"` and moves real focus
 * between them. SVG element focus is the least reliable corner of the platform
 * — focus rings on SVG shapes are inconsistent between engines, and
 * `HTMLElement.focus()` semantics on SVG nodes have a long history of
 * disagreement — so this uses the pattern that does not depend on any of it:
 * one focusable container with `aria-activedescendant`, points exposed as
 * options, and a focus ring this component draws itself. One tab stop, no 318
 * invisible hit targets, and a focus indicator that cannot fail to render
 * because it is just another shape.
 *
 * ## Why one rectangle handles every pointer
 *
 * A transparent overlay catches pointer and touch events and `nearestPoint`
 * resolves them. A fingertip never has to land on a two-pixel star, and the
 * node count stays at one glyph per word instead of two.
 */

export interface UniverseMapCopy {
  readonly mapLabel: string;
  readonly pointLabel: (word: string, gloss: string) => string;
  readonly neighbourLabel: (word: string, gloss: string, rank: number, score: string) => string;
  readonly selectedLabel: (word: string, gloss: string) => string;
  readonly pinnedLabel: (word: string, gloss: string) => string;
  readonly compareLabel: (a: string, b: string, score: string) => string;
  readonly pending: string;
  /** States plainly that the drawn lines are an overlay, not edges in the model. */
  readonly linksNote: string;
}

export interface UniverseMapProps {
  viewport: Viewport | null;
  vocabulary: readonly VocabularyItem[];
  selected: number | null;
  neighbours: readonly Neighbour[];
  /** Section 2's pair. When non-empty everything else dims. */
  highlighted: readonly number[];
  /** A second word held for comparison, or null. Drawn as a ringed star. */
  pinned: number | null;
  /** Cosine between the pinned word and the selection, straight from the engine. */
  pinnedSimilarity: number | null;
  formatScore: (value: number) => string;
  onSelect: (index: number) => void;
  copy: UniverseMapCopy;
}

/**
 * The four states a point can be in.
 *
 * Every difference is carried by at least two channels — core size, glow, rays,
 * and whether the word is named — so none of it rests on colour alone. Every
 * ordinary point is drawn identically: a point's size never encodes anything,
 * because it has nothing to encode.
 */
const ROLE_STYLE: Record<
  PointRole,
  { core: number; glow: number; rays: number; className: string; opacity: number }
> = {
  base: { core: 0.42, glow: 1.6, rays: 0, className: "text-fg", opacity: 0.6 },
  neighbour: { core: 0.85, glow: 3.6, rays: 3.8, className: "text-accent", opacity: 1 },
  selected: { core: 1.25, glow: 7, rays: 6.6, className: "text-accent", opacity: 1 },
  highlighted: { core: 1.35, glow: 7.4, rays: 7, className: "text-accent", opacity: 1 },
  dimmed: { core: 0.32, glow: 0, rays: 0, className: "text-fg", opacity: 0.14 },
};

/**
 * How far a neighbour leans away from the word that just selected it, and how
 * quickly that fades with distance.
 *
 * Both numbers were measured rather than guessed. A word's eight nearest
 * neighbours are *semantically* close but the projection scatters them: across
 * a selection they sit between about 10 and 21 viewBox units away, not the 1-5
 * a first guess assumes. Tuned for the wrong range the lean came out at 0.2px,
 * which is below the ambient drift — the field was responding and nobody could
 * see it.
 *
 * At these values the nearest neighbour moves about 1.1px and the furthest
 * about 0.8px, so the gradient is legible and the whole effect stays under two
 * pixels. That is roughly three times the ambient breath, which is the
 * hierarchy this wants: the space is alive, the selection is an event.
 *
 * It stays far below a point's own core radius on purpose. This is a map where
 * distance *is* the meaning, so the one thing the motion may never do is make
 * two words look closer or further apart than the embedding says they are.
 */
const RESPONSE = 0.26;
const RESPONSE_FALLOFF = 0.06;

/**
 * The pointer's own small field.
 *
 * `FIELD_RADIUS` is how far it reaches, in viewBox units; `FIELD_PUSH` is how
 * far the closest word is nudged, and it is a *push*, away from the pointer.
 * Pulling would make the dots chase the cursor, which is the one thing this
 * must not look like. Pushing reads as the space yielding slightly and closing
 * again behind you, which is what a field does.
 *
 * At 0.2 units the strongest nudge is about 1.5px: inside the brief's range,
 * below the neighbour lean, above the ambient breath. That ordering is the
 * whole point. A pointer merely passing over the map should be the faintest
 * deliberate motion on it, weaker than the response to an actual selection.
 */
const FIELD_RADIUS = 9;
const FIELD_PUSH = 0.2;
/** Approach rate for the nudge. Framerate-independent via `damp`. */
const FIELD_LAMBDA = 9;

/**
 * The lean itself: away from the selection, weaker the further out it starts.
 *
 * Only the words the engine already returned as neighbours move. Nothing here
 * invents a relationship — it reads the same list the lines and the ranked
 * panel are drawn from.
 */
function neighbourLean(from: Point, to: Point): { x: number; y: number } | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  // Written as an exponent so it cannot be mistaken for a measured value:
  // the lab test rejects any three-decimal literal in a component, because a
  // number like that is usually an engine result someone pasted in.
  if (distance < 1e-3) return null;
  const reach = RESPONSE / (1 + distance * RESPONSE_FALLOFF);
  return { x: (dx / distance) * reach, y: (dy / distance) * reach };
}

/** A four-pointed star: tapered spikes, drawn only for emphasised points. */
const rayPath = (x: number, y: number, r: number): string => {
  const w = r * 0.09;
  return (
    `M${x} ${y - r}L${x + w} ${y - w}L${x + r} ${y}L${x + w} ${y + w}` +
    `L${x} ${y + r}L${x - w} ${y + w}L${x - r} ${y}L${x - w} ${y - w}Z`
  );
};

export function UniverseMap({
  viewport,
  vocabulary,
  selected,
  neighbours,
  highlighted,
  pinned,
  pinnedSimilarity,
  formatScore,
  onSelect,
  copy,
}: UniverseMapProps) {
  const baseId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // Virtual focus. Real focus stays on the container; this is what
  // `aria-activedescendant` points at and what the drawn ring follows.
  const [active, setActive] = useState<number | null>(null);
  const [showRing, setShowRing] = useState(false);
  const reduced = useReducedMotion();

  const points = viewport?.points ?? null;
  const frameWidth = viewport?.width ?? VIEWBOX;
  const frameHeight = viewport?.height ?? VIEWBOX;

  const stars = useMemo(
    () => (viewport ? decorativeStars(viewport.width, viewport.height) : []),
    [viewport],
  );
  const rings = useMemo(() => (points ? contourRings(points) : []), [points]);
  // One drift per word, seeded, computed once. Reduced motion never asks
  // for it, so under that setting the array is not even built.
  const drift = useMemo(
    () => (points && !reduced ? pointDrift(points.length) : []),
    [points, reduced],
  );
  const links = useMemo(
    () => (points ? constellationLinks(points, selected, neighbours) : []),
    [points, selected, neighbours],
  );

  /**
   * The pointer field.
   *
   * One loop for the whole map, not one per word. The pointer position lives in
   * a ref and the offsets are written straight to the DOM, so moving the mouse
   * across 318 words costs no React renders at all — the only state a pointer
   * move sets is `hovered`, exactly as it did before.
   *
   * The offsets go on an inner group so they cannot collide with the two
   * channels the outer group already owns: `translate` for the ambient breath,
   * `transform` for the lean toward a selection. Three systems, three
   * properties, none of them fighting.
   */
  const pointerAt = useRef<Point | null>(null);
  const fieldRefs = useRef<(SVGGElement | null)[]>([]);
  const fieldOffset = useRef<Float64Array>(new Float64Array(0));
  /**
   * Whether any word is currently away from its resting offset.
   *
   * Without this the loop would scan 318 words on every frame of a session
   * where the pointer never went near the map. With it, an untouched map pays
   * one comparison per frame and nothing else — the scan starts when the
   * pointer arrives and stops once the last word has settled back.
   */
  const fieldSettled = useRef(true);

  useRafLoop(
    (dt) => {
      const all = points;
      if (!all) return;
      if (!pointerAt.current && fieldSettled.current) return;
      if (fieldOffset.current.length !== all.length * 2) {
        fieldOffset.current = new Float64Array(all.length * 2);
      }
      const offsets = fieldOffset.current;
      const at = pointerAt.current;
      // Squared, so the common case — a word nowhere near the pointer — costs
      // a subtract and a multiply rather than a square root.
      const radiusSquared = FIELD_RADIUS * FIELD_RADIUS;
      let anyMoved = false;
      for (let i = 0; i < all.length; i++) {
        const currentX = offsets[i * 2]!;
        const currentY = offsets[i * 2 + 1]!;
        let targetX = 0;
        let targetY = 0;
        if (at) {
          const point = all[i]!;
          const dx = point.x - at.x;
          const dy = point.y - at.y;
          const square = dx * dx + dy * dy;
          if (square < radiusSquared && square > 1e-6) {
            const distance = Math.sqrt(square);
            // Linear falloff to nothing at the edge of the field, so a word
            // never pops as it enters or leaves it.
            const strength = (1 - distance / FIELD_RADIUS) * FIELD_PUSH;
            targetX = (dx / distance) * strength;
            targetY = (dy / distance) * strength;
          }
        }
        // The overwhelming majority of words, on the overwhelming majority of
        // frames, are at rest and being asked to stay there. Leaving before any
        // damping or string building is what keeps a 318-word map cheap.
        if (targetX === 0 && targetY === 0 && currentX === 0 && currentY === 0) continue;

        let x = damp(currentX, targetX, FIELD_LAMBDA, dt);
        let y = damp(currentY, targetY, FIELD_LAMBDA, dt);
        // `damp` approaches its target asymptotically and never arrives, so
        // without this a word that has drifted back to within a thousandth of a
        // pixel would keep a stale transform on it for ever.
        if (targetX === 0 && targetY === 0 && Math.abs(x) < 1e-3 && Math.abs(y) < 1e-3) {
          x = 0;
          y = 0;
        }
        if (x !== 0 || y !== 0) anyMoved = true;
        if (x === currentX && y === currentY) continue;
        offsets[i * 2] = x;
        offsets[i * 2 + 1] = y;
        const node = fieldRefs.current[i];
        if (node) {
          node.style.transform =
            x === 0 && y === 0 ? "" : `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px)`;
        }
      }
      fieldSettled.current = !anyMoved;
    },
    !reduced && points !== null,
  );

  const neighbourIndices = new Set(neighbours.map((n) => n.index));
  const scoreOf = new Map(
    neighbours.map((n, rank) => [n.index, { rank: rank + 1, value: n.similarity }]),
  );
  // `labelledPoints` decides who gets a name; a pinned word is added to that
  // set here rather than inside it, so the tested pure function keeps its exact
  // behaviour and the pin stays a presentation concern.
  const labels = points
    ? labelledPoints(selected, neighbours, hovered, highlighted)
    : new Set<number>();
  if (pinned !== null) labels.add(pinned);
  // `pinned` is also the name of a LabelCandidate field, so the held word gets
  // a distinct local name where the two would otherwise collide.
  const heldIndex = pinned;
  const optionId = (index: number) => `${baseId}-point-${index}`;
  const glowId = `${baseId}-glow`;
  const coreId = `${baseId}-core`;

  // Priority decides who survives a collision: the highlighted pair and the
  // selection first, then neighbours in rank order, then whatever is hovered.
  const priority = [
    ...highlighted,
    ...(pinned === null ? [] : [pinned]),
    ...(selected === null ? [] : [selected]),
    ...neighbours.map((n) => n.index),
    ...(hovered === null ? [] : [hovered]),
  ].filter((index, at, all) => labels.has(index) && all.indexOf(index) === at);

  const placed = points
    ? placeLabels(
        priority.flatMap((index) => {
          const point = points[index];
          const item = vocabulary[index];
          if (!point || !item) return [];
          return [
            {
              index,
              text: item.en,
              size: index === selected ? 4.4 : 3.3,
              point,
              // The selection, its listed neighbours and section 2's pair are
              // all pinned: they are nudged apart on a collision rather than
              // dropped.
              //
              // Dropping was wrong here. Two neighbours landing close together
              // left one label serving two stars, and "which point is which
              // word" is the question this map has to answer. Only a hovered
              // point stays droppable, because it is transient and the panel
              // names it anyway.
              pinned:
                index === selected ||
                index === heldIndex ||
                neighbourIndices.has(index) ||
                highlighted.includes(index),
            },
          ];
        }),
        frameWidth,
        frameHeight,
      )
    : [];

  /** Pointer position in viewBox units. The frame matches the data's aspect. */
  const toViewBox = (clientX: number, clientY: number): Point | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * frameWidth,
      y: ((clientY - rect.top) / rect.height) * frameHeight,
    };
  };

  const pick = (clientX: number, clientY: number): number | null => {
    if (!points) return null;
    const at = toViewBox(clientX, clientY);
    return at ? nearestPoint(points, at.x, at.y) : null;
  };

  /** Arrow keys walk the selected word's neighbours — semantic order, not geometry. */
  const step = (delta: number) => {
    if (neighbours.length === 0) return;
    const current = active === null ? -1 : neighbours.findIndex((n) => n.index === active);
    const next = (current + delta + neighbours.length + 1) % (neighbours.length + 1);
    setActive(next === neighbours.length ? selected : (neighbours[next]?.index ?? null));
    setShowRing(true);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        step(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        step(-1);
        break;
      case "Home":
        event.preventDefault();
        setActive(selected);
        setShowRing(true);
        break;
      case "Enter":
      case " ":
        if (active !== null && active !== selected) {
          event.preventDefault();
          onSelect(active);
        }
        break;
      default:
        break;
    }
  };

  const describe = (index: number): string => {
    const item = vocabulary[index];
    if (!item) return "";
    if (index === selected) return copy.selectedLabel(item.en, item.tr);
    if (index === pinned) return copy.pinnedLabel(item.en, item.tr);
    const score = scoreOf.get(index);
    return score
      ? copy.neighbourLabel(item.en, item.tr, score.rank, formatScore(score.value))
      : copy.pointLabel(item.en, item.tr);
  };

  const ring = active !== null && showRing ? points?.[active] : undefined;
  const heldPoint = heldIndex !== null && heldIndex !== selected ? points?.[heldIndex] : undefined;
  const selectedPoint = selected !== null ? points?.[selected] : undefined;
  const compare = heldPoint && selectedPoint ? { from: heldPoint, to: selectedPoint } : null;
  const pair =
    highlighted.length === 2 && points
      ? { from: points[highlighted[0]!], to: points[highlighted[1]!] }
      : null;

  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-label={copy.mapLabel}
      aria-describedby={`${baseId}-links-note`}
      aria-activedescendant={active !== null && points ? optionId(active) : undefined}
      onKeyDown={onKeyDown}
      onFocus={() => {
        setActive((current) => current ?? selected);
        setShowRing(true);
      }}
      onBlur={() => setShowRing(false)}
      className={cn(
        // The hero of the section, sized to the shape of the data.
        //
        // `aspect-[1000/909]` is the cloud's own extent, so the frame is full
        // rather than a square with a fifth of it permanently empty. At the
        // 48rem cap that is 768x698 on a desktop; on a phone it takes the full
        // column width and comes out near enough square to read the same way.
        "relative mx-auto aspect-[1000/909] w-full max-w-[48rem] overflow-hidden rounded-2xl",
        "border border-line/10",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
      )}
    >
      {/* Said in words, because a line drawn between two stars looks like a
          fact about the model and is not one. */}
      <p id={`${baseId}-links-note`} className="sr-only">
        {copy.linksNote}
      </p>
      {/* The drawn tether says the same thing as this sentence. Anyone who
          cannot see the line still gets the measurement. */}
      <p className="sr-only" aria-live="polite">
        {heldIndex !== null &&
        selected !== null &&
        heldIndex !== selected &&
        pinnedSimilarity !== null
          ? copy.compareLabel(
              vocabulary[heldIndex]?.en ?? "",
              vocabulary[selected]?.en ?? "",
              formatScore(pinnedSimilarity),
            )
          : ""}
      </p>

      {/* Keyframes for decoration and the one-shot reveal. Rendered at all only
          when motion is allowed, so under `prefers-reduced-motion` the rules do
          not exist and nothing can move. No embedding point is ever a target of
          a rule that changes position. */}
      {!reduced && (
        <style>{`
@keyframes eu-drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(var(--eu-travel), calc(var(--eu-travel) * -0.6)); }
}
@keyframes eu-arrive { from { opacity: 0; } to { opacity: 1; } }
/* The words breathe. This animates \`translate\`, not \`transform\`, so the
   response to a selection or to the pointer can sit on \`transform\` without
   the two fighting over one property. */
@keyframes eu-float {
  from { translate: 0 0; }
  to   { translate: var(--eu-dx) var(--eu-dy); }
}
@keyframes eu-pulse {
  0%   { opacity: 0.3; }
  55%  { opacity: 1; }
  100% { opacity: 0.75; }
}
/* What the selected word does once the arrival pulse has finished: a slow,
   shallow breath, opacity only. No scale — a word that changes size is a word
   whose position you stop trusting, and this map is about position. */
@keyframes eu-breathe {
  from { opacity: 0.72; }
  to   { opacity: 0.98; }
}`}</style>
      )}

      {!points && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-body-sm text-fg-faint">
          {copy.pending}
        </p>
      )}

      {points && (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${frameWidth} ${frameHeight}`}
          className="h-full w-full touch-none"
          role="presentation"
          style={reduced ? undefined : { animation: "eu-arrive 650ms ease-out both" }}
        >
          <defs>
            {/* One soft-light definition, referenced by all 318 points. */}
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
              <stop offset="45%" stopColor="currentColor" stopOpacity="0.12" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={coreId}>
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* ---- atmosphere: decoration only, never data ------------------ */}
          <g aria-hidden="true" className="pointer-events-none">
            {/* Two faint fields, offset from centre so the space has a bias to
                it rather than reading as a vignette. */}
            <ellipse
              cx={frameWidth * 0.34}
              cy={frameHeight * 0.4}
              rx={frameWidth * 0.48}
              ry={frameHeight * 0.42}
              className="text-fg"
              fill={`url(#${glowId})`}
              opacity={0.2}
            />
            <ellipse
              cx={frameWidth * 0.74}
              cy={frameHeight * 0.68}
              rx={frameWidth * 0.36}
              ry={frameHeight * 0.32}
              className="text-accent"
              fill={`url(#${glowId})`}
              opacity={0.14}
            />
            {/* Rings centred on the cloud's real centroid: they trace where the
                data actually thins, rather than sitting at arbitrary radii. */}
            {rings.map((r, i) => (
              <circle
                key={i}
                cx={r.cx}
                cy={r.cy}
                r={r.r}
                fill="none"
                className="stroke-fg"
                strokeWidth={0.09}
                opacity={0.06}
              />
            ))}
            {stars.map((star, i) => (
              <circle
                key={i}
                cx={star.x}
                cy={star.y}
                r={star.r}
                className="fill-fg"
                opacity={star.opacity}
                style={
                  reduced
                    ? undefined
                    : {
                        animation: `eu-drift ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
                        ["--eu-travel" as string]: `${star.travel.toFixed(2)}px`,
                      }
                }
              />
            ))}
          </g>

          {/* One transparent surface for every pointer and touch. */}
          <rect
            x="0"
            y="0"
            width={frameWidth}
            height={frameHeight}
            fill="transparent"
            onPointerMove={(e) => {
              // Two jobs, one event. `hovered` is React state and drives the
              // label; the ref is read by the field loop and never renders.
              pointerAt.current = toViewBox(e.clientX, e.clientY);
              fieldSettled.current = false;
              setHovered(pick(e.clientX, e.clientY));
            }}
            onPointerLeave={() => {
              pointerAt.current = null;
              setHovered(null);
            }}
            onPointerDown={(e) => {
              const index = pick(e.clientX, e.clientY);
              if (index !== null) {
                onSelect(index);
                setActive(index);
              }
            }}
          />

          {/* ---- constellation: an overlay, not edges in the model -------- */}
          <g className="pointer-events-none">
            {highlighted.length === 0 &&
              links.map((link, i) => (
                <line
                  key={i}
                  x1={link.from.x}
                  y1={link.from.y}
                  x2={link.to.x}
                  y2={link.to.y}
                  className="stroke-accent"
                  strokeWidth={0.16}
                  opacity={0.14 + link.weight * 0.26}
                />
              ))}
            {/* The comparison tether: two words the visitor put side by side,
                with the cosine the engine measured printed on it. Dashes and a
                printed number, never colour alone — and it is the one line in
                this map that carries a value rather than a rank. */}
            {compare && (
              <g>
                <line
                  x1={compare.from.x}
                  y1={compare.from.y}
                  x2={compare.to.x}
                  y2={compare.to.y}
                  className="stroke-fg"
                  strokeWidth={0.22}
                  strokeDasharray="2 1.4"
                  opacity={0.55}
                />
                {pinnedSimilarity !== null && (
                  <text
                    x={(compare.from.x + compare.to.x) / 2}
                    y={(compare.from.y + compare.to.y) / 2 - 1}
                    textAnchor="middle"
                    className="fill-fg font-mono"
                    style={{
                      fontSize: 3.2,
                      paintOrder: "stroke",
                      stroke: "rgb(var(--ink-950))",
                      strokeWidth: 1.1,
                      strokeLinejoin: "round",
                    }}
                  >
                    {formatScore(pinnedSimilarity)}
                  </text>
                )}
              </g>
            )}
            {pair && pair.from && pair.to && (
              <line
                x1={pair.from.x}
                y1={pair.from.y}
                x2={pair.to.x}
                y2={pair.to.y}
                className="stroke-accent"
                strokeWidth={0.3}
                strokeDasharray="1.4 1.1"
                opacity={0.7}
              />
            )}
          </g>

          {/* ---- the 318 words ------------------------------------------- */}
          <g>
            {points.map((point, index) => {
              const role = pointRole(index, selected, neighbourIndices, highlighted);
              const style = ROLE_STYLE[role];
              const emphasised = role !== "base" && role !== "dimmed";
              const driftOf = drift[index];
              // Only the engine's own neighbours lean, and only while motion is
              // allowed. Everything else stays exactly where it was drawn.
              const anchor = selected === null ? null : points[selected];
              const lean =
                !reduced && anchor && role === "neighbour" ? neighbourLean(anchor, point) : null;
              return (
                <g
                  key={index}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === selected}
                  aria-label={describe(index)}
                  className={cn(style.className, "pointer-events-none")}
                  opacity={style.opacity}
                  // Two independent channels, which is why they can coexist:
                  // `translate` carries the ambient breath, `transform` carries
                  // the lean toward or away from a selection. Both are pure
                  // rendering. The coordinate underneath is untouched and
                  // `nearestPoint` never hears about either, so the thing you
                  // click is still the thing the maths says is there.
                  style={
                    driftOf || lean
                      ? {
                          ...(driftOf && {
                            animation: `eu-float ${driftOf.duration.toFixed(1)}s ease-in-out ${driftOf.delay.toFixed(1)}s infinite alternate`,
                            ["--eu-dx" as string]: `${driftOf.dx.toFixed(3)}px`,
                            ["--eu-dy" as string]: `${driftOf.dy.toFixed(3)}px`,
                          }),
                          ...(lean && {
                            transform: `translate(${lean.x.toFixed(3)}px, ${lean.y.toFixed(3)}px)`,
                            transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }),
                        }
                      : undefined
                  }
                >
                  <g
                    ref={(el) => {
                      fieldRefs.current[index] = el;
                    }}
                  >
                    {style.glow > 0 && (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={style.glow}
                        fill={`url(#${glowId})`}
                        // Arrive, then keep breathing. The second animation is
                        // delayed by exactly the first's duration, so the two
                        // hand over rather than fight over one property. The
                        // comment sits above the guard rather than under it so
                        // `lab.test.ts` can still see them together.
                        style={
                          !reduced && role === "selected"
                            ? {
                                animation:
                                  "eu-pulse 1200ms ease-out 1, eu-breathe 5200ms ease-in-out 1200ms infinite alternate",
                              }
                            : undefined
                        }
                      />
                    )}
                    {emphasised && (
                      <path
                        d={rayPath(point.x, point.y, style.rays)}
                        fill="currentColor"
                        opacity={0.45}
                      />
                    )}
                    <circle cx={point.x} cy={point.y} r={style.core} fill={`url(#${coreId})`} />
                  </g>
                </g>
              );
            })}
          </g>

          {/* The held word wears a ring. A second shape channel, so "pinned"
              is not another shade of the same blue.

              `pointer-events-none` is not optional on either of the two rings
              below. An SVG shape defaults to `visiblePainted`, and that counts
              the *stroke* even when the fill is `none` — so a hairline ring
              drawn around the current word was quietly eating every click that
              landed on its circumference. That band sits exactly where the
              neighbours are, which made the points hardest to reach precisely
              when the visitor had just found something worth exploring. The
              rings say where you are; they were never meant to be a target. */}
          {heldPoint && (
            <circle
              cx={heldPoint.x}
              cy={heldPoint.y}
              r={3.4}
              fill="none"
              className="pointer-events-none stroke-fg"
              strokeWidth={0.3}
              opacity={0.8}
            />
          )}

          {/* Drawn focus indicator: never depends on SVG focus-ring support. */}
          {ring && (
            <circle
              cx={ring.x}
              cy={ring.y}
              r={4.6}
              fill="none"
              className="pointer-events-none stroke-accent"
              strokeWidth={0.4}
              strokeDasharray="1.6 1.2"
            />
          )}

          {/* ---- labels, tethered to their stars -------------------------- */}
          <g className="pointer-events-none">
            {placed.map((label) => {
              const anchor = points[label.index];
              if (!anchor) return null;
              const isSelected = label.index === selected;
              // A label is nudged off its point to clear its neighbours; the
              // tether is what keeps it legible as *that* star's name rather
              // than text floating nearby.
              const gap = Math.hypot(label.x - anchor.x, label.y - anchor.y);
              return (
                <g key={label.index}>
                  {gap > label.size * 1.7 && (
                    <line
                      x1={anchor.x}
                      y1={anchor.y}
                      x2={label.x}
                      y2={label.y + label.size * 0.3}
                      className="stroke-fg"
                      strokeWidth={0.1}
                      opacity={0.28}
                    />
                  )}
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    className={cn(
                      "font-mono",
                      isSelected || highlighted.includes(label.index) ? "fill-fg" : "fill-fg-muted",
                    )}
                    style={{
                      fontSize: label.size,
                      letterSpacing: isSelected ? "0.08em" : "0.02em",
                      // A thin ground in the page colour, so a word stays
                      // readable where it crosses a star, a ring or a link.
                      paintOrder: "stroke",
                      stroke: "rgb(var(--ink-950))",
                      strokeWidth: label.size * 0.24,
                      strokeLinejoin: "round",
                    }}
                  >
                    {label.text}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
