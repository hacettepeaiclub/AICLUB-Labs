// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useRepaintFlag } from "./useRepaintFlag";

afterEach(cleanup);

describe("useRepaintFlag", () => {
  it("bumps its version once per markDirty, with a stable markDirty", () => {
    const { result } = renderHook(() => useRepaintFlag());
    const { markDirty, version } = result.current;
    act(() => markDirty());
    act(() => markDirty());
    expect(result.current.version).toBe(version + 2);
    expect(result.current.markDirty).toBe(markDirty);
  });

  it("does not re-render on a window resize (R14)", () => {
    let renders = 0;
    const { result } = renderHook(() => {
      renders++;
      return useRepaintFlag();
    });
    const before = { renders, version: result.current.version };
    act(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
    });
    expect(renders).toBe(before.renders);
    expect(result.current.version).toBe(before.version);
  });
});
