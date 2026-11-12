import { createRng } from "@/lib/random";
import {
  createJepa,
  drawSample,
  evaluateKinds,
  guesses,
  pictures,
  kindNear,
  place,
  project,
  separation,
  spread,
  trainStep,
  vectorsOf,
  type Axes,
  type Guess,
  type Jepa,
  type MapPoint,
  type Sample,
  type Texture,
  type TrainOptions,
} from "./engine";
import type { MapGuess } from "./components/MapView";

export const REFERENCE = pictures(4242, 12);
const probeRng = createRng(99);
const PROBE = Array.from({ length: 30 }, () => drawSample(probeRng));
export const SHOWN = pictures(31, 16);
export const MAX_STEPS = 3000;

export interface Snapshot {
  readonly steps: number;
  readonly loss: number | null;
  readonly history: readonly number[];
  readonly points: readonly MapPoint[];
  readonly sample: Sample;
  readonly guesses: readonly MapGuess[];
  readonly traces: readonly Guess[];
  readonly decoded: readonly Texture[];
  readonly separation: number;
  readonly spread: number;
  readonly scores: ReturnType<typeof evaluateKinds>;
}
export interface Run {
  model: Jepa;
  rng: () => number;
  smoothed: number | null;
  history: number[];
  axes: Axes | undefined;
  evaluation?: {
    step: number;
    vectors: ReturnType<typeof vectorsOf>;
    flat: ReturnType<typeof project>;
    separation: number;
    spread: number;
    scores: ReturnType<typeof evaluateKinds>;
  };
}
export const newRun = (seed: number): Run => ({
  model: createJepa(seed),
  rng: createRng(seed * 77),
  smoothed: null,
  history: [],
  axes: undefined,
});
/** Identical batches, optimizer and history in the worker and main-thread fallback. */
export function takeTrainingStep(run: Run, options: TrainOptions) {
  const loss = trainStep(run.model, run.rng, options);
  run.smoothed = run.smoothed === null ? loss : 0.95 * run.smoothed + 0.05 * loss;
  if (run.model.steps % 10 === 0) run.history.push(run.smoothed);
}
export function snapshotOf(run: Run, sample: Sample): Snapshot {
  if (run.evaluation?.step !== run.model.steps) {
    const vectors = vectorsOf(run.model.target, REFERENCE);
    const flat = project(vectors, run.axes);
    run.axes = flat.axes;
    run.evaluation = {
      step: run.model.steps,
      vectors,
      flat,
      separation: separation(vectors),
      spread: spread(vectors),
      scores: evaluateKinds(run.model, PROBE, vectors),
    };
  }
  const { vectors, flat } = run.evaluation;
  const traces = guesses(run.model, sample.picture, sample.hidden);
  return {
    steps: run.model.steps,
    loss: run.smoothed,
    history: [...run.history],
    points: flat.points,
    sample,
    traces,
    decoded: traces.map((g) => kindNear(g.guess, vectors)),
    guesses: traces.map((g) => ({
      guess: place(g.guess, flat.axes, flat.mean),
      goal: place(g.goal, flat.axes, flat.mean),
    })),
    separation: run.evaluation.separation,
    spread: run.evaluation.spread,
    scores: run.evaluation.scores,
  };
}
