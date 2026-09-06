import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { usePaletteVersion } from "@/hooks";
import { cn } from "@/lib/cn";
import { clamp } from "@/lib/math";
import type { Landscape, Point } from "../engine";
import { computeView, drawLandscape, drawObjectiveChart, fromScreen, type Scene } from "../paint";

export interface LandscapeCanvasProps extends Omit<Scene, "landscape" | "extent"> {
  landscape: Landscape;
  extent: number;
  /** Accessible name. The canvas itself is hidden from assistive tech. */
  label: string;
  describedBy?: string;
  /**
   * When given, the visitor can move the current point. The whole plot becomes
   * the grab target — far more than the 44px a fingertip needs — and the same
   * position is reachable from the keyboard with the arrow keys.
   */
  onMovePoint?: (point: Point) => void;
  /** Where Home returns the point to. */
  homePoint?: Point;
  className?: string;
}

/** One arrow-key press, as a fraction of the visible half-width. */
const KEY_STEP = 0.04;

/**
 * The contour map.
 *
 * There is no animation loop here. The frame loop lives in `useDescentRun` and
 * only advances an index; a change of index re-renders this component, which
 * repaints once. When nothing is playing, nothing is scheduled.
 */
export function LandscapeCanvas({
  landscape,
  extent,
  path,
  pathLength,
  start,
  current,
  descentArrow,
  targetArrow,
  diverged,
  label,
  describedBy,
  onMovePoint,
  homePoint,
  className,
}: LandscapeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  const sceneRef = useRef<Scene>({ landscape, extent });
  sceneRef.current = {
    landscape,
    extent,
    path,
    pathLength,
    start,
    current,
    descentArrow,
    targetArrow,
    diverged,
  };

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { width, height } = sizeRef.current;
    drawLandscape(ctx, width, height, sceneRef.current);
  }, []);

  // Context, device-pixel sizing and resize handling. No frame loop.
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

  // Repaint after every render — a new step, a new landscape, a new theme. The
  // whole picture is eight ellipses and a polyline, so this is cheaper than
  // deciding whether it was needed.
  const palette = usePaletteVersion();
  useEffect(draw, [draw, palette, landscape, extent, pathLength, current, descentArrow, path]);

  // ------------------------------------------------------------ pointer ----

  const dragging = useRef(false);

  const moveTo = useCallback(
    (clientX: number, clientY: number, target: HTMLCanvasElement) => {
      if (!onMovePoint) return;
      const rect = target.getBoundingClientRect();
      const view = computeView(rect.width, rect.height, extent);
      const p = fromScreen(view, clientX - rect.left, clientY - rect.top);
      onMovePoint({ x: clamp(p.x, -extent, extent), y: clamp(p.y, -extent, extent) });
    },
    [onMovePoint, extent],
  );

  const handleDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onMovePoint) return;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX, event.clientY, event.currentTarget);
  };

  const handleMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;
    moveTo(event.clientX, event.clientY, event.currentTarget);
  };

  const handleUp = () => {
    dragging.current = false;
  };

  // ----------------------------------------------------------- keyboard ----

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onMovePoint || !current) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const d = extent * KEY_STEP;
    let { x, y } = current;

    switch (event.key) {
      case "ArrowLeft":
        x -= d;
        break;
      case "ArrowRight":
        x += d;
        break;
      case "ArrowUp":
        y += d;
        break;
      case "ArrowDown":
        y -= d;
        break;
      case "Home":
        if (!homePoint) return;
        ({ x, y } = homePoint);
        break;
      default:
        return;
    }
    event.preventDefault();
    onMovePoint({ x: clamp(x, -extent, extent), y: clamp(y, -extent, extent) });
  };

  const interactive = Boolean(onMovePoint);

  return (
    <div
      role={interactive ? "application" : "img"}
      aria-label={label}
      aria-describedby={describedBy}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      className={cn(
        "rounded-card border border-line/10 bg-ink-900 p-2",
        interactive && "cursor-crosshair",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        onPointerDown={interactive ? handleDown : undefined}
        onPointerMove={interactive ? handleMove : undefined}
        onPointerUp={interactive ? handleUp : undefined}
        onPointerCancel={interactive ? handleUp : undefined}
        className="block aspect-square w-full touch-none"
      />
    </div>
  );
}

export interface ObjectiveChartProps {
  /** f at every step, index-aligned with the trajectory. */
  series: Float64Array;
  /** How much of it to draw — the scrubber's position plus one. */
  count: number;
  /** The goal, drawn as a dashed rule. */
  tolerance: number;
  cursor: number;
  label: string;
  className?: string;
}

/**
 * The objective against step number.
 *
 * Same plumbing as the map and the same rule: no loop, one repaint per render.
 * It shares the scrubber's index, so the dot on the curve and the dot on the
 * map are always the same step.
 */
export function ObjectiveChart({
  series,
  count,
  tolerance,
  cursor,
  label,
  className,
}: ObjectiveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  const argsRef = useRef({ series, count, tolerance, cursor });
  argsRef.current = { series, count, tolerance, cursor };

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { width, height } = sizeRef.current;
    const a = argsRef.current;
    drawObjectiveChart(ctx, width, height, a.series, a.count, a.tolerance, a.cursor);
  }, []);

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

  const palette = usePaletteVersion();
  useEffect(draw, [draw, palette, series, count, cursor, tolerance]);

  return (
    <div
      role="img"
      aria-label={label}
      // `flex` plus a full-height canvas lets the chart grow to whatever room
      // the layout gives it, instead of sitting short inside a tall card.
      className={cn("flex rounded-card border border-line/10 bg-ink-900 p-2", className)}
    >
      <canvas ref={canvasRef} aria-hidden className="block h-full min-h-24 w-full" />
    </div>
  );
}
