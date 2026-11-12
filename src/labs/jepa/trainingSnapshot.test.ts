import { describe, expect, it } from "vitest";
import { createJepa, trainStep, type TrainOptions } from "./engine";
import { createRng } from "@/lib/random";
import { newRun, takeTrainingStep } from "./trainingSnapshot";

describe("worker training fidelity", () => {
  for (const options of [
    { slowCopy: true, stopGradient: true },
    { slowCopy: false, stopGradient: true },
    { slowCopy: false, stopGradient: false },
  ] satisfies TrainOptions[]) {
    it(`preserves every parameter with EMA=${options.slowCopy}, stop-gradient=${options.stopGradient}`, () => {
      const run = newRun(2),
        reference = createJepa(2),
        rng = createRng(154);
      for (let i = 0; i < 60; i++) {
        takeTrainingStep(run, options);
        trainStep(reference, rng, options);
      }
      for (const name of ["encoder", "predictor", "target"] as const)
        for (const key of ["w1", "b1", "w2", "b2"] as const)
          expect(Array.from(run.model[name][key])).toEqual(Array.from(reference[name][key]));
      expect(run.model.steps).toBe(60);
      expect(run.history).toHaveLength(6);
    });
  }
});
