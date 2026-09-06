/**
 * How a challenge attempt is judged.
 *
 * Pure logic and no prose: this module returns facts, and the wording lives in
 * the dictionary. It has to stay language-agnostic, and it has to grade an
 * attempt with exactly the arithmetic that proved the challenge solvable in
 * the first place — so it calls `measureRun`, the same function the
 * feasibility gate in `engine.test.ts` calls.
 */

import { measureRun, type Landscape, type OptimizerConfig, type OptimizerKind } from "./engine";
import { CHALLENGES, LANDSCAPES, type ChallengeId, type ChallengeSpec } from "./landscape";

export type { ChallengeId, ChallengeSpec };
export { CHALLENGES };

export const challengeOrder: readonly ChallengeId[] = ["c1", "c2", "c3"];

export type VerdictKind = "solved" | "over-budget" | "diverged" | "idle";

export interface Verdict {
  kind: VerdictKind;
  /** Steps taken to reach the tolerance, or `null` if it never got there. */
  steps: number | null;
  budget: number;
  finalObjective: number;
  tolerance: number;
  optimizer: OptimizerKind;
}

export const IDLE_VERDICT = (spec: ChallengeSpec, optimizer: OptimizerKind): Verdict => ({
  kind: "idle",
  steps: null,
  budget: spec.budget,
  finalObjective: Number.NaN,
  tolerance: spec.tolerance,
  optimizer,
});

/**
 * Room to run past the budget before giving up.
 *
 * An attempt has to be graded as *over budget* rather than merely *unfinished*,
 * and the two are only distinguishable by letting the run continue well past
 * the budget and seeing whether it would ever have arrived.
 */
const headroom = (budget: number): number => Math.max(200, budget * 10);

export function judge(spec: ChallengeSpec, config: OptimizerConfig): Verdict {
  const result = measureRun(spec.landscape, spec.start, config, {
    tolerance: spec.tolerance,
    maxSteps: headroom(spec.budget),
  });

  const base = {
    steps: result.steps,
    budget: spec.budget,
    finalObjective: result.finalObjective,
    tolerance: spec.tolerance,
    optimizer: config.kind,
  };

  if (result.status === "diverged") return { ...base, kind: "diverged" };
  if (result.steps !== null && result.steps <= spec.budget) return { ...base, kind: "solved" };
  return { ...base, kind: "over-budget" };
}

// ---------------------------------------------------------- opening state ---

/**
 * Where each challenge's controls start.
 *
 * These are claims about the first thing a visitor sees — C1 arrives but far
 * too slowly, C2 explodes on the first Run, C3 cannot be won with what is
 * selected — so they live here rather than in the component, and
 * `challenge.test.ts` checks that each one still does what it is for.
 */
export interface ChallengeDefaults {
  /** Position on the landscape-calibrated step-size slider. */
  rateIndex: number;
  betaPercent: number;
  /** Position on Adam's absolute step-size slider, in hundredths. */
  adamIndex: number;
  optimizer: OptimizerKind;
}

export const DEFAULTS: Record<ChallengeId, ChallengeDefaults> = {
  // Converges, but nowhere near inside the budget: the sweet spot is elsewhere.
  c1: { rateIndex: 30, betaPercent: 80, adamIndex: 20, optimizer: "gd" },
  // Starts above the stability limit, so the first Run explodes.
  c2: { rateIndex: 240, betaPercent: 80, adamIndex: 20, optimizer: "gd" },
  // Plain descent cannot win this at any step size, let alone this one.
  c3: { rateIndex: 190, betaPercent: 0, adamIndex: 20, optimizer: "gd" },
};

// ------------------------------------------------------------- C2 transfer ---

/**
 * The second half of challenge C2.
 *
 * Once a step size has been found that works on the steep landscape, the same
 * number is applied to a gentler one. It is the cheapest possible way to show
 * that a step size is neither large nor small in itself — the ceiling belongs
 * to the surface, not to the optimizer — and it is the reason this lab never
 * says "a large learning rate is bad".
 */
export const TRANSFER_LANDSCAPE: Landscape = LANDSCAPES.gentle.landscape;
export const TRANSFER_START = LANDSCAPES.gentle.start;

export interface Transfer {
  /** A step size that diverges on the challenge's landscape... */
  divergentHere: boolean;
  /** ...and what the very same number does on the gentler one. */
  convergesThere: boolean;
  stepsThere: number | null;
}

export function transfer(spec: ChallengeSpec, learningRate: number): Transfer {
  const here = measureRun(
    spec.landscape,
    spec.start,
    { kind: "gd", learningRate },
    { tolerance: spec.tolerance, maxSteps: headroom(spec.budget) },
  );
  const there = measureRun(
    TRANSFER_LANDSCAPE,
    TRANSFER_START,
    { kind: "gd", learningRate },
    { tolerance: spec.tolerance, maxSteps: headroom(spec.budget) },
  );
  return {
    divergentHere: here.status === "diverged",
    convergesThere: there.status === "converged",
    stepsThere: there.steps,
  };
}
