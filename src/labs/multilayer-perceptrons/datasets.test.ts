import { describe, expect, it } from "vitest";
import { DATASETS, generateDataset, splitDataset, type Point } from "./datasets";

const KINDS = DATASETS.map((d) => d.kind);

const positives = (points: readonly Point[]): number => points.filter((p) => p.label === 1).length;

describe("generateDataset", () => {
  it("is reproducible for a seed and different across seeds", () => {
    for (const kind of KINDS) {
      const a = generateDataset(kind, 60, 0.1, 5);
      const b = generateDataset(kind, 60, 0.1, 5);
      const c = generateDataset(kind, 60, 0.1, 6);
      expect(a).toEqual(b);
      expect(a).not.toEqual(c);
    }
  });

  it("produces finite coordinates and only ±1 labels", () => {
    for (const kind of KINDS) {
      for (const point of generateDataset(kind, 60, 0.3, 11)) {
        expect(Number.isFinite(point.x)).toBe(true);
        expect(Number.isFinite(point.y)).toBe(true);
        expect(Math.abs(point.label)).toBe(1);
      }
    }
  });

  it("keeps both classes roughly balanced — a one-class cloud teaches nothing", () => {
    for (const kind of KINDS) {
      const points = generateDataset(kind, 200, 0.1, 3);
      const share = positives(points) / points.length;
      expect(share).toBeGreaterThan(0.35);
      expect(share).toBeLessThan(0.65);
    }
  });
});

describe("splitDataset", () => {
  it("partitions the data without losing or duplicating a point", () => {
    const points = generateDataset("spiral", 120, 0.1, 7);
    const { train, test } = splitDataset(points, 0.75, 1);
    expect(train.length + test.length).toBe(points.length);
    expect([...train, ...test].sort()).toHaveLength(points.length);
    for (const point of points) {
      const seen = [...train, ...test].filter((p) => p === point);
      expect(seen).toHaveLength(1);
    }
  });

  it("gives the test set both classes, even for generators that emit in order", () => {
    // Regression: a contiguous slice of the spiral handed the test set a
    // single arm, so test accuracy measured nothing.
    for (const kind of KINDS) {
      const { test } = splitDataset(generateDataset(kind, 200, 0.06, 21), 0.75, 13);
      const share = positives(test) / test.length;
      expect(share).toBeGreaterThan(0.2);
      expect(share).toBeLessThan(0.8);
    }
  });

  it("is reproducible for a seed and does not mutate its input", () => {
    const points = generateDataset("circle", 80, 0.1, 2);
    const before = JSON.stringify(points);
    const a = splitDataset(points, 0.75, 4);
    const b = splitDataset(points, 0.75, 4);
    expect(a.train).toEqual(b.train);
    expect(a.test).toEqual(b.test);
    expect(JSON.stringify(points)).toBe(before);
  });
});
