import { describe, expect, it } from "vitest";
import { generateDataset } from "./datasets";
import {
  bestOneLine,
  clip,
  foot,
  fromTip,
  hitArea,
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

describe("bestOneLine", () => {
  /** The direct count it replaced: every grid line against every point. */
  const direct = (points: Parameters<typeof bestOneLine>[0], angles: number, offsets: number) => {
    let best = 0;
    for (let i = 0; i < angles; i++) {
      const t = (i / angles) * Math.PI;
      for (let j = 0; j < offsets; j++) {
        const b = -1.5 + (3 * j) / (offsets - 1);
        best = Math.max(best, oneLineAccuracy(points, { w1: Math.cos(t), w2: Math.sin(t), b }));
      }
    }
    return best;
  };

  it("gives exactly the direct count's answer, on every dataset and seed", () => {
    for (const kind of ["xor", "circle", "gauss", "spiral"] as const) {
      for (const seed of [1, 3, 7, 21]) {
        const points = generateDataset(kind, 120, 0.08, seed);
        expect(bestOneLine(points, 90, 61), `${kind}/${seed}`).toBe(direct(points, 90, 61));
      }
    }
    const xor = generateDataset("xor", 160, 0.06, 3);
    expect(bestOneLine(xor)).toBe(direct(xor, 360, 241));
  });

  it("handles no points, and points exactly on a grid line", () => {
    expect(bestOneLine([])).toBe(0);
    // On the line x = 0 (offset 0 of the vertical direction): not on the positive side.
    const onLine = [
      { x: 0, y: 0.5, label: 1 as const },
      { x: 0.5, y: 0, label: -1 as const },
    ];
    expect(bestOneLine(onLine, 4, 3)).toBe(direct(onLine, 4, 3));
  });
});

describe("a handle's hit area", () => {
  /** The numbers of an SVG path, in order. */
  const numbers = (d: string) => (d.match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/g) ?? []).map(Number);

  it("is the whole circle when the other handle is far enough away", () => {
    const d = hitArea({ x: 0, y: 0 }, { x: 1, y: 0 }, 0.2);
    expect(d).toBe("M-0.2 0a0.2 0.2 0 1 0 0.4 0a0.2 0.2 0 1 0 -0.4 0Z");
  });

  it("is the whole circle when the handles coincide (no side to cut on)", () => {
    const d = hitArea({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.1 }, 0.2);
    expect(d).toMatch(/a.*a.*Z$/);
    const [x, y] = numbers(d);
    expect(x).toBeCloseTo(0.1, 12);
    expect(y).toBeCloseTo(0.1, 12);
  });

  it("is cut along the bisector when the handles are closer than two radii", () => {
    const at = { x: 0, y: 0 };
    const other = { x: 0.2, y: 0 };
    const [ax, ay, , , , large, sweep, bx, by] = numbers(hitArea(at, other, 0.2));
    // The chord's ends lie on the circle and on the bisector x = 0.1.
    expect(ax).toBeCloseTo(0.1, 12);
    expect(bx).toBeCloseTo(0.1, 12);
    expect(Math.hypot(ax!, ay!)).toBeCloseTo(0.2, 12);
    expect(Math.hypot(bx!, by!)).toBeCloseTo(0.2, 12);
    // The long way round, through the side away from the other handle.
    expect([large, sweep]).toEqual([1, 1]);
    expect(ay).toBeGreaterThan(0);
    expect(by).toBeLessThan(0);
  });

  it("splits two close handles' areas exactly at the bisector, whichever way they face", () => {
    const a = { x: 0.1, y: -0.2 };
    const b = { x: 0.25, y: -0.05 };
    const [ax, ay, , , , , , bx, by] = numbers(hitArea(a, b, 0.3));
    const [cx, cy, , , , , , dx, dy] = numbers(hitArea(b, a, 0.3));
    // The same chord, traversed from the other end.
    expect(ax).toBeCloseTo(dx!, 12);
    expect(ay).toBeCloseTo(dy!, 12);
    expect(bx).toBeCloseTo(cx!, 12);
    expect(by).toBeCloseTo(cy!, 12);
  });
});
