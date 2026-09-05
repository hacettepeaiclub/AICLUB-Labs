import { useCallback, useRef, useState, type MutableRefObject } from "react";
import {
  createSearch,
  reconstructPath,
  runToEnd,
  step,
  type Algorithm,
  type Grid,
  type Search,
  type SearchResult,
} from "./engine";

export interface RunMetrics {
  status: "idle" | "running" | "solved" | "unreachable";
  explored: number;
  pathLength: number;
  pathCost: number;
}

const IDLE: RunMetrics = { status: "idle", explored: 0, pathLength: 0, pathCost: 0 };

/** Metrics reach React ten times a second; the search itself runs every frame. */
const PUBLISH_MS = 100;

export interface SearchRun {
  /** The live search. Read it from the draw loop, never render from it. */
  searchRef: MutableRefObject<Search | null>;
  running: boolean;
  metrics: RunMetrics;
  /** The last finished run for each algorithm, for side-by-side comparison. */
  results: Partial<Record<Algorithm, SearchResult>>;
  /** Announced on meaningful transitions only. */
  announcement: string;
  /** Bump this into the canvas to force a repaint while idle. */
  revision: number;
  run: () => void;
  stepOnce: () => void;
  reset: () => void;
  clearResults: () => void;
  /** Say something in the live region — for transitions the hook cannot see. */
  announce: (text: string) => void;
  /** Called by the canvas once per animation frame while running. */
  advanceFrame: () => void;
}

export interface SearchRunOptions {
  gridRef: MutableRefObject<Grid>;
  algorithm: Algorithm;
  /** With reduced motion the search finishes instantly instead of animating. */
  reduced: boolean;
  /** Events per animation frame. Scaled to the grid so a flood takes a few seconds. */
  eventsPerFrame: number;
}

const snapshot = (s: Search): SearchResult => ({
  status: s.status,
  explored: s.explored,
  pathLength: s.pathLength,
  pathCost: s.pathCost,
  steps: s.steps,
});

const metricsOf = (s: Search): RunMetrics => ({
  status: s.status,
  explored: s.explored,
  pathLength: s.pathLength,
  pathCost: s.pathCost,
});

/**
 * Drives one search.
 *
 * `run` creates a search and lets the canvas advance it a few events per frame;
 * nothing is precomputed and nothing is replayed. Under reduced motion the
 * same engine is taken straight to the end instead, and `stepOnce` is always
 * available for going through it one move at a time.
 */
export function useSearchRun({
  gridRef,
  algorithm,
  reduced,
  eventsPerFrame,
}: SearchRunOptions): SearchRun {
  const searchRef = useRef<Search | null>(null);
  const [running, setRunning] = useState(false);
  const [metrics, setMetrics] = useState<RunMetrics>(IDLE);
  const [results, setResults] = useState<Partial<Record<Algorithm, SearchResult>>>({});
  const [announcement, setAnnouncement] = useState("");
  const [revision, setRevision] = useState(0);
  const lastPublishRef = useRef(0);

  const algorithmRef = useRef(algorithm);
  algorithmRef.current = algorithm;
  const eventsRef = useRef(eventsPerFrame);
  eventsRef.current = eventsPerFrame;

  const finish = useCallback((s: Search) => {
    setRunning(false);
    setMetrics(metricsOf(s));
    setResults((prev) => ({ ...prev, [s.algorithm]: snapshot(s) }));
    setAnnouncement(
      s.status === "solved"
        ? `Path found. ${s.pathLength} steps, cost ${s.pathCost}, ${s.explored} cells explored.`
        : `No path to the goal. ${s.explored} cells explored.`,
    );
    setRevision((r) => r + 1);
  }, []);

  const reset = useCallback(() => {
    searchRef.current = null;
    setRunning(false);
    setMetrics(IDLE);
    setAnnouncement("Search cleared.");
    setRevision((r) => r + 1);
  }, []);

  const clearResults = useCallback(() => {
    searchRef.current = null;
    setRunning(false);
    setMetrics(IDLE);
    setResults({});
    setRevision((r) => r + 1);
  }, []);

  const run = useCallback(() => {
    if (searchRef.current?.status === "running") {
      setRunning((value) => !value);
      return;
    }
    const search = createSearch(gridRef.current, algorithmRef.current, 1);
    searchRef.current = search;
    setMetrics(metricsOf(search));
    setAnnouncement("Search started.");

    if (reduced) {
      runToEnd(search);
      finish(search);
      return;
    }
    lastPublishRef.current = 0;
    setRunning(true);
    setRevision((r) => r + 1);
  }, [gridRef, reduced, finish]);

  const stepOnce = useCallback(() => {
    let search = searchRef.current;
    if (!search || search.status !== "running") {
      search = createSearch(gridRef.current, algorithmRef.current, 1);
      searchRef.current = search;
    }
    setRunning(false);
    step(search);
    if (search.status === "running") {
      setMetrics(metricsOf(search));
      setRevision((r) => r + 1);
    } else {
      finish(search);
    }
  }, [gridRef, finish]);

  const advanceFrame = useCallback(() => {
    const search = searchRef.current;
    if (!search) return;
    const budget = eventsRef.current;
    for (let i = 0; i < budget && search.status === "running"; i++) {
      step(search);
    }
    if (search.status !== "running") {
      reconstructPath(search);
      finish(search);
      return;
    }
    const now = performance.now();
    if (now - lastPublishRef.current >= PUBLISH_MS) {
      lastPublishRef.current = now;
      setMetrics(metricsOf(search));
    }
  }, [finish]);

  const announce = useCallback((text: string) => setAnnouncement(text), []);

  return {
    searchRef,
    running,
    metrics,
    results,
    announcement,
    revision,
    run,
    stepOnce,
    reset,
    clearResults,
    announce,
    advanceFrame,
  };
}
