import { createRng, shuffle } from "@/lib/random";
import { determinant, inverse, isMatrix, type Matrix } from "./engine/matrix";
import type { CalcState } from "./engine/machine";
import { MODELS, type ModelSpec } from "./engine/models";
import { binomialPd, normalCdf } from "./engine/probability";
import { oneVariable, twoVariable } from "./engine/stats";
import type { ModelId } from "./engine/types";
import type { Text } from "./lessons";

/**
 * The daily puzzle: five calculator questions a day, three tries each.
 *
 * ## The idea
 *
 * A lesson says which key to press; the puzzle only says what to find, the
 * way an exam question does, and the student has to know the way there. A
 * question is answered with "This is my answer", which reads what the
 * calculator is showing, so the answer is the student's own work and nothing
 * is typed twice. A wrong answer says whether the right one is higher or
 * lower, which is often enough to spot the slip (a minus squared, degrees
 * instead of radians, σ instead of s).
 *
 * ## Everyone gets the same puzzle
 *
 * The questions come from the date and the model, so every student with the
 * same calculator gets the same five on the same day and can compare results.
 * The model matters because the questions are only ones it can do: a
 * determinant is never asked of an fx-82ES PLUS. They grow harder through the
 * day's five: a warm-up, statistics, probability, equations, and a final one.
 *
 * ## What is kept
 *
 * Only this browser's own progress and streak, in localStorage. No server, no
 * names, nothing shared unless the student copies their result.
 */

export const PUZZLE_LENGTH = 5;
export const TRIES = 3;

/** Puzzle #1. */
const FIRST_DAY = "2026-11-10";

export interface PuzzleTask {
  kind: string;
  topic: Text;
  prompt: Text;
  answer: number;
  /** The numbers on screen that count as this question's answer. */
  read: (s: CalcState) => number[];
  /** How far off still counts as right, beyond the usual rounding. */
  abs: number;
}

/** Where the right answer is, compared with a wrong one. */
export type Hint = "higher" | "lower";

export type Judgement = { kind: "right" } | { kind: "empty" } | { kind: "wrong"; hint: Hint };

type Rng = () => number;

const t = (en: string, tr: string): Text => ({ en, tr });
const int = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
/** A number as a prompt writes it: a real minus, never "+ −". */
const n = (x: number) => (x < 0 ? `−${-x}` : String(x));
const signed = (x: number) => (x < 0 ? `− ${-x}` : `+ ${x}`);
/** A coefficient before a letter: "+ 3y", "− y", never "+ 1y". */
const term = (k: number, letter: string) =>
  `${k < 0 ? "−" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}${letter}`;
const lead = (k: number, letter: string) => `${k === 1 ? "" : k}${letter}`;
/** A whole number that is not zero. */
const nonzero = (rng: Rng, lo: number, hi: number) => {
  const x = int(rng, lo, hi - 1);
  return x >= 0 ? x + 1 : x;
};
const list = (xs: number[]) => xs.join(", ");

/** Close enough: the calculator works to more digits than it shows. */
const near = (a: number, b: number, abs = 0) =>
  Math.abs(a - b) <= Math.max(abs, 1e-6 * Math.max(1, Math.abs(b)));

/**
 * Every number the calculator is showing as an answer right now.
 *
 * A results list counts as showing all of its rows, because getting to that
 * list is the skill; a matrix answer counts as showing each element.
 */
export function screenAnswers(s: CalcState): number[] {
  const screen = s.screen;
  switch (screen.s) {
    case "calc":
      if (!s.evaluated || s.result === null) return [];
      return isMatrix(s.result) ? s.result.flat() : [s.result];
    case "eqnResult": {
      if (!Array.isArray(screen.roots)) return [];
      const root = screen.roots[screen.index];
      return root && root.im === 0 ? [root.re] : [];
    }
    case "distResult":
      return [screen.value];
    case "solveResult":
      return [screen.x];
    case "statList": {
      if (screen.list === "reg") {
        const r = twoVariable(s.stat.rows);
        return r ? [r.a, r.b, r.r] : [];
      }
      const r = oneVariable(s.stat.rows.map((row) => row.x));
      return r
        ? [
            r.mean,
            r.sumX,
            r.sumX2,
            r.popVar,
            r.popSd,
            r.sampleVar,
            r.sampleSd,
            r.n,
            r.min,
            r.q1,
            r.median,
            r.q3,
            r.max,
          ]
        : [];
    }
    default:
      return [];
  }
}

/** Right, nothing to judge yet, or wrong with a pointer to the right one. */
export function judge(task: PuzzleTask, s: CalcState): Judgement {
  const seen = task.read(s).filter(Number.isFinite);
  if (seen.length === 0) return { kind: "empty" };
  if (seen.some((x) => near(x, task.answer, task.abs))) return { kind: "right" };
  // The hint is about the number closest to the answer: on a results list,
  // the row the student most likely meant.
  const closest = seen.reduce((a, b) =>
    Math.abs(b - task.answer) < Math.abs(a - task.answer) ? b : a,
  );
  return { kind: "wrong", hint: task.answer > closest ? "higher" : "lower" };
}

/** An answer as the page shows it: ten significant digits at most, a real minus. */
export function formatAnswer(x: number): string {
  const text = String(Number(x.toPrecision(10)));
  return text.startsWith("-") ? `−${text.slice(1)}` : text;
}

interface Template {
  kind: string;
  topic: Text;
  /** Whether a model can do it at all. */
  fits: (model: ModelSpec) => boolean;
  make: (rng: Rng) => Pick<PuzzleTask, "prompt" | "answer"> & Partial<PuzzleTask>;
}

const always = () => true;

const ARITHMETIC = t("Arithmetic", "Aritmetik");
const TRIGONOMETRY = t("Trigonometry", "Trigonometri");
const STATISTICS = t("Statistics", "İstatistik");
const REGRESSION = t("Regression", "Regresyon");
const PROBABILITY = t("Probability", "Olasılık");
const EQUATIONS = t("Equations", "Denklemler");
const CALCULUS = t("Calculus", "Analiz");
const MATRICES = t("Matrices", "Matrisler");

const TEMPLATES: Template[] = [
  {
    kind: "order",
    topic: ARITHMETIC,
    fits: always,
    make: (rng) => {
      const [a, b, c, d] = [int(rng, 11, 99), int(rng, 3, 19), int(rng, 3, 19), int(rng, 2, 9)];
      return {
        prompt: t(
          `Work out ${a} − ${b} × ${c} + ${d}.`,
          `${a} − ${b} × ${c} + ${d} işleminin sonucunu bul.`,
        ),
        answer: a - b * c + d,
      };
    },
  },
  {
    kind: "negative",
    topic: ARITHMETIC,
    fits: always,
    make: (rng) => {
      const [a, b] = [int(rng, 3, 12), int(rng, 2, 6)];
      return {
        prompt: t(
          `Work out −${a}² + (−${b})³. Mind which minus is squared.`,
          `−${a}² + (−${b})³ işleminin sonucunu bul. Hangi eksinin kareye girdiğine dikkat.`,
        ),
        answer: -(a * a) + (-b) ** 3,
      };
    },
  },
  {
    kind: "trigDegrees",
    topic: TRIGONOMETRY,
    fits: always,
    make: (rng) => {
      const [a, b] = [int(rng, 5, 85), int(rng, 5, 85)];
      const rad = Math.PI / 180;
      return {
        prompt: t(`Work out sin ${a}° + cos ${b}°.`, `sin ${a}° + cos ${b}° değerini bul.`),
        answer: Math.sin(a * rad) + Math.cos(b * rad),
      };
    },
  },
  {
    kind: "trigRadians",
    topic: TRIGONOMETRY,
    fits: always,
    make: (rng) => {
      const x = int(rng, 5, 30) / 10;
      return {
        prompt: t(
          `Work out sin(${x}) with ${x} in radians.`,
          `sin(${x}) değerini bul; ${x} radyan cinsinden.`,
        ),
        answer: Math.sin(x),
      };
    },
  },
  {
    kind: "mean",
    topic: STATISTICS,
    fits: always,
    make: (rng) => {
      const data = Array.from({ length: 6 }, () => int(rng, 10, 99));
      return {
        prompt: t(`The mean of ${list(data)}.`, `${list(data)} verilerinin ortalaması.`),
        answer: oneVariable(data)!.mean,
      };
    },
  },
  {
    kind: "sampleSd",
    topic: STATISTICS,
    fits: always,
    make: (rng) => {
      const data = Array.from({ length: 6 }, () => int(rng, 10, 60));
      return {
        prompt: t(
          `The sample standard deviation (sx) of ${list(data)}.`,
          `${list(data)} verilerinin örneklem standart sapması (sx).`,
        ),
        answer: oneVariable(data)!.sampleSd,
      };
    },
  },
  {
    kind: "popVariance",
    topic: STATISTICS,
    fits: always,
    make: (rng) => {
      const data = Array.from({ length: 5 }, () => int(rng, 1, 30));
      return {
        prompt: t(
          `The population variance (σ²) of ${list(data)}.`,
          `${list(data)} verilerinin kitle varyansı (σ²).`,
        ),
        answer: oneVariable(data)!.popVar,
      };
    },
  },
  {
    kind: "slope",
    topic: REGRESSION,
    fits: always,
    make: (rng) => {
      const xs = [1, 2, 3, 4, 5];
      const ys = xs.map(() => int(rng, 1, 20));
      const r = twoVariable(xs.map((x, i) => ({ x, y: ys[i]! })))!;
      return {
        prompt: t(
          `x = 1, 2, 3, 4, 5 and y = ${list(ys)}. The slope b of the line y = a + bx.`,
          `x = 1, 2, 3, 4, 5 ve y = ${list(ys)}. y = a + bx doğrusunun eğimi b.`,
        ),
        answer: r.b,
      };
    },
  },
  {
    kind: "normal",
    topic: PROBABILITY,
    fits: (m) => m.has.dist || m.has.normalP,
    make: (rng) => {
      const mu = int(rng, 50, 80);
      const sigma = int(rng, 4, 12);
      const z = int(rng, -15, 15) / 10;
      const x = mu + z * sigma;
      return {
        prompt: t(
          `X is normal with μ = ${mu} and σ = ${sigma}. Find P(X < ${n(x)}).`,
          `X normal dağılıyor, μ = ${mu} ve σ = ${sigma}. P(X < ${n(x)}) değerini bul.`,
        ),
        answer: normalCdf(z),
        // P( on the ES PLUS and MS gives five decimal places.
        abs: 6e-5,
      };
    },
  },
  {
    kind: "binomial",
    topic: PROBABILITY,
    fits: always,
    make: (rng) => {
      const trials = int(rng, 4, 9);
      const p = int(rng, 1, 9) / 10;
      const k = int(rng, 1, trials - 1);
      return {
        prompt: t(
          `${trials} independent trials, each a success with p = ${p}. P(exactly ${k} successes).`,
          `Her biri p = ${p} olasılıkla başarılı ${trials} bağımsız deneme. Tam ${k} başarı olasılığı.`,
        ),
        answer: binomialPd(k, trials, p),
      };
    },
  },
  {
    kind: "system",
    topic: EQUATIONS,
    fits: (m) => m.has.eqn,
    make: (rng) => {
      const [x, y] = [int(rng, -6, 9), int(rng, -6, 9)];
      let a: number, b: number, c: number, d: number;
      do [a, b, c, d] = [int(rng, 1, 7), nonzero(rng, -6, 6), int(rng, 1, 6), nonzero(rng, -7, 7)];
      while (a * d - b * c === 0);
      const first = `${lead(a, "x")} ${term(b, "y")} = ${n(a * x + b * y)}`;
      const second = `${lead(c, "x")} ${term(d, "y")} = ${n(c * x + d * y)}`;
      return {
        prompt: t(`${first} and ${second}. Find x.`, `${first} ve ${second}. x'i bul.`),
        answer: x,
      };
    },
  },
  {
    kind: "quadratic",
    topic: EQUATIONS,
    fits: (m) => m.has.eqn,
    make: (rng) => {
      // A positive discriminant that is not a square, so the roots are not whole.
      let a: number, b: number, c: number, disc: number;
      do {
        [a, b, c] = [int(rng, 1, 4), nonzero(rng, -9, 9), nonzero(rng, -9, 9)];
        disc = b * b - 4 * a * c;
      } while (disc <= 0 || Number.isInteger(Math.sqrt(disc)));
      return {
        prompt: t(
          `The larger root of ${lead(a, "x²")} ${term(b, "x")} ${signed(c)} = 0.`,
          `${lead(a, "x²")} ${term(b, "x")} ${signed(c)} = 0 denkleminin büyük kökü.`,
        ),
        answer: (-b + Math.sqrt(disc)) / (2 * a),
      };
    },
  },
  {
    kind: "solve",
    topic: EQUATIONS,
    fits: (m) => m.has.calculus,
    make: (rng) => {
      const k = int(rng, 3, 30);
      return {
        prompt: t(
          `The x with x³ = ${k}, using SOLVE.`,
          `SOLVE ile x³ = ${k} denklemini sağlayan x.`,
        ),
        answer: Math.cbrt(k),
      };
    },
  },
  {
    kind: "integral",
    topic: CALCULUS,
    fits: (m) => m.has.calculus,
    make: (rng) => {
      const [p, q] = [int(rng, 1, 5), nonzero(rng, -6, 6)];
      const [lo, hi] = [int(rng, 0, 2), int(rng, 3, 5)];
      const F = (x: number) => (p * x ** 3) / 3 + q * x;
      return {
        prompt: t(
          `∫ from ${lo} to ${hi} of (${lead(p, "x²")} ${signed(q)}) dx.`,
          `${lo} ile ${hi} arasında (${lead(p, "x²")} ${signed(q)}) dx integrali.`,
        ),
        answer: F(hi) - F(lo),
      };
    },
  },
  {
    kind: "derivative",
    topic: CALCULUS,
    fits: (m) => m.has.calculus,
    make: (rng) => {
      const [p, at] = [int(rng, 2, 9), int(rng, -3, 4)];
      return {
        prompt: t(
          `The derivative of x³ − ${p}x at x = ${n(at)}.`,
          `x³ − ${p}x fonksiyonunun x = ${n(at)} noktasındaki türevi.`,
        ),
        answer: 3 * at * at - p,
      };
    },
  },
  {
    kind: "determinant",
    topic: MATRICES,
    fits: (m) => m.has.matrix,
    make: (rng) => {
      let m: Matrix;
      do m = [0, 1, 2].map(() => [0, 1, 2].map(() => int(rng, -5, 9)));
      while (determinant(m) === 0);
      const rows = m.map((row) => row.map(n).join(", ")).join("), (");
      return {
        prompt: t(
          `The determinant of the matrix with rows (${rows}).`,
          `Satırları (${rows}) olan matrisin determinantı.`,
        ),
        answer: Math.round(determinant(m)!),
      };
    },
  },
  {
    kind: "inverse",
    topic: MATRICES,
    fits: (m) => m.has.matrix,
    make: (rng) => {
      let m: Matrix;
      do m = [0, 1].map(() => [0, 1].map(() => int(rng, -5, 9)));
      while (determinant(m) === 0);
      const rows = m.map((row) => row.map(n).join(", ")).join("), (");
      return {
        prompt: t(
          `The top-left element of the inverse of the matrix with rows (${rows}).`,
          `Satırları (${rows}) olan matrisin tersinin sol üst elemanı.`,
        ),
        answer: (inverse(m) as Matrix)[0]![0]!,
        // The element itself, not any element of the inverse.
        read: (s) =>
          s.screen.s === "calc" &&
          s.evaluated &&
          isMatrix(s.result) &&
          s.result[0]?.[0] !== undefined
            ? [s.result[0][0]]
            : [],
      };
    },
  },
];

/**
 * The day's five slots, easiest first. A slot takes one of its kinds the model
 * can do; a model that can do none of them (the fx-82ES PLUS has no equation
 * mode, no calculus and no matrices) gets one of the fallbacks instead.
 */
const SLOTS: { kinds: string[]; fallback: string[] }[] = [
  { kinds: ["order", "negative", "trigDegrees", "trigRadians"], fallback: [] },
  { kinds: ["mean", "sampleSd", "popVariance", "slope"], fallback: [] },
  { kinds: ["binomial", "normal"], fallback: [] },
  { kinds: ["system", "quadratic", "solve"], fallback: ["slope", "sampleSd", "popVariance"] },
  {
    kinds: ["integral", "derivative", "determinant", "inverse"],
    fallback: ["slope", "sampleSd", "popVariance", "trigRadians"],
  },
];

const templateOf = (kind: string) => TEMPLATES.find((tpl) => tpl.kind === kind)!;

/** FNV-1a: a whole number from a string, so a date can seed the puzzle. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** The puzzle for this model on this day ("2026-11-10"): the same for everyone. */
export function makePuzzle(model: ModelId, day: string): PuzzleTask[] {
  const rng = createRng(hash(`${day}|${model}`));
  const spec = MODELS[model];
  const used = new Set<string>();
  const fitting = (kinds: string[]) =>
    kinds.filter((kind) => !used.has(kind) && templateOf(kind).fits(spec));
  return SLOTS.map((slot) => {
    const options = fitting(slot.kinds);
    const pool = options.length ? options : fitting(slot.fallback);
    const kind = shuffle(rng, pool.length ? pool : fitting(TEMPLATES.map((tpl) => tpl.kind)))[0]!;
    used.add(kind);
    const tpl = templateOf(kind);
    const made = tpl.make(rng);
    return { kind, topic: tpl.topic, read: screenAnswers, abs: 0, ...made };
  });
}

// ---------------------------------------------------------------- days ----

const pad = (x: number) => String(x).padStart(2, "0");

/** The local date, "2026-11-10": a new puzzle at the student's own midnight. */
export const dayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const dayNumber = (day: string) => {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
};

/** "#1" was the first day. */
export const puzzleNumber = (day: string) => dayNumber(day) - dayNumber(FIRST_DAY) + 1;

/** The day before. */
export function previousDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return dayKey(new Date(y, m - 1, d - 1));
}

/** Milliseconds to the next local midnight. */
export function msToTomorrow(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** "05:12:33" */
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}

// ------------------------------------------------------------ progress ----

/** One question's tries: the wrong answers' hints, and how it ended. */
export interface Row {
  misses: Hint[];
  done: "solved" | "missed" | null;
}

/** A day's progress on one model: one row per question started. */
export type Progress = Row[];

export const answered = (progress: Progress) => progress.filter((row) => row.done).length;
export const isFinished = (progress: Progress) => answered(progress) >= PUZZLE_LENGTH;

/** 3 for a first-try answer, 2 for a second, 1 for a third, 0 for a miss. */
export const rowPoints = (row: Row) => (row.done === "solved" ? TRIES - row.misses.length : 0);
export const MAX_POINTS = PUZZLE_LENGTH * TRIES;
export const points = (progress: Progress) =>
  progress.reduce((sum, row) => sum + rowPoints(row), 0);

/** The progress after an answer was judged, or after giving up (`null`). */
export function afterAnswer(progress: Progress, judgement: Judgement | null): Progress {
  if (isFinished(progress) || judgement?.kind === "empty") return progress;
  const index = answered(progress);
  const row = progress[index] ?? { misses: [], done: null };
  let next: Row;
  if (judgement === null) next = { ...row, done: "missed" };
  else if (judgement.kind === "right") next = { ...row, done: "solved" };
  else {
    const misses = [...row.misses, judgement.hint];
    next = { misses, done: misses.length >= TRIES ? "missed" : null };
  }
  return [...progress.slice(0, index), next];
}

const EMOJI = ["🟩", "🟨", "🟧"] as const;

/** One square a question, as the shared result shows it. */
export const rowEmoji = (row: Row) =>
  row.done === "solved" ? (EMOJI[row.misses.length] ?? "🟧") : "🟥";

export interface Stats {
  played: number;
  streak: number;
  best: number;
}

/** Everything kept, by day and model. */
type History = Record<string, Partial<Record<ModelId, Progress>>>;

export const DAILY_KEY = "aiclub-labs-calculator-daily";

/** How many days of history are kept; enough for any streak worth showing. */
const KEEP_DAYS = 400;

const isRow = (x: unknown): x is Row => {
  const row = x as Row;
  return (
    !!row &&
    Array.isArray(row.misses) &&
    row.misses.every((h) => h === "higher" || h === "lower") &&
    (row.done === null || row.done === "solved" || row.done === "missed")
  );
};

/** This browser's progress. Storage can be blocked; then nothing is kept and nothing breaks. */
export function dailyStore(storage: Pick<Storage, "getItem" | "setItem"> | null = safeStorage()) {
  const read = (): History => {
    try {
      const parsed: unknown = JSON.parse(storage?.getItem(DAILY_KEY) ?? "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as History)
        : {};
    } catch {
      return {};
    }
  };
  return {
    load(day: string, model: ModelId): Progress {
      const rows: unknown = read()[day]?.[model];
      return Array.isArray(rows) && rows.every(isRow) ? rows.slice(0, PUZZLE_LENGTH) : [];
    },
    save(day: string, model: ModelId, progress: Progress) {
      const history = read();
      history[day] = { ...history[day], [model]: progress };
      const kept = Object.keys(history).sort().slice(-KEEP_DAYS);
      try {
        storage?.setItem(
          DAILY_KEY,
          JSON.stringify(Object.fromEntries(kept.map((d) => [d, history[d]]))),
        );
      } catch {
        // Full or blocked: today still works, it is just not remembered.
      }
    },
    /** Days with a finished puzzle on any model, and the run of them up to today. */
    stats(today: string): Stats {
      const history = read();
      const finished = (day: string) =>
        Object.values(history[day] ?? {}).some(
          (rows) => Array.isArray(rows) && rows.every(isRow) && isFinished(rows),
        );
      const days = Object.keys(history).filter(finished).sort();
      let best = 0;
      let run = 0;
      let last = "";
      for (const day of days) {
        run = last && previousDay(day) === last ? run + 1 : 1;
        best = Math.max(best, run);
        last = day;
      }
      // A streak is still alive until a whole day goes by without a puzzle.
      let streak = 0;
      let day = finished(today) ? today : previousDay(today);
      while (finished(day)) {
        streak++;
        day = previousDay(day);
      }
      return { played: days.length, streak, best };
    },
  };
}

export type DailyStore = ReturnType<typeof dailyStore>;

function safeStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
