import { describe, expect, it } from "vitest";
import {
  ACTIONS,
  ACTION_COUNT,
  CELL_COUNT,
  COLS,
  FREE_CELLS,
  GOAL,
  GOAL_REWARD,
  MAX_EPISODE_STEPS,
  ROWS,
  START,
  STEP_REWARD,
  TILE,
  TILE_REWARD_MAX,
  TILE_REWARD_MIN,
  WALLS,
  colOf,
  distancesFrom,
  indexOf,
  isTerminal,
  isWall,
  nextState,
  reward,
  rowOf,
  type Action,
} from "./world";
import {
  ALPHA,
  EPISODES,
  EPSILON_MIN,
  EPSILON_START,
  GAMMA,
  SEED,
  bestValue,
  checkpointEpisodes,
  chooseAction,
  createQ,
  greedyAction,
  greedyPolicy,
  qAt,
  qUpdate,
  regimeOf,
  rolloutGreedy,
  train,
  valueMap,
  type Regime,
} from "./engine";

/**
 * The suite asserts relations and independent recomputation, not remembered
 * numbers. The few concrete figures that do appear are the acceptance gates,
 * where the number *is* the promise the lab makes.
 *
 * Two independent implementations live in this file and share no code with the
 * engine: a naive Q-learning replica written straight from the update rule,
 * and a value-iteration oracle that solves the world exactly. Between them
 * they make a hardcoded result impossible to slip in.
 */

// ============================================ an independent copy of the world

/** The room, written out again from the design, to check `world.ts` against. */
const LAYOUT = [".....S", "......", "...#..", "##..##", "##T.##", "G....."] as const;

const refWall = (r: number, c: number) => LAYOUT[r]![c] === "#";
const refIndex = (r: number, c: number) => r * 6 + c;

function refStep(state: number, action: number): number {
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;
  const [dr, dc] = deltas[action]!;
  const r = Math.floor(state / 6) + dr;
  const c = (state % 6) + dc;
  if (r < 0 || r > 5 || c < 0 || c > 5) return state;
  return refWall(r, c) ? state : refIndex(r, c);
}

const REF_TILE = refIndex(4, 2);
const REF_GOAL = refIndex(5, 0);
const REF_START = refIndex(0, 5);

const refReward = (from: number, next: number, c: number) =>
  -0.5 + (next === REF_TILE && next !== from ? c : 0) + (next === REF_GOAL ? 20 : 0);

// ================================================================= 1. world ==

describe("the room", () => {
  it("is 6 by 6", () => {
    expect(ROWS).toBe(6);
    expect(COLS).toBe(6);
    expect(CELL_COUNT).toBe(36);
  });

  it("puts the start, the goal and the tile where the design says", () => {
    expect([rowOf(START), colOf(START)]).toEqual([0, 5]);
    expect([rowOf(GOAL), colOf(GOAL)]).toEqual([5, 0]);
    expect([rowOf(TILE), colOf(TILE)]).toEqual([4, 2]);
  });

  it("has exactly the walls the independent layout has", () => {
    const fromLayout: number[] = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) if (refWall(r, c)) fromLayout.push(refIndex(r, c));
    }
    expect([...WALLS].sort((a, b) => a - b)).toEqual(fromLayout);
    for (let i = 0; i < CELL_COUNT; i++) {
      expect(isWall(i), `cell ${i}`).toBe(refWall(Math.floor(i / 6), i % 6));
    }
  });

  it("leaves 27 cells, and every one of them is reachable from the start", () => {
    expect(FREE_CELLS).toHaveLength(27);
    const dist = distancesFrom(START);
    for (const cell of FREE_CELLS) expect(dist[cell], `cell ${cell}`).toBeGreaterThanOrEqual(0);
    expect(FREE_CELLS.filter((c) => dist[c]! >= 0)).toHaveLength(27);
  });

  it("has exactly four actions", () => {
    expect(ACTION_COUNT).toBe(4);
    expect([...ACTIONS]).toEqual([0, 1, 2, 3]);
  });

  it("moves exactly as the independent transition does, from every cell", () => {
    for (const cell of FREE_CELLS) {
      for (const action of ACTIONS) {
        expect(nextState(cell, action), `cell ${cell} action ${action}`).toBe(
          refStep(cell, action),
        );
      }
    }
  });

  it("keeps the robot in place when it walks into a wall or off the edge", () => {
    // Top-right start: up and right are both the edge.
    expect(nextState(START, 0)).toBe(START);
    expect(nextState(START, 3)).toBe(START);
    // The tile is walled in on its left.
    expect(nextState(TILE, 2)).toBe(TILE);
    // ...and a bump still costs a step.
    expect(reward(TILE, nextState(TILE, 2), 0)).toBe(STEP_REWARD);
  });

  it("makes the goal terminal and nothing else", () => {
    expect(isTerminal(GOAL)).toBe(true);
    for (const cell of FREE_CELLS) if (cell !== GOAL) expect(isTerminal(cell)).toBe(false);
  });

  it("pays the step cost, the tile and the goal exactly as specified", () => {
    expect(reward(indexOf(1, 0), indexOf(1, 1), 3)).toBe(STEP_REWARD);
    expect(reward(indexOf(3, 2), TILE, 3)).toBe(STEP_REWARD + 3);
    expect(reward(indexOf(3, 2), TILE, -4)).toBe(STEP_REWARD - 4);
    expect(reward(indexOf(5, 1), GOAL, 3)).toBe(STEP_REWARD + GOAL_REWARD);
    // Standing still on the tile collects nothing: the tile pays for arriving.
    expect(reward(TILE, TILE, 3)).toBe(STEP_REWARD);
    expect(GOAL_REWARD).toBe(20);
    expect(STEP_REWARD).toBe(-0.5);
    expect(MAX_EPISODE_STEPS).toBe(60);
    expect([TILE_REWARD_MIN, TILE_REWARD_MAX]).toEqual([-5, 5]);
  });

  it("puts the tile on the shortest route, with a bypass exactly two steps longer", () => {
    // The single geometric fact the whole lab depends on.
    const direct = distancesFrom(START)[GOAL]!;
    const around = distancesFrom(START, TILE)[GOAL]!;
    expect(direct).toBe(10);
    expect(around).toBe(12);
    expect(around - direct).toBe(2);
  });
});

// ================================================================ 2. Markov ==

describe("the world is Markov", () => {
  it("gives a move the same reward however the robot arrived", () => {
    // Every neighbour of the tile, entered from every direction, pays the same.
    const entries = FREE_CELLS.flatMap((cell) =>
      ACTIONS.filter((a) => nextState(cell, a) === TILE && cell !== TILE).map((a) =>
        reward(cell, nextState(cell, a), 2),
      ),
    );
    expect(entries.length).toBeGreaterThan(1);
    expect(new Set(entries).size).toBe(1);
  });

  it("pays for the tile again on every single entry, not just the first", () => {
    // Walk on and off the tile repeatedly; the payout never decays, which is
    // what keeps position alone a sufficient state.
    let state = TILE;
    const payouts: number[] = [];
    for (let i = 0; i < 12; i++) {
      const off = nextState(state, 0); // step up, off the tile
      const back = nextState(off, 1); // and back down onto it
      expect(off).not.toBe(TILE);
      expect(back).toBe(TILE);
      payouts.push(reward(off, back, 2.5));
      state = back;
    }
    expect(new Set(payouts).size).toBe(1);
    expect(payouts[0]).toBe(STEP_REWARD + 2.5);
  });

  it("depends only on the next state, matching the independent reward function", () => {
    for (const c of [-5, -1.25, 0, 0.5, 3, 5]) {
      for (const cell of FREE_CELLS) {
        for (const action of ACTIONS) {
          const next = nextState(cell, action);
          expect(reward(cell, next, c)).toBeCloseTo(refReward(cell, next, c), 12);
        }
      }
    }
  });
});

// ============================================================== 3. Q-update ==

describe("the Q-learning update", () => {
  it("matches the rule computed by hand", () => {
    const q = createQ();
    const state = indexOf(1, 1);
    const action: Action = 1;
    const next = nextState(state, action);
    q[next * ACTION_COUNT + 0] = 3;
    q[next * ACTION_COUNT + 2] = 7; // the max
    const before = qAt(q, state, action);
    const r = reward(state, next, 0);

    const expected = before + ALPHA * (r + GAMMA * 7 - before);
    expect(qUpdate(q, state, action, r, next, false)).toBeCloseTo(expected, 12);
    expect(qAt(q, state, action)).toBeCloseTo(expected, 12);
  });

  it("uses the largest action value of the next state, not the taken one", () => {
    const q = createQ();
    const state = indexOf(1, 1);
    const next = nextState(state, 1);
    for (const a of ACTIONS) q[next * ACTION_COUNT + a] = a === 3 ? 9 : -2;
    expect(bestValue(q, next)).toBe(9);
    qUpdate(q, state, 1, 0, next, false);
    expect(qAt(q, state, 1)).toBeCloseTo(ALPHA * GAMMA * 9, 12);
  });

  it("moves a fraction alpha of the way to the target", () => {
    const q = createQ();
    const s = indexOf(0, 0);
    q[s * ACTION_COUNT + 1] = 10;
    qUpdate(q, s, 1, 0, s, true, 0.25); // target is just r = 0
    expect(qAt(q, s, 1)).toBeCloseTo(7.5, 12);
  });
});

// ================================================ 4. terminal vs truncation ==

describe("terminal and truncation", () => {
  it("does not bootstrap when the goal is entered", () => {
    const q = createQ();
    const before = indexOf(5, 1);
    const action = ACTIONS.find((a) => nextState(before, a) === GOAL)!;
    // Poison the goal's row: if it were used, the result would show it.
    for (const a of ACTIONS) q[GOAL * ACTION_COUNT + a] = 1000;
    const r = reward(before, GOAL, 0);
    qUpdate(q, before, action, r, GOAL, true);
    expect(qAt(q, before, action)).toBeCloseTo(ALPHA * r, 12);
  });

  it("does bootstrap when an episode is merely cut off", () => {
    const q = createQ();
    const s = indexOf(1, 1);
    const next = nextState(s, 1);
    for (const a of ACTIONS) q[next * ACTION_COUNT + a] = 4;
    const r = reward(s, next, 0);
    // Truncation is not terminal: the world did not end.
    qUpdate(q, s, 1, r, next, false);
    expect(qAt(q, s, 1)).toBeCloseTo(ALPHA * (r + GAMMA * 4), 12);
  });

  it("stops an episode at the goal and cuts it off at the step limit", () => {
    // Reaching the goal ends it: a farming run uses every one of its steps,
    // a goal-seeking one does not.
    const farming = train({ tileReward: 5, episodes: 40 });
    const seeking = train({ tileReward: 0, episodes: 40 });
    expect(regimeOf(rolloutGreedy(farming.q))).not.toBe("ignore");
    expect(rolloutGreedy(seeking.q).steps).toBeLessThan(MAX_EPISODE_STEPS);
  });
});

// ========================================================= 5. epsilon-greedy ==

describe("epsilon-greedy", () => {
  const rngOf = (seed: number) => {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  it("always takes the best known action when epsilon is 0", () => {
    const q = createQ();
    const state = indexOf(2, 2);
    q[state * ACTION_COUNT + 3] = 5;
    const rng = rngOf(1);
    for (let i = 0; i < 200; i++) expect(chooseAction(q, state, 0, rng)).toBe(3);
    expect(greedyAction(q, state)).toBe(3);
  });

  it("ignores the best action entirely when epsilon is 1, and spreads over all four", () => {
    const q = createQ();
    const state = indexOf(2, 2);
    q[state * ACTION_COUNT + 3] = 5; // would always win if it were greedy
    const rng = rngOf(2024);
    const counts = [0, 0, 0, 0];
    const n = 4000;
    for (let i = 0; i < n; i++) counts[chooseAction(q, state, 1, rng)]! += 1;
    for (const c of counts) {
      expect(c).toBeGreaterThan(n / 4 - 200);
      expect(c).toBeLessThan(n / 4 + 200);
    }
  });

  it("breaks ties towards the lowest action, so an untouched table is deterministic", () => {
    const q = createQ();
    for (const cell of FREE_CELLS) expect(greedyAction(q, cell)).toBe(0);
  });

  it("decays epsilon from 1 to the floor across the run", () => {
    expect(EPSILON_START).toBe(1);
    expect(EPSILON_MIN).toBe(0.05);
    const decay = Math.pow(EPSILON_MIN / EPSILON_START, 1 / (EPISODES - 1));
    expect(EPSILON_START * decay ** (EPISODES - 1)).toBeCloseTo(EPSILON_MIN, 12);
  });
});

// ====================================== an independent Q-learning replica ====

/**
 * The whole algorithm again, written from the update rule with its own grid,
 * its own reward function and its own copy of mulberry32.
 *
 * This is the test that makes a hardcoded result impossible: if anyone ever
 * replaces the learning with a stored table, or quietly nudges a trajectory to
 * make a screenshot nicer, the two implementations diverge here.
 */
function naiveTrain(tileReward: number, episodes: number, seed: number) {
  let a0 = seed >>> 0;
  const rng = () => {
    a0 |= 0;
    a0 = (a0 + 0x6d2b79f5) | 0;
    let t = Math.imul(a0 ^ (a0 >>> 15), 1 | a0);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const q: number[] = new Array(36 * 4).fill(0);
  const argmax = (s: number) => {
    let best = -Infinity;
    let arg = 0;
    for (let a = 0; a < 4; a++) {
      const v = q[s * 4 + a]!;
      if (v > best) {
        best = v;
        arg = a;
      }
    }
    return arg;
  };
  const maxOf = (s: number) => {
    let best = -Infinity;
    for (let a = 0; a < 4; a++) best = Math.max(best, q[s * 4 + a]!);
    return best;
  };

  const decay = Math.pow(0.05 / 1, 1 / (episodes - 1));
  let eps = 1;
  for (let e = 1; e <= episodes; e++) {
    let s = REF_START;
    for (let t = 0; t < 60; t++) {
      const a = rng() < eps ? Math.min(3, Math.floor(rng() * 4)) : argmax(s);
      const s2 = refStep(s, a);
      const r = refReward(s, s2, tileReward);
      const terminal = s2 === REF_GOAL;
      const target = terminal ? r : r + 0.95 * maxOf(s2);
      q[s * 4 + a] = q[s * 4 + a]! + 0.5 * (target - q[s * 4 + a]!);
      s = s2;
      if (terminal) break;
    }
    eps = Math.max(0.05, eps * decay);
  }
  return q;
}

describe("nothing is hardcoded", () => {
  it("matches an independent implementation of the whole algorithm, bit for bit", () => {
    for (const tileReward of [-4, -1, 0, 1.5, 3, 5]) {
      for (const seed of [SEED, 7]) {
        const mine = train({ tileReward, episodes: 200, seed }).q;
        const theirs = naiveTrain(tileReward, 200, seed);
        for (let i = 0; i < mine.length; i++) {
          expect(mine[i], `tile=${tileReward} seed=${seed} index=${i}`).toBeCloseTo(
            theirs[i]!,
            12,
          );
        }
      }
    }
  });

  it("matches it over a full-length run too", () => {
    const mine = train({ tileReward: 3, episodes: EPISODES, seed: SEED }).q;
    const theirs = naiveTrain(3, EPISODES, SEED);
    for (let i = 0; i < mine.length; i++) expect(mine[i]).toBeCloseTo(theirs[i]!, 12);
  });

  it("draws its route from the table rather than storing one", () => {
    // Corrupt one action's value and the walked path must change.
    const { q } = train({ tileReward: 0 });
    const before = rolloutGreedy(q).path.join(",");
    const poisoned = Float64Array.from(q);
    const first = greedyAction(q, START);
    poisoned[START * ACTION_COUNT + first] = -1e6;
    expect(rolloutGreedy(poisoned).path.join(",")).not.toBe(before);
  });
});

// =============================== an independent exact solver (the G8 oracle) ==

/**
 * Value iteration over the same world, sharing no code with the learner.
 * It says what the *optimal* behaviour is; Q-learning has to find it on its
 * own, and gate G8 checks how often it does.
 */
function solveExactly(tileReward: number) {
  const cells: number[] = [];
  for (let i = 0; i < 36; i++) if (!refWall(Math.floor(i / 6), i % 6)) cells.push(i);
  const V = new Float64Array(36);
  for (let sweep = 0; sweep < 20000; sweep++) {
    let delta = 0;
    for (const i of cells) {
      if (i === REF_GOAL) continue;
      let best = -Infinity;
      for (let a = 0; a < 4; a++) {
        const j = refStep(i, a);
        const value = refReward(i, j, tileReward) + (j === REF_GOAL ? 0 : 0.95 * V[j]!);
        if (value > best) best = value;
      }
      delta = Math.max(delta, Math.abs(best - V[i]!));
      V[i] = best;
    }
    if (delta < 1e-12) break;
  }
  const policy = new Int8Array(36).fill(-1);
  for (const i of cells) {
    if (i === REF_GOAL) continue;
    let best = -Infinity;
    let arg = 0;
    for (let a = 0; a < 4; a++) {
      const j = refStep(i, a);
      const value = refReward(i, j, tileReward) + (j === REF_GOAL ? 0 : 0.95 * V[j]!);
      if (value > best + 1e-12) {
        best = value;
        arg = a;
      }
    }
    policy[i] = arg;
  }
  return { V, policy };
}

function regimeOfPolicy(policy: Int8Array): Regime {
  let s = REF_START;
  let tileVisits = 0;
  const seen = new Set<number>();
  for (let t = 0; t < 300; t++) {
    const a = policy[s]!;
    if (a < 0) break;
    const key = s * 4 + a;
    if (seen.has(key)) return tileVisits > 0 ? "farm" : "stuck";
    seen.add(key);
    const j = refStep(s, a);
    if (j === REF_TILE) tileVisits += 1;
    if (j === REF_GOAL) return tileVisits > 0 ? "ignore" : "avoid";
    s = j;
  }
  return "stuck";
}

// ============================================================== 6. + gates ===

describe("G6 — determinism", () => {
  it("produces a bit-identical table from the same seed", () => {
    const a = train({ tileReward: 2 }).q;
    const b = train({ tileReward: 2 }).q;
    expect(Array.from(a)).toEqual(Array.from(b));
    for (let i = 0; i < a.length; i++) expect(Object.is(a[i], b[i])).toBe(true);
  });

  it("produces a different table from a different seed", () => {
    const a = train({ tileReward: 2, seed: SEED }).q;
    const b = train({ tileReward: 2, seed: 999 }).q;
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });

  it("is unaffected by having asked for snapshots", () => {
    const plain = train({ tileReward: -1 }).q;
    const withSnaps = train({ tileReward: -1, snapshots: true }).q;
    expect(Array.from(plain)).toEqual(Array.from(withSnaps));
  });
});

describe("acceptance gates", () => {
  const walk = (tileReward: number) => rolloutGreedy(train({ tileReward }).q);

  it("G1 — a strong penalty makes it take the long way around", () => {
    const r = walk(-4);
    expect(r.reachedGoal).toBe(true);
    expect(r.tileVisits).toBe(0);
    expect(r.steps).toBe(12);
    expect(regimeOf(r)).toBe("avoid");
  });

  it("G2 — a worthless tile is simply walked over on the shortest route", () => {
    const { q } = train({ tileReward: 0 });
    const r = rolloutGreedy(q);
    expect(r.reachedGoal).toBe(true);
    expect(r.tileVisits).toBe(1);
    expect(r.steps).toBe(10);
    expect(regimeOf(r)).toBe("ignore");
    // And the goal is genuinely worth walking to.
    expect(solveExactly(0).V[REF_START]!).toBeGreaterThan(0);
    expect(bestValue(q, START)).toBeGreaterThan(0);
  });

  it("G3 — a large reward makes it abandon the goal, and only once farming pays", () => {
    const r = walk(3);
    expect(r.reachedGoal).toBe(false);
    expect(r.tileVisits).toBeGreaterThanOrEqual(3);
    expect(regimeOf(r)).toBe("farm");

    // The threshold must be reached because the loop became profitable, not
    // because the goal became too far to bother with: a two-step cycle has to
    // out-earn its own step cost before any farming appears.
    let threshold = Infinity;
    for (let i = 0; i <= 100; i++) {
      const c = i / 10 - 5;
      if (regimeOfPolicy(solveExactly(c).policy) === "farm") {
        threshold = c;
        break;
      }
    }
    expect(threshold).toBeGreaterThanOrEqual(2 * Math.abs(STEP_REWARD));
  });

  it("G4 — each of the three behaviours covers at least 20% of the slider", () => {
    const counts: Record<string, number> = { avoid: 0, ignore: 0, farm: 0, stuck: 0 };
    const n = 101;
    for (let i = 0; i < n; i++) {
      counts[regimeOf(walk(i / 10 - 5))]! += 1;
    }
    expect(counts.stuck).toBe(0);
    for (const key of ["avoid", "ignore", "farm"]) {
      expect((100 * counts[key]!) / n, `${key} share`).toBeGreaterThanOrEqual(20);
    }
  });

  it("G5 — the behaviour is settled through the last fifth of training", () => {
    // Measured on what the lab actually claims and the visitor actually sees:
    // which of the three behaviours the robot ends up in, and how long it
    // takes. Comparing the greedy action of every cell instead would measure
    // two different things that are both real and neither of which is
    // "settled": cells the robot stopped visiting never finish learning (G9b),
    // and where two routes are exactly the same length the tie-break between
    // them keeps flipping on differences of 1e-15.
    for (const tileReward of [-4, -3, -2.5, 0, 1, 1.5, 2, 3, 5]) {
      const run = train({ tileReward, snapshots: true });
      const final = rolloutGreedy(run.q);
      const tail = run.snapshots.slice(Math.floor(run.snapshots.length * 0.8));
      expect(tail.length).toBeGreaterThan(4);
      const settled = tail.filter((s) => {
        const r = rolloutGreedy(s.q);
        return regimeOf(r) === regimeOf(final) && r.steps === final.steps;
      }).length;
      expect((100 * settled) / tail.length, `tile=${tileReward}`).toBeGreaterThanOrEqual(90);
    }
  });

  it("G5b — what still varies late in training is only a tie between equal routes", () => {
    // At most a couple of distinct routes survive to the end, they are all the
    // same length, and they all produce the same behaviour. That is a tie in
    // the world, not an unsettled learner.
    for (const tileReward of [-2.5, 0, 3, 5]) {
      const run = train({ tileReward, snapshots: true });
      const tail = run.snapshots.slice(Math.floor(run.snapshots.length * 0.8));
      const walks = tail.map((s) => rolloutGreedy(s.q));
      expect(new Set(walks.map((r) => regimeOf(r))).size, `tile=${tileReward}`).toBe(1);
      expect(new Set(walks.map((r) => r.steps)).size, `tile=${tileReward}`).toBe(1);
      expect(new Set(walks.map((r) => r.path.join(","))).size).toBeLessThanOrEqual(2);
    }
  });

  it("G7 — value really spreads outward from the door", () => {
    const run = train({ tileReward: 0, snapshots: true });
    const at = (episode: number) => run.snapshots.find((s) => s.episode === episode);
    const positives = (episode: number) => {
      const snap = at(episode);
      expect(snap, `snapshot ${episode}`).toBeDefined();
      const values = valueMap(snap!.q);
      return FREE_CELLS.filter((c) => c !== GOAL && values[c]! > 0);
    };

    // Early on the robot has wandered but found nothing good yet.
    expect(positives(20).length).toBeLessThanOrEqual(2);
    // Shortly after it first reaches the door, "good" floods the room.
    expect(positives(60).length).toBeGreaterThanOrEqual(20);

    // And the very first cell to become positive is the door's neighbour.
    const toGoal = distancesFrom(GOAL);
    let first: number[] = [];
    for (const snap of run.snapshots) {
      const values = valueMap(snap.q);
      const pos = FREE_CELLS.filter((c) => c !== GOAL && values[c]! > 0);
      if (pos.length > 0) {
        first = pos;
        break;
      }
    }
    expect(first.length).toBeGreaterThan(0);
    expect(Math.min(...first.map((c) => toGoal[c]!))).toBe(1);
  });

  it("G8 — Q-learning finds the exact optimum across the whole slider", () => {
    let matched = 0;
    let total = 0;
    const misses: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const c = i / 10 - 5;
      const oracle = regimeOfPolicy(solveExactly(c).policy);
      for (const seed of [1, 7, SEED, 99991, 424242]) {
        total += 1;
        const learned = regimeOf(rolloutGreedy(train({ tileReward: c, seed }).q));
        if (learned === oracle) matched += 1;
        else misses.push(`c=${c.toFixed(1)} seed=${seed}: ${learned} != ${oracle}`);
      }
    }
    expect(misses.slice(0, 5)).toEqual([]);
    expect(matched).toBe(total);
    expect(total).toBe(505);
  });

  it("G9 — every cell on the route it actually walks has the optimal action", () => {
    for (const tileReward of [-4, -2, 0, 1, 3, 5]) {
      const { q } = train({ tileReward });
      const learned = greedyPolicy(q);
      const optimal = solveExactly(tileReward).policy;
      const walked = new Set(rolloutGreedy(q).path);
      walked.delete(GOAL);
      const wrong = [...walked].filter((cell) => learned[cell] !== optimal[cell]);
      expect(wrong, `tile=${tileReward}`).toEqual([]);
    }
  });

  it("G9b — but it does not claim to have learned the whole room", () => {
    // An honest limit worth keeping visible: cells the robot stopped visiting
    // never finish learning, and the lab must not pretend otherwise.
    const { q } = train({ tileReward: 0 });
    const learned = greedyPolicy(q);
    const optimal = solveExactly(0).policy;
    const inner = FREE_CELLS.filter((c) => c !== GOAL);
    const wrong = inner.filter((c) => learned[c] !== optimal[c]);
    expect(wrong.length).toBeGreaterThan(0);
    expect(wrong.length).toBeLessThan(inner.length / 2);
  });
});

// ========================================================== snapshots + API ==

describe("training snapshots", () => {
  it("samples densely where the learning happens and sparsely afterwards", () => {
    const marks = checkpointEpisodes();
    expect(marks[0]).toBe(1);
    expect(marks[marks.length - 1]).toBe(EPISODES);
    expect(marks.length).toBeGreaterThan(50);
    expect(marks.length).toBeLessThan(100);
    for (let i = 1; i < marks.length; i++) expect(marks[i]!).toBeGreaterThan(marks[i - 1]!);
    // Half the checkpoints land in the first 100 episodes, where the whole
    // story happens; a linear scrubber would have hidden it.
    expect(marks.filter((m) => m <= 100).length).toBeGreaterThan(marks.length / 2);
  });

  it("keeps the real table at each checkpoint, not a summary", () => {
    const run = train({ tileReward: 1, snapshots: true });
    expect(run.snapshots.length).toBe(checkpointEpisodes().length);
    for (const snap of run.snapshots) expect(snap.q.length).toBe(CELL_COUNT * ACTION_COUNT);
    const last = run.snapshots[run.snapshots.length - 1]!;
    expect(last.episode).toBe(EPISODES);
    for (let i = 0; i < run.q.length; i++) expect(last.q[i]!).toBeCloseTo(run.q[i]!, 5);
  });

  it("costs a few tens of kilobytes, not a megabyte", () => {
    const run = train({ tileReward: 0, snapshots: true });
    const bytes = run.snapshots.length * CELL_COUNT * ACTION_COUNT * 4;
    expect(bytes).toBeLessThan(80 * 1024);
  });

  it("shows a policy that changes early and settles late", () => {
    const run = train({ tileReward: 0, snapshots: true });
    const early = greedyPolicy(run.snapshots[2]!.q).join(",");
    const late = greedyPolicy(run.snapshots[run.snapshots.length - 1]!.q).join(",");
    expect(early).not.toBe(late);
  });
});

describe("reading the table", () => {
  it("gives every non-terminal cell an action and the goal none", () => {
    const policy = greedyPolicy(train({ tileReward: 0 }).q);
    expect(policy[GOAL]).toBe(-1);
    for (const cell of FREE_CELLS) {
      if (cell === GOAL) continue;
      expect(policy[cell]).toBeGreaterThanOrEqual(0);
      expect(policy[cell]).toBeLessThan(ACTION_COUNT);
    }
  });

  it("reports a rollout whose path is a legal walk", () => {
    const r = rolloutGreedy(train({ tileReward: -4 }).q);
    expect(r.path[0]).toBe(START);
    for (let i = 1; i < r.path.length; i++) {
      const from = r.path[i - 1]!;
      const to = r.path[i]!;
      expect(ACTIONS.some((a) => nextState(from, a) === to), `${from} -> ${to}`).toBe(true);
      expect(isWall(to)).toBe(false);
    }
  });

  it("counts tile visits and goal arrival honestly", () => {
    const avoid = rolloutGreedy(train({ tileReward: -4 }).q);
    expect(avoid.path.filter((c) => c === TILE)).toHaveLength(avoid.tileVisits);
    expect(avoid.path[avoid.path.length - 1] === GOAL).toBe(avoid.reachedGoal);

    const farm = rolloutGreedy(train({ tileReward: 4 }).q);
    expect(farm.looped).toBe(true);
    expect(farm.reachedGoal).toBe(false);
  });

  it("gives the value map the largest action value of each cell", () => {
    const { q } = train({ tileReward: 1 });
    const values = valueMap(q);
    for (const cell of FREE_CELLS) {
      if (cell === GOAL) expect(values[cell]).toBe(0);
      else expect(values[cell]).toBe(bestValue(q, cell));
    }
  });
});

describe("performance", () => {
  it("trains fast enough to rerun on every slider movement", () => {
    const runs = 40;
    const t0 = performance.now();
    for (let i = 0; i < runs; i++) train({ tileReward: (i / runs) * 10 - 5 });
    const perRun = (performance.now() - t0) / runs;

    const t1 = performance.now();
    for (let i = 0; i < runs; i++) train({ tileReward: (i / runs) * 10 - 5, snapshots: true });
    const perRunWithSnapshots = (performance.now() - t1) / runs;

    console.log(
      `  training: ${perRun.toFixed(2)} ms/run, ${perRunWithSnapshots.toFixed(2)} ms/run with snapshots`,
    );
    // A generous ceiling: anything under a frame is imperceptible on a drag.
    expect(perRun).toBeLessThan(16);
    expect(perRunWithSnapshots).toBeLessThan(16);
  });
});
