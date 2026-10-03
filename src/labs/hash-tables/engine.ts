/**
 * The arithmetic behind the Hash Table lab.
 *
 * Pure functions with no DOM and no unseeded randomness, so every number on
 * the page can be checked by a test.
 *
 * ## The hash
 *
 * Strings are hashed exactly as Java's `String.hashCode` is specified:
 *
 *   s[0]·31^(n−1) + s[1]·31^(n−2) + … + s[n−1]
 *
 * in 32-bit two's-complement arithmetic over UTF-16 code units. It is a real,
 * widely deployed function, simple enough to do by hand, and it collides in
 * ways the visitor can find. The bucket is the non-negative remainder
 * (Java's `Math.floorMod`); `java.util.HashMap` itself first folds the high
 * bits down and masks, which the lab mentions but does not need.
 *
 * ## What a "probe" counts
 *
 * One key compared, or one slot examined — the unit every formula below
 * measures. A search that finds its key in the first place it looks costs 1.
 */

// ------------------------------------------------------------------ hash --

/** Java's `String.hashCode`, as a signed 32-bit integer. */
export function javaHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Every step of `javaHash`, for showing the arithmetic. */
export function hashSteps(s: string): { char: string; code: number; hash: number }[] {
  let h = 0;
  return [...Array(s.length).keys()].map((i) => {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return { char: s.charAt(i), code: s.charCodeAt(i), hash: h };
  });
}

/** The remainder with the sign of the divisor: always in 0 … m − 1. */
export function floorMod(a: number, m: number): number {
  if (!Number.isInteger(m) || m < 1) throw new RangeError(`Bad modulus ${m}.`);
  return ((a % m) + m) % m;
}

export const bucketOf = (key: string, m: number): number => floorMod(javaHash(key), m);

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// -------------------------------------------------------------- chaining --

/**
 * Separate chaining: each bucket a list, new keys appended at the end.
 *
 * A successful search for the key in place k of its list costs k + 1
 * comparisons. Averaged over every key, under uniformly random buckets, that
 * is exactly 1 + (n − 1)/(2m): key i, inserted i-th, finds on average
 * (i − 1)/m keys ahead of it. For large n this is 1 + α/2, α = n/m.
 */
export function chain(homes: readonly number[], m: number): number[][] {
  const buckets: number[][] = Array.from({ length: m }, () => []);
  homes.forEach((home, key) => buckets[floorMod(home, m)]?.push(key));
  return buckets;
}

/** Mean comparisons to find each stored key, in a chained table. */
export function chainedSuccess(buckets: readonly (readonly number[])[]): number {
  let total = 0;
  let n = 0;
  for (const b of buckets) {
    for (let k = 0; k < b.length; k++) total += k + 1;
    n += b.length;
  }
  return n ? total / n : 0;
}

export const chainSuccessTheory = (alpha: number): number => 1 + alpha / 2;
/** Exact expectation for n keys in m buckets, not only its limit. */
export const chainSuccessExact = (n: number, m: number): number => (n ? 1 + (n - 1) / (2 * m) : 0);

// ---------------------------------------------------------- linear probe --

export const EMPTY = -1;

export interface Placement {
  /** Where the key ended up. */
  readonly slot: number;
  /** Slots examined to put it there, the empty one included. */
  readonly probes: number;
  /** Every slot examined, in order. */
  readonly path: readonly number[];
}

/**
 * Linear probing: start at the home slot and step right, wrapping, until an
 * empty slot. Without deletions, finding a key later retraces exactly this
 * path, so its successful-search cost is the number of probes it took to
 * insert. Returns null when the table is full.
 */
export function probe(table: Int32Array, home: number): Placement | null {
  const m = table.length;
  const path: number[] = [];
  for (let i = 0; i < m; i++) {
    const slot = (floorMod(home, m) + i) % m;
    path.push(slot);
    if (table[slot] === EMPTY) return { slot, probes: i + 1, path };
  }
  return null;
}

export interface LinearTable {
  readonly table: Int32Array;
  /** Probes each key took, by key. */
  readonly costs: readonly number[];
}

export function linear(homes: readonly number[], m: number): LinearTable {
  const table = new Int32Array(m).fill(EMPTY);
  const costs: number[] = [];
  homes.forEach((home, key) => {
    const placed = probe(table, home);
    if (!placed) throw new RangeError("The table is full.");
    table[placed.slot] = key;
    costs.push(placed.probes);
  });
  return { table, costs };
}

export const mean = (xs: readonly number[]): number =>
  xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;

/**
 * Knuth's estimates for linear probing under uniform hashing, as m grows
 * with α = n/m fixed: a successful search ½(1 + 1/(1 − α)), and an
 * unsuccessful one — which is what an insertion is — ½(1 + 1/(1 − α)²).
 */
export const linearSuccessTheory = (alpha: number): number => (1 + 1 / (1 - alpha)) / 2;
export const linearInsertTheory = (alpha: number): number => (1 + 1 / (1 - alpha) ** 2) / 2;

/** Runs of occupied slots, wrapping round the end: [start, length]. */
export function clusters(table: Int32Array): [number, number][] {
  const m = table.length;
  const full = table.every((v) => v !== EMPTY);
  if (full) return m ? [[0, m]] : [];
  // Start just after an empty slot so no run is split by the wrap.
  let start = 0;
  while (table[start] !== EMPTY) start++;
  const runs: [number, number][] = [];
  let run: [number, number] | null = null;
  for (let i = 1; i <= m; i++) {
    const slot = (start + i) % m;
    if (table[slot] !== EMPTY) {
      if (run) run[1]++;
      else run = [slot, 1];
    } else if (run) {
      runs.push(run);
      run = null;
    }
  }
  return runs.sort((a, b) => a[0] - b[0]);
}

// -------------------------------------------------------------- birthday --

/**
 * The chance that n keys, each in one of m equally likely buckets, are not
 * all in different ones: 1 − Π_{i<n} (1 − i/m).
 */
export function collisionChance(n: number, m: number): number {
  let none = 1;
  for (let i = 1; i < n; i++) {
    none *= 1 - i / m;
    if (none <= 0) return 1;
  }
  return 1 - none;
}

/** The fewest keys for which a shared bucket is at least as likely as not. */
export function evenOdds(m: number): number {
  let n = 1;
  while (collisionChance(n, m) < 0.5) n++;
  return n;
}

/** Keys thrown until one lands in a bucket already used: one trial. */
export function firstCollision(m: number, rng: () => number): number {
  const seen = new Uint8Array(m);
  for (let n = 1; ; n++) {
    const b = Math.floor(rng() * m);
    if (seen[b]) return n;
    seen[b] = 1;
  }
}

// --------------------------------------------------------------- resizing --

export interface GrowthStep {
  /** Work done by this insertion: 1 for the key, plus every key copied. */
  readonly cost: number;
  /** Capacity after it. */
  readonly capacity: number;
}

/**
 * Inserting keys one by one into a table that doubles when it passes its
 * load factor, as `HashMap` does by default (capacity 16, load 0.75):
 * the insertion that takes the size past capacity × load rebuilds the
 * table and copies every key already in it.
 *
 * (`HashMap` puts the new key in first and then rehashes all of them, one
 * key more per resize than this; the thresholds and the doubling are the
 * same.)
 *
 * The copies add up to less than twice the keys: each resize copies the
 * keys present, and those counts double from one resize to the next, so
 * their sum is under twice the last — and the last is at most n.
 */
export function grow(n: number, capacity = 16, load = 0.75): GrowthStep[] {
  const steps: GrowthStep[] = [];
  let cap = capacity;
  for (let size = 1; size <= n; size++) {
    let cost = 1;
    if (size > cap * load) {
      cost += size - 1;
      cap *= 2;
    }
    steps.push({ cost, capacity: cap });
  }
  return steps;
}
