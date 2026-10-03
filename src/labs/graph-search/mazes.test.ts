import { describe, expect, it } from "vitest";
import { createSearch, runToEnd, solve, WALL, type Algorithm } from "./engine";
import {
  buildPreset,
  cloneGrid,
  challengeGrid,
  CHALLENGES,
  MIN_CELL_PX,
  NARROW,
  pickSize,
  WIDE,
  WIDE_MIN_WIDTH_PX,
  type PresetId,
} from "./mazes";

const SIZES = [WIDE, NARROW];
const PRESETS: PresetId[] = ["simple", "detour", "swamp", "open"];
const ALGORITHMS: Algorithm[] = ["bfs", "dijkstra", "astar"];

describe("grid sizing", () => {
  it("only ever offers layouts whose cells clear the minimum", () => {
    expect(pickSize(1200)).toBe(WIDE);
    expect(pickSize(WIDE_MIN_WIDTH_PX)).toBe(WIDE);
    expect(pickSize(WIDE_MIN_WIDTH_PX - 1)).toBe(NARROW);
    expect(pickSize(320)).toBe(NARROW);
    // The narrow layout has to survive the narrowest phone we support.
    expect(320 / NARROW.cols).toBeGreaterThanOrEqual(MIN_CELL_PX);
    // And the wide layout is the 651-cell grid the lab is designed around.
    expect(WIDE.cols * WIDE.rows).toBe(651);
  });
});

describe("presets", () => {
  it("are solvable by every algorithm at both sizes", () => {
    for (const size of SIZES) {
      for (const id of PRESETS) {
        for (const algorithm of ALGORITHMS) {
          expect(solve(buildPreset(id, size), algorithm).status).toBe("solved");
        }
      }
    }
  });

  it("are rebuilt identically every time — reset must be deterministic", () => {
    for (const size of SIZES) {
      for (const id of PRESETS) {
        const a = buildPreset(id, size);
        const b = buildPreset(id, size);
        expect(Array.from(a.cost)).toEqual(Array.from(b.cost));
        expect(a.start).toBe(b.start);
        expect(a.goal).toBe(b.goal);
      }
    }
  });

  it("never bury the start or the goal in a wall", () => {
    for (const size of SIZES) {
      for (const id of PRESETS) {
        const grid = buildPreset(id, size);
        expect(grid.cost[grid.start]).not.toBe(WALL);
        expect(grid.cost[grid.goal]).not.toBe(WALL);
        expect(grid.start).not.toBe(grid.goal);
      }
    }
  });

  it("gives section 3 a map where fewest moves and cheapest cost disagree", () => {
    for (const size of SIZES) {
      const grid = buildPreset("swamp", size);
      const bfs = solve(grid, "bfs");
      const dijkstra = solve(grid, "dijkstra");
      expect(bfs.pathLength).toBeLessThan(dijkstra.pathLength);
      expect(bfs.pathCost).toBeGreaterThan(dijkstra.pathCost);
    }
  });

  it("gives section 4 a map where the guess saves a lot of work", () => {
    for (const size of SIZES) {
      const grid = buildPreset("open", size);
      const dijkstra = solve(grid, "dijkstra");
      const astar = solve(grid, "astar");
      expect(astar.pathCost).toBe(dijkstra.pathCost);
      expect(astar.explored * 4).toBeLessThan(dijkstra.explored);
    }
  });

  it("cloneGrid copies without sharing the cost buffer", () => {
    const grid = buildPreset("simple", NARROW);
    const copy = cloneGrid(grid);
    copy.cost[0] = WALL;
    expect(grid.cost[0]).not.toBe(copy.cost[0]);
    expect(copy.start).toBe(grid.start);
  });
});

// ------------------------------------------------------------- GATE A ----

describe("Gate A — the challenge is winnable, and only by understanding it", () => {
  it("states the true optimal cost for every maze", () => {
    for (const maze of CHALLENGES) {
      const grid = challengeGrid(maze);
      const best = Math.min(...ALGORITHMS.map((a) => solve(grid, a).pathCost));
      expect(maze.optimalCost).toBe(best);
      expect(solve(grid, "dijkstra").pathCost).toBe(maze.optimalCost);
    }
  });

  it("is passed by A* on every maze — the budget is always reachable", () => {
    for (const maze of CHALLENGES) {
      const astar = solve(challengeGrid(maze), "astar");
      expect(astar.status).toBe("solved");
      expect(astar.pathCost).toBe(maze.optimalCost);
      expect(astar.explored).toBeLessThanOrEqual(maze.budget);
    }
  });

  it("is not passed by simply running the other two", () => {
    for (const maze of CHALLENGES) {
      const grid = challengeGrid(maze);
      for (const algorithm of ["bfs", "dijkstra"] as const) {
        const r = solve(grid, algorithm);
        const passes = r.pathCost === maze.optimalCost && r.explored <= maze.budget;
        expect(passes).toBe(false);
      }
    }
  });

  it("leaves the budget strictly between A* and the cheaper of the other two", () => {
    for (const maze of CHALLENGES) {
      const grid = challengeGrid(maze);
      const astar = solve(grid, "astar").explored;
      const others = Math.min(solve(grid, "bfs").explored, solve(grid, "dijkstra").explored);
      expect(astar).toBeLessThanOrEqual(maze.budget);
      expect(maze.budget).toBeLessThan(others);
    }
  });

  it("asks a different question on each maze", () => {
    const grids = CHALLENGES.map(challengeGrid);
    // The swamp is the only one where BFS returns a more expensive route:
    // there, the cost gate is what does the discriminating.
    const costFailures = grids.map(
      (g, i) => solve(g, "bfs").pathCost > (CHALLENGES[i]?.optimalCost ?? 0),
    );
    expect(costFailures.filter(Boolean)).toHaveLength(1);

    // Elsewhere the effort gate carries it, and by margins that differ enough
    // that beating one maze does not tell you how to beat the next.
    const margins = grids.map((g) => solve(g, "dijkstra").explored / solve(g, "astar").explored);
    expect(Math.max(...margins) - Math.min(...margins)).toBeGreaterThan(1);
  });

  it("uses maps that all fit the fixed challenge layout", () => {
    for (const maze of CHALLENGES) {
      const grid = challengeGrid(maze);
      expect(grid.cols).toBe(NARROW.cols);
      expect(grid.rows).toBe(NARROW.rows);
    }
    expect(new Set(CHALLENGES.map((m) => m.id)).size).toBe(CHALLENGES.length);
  });
});

describe("switching algorithms on one grid", () => {
  const snapshot = (g: ReturnType<typeof buildPreset>) =>
    `${g.start}:${g.goal}:${g.cost.join(",")}`;

  it("leaves the map exactly as it was", () => {
    // The UI keeps the grid when the algorithm changes; nothing in a run may
    // touch it, or the next algorithm would be solving a different puzzle.
    const grid = buildPreset("swamp", WIDE);
    const before = snapshot(grid);
    for (const algorithm of ALGORITHMS) {
      const search = createSearch(grid, algorithm, 1);
      runToEnd(search);
      expect(search.status).toBe("solved");
      expect(snapshot(grid)).toBe(before);
    }
  });

  it("gives each algorithm its own state, not a shared one", () => {
    const grid = buildPreset("swamp", WIDE);
    const bfs = createSearch(grid, "bfs", 1);
    const astar = createSearch(grid, "astar", 1);
    runToEnd(bfs);
    // Creating and running one search must not have disturbed the other.
    expect(astar.explored).toBe(0);
    expect(astar.status).toBe("running");
    runToEnd(astar);
    expect(bfs.explored).not.toBe(astar.explored);
  });

  it("produces the three different answers the sections are built on", () => {
    const grid = buildPreset("swamp", WIDE);
    const bfs = solve(grid, "bfs");
    const dijkstra = solve(grid, "dijkstra");
    const astar = solve(grid, "astar");

    // Section 3: fewest moves is not cheapest.
    expect(bfs.pathLength).toBeLessThan(dijkstra.pathLength);
    expect(bfs.pathCost).toBeGreaterThan(dijkstra.pathCost);
    // Section 4: same answer, far less looking.
    expect(astar.pathCost).toBe(dijkstra.pathCost);
    expect(astar.explored).toBeLessThan(dijkstra.explored);
  });

  it("restores the starting map on reset, even after edits", () => {
    const original = snapshot(buildPreset("detour", WIDE));
    const edited = buildPreset("detour", WIDE);
    edited.cost.fill(WALL);
    edited.start = 0;
    expect(snapshot(edited)).not.toBe(original);
    // Reset in the UI rebuilds the preset from scratch, exactly like this.
    expect(snapshot(buildPreset("detour", WIDE))).toBe(original);
  });
});
