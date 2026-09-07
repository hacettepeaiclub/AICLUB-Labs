import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Neighbour } from "../../embedding-universe/engine";
import type { VocabularyItem } from "../../embedding-universe/vocabulary";
import { placeLabels } from "../../embedding-universe/view";
import { depthOrder, orbit, perspective, type Point3 } from "../projection3d";

/**
 * The spatial view. A prototype, and drawn with the same tools as the flat one.
 *
 * ## No new dependency
 *
 * Three.js is roughly 150 KB gzipped to put 318 points on screen. What is
 * needed here is one rotation, one division per point and a depth sort — about
 * forty lines — and doing it in SVG keeps the accessibility model that already
 * works: real elements with real names, one tab stop, no canvas to describe.
 * If this prototype ever became the lesson and needed tens of thousands of
 * points, WebGL would be the right call. At 318 it would be cost without
 * benefit.
 *
 * ## No idle loop
 *
 * There is no auto-rotation. The camera moves only while a pointer is dragging
 * it, so nothing spins on its own, nothing runs when the tab is idle, and there
 * is no motion to suppress for a visitor who asked for less of it — the view is
 * already still until they move it.
 */

export interface Universe3DCopy {
  readonly mapLabel: string;
  readonly hint: string;
  readonly pointLabel: (word: string, gloss: string) => string;
  readonly neighbourLabel: (word: string, gloss: string, rank: number, score: string) => string;
  readonly selectedLabel: (word: string, gloss: string) => string;
  readonly pending: string;
}

export interface Universe3DProps {
  points: readonly Point3[] | null;
  vocabulary: readonly VocabularyItem[];
  selected: number;
  neighbours: readonly Neighbour[];
  formatScore: (value: number) => string;
  onSelect: (index: number) => void;
  copy: Universe3DCopy;
}

/**
 * Half-width of the frame, in the same units the cloud is normalised into.
 *
 * Tighter than the cube's own extent on purpose: the projection spreads points
 * to about ±60 after perspective, so a wider frame left the whole universe
 * sitting small in the middle of its own panel.
 */
const VIEW = 165;

export function Universe3D({
  points,
  vocabulary,
  selected,
  neighbours,
  formatScore,
  onSelect,
  copy,
}: Universe3DProps) {
  const baseId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [camera, setCamera] = useState({ yaw: 0.6, pitch: -0.3 });
  const [active, setActive] = useState<number>(selected);
  const [showRing, setShowRing] = useState(false);

  const rotated = useMemo(
    () => (points ? orbit(points, camera.yaw, camera.pitch) : []),
    [points, camera],
  );
  const screen = useMemo(() => rotated.map((p) => perspective(p)), [rotated]);
  const order = useMemo(() => depthOrder(rotated), [rotated]);

  const labels = useMemo(() => {
    if (screen.length === 0) return [];
    return placeLabels(
      [selected, ...neighbours.map((n) => n.index)].flatMap((index) => {
        const p = screen[index];
        const item = vocabulary[index];
        if (!p || !item) return [];
        return [
          {
            index,
            text: item.en,
            size: index === selected ? 7.5 : 5.4,
            // Shifted into a corner-origin frame for measurement.
            point: { x: p.x + VIEW / 2, y: p.y + VIEW / 2 - (index === selected ? 9 : 6) },
            pinned: true,
          },
        ];
      }),
      VIEW,
      VIEW,
    );
  }, [screen, selected, neighbours, vocabulary]);

  const neighbourIndices = new Set(neighbours.map((n) => n.index));
  const scoreOf = new Map(neighbours.map((n, rank) => [n.index, { rank: rank + 1, value: n.similarity }]));
  const optionId = (index: number) => `${baseId}-star-${index}`;
  const glowId = `${baseId}-glow3`;

  const describe = (index: number): string => {
    const item = vocabulary[index];
    if (!item) return "";
    if (index === selected) return copy.selectedLabel(item.en, item.tr);
    const score = scoreOf.get(index);
    return score
      ? copy.neighbourLabel(item.en, item.tr, score.rank, formatScore(score.value))
      : copy.pointLabel(item.en, item.tr);
  };

  /** Nearest star to a pointer, in projected screen space. */
  const pick = (clientX: number, clientY: number): number | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || screen.length === 0) return null;
    const x = ((clientX - rect.left) / rect.width) * VIEW - VIEW / 2;
    const y = ((clientY - rect.top) / rect.height) * VIEW - VIEW / 2;
    let best = -1;
    let bestDistance = Infinity;
    screen.forEach((p, i) => {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    return best >= 0 && bestDistance < 12 ** 2 ? best : null;
  };

  const step = (delta: number) => {
    if (neighbours.length === 0) return;
    const current = neighbours.findIndex((n) => n.index === active);
    const next = (current + delta + neighbours.length + 1) % (neighbours.length + 1);
    setActive(next === neighbours.length ? selected : (neighbours[next]?.index ?? selected));
    setShowRing(true);
  };

  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-label={copy.mapLabel}
      aria-activedescendant={points ? optionId(active) : undefined}
      onFocus={() => setShowRing(true)}
      onBlur={() => setShowRing(false)}
      onKeyDown={(event) => {
        const turn = 0.18;
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault();
            if (event.shiftKey) setCamera((c) => ({ ...c, yaw: c.yaw + turn }));
            else step(1);
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (event.shiftKey) setCamera((c) => ({ ...c, yaw: c.yaw - turn }));
            else step(-1);
            break;
          case "ArrowDown":
            event.preventDefault();
            if (event.shiftKey) setCamera((c) => ({ ...c, pitch: c.pitch + turn }));
            else step(1);
            break;
          case "ArrowUp":
            event.preventDefault();
            if (event.shiftKey) setCamera((c) => ({ ...c, pitch: c.pitch - turn }));
            else step(-1);
            break;
          case "Enter":
          case " ":
            if (active !== selected) {
              event.preventDefault();
              onSelect(active);
            }
            break;
          default:
            break;
        }
      }}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[46rem] overflow-hidden rounded-2xl",
        "border border-line/10 bg-ink-950",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
      )}
    >
      {!points && (
        <p className="absolute inset-0 flex items-center justify-center text-body-sm text-fg-faint">
          {copy.pending}
        </p>
      )}

      {points && (
        <svg
          ref={svgRef}
          viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`}
          className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
          role="presentation"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, y: e.clientY };
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.x;
            const dy = e.clientY - drag.current.y;
            drag.current = { x: e.clientX, y: e.clientY };
            setCamera((c) => ({
              yaw: c.yaw + dx * 0.006,
              pitch: Math.max(-1.2, Math.min(1.2, c.pitch + dy * 0.006)),
            }));
          }}
          onPointerUp={(e) => {
            const moved = drag.current;
            drag.current = null;
            // A tap that did not drag is a selection.
            if (!moved) return;
            const index = pick(e.clientX, e.clientY);
            if (index !== null) {
              onSelect(index);
              setActive(index);
            }
          }}
          onPointerLeave={() => {
            drag.current = null;
          }}
        >
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="45%" stopColor="currentColor" stopOpacity="0.12" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g aria-hidden="true" className="pointer-events-none">
            <ellipse
              cx={0}
              cy={0}
              rx={VIEW * 0.5}
              ry={VIEW * 0.45}
              className="text-fg"
              fill={`url(#${glowId})`}
              opacity={0.18}
            />
          </g>

          {/* Far to near, so depth genuinely occludes. */}
          <g>
            {order.map((index) => {
              const p = screen[index];
              if (!p) return null;
              const isSelected = index === selected;
              const isNeighbour = neighbourIndices.has(index);
              // Distance does the work: far stars are smaller and dimmer.
              const fade = 0.18 + p.depth * 0.5;
              const r = (isSelected ? 2.6 : isNeighbour ? 1.7 : 0.8) * p.scale;
              return (
                <g
                  key={index}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={describe(index)}
                  className={cn(
                    "pointer-events-none",
                    isSelected || isNeighbour ? "text-accent" : "text-fg",
                  )}
                  opacity={isSelected || isNeighbour ? 1 : fade}
                >
                  <circle cx={p.x} cy={p.y} r={r * 4} fill={`url(#${glowId})`} />
                  <circle cx={p.x} cy={p.y} r={r} fill="currentColor" />
                </g>
              );
            })}
          </g>

          {showRing && screen[active] && (
            <circle
              cx={screen[active]!.x}
              cy={screen[active]!.y}
              r={11}
              fill="none"
              className="stroke-accent"
              strokeWidth={0.9}
              strokeDasharray="3 2.4"
            />
          )}

          {/* Only the selection and its neighbours are named, as in 2-D — and
              decluttered by the same routine, because turning the cloud slides
              words over one another constantly. Without it "computer" and
              "hardware" printed on top of each other as "computerware". The
              coordinates are shifted into a 0-based frame for the call and back
              again, since `placeLabels` measures from a corner and this viewBox
              is centred on the origin. */}
          <g className="pointer-events-none">
            {labels.map((label) => {
              const anchor = screen[label.index];
              if (!anchor) return null;
              const isSelected = label.index === selected;
              const x = label.x - VIEW / 2;
              const y = label.y - VIEW / 2;
              const drifted = Math.hypot(x - anchor.x, y - anchor.y) > label.size * 1.7;
              return (
                <g key={label.index}>
                  {drifted && (
                    <line
                      x1={anchor.x}
                      y1={anchor.y}
                      x2={x}
                      y2={y + label.size * 0.3}
                      className="stroke-fg"
                      strokeWidth={0.25}
                      opacity={0.3}
                    />
                  )}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className={cn("font-mono", isSelected ? "fill-fg" : "fill-fg-muted")}
                    style={{
                      fontSize: label.size,
                      paintOrder: "stroke",
                      stroke: "rgb(var(--ink-950))",
                      strokeWidth: label.size * 0.26,
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

      <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-center text-caption text-fg-faint">
        {copy.hint}
      </p>
    </div>
  );
}
