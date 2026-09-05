import { describe, expect, it } from "vitest";
import {
  createSort,
  inversions,
  isSorted,
  runToEnd,
  sortAndMeasure,
  step,
  type Algorithm,
  type Sort,
  type SortEvent,
} from "./engine";

const ALGORITHMS: Algorithm[] = ["selection", "insertion"];

// ------------------------------------------------------------- fixtures ----

const ramp = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1);
const reversed = (n: number): number[] => ramp(n).reverse();
const allEqual = (n: number, value = 7): number[] => new Array<number>(n).fill(value);

/** A fixed jumble — written out so every run of the suite sorts the same array. */
const JUMBLE = [23, 4, 91, 4, 17, 62, 8, 55, 31, 12, 77, 3, 46, 88, 19, 70];
const WITH_DUPLICATES = [5, 1, 5, 3, 1, 3, 5, 1];
const WITH_NEGATIVES = [-3, 7, -11, 0, 2, -3, 9, -20];
const NEAR_INT32 = [2147483647, -2147483648, 0, 2147483646, -2147483647];

const INPUTS: Record<string, number[]> = {
  jumble: JUMBLE,
  sorted: ramp(16),
  reversed: reversed(16),
  duplicates: WITH_DUPLICATES,
  allEqual: allEqual(10),
  negatives: WITH_NEGATIVES,
};

// --------------------------------------------------------------- helpers ----

/** Generous ceiling: any run that exceeds it has stopped making progress. */
const maxSteps = (n: number): number => n * n + 5 * n + 10;

/** Drive a sort to completion, collecting the event stream. Guards against hangs. */
function collect(values: ArrayLike<number>, algorithm: Algorithm) {
  const s = createSort(values, algorithm);
  const events: SortEvent[] = [];
  const limit = maxSteps(s.n);
  while (s.status === "running") {
    events.push(step(s));
    if (events.length > limit) throw new Error(`${algorithm} did not terminate within ${limit}`);
  }
  return { sort: s, events };
}

const count = (events: readonly SortEvent[], kind: SortEvent): number =>
  events.filter((e) => e === kind).length;

const multiset = (values: ArrayLike<number>): number[] => Array.from(values).sort((x, y) => x - y);

const observable = (s: Sort) => ({
  status: s.status,
  comparisons: s.comparisons,
  moves: s.moves,
  sortedPrefix: s.sortedPrefix,
  a: s.a,
  b: s.b,
  held: s.held,
  heldFrom: s.heldFrom,
  steps: s.steps,
  values: Array.from(s.values),
});

// ------------------------------------------------------------ inversions ----

describe("inversions", () => {
  it("counts pairs that are out of order", () => {
    expect(inversions([1, 2, 3, 4])).toBe(0);
    expect(inversions([4, 3, 2, 1])).toBe(6);
    expect(inversions([1, 3, 2, 4])).toBe(1);
    expect(inversions([2, 1])).toBe(1);
  });

  it("does not count equal values as out of order", () => {
    expect(inversions([5, 5, 5, 5])).toBe(0);
    expect(inversions([2, 1, 1])).toBe(2);
  });

  it("is zero exactly when the array is sorted", () => {
    for (const values of Object.values(INPUTS)) {
      expect(inversions(values) === 0).toBe(isSorted(values));
    }
  });

  it("peaks at n(n-1)/2 for a reversed array of distinct values", () => {
    for (const n of [2, 5, 16]) {
      expect(inversions(reversed(n))).toBe((n * (n - 1)) / 2);
    }
  });
});

// --------------------------------------------------------------- ownership ----

describe("input ownership", () => {
  it("never writes to the array it was given", () => {
    for (const algorithm of ALGORITHMS) {
      const input = [...JUMBLE];
      const before = [...input];
      const s = createSort(input, algorithm);
      runToEnd(s);
      expect(input).toEqual(before);
      expect(isSorted(s.values)).toBe(true);
    }
  });

  it("does not share a buffer when the caller passes a typed array", () => {
    const input = Int32Array.from(JUMBLE);
    const before = Array.from(input);
    const s = createSort(input, "insertion");
    runToEnd(s);
    expect(Array.from(input)).toEqual(before);
    expect(s.values).not.toBe(input);
  });

  it("lets two sorts share one drawing without interfering", () => {
    // This is the section-1 race: one array, two independent engines.
    const input = [...JUMBLE];
    const left = createSort(input, "selection");
    const right = createSort(input, "insertion");
    runToEnd(left);
    expect(right.comparisons).toBe(0);
    expect(right.status).toBe("running");
    runToEnd(right);
    expect(Array.from(left.values)).toEqual(Array.from(right.values));
    expect(input).toEqual(JUMBLE);
  });
});

// ------------------------------------------------------------- correctness ----

describe("sorting correctness", () => {
  it("sorts every fixture with both algorithms", () => {
    for (const [name, values] of Object.entries(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const { sort } = collect(values, algorithm);
        expect(isSorted(sort.values), `${algorithm} on ${name}`).toBe(true);
        expect(sort.status).toBe("done");
      }
    }
  });

  it("returns a permutation of the input, duplicates and all", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const { sort } = collect(values, algorithm);
        expect(multiset(sort.values)).toEqual(multiset(values));
      }
    }
  });

  it("agrees with a plain numeric sort", () => {
    for (const values of Object.values(INPUTS)) {
      const expected = [...values].sort((x, y) => x - y);
      for (const algorithm of ALGORITHMS) {
        expect(Array.from(sortAndMeasure(values, algorithm).values)).toEqual(expected);
      }
    }
  });

  it("handles values at the edges of the 32-bit range", () => {
    for (const algorithm of ALGORITHMS) {
      const result = sortAndMeasure(NEAR_INT32, algorithm);
      expect(Array.from(result.values)).toEqual([...NEAR_INT32].sort((x, y) => x - y));
    }
  });

  it("finishes the whole prefix", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const { sort } = collect(values, algorithm);
        expect(sort.sortedPrefix).toBe(sort.n);
      }
    }
  });
});

// ------------------------------------------------------------- edge cases ----

describe("edge cases", () => {
  it("treats an empty array as already done", () => {
    for (const algorithm of ALGORITHMS) {
      const s = createSort([], algorithm);
      expect(s.status).toBe("done");
      expect(step(s)).toBe("done");
      expect(s.comparisons).toBe(0);
      expect(s.moves).toBe(0);
      expect(s.steps).toBe(0);
    }
  });

  it("treats a single element as already done", () => {
    for (const algorithm of ALGORITHMS) {
      const s = createSort([42], algorithm);
      expect(s.status).toBe("done");
      expect(s.sortedPrefix).toBe(1);
      expect(Array.from(s.values)).toEqual([42]);
    }
  });

  it("sorts two elements either way round", () => {
    for (const algorithm of ALGORITHMS) {
      expect(Array.from(sortAndMeasure([2, 1], algorithm).values)).toEqual([1, 2]);
      expect(Array.from(sortAndMeasure([1, 2], algorithm).values)).toEqual([1, 2]);
    }
  });

  it("leaves an all-equal array alone", () => {
    for (const algorithm of ALGORITHMS) {
      const result = sortAndMeasure(allEqual(8), algorithm);
      expect(Array.from(result.values)).toEqual(allEqual(8));
      // Nothing is out of order, so nothing needs to be relocated.
      expect(result.moves).toBe(0);
    }
  });

  it("is a no-op once finished, however many times it is called", () => {
    const s = createSort(JUMBLE, "insertion");
    runToEnd(s);
    const before = observable(s);
    expect(step(s)).toBe("done");
    expect(step(s)).toBe("done");
    expect(observable(s)).toEqual(before);
  });
});

// --------------------------------------------------------------- selection ----

describe("selection sort — blind to the data", () => {
  it("asks exactly n(n-1)/2 questions, whatever shape the data is in", () => {
    // The claim the whole lab rests on. If this ever stops holding, the
    // lesson in section 3 is no longer true.
    for (const n of [2, 5, 16, 32]) {
      const expected = (n * (n - 1)) / 2;
      const shapes = [ramp(n), reversed(n), allEqual(n), ramp(n).map((v) => (v * 37) % n)];
      for (const values of shapes) {
        expect(sortAndMeasure(values, "selection").comparisons).toBe(expected);
      }
    }
  });

  it("asks 496 questions on the 32-element array the lab shows", () => {
    expect(sortAndMeasure(ramp(32), "selection").comparisons).toBe(496);
    expect(sortAndMeasure(reversed(32), "selection").comparisons).toBe(496);
  });

  it("relocates at most n-1 values", () => {
    for (const values of Object.values(INPUTS)) {
      const result = sortAndMeasure(values, "selection");
      expect(result.moves).toBeLessThanOrEqual(values.length - 1);
    }
  });

  it("moves nothing when the array is already sorted", () => {
    expect(sortAndMeasure(ramp(16), "selection").moves).toBe(0);
  });

  it("really scans: a pass is a run of comparisons ending in a swap", () => {
    const { events } = collect([3, 1, 2], "selection");
    expect(events).toEqual([
      "compare", // 1 against 3 -> new minimum
      "compare", // 2 against 1 -> no change
      "swap", // 1 into place
      "settle",
      "compare", // 2 against 3 -> new minimum
      "swap", // 2 into place
      "settle",
      "settle", // the last element is trivially in place
      "done",
    ]);
  });

  it("skips the swap when the smallest value is already in place", () => {
    const { events } = collect([1, 2], "selection");
    expect(events).toEqual(["compare", "settle", "settle", "done"]);
    expect(count(events, "swap")).toBe(0);
  });
});

// --------------------------------------------------------------- insertion ----

describe("insertion sort — adaptive to the data", () => {
  it("shifts exactly as many times as the input has inversions", () => {
    // The second claim the lab rests on: the cost is the disorder, measured
    // against an independent count of out-of-order pairs.
    for (const [name, values] of Object.entries(INPUTS)) {
      const { events } = collect(values, "insertion");
      expect(count(events, "shift"), name).toBe(inversions(values));
    }
  });

  it("shifts nothing on sorted input and n(n-1)/2 times on reversed input", () => {
    for (const n of [2, 5, 16]) {
      expect(count(collect(ramp(n), "insertion").events, "shift")).toBe(0);
      expect(count(collect(reversed(n), "insertion").events, "shift")).toBe((n * (n - 1)) / 2);
    }
  });

  it("asks only n-1 questions when the array is already sorted", () => {
    for (const n of [2, 5, 16, 32]) {
      expect(sortAndMeasure(ramp(n), "insertion").comparisons).toBe(n - 1);
    }
  });

  it("collapses from 496 questions to 31 when the data is sorted", () => {
    // Side by side, this is the section-3 aha as two numbers.
    const n = 32;
    expect(sortAndMeasure(reversed(n), "insertion").comparisons).toBe(496);
    expect(sortAndMeasure(ramp(n), "insertion").comparisons).toBe(31);
    expect(sortAndMeasure(ramp(n), "selection").comparisons).toBe(496);
  });

  it("really walks backwards: compare, shift, compare, place", () => {
    const { events } = collect([3, 1, 2], "insertion");
    expect(events).toEqual([
      "pick", // lift 1 out
      "compare", // 3 > 1
      "shift", // 3 moves right
      "place", // 1 lands at the front
      "settle",
      "pick", // lift 2 out
      "compare", // 3 > 2
      "shift", // 3 moves right
      "compare", // 1 > 2? no — stop
      "place", // 2 lands
      "settle",
      "done",
    ]);
  });

  it("stops after one question per element when there is nothing to do", () => {
    const { events } = collect([1, 2, 3], "insertion");
    expect(events).toEqual([
      "pick",
      "compare",
      "place",
      "settle",
      "pick",
      "compare",
      "place",
      "settle",
      "done",
    ]);
    expect(count(events, "shift")).toBe(0);
  });

  it("does not count placing a value back where it started as a move", () => {
    // Sorted input: every element is placed into its own slot, so nothing
    // is relocated and the counter has to stay at zero.
    const result = sortAndMeasure(ramp(16), "insertion");
    expect(result.moves).toBe(0);
    expect(result.comparisons).toBe(15);
  });

  it("holds exactly one value at a time, and lets go of it", () => {
    const s = createSort(JUMBLE, "insertion");
    while (s.status === "running") {
      const event = step(s);
      if (event === "pick") expect(s.heldFrom).toBeGreaterThanOrEqual(0);
      if (event === "place") expect(s.heldFrom).toBe(-1);
    }
    expect(s.heldFrom).toBe(-1);
  });
});

// ---------------------------------------------------- the pedagogical trade ----

describe("the trade the challenge is built on", () => {
  it("lets each algorithm win on a different counter", () => {
    // Section 5's second challenge depends on this: on shuffled data the
    // adaptive algorithm asks fewer questions while the blind one relocates
    // far fewer values. "Less work" depends on which work you count.
    const selection = sortAndMeasure(JUMBLE, "selection");
    const insertion = sortAndMeasure(JUMBLE, "insertion");

    expect(insertion.comparisons).toBeLessThan(selection.comparisons);
    expect(selection.moves).toBeLessThan(insertion.moves);
  });

  it("keeps that trade at the size the lab actually shows", () => {
    const shuffled = ramp(32).map((v) => (v * 17 + 5) % 32);
    const selection = sortAndMeasure(shuffled, "selection");
    const insertion = sortAndMeasure(shuffled, "insertion");
    expect(insertion.comparisons).toBeLessThan(selection.comparisons);
    expect(selection.moves).toBeLessThanOrEqual(31);
    expect(insertion.moves).toBeGreaterThan(selection.moves * 3);
  });
});

// ------------------------------------------------------------- invariants ----

describe("invariants", () => {
  it("keeps the values a permutation of the input, counting the one in the air", () => {
    // Shift-based insertion sort deliberately breaks the array for a moment:
    // while a value is held, the slot it will land in still carries a stale
    // copy of its neighbour. Put the held value back into that slot and the
    // array is a permutation again — at every single step, for both sorts.
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const expected = multiset(values);
        const s = createSort(values, algorithm);
        let guard = 0;
        while (s.status === "running") {
          step(s);
          const live = Array.from(s.values);
          if (s.heldFrom !== -1) live[s.j + 1] = s.held;
          expect(multiset(live)).toEqual(expected);
          if (++guard > maxSteps(s.n)) throw new Error("did not terminate");
        }
      }
    }
  });

  it("is a permutation on its own whenever nothing is in the air", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const expected = multiset(values);
        const s = createSort(values, algorithm);
        while (s.status === "running") {
          step(s);
          if (s.heldFrom === -1) expect(multiset(s.values)).toEqual(expected);
        }
      }
    }
  });

  it("never lets the sorted prefix shrink, or run past the end", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const s = createSort(values, algorithm);
        let previous = s.sortedPrefix;
        while (s.status === "running") {
          step(s);
          expect(s.sortedPrefix).toBeGreaterThanOrEqual(previous);
          expect(s.sortedPrefix).toBeLessThanOrEqual(s.n);
          previous = s.sortedPrefix;
        }
      }
    }
  });

  it("keeps the sorted prefix genuinely sorted while it runs", () => {
    for (const algorithm of ALGORITHMS) {
      const s = createSort(JUMBLE, algorithm);
      while (s.status === "running") {
        step(s);
        // Mid-insertion the prefix is briefly opened up to make room, so only
        // check it when no value is in the air.
        if (s.heldFrom === -1) {
          expect(isSorted(s.values.subarray(0, s.sortedPrefix))).toBe(true);
        }
      }
    }
  });

  it("only ever reports indices inside the array", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const s = createSort(values, algorithm);
        while (s.status === "running") {
          step(s);
          for (const index of [s.a, s.b, s.heldFrom]) {
            expect(index).toBeGreaterThanOrEqual(-1);
            expect(index).toBeLessThan(s.n);
          }
        }
      }
    }
  });

  it("counts one step per call and ends on done", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const { sort, events } = collect(values, algorithm);
        expect(sort.steps).toBe(events.length);
        expect(events[events.length - 1]).toBe("done");
        expect(count(events, "done")).toBe(1);
      }
    }
  });

  it("terminates well inside a quadratic budget", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const { sort } = collect(values, algorithm);
        expect(sort.steps).toBeLessThanOrEqual(maxSteps(values.length));
      }
    }
  });
});

// ------------------------------------------------------------ determinism ----

describe("determinism and step/run equivalence", () => {
  it("produces the same event stream every time", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        expect(collect(values, algorithm).events).toEqual(collect(values, algorithm).events);
      }
    }
  });

  it("reaches the same observable state by stepping as by running", () => {
    for (const values of Object.values(INPUTS)) {
      for (const algorithm of ALGORITHMS) {
        const stepped = createSort(values, algorithm);
        while (stepped.status === "running") step(stepped);

        const straight = createSort(values, algorithm);
        runToEnd(straight);

        expect(observable(straight)).toEqual(observable(stepped));
      }
    }
  });

  it("gives the same answer whichever algorithm asks", () => {
    for (const values of Object.values(INPUTS)) {
      const selection = sortAndMeasure(values, "selection");
      const insertion = sortAndMeasure(values, "insertion");
      expect(Array.from(selection.values)).toEqual(Array.from(insertion.values));
    }
  });
});
