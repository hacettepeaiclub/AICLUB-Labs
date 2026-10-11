import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  LOOP_ORDERS,
  columnOrder,
  countMisses,
  innerWalk,
  lineOf,
  productMisses,
  productReads,
  rowOrder,
  simulate,
  strideOrder,
  type LoopOrder,
} from "./engine";

/**
 * The model is held to what a fully associative LRU cache must do by its
 * definition, and to the counts the lab states on the page — so a sentence
 * that says "one miss per line" cannot outlive an engine that stopped
 * producing it.
 */

const small = { lineSize: 8, lines: 4 };

describe("the cache", () => {
  it("misses on a line it has never seen, then hits anywhere inside it", () => {
    const run = simulate([3, 0, 7, 8], small);
    expect(run.steps.map((s) => s.hit)).toEqual([false, true, true, false]);
    expect([run.hits, run.misses]).toEqual([2, 2]);
  });

  it("pushes out the least recently used line, not the oldest", () => {
    // Lines 0..3 fill the cache; touching 0 again makes 1 the stalest.
    const run = simulate([0, 8, 16, 24, 0, 32], small, true);
    expect(run.steps[5]).toMatchObject({ line: 4, hit: false, evicted: 1 });
    expect(run.held[5]).toEqual([4, 0, 3, 2]);
  });

  it("never holds more lines than it has", () => {
    const rng = createRng(7);
    const reads = Array.from({ length: 500 }, () => Math.floor(rng() * 400));
    const run = simulate(reads, small, true);
    expect(Math.max(...run.held.map((h) => h.length))).toBe(4);
  });

  it("counts the same misses with or without keeping a record of each step", () => {
    const rng = createRng(11);
    for (let t = 0; t < 20; t++) {
      const reads = Array.from({ length: 300 }, () => Math.floor(rng() * 200));
      const config = { lineSize: 1 + (t % 9), lines: 1 + (t % 6) };
      expect(countMisses(reads, config)).toBe(simulate(reads, config).misses);
    }
  });

  it("puts each address in the line its index says", () => {
    expect([lineOf(0, 8), lineOf(7, 8), lineOf(8, 8), lineOf(63, 8)]).toEqual([0, 0, 1, 7]);
  });

  it("refuses a cache with no room", () => {
    expect(() => simulate([1], { lineSize: 8, lines: 0 })).toThrow(RangeError);
  });
});

describe("the same sum, two orders (section 2)", () => {
  it("reads every number exactly once either way", () => {
    expect([...rowOrder(8, 8)].sort((a, b) => a - b)).toEqual(
      [...columnOrder(8, 8)].sort((a, b) => a - b),
    );
    expect(new Set(columnOrder(8, 8)).size).toBe(64);
  });

  it("row by row: one miss per line, seven free neighbours after it", () => {
    expect(simulate(rowOrder(8, 8), small).misses).toBe(8);
  });

  it("column by column, with room for half the lines: every read a miss", () => {
    expect(simulate(columnOrder(8, 8), small).misses).toBe(64);
  });

  it("column by column with room for every line: as good as rows", () => {
    // The cliff is capacity: once a whole column's lines fit, nothing is
    // pushed out before it is used again.
    expect(simulate(columnOrder(8, 8), { lineSize: 8, lines: 8 }).misses).toBe(8);
  });
});

describe("stride (section 3)", () => {
  it("touches every number exactly once, for any stride", () => {
    for (const s of [1, 2, 3, 8, 13, 64]) {
      const order = strideOrder(1000, s);
      expect(order.length, `stride ${s}`).toBe(1000);
      expect(new Set(order).size, `stride ${s}`).toBe(1000);
    }
  });

  it("misses once per line until the stride reaches a line, then on every read", () => {
    const n = 8192;
    const config = { lineSize: 8, lines: 32 };
    for (const s of [1, 2, 4, 8, 16, 32, 64]) {
      expect(countMisses(strideOrder(n, s), config) / n, `stride ${s}`).toBe(Math.min(1, s / 8));
    }
  });
});

describe("loop order in a matrix product (section 4)", () => {
  const model = (order: LoopOrder) => productMisses(order, 16, { lineSize: 8, lines: 8 });

  it("makes three reads per innermost step, n³ steps", () => {
    const { addresses, matrices } = productReads("ijk", 4);
    expect(addresses.length).toBe(3 * 64);
    expect(matrices.slice(0, 3)).toEqual(["A", "B", "C"]);
  });

  it("reads the same numbers in every order", () => {
    const sorted = (o: LoopOrder) => [...productReads(o, 4).addresses].sort((a, b) => a - b);
    for (const order of LOOP_ORDERS) expect(sorted(order), order).toEqual(sorted("ijk"));
  });

  it("names how the inner loop walks each matrix", () => {
    expect(["A", "B", "C"].map((m) => innerWalk("ijk", m as "A"))).toEqual([
      "row",
      "column",
      "still",
    ]);
    expect(["A", "B", "C"].map((m) => innerWalk("ikj", m as "A"))).toEqual(["still", "row", "row"]);
    expect(["A", "B", "C"].map((m) => innerWalk("jki", m as "A"))).toEqual([
      "column",
      "still",
      "column",
    ]);
  });

  it("ranks the orders in three pairs: inner j, then inner k, then inner i", () => {
    const total = (o: LoopOrder) => model(o).perStep.total;
    const best = Math.max(total("ikj"), total("kij"));
    const middle = [total("ijk"), total("jik")];
    const worst = Math.min(total("jki"), total("kji"));
    for (const m of middle) {
      expect(m).toBeGreaterThan(best * 4);
      expect(worst).toBeGreaterThan(m * 1.5);
    }
  });

  it("puts a column walk at about one miss per step, and a row walk at about one per line", () => {
    const jki = model("jki").perStep;
    expect(jki.A).toBeCloseTo(1, 1);
    expect(jki.C).toBeCloseTo(1, 1);
    expect(model("ijk").perStep.B).toBeCloseTo(1, 1);
    expect(model("ikj").perStep.B).toBeCloseTo(1 / 8, 2);
  });
});
