import { describe, expect, it } from "vitest";
import { tintStrength } from "./paint";

describe("tintStrength", () => {
  it("matches pow(|v|, 0.65) × 0.62 within one 8-bit step", () => {
    for (let i = 0; i <= 1000; i++) {
      const v = i / 1000;
      const exact = Math.pow(v, 0.65) * 0.62;
      // The tint is mixed into 0–255 channels, so 1/255 of the full range is
      // the finest difference a pixel can show.
      expect(Math.abs(tintStrength(v) - exact)).toBeLessThan(1 / 255);
      expect(tintStrength(-v)).toBe(tintStrength(v));
    }
  });

  it("holds that bound where the curve is steepest, just above zero", () => {
    for (let i = 0; i <= 2000; i++) {
      const v = i / 1e6;
      expect(Math.abs(tintStrength(v) - Math.pow(v, 0.65) * 0.62)).toBeLessThan(1 / 255);
    }
  });

  it("clamps beyond ±1 and keeps zero at zero", () => {
    expect(tintStrength(0)).toBe(0);
    expect(tintStrength(5)).toBeCloseTo(0.62, 6);
    expect(tintStrength(-5)).toBeCloseTo(0.62, 6);
  });
});
