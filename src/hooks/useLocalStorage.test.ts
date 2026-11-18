// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isRoundScore } from "@/labs/gradient-descent/components/GolfGame";
import { isAttempt } from "@/labs/multilayer-perceptrons/components/SpiralChallenge";
import { installLocalStorage, restoreDom } from "@/test/dom";
import { isFiniteNumber, orNull, useLocalStorage, type StoredGuard } from "./useLocalStorage";

/**
 * Persisted state is read back through a guard.
 *
 * Every malformed case a returning visitor's browser could hold: not JSON,
 * JSON of the wrong shape, an older version's shape, storage that throws.
 */

const KEY = "acl:test:value";

function stored<T>(raw: string | null, initial: T, guard: StoredGuard<T>) {
  if (raw !== null) window.localStorage.setItem(KEY, raw);
  return renderHook(() => useLocalStorage(KEY, initial, guard));
}

beforeEach(() => {
  installLocalStorage();
});

afterEach(() => {
  cleanup();
  restoreDom();
});

describe("useLocalStorage", () => {
  it("returns the initial value when nothing is stored", () => {
    expect(stored(null, 7, isFiniteNumber).result.current[0]).toBe(7);
  });

  it("returns a stored value the guard accepts", () => {
    expect(stored("42", 7, isFiniteNumber).result.current[0]).toBe(42);
  });

  it("falls back on anything the guard rejects, and leaves storage alone", () => {
    for (const raw of ['"42"', "true", "{}", "[]", "null", "1e999"]) {
      window.localStorage.clear();
      const { result, unmount } = stored(raw, 7, isFiniteNumber);
      expect(result.current[0], raw).toBe(7);
      // Not overwritten on read: only a real write from the lab replaces it.
      expect(window.localStorage.getItem(KEY)).toBe(raw);
      unmount();
    }
  });

  it("falls back on a value that is not JSON at all", () => {
    expect(stored("{not json", 7, isFiniteNumber).result.current[0]).toBe(7);
  });

  it("falls back when storage throws, and still works in memory", () => {
    restoreDom();
    installLocalStorage({ throwing: true });
    const { result } = renderHook(() => useLocalStorage(KEY, 7, isFiniteNumber));
    expect(result.current[0]).toBe(7);
    act(() => result.current[1](9));
    expect(result.current[0]).toBe(9);
  });

  it("writes under the same key, as JSON, including through an updater", () => {
    const { result } = stored(null, 1, isFiniteNumber);
    act(() => result.current[1]((n) => n + 1));
    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem(KEY)).toBe("2");
  });

  it("orNull accepts null and whatever the inner guard accepts", () => {
    const guard = orNull(isFiniteNumber);
    expect([guard(null), guard(3), guard("3"), guard(undefined)]).toEqual([
      true,
      true,
      false,
      false,
    ]);
  });
});

describe("the labs' stored bests", () => {
  it("spiral: accepts a real attempt and rejects every malformed one", () => {
    expect(isAttempt({ neurons: 6, accuracy: 0.93, epoch: 120 })).toBe(true);
    for (const bad of [
      null,
      "best",
      [],
      {},
      { neurons: "six", accuracy: 0.9, epoch: 10 },
      { neurons: 0, accuracy: 0.9, epoch: 10 },
      { neurons: 2.5, accuracy: 0.9, epoch: 10 },
      { neurons: 6, accuracy: 93, epoch: 10 },
      { neurons: 6, accuracy: -0.1, epoch: 10 },
      { neurons: 6, accuracy: 0.9, epoch: -1 },
      { neurons: 6, accuracy: 0.9 },
      // A whole number too large to be a real one would beat every honest attempt.
      { neurons: 1e100, accuracy: 0.9, epoch: 10 },
      { neurons: 6, accuracy: 0.9, epoch: 1e100 },
    ]) {
      expect(isAttempt(bad), JSON.stringify(bad)).toBe(false);
    }
  });

  it("golf: accepts a whole-number score over or under par and nothing else", () => {
    for (const ok of [-3, 0, 4]) expect(isRoundScore(ok)).toBe(true);
    for (const bad of ["-3", 1.5, Number.NaN, Number.POSITIVE_INFINITY, -1e100, null, {}]) {
      expect(isRoundScore(bad), String(bad)).toBe(false);
    }
  });

  it("a malformed stored best reads as no best, under the unchanged keys", () => {
    window.localStorage.setItem("acl:multilayer-perceptrons:best-spiral", '{"neurons":"six"}');
    window.localStorage.setItem("acl:gradient-descent:golf-best", '"-2"');
    const spiral = renderHook(() =>
      useLocalStorage("acl:multilayer-perceptrons:best-spiral", null, orNull(isAttempt)),
    );
    const golf = renderHook(() =>
      useLocalStorage("acl:gradient-descent:golf-best", null, orNull(isRoundScore)),
    );
    expect(spiral.result.current[0]).toBeNull();
    expect(golf.result.current[0]).toBeNull();
  });
});
