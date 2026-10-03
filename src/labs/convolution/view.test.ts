import { describe, expect, it } from "vitest";
import { factor, formatLoss, formatValue, parseWeight } from "./view";

describe("parseWeight", () => {
  it("reads what a person types", () => {
    expect(parseWeight("1")).toBe(1);
    expect(parseWeight("-2")).toBe(-2);
    expect(parseWeight("−1")).toBe(-1);
    expect(parseWeight("0,5")).toBe(0.5);
    expect(parseWeight(".25")).toBe(0.25);
    expect(parseWeight("1/9")).toBeCloseTo(1 / 9, 15);
    expect(parseWeight(" -1 / 16 ")).toBe(-1 / 16);
    expect(Object.is(parseWeight("-0"), 0)).toBe(true);
  });

  it("refuses everything else", () => {
    for (const bad of ["", "-", "abc", "1/0", "1e3", "100", "1..2", "Infinity", "NaN"]) {
      expect({ bad, value: parseWeight(bad) }).toEqual({ bad, value: null });
    }
  });
});

describe("formatting", () => {
  it("writes cells with a real minus and no −0", () => {
    expect(formatValue(-3)).toBe("−3");
    expect(formatValue(0.5)).toBe("0.5");
    expect(formatValue(1 / 9)).toBe("0.11");
    expect(formatValue(-0.001)).toBe("0");
    expect(formatValue(2.999)).toBe("3");
    expect(factor(-1)).toBe("(−1)");
  });

  it("writes small losses in powers of ten", () => {
    expect(formatLoss(0)).toBe("0");
    expect(formatLoss(0.0042)).toBe("0.0042");
    expect(formatLoss(3.14e-8)).toBe("3.1 × 10⁻⁸");
    expect(formatLoss(12.345)).toBe("12.35");
  });
});
