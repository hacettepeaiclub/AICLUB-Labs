import { initialState, press, type CalcState } from "./engine/machine";
import type { KeyId, ModelId } from "./engine/types";
import { CALCULATOR_COPY } from "./copy";
import {
  afterAnswer,
  answered,
  isFinished,
  judge,
  makePuzzle,
  puzzleNumber,
  screenAnswers,
  TRIES,
  type Progress,
  type PuzzleTask,
} from "./daily";
import { LESSONS, type Lesson } from "./lessons";
import { isModelId, MODEL_STORAGE_KEY } from "./storage";
import type { Daily } from "./ui/DailyPuzzle";

/**
 * The calculator page's state: which model, which lesson or mode, what the
 * simulated calculator holds, and the daily puzzle when it is open.
 *
 * Kept apart from the page so every transition can be tested without a
 * browser. The page renders a `Bench` and dispatches `BenchAction`s; nothing
 * here touches the DOM, and storage is read only by `initialBench`.
 *
 * ## The rules it enforces
 *
 * - In a lesson, only the key the lesson wants next goes in; any other is
 *   refused and named (`miss`), so the screen never drifts from the text.
 * - Free use and the daily puzzle take every key.
 * - Changing model, lesson or mode starts over with a cleared calculator.
 * - Once a daily question is closed (right, or out of tries), keys do nothing
 *   until "next" clears the calculator for the following one.
 */
export interface Bench {
  model: ModelId;
  lesson: string;
  practice: "lesson" | "free" | "daily";
  calc: CalcState;
  progress: number;
  miss: KeyId | null;
  playing: boolean;
  daily: Daily | null;
}

export type BenchAction =
  | { type: "key"; key: KeyId }
  | { type: "advance" }
  | { type: "finish" }
  | { type: "play" }
  | { type: "model"; model: ModelId }
  | { type: "lesson"; id: string }
  | { type: "practice"; practice: Bench["practice"] }
  | { type: "restart" }
  | { type: "dailyOpen"; day: string; progress: Progress }
  | { type: "dailyNext" }
  | { type: "dailyAnswer" }
  | { type: "dailyGiveUp" };

/** The model a visitor gets before choosing one. */
export const DEFAULT_MODEL: ModelId = "fx991ex";

export const lessonById = (id: string): Lesson => LESSONS.find((l) => l.id === id) ?? LESSONS[0]!;

/** Every key of a lesson on a model, in order. */
export const keysOf = (bench: Pick<Bench, "lesson" | "model">): KeyId[] =>
  (lessonById(bench.lesson).steps[bench.model] ?? []).flatMap((step) => step.keys);

function restart(bench: Bench, changes: Partial<Bench> = {}): Bench {
  const next = { ...bench, ...changes };
  return {
    ...next,
    calc: initialState(next.model),
    progress: 0,
    miss: null,
    playing: false,
    daily: null,
  };
}

/** The puzzle after an answer or giving up; a finished question clears the calculator. */
function answer(bench: Bench, gaveUp: boolean): Bench {
  const daily = bench.practice === "daily" ? bench.daily : null;
  if (
    !daily ||
    daily.verdict?.kind === "right" ||
    daily.verdict?.kind === "missed" ||
    isFinished(daily.progress)
  )
    return bench;
  const index = answered(daily.progress);
  const task = daily.tasks[index]!;
  const judgement = gaveUp ? null : judge(task, bench.calc);
  if (judgement?.kind === "empty") return { ...bench, daily: { ...daily, verdict: judgement } };
  const progress = afterAnswer(daily.progress, judgement);
  const row = progress[index]!;
  if (row.done) {
    const kind = row.done === "solved" ? "right" : "missed";
    return {
      ...bench,
      calc: bench.calc,
      daily: { ...daily, progress, verdict: { kind, answer: task.answer } },
    };
  }
  const hint = judgement?.kind === "wrong" ? judgement.hint : "higher";
  const left = TRIES - row.misses.length;
  return { ...bench, daily: { ...daily, progress, verdict: { kind: "wrong", hint, left } } };
}

export function reduceBench(bench: Bench, action: BenchAction): Bench {
  switch (action.type) {
    case "key": {
      if (bench.daily?.verdict?.kind === "right" || bench.daily?.verdict?.kind === "missed")
        return bench;
      const keys = keysOf(bench);
      const playing = false;
      if (bench.practice !== "lesson" || bench.progress >= keys.length) {
        const daily = bench.daily?.verdict ? { ...bench.daily, verdict: null } : bench.daily;
        return { ...bench, calc: press(bench.calc, action.key), miss: null, playing, daily };
      }
      const expected = keys[bench.progress]!;
      if (action.key !== expected) return { ...bench, miss: expected, playing };
      return {
        ...bench,
        calc: press(bench.calc, expected),
        progress: bench.progress + 1,
        miss: null,
        playing,
      };
    }
    case "advance": {
      const expected = keysOf(bench)[bench.progress];
      if (!expected) return { ...bench, playing: false };
      return {
        ...bench,
        calc: press(bench.calc, expected),
        progress: bench.progress + 1,
        miss: null,
      };
    }
    case "finish": {
      const keys = keysOf(bench);
      const calc = keys.slice(bench.progress).reduce(press, bench.calc);
      return { ...bench, calc, progress: keys.length, miss: null, playing: false };
    }
    case "play":
      return { ...bench, playing: true, miss: null };
    case "model":
      return restart(bench, { model: action.model });
    case "lesson":
      return restart(bench, { lesson: action.id, practice: "lesson" });
    case "practice":
      return restart(bench, { practice: action.practice });
    case "restart":
      return restart(bench);
    case "dailyOpen":
      return {
        ...restart(bench, { practice: "daily" }),
        daily: {
          day: action.day,
          model: bench.model,
          number: puzzleNumber(action.day),
          tasks: makePuzzle(bench.model, action.day),
          progress: action.progress,
          verdict: null,
        },
      };
    case "dailyNext":
      return {
        ...bench,
        calc: initialState(bench.model),
        daily: bench.daily ? { ...bench.daily, verdict: null } : null,
      };
    case "dailyAnswer":
      return answer(bench, false);
    case "dailyGiveUp":
      return answer(bench, true);
  }
}

/**
 * A fresh bench on the model this browser chose last, or the default one.
 * Storage that is blocked or holds something else leaves the default.
 */
export function initialBench(
  storage: Pick<Storage, "getItem"> | null = typeof window === "undefined"
    ? null
    : window.localStorage,
): Bench {
  let model = DEFAULT_MODEL;
  try {
    const stored = storage?.getItem(MODEL_STORAGE_KEY);
    if (isModelId(stored)) model = stored;
  } catch {
    // Storage blocked: the default model stands.
  }
  return {
    model,
    lesson: LESSONS[0]!.id,
    practice: "lesson",
    calc: initialState(model),
    progress: 0,
    miss: null,
    playing: false,
    daily: null,
  };
}

/**
 * Lessons whose practice question is a daily-puzzle kind under another name.
 * The rest either share their id with a kind or have a question of their own
 * in `practiceQuestions` (copy.ts).
 */
const PRACTICE_KIND: Record<string, string> = {
  angle: "trigDegrees",
  variance: "popVariance",
  regression: "slope",
};

/** How a lesson's own practice question reads its answer off the calculator. */
const PRACTICE_READ: Record<string, (state: CalcState) => number[]> = {
  memory: (state) => (Object.values(state.vars).includes(5) ? screenAnswers(state) : []),
  product: (state) =>
    Array.isArray(state.result) && state.evaluated ? [state.result[0]?.[0] ?? NaN] : [],
};

/**
 * The question "Try without key hints" sets after a lesson: the lesson's own
 * question when it has one, otherwise the first daily-puzzle question of the
 * matching kind among a hundred seeded puzzles. `undefined` when there is
 * neither, and the button then does nothing.
 */
export function practiceTask(lesson: string, model: ModelId): PuzzleTask | undefined {
  const own = CALCULATOR_COPY.en.practiceQuestions[lesson];
  const ownTr = CALCULATOR_COPY.tr.practiceQuestions[lesson];
  if (own && ownTr) {
    return {
      kind: lesson,
      topic: { en: CALCULATOR_COPY.en.practiceTopic, tr: CALCULATOR_COPY.tr.practiceTopic },
      prompt: { en: own.prompt, tr: ownTr.prompt },
      answer: own.answer,
      read: PRACTICE_READ[lesson] ?? screenAnswers,
      abs: 0,
    };
  }
  const kind = PRACTICE_KIND[lesson] ?? lesson;
  for (let n = 0; n < 100; n++) {
    const task = makePuzzle(model, `practice-${lesson}-${n}`).find((t) => t.kind === kind);
    if (task) return task;
  }
  return undefined;
}
