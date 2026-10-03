import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  bucketOf,
  chain,
  chainedSuccess,
  chainSuccessExact,
  clusters,
  collisionChance,
  EMPTY,
  evenOdds,
  firstCollision,
  floorMod,
  gcd,
  grow,
  hashSteps,
  javaHash,
  linear,
  linearInsertTheory,
  linearSuccessTheory,
  mean,
  probe,
} from "./engine";

/** Java's specification, computed with exact integers and reduced at the end. */
function referenceHash(s: string): number {
  let h = 0n;
  for (let i = 0; i < s.length; i++) h = h * 31n + BigInt(s.charCodeAt(i));
  return Number(BigInt.asIntN(32, h));
}

const randomHomes = (n: number, m: number, seed: number) => {
  const rng = createRng(seed);
  return Array.from({ length: n }, () => Math.floor(rng() * m));
};

describe("javaHash", () => {
  it("matches the specification, overflow and all", () => {
    const rng = createRng(1);
    for (let t = 0; t < 2000; t++) {
      const length = Math.floor(rng() * 24);
      let s = "";
      for (let i = 0; i < length; i++) s += String.fromCharCode(Math.floor(rng() * 0xffff));
      expect(javaHash(s)).toBe(referenceHash(s));
    }
  });

  it("gives the values Java gives", () => {
    // Values printed by `"…".hashCode()` on a JVM, and checked here by hand:
    // "a" is 97; "ab" is 97·31 + 98.
    expect(javaHash("")).toBe(0);
    expect(javaHash("a")).toBe(97);
    expect(javaHash("ab")).toBe(97 * 31 + 98);
    expect(javaHash("hello")).toBe(99162322);
    expect(javaHash("polygenelubricants")).toBe(-2147483648);
  });

  it("collides on Aa and BB, and on anything built from them", () => {
    expect(javaHash("Aa")).toBe(2112);
    expect(javaHash("BB")).toBe(2112);
    expect(javaHash("AaAa")).toBe(javaHash("BBBB"));
    expect(javaHash("AaBB")).toBe(javaHash("BBAa"));
  });

  it("shows its working", () => {
    const steps = hashSteps("Hi");
    expect(steps).toEqual([
      { char: "H", code: 72, hash: 72 },
      { char: "i", code: 105, hash: 72 * 31 + 105 },
    ]);
  });
});

describe("buckets", () => {
  it("are never negative", () => {
    expect(floorMod(-1, 16)).toBe(15);
    expect(floorMod(-2147483648, 16)).toBe(0);
    expect(bucketOf("polygenelubricants", 7)).toBe(floorMod(-2147483648, 7));
    for (const w of ["a", "zebra", "Ünlü", "日本"]) {
      const b = bucketOf(w, 16);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(16);
    }
  });

  it("use only m / gcd(step, m) of them for keys spaced by a step", () => {
    for (const m of [8, 12, 16, 17, 31, 32]) {
      for (let step = 1; step <= 12; step++) {
        const used = new Set(Array.from({ length: 64 }, (_, i) => floorMod(i * step, m)));
        expect({ m, step, used: used.size }).toEqual({ m, step, used: m / gcd(step, m) });
      }
    }
  });
});

describe("chaining", () => {
  it("costs k + 1 to find the key in place k", () => {
    const buckets = chain([0, 0, 0, 1], 4);
    expect(buckets).toEqual([[0, 1, 2], [3], [], []]);
    expect(chainedSuccess(buckets)).toBe((1 + 2 + 3 + 1) / 4);
  });

  it("averages 1 + (n − 1)/2m over random tables", () => {
    for (const [n, m] of [
      [64, 64],
      [192, 64],
      [32, 128],
    ] as const) {
      let total = 0;
      const trials = 2000;
      for (let t = 0; t < trials; t++) total += chainedSuccess(chain(randomHomes(n, m, t + 1), m));
      expect(total / trials).toBeCloseTo(chainSuccessExact(n, m), 2);
    }
  });
});

describe("linear probing", () => {
  it("steps right and wraps", () => {
    const table = new Int32Array(4).fill(EMPTY);
    table[3] = 0;
    table[0] = 1;
    expect(probe(table, 3)).toEqual({ slot: 1, probes: 3, path: [3, 0, 1] });
    table[1] = 2;
    table[2] = 3;
    expect(probe(table, 0)).toBeNull();
  });

  it("finds clusters, including one across the wrap", () => {
    const t = Int32Array.from([0, 1, EMPTY, 2, EMPTY, 3, 4, 5]);
    expect(clusters(t)).toEqual([
      [3, 1],
      [5, 5],
    ]);
    expect(clusters(new Int32Array(3).fill(EMPTY))).toEqual([]);
  });

  it("matches Knuth's estimates on large random tables", () => {
    const m = 4096;
    for (const alpha of [0.25, 0.5, 0.75, 0.9]) {
      const n = Math.round(alpha * m);
      const trials = 30;
      let success = 0;
      let miss = 0;
      for (let t = 0; t < trials; t++) {
        const { table, costs } = linear(randomHomes(n, m, 100 + t), m);
        success += mean(costs);
        // An unsuccessful search from every possible home slot: the exact
        // expected cost of a miss, for this table.
        let total = 0;
        for (let home = 0; home < m; home++) total += probe(table, home)?.probes ?? 0;
        miss += total / m;
      }
      const near = (measured: number, theory: number, within: number) =>
        expect({ alpha, off: Math.abs(measured - theory) / theory < within }).toEqual({
          alpha,
          off: true,
        });
      near(success / trials, linearSuccessTheory(alpha), alpha >= 0.9 ? 0.06 : 0.03);
      near(miss / trials, linearInsertTheory(alpha), alpha >= 0.9 ? 0.15 : 0.05);
    }
  });

  it("is far worse than chaining near full", () => {
    expect(linearSuccessTheory(0.9)).toBeCloseTo(5.5, 12);
    expect(linearInsertTheory(0.9)).toBeCloseTo(50.5, 10);
    expect(linearSuccessTheory(0.5)).toBe(1.5);
    expect(linearInsertTheory(0.5)).toBe(2.5);
  });
});

describe("the birthday problem", () => {
  it("passes even odds at 23 people for 365 days", () => {
    expect(collisionChance(22, 365)).toBeLessThan(0.5);
    expect(collisionChance(23, 365)).toBeCloseTo(0.5072972343, 9);
    expect(evenOdds(365)).toBe(23);
  });

  it("is certain once there are more keys than buckets", () => {
    expect(collisionChance(17, 16)).toBe(1);
    expect(collisionChance(1, 16)).toBe(0);
    expect(evenOdds(16)).toBe(5);
    expect(evenOdds(1000)).toBe(38);
  });

  it("agrees with simulation", () => {
    const rng = createRng(9);
    const m = 365;
    const trials = 20000;
    let by23 = 0;
    for (let t = 0; t < trials; t++) if (firstCollision(m, rng) <= 23) by23++;
    expect(by23 / trials).toBeCloseTo(collisionChance(23, m), 1);
  });
});

describe("growing by doubling", () => {
  it("resizes where HashMap's thresholds are, and doubles", () => {
    const steps = grow(100);
    const resizes = steps.flatMap((s, i) => (s.cost > 1 ? [i + 1] : []));
    expect(resizes).toEqual([13, 25, 49, 97]);
    expect(steps[12]).toEqual({ cost: 13, capacity: 32 });
    expect(steps.at(-1)?.capacity).toBe(256);
  });

  it("averages under 3 units of work per key, at every size", () => {
    let total = 0;
    grow(5000).forEach((s, i) => {
      total += s.cost;
      expect(total / (i + 1)).toBeLessThan(3);
    });
  });
});
