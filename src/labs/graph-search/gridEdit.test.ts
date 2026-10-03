import { describe, expect, it } from "vitest";
import { MUD, NORMAL, WALL, type Grid } from "./engine";
import {
  clearTerrain,
  dragTool,
  inBounds,
  isCursorKey,
  isMarker,
  markerAt,
  moveCursor,
  moveMarker,
  paintCell,
  summarise,
} from "./gridEdit";
import { buildPreset, NARROW, pickSize, WIDE, WIDE_MIN_WIDTH_PX, MIN_CELL_PX } from "./mazes";

const fresh = (): Grid => buildPreset("open", NARROW);

describe("bounds", () => {
  it("rejects anything off the grid", () => {
    const grid = fresh();
    const last = grid.cols * grid.rows - 1;
    expect(inBounds(grid, 0)).toBe(true);
    expect(inBounds(grid, last)).toBe(true);
    expect(inBounds(grid, -1)).toBe(false);
    expect(inBounds(grid, last + 1)).toBe(false);
    expect(inBounds(grid, 1.5)).toBe(false);
    expect(inBounds(grid, Number.NaN)).toBe(false);
  });

  it("refuses to paint outside the grid", () => {
    const grid = fresh();
    const before = Array.from(grid.cost);
    expect(paintCell(grid, -1, "wall")).toBe(false);
    expect(paintCell(grid, grid.cost.length, "wall")).toBe(false);
    expect(Array.from(grid.cost)).toEqual(before);
  });
});

describe("painting", () => {
  it("applies the tool and reports whether anything changed", () => {
    const grid = fresh();
    const cell = 5;
    expect(paintCell(grid, cell, "wall")).toBe(true);
    expect(grid.cost[cell]).toBe(WALL);
    // Painting the same thing twice is not a change — a drag must stay cheap.
    expect(paintCell(grid, cell, "wall")).toBe(false);
    expect(paintCell(grid, cell, "mud")).toBe(true);
    expect(grid.cost[cell]).toBe(MUD);
    expect(paintCell(grid, cell, "erase")).toBe(true);
    expect(grid.cost[cell]).toBe(NORMAL);
  });

  it("never buries the start or the goal", () => {
    const grid = fresh();
    for (const marker of [grid.start, grid.goal]) {
      expect(isMarker(grid, marker)).toBe(true);
      for (const tool of ["wall", "mud", "erase"] as const) {
        expect(paintCell(grid, marker, tool)).toBe(false);
      }
      expect(grid.cost[marker]).toBe(NORMAL);
    }
  });

  it("turns a drag into erasing when it starts on what it would have drawn", () => {
    const grid = fresh();
    const cell = 7;
    expect(dragTool(grid, cell, "wall")).toBe("wall");
    grid.cost[cell] = WALL;
    expect(dragTool(grid, cell, "wall")).toBe("erase");
    // A mud drag starting on a wall still draws mud — only a match erases.
    expect(dragTool(grid, cell, "mud")).toBe("mud");
    grid.cost[cell] = MUD;
    expect(dragTool(grid, cell, "mud")).toBe("erase");
  });
});

describe("markers", () => {
  it("moves the start and clears a wall out of the way", () => {
    const grid = fresh();
    const target = 12;
    grid.cost[target] = WALL;
    expect(moveMarker(grid, "start", target)).toBe(true);
    expect(grid.start).toBe(target);
    expect(grid.cost[target]).toBe(NORMAL);
  });

  it("keeps mud underfoot — only walls are cleared", () => {
    const grid = fresh();
    const target = 13;
    grid.cost[target] = MUD;
    expect(moveMarker(grid, "goal", target)).toBe(true);
    expect(grid.cost[target]).toBe(MUD);
  });

  it("never lets the two markers share a cell", () => {
    const grid = fresh();
    expect(moveMarker(grid, "start", grid.goal)).toBe(false);
    expect(moveMarker(grid, "goal", grid.start)).toBe(false);
    expect(grid.start).not.toBe(grid.goal);
  });

  it("reports no change when a marker is dropped where it already is", () => {
    const grid = fresh();
    expect(moveMarker(grid, "start", grid.start)).toBe(false);
  });

  it("refuses to move a marker off the grid", () => {
    const grid = fresh();
    const before = grid.start;
    expect(moveMarker(grid, "start", -5)).toBe(false);
    expect(grid.start).toBe(before);
  });

  it("identifies which marker sits on a cell", () => {
    const grid = fresh();
    expect(markerAt(grid, grid.start)).toBe("start");
    expect(markerAt(grid, grid.goal)).toBe("goal");
    expect(markerAt(grid, 0)).toBeNull();
  });
});

describe("clearing and summarising", () => {
  it("clear leaves open ground and keeps the markers", () => {
    const grid = buildPreset("swamp", NARROW);
    const { start, goal } = grid;
    clearTerrain(grid);
    expect(Array.from(grid.cost).every((c) => c === NORMAL)).toBe(true);
    expect(grid.start).toBe(start);
    expect(grid.goal).toBe(goal);
  });

  it("counts walls and mud for the text description", () => {
    const grid = fresh();
    expect(summarise(grid)).toEqual({ walls: 0, mud: 0 });
    paintCell(grid, 4, "wall");
    paintCell(grid, 5, "wall");
    paintCell(grid, 6, "mud");
    expect(summarise(grid)).toEqual({ walls: 2, mud: 1 });
  });
});

describe("keyboard cursor", () => {
  const grid = fresh();
  const at = (row: number, col: number) => row * grid.cols + col;

  it("recognises only the keys it handles", () => {
    for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]) {
      expect(isCursorKey(key)).toBe(true);
    }
    for (const key of [" ", "Enter", "s", "G", "Tab", "a"]) {
      expect(isCursorKey(key)).toBe(false);
    }
  });

  it("moves one cell at a time in each direction", () => {
    const middle = at(5, 5);
    expect(moveCursor(grid, middle, "ArrowUp")).toBe(at(4, 5));
    expect(moveCursor(grid, middle, "ArrowDown")).toBe(at(6, 5));
    expect(moveCursor(grid, middle, "ArrowLeft")).toBe(at(5, 4));
    expect(moveCursor(grid, middle, "ArrowRight")).toBe(at(5, 6));
  });

  it("stops at the edges instead of wrapping", () => {
    const topLeft = at(0, 0);
    expect(moveCursor(grid, topLeft, "ArrowUp")).toBe(topLeft);
    expect(moveCursor(grid, topLeft, "ArrowLeft")).toBe(topLeft);

    const bottomRight = at(grid.rows - 1, grid.cols - 1);
    expect(moveCursor(grid, bottomRight, "ArrowDown")).toBe(bottomRight);
    expect(moveCursor(grid, bottomRight, "ArrowRight")).toBe(bottomRight);
  });

  it("never leaves the grid, wherever it starts", () => {
    for (let i = 0; i < grid.cols * grid.rows; i++) {
      for (const key of [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ] as const) {
        expect(inBounds(grid, moveCursor(grid, i, key))).toBe(true);
      }
    }
  });

  it("jumps to the ends of the current row", () => {
    const middle = at(7, 9);
    expect(moveCursor(grid, middle, "Home")).toBe(at(7, 0));
    expect(moveCursor(grid, middle, "End")).toBe(at(7, grid.cols - 1));
  });

  it("falls back to the start when it has nowhere sensible to be", () => {
    expect(moveCursor(grid, -1, "ArrowRight")).toBe(grid.start);
  });
});

describe("keyboard painting", () => {
  it("draws and then erases on the same cell, the way the space key does", () => {
    const grid = fresh();
    const cell = moveCursor(grid, grid.start, "ArrowDown");
    // Space applies `dragTool`, so a second press undoes the first.
    expect(paintCell(grid, cell, dragTool(grid, cell, "wall"))).toBe(true);
    expect(grid.cost[cell]).toBe(WALL);
    expect(paintCell(grid, cell, dragTool(grid, cell, "wall"))).toBe(true);
    expect(grid.cost[cell]).toBe(NORMAL);
  });

  it("cannot paint the cell the cursor shares with a marker", () => {
    const grid = fresh();
    expect(paintCell(grid, grid.start, dragTool(grid, grid.start, "wall"))).toBe(false);
    expect(paintCell(grid, grid.goal, dragTool(grid, grid.goal, "mud"))).toBe(false);
  });

  it("drops a marker on the cursor cell", () => {
    const grid = fresh();
    const target = moveCursor(grid, moveCursor(grid, grid.start, "ArrowDown"), "ArrowDown");
    expect(moveMarker(grid, "start", target)).toBe(true);
    expect(grid.start).toBe(target);
  });
});

describe("layout choice", () => {
  it("uses the 31 by 21 grid whenever the screen can show it properly", () => {
    expect(pickSize(1280)).toBe(WIDE);
    expect(pickSize(WIDE_MIN_WIDTH_PX)).toBe(WIDE);
    expect(WIDE.cols * WIDE.rows).toBe(651);
  });

  it("drops to the smaller grid rather than to unusable cells", () => {
    expect(pickSize(WIDE_MIN_WIDTH_PX - 1)).toBe(NARROW);
    expect(pickSize(375)).toBe(NARROW);
    // At the threshold the wide grid still has room for a usable cell.
    expect((WIDE_MIN_WIDTH_PX - 64) / WIDE.cols).toBeGreaterThanOrEqual(MIN_CELL_PX);
  });
});
