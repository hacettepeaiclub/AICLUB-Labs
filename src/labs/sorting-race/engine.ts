/**
 * Selection sort and insertion sort, written as one steppable execution.
 *
 * Pure TypeScript — no React, no DOM, no randomness. The lab animates this
 * engine by calling `step()` repeatedly; nothing is precomputed and replayed.
 *
 * ## What the lab is trying to show
 *
 * These two were chosen because they sit at opposite ends of one axis:
 *
 * - **Selection sort is blind to the data.** It asks exactly `n(n−1)/2`
 *   questions whatever you hand it — sorted, reversed or shuffled. Best case,
 *   worst case and average case are the same number.
 * - **Insertion sort adapts to the data.** On an already-sorted array it asks
 *   `n−1` questions and moves nothing; on a reversed one it does as much work
 *   as selection sort. Its cost is a property of the *shape* of the input.
 *
 * ## Ownership of the input
 *
 * `createSort` copies the values it is given and never writes to the caller's
 * array. The lab needs that: the visitor draws one array, and the same drawing
 * feeds two independent sorts running side by side, plus every re-run after a
 * reset. A shared, mutated buffer would make all of that impossible.
 *
 * ## Note on `!`
 *
 * Every index below is bounded by `n` or by a cursor the state machine keeps
 * inside `[0, n)`, so all of them are provably in range. The assertions keep
 * `step()` free of redundant undefined checks — the same convention
 * `labs/pathfinding/engine.ts` and `labs/neural-playground/engine.ts` use.
 */

export type Algorithm = "selection" | "insertion";

/**
 * One observable operation. Exactly one is produced per `step()`; the engine
 * never performs several of these behind a single call.
 *
 * - `compare` — two values were compared. `a` and `b` are the indices.
 * - `swap`    — two elements exchanged places. Selection sort only.
 * - `pick`    — a value was lifted out of the array, ready to be inserted.
 *               Insertion sort only; `held` is the value, `heldFrom` its slot.
 * - `shift`   — a value moved one slot to the right. Insertion sort only.
 * - `place`   — the held value was written into its slot. Insertion sort only.
 * - `settle`  — the sorted prefix grew by one.
 * - `done`    — the array is sorted and nothing is left to do.
 */
export type SortEvent = "compare" | "swap" | "pick" | "shift" | "place" | "settle" | "done";

export type SortStatus = "running" | "done";

// Selection phases.
const SCAN = 0;
const SWAP = 1;
// Insertion phases.
const PICK = 10;
const COMPARE = 11;
const SHIFT = 12;
const PLACE = 13;
// Shared.
const SETTLE = 20;

export interface Sort {
  readonly algorithm: Algorithm;
  readonly n: number;
  /** The engine's own working copy — never the array the caller passed in. */
  readonly values: Int32Array;

  status: SortStatus;

  /** Element-to-element comparisons performed. */
  comparisons: number;
  /**
   * Writes that relocated a value. A selection swap counts once; an insertion
   * shift counts once; placing a held value back into the slot it came from is
   * not a relocation and does not count.
   */
  moves: number;

  /**
   * `values[0, sortedPrefix)` is in sorted order. For selection sort those
   * positions are also final; for insertion sort they can still be shifted
   * right by a later insertion.
   */
  sortedPrefix: number;

  /** Indices the last event touched, or −1 where it does not apply. */
  a: number;
  b: number;

  /** Insertion sort: the value currently lifted out, and the slot it came from. */
  held: number;
  /** −1 when nothing is being held. */
  heldFrom: number;

  /** `step()` calls so far. */
  steps: number;

  // --- internal cursors; not part of the public contract ---
  i: number;
  j: number;
  minIndex: number;
  phase: number;
}

/** True when the values are in non-decreasing order. */
export function isSorted(values: ArrayLike<number>): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i]! < values[i - 1]!) return false;
  }
  return true;
}

/**
 * Pairs that are out of order: `i < j` with `values[i] > values[j]`.
 *
 * This is the number insertion sort is really paying for — its shift count
 * equals it exactly — so it is the honest measure of how unsorted an array is.
 * Equal values are not an inversion. Counted in a plain `number`, which stays
 * exact far beyond the pair count of any array this lab will show.
 */
export function inversions(values: ArrayLike<number>): number {
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    const left = values[i]!;
    for (let j = i + 1; j < values.length; j++) {
      if (left > values[j]!) total++;
    }
  }
  return total;
}

/**
 * Start a sort. The values are copied into an `Int32Array`, so the caller's
 * array is left untouched and two sorts can share one drawing.
 */
export function createSort(values: ArrayLike<number>, algorithm: Algorithm): Sort {
  const copy = Int32Array.from(values);
  const n = copy.length;
  const insertion = algorithm === "insertion";

  return {
    algorithm,
    n,
    values: copy,
    // An array of nought or one element is already sorted; there is no work
    // to observe, so the sort is born finished — and a finished sort always
    // reports the whole array as its sorted prefix.
    status: n <= 1 ? "done" : "running",
    comparisons: 0,
    moves: 0,
    // Insertion sort starts with element 0 alone counting as sorted; selection
    // sort has settled nothing until its first pass ends.
    sortedPrefix: n <= 1 ? n : insertion ? 1 : 0,
    a: -1,
    b: -1,
    held: 0,
    heldFrom: -1,
    steps: 0,
    i: insertion ? 1 : 0,
    j: insertion ? 0 : 1,
    minIndex: 0,
    phase: insertion ? PICK : SCAN,
  };
}

/**
 * Selection sort.
 *
 * Each pass scans the whole of the unsorted remainder looking for the smallest
 * value, then swaps it into place. The scan is exhaustive whatever the data
 * looks like, which is why the comparison count never moves.
 */
function stepSelection(s: Sort): SortEvent {
  if (s.i >= s.n) {
    s.status = "done";
    s.a = -1;
    s.b = -1;
    return "done";
  }

  if (s.phase === SCAN) {
    if (s.j < s.n) {
      s.comparisons++;
      s.a = s.j;
      s.b = s.minIndex;
      if (s.values[s.j]! < s.values[s.minIndex]!) s.minIndex = s.j;
      s.j++;
      return "compare";
    }
    s.phase = SWAP;
  }

  if (s.phase === SWAP) {
    s.phase = SETTLE;
    if (s.minIndex !== s.i) {
      const tmp = s.values[s.i]!;
      s.values[s.i] = s.values[s.minIndex]!;
      s.values[s.minIndex] = tmp;
      s.moves++;
      s.a = s.i;
      s.b = s.minIndex;
      return "swap";
    }
  }

  // SETTLE — this position is now final.
  s.sortedPrefix = s.i + 1;
  s.a = s.i;
  s.b = -1;
  s.i++;
  s.j = s.i + 1;
  s.minIndex = s.i;
  s.phase = SCAN;
  return "settle";
}

/**
 * Insertion sort, shift-based rather than swap-based.
 *
 * The held value walks backwards only as far as it has to, which is what makes
 * the cost depend on the data: every shift it performs corresponds to exactly
 * one inversion in the original array.
 */
function stepInsertion(s: Sort): SortEvent {
  if (s.phase === PICK) {
    if (s.i >= s.n) {
      s.status = "done";
      s.a = -1;
      s.b = -1;
      return "done";
    }
    s.held = s.values[s.i]!;
    s.heldFrom = s.i;
    s.j = s.i - 1;
    s.a = s.i;
    s.b = -1;
    s.phase = COMPARE;
    return "pick";
  }

  if (s.phase === COMPARE) {
    if (s.j >= 0) {
      s.comparisons++;
      s.a = s.j;
      s.b = s.heldFrom;
      s.phase = s.values[s.j]! > s.held ? SHIFT : PLACE;
      return "compare";
    }
    // Ran off the front: nothing left to compare against, so place it.
    s.phase = PLACE;
  }

  if (s.phase === SHIFT) {
    s.values[s.j + 1] = s.values[s.j]!;
    s.moves++;
    s.a = s.j;
    s.b = s.j + 1;
    s.j--;
    s.phase = COMPARE;
    return "shift";
  }

  if (s.phase === PLACE) {
    const target = s.j + 1;
    // Writing a value back where it started moves nothing, so it is not a move.
    if (target !== s.heldFrom) {
      s.values[target] = s.held;
      s.moves++;
    }
    s.a = target;
    s.b = s.heldFrom;
    s.heldFrom = -1;
    s.phase = SETTLE;
    return "place";
  }

  // SETTLE — the sorted prefix has grown by one.
  s.sortedPrefix = s.i + 1;
  s.a = s.i;
  s.b = -1;
  s.i++;
  s.phase = PICK;
  return "settle";
}

/**
 * Advance the sort by exactly one observable operation.
 *
 * Calling `step()` on a finished sort is a no-op that repeats `"done"`.
 */
export function step(s: Sort): SortEvent {
  if (s.status === "done") return "done";
  s.steps++;
  return s.algorithm === "selection" ? stepSelection(s) : stepInsertion(s);
}

/**
 * Run to completion. Exactly equivalent to calling `step()` until it stops —
 * used for the reduced-motion path and for measuring fixtures.
 */
export function runToEnd(s: Sort): void {
  while (s.status === "running") step(s);
}

export interface SortResult {
  comparisons: number;
  moves: number;
  steps: number;
  values: Int32Array;
}

/** Run a sort and report only its measurements. */
export function sortAndMeasure(values: ArrayLike<number>, algorithm: Algorithm): SortResult {
  const s = createSort(values, algorithm);
  runToEnd(s);
  return { comparisons: s.comparisons, moves: s.moves, steps: s.steps, values: s.values };
}
