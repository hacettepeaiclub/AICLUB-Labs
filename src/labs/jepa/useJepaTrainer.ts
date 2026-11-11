import { useCallback, useEffect, useRef, useState } from "react";
import { useRafLoop } from "@/hooks";
import { createRng } from "@/lib/random";
import {
  createJepa,
  drawSample,
  guesses,
  kindAccuracy,
  pictures,
  place,
  project,
  separation,
  spread,
  trainStep,
  vectorsOf,
  type Axes,
  type Jepa,
  type MapPoint,
  type Sample,
} from "./engine";
import type { MapGuess } from "./components/MapView";

/** Twelve pictures, 192 patches: the dots on the map, the same for every model. */
export const REFERENCE = pictures(4242, 12);

const samples = (seed: number, count: number): Sample[] => {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => drawSample(rng));
};
/** Hidden blocks the right-kind score is taken on. */
const PROBE = samples(99, 30);
/** The pictures shown beside the map, one after another as training goes. */
const SHOWN = samples(31, 16);

/** Enough for the start the lab opens on to keep every kind apart. */
export const MAX_STEPS = 3000;
const SHOW_EVERY = 100;
const FRAME_BUDGET_MS = 8;
const PUBLISH_INTERVAL_SEC = 0.1;
const HISTORY_EVERY = 10;

export interface Snapshot {
  readonly steps: number;
  /** The loss, smoothed over recent steps; null before the first. */
  readonly loss: number | null;
  readonly history: readonly number[];
  readonly points: readonly MapPoint[];
  readonly sample: Sample;
  readonly guesses: readonly MapGuess[];
  readonly separation: number;
  readonly spread: number;
  readonly accuracy: number;
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

/**
 * Everything the screen shows about a run, read off the model at once. The
 * map is of the target encoder Ē — the vectors the guesses aim for — laid
 * flat on axes kept from the previous snapshot so it moves rather than flips.
 */
function snapshotOf(run: Run): Snapshot {
  const { model } = run;
  const vectors = vectorsOf(model.target, REFERENCE);
  const flat = project(vectors, run.axes);
  run.axes = flat.axes;
  const sample = SHOWN[Math.floor(model.steps / SHOW_EVERY) % SHOWN.length]!;
  const shown = guesses(model, sample.picture, sample.hidden).map((g) => ({
    guess: place(g.guess, flat.axes, flat.mean),
    goal: place(g.goal, flat.axes, flat.mean),
  }));
  return {
    steps: model.steps,
    loss: run.smoothed,
    history: [...run.history],
    points: flat.points,
    sample,
    guesses: shown,
    separation: separation(vectorsOf(model.encoder, REFERENCE)),
    spread: spread(vectors),
    accuracy: kindAccuracy(model, PROBE, vectors),
  };
}

export interface JepaTrainer {
  snapshot: Snapshot;
  running: boolean;
  setRunning: (running: boolean) => void;
  restart: () => void;
}

/**
 * A JEPA trained in the browser while it is watched. The model lives in a
 * ref, outside React; the screen gets a snapshot every tenth of a second.
 * A new seed or a change of target (slow copy or not) is a new model.
 */
export function useJepaTrainer(seed: number, slowCopy: boolean): JepaTrainer {
  const runRef = useRef<Run | null>(null);
  runRef.current ??= newRun(seed);
  const [snapshot, setSnapshot] = useState<Snapshot>(() =>
    snapshotOf(runRef.current ?? newRun(seed)),
  );
  const [running, setRunning] = useState(false);
  const slowRef = useRef(slowCopy);
  slowRef.current = slowCopy;

  const restart = useCallback(() => {
    const run = newRun(seed);
    runRef.current = run;
    setRunning(false);
    setSnapshot(snapshotOf(run));
  }, [seed]);

  // A different start or a different target is a different model.
  useEffect(restart, [restart, slowCopy]);

  const sinceRef = useRef(0);
  useRafLoop(
    useCallback((dtSec: number) => {
      const run = runRef.current;
      if (!run) return;
      const start = performance.now();
      while (run.model.steps < MAX_STEPS && performance.now() - start < FRAME_BUDGET_MS) {
        const loss = trainStep(run.model, run.rng, { slowCopy: slowRef.current });
        run.smoothed = run.smoothed === null ? loss : 0.95 * run.smoothed + 0.05 * loss;
        if (run.model.steps % HISTORY_EVERY === 0) run.history.push(run.smoothed);
      }
      const finished = run.model.steps >= MAX_STEPS;
      sinceRef.current += dtSec;
      if (sinceRef.current < PUBLISH_INTERVAL_SEC && !finished) return;
      sinceRef.current = 0;
      setSnapshot(snapshotOf(run));
      if (finished) setRunning(false);
    }, []),
    running,
  );

  return { snapshot, running, setRunning, restart };
}
