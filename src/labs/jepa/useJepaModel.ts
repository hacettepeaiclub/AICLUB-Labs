import { useEffect, useRef, useState } from "react";
import { useRafLoop } from "@/hooks";
import { blockAt } from "./engine";
import { MAX_STEPS, SHOWN, newRun, takeTrainingStep } from "./trainingSnapshot";
import type { SnapshotRequest, SnapshotResponse } from "./snapshotProtocol";

/** Application and pixel comparison share the same worker trainer, without scoring a probe. */
export function useJepaModel(active: boolean, enabled = true) {
  const run = useRef<ReturnType<typeof newRun> | null>(null);
  run.current ??= newRun(1);
  const [model, setModel] = useState(run.current.model),
    [background, setBackground] = useState(false);
  const workerRef = useRef<Worker | null>(null),
    activeRef = useRef(active),
    last = useRef(0);
  activeRef.current = active;
  useEffect(() => {
    if (!enabled || typeof Worker === "undefined") return;
    let worker: Worker;
    try {
      worker = new Worker(new URL("./snapshot.worker.ts", import.meta.url), { type: "module" });
    } catch {
      return;
    }
    workerRef.current = worker;
    setBackground(true);
    worker.onmessage = ({ data }: MessageEvent<SnapshotResponse>) => {
      if (workerRef.current === worker && data.kind === "model") setModel(data.model);
    };
    worker.onerror = (event) => {
      if (workerRef.current !== worker) return;
      event.preventDefault();
      worker.terminate();
      workerRef.current = null;
      setBackground(false);
      setModel({ ...run.current!.model });
    };
    const request: SnapshotRequest = {
      kind: "init",
      generation: 1,
      preview: 0,
      seed: 1,
      options: { slowCopy: true, stopGradient: true },
      sample: { picture: SHOWN[0]!, hidden: blockAt(1, 1) },
      active: activeRef.current,
      channel: "model",
      autostart: true,
    };
    worker.postMessage(request);
    return () => {
      worker.terminate();
      workerRef.current = null;
      setBackground(false);
    };
  }, [enabled]);
  useEffect(() => {
    const request: SnapshotRequest = { kind: "active", generation: 1, preview: 0, active };
    workerRef.current?.postMessage(request);
  }, [active]);
  useRafLoop(
    () => {
      const current = run.current!,
        start = performance.now();
      while (current.model.steps < MAX_STEPS && performance.now() - start < 4)
        takeTrainingStep(current, { slowCopy: true, stopGradient: true });
      if (current.model.steps === MAX_STEPS || performance.now() - last.current >= 100) {
        last.current = performance.now();
        setModel({ ...current.model });
      }
    },
    enabled && active && !background && model.steps < MAX_STEPS,
  );
  return model;
}
