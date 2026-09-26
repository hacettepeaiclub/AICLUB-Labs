/**
 * The law of large numbers, run rather than asserted.
 *
 * The trial is deliberately the same one the board is made of: a single fair
 * left/right decision at a single peg. Section 5 drops balls through a column
 * of those decisions and looks at where they land; this one repeats the one
 * decision and watches the proportion of rights.
 *
 * ## What the law says, and what it does not
 *
 * As the number of independent trials grows, the observed proportion tends to
 * approach the theoretical probability. It does not say the deviation falls at
 * every step, and it is not a promise about any particular run. A run that
 * happens to sit closer at a thousand trials than at ten thousand has not
 * broken anything, and the chart is built so that such a run can be seen
 * rather than smoothed away.
 */

import { createRng } from "@/lib/random";

/** A fair decision: the probability this file is measuring against. */
export const RIGHT_PROBABILITY = 0.5;

/** The scales the experiment steps through. */
export const SCALES = [10, 100, 1_000, 10_000, 100_000] as const;

export type Scale = (typeof SCALES)[number];

export interface Point {
  /** How many trials had been run when this was recorded. */
  readonly trials: number;
  /** How many of them went right. */
  readonly successes: number;
  /** successes / trials. */
  readonly proportion: number;
  /** |proportion - theoretical|. Absolute, and not assumed to be falling. */
  readonly deviation: number;
}

const pointAt = (trials: number, successes: number): Point => {
  const proportion = trials === 0 ? 0 : successes / trials;
  return {
    trials,
    successes,
    proportion,
    deviation: Math.abs(proportion - RIGHT_PROBABILITY),
  };
};

/**
 * Where to record a point.
 *
 * Every one of the first hundred trials, then roughly evenly in the logarithm
 * after that. The early wobble is the part worth seeing at full resolution:
 * it is where the proportion swings furthest, and a chart that starts sampling
 * at trial one thousand quietly hides the whole phenomenon.
 */
export function checkpoints(trials: number, perDecade = 40): number[] {
  const out: number[] = [];
  const dense = Math.min(trials, 100);
  for (let n = 1; n <= dense; n++) out.push(n);
  if (trials > dense) {
    const from = Math.log10(dense);
    const to = Math.log10(trials);
    const steps = Math.max(1, Math.round((to - from) * perDecade));
    for (let i = 1; i <= steps; i++) {
      const n = Math.round(10 ** (from + ((to - from) * i) / steps));
      if (n > (out[out.length - 1] ?? 0)) out.push(Math.min(n, trials));
    }
    if ((out[out.length - 1] ?? 0) !== trials) out.push(trials);
  }
  return out;
}

export interface Run {
  readonly trials: number;
  /** The running proportion, sampled along the way. */
  readonly points: readonly Point[];
  /** Where the run finished. */
  readonly final: Point;
  /** The value the proportion is being compared against. Exact, not estimated. */
  readonly theoretical: number;
}

/**
 * Run `trials` independent decisions and record the proportion along the way.
 *
 * One pass, one generator, one stream of decisions. Because the stream is
 * consumed in order, a longer run is an extension of a shorter one with the
 * same seed rather than a different experiment: the curve grows to the right
 * instead of being redrawn, which is what makes watching it mean anything.
 */
export function run(seed: number, trials: number): Run {
  const rng = createRng(seed);
  const marks = checkpoints(trials);
  const points: Point[] = [];

  let successes = 0;
  let next = 0;
  for (let n = 1; n <= trials; n++) {
    if (rng() < RIGHT_PROBABILITY) successes += 1;
    if (marks[next] === n) {
      points.push(pointAt(n, successes));
      next += 1;
    }
  }

  return {
    trials,
    points,
    final: pointAt(trials, successes),
    theoretical: RIGHT_PROBABILITY,
  };
}

/**
 * The individual outcomes of the first `count` trials of a run.
 *
 * Only for the small scales, where a visitor can still see trials happening
 * one at a time. Drawn from the same seed and the same generator, so these are
 * the run's own first outcomes and not a second experiment standing in for it.
 */
export function firstOutcomes(seed: number, count: number): boolean[] {
  const rng = createRng(seed);
  const out: boolean[] = [];
  for (let n = 0; n < count; n++) out.push(rng() < RIGHT_PROBABILITY);
  return out;
}

/**
 * The largest deviation in a run, which sets the vertical scale of the chart.
 *
 * Taken from the data rather than fixed, so a run that wanders further is
 * drawn wandering further instead of being clipped to a tidy band.
 */
export function widestDeviation(points: readonly Point[]): number {
  return points.reduce((worst, p) => Math.max(worst, p.deviation), 0);
}
