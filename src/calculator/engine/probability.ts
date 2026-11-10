/**
 * Probability distributions, to the ten digits the display shows.
 *
 * The fx-991EX has a Distribution mode that works these out from their
 * parameters. The ES PLUS and MS do not: they offer P(, Q( and R(, the
 * standard normal areas for a value already standardised as t = (x − μ) ÷ σ,
 * which is how the lessons teach it on those models. Casio gives those three
 * to five decimal places, and so does this.
 */

const SQRT2PI = Math.sqrt(2 * Math.PI);

/** The standard normal density. */
export const phi = (z: number): number => Math.exp(-0.5 * z * z) / SQRT2PI;

/** Upper tail Q(z) = P(Z > z) for z ≥ 0, by continued fraction (accurate far out). */
function upperTail(z: number): number {
  // Lentz's method on Q(z) = φ(z) / (z + 1/(z + 2/(z + 3/(z + …)))).
  const tiny = 1e-300;
  let f = z || tiny;
  let c = f;
  let d = 0;
  for (let k = 1; k < 300; k++) {
    d = z + k * d;
    d = d === 0 ? tiny : d;
    c = z + k / c;
    c = c === 0 ? tiny : c;
    d = 1 / d;
    const delta = c * d;
    f *= delta;
    if (Math.abs(delta - 1) < 1e-16) break;
  }
  return phi(z) / f;
}

/** The standard normal distribution function Φ(z) = P(Z ≤ z). */
export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) return z > 0 ? 1 : 0;
  const a = Math.abs(z);
  if (a > 3) {
    const tail = upperTail(a);
    return z > 0 ? 1 - tail : tail;
  }
  // Φ(z) = ½ + φ(z) · Σ z^(2n+1) / (1·3·5·…·(2n+1)): every term positive.
  let term = z;
  let sum = z;
  for (let n = 1; n < 200; n++) {
    term *= (z * z) / (2 * n + 1);
    sum += term;
    if (Math.abs(term) < 1e-17 * Math.abs(sum)) break;
  }
  return 0.5 + phi(z) * sum;
}

/** P(lower ≤ X ≤ upper) for X ~ N(μ, σ²). */
export const normalBetween = (lower: number, upper: number, sigma: number, mu: number): number =>
  normalCdf((upper - mu) / sigma) - normalCdf((lower - mu) / sigma);

/** The density of N(μ, σ²) at x. */
export const normalPdf = (x: number, sigma: number, mu: number): number =>
  phi((x - mu) / sigma) / sigma;

/**
 * The x with P(X ≤ x) = area, for X ~ N(μ, σ²): Acklam's approximation, then
 * two Halley steps against `normalCdf`, which takes it to full precision.
 */
export function inverseNormal(area: number, sigma: number, mu: number): number {
  if (area <= 0 || area >= 1) return NaN;
  const a = [
    -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716,
    2.506628277459239,
  ];
  const b = [
    -54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972,
    -13.28068155288572,
  ];
  const c = [
    -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  let z: number;
  if (area < low) {
    const q = Math.sqrt(-2 * Math.log(area));
    z =
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else if (area > 1 - low) {
    const q = Math.sqrt(-2 * Math.log(1 - area));
    z =
      -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else {
    const q = area - 0.5;
    const r = q * q;
    z =
      ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
      (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1);
  }
  for (let i = 0; i < 2; i++) {
    const e = normalCdf(z) - area;
    const u = e / phi(z);
    z -= u / (1 + (z * u) / 2);
  }
  return mu + sigma * z;
}

/** ln Γ(x), Lanczos. */
function lnGamma(x: number): number {
  const g = 7;
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  const y = x - 1;
  let s = coef[0]!;
  for (let i = 1; i < g + 2; i++) s += coef[i]! / (y + i);
  const t = y + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (y + 0.5) * Math.log(t) - t + Math.log(s);
}

const isCount = (n: number) => Number.isInteger(n) && n >= 0;

/** P(X = x) for X ~ B(N, p). NaN for parameters the device rejects. */
export function binomialPd(x: number, n: number, p: number): number {
  if (!isCount(n) || !isCount(x) || x > n || p < 0 || p > 1) return NaN;
  if (p === 0) return x === 0 ? 1 : 0;
  if (p === 1) return x === n ? 1 : 0;
  const logC = lnGamma(n + 1) - lnGamma(x + 1) - lnGamma(n - x + 1);
  return Math.exp(logC + x * Math.log(p) + (n - x) * Math.log(1 - p));
}

/** P(X ≤ x) for X ~ B(N, p). */
export function binomialCd(x: number, n: number, p: number): number {
  if (!isCount(n) || !isCount(x) || x > n || p < 0 || p > 1) return NaN;
  let sum = 0;
  for (let k = 0; k <= x; k++) sum += binomialPd(k, n, p);
  return Math.min(1, sum);
}

/** P(X = x) for X ~ Poisson(λ). */
export function poissonPd(x: number, lambda: number): number {
  if (!isCount(x) || lambda <= 0) return NaN;
  return Math.exp(x * Math.log(lambda) - lambda - lnGamma(x + 1));
}

/** P(X ≤ x) for X ~ Poisson(λ). */
export function poissonCd(x: number, lambda: number): number {
  if (!isCount(x) || lambda <= 0) return NaN;
  let sum = 0;
  for (let k = 0; k <= x; k++) sum += poissonPd(k, lambda);
  return Math.min(1, sum);
}

const fiveDecimals = (x: number) => Math.round(x * 1e5) / 1e5;

/** P(t): the area left of t under the standard normal curve. */
export const probP = (t: number): number => fiveDecimals(normalCdf(t));
/** Q(t): the area between 0 and t. */
export const probQ = (t: number): number => fiveDecimals(Math.abs(normalCdf(t) - 0.5));
/** R(t): the area right of t. */
export const probR = (t: number): number => fiveDecimals(1 - normalCdf(t));
