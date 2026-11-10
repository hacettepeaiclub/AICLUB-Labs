/**
 * The equation solvers: simultaneous linear equations with two or three
 * unknowns, and polynomials of degree two or three.
 *
 * Roots come back as complex numbers, because a quadratic with a negative
 * discriminant still has two answers and the devices show them as a ± bi.
 */

export interface Complex {
  re: number;
  im: number;
}

const snap = (x: number, scale: number) => (Math.abs(x) < 1e-12 * Math.max(1, scale) ? 0 : x);

/**
 * Solve n equations in n unknowns, given as rows [a₁ … aₙ c].
 * "none" when they contradict each other, "infinite" when they do not
 * pin the answer down.
 */
export function solveLinear(rows: number[][]): number[] | "none" | "infinite" {
  const n = rows.length;
  const a = rows.map((row) => [...row]);
  const size = Math.max(1, ...rows.flat().map(Math.abs));
  let rank = 0;
  const pivots: number[] = [];
  for (let col = 0; col < n && rank < n; col++) {
    let best = rank;
    for (let r = rank + 1; r < n; r++)
      if (Math.abs(a[r]![col]!) > Math.abs(a[best]![col]!)) best = r;
    if (Math.abs(a[best]![col]!) < 1e-12 * size) continue;
    [a[rank], a[best]] = [a[best]!, a[rank]!];
    const p = a[rank]![col]!;
    a[rank] = a[rank]!.map((x) => x / p);
    for (let r = 0; r < n; r++) {
      if (r === rank) continue;
      const f = a[r]![col]!;
      if (f !== 0) a[r] = a[r]!.map((x, k) => x - f * a[rank]![k]!);
    }
    pivots.push(col);
    rank++;
  }
  if (rank < n) {
    // A row of zeros that still asks for a non-zero constant is a contradiction.
    const contradiction = a.some(
      (row) =>
        row.slice(0, n).every((x) => Math.abs(x) < 1e-12 * size) &&
        Math.abs(row[n]!) > 1e-12 * size,
    );
    return contradiction ? "none" : "infinite";
  }
  const out = Array.from({ length: n }, () => 0);
  // Elimination leaves 4.999999999999999 where the answer is 5.
  const whole = (x: number) =>
    Math.abs(x - Math.round(x)) < 1e-12 * Math.max(1, Math.abs(x)) ? Math.round(x) : x;
  pivots.forEach((col, r) => (out[col] = whole(snap(a[r]![n]!, size))));
  return out;
}

const csqrt = (x: number): Complex =>
  x >= 0 ? { re: Math.sqrt(x), im: 0 } : { re: 0, im: Math.sqrt(-x) };

/**
 * The roots of a·x² + b·x + c (coefficients highest first), or of a cubic.
 * `null` when the leading coefficient is zero: the devices refuse that.
 *
 * Quadratic roots are listed as the device lists them, (−b + √D) ÷ 2a first.
 */
export function solvePolynomial(coefs: number[]): Complex[] | null {
  if (coefs[0] === 0) return null;
  if (coefs.length === 3) {
    const [a, b, c] = coefs as [number, number, number];
    const disc = b * b - 4 * a * c;
    const scale = Math.max(Math.abs(b * b), Math.abs(4 * a * c));
    const root = csqrt(snap(disc, scale));
    const roots = [1, -1].map((sign) => ({
      re: (-b + sign * root.re) / (2 * a),
      im: (sign * root.im) / (2 * a),
    }));
    return roots.map((z) => ({ re: snap(z.re, 1), im: snap(z.im, 1) }));
  }
  if (coefs.length === 4) return cubicRoots(coefs as [number, number, number, number]);
  return null;
}

/** Durand–Kerner on the monic cubic, then real roots polished by Newton. */
function cubicRoots([a, b, c, d]: [number, number, number, number]): Complex[] {
  const p = [1, b / a, c / a, d / a];
  const evalAt = (z: Complex): Complex => {
    let re = 1;
    let im = 0;
    for (let i = 1; i < 4; i++) {
      [re, im] = [re * z.re - im * z.im + p[i]!, re * z.im + im * z.re];
    }
    return { re, im };
  };
  let roots: Complex[] = [
    { re: 0.4, im: 0.9 },
    { re: -0.65, im: 0.72 },
    { re: 0.81, im: -0.33 },
  ];
  for (let iter = 0; iter < 500; iter++) {
    let moved = 0;
    roots = roots.map((z, i) => {
      let den: Complex = { re: 1, im: 0 };
      roots.forEach((w, j) => {
        if (i === j) return;
        const dr = z.re - w.re;
        const di = z.im - w.im;
        den = { re: den.re * dr - den.im * di, im: den.re * di + den.im * dr };
      });
      const num = evalAt(z);
      const mag = den.re * den.re + den.im * den.im || 1e-300;
      const step = {
        re: (num.re * den.re + num.im * den.im) / mag,
        im: (num.im * den.re - num.re * den.im) / mag,
      };
      moved = Math.max(moved, Math.abs(step.re) + Math.abs(step.im));
      return { re: z.re - step.re, im: z.im - step.im };
    });
    if (moved < 1e-15) break;
  }
  const scale = Math.max(1, ...p.map(Math.abs));
  const cleaned = roots.map((z) => {
    if (Math.abs(z.im) > 1e-9 * scale) return { re: snap(z.re, scale), im: z.im };
    // Real: polish on the real line.
    let x = z.re;
    for (let i = 0; i < 4; i++) {
      const f = ((x + p[1]!) * x + p[2]!) * x + p[3]!;
      const df = (3 * x + 2 * p[1]!) * x + p[2]!;
      if (df === 0) break;
      x -= f / df;
    }
    return { re: snap(x, scale), im: 0 };
  });
  // Real roots first, largest first; a complex pair after them, + before −.
  return cleaned.sort((u, v) => {
    if ((u.im === 0) !== (v.im === 0)) return u.im === 0 ? -1 : 1;
    return v.re - u.re || v.im - u.im;
  });
}
