import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { labSource, track } from "./analytics";

const global = globalThis as unknown as { window?: unknown };

afterEach(() => {
  delete global.window;
});

describe("track", () => {
  it("hands the event and its data to Umami when it has loaded", () => {
    const umami = { track: vi.fn() };
    global.window = { umami };
    track("lab_open", { lab: "sorting", from: "grid" });
    track("game_start");
    expect(umami.track).toHaveBeenNthCalledWith(1, "lab_open", { lab: "sorting", from: "grid" });
    expect(umami.track).toHaveBeenNthCalledWith(2, "game_start", undefined);
  });

  it("does nothing when the script never loaded (blocked, offline, a dev server)", () => {
    global.window = {};
    expect(() => track("filter", { field: "algorithms" })).not.toThrow();
  });

  it("never lets Umami's own failure reach the page", () => {
    global.window = {
      umami: {
        track: () => {
          throw new Error("network");
        },
      },
    };
    expect(() => track("theme", { to: "light" })).not.toThrow();
  });
});

describe("labSource", () => {
  it("believes a link that says where it is", () => {
    expect(labSource({ from: "finder" }, "abc123")).toBe("finder");
    expect(labSource({ from: "grid" }, "default")).toBe("grid");
  });

  it("calls the first page of a visit direct, and any later unlabelled one a link", () => {
    expect(labSource(null, "default")).toBe("direct");
    expect(labSource(undefined, "x7k2")).toBe("link");
  });

  it("ignores a source it does not know", () => {
    expect(labSource({ from: "somewhere" }, "x7k2")).toBe("link");
    expect(labSource({ from: 42 }, "default")).toBe("direct");
  });
});

describe("the tracking script", () => {
  const html = readFileSync("index.html", "utf8");

  it("is deferred, counts only the real site, and honours Do Not Track", () => {
    const tag = html.match(/<script[^>]*cloud\.umami\.is[^>]*>/s)?.[0] ?? "";
    expect(tag).toContain("defer");
    expect(tag).toMatch(/data-domains="labs\.hacettepeaiclub\.com"/);
    expect(tag).toMatch(/data-do-not-track="true"/);
  });
});
