import { describe, expect, it } from "vitest";
import {
  MATRICES,
  apply,
  apply3,
  between3,
  components,
  covariance,
  direction,
  direction3,
  eigen,
  eigen3,
  makeCloud,
  mean,
  residuals,
  shadowVariance,
  shadows,
  stretch3,
  turn,
  turn3,
  type Matrix,
  type Matrix3,
} from "./engine";

/** How far apart two lines are, in degrees: 179.5° and 0° are half a degree apart. */
const apart = (a: number, b: number) => {
  const d = Math.abs(a - b) % 180;
  return Math.min(d, 180 - d);
};

/** Every whole and half degree, to check a claim against all directions. */
const SWEEP = Array.from({ length: 360 }, (_, i) => i / 2);

describe("a matrix and a direction", () => {
  it("applies the matrix row by row", () => {
    expect(apply([1, 2, 3, 4], [1, 1])).toEqual([3, 7]);
  });

  it("measures the turn of a line, ignoring which way along it", () => {
    expect(turn([1, 0, 0, 1], [1, 0])).toBeCloseTo(0, 9);
    expect(turn([-2, 0, 0, -2], direction(30))).toBeCloseTo(0, 6);
    expect(turn([0, -1, 1, 0], direction(17))).toBeCloseTo(90, 6);
  });
});

describe("eigenvectors in two dimensions", () => {
  /** The covariance stage's kind of matrix, and the cases a 2×2 can be. */
  const PLANE = {
    symmetric: [1.25, 0.75, 0.75, 1.25],
    shear: [1, 1, 0, 1],
    skew: [2, 1, 0, 1],
    rotate: [0.6, -0.8, 0.8, 0.6],
  } as const satisfies Record<string, Matrix>;

  /** Au = λu, checked by multiplying out. */
  const holds = (m: Matrix) => {
    for (const { value, vector } of eigen(m)) {
      const [x, y] = apply(m, vector);
      expect(x).toBeCloseTo(value * vector[0], 9);
      expect(y).toBeCloseTo(value * vector[1], 9);
    }
  };

  it("stretches the symmetric example by 2 and ½, along the diagonals", () => {
    const [big, small] = eigen(PLANE.symmetric);
    expect(big!.value).toBeCloseTo(2, 12);
    expect(small!.value).toBeCloseTo(0.5, 12);
    expect(big!.angle).toBeCloseTo(45, 9);
    expect(small!.angle).toBeCloseTo(135, 9);
    holds(PLANE.symmetric);
  });

  it("finds exactly the directions a sweep finds unturned", () => {
    for (const [name, m] of Object.entries(PLANE) as [string, Matrix][]) {
      const unturned = SWEEP.filter((a) => turn(m, direction(a)) < 0.01);
      const found = eigen(m).map((e) => e.angle);
      for (const a of unturned) {
        expect(
          found.some((f) => apart(f, a) < 0.6),
          `${name} ${a}`,
        ).toBe(true);
      }
      for (const f of new Set(found.map((x) => Math.round(x)))) {
        expect(
          SWEEP.some((a) => apart(a, f) < 0.6 && turn(m, direction(a)) < 0.6),
          name,
        ).toBe(true);
      }
      holds(m);
    }
  });

  it("finds one direction for a shear, two at an angle for a skew, none for a rotation", () => {
    expect(new Set(eigen(PLANE.shear).map((e) => Math.round(e.angle)))).toEqual(new Set([0]));
    const skew = eigen(PLANE.skew).map((e) => e.angle);
    expect(skew).toHaveLength(2);
    expect(Math.abs(skew[0]! - skew[1]!)).not.toBeCloseTo(90, 0);
    expect(eigen(PLANE.rotate)).toEqual([]);
  });
});

describe("eigenvectors in three dimensions", () => {
  const ALL = Object.entries(MATRICES) as [string, Matrix3][];
  /** The two sliders' positions: around 0–179.5, tilt −90–90, by halves. */
  const SLIDERS = Array.from({ length: 360 }, (_, i) => i / 2).flatMap((around) =>
    Array.from({ length: 361 }, (_, j) => direction3(around, j / 2 - 90)),
  );

  it("satisfies Au = λu for every example", () => {
    for (const [, m] of ALL) {
      for (const { value, vector } of eigen3(m)) {
        const w = apply3(m, vector);
        for (const k of [0, 1, 2]) expect(w[k]!).toBeCloseTo(value * vector[k]!, 6);
        expect(stretch3(m, vector)).toBeCloseTo(value, 6);
      }
    }
  });

  it("finds three for the symmetric and lopsided, two for the shear, one for the rotation", () => {
    expect(eigen3(MATRICES.stretch)).toHaveLength(3);
    expect(eigen3(MATRICES.skew)).toHaveLength(3);
    expect(eigen3(MATRICES.shear)).toHaveLength(2);
    expect(eigen3(MATRICES.rotate)).toHaveLength(1);
  });

  it("stretches the symmetric example by 2 + √2, 2 and 2 − √2, at right angles", () => {
    const e = eigen3(MATRICES.stretch);
    expect(e.map((x) => x.value)).toEqual([
      expect.closeTo(2 + Math.SQRT2, 9),
      expect.closeTo(2, 9),
      expect.closeTo(2 - Math.SQRT2, 9),
    ]);
    for (const [p, q] of [
      [0, 1],
      [0, 2],
      [1, 2],
    ] as const) {
      expect(between3(e[p]!.vector, e[q]!.vector)).toBeCloseTo(90, 6);
    }
    const skew = eigen3(MATRICES.skew);
    expect(between3(skew[0]!.vector, skew[1]!.vector)).not.toBeCloseTo(90, 0);
  });

  it("keeps only the axis of a rotation, unstretched", () => {
    const [axis] = eigen3(MATRICES.rotate);
    expect(axis!.value).toBeCloseTo(1, 9);
    expect(between3(axis!.vector, [1, 1, 1])).toBeCloseTo(0, 5);
  });

  it("reports each line once, with its angles", () => {
    for (const [, m] of ALL) {
      for (const e of eigen3(m)) {
        expect(e.around).toBeGreaterThanOrEqual(0);
        expect(e.around).toBeLessThan(180);
        expect(between3(direction3(e.around, e.tilt), e.vector)).toBeCloseTo(0, 6);
      }
    }
  });

  it("finds exactly the directions a sweep of the sliders finds unturned", () => {
    for (const [name, m] of ALL) {
      const found = eigen3(m);
      for (const v of SLIDERS) {
        if (turn3(m, v) < 0.01) {
          expect(
            found.some((e) => between3(e.vector, v) < 1.5),
            name,
          ).toBe(true);
        }
      }
      // And every one of them can be reached closely enough to count as found.
      for (const e of found) {
        const near = SLIDERS.filter((v) => between3(e.vector, v) < 1.5 && turn3(m, v) < 1);
        expect(near.length, name).toBeGreaterThan(0);
      }
    }
  });
});

describe("a cloud and its shadows", () => {
  const people = makeCloud("people", 1);

  it("is a seeded sample near the figures it was made to", () => {
    expect(makeCloud("people", 1)).toEqual(people);
    const m = mean(people.points);
    expect(m.x).toBeGreaterThan(165);
    expect(m.x).toBeLessThan(175);
    const [vx, cxy, , vy] = covariance(people.points);
    const r = cxy / Math.sqrt(vx * vy);
    expect(r).toBeGreaterThan(0.4);
    expect(r).toBeLessThan(0.8);
  });

  it("has a symmetric covariance matrix", () => {
    const [, b, c] = covariance(people.points);
    expect(b).toBe(c);
  });

  it("casts shadows that sum to zero, whose variance is uᵀΣu", () => {
    const [a, b, , d] = covariance(people.points);
    for (const angle of [0, 33, 90, 145]) {
      const s = shadows(people.points, angle);
      expect(s.reduce((n, v) => n + v, 0)).toBeCloseTo(0, 8);
      const [ux, uy] = direction(angle);
      expect(shadowVariance(people.points, angle)).toBeCloseTo(
        a * ux * ux + 2 * b * ux * uy + d * uy * uy,
        8,
      );
    }
  });

  it("casts its widest shadow along the first eigenvector, as wide as its eigenvalue", () => {
    for (const cloud of [people, makeCloud("people", 7), makeCloud("round", 3)]) {
      const { first, second } = components(cloud.points);
      const widths = SWEEP.map((a) => shadowVariance(cloud.points, a));
      const best = SWEEP[widths.indexOf(Math.max(...widths))]!;
      const gap = Math.abs(best - first.angle);
      expect(Math.min(gap, 180 - gap)).toBeLessThan(1);
      expect(Math.max(...widths)).toBeCloseTo(first.value, 2);
      expect(Math.min(...widths)).toBeCloseTo(second.value, 2);
      // A covariance matrix is symmetric, so its two directions are perpendicular.
      const across = Math.abs(first.angle - second.angle);
      expect(across).toBeCloseTo(90, 6);
    }
  });

  it("keeps most of the variance along one line for people, about half for a round cloud", () => {
    expect(components(people.points).kept).toBeGreaterThan(0.7);
    const round = components(makeCloud("round", 3).points).kept;
    expect(round).toBeGreaterThan(0.5);
    expect(round).toBeLessThan(0.65);
  });

  it("throws away, as residuals, exactly the variance the line does not keep", () => {
    const { first, second } = components(people.points);
    const lost = residuals(people.points, first.angle);
    const variance = lost.reduce((n, v) => n + v * v, 0) / (lost.length - 1);
    expect(variance).toBeCloseTo(second.value, 8);
  });
});
