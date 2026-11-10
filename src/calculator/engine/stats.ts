/**
 * One-variable statistics, as the calculators compute them.
 *
 * The two that confuse students are kept apart by name, the way the devices
 * label them:
 *
 * - σx, σ²x: the *population* standard deviation and variance, dividing by n.
 *   Right when the data is the whole group.
 * - sx, s²x: the *sample* standard deviation and variance, dividing by n − 1.
 *   Right when the data is a sample from a larger group, which is almost
 *   always what a statistics course means.
 *
 * Neither calculator has a "variance" key on its keyboard: on the ES PLUS you
 * square σx or sx yourself, and on the EX they appear in the 1-Variable
 * results list as σ²x and s²x.
 */

export interface OneVariable {
  n: number;
  mean: number;
  sumX: number;
  sumX2: number;
  popVar: number;
  popSd: number;
  /** NaN when n < 2: a sample variance needs two values. */
  sampleVar: number;
  sampleSd: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

const medianOf = (sorted: number[]): number => {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
};

/**
 * Quartiles by halves: Q1 is the median of the lower half and Q3 of the upper
 * half, and when n is odd the median itself belongs to neither half. This is
 * the method Casio documents for these models.
 */
function quartiles(sorted: number[]): [number, number] {
  const n = sorted.length;
  if (n === 1) return [sorted[0]!, sorted[0]!];
  const half = Math.floor(n / 2);
  return [medianOf(sorted.slice(0, half)), medianOf(sorted.slice(n - half))];
}

/** `null` for an empty list. */
export function oneVariable(data: readonly number[]): OneVariable | null {
  const n = data.length;
  if (n === 0) return null;
  const sumX = data.reduce((a, x) => a + x, 0);
  const sumX2 = data.reduce((a, x) => a + x * x, 0);
  const mean = sumX / n;
  // Two passes: the one-pass formula loses digits to cancellation.
  const squares = data.reduce((a, x) => a + (x - mean) ** 2, 0);
  const popVar = squares / n;
  const sampleVar = n > 1 ? squares / (n - 1) : NaN;
  const sorted = [...data].sort((a, b) => a - b);
  const [q1, q3] = quartiles(sorted);
  return {
    n,
    mean,
    sumX,
    sumX2,
    popVar,
    popSd: Math.sqrt(popVar),
    sampleVar,
    sampleSd: Math.sqrt(sampleVar),
    min: sorted[0]!,
    q1,
    median: medianOf(sorted),
    q3,
    max: sorted[n - 1]!,
  };
}

export interface TwoVariable {
  n: number;
  meanX: number;
  meanY: number;
  sumX: number;
  sumX2: number;
  sumY: number;
  sumY2: number;
  sumXY: number;
  popSdX: number;
  sampleSdX: number;
  popSdY: number;
  sampleSdY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  /** y = a + bx, the least-squares line. NaN when every x is the same. */
  a: number;
  b: number;
  /** Pearson's correlation coefficient. */
  r: number;
}

/**
 * Paired statistics and the linear regression y = a + bx.
 *
 * The ES PLUS and MS call the coefficients A and B; the EX calls them a and
 * b. They are the same numbers.
 */
export function twoVariable(pairs: readonly { x: number; y: number }[]): TwoVariable | null {
  const n = pairs.length;
  if (n === 0) return null;
  const xs = pairs.map((p) => p.x);
  const ys = pairs.map((p) => p.y);
  const sum = (v: number[]) => v.reduce((s, x) => s + x, 0);
  const meanX = sum(xs) / n;
  const meanY = sum(ys) / n;
  const sxx = sum(xs.map((x) => (x - meanX) ** 2));
  const syy = sum(ys.map((y) => (y - meanY) ** 2));
  const sxy = sum(pairs.map((p) => (p.x - meanX) * (p.y - meanY)));
  const b = sxx === 0 ? NaN : sxy / sxx;
  return {
    n,
    meanX,
    meanY,
    sumX: sum(xs),
    sumX2: sum(xs.map((x) => x * x)),
    sumY: sum(ys),
    sumY2: sum(ys.map((y) => y * y)),
    sumXY: sum(pairs.map((p) => p.x * p.y)),
    popSdX: Math.sqrt(sxx / n),
    sampleSdX: n > 1 ? Math.sqrt(sxx / (n - 1)) : NaN,
    popSdY: Math.sqrt(syy / n),
    sampleSdY: n > 1 ? Math.sqrt(syy / (n - 1)) : NaN,
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    a: meanY - b * meanX,
    b,
    r: sxx === 0 || syy === 0 ? NaN : sxy / Math.sqrt(sxx * syy),
  };
}
