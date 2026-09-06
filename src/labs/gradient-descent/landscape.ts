/**
 * The surfaces the lab descends, and the geometry needed to draw them.
 *
 * Pure data and pure functions. Every preset is a pair of curvatures, and
 * every number the lab quotes about a preset — the largest usable step size,
 * the condition number, the best possible step — is *derived* from that pair
 * by `engine.ts` rather than written down here. There are no measured
 * constants in this file, because a measured constant is a claim that silently
 * stops being true when someone edits a curvature.
 */

import {
  conditionNumber,
  objectiveContractionFactor,
  optimalLearningRate,
  parameterContractionFactor,
  stabilityLimit,
  type Landscape,
  type Point,
} from "./engine";

// ------------------------------------------------------------ level sets ---

/**
 * The level set f(x, y) = c is an **exact ellipse** centred on the minimum,
 * with semi-axes √(2c/a) and √(2c/b).
 *
 * This is why the lab needs no marching squares, no per-pixel sampling and no
 * contour library: a single `ctx.ellipse` call draws a mathematically exact
 * contour at any zoom. `level` must be positive; the level set at 0 is the
 * single point at the origin.
 */
export function contourSemiAxes(l: Landscape, level: number): { rx: number; ry: number } {
  return { rx: Math.sqrt((2 * level) / l.a), ry: Math.sqrt((2 * level) / l.b) };
}

/**
 * How elongated those ellipses are: the ratio of the long semi-axis to the
 * short one, which is √κ — *not* κ.
 *
 * Worth keeping separate and named, because it is the difference between what
 * the visitor sees and what the mathematics is about. A landscape with κ = 60
 * does not look sixty times longer than it is wide; it looks about 7.75 times
 * longer. The copy must never quote one as the other.
 */
export const aspectRatio = (l: Landscape): number => Math.sqrt(conditionNumber(l));

// --------------------------------------------------------------- presets ---

export type LandscapeId = "bowl" | "gentle" | "steep" | "ravine" | "valley" | "scaleGap";

export interface LandscapePreset {
  readonly id: LandscapeId;
  readonly landscape: Landscape;
  /**
   * Where a run begins.
   *
   * Deliberately off the diagonal and off both axes. On the diagonal of a
   * symmetric landscape the gradient already points at the minimum and every
   * optimizer looks identical; on an axis one coordinate is already solved.
   * Both would make the lab's central claim invisible by accident.
   */
  readonly start: Point;
}

const DEFAULT_START: Point = { x: 1, y: -0.55 };

export const LANDSCAPES: Record<LandscapeId, LandscapePreset> = {
  /** κ = 1. The only landscape where −∇f points exactly at the minimum. */
  bowl: { id: "bowl", landscape: { a: 1, b: 1 }, start: DEFAULT_START },
  /** κ = 6. Mildly anisotropic — the opening frame. The path visibly bends. */
  gentle: { id: "gentle", landscape: { a: 6, b: 1 }, start: DEFAULT_START },
  /** κ = 20. Small stability limit; a step size that is fine on `gentle` blows up here. */
  steep: { id: "steep", landscape: { a: 20, b: 1 }, start: DEFAULT_START },
  /** κ = 25, steep axis on **y** — so nobody learns "steep means horizontal". */
  ravine: { id: "ravine", landscape: { a: 1, b: 25 }, start: { x: -0.55, y: 1 } },
  /** κ = 60. The narrow valley that plain descent cannot cross in time. */
  valley: { id: "valley", landscape: { a: 60, b: 1 }, start: DEFAULT_START },
  /** κ = 10⁶. Only used to show Adam's first step ignoring gradient magnitude. */
  scaleGap: { id: "scaleGap", landscape: { a: 1000, b: 0.001 }, start: DEFAULT_START },
};

export const landscapeIds = Object.keys(LANDSCAPES) as LandscapeId[];

// --------------------------------------------------------------- derived ---

/** Everything the lab can say about a landscape without running anything. */
export interface LandscapeFacts {
  readonly conditionNumber: number;
  readonly aspectRatio: number;
  /** Largest step size for which plain descent contracts: 2/max(a, b). */
  readonly stabilityLimit: number;
  /** Largest step size for which *neither* coordinate overshoots: 1/max(a, b). */
  readonly monotoneLimit: number;
  /** The best step size for plain descent: 2/(a + b). */
  readonly optimalLearningRate: number;
  /** Per-step shrink of ‖θ‖ at the optimal step size. */
  readonly parameterContraction: number;
  /** Per-step shrink of f(θ) at the optimal step size — the square of the above. */
  readonly objectiveContraction: number;
}

export function landscapeFacts(l: Landscape): LandscapeFacts {
  return {
    conditionNumber: conditionNumber(l),
    aspectRatio: aspectRatio(l),
    stabilityLimit: stabilityLimit(l),
    monotoneLimit: 1 / Math.max(l.a, l.b),
    optimalLearningRate: optimalLearningRate(l),
    parameterContraction: parameterContractionFactor(l),
    objectiveContraction: objectiveContractionFactor(l),
  };
}

// ---------------------------------------------------------- control scale ---

/**
 * The step-size slider is indexed, not continuous, and the index is calibrated
 * against the landscape rather than against a fixed range of numbers.
 *
 * At index `LR_LIMIT_INDEX` the step size is *exactly* the stability limit, so
 * the visitor can land on the boundary rather than stepping over it; at half
 * that index it is exactly the monotone limit. Both thresholds therefore fall
 * on whole positions on every landscape, and the three regimes are separated
 * by integer comparisons instead of floating-point ones.
 */
export const LR_LIMIT_INDEX = 200;

export const learningRateAt = (l: Landscape, index: number): number =>
  (index / LR_LIMIT_INDEX) * stabilityLimit(l);

export const learningRateIndexOf = (l: Landscape, learningRate: number): number =>
  Math.round((learningRate / stabilityLimit(l)) * LR_LIMIT_INDEX);

/**
 * The four things a step size can do to a quadratic, as named by section 3.
 *
 * `boundary` is the exact case η = 2/c, where the steep coordinate is
 * multiplied by −1 every step and so neither shrinks nor grows.
 */
export type Regime = "monotone" | "oscillating" | "boundary" | "divergent";

export const regimeAt = (index: number): Regime => {
  if (index <= LR_LIMIT_INDEX / 2) return "monotone";
  if (index < LR_LIMIT_INDEX) return "oscillating";
  if (index === LR_LIMIT_INDEX) return "boundary";
  return "divergent";
};

/**
 * Where momentum's stability boundary sits on that same index scale.
 *
 * The implemented convention gives η·max(a,b) < 2(1 + β), so the boundary is
 * simply the plain-descent one stretched by (1 + β). Measured in Phase 1 and
 * pinned by `engine.test.ts`.
 */
export const momentumLimitIndex = (beta: number): number => LR_LIMIT_INDEX * (1 + beta);

// ------------------------------------------------------------ challenges ---

export type ChallengeId = "c1" | "c2" | "c3";

export interface ChallengeSpec {
  readonly id: ChallengeId;
  readonly landscape: Landscape;
  readonly start: Point;
  /** Solved when f(θ) ≤ this. */
  readonly tolerance: number;
  /** Steps allowed. Exceeding it is a failure, not a slower success. */
  readonly budget: number;
  /** Optimizers the visitor may use. `c1` and `c2` are plain descent only. */
  readonly allowed: readonly ("gd" | "momentum" | "adam")[];
}

/**
 * The three challenges.
 *
 * Every budget here is a claim about what is and is not solvable, so all three
 * are re-measured against the real engine by the feasibility gate in
 * `engine.test.ts`. Editing a curvature or a budget without re-running that
 * gate will fail the suite rather than quietly break a puzzle.
 */
export const CHALLENGES: Record<ChallengeId, ChallengeSpec> = {
  /**
   * C1 — Sweet spot. One landscape, plain descent, find the step size that
   * gets there fastest. Tests only that step size and speed are related.
   */
  c1: {
    id: "c1",
    landscape: LANDSCAPES.gentle.landscape,
    start: LANDSCAPES.gentle.start,
    tolerance: 1e-3,
    budget: 12,
    allowed: ["gd"],
  },
  /**
   * C2 — Too big. The same step size that diverges here converges on the
   * gentler landscape, which is how the lab refuses "a large learning rate is
   * always bad". The lesson is that the ceiling belongs to the surface.
   */
  c2: {
    id: "c2",
    landscape: LANDSCAPES.steep.landscape,
    start: LANDSCAPES.steep.start,
    tolerance: 1e-3,
    budget: 40,
    allowed: ["gd"],
  },
  /**
   * C3 — Narrow valley. Plain descent cannot finish inside the budget at any
   * step size; momentum can, over a wide enough region of (η, β) to be found
   * by exploring rather than guessed.
   */
  c3: {
    id: "c3",
    landscape: LANDSCAPES.valley.landscape,
    start: LANDSCAPES.valley.start,
    tolerance: 1e-3,
    budget: 39,
    allowed: ["gd", "momentum", "adam"],
  },
};

export const challengeIds = Object.keys(CHALLENGES) as ChallengeId[];
