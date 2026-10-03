import { describe, expect, it } from "vitest";
import { labs } from "./registry";
import { migrateRenamedSlugs, RENAMED } from "./renamed";

/** A Storage in memory, with the same iteration contract as the browser's. */
function memory(initial: Record<string, string>): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
  };
}

describe("renamed labs", () => {
  it("point from a slug that no longer exists to one that does", () => {
    const slugs = new Set(labs.map((l) => l.meta.slug));
    for (const [old, next] of Object.entries(RENAMED)) {
      expect({ old, gone: !slugs.has(old) }).toEqual({ old, gone: true });
      expect({ next, exists: slugs.has(next) }).toEqual({ next, exists: true });
    }
  });

  it("move saved progress and visits to the new slug, once", () => {
    const storage = memory({
      "acl:pathfinding:challenge": '{"solved":true}',
      "acl:tokenizer:challenge": "old",
      "acl:tokenization:challenge": "newer",
      "acl:convolution:kernel": "kept",
      "aiclub-labs-visited": '["pathfinding","tokenizer","tokenization","convolution"]',
      "aiclub-labs-last": "neural-playground",
    });
    migrateRenamedSlugs(storage);
    expect(storage.getItem("acl:graph-search:challenge")).toBe('{"solved":true}');
    expect(storage.getItem("acl:pathfinding:challenge")).toBeNull();
    // What was already saved under the new slug is newer, and wins.
    expect(storage.getItem("acl:tokenization:challenge")).toBe("newer");
    expect(storage.getItem("acl:tokenizer:challenge")).toBeNull();
    expect(storage.getItem("acl:convolution:kernel")).toBe("kept");
    expect(JSON.parse(storage.getItem("aiclub-labs-visited") ?? "[]")).toEqual([
      "graph-search",
      "tokenization",
      "convolution",
    ]);
    expect(storage.getItem("aiclub-labs-last")).toBe("multilayer-perceptrons");

    const before = JSON.stringify([...Array(storage.length).keys()].map((i) => storage.key(i)));
    migrateRenamedSlugs(storage);
    expect(JSON.stringify([...Array(storage.length).keys()].map((i) => storage.key(i)))).toBe(before);
  });

  it("survives storage it cannot read", () => {
    const broken = memory({ "aiclub-labs-visited": "{not json" });
    expect(() => migrateRenamedSlugs(broken)).not.toThrow();
    expect(() => migrateRenamedSlugs(undefined)).not.toThrow();
  });
});
