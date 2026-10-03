/**
 * Toy 2D classification datasets — pure, seedable, no React.
 *
 * Every point lives in [-1, 1]² so the playground canvas, the decision-field
 * sampler, and the network all share one coordinate space. Regenerating with
 * the same seed reproduces the exact same cloud, so "reset" tells the same
 * story twice (docs/GUIDELINES.md → reproducibility).
 */

import { createRng, shuffle } from "@/lib/random";
import { TAU } from "@/lib/math";

/** Class label. Deliberately ±1: the output neuron is a tanh, whose range is ±1. */
export type Label = -1 | 1;

export interface Point {
  x: number;
  y: number;
  label: Label;
}

export type DatasetKind = "circle" | "xor" | "gauss" | "spiral";

export interface DatasetInfo {
  kind: DatasetKind;
}

export const DATASETS: readonly DatasetInfo[] = [
  { kind: "gauss" },
  { kind: "circle" },
  { kind: "xor" },
  { kind: "spiral" },
];

/** Standard normal via Box–Muller, driven by a seeded rng. */
const gaussian = (rng: () => number): number =>
  Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(TAU * rng());

const jitter = (rng: () => number, noise: number): number => gaussian(rng) * noise;

function makeGauss(rng: () => number, count: number, noise: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const positive = i % 2 === 0;
    const cx = positive ? 0.45 : -0.45;
    const cy = positive ? 0.45 : -0.45;
    points.push({
      x: cx + jitter(rng, 0.16 + noise * 0.5),
      y: cy + jitter(rng, 0.16 + noise * 0.5),
      label: positive ? 1 : -1,
    });
  }
  return points;
}

function makeCircle(rng: () => number, count: number, noise: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const inner = i % 2 === 0;
    const radius = inner ? rng() * 0.42 : 0.62 + rng() * 0.33;
    const angle = rng() * TAU;
    points.push({
      x: radius * Math.cos(angle) + jitter(rng, noise * 0.5),
      y: radius * Math.sin(angle) + jitter(rng, noise * 0.5),
      label: inner ? 1 : -1,
    });
  }
  return points;
}

function makeXor(rng: () => number, count: number, noise: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    // Push points off the axes: samples sitting on the boundary teach nothing.
    const x = rng() * 1.8 - 0.9;
    const y = rng() * 1.8 - 0.9;
    const px = x + Math.sign(x) * 0.06;
    const py = y + Math.sign(y) * 0.06;
    points.push({
      x: px + jitter(rng, noise * 0.5),
      y: py + jitter(rng, noise * 0.5),
      label: px * py >= 0 ? 1 : -1,
    });
  }
  return points;
}

/**
 * Angular sweep of each arm, in radians — the spiral's difficulty dial.
 *
 * Calibrated so the shape sits right at the edge of what a small network can
 * hold: three hidden neurons cannot do it, six can, and two layers of three
 * beat one layer of five. Widen it and everything fails; narrow it and a
 * single neuron pair walks it, which makes the challenge pointless.
 */
const SPIRAL_SWEEP = 7.2;

function makeSpiral(rng: () => number, count: number, noise: number): Point[] {
  const points: Point[] = [];
  const perArm = Math.floor(count / 2);
  for (let i = 0; i < perArm; i++) {
    const t = i / perArm;
    const radius = t * 0.95;
    for (let arm = 0; arm < 2; arm++) {
      const angle = t * SPIRAL_SWEEP + arm * Math.PI + rng() * 0.28;
      points.push({
        x: radius * Math.sin(angle) + jitter(rng, noise * 0.4),
        y: radius * Math.cos(angle) + jitter(rng, noise * 0.4),
        label: arm === 0 ? 1 : -1,
      });
    }
  }
  return points;
}

/**
 * Build a dataset. `noise` is 0–1 (fraction of the unit square), `seed` makes
 * the cloud reproducible.
 */
export function generateDataset(
  kind: DatasetKind,
  count: number,
  noise: number,
  seed: number,
): Point[] {
  const rng = createRng(seed);
  switch (kind) {
    case "gauss":
      return makeGauss(rng, count, noise);
    case "circle":
      return makeCircle(rng, count, noise);
    case "xor":
      return makeXor(rng, count, noise);
    case "spiral":
      return makeSpiral(rng, count, noise);
  }
}

/**
 * Split into train/test. Shuffled first (seeded, so still reproducible):
 * several generators emit points in a structured order — by arm, by radius —
 * and a contiguous slice of that would hand the test set a biased sample.
 */
export function splitDataset(points: readonly Point[], trainFraction = 0.75, seed = 1) {
  const mixed = shuffle(createRng(seed), points);
  const cut = Math.floor(mixed.length * trainFraction);
  return { train: mixed.slice(0, cut), test: mixed.slice(cut) };
}
