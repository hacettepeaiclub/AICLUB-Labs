import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent,
} from "react";
import { usePaletteVersion } from "@/hooks";
import { cn } from "@/lib/cn";
import type { Grid, Search } from "../engine";
import {
  dragTool,
  isCursorKey,
  markerAt,
  moveCursor,
  moveMarker,
  paintCell,
  type Marker,
  type Tool,
} from "../gridEdit";
import { cellAt, drawGrid, layoutFor } from "../paint";

export interface GridCanvasProps {
  gridRef: MutableRefObject<Grid>;
  searchRef: MutableRefObject<Search | null>;
  /** While true the canvas animates the search; while false it never schedules a frame. */
  running: boolean;
  /** Advance the engine. Called once per animation frame, only while running. */
  onFrame: () => void;
  /** Bump to force a repaint after something changed off-canvas. */
  revision: number;
  tool: Tool;
  editable: boolean;
  /** Fired once per gesture, after the grid actually changed. */
  onEdit: () => void;
  cursor: number;
  onCursorChange: (index: number) => void;
  label: string;
  describedBy?: string;
}

/**
 * The grid itself: one canvas, drawn from the engine's arrays.
 *
 * There is no animation loop unless a search is running — an idle grid costs
 * nothing. Painting with a pointer mutates the grid and repaints directly,
 * without touching React state, so dragging across a hundred cells is a
 * hundred `fillRect`s and zero renders.
 */
export function GridCanvas({
  gridRef,
  searchRef,
  running,
  onFrame,
  revision,
  tool,
  editable,
  onEdit,
  cursor,
  onCursorChange,
  label,
  describedBy,
}: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const cursorRef = useRef(cursor);
  cursorRef.current = cursor;
  const lockedRef = useRef(!editable);
  lockedRef.current = !editable;

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { width, height } = sizeRef.current;
    drawGrid(ctx, width, height, gridRef.current, searchRef.current, {
      cursor: cursorRef.current,
      locked: lockedRef.current,
    });
  }, [gridRef, searchRef]);

  // Context, device-pixel sizing and resize handling. No frame loop here.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => {
      observer.disconnect();
      ctxRef.current = null;
    };
  }, [draw]);

  // Repaint on demand when idle — including when the theme changes, which
  // swaps every colour the paint module resolves.
  const paletteVersion = usePaletteVersion();
  useEffect(draw, [draw, revision, cursor, editable, paletteVersion]);

  // The only animation loop in the lab, and it exists only while searching.
  useEffect(() => {
    if (!running) return;
    let frame = requestAnimationFrame(function tick() {
      onFrameRef.current();
      draw();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [running, draw]);

  // ------------------------------------------------------------ pointer ----

  const gesture = useRef<{ tool: Tool; marker: Marker | null; changed: boolean } | null>(null);

  const indexFromEvent = (event: PointerEvent<HTMLCanvasElement>): number => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const grid = gridRef.current;
    const layout = layoutFor(grid, rect.width, rect.height);
    return cellAt(grid, layout, event.clientX - rect.left, event.clientY - rect.top);
  };

  const applyAt = (index: number): void => {
    const active = gesture.current;
    if (!active || index < 0) return;
    const grid = gridRef.current;
    const changed = active.marker
      ? moveMarker(grid, active.marker, index)
      : paintCell(grid, index, active.tool);
    if (changed) {
      active.changed = true;
      draw();
    }
  };

  const handleDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!editable) return;
    const index = indexFromEvent(event);
    if (index < 0) return;
    const grid = gridRef.current;
    const marker = markerAt(grid, index);
    gesture.current = {
      marker,
      tool: marker ? tool : dragTool(grid, index, tool),
      changed: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onCursorChange(index);
    if (!marker) applyAt(index);
  };

  const handleMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!gesture.current) return;
    applyAt(indexFromEvent(event));
  };

  const handleUp = () => {
    const active = gesture.current;
    gesture.current = null;
    if (active?.changed) onEdit();
  };

  // ----------------------------------------------------------- keyboard ----

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const grid = gridRef.current;
    const at = cursor < 0 ? grid.start : cursor;

    if (isCursorKey(event.key)) {
      event.preventDefault();
      const next = moveCursor(grid, at, event.key);
      if (next !== cursor) onCursorChange(next);
      return;
    }

    if (!editable) return;

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (paintCell(grid, at, dragTool(grid, at, tool))) {
        draw();
        onEdit();
      }
      return;
    }

    const marker: Marker | null =
      event.key === "s" || event.key === "S"
        ? "start"
        : event.key === "g" || event.key === "G"
          ? "goal"
          : null;
    if (marker && moveMarker(grid, marker, at)) {
      event.preventDefault();
      draw();
      onEdit();
    }
  };

  return (
    <div
      role="application"
      aria-roledescription="Pathfinding grid"
      aria-label={label}
      aria-describedby={describedBy}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        if (cursor < 0) onCursorChange(gridRef.current.start);
      }}
      className="rounded-card border border-line/10 bg-ink-900 p-1"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className={cn("block w-full touch-none", editable ? "cursor-crosshair" : "cursor-default")}
        style={{ aspectRatio: `${gridRef.current.cols} / ${gridRef.current.rows}` }}
      />
    </div>
  );
}
