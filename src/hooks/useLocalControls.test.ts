import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/**
 * The merge rule, exercised directly.
 *
 * The suite runs in node with no DOM, so the hook itself cannot be rendered
 * here. What matters is not React's part of it — that is a `useMemo` — but the
 * decision it makes about each stored key, and that decision is a pure
 * function of two values. It is reproduced here from the source it guards, and
 * a check below fails if the source stops matching it.
 */
const keeps = (stored: unknown, fallback: unknown): boolean => {
  if (typeof stored !== typeof fallback) return false;
  if (stored === null || fallback === null) return stored === fallback;
  if (typeof stored === "number") return Number.isFinite(stored);
  return true;
};

const merge = <T extends object>(defaults: T, stored: unknown): T => {
  const result = { ...defaults };
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return result;
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = (stored as Partial<T>)[key];
    if (value === undefined) continue;
    if (keeps(value, defaults[key])) result[key] = value as T[keyof T];
  }
  return result;
};

const DEFAULTS = { w1: 1.4, w2: -0.8, bias: 0, activation: "tanh", locked: false };

describe("stored control values", () => {
  it("keeps values that still match their default's type", () => {
    const stored = { w1: 2.5, w2: 0, bias: -1.25, activation: "relu", locked: true };
    expect(merge(DEFAULTS, stored)).toEqual(stored);
  });

  it("drops a value whose type no longer matches, keeping the rest", () => {
    // The exact shape the audit reproduced: a string where a number belongs
    // rendered `output = nope(NaN·x₁ …)` and a figure reading NaN.
    const merged = merge(DEFAULTS, { w1: "abc", w2: 3, activation: 42, locked: "yes" });
    expect(merged.w1).toBe(DEFAULTS.w1);
    expect(merged.activation).toBe(DEFAULTS.activation);
    expect(merged.locked).toBe(DEFAULTS.locked);
    // The one well-typed value in that bag still survives.
    expect(merged.w2).toBe(3);
  });

  it("drops NaN and both infinities, which are numbers and still poison", () => {
    for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(merge(DEFAULTS, { w1: bad }).w1, String(bad)).toBe(DEFAULTS.w1);
    }
    // JSON has no NaN literal, but 1e999 parses to Infinity.
    expect(merge(DEFAULTS, JSON.parse('{"w1": 1e999}')).w1).toBe(DEFAULTS.w1);
  });

  it("drops null and treats a null bag as no bag", () => {
    expect(merge(DEFAULTS, { w1: null }).w1).toBe(DEFAULTS.w1);
    expect(merge(DEFAULTS, null)).toEqual(DEFAULTS);
    expect(merge(DEFAULTS, JSON.parse("null"))).toEqual(DEFAULTS);
  });

  it("survives a stored bag that is not an object", () => {
    for (const bag of [42, "nope", true, [], [1, 2, 3]]) {
      expect(merge(DEFAULTS, bag), JSON.stringify(bag)).toEqual(DEFAULTS);
    }
  });

  it("leaves missing keys on their defaults", () => {
    // Adding a control later must not break settings saved before it existed.
    expect(merge(DEFAULTS, { w1: 2 })).toEqual({ ...DEFAULTS, w1: 2 });
    expect(merge(DEFAULTS, {})).toEqual(DEFAULTS);
  });

  it("ignores unknown keys rather than passing them through", () => {
    const merged = merge(DEFAULTS, { w1: 2, removedControl: "stale", extra: 9 });
    expect(merged).toEqual({ ...DEFAULTS, w1: 2 });
    expect("removedControl" in merged).toBe(false);
  });

  it("keeps a legitimate zero, empty string and false", () => {
    // Falsy is not invalid; a guard written with `||` would have eaten these.
    const merged = merge({ n: 5, label: "x", on: true }, { n: 0, label: "", on: false });
    expect(merged).toEqual({ n: 0, label: "", on: false });
  });

  it("matches the rule the hook actually applies", () => {
    // The reproduction above is only worth anything if it is still the source.
    const source = readFileSync("src/hooks/useLocalControls.ts", "utf8");
    expect(source).toMatch(/typeof stored !== typeof fallback/);
    expect(source).toMatch(/Number\.isFinite\(stored\)/);
    expect(source).toMatch(/if \(value === undefined\) continue;/);
    expect(source).toMatch(/Array\.isArray\(stored\)/);
  });
});
