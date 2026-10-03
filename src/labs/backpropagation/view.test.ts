import { describe, expect, it } from "vitest";
import { formatSmall, formatValue } from "./view";

describe("formatting", () => {
  it("writes ordinary and tiny numbers readably", () => {
    expect(formatValue(-0.25)).toBe("−0.25");
    expect(formatSmall(0.0042)).toBe("0.0042");
    expect(formatSmall(3.14e-8)).toBe("3.1 × 10⁻⁸");
    expect(formatSmall(-2.5e-12)).toBe("−2.5 × 10⁻¹²");
    expect(formatSmall(0)).toBe("0");
    expect(formatSmall(1.5)).toBe("1.5");
  });
});
