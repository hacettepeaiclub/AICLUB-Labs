/**
 * A neuron as a line you can hold.
 *
 * A neuron with two inputs computes w₁x + w₂y + b and squashes it, so where
 * it changes its mind is the line w₁x + w₂y + b = 0. The weight vector
 * (w₁, w₂) is that line's normal — it points to the side the neuron says
 * yes to, and its length is how sharply it says it — and the bias slides
 * the line along that normal. These are the conversions between the three
 * numbers and the two things the visitor drags.
 */

import type { Point } from "./datasets";

export interface Line {
  readonly w1: number;
  readonly w2: number;
  readonly b: number;
}

export interface Xy {
  readonly x: number;
  readonly y: number;
}

/** The weights and bias the sliders allow; the handles respect the same box. */
export const LIMIT = 3;
const clampW = (v: number) => Math.max(-LIMIT, Math.min(LIMIT, v));

/** How far the arrow is drawn per unit of weight, in input-square units. */
export const ARROW_SCALE = 1 / LIMIT;

export const side = (l: Line, p: Xy): number => l.w1 * p.x + l.w2 * p.y + l.b;

/** The point of the line nearest the origin: −b·w/|w|². */
export function foot(l: Line): Xy {
  const n = l.w1 * l.w1 + l.w2 * l.w2;
  if (n === 0) return { x: 0, y: 0 };
  return { x: (-l.b * l.w1) / n, y: (-l.b * l.w2) / n };
}

/** Where the arrow's tip is drawn: the foot plus the weight vector, scaled. */
export const tip = (l: Line): Xy => {
  const f = foot(l);
  return { x: f.x + l.w1 * ARROW_SCALE, y: f.y + l.w2 * ARROW_SCALE };
};

/** The same orientation, moved so the line passes through p. */
export const through = (l: Line, p: Xy): Line => ({
  ...l,
  b: Math.max(-LIMIT, Math.min(LIMIT, -(l.w1 * p.x + l.w2 * p.y))),
});

/**
 * The line whose arrow ends at `t`, keeping its foot where it is: turning
 * the tip turns the line about that point, and pulling it out makes the edge
 * sharper.
 */
export function fromTip(l: Line, t: Xy): Line {
  const f = foot(l);
  const w1 = clampW((t.x - f.x) / ARROW_SCALE);
  const w2 = clampW((t.y - f.y) / ARROW_SCALE);
  return { w1, w2, b: Math.max(-LIMIT, Math.min(LIMIT, -(w1 * f.x + w2 * f.y))) };
}

/**
 * The part of the line inside the input square [−1, 1]², as two points, or
 * null when the line misses the square.
 */
export function clip(l: Line): [Xy, Xy] | null {
  const pts: Xy[] = [];
  const add = (x: number, y: number) => {
    if (x < -1 - 1e-9 || x > 1 + 1e-9 || y < -1 - 1e-9 || y > 1 + 1e-9) return;
    if (pts.some((q) => Math.abs(q.x - x) < 1e-9 && Math.abs(q.y - y) < 1e-9)) return;
    pts.push({ x, y });
  };
  if (l.w2 !== 0) {
    add(-1, (-l.b + l.w1) / l.w2);
    add(1, (-l.b - l.w1) / l.w2);
  }
  if (l.w1 !== 0) {
    add((-l.b + l.w2) / l.w1, -1);
    add((-l.b - l.w2) / l.w1, 1);
  }
  const [a, c] = pts;
  return a && c ? [a, c] : null;
}

// ------------------------------------------------------------- accuracy --

/**
 * How many points one line gets right. Which side means which class is the
 * output weight's sign, the one number the visitor does not hold, so it is
 * taken whichever way does better.
 */
export function oneLineAccuracy(points: readonly Point[], l: Line): number {
  if (!points.length) return 0;
  let agree = 0;
  for (const p of points) if (side(l, p) > 0 === (p.label === 1)) agree++;
  return Math.max(agree, points.length - agree) / points.length;
}

/**
 * Two hidden neurons and an output neuron that says yes only where both of
 * them do — step(h₁ + h₂ − 1.5), a single linear threshold — so the region
 * it marks is where both arrows point. As above, which class that region
 * is goes whichever way does better.
 */
export function twoLineAccuracy(points: readonly Point[], a: Line, b: Line): number {
  if (!points.length) return 0;
  let agree = 0;
  for (const p of points) if ((side(a, p) > 0 && side(b, p) > 0) === (p.label === 1)) agree++;
  return Math.max(agree, points.length - agree) / points.length;
}

/**
 * The best any single line can do on these points, by search over the same
 * grid of directions and offsets as before: `angles` normals over a half
 * turn, `offsets` biases evenly across [−1.5, 1.5].
 *
 * It used to score every grid line against every point — 360 × 241 × 160
 * ≈ 14 million side tests when the stage mounted, about a fifth of the idle
 * page's script time on a throttled phone. For one direction, though, the
 * offsets only move a threshold along the points' projections: sorted once,
 * the offsets can be swept in order with a single pointer, so each direction
 * costs a sort plus one pass. Same grid, same strict `> 0` rule, same answer
 * (lines.test.ts checks it against the direct count).
 */
export function bestOneLine(points: readonly Point[], angles = 360, offsets = 241): number {
  const n = points.length;
  if (!n) return 0;
  let ones = 0;
  for (const p of points) if (p.label === 1) ones++;
  const order = points.map((_, i) => i);
  const projected = new Float64Array(n);
  let best = 0;
  for (let i = 0; i < angles; i++) {
    const t = (i / angles) * Math.PI;
    const w1 = Math.cos(t);
    const w2 = Math.sin(t);
    for (let k = 0; k < n; k++) {
      const p = points[k]!;
      projected[k] = w1 * p.x + w2 * p.y;
    }
    // Highest projection first: as the bias grows, points join the positive
    // side in this order.
    order.sort((a, c) => projected[c]! - projected[a]!);
    let above = 0;
    let onesAbove = 0;
    for (let j = 0; j < offsets; j++) {
      const b = -1.5 + (3 * j) / (offsets - 1);
      while (above < n) {
        const k = order[above]!;
        if (!(projected[k]! + b > 0)) break;
        if (points[k]!.label === 1) onesAbove++;
        above++;
      }
      // Right: ones on the positive side, and zeros on the other.
      const agree = onesAbove + (n - ones) - (above - onesAbove);
      const accuracy = Math.max(agree, n - agree) / n;
      if (accuracy > best) best = accuracy;
    }
  }
  return best;
}
