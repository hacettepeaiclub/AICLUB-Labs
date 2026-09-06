import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { labs, publishedLabs } from "../registry";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import { rewardPlaygroundMeta } from "./meta";
import {
  ACTIONS,
  CELL_COUNT,
  GOAL,
  START,
  TILE,
  TILE_REWARD_MAX,
  TILE_REWARD_MIN,
  isWall,
} from "./world";
import { bestValue, greedyAction, qAt, regimeOf, rolloutGreedy, train } from "./engine";
import {
  ARROWS,
  DEFAULT_SLIDER,
  SLIDER_MAX,
  SLIDER_MIN,
  behaviourOf,
  cellActions,
  checkpointsAreFrontLoaded,
  isGridKey,
  moveCursor,
  pathPoints,
  rewardToSlider,
  roomCells,
  sliderToReward,
  routeBlindSpots,
  valueCells,
} from "./view";

const runAt = (tileReward: number) => train({ tileReward, snapshots: true });

// ============================================================== 1. registry ==

describe("registry", () => {
  it("registers the lab exactly once", () => {
    expect(labs.filter((lab) => lab.meta.slug === rewardPlaygroundMeta.slug)).toHaveLength(1);
  });

  it("keeps every slug unique", () => {
    const slugs = labs.map((lab) => lab.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("shows up on the home page", () => {
    expect(publishedLabs().map((lab) => lab.meta.slug)).toContain("reward-playground");
  });

  it("declares an intro-level machine-learning lab with a duration", () => {
    expect(rewardPlaygroundMeta.category).toBe("machine-learning");
    expect(rewardPlaygroundMeta.difficulty).toBe("intro");
    expect(rewardPlaygroundMeta.minutes).toBeGreaterThan(0);
  });
});

// ================================================================== 2. i18n ==

describe("copy", () => {
  it("exists in both languages with three recap lessons", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs["reward-playground"];
      expect(copy.title.length).toBeGreaterThan(3);
      expect(copy.description.length).toBeGreaterThan(20);
      expect(copy.recap.lessons).toHaveLength(3);
      expect(copy.recap.footer.length).toBeGreaterThan(40);
    }
  });

  it("names all four actions in both languages", () => {
    for (const dict of [en, tr]) {
      for (const action of ACTIONS) {
        expect(dict.labs["reward-playground"].learn.actions[action].length).toBeGreaterThan(1);
      }
    }
  });

  it("describes all three behaviours in plain language, with no jargon", () => {
    for (const dict of [en, tr]) {
      const behaviour = dict.labs["reward-playground"].room.behaviour;
      for (const key of ["avoided", "passed", "stayed"] as const) {
        expect(behaviour[key].length).toBeGreaterThan(20);
      }
    }
    // The first screen must not teach the vocabulary.
    const room = JSON.stringify(en.labs["reward-playground"].room);
    for (const word of ["Q-learning", "Q-table", "Bellman", "epsilon", "gamma", "alpha", "policy"]) {
      expect(room.toLowerCase(), `room copy mentions "${word}"`).not.toContain(word.toLowerCase());
    }
  });

  it("carries the honesty note about what the robot did not learn", () => {
    expect(en.labs["reward-playground"].learn.honesty.length).toBeGreaterThan(60);
    expect(tr.labs["reward-playground"].learn.honesty.length).toBeGreaterThan(60);
    expect(en.labs["reward-playground"].learn.honesty).toMatch(/did not learn the whole room/i);
  });
});

// ============================================= 3-5. the reward slider itself ==

describe("the reward slider", () => {
  it("opens at a reward of −3", () => {
    expect(sliderToReward(DEFAULT_SLIDER)).toBe(-3);
  });

  it("spans exactly the range the world allows", () => {
    expect(sliderToReward(SLIDER_MIN)).toBe(TILE_REWARD_MIN);
    expect(sliderToReward(SLIDER_MAX)).toBe(TILE_REWARD_MAX);
    expect(SLIDER_MIN).toBeLessThan(SLIDER_MAX);
  });

  it("maps every whole slider position to an exact tenth, and back", () => {
    for (let value = SLIDER_MIN; value <= SLIDER_MAX; value++) {
      const reward = sliderToReward(value);
      expect(rewardToSlider(reward)).toBe(value);
      expect(Number.isFinite(reward)).toBe(true);
    }
  });

  it("changes what the robot actually does — the engine is rerun, not reskinned", () => {
    const behaviours = new Set<string>();
    const routes = new Set<string>();
    for (let value = SLIDER_MIN; value <= SLIDER_MAX; value += 5) {
      const rollout = rolloutGreedy(train({ tileReward: sliderToReward(value) }).q);
      behaviours.add(behaviourOf(rollout));
      routes.add(rollout.path.join(","));
    }
    expect(behaviours.size).toBe(3);
    expect(routes.size).toBeGreaterThan(2);
  });
});

// ================================================ 6-8. the three behaviours ==

describe("what the room shows", () => {
  it("at −4 the robot keeps off the square and still reaches the door", () => {
    const rollout = rolloutGreedy(train({ tileReward: -4 }).q);
    expect(behaviourOf(rollout)).toBe("avoided");
    expect(rollout.reachedGoal).toBe(true);
    expect(rollout.tileVisits).toBe(0);
  });

  it("at 0 it crosses the square on the way to the door", () => {
    const rollout = rolloutGreedy(train({ tileReward: 0 }).q);
    expect(behaviourOf(rollout)).toBe("passed");
    expect(rollout.reachedGoal).toBe(true);
    expect(rollout.tileVisits).toBe(1);
  });

  it("at +3 it never reaches the door and keeps returning to the square", () => {
    const rollout = rolloutGreedy(train({ tileReward: 3 }).q);
    expect(behaviourOf(rollout)).toBe("stayed");
    expect(rollout.reachedGoal).toBe(false);
    expect(rollout.tileVisits).toBeGreaterThanOrEqual(3);
  });

  it("agrees with the engine's own name for each behaviour", () => {
    for (const reward of [-4, -2, 0, 1, 3, 5]) {
      const rollout = rolloutGreedy(train({ tileReward: reward }).q);
      const map = { avoid: "avoided", ignore: "passed", farm: "stayed", stuck: "stuck" } as const;
      expect(behaviourOf(rollout)).toBe(map[regimeOf(rollout)]);
    }
  });

  it("draws the route from the rollout, cell for cell", () => {
    const rollout = rolloutGreedy(train({ tileReward: -4 }).q);
    const cells = roomCells(rollout.path);
    expect(cells).toHaveLength(CELL_COUNT);

    const visited = cells.filter((c) => c.visits > 0).map((c) => c.index);
    for (const index of visited) expect(rollout.path).toContain(index);
    // Every step after the first is counted exactly once.
    const total = cells.reduce((sum, c) => sum + c.visits, 0);
    expect(total).toBe(rollout.path.length - 1);

    const points = pathPoints(rollout.path);
    expect(points).toHaveLength(rollout.path.length);
    for (const point of points) {
      expect(point.x).toBeGreaterThan(0);
      expect(point.y).toBeGreaterThan(0);
    }
  });

  it("marks the walls, the square and the door where the world puts them", () => {
    const cells = roomCells([START]);
    expect(cells[TILE]!.kind).toBe("tile");
    expect(cells[GOAL]!.kind).toBe("goal");
    expect(cells[START]!.kind).toBe("start");
    for (const cell of cells) expect(cell.kind === "wall").toBe(isWall(cell.index));
  });
});

// ========================================= 10-12. the value map and scrubber ==

describe("the value map", () => {
  it("takes every value and arrow straight from the chosen snapshot", () => {
    const run = runAt(0);
    for (const index of [0, 5, 20, run.snapshots.length - 1]) {
      const snapshot = run.snapshots[index]!;
      const cells = valueCells(snapshot.q);
      expect(cells).toHaveLength(CELL_COUNT);
      for (const cell of cells) {
        if (cell.kind === "wall" || cell.index === GOAL) {
          expect(cell.value).toBe(0);
          expect(cell.action).toBeNull();
        } else {
          expect(cell.value).toBe(bestValue(snapshot.q, cell.index));
          expect(cell.action).toBe(greedyAction(snapshot.q, cell.index));
        }
      }
    }
  });

  it("shows different tables at different points of the scrubber", () => {
    const run = runAt(0);
    const early = valueCells(run.snapshots[2]!.q).map((c) => c.value).join(",");
    const late = valueCells(run.snapshots[run.snapshots.length - 1]!.q).map((c) => c.value).join(",");
    expect(early).not.toBe(late);
  });

  it("gives every cell an arrow glyph, so direction never needs colour", () => {
    for (const action of ACTIONS) expect(ARROWS[action]).toMatch(/[↑↓←→]/);
    expect(new Set(ACTIONS.map((a) => ARROWS[a])).size).toBe(4);
  });

  it("takes the four action values of a cell straight from the snapshot", () => {
    const run = runAt(2);
    const snapshot = run.snapshots[run.snapshots.length - 1]!;
    for (const cell of [START, TILE, 7, 25]) {
      const entries = cellActions(snapshot.q, cell);
      expect(entries).toHaveLength(4);
      for (const entry of entries) expect(entry.value).toBe(qAt(snapshot.q, cell, entry.action));
      expect(entries.filter((e) => e.best)).toHaveLength(1);
      expect(entries.find((e) => e.best)!.action).toBe(greedyAction(snapshot.q, cell));
    }
  });

  it("uses the engine's non-linear checkpoints, not an even spread", () => {
    const run = runAt(0);
    expect(run.snapshots.length).toBeGreaterThan(50);
    expect(checkpointsAreFrontLoaded(run.snapshots)).toBe(true);

    const episodes = run.snapshots.map((s) => s.episode);
    const gaps = episodes.slice(1).map((e, i) => e - episodes[i]!);
    // An even spread would have one gap; a front-loaded schedule has many.
    expect(new Set(gaps).size).toBeGreaterThan(3);
    expect(Math.max(...gaps)).toBeGreaterThan(Math.min(...gaps) * 4);
  });

  it("reports the blind spots the honesty note is actually about", () => {
    const run = runAt(0);
    const last = routeBlindSpots(run.snapshots[run.snapshots.length - 1]!.q);
    const walked = rolloutGreedy(run.snapshots[run.snapshots.length - 1]!.q).path;
    const open = Array.from({ length: CELL_COUNT }, (_, i) => i).filter(
      (i) => !isWall(i) && i !== GOAL,
    );
    // Derived from the route, never asserted as a remembered number — and it
    // must stay above zero at the end of training, or the figure would
    // contradict the note printed beside it.
    expect(last).toBe(open.filter((cell) => !walked.includes(cell)).length);
    expect(last).toBeGreaterThan(0);
  });
});

describe("value really spreads as the scrubber moves", () => {
  it("has almost nothing positive early and most of the room positive later", () => {
    const run = runAt(0);
    const positives = (episode: number) => {
      const snapshot = run.snapshots.find((s) => s.episode === episode)!;
      return valueCells(snapshot.q).filter((c) => c.kind !== "wall" && c.value > 0).length;
    };
    expect(positives(20)).toBeLessThanOrEqual(2);
    expect(positives(60)).toBeGreaterThanOrEqual(20);
  });
});

// ============================================================== keyboard ====

describe("keyboard navigation of the map", () => {
  it("recognises exactly the keys the grid handles", () => {
    for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]) {
      expect(isGridKey(key)).toBe(true);
    }
    for (const key of ["a", "Enter", " ", "Tab", "Escape"]) expect(isGridKey(key)).toBe(false);
  });

  it("never lands the cursor on a wall", () => {
    const open = Array.from({ length: CELL_COUNT }, (_, i) => i).filter((i) => !isWall(i));
    for (const cell of open) {
      for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]) {
        const next = moveCursor(cell, key);
        expect(isWall(next), `${cell} + ${key} -> ${next}`).toBe(false);
      }
    }
  });

  it("stays put at the edge rather than wrapping around", () => {
    expect(moveCursor(START, "ArrowUp")).toBe(START);
    expect(moveCursor(START, "ArrowRight")).toBe(START);
    expect(moveCursor(GOAL, "ArrowDown")).toBe(GOAL);
    expect(moveCursor(GOAL, "ArrowLeft")).toBe(GOAL);
  });

  it("reaches every open cell from every other one", () => {
    const open = Array.from({ length: CELL_COUNT }, (_, i) => i).filter((i) => !isWall(i));
    const seen = new Set<number>([START]);
    const queue = [START];
    for (let head = 0; head < queue.length; head++) {
      for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
        const next = moveCursor(queue[head]!, key);
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    expect(seen.size).toBe(open.length);
  });
});

// ============================== 9, 14. nothing hardcoded, nothing extra ======

describe("the components", () => {
  const SOURCES = [
    "src/labs/reward-playground/index.tsx",
    "src/labs/reward-playground/components/RoomView.tsx",
    "src/labs/reward-playground/components/LearningTrace.tsx",
  ];
  const read = (path: string) => readFileSync(path, "utf8");

  it("contain none of the measured results the engine produces", () => {
    // Step counts, tile visits and regime shares are all things a developer
    // might paste in after seeing them once. None of them may appear.
    const measured = new Set<string>();
    for (const reward of [-5, -4, -3, -2, 0, 1, 3, 5]) {
      const rollout = rolloutGreedy(train({ tileReward: reward }).q);
      measured.add(String(rollout.steps));
      measured.add(String(rollout.tileVisits));
    }
    measured.add("25.7");
    measured.add("51.5");
    measured.add("22.8");
    for (const path of SOURCES) {
      const source = read(path);
      for (const value of measured) {
        expect(source.includes(`${value}%`), `${path} contains "${value}%"`).toBe(false);
        // A bare small integer is a loop bound or an index far more often than
        // it is a measured result, so the ambiguous shapes start at 5.
        if (Number(value) < 5) continue;
        for (const shape of [`{${value}}`, `>${value}<`, `= ${value}`]) {
          expect(source.includes(shape), `${path} contains "${shape}"`).toBe(false);
        }
      }
    }
  });

  it("derive every number through the view helpers or the engine", () => {
    const room = read(SOURCES[1]!);
    expect(room).toMatch(/from "\.\.\/view"/);
    expect(room).toMatch(/roomCells|pathPoints|behaviourOf/);
    const trace = read(SOURCES[2]!);
    expect(trace).toMatch(/valueCells/);
    expect(trace).toMatch(/cellActions/);
    // Only the page runs training; the two views receive its result.
    expect(read(SOURCES[0]!)).toMatch(/\btrain\s*\(/);
    for (const path of SOURCES.slice(1)) {
      expect(read(path), `${path} should not train`).not.toMatch(/\btrain\s*\(/);
    }
  });

  it("ship exactly two primary controls and nothing resembling a dashboard", () => {
    const all = SOURCES.map(read).join("\n");
    const sliders = all.match(/<LabSlider/g) ?? [];
    expect(sliders).toHaveLength(2); // the reward, and the scrubber
    for (const banned of [
      "Run",
      "Reset",
      "Step ",
      "epsilon",
      "alpha",
      "gamma",
      "score",
      "Leaderboard",
      "badge",
      "challenge",
    ]) {
      expect(all.includes(`>${banned}`), `a control named ${banned}`).toBe(false);
    }
    // No <Button> at all: neither section needs one.
    expect(all.includes("<Button")).toBe(false);
  });

  it("keep their prose in the dictionary", () => {
    for (const path of SOURCES) {
      expect(read(path), `${path} has bare JSX prose`).not.toMatch(
        />\s*[A-Z][a-z]+ [a-z]+[^<{]*</,
      );
    }
  });

  it("honour reduced motion in the one place anything moves", () => {
    const room = read(SOURCES[1]!);
    expect(room).toMatch(/useReducedMotion/);
    // The walk is a finite transition, not a standing loop.
    expect(room).toMatch(/cancelAnimationFrame/);
    expect(read(SOURCES[2]!)).not.toMatch(/requestAnimationFrame/);
  });
});
