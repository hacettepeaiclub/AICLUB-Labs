import { describe, expect, it } from "vitest";
import {
  LEVELS,
  allRankings,
  bestPair,
  bitsOf,
  factorial,
  hiddenRanks,
  isKnown,
  isSolved,
  knownOrder,
  lowerBound,
  newBoard,
  remaining,
  rivalWeighings,
  stubbornAnswer,
  weigh,
} from "./balance";

function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

describe("the orders", () => {
  it("lists every permutation exactly once", () => {
    for (const n of [1, 3, 5, 8]) {
      const r = allRankings(n);
      expect(r.length).toBe(factorial(n) * n);
      const seen = new Set<string>();
      for (let p = 0; p < factorial(n); p++) {
        const ranks = Array.from(r.subarray(p * n, p * n + n));
        expect([...ranks].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
        seen.add(ranks.join());
      }
      expect(seen.size).toBe(factorial(n));
    }
  });

  it("states the bound the game is played against: 7 for five boxes, 16 for eight", () => {
    expect(lowerBound(5)).toBe(7);
    expect(lowerBound(8)).toBe(16);
    expect(LEVELS.map((l) => lowerBound(l.boxes))).toEqual([7, 16, 16]);
    expect(LEVELS.filter((l) => l.stubborn).map((l) => l.id)).toEqual(["stubborn"]);
  });
});

describe("a weighing", () => {
  it("tells the truth and keeps only the orders that agree with it", () => {
    const ranks = [2, 0, 4, 1, 3];
    let board = newBoard(5, ranks);
    board = weigh(board, 0, 1);
    const w = board.history[0]!;
    expect(w.leftHeavier).toBe(true);
    // Box 0 above box 1 in exactly half of all orders.
    expect(remaining(board)).toBe(60);
    expect(bitsOf(w)).toBeCloseTo(1, 12);
  });

  it("is worth nothing when its answer is already implied", () => {
    // 0 < 1 and 1 < 2, so 0 < 2 is already known.
    let board = newBoard(5, [0, 1, 2, 3, 4]);
    board = weigh(board, 1, 0);
    board = weigh(board, 2, 1);
    expect(isKnown(board, 0, 2)).toBe(true);
    const before = remaining(board);
    board = weigh(board, 2, 0);
    expect(remaining(board)).toBe(before);
    expect(bitsOf(board.history[2]!)).toBe(0);
  });

  it("never loses the true order", () => {
    const rng = lcg(1);
    const ranks = hiddenRanks(8, rng);
    let board = newBoard(8, ranks);
    for (let i = 0; i < 30 && !isSolved(board); i++) {
      board = weigh(board, Math.floor(rng() * 8), Math.floor(rng() * 8));
    }
    const truth = ranks.join();
    let found = false;
    for (const p of board.alive) {
      if (Array.from(board.rankings.subarray(p * 8, p * 8 + 8)).join() === truth) found = true;
    }
    expect(found).toBe(true);
  });

  it("can be lucky: a run may finish under the bound", () => {
    // Three boxes need ⌈log₂ 6⌉ = 3 weighings to guarantee, but two answers
    // in a row can settle it.
    let board = newBoard(3, [0, 1, 2]);
    board = weigh(board, 1, 0);
    board = weigh(board, 2, 1);
    expect(isSolved(board)).toBe(true);
    expect(board.history.length).toBeLessThan(lowerBound(3));
  });
});

describe("the stubborn balance", () => {
  it("holds every strategy to the bound, and never contradicts itself", () => {
    const rng = lcg(2);
    const strategies = {
      halving: (b: ReturnType<typeof newBoard>) => bestPair(b)!,
      random: (b: ReturnType<typeof newBoard>) => {
        for (;;) {
          const x = Math.floor(rng() * b.n);
          const y = Math.floor(rng() * b.n);
          if (x !== y && !isKnown(b, x, y)) return [x, y] as [number, number];
        }
      },
    };
    for (const n of [5, 8]) {
      for (const [name, pick] of Object.entries(strategies)) {
        let board = newBoard(n, hiddenRanks(n, rng));
        while (!isSolved(board)) {
          const [x, y] = pick(board);
          const before = remaining(board);
          board = weigh(board, x, y, stubbornAnswer(board, x, y));
          // Never more than half removed, and never all of them.
          expect(remaining(board) * 2).toBeGreaterThanOrEqual(before);
          expect(remaining(board)).toBeGreaterThan(0);
        }
        expect(board.history.length, `${name} n=${n}`).toBeGreaterThanOrEqual(lowerBound(n));
      }
    }
  });
});

describe("when it is solved", () => {
  it("knows the true order", () => {
    const ranks = hiddenRanks(8, lcg(3));
    let board = newBoard(8, ranks);
    while (!isSolved(board)) {
      const pair = bestPair(board)!;
      board = weigh(board, pair[0], pair[1]);
    }
    const order = knownOrder(board);
    expect(order.map((b) => ranks[b])).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
});

describe("the rival", () => {
  it("halves the first weighing and finishes close to the bound", () => {
    const board = newBoard(8, hiddenRanks(8, lcg(4)));
    expect(bestPair(board)).not.toBeNull();
    const rng = lcg(5);
    for (const n of [5, 8]) {
      for (let g = 0; g < 6; g++) {
        const count = rivalWeighings(n, hiddenRanks(n, rng));
        expect(count, `n=${n}`).toBeGreaterThanOrEqual(lowerBound(n) - 2);
        expect(count, `n=${n}`).toBeLessThanOrEqual(lowerBound(n) + 2);
      }
    }
  });
});
