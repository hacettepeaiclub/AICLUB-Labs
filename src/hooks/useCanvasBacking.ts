import { useEffect, useRef, type RefObject } from "react";

/** A canvas's 2D context and the CSS-pixel size it is set up for. */
export interface CanvasBacking {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

/**
 * Size `ctx.canvas`'s bitmap for a box of `width` × `height` CSS pixels at
 * device pixel ratio `dpr` (capped at 2), and set the transform that lets
 * drawing work in CSS pixels. The bitmap is only resized — which clears it —
 * when its device-pixel size changes. Returns whether it was resized.
 */
export function fitCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number,
): boolean {
  const canvas = ctx.canvas;
  const scale = Math.min(dpr || 1, 2);
  const pixelWidth = Math.round(width * scale);
  const pixelHeight = Math.round(height * scale);
  const resized = canvas.width !== pixelWidth || canvas.height !== pixelHeight;
  if (resized) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  return resized;
}

/**
 * Keep a canvas's bitmap matched to its size on screen, for canvases that
 * paint on demand rather than through `useCanvas2D`'s loop.
 *
 * ## What it does
 *
 * Gets the 2D context once, then sizes the bitmap from a `ResizeObserver`:
 * `round(css size × dpr)` device pixels, with the device pixel ratio capped
 * at 2, and a transform so drawing code works in CSS pixels. After each
 * resize it calls `onResize` with the new backing, which is where a still
 * canvas repaints, since setting a canvas's size clears it.
 *
 * ## Why this way
 *
 * Three labs (sorting, graph-search, gradient-descent) each did this by hand,
 * with `getBoundingClientRect()` inside the resize handler and once more as
 * the effect ran. That read comes straight after layout has been dirtied, so
 * it can force the browser to lay the page out synchronously; the observer
 * reports a size after layout at no extra cost. The bitmap is only resized
 * when its device-pixel size really changes, and a report of the same CSS size
 * at the same ratio is skipped altogether, so nothing is cleared and redrawn
 * for nothing. A change in the fractional CSS size or the ratio still
 * repaints, even when the rounded bitmap stays the same, because the drawing's
 * coordinates moved.
 *
 * A change of device pixel ratio alone (moving the window to another screen,
 * zooming) does not resize the element, so that is watched separately.
 *
 * Returns a ref to the current backing, null until the first measurement.
 */
export function useCanvasBacking(
  canvasRef: RefObject<HTMLCanvasElement>,
  onResize: (backing: CanvasBacking) => void,
): RefObject<CanvasBacking | null> {
  const backing = useRef<CanvasBacking | null>(null);
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let size: { width: number; height: number } | null = null;
    /** What the last repaint was for; a report of the same again is skipped. */
    let last: { width: number; height: number; scale: number } | null = null;
    const apply = () => {
      if (!size) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      if (last && last.width === size.width && last.height === size.height && last.scale === scale)
        return;
      last = { ...size, scale };
      fitCanvas(ctx, size.width, size.height, scale);
      backing.current = { ctx, width: size.width, height: size.height };
      onResizeRef.current(backing.current);
    };

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      // The border box, which is what getBoundingClientRect() reported.
      const box = entry.borderBoxSize?.[0];
      size = {
        width: box ? box.inlineSize : entry.contentRect.width,
        height: box ? box.blockSize : entry.contentRect.height,
      };
      apply();
    });
    observer.observe(canvas);

    // A media query that matches only the current ratio; when it stops
    // matching, re-apply and watch the new one.
    let query: MediaQueryList | null = null;
    const watchRatio = () => {
      query?.removeEventListener("change", onRatio);
      query =
        typeof window.matchMedia === "function"
          ? window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
          : null;
      query?.addEventListener("change", onRatio);
    };
    function onRatio() {
      apply();
      watchRatio();
    }
    watchRatio();

    return () => {
      observer.disconnect();
      query?.removeEventListener("change", onRatio);
      backing.current = null;
    };
  }, [canvasRef]);

  return backing;
}
