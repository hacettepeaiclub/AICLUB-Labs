/**
 * The balance: sorting by weighing, played against information.
 *
 * Pure TypeScript, no React. Randomness (the hidden weights) comes in through
 * an `rng` argument.
 *
 * ## The game
 *
 * A row of boxes that look alike, each a different weight. The only way to
 * learn anything is to put two on a balance and see which side goes down.
 * The visitor weighs pairs until the order of every box is known, and the
 * score is how many weighings it took.
 *
 * ## What it is for
 *
 * The lab's other sections count comparisons that algorithms make. This one
 * hands the comparisons to the visitor and shows what each one is worth.
 * Before the first weighing every one of the n! orders is possible; a
 * weighing keeps only the orders that agree with it. The game counts those
 * orders exactly, every turn, so a good weighing visibly halves the count and
 * a careless one that repeats what is already known leaves it untouched.
 *
 * A lucky visitor can finish early, because an answer may happen to fall on
 * the smaller side. What nobody can do is guarantee it: a balance that always
 * gives the answer keeping more orders alive — `stubbornAnswer`, the third
 * level — holds every strategy to at least ⌈log₂(n!)⌉ weighings, since each
 * one then removes at most half. That is the theorem behind "comparison sorts
 * need Ω(n log n)", felt as a number that will not shrink fast enough.
 *
 * ## Counting the orders
 *
 * By brute force, honestly: every permutation of the boxes is kept as the
 * rank each box has in it, and a weighing filters the list. Eight boxes is
 * 40,320 permutations, small enough to filter on every tap.
 */

// ------------------------------------------------------------------ setup ---

export type Rng = () => number;

export interface LevelSpec {
  readonly id: "five" | "eight" | "stubborn";
  readonly boxes: number;
  /** The balance picks its answers to keep the most orders alive. */
  readonly stubborn: boolean;
}

export const LEVELS: readonly LevelSpec[] = [
  { id: "five", boxes: 5, stubborn: false },
  { id: "eight", boxes: 8, stubborn: false },
  { id: "stubborn", boxes: 8, stubborn: true },
];

/**
 * Every permutation of n boxes, flattened: entry p·n + b is the rank of box b
 * in permutation p, 0 for the lightest. Heap's algorithm, iteratively.
 */
export function allRankings(n: number): Uint8Array {
  const items = Array.from({ length: n }, (_, i) => i);
  const out: number[] = [];
  const push = () => {
    // items[r] is the box at rank r, so invert it to rank-by-box.
    const ranks = new Array<number>(n);
    items.forEach((box, rank) => (ranks[box] = rank));
    out.push(...ranks);
  };
  const c = new Array<number>(n).fill(0);
  push();
  let i = 1;
  while (i < n) {
    if ((c[i] ?? 0) < i) {
      const j = i % 2 === 0 ? 0 : (c[i] ?? 0);
      const a = items[j] ?? 0;
      items[j] = items[i] ?? 0;
      items[i] = a;
      push();
      c[i] = (c[i] ?? 0) + 1;
      i = 1;
    } else {
      c[i] = 0;
      i++;
    }
  }
  return Uint8Array.from(out);
}

export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** The fewest weighings that can guarantee the order: ⌈log₂(n!)⌉. */
export const lowerBound = (n: number): number => Math.ceil(Math.log2(factorial(n)));

/** Hidden weights: a random ranking of the boxes, 0 the lightest. */
export function hiddenRanks(n: number, rng: Rng): number[] {
  const ranks = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = ranks[i] ?? 0;
    ranks[i] = ranks[j] ?? 0;
    ranks[j] = t;
  }
  return ranks;
}

// ------------------------------------------------------------------ state ---

export interface Weighing {
  /** The box on the left pan and the one on the right. */
  readonly left: number;
  readonly right: number;
  /** True when the left pan went down. */
  readonly leftHeavier: boolean;
  /** Orders still possible before and after. */
  readonly before: number;
  readonly after: number;
}

export interface Board {
  readonly n: number;
  /** The truth, which the visitor never sees until the end. */
  readonly ranks: readonly number[];
  /** Every ranking, flattened as in `allRankings`. Shared, never mutated. */
  readonly rankings: Uint8Array;
  /** Indices into `rankings` of the orders that agree with every weighing. */
  readonly alive: Uint32Array;
  readonly history: readonly Weighing[];
}

const rankingsCache = new Map<number, Uint8Array>();

function rankingsFor(n: number): Uint8Array {
  let r = rankingsCache.get(n);
  if (!r) {
    r = allRankings(n);
    rankingsCache.set(n, r);
  }
  return r;
}

export function newBoard(n: number, ranks: readonly number[]): Board {
  const rankings = rankingsFor(n);
  const total = rankings.length / n;
  const alive = new Uint32Array(total);
  for (let p = 0; p < total; p++) alive[p] = p;
  return { n, ranks, rankings, alive, history: [] };
}

/** How many of the live orders put `heavy` above `light`. */
export function countHeavier(board: Board, heavy: number, light: number): number {
  const { n, rankings, alive } = board;
  let count = 0;
  for (let k = 0; k < alive.length; k++) {
    const base = (alive[k] ?? 0) * n;
    if ((rankings[base + heavy] ?? 0) > (rankings[base + light] ?? 0)) count++;
  }
  return count;
}

/** The truthful answer, from the hidden ranks. */
export const trueAnswer = (board: Board, left: number, right: number): boolean =>
  (board.ranks[left] ?? 0) > (board.ranks[right] ?? 0);

/**
 * The stubborn balance's answer: whichever keeps more orders alive, the left
 * pan on a tie. It never lies, since the answer it gives is true of every
 * order it keeps; it only decides which of the still-possible worlds is the
 * real one as late as it can.
 */
export const stubbornAnswer = (board: Board, left: number, right: number): boolean =>
  countHeavier(board, left, right) * 2 >= board.alive.length;

/**
 * Put two boxes on the balance. The answer is `answer` if given, otherwise
 * the truth from the hidden ranks.
 */
export function weigh(board: Board, left: number, right: number, answer?: boolean): Board {
  if (left === right) return board;
  const leftHeavier = answer ?? trueAnswer(board, left, right);
  const { n, rankings, alive } = board;
  const kept: number[] = [];
  for (let k = 0; k < alive.length; k++) {
    const p = alive[k] ?? 0;
    const l = rankings[p * n + left] ?? 0;
    const r = rankings[p * n + right] ?? 0;
    if (l > r === leftHeavier) kept.push(p);
  }
  const next = Uint32Array.from(kept);
  return {
    ...board,
    alive: next,
    history: [
      ...board.history,
      { left, right, leftHeavier, before: alive.length, after: next.length },
    ],
  };
}

export const remaining = (board: Board): number => board.alive.length;

export const isSolved = (board: Board): boolean => board.alive.length === 1;

/** Whether the balance can still say anything new about this pair. */
export const isKnown = (board: Board, a: number, b: number): boolean => {
  const heavier = countHeavier(board, a, b);
  return heavier === 0 || heavier === board.alive.length;
};

/**
 * Boxes ordered by what is known so far: by the fewest live orders in which
 * each is heavier than the others, so a box proven lightest sits first. When
 * the board is solved this is exactly the true order.
 */
export function knownOrder(board: Board): number[] {
  const { n, rankings, alive } = board;
  const meanRank = new Array<number>(n).fill(0);
  for (let k = 0; k < alive.length; k++) {
    const base = (alive[k] ?? 0) * n;
    for (let b = 0; b < n; b++) meanRank[b] = (meanRank[b] ?? 0) + (rankings[base + b] ?? 0);
  }
  return Array.from({ length: n }, (_, b) => b).sort(
    (a, b) => (meanRank[a] ?? 0) - (meanRank[b] ?? 0) || a - b,
  );
}

// ------------------------------------------------------------- the rival ---

/**
 * The pair whose answer, whichever it is, leaves the fewest orders in the
 * worse case. Ties go to the first pair found, so the rival is deterministic.
 */
export function bestPair(board: Board): [number, number] | null {
  let best: [number, number] | null = null;
  let bestWorst = Infinity;
  for (let a = 0; a < board.n; a++) {
    for (let b = a + 1; b < board.n; b++) {
      const heavier = countHeavier(board, a, b);
      const worst = Math.max(heavier, board.alive.length - heavier);
      if (worst < bestWorst) {
        bestWorst = worst;
        best = [a, b];
      }
    }
  }
  return bestWorst < board.alive.length ? best : null;
}

/**
 * How many weighings the halving rival needs on these hidden weights: each
 * turn it weighs the pair that splits the live orders most evenly. It is not
 * the optimal strategy in every case, but it is what "make every weighing
 * count" looks like, and it usually lands on the lower bound or one above.
 */
export function rivalWeighings(n: number, ranks: readonly number[]): number {
  let board = newBoard(n, ranks);
  let count = 0;
  while (!isSolved(board)) {
    const pair = bestPair(board);
    if (!pair) break;
    board = weigh(board, pair[0], pair[1]);
    count++;
  }
  return count;
}

/** Bits a weighing was worth: log₂ of how much it shrank the live orders. */
export const bitsOf = (w: Weighing): number => Math.log2(w.before / Math.max(1, w.after));
