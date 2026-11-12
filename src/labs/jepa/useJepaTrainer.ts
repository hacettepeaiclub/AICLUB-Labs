import { useCallback, useEffect, useRef, useState } from "react";
import { useRafLoop } from "@/hooks";
import { blockAt, GRID, type Sample, type TrainOptions } from "./engine";
import {
  MAX_STEPS,
  SHOWN,
  newRun,
  snapshotOf,
  takeTrainingStep,
  type Run,
} from "./trainingSnapshot";
import type { SnapshotResponse, TrainingAction } from "./snapshotProtocol";
export { MAX_STEPS, REFERENCE } from "./trainingSnapshot";
export type { Snapshot } from "./trainingSnapshot";

/** Workers own training, evaluation and projection; the UI only displays coherent snapshots. */
export function useJepaTrainer(seed: number, options: TrainOptions, active: boolean) {
  const run = useRef<Run | null>(null);
  run.current ??= newRun(seed);
  const baseline = useRef<Run | null>(null);
  baseline.current ??= newRun(seed);
  const preview = useRef<Sample>({ picture: SHOWN[0]!, hidden: blockAt(1, 1) }),
    pictureIndex = useRef(0);
  const [snapshot, setSnapshot] = useState(() => snapshotOf(run.current!, preview.current));
  baseline.current.evaluation ??= run.current.evaluation;
  const [before, setBefore] = useState(snapshot),
    [running, updateRunning] = useState(false),
    [goal, setGoal] = useState(0),
    [workerReady, setWorkerReady] = useState(false);
  const workerRef = useRef<Worker | null>(null),
    generation = useRef(0),
    previewVersion = useRef(0);
  const goalRef = useRef(0),
    activeRef = useRef(active),
    optionsRef = useRef(options),
    since = useRef(0);
  activeRef.current = active;
  optionsRef.current = options;
  const send = useCallback((action: TrainingAction, invalidate = false) => {
    if (invalidate) generation.current++;
    if (!workerRef.current) return false;
    workerRef.current.postMessage({
      ...action,
      generation: generation.current,
      preview: previewVersion.current,
    });
    return true;
  }, []);
  useEffect(() => {
    if (typeof Worker === "undefined") return;
    let worker: Worker;
    try {
      worker = new Worker(new URL("./snapshot.worker.ts", import.meta.url), { type: "module" });
    } catch {
      return;
    }
    workerRef.current = worker;
    setWorkerReady(true);
    worker.onmessage = ({ data }: MessageEvent<SnapshotResponse>) => {
      if (
        workerRef.current !== worker ||
        data.kind !== "snapshot" ||
        data.generation !== generation.current ||
        data.preview !== previewVersion.current
      )
        return;
      // Worker messages clone every object. Keep the unchanged picture/mask
      // identity so training does not reconcile its hundreds of static pixels.
      setSnapshot({ ...data.snapshot, sample: preview.current });
      setGoal(data.goal);
      goalRef.current = data.goal;
      updateRunning(data.running);
    };
    worker.onerror = (event) => {
      if (workerRef.current !== worker) return;
      event.preventDefault();
      worker.terminate();
      workerRef.current = null;
      setWorkerReady(false);
      if (run.current) setSnapshot(snapshotOf(run.current, preview.current));
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);
  const restart = useCallback(() => {
    run.current = newRun(seed);
    baseline.current = newRun(seed);
    goalRef.current = 0;
    since.current = 0;
    const initial = snapshotOf(run.current, preview.current);
    baseline.current.evaluation = run.current.evaluation;
    setSnapshot(initial);
    setBefore(initial);
    updateRunning(false);
    setGoal(0);
    send(
      {
        kind: "init",
        seed,
        options: optionsRef.current,
        sample: preview.current,
        active: activeRef.current,
        channel: "snapshot",
      },
      true,
    );
  }, [seed, send]);
  useEffect(restart, [restart, options.slowCopy, options.stopGradient]);
  useEffect(() => {
    send({ kind: "active", active });
  }, [active, send]);
  const setRunning = (value: boolean) => {
    updateRunning(value);
    if (value) {
      goalRef.current = MAX_STEPS;
      setGoal(MAX_STEPS);
    }
    send({ kind: "play", running: value }, true);
  };
  const advance = () => {
    updateRunning(false);
    if (send({ kind: "advance" }, true)) return;
    const current = run.current!;
    for (let i = 0; i < 10 && current.model.steps < MAX_STEPS; i++)
      takeTrainingStep(current, optionsRef.current);
    goalRef.current = current.model.steps;
    setGoal(current.model.steps);
    setSnapshot(snapshotOf(current, preview.current));
  };
  const seek = (steps: number) => {
    const target = Math.max(0, Math.min(MAX_STEPS, Math.round(steps)));
    goalRef.current = target;
    setGoal(target);
    updateRunning(target !== snapshot.steps);
    if (send({ kind: "seek", target }, true)) return;
    if (target < run.current!.model.steps) run.current = newRun(seed);
    updateRunning(run.current!.model.steps < target);
    setSnapshot(snapshotOf(run.current!, preview.current));
  };
  const updatePreview = useCallback(() => {
    previewVersion.current++;
    if (!send({ kind: "sample", sample: preview.current }))
      setSnapshot(snapshotOf(run.current!, preview.current));
    setBefore(snapshotOf(baseline.current!, preview.current));
  }, [send]);
  const moveBlock = useCallback(
    (index: number) => {
      const hidden = blockAt(
        Math.min(GRID - 2, index % GRID),
        Math.min(GRID - 2, Math.floor(index / GRID)),
      );
      if (hidden[0] === preview.current.hidden[0]) return;
      preview.current = { ...preview.current, hidden };
      updatePreview();
    },
    [updatePreview],
  );
  const nextPicture = useCallback(() => {
    pictureIndex.current = (pictureIndex.current + 1) % SHOWN.length;
    preview.current = { ...preview.current, picture: SHOWN[pictureIndex.current]! };
    updatePreview();
  }, [updatePreview]);
  useRafLoop(
    useCallback((dt: number) => {
      const current = run.current!;
      const start = performance.now();
      while (current.model.steps < goalRef.current && performance.now() - start < 4)
        takeTrainingStep(current, optionsRef.current);
      const done = current.model.steps >= goalRef.current;
      since.current += dt;
      if (since.current < 0.1 && !done) return;
      since.current = 0;
      setSnapshot(snapshotOf(current, preview.current));
      if (done) updateRunning(false);
    }, []),
    running && active && !workerReady,
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
