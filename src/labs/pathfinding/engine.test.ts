import { describe, expect, it } from "vitest";
import {
  CLOSED,
  colOf,
  createGrid,
  createSearch,
  heuristic,
  MUD,
  NORMAL,
  parseGrid,
  reconstructPath,
  rowOf,
  runToEnd,
  solve,
  step,
  WALL,
  type Algorithm,
  type Grid,
  type HeuristicWeight,
  type Search,
  type StepKind,
} from "./engine";

// ------------------------------------------------------------- fixtures ----

/** Open room. Every route of the same length is equally good. */
const OPEN = [
  "###############",
  "#S............#",
  "#.............#",
  "#.............#",
  "#............G#",
  "###############",
];

/** A wall the search has to go around. */
const DETOUR = [
  "###############",
  "#S....#.......#",
  "#.....#.......#",
  "#.....#.......#",
  "#.....#......G#",
  "#.............#",
  "###############",
];

/**
 * The lab's section-3 scenario: a short route straight through mud, or a
 * longer clean way round. Fewest moves and cheapest cost disagree here.
 */
const MUD_CORRIDOR = [
  "###############",
  "#S...~~~~~...G#",
  "#....~~~~~....#",
  "#....~~~~~....#",
  "#.............#",
  "###############",
];

/** The goal is sealed off. */
const SEALED = ["#########", "#S..#..G#", "#...#...#", "#...#...#", "#########"];

/** Nothing can leave the start. */
const BOXED = ["#####", "#.#.#", "##S##", "#.#.#", "#..G#", "#####"];

const FIXTURES: Record<string, readonly string[]> = {
  OPEN,
  DETOUR,
  MUD_CORRIDOR,
};

const ALL_RUNS: readonly [Algorithm, HeuristicWeight][] = [
  ["bfs", 0],
  ["dijkstra", 0],
  ["astar", 0],
  ["astar", 1],
  ["astar", 2],
];

// --------------------------------------------------------------- helpers ----

/** Copy a grid with a different start — the engine must never edit one in place. */
function withStart(grid: Grid, start: number): Grid {
  return { cols: grid.cols, rows: grid.rows, cost: grid.cost.slice(), start, goal: grid.goal };
}

/** Every step of a run, as `kind@node` — the execution order, comparably. */
function trace(grid: Grid, algorithm: Algorithm, weight: HeuristicWeight): string[] {
  const s = createSearch(grid, algorithm, weight);
  const out: string[] = [];
  while (s.status === "running") {
    const kind = step(s);
    out.push(`${kind}@${s.node}`);
  }
  return out;
}

function pathCells(s: Search): number[] {
  return Array.from(s.path.slice(0, s.pathLength + 1));
}

function snapshot(grid: Grid): string {
  return `${grid.cols}x${grid.rows}:${grid.start}:${grid.goal}:${grid.cost.join(",")}`;
}

// ------------------------------------------------------------------ grid ----

describe("grid", () => {
  it("parses an ASCII maze into costs, start and goal", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    expect(grid.cols).toBe(15);
    expect(grid.rows).toBe(6);
    expect(grid.cost[0]).toBe(WALL);
    expect(grid.cost[grid.start]).toBe(NORMAL);
    expect(grid.cost[grid.goal]).toBe(NORMAL);
    expect(rowOf(grid, grid.start)).toBe(1);
    expect(colOf(grid, grid.start)).toBe(1);
    // Row 1 columns 5..9 are mud.
    expect(grid.cost[1 * 15 + 5]).toBe(MUD);
  });

  it("rejects malformed drawings", () => {
    expect(() => parseGrid([])).toThrow();
    expect(() => parseGrid(["S.G", "..."])).not.toThrow();
    expect(() => parseGrid(["S.G", ".."])).toThrow(/ragged/);
    expect(() => parseGrid(["S.."])).toThrow(/goal/);
    expect(() => parseGrid(["..G"])).toThrow(/start/);
    expect(() => parseGrid(["S?G"])).toThrow(/unknown/);
  });

  it("createGrid starts fully open", () => {
    const grid = createGrid(4, 3, 0, 11);
    expect(grid.cost).toHaveLength(12);
    expect(grid.cost.every((c) => c === NORMAL)).toBe(true);
  });
});

// ------------------------------------------------------------------- BFS ----

describe("BFS", () => {
  it("finds a fewest-move path across open ground", () => {
    const grid = parseGrid(OPEN);
    const result = solve(grid, "bfs");
    expect(result.status).toBe("solved");
    // Manhattan distance is achievable when nothing is in the way.
    expect(result.pathLength).toBe(heuristic(grid, grid.start));
  });

  it("goes around a wall", () => {
    const grid = parseGrid(DETOUR);
    const s = createSearch(grid, "bfs");
    runToEnd(s);
    expect(s.status).toBe("solved");
    // Longer than the straight-line distance, because of the wall.
    expect(s.pathLength).toBeGreaterThan(heuristic(grid, grid.start));
    expect(pathCells(s).every((i) => grid.cost[i] !== WALL)).toBe(true);
  });

  it("reports an unreachable goal instead of inventing a path", () => {
    const s = createSearch(parseGrid(SEALED), "bfs");
    runToEnd(s);
    expect(s.status).toBe("unreachable");
    expect(s.pathLength).toBe(0);
    expect(s.pathCost).toBe(0);
    expect(s.explored).toBeGreaterThan(0);
  });

  it("handles start === goal", () => {
    const grid = parseGrid(["#####", "#S.G#", "#####"]);
    grid.goal = grid.start;
    const s = createSearch(grid, "bfs");
    runToEnd(s);
    expect(s.status).toBe("solved");
    expect(s.pathLength).toBe(0);
    expect(s.pathCost).toBe(0);
    expect(pathCells(s)).toEqual([grid.start]);
    expect(s.explored).toBe(1);
  });

  it("repeats itself exactly", () => {
    const grid = parseGrid(DETOUR);
    expect(trace(grid, "bfs", 0)).toEqual(trace(grid, "bfs", 0));
  });

  it("minimises moves, not cost — it walks straight through the mud", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    const bfs = solve(grid, "bfs");
    const dijkstra = solve(grid, "dijkstra");
    expect(bfs.status).toBe("solved");
    // Fewer moves...
    expect(bfs.pathLength).toBeLessThan(dijkstra.pathLength);
    // ...bought with a much more expensive route. This gap is the lesson.
    expect(bfs.pathCost).toBeGreaterThan(dijkstra.pathCost);
  });
});

// -------------------------------------------------------------- Dijkstra ----

describe("Dijkstra", () => {
  it("finds the cheapest route, not the shortest one", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    const s = createSearch(grid, "dijkstra");
    runToEnd(s);
    expect(s.status).toBe("solved");
    // The cheap way round avoids every mud cell.
    expect(pathCells(s).every((i) => grid.cost[i] !== MUD)).toBe(true);
    expect(s.pathCost).toBe(s.pathLength); // all-normal ground
  });

  it("agrees with BFS on cost when every step costs the same", () => {
    for (const rows of [OPEN, DETOUR]) {
      const grid = parseGrid(rows);
      expect(solve(grid, "dijkstra").pathCost).toBe(solve(grid, "bfs").pathCost);
    }
  });

  it("leaves dist as the true cost of the best route to every settled cell", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    const s = createSearch(grid, "dijkstra");
    runToEnd(s);
    for (let i = 0; i < grid.cost.length; i++) {
      if (s.state[i] !== CLOSED && s.state[i] !== 3) continue;
      if (i === grid.start) continue;
      const viaParent = s.dist[s.parent[i]!]! + grid.cost[i]!;
      expect(s.dist[i]).toBe(viaParent);
    }
  });

  it("reports unreachable goals", () => {
    expect(solve(parseGrid(SEALED), "dijkstra").status).toBe("unreachable");
  });
});

// ------------------------------------------------------------ relaxation ----

describe("relaxation under the cost-to-enter rule", () => {
  const relaxCount = (rows: readonly string[], a: Algorithm, w: HeuristicWeight): number =>
    trace(parseGrid(rows), a, w).filter((e) => e.startsWith("relax@")).length;

  it("never happens for BFS: a FIFO queue reaches every cell by its shortest route first", () => {
    for (const rows of Object.values(FIXTURES)) {
      expect(relaxCount(rows, "bfs", 0)).toBe(0);
    }
  });

  it("never happens for Dijkstra, because every edge into a cell costs the same", () => {
    // Dijkstra settles cells in nondecreasing g, and the only cost on the way
    // in is the target cell's own. So the first settled neighbour to reach a
    // cell is always the cheapest one, and there is nothing left to improve.
    for (const rows of Object.values(FIXTURES)) {
      expect(relaxCount(rows, "dijkstra", 0)).toBe(0);
      expect(relaxCount(rows, "astar", 0)).toBe(0);
    }
  });

  it("does happen for A*, which settles in f order rather than g order", () => {
    // A cell can be found first by a neighbour with a small f but a large g,
    // and improved later. Consistency does not prevent that — it guarantees
    // the cell is *expanded* with its optimal g, which is what the relaxation
    // brings about.
    expect(relaxCount(DETOUR, "astar", 1)).toBeGreaterThan(0);
    expect(relaxCount(MUD_CORRIDOR, "astar", 2)).toBeGreaterThan(0);
  });

  it("keeps parent and dist consistent whenever it does relax", () => {
    for (const [rows, weight] of [
      [DETOUR, 1],
      [MUD_CORRIDOR, 2],
    ] as const) {
      const grid = parseGrid(rows);
      const s = createSearch(grid, "astar", weight);
      let seen = 0;
      while (s.status === "running") {
        if (step(s) === "relax") {
          seen++;
          expect(s.dist[s.node]).toBe(s.dist[s.from]! + grid.cost[s.node]!);
          expect(s.parent[s.node]).toBe(s.from);
        }
      }
      expect(seen).toBeGreaterThan(0);
    }
  });
});

// -------------------------------------------------------------------- A* ----

describe("A*", () => {
  it("computes Manhattan distance to the goal", () => {
    const grid = parseGrid(OPEN);
    expect(heuristic(grid, grid.goal)).toBe(0);
    const start = grid.start;
    const expected =
      Math.abs(rowOf(grid, start) - rowOf(grid, grid.goal)) +
      Math.abs(colOf(grid, start) - colOf(grid, grid.goal));
    expect(heuristic(grid, start)).toBe(expected);
  });

  it("uses an admissible heuristic — it never overestimates, from any cell", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    for (let i = 0; i < grid.cost.length; i++) {
      if (grid.cost[i] === WALL) continue;
      const truth = solve(withStart(grid, i), "dijkstra");
      if (truth.status !== "solved") continue;
      expect(heuristic(grid, i)).toBeLessThanOrEqual(truth.pathCost);
    }
  });

  it("uses a consistent heuristic — h(n) never exceeds cost(m) + h(m)", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    for (let i = 0; i < grid.cost.length; i++) {
      if (grid.cost[i] === WALL) continue;
      const r = rowOf(grid, i);
      const c = colOf(grid, i);
      for (const [dr, dc] of [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ] as const) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= grid.rows || nc < 0 || nc >= grid.cols) continue;
        const m = nr * grid.cols + nc;
        if (grid.cost[m] === WALL) continue;
        expect(heuristic(grid, i)).toBeLessThanOrEqual(grid.cost[m]! + heuristic(grid, m));
      }
    }
  });

  it("with w = 1 returns an optimal-cost path on every fixture", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      expect(solve(grid, "astar", 1).pathCost).toBe(solve(grid, "dijkstra").pathCost);
    }
  });

  it("with w = 0 is Dijkstra — same order, same work, same path", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      expect(trace(grid, "astar", 0)).toEqual(trace(grid, "dijkstra", 0));

      const a = createSearch(grid, "astar", 0);
      const d = createSearch(grid, "dijkstra");
      runToEnd(a);
      runToEnd(d);
      expect(a.explored).toBe(d.explored);
      expect(pathCells(a)).toEqual(pathCells(d));
    }
  });

  it("with w = 1 never does more work than Dijkstra, and usually much less", () => {
    let strictlyBetter = 0;
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      const astar = solve(grid, "astar", 1);
      const dijkstra = solve(grid, "dijkstra");
      expect(astar.explored).toBeLessThanOrEqual(dijkstra.explored);
      if (astar.explored < dijkstra.explored) strictlyBetter++;
    }
    expect(strictlyBetter).toBeGreaterThan(0);
  });

  it("reports unreachable goals", () => {
    for (const weight of [0, 1, 2] as const) {
      expect(solve(parseGrid(SEALED), "astar", weight).status).toBe("unreachable");
    }
  });

  describe("w = 2 (weighted A*)", () => {
    it("stays within the 2x suboptimality bound", () => {
      for (const rows of Object.values(FIXTURES)) {
        const grid = parseGrid(rows);
        const optimal = solve(grid, "dijkstra").pathCost;
        expect(solve(grid, "astar", 2).pathCost).toBeLessThanOrEqual(2 * optimal);
      }
    });

    it("really can return a worse path — the guarantee is genuinely gone", () => {
      // Only reachable when entering costly ground looks cheaper than stepping
      // away from the goal: dF(into cost c) = c - w, dF(away) = 1 + w.
      // With w = 2 that needs c < 3, so the mud here is dialled to 3.
      const grid = parseGrid(MUD_CORRIDOR);
      for (let i = 0; i < grid.cost.length; i++) {
        if (grid.cost[i] === MUD) grid.cost[i] = 3;
      }
      const optimal = solve(grid, "dijkstra").pathCost;
      const weighted = solve(grid, "astar", 2);
      expect(weighted.status).toBe("solved");
      expect(weighted.pathCost).toBeGreaterThan(optimal);
      expect(weighted.pathCost).toBeLessThanOrEqual(2 * optimal);
    });

    it("does NOT go wrong at the lab's own mud cost of 5", () => {
      // dF(mud) = 5 - 2 = 3 exactly equals dF(away) = 1 + 2 = 3, so the two
      // routes tie and the tie-break keeps the optimal one. Recorded because
      // it is why the lab does not ship a w = 2 control.
      const grid = parseGrid(MUD_CORRIDOR);
      expect(solve(grid, "astar", 2).pathCost).toBe(solve(grid, "dijkstra").pathCost);
    });
  });
});

// ---------------------------------------------------------- step / events ----

describe("the step model", () => {
  it("produces exactly one event per call", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        const s = createSearch(grid, algorithm, weight);
        let calls = 0;
        while (s.status === "running") {
          const kind: StepKind = step(s);
          expect(kind).toBeTruthy();
          calls++;
        }
        expect(s.steps).toBe(calls);
      }
    }
  });

  it("settles one cell per dequeue or solved event", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        const events = trace(grid, algorithm, weight);
        const settled = events.filter(
          (e) => e.startsWith("dequeue@") || e.startsWith("solved@"),
        ).length;
        const s = createSearch(grid, algorithm, weight);
        runToEnd(s);
        expect(settled).toBe(s.explored);
      }
    }
  });

  it("discovers every reached cell exactly once, the start excepted", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        const discovered = trace(grid, algorithm, weight).filter((e) => e.startsWith("discover@"));
        expect(new Set(discovered).size).toBe(discovered.length);

        const s = createSearch(grid, algorithm, weight);
        runToEnd(s);
        const reached = Array.from(s.dist).filter((d) => d !== -1).length;
        expect(discovered.length).toBe(reached - 1);
      }
    }
  });

  it("attributes every discover and relax to the cell being expanded", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    const s = createSearch(grid, "dijkstra");
    let expanding = -1;
    while (s.status === "running") {
      const kind = step(s);
      if (kind === "dequeue") expanding = s.node;
      if (kind === "discover" || kind === "relax") {
        expect(s.from).toBe(expanding);
        expect(s.parent[s.node]).toBe(expanding);
      }
    }
  });

  it("is a no-op once finished", () => {
    const s = createSearch(parseGrid(OPEN), "bfs");
    runToEnd(s);
    const before = { explored: s.explored, steps: s.steps, cost: s.pathCost };
    expect(step(s)).toBe("solved");
    expect(step(s)).toBe("solved");
    expect(s.explored).toBe(before.explored);
    expect(s.steps).toBe(before.steps);
    expect(s.pathCost).toBe(before.cost);
  });

  it("ends with the event that matches its status", () => {
    const solved = trace(parseGrid(OPEN), "bfs", 0);
    expect(solved[solved.length - 1]).toMatch(/^solved@/);
    const stuck = trace(parseGrid(SEALED), "bfs", 0);
    expect(stuck[stuck.length - 1]).toMatch(/^unreachable@/);
  });
});

// ------------------------------------------------------------ runToEnd ----

describe("runToEnd", () => {
  it("is exactly the same as stepping by hand", () => {
    for (const rows of [...Object.values(FIXTURES), SEALED]) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        const stepped = createSearch(grid, algorithm, weight);
        while (stepped.status === "running") step(stepped);
        const straight = createSearch(grid, algorithm, weight);
        runToEnd(straight);

        expect(straight.status).toBe(stepped.status);
        expect(straight.explored).toBe(stepped.explored);
        expect(straight.steps).toBe(stepped.steps);
        expect(straight.pathLength).toBe(stepped.pathLength);
        expect(straight.pathCost).toBe(stepped.pathCost);
        expect(Array.from(straight.state)).toEqual(Array.from(stepped.state));
        expect(Array.from(straight.dist)).toEqual(Array.from(stepped.dist));
        expect(Array.from(straight.parent)).toEqual(Array.from(stepped.parent));
      }
    }
  });
});

// ---------------------------------------------------------------- paths ----

describe("path reconstruction", () => {
  it("returns a walkable chain from start to goal", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        const s = createSearch(grid, algorithm, weight);
        runToEnd(s);
        const cells = pathCells(s);

        expect(cells[0]).toBe(grid.start);
        expect(cells[cells.length - 1]).toBe(grid.goal);
        expect(cells.every((i) => grid.cost[i] !== WALL)).toBe(true);
        expect(new Set(cells).size).toBe(cells.length);

        for (let i = 1; i < cells.length; i++) {
          const a = cells[i - 1]!;
          const b = cells[i]!;
          const stepDistance =
            Math.abs(rowOf(grid, a) - rowOf(grid, b)) + Math.abs(colOf(grid, a) - colOf(grid, b));
          expect(stepDistance).toBe(1);
          expect(s.parent[b]).toBe(a);
        }
      }
    }
  });

  it("reports a cost that matches an independent tally", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        const s = createSearch(grid, algorithm, weight);
        runToEnd(s);
        const cells = pathCells(s);
        // Entering costs; the starting cell is never paid for.
        const tally = cells.slice(1).reduce((sum, i) => sum + grid.cost[i]!, 0);
        expect(s.pathCost).toBe(tally);
        expect(s.pathLength).toBe(cells.length - 1);
      }
    }
  });

  it("matches dist at the goal — moves for BFS, cost for the others", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    const bfs = createSearch(grid, "bfs");
    runToEnd(bfs);
    expect(bfs.dist[grid.goal]).toBe(bfs.pathLength);

    for (const algorithm of ["dijkstra", "astar"] as const) {
      const s = createSearch(grid, algorithm, 1);
      runToEnd(s);
      expect(s.dist[grid.goal]).toBe(s.pathCost);
    }
  });

  it("produces nothing when there is no path", () => {
    const s = createSearch(parseGrid(SEALED), "astar", 1);
    runToEnd(s);
    reconstructPath(s);
    expect(s.pathLength).toBe(0);
    expect(s.pathCost).toBe(0);
  });
});

// ------------------------------------------------------------ contracts ----

describe("engine contracts", () => {
  it("never edits the grid it was given", () => {
    for (const rows of [...Object.values(FIXTURES), SEALED, BOXED]) {
      const grid = parseGrid(rows);
      const before = snapshot(grid);
      for (const [algorithm, weight] of ALL_RUNS) {
        const s = createSearch(grid, algorithm, weight);
        runToEnd(s);
        reconstructPath(s);
      }
      expect(snapshot(grid)).toBe(before);
    }
  });

  it("is deterministic across repeated runs", () => {
    for (const rows of Object.values(FIXTURES)) {
      const grid = parseGrid(rows);
      for (const [algorithm, weight] of ALL_RUNS) {
        expect(trace(grid, algorithm, weight)).toEqual(trace(grid, algorithm, weight));
      }
    }
  });

  it("handles a 1x1 grid where start is the goal", () => {
    const grid = createGrid(1, 1, 0, 0);
    for (const [algorithm, weight] of ALL_RUNS) {
      const s = createSearch(grid, algorithm, weight);
      runToEnd(s);
      expect(s.status).toBe("solved");
      expect(s.pathLength).toBe(0);
      expect(s.explored).toBe(1);
    }
  });

  it("handles a 1xN corridor", () => {
    const grid = parseGrid(["S....G"]);
    for (const [algorithm, weight] of ALL_RUNS) {
      const s = createSearch(grid, algorithm, weight);
      runToEnd(s);
      expect(s.status).toBe("solved");
      expect(s.pathLength).toBe(5);
      expect(s.pathCost).toBe(5);
      expect(pathCells(s)).toEqual([0, 1, 2, 3, 4, 5]);
    }
  });

  it("never steps outside the grid from a corner or an edge", () => {
    // Start and goal in opposite corners of a wall-free grid: every boundary
    // cell gets expanded, so any out-of-bounds neighbour would show up.
    const grid = createGrid(5, 4, 0, 19);
    for (const [algorithm, weight] of ALL_RUNS) {
      const s = createSearch(grid, algorithm, weight);
      runToEnd(s);
      expect(s.status).toBe("solved");
      expect(s.pathLength).toBe(7);
      expect(Array.from(s.parent).every((p) => p >= -1 && p < 20)).toBe(true);
    }
  });

  it("gives up when the start is walled in", () => {
    for (const [algorithm, weight] of ALL_RUNS) {
      const s = createSearch(parseGrid(BOXED), algorithm, weight);
      runToEnd(s);
      expect(s.status).toBe("unreachable");
      expect(s.explored).toBe(1); // only the start itself
      expect(s.frontierSize).toBe(0);
    }
  });

  it("keeps the frontier count in step with the cells drawn as frontier", () => {
    const grid = parseGrid(DETOUR);
    const s = createSearch(grid, "astar", 1);
    while (s.status === "running") {
      step(s);
      const drawn = Array.from(s.state).filter((v) => v === 1).length;
      expect(s.frontierSize).toBe(drawn);
    }
  });
});

// -------------------------------------------------- fixture measurements ----

describe("fixture measurements (for the challenge budgets)", () => {
  it("records how each algorithm behaves on each fixture", () => {
    for (const [name, rows] of Object.entries(FIXTURES)) {
      const grid = parseGrid(rows);
      const optimal = solve(grid, "dijkstra").pathCost;
      for (const [algorithm, weight] of ALL_RUNS) {
        const r = solve(grid, algorithm, weight);
        expect(r.status).toBe("solved");
        expect(r.explored).toBeGreaterThan(0);
        expect(r.pathCost).toBeGreaterThanOrEqual(optimal);
        expect(name).toBeTruthy();
      }
    }
  });

  it("keeps the ingredients a challenge would need: cost and effort can disagree", () => {
    const grid = parseGrid(MUD_CORRIDOR);
    const bfs = solve(grid, "bfs");
    const dijkstra = solve(grid, "dijkstra");
    const astar = solve(grid, "astar", 1);

    // One algorithm fails on cost, another on effort, the third passes both —
    // which is exactly the shape a two-gate challenge needs.
    expect(bfs.pathCost).toBeGreaterThan(dijkstra.pathCost);
    expect(astar.pathCost).toBe(dijkstra.pathCost);
    expect(astar.explored).toBeLessThan(dijkstra.explored);
  });
});
