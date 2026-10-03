/**
 * Three puzzles, each about one lever, each judged from a real training run.
 *
 * Pure TypeScript. Nothing here decides what the agent does: it trains with
 * the visitor's settings using `learner.ts` — which is `train()` step by step,
 * proven bit-identical — and reads the verdict out of the resulting table and
 * the episodes it actually lived through.
 *
 * ## These three, because these three are what the engine actually does
 *
 * The first two were measured across the whole reward range before they were
 * written down. Below −2.5 the agent detours around the square; between −2.4
 * and 2.7 it crosses it on the way past; at 2.8 and above the square outbids
 * the door and it never finishes. Three wide, stable bands from one number —
 * which is the lab's thesis, set as a task rather than asserted.
 *
 * The third is different on purpose. Sweeping α, γ and ε showed that this room
 * is small enough that almost any setting eventually solves it: the final route
 * barely moves. What the parameters change is *how* the run gets there, and one
 * of them can stop it getting there at all — exploration held high for the
 * whole run leaves the agent still wandering at the end, succeeding in a
 * fifth of its episodes. So the third puzzle is judged on the run rather than
 * on the route, because that is where the effect honestly lives.
 *
 * `challenge.test.ts` re-measures all three. If the engine ever changes, they
 * fail loudly rather than quietly becoming impossible.
 */

import { rolloutGreedy, type Rollout } from "./engine";
import { createLearner, runAll, type EpisodeRecord } from "./learner";
import { behaviourOf, type Behaviour } from "./view";

export type ChallengeId = "cross" | "camp" | "settle";

/** Which control the puzzle hands over. Everything else stays at its start. */
export type Lever = "tileReward" | "epsilon";

export interface Settings {
  readonly tileReward: number;
  readonly alpha: number;
  readonly gamma: number;
  /** Held constant for the whole run — no decay — so the lever means one thing. */
  readonly epsilon: number;
}

/** How a puzzle decides it has been solved. */
export type Goal =
  /** The greedy route must end up doing this. */
  | { readonly kind: "behaviour"; readonly want: Behaviour }
  /** The training run itself must settle: reach the door reliably, briskly. */
  | { readonly kind: "settles"; readonly minSuccess: number; readonly maxMeanSteps: number };

export interface ChallengeSpec {
  readonly id: ChallengeId;
  readonly lever: Lever;
  /** Deliberately not a solution: every puzzle starts wrong. */
  readonly start: Settings;
  readonly episodes: number;
  readonly goal: Goal;
}

/** Episodes at the end of a run that "settles" is measured over. */
export const WINDOW = 50;

export const DEFAULT_EPSILON = 0.1;

export const CHALLENGES: readonly ChallengeSpec[] = [
  {
    // Starts at −3: the detour is cheaper, so it walks around the square.
    id: "cross",
    lever: "tileReward",
    start: { tileReward: -3, alpha: 0.5, gamma: 0.95, epsilon: DEFAULT_EPSILON },
    episodes: 800,
    goal: { kind: "behaviour", want: "passed" },
  },
  {
    // Starts at 0: it crosses the square but has no reason to linger.
    id: "camp",
    lever: "tileReward",
    start: { tileReward: 0, alpha: 0.5, gamma: 0.95, epsilon: DEFAULT_EPSILON },
    episodes: 800,
    goal: { kind: "behaviour", want: "stayed" },
  },
  {
    // Starts exploring nine moves in ten, for the whole run.
    id: "settle",
    lever: "epsilon",
    start: { tileReward: -3, alpha: 0.5, gamma: 0.95, epsilon: 0.9 },
    episodes: 300,
    goal: { kind: "settles", minSuccess: 0.9, maxMeanSteps: 20 },
  },
];

export const challengeById = (id: ChallengeId): ChallengeSpec =>
  CHALLENGES.find((spec) => spec.id === id) ?? CHALLENGES[0]!;

export const LEVER_RANGE: Readonly<Record<Lever, { min: number; max: number; step: number }>> = {
  tileReward: { min: -5, max: 5, step: 0.1 },
  epsilon: { min: 0.01, max: 0.95, step: 0.01 },
};

export interface Attempt {
  readonly settings: Settings;
  /** The table the run finished on, so the map draws this attempt's policy. */
  readonly q: Float64Array;
  readonly rollout: Rollout;
  readonly behaviour: Behaviour;
  /** The last `WINDOW` training episodes — what "settles" is read from. */
  readonly window: readonly EpisodeRecord[];
  readonly successRate: number;
  readonly meanSteps: number;
  readonly meanReward: number;
  readonly solved: boolean;
  /** True before the visitor has moved the lever. */
  readonly untouched: boolean;
}

/**
 * Train with these settings and say what happened.
 *
 * Epsilon is pinned top and bottom, so the one number the visitor sees is the
 * exploration rate for the entire run rather than the start of a decay they
 * cannot see.
 */
export function judge(spec: ChallengeSpec, settings: Settings): Attempt {
  const learner = createLearner({
    tileReward: settings.tileReward,
    alpha: settings.alpha,
    gamma: settings.gamma,
    epsilonStart: settings.epsilon,
    epsilonMin: settings.epsilon,
    episodes: spec.episodes,
  });
  runAll(learner);

  const rollout = rolloutGreedy(learner.q);
  const behaviour = behaviourOf(rollout);
  const window = learner.history.slice(-WINDOW);
  const successRate = window.filter((e) => e.reachedGoal).length / Math.max(1, window.length);
  const meanSteps = window.reduce((s, e) => s + e.steps, 0) / Math.max(1, window.length);
  const meanReward = window.reduce((s, e) => s + e.totalReward, 0) / Math.max(1, window.length);

  const solved =
    spec.goal.kind === "behaviour"
      ? behaviour === spec.goal.want
      : successRate >= spec.goal.minSuccess && meanSteps <= spec.goal.maxMeanSteps;

  return {
    settings,
    q: learner.q,
    rollout,
    behaviour,
    window,
    successRate,
    meanSteps,
    meanReward,
    solved,
    untouched: settings[spec.lever] === spec.start[spec.lever],
  };
}

/** Every lever value that solves a puzzle. Used by the tests, not the UI. */
export function solutions(spec: ChallengeSpec): number[] {
  const { min, max, step } = LEVER_RANGE[spec.lever];
  const found: number[] = [];
  const steps = Math.round((max - min) / step);
  for (let i = 0; i <= steps; i++) {
    const value = Math.round((min + i * step) / step) * step;
    if (judge(spec, { ...spec.start, [spec.lever]: value }).solved) found.push(value);
  }
  return found;
}
