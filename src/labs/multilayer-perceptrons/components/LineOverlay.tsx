import { useRef, type KeyboardEvent, type RefObject } from "react";
import { useDrag } from "@/hooks";
import { cn } from "@/lib/cn";
import { clip, foot, fromTip, through, tip, type Line, type Xy } from "../lines";

export interface LineOverlayProps {
  lines: readonly Line[];
  onChange: (index: number, line: Line) => void;
  /** Which line a drag on empty ground moves. */
  active: number;
  onActivate?: (index: number) => void;
  /** Accessible names for each line's two handles. */
  labels: { slide: (i: number) => string; turn: (i: number) => string };
  className?: string;
}

/** Below this the handles stop being drawn: the line's foot is off the square. */
const VISIBLE = 0.97;

/**
 * A neuron's boundary, held in the hand.
 *
 * Laid over a picture of the input square, it draws each line where its
 * neuron changes its mind, with the weight vector as an arrow standing on
 * it. Three ways to move it, each one number of the neuron made physical:
 *
 * - drag anywhere on the square: the line jumps to pass through the finger,
 *   turning nothing — that is the bias;
 * - drag the dot on the line: the same, from the line itself;
 * - drag the arrow's tip: turn the line about its foot, or pull the tip out
 *   to make the edge sharper — those are the two weights.
 *
 * Coordinates are the model's: the square [−1, 1]² with y up.
 */
export function LineOverlay({ lines, onChange, active, onActivate, labels, className }: LineOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const toModel = (fx: number, fy: number): Xy => ({ x: fx * 2 - 1, y: 1 - fy * 2 });

  const ground = useDrag({
    onStart: (p) => {
      const line = lines[active];
      if (line) onChange(active, through(line, toModel(p.fx, p.fy)));
    },
    onMove: (p) => {
      const line = lines[active];
      if (line) onChange(active, through(line, toModel(p.fx, p.fy)));
    },
  });

  return (
    <svg
      ref={svgRef}
      viewBox="-1 -1 2 2"
      aria-hidden={false}
      role="group"
      className={cn("absolute inset-0 h-full w-full touch-none", className)}
      {...ground}
    >
      {/* y up, as the model has it */}
      <g transform="scale(1,-1)">
        {lines.map((line, i) => (
          <LineGlyph
            key={i}
            index={i}
            line={line}
            selected={i === active}
            onChange={(next) => onChange(i, next)}
            onActivate={() => onActivate?.(i)}
            svgRef={svgRef}
            labels={labels}
          />
        ))}
      </g>
    </svg>
  );
}

function LineGlyph({
  index,
  line,
  selected,
  onChange,
  onActivate,
  svgRef,
  labels,
}: {
  index: number;
  line: Line;
  selected: boolean;
  onChange: (line: Line) => void;
  onActivate: () => void;
  svgRef: RefObject<SVGSVGElement>;
  labels: LineOverlayProps["labels"];
}) {
  const seg = clip(line);
  const f = foot(line);
  const t = tip(line);
  const visible = Math.abs(f.x) < VISIBLE && Math.abs(f.y) < VISIBLE;
  const toModel = (fx: number, fy: number): Xy => ({ x: fx * 2 - 1, y: 1 - fy * 2 });

  const slide = useDrag({
    relativeTo: svgRef,
    onStart: (_p, event) => {
      event.stopPropagation();
      onActivate();
    },
    onMove: (p) => onChange(through(line, toModel(p.fx, p.fy))),
  });
  const turn = useDrag({
    relativeTo: svgRef,
    onStart: (_p, event) => {
      event.stopPropagation();
      onActivate();
    },
    onMove: (p) => onChange(fromTip(line, toModel(p.fx, p.fy))),
  });

  const nudgeSlide = (event: KeyboardEvent<SVGGElement>) => {
    const n = Math.hypot(line.w1, line.w2) || 1;
    const d = event.key === "ArrowUp" || event.key === "ArrowRight" ? 0.05 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -0.05 : 0;
    if (!d) return;
    event.preventDefault();
    // Along the normal, by d in the square's units.
    onChange(through(line, { x: f.x + (d * line.w1) / n, y: f.y + (d * line.w2) / n }));
  };
  const nudgeTurn = (event: KeyboardEvent<SVGGElement>) => {
    const a = event.key === "ArrowLeft" ? 0.08 : event.key === "ArrowRight" ? -0.08 : 0;
    const s = event.key === "ArrowUp" ? 1.1 : event.key === "ArrowDown" ? 1 / 1.1 : 1;
    if (!a && s === 1) return;
    event.preventDefault();
    const dx = t.x - f.x;
    const dy = t.y - f.y;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    onChange(fromTip(line, { x: f.x + s * (c * dx - sn * dy), y: f.y + s * (sn * dx + c * dy) }));
  };

  return (
    <g>
      {seg && (
        <line
          x1={seg[0].x}
          y1={seg[0].y}
          x2={seg[1].x}
          y2={seg[1].y}
          className={selected ? "stroke-fg" : "stroke-fg-muted"}
          strokeWidth={selected ? 2.5 : 1.75}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {visible && (
        <>
          <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} className="stroke-data" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          {/* the turn handle: the arrow's tip */}
          <g
            role="slider"
            tabIndex={0}
            aria-label={labels.turn(index + 1)}
            aria-valuetext={`w₁ ${line.w1.toFixed(1)}, w₂ ${line.w2.toFixed(1)}`}
            onKeyDown={nudgeTurn}
            {...turn}
            className="cursor-grab outline-none [&:focus-visible>circle:last-child]:stroke-accent"
          >
            <circle cx={t.x} cy={t.y} r={0.11} className="fill-transparent" />
            <circle cx={t.x} cy={t.y} r={0.045} className="fill-data stroke-ink-950" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          </g>
          {/* the slide handle: the line's foot */}
          <g
            role="slider"
            tabIndex={0}
            aria-label={labels.slide(index + 1)}
            aria-valuetext={`b ${line.b.toFixed(1)}`}
            onKeyDown={nudgeSlide}
            {...slide}
            className="cursor-move outline-none [&:focus-visible>circle:last-child]:stroke-accent"
          >
            <circle cx={f.x} cy={f.y} r={0.11} className="fill-transparent" />
            <circle cx={f.x} cy={f.y} r={0.04} className="fill-ink-950 stroke-fg" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          </g>
        </>
      )}
    </g>
  );
}
