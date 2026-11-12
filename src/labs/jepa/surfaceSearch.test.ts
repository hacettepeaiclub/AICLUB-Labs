import { describe, expect, it } from "vitest";
import { createJepa, SIZE, TEXTURES } from "./engine";
import { CATALOGUE, coverAt, imageVector, observe, search, surface } from "./surfaceSearch";

describe("visual search application", () => {
  it("retains visible evidence even with the largest movable cover", () => {
    for (let position = 0; position < 16; position++)
      for (const size of [0, 1, 2, 3]) {
        const hidden = coverAt(position, size);
        expect(new Set(hidden).size).toBe(size * size);
        expect(hidden.every((i) => i >= 0 && i < 16)).toBe(true);
        expect(hidden.length).toBeLessThan(16);
      }
  });
  it("uses only visible pixels when encoding an occluded query", () => {
    const source = surface("horizontal", 99),
      hidden = coverAt(5, 2);
    const edited = { ...source, pixels: source.pixels.slice() };
    for (const index of hidden)
      for (let y = 0; y < 4; y++)
        for (let x = 0; x < 4; x++)
          edited.pixels[(Math.floor(index / 4) * 4 + y) * SIZE + (index % 4) * 4 + x] =
            1 - source.pixels[(Math.floor(index / 4) * 4 + y) * SIZE + (index % 4) * 4 + x]!;
    const encoder = createJepa(1).encoder;
    expect(Array.from(imageVector(encoder, source, hidden))).toEqual(
      Array.from(imageVector(encoder, edited, hidden)),
    );
  });
  it("ranks a catalogue image against its actual cosine vector", () => {
    const encoder = createJepa(1).encoder;
    for (const entry of CATALOGUE) {
      const result = search(encoder, entry.picture, []);
      expect(result.matches[0]?.texture).toBe(entry.texture);
      expect(result.matches[0]?.similarity).toBeCloseTo(1, 12);
      expect(result.matches.every((m) => m.similarity >= -1 && m.similarity <= 1)).toBe(true);
    }
  });
  it("changes camera pixels without changing the source image", () => {
    for (const kind of TEXTURES) {
      const source = surface(kind, 18),
        before = Array.from(source.pixels);
      const observed = observe(source, 0.7, 0.15);
      expect(Array.from(source.pixels)).toEqual(before);
      expect(Array.from(observed.pixels)).not.toEqual(before);
      expect(Array.from(observed.pixels).every((v) => v >= 0 && v <= 1)).toBe(true);
    }
  });
});
