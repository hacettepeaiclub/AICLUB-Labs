import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  createLearner,
  runEpisode,
  step,
  type EpisodeRecord,
  type Learner,
  type StepRecord,
} from "./learner";

export interface RunSettings {
  readonly tileReward: number;
  readonly alpha: number;
  readonly gamma: number;
  readonly epsilonStart: number;
  readonly epsilonMin: number;
  readonly episodes: number;
}

/**
 * Episodes the watchable run lasts.
 *
 * Not `engine.EPISODES`. Epsilon decays geometrically from 1 to 0.05 across
 * whatever budget it is given, so the budget decides how long the agent spends
 * mostly exploring — and over 800 episodes it is still taking 21 moves and
 * exploring a third of the time at episode 300, which is not something anybody
 * is going to sit and watch. Measured over this budget instead: no successes at
 * episode 10, a third by 25, almost all by 50, and a settled 13-move route by
 * the end. That is the arc the section is about, and it is real at every point.
 *
 * The batch trainer keeps its own 800-episode default, so nothing the challenge
 * or the tests measure moves.
 */
export const WATCHABLE_EPISODES = 200;

/** Episodes per second while running. */
export const SPEEDS = [1, 5, 25, 150] as const;
export type Speed = (typeof SPEEDS)[number];
export const DEFAULT_SPEED: Speed = 5;

export interface TrainingRun {
  /** The live table, mutated in place by the learner. */
  readonly q: Float64Array;
  /** 1-based, clamped to the budget once the run is over. */
  readonly episode: number;
  readonly episodes: number;
  readonly done: boolean;
  readonly running: boolean;
  /** The most recent action, or null before the first one. */
  readonly last: StepRecord | null;
  readonly history: readonly EpisodeRecord[];
  /** Cells of the episode in progress, starting at the start square. */
  readonly path: readonly number[];
  readonly state: number;
  readonly epsilon: number;
  readonly episodeReward: number;
  readonly speed: Speed;
  setSpeed: (speed: Speed) => void;
  /** One action. Pauses first. */
  stepOnce: () => void;
  /** One whole episode. Pauses first. */
  episodeOnce: () => void;
  toggleRun: () => void;
  reset: () => void;
}

/**
 * One live Q-learning run, shared by every section that watches it.
 *
 * ## Why one run and not three
 *
 * The training section, the policy map and the update readout are three views
 * of one thing, and the lab's claim is that they are causally connected: the
 * arrows move *because* the updates below them happened. Three independent
 * learners would make that a coincidence. So this is called once on the page
 * and the result is passed down.
 *
 * ## What moves, and why it is not an animation
 *
 * The loop advances the real learner on a timer and commits the result. What
 * changes on screen is the agent being somewhere else and the table holding
 * different numbers — there is no tween anywhere, and nothing plays that did
 * not compute. Under reduced motion the loop still trains at the same rate; it
 * commits in larger, less frequent batches, so the picture steps rather than
 * appears to glide.
 *
 * The interval is cleared on pause, on unmount, on a settings change and when
 * the run finishes. There is no standing frame loop.
 */
export function useTrainingRun(settings: RunSettings): TrainingRun {
  const reduced = useReducedMotion() ?? false;
  const [speed, setSpeed] = useState<Speed>(DEFAULT_SPEED);
  const [running, setRunning] = useState(false);
  /** Bumped on every commit: the learner mutates in place, so this is the signal. */
  const [revision, setRevision] = useState(0);

  const { tileReward, alpha, gamma, epsilonStart, epsilonMin, episodes } = settings;

  // A settings change is a different run, not a continuation — and so is a
  // reset. Both build a learner through here, so there is one way to start one.
  const build = useCallback(
    () => createLearner({ tileReward, alpha, gamma, epsilonStart, epsilonMin, episodes }),
    [tileReward, alpha, gamma, epsilonStart, epsilonMin, episodes],
  );

  const [learner, setLearner] = useState<Learner>(build);
  const learnerRef = useRef<Learner>(learner);
  learnerRef.current = learner;

  // Any change to the settings discards the run in progress.
  useEffect(() => {
    setRunning(false);
    setLearner(build());
    setRevision((n) => n + 1);
  }, [build]);

  const commit = useCallback(() => setRevision((n) => n + 1), []);

  const stepOnce = useCallback(() => {
    setRunning(false);
    step(learnerRef.current);
    commit();
  }, [commit]);

  const episodeOnce = useCallback(() => {
    setRunning(false);
    runEpisode(learnerRef.current);
    commit();
  }, [commit]);

  const reset = useCallback(() => {
    setRunning(false);
    setLearner(build());
    setRevision((n) => n + 1);
  }, [build]);

  const toggleRun = useCallback(() => {
    if (learnerRef.current.done) return;
    setRunning((was) => !was);
  }, []);

  // Whole episodes per tick, so the agent is never caught mid-route in a state
  // the policy map cannot account for.
  useEffect(() => {
    if (!running) return;
    const batch = reduced
      ? Math.max(1, Math.round(speed / 2))
      : Math.max(1, Math.round(speed / 10));
    const interval = reduced ? 400 : Math.max(20, (1000 * batch) / speed);

    const id = window.setInterval(() => {
      const current = learnerRef.current;
      for (let i = 0; i < batch && !current.done; i++) runEpisode(current);
      commit();
      if (current.done) setRunning(false);
    }, interval);
    return () => window.clearInterval(id);
  }, [running, speed, reduced, commit]);

  return useMemo(
    () => ({
      q: learner.q,
      episode: Math.min(learner.episode, episodes),
      episodes,
      done: learner.done,
      running,
      last: learner.last,
      history: learner.history,
      path: learner.episodePath,
      state: learner.state,
      epsilon: learner.epsilon,
      episodeReward: learner.episodeReward,
      speed,
      setSpeed,
      stepOnce,
      episodeOnce,
      toggleRun,
      reset,
    }),
    // `revision` is the in-place mutation signal; without it this memo would
    // never see the learner change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [revision, running, speed, learner, episodes, stepOnce, episodeOnce, toggleRun, reset],
  );
}
