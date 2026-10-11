import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  ATM,
  ATOMIC_COUNTER,
  COUNTER,
  LOCKED_ATM,
  LOCKED_COUNTER,
  canRun,
  counterRun,
  enumerate,
  initial,
  isBlocked,
  replay,
  step,
  type Thread,
} from "./engine";

/**
 * The engine is held to the counts the page states — "18 of the 20 orders
 * lose an update", "a lock leaves two" — so a sentence cannot outlive the
 * model that produced it.
 */

const A: Thread = 0;
const B: Thread = 1;

describe("one counter++ each (section 1)", () => {
  it("ends at 2 when one thread finishes before the other starts", () => {
    const { states } = replay(COUNTER, [A, A, A, B, B, B]);
    expect(states.at(-1)!.memory.counter).toBe(2);
  });

  it("ends at 1 when both read before either writes", () => {
    const { states, events } = replay(COUNTER, [A, B, A, B, A, B]);
    expect(states.at(-1)!.memory.counter).toBe(1);
    // Both loads saw 0; both stores wrote 1.
    expect(events.filter((e) => e.instruction.op === "load").map((e) => e.read)).toEqual([0, 0]);
    expect(events.filter((e) => e.instruction.op === "store").map((e) => e.wrote)).toEqual([1, 1]);
  });

  it("keeps each thread's register its own", () => {
    const { states } = replay(COUNTER, [A, A, B]);
    expect(states.at(-1)!.reg).toEqual([1, 0]);
  });

  it("refuses to run a thread that has finished", () => {
    const { states } = replay(COUNTER, [A, A, A]);
    expect(canRun(COUNTER, states.at(-1)!, A)).toBe(false);
    expect(() => step(COUNTER, states.at(-1)!, A)).toThrow();
  });
});

describe("every order (section 2)", () => {
  const outcomes = enumerate(COUNTER);

  it("has 20 orders: 6 steps, choose which 3 are A's", () => {
    expect(outcomes.length).toBe(20);
    expect(new Set(outcomes.map((o) => o.order.join(""))).size).toBe(20);
  });

  it("loses an update in 18 of them", () => {
    expect(outcomes.filter((o) => o.memory.counter === 1).length).toBe(18);
    expect(outcomes.filter((o) => o.memory.counter === 2).map((o) => o.order.join(""))).toEqual([
      "000111",
      "111000",
    ]);
  });

  it("never ends anywhere but 1 or 2", () => {
    for (const o of outcomes) expect([1, 2]).toContain(o.memory.counter);
  });
});

describe("at scale (section 3)", () => {
  it("strict alternation loses exactly half the increments", () => {
    for (const k of [1, 7, 100]) expect(counterRun(k, 1, createRng(k))).toBe(k);
  });

  it("very long slices lose nothing", () => {
    const rng = createRng(3);
    for (let i = 0; i < 50; i++) expect(counterRun(1000, 1e9, rng)).toBe(2000);
  });

  it("never counts more than was added, nor less than one", () => {
    const rng = createRng(5);
    for (const slice of [1, 2, 3, 10, 100]) {
      for (let i = 0; i < 200; i++) {
        const c = counterRun(20, slice, rng);
        expect(c).toBeGreaterThanOrEqual(1);
        expect(c).toBeLessThanOrEqual(40);
      }
    }
  });

  it("matches a scheduler that flips its coin after every single instruction", () => {
    // The slice-at-a-time shortcut must not change what happens: compare its
    // average against the plain one-instruction-at-a-time process.
    const reference = (k: number, meanSlice: number, rng: () => number) => {
      let counter = 0;
      const left = [k, k];
      const pc = [0, 0];
      const reg = [0, 0];
      let t = rng() < 0.5 ? 0 : 1;
      while (left[0]! > 0 || left[1]! > 0) {
        if (left[t] === 0) t = 1 - t;
        if (pc[t] === 0) [reg[t], pc[t]] = [counter, 1];
        else if (pc[t] === 1) [reg[t], pc[t]] = [reg[t]! + 1, 2];
        else [counter, pc[t], left[t]] = [reg[t]!, 0, left[t]! - 1];
        if (rng() < 1 / meanSlice) t = 1 - t;
      }
      return counter;
    };
    for (const slice of [2, 4, 12]) {
      const runs = 6000;
      const rngA = createRng(11);
      const rngB = createRng(12);
      let fast = 0;
      let slow = 0;
      for (let i = 0; i < runs; i++) {
        fast += counterRun(6, slice, rngA);
        slow += reference(6, slice, rngB);
      }
      expect(Math.abs(fast / runs - slow / runs), `slice ${slice}`).toBeLessThan(0.08);
    }
  });

  it("loses more as the threads interleave more finely", () => {
    const mean = (slice: number) => {
      const rng = createRng(slice);
      let lost = 0;
      for (let i = 0; i < 300; i++) lost += 200 - counterRun(100, slice, rng);
      return lost / 300;
    };
    expect(mean(3)).toBeGreaterThan(mean(30));
    expect(mean(30)).toBeGreaterThan(mean(3000));
  });
});

describe("the fixes (section 4)", () => {
  it("a lock makes the other thread wait", () => {
    const { states } = replay(LOCKED_COUNTER, [A]);
    expect(isBlocked(LOCKED_COUNTER, states.at(-1)!, B)).toBe(true);
    expect(() => step(LOCKED_COUNTER, states.at(-1)!, B)).toThrow();
  });

  it("a lock leaves the scheduler two orders, both correct", () => {
    const outcomes = enumerate(LOCKED_COUNTER);
    expect(outcomes.length).toBe(2);
    for (const o of outcomes) expect(o.memory.counter).toBe(2);
  });

  it("an atomic add is one step, so there is no gap to fall into", () => {
    const outcomes = enumerate(ATOMIC_COUNTER);
    expect(outcomes.length).toBe(2);
    for (const o of outcomes) expect(o.memory.counter).toBe(2);
  });
});

describe("two cash machines (section 5)", () => {
  it("pays once when one machine finishes first", () => {
    const end = replay(ATM, [A, A, B]).states.at(-1)!;
    expect(end.memory).toEqual({ balance: 0, paid: 100 });
    // B's check failed, so B skipped the withdrawal and is done.
    expect(canRun(ATM, end, B)).toBe(false);
  });

  it("pays twice when both check before either withdraws", () => {
    const end = replay(ATM, [A, B, A, B]).states.at(-1)!;
    expect(end.memory).toEqual({ balance: -100, paid: 200 });
  });

  it("overdraws in 4 of its 6 orders, although every step is indivisible", () => {
    const outcomes = enumerate(ATM);
    expect(outcomes.length).toBe(6);
    expect(outcomes.filter((o) => o.memory.paid === 200).length).toBe(4);
  });

  it("with the check and the withdrawal under one lock, never overdraws", () => {
    const outcomes = enumerate(LOCKED_ATM);
    expect(outcomes.length).toBe(2);
    for (const o of outcomes) expect(o.memory).toEqual({ balance: 0, paid: 100 });
  });

  it("starts every program from its own memory, untouched", () => {
    replay(ATM, [A, B, A, B]);
    expect(initial(ATM).memory).toEqual({ balance: 100, paid: 0 });
  });
});
