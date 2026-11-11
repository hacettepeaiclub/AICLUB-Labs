import { describe, it, expect } from "vitest";
import { differentiate, integrate } from "./engine/calculus";
describe("numerical calculus regressions", () => {
  it("preserves a linear slope under a large constant offset", () => {
    expect(differentiate((x) => x + 1e12, 0)).toBeCloseTo(1, 8);
    expect(differentiate((x) => 1e-12 * x, 0)).toBeCloseTo(1e-12, 20);
  });
  it("integrates oscillations whose first Simpson samples are zero", () => {
    expect(integrate((x) => Math.sin(4 * Math.PI * x) ** 2, 0, 1)).toBeCloseTo(0.5, 10);
    expect(integrate((x) => Math.sin(4 * Math.PI * x) ** 2, 1, 0)).toBeCloseTo(-0.5, 10);
  });
  it("rejects non-finite integrands", () =>
    expect(() => integrate(() => Infinity, 0, 1)).toThrow());
});

import { makePuzzle, judge } from "./daily";
import { initialState } from "./engine/machine";
it("checks the requested statistic rather than another matching row", () => {
  const task = Array.from({ length: 100 }, (_, i) => makePuzzle("fx991ex", String(i)))
    .flat()
    .find((t) => t.kind === "mean")!;
  const state = initialState("fx991ex");
  state.stat.rows = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
  ];
  state.screen = { s: "statList", list: "oneVar", top: 0, back: { s: "calc" } };
  expect(judge({ ...task, answer: 10 }, state).kind).toBe("wrong");
  expect(judge({ ...task, answer: 5 }, state).kind).toBe("right");
});
