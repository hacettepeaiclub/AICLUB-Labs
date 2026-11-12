import { createRng } from "@/lib/random";
import {
  embed,
  makePicture,
  patchOf,
  GRID,
  PATCH,
  SIZE,
  TEXTURES,
  type Net,
  type Picture,
  type Texture,
} from "./engine";

/** Resample real patches from the lab's generator; catalogue images are not training examples. */
export function surface(texture: Texture, seed: number): Picture {
  const rng = createRng(seed);
  const pool: { pixels: Float64Array; offset: number }[] = [];
  while (pool.length < GRID * GRID) {
    const p = makePicture(rng);
    p.textures.forEach((kind, i) => {
      if (kind === texture) pool.push({ pixels: patchOf(p, i), offset: p.offsets[i]! });
    });
  }
  const pixels = new Float64Array(SIZE * SIZE);
  for (let i = 0; i < GRID * GRID; i++)
    for (let y = 0; y < PATCH; y++)
      for (let x = 0; x < PATCH; x++)
        pixels[(Math.floor(i / GRID) * PATCH + y) * SIZE + (i % GRID) * PATCH + x] =
          pool[i]!.pixels[y * PATCH + x]!;
  return {
    pixels,
    textures: Array<Texture>(GRID * GRID).fill(texture),
    offsets: pool.slice(0, GRID * GRID).map((p) => p.offset),
  };
}
export const CATALOGUE = TEXTURES.map((texture, i) => ({
  texture,
  picture: surface(texture, 900 + i),
}));

export function observe(source: Picture, light: number, noise: number): Picture {
  const rng = createRng(601);
  return {
    ...source,
    pixels: source.pixels.map((v) => Math.max(0, Math.min(1, v * light + (rng() * 2 - 1) * noise))),
  };
}
export function coverAt(index: number, size: number): number[] {
  const count = Math.max(0, Math.min(3, Math.round(size)));
  const x = Math.min(GRID - count, Math.max(0, index % GRID));
  const y = Math.min(GRID - count, Math.max(0, Math.floor(index / GRID)));
  return Array.from(
    { length: count * count },
    (_, i) => (y + Math.floor(i / count)) * GRID + x + (i % count),
  );
}
export function imageVector(net: Net, picture: Picture, hidden: readonly number[]): Float64Array {
  const mean = new Float64Array(net.outputs);
  let count = 0;
  for (let i = 0; i < GRID * GRID; i++) {
    if (hidden.includes(i)) continue;
    const vector = embed(net, patchOf(picture, i));
    const norm = Math.hypot(...vector) || 1;
    vector.forEach((v, d) => {
      mean[d] = mean[d]! + v / norm;
    });
    count++;
  }
  if (!count) return mean;
  const norm = Math.hypot(...mean) || 1;
  return mean.map((v) => v / norm);
}
export function search(net: Net, picture: Picture, hidden: readonly number[]) {
  const vector = imageVector(net, picture, hidden);
  const matches = CATALOGUE.map((entry) => {
    const reference = imageVector(net, entry.picture, []);
    const similarity = vector.reduce((sum, v, i) => sum + v * reference[i]!, 0);
    return { ...entry, similarity: Math.max(-1, Math.min(1, similarity)) };
  }).sort((a, b) => b.similarity - a.similarity);
  return { vector, matches };
}
