import { useEffect, useRef, type RefObject } from "react";

export interface CanvasDrawArgs {
  ctx: CanvasRenderingContext2D;
  /** CSS-pixel width/height (already DPR-corrected — draw in CSS pixels). */
  width: number;
  height: number;
  dtSec: number;
  elapsedSec: number;
}

/**
 * Managed 2D canvas: device-pixel-ratio scaling, resize observation, and — only
 * when something is actually moving — a render loop. The draw callback works in
 * CSS pixels.
 *
 * ## Running versus still
 *
 * `running` is not a hint, it is the difference between a frame loop and no
 * frame loop. A still canvas gets its context and its `ResizeObserver` as
 * usual, is painted once, and is repainted whenever `repaintKey` changes or the
 * element is resized — and schedules nothing in between.
 *
 * That distinction used to be advisory: the loop always spun and the *draw*
 * was skipped, which cost about a thousand animation-frame callbacks a second
 * on a page nobody was touching. Pair this with `useRepaintFlag`, whose
 * `version` is the `repaintKey` to pass.
 *
 * Usage:
 *   const { dirtyRef, markDirty, version } = useRepaintFlag();
 *   const canvasRef = useCanvas2D(draw, isAnimating, version);
 */
export function useCanvas2D(
  draw: (args: CanvasDrawArgs) => void,
  running = true,
  repaintKey = 0,
): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paintOnce = () => {
      drawRef.current({ ctx, width, height, dtSec: 0, elapsedSec: 0 });
    };

    // Setting a canvas's width clears its bitmap, so a still canvas has to be
    // repainted after every resize or it simply goes blank.
    const observer = new ResizeObserver(() => {
      measure();
      if (!running) paintOnce();
    });
    observer.observe(canvas);
    measure();

    if (!running) {
      paintOnce();
      return () => observer.disconnect();
    }

    let frameId = 0;
    let last = performance.now();
    const start = last;

    const tick = (now: number) => {
      const dtSec = Math.min((now - last) / 1000, 0.1);
      last = now;
      drawRef.current({ ctx, width, height, dtSec, elapsedSec: (now - start) / 1000 });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [running, repaintKey]);

  return canvasRef;
}
