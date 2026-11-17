// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  installCanvasContext,
  installFrameClock,
  installResizeObserver,
  restoreDom,
  type FrameClock,
  type ResizeObservers,
} from "@/test/dom";
import { useCanvas2D, type CanvasDrawArgs } from "./useCanvas2D";

let frames: FrameClock;
let observers: ResizeObservers;

beforeEach(() => {
  frames = installFrameClock();
  observers = installResizeObserver();
  installCanvasContext();
});

afterEach(() => {
  cleanup();
  restoreDom();
});

function Surface(props: {
  draw: (args: CanvasDrawArgs) => void;
  running: boolean;
  repaintKey?: number;
}) {
  const ref = useCanvas2D(props.draw, props.running, props.repaintKey);
  return <canvas ref={ref} data-testid="surface" />;
}

function mount(running: boolean, repaintKey = 0) {
  const draw = vi.fn<(args: CanvasDrawArgs) => void>();
  const view = render(<Surface draw={draw} running={running} repaintKey={repaintKey} />);
  const canvas = view.getByTestId("surface") as HTMLCanvasElement;
  return { draw, canvas, view };
}

describe("useCanvas2D: a still canvas", () => {
  it("schedules no animation frame at all", () => {
    const { canvas } = mount(false);
    act(() => observers.resize(canvas, 200, 100));
    expect(frames.requested()).toBe(0);
    expect(frames.pending()).toBe(0);
  });

  it("paints once when first measured, at the measured size, in CSS pixels", () => {
    const { canvas, draw } = mount(false);
    expect(draw).not.toHaveBeenCalled();
    act(() => observers.resize(canvas, 200, 100));
    expect(draw).toHaveBeenCalledTimes(1);
    expect(draw.mock.calls[0]?.[0]).toMatchObject({ width: 200, height: 100, dtSec: 0 });
  });

  it("repaints after every resize, because resizing clears the bitmap", () => {
    const { canvas, draw } = mount(false);
    act(() => observers.resize(canvas, 200, 100));
    act(() => observers.resize(canvas, 320, 160));
    expect(draw).toHaveBeenCalledTimes(2);
    expect(draw.mock.calls[1]?.[0]).toMatchObject({ width: 320, height: 160 });
  });

  it("repaints exactly once per repaintKey change, and never on its own", () => {
    const { canvas, draw, view } = mount(false, 0);
    act(() => observers.resize(canvas, 200, 100));
    draw.mockClear();
    view.rerender(<Surface draw={draw} running={false} repaintKey={1} />);
    view.rerender(<Surface draw={draw} running={false} repaintKey={2} />);
    expect(draw).toHaveBeenCalledTimes(2);
    act(() => frames.frame());
    expect(draw).toHaveBeenCalledTimes(2);
    expect(frames.requested()).toBe(0);
  });
});

describe("useCanvas2D: a running canvas", () => {
  it("keeps exactly one frame chain alive and draws on each frame", () => {
    const { canvas, draw } = mount(true);
    act(() => observers.resize(canvas, 200, 100));
    expect(frames.pending()).toBe(1);
    act(() => frames.frame());
    act(() => frames.frame());
    expect(draw).toHaveBeenCalledTimes(2);
    expect(frames.pending()).toBe(1);
    expect(draw.mock.calls[1]?.[0].dtSec).toBeGreaterThan(0);
  });

  it("stops scheduling the moment it stops running", () => {
    const { canvas, draw, view } = mount(true);
    act(() => observers.resize(canvas, 200, 100));
    view.rerender(<Surface draw={draw} running={false} />);
    expect(frames.pending()).toBe(0);
    const before = frames.requested();
    act(() => frames.frame());
    expect(frames.requested()).toBe(before);
  });

  it("cancels its frame and stops observing on unmount", () => {
    const { canvas, view } = mount(true);
    act(() => observers.resize(canvas, 200, 100));
    view.unmount();
    expect(frames.pending()).toBe(0);
    expect(observers.observed()).toHaveLength(0);
  });

  it("scales the bitmap by the device pixel ratio, capped at 2", () => {
    const original = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 3 });
    try {
      const { canvas } = mount(false);
      act(() => observers.resize(canvas, 200, 100));
      expect([canvas.width, canvas.height]).toEqual([400, 200]);
    } finally {
      Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: original });
    }
  });
});
