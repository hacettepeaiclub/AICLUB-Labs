import { describe, expect, it } from "vitest";
import { judgeCollide, judgePerfect, judgeSize } from "./puzzles";

describe("same hash, different strings", () => {
  it("is solved by Aa and BB", () => {
    expect(judgeCollide("Aa", "BB").solved).toBe(true);
    expect(judgeCollide("AaAa", "BBBB").solved).toBe(true);
  });
  it("refuses the same string twice, and near misses", () => {
    expect(judgeCollide("Aa", "Aa").solved).toBe(false);
    expect(judgeCollide("Ab", "BB").solved).toBe(false);
    expect(judgeCollide("", "").solved).toBe(false);
  });
});

describe("a size with no collisions", () => {
  it("passes exactly the sizes where m / gcd(10, m) reaches 16", () => {
    const passing = Array.from({ length: 17 }, (_, i) => 16 + i).filter(
      (m) => judgeSize(String(m)).solved,
    );
    expect(passing).toEqual([17, 19, 21, 23, 27, 29, 31, 32]);
  });
  it("shows how badly a power of two does", () => {
    expect(judgeSize("16").distinct).toBe(8);
    expect(judgeSize("20").distinct).toBe(2);
    expect(judgeSize("15").m).toBeNull();
    expect(judgeSize("abc").m).toBeNull();
  });
});

describe("eight words, eight buckets", () => {
  it("is solvable, and judged by bucket", () => {
    // Found by search; any eight words with distinct buckets pass.
    const words: string[] = [];
    const taken = new Set<number>();
    for (let i = 0; words.length < 8; i++) {
      const w = `w${i}`;
      const verdict = judgePerfect([w]);
      const b = verdict.buckets[0];
      if (b !== null && b !== undefined && !taken.has(b)) {
        taken.add(b);
        words.push(w);
      }
    }
    expect(judgePerfect(words).solved).toBe(true);
    const clashing = [...words.slice(0, 7), words[0] ?? ""];
    expect(judgePerfect(clashing).rules.unique).toBe(false);
    expect(judgePerfect(["a", "b", "c", "d", "e", "f", "g", "i"]).rules.spread).toBe(false);
  });
});
