import { describe, expect, it } from "vitest";
import { fitCanvas } from "./useCanvasBacking";

/** A context whose canvas counts how often its bitmap is resized. */
function fakeContext(width = 300, height = 150) {
  let resizes = 0;
  const box = { width, height };
  const canvas = {
    get width() {
      return box.width;
    },
    set width(value: number) {
      resizes++;
      box.width = value;
    },
    get height() {
      return box.height;
    },
    set height(value: number) {
      resizes++;
      box.height = value;
    },
  };
  const transforms: number[][] = [];
  const ctx = {
    canvas,
    setTransform: (...m: number[]) => transforms.push(m),
  } as unknown as CanvasRenderingContext2D;
  return { ctx, canvas, transforms, resizes: () => resizes };
}

describe("fitCanvas", () => {
  it("sizes the bitmap in device pixels, sharp at 1, 1.25 and 2", () => {
    for (const [dpr, expected] of [
      [1, [442, 300]],
      [1.25, [553, 375]], // round(552.5): the case src/lib/canvas.ts describes
      [2, [884, 600]],
    ] as const) {
      const { ctx, canvas, transforms } = fakeContext();
      fitCanvas(ctx, 442, 300, dpr);
      expect([canvas.width, canvas.height]).toEqual(expected);
      expect(transforms.at(-1)).toEqual([dpr, 0, 0, dpr, 0, 0]);
    }
  });

  it("caps the ratio at 2 and treats a missing one as 1", () => {
    const high = fakeContext();
    fitCanvas(high.ctx, 100, 50, 3);
    expect([high.canvas.width, high.canvas.height]).toEqual([200, 100]);
    const none = fakeContext();
    fitCanvas(none.ctx, 100, 50, 0);
    expect([none.canvas.width, none.canvas.height]).toEqual([100, 50]);
  });

  it("leaves the bitmap alone when its size has not changed, since resizing clears it", () => {
    const { ctx, resizes, transforms } = fakeContext();
    expect(fitCanvas(ctx, 442, 300, 2)).toBe(true);
    const after = resizes();
    expect(fitCanvas(ctx, 442, 300, 2)).toBe(false);
    expect(fitCanvas(ctx, 442.2, 300.1, 2)).toBe(false);
    expect(resizes()).toBe(after);
    // The transform is set every time; it is cheap and the drawing relies on it.
    expect(transforms).toHaveLength(3);
  });

  it("resizes when the ratio alone changes", () => {
    const { ctx, canvas } = fakeContext();
    fitCanvas(ctx, 442, 300, 1);
    expect(fitCanvas(ctx, 442, 300, 2)).toBe(true);
    expect(canvas.width).toBe(884);
  });
});
