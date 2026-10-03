import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { extent, type Grid } from "../engine";
import { formatValue } from "../view";

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface GridViewProps {
  grid: Grid;
  /**
   * `image` draws 0…1 as brightness. `signed` draws positive values in the
   * accent and negative ones in rose, both scaled by `scale`; `match` draws
   * only the positive ones, for an output read as "how well does this
   * position match"; `auto` picks `image` when nothing is negative.
   */
  kind?: "image" | "signed" | "match" | "auto";
  /** The magnitude drawn at full strength in signed mode. Defaults to the largest |value|. */
  scale?: number;
  /** Cells shown as numbers. Only sensible on small grids. */
  showValues?: boolean;
  /** Cells left blank, for an output that has not been computed yet. */
  hidden?: (x: number, y: number) => boolean;
  /** A rectangle outlined on top: the window. May reach into `padding`. */
  window?: Box | null;
  /** Further outlined regions, drawn under the window. */
  marks?: readonly (Box & { tone: "amber" | "faint" })[];
  /** One cell outlined in the accent: the output being explained. */
  selected?: { x: number; y: number } | null;
  /** Cells of zero padding drawn as a dashed ring around the grid. */
  padding?: number;
  /** A click (or a drag, with `paint`) on a cell. */
  onCell?: (x: number, y: number) => void;
  /** Keep calling `onCell` while the pointer is dragged. */
  paint?: boolean;
  /** Arrow keys, when the grid has focus. */
  onArrow?: (dx: number, dy: number) => void;
  ariaLabel: string;
  className?: string;
}

const fill = (v: number, kind: "image" | "signed" | "match", scale: number): string => {
  if (kind === "image") {
    const a = Math.min(Math.max(v, 0), 1);
    return `rgb(var(--fg) / ${(0.04 + 0.96 * a).toFixed(3)})`;
  }
  const a = scale > 0 ? Math.min(Math.abs(v) / scale, 1) : 0;
  if (a < 0.002 || (kind === "match" && v <= 0)) return "rgb(var(--fg) / 0.04)";
  return v > 0
    ? `rgb(var(--accent) / ${(0.12 + 0.88 * a).toFixed(3)})`
    : `rgb(var(--signal-rose) / ${(0.12 + 0.88 * a).toFixed(3)})`;
};

/**
 * Every grid on the page — pictures, kernels, outputs — drawn the same way.
 *
 * An SVG of square cells, one unit each, so a 3×3 kernel and a 32×32 picture
 * share every line of code and stay crisp at any size. Nothing is drawn to a
 * canvas: the largest grid here is 1,024 cells, and as SVG each cell keeps
 * the theme's colours through CSS variables, with no repaint on a switch.
 */
export function GridView({
  grid,
  kind = "auto",
  scale,
  showValues,
  hidden,
  window,
  marks,
  selected,
  padding = 0,
  onCell,
  paint,
  onArrow,
  ariaLabel,
  className,
}: GridViewProps) {
  const range = extent(grid);
  const mode = kind === "auto" ? (range.min < -1e-9 ? "signed" : "image") : kind;
  const magnitude = scale ?? Math.max(Math.abs(range.min), Math.abs(range.max));
  const dragging = useRef(false);
  const last = useRef<string | null>(null);

  const cellAt = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const units = grid.width + 2 * padding;
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * units) - padding;
    const y =
      Math.floor(((event.clientY - rect.top) / rect.height) * (grid.height + 2 * padding)) -
      padding;
    return x >= 0 && y >= 0 && x < grid.width && y < grid.height ? { x, y } : null;
  };

  const hit = (event: PointerEvent<SVGSVGElement>) => {
    const cell = cellAt(event);
    if (!cell || !onCell) return;
    const key = `${cell.x},${cell.y}`;
    if (paint && key === last.current) return;
    last.current = key;
    onCell(cell.x, cell.y);
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!onArrow) return;
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const move = step[event.key];
    if (!move) return;
    event.preventDefault();
    onArrow(move[0], move[1]);
  };

  const cells = [];
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const v = grid.data[y * grid.width + x] ?? 0;
      const blank = hidden?.(x, y) ?? false;
      cells.push(
        <rect
          key={`c${x},${y}`}
          x={x + 0.04}
          y={y + 0.04}
          width={0.92}
          height={0.92}
          rx={0.08}
          style={{ fill: blank ? "rgb(var(--fg) / 0.03)" : fill(v, mode, magnitude) }}
        />,
      );
      if (showValues && !blank) {
        const bright = mode === "image" ? v > 0.5 : magnitude > 0 && Math.abs(v) / magnitude > 0.6;
        cells.push(
          <text
            key={`t${x},${y}`}
            x={x + 0.5}
            y={y + 0.5}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize={grid.width > 7 ? 0.36 : 0.32}
            className={cn("font-mono tabular-nums", bright ? "fill-ink-950" : "fill-fg-muted")}
          >
            {formatValue(v)}
          </text>,
        );
      }
    }
  }

  const ring = [];
  if (padding > 0) {
    for (let y = -padding; y < grid.height + padding; y++) {
      for (let x = -padding; x < grid.width + padding; x++) {
        if (x >= 0 && y >= 0 && x < grid.width && y < grid.height) continue;
        ring.push(
          <rect
            key={`p${x},${y}`}
            x={x + 0.08}
            y={y + 0.08}
            width={0.84}
            height={0.84}
            rx={0.08}
            className="fill-none stroke-line/25"
            strokeWidth={0.04}
            strokeDasharray="0.12 0.1"
          />,
        );
      }
    }
  }

  const interactive = !!onCell || !!onArrow;

  return (
    <svg
      viewBox={`${-padding} ${-padding} ${grid.width + 2 * padding} ${grid.height + 2 * padding}`}
      role="img"
      aria-label={ariaLabel}
      tabIndex={onArrow ? 0 : undefined}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        if (!onCell) return;
        dragging.current = true;
        last.current = null;
        if (paint) event.currentTarget.setPointerCapture(event.pointerId);
        hit(event);
      }}
      onPointerMove={(event) => {
        if (paint && dragging.current) hit(event);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className={cn(
        "block h-auto w-full select-none rounded",
        interactive &&
          "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
        paint && "cursor-crosshair touch-none",
        className,
      )}
    >
      {ring}
      {cells}
      {marks?.map((m, i) => (
        <rect
          key={`m${i}`}
          x={m.x + 0.02}
          y={m.y + 0.02}
          width={m.w - 0.04}
          height={m.h - 0.04}
          rx={0.1}
          className={cn(
            "fill-none",
            m.tone === "amber" ? "stroke-signal-amber" : "stroke-fg-faint",
          )}
          strokeWidth={0.07}
          strokeDasharray={m.tone === "faint" ? "0.2 0.12" : undefined}
        />
      ))}
      {window && (
        <rect
          x={window.x - 0.02}
          y={window.y - 0.02}
          width={window.w + 0.04}
          height={window.h + 0.04}
          rx={0.12}
          className="fill-accent/10 stroke-accent"
          strokeWidth={0.1}
        />
      )}
      {selected && (
        <rect
          x={selected.x + 0.02}
          y={selected.y + 0.02}
          width={0.96}
          height={0.96}
          rx={0.1}
          className="fill-none stroke-accent"
          strokeWidth={0.1}
        />
      )}
    </svg>
  );
}
