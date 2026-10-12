/**
 * Turning a `Result` into something drawable. Pure, and deliberately outside
 * the components.
 *
 * No component computes a curve, a shaded region or a coordinate: they are all
 * built here from the engine's own numbers, and `lab.test.ts` reads the
 * component sources and fails if a coordinate literal ever appears in one.
 * That is the structural guard against the failure this lab is most exposed
 * to — a developer drawing the picture they expected instead of the one the
 * equations produce.
 */

import { normalPdf, type Criticals, type Result, type TestType } from "./engine";

/** The drawing box. Coordinates are in these units and scale with the SVG. */
export const PLOT = { width: 100, height: 46, padTop: 3, padBottom: 7 } as const;

/**
 * Points per curve.
 *
 * The reference implementation samples 2000 across the same domain, which is a
 * Plotly-era number: it is drawing to a canvas that can use them. An SVG path
 * with 2000 nodes per curve, four curves and two shaded regions is 12,000 DOM
 * coordinates re-emitted on every slider tick. At 241 the curves are visually
 * identical at any size this lab renders — the domain, which is what decides
 * the shape, is unchanged.
 */
export const SAMPLES = 241;

export interface Domain {
  readonly lo: number;
  readonly hi: number;
}

/**
 * The x range, exactly as the reference implementation frames it:
 *
 *     linspace(min(mu0, mu1) - 4.5 * se, max(mu0, mu1) + 4.5 * se)
 *
 * Both curves therefore always fit, and the window widens with SE — so the
 * picture of "more data" is two curves getting narrower inside a window that
 * is itself closing in, which is the honest version of that animation.
 */
export function domainOf(result: Result): Domain {
  const { mu0, mu1 } = result.params;
  return {
    lo: Math.min(mu0, mu1) - 4.5 * result.se,
    hi: Math.max(mu0, mu1) + 4.5 * result.se,
  };
}

export interface Scale {
  /** Data x to plot x. */
  readonly x: (value: number) => number;
  /** Density to plot y, with 0 at the baseline. */
  readonly y: (density: number) => number;
  readonly baseline: number;
  readonly domain: Domain;
  /** The tallest density in view, which is what y is normalised against. */
  readonly peak: number;
}

/**
 * The mapping from the model to the box.
 *
 * Both curves share one vertical scale, normalised to the taller of the two
 * peaks. They have the same SE and therefore the same height, so in practice
 * this only matters while a value is mid-drag — but sharing it is the reason
 * the two areas can be compared by eye at all.
 */
export function scaleOf(result: Result): Scale {
  const domain = domainOf(result);
  const span = domain.hi - domain.lo || 1;
  const peak = normalPdf(0, 0, result.se) || 1;
  const baseline = PLOT.height - PLOT.padBottom;
  const usable = baseline - PLOT.padTop;

  return {
    domain,
    peak,
    baseline,
    x: (value) => ((value - domain.lo) / span) * PLOT.width,
    y: (density) => baseline - (density / peak) * usable,
  };
}

/** Evenly spaced x values across the domain, in data units. */
export function samples(domain: Domain, count = SAMPLES): Float64Array {
  const out = new Float64Array(count);
  const step = (domain.hi - domain.lo) / (count - 1);
  for (let i = 0; i < count; i++) out[i] = domain.lo + i * step;
  return out;
}

/** An `M … L …` path along one normal density. */
export function curvePath(scale: Scale, mu: number, sd: number, count = SAMPLES): string {
  const xs = samples(scale.domain, count);
  let path = "";
  for (let i = 0; i < count; i++) {
    const x = xs[i]!;
    path += `${i === 0 ? "M" : "L"}${scale.x(x).toFixed(3)} ${scale.y(normalPdf(x, mu, sd)).toFixed(3)}`;
    if (i < count - 1) path += " ";
  }
  return path;
}

/**
 * A closed area under one density between two x values, for shading.
 *
 * Returns an empty string when the interval is empty or entirely outside the
 * window, so a region that does not exist draws nothing rather than a sliver
 * at the edge.
 */
export function areaPath(
  scale: Scale,
  mu: number,
  sd: number,
  from: number,
  to: number,
  count = SAMPLES,
): string {
  const lo = Math.max(from, scale.domain.lo);
  const hi = Math.min(to, scale.domain.hi);
  if (!(hi > lo)) return "";

  const step = (hi - lo) / (count - 1);
  let path = "";
  for (let i = 0; i < count; i++) {
    const x = lo + i * step;
    path += `${i === 0 ? "M" : "L"}${scale.x(x).toFixed(3)} ${scale.y(normalPdf(x, mu, sd)).toFixed(3)} `;
  }
  path += `L${scale.x(hi).toFixed(3)} ${scale.baseline.toFixed(3)} `;
  path += `L${scale.x(lo).toFixed(3)} ${scale.baseline.toFixed(3)} Z`;
  return path;
}

export interface Region {
  /** `alpha` sits under H0 beyond the boundary; `beta` under H1 inside it. */
  readonly kind: "alpha" | "beta";
  readonly from: number;
  readonly to: number;
}

const FAR = 1e6;

/**
 * Which intervals are shaded, per direction.
 *
 * These are the reference implementation's own masks, written as intervals:
 *
 *     right:  alpha over x >= c_right          beta over x <= c_right
 *     left:   alpha over x <= c_left           beta over x >= c_left
 *     two:    alpha over x <= c_left and x >= c_right
 *             beta  over c_left <= x <= c_right
 *
 * Clipped to the window by `areaPath`, so the sentinel is only ever "past the
 * edge of the picture".
 */
export function regionsOf(criticals: Criticals, testType: TestType): Region[] {
  if (testType === "right") {
    const c = criticals.right ?? Number.NaN;
    return [
      { kind: "alpha", from: c, to: FAR },
      { kind: "beta", from: -FAR, to: c },
    ];
  }

  if (testType === "left") {
    const c = criticals.left ?? Number.NaN;
    return [
      { kind: "alpha", from: -FAR, to: c },
      { kind: "beta", from: c, to: FAR },
    ];
  }

  const left = criticals.left ?? Number.NaN;
  const right = criticals.right ?? Number.NaN;
  return [
    { kind: "alpha", from: -FAR, to: left },
    { kind: "alpha", from: right, to: FAR },
    { kind: "beta", from: left, to: right },
  ];
}

/** The critical values that exist, ascending. Two for a two-sided test, one otherwise. */
export function criticalList(criticals: Criticals): number[] {
  const out: number[] = [];
  if (criticals.left !== undefined) out.push(criticals.left);
  if (criticals.right !== undefined) out.push(criticals.right);
  return out.sort((a, b) => a - b);
}

/** Separation between the hypotheses in standard errors — `|mu1 - mu0| / SE`. */
export const separation = (result: Result): number =>
  Math.abs(result.params.mu1 - result.params.mu0) / result.se;

// -------------------------------------------------------------- formatting ---

/** Probabilities to three decimals, as the reference implementation prints them. */
export const prob = (value: number): string => value.toFixed(3);

/** Positions and standard errors to two, which is the resolution of the sliders. */
export const coord = (value: number): string => value.toFixed(2);

// -------------------------------------------------------------- challenge ---

export interface ChallengeSpec {
  readonly id: ChallengeId;
  /** Power must reach this. */
  readonly minPower: number;
  /** And alpha must stay at or below this. */
  readonly maxAlpha: number;
  /** Where the puzzle opens — deliberately not a solution. */
  readonly start: {
    readonly mu0: number;
    readonly mu1: number;
    readonly sigma: number;
    readonly alpha: number;
    readonly n: number;
    readonly testType: TestType;
  };
  /** Which controls the puzzle hands over. */
  readonly levers: readonly Lever[];
}

export type ChallengeId = "reach-power" | "noisy";
export type Lever = "alpha" | "n" | "sigma" | "mu1" | "testType";

/**
 * Two puzzles, both stated as a constraint on the result rather than on the
 * controls.
 *
 * Neither can be passed by putting a slider anywhere in particular: they are
 * passed when the engine reports the power the task asks for, at an alpha the
 * task allows. The second one exists because the first has an easy answer —
 * add data — and the second takes that answer most of the way off the table by
 * making sigma the thing that is wrong.
 */
export const CHALLENGES: readonly ChallengeSpec[] = [
  {
    id: "reach-power",
    minPower: 0.8,
    maxAlpha: 0.1,
    start: { mu0: 0, mu1: 0.5, sigma: 1, alpha: 0.05, n: 10, testType: "right" },
    levers: ["n", "alpha"],
  },
  {
    id: "noisy",
    minPower: 0.8,
    maxAlpha: 0.05,
    start: { mu0: 0, mu1: 1, sigma: 3, alpha: 0.05, n: 10, testType: "two" },
    levers: ["n", "sigma", "testType"],
  },
];

export const challengeById = (id: ChallengeId): ChallengeSpec =>
  CHALLENGES.find((spec) => spec.id === id) ?? CHALLENGES[0]!;

export interface Verdict {
  readonly powerMet: boolean;
  readonly alphaMet: boolean;
  readonly solved: boolean;
}

/** Judged from the engine's result, never from the control positions. */
export function judge(spec: ChallengeSpec, result: Result): Verdict {
  const powerMet = result.power >= spec.minPower;
  const alphaMet = result.params.alpha <= spec.maxAlpha + 1e-9;
  return { powerMet, alphaMet, solved: powerMet && alphaMet };
}
