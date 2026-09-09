/**
 * The theoretical two-hypothesis normal model, ported from the reference
 * implementation.
 *
 * Pure TypeScript — no React, no DOM, no library, no randomness. Every number
 * the lab draws comes from this file.
 *
 * ## Provenance
 *
 * This is a faithful port of `Kuramsal Hipotez Testleri Simülasyonu.py`, which
 * is the numerical source of truth. The equations below are that file's
 * equations, in that file's form:
 *
 *     SE  = sigma / sqrt(n)
 *
 *     right:  zcrit = Phi^-1(1 - alpha)      c_right = mu0 + zcrit * SE
 *     left:   zcrit = Phi^-1(1 - alpha)      c_left  = mu0 - zcrit * SE
 *     two:    zcrit = Phi^-1(1 - alpha/2)    c_left  = mu0 - zcrit * SE
 *                                            c_right = mu0 + zcrit * SE
 *
 *     right:  beta = Phi(c_right; mu1, SE)
 *     left:   beta = 1 - Phi(c_left; mu1, SE)
 *     two:    beta = Phi(c_right; mu1, SE) - Phi(c_left; mu1, SE)
 *
 *     power = 1 - beta
 *
 * Nothing here has been "improved". Where a choice in the source looked
 * arguable it was kept and written down in the pull request instead, because a
 * silent correction would make the lab a different model from the one it says
 * it is.
 *
 * ## What the model is, exactly
 *
 * Both curves are drawn with scale `SE`, not `sigma` — they are the sampling
 * distributions of the mean under H0 and under H1, with the population
 * standard deviation treated as known. That is what makes the critical value a
 * z rather than a t, and it is why more data narrows both curves at once.
 *
 * ## Precision
 *
 * `normalCdf` is West's double-precision cumulative normal and `normalQuantile`
 * is Wichura's AS241, so both agree with SciPy's `norm.cdf` / `norm.ppf` to
 * around 1e-15. That matters: the whole claim of this lab is that the picture
 * is the arithmetic, and a cheap 1e-7 approximation would show a visibly
 * different beta in the tails the lab spends its time in.
 */

export type TestType = "right" | "left" | "two";

/** Every test direction, in the order the picker offers them. */
export const TEST_TYPES: readonly TestType[] = ["right", "left", "two"];

// ------------------------------------------------------------- defaults ---
// The reference implementation's own opening state, value for value.

export const MU0_DEFAULT = 0;
export const MU1_DEFAULT = 2;
export const SIGMA_DEFAULT = 1;
export const ALPHA_DEFAULT = 0.1;
export const N_DEFAULT = 10;
export const TEST_TYPE_DEFAULT: TestType = "right";

/** The source's slider bounds, kept so the lab explores the same space. */
export const BOUNDS = {
  alpha: { min: 0.01, max: 0.2, step: 0.01 },
  mu0: { min: -3, max: 3, step: 0.1 },
  mu1: { min: -5, max: 5, step: 0.1 },
  sigma: { min: 0.5, max: 3, step: 0.1 },
  n: { min: 2, max: 100, step: 1 },
} as const;

// --------------------------------------------------------- the normal ---

const SQRT_2PI = Math.sqrt(2 * Math.PI);

/** Standard normal density, then shifted and scaled. */
export function normalPdf(x: number, mu: number, sd: number): number {
  if (!(sd > 0)) return Number.NaN;
  const z = (x - mu) / sd;
  return Math.exp(-0.5 * z * z) / (sd * SQRT_2PI);
}

/**
 * Standard normal CDF — West's double-precision `cumnorm`.
 *
 * A Hart rational approximation on |z| < 7.07, an asymptotic continued
 * fraction beyond it, which is what keeps the far tail honest instead of
 * flushing to zero. Absolute error is around 1e-15 across the line.
 */
export function stdNormalCdf(z: number): number {
  if (Number.isNaN(z)) return Number.NaN;
  const a = Math.abs(z);
  if (a > 37) return z > 0 ? 1 : 0;

  const e = Math.exp(-0.5 * a * a);
  let c: number;

  if (a < 7.071067811865475) {
    // Hart 1968, via West: two polynomials, seven terms each.
    let build = 0.0352624965998911 * a + 0.700383064443688;
    build = build * a + 6.37396220353165;
    build = build * a + 33.912866078383;
    build = build * a + 112.079291497871;
    build = build * a + 221.213596169931;
    build = build * a + 220.206867912376;
    let denom = 0.0883883476483184 * a + 1.75566716318264;
    denom = denom * a + 16.064177579207;
    denom = denom * a + 86.7807322029461;
    denom = denom * a + 296.564248779674;
    denom = denom * a + 637.333633378831;
    denom = denom * a + 793.826512519948;
    denom = denom * a + 440.413735824752;
    c = (e * build) / denom;
  } else {
    /*
     * The tail, as a continued fraction run to convergence:
     *
     *     Phi(-a) = phi(a) / (a + 1/(a + 2/(a + 3/(a + ...))))
     *
     * West truncates this at depth five with a fudge term, which costs about
     * seven digits out here. That is invisible in anything this lab draws —
     * the numbers involved are below 1e-15 — but the whole point of the port
     * is that it agrees with the reference, and agreeing to eight digits when
     * sixteen are available is a worse answer for no saving. Backward
     * recurrence from depth 60 reaches machine precision for every `a` that
     * gets here.
     */
    let cf = 0;
    for (let k = 60; k >= 1; k--) cf = k / (a + cf);
    c = e / ((a + cf) * SQRT_2PI);
  }

  return z > 0 ? 1 - c : c;
}

/** `Phi(x; mu, sd)` — the source's `norm.cdf(x, loc=mu, scale=sd)`. */
export function normalCdf(x: number, mu: number, sd: number): number {
  if (!(sd > 0)) return Number.NaN;
  return stdNormalCdf((x - mu) / sd);
}

/**
 * Inverse standard normal — Wichura's AS241 (PPND16).
 *
 * Three rational branches by distance from the centre; relative accuracy about
 * 1e-16, which is what `scipy.stats.norm.ppf` uses in the reference.
 */
export function normalQuantile(p: number): number {
  if (Number.isNaN(p) || p < 0 || p > 1) return Number.NaN;
  if (p === 0) return -Infinity;
  if (p === 1) return Infinity;

  const q = p - 0.5;

  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return (
      (q *
        (((((((2509.0809287301227 * r + 33430.57558358813) * r + 67265.7709270087) * r +
          45921.95393154987) *
          r +
          13731.69376550946) *
          r +
          1971.5909503065513) *
          r +
          133.14166789178438) *
          r +
          3.3871328727963665)) /
      (((((((5226.495278852854 * r + 28729.085735721943) * r + 39307.89580009271) * r +
        21213.794301586597) *
        r +
        5394.196021424751) *
        r +
        687.1870074920579) *
        r +
        42.31333070160091) *
        r +
        1)
    );
  }

  let r = q < 0 ? p : 1 - p;
  r = Math.sqrt(-Math.log(r));
  let value: number;

  if (r <= 5) {
    r -= 1.6;
    value =
      (((((((0.0007745450142783414 * r + 0.022723844989269184) * r +
        0.2417807251774506) *
        r +
        1.2704582524523684) *
        r +
        3.6478483247632045) *
        r +
        5.769497221460691) *
        r +
        4.630337846156546) *
        r +
        1.4234371107496835) /
      (((((((1.0507500716444169e-9 * r + 0.0005475938084995345) * r +
        0.015198666563616457) *
        r +
        0.14810397642748008) *
        r +
        0.6897673349851) *
        r +
        1.6763848301838038) *
        r +
        2.053191626637759) *
        r +
        1);
  } else {
    r -= 5;
    value =
      (((((((2.0103343992922881e-7 * r + 0.000027115555687434876) * r +
        0.0012426609473880784) *
        r +
        0.026532189526576124) *
        r +
        0.29656057182850487) *
        r +
        1.7848265399172913) *
        r +
        5.463784911164114) *
        r +
        6.657904643501103) /
      (((((((2.0442631033899397e-15 * r + 1.421511758316446e-7) * r +
        0.000018463183175100548) *
        r +
        0.0007868691311456133) *
        r +
        0.014875361290850615) *
        r +
        0.1369298809227358) *
        r +
        0.599832206555888) *
        r +
        1);
  }

  return q < 0 ? -value : value;
}

// ------------------------------------------------------------- the model ---

/** `SE = sigma / sqrt(n)`. The source's `standard_error`. */
export const standardError = (sigma: number, n: number): number => sigma / Math.sqrt(n);

/**
 * The critical value or values.
 *
 * `left` and `right` are present exactly where the source's dictionary has
 * them: one key for a one-sided test, both for a two-sided one. A key that is
 * absent is a boundary this test does not have, which is different from one
 * sitting at infinity — the lab draws only what is here.
 */
export interface Criticals {
  readonly left?: number;
  readonly right?: number;
}

/** The source's `get_critical_values`, branch for branch. */
export function getCriticalValues(
  alpha: number,
  mu0: number,
  sigma: number,
  n: number,
  testType: TestType,
): Criticals {
  const se = standardError(sigma, n);

  if (testType === "right") {
    const zcrit = normalQuantile(1 - alpha);
    return { right: mu0 + zcrit * se };
  }

  if (testType === "left") {
    const zcrit = normalQuantile(1 - alpha);
    return { left: mu0 - zcrit * se };
  }

  const zcrit = normalQuantile(1 - alpha / 2);
  return { left: mu0 - zcrit * se, right: mu0 + zcrit * se };
}

/**
 * The source's `compute_beta`.
 *
 * Beta is the H1 mass that falls outside the rejection region, and each branch
 * is that statement written for its own geometry. Nothing is clamped: if a
 * direction is set against the alternative, beta really does run to nearly 1,
 * and that is the behaviour the warning below exists to explain rather than
 * hide.
 */
export function computeBeta(
  mu1: number,
  sigma: number,
  n: number,
  criticals: Criticals,
  testType: TestType,
): number {
  const se = standardError(sigma, n);

  if (testType === "right") {
    return normalCdf(criticals.right ?? Number.NaN, mu1, se);
  }

  if (testType === "left") {
    return 1 - normalCdf(criticals.left ?? Number.NaN, mu1, se);
  }

  return (
    normalCdf(criticals.right ?? Number.NaN, mu1, se) -
    normalCdf(criticals.left ?? Number.NaN, mu1, se)
  );
}

/** `power = 1 - beta`. */
export const computePower = (beta: number): number => 1 - beta;

/** Which direction warning the source raises, or null for none. */
export type DirectionWarning = "left" | "right" | null;

/**
 * The source's `direction_warning`, condition for condition.
 *
 * Both comparisons are non-strict in the reference — `mu1 >= mu0` for a
 * left-tailed test and `mu1 <= mu0` for a right-tailed one — so equality
 * warns. That is kept: at `mu1 === mu0` the alternative is the null, and there
 * is genuinely nothing for the test to detect.
 */
export function directionWarning(testType: TestType, mu0: number, mu1: number): DirectionWarning {
  if (testType === "left" && mu1 >= mu0) return "left";
  if (testType === "right" && mu1 <= mu0) return "right";
  return null;
}

// ------------------------------------------------------------ one result ---

export interface Params {
  readonly mu0: number;
  readonly mu1: number;
  readonly sigma: number;
  readonly alpha: number;
  readonly n: number;
  readonly testType: TestType;
}

export interface Result {
  readonly params: Params;
  readonly se: number;
  readonly criticals: Criticals;
  readonly beta: number;
  readonly power: number;
  readonly warning: DirectionWarning;
}

/**
 * Everything the lab shows for one set of parameters, computed once.
 *
 * Every section reads a `Result`; no component recomputes a critical value or
 * a beta of its own, so the number beside the picture and the number the
 * picture is drawn from cannot disagree.
 */
export function evaluate(params: Params): Result {
  const { mu0, mu1, sigma, alpha, n, testType } = params;
  const se = standardError(sigma, n);
  const criticals = getCriticalValues(alpha, mu0, sigma, n, testType);
  const beta = computeBeta(mu1, sigma, n, criticals, testType);
  return {
    params,
    se,
    criticals,
    beta,
    power: computePower(beta),
    warning: directionWarning(testType, mu0, mu1),
  };
}
