/**
 * The cache this lab draws, and the access orders it runs through it.
 *
 * ## The model, and what it leaves out
 *
 * Memory is a row of numbers, and the cache holds a few *lines* of it: runs
 * of `lineSize` neighbouring numbers that always travel together. Reading a
 * number whose line is already held is a hit. Anything else is a miss, which
 * brings the whole line in and, when the cache is full, pushes out the line
 * used least recently.
 *
 * That is a fully associative cache with LRU replacement — the textbook model
 * and deliberately the simplest one that shows the lab's single idea. A real
 * CPU has several levels, sets with limited associativity, approximate LRU
 * and a prefetcher that guesses the next line before it is asked for. None of
 * that is modelled, and the lab never presents the model's counts as a
 * prediction of a real machine's times: those are measured, separately, on
 * the visitor's own processor (see `bench.ts`), and set beside the model so
 * that both can be judged.
 *
 * ## Units
 *
 * An address is the index of a number, not a byte. With 8-byte doubles a line
 * of 8 numbers is the 64-byte line almost every current CPU uses.
 *
 * Everything here is pure and allocation-light; nothing imports React.
 */

export interface CacheConfig {
  /** Numbers per line. */
  readonly lineSize: number;
  /** Lines the cache holds. */
  readonly lines: number;
}

export interface Step {
  /** The number read. */
  readonly address: number;
  /** The line it lives in. */
  readonly line: number;
  readonly hit: boolean;
  /** The line pushed out to make room, if any. */
  readonly evicted: number | null;
}

export interface Run {
  readonly steps: readonly Step[];
  readonly hits: number;
  readonly misses: number;
  /**
   * The lines held after each step, most recently used first — what a
   * scrubbed view draws at that moment. Only kept when asked for: a long run
   * through a big array has no use for a million snapshots.
   */
  readonly held: readonly (readonly number[])[];
}

export const lineOf = (address: number, lineSize: number): number => Math.floor(address / lineSize);

/**
 * Run a sequence of reads through an LRU cache that starts empty.
 *
 * `keepHeld` records the cache's contents after every step, for views that
 * scrub through a short run.
 */
export function simulate(addresses: ArrayLike<number>, config: CacheConfig, keepHeld = false): Run {
  const { lineSize, lines } = config;
  if (!(lineSize >= 1 && lines >= 1)) throw new RangeError("A cache needs lines of at least 1.");
  // Most recently used first. Caches here are a handful of lines, so a small
  // array beats a linked map for both speed and clarity.
  const lru: number[] = [];
  const steps: Step[] = [];
  const held: number[][] = [];
  let hits = 0;
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i] ?? 0;
    const line = lineOf(address, lineSize);
    const at = lru.indexOf(line);
    let evicted: number | null = null;
    if (at >= 0) {
      hits++;
      lru.splice(at, 1);
    } else if (lru.length === lines) {
      evicted = lru.pop() ?? null;
    }
    lru.unshift(line);
    steps.push({ address, line, hit: at >= 0, evicted });
    if (keepHeld) held.push(lru.slice());
  }
  return { steps, hits, misses: addresses.length - hits, held };
}

/** Miss count only, without keeping a record per step — for long runs. */
export function countMisses(addresses: ArrayLike<number>, config: CacheConfig): number {
  const { lineSize, lines } = config;
  const lru: number[] = [];
  let misses = 0;
  for (let i = 0; i < addresses.length; i++) {
    const line = lineOf(addresses[i] ?? 0, lineSize);
    const at = lru.indexOf(line);
    if (at >= 0) lru.splice(at, 1);
    else {
      misses++;
      if (lru.length === lines) lru.pop();
    }
    lru.unshift(line);
  }
  return misses;
}

// ------------------------------------------------------------- orders ----

/** A `rows × cols` grid stored row after row, read row after row. */
export function rowOrder(rows: number, cols: number): number[] {
  const out: number[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(r * cols + c);
  return out;
}

/** The same grid, the same numbers, read column after column. */
export function columnOrder(rows: number, cols: number): number[] {
  const out: number[] = [];
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) out.push(r * cols + c);
  return out;
}

/**
 * Every number in `0..n-1` exactly once, taken `stride` apart: first 0, s,
 * 2s…, then 1, s+1… Same work for any stride; only the order changes.
 */
export function strideOrder(n: number, stride: number): number[] {
  const out: number[] = [];
  for (let start = 0; start < stride; start++) {
    for (let i = start; i < n; i += stride) out.push(i);
  }
  return out;
}

// ---------------------------------------------------------- loop order ----

/** The six ways to nest the three loops of a matrix product. */
export const LOOP_ORDERS = ["ijk", "ikj", "jik", "jki", "kij", "kji"] as const;
export type LoopOrder = (typeof LOOP_ORDERS)[number];

export type Matrix = "A" | "B" | "C";

/**
 * Where each matrix is read from in `C[i][j] += A[i][k] · B[k][j]`, as one
 * address space: A, then B, then C, each `n × n`, each stored row after row.
 */
const base: Record<Matrix, (n: number) => number> = {
  A: () => 0,
  B: (n) => n * n,
  C: (n) => 2 * n * n,
};

/**
 * The reads of an `n × n` matrix product with its loops nested in `order`,
 * three per innermost step — A, B, then C — tagged with the matrix each came
 * from.
 */
export function productReads(
  order: LoopOrder,
  n: number,
): { addresses: number[]; matrices: Matrix[] } {
  const addresses: number[] = [];
  const matrices: Matrix[] = [];
  const idx = { i: 0, j: 0, k: 0 };
  const [outer, middle, inner] = order.split("") as ("i" | "j" | "k")[];
  for (let a = 0; a < n; a++) {
    idx[outer!] = a;
    for (let b = 0; b < n; b++) {
      idx[middle!] = b;
      for (let c = 0; c < n; c++) {
        idx[inner!] = c;
        const { i, j, k } = idx;
        addresses.push(base.A(n) + i * n + k, base.B(n) + k * n + j, base.C(n) + i * n + j);
        matrices.push("A", "B", "C");
      }
    }
  }
  return { addresses, matrices };
}

export interface ProductMisses {
  readonly order: LoopOrder;
  /** Misses per innermost step, for each matrix and in total. */
  readonly perStep: Readonly<Record<Matrix, number>> & { readonly total: number };
}

/** How each loop order fares in the model cache. */
export function productMisses(order: LoopOrder, n: number, config: CacheConfig): ProductMisses {
  const { addresses, matrices } = productReads(order, n);
  const run = simulate(addresses, config);
  const count: Record<Matrix, number> = { A: 0, B: 0, C: 0 };
  run.steps.forEach((step, s) => {
    if (!step.hit) count[matrices[s]!]++;
  });
  const steps = n * n * n;
  return {
    order,
    perStep: {
      A: count.A / steps,
      B: count.B / steps,
      C: count.C / steps,
      total: run.misses / steps,
    },
  };
}

/**
 * How the innermost loop walks a matrix: not at all (its index is not the
 * inner one), along a row (neighbours, one line every `lineSize` steps), or
 * down a column (a whole row apart every step).
 */
export type Walk = "still" | "row" | "column";

export function innerWalk(order: LoopOrder, matrix: Matrix): Walk {
  const inner = order[2];
  // A[i][k], B[k][j], C[i][j]: [row index, column index].
  const [rowIndex, colIndex] = { A: ["i", "k"], B: ["k", "j"], C: ["i", "j"] }[matrix];
  if (inner === colIndex) return "row";
  if (inner === rowIndex) return "column";
  return "still";
}
