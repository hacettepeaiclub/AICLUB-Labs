import type { Jepa, Sample, TrainOptions } from "./engine";
import type { Snapshot } from "./trainingSnapshot";

type Envelope = { generation: number; preview: number };
export type TrainingAction =
  | {
      kind: "init";
      seed: number;
      options: TrainOptions;
      sample: Sample;
      active: boolean;
      channel: "snapshot" | "model";
      autostart?: boolean;
    }
  | { kind: "play"; running: boolean }
  | { kind: "seek"; target: number }
  | { kind: "advance" }
  | { kind: "sample"; sample: Sample }
  | { kind: "active"; active: boolean };
export type SnapshotResponse = Envelope & { goal: number; running: boolean } & (
    { kind: "snapshot"; snapshot: Snapshot } | { kind: "model"; model: Jepa }
  );

export type SnapshotRequest = Envelope & TrainingAction;
