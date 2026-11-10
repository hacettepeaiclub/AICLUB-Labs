import { describe, expect, it } from "vitest";
import { accuracy, dataset, predict, type Point } from "./engine";

describe("neighbour voting and independent evaluation", () => {
  const training: Point[] = [
    { x: 0, y: 0, label: 1 },
    { x: 0.5, y: 0, label: 0 },
    { x: 0, y: 0.6, label: 0 },
  ];
  it("changes a prediction when the nearest example is outvoted", () => {
    expect(predict(training, 0.1, 0.1, 1)).toBe(1);
    expect(predict(training, 0.1, 0.1, 3)).toBe(0);
    expect(training.map((p) => p.label)).toEqual([1, 0, 0]);
  });
  it("distinguishes perfect self-classification from new examples", () => {
    expect(accuracy(training, training, 1)).toBe(1);
    expect(accuracy(training, [{ x: 0.1, y: 0.1, label: 0 }], 1)).toBe(0);
    expect(accuracy(training, [{ x: 0.1, y: 0.1, label: 0 }], 3)).toBe(1);
  });
  it("preserves existing examples when the sample grows", () => {
    expect(dataset(71, 64, 0.15).slice(0, 32)).toEqual(dataset(71, 32, 0.15));
    expect(dataset(10071, 32, 0.15)).not.toEqual(dataset(71, 32, 0.15));
  });
  it("noise changes labels without moving their positions", () => {
    const clean = dataset(71, 32, 0);
    const flipped = dataset(71, 32, 1);
    clean.forEach((p, i) => {
      expect(flipped[i]).toEqual({ ...p, label: 1 - p.label });
      expect(p.label).toBe(p.x * p.x + p.y * p.y < 0.48 ? 1 : 0);
    });
  });
  it("rejects empty evaluations instead of reporting a misleading score", () => {
    expect(() => accuracy(training, [], 1)).toThrow();
    expect(() => predict([], 0, 0, 1)).toThrow();
  });
});
