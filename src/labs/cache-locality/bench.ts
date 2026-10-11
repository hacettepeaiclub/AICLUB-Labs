import type { LoopOrder } from "./engine";

/**
 * Real measurements, on the visitor's own processor.
 *
 * ## Why these are measured rather than modelled
 *
 * The model in `engine.ts` counts misses in a cache simple enough to draw. A
 * real machine has more levels, a prefetcher, a JIT compiler between this code
 * and the silicon, and a clock it does not let a web page read precisely. So
 * whenever the lab says "this is slower", it is a stopwatch saying it, here,
 * not a formula — and the page shows the visitor's own numbers next to the
 * model's, not instead of them.
 *
 * ## How the timing is kept honest
 *
 * - **Same work.** Both orders add the same numbers, and both return their sum:
 *   the page shows the two sums are identical, and the JIT cannot drop a loop
 *   whose result is used.
 * - **Warm, then best of several.** One unmeasured run first (the JIT compiles,
 *   pages are touched), then several timed runs, alternating the orders so a
 *   noisy moment hurts both, and the fastest of each is kept: noise only ever
 *   makes a run slower, never faster.
 * - **Big enough to leave the cache.** The grid is 2048 × 2048 doubles, 32 MB,
 *   larger than the caches of the processors this will run on, and each run
 *   takes milliseconds, well above the coarsened timer browsers expose.
 *
 * Everything here runs in a worker (`bench.worker.ts`) so a measurement never
 * freezes the page. The functions themselves are plain and are tested
 * directly on small inputs.
 */

/** Sum an `n × n` grid row after row. */
export function sumRows(a: Float64Array, n: number): number {
  let s = 0;
  for (let i = 0; i < n; i++) {
    const o = i * n;
    for (let j = 0; j < n; j++) s += a[o + j]!;
  }
  return s;
}

/** The same grid, column after column. */
export function sumColumns(a: Float64Array, n: number): number {
  let s = 0;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) s += a[i * n + j]!;
  }
  return s;
}

/** Every element once, `stride` apart, as `strideOrder` in the engine. */
export function sumStride(a: Float64Array, stride: number): number {
  let s = 0;
  const n = a.length;
  for (let start = 0; start < stride; start++) {
    for (let i = start; i < n; i += stride) s += a[i]!;
  }
  return s;
}

/** `C += A · B`, `n × n`, loops nested in `order`. Returns C's sum, so it is used. */
export function multiply(
  order: LoopOrder,
  a: Float64Array,
  b: Float64Array,
  c: Float64Array,
  n: number,
): number {
  // Written out per order rather than through an index table: the inner loop
  // has to be the plain loop a programmer would write, or the measurement is
  // of the indirection instead of the memory.
  switch (order) {
    case "ijk":
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          let s = c[i * n + j]!;
          for (let k = 0; k < n; k++) s += a[i * n + k]! * b[k * n + j]!;
          c[i * n + j] = s;
        }
      break;
    case "jik":
      for (let j = 0; j < n; j++)
        for (let i = 0; i < n; i++) {
          let s = c[i * n + j]!;
          for (let k = 0; k < n; k++) s += a[i * n + k]! * b[k * n + j]!;
          c[i * n + j] = s;
        }
      break;
    case "ikj":
      for (let i = 0; i < n; i++)
        for (let k = 0; k < n; k++) {
          const x = a[i * n + k]!;
          for (let j = 0; j < n; j++) c[i * n + j]! += x * b[k * n + j]!;
        }
      break;
    case "kij":
      for (let k = 0; k < n; k++)
        for (let i = 0; i < n; i++) {
          const x = a[i * n + k]!;
          for (let j = 0; j < n; j++) c[i * n + j]! += x * b[k * n + j]!;
        }
      break;
    case "jki":
      for (let j = 0; j < n; j++)
        for (let k = 0; k < n; k++) {
          const x = b[k * n + j]!;
          for (let i = 0; i < n; i++) c[i * n + j]! += a[i * n + k]! * x;
        }
      break;
    case "kji":
      for (let k = 0; k < n; k++)
        for (let j = 0; j < n; j++) {
          const x = b[k * n + j]!;
          for (let i = 0; i < n; i++) c[i * n + j]! += a[i * n + k]! * x;
        }
      break;
  }
  let s = 0;
  for (let i = 0; i < c.length; i++) s += c[i]!;
  return s;
}

/**
 * Fill with small exact values, so sums are exact in float64 and the two
 * orders' totals can be shown equal rather than "equal to rounding".
 */
export function fill(a: Float64Array, period = 7): Float64Array {
  for (let i = 0; i < a.length; i++) a[i] = (i % period) * 0.5;
  return a;
}

/** The fastest of `reps` timed runs, after one untimed warm-up. */
export function bestOf(
  reps: number,
  run: () => number,
  now: () => number,
): { ms: number; value: number } {
  let value = run();
  let ms = Infinity;
  for (let r = 0; r < reps; r++) {
    const t = now();
    value = run();
    ms = Math.min(ms, now() - t);
  }
  return { ms, value };
}

/**
 * Time both orders over the same grid: one warm-up each, then `reps` rounds
 * that alternate them, keeping each order's fastest.
 */
export function race(
  a: Float64Array,
  n: number,
  reps: number,
  now: () => number,
): { rowMs: number; columnMs: number; rowSum: number; columnSum: number } {
  let rowSum = sumRows(a, n);
  let columnSum = sumColumns(a, n);
  let rowMs = Infinity;
  let columnMs = Infinity;
  for (let r = 0; r < reps; r++) {
    let t = now();
    rowSum = sumRows(a, n);
    rowMs = Math.min(rowMs, now() - t);
    t = now();
    columnSum = sumColumns(a, n);
    columnMs = Math.min(columnMs, now() - t);
  }
  return { rowMs, columnMs, rowSum, columnSum };
}

// ------------------------------------------------------------ messages ----

export const RACE_N = 2048;
export const STRIDE_LENGTH = 4 * 1024 * 1024;
export const STRIDES = [1, 2, 4, 8, 16, 32, 64] as const;
export const PRODUCT_N = 512;

export type BenchRequest =
  | { kind: "race"; id: number }
  | { kind: "stride"; id: number }
  | { kind: "product"; id: number; order: LoopOrder };

export type BenchReply =
  | { kind: "race"; id: number; rowMs: number; columnMs: number; rowSum: number; columnSum: number }
  | { kind: "stride-point"; id: number; stride: number; nsPerRead: number }
  | { kind: "stride-done"; id: number }
  | { kind: "product"; id: number; order: LoopOrder; ms: number }
  | { kind: "error"; id: number; message: string };
