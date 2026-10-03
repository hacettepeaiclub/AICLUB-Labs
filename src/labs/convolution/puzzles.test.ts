import { describe, expect, it } from "vitest";
import { fromRows, grid } from "./engine";
import { LAPLACIAN, PREWITT, SOBEL_X } from "./pictures";
import { judgeFlat, judgeShift, judgeVertical } from "./puzzles";

const k = (...rows: number[][]) => fromRows(rows);

describe("shift right by one", () => {
  it("is solved by a 1 on the left, and only that", () => {
    expect(judgeShift(k([0, 0, 0], [1, 0, 0], [0, 0, 0])).solved).toBe(true);
    expect(judgeShift(k([0, 0, 0], [0, 1, 0], [0, 0, 0])).solved).toBe(false);
    expect(judgeShift(k([0, 0, 0], [2, 0, 0], [0, 0, 0])).solved).toBe(false);
  });

  it("recognises the flipped answer as a mirror, not a miss", () => {
    const right = judgeShift(k([0, 0, 0], [0, 0, 1], [0, 0, 0]));
    expect(right.solved).toBe(false);
    expect(right.mirrored).toBe(true);
    expect(judgeShift(grid(3, 3)).mirrored).toBe(false);
  });
});

describe("flat to zero", () => {
  it("passes every edge detector and the outline", () => {
    for (const kernel of [PREWITT, SOBEL_X, LAPLACIAN, k([0, 0, 0], [1, -1, 0], [0, 0, 0])]) {
      expect(judgeFlat(kernel).solved).toBe(true);
    }
  });

  it("fails a kernel whose weights do not cancel, and the all-zero one", () => {
    const identity = judgeFlat(k([0, 0, 0], [0, 1, 0], [0, 0, 0]));
    expect(identity.rules).toEqual({ flatZero: false, edgeSeen: true });
    expect(judgeFlat(grid(3, 3)).rules).toEqual({ flatZero: true, edgeSeen: false });
  });
});

describe("vertical, never horizontal", () => {
  it("is solved by columns that rise and rows that cancel", () => {
    expect(judgeVertical(k([-1, 2, -1], [-1, 2, -1], [-1, 2, -1])).solved).toBe(true);
    expect(judgeVertical(k([0, 0, 0], [-1, 2, -1], [0, 0, 0])).solved).toBe(true);
  });

  it("fails a kernel that also answers the horizontal line", () => {
    const column = judgeVertical(k([0, 1, 0], [0, 1, 0], [0, 1, 0]));
    expect(column.rules).toEqual({ fires: true, silent: false });
    // An edge detector answers vertical edges, and still fires on one side of a line.
    expect(judgeVertical(SOBEL_X).rules.fires).toBe(true);
    // All negative: silent everywhere, but never fires.
    expect(judgeVertical(k([-1, -1, -1], [-1, -1, -1], [-1, -1, -1])).rules).toEqual({
      fires: false,
      silent: true,
    });
  });
});
