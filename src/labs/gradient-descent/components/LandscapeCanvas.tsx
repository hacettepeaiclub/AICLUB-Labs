import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { useDrag, usePaletteVersion } from "@/hooks";
import { cn } from "@/lib/cn";
import { clamp } from "@/lib/math";
import type { Landscape, Point } from "../engine";
import {
  computeView,
  drawLandscape,
  drawObjectiveChart,
  fromScreen,
  toScreenX,
  toScreenY,
  type Scene,
} from "../paint";

/**
 * Something on the map the visitor can take hold of and drag — the tip of
 * the step arrow, say. It sits over the canvas as a real element, so it can
 * be focused, named and moved from the keyboard.
 */
export interface CanvasHandle {
  id: string;
  /** Where it is, in landscape coordinates. Drawn at the map's edge if beyond it. */
  at: Point;
  label: string;
  valueText?: string;
  /** The pointer, in landscape coordinates, while the handle is held. */
  onDrag: (point: Point) => void;
  onDragEnd?: () => void;
  /** Arrow keys and the like. Return true if the key was used. */
  onKey?: (key: string) => boolean;
}

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
  /** The pointer was let go after moving the point (or Enter was pressed). */
  onRelease?: () => void;
  handles?: readonly CanvasHandle[];
  /**
   * Overrides the square aspect. Section 4 stacks two of these on a phone, and
   * at full square height the transport ended up below the fold — so that
   * section asks for a shorter map rather than the chassis growing a prop
   * about it.
   */
  sizeClass?: string;
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
  step,
  label,
  describedBy,
  onMovePoint,
  homePoint,
  onRelease,
  handles,
  // Square, but not as square as the column happens to be: at the full width
  // of a wide stage this drew a 734px landscape and pushed the descent path —
  // the thing the lab is about — below the fold.
  sizeClass = "mx-auto aspect-square w-full max-w-[30rem]",
  className,
}: LandscapeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  // The handles are laid out in CSS pixels, so a resize has to re-render.
  const [box, setBox] = useState({ width: 0, height: 0 });

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
    step,
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
      setBox((b) =>
        b.width === rect.width && b.height === rect.height
          ? b
          : { width: rect.width, height: rect.height },
      );
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
  useEffect(draw, [
    draw,
    palette,
    landscape,
    extent,
    pathLength,
    current,
    descentArrow,
    path,
    step,
  ]);

  // ------------------------------------------------------------ pointer ----

  const toPoint = useCallback(
    (x: number, y: number): Point => {
      const view = computeView(sizeRef.current.width, sizeRef.current.height, extent);
      const p = fromScreen(view, x, y);
      return { x: clamp(p.x, -extent, extent), y: clamp(p.y, -extent, extent) };
    },
    [extent],
  );

  // A tap puts the point there; a drag carries it; letting go is `onRelease`.
  const drag = useDrag({
    onStart: (p) => {
      if (!onMovePoint) return false;
      onMovePoint(toPoint(p.x, p.y));
    },
    onMove: (p) => onMovePoint?.(toPoint(p.x, p.y)),
    onEnd: () => onRelease?.(),
  });

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
      case "Enter":
        event.preventDefault();
        onRelease?.();
        return;
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
      <div className={cn("relative", sizeClass)}>
        <canvas
          ref={canvasRef}
          aria-hidden
          {...(interactive ? drag : {})}
          className="block h-full w-full touch-none"
        />
        {handles?.map((handle) => (
          <Handle key={handle.id} handle={handle} box={box} extent={extent} canvasRef={canvasRef} />
        ))}
      </div>
    </div>
  );
}

/** Room kept between a handle and the map's edge, in CSS pixels. */
const HANDLE_INSET = 12;

function Handle({
  handle,
  box,
  extent,
  canvasRef,
}: {
  handle: CanvasHandle;
  box: { width: number; height: number };
  extent: number;
  canvasRef: RefObject<HTMLCanvasElement>;
}) {
  const view = computeView(box.width, box.height, extent);
  const x = clamp(toScreenX(view, handle.at.x), HANDLE_INSET, box.width - HANDLE_INSET);
  const y = clamp(toScreenY(view, handle.at.y), HANDLE_INSET, box.height - HANDLE_INSET);
  const drag = useDrag({
    relativeTo: canvasRef,
    onMove: (p) => handle.onDrag(fromScreen(computeView(box.width, box.height, extent), p.x, p.y)),
    onEnd: () => handle.onDragEnd?.(),
  });
  if (!box.width) return null;
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={handle.label}
      aria-valuetext={handle.valueText}
      onKeyDown={(event) => {
        if (handle.onKey?.(event.key)) event.preventDefault();
      }}
      {...drag}
      className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing"
      style={{ left: x, top: y }}
    >
      <span className="block size-4 rounded-full border-2 border-ink-950 bg-signal-cyan shadow" />
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
