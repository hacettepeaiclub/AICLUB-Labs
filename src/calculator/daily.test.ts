import { describe, expect, it } from "vitest";
import {
  afterAnswer,
  dailyStore,
  dayKey,
  formatAnswer,
  formatCountdown,
  isFinished,
  judge,
  makePuzzle,
  msToTomorrow,
  points,
  previousDay,
  puzzleNumber,
  rowEmoji,
  MAX_POINTS,
  PUZZLE_LENGTH,
  TRIES,
  type Progress,
  type PuzzleTask,
} from "./daily";
import { initialState, pressAll } from "./engine/machine";
import { MODEL_IDS } from "./engine/models";
import { normalCdf } from "./engine/probability";
import type { KeyId, ModelId } from "./engine/types";

/** A year and a bit of days, from the first puzzle on. */
const DAYS = Array.from({ length: 420 }, (_, i) => dayKey(new Date(2026, 10, 10 + i)));

/** The keys that type a number, with (−) for a minus. */
const typed = (x: number): KeyId[] =>
  String(x)
    .split("")
    .map((c) => (c === "-" ? "neg" : c === "." ? "dot" : c) as KeyId);

/** The numbers in a prompt, in order, read with its real minus signs. */
const numbersIn = (text: string): number[] =>
  [...text.replace(/−\s?/g, "-").matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
/** The numbers in a prompt with no signs, for "a − b × c + d", where the minus is an operation. */
const digitsIn = (text: string): number[] => [...text.matchAll(/\d+/g)].map((m) => Number(m[0]));

/** Every question of a kind the year's puzzles ask a model. */
const tasksOf = (kind: string, model: ModelId = "fx991ex"): PuzzleTask[] =>
  DAYS.flatMap((day) => makePuzzle(model, day)).filter((task) => task.kind === kind);

describe("a day's puzzle", () => {
  it("has five different questions, easiest first", () => {
    for (const model of MODEL_IDS) {
      for (const day of DAYS.slice(0, 60)) {
        const puzzle = makePuzzle(model, day);
        expect(puzzle).toHaveLength(PUZZLE_LENGTH);
        expect(new Set(puzzle.map((task) => task.kind)).size).toBe(PUZZLE_LENGTH);
        expect(["order", "negative", "trigDegrees", "trigRadians"]).toContain(puzzle[0]!.kind);
      }
    }
  });

  it("is the same for everyone on a day, and new the next day", () => {
    const today = makePuzzle("fx991ex", "2026-11-10").map((task) => task.prompt.en);
    expect(makePuzzle("fx991ex", "2026-11-10").map((task) => task.prompt.en)).toEqual(today);
    expect(makePuzzle("fx991ex", "2026-11-11").map((task) => task.prompt.en)).not.toEqual(today);
  });

  it("over a year, asks every kind of question a model can do", () => {
    const asked = (model: ModelId) =>
      new Set(DAYS.flatMap((day) => makePuzzle(model, day).map((task) => task.kind)));
    expect(asked("fx991ex").size).toBe(17);
    expect(asked("fx570ms")).toContain("determinant");
  });

  it("never asks the fx-82ES PLUS for what it cannot do", () => {
    const asked = new Set(DAYS.flatMap((day) => makePuzzle("fx82esplus", day).map((t) => t.kind)));
    for (const missing of [
      "system",
      "quadratic",
      "solve",
      "integral",
      "derivative",
      "determinant",
      "inverse",
      "normal",
    ]) {
      expect(asked).not.toContain(missing);
    }
  });

  it("writes questions cleanly in both languages", () => {
    for (const model of MODEL_IDS) {
      for (const day of DAYS.slice(0, 100)) {
        for (const task of makePuzzle(model, day)) {
          for (const text of [task.prompt.en, task.prompt.tr]) {
            expect(text.trim()).not.toBe("");
            expect(text, text).not.toMatch(/\+ −|\+ 0\b|− 0\b|\b1x|\b1y|\+ -|NaN|undefined/);
          }
          expect(task.prompt.tr).not.toBe(task.prompt.en);
          expect(Number.isFinite(task.answer), task.kind).toBe(true);
        }
      }
    }
  });
});

describe("every answer, checked another way", () => {
  it("works out arithmetic in the right order", () => {
    for (const task of tasksOf("order")) {
      const [a, b, c, d] = digitsIn(task.prompt.en) as [number, number, number, number];
      expect(task.answer).toBe(a - b * c + d);
    }
    for (const task of tasksOf("negative")) {
      // Superscripts are not digits, so "−a² + (−b)³" reads as [−a, −b]...
      const [a, b] = numbersIn(task.prompt.en) as [number, number];
      // ...and means −(a²) + (−b)³.
      expect(task.answer).toBe(-(a ** 2) + b ** 3);
    }
  });

  it("finds the larger real root of each quadratic", () => {
    for (const task of tasksOf("quadratic")) {
      const text = task.prompt.en.replace("The larger root of ", "");
      const match = text.match(/^(\d*)x² ([+−]) (\d*)x ([+−]) (\d+) = 0\.$/)!;
      expect(match, text).not.toBeNull();
      const a = Number(match[1] || 1);
      const b = (match[2] === "+" ? 1 : -1) * Number(match[3] || 1);
      const c = (match[4] === "+" ? 1 : -1) * Number(match[5]);
      const x = task.answer;
      expect(Math.abs(a * x * x + b * x + c)).toBeLessThan(1e-9);
      expect(-b / a - x).toBeLessThan(x);
    }
  });

  it("gives an x that satisfies both equations", () => {
    for (const task of tasksOf("system")) {
      const sides = task.prompt.en.replace(". Find x.", "").split(" and ");
      const parse = (side: string) => {
        const m = side.match(/^(\d*)x ([+−]) (\d*)y = (−?\d+)$/)!;
        expect(m, side).not.toBeNull();
        return {
          a: Number(m[1] || 1),
          b: (m[2] === "+" ? 1 : -1) * Number(m[3] || 1),
          c: Number(m[4]!.replace("−", "-")),
        };
      };
      const [e1, e2] = sides.map(parse) as [
        { a: number; b: number; c: number },
        { a: number; b: number; c: number },
      ];
      // Cramer's rule, independently of the elimination the solver uses.
      const det = e1.a * e2.b - e1.b * e2.a;
      expect(task.answer).toBe((e1.c * e2.b - e1.b * e2.c) / det + 0);
    }
  });

  it("computes 3×3 determinants that agree with cofactor expansion", () => {
    for (const task of tasksOf("determinant")) {
      const [a, b, c, d, e, f, g, h, i] = numbersIn(task.prompt.en).slice(-9) as number[];
      const cofactor =
        a! * (e! * i! - f! * h!) - b! * (d! * i! - f! * g!) + c! * (d! * h! - e! * g!);
      expect(task.answer).toBe(cofactor);
    }
  });

  it("reads the inverse's top-left element as d ÷ (ad − bc)", () => {
    for (const task of tasksOf("inverse")) {
      const [a, b, c, d] = numbersIn(task.prompt.en).slice(-4) as [number, number, number, number];
      expect(task.answer).toBeCloseTo(d / (a * d - b * c), 12);
    }
  });

  it("gives binomial probabilities that match the formula", () => {
    const choose = (n: number, k: number) => {
      let r = 1;
      for (let j = 1; j <= k; j++) r = (r * (n - k + j)) / j;
      return r;
    };
    for (const task of tasksOf("binomial")) {
      const [trials, p, k] = numbersIn(task.prompt.en) as [number, number, number];
      expect(task.answer).toBeCloseTo(choose(trials, k) * p ** k * (1 - p) ** (trials - k), 12);
    }
  });

  it("standardises the normal question to a z of one decimal place", () => {
    for (const task of tasksOf("normal")) {
      const [mu, sigma, x] = numbersIn(task.prompt.en) as [number, number, number];
      const z = (x - mu) / sigma;
      expect(Math.round(z * 10) / 10).toBeCloseTo(z, 9);
      expect(task.answer).toBeCloseTo(normalCdf(z), 12);
    }
  });

  it("integrates and differentiates the polynomials exactly", () => {
    for (const task of tasksOf("integral")) {
      const [lo, hi] = numbersIn(task.prompt.en) as [number, number];
      const body = task.prompt.en.match(/of \((\d*)x² ([+−]) (\d+)\)/)!;
      const p = Number(body[1] || 1);
      const q = (body[2] === "+" ? 1 : -1) * Number(body[3]);
      const F = (x: number) => (p * x ** 3) / 3 + q * x;
      expect(task.answer).toBeCloseTo(F(hi) - F(lo), 9);
    }
    for (const task of tasksOf("derivative")) {
      // "x³ − px at x = a" reads as [−p, a].
      const [p, at] = numbersIn(task.prompt.en) as [number, number];
      expect(task.answer).toBe(3 * at * at + p);
    }
  });
});

describe("“this is my answer” reads the screen", () => {
  const first = (kind: string, model: ModelId = "fx991esplus") => tasksOf(kind, model)[0]!;

  it("takes a sum worked out on the calculator, and points the way from a wrong one", () => {
    const task = first("order");
    const [a, b, c, d] = digitsIn(task.prompt.en) as [number, number, number, number];
    const keys: KeyId[] = [
      ...typed(a),
      "minus",
      ...typed(b),
      "times",
      ...typed(c),
      "plus",
      ...typed(d),
      "eq",
    ];
    expect(judge(task, pressAll(initialState("fx991esplus"), keys))).toEqual({ kind: "right" });
    // Left to right, the classic mistake: (a − b) × c + d is far lower.
    const wrong: KeyId[] = [
      "lp",
      ...typed(a),
      "minus",
      ...typed(b),
      "rp",
      "times",
      ...typed(c),
      "plus",
      ...typed(d),
      "eq",
    ];
    expect(judge(task, pressAll(initialState("fx991esplus"), wrong))).toEqual({
      kind: "wrong",
      hint: task.answer > (a - b) * c + d ? "higher" : "lower",
    });
    // Nothing worked out yet is not an answer at all.
    expect(judge(task, initialState("fx991esplus"))).toEqual({ kind: "empty" });
  });

  it("takes a mean read from the EX's results list", () => {
    const task = first("mean", "fx991ex");
    const data = numbersIn(task.prompt.en);
    const keys: KeyId[] = [
      "menu",
      "6",
      "1",
      ...data.flatMap((x) => [...typed(x), "eq" as KeyId]),
      "optn",
      "3",
    ];
    const s = pressAll(initialState("fx991ex"), keys);
    expect(s.screen.s).toBe("statList");
    expect(judge(task, s).kind).toBe("right");
  });

  it("takes a determinant from the ES PLUS matrix mode", () => {
    const task = first("determinant");
    const cells = numbersIn(task.prompt.en).slice(-9);
    const keys: KeyId[] = [
      "mode",
      "6",
      "1",
      "1",
      ...cells.flatMap((x) => [...typed(x), "eq" as KeyId]),
      "ac",
      "shift",
      "4",
      "7",
      "shift",
      "4",
      "3",
      "rp",
      "eq",
    ];
    expect(judge(task, pressAll(initialState("fx991esplus"), keys)).kind).toBe("right");
  });

  it("takes a five-decimal P( on the MS for a normal question", () => {
    const task = first("normal", "fx570ms");
    const [mu, sigma, x] = numbersIn(task.prompt.en) as [number, number, number];
    const keys: KeyId[] = [
      "mode",
      "mode",
      "1",
      "shift",
      "3",
      "1",
      "lp",
      ...typed(x),
      "minus",
      ...typed(mu),
      "rp",
      "divide",
      ...typed(sigma),
      "rp",
      "eq",
    ];
    expect(judge(task, pressAll(initialState("fx570ms"), keys)).kind).toBe("right");
  });

  it("takes only the inverse's top-left element for the inverse question", () => {
    const task = first("inverse");
    const [a, b, c, d] = numbersIn(task.prompt.en).slice(-4) as number[];
    const define: KeyId[] = [
      "mode",
      "6",
      "1",
      "5",
      ...[a!, b!, c!, d!].flatMap((x) => [...typed(x), "eq" as KeyId]),
      "ac",
    ];
    const inverse = pressAll(initialState("fx991esplus"), [
      ...define,
      "shift",
      "4",
      "3",
      "inv",
      "eq",
    ]);
    expect(judge(task, inverse).kind).toBe("right");
    // The determinant of the same matrix is a number on screen, but not a matrix.
    const det = pressAll(initialState("fx991esplus"), [
      ...define,
      "shift",
      "4",
      "7",
      "shift",
      "4",
      "3",
      "eq",
    ]);
    expect(judge(task, det).kind).toBe("empty");
  });
});

describe("tries and points", () => {
  const right = { kind: "right" } as const;
  const low = { kind: "wrong", hint: "higher" } as const;

  it("ends a question when it is right, after three misses, or on giving up", () => {
    let p: Progress = [];
    p = afterAnswer(p, right);
    expect(p).toEqual([{ misses: [], done: "solved" }]);
    p = afterAnswer(afterAnswer(p, low), right);
    expect(p[1]).toEqual({ misses: ["higher"], done: "solved" });
    for (let i = 0; i < TRIES; i++) p = afterAnswer(p, low);
    expect(p[2]).toEqual({ misses: ["higher", "higher", "higher"], done: "missed" });
    p = afterAnswer(p, null);
    expect(p[3]).toEqual({ misses: [], done: "missed" });
    // An empty screen costs nothing.
    expect(afterAnswer(p, { kind: "empty" })).toBe(p);
    p = afterAnswer(p, right);
    expect(isFinished(p)).toBe(true);
    // A finished day does not change.
    expect(afterAnswer(p, right)).toBe(p);
    expect(points(p)).toBe(3 + 2 + 0 + 0 + 3);
    expect(p.map(rowEmoji).join("")).toBe("🟩🟨🟥🟥🟩");
  });

  it("gives fifteen points for a perfect day", () => {
    const perfect = Array.from({ length: PUZZLE_LENGTH }, () => ({
      misses: [],
      done: "solved" as const,
    }));
    expect(points(perfect)).toBe(MAX_POINTS);
    expect(MAX_POINTS).toBe(15);
  });
});

describe("days", () => {
  it("numbers the puzzles from the first day", () => {
    expect(puzzleNumber("2026-11-10")).toBe(1);
    expect(puzzleNumber("2026-12-01")).toBe(22);
    expect(puzzleNumber("2027-11-10")).toBe(366);
  });

  it("steps back across months and years", () => {
    expect(previousDay("2026-12-01")).toBe("2026-11-30");
    expect(previousDay("2027-01-01")).toBe("2026-12-31");
    expect(previousDay("2028-03-01")).toBe("2028-02-29");
  });

  it("counts down to midnight", () => {
    expect(msToTomorrow(new Date(2026, 10, 10, 23, 0, 0))).toBe(3_600_000);
    expect(formatCountdown(3_600_000 + 61_000)).toBe("01:01:01");
    expect(formatCountdown(-5)).toBe("00:00:00");
  });

  it("shows answers short, with a real minus", () => {
    expect(formatAnswer(-206)).toBe("−206");
    expect(formatAnswer(1 / 3)).toBe("0.3333333333");
    expect(formatAnswer(0.30000000000000004)).toBe("0.3");
  });
});

describe("this browser's progress", () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    };
  };
  const done: Progress = Array.from({ length: PUZZLE_LENGTH }, () => ({
    misses: [],
    done: "solved" as const,
  }));

  it("remembers a day per model", () => {
    const store = dailyStore(memory());
    store.save("2026-11-10", "fx991ex", [{ misses: ["lower"], done: null }]);
    expect(store.load("2026-11-10", "fx991ex")).toEqual([{ misses: ["lower"], done: null }]);
    expect(store.load("2026-11-10", "fx570ms")).toEqual([]);
    expect(store.load("2026-11-11", "fx991ex")).toEqual([]);
  });

  it("counts a streak of finished days, still alive until a day is missed", () => {
    const store = dailyStore(memory());
    for (const day of ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-14", "2026-11-15"]) {
      store.save(day, "fx991ex", done);
    }
    // Unfinished days do not count.
    store.save("2026-11-13", "fx991ex", done.slice(0, 3));
    expect(store.stats("2026-11-15")).toEqual({ played: 5, streak: 2, best: 3 });
    // Today not played yet: yesterday's streak stands.
    expect(store.stats("2026-11-16")).toEqual({ played: 5, streak: 2, best: 3 });
    // A whole day missed: it is gone.
    expect(store.stats("2026-11-17").streak).toBe(0);
  });

  it("survives storage that is broken or blocked", () => {
    const broken = { getItem: () => "{not json", setItem: () => undefined };
    expect(dailyStore(broken).load("2026-11-10", "fx991ex")).toEqual([]);
    expect(dailyStore(broken).stats("2026-11-10")).toEqual({ played: 0, streak: 0, best: 0 });
    const blocked = dailyStore(null);
    blocked.save("2026-11-10", "fx991ex", done);
    expect(blocked.load("2026-11-10", "fx991ex")).toEqual([]);
  });

  it("ignores rows that were tampered with", () => {
    const storage = memory();
    storage.setItem(
      "aiclub-labs-calculator-daily",
      JSON.stringify({ "2026-11-10": { fx991ex: [{ misses: ["sideways"], done: "solved" }] } }),
    );
    expect(dailyStore(storage).load("2026-11-10", "fx991ex")).toEqual([]);
  });
});
