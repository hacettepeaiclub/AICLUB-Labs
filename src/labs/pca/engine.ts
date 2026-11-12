import { createRng } from "@/lib/random";

/**
 * Eigenvectors, covariance and principal component analysis, written out
 * by hand: a matrix bending space in three dimensions, then a cloud of data
 * in two.
 *
 * Pure TypeScript — no React, no DOM, no library. Every number the lab shows
 * is read out of this file.
 *
 * ## What the lab is trying to show
 *
 * **A matrix turns almost every direction, but not all of them; for a cloud
 * of data, the directions it does not turn are where the data spreads most
 * and least.** That is all PCA is. First the visitor turns a direction and
 * watches a matrix bend it, until they find the directions it only
 * stretches. Then a cloud of points: turn a line through it and watch how
 * wide the points' shadow on it is. The widest shadow lies along an
 * eigenvector of the cloud's covariance matrix, and its width (as a
 * variance) is that eigenvector's eigenvalue.
 *
 * ## Why that is true, in one line
 *
 * The variance of the points' shadow on a unit direction u is uᵀΣu (Σ the
 * covariance matrix). For a symmetric Σ that is largest at the eigenvector
 * with the largest eigenvalue, and equal to that eigenvalue there (the
 * Rayleigh quotient). `engine.test.ts` checks it by sweeping every angle.
 *
 * ## Honesty about scope
 *
 * Three dimensions for the matrix and two for the data, so everything can
 * be drawn; the data is a seeded
 * synthetic sample, not measurements. Real PCA runs the same mathematics on
 * hundreds of dimensions (the Map of Meaning lab's 300-number word vectors)
 * with numerical methods, not the 2×2 and 3×3 formulas used here.
 */

export type Vec = readonly [number, number];
/** [[a, b], [c, d]], row by row: the matrix sends (x, y) to (ax + by, cx + dy). */
export type Matrix = readonly [number, number, number, number];

export const apply = ([a, b, c, d]: Matrix, [x, y]: Vec): Vec => [a * x + b * y, c * x + d * y];

/** The unit vector at this angle, in degrees, measured from the x axis. */
export const direction = (degrees: number): Vec => {
  const r = (degrees * Math.PI) / 180;
  return [Math.cos(r), Math.sin(r)];
};

const length = ([x, y]: Vec) => Math.hypot(x, y);

/**
 * How far, in degrees, the matrix turns the line through v: 0 when Av lies
 * on the same line as v (either way along it), up to 90.
 */
export function turn(m: Matrix, v: Vec): number {
  const w = apply(m, v);
  const n = length(v) * length(w);
  if (n === 0) return 0;
  const cos = Math.abs(v[0] * w[0] + v[1] * w[1]) / n;
  return (Math.acos(Math.min(1, cos)) * 180) / Math.PI;
}

export interface Eigen {
  /** Largest first. */
  readonly value: number;
  /** Its direction's angle in degrees, in [0, 180): a line has no head. */
  readonly angle: number;
  readonly vector: Vec;
}

/**
 * The real eigenvalues and eigenvectors of a 2×2 matrix, largest first; none
 * when the matrix turns every direction (a rotation, say), whose eigenvalues
 * are complex.
 *
 * λ solves λ² − (a + d)λ + (ad − bc) = 0. For each λ, (A − λI)u = 0 is one
 * equation repeated, so u is any non-zero solution of its better-conditioned
 * row. A matrix that only scales (λI) keeps every direction; it is reported
 * as the two axes; a shear, whose two eigenvalues are equal but which keeps
 * only one direction, as that one.
 */
export function eigen(m: Matrix): Eigen[] {
  const [a, b, c, d] = m;
  const trace = a + d;
  const det = a * d - b * c;
  const disc = trace * trace - 4 * det;
  if (disc < -1e-12) return [];
  const root = Math.sqrt(Math.max(0, disc));
  const values = [(trace + root) / 2, (trace - root) / 2];
  if (Math.abs(b) < 1e-12 && Math.abs(c) < 1e-12) {
    // Already diagonal: the axes, each with its own entry.
    const axes: Eigen[] = [
      { value: a, angle: 0, vector: [1, 0] },
      { value: d, angle: 90, vector: [0, 1] },
    ];
    return axes.sort((p, q) => q.value - p.value);
  }
  // A repeated eigenvalue off the diagonal (a shear) has one direction, not two.
  const distinct = root < 1e-12 ? values.slice(0, 1) : values;
  return distinct.map((value) => {
    // Rows of A − λI: (a − λ, b) and (c, d − λ). Use the longer one.
    const r1: Vec = [a - value, b];
    const r2: Vec = [c, d - value];
    const row = length(r1) >= length(r2) ? r1 : r2;
    let u: Vec = [-row[1], row[0]];
    const n = length(u) || 1;
    u = [u[0] / n, u[1] / n];
    // One head per line: point into the upper half plane.
    if (u[1] < 0 || (u[1] === 0 && u[0] < 0)) u = [-u[0], -u[1]];
    const angle = ((Math.atan2(u[1], u[0]) * 180) / Math.PI + 180) % 180;
    return { value, angle, vector: u };
  });
}

// ------------------------------------------------------ three dimensions --

export type Vec3 = readonly [number, number, number];
/** [[a, b, c], [d, e, f], [g, h, i]], row by row. */
export type Matrix3 = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const apply3 = (m: Matrix3, [x, y, z]: Vec3): Vec3 => [
  m[0] * x + m[1] * y + m[2] * z,
  m[3] * x + m[4] * y + m[5] * z,
  m[6] * x + m[7] * y + m[8] * z,
];

const dot3 = (u: Vec3, v: Vec3) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const cross3 = (u: Vec3, v: Vec3): Vec3 => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];
const norm3 = (u: Vec3) => Math.sqrt(dot3(u, u));
const RAD = Math.PI / 180;

/**
 * The unit vector `around` degrees round the vertical axis (from x towards
 * y) and `tilt` degrees above the floor.
 */
export const direction3 = (around: number, tilt: number): Vec3 => [
  Math.cos(tilt * RAD) * Math.cos(around * RAD),
  Math.cos(tilt * RAD) * Math.sin(around * RAD),
  Math.sin(tilt * RAD),
];

/** The angle between the lines through u and v, in degrees: 0 to 90. */
export function between3(u: Vec3, v: Vec3): number {
  const n = norm3(u) * norm3(v);
  if (n === 0) return 0;
  return Math.acos(Math.min(1, Math.abs(dot3(u, v)) / n)) / RAD;
}

/** How far the matrix turns the line through v, in degrees. */
export const turn3 = (m: Matrix3, v: Vec3): number => between3(v, apply3(m, v));

/** How much the matrix scales v along its own line, with sign: Av · v / v · v. */
export const stretch3 = (m: Matrix3, v: Vec3): number => dot3(apply3(m, v), v) / dot3(v, v);

export interface Eigen3 {
  /** Largest first. */
  readonly value: number;
  /** Unit length, one head per line: `around` in [0, 180). */
  readonly vector: Vec3;
  readonly around: number;
  readonly tilt: number;
}

/** A line's one direction, as a unit vector and its two angles. */
function line3(u: Vec3): Pick<Eigen3, "vector" | "around" | "tilt"> {
  const n = norm3(u);
  let v: Vec3 = [u[0] / n, u[1] / n, u[2] / n];
  if (Math.hypot(v[0], v[1]) < 1e-9) return { vector: [0, 0, 1], around: 0, tilt: 90 };
  let around = Math.atan2(v[1], v[0]) / RAD;
  if (around < 0 || around >= 180) {
    v = [-v[0], -v[1], -v[2]];
    around = Math.atan2(v[1], v[0]) / RAD + 0;
  }
  return { vector: v, around, tilt: Math.asin(Math.max(-1, Math.min(1, v[2]))) / RAD };
}

/** The real roots of λ³ + bλ² + cλ + d, by the textbook formulas. */
function cubicRoots(b: number, c: number, d: number): number[] {
  const shift = b / 3;
  const p = c - (b * b) / 3;
  const q = (2 * b * b * b) / 27 - (b * c) / 3 + d;
  const disc = (q / 2) ** 2 + (p / 3) ** 3;
  if (disc > 1e-12) {
    // One real root, two complex ones.
    const s = Math.sqrt(disc);
    return [Math.cbrt(-q / 2 + s) + Math.cbrt(-q / 2 - s) - shift];
  }
  if (Math.abs(p) < 1e-12) return [-shift];
  // Three real roots (some may be repeated): the trigonometric form.
  const r = 2 * Math.sqrt(-p / 3);
  const phi = Math.acos(Math.max(-1, Math.min(1, (3 * q) / (p * r)))) / 3;
  return [0, 1, 2].map((k) => r * Math.cos(phi - (2 * Math.PI * k) / 3) - shift);
}

/**
 * The real eigenvalues and eigenvectors of a 3×3 matrix, largest first.
 *
 * λ solves det(λI − A) = λ³ − (trace)λ² + (sum of 2×2 minors)λ − det = 0. For
 * each distinct λ, u is perpendicular to every row of A − λI, so it is the
 * cross product of two of them (the longest of the three, for accuracy). A
 * repeated λ that keeps only one direction (a shear) gives that one; a
 * matrix keeping a whole plane is not among the examples.
 */
export function eigen3(m: Matrix3): Eigen3[] {
  const [a, b, c, d, e, f, g, h, i] = m;
  const trace = a + e + i;
  const minors = a * e - b * d + (a * i - c * g) + (e * i - f * h);
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  const values: number[] = [];
  for (const root of cubicRoots(-trace, minors, -det).sort((p, q) => q - p)) {
    if (!values.some((v) => Math.abs(v - root) < 1e-5)) values.push(root);
  }
  const found: Eigen3[] = [];
  for (const value of values) {
    const rows: Vec3[] = [
      [a - value, b, c],
      [d, e - value, f],
      [g, h, i - value],
    ];
    const best = [
      cross3(rows[0]!, rows[1]!),
      cross3(rows[0]!, rows[2]!),
      cross3(rows[1]!, rows[2]!),
    ].reduce((p, q) => (norm3(q) > norm3(p) ? q : p));
    if (norm3(best) < 1e-9) continue;
    found.push({ value, ...line3(best) });
  }
  return found;
}

/** Matrices to try, each with something to show. */
export const MATRICES = {
  /** Symmetric: three directions stay, at right angles, stretched by 2 ± √2 and 2. */
  stretch: [2, 1, 0, 1, 2, 1, 0, 1, 2],
  /** A shear along x, and a stretch up z: two directions stay, not three. */
  shear: [1, 1, 0, 0, 1, 0, 0, 0, 1.5],
  /** Not symmetric: three directions stay, and they are not at right angles. */
  skew: [2, 1, 0, 0, 1, 1, 0, 0, 1.5],
  /** A third of a turn about the diagonal: only the axis stays. */
  rotate: [0, 0, 1, 1, 0, 0, 0, 1, 0],
} as const satisfies Record<string, Matrix3>;

export type MatrixName = keyof typeof MATRICES;

// ------------------------------------------------------------- the data --

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Cloud {
  /** What the axes mean. */
  readonly kind: CloudKind;
  readonly points: readonly Point[];
}

export type CloudKind = "people" | "round";

/** Two independent standard normal numbers (Box–Muller). */
function normals(rng: () => number): Vec {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
}

/**
 * A seeded sample to try PCA on.
 *
 * - `people`: height in cm and weight in kg, correlated as they are in
 *   adults (mean 170 cm, sd 9; mean 70 kg, sd 12; correlation 0.6). Made up
 *   to match those figures, not measured.
 * - `round`: two unrelated quantities with the same spread, so no direction
 *   is special.
 */
export function makeCloud(kind: CloudKind, seed: number, count = 80): Cloud {
  const rng = createRng(seed);
  const spec =
    kind === "people"
      ? { mx: 170, sx: 9, my: 70, sy: 12, r: 0.6 }
      : { mx: 50, sx: 10, my: 50, sy: 10, r: 0 };
  const points = Array.from({ length: count }, () => {
    const [z1, z2] = normals(rng);
    const x = spec.mx + spec.sx * z1;
    const y = spec.my + spec.sy * (spec.r * z1 + Math.sqrt(1 - spec.r * spec.r) * z2);
    return { x, y };
  });
  return { kind, points };
}

export const mean = (points: readonly Point[]): Point => ({
  x: points.reduce((s, p) => s + p.x, 0) / points.length,
  y: points.reduce((s, p) => s + p.y, 0) / points.length,
});

/**
 * The sample covariance matrix [[var x, cov], [cov, var y]] (divided by
 * n − 1), the same matrix kind as the ones above.
 */
export function covariance(points: readonly Point[]): Matrix {
  const m = mean(points);
  let xx = 0;
  let xy = 0;
  let yy = 0;
  for (const p of points) {
    const dx = p.x - m.x;
    const dy = p.y - m.y;
    xx += dx * dx;
    xy += dx * dy;
    yy += dy * dy;
  }
  const n = Math.max(1, points.length - 1);
  return [xx / n, xy / n, xy / n, yy / n];
}

/**
 * Where each point's shadow falls on the line through the middle at this
 * angle: its signed distance along the line from the middle.
 */
export function shadows(points: readonly Point[], degrees: number): number[] {
  const m = mean(points);
  const [ux, uy] = direction(degrees);
  return points.map((p) => (p.x - m.x) * ux + (p.y - m.y) * uy);
}

/** The variance of the shadows: how wide the cloud looks from that side. */
export function shadowVariance(points: readonly Point[], degrees: number): number {
  const s = shadows(points, degrees);
  return s.reduce((n, v) => n + v * v, 0) / Math.max(1, s.length - 1);
}

export interface Components {
  /** The widest direction, then the one across it. */
  readonly first: Eigen;
  readonly second: Eigen;
  /** The share of all the variance the first direction keeps. */
  readonly kept: number;
}

/** Principal components: the eigenvectors of the covariance matrix. */
export function components(points: readonly Point[]): Components {
  const [first, second] = eigen(covariance(points)) as [Eigen, Eigen];
  return { first, second, kept: first.value / (first.value + second.value) };
}

/** How far each point is from its shadow: what keeping one number throws away. */
export function residuals(points: readonly Point[], degrees: number): number[] {
  const m = mean(points);
  const [ux, uy] = direction(degrees);
  return points.map((p) => Math.abs(-(p.x - m.x) * uy + (p.y - m.y) * ux));
}
