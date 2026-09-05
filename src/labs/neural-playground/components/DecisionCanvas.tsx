import { useCallback, useEffect, useRef, type MutableRefObject, type PointerEvent } from "react";
import { useCanvas2D, useRepaintFlag } from "@/hooks";
import { cn } from "@/lib/cn";
import type { Point } from "../datasets";
import { forward, type Mlp } from "../engine";
import { createScalarFieldPainter, drawAxes, drawPoints, toModelX, toModelY } from "../paint";

export interface DecisionCanvasProps {
  netRef: MutableRefObject<Mlp>;
  points: readonly Point[];
  /** While false the canvas holds its last frame instead of burning frames. */
  running: boolean;
  /** Bump to force a repaint after something changed off-screen. */
  revision?: number;
  /** Painting a new point; receives model coordinates in [-1, 1]. */
  onPaint?: (x: number, y: number) => void;
  ariaLabel: string;
  className?: string;
}

/** Ignore drag samples closer together than this (model units). */
const PAINT_SPACING = 0.05;

/**
 * The picture at the centre of the lab: the network's output across the whole
 * input square, with the data drawn on top. Everything is painted imperatively
 * from `netRef` — React never re-renders on a training frame.
 */
export function DecisionCanvas({
  netRef,
  points,
  running,
  revision = 0,
  onPaint,
  ariaLabel,
  className,
}: DecisionCanvasProps) {
  const painterRef = useRef<ReturnType<typeof createScalarFieldPainter> | null>(null);
  const pointsRef = useRef(points);
  pointsRef.current = points;
  // Paused canvases still need one repaint when the data or the net changes.
  const { markDirty, version } = useRepaintFlag();
  const paintingRef = useRef(false);
  const lastPaintRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(markDirty, [points, revision, running, markDirty]);

  const canvasRef = useCanvas2D(
    useCallback(
      ({ ctx, width, height }) => {
        painterRef.current ??= createScalarFieldPainter();

        const net = netRef.current;
        painterRef.current.draw(ctx, width, height, (x, y) => forward(net, x, y));
        drawAxes(ctx, width, height);
        drawPoints(ctx, pointsRef.current, net, width, height);
      },
      [netRef],
    ),
    running,
    version,
  );

  const paintAt = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onPaint) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = toModelX(event.clientX - rect.left, rect.width);
    const y = toModelY(event.clientY - rect.top, rect.height);
    const last = lastPaintRef.current;
    if (last && Math.hypot(x - last.x, y - last.y) < PAINT_SPACING) return;
    lastPaintRef.current = { x, y };
    onPaint(x, y);
  };

  const handleDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onPaint) return;
    paintingRef.current = true;
    lastPaintRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    paintAt(event);
  };

  const handleMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!paintingRef.current) return;
    paintAt(event);
  };

  const handleUp = () => {
    paintingRef.current = false;
    lastPaintRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      className={cn(
        "aspect-square w-full rounded-card bg-ink-800",
        onPaint && "cursor-crosshair touch-none",
        className,
      )}
    />
  );
}
