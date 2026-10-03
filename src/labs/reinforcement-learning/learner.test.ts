import { describe, expect, it } from "vitest";
import { EPISODES, rolloutGreedy, train } from "./engine";
import { createLearner, runAll, runEpisode, step, type Learner } from "./learner";
import { GOAL, MAX_EPISODE_STEPS, START, TILE, isTerminal, nextState, reward } from "./world";

/**
 * The whole point of `learner.ts` is that it is not a second implementation.
 * If these ever disagree, the live sections of the lab are showing a run the
 * scrubber never had, and the honesty claim at the top of the page is false.
 */

const CASES = [
  { tileReward: -5 },
  { tileReward: -3 },
  { tileReward: 0 },
  { tileReward: 2.5 },
  { tileReward: 5 },
  { tileReward: -3, alpha: 0.1 },
  { tileReward: -3, alpha: 0.9 },
  { tileReward: -3, gamma: 0.5 },
  { tileReward: -3, gamma: 0.99 },
  { tileReward: -3, epsilonStart: 0.2 },
  { tileReward: -3, epsilonStart: 1, epsilonMin: 0.5 },
  { tileReward: 0, seed: 7 },
  { tileReward: 0, seed: 99999 },
  { tileReward: 1.5, episodes: 137, alpha: 0.3, gamma: 0.8, seed: 4242 },
] as const;

describe("the live learner is the same run as train()", () => {
  it("produces a bit-identical Q-table for every parameter combination", () => {
    for (const options of CASES) {
      const episodes = "episodes" in options ? options.episodes : 200;
      const batch = train({ ...options, episodes });
      const live = createLearner({ ...options, episodes });
      runAll(live);
      expect([...live.q], JSON.stringify(options)).toEqual([...batch.q]);
    }
  });

  it("matches at the full episode budget too, not just a short run", () => {
    const batch = train({ tileReward: -3 });
    const live = createLearner({ tileReward: -3 });
    runAll(live);
    expect([...live.q]).toEqual([...batch.q]);
    expect(live.history).toHaveLength(EPISODES);
  });

  it("agrees with the batch table at every intermediate checkpoint", () => {
    // Stronger than the end state: if the two diverged and reconverged, the
    // scrubber and the live view would still disagree in the middle.
    for (const mark of [1, 2, 5, 13, 40, 137]) {
      const batch = train({ tileReward: 0, episodes: mark });
      const live = createLearner({ tileReward: 0, episodes: mark });
      runAll(live);
      expect([...live.q], `after ${mark} episodes`).toEqual([...batch.q]);
    }
  });
});

describe("what a step reports", () => {
  const first = (learner: Learner) => {
    const record = step(learner);
    if (!record) throw new Error("expected a step");
    return record;
  };

  it("reports the transition the world would have produced", () => {
    const learner = createLearner({ tileReward: 2 });
    for (let i = 0; i < 400; i++) {
      const before = learner.state;
      const record = step(learner);
      if (!record) break;
      expect(record.state).toBe(before);
      expect(record.next).toBe(nextState(record.state, record.action));
      expect(record.reward).toBe(reward(record.state, record.next, 2));
      expect(record.terminal).toBe(isTerminal(record.next));
      expect(record.blocked).toBe(record.next === record.state);
    }
  });

  it("writes exactly the value the update rule produces", () => {
    const learner = createLearner({ tileReward: -1, alpha: 0.3, gamma: 0.8 });
    for (let i = 0; i < 500; i++) {
      const record = step(learner);
      if (!record) break;
      // Q(s,a) ← Q(s,a) + α[ r + γ max Q(s',a') − Q(s,a) ], recomputed here
      // from the reported terms alone.
      expect(record.target).toBeCloseTo(record.reward + record.bootstrap, 12);
      expect(record.tdError).toBeCloseTo(record.target - record.qBefore, 12);
      expect(record.qAfter).toBeCloseTo(record.qBefore + 0.3 * record.tdError, 12);
      if (record.terminal) expect(record.bootstrap).toBe(0);
    }
  });

  it("calls an action exploratory only when epsilon could have caused it", () => {
    // With no exploration at all nothing may be flagged; with full
    // exploration on an all-zero table almost everything must be.
    const greedy = createLearner({ tileReward: 0, epsilonStart: 0, epsilonMin: 0 });
    for (let i = 0; i < 200; i++) {
      const record = step(greedy);
      if (!record) break;
      expect(record.exploring).toBe(false);
    }

    const curious = createLearner({ tileReward: 0, epsilonStart: 1, epsilonMin: 1 });
    let explored = 0;
    let total = 0;
    for (let i = 0; i < 400; i++) {
      const record = step(curious);
      if (!record) break;
      total += 1;
      if (record.exploring) explored += 1;
    }
    expect(explored).toBe(total);
  });

  it("counts an episode as reaching the goal only when the door was entered", () => {
    const learner = createLearner({ tileReward: 4 });
    runEpisode(learner);
    const episode = learner.history[0];
    expect(episode).toBeDefined();
    expect(episode!.steps).toBeLessThanOrEqual(MAX_EPISODE_STEPS);
    if (!episode!.reachedGoal) expect(episode!.steps).toBe(MAX_EPISODE_STEPS);
  });

  it("starts every episode at the start square", () => {
    const learner = createLearner({ tileReward: 0, episodes: 12 });
    for (let e = 0; e < 12; e++) {
      expect(learner.state).toBe(START);
      runEpisode(learner);
    }
    expect(learner.done).toBe(true);
  });

  it("sums the episode reward from the rewards it actually paid", () => {
    const learner = createLearner({ tileReward: 3 });
    let sum = 0;
    const startedAt = learner.episode;
    while (learner.episode === startedAt && !learner.done) {
      const record = step(learner);
      if (!record) break;
      sum += record.reward;
    }
    expect(learner.history[0]!.totalReward).toBeCloseTo(sum, 12);
  });

  it("tracks the path of the episode in progress", () => {
    const learner = createLearner({ tileReward: 0 });
    const record = first(learner);
    expect(learner.episodePath[0]).toBe(START);
    expect(learner.episodePath[learner.episodePath.length - 1]).toBe(record.next);
  });

  it("counts a tile visit only for a real move onto it", () => {
    // Recount every episode independently from the reported transitions, and
    // compare with what the learner banked when that episode closed.
    const learner = createLearner({ tileReward: 5, episodes: 40 });
    const counted = new Map<number, number>();
    while (!learner.done) {
      const record = step(learner);
      if (!record) break;
      if (record.next === TILE && record.next !== record.state) {
        counted.set(record.episode, (counted.get(record.episode) ?? 0) + 1);
      }
    }
    expect(learner.history).toHaveLength(40);
    for (const episode of learner.history) {
      expect(episode.tileVisits, `episode ${episode.episode}`).toBe(
        counted.get(episode.episode) ?? 0,
      );
    }
    // The reward is high enough that some episode must have farmed it, or the
    // assertion above would be comparing zero with zero.
    expect([...counted.values()].some((n) => n > 1)).toBe(true);
  });

  it("stops after the last episode and reports nothing further", () => {
    const learner = createLearner({ tileReward: 0, episodes: 3 });
    runAll(learner);
    expect(learner.done).toBe(true);
    expect(learner.history).toHaveLength(3);
    expect(step(learner)).toBeNull();
  });
});

describe("the run the visitor watches is the run the policy comes from", () => {
  it("ends on a table whose greedy route matches the batch run's", () => {
    for (const tileReward of [-4, -3, 0, 1, 3]) {
      const live = createLearner({ tileReward });
      runAll(live);
      const batch = train({ tileReward });
      expect(rolloutGreedy(live.q).path, `reward ${tileReward}`).toEqual(
        rolloutGreedy(batch.q).path,
      );
    }
  });

  it("never reports a transition that leaves the room", () => {
    const learner = createLearner({ tileReward: 0, episodes: 50 });
    while (!learner.done) {
      const record = step(learner);
      if (!record) break;
      expect(record.next).toBeGreaterThanOrEqual(0);
      expect(record.next).toBeLessThan(36);
      if (record.terminal) expect(record.next).toBe(GOAL);
    }
  });
});
