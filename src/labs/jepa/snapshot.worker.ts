import { blockAt, type TrainOptions } from "./engine";
import { MAX_STEPS, SHOWN, newRun, snapshotOf, takeTrainingStep } from "./trainingSnapshot";
import type { SnapshotRequest, SnapshotResponse } from "./snapshotProtocol";

let seed = 1,
  run = newRun(1),
  generation = -1,
  preview = 0,
  goal = 0;
let options: TrainOptions = { slowCopy: true, stopGradient: true };
let sample = { picture: SHOWN[0]!, hidden: blockAt(1, 1) };
let active = false,
  running = false,
  channel: "snapshot" | "model" = "snapshot";
let timer: ReturnType<typeof setTimeout> | undefined,
  lastPublish = 0;
let publication: ReturnType<typeof setTimeout> | undefined;
const emit = () => {
  if (publication !== undefined) {
    clearTimeout(publication);
    publication = undefined;
  }
  const base = { generation, preview, goal, running };
  const response: SnapshotResponse =
    channel === "snapshot"
      ? { ...base, kind: "snapshot", snapshot: snapshotOf(run, sample) }
      : { ...base, kind: "model", model: run.model };
  self.postMessage(response);
  lastPublish = performance.now();
};
const schedule = () => {
  if (timer !== undefined || !active || !running) return;
  timer = setTimeout(() => {
    timer = undefined;
    if (!active || !running) return;
    const start = performance.now();
    while (run.model.steps < goal && performance.now() - start < 8) takeTrainingStep(run, options);
    if (run.model.steps >= goal) running = false;
    if (!running || performance.now() - lastPublish >= 100) emit();
    schedule();
  }, 0);
};
self.onmessage = ({ data }: MessageEvent<SnapshotRequest>) => {
  if (data.generation < generation) return;
  generation = data.generation;
  preview = data.preview;
  switch (data.kind) {
    case "init":
      seed = data.seed;
      options = data.options;
      run = newRun(seed);
      sample = { ...data.sample, hidden: [...data.sample.hidden] };
      active = data.active;
      channel = data.channel;
      goal = data.autostart ? MAX_STEPS : 0;
      running = !!data.autostart;
      break;
    case "play":
      running = data.running;
      if (running) goal = MAX_STEPS;
      break;
    case "seek":
      goal = Math.max(0, Math.min(MAX_STEPS, Math.round(data.target)));
      if (goal < run.model.steps) run = newRun(seed);
      running = run.model.steps < goal;
      break;
    case "advance":
      running = false;
      for (let i = 0; i < 10 && run.model.steps < MAX_STEPS; i++) takeTrainingStep(run, options);
      goal = run.model.steps;
      break;
    case "sample":
      sample = { ...data.sample, hidden: [...data.sample.hidden] };
      break;
    case "active":
      active = data.active;
      break;
  }
  if (timer !== undefined && (!active || !running)) {
    clearTimeout(timer);
    timer = undefined;
  }
  // Coalesce rapid drags/seeks before doing projection and scoring. Commands
  // update state immediately; obsolete intermediate views never form a backlog.
  if (publication === undefined)
    publication = setTimeout(() => {
      publication = undefined;
      emit();
    }, 0);
  schedule();
};
