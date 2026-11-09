import { afterEach, describe, expect, it, vi } from "vitest";
import { color, labColor, labPalette, refreshPalette } from "./tokens";

afterEach(() => {
  vi.unstubAllGlobals();
  refreshPalette();
});

describe("lab palette", () => {
  it("keeps lab overrides out of the homepage and preserves categorical fallbacks", () => {
    const values: Record<string, string> = {
      "--accent": "115 144 190",
      "--lab-accent": "167 239 158",
      "--signal-rose": "251 113 133",
    };
    vi.stubGlobal("document", { documentElement: {} });
    vi.stubGlobal("getComputedStyle", () => ({
      getPropertyValue: (key: string) => values[key] ?? "",
    }));
    refreshPalette();
    expect(color("accent")).toBe("rgb(115 144 190)");
    expect(labColor("accent")).toBe("rgb(167 239 158)");
    expect(labColor("signalRose")).toBe("rgb(251 113 133)");
  });

  it("invalidates the cached canvas palette when the theme changes", () => {
    let accent = "167 239 158";
    const computed = vi.fn(() => ({
      getPropertyValue: (key: string) => (key === "--lab-accent" ? accent : ""),
    }));
    vi.stubGlobal("document", { documentElement: {} });
    vi.stubGlobal("getComputedStyle", computed);
    refreshPalette();
    expect(labColor("accent", 0.5)).toBe("rgb(167 239 158 / 0.5)");
    const reads = computed.mock.calls.length;
    labPalette();
    expect(computed).toHaveBeenCalledTimes(reads);
    accent = "37 101 48";
    refreshPalette();
    expect(labColor("accent")).toBe("rgb(37 101 48)");
  });

  it("can resolve colours without a browser", () => {
    vi.stubGlobal("document", undefined);
    refreshPalette();
    expect(labColor("accent")).toBe(color("accent"));
  });
});
