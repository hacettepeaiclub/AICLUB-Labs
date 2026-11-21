// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTouchRadius } from "./useTouchRadius";

/** An SVG whose on-screen size the test sets, and a ResizeObserver it triggers. */
let resize: (() => void) | null = null;
function svgOfSize(width: number, height: number) {
  const box = { width, height };
  const svg = {
    getBoundingClientRect: () => ({ width: box.width, height: box.height }),
  } as unknown as SVGSVGElement;
  const ref: RefObject<SVGSVGElement> = { current: svg };
  const setSize = (w: number, h: number) => {
    box.width = w;
    box.height = h;
    act(() => resize?.());
  };
  return { ref, setSize };
}

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {
        resize = null;
      }
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  resize = null;
});

describe("useTouchRadius", () => {
  const viewBox = { width: 500, height: 300 };

  it("keeps the drawn radius when the diagram is shown at full size or larger", () => {
    const { ref } = svgOfSize(1000, 600);
    const { result } = renderHook(() => useTouchRadius(ref, viewBox, 22));
    expect(result.current).toBe(22);
  });

  it("grows the radius so the hit circle stays 44px across when the diagram shrinks", () => {
    const { ref } = svgOfSize(250, 150); // half size: 0.5px per unit
    const { result } = renderHook(() => useTouchRadius(ref, viewBox, 22));
    expect(result.current).toBe(44);
    expect(result.current * 2 * 0.5).toBe(44);
  });

  it("uses the smaller axis scale, as preserveAspectRatio 'meet' draws it", () => {
    const { ref } = svgOfSize(500, 150); // x at 1px/unit, y at 0.5px/unit
    const { result } = renderHook(() => useTouchRadius(ref, viewBox, 22));
    expect(result.current).toBe(44);
  });

  it("follows the diagram as it is resized", () => {
    const { ref, setSize } = svgOfSize(500, 300);
    const { result } = renderHook(() => useTouchRadius(ref, viewBox, 22));
    expect(result.current).toBe(22);
    setSize(125, 75);
    expect(result.current).toBe(88);
    setSize(500, 300);
    expect(result.current).toBe(22);
  });

  it("keeps the drawn radius while the diagram has no size yet, or without ResizeObserver", () => {
    const hidden = svgOfSize(0, 0);
    expect(renderHook(() => useTouchRadius(hidden.ref, viewBox, 22)).result.current).toBe(22);
    vi.unstubAllGlobals();
    vi.stubGlobal("ResizeObserver", undefined);
    const small = svgOfSize(100, 60);
    expect(renderHook(() => useTouchRadius(small.ref, viewBox, 22)).result.current).toBe(22);
  });
});
