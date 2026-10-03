/**
 * The same Q-learning run as `engine.train()`, one action at a time.
 *
 * Pure TypeScript — no React, no DOM. This file adds **no mathematics**. It
 * composes the primitives `engine.ts` already exports (`createQ`,
 * `chooseAction`, `qUpdate`) with the world's own `nextState`, `reward` and
 * `isTerminal`, in exactly the order and with exactly the random-number call
 * pattern that `train()` uses. `learner.test.ts` proves the equivalence the
 * only way worth trusting: it runs both to completion and compares the two
 * Q-tables bit for bit, for a spread of rewards, parameters and seeds.
 *
 * ## Why this exists at all
 *
 * `train()` returns a finished table. That is the right shape for a scrubber
 * over checkpoints, and it is the wrong shape for watching. A visitor who is
 * told "the agent learns by trying things" and is then handed a completed
 * result has been told about trial and error rather than shown it. To show it,
 * something has to be able to stop between two actions and be asked what just
 * happened — which is what this is.
 *
 * ## Why it is not in a component
 *
 * Because it is reinforcement learning, and reinforcement learning belongs in
 * the engine layer. A component may read a `StepRecord`; it may not decide
 * what one contains.
 *
 * ## Exploration, observed rather than re-derived
 *
 * Whether an action was exploratory is the single most useful thing to be able
 * to say about it, and `chooseAction` does not report it. Re-implementing the
 * epsilon test here to find out would be exactly the duplication this file
 * exists to avoid — and it would consume a random number that `train()` does
 * not, which would silently fork every trajectory that followed.
 *
 * So the random source is wrapped in a counter instead. `chooseAction` draws
 * once to decide and a second time only when it explores, so the number of
 * draws *is* the answer. The engine is called unmodified, the stream stays in
 * step, and the flag is a measurement rather than a guess.
 */

import { createRng } from "@/lib/random";
import {
  ALPHA,
  EPISODES,
  EPSILON_MIN,
  EPSILON_START,
  GAMMA,
  SEED,
  bestValue,
  chooseAction,
  createQ,
  qAt,
  qUpdate,
} from "./engine";
import {
  MAX_EPISODE_STEPS,
  START,
  TILE,
  isTerminal,
  nextState,
  reward,
  type Action,
} from "./world";

export interface LearnerOptions {
  /** What the marked square pays, every time it is entered. */
  readonly tileReward: number;
  readonly episodes?: number;
  readonly alpha?: number;
  readonly gamma?: number;
  readonly epsilonStart?: number;
  readonly epsilonMin?: number;
  readonly maxSteps?: number;
  readonly seed?: number;
}

/** Everything one action did, kept so the update can be shown term by term. */
export interface StepRecord {
  readonly episode: number;
  /** Index of this action within its episode, from 0. */
  readonly t: number;
  readonly state: number;
  readonly action: Action;
  readonly next: number;
  readonly reward: number;
  /** True only when the door was entered. A cut-off episode is not terminal. */
  readonly terminal: boolean;
  /** The epsilon in force when the action was chosen. */
  readonly epsilon: number;
  /** Measured from the random-draw count, not recomputed. */
  readonly exploring: boolean;
  /** Whether the move actually changed cell, or was refused by a wall. */
  readonly blocked: boolean;
  readonly qBefore: number;
  readonly qAfter: number;
  /** `γ · max_a' Q(s',a')`, or 0 at a terminal transition. */
  readonly bootstrap: number;
  /** `r + γ · max_a' Q(s',a')` — what the update moved towards. */
  readonly target: number;
  /** `target − Q(s,a)`, the surprise. */
  readonly tdError: number;
}

export interface EpisodeRecord {
  readonly episode: number;
  readonly steps: number;
  /** Undiscounted sum of the rewards actually collected. */
  readonly totalReward: number;
  readonly reachedGoal: boolean;
  readonly tileVisits: number;
  /** Epsilon at the start of the episode. */
  readonly epsilon: number;
}

export interface Learner {
  readonly options: Required<LearnerOptions>;
  /** The live table. Mutated in place by `step`, exactly as `train()` does. */
  readonly q: Float64Array;
  /** 1-based. Equals `episodes + 1` once the run is over. */
  episode: number;
  /** Action index within the current episode. */
  t: number;
  state: number;
  epsilon: number;
  /** True once every episode has been run. */
  done: boolean;
  /** The most recent action, or null before the first one. */
  last: StepRecord | null;
  /** One entry per finished episode, in order. */
  readonly history: EpisodeRecord[];
  /** Rewards collected so far in the episode in progress. */
  episodeReward: number;
  episodeTileVisits: number;
  /** Cells visited in the episode in progress, starting at `START`. */
  readonly episodePath: number[];
}

const resolve = (options: LearnerOptions): Required<LearnerOptions> => ({
  tileReward: options.tileReward,
  episodes: options.episodes ?? EPISODES,
  alpha: options.alpha ?? ALPHA,
  gamma: options.gamma ?? GAMMA,
  epsilonStart: options.epsilonStart ?? EPSILON_START,
  epsilonMin: options.epsilonMin ?? EPSILON_MIN,
  maxSteps: options.maxSteps ?? MAX_EPISODE_STEPS,
  seed: options.seed ?? SEED,
});

/**
 * The geometric decay `train()` uses: epsilonStart on episode 1, epsilonMin on
 * the last one. Extracted so both paths cannot drift apart.
 */
export const decayFactor = (epsilonStart: number, epsilonMin: number, episodes: number): number =>
  episodes > 1 ? Math.pow(epsilonMin / epsilonStart, 1 / (episodes - 1)) : 1;

interface Internal extends Learner {
  /** The counting wrapper. Kept off the public type — nothing should call it. */
  draw: () => number;
  draws: number;
  decay: number;
}

export function createLearner(options: LearnerOptions): Learner {
  const resolved = resolve(options);
  const rng = createRng(resolved.seed);

  const learner: Internal = {
    options: resolved,
    q: createQ(),
    episode: 1,
    t: 0,
    state: START,
    epsilon: resolved.epsilonStart,
    done: resolved.episodes < 1,
    last: null,
    history: [],
    episodeReward: 0,
    episodeTileVisits: 0,
    episodePath: [START],
    draws: 0,
    decay: decayFactor(resolved.epsilonStart, resolved.epsilonMin, resolved.episodes),
    draw: () => 0,
  };
  learner.draw = () => {
    learner.draws += 1;
    return rng();
  };
  return learner;
}

/**
 * Advance by exactly one action, and return what it did.
 *
 * Returns `null` once the run is finished. The episode bookkeeping happens
 * here too: an episode ends either at the door or when the step budget runs
 * out, and only the first of those decays epsilon early — because in `train()`
 * the decay happens once per episode either way, which is what the loop below
 * reproduces.
 */
export function step(learner: Learner): StepRecord | null {
  const self = learner as Internal;
  if (self.done) return null;

  const { alpha, gamma, tileReward, maxSteps, episodes } = self.options;
  const state = self.state;
  const epsilon = self.epsilon;

  // One draw to decide, a second only if it explores. The difference is the
  // exploration flag, measured rather than recomputed.
  const before = self.draws;
  const action = chooseAction(self.q, state, epsilon, self.draw);
  const exploring = self.draws - before > 1;

  const next = nextState(state, action);
  const terminal = isTerminal(next);
  const r = reward(state, next, tileReward);

  const qBefore = qAt(self.q, state, action);
  // Read before the write: `qUpdate` uses this same quantity internally, and
  // when a wall sends the agent back to where it started the write would
  // otherwise change what we reported.
  const bootstrap = terminal ? 0 : gamma * bestValue(self.q, next);
  const qAfter = qUpdate(self.q, state, action, r, next, terminal, alpha, gamma);

  const record: StepRecord = {
    episode: self.episode,
    t: self.t,
    state,
    action,
    next,
    reward: r,
    terminal,
    epsilon,
    exploring,
    blocked: next === state,
    qBefore,
    qAfter,
    bootstrap,
    target: r + bootstrap,
    tdError: r + bootstrap - qBefore,
  };

  self.last = record;
  self.state = next;
  self.t += 1;
  self.episodeReward += r;
  if (next === TILE && next !== state) self.episodeTileVisits += 1;
  self.episodePath.push(next);

  if (terminal || self.t >= maxSteps) {
    self.history.push({
      episode: self.episode,
      steps: self.t,
      totalReward: self.episodeReward,
      reachedGoal: terminal,
      tileVisits: self.episodeTileVisits,
      epsilon,
    });
    self.epsilon = Math.max(self.options.epsilonMin, self.epsilon * self.decay);
    self.episode += 1;
    self.t = 0;
    self.state = START;
    self.episodeReward = 0;
    self.episodeTileVisits = 0;
    self.episodePath.length = 0;
    self.episodePath.push(START);
    if (self.episode > episodes) self.done = true;
  }

  return record;
}

/** Run to the end of the episode in progress. Returns the actions it took. */
export function runEpisode(learner: Learner): StepRecord[] {
  const taken: StepRecord[] = [];
  const startedAt = learner.episode;
  while (!learner.done && learner.episode === startedAt) {
    const record = step(learner);
    if (!record) break;
    taken.push(record);
  }
  return taken;
}

/** Run `count` whole episodes, or until the run is finished. */
export function runEpisodes(learner: Learner, count: number): void {
  for (let i = 0; i < count && !learner.done; i++) runEpisode(learner);
}

/** Run the whole thing. Used by the equivalence test and by the challenge. */
export function runAll(learner: Learner): void {
  while (!learner.done) runEpisode(learner);
}
