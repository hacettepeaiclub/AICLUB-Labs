import { useCallback, useRef, useState, type MutableRefObject } from "react";
import { createSort, runToEnd, step, type Algorithm, type Sort, type SortResult } from "./engine";

export interface RunMetrics {
  status: "idle" | "running" | "done";
  comparisons: number;
  moves: number;
}

const IDLE: RunMetrics = { status: "idle", comparisons: 0, moves: 0 };

/** Metrics reach React ten times a second; the sort itself runs every frame. */
const PUBLISH_MS = 100;

export interface SortRun {
  /** One live sort per algorithm. Read from the draw loop, never render from it. */
  sortsRef: MutableRefObject<(Sort | null)[]>;
  running: boolean;
  metrics: RunMetrics[];
  /** Filled in when a run finishes, so a panel can keep showing its result. */
  results: (SortResult | null)[];
  announcement: string;
  /** Bump into the canvas to force a repaint while idle. */
  revision: number;
  start: () => void;
  stepOnce: () => void;
  reset: () => void;
  announce: (text: string) => void;
  /** Called by the canvas once per animation frame while running. */
  advanceFrame: () => void;
}

export interface SortRunOptions {
  valuesRef: MutableRefObject<Int32Array>;
  /** One entry per panel. Section 1 passes two; the rest pass one. */
  algorithms: readonly Algorithm[];
  /** With reduced motion the sort finishes instantly instead of animating. */
  reduced: boolean;
  /** Events per animation frame, shared by every panel so a race stays in lockstep. */
  eventsPerFrame: number;
}

const metricsOf = (s: Sort | null): RunMetrics =>
  s === null ? IDLE : { status: s.status, comparisons: s.comparisons, moves: s.moves };

const resultOf = (s: Sort): SortResult => ({
  comparisons: s.comparisons,
  moves: s.moves,
  steps: s.steps,
  values: s.values,
});

/**
 * Drives one or two sorts over the same array.
 *
 * `start` creates a sort per algorithm from the current values and lets the
 * canvas advance them a few events per frame; nothing is precomputed and
 * nothing is replayed. Every panel gets the same number of events each frame,
 * so finishing first means having less to do — never being measured against a
 * clock.
 */
export function useSortRun({
  valuesRef,
  algorithms,
  reduced,
  eventsPerFrame,
}: SortRunOptions): SortRun {
  const sortsRef = useRef<(Sort | null)[]>(algorithms.map(() => null));
  const [running, setRunning] = useState(false);
  const [metrics, setMetrics] = useState<RunMetrics[]>(() => algorithms.map(() => IDLE));
  const [results, setResults] = useState<(SortResult | null)[]>(() => algorithms.map(() => null));
  const [announcement, setAnnouncement] = useState("");
  const [revision, setRevision] = useState(0);
  const lastPublishRef = useRef(0);

  const algorithmsRef = useRef(algorithms);
  algorithmsRef.current = algorithms;
  const eventsRef = useRef(eventsPerFrame);
  eventsRef.current = eventsPerFrame;

  const publish = useCallback(() => {
    setMetrics(sortsRef.current.map(metricsOf));
  }, []);

  const finish = useCallback(() => {
    setRunning(false);
    setMetrics(sortsRef.current.map(metricsOf));
    setResults(sortsRef.current.map((s) => (s ? resultOf(s) : null)));
    setRevision((r) => r + 1);
  }, []);

  const create = useCallback(() => {
    // Every panel starts from the same values. `createSort` copies them, so the
    // panels cannot disturb each other or the array the visitor drew.
    sortsRef.current = algorithmsRef.current.map((a) => createSort(valuesRef.current, a));
  }, [valuesRef]);

  const reset = useCallback(() => {
    sortsRef.current = algorithmsRef.current.map(() => null);
    setRunning(false);
    setMetrics(algorithmsRef.current.map(() => IDLE));
    setResults(algorithmsRef.current.map(() => null));
    setRevision((r) => r + 1);
  }, []);

  const start = useCallback(() => {
    const live = sortsRef.current;
    if (live.some((s) => s !== null && s.status === "running")) {
      setRunning((value) => !value);
      return;
    }

    create();
    setAnnouncement("Sorting.");
    setResults(algorithmsRef.current.map(() => null));

    if (reduced) {
      for (const s of sortsRef.current) if (s) runToEnd(s);
      finish();
      setAnnouncement(
        sortsRef.current
          .map((s) => (s ? `${s.algorithm}: ${s.comparisons} comparisons, ${s.moves} moves.` : ""))
          .join(" "),
      );
      return;
    }

    lastPublishRef.current = 0;
    setRunning(true);
    setRevision((r) => r + 1);
  }, [create, reduced, finish]);

  const stepOnce = useCallback(() => {
    const live = sortsRef.current;
    if (live.every((s) => s === null || s.status === "done")) create();
    setRunning(false);
    for (const s of sortsRef.current) if (s && s.status === "running") step(s);
    if (sortsRef.current.every((s) => s === null || s.status === "done")) finish();
    else {
      publish();
      setRevision((r) => r + 1);
    }
  }, [create, finish, publish]);

  const advanceFrame = useCallback(() => {
    const live = sortsRef.current;
    const budget = eventsRef.current;
    for (let i = 0; i < budget; i++) {
      for (const s of live) if (s && s.status === "running") step(s);
    }
    if (live.every((s) => s === null || s.status === "done")) {
      finish();
      return;
    }
    const now = performance.now();
    if (now - lastPublishRef.current >= PUBLISH_MS) {
      lastPublishRef.current = now;
      publish();
    }
  }, [finish, publish]);

  const announce = useCallback((text: string) => setAnnouncement(text), []);

  return {
    sortsRef,
    running,
    metrics,
    results,
    announcement,
    revision,
    start,
    stepOnce,
    reset,
    announce,
    advanceFrame,
  };
}
