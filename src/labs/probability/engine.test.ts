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
