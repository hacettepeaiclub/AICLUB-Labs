import { describe, expect, it } from "vitest";
import { generateDataset } from "./datasets";
import {
  bestOneLine,
  clip,
  foot,
  fromTip,
  oneLineAccuracy,
  side,
  through,
  tip,
  twoLineAccuracy,
} from "./lines";

describe("a line you can hold", () => {
  it("puts its foot on the line, nearest the origin", () => {
    const l = { w1: 1.2, w2: -0.6, b: 0.5 };
    const f = foot(l);
    expect(side(l, f)).toBeCloseTo(0, 12);
    // The foot is parallel to the normal.
    expect(f.x * l.w2 - f.y * l.w1).toBeCloseTo(0, 12);
  });

  it("moves through a point without turning", () => {
    const l = through({ w1: 0.7, w2: 1.1, b: 0 }, { x: 0.3, y: -0.4 });
    expect(side(l, { x: 0.3, y: -0.4 })).toBeCloseTo(0, 12);
    expect([l.w1, l.w2]).toEqual([0.7, 1.1]);
  });

  it("reads back the weights its arrow was drawn from, and keeps its foot", () => {
    const l = { w1: -1.4, w2: 0.9, b: 0.3 };
    const again = fromTip(l, tip(l));
    expect(again.w1).toBeCloseTo(l.w1, 12);
    expect(again.w2).toBeCloseTo(l.w2, 12);
    expect(again.b).toBeCloseTo(l.b, 12);
    const turned = fromTip(l, { x: foot(l).x + 0.2, y: foot(l).y + 0.1 });
    expect(side(turned, foot(l))).toBeCloseTo(0, 12);
  });

  it("clips to the input square", () => {
    const seg = clip({ w1: 1, w2: 0, b: -0.5 });
    expect(seg?.every((p) => Math.abs(p.x - 0.5) < 1e-12)).toBe(true);
    expect(clip({ w1: 1, w2: 1, b: 5 })).toBeNull();
  });
});

describe("XOR by hand", () => {
  const points = generateDataset("xor", 160, 0.06, 3);

  it("cannot be solved with one line: no line gets more than about three quarters", () => {
    const best = bestOneLine(points);
    expect(best).toBeGreaterThan(0.6);
    expect(best).toBeLessThan(0.8);
  });

  it("does far better with two: the band between two parallel lines holds most of both diagonal corners", () => {
    const a = { w1: -1, w2: 1, b: 0.5 }; // y − x > −0.5
    const b = { w1: 1, w2: -1, b: 0.5 }; // x − y > −0.5
    expect(twoLineAccuracy(points, a, b)).toBeGreaterThanOrEqual(0.85);
    expect(twoLineAccuracy(points, a, b)).toBeGreaterThan(bestOneLine(points) + 0.1);
    // Either line alone is no better than one line ever is.
    expect(oneLineAccuracy(points, a)).toBeLessThan(0.8);
  });
});
