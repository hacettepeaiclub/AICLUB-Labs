import { describe, expect, it } from "vitest";
import { initialState, press, type CalcState } from "./engine/machine";
import { MODEL_IDS, MODELS } from "./engine/models";
import type { ModelId } from "./engine/types";
import { LESSONS, offered } from "./lessons";

/** Every key a model's keyboard has, so a lesson cannot ask for one it lacks. */
const keysOn = (id: ModelId) => {
  const model = MODELS[id];
  return new Set([
    ...model.top.flat().map((key) => key.id),
    ...model.functionRows.flat().map((key) => key.id),
    ...model.digitRows.flat().map((key) => key.id),
    "up",
    "down",
    "left",
    "right",
  ]);
};

describe("every lesson, on every model that can do it", () => {
  for (const lesson of LESSONS) {
    for (const model of MODEL_IDS) {
      if (!offered(lesson, model)) continue;
      it(`${lesson.id} on ${model}: its keys give the answer it promises`, () => {
        const available = keysOn(model);
        let s: CalcState = initialState(model);
        for (const step of lesson.steps[model]!) {
          expect(step.keys.length, `an empty step in ${lesson.id}`).toBeGreaterThan(0);
          for (const key of step.keys) {
            expect(available.has(key), `${model} has no ${key} key`).toBe(true);
            s = press(s, key);
            // A lesson never walks into something the simulation cannot do.
            expect(s.notice, `${lesson.id} on ${model}: ${key}`).toBeNull();
            expect(s.screen.s, `${lesson.id} on ${model}: ${key} gave an error`).not.toBe("error");
          }
        }
        expect(lesson.done(s)).toBe(true);
      });
    }
  }

  it("is not finished before its last key", () => {
    for (const lesson of LESSONS) {
      for (const model of MODEL_IDS) {
        if (!offered(lesson, model)) continue;
        const keys = lesson.steps[model]!.flatMap((step) => step.keys);
        const s = keys.slice(0, -1).reduce(press, initialState(model));
        expect(lesson.done(s), `${lesson.id} on ${model}`).toBe(false);
      }
    }
  });

  it("is offered wherever the model has what it needs", () => {
    const missing = (id: string, model: ModelId) =>
      !offered(
        LESSONS.find((l) => l.id === id)!,
        model,
      );
    // The 82 has no equation solver, matrices, calculus, or normal distribution.
    for (const id of [
      "system",
      "quadratic",
      "solve",
      "integral",
      "derivative",
      "normal",
      "determinant",
    ]) {
      expect(missing(id, "fx82esplus"), id).toBe(true);
    }
    // Everything else is offered on every model.
    for (const lesson of LESSONS) {
      for (const model of MODEL_IDS) {
        if (model === "fx82esplus") continue;
        expect(offered(lesson, model), `${lesson.id} on ${model}`).toBe(true);
      }
    }
  });

  it("is written in both languages", () => {
    for (const lesson of LESSONS) {
      const texts = [
        lesson.title,
        lesson.why,
        lesson.outcome,
        ...MODEL_IDS.flatMap((m) => (lesson.steps[m] ?? []).map((step) => step.say)),
      ];
      for (const text of texts) {
        expect(text.en.trim()).not.toBe("");
        expect(text.tr.trim()).not.toBe("");
        if (text.en.length > 24) expect(text.tr, text.en).not.toBe(text.en);
      }
    }
  });
});
