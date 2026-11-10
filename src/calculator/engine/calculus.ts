/**
 * Numerical integration, differentiation and root finding, for ∫, d/dx and
 * SOLVE.
 *
 * The devices do these numerically too (Gauss–Kronrod or Simpson for ∫, a
 * difference quotient for d/dx, Newton's method for SOLVE), so their answers
 * are approximations shown to ten digits. These are accurate well past that,
 * so a result here matches the device's on screen.
 */

/** f may throw (a Math ERROR inside the integrand); the caller handles it. */
type Fn = (x: number) => number;

/** Adaptive Simpson's rule. */
export function integrate(f: Fn, a: number, b: number): number {
  if (a === b) return 0;
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
    const flm = f(lm);
    const frm = f(rm);
    const left = simpson(l, m, fl, flm, fm);
    const right = simpson(m, r, fm, frm, fr);
    const delta = left + right - whole;
    if (depth <= 0 || Math.abs(delta) <= 15 * eps) return left + right + delta / 15;
    return (
      step(l, m, fl, flm, fm, left, eps / 2, depth - 1) +
      step(m, r, fm, frm, fr, right, eps / 2, depth - 1)
    );
  };
  const fa = f(a);
  const fb = f(b);
  const fm = f((a + b) / 2);
  return step(a, b, fa, fm, fb, simpson(a, b, fa, fm, fb), 1e-13, 40);
}

/** f′(a) by a five-point central difference. */
export function differentiate(f: Fn, a: number): number {
  const h = 1e-3 * Math.max(1, Math.abs(a));
  const d = (-f(a + 2 * h) + 8 * f(a + h) - 8 * f(a - h) + f(a - 2 * h)) / (12 * h);
  // Rounding in f leaves noise of about 1e-13·|f|; below that, the slope is 0.
  return Math.abs(d) < 1e-10 * Math.max(1, Math.abs(f(a))) ? 0 : d;
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
