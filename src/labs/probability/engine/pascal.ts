/**
 * Pascal's balls: a Galton board, and the triangle that predicts it.
 *
 * Pure TypeScript. The model is stated rather than assumed:
 *
 *   - every peg is a fair, independent left/right decision;
 *   - a ball meets exactly one peg per row;
 *   - the bin a ball lands in is the number of rights it took.
 *
 * That last line is the whole experiment. A path is a sequence of decisions,
 * but a bin only counts how many of them went right, and many different paths
 * produce the same count. How many is exactly the binomial coefficient, which
 * is why the board's shape is Pascal's triangle rather than a bell somebody
 * drew on it.
 *
 * Nothing here knows how a ball is drawn. The simulation returns paths and
 * counts; where those appear on screen is the component's business.
 */

import { createRng } from "@/lib/random";

/** Rows of pegs. Few enough to count paths by eye, enough to see the shape. */
export const MIN_ROWS = 4;
export const MAX_ROWS = 12;
export const DEFAULT_ROWS = 8;

/**
 * One row of Pascal's triangle, built the way Pascal built it.
 *
 * Each entry is the sum of the two above it, so the numbers stay exact
 * integers. The factorial form is the same function, but it overflows for no
 * reason and hides the one fact the lab is trying to show: the coefficient is
 * a count of paths, and a path either went left at the first peg or it went
 * right.
 */
export function pascalRow(rows: number): number[] {
  let row = [1];
  for (let r = 1; r <= rows; r++) {
    const next: number[] = [1];
    for (let k = 1; k < r; k++) next.push((row[k - 1] ?? 0) + (row[k] ?? 0));
    next.push(1);
    row = next;
  }
  return row;
}

/** How many distinct paths end in bin `k` of a board with `rows` rows. */
export function pathCount(rows: number, k: number): number {
  return pascalRow(rows)[k] ?? 0;
}

/** Every path the board admits: 2^rows, one per sequence of decisions. */
export const totalPaths = (rows: number): number => 2 ** rows;

/**
 * The theoretical distribution: P(X = k) = C(rows, k) / 2^rows.
 *
 * Read as a ratio of path counts rather than as a formula to be believed. The
 * denominator is every path the board admits; the numerator is the ones that
 * arrive at this bin.
 */
export function binomialDistribution(rows: number): number[] {
  const total = totalPaths(rows);
  return pascalRow(rows).map((count) => count / total);
}

/** The expected number of balls in each bin, for a run of this size. */
export function expectedCounts(rows: number, balls: number): number[] {
  return binomialDistribution(rows).map((p) => p * balls);
}

/** One ball's trip: the decision at each row, and where it ended up. */
export interface Path {
  /** `false` is a step left, `true` a step right. One entry per row. */
  readonly steps: readonly boolean[];
  /** The bin index, which is how many of those steps went right. */
  readonly bin: number;
}

/** Drop one ball, consuming one number per row from `rng`. */
export function dropBall(rng: () => number, rows: number): Path {
  const steps: boolean[] = [];
  let bin = 0;
  for (let r = 0; r < rows; r++) {
    const right = rng() < 0.5;
    steps.push(right);
    if (right) bin += 1;
  }
  return { steps, bin };
}

export interface BoardRun {
  readonly rows: number;
  readonly balls: number;
  /** How many balls finished in each bin. Length is `rows + 1`. */
  readonly counts: readonly number[];
  /**
   * The first few paths, in full.
   *
   * A hundred thousand balls is a number, not a picture. The board shows these
   * and counts all of them, which is the honest division of labour: what is
   * drawn is a sample, what is reported is the run.
   */
  readonly sample: readonly Path[];
}

/**
 * Run the board.
 *
 * One generator for the whole run, so the same seed and the same parameters
 * reproduce it exactly, and so the sample that gets drawn is the beginning of
 * the run that gets counted rather than a second, luckier experiment.
 */
export function runBoard(
  seed: number,
  rows: number,
  balls: number,
  sampleSize = 0,
  sampleFrom = 0,
): BoardRun {
  const rng = createRng(seed);
  const counts = new Array<number>(rows + 1).fill(0);
  const sample: Path[] = [];

  for (let i = 0; i < balls; i++) {
    const path = dropBall(rng, rows);
    counts[path.bin] = (counts[path.bin] ?? 0) + 1;
    // `sampleFrom` lets the board draw the balls that just fell rather than
    // the ones that fell first. Either way they are this run's own balls,
    // taken from the same stream that produced the counts.
    if (i >= sampleFrom && sample.length < sampleSize) sample.push(path);
  }

  return { rows, balls, counts, sample };
}

/**
 * The largest bin count in a run, or the largest expected count, whichever is
 * bigger. Both histograms are drawn against this so their bars are comparable.
 */
export function peakOf(run: BoardRun): number {
  const observed = Math.max(...run.counts, 0);
  const expected = Math.max(...expectedCounts(run.rows, run.balls), 0);
  return Math.max(observed, expected, 1);
}
