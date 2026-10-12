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

  /** The context and the size it was last set up for; null until measured. */
  const surface = useRef<{ ctx: CanvasRenderingContext2D; width: number; height: number } | null>(
    null,
  );
  const runningRef = useRef(running);
  runningRef.current = running;

  const paintOnce = () => {
    const s = surface.current;
    if (s)
      drawRef.current({ ctx: s.ctx, width: s.width, height: s.height, dtSec: 0, elapsedSec: 0 });
  };

  // Size, once per element, from the ResizeObserver alone.
  //
  // This used to measure with getBoundingClientRect() inside the paint
  // effect, which ran again on every repaint: each read came straight after
  // the previous canvas's width had been written, so a page of canvases made
  // the browser lay out the whole page once per canvas (29 ms on the
  // multilayer-perceptrons page, flagged by Lighthouse as a forced reflow),
  // and every slider move cleared and resized a canvas whose size had not
  // changed. The observer reports after layout, at no extra cost, and the
  // bitmap is resized only when the size really changes, since resizing
  // clears it.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      // The border box, which is what getBoundingClientRect() reported.
      const box = entry.borderBoxSize?.[0];
      const width = box ? box.inlineSize : entry.contentRect.width;
      const height = box ? box.blockSize : entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      surface.current = { ctx, width, height };
      // Setting a canvas's width clears its bitmap, so a still canvas has to
      // be repainted after every resize or it simply goes blank. A running
      // one paints on its next frame anyway.
      if (!runningRef.current) paintOnce();
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      surface.current = null;
    };
  }, []);

  // Paint: once when still, every frame when running. Until the observer has
  // measured, there is nothing to paint into; its first report paints.
  useEffect(() => {
    if (!running) {
      paintOnce();
      return;
    }

    let frameId = 0;
    let last = performance.now();
    const start = last;

    const tick = (now: number) => {
      const dtSec = Math.min((now - last) / 1000, 0.1);
      last = now;
      const s = surface.current;
      if (s)
        drawRef.current({
          ctx: s.ctx,
          width: s.width,
          height: s.height,
          dtSec,
          elapsedSec: (now - start) / 1000,
        });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [running, repaintKey]);

  return canvasRef;
}
