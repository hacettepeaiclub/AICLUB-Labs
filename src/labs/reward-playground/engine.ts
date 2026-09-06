/**
 * Tabular Q-learning, written from scratch.
 *
 * Pure TypeScript — no React, no DOM, no library. The only randomness comes
 * from `lib/random.ts`, seeded, so a run is reproducible to the bit.
 *
 * ## What the lab is trying to show
 *
 *   **The robot optimises what you reward, not what you meant.**
 *
 * That is why the tile's value is the visitor's only lever, and why the
 * learning itself is machinery rather than spectacle. Everything below exists
 * to turn one number into a behaviour honestly.
 *
 * ## Why training runs to completion up front
 *
 * A full 800-episode run costs well under a millisecond, so the visitor never
 * waits and never watches a random walk for five minutes. The learning is not
 * hidden by this: `snapshots` keeps the real Q-table at ~70 checkpoints, so
 * the second section can scrub through the actual history rather than a
 * recording of it. What is on screen at checkpoint *k* is the table the
 * algorithm genuinely held after that many episodes.
 *
 * ## Where the checkpoints are
 *
 * Not evenly spaced, and that is a measured decision. In this world the first
 * cell acquires a positive value around episode 12 and the whole room has one
 * by about episode 40 — so a linear scrubber would bury the entire story in
 * the first five percent of its travel. `checkpointEpisodes` samples densely
 * where something is happening and sparsely where nothing is.
 *
 * ## Note on `!`
 *
 * Indices below are bounded by `CELL_COUNT`, by `ACTION_COUNT`, or by an
 * `Action` whose type is 0..3 — all provably in range. The assertions keep the
 * inner loop free of redundant undefined checks, the same convention
 * `labs/neural-playground/engine.ts` and `labs/pathfinding/engine.ts` use.
 */

import { createRng } from "@/lib/random";
import {
  ACTION_COUNT,
  ACTIONS,
  CELL_COUNT,
  GOAL,
  MAX_EPISODE_STEPS,
  START,
  TILE,
  isTerminal,
  nextState,
  reward,
  type Action,
} from "./world";

// ------------------------------------------------------------- parameters ---

/** Learning rate. High, because the world is deterministic. */
export const ALPHA = 0.5;
/** Discount. Below 1 so that farming forever has a finite, comparable value. */
export const GAMMA = 0.95;
export const EPSILON_START = 1;
export const EPSILON_MIN = 0.05;
/**
 * Measured, not guessed: 400 episodes already reproduce the exact optimal
 * regime for every reward value and seed tried. 800 doubles the margin and
 * still costs under a millisecond.
 */
export const EPISODES = 800;
export const SEED = 12345;

export interface TrainingOptions {
  /** The visitor's lever: what the marked tile pays, every time it is entered. */
  tileReward: number;
  episodes?: number;
  alpha?: number;
  gamma?: number;
  epsilonStart?: number;
  epsilonMin?: number;
  maxSteps?: number;
  seed?: number;
  /** Keep Q-table checkpoints for the episode scrubber. Off by default. */
  snapshots?: boolean;
}

// ------------------------------------------------------------- the Q-table ---

/** `CELL_COUNT × ACTION_COUNT`, row-major: `state * ACTION_COUNT + action`. */
export const createQ = (): Float64Array => new Float64Array(CELL_COUNT * ACTION_COUNT);

export const qAt = (q: ArrayLike<number>, state: number, action: Action): number =>
  q[state * ACTION_COUNT + action]!;

/**
 * The best action in a state.
 *
 * Ties break towards the lowest action index, which matters more than it
 * looks: an untouched table is all zeros, so every state starts out "choosing"
 * the same direction. That is deterministic, and being deterministic is what
 * lets two people compare the same run.
 */
export function greedyAction(q: ArrayLike<number>, state: number): Action {
  let best = -Infinity;
  let chosen: Action = 0;
  for (const action of ACTIONS) {
    const value = q[state * ACTION_COUNT + action]!;
    if (value > best) {
      best = value;
      chosen = action;
    }
  }
  return chosen;
}

/** `max_a Q(state, a)` — the state's value under the current table. */
export function bestValue(q: ArrayLike<number>, state: number): number {
  let best = -Infinity;
  for (const action of ACTIONS) {
    const value = q[state * ACTION_COUNT + action]!;
    if (value > best) best = value;
  }
  return best;
}

/**
 * Pick an action: explore with probability `epsilon`, otherwise take the best
 * one known so far.
 *
 * Consumes one random number to decide, and a second one only when exploring.
 * That call pattern is part of the reproducible run — changing it changes
 * every trajectory that follows.
 */
export function chooseAction(
  q: ArrayLike<number>,
  state: number,
  epsilon: number,
  rng: () => number,
): Action {
  if (rng() < epsilon) {
    // `rng()` is in [0, 1), so this lands in 0..3; the clamp is belt and braces.
    return Math.min(ACTION_COUNT - 1, Math.floor(rng() * ACTION_COUNT)) as Action;
  }
  return greedyAction(q, state);
}

/**
 * One Q-learning update, in place.
 *
 *   Q(s,a) ← Q(s,a) + α · [ r + γ · max_a' Q(s',a') − Q(s,a) ]
 *
 * `terminal` drops the bootstrap term, and it is true only when the goal was
 * actually entered. An episode that merely ran out of steps is *not* terminal:
 * the world did not end, the robot just stopped looking, so the next state's
 * value still counts.
 */
export function qUpdate(
  q: Float64Array,
  state: number,
  action: Action,
  r: number,
  next: number,
  terminal: boolean,
  alpha = ALPHA,
  gamma = GAMMA,
): number {
  const index = state * ACTION_COUNT + action;
  const target = terminal ? r : r + gamma * bestValue(q, next);
  const updated = q[index]! + alpha * (target - q[index]!);
  q[index] = updated;
  return updated;
}

// ------------------------------------------------------------- checkpoints ---

/**
 * Episodes at which the table is kept, densest where the learning happens.
 *
 * Always starts at 1 and always ends at `episodes`, so the scrubber's two ends
 * are the first episode and the final policy.
 */
export function checkpointEpisodes(episodes = EPISODES): number[] {
  const marks: number[] = [];
  const push = (episode: number) => {
    if (episode >= 1 && episode <= episodes && marks[marks.length - 1] !== episode) {
      marks.push(episode);
    }
  };
  for (let e = 1; e <= 20; e++) push(e);
  for (let e = 24; e <= 100; e += 4) push(e);
  for (let e = 110; e <= 200; e += 10) push(e);
  for (let e = 220; e <= 400; e += 20) push(e);
  for (let e = 440; e <= episodes; e += 40) push(e);
  push(episodes);
  return marks;
}

export interface Snapshot {
  readonly episode: number;
  /** The real table after that many episodes, exactly as it stood. */
  readonly q: Float64Array;
}

export interface Training {
  readonly tileReward: number;
  readonly episodes: number;
  readonly q: Float64Array;
  readonly snapshots: readonly Snapshot[];
}

// --------------------------------------------------------------- training ---

/**
 * Run Q-learning to completion and hand back the table.
 *
 * Every episode starts at `START` and either reaches the goal or is cut off at
 * `maxSteps`. Epsilon decays geometrically from `epsilonStart` to
 * `epsilonMin` across the run: almost all exploration at the beginning,
 * almost none at the end.
 */
export function train(options: TrainingOptions): Training {
  const {
    tileReward,
    episodes = EPISODES,
    alpha = ALPHA,
    gamma = GAMMA,
    epsilonStart = EPSILON_START,
    epsilonMin = EPSILON_MIN,
    maxSteps = MAX_EPISODE_STEPS,
    seed = SEED,
    snapshots = false,
  } = options;

  const rng = createRng(seed);
  const q = createQ();
  const marks = snapshots ? new Set(checkpointEpisodes(episodes)) : null;
  const kept: Snapshot[] = [];

  const decay =
    episodes > 1 ? Math.pow(epsilonMin / epsilonStart, 1 / (episodes - 1)) : 1;
  let epsilon = epsilonStart;

  for (let episode = 1; episode <= episodes; episode++) {
    let state = START;
    for (let t = 0; t < maxSteps; t++) {
      const action = chooseAction(q, state, epsilon, rng);
      const next = nextState(state, action);
      const terminal = isTerminal(next);
      qUpdate(q, state, action, reward(state, next, tileReward), next, terminal, alpha, gamma);
      state = next;
      if (terminal) break;
    }
    epsilon = Math.max(epsilonMin, epsilon * decay);
    if (marks?.has(episode)) kept.push({ episode, q: Float64Array.from(q) });
  }

  return { tileReward, episodes, q, snapshots: kept };
}

// ---------------------------------------------------------------- reading ---

/** The greedy action in every free cell. `-1` where the state is terminal. */
export function greedyPolicy(q: ArrayLike<number>): Int8Array {
  const policy = new Int8Array(CELL_COUNT).fill(-1);
  for (let state = 0; state < CELL_COUNT; state++) {
    if (isTerminal(state)) continue;
    policy[state] = greedyAction(q, state);
  }
  return policy;
}

/** `max_a Q(s,a)` per cell — what the value map draws. */
export function valueMap(q: ArrayLike<number>): Float64Array {
  const values = new Float64Array(CELL_COUNT);
  for (let state = 0; state < CELL_COUNT; state++) {
    values[state] = isTerminal(state) ? 0 : bestValue(q, state);
  }
  return values;
}

export interface Rollout {
  /** Cells visited, starting at `START`. */
  readonly path: readonly number[];
  readonly reachedGoal: boolean;
  /** How many times the marked tile was entered. */
  readonly tileVisits: number;
  readonly steps: number;
  /** True when the robot repeated a move it had already made from that cell. */
  readonly looped: boolean;
}

/**
 * Walk the greedy policy from the start with no exploration at all.
 *
 * This is what the room draws, and it is derived from the table every time
 * rather than stored — there is no route anywhere in this lab that was not
 * produced by the numbers the robot actually learned.
 *
 * The walk runs for the full episode budget and stops early only at the goal,
 * because that is exactly what the robot does. A run that has started
 * repeating itself is flagged `looped`, but it is not cut short: the visitor
 * is meant to watch it pace the same two cells until its time runs out, and
 * `tileVisits` should count what actually happened rather than what happened
 * before a cycle was first detectable.
 */
export function rolloutGreedy(q: ArrayLike<number>, maxSteps = MAX_EPISODE_STEPS): Rollout {
  const path: number[] = [START];
  const seen = new Set<number>();
  let state = START;
  let tileVisits = 0;
  let looped = false;

  for (let steps = 1; steps <= maxSteps; steps++) {
    const action = greedyAction(q, state);
    const key = state * ACTION_COUNT + action;
    if (seen.has(key)) looped = true;
    seen.add(key);

    const next = nextState(state, action);
    if (next === TILE && next !== state) tileVisits += 1;
    path.push(next);
    if (next === GOAL) {
      return { path, reachedGoal: true, tileVisits, steps, looped };
    }
    state = next;
  }
  return { path, reachedGoal: false, tileVisits, steps: maxSteps, looped };
}

/** What the robot ended up doing. The three behaviours the lab is built on. */
export type Regime = "avoid" | "ignore" | "farm" | "stuck";

export function regimeOf(rollout: Rollout): Regime {
  if (rollout.reachedGoal) return rollout.tileVisits > 0 ? "ignore" : "avoid";
  return rollout.tileVisits > 0 ? "farm" : "stuck";
}
