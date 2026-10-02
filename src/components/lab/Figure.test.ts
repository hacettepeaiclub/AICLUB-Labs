import { describe, expect, it } from "vitest";
import { changedRange } from "./Figure";

const marked = (previous: string, next: string) => {
  const range = changedRange(previous, next);
  return range ? next.slice(range[0], range[1]) : null;
};

/**
 * A figure is written the instant it changes and never eased toward its new
 * value — so what moves is which digits are marked, and that has to be the
 * digits that actually changed.
 */
describe("which digits of a figure are marked", () => {
  it("marks only the digits that moved", () => {
    expect(marked("0.4982", "0.4931")).toBe("31");
  });

  it("leaves an unchanged unit out of the mark", () => {
    expect(marked("64.0%", "64.5%")).toBe("5");
  });

  it("spans from the first change to the last, including any match in between", () => {
    // 4 → 5 and 2 → 3 moved; the 9 between them did not, but a number whose
    // tens and units both changed changed by more than one digit's worth.
    expect(marked("0.492", "0.593")).toBe("593");
  });

  it("marks the whole value when its length changes", () => {
    expect(marked("9.99", "10.0")).toBe("10.0");
  });

  it("marks nothing when nothing changed", () => {
    expect(marked("0.4982", "0.4982")).toBeNull();
  });
});
