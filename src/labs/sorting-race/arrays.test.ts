import { describe, expect, it } from "vitest";
import {
  buildPreset,
  cloneValues,
  MAX_VALUE,
  MIN_VALUE,
  PRESETS,
  SELECTION_COMPARISONS,
  SIZE,
  type PresetId,
} from "./arrays";
import {
  adjustValue,
  clampValue,
  editCount,
  indexAt,
  isCursorKey,
  moveCursor,
  setValue,
  strokeTo,
  valueAt,
} from "./arrayEdit";
import { inversions, isSorted, sortAndMeasure } from "./engine";

const IDS = PRESETS.map((p) => p.id);

describe("presets", () => {
  it("are rebuilt identically every time — reset has to be deterministic", () => {
    for (const id of IDS) {
      expect(Array.from(buildPreset(id))).toEqual(Array.from(buildPreset(id)));
    }
  });

  it("are all the same size, and always a permutation of the same values", () => {
    const expected = Array.from({ length: SIZE }, (_, i) => i + MIN_VALUE);
    for (const id of IDS) {
      const values = buildPreset(id);
      expect(values).toHaveLength(SIZE);
      expect(Array.from(values).sort((a, b) => a - b)).toEqual(expected);
    }
  });

  it("stay inside the drawable range", () => {
    for (const id of IDS) {
      for (const value of buildPreset(id)) {
        expect(value).toBeGreaterThanOrEqual(MIN_VALUE);
        expect(value).toBeLessThanOrEqual(MAX_VALUE);
      }
    }
  });

  it("have the shapes their names promise", () => {
    expect(isSorted(buildPreset("sorted"))).toBe(true);
    expect(inversions(buildPreset("sorted"))).toBe(0);
    expect(inversions(buildPreset("reversed"))).toBe((SIZE * (SIZE - 1)) / 2);
    // "Almost sorted" has to be genuinely almost sorted, not merely unsorted.
    const almost = inversions(buildPreset("almost"));
    expect(almost).toBeGreaterThan(0);
    expect(almost).toBeLessThan(SIZE);
    expect(inversions(buildPreset("random"))).toBeGreaterThan(SIZE * 4);
  });

  it("gives section 1 a shape where the adaptive sort plainly does less", () => {
    // The race is only worth watching on a shape like this. Phase 1 found that
    // a shuffled array would have made the adaptive one finish *last*.
    const values = buildPreset("almost");
    const selection = sortAndMeasure(values, "selection");
    const insertion = sortAndMeasure(values, "insertion");
    expect(insertion.comparisons * 5).toBeLessThan(selection.comparisons);
    expect(insertion.steps * 3).toBeLessThan(selection.steps);
  });

  it("keeps selection sort pinned to its constant on every shape", () => {
    for (const id of IDS) {
      expect(sortAndMeasure(buildPreset(id), "selection").comparisons).toBe(SELECTION_COMPARISONS);
    }
    expect(SELECTION_COMPARISONS).toBe(496);
  });

  it("copies rather than aliases", () => {
    const values = buildPreset("sorted");
    const copy = cloneValues(values);
    copy[0] = 99;
    expect(values[0]).not.toBe(copy[0]);
  });
});

describe("pointer mapping", () => {
  const width = 320;
  const height = 200;

  it("maps x across the chart to every bar exactly once", () => {
    const seen = new Set<number>();
    for (let x = 0; x < width; x++) seen.add(indexAt(x, width, SIZE));
    expect(seen.has(-1)).toBe(false);
    expect(seen.size).toBe(SIZE);
  });

  it("returns -1 outside the chart", () => {
    expect(indexAt(-1, width, SIZE)).toBe(-1);
    expect(indexAt(width, width, SIZE)).toBe(-1);
    expect(indexAt(0, 0, SIZE)).toBe(-1);
  });

  it("maps the top of the chart to the largest value and the bottom to the smallest", () => {
    expect(valueAt(0, height)).toBe(MAX_VALUE);
    expect(valueAt(height, height)).toBe(MIN_VALUE);
    expect(valueAt(height / 2, height)).toBeGreaterThan(MIN_VALUE);
    expect(valueAt(height / 2, height)).toBeLessThan(MAX_VALUE);
  });

  it("clamps a sweep that strays off the chart instead of refusing it", () => {
    expect(valueAt(-500, height)).toBe(MAX_VALUE);
    expect(valueAt(height + 500, height)).toBe(MIN_VALUE);
  });

  it("never produces a value outside the range, or a NaN", () => {
    for (let y = -50; y <= height + 50; y += 7) {
      const value = valueAt(y, height);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(MIN_VALUE);
      expect(value).toBeLessThanOrEqual(MAX_VALUE);
    }
    expect(clampValue(Number.NaN)).toBe(MIN_VALUE);
  });
});

describe("editing", () => {
  it("writes a bar and reports whether anything changed", () => {
    const values = buildPreset("sorted");
    expect(setValue(values, 5, 20)).toBe(true);
    expect(values[5]).toBe(20);
    // A drag passes over the same bar many times; only real changes count.
    expect(setValue(values, 5, 20)).toBe(false);
  });

  it("clamps rather than writing out-of-range values", () => {
    const values = buildPreset("sorted");
    setValue(values, 0, 9999);
    expect(values[0]).toBe(MAX_VALUE);
    setValue(values, 1, -9999);
    expect(values[1]).toBe(MIN_VALUE);
  });

  it("refuses to write outside the array", () => {
    const values = buildPreset("sorted");
    const before = Array.from(values);
    expect(setValue(values, -1, 5)).toBe(false);
    expect(setValue(values, SIZE, 5)).toBe(false);
    expect(setValue(values, 1.5, 5)).toBe(false);
    expect(Array.from(values)).toEqual(before);
  });

  it("nudges a value up and down, stopping at the ends", () => {
    const values = buildPreset("sorted");
    setValue(values, 3, MAX_VALUE);
    expect(adjustValue(values, 3, 1)).toBe(false);
    expect(adjustValue(values, 3, -1)).toBe(true);
    expect(values[3]).toBe(MAX_VALUE - 1);

    setValue(values, 4, MIN_VALUE);
    expect(adjustValue(values, 4, -1)).toBe(false);
  });

  it("counts how many bars differ from a reference", () => {
    const reference = buildPreset("sorted");
    const values = cloneValues(reference);
    expect(editCount(values, reference)).toBe(0);
    setValue(values, 2, 30);
    setValue(values, 7, 1);
    expect(editCount(values, reference)).toBe(2);
  });
});

describe("keyboard cursor", () => {
  const values = buildPreset("sorted");

  it("recognises only the keys it handles", () => {
    for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"]) {
      expect(isCursorKey(key)).toBe(true);
    }
    for (const key of ["ArrowUp", "ArrowDown", " ", "Enter", "a"]) {
      expect(isCursorKey(key)).toBe(false);
    }
  });

  it("moves one bar at a time and stops at the ends", () => {
    expect(moveCursor(values, 5, "ArrowLeft")).toBe(4);
    expect(moveCursor(values, 5, "ArrowRight")).toBe(6);
    expect(moveCursor(values, 0, "ArrowLeft")).toBe(0);
    expect(moveCursor(values, SIZE - 1, "ArrowRight")).toBe(SIZE - 1);
  });

  it("jumps to the ends", () => {
    expect(moveCursor(values, 12, "Home")).toBe(0);
    expect(moveCursor(values, 12, "End")).toBe(SIZE - 1);
  });

  it("never leaves the array, wherever it starts", () => {
    for (let i = -2; i <= SIZE + 2; i++) {
      for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"] as const) {
        const next = moveCursor(values, i, key);
        expect(next).toBeGreaterThanOrEqual(0);
        expect(next).toBeLessThan(SIZE);
      }
    }
  });
});

describe("presets and the shapes they teach", () => {
  it("makes the adaptive sort's cost swing with the shape while the blind one holds still", () => {
    const shapes: PresetId[] = ["sorted", "almost", "random", "reversed"];
    const insertion = shapes.map((id) => sortAndMeasure(buildPreset(id), "insertion").comparisons);
    const selection = shapes.map((id) => sortAndMeasure(buildPreset(id), "selection").comparisons);

    expect(new Set(selection).size).toBe(1);
    expect(Math.max(...insertion) - Math.min(...insertion)).toBeGreaterThan(400);
    // Sorted is cheapest, reversed dearest, and the order in between holds.
    expect(insertion).toEqual([...insertion].sort((a, b) => a - b));
  });
});

describe("stroking a gesture", () => {
  it("fills every bar between two samples, so a fast sweep leaves no gaps", () => {
    // Pointer events skip pixels; without joining the samples the old shape
    // survives in stripes and a clean ramp cannot be drawn.
    const values = buildPreset("reversed");
    strokeTo(values, null, { index: 0, value: 1 });
    strokeTo(values, { index: 0, value: 1 }, { index: 31, value: 32 });
    expect(isSorted(values)).toBe(true);
    expect(values[0]).toBe(1);
    expect(values[31]).toBe(32);
  });

  it("interpolates in a straight line", () => {
    const values = buildPreset("sorted");
    strokeTo(values, { index: 0, value: 4 }, { index: 4, value: 8 });
    expect(Array.from(values.slice(0, 5))).toEqual([1, 5, 6, 7, 8]);
  });

  it("works in both directions", () => {
    const values = buildPreset("sorted");
    strokeTo(values, { index: 10, value: 20 }, { index: 6, value: 16 });
    expect(Array.from(values.slice(6, 11))).toEqual([16, 17, 18, 19, 11]);
  });

  it("writes a single bar when there is no previous sample", () => {
    const values = buildPreset("sorted");
    expect(strokeTo(values, null, { index: 3, value: 30 })).toBe(true);
    expect(values[3]).toBe(30);
  });

  it("refuses to stroke outside the array and never writes a bad value", () => {
    const values = buildPreset("sorted");
    const before = Array.from(values);
    expect(strokeTo(values, null, { index: 99, value: 5 })).toBe(false);
    expect(Array.from(values)).toEqual(before);

    strokeTo(values, { index: 0, value: 9999 }, { index: 5, value: -9999 });
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(MIN_VALUE);
      expect(value).toBeLessThanOrEqual(MAX_VALUE);
    }
  });
});
