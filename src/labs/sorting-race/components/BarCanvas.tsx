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
import {
  adjustValue,
  indexAt,
  isCursorKey,
  moveCursor,
  setValue,
  strokeTo,
  valueAt,
  type StrokePoint,
} from "../arrayEdit";
import type { Sort } from "../engine";
import { drawBars } from "../paint";

export interface BarCanvasProps {
  valuesRef: MutableRefObject<Int32Array>;
  /** The sort whose progress this canvas is showing, if any. */
  sortRef: MutableRefObject<Sort | null>;
  /** While true the canvas animates; while false it never schedules a frame. */
  running: boolean;
  /** Advance the engine. Called once per animation frame, only while running. */
  onFrame: () => void;
  /** Bump to force a repaint after something changed off-canvas. */
  revision: number;
  editable: boolean;
  /** Fired once per gesture, after the values actually changed. */
  onEdit: () => void;
  cursor: number;
  onCursorChange: (index: number) => void;
  label: string;
  describedBy?: string;
  className?: string;
}

/**
 * The bar chart: one canvas, drawn from the engine's array.
 *
 * No animation loop exists unless a sort is running. Drawing with a pointer
 * writes straight into the values and repaints, without touching React state,
 * so sweeping across the whole chart is a few dozen `fillRect`s and no renders.
 */
export function BarCanvas({
  valuesRef,
  sortRef,
  running,
  onFrame,
  revision,
  editable,
  onEdit,
  cursor,
  onCursorChange,
  label,
  describedBy,
  className,
}: BarCanvasProps) {
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
    drawBars(ctx, width, height, valuesRef.current, sortRef.current, {
      cursor: cursorRef.current,
      locked: lockedRef.current,
    });
  }, [valuesRef, sortRef]);

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

  // The only animation loop in the lab, and it exists only while sorting.
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

  const drawing = useRef(false);
  const changed = useRef(false);
  const lastPoint = useRef<StrokePoint | null>(null);

  const applyAt = (event: PointerEvent<HTMLCanvasElement>, continuing: boolean) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const values = valuesRef.current;
    const index = indexAt(event.clientX - rect.left, rect.width, values.length);
    if (index < 0) return;
    const value = valueAt(event.clientY - rect.top, rect.height);
    onCursorChange(index);

    // Join this sample to the previous one so a fast sweep leaves no gaps.
    const wrote = continuing
      ? strokeTo(values, lastPoint.current, { index, value })
      : setValue(values, index, value);
    lastPoint.current = { index, value };
    if (wrote) {
      changed.current = true;
      draw();
    }
  };

  const handleDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!editable) return;
    drawing.current = true;
    changed.current = false;
    lastPoint.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    applyAt(event, false);
  };

  const handleMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    applyAt(event, true);
  };

  const handleUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPoint.current = null;
    if (changed.current) onEdit();
  };

  // ----------------------------------------------------------- keyboard ----

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const values = valuesRef.current;
    const at = cursor < 0 ? 0 : cursor;

    if (isCursorKey(event.key)) {
      event.preventDefault();
      const next = moveCursor(values, at, event.key);
      if (next !== cursor) onCursorChange(next);
      return;
    }

    if (!editable) return;

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (adjustValue(values, at, event.key === "ArrowUp" ? 1 : -1)) {
        draw();
        onEdit();
      }
    }
  };

  return (
    <div
      role="application"
      aria-roledescription="Sortable bar chart"
      aria-label={label}
      aria-describedby={describedBy}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        if (cursor < 0) onCursorChange(0);
      }}
      className={cn("rounded-card border border-line/10 bg-ink-900 p-2", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className={cn(
          "block h-40 w-full touch-none sm:h-52",
          editable ? "cursor-crosshair" : "cursor-default",
        )}
      />
    </div>
  );
}
