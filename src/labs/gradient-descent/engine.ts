/**
 * Gradient descent on a two-dimensional convex quadratic.
 *
 * Pure TypeScript — no React, no DOM, and no randomness anywhere. The lab
 * drives this engine by calling `step()` repeatedly; nothing is precomputed
 * and replayed, and no trajectory is ever faked or eased.
 *
 * ## What the lab is trying to show
 *
 * The neural-playground already answers "what is one gradient step?" on a 1D
 * curve. This engine exists to answer the question a 1D curve structurally
 * cannot:
 *
 *   **The curvature of the landscape — not the algorithm — decides what step
 *   size you are allowed to take. When curvature differs by direction, one
 *   step size cannot serve every direction at once.**
 *
 * In one dimension a gradient is only a sign, so it always points at the
 * minimum, and there is only one curvature, so "badly conditioned" has no
 * meaning. Both of those appear the moment there are two axes.
 *
 * ## The objective
 *
 *   f(x, y) = ½(a·x² + b·y²),   a > 0, b > 0
 *   ∇f(x, y) = (a·x, b·y)
 *   minimum at the origin, f* = 0
 *
 * This is deliberately the simplest landscape on which the lesson is true, and
 * it is chosen because *every* claim the lab makes about it can be checked in
 * closed form rather than asserted from a golden number. Plain gradient
 * descent decouples exactly:
 *
 *   x_t = (1 − η·a)^t · x₀       y_t = (1 − η·b)^t · y₀
 *
 * so the tests compare the engine against that identity, not against numbers I
 * once observed. See `engine.test.ts`.
 *
 * ## Honesty about scope
 *
 * Nothing here is a model and nothing here is trained. There is no data, no
 * loss over examples, no stochasticity. This is optimisation in isolation: a
 * fixed, known, convex surface being descended. Real training differs in ways
 * this lab does not simulate — the objective is non-convex, the gradient is a
 * noisy estimate from a mini-batch, and the curvature changes as you move. The
 * relationship between curvature and admissible step size, which is what this
 * engine demonstrates, survives all three of those; the exact numbers do not.
 *
 * ## Note on `!`
 *
 * Trajectory indices below are bounded by `run.length`, which `step()` keeps
 * inside the allocated capacity, so they are provably in range. The assertions
 * keep the hot loop free of redundant undefined checks — the same convention
 * `labs/sorting-race/engine.ts` and `labs/pathfinding/engine.ts` use.
 */

// -------------------------------------------------------------- geometry ---

export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * A landscape is two curvatures. `a` is the curvature along x, `b` along y.
 *
 * Nothing in this file assumes `a >= b`. The steep axis may be either one, and
 * several of the lab's presets deliberately put it on y so that the visitor
 * cannot learn "the steep direction is always horizontal".
 */
export interface Landscape {
  readonly a: number;
  readonly b: number;
}

/** f(x, y) = ½(a·x² + b·y²). Zero at the minimum, positive everywhere else. */
export const objective = (l: Landscape, p: Point): number =>
  0.5 * (l.a * p.x * p.x + l.b * p.y * p.y);

/** ∇f(x, y) = (a·x, b·y). */
export const gradient = (l: Landscape, p: Point): Point => ({ x: l.a * p.x, y: l.b * p.y });

/**
 * The exact stability boundary for plain gradient descent.
 *
 * Each coordinate evolves independently by the factor (1 − η·c) for its own
 * curvature c, so the whole run converges iff |1 − η·c| < 1 for both, i.e.
 * iff 0 < η < 2/max(a, b). At exactly 2/c that coordinate orbits forever
 * without shrinking; above it, it grows without bound.
 *
 * This is the single most important number in the lab, and it is a property of
 * the *landscape*, not of the optimizer: change the surface and the largest
 * usable step size changes with it.
 */
export const stabilityLimit = (l: Landscape): number => 2 / Math.max(l.a, l.b);

/**
 * κ = max(a, b) / min(a, b) — the condition number, always ≥ 1.
 *
 * Written with max/min rather than a/b on purpose: the steep axis is not
 * always the first one, and a κ that came out below 1 would silently invert
 * every claim built on it.
 */
export const conditionNumber = (l: Landscape): number => Math.max(l.a, l.b) / Math.min(l.a, l.b);

/**
 * The step size that minimises the worst-case contraction, η* = 2/(a + b).
 *
 * It balances the two coordinates: at η* the fast axis overshoots by exactly
 * as much as the slow axis undershoots, so |1 − η*a| = |1 − η*b|.
 */
export const optimalLearningRate = (l: Landscape): number => 2 / (l.a + l.b);

/**
 * The **parameter-space** contraction factor at η*: (κ − 1)/(κ + 1).
 *
 * This is how fast the *distance to the minimum* shrinks per step — the factor
 * that multiplies ‖θ‖, not f(θ). It is not the rate at which the objective
 * falls, and confusing the two is off by a full power: see
 * `objectiveContractionFactor`.
 */
export function parameterContractionFactor(l: Landscape): number {
  const k = conditionNumber(l);
  return (k - 1) / (k + 1);
}

/**
 * The **objective** contraction factor at η*: ((κ − 1)/(κ + 1))².
 *
 * f is quadratic in the coordinates, so when the parameters contract by ρ the
 * objective contracts by ρ². A lab that plots loss and quotes (κ−1)/(κ+1) as
 * "the convergence rate" is quoting the wrong curve; both are exported here so
 * neither the copy nor the tests have to guess which one is meant.
 */
export function objectiveContractionFactor(l: Landscape): number {
  const rho = parameterContractionFactor(l);
  return rho * rho;
}

/**
 * Whether plain gradient descent at this step size provably fails to contract
 * on this landscape. Exact, analytic, and independent of where the run starts
 * — except at the origin, which is already the answer.
 */
export const divergesAnalytically = (l: Landscape, learningRate: number): boolean =>
  learningRate >= stabilityLimit(l);

// ------------------------------------------------------------- optimizers ---

export type OptimizerKind = "gd" | "momentum" | "adam";

/**
 * How a step is computed.
 *
 * A discriminated union rather than a bag of optional fields: a momentum run
 * cannot be constructed without a β, and a `beta` cannot be silently ignored
 * by a plain-descent run.
 */
export type OptimizerConfig =
  | { readonly kind: "gd"; readonly learningRate: number }
  | { readonly kind: "momentum"; readonly learningRate: number; readonly beta: number }
  | {
      readonly kind: "adam";
      readonly learningRate: number;
      readonly beta1?: number;
      readonly beta2?: number;
      readonly epsilon?: number;
    };

export const ADAM_BETA1 = 0.9;
export const ADAM_BETA2 = 0.999;
export const ADAM_EPSILON = 1e-8;

// ------------------------------------------------------------------- run ---

export type RunStatus = "running" | "converged" | "diverged" | "exhausted";

export interface RunOptions {
  /** Converged when f(θ) ≤ this. */
  readonly tolerance?: number;
  /** Steps the trajectory buffer can hold; the run reports `exhausted` after. */
  readonly maxSteps?: number;
  /** ‖θ‖ beyond which the run is called diverged. */
  readonly escapeRadius?: number;
}

export const DEFAULT_TOLERANCE = 1e-3;
export const DEFAULT_MAX_STEPS = 400;
export const DEFAULT_ESCAPE_RADIUS = 1e3;

export interface Run {
  readonly landscape: Landscape;
  readonly start: Point;
  readonly config: OptimizerConfig;
  readonly tolerance: number;
  readonly maxSteps: number;
  readonly escapeRadius: number;

  /** Current position. */
  x: number;
  y: number;
  /** Momentum velocity; unused by the other two optimizers. */
  vx: number;
  vy: number;
  /** Adam's first moment (mean of g) and second moment (mean of g²). */
  mx: number;
  my: number;
  sx: number;
  sy: number;

  /** Steps taken so far. */
  t: number;
  status: RunStatus;

  /** Flattened x,y pairs, `start` first. `length` points are valid. */
  readonly path: Float64Array;
  length: number;
}

/** One observable optimisation step. Exactly one is produced per `step()`. */
export interface StepEvent {
  /** 1-based index of this step. */
  readonly index: number;
  readonly from: Point;
  readonly to: Point;
  /** ∇f at `from` — the only information the step actually had. */
  readonly gradient: Point;
  /** `to − from`. What the optimizer did with that information. */
  readonly update: Point;
  /** f at `to`. */
  readonly objective: number;
  readonly status: RunStatus;
}

/**
 * Begin a run. Nothing is computed here beyond the starting objective — the
 * trajectory exists only as far as `step()` has taken it.
 */
export function createRun(
  landscape: Landscape,
  start: Point,
  config: OptimizerConfig,
  options: RunOptions = {},
): Run {
  const maxSteps = options.maxSteps ?? DEFAULT_MAX_STEPS;
  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
  const path = new Float64Array(2 * (maxSteps + 1));
  path[0] = start.x;
  path[1] = start.y;

  return {
    landscape,
    start,
    config,
    tolerance,
    maxSteps,
    escapeRadius: options.escapeRadius ?? DEFAULT_ESCAPE_RADIUS,
    x: start.x,
    y: start.y,
    vx: 0,
    vy: 0,
    mx: 0,
    my: 0,
    sx: 0,
    sy: 0,
    t: 0,
    // A run that starts inside the tolerance is already finished; saying
    // "running" would make the first `step()` a step the visitor never needed.
    status: objective(landscape, start) <= tolerance ? "converged" : "running",
    path,
    length: 1,
  };
}

/** The position after `i` steps. `i` must be in `[0, run.length)`. */
export const pathAt = (run: Run, i: number): Point => ({
  x: run.path[2 * i]!,
  y: run.path[2 * i + 1]!,
});

/** f at the current position. */
export const currentObjective = (run: Run): number =>
  objective(run.landscape, { x: run.x, y: run.y });

export const hasConverged = (run: Run, tolerance = run.tolerance): boolean =>
  currentObjective(run) <= tolerance;

export const isDiverging = (run: Run): boolean => {
  if (!Number.isFinite(run.x) || !Number.isFinite(run.y)) return true;
  return Math.hypot(run.x, run.y) > run.escapeRadius;
};

/**
 * Advance the run by exactly one optimisation step and describe it.
 *
 * Calling `step()` on a finished run is not an error: it returns a zero-length
 * event describing where the run stopped, so a scrubber that runs off the end
 * does not have to special-case it.
 */
export function step(run: Run): StepEvent {
  const from: Point = { x: run.x, y: run.y };
  const g = gradient(run.landscape, from);

  if (run.status !== "running") {
    return {
      index: run.t,
      from,
      to: from,
      gradient: g,
      update: { x: 0, y: 0 },
      objective: objective(run.landscape, from),
      status: run.status,
    };
  }

  let dx: number;
  let dy: number;

  switch (run.config.kind) {
    case "gd": {
      dx = -run.config.learningRate * g.x;
      dy = -run.config.learningRate * g.y;
      break;
    }
    case "momentum": {
      // The PyTorch convention, used verbatim throughout the lab:
      //   v ← β·v + ∇f       θ ← θ − η·v
      // The gradient is *not* scaled by (1 − β) here, so at a constant
      // gradient the velocity settles at g/(1 − β) and the effective step is
      // η/(1 − β). That is why raising β at a fixed η can destabilise a run
      // that was converging — the lab shows this rather than hiding it.
      const beta = run.config.beta;
      run.vx = beta * run.vx + g.x;
      run.vy = beta * run.vy + g.y;
      dx = -run.config.learningRate * run.vx;
      dy = -run.config.learningRate * run.vy;
      break;
    }
    case "adam": {
      const b1 = run.config.beta1 ?? ADAM_BETA1;
      const b2 = run.config.beta2 ?? ADAM_BETA2;
      const eps = run.config.epsilon ?? ADAM_EPSILON;

      run.mx = b1 * run.mx + (1 - b1) * g.x;
      run.my = b1 * run.my + (1 - b1) * g.y;
      // Second moment is the running mean of the *squared* gradient. Without
      // the square this is not a magnitude estimate and the update below is
      // not scale-invariant, which is the entire point of the section.
      run.sx = b2 * run.sx + (1 - b2) * g.x * g.x;
      run.sy = b2 * run.sy + (1 - b2) * g.y * g.y;

      // Bias correction. Both moments start at zero, so before it the first
      // steps are pulled toward the origin by exactly (1 − β^t).
      const t = run.t + 1;
      const c1 = 1 - Math.pow(b1, t);
      const c2 = 1 - Math.pow(b2, t);
      const mhx = run.mx / c1;
      const mhy = run.my / c1;
      const shx = run.sx / c2;
      const shy = run.sy / c2;

      dx = (-run.config.learningRate * mhx) / (Math.sqrt(shx) + eps);
      dy = (-run.config.learningRate * mhy) / (Math.sqrt(shy) + eps);
      break;
    }
  }

  run.x = from.x + dx;
  run.y = from.y + dy;
  run.t += 1;

  const i = run.length;
  if (i <= run.maxSteps) {
    run.path[2 * i] = run.x;
    run.path[2 * i + 1] = run.y;
    run.length = i + 1;
  }

  // Divergence is checked before convergence: a run that has already escaped
  // cannot re-enter the tolerance, and a NaN compares false against it.
  if (isDiverging(run)) run.status = "diverged";
  else if (hasConverged(run)) run.status = "converged";
  else if (run.t >= run.maxSteps) run.status = "exhausted";

  return {
    index: run.t,
    from,
    to: { x: run.x, y: run.y },
    gradient: g,
    update: { x: dx, y: dy },
    objective: currentObjective(run),
    status: run.status,
  };
}

/** Step until the run stops running. Returns the same object, mutated. */
export function runToEnd(run: Run): Run {
  while (run.status === "running") step(run);
  return run;
}

export interface RunResult {
  /** Steps taken to reach the tolerance, or `null` if it never did. */
  readonly steps: number | null;
  readonly status: RunStatus;
  readonly finalObjective: number;
  readonly run: Run;
}

/**
 * Run a configuration to completion and report whether it solved the problem.
 *
 * This is what challenge judging and the feasibility gate both call, so a
 * challenge can never be graded by different arithmetic than the one that
 * proved it solvable.
 */
export function measureRun(
  landscape: Landscape,
  start: Point,
  config: OptimizerConfig,
  options: RunOptions = {},
): RunResult {
  const run = runToEnd(createRun(landscape, start, config, options));
  return {
    steps: run.status === "converged" ? run.t : null,
    status: run.status,
    finalObjective: currentObjective(run),
    run,
  };
}
