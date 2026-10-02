/**
 * Clear the whole of a canvas's bitmap, whatever transform is in effect.
 *
 * ## Why `clearRect(0, 0, width, height)` is not enough
 *
 * Every canvas in this product draws in CSS pixels on a backing store sized
 * for the screen: `canvas.width = Math.round(cssWidth * dpr)` and a
 * `setTransform(dpr, …)` so the drawing code never thinks about density. Then
 * it clears with `clearRect(0, 0, cssWidth, cssHeight)` — in CSS pixels,
 * through that same transform.
 *
 * On a fractional density those two disagree by up to half a pixel. At 125%
 * scaling, which is the default on a great many Windows laptops, a 442px box
 * gets a 553-pixel bitmap (`round(552.5)`) and a clear that reaches 552.5. The
 * last column of pixels is never cleared, and the last row can miss in the
 * same way.
 *
 * Usually nothing is drawn there and it does not matter. The home page's mark
 * is the case where it did: its points assemble from a scatter that starts
 * just outside the box, so every point arriving from the right crosses that
 * column once — and the dark theme draws them with additive blending, so each
 * crossing brightened what the last one had left. The result was a bright
 * dotted line standing beside the logo, about the logo's height, that never
 * went away.
 *
 * Clearing in device pixels, with the transform set aside for the call, covers
 * the bitmap exactly at every density.
 */
export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}
