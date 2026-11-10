/**
 * Matrix arithmetic for the calculator's Matrix mode.
 *
 * Matrices are small (3×3 on the ES PLUS, 4×4 on the EX), so everything here
 * is the textbook algorithm, with partial pivoting where a pivot is chosen.
 * Entries that come out as float noise next to the matrix's own scale are
 * snapped to zero, which is what lets an inverse show 3⁄5 rather than
 * 0.6000000000000001.
 */

export type Matrix = number[][];

export const isMatrix = (value: unknown): value is Matrix => Array.isArray(value);

export const rows = (m: Matrix): number => m.length;
export const cols = (m: Matrix): number => m[0]?.length ?? 0;

export const zeros = (r: number, c: number): Matrix =>
  Array.from({ length: r }, () => Array.from({ length: c }, () => 0));

export const identity = (n: number): Matrix =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

export const sameShape = (a: Matrix, b: Matrix): boolean =>
  rows(a) === rows(b) && cols(a) === cols(b);

const at = (m: Matrix, i: number, j: number): number => m[i]?.[j] ?? 0;

const map = (m: Matrix, f: (x: number, i: number, j: number) => number): Matrix =>
  m.map((row, i) => row.map((x, j) => f(x, i, j)));

/** Entries that are noise next to the largest entry become exactly zero. */
function clean(m: Matrix): Matrix {
  const scale = Math.max(1, ...m.flat().map(Math.abs));
  return map(m, (x) => (Math.abs(x) < 1e-12 * scale ? 0 : x));
}

/** `null` when the shapes do not match. */
export const add = (a: Matrix, b: Matrix): Matrix | null =>
  sameShape(a, b) ? map(a, (x, i, j) => x + at(b, i, j)) : null;

export const sub = (a: Matrix, b: Matrix): Matrix | null =>
  sameShape(a, b) ? map(a, (x, i, j) => x - at(b, i, j)) : null;

export const scale = (m: Matrix, k: number): Matrix => map(m, (x) => x * k);

export const transpose = (m: Matrix): Matrix =>
  Array.from({ length: cols(m) }, (_, j) => Array.from({ length: rows(m) }, (_, i) => at(m, i, j)));

/** `null` when the inner dimensions do not agree. */
export function multiply(a: Matrix, b: Matrix): Matrix | null {
  if (cols(a) !== rows(b)) return null;
  const out = zeros(rows(a), cols(b));
  for (let i = 0; i < rows(a); i++)
    for (let j = 0; j < cols(b); j++) {
      let sum = 0;
      for (let k = 0; k < cols(a); k++) sum += at(a, i, k) * at(b, k, j);
      out[i]![j] = sum;
    }
  return clean(out);
}

/** `null` when the matrix is not square. */
export function determinant(m: Matrix): number | null {
  const n = rows(m);
  if (n === 0 || n !== cols(m)) return null;
  const a = m.map((row) => [...row]);
  const size = Math.max(1, ...m.flat().map(Math.abs));
  let det = 1;
  for (let c = 0; c < n; c++) {
    let pivot = c;
    for (let r = c + 1; r < n; r++)
      if (Math.abs(at(a, r, c)) > Math.abs(at(a, pivot, c))) pivot = r;
    if (Math.abs(at(a, pivot, c)) < 1e-12 * size) return 0;
    if (pivot !== c) {
      [a[c], a[pivot]] = [a[pivot]!, a[c]!];
      det = -det;
    }
    const p = at(a, c, c);
    det *= p;
    for (let r = c + 1; r < n; r++) {
      const f = at(a, r, c) / p;
      for (let k = c; k < n; k++) a[r]![k] = at(a, r, k) - f * at(a, c, k);
    }
  }
  return Math.abs(det) < 1e-12 * size ** n ? 0 : det;
}

export type InverseResult = Matrix | "not-square" | "singular";

/** Gauss–Jordan elimination on [M | I]. */
export function inverse(m: Matrix): InverseResult {
  const n = rows(m);
  if (n === 0 || n !== cols(m)) return "not-square";
  const size = Math.max(1, ...m.flat().map(Math.abs));
  const a = m.map((row, i) => [...row, ...identity(n)[i]!]);
  for (let c = 0; c < n; c++) {
    let pivot = c;
    for (let r = c + 1; r < n; r++)
      if (Math.abs(at(a, r, c)) > Math.abs(at(a, pivot, c))) pivot = r;
    if (Math.abs(at(a, pivot, c)) < 1e-12 * size) return "singular";
    [a[c], a[pivot]] = [a[pivot]!, a[c]!];
    const p = at(a, c, c);
    a[c] = a[c]!.map((x) => x / p);
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = at(a, r, c);
      if (f !== 0) a[r] = a[r]!.map((x, k) => x - f * at(a, c, k));
    }
  }
  return clean(a.map((row) => row.slice(n)));
}
