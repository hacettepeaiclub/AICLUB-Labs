import { useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
  const links = useMemo(
    () => (points ? constellationLinks(points, selected, neighbours) : []),
    [points, selected, neighbours],
  );

  const neighbourIndices = new Set(neighbours.map((n) => n.index));
  const scoreOf = new Map(neighbours.map((n, rank) => [n.index, { rank: rank + 1, value: n.similarity }]));
  const labels = points ? labelledPoints(selected, neighbours, hovered, highlighted) : new Set<number>();
  const optionId = (index: number) => `${baseId}-point-${index}`;
  const glowId = `${baseId}-glow`;
  const coreId = `${baseId}-core`;

  // Priority decides who survives a collision: the highlighted pair and the
  // selection first, then neighbours in rank order, then whatever is hovered.
  const priority = [
    ...highlighted,
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
              pinned: index === selected || neighbourIndices.has(index) || highlighted.includes(index),
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
    const score = scoreOf.get(index);
    return score
      ? copy.neighbourLabel(item.en, item.tr, score.rank, formatScore(score.value))
      : copy.pointLabel(item.en, item.tr);
  };

  const ring = active !== null && showRing ? points?.[active] : undefined;
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
@keyframes eu-pulse {
  0%   { opacity: 0.3; }
  55%  { opacity: 1; }
  100% { opacity: 0.75; }
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
            onPointerMove={(e) => setHovered(pick(e.clientX, e.clientY))}
            onPointerLeave={() => setHovered(null)}
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
              return (
                <g
                  key={index}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === selected}
                  aria-label={describe(index)}
                  className={cn(style.className, "pointer-events-none")}
                  opacity={style.opacity}
                >
                  {style.glow > 0 && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={style.glow}
                      fill={`url(#${glowId})`}
                      style={
                        !reduced && role === "selected"
                          ? { animation: "eu-pulse 1200ms ease-out 1" }
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
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={style.core}
                    fill={`url(#${coreId})`}
                  />
                </g>
              );
            })}
          </g>

          {/* Drawn focus indicator: never depends on SVG focus-ring support. */}
          {ring && (
            <circle
              cx={ring.x}
              cy={ring.y}
              r={4.6}
              fill="none"
              className="stroke-accent"
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
                      isSelected || highlighted.includes(label.index)
                        ? "fill-fg"
                        : "fill-fg-muted",
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
