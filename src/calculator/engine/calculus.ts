/**
 * Numerical integration, differentiation and root finding, for ∫, d/dx and
 * SOLVE.
 *
 * The devices do these numerically too (Gauss–Kronrod or Simpson for ∫, a
 * difference quotient for d/dx, Newton's method for SOLVE), so their answers
 * are numerical approximations. Accuracy depends on the function, scale and
 * interval; these algorithms do not reproduce device firmware.
 */

/** f may throw (a Math ERROR inside the integrand); the caller handles it. */
type Fn = (x: number) => number;

/** Adaptive Simpson's rule. */
export function integrate(f: Fn, a: number, b: number): number {
  if (a === b) return 0;
  let evaluations = 0;
  const sample = (x: number): number => {
    if (++evaluations > 100000) throw new RangeError("Integration did not converge");
    const value = f(x);
    if (!Number.isFinite(value)) throw new RangeError("Non-finite integrand");
    return value;
  };
  const simpson = (l: number, r: number, fl: number, fm: number, fr: number) =>
    ((r - l) / 6) * (fl + 4 * fm + fr);
  const step = (
    l: number,
    r: number,
    fl: number,
    fm: number,
    fr: number,
    whole: number,
    eps: number,
    depth: number,
  ): number => {
    const m = (l + r) / 2;
    const lm = (l + m) / 2;
    const rm = (m + r) / 2;
    const flm = sample(lm);
    const frm = sample(rm);
    const left = simpson(l, m, fl, flm, fm);
    const right = simpson(m, r, fm, frm, fr);
    const delta = left + right - whole;
    if (depth <= 0) throw new RangeError("Integration did not converge");
    if (Math.abs(delta) <= 15 * eps) return left + right + delta / 15;
    return (
      step(l, m, fl, flm, fm, left, eps / 2, depth - 1) +
      step(m, r, fm, frm, fr, right, eps / 2, depth - 1)
    );
  };
  // Several initial panels keep a first set of coincident zero samples
  // from being mistaken for convergence on an oscillating function.
  const panels = 17;
  let total = 0;
  for (let i = 0; i < panels; i++) {
    const l = a + ((b - a) * i) / panels;
    const r = a + ((b - a) * (i + 1)) / panels;
    const fl = sample(l),
      fr = sample(r),
      fm = sample((l + r) / 2);
    total += step(l, r, fl, fm, fr, simpson(l, r, fl, fm, fr), 1e-12 / panels, 30);
  }
  return total;
}

/** f′(a) by a five-point central difference. */
export function differentiate(f: Fn, a: number): number {
  const value = f(a);
  // A binary step helps retain differences when a large constant offsets f.
  const scale = Math.max(1, Math.abs(a));
  let h =
    2 **
    Math.ceil(Math.log2(Math.max(1e-3 * scale, 64 * Math.sqrt(Number.EPSILON * Math.abs(value)))));
  const estimate = (step: number): number =>
    (8 * (f(a + step) - f(a - step)) - (f(a + 2 * step) - f(a - 2 * step))) / (12 * step);
  let previous = estimate(h);
  let best = previous;
  let error = Infinity;
  for (let i = 0; i < 12; i++) {
    h /= 2;
    const current = estimate(h);
    const difference = Math.abs(current - previous);
    if (!Number.isFinite(current)) throw new RangeError("Derivative is not finite");
    if (difference > error) break;
    best = current;
    error = difference;
    if (difference <= 1e-12 * Math.max(1, Math.abs(current))) break;
    previous = current;
  }
  if (error > 1e-7 * Math.max(1, Math.abs(best)))
    throw new RangeError("Derivative did not converge");
  return best;
}

export interface Solution {
  x: number;
  /** f(x), what the device calls L−R: how far the two sides still differ. */
  residual: number;
}

/** Newton's method from x0, with a numerical derivative. `null` if it does not settle. */
export function newtonSolve(f: Fn, x0: number): Solution | null {
  let x = x0;
  for (let i = 0; i < 200; i++) {
    const fx = f(x);
    if (fx === 0) return { x, residual: 0 };
    const h = 1e-6 * Math.max(1, Math.abs(x));
    const slope = (f(x + h) - f(x - h)) / (2 * h);
    if (!Number.isFinite(slope) || slope === 0) {
      x += h * 100;
      continue;
    }
    const next = x - fx / slope;
    if (!Number.isFinite(next)) return null;
    if (Math.abs(next - x) <= 1e-15 * Math.max(1, Math.abs(x))) {
      x = next;
      break;
    }
    x = next;
  }
  const residual = f(x);
  if (!Number.isFinite(residual) || Math.abs(residual) > 1e-9 * Math.max(1, Math.abs(x)))
    return null;
  return { x, residual: Math.abs(residual) < 1e-12 ? 0 : residual };
}
