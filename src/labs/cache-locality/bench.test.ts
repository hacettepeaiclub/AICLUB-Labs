import { describe, expect, it } from "vitest";
import { LOOP_ORDERS } from "./engine";
import { bestOf, fill, multiply, race, sumColumns, sumRows, sumStride } from "./bench";

/**
 * The measured code has to do the same work in every order, or the stopwatch
 * would be comparing different jobs. These hold it to that on small inputs;
 * the timings themselves are the visitor's machine's to report.
 */

describe("the race", () => {
  it("adds the same numbers row by row and column by column, exactly", () => {
    const n = 64;
    const a = fill(new Float64Array(n * n));
    expect(sumRows(a, n)).toBe(sumColumns(a, n));
  });

  it("returns both sums and the fastest time of each order", () => {
    let clock = 0;
    const tick = () => (clock += 1);
    const n = 16;
    const result = race(fill(new Float64Array(n * n)), n, 3, tick);
    expect(result.rowSum).toBe(result.columnSum);
    expect(result.rowMs).toBe(1);
    expect(result.columnMs).toBe(1);
  });
});

describe("stride", () => {
  it("adds every number exactly once at any stride", () => {
    const a = fill(new Float64Array(4096));
    const total = sumStride(a, 1);
    for (const s of [2, 4, 8, 16, 64, 100]) expect(sumStride(a, s), `stride ${s}`).toBe(total);
  });
});

describe("the matrix product", () => {
  it("computes the same product in all six loop orders", () => {
    const n = 12;
    const a = fill(new Float64Array(n * n), 13);
    const b = fill(new Float64Array(n * n), 7);
    const reference = new Float64Array(n * n);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let k = 0; k < n; k++) s += a[i * n + k]! * b[k * n + j]!;
        reference[i * n + j] = s;
      }
    for (const order of LOOP_ORDERS) {
      const c = new Float64Array(n * n);
      multiply(order, a, b, c, n);
      expect(Array.from(c), order).toEqual(Array.from(reference));
    }
  });
});

describe("bestOf", () => {
  it("warms up untimed, then keeps the fastest run", () => {
    const durations = [50, 9, 4, 7];
    let clock = 0;
    let call = 0;
    const now = () => clock;
    const run = () => {
      clock += durations[call++] ?? 0;
      return 1;
    };
    expect(bestOf(3, run, now)).toEqual({ ms: 4, value: 1 });
  });
});
