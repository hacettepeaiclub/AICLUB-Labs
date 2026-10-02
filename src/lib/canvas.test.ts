import { describe, expect, it } from "vitest";
import { clearCanvas } from "./canvas";

/**
 * A context that records what was cleared, in device pixels, under whatever
 * transform was current at the time — which is the whole question.
 */
function fakeContext(cssWidth: number, cssHeight: number, dpr: number) {
  const calls: string[] = [];
  let scale = dpr;
  const stack: number[] = [];
  const canvas = { width: Math.round(cssWidth * dpr), height: Math.round(cssHeight * dpr) };
  const ctx = {
    canvas,
    save: () => stack.push(scale),
    restore: () => {
      scale = stack.pop() ?? scale;
    },
    setTransform: (a: number) => {
      scale = a;
    },
    clearRect: (x: number, y: number, w: number, h: number) => {
      calls.push(`${x * scale},${y * scale},${w * scale},${h * scale}`);
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, canvas, calls, scale: () => scale };
}

describe("clearCanvas", () => {
  it("clears every device pixel at a fractional density", () => {
    // The case that drew a line beside the home page's mark: at 125% a 442px
    // box gets a 553-pixel bitmap, and a clear in CSS pixels stops at 552.5.
    const { ctx, canvas, calls } = fakeContext(442, 368, 1.25);
    expect(canvas.width).toBe(553);
    clearCanvas(ctx);
    expect(calls).toEqual([`0,0,${canvas.width},${canvas.height}`]);
  });

  it("puts the drawing transform back, so the caller keeps drawing in CSS pixels", () => {
    const { ctx, scale } = fakeContext(442, 368, 1.25);
    clearCanvas(ctx);
    expect(scale()).toBe(1.25);
  });
});
