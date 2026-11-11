import { useCallback, useEffect, useRef, useState } from "react";
import { useRafLoop } from "@/hooks";
import { createRng } from "@/lib/random";
import {
  blockAt,
  createJepa,
  drawSample,
  evaluateKinds,
  GRID,
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
const SHOWN = pictures(31, 16);
export const MAX_STEPS = 3000;
const FRAME_BUDGET_MS = 4;
const HISTORY_EVERY = 10;

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
interface Run {
  model: Jepa;
  rng: () => number;
  smoothed: number | null;
  history: number[];
  axes: Axes | undefined;
}
const newRun = (seed: number): Run => ({
  model: createJepa(seed),
  rng: createRng(seed * 77),
  smoothed: null,
  history: [],
  axes: undefined,
});
function snapshotOf(run: Run, sample: Sample): Snapshot {
  const vectors = vectorsOf(run.model.target, REFERENCE);
  const flat = project(vectors, run.axes);
  run.axes = flat.axes;
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
    separation: separation(vectors),
    spread: spread(vectors),
    scores: evaluateKinds(run.model, PROBE, vectors),
  };
}
function takeStep(run: Run, options: TrainOptions) {
  const loss = trainStep(run.model, run.rng, options);
  run.smoothed = run.smoothed === null ? loss : 0.95 * run.smoothed + 0.05 * loss;
  if (run.model.steps % HISTORY_EVERY === 0) run.history.push(run.smoothed);
}

/** Preview masks never enter training or scoring. All methods use identical seeded batches. */
export function useJepaTrainer(seed: number, options: TrainOptions, active: boolean) {
  const runRef = useRef<Run | null>(null);
  runRef.current ??= newRun(seed);
  const pictureIndex = useRef(0);
  const preview = useRef<Sample>({ picture: SHOWN[0]!, hidden: blockAt(1, 1) });
  const [snapshot, setSnapshot] = useState(() => snapshotOf(runRef.current!, preview.current));
  const [before, setBefore] = useState(snapshot);
  const [running, updateRunning] = useState(false);
  const [goal, setGoal] = useState(0);
  const goalRef = useRef(0);
  const setRunning = (value: boolean) => {
    if (value) {
      goalRef.current = MAX_STEPS;
      setGoal(MAX_STEPS);
    }
    updateRunning(value);
  };
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const sinceRef = useRef(0);
  const restart = useCallback(() => {
    const run = newRun(seed);
    runRef.current = run;
    updateRunning(false);
    goalRef.current = 0;
    setGoal(0);
    sinceRef.current = 0;
    const initial = snapshotOf(run, preview.current);
    setSnapshot(initial);
    setBefore(initial);
  }, [seed]);
  useEffect(restart, [restart, options.slowCopy, options.stopGradient]);
  const publish = useCallback(() => {
    if (runRef.current) setSnapshot(snapshotOf(runRef.current, preview.current));
  }, []);
  const advance = useCallback(() => {
    updateRunning(false);
    const run = runRef.current;
    if (!run) return;
    for (let i = 0; i < 10 && run.model.steps < MAX_STEPS; i++) takeStep(run, optionsRef.current);
    goalRef.current = run.model.steps;
    setGoal(run.model.steps);
    publish();
  }, [publish]);
  const seek = (steps: number) => {
    const target = Math.max(0, Math.min(MAX_STEPS, Math.round(steps)));
    goalRef.current = target;
    setGoal(target);
    if (runRef.current && target < runRef.current.model.steps) {
      runRef.current = newRun(seed);
      publish();
    }
    updateRunning(!!runRef.current && runRef.current.model.steps < target);
  };
  const updatePreview = useCallback(() => {
    publish();
    setBefore(snapshotOf(newRun(seed), preview.current));
  }, [publish, seed]);
  const moveBlock = (index: number) => {
    preview.current = {
      ...preview.current,
      hidden: blockAt(
        Math.min(GRID - 2, index % GRID),
        Math.min(GRID - 2, Math.floor(index / GRID)),
      ),
    };
    updatePreview();
  };
  const nextPicture = () => {
    pictureIndex.current = (pictureIndex.current + 1) % SHOWN.length;
    preview.current = { ...preview.current, picture: SHOWN[pictureIndex.current]! };
    updatePreview();
  };
  useRafLoop(
    useCallback(
      (dt: number) => {
        const run = runRef.current;
        if (!run) return;
        const start = performance.now();
        while (run.model.steps < goalRef.current && performance.now() - start < FRAME_BUDGET_MS)
          takeStep(run, optionsRef.current);
        const done = run.model.steps >= goalRef.current;
        sinceRef.current += dt;
        if (sinceRef.current < 0.1 && !done) return;
        sinceRef.current = 0;
        publish();
        if (done) updateRunning(false);
      },
      [publish],
    ),
    running && active,
  );
  return {
    snapshot,
    before,
    running,
    setRunning,
    restart,
    advance,
    moveBlock,
    nextPicture,
    goal,
    seek,
  };
}
