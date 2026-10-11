/** English prose for the graph-search lab. Its shape is the contract `tr/graph-search.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    astar:
      "Supports the A* formulation the lab runs: a best-first search ordered by cost-so-far plus a heuristic estimate, and the admissibility condition that heuristic has to meet.",
    dijkstra:
      "Supports the shortest-path method the lab runs when the heuristic is switched off, and the non-negative edge costs it assumes.",
  },
  findTheWay: "Find the way",
  algorithm: "Algorithm",
  draw: "Draw",
  gridAndKeys: "Map tools and keyboard",
  map: "Map",
  tools: { wall: "Wall", mud: "Mud", erase: "Erase", start: "Start", goal: "Goal" },
  legend: {
    wall: "wall",
    frontier: "frontier",
    settled: "settled",
    path: "path",
    mud: "mud",
  },
  metrics: { explored: "Explored", path: "Path", cost: "Cost", noPath: "No path" },
  steps: (n: number) => `${n} steps`,
  gridLabel: (walls: number, mud: number, state: string) =>
    `Editable grid. Walls: ${walls}. Mud cells: ${mud}. ${state}`,
  gridHelp: "Drag on the grid to draw. With it focused, arrow keys move and Space paints.",
  gridHelpFull: {
    drag: "Drag on the grid to draw or erase. Drag",
    or: "or",
    toMove: "to move them. With the grid focused, the arrow keys move a cursor,",
    toggles: "toggles a cell, and",
    drops: "drops a marker.",
  },
  gridSummary: (
    cols: number,
    rows: number,
    start: string,
    goal: string,
    walls: number,
    mud: number,
    algorithm: string,
    result: string,
  ) =>
    `Pathfinding grid, ${cols} columns by ${rows} rows. Start at ${start}. Goal at ${goal}. Walls: ${walls}. Mud cells: ${mud}. Algorithm: ${algorithm}. ${result}`,
  status: {
    solved: (explored: number, steps: number, cost: number) =>
      `Solved: ${explored} cells explored, path ${steps} steps, cost ${cost}.`,
    unreachable: (explored: number) => `No path exists. ${explored} cells explored.`,
    running: (explored: number) => `Searching. ${explored} cells explored so far.`,
    notStarted: "Not started.",
    gridReset: "Grid reset.",
    gridCleared: "Grid cleared.",
    selected: (algorithm: string) => `${algorithm} selected.`,
    loaded: (map: string) => `${map} loaded.`,
  },
  row: (row: number, col: number) => `row ${row}, column ${col}`,
  intro: {
    // Behaviour first: one question, then the grid. The old section opened
    // straight into an instruction, which told the visitor what to do
    // without telling them what to watch for.
    question: "Which square does it look at first?",
    caption:
      "Draw a few walls, then press Run. Watch where the search actually goes, including everywhere the goal isn't.",
  },
  bfs: {
    kicker: "Watch it think",
    title: "It spreads in layers, not lines.",
    lede: "Step through it. Cells with a ring are known but unvisited: the frontier. Filled cells are settled: the search already knows the fewest moves to each one and will never look again.",
    caption:
      "Taking cells first-in, first-out is the whole trick: it settles them in order of distance, so the first route to reach the goal is the shortest one. That is breadth-first search.",
  },
  cost: {
    kicker: "Distance isn't cost",
    title: "Some ground is slower.",
    lede: "Mud costs 5 to enter; open ground costs 1. Run BFS across it, then Dijkstra, and compare the two numbers under the grid.",
    caption:
      "BFS still takes the fewest moves: straight through the swamp. Dijkstra takes more steps and pays less, because it always settles the cheapest cell it knows about rather than the nearest one.",
  },
  astar: {
    kicker: "Give the search a hint",
    title: "Right answer, far less looking.",
    lede: "Dijkstra has no idea where the goal is, so it spreads evenly in every direction. A* adds an estimate of the distance left and follows it: f = g + h, where g is the cost so far and h is the heuristic, an estimate of what is left.",
    caption:
      "Same path, same cost. Look at Explored. The heuristic here is Manhattan distance. It can never overstate what is left on a four-way grid, which makes it admissible, and that is exactly why A* gives up nothing by trusting it.",
  },
  challenge: {
    kicker: "The challenge",
    title: "Same answer, less work.",
    lede: "Three fixed maps. Each one wants the cheapest path AND a search that settles no more cells than the budget. One of those is easy on its own; both together are the point.",
    mazeLabel: (
      title: string,
      cols: number,
      rows: number,
      cost: number,
      budget: number,
      algorithm: string,
    ) =>
      `${title}: a fixed ${cols} by ${rows} maze. Reach the goal at the optimal cost of ${cost} while settling no more than ${budget} cells. Current algorithm: ${algorithm}.`,
    bothAtOnce: "Both at once",
    beaten: (done: number, total: number) => `${done} of ${total} beaten`,
    costMustBe: "cost must be",
    exploredAtMost: "explored at most",
    maps: {
      swamp: {
        title: "The swamp",
        hint: "The quickest way across is not the cheapest.",
      },
      "open-ground": {
        title: "Open ground",
        hint: "Nothing here is expensive. The only thing to save is effort.",
      },
      "wrong-door": {
        title: "The wrong door",
        hint: "The goal is close. The way in is not.",
      },
    },
    budget: (cost: number, budget: number) =>
      `Cheapest path costs ${cost}. Settle at most ${budget} cells.`,
    verdict: {
      unreachable: "That search never reached the goal.",
      solved: (cost: number, explored: number) =>
        `Solved. Cost ${cost}, and only ${explored} cells settled.`,
      overBudget: (explored: number, budget: number) =>
        `Optimal path, but you explored ${explored} cells. Budget: ${budget}.`,
      suboptimal: (explored: number, cost: number, optimal: number) =>
        `You explored only ${explored} cells, but your path costs ${cost}. Optimal cost: ${optimal}.`,
      both: (cost: number, optimal: number, explored: number, budget: number) =>
        `Your path costs ${cost} against an optimal ${optimal}, and it explored ${explored} cells against a budget of ${budget}.`,
    },
  },
  recap: {
    lessons: [
      "A search does not head for the goal: it spreads until the goal is one of the things it has reached",
      "BFS takes cells first-in, first-out, so it settles them in order of fewest moves",
      "Fewest moves and cheapest route are different questions once the ground stops being uniform",
      "Dijkstra always settles the cheapest cell it knows about, which is why its answer is the cheapest one",
      "A* adds an estimate of what is left, and spends its effort in the direction of the goal",
      "The estimate never overstates the distance, so A* gives up nothing to get there faster",
    ],
    footer:
      "Every route your phone has ever suggested came out of a loop like this one: a frontier, a settled set, and a rule for which cell to look at next.",
  },
};

export default copy;
