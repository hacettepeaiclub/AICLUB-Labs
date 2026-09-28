import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  DOORS,
  EMPTY_TALLY,
  THEORETICAL,
  add,
  playRound,
  rateOf,
  resolve,
  simulate as montySimulate,
  type Door,
} from "./engine/montyHall";
import {
  DAYS,
  fillRoom,
  firstAbove,
  noSharedProbability,
  pairCount,
  sharedProbability,
  simulate as birthdaySimulate,
} from "./engine/birthday";
import { CLUES, OUTCOMES, PRIOR, analyse, isBothBoys, satisfies } from "./engine/conditional";
import {
  DEFAULT_SMALL_SHARE,
  GROUPS,
  RATES,
  TREATMENTS,
  TRIALS_PER_TREATMENT,
  build,
  cellOf,
  published,
} from "./engine/simpson";
import {
  DEFAULT_ROWS,
  MAX_ROWS,
  MIN_ROWS,
  binomialDistribution,
  dropBall,
  expectedCounts,
  pascalRow,
  pathCount,
  peakOf,
  runBoard,
  totalPaths,
} from "./engine/pascal";
import {
  RIGHT_PROBABILITY,
  SCALES,
  checkpoints,
  firstOutcomes,
  run as lawRun,
  widestDeviation,
} from "./engine/largeNumbers";
import { GaltonWorld, PHYSICS, geometryOf, runHeadless } from "./engine/galtonPhysics";

// ========================================================== Monty Hall =====

describe("Monty Hall", () => {
  it("states the theoretical probabilities as exact thirds", () => {
    expect(THEORETICAL.stay).toBeCloseTo(1 / 3, 15);
    expect(THEORETICAL.switch).toBeCloseTo(2 / 3, 15);
    expect(THEORETICAL.stay + THEORETICAL.switch).toBeCloseTo(1, 15);
  });

  it("never opens the picked door and never opens the car — every case", () => {
    // All nine (car, pick) pairs, both host tie-breaks. Exhaustive, so this is
    // a proof rather than a sample.
    for (const car of DOORS) {
      for (const picked of DOORS) {
        for (const hostChoice of [0, 0.99]) {
          const round = resolve(car, picked, hostChoice);
          expect(round.opened, `car=${car} pick=${picked}`).not.toBe(picked);
          expect(round.opened, `car=${car} pick=${picked}`).not.toBe(car);
          // The switch door is the third one, and is neither of the others.
          expect(round.other).not.toBe(picked);
          expect(round.other).not.toBe(round.opened);
          expect(new Set([picked, round.opened, round.other]).size).toBe(3);
        }
      }
    }
  });

  it("wins by staying exactly when the first pick was the car", () => {
    for (const car of DOORS) {
      for (const picked of DOORS) {
        const round = resolve(car, picked, 0);
        expect(round.stayWins).toBe(picked === car);
        expect(round.switchWins).toBe(picked !== car);
        // Exactly one strategy wins any given round.
        expect(round.stayWins !== round.switchWins).toBe(true);
      }
    }
  });

  it("switching lands on the car exactly when staying does not", () => {
    for (const car of DOORS) {
      for (const picked of DOORS) {
        const round = resolve(car, picked, 0);
        expect(round.other === car).toBe(round.switchWins);
      }
    }
  });

  it("uses both goats when the host has a choice, and only one when it does not", () => {
    // Pick is the car: two goats available, tie-break decides.
    expect(resolve(0, 0, 0).opened).toBe(1);
    expect(resolve(0, 0, 0.99).opened).toBe(2);
    // Pick is a goat: the host is forced.
    expect(resolve(0, 1, 0).opened).toBe(2);
    expect(resolve(0, 1, 0.99).opened).toBe(2);
  });

  it("keeps stay + switch equal to the round count, always", () => {
    for (const seed of [1, 7, 12345]) {
      const tally = montySimulate(seed, 500);
      expect(tally.stayWins + tally.switchWins).toBe(tally.rounds);
      expect(tally.rounds).toBe(500);
    }
  });

  it("simulates near the theoretical rates over a long deterministic run", () => {
    for (const seed of [1, 42, 2026]) {
      const tally = montySimulate(seed, 20000);
      const stay = rateOf(tally.stayWins, tally.rounds)!;
      const switched = rateOf(tally.switchWins, tally.rounds)!;
      // Three standard errors at n = 20000 is about 0.010; 0.02 is comfortable
      // and still tight enough to fail if the host rules were wrong (a random
      // host would sit at 0.5).
      expect(Math.abs(stay - 1 / 3), `seed ${seed} stay ${stay}`).toBeLessThan(0.02);
      expect(Math.abs(switched - 2 / 3), `seed ${seed} switch ${switched}`).toBeLessThan(0.02);
    }
  });

  it("is reproducible from its seed, and two seeds are two runs", () => {
    expect(montySimulate(99, 300)).toEqual(montySimulate(99, 300));
    // Compared as sequences, not as tallies: two different runs can easily
    // land on the same win counts, so equal totals would not have shown that
    // the seed does anything.
    const sequence = (seed: number) => {
      const rng = createRng(seed);
      return Array.from({ length: 60 }, () => {
        const round = playRound(rng);
        return `${round.car}${round.picked}${round.opened}`;
      }).join(" ");
    };
    expect(sequence(99)).toBe(sequence(99));
    expect(sequence(99)).not.toBe(sequence(100));
  });

  it("accumulates hand-played rounds the same way the batch does", () => {
    const rng = createRng(5);
    let tally = EMPTY_TALLY;
    for (let i = 0; i < 400; i++) tally = add(tally, playRound(rng));
    expect(tally).toEqual(montySimulate(5, 400));
  });

  it("reports no rate before a round has been played", () => {
    expect(rateOf(0, 0)).toBeNull();
    expect(rateOf(1, 2)).toBe(0.5);
  });

  it("visits every door as the car over a long run", () => {
    // Guards against a generator that quietly favours one placement.
    const rng = createRng(3);
    const seen = new Map<Door, number>();
    for (let i = 0; i < 3000; i++) {
      const round = playRound(rng);
      seen.set(round.car, (seen.get(round.car) ?? 0) + 1);
    }
    for (const door of DOORS) expect(seen.get(door) ?? 0).toBeGreaterThan(800);
  });
});

// ============================================================ Birthday =====

describe("the birthday problem", () => {
  it("has no collision below two people", () => {
    expect(sharedProbability(0)).toBe(0);
    expect(sharedProbability(1)).toBe(0);
    expect(noSharedProbability(1)).toBe(1);
  });

  it("gives exactly 1/365 for two people", () => {
    expect(sharedProbability(2)).toBeCloseTo(1 / DAYS, 15);
  });

  it("matches the known values at 23 and 50", () => {
    expect(sharedProbability(23)).toBeCloseTo(0.5072972343, 9);
    expect(sharedProbability(50)).toBeCloseTo(0.9703735796, 9);
  });

  it("crosses one half at 23, and not before", () => {
    expect(firstAbove(0.5)).toBe(23);
    expect(sharedProbability(22)).toBeLessThan(0.5);
    expect(sharedProbability(23)).toBeGreaterThan(0.5);
  });

  it("finds the other thresholds people quote", () => {
    expect(firstAbove(0.9)).toBe(41);
    expect(firstAbove(0.99)).toBe(57);
  });

  it("is monotonic, and never leaves [0, 1]", () => {
    let previous = -1;
    for (let n = 0; n <= 400; n++) {
      const p = sharedProbability(n);
      expect(p, `n=${n}`).toBeGreaterThanOrEqual(previous);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
      previous = p;
    }
  });

  it("is certain once there are more people than days", () => {
    expect(sharedProbability(DAYS + 1)).toBe(1);
    expect(sharedProbability(1000)).toBe(1);
    expect(noSharedProbability(DAYS + 1)).toBe(0);
  });

  it("is not *mathematically* certain at exactly 365, only unrepresentably close", () => {
    // P(all distinct | n = 365) is 365!/365^365, about 1.45e-157. That is a
    // perfectly ordinary double, so the complement is the thing to test: the
    // subtraction 1 - 1.45e-157 rounds to exactly 1, and asserting
    // sharedProbability(365) < 1 would be asserting something binary64 cannot
    // represent rather than something the model says.
    expect(noSharedProbability(DAYS)).toBeGreaterThan(0);
    expect(noSharedProbability(DAYS)).toBeLessThan(1e-100);
    expect(sharedProbability(DAYS)).toBe(1);
  });

  it("counts pairs, which is the quantity that grows", () => {
    expect(pairCount(1)).toBe(0);
    expect(pairCount(2)).toBe(1);
    expect(pairCount(23)).toBe(253);
  });

  it("fills a reproducible room and reports a real collision", () => {
    const room = fillRoom(11, 30);
    expect(room.birthdays).toHaveLength(30);
    for (const day of room.birthdays) {
      expect(day).toBeGreaterThanOrEqual(0);
      expect(day).toBeLessThan(DAYS);
    }
    expect(fillRoom(11, 30)).toEqual(room);
    if (room.match) {
      const [i, j] = room.match;
      expect(i).toBeLessThan(j);
      // The reported pair really do share a day.
      expect(room.birthdays[i]).toBe(room.birthdays[j]);
    }
  });

  it("reports no match when every birthday is distinct", () => {
    const room = fillRoom(4, 2);
    const distinct = new Set(room.birthdays).size === room.birthdays.length;
    expect(room.match === null).toBe(distinct);
  });

  it("simulates near the closed form, by an independent route", () => {
    for (const n of [10, 23, 40]) {
      const trial = birthdaySimulate(2026, n, 4000);
      const observed = trial.withMatch / trial.rooms;
      expect(Math.abs(observed - sharedProbability(n)), `n=${n} saw ${observed}`).toBeLessThan(
        0.03,
      );
    }
  });
});

// ========================================================= Conditional =====

describe("two children", () => {
  it("starts from four equally likely ordered outcomes", () => {
    expect(OUTCOMES).toHaveLength(4);
    expect(OUTCOMES.map((o) => o.id)).toEqual(["GG", "GB", "BG", "BB"]);
    expect(PRIOR).toBe(0.25);
    expect(OUTCOMES.length * PRIOR).toBe(1);
  });

  it("distinguishes birth order: GB and BG are different outcomes", () => {
    const ids = OUTCOMES.map((o) => o.id);
    expect(ids).toContain("GB");
    expect(ids).toContain("BG");
    expect(new Set(ids).size).toBe(4);
  });

  it("rules out only GG when at least one is a boy, giving 1/3", () => {
    const analysis = analyse("atLeastOneBoy");
    expect(analysis.ruledOut.map((o) => o.id)).toEqual(["GG"]);
    expect(analysis.kept.map((o) => o.id)).toEqual(["GB", "BG", "BB"]);
    expect(analysis.favourable).toBe(1);
    expect(analysis.probability).toBeCloseTo(1 / 3, 15);
  });

  it("rules out both girl-first outcomes when the first is a boy, giving 1/2", () => {
    const analysis = analyse("firstIsBoy");
    expect(analysis.ruledOut.map((o) => o.id)).toEqual(["GG", "GB"]);
    expect(analysis.kept.map((o) => o.id)).toEqual(["BG", "BB"]);
    expect(analysis.favourable).toBe(1);
    expect(analysis.probability).toBeCloseTo(1 / 2, 15);
  });

  it("shows the two clues are not the same information", () => {
    // The whole lesson: one clue leaves three possibilities standing, the
    // other leaves two, and BB survives both.
    const loose = analyse("atLeastOneBoy");
    const strict = analyse("firstIsBoy");
    expect(loose.kept.length).toBe(3);
    expect(strict.kept.length).toBe(2);
    expect(loose.probability).not.toBeCloseTo(strict.probability, 6);
    // "First is a boy" implies "at least one is a boy", never the reverse.
    for (const outcome of OUTCOMES) {
      if (satisfies(outcome, "firstIsBoy")) expect(satisfies(outcome, "atLeastOneBoy")).toBe(true);
    }
    expect(satisfies({ children: ["G", "B"], id: "GB" }, "atLeastOneBoy")).toBe(true);
    expect(satisfies({ children: ["G", "B"], id: "GB" }, "firstIsBoy")).toBe(false);
  });

  it("keeps every survivor consistent with its clue", () => {
    for (const clue of CLUES) {
      const analysis = analyse(clue);
      for (const outcome of analysis.kept) expect(satisfies(outcome, clue)).toBe(true);
      for (const outcome of analysis.ruledOut) expect(satisfies(outcome, clue)).toBe(false);
      expect(analysis.kept.length + analysis.ruledOut.length).toBe(OUTCOMES.length);
      expect(analysis.favourable).toBe(analysis.kept.filter(isBothBoys).length);
    }
  });
});

// ============================================================= Simpson =====

describe("Simpson's paradox", () => {
  it("reproduces the published table at the default allocation", () => {
    const table = published();
    const expected = [
      ["small", "a", 87, 81],
      ["small", "b", 270, 234],
      ["large", "a", 263, 192],
      ["large", "b", 80, 55],
    ] as const;
    for (const [group, treatment, trials, successes] of expected) {
      const cell = cellOf(table, group, treatment);
      expect(cell, `${group}/${treatment}`).toBeDefined();
      expect(cell!.trials).toBe(trials);
      expect(cell!.successes).toBe(successes);
    }
    expect(table.overall.a).toMatchObject({ trials: 350, successes: 273 });
    expect(table.overall.b).toMatchObject({ trials: 350, successes: 289 });
  });

  it("computes every rate from the counts beside it", () => {
    for (const share of [DEFAULT_SMALL_SHARE, { a: 175, b: 175 }, { a: 10, b: 340 }]) {
      const table = build(share);
      for (const cell of table.cells) {
        expect(cell.rate).toBe(cell.trials === 0 ? null : cell.successes / cell.trials);
      }
      for (const treatment of TREATMENTS) {
        const mine = table.cells.filter((c) => c.treatment === treatment);
        const trials = mine.reduce((s, c) => s + c.trials, 0);
        const successes = mine.reduce((s, c) => s + c.successes, 0);
        expect(table.overall[treatment].trials).toBe(trials);
        expect(table.overall[treatment].successes).toBe(successes);
        expect(table.overall[treatment].rate).toBe(successes / trials);
      }
    }
  });

  it("is a real reversal at the published allocation, not a rounding artefact", () => {
    const table = published();
    for (const group of GROUPS) {
      const a = cellOf(table, group, "a")!;
      const b = cellOf(table, group, "b")!;
      // A genuinely leads in both groups, by a visible margin.
      expect(a.rate! - b.rate!, `${group}`).toBeGreaterThan(0.02);
    }
    // And genuinely trails overall.
    expect(table.overall.b.rate! - table.overall.a.rate!).toBeGreaterThan(0.02);
    expect(table.reversed).toBe(true);
  });

  it("stops reversing once the allocations match", () => {
    // The lesson: the reversal is caused by the allocation, so removing the
    // imbalance removes it.
    const even = build({ a: 175, b: 175 });
    expect(even.reversed).toBe(false);
    expect(even.overall.a.rate!).toBeGreaterThan(even.overall.b.rate!);
    for (const group of GROUPS) {
      const a = cellOf(even, group, "a")!;
      const b = cellOf(even, group, "b")!;
      expect(a.rate!).toBeGreaterThan(b.rate!);
    }
  });

  it("keeps A ahead within every group at every allocation", () => {
    // Whatever the visitor does with the sliders, the within-group comparison
    // never flips — only the aggregate does.
    for (let a = 0; a <= TRIALS_PER_TREATMENT; a += 25) {
      for (let b = 0; b <= TRIALS_PER_TREATMENT; b += 25) {
        const table = build({ a, b });
        for (const group of GROUPS) {
          const cellA = cellOf(table, group, "a")!;
          const cellB = cellOf(table, group, "b")!;
          if (cellA.trials > 0 && cellB.trials > 0) {
            expect(cellA.rate!, `${group} a=${a} b=${b}`).toBeGreaterThan(cellB.rate!);
          }
        }
      }
    }
  });

  it("moves the overall rates when the allocation moves", () => {
    const heavySmall = build({ a: 340, b: 10 });
    const heavyLarge = build({ a: 10, b: 340 });
    expect(heavySmall.overall.a.rate!).toBeGreaterThan(heavyLarge.overall.a.rate!);
    expect(heavySmall.overall.b.rate!).toBeLessThan(heavyLarge.overall.b.rate!);
  });

  it("always assigns every patient to exactly one group", () => {
    for (const share of [{ a: 0, b: 350 }, { a: 350, b: 0 }, DEFAULT_SMALL_SHARE]) {
      const table = build(share);
      for (const treatment of TREATMENTS) {
        expect(table.overall[treatment].trials).toBe(TRIALS_PER_TREATMENT);
      }
      for (const cell of table.cells) {
        expect(cell.successes).toBeGreaterThanOrEqual(0);
        expect(cell.successes).toBeLessThanOrEqual(cell.trials);
      }
    }
  });

  it("clamps an allocation outside the arm size", () => {
    expect(build({ a: -50, b: 900 }).overall.a.trials).toBe(TRIALS_PER_TREATMENT);
    expect(cellOf(build({ a: -50, b: 900 }), "small", "a")!.trials).toBe(0);
    expect(cellOf(build({ a: -50, b: 900 }), "small", "b")!.trials).toBe(TRIALS_PER_TREATMENT);
  });

  it("keeps the published rates as exact fractions", () => {
    expect(RATES.small.a).toBeCloseTo(81 / 87, 15);
    expect(RATES.small.b).toBeCloseTo(234 / 270, 15);
    expect(RATES.large.a).toBeCloseTo(192 / 263, 15);
    expect(RATES.large.b).toBeCloseTo(55 / 80, 15);
    // A leads B in both groups at the source rates, which is the premise.
    expect(RATES.small.a).toBeGreaterThan(RATES.small.b);
    expect(RATES.large.a).toBeGreaterThan(RATES.large.b);
  });
});

// ===================================================== Pascal's balls ======

describe("Pascal's balls", () => {
  it("builds the triangle by addition, and knows its famous row", () => {
    expect(pascalRow(0)).toEqual([1]);
    expect(pascalRow(1)).toEqual([1, 1]);
    expect(pascalRow(4)).toEqual([1, 4, 6, 4, 1]);
    // The row the default board draws.
    expect(pascalRow(8)).toEqual([1, 8, 28, 56, 70, 56, 28, 8, 1]);
  });

  it("offers a default board inside the range it allows", () => {
    expect(DEFAULT_ROWS).toBeGreaterThanOrEqual(MIN_ROWS);
    expect(DEFAULT_ROWS).toBeLessThanOrEqual(MAX_ROWS);
  });

  it("is symmetric, and each entry is the sum of the two above it", () => {
    for (let n = 0; n <= MAX_ROWS; n++) {
      const row = pascalRow(n);
      expect(row).toHaveLength(n + 1);
      expect([...row].reverse()).toEqual(row);
      const above = pascalRow(n - 1 < 0 ? 0 : n - 1);
      if (n > 0) {
        for (let k = 1; k < n; k++) {
          expect({ n, k, value: row[k] }).toEqual({
            n,
            k,
            value: (above[k - 1] ?? 0) + (above[k] ?? 0),
          });
        }
      }
    }
  });

  it("counts every path the board admits, and splits them between the bins", () => {
    for (let n = MIN_ROWS; n <= MAX_ROWS; n++) {
      const row = pascalRow(n);
      expect(row.reduce((a, b) => a + b, 0)).toBe(totalPaths(n));
      expect(pathCount(n, 0)).toBe(1);
      expect(pathCount(n, n)).toBe(1);
    }
  });

  it("gives a distribution that sums to one and matches known values", () => {
    for (let n = MIN_ROWS; n <= MAX_ROWS; n++) {
      const dist = binomialDistribution(n);
      expect(dist.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
      expect(dist.every((p) => p >= 0 && p <= 1)).toBe(true);
    }
    // C(8,4)/2^8 = 70/256, and the two ends are 1/256 each.
    const eight = binomialDistribution(8);
    expect(eight[4]).toBeCloseTo(70 / 256, 12);
    expect(eight[0]).toBeCloseTo(1 / 256, 12);
    expect(eight[8]).toBeCloseTo(1 / 256, 12);
  });

  it("expects the balls back: the expected counts sum to the run size", () => {
    const expected = expectedCounts(8, 500);
    expect(expected.reduce((a, b) => a + b, 0)).toBeCloseTo(500, 9);
  });

  it("drops a ball into the bin its own steps add up to", () => {
    const rng = createRng(20260926);
    for (let i = 0; i < 200; i++) {
      const path = dropBall(rng, 10);
      expect(path.steps).toHaveLength(10);
      expect(path.bin).toBe(path.steps.filter(Boolean).length);
      expect(path.bin).toBeGreaterThanOrEqual(0);
      expect(path.bin).toBeLessThanOrEqual(10);
    }
  });

  it("keeps every ball: the bin counts add up to the run", () => {
    for (const balls of [1, 50, 5000]) {
      const board = runBoard(97531, 8, balls);
      expect(board.counts).toHaveLength(9);
      expect(board.counts.reduce((a, b) => a + b, 0)).toBe(balls);
      expect(board.counts.every((c) => c >= 0)).toBe(true);
    }
  });

  it("is reproducible from its seed, and two seeds are two runs", () => {
    const a = runBoard(4242, 8, 400, 5);
    const b = runBoard(4242, 8, 400, 5);
    const c = runBoard(4243, 8, 400, 5);
    expect(a.counts).toEqual(b.counts);
    expect(a.sample).toEqual(b.sample);
    expect(a.counts).not.toEqual(c.counts);
  });

  it("draws its sample from the run it counts, not from a second one", () => {
    const board = runBoard(4242, 8, 400, 6);
    expect(board.sample).toHaveLength(6);
    // The first six balls of a six-ball run are the same six balls.
    const six = runBoard(4242, 8, 6, 6);
    expect(board.sample).toEqual(six.sample);
  });

  it("lands near the theoretical shape over a long deterministic run", () => {
    const rows = 8;
    const balls = 200_000;
    const board = runBoard(13579, rows, balls);
    const dist = binomialDistribution(rows);
    for (let k = 0; k <= rows; k++) {
      const observed = (board.counts[k] ?? 0) / balls;
      expect(Math.abs(observed - (dist[k] ?? 0))).toBeLessThan(0.01);
    }
  });

  it("scales both histograms against one peak", () => {
    const board = runBoard(4242, 8, 400);
    const peak = peakOf(board);
    expect(peak).toBeGreaterThanOrEqual(Math.max(...board.counts));
    expect(peak).toBeGreaterThanOrEqual(Math.max(...expectedCounts(8, 400)));
  });
});

// ================================================ the law of large numbers ==

describe("the law of large numbers", () => {
  it("measures against an exact one half", () => {
    expect(RIGHT_PROBABILITY).toBe(0.5);
    expect(lawRun(1, 10).theoretical).toBe(0.5);
  });

  it("steps through the scales the experiment advertises", () => {
    expect([...SCALES]).toEqual([10, 100, 1000, 10000, 100000]);
    for (let i = 1; i < SCALES.length; i++) {
      expect(SCALES[i]! > SCALES[i - 1]!).toBe(true);
    }
  });

  it("records every early trial, then thins out, and always ends where it ends", () => {
    const marks = checkpoints(100_000);
    expect(marks[0]).toBe(1);
    expect(marks.slice(0, 100)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
    expect(marks[marks.length - 1]).toBe(100_000);
    // Strictly increasing, so no checkpoint is recorded twice.
    for (let i = 1; i < marks.length; i++) {
      expect(marks[i]! > marks[i - 1]!).toBe(true);
    }
    expect(checkpoints(10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("computes the proportion and the deviation from its own counts", () => {
    const result = lawRun(31337, 1000);
    for (const point of result.points) {
      expect(point.successes).toBeLessThanOrEqual(point.trials);
      expect(point.proportion).toBeCloseTo(point.successes / point.trials, 12);
      expect(point.deviation).toBeCloseTo(Math.abs(point.proportion - 0.5), 12);
      expect(point.deviation).toBeGreaterThanOrEqual(0);
    }
    expect(result.final.trials).toBe(1000);
    expect(result.final).toEqual(result.points[result.points.length - 1]);
  });

  it("is reproducible from its seed, and two seeds are two runs", () => {
    expect(lawRun(2024, 5000).final).toEqual(lawRun(2024, 5000).final);
    expect(lawRun(2024, 5000).final.successes).not.toBe(lawRun(2025, 5000).final.successes);
  });

  it("extends a shorter run rather than starting a different one", () => {
    // The same seed run longer must agree with itself everywhere it overlaps:
    // the curve grows to the right, it is not redrawn.
    const short = lawRun(8675309, 1000);
    const long = lawRun(8675309, 100_000);
    const byTrial = new Map(long.points.map((p) => [p.trials, p]));
    for (const point of short.points) {
      const later = byTrial.get(point.trials);
      if (later)
        expect({ n: point.trials, s: later.successes }).toEqual({
          n: point.trials,
          s: point.successes,
        });
    }
    expect(long.points.some((p) => p.trials === 1000)).toBe(true);
  });

  it("does not fall at every step, and the chart must not pretend it does", () => {
    // The honest claim is a tendency, not a monotone decrease. If this ever
    // stops holding, the copy that says so has become false.
    const result = lawRun(11235, 100_000);
    const rose = result.points.some(
      (point, i) => i > 0 && point.deviation > (result.points[i - 1]?.deviation ?? 0),
    );
    expect(rose).toBe(true);
  });

  it("still tends towards the theoretical probability over a long run", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const result = lawRun(seed, 100_000);
      expect(result.final.deviation).toBeLessThan(0.01);
    }
  });

  it("shows the run's own first outcomes, not a second experiment", () => {
    const outcomes = firstOutcomes(555, 40);
    expect(outcomes).toHaveLength(40);
    const successes = outcomes.filter(Boolean).length;
    expect(lawRun(555, 40).final.successes).toBe(successes);
  });

  it("takes its vertical scale from the data", () => {
    const result = lawRun(4242, 1000);
    const widest = widestDeviation(result.points);
    expect(widest).toBeGreaterThan(0);
    expect(result.points.every((p) => p.deviation <= widest)).toBe(true);
  });
});

// ================================================== the physical board =====

describe("the physical Galton board", () => {
  it("is reproducible from its seed, and two seeds are two runs", () => {
    const a = runHeadless(8, 4242, 40);
    const b = runHeadless(8, 4242, 40);
    const c = runHeadless(8, 9999, 40);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it("lands every ball it releases, in a bin that exists", () => {
    for (const rows of [4, 8, 12]) {
      const bins = runHeadless(rows, 31337, 30);
      expect(bins).toHaveLength(30);
      for (const bin of bins) {
        expect(Number.isInteger(bin)).toBe(true);
        expect(bin).toBeGreaterThanOrEqual(0);
        expect(bin).toBeLessThanOrEqual(rows);
      }
    }
  });

  it("records exactly one outcome per ball, and keeps none of them alive", () => {
    const world = new GaltonWorld(8, 20260926);
    world.queue(25);
    const bins: number[] = [];
    let steps = 0;
    while (world.busy && steps < 20000) {
      bins.push(...world.step());
      steps += 1;
    }
    expect(bins).toHaveLength(25);
    expect(world.active).toBe(0);
    expect(world.pending).toBe(0);
    expect(world.busy).toBe(false);
    // Nothing was abandoned: the geometry settles every ball it releases.
    expect(world.lost).toBe(0);
  });

  it("starts empty, and a rebuilt board is an empty board", () => {
    const world = new GaltonWorld(8, 7);
    expect(world.active).toBe(0);
    expect(world.pending).toBe(0);
    expect(world.busy).toBe(false);
    world.queue(3);
    expect(world.busy).toBe(true);
    // The stage rebuilds rather than mutating, so a fresh world is the reset.
    expect(new GaltonWorld(8, 7).busy).toBe(false);
  });

  it("changes its geometry with the row count", () => {
    const small = geometryOf(4);
    const large = geometryOf(12);
    expect(large.rows).toBe(12);
    expect(large.width).toBeGreaterThan(small.width);
    expect(large.height).toBeGreaterThan(small.height);
    expect(small.binTop).toBeLessThan(small.floorY);
  });

  it("uses a fixed step and a real substep count", () => {
    expect(PHYSICS.stepMs).toBeCloseTo(1000 / 120, 9);
    expect(PHYSICS.substeps).toBeGreaterThanOrEqual(1);
    expect(PHYSICS.maxSteps).toBeGreaterThan(0);
  });

  it("is a different model from the ideal one, and is not tuned to match it", () => {
    // The physical board is allowed to disagree with the binomial, and on this
    // configuration it does: it concentrates more tightly in the middle. This
    // test exists so that a later change to the physics cannot quietly turn
    // the two models into one without somebody noticing.
    const rows = 8;
    const balls = 200;
    const bins = runHeadless(rows, 13579, balls);
    const counts = new Array(rows + 1).fill(0);
    for (const bin of bins) counts[bin] += 1;

    const ideal = binomialDistribution(rows);
    let distance = 0;
    for (let k = 0; k <= rows; k++) distance += Math.abs(counts[k] / bins.length - (ideal[k] ?? 0));
    distance /= 2;

    // Related: both put most balls near the middle.
    const middle = (counts[rows / 2] ?? 0) / bins.length;
    expect(middle).toBeGreaterThan(0.15);
    // But measurably not the same distribution.
    expect(distance).toBeGreaterThan(0.02);
    expect(distance).toBeLessThan(0.45);
  });

  it("leaves the ideal model untouched", () => {
    // The theoretical side must not depend on the physics in any way: the same
    // numbers before and after a board has been run.
    const before = binomialDistribution(8);
    runHeadless(8, 555, 20);
    expect(binomialDistribution(8)).toEqual(before);
    expect(pascalRow(8)).toEqual([1, 8, 28, 56, 70, 56, 28, 8, 1]);
  });
});
