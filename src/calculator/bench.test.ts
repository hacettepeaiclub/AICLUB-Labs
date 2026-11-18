import { describe, expect, it } from "vitest";
import {
  DEFAULT_MODEL,
  initialBench,
  keysOf,
  lessonById,
  practiceTask,
  reduceBench,
  type Bench,
  type BenchAction,
} from "./bench";
import { CALCULATOR_COPY } from "./copy";
import { judge, makePuzzle, TRIES, type PuzzleTask } from "./daily";
import { initialState, pressAll } from "./engine/machine";
import { MODEL_IDS } from "./engine/models";
import type { KeyId, ModelId } from "./engine/types";
import { LESSONS } from "./lessons";
import { MODEL_STORAGE_KEY } from "./storage";

const run = (bench: Bench, ...actions: BenchAction[]) => actions.reduce(reduceBench, bench);
const keys = (...ids: KeyId[]): BenchAction[] => ids.map((key) => ({ type: "key", key }));
const storage = (value: string | null) => ({ getItem: () => value });

/** The keys that type a number, with (−) for a minus. */
const typed = (x: number): KeyId[] =>
  String(x)
    .split("")
    .map((c) => (c === "-" ? "neg" : c === "." ? "dot" : c) as KeyId);

const start = initialBench(null);
const lesson = start.lesson;
const lessonKeys = keysOf(start);
const DAY = "2026-11-18";

/** A bench with today's puzzle open, its first question one that typing the answer solves. */
function dailyBench(): { bench: Bench; task: PuzzleTask } {
  const opened = run(start, { type: "dailyOpen", day: DAY, progress: [] });
  const tasks = makePuzzle(start.model, DAY);
  const task = tasks.find(
    (t) =>
      judge(t, pressAll(initialState(start.model), [...typed(t.answer), "eq"])).kind === "right",
  )!;
  expect(task).toBeDefined();
  return { bench: { ...opened, daily: { ...opened.daily!, tasks: [task, ...tasks] } }, task };
}

describe("initialBench", () => {
  it("starts on the first lesson of the default model with a clear calculator", () => {
    expect(start).toMatchObject({
      model: DEFAULT_MODEL,
      lesson: LESSONS[0]!.id,
      practice: "lesson",
      progress: 0,
      miss: null,
      playing: false,
      daily: null,
    });
    expect(start.calc).toEqual(initialState(DEFAULT_MODEL));
  });

  it("takes the model this browser chose last", () => {
    const other = MODEL_IDS.find((id) => id !== DEFAULT_MODEL)!;
    expect(initialBench(storage(other)).model).toBe(other);
  });

  it("ignores a stored value that is not a model, and storage that throws", () => {
    expect(initialBench(storage("casio-9000")).model).toBe(DEFAULT_MODEL);
    const blocked = {
      getItem: () => {
        throw new Error("SecurityError");
      },
    };
    expect(initialBench(blocked).model).toBe(DEFAULT_MODEL);
    expect(MODEL_STORAGE_KEY).toBe("aiclub-labs-calculator-model");
  });
});

describe("reduceBench", () => {
  it("key, in a lesson: takes the expected key and moves on", () => {
    const next = run(start, ...keys(lessonKeys[0]!));
    expect(next.progress).toBe(1);
    expect(next.miss).toBeNull();
    expect(next.calc).toEqual(pressAll(initialState(start.model), [lessonKeys[0]!]));
  });

  it("key, in a lesson: refuses any other key and names the right one", () => {
    const wrong = (["7", "8", "9"] as KeyId[]).find((k) => k !== lessonKeys[0])!;
    const next = run(start, ...keys(wrong));
    expect(next.progress).toBe(0);
    expect(next.miss).toBe(lessonKeys[0]);
    expect(next.calc).toBe(start.calc);
  });

  it("key, in free use: takes every key and clears a refusal", () => {
    const free = run(start, { type: "practice", practice: "free" });
    const next = run({ ...free, miss: "eq" }, ...keys("7", "plus", "1", "eq"));
    expect(next.miss).toBeNull();
    expect(next.calc).toEqual(pressAll(initialState(start.model), ["7", "plus", "1", "eq"]));
  });

  it("key, after a lesson's last key: the calculator stays free to use", () => {
    const done = run(start, ...keys(...lessonKeys));
    expect(done.progress).toBe(lessonKeys.length);
    const after = run(done, ...keys("ac"));
    expect(after.progress).toBe(lessonKeys.length);
    expect(after.calc).toEqual(pressAll(done.calc, ["ac"]));
  });

  it("key: stops 'Show me'", () => {
    const playing = run(start, { type: "play" });
    expect(run(playing, ...keys(lessonKeys[0]!)).playing).toBe(false);
  });

  it("play: starts 'Show me' and clears a refusal", () => {
    expect(run({ ...start, miss: "eq" }, { type: "play" })).toMatchObject({
      playing: true,
      miss: null,
    });
  });

  it("advance: presses the next key itself, and stops at the end", () => {
    const one = run(start, { type: "play" }, { type: "advance" });
    expect(one.progress).toBe(1);
    expect(one.playing).toBe(true);
    const end = run(one, ...lessonKeys.slice(1).map((): BenchAction => ({ type: "advance" })));
    expect(end.progress).toBe(lessonKeys.length);
    expect(run(end, { type: "advance" }).playing).toBe(false);
  });

  it("finish: presses every remaining key at once", () => {
    const done = run(start, { type: "play" }, { type: "finish" });
    expect(done).toMatchObject({ progress: lessonKeys.length, playing: false, miss: null });
    expect(done.calc).toEqual(pressAll(initialState(start.model), lessonKeys));
    expect(lessonById(lesson).done(done.calc)).toBe(true);
  });

  it("model: starts over on the new model", () => {
    const other = MODEL_IDS.find((id) => id !== start.model)!;
    const next = run(start, ...keys(lessonKeys[0]!), { type: "model", model: other });
    expect(next).toMatchObject({ model: other, lesson, progress: 0, playing: false, daily: null });
    expect(next.calc).toEqual(initialState(other));
  });

  it("lesson: opens another lesson from its first key, in lesson mode", () => {
    const other = LESSONS[1]!.id;
    const free = run(start, { type: "practice", practice: "free" }, ...keys("5"));
    const next = run(free, { type: "lesson", id: other });
    expect(next).toMatchObject({ lesson: other, practice: "lesson", progress: 0 });
    expect(next.calc).toEqual(initialState(start.model));
  });

  it("lesson: an unknown id falls back to the first lesson's keys", () => {
    expect(keysOf({ lesson: "no-such-lesson", model: start.model })).toEqual(lessonKeys);
  });

  it("practice: switches mode and starts over", () => {
    const next = run(start, ...keys(lessonKeys[0]!), { type: "practice", practice: "free" });
    expect(next).toMatchObject({ practice: "free", progress: 0, miss: null });
    expect(next.calc).toEqual(initialState(start.model));
  });

  it("restart: clears the calculator and the lesson's progress", () => {
    const next = run(start, ...keys(lessonKeys[0]!), { type: "restart" });
    expect(next).toMatchObject({ lesson, practice: "lesson", progress: 0 });
    expect(next.calc).toEqual(initialState(start.model));
  });

  it("dailyOpen: opens the day's puzzle for this model with the stored progress", () => {
    const progress = [{ misses: [], done: "solved" as const }];
    const next = run(start, { type: "dailyOpen", day: DAY, progress });
    expect(next.practice).toBe("daily");
    expect(next.daily).toMatchObject({ day: DAY, model: start.model, progress, verdict: null });
    expect(next.daily!.tasks).toEqual(
      makePuzzle(start.model, DAY).map((t) => expect.objectContaining({ kind: t.kind })),
    );
  });

  it("dailyAnswer: with nothing on screen, says so and costs no try", () => {
    const { bench } = dailyBench();
    const next = run(bench, { type: "dailyAnswer" });
    expect(next.daily!.verdict).toEqual({ kind: "empty" });
    expect(next.daily!.progress).toEqual(bench.daily!.progress);
  });

  it("dailyAnswer: right closes the question and keys do nothing until next", () => {
    const { bench, task } = dailyBench();
    const answered = run(bench, ...keys(...typed(task.answer), "eq"), { type: "dailyAnswer" });
    expect(answered.daily!.verdict).toEqual({ kind: "right", answer: task.answer });
    expect(answered.daily!.progress[0]).toEqual({ misses: [], done: "solved" });
    expect(run(answered, ...keys("5"))).toBe(answered);
    expect(run(answered, { type: "dailyAnswer" })).toBe(answered);

    const next = run(answered, { type: "dailyNext" });
    expect(next.daily!.verdict).toBeNull();
    expect(next.calc).toEqual(initialState(start.model));
  });

  it("dailyAnswer: wrong gives a hint and the tries left; a key clears the verdict", () => {
    const { bench, task } = dailyBench();
    const wrong = task.answer + 1000;
    const next = run(bench, ...keys(...typed(wrong), "eq"), { type: "dailyAnswer" });
    expect(next.daily!.verdict).toEqual({ kind: "wrong", hint: "lower", left: TRIES - 1 });
    expect(run(next, ...keys("ac")).daily!.verdict).toBeNull();
  });

  it("dailyGiveUp: closes the question as missed", () => {
    const { bench, task } = dailyBench();
    const next = run(bench, { type: "dailyGiveUp" });
    expect(next.daily!.verdict).toEqual({ kind: "missed", answer: task.answer });
    expect(next.daily!.progress[0]!.done).toBe("missed");
  });

  it("dailyAnswer and dailyGiveUp do nothing outside the daily puzzle", () => {
    expect(run(start, { type: "dailyAnswer" })).toBe(start);
    expect(run(start, { type: "dailyGiveUp" })).toBe(start);
  });

  it("dailyNext with no puzzle open only clears the calculator", () => {
    const free = run(start, { type: "practice", practice: "free" }, ...keys("5"));
    const next = run(free, { type: "dailyNext" });
    expect(next.daily).toBeNull();
    expect(next.calc).toEqual(initialState(start.model));
  });
});

describe("practiceTask", () => {
  const cases = LESSONS.flatMap((l) =>
    (Object.keys(l.steps) as ModelId[]).map((model) => [l.id, model] as const),
  );

  it("sets a question after every lesson that has one, written cleanly in both languages", () => {
    let found = 0;
    for (const [id, model] of cases) {
      const task = practiceTask(id, model);
      if (!task) continue;
      found++;
      for (const text of [task.prompt.en, task.prompt.tr]) {
        expect(text.trim()).not.toBe("");
        expect(text, text).not.toMatch(/\+ −|\+ 0\b|− 0\b|\b1x|\b1y|\+ -|NaN|undefined/);
      }
      expect(task.prompt.tr).not.toBe(task.prompt.en);
      expect(Number.isFinite(task.answer)).toBe(true);
    }
    expect(found).toBeGreaterThan(cases.length / 2);
  });

  it("uses the lesson's own question, in both languages, where it has one", () => {
    for (const id of Object.keys(CALCULATOR_COPY.en.practiceQuestions)) {
      expect(CALCULATOR_COPY.tr.practiceQuestions[id], id).toBeDefined();
      const task = practiceTask(id, DEFAULT_MODEL)!;
      expect(task.kind).toBe(id);
      expect(task.prompt).toEqual({
        en: CALCULATOR_COPY.en.practiceQuestions[id]!.prompt,
        tr: CALCULATOR_COPY.tr.practiceQuestions[id]!.prompt,
      });
      expect(task.topic).toEqual({ en: "Practice", tr: "Alıştırma" });
    }
  });

  it("reads the answer the way each own question asks", () => {
    const m = DEFAULT_MODEL;
    const fraction = practiceTask("fraction", m)!;
    expect(judge(fraction, pressAll(initialState(m), ["0", "dot", "7", "5", "eq"])).kind).toBe(
      "right",
    );
    // "memory" wants the 5 stored, not 15 typed in.
    const memory = practiceTask("memory", m)!;
    expect(judge(memory, pressAll(initialState(m), ["1", "5", "eq"])).kind).toBe("empty");
  });

  it("maps lessons to the daily-puzzle kind they teach", () => {
    expect(practiceTask("angle", DEFAULT_MODEL)?.kind).toBe("trigDegrees");
    expect(practiceTask("variance", DEFAULT_MODEL)?.kind).toBe("popVariance");
    expect(practiceTask("regression", DEFAULT_MODEL)?.kind).toBe("slope");
  });

  it("is the same question every time for the same lesson and model", () => {
    for (const [id, model] of cases.slice(0, 20)) {
      expect(practiceTask(id, model)?.prompt).toEqual(practiceTask(id, model)?.prompt);
    }
  });
});
