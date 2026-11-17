// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installLocalStorage, restoreDom } from "@/test/dom";
import { useLocalControls } from "./useLocalControls";

/**
 * The merge rule, through the hook itself.
 *
 * Each case seeds localStorage the way a returning visitor's browser would —
 * including the hand-edited and the left-over-from-an-older-version — and reads
 * what the lab would be given.
 */
const KEY = "acl:test:controls";
const DEFAULTS = { w1: 1.4, w2: -0.8, bias: 0, activation: "tanh", locked: false };

function controlsFrom<T extends object = typeof DEFAULTS>(
  stored: string | null,
  defaults: T = DEFAULTS as unknown as T,
) {
  if (stored !== null) window.localStorage.setItem(KEY, stored);
  return renderHook(() => useLocalControls(KEY, defaults));
}

const read = <T extends object = typeof DEFAULTS>(stored: string | null, defaults?: T) =>
  controlsFrom<T>(stored, defaults).result.current[0];

beforeEach(() => {
  installLocalStorage();
});
afterEach(() => {
  cleanup();
  restoreDom();
});

describe("stored control values", () => {
  it("starts from the defaults when nothing is stored", () => {
    expect(read(null)).toEqual(DEFAULTS);
  });

  it("keeps values that still match their default's type", () => {
    const stored = { w1: 2.5, w2: 0, bias: -1.25, activation: "relu", locked: true };
    expect(read(JSON.stringify(stored))).toEqual(stored);
  });

  it("drops a value whose type no longer matches, keeping the rest", () => {
    // The exact shape the audit reproduced: a string where a number belongs
    // rendered `output = nope(NaN·x₁ …)` and a figure reading NaN.
    const merged = read(JSON.stringify({ w1: "abc", w2: 3, activation: 42, locked: "yes" }));
    expect(merged).toEqual({ ...DEFAULTS, w2: 3 });
  });

  it("drops infinities, which are numbers and still poison", () => {
    // JSON has no NaN or Infinity literal, but 1e999 parses to Infinity.
    expect(read('{"w1": 1e999}').w1).toBe(DEFAULTS.w1);
    expect(read('{"w1": -1e999}').w1).toBe(DEFAULTS.w1);
  });

  it("drops null and treats a null bag as no bag", () => {
    expect(read('{"w1": null}').w1).toBe(DEFAULTS.w1);
    expect(read("null")).toEqual(DEFAULTS);
  });

  it("survives a stored bag that is not an object, or is not JSON at all", () => {
    for (const bag of ["42", '"nope"', "true", "[]", "[1,2,3]", "{not json"]) {
      window.localStorage.clear();
      expect(read(bag), bag).toEqual(DEFAULTS);
    }
  });

  it("leaves missing keys on their defaults and ignores unknown ones", () => {
    // Adding a control later must not break settings saved before it existed.
    const merged = read(JSON.stringify({ w1: 2, removedControl: "stale" }));
    expect(merged).toEqual({ ...DEFAULTS, w1: 2 });
    expect("removedControl" in merged).toBe(false);
  });

  it("keeps a legitimate zero, empty string and false", () => {
    // Falsy is not invalid; a guard written with `||` would have eaten these.
    const merged = read(JSON.stringify({ n: 0, label: "", on: false }), {
      n: 5,
      label: "x",
      on: true,
    });
    expect(merged).toEqual({ n: 0, label: "", on: false });
  });

  it("persists a patch and merges it over what was there", () => {
    const { result } = controlsFrom(JSON.stringify({ w1: 2 }));
    act(() => result.current[1]({ bias: 0.5 }));
    expect(result.current[0]).toEqual({ ...DEFAULTS, w1: 2, bias: 0.5 });
    expect(JSON.parse(window.localStorage.getItem(KEY) ?? "null")).toEqual({ w1: 2, bias: 0.5 });
  });

  it("returns the same object until something changes", () => {
    const { result, rerender } = controlsFrom(null);
    const first = result.current[0];
    rerender();
    expect(result.current[0]).toBe(first);
  });
});
