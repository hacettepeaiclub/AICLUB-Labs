import { describe, expect, it } from "vitest";
import { CASES, caseOf, culprit } from "./cases";
import { gradient, numericGradient, parameterNodes } from "./engine";

describe("the challenge cases", () => {
  it("each hide their fault among the suspects, and a gradient check exposes it", () => {
    for (const id of CASES) {
      const c = caseOf(id);
      expect(c.suspects).toContain(culprit(c));
      expect(new Set(c.suspects).size).toBe(c.suspects.length);
      const broken = gradient(c.graph, c.params, c.bug);
      const wrong = [...parameterNodes(c.graph).keys()].filter(
        (name) => Math.abs((broken[name] ?? 0) - numericGradient(c.graph, c.params, name)) > 1e-6,
      );
      expect({ id, exposed: wrong.length > 0 }).toEqual({ id, exposed: true });
      // The first two leave some parameters right, which is the clue. The
      // third breaks both of its parameters, and the clue is how: one comes
      // out exactly negated (tested in engine.test.ts).
      if (id !== "sign") {
        expect({ id, partial: wrong.length < parameterNodes(c.graph).size }).toEqual({
          id,
          partial: true,
        });
      }
    }
  });
});
