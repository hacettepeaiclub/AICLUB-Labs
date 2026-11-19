// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installFrameClock, restoreDom } from "@/test/dom";
import { enLabs as en } from "@/i18n/labs/en";
import { trLabs as tr } from "@/i18n/labs/tr";
import { LANDSCAPES } from "./landscape";
import { outcomeOf, useDescentRun } from "./useDescentRun";

/**
 * What the "Outcome" figure says before, during and after a run.
 *
 * It used to say "Running" at step 0, before the visitor had done anything.
 */
describe("outcomeOf", () => {
  it("is Ready before the first step, and only then", () => {
    expect(outcomeOf("running", 0, false)).toBe("ready");
    expect(outcomeOf("running", 0, true)).toBe("running");
  });

  it("is Running only while it plays, Paused between steps", () => {
    expect(outcomeOf("running", 3, true)).toBe("running");
    expect(outcomeOf("running", 1, false)).toBe("paused");
  });

  it("keeps a finished run's own verdict", () => {
    for (const status of ["converged", "diverged", "exhausted"] as const) {
      expect(outcomeOf(status, 12, false)).toBe(status);
      expect(outcomeOf(status, 0, false)).toBe(status);
    }
  });

  it("has words for every outcome in both languages", () => {
    for (const copy of [en, tr]) {
      const status = copy["gradient-descent"].status;
      for (const key of ["ready", "paused", "running", "converged", "diverged", "exhausted"]) {
        expect(status[key as keyof typeof status], key).toBeTruthy();
      }
    }
    expect(tr["gradient-descent"].status.ready).toBe("Hazır");
  });
});

describe("useDescentRun outcome", () => {
  beforeEach(() => {
    installFrameClock();
  });
  afterEach(() => {
    cleanup();
    restoreDom();
  });

  const id = Object.keys(LANDSCAPES)[0] as keyof typeof LANDSCAPES;
  const preset = LANDSCAPES[id];
  const options = {
    landscape: preset.landscape,
    start: preset.start,
    config: { kind: "gd" as const, learningRate: 0.05 },
    tolerance: 1e-6,
    maxSteps: 50,
    reduced: false,
  };

  it("goes Ready → Paused after one step → Running while playing → Paused on pause", () => {
    const { result } = renderHook(() => useDescentRun(options));
    expect(result.current.view.outcome).toBe("ready");
    act(() => result.current.stepOnce());
    expect(result.current.view.outcome).toBe("paused");
    act(() => result.current.play());
    expect(result.current.view.outcome).toBe("running");
    act(() => result.current.pause());
    expect(result.current.view.outcome).toBe("paused");
    act(() => result.current.reset());
    expect(result.current.view.outcome).toBe("ready");
  });
});
