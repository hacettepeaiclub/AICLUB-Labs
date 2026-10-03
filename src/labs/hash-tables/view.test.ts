import { describe, expect, it } from "vitest";
import { formatHash, formatValue } from "./view";

describe("formatting", () => {
  it("writes figures plainly", () => {
    expect(formatValue(1.5)).toBe("1.5");
    expect(formatValue(2)).toBe("2");
    expect(formatValue(0.004)).toBe("0");
    expect(formatValue(-1.25)).toBe("−1.25");
    expect(formatValue(Infinity)).toBe("∞");
  });

  it("writes negative hashes with a minus sign, including the most negative", () => {
    expect(formatHash(-1396355227)).toBe("−1396355227");
    expect(formatHash(-2147483648)).toBe("−2147483648");
    expect(formatHash(97)).toBe("97");
  });
});
