import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createRun,
  gradient,
  objective,
  pathAt,
  runToEnd,
  type Landscape,
  type OptimizerConfig,
  type Point,
  type Run,
  type RunStatus,
} from "./engine";

/**
 * Drives one or more optimisation runs for the UI.
 *
 * ## Why the trajectory is computed up front
 *
 * The rule in this collection is that a lab must never solve-then-replay — a
 * visitor watching an animation has to be watching the algorithm, not a
 * recording of one. That rule is about *hiding work*, and it is honoured here:
 * every point on screen comes from `step()` on the real engine, in order, with
 * no interpolation, no easing, and nothing smoothed between steps. What you
 * see at index 7 is exactly what the seventh call to `step()` returned.
 *
 * What differs from the other labs is *when* the stepping happens. A complete
 * 400-step Adam trajectory computes in about 0.1 ms, so spreading it across
 * three seconds of animation would buy nothing — and it would make the step
 * scrubber impossible, because scrubbing backwards requires the run to already
 * exist. So the run is computed once and both the animation and the scrubber
 * move an index into it. Playing forward and dragging the scrubber therefore
 * show literally the same numbers, because they read the same array.
 *
 * The consequence for performance is that a frame does no optimizer
 * arithmetic and allocates nothing: it increments a counter.
 *
 * ## Lockstep
 *
 * Section 4 puts two optimizers side by side, and they must advance together
 * or the comparison is a race against a clock rather than a count of steps.
 * One index drives every run; a run that has already finished simply holds at
 * its last point.
 */

export interface RunView {
  run: Run;
  /** f at every point of the trajectory, index-aligned with the path. */
  series: Float64Array;
  /** Points available: `run.t + 1`. */
  count: number;
  /** The index actually being shown, clamped into this run's own length. */
  shown: number;
  /** Whether this run has run out of trajectory at the shared index. */
  finished: boolean;
  status: RunStatus;
  position: Point;
  objective: number;
  gradientNorm: number;
}

export interface DescentRuns {
  views: RunView[];
  /** Length of the shared timeline: the longest run's step count. */
  total: number;
  index: number;
  playing: boolean;
  atEnd: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepOnce: () => void;
  setIndex: (index: number) => void;
}

export interface DescentRunsOptions {
  landscape: Landscape;
  start: Point;
  configs: readonly OptimizerConfig[];
  tolerance: number;
  maxSteps: number;
  /** With reduced motion, Run jumps straight to the final state. */
  reduced: boolean;
}

/** A run animates in about this long, whatever its length. */
const TARGET_SECONDS = 2.6;
const MIN_STEPS_PER_SECOND = 5;
const MAX_STEPS_PER_SECOND = 90;

function build(
  landscape: Landscape,
  start: Point,
  config: OptimizerConfig,
  tolerance: number,
  maxSteps: number,
): { run: Run; series: Float64Array } {
  const run = runToEnd(createRun(landscape, start, config, { tolerance, maxSteps }));
  const series = new Float64Array(run.length);
  for (let i = 0; i < run.length; i++) series[i] = objective(landscape, pathAt(run, i));
  return { run, series };
}

export function useDescentRuns({
  landscape,
  start,
  configs,
  tolerance,
  maxSteps,
  reduced,
}: DescentRunsOptions): DescentRuns {
  // The identity of the whole comparison, as one primitive. A slider that
  // lands back on a value it already had rebuilds nothing.
  const key = `${landscape.a}|${landscape.b}|${start.x}|${start.y}|${tolerance}|${maxSteps}|${JSON.stringify(configs)}`;

  const built = useMemo(
    () => configs.map((config) => build(landscape, start, config, tolerance, maxSteps)),
    // `key` stands in for every input; the members are read inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const total = built.reduce((longest, b) => Math.max(longest, b.run.length - 1), 0);

  const [index, setIndexState] = useState(0);
  const [playing, setPlaying] = useState(false);

  // A new configuration is a new run: rewind, rather than leaving the scrubber
  // pointing at a step that no longer exists.
  useEffect(() => {
    setIndexState(0);
    setPlaying(false);
  }, [key]);

  const indexRef = useRef(0);
  indexRef.current = index;

  const setIndex = useCallback(
    (next: number) => {
      setPlaying(false);
      setIndexState(Math.max(0, Math.min(Math.round(next), total)));
    },
    [total],
  );

  const play = useCallback(() => {
    if (reduced) {
      setPlaying(false);
      setIndexState(total);
      return;
    }
    // Pressing Run at the end replays from the start rather than doing
    // nothing, which is what every visitor expects it to do.
    if (indexRef.current >= total) {
      setIndexState(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  }, [total, reduced]);

  const pause = useCallback(() => setPlaying(false), []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndexState(0);
  }, []);

  const stepOnce = useCallback(() => {
    setPlaying(false);
    setIndexState((i) => Math.min(i + 1, total));
  }, [total]);

  // The only frame loop in the lab, and it exists only while playing. It runs
  // no optimizer arithmetic and allocates nothing; React state changes when
  // the integer step changes, not once per frame.
  useEffect(() => {
    if (!playing || total < 1) return;
    const perSecond = Math.max(
      MIN_STEPS_PER_SECOND,
      Math.min(MAX_STEPS_PER_SECOND, total / TARGET_SECONDS),
    );
    let position = indexRef.current;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      position += dt * perSecond;
      if (position >= total) {
        setIndexState(total);
        setPlaying(false);
        return;
      }
      const whole = Math.floor(position);
      if (whole !== indexRef.current) setIndexState(whole);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, total]);

  const views: RunView[] = built.map(({ run, series }) => {
    const shown = Math.min(index, run.length - 1);
    const position = pathAt(run, shown);
    const g = gradient(landscape, position);
    return {
      run,
      series,
      count: run.length,
      shown,
      finished: index >= run.length - 1,
      // The run's own verdict only applies once its last step is on screen.
      status: index >= run.length - 1 ? run.status : "running",
      position,
      objective: series[shown] ?? 0,
      gradientNorm: Math.hypot(g.x, g.y),
    };
  });

  return {
    views,
    total,
    index,
    playing,
    atEnd: index >= total,
    play,
    pause,
    reset,
    stepOnce,
    setIndex,
  };
}

export interface DescentRun extends DescentRuns {
  /** The single run, for the sections that only show one. */
  view: RunView;
}

/** The single-run case, which is most of the lab. */
export function useDescentRun(
  options: Omit<DescentRunsOptions, "configs"> & { config: OptimizerConfig },
): DescentRun {
  const { config, ...rest } = options;
  const configs = useMemo(() => [config], [config]);
  const runs = useDescentRuns({ ...rest, configs });
  const view = runs.views[0];
  if (!view) throw new Error("useDescentRun: no run was built");
  return { ...runs, view };
}
