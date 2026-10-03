import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  changedBitFlags,
  changedHexChars,
  commonHexPrefix,
  countChangedBits,
  hexToBits,
  sha256Hex,
  HASH_BITS,
  HEX_CHARS,
} from "./hashUtils";

/** Independent oracle: Node's own SHA-256, not the Web Crypto path under test. */
const reference = (input: string): string =>
  createHash("sha256").update(input, "utf8").digest("hex");

const SAMPLES = ["", "a", "abc", "hello world", "hello world!", "  ", "ünïcödé ✓", "🔒🔑"];

describe("sha256Hex", () => {
  it("matches the published vectors", async () => {
    expect(await sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
    expect(await sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("agrees with an independent implementation, including non-ASCII input", async () => {
    for (const sample of SAMPLES) {
      expect(await sha256Hex(sample)).toBe(reference(sample));
    }
  });

  it("is deterministic", async () => {
    expect(await sha256Hex("hello world")).toBe(await sha256Hex("hello world"));
  });

  it("always produces 64 lowercase hex characters, whatever the input length", async () => {
    for (const sample of ["", "x", "x".repeat(10_000)]) {
      const digest = await sha256Hex(sample);
      expect(digest).toHaveLength(HEX_CHARS);
      expect(digest).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});

describe("hexToBits", () => {
  it("expands a digest to 256 bits that are only ever 0 or 1", async () => {
    const bits = hexToBits(await sha256Hex("hello world"));
    expect(bits).toHaveLength(HASH_BITS);
    expect(bits.every((bit) => bit === 0 || bit === 1)).toBe(true);
  });

  it("reads each hex character most-significant bit first", () => {
    // "8" is 1000, "1" is 0001 — order is what a wrong shift would break.
    const bits = hexToBits("81".padEnd(HEX_CHARS, "0"));
    expect(bits.slice(0, 8)).toEqual([1, 0, 0, 0, 0, 0, 0, 1]);
  });

  it("round-trips back to the original hex", async () => {
    const digest = await sha256Hex("round trip");
    const bits = hexToBits(digest);
    const rebuilt = Array.from({ length: HEX_CHARS }, (_, i) =>
      parseInt(bits.slice(i * 4, i * 4 + 4).join(""), 2).toString(16),
    ).join("");
    expect(rebuilt).toBe(digest);
  });
});

describe("difference helpers", () => {
  it("report no change between a digest and itself", async () => {
    const digest = await sha256Hex("same");
    expect(countChangedBits(digest, digest)).toBe(0);
    expect(changedBitFlags(digest, digest).some(Boolean)).toBe(false);
    expect(changedHexChars(digest, digest).some(Boolean)).toBe(false);
    expect(commonHexPrefix(digest, digest)).toBe(HEX_CHARS);
  });

  it("keep the bit count and the per-bit flags in agreement", async () => {
    const a = await sha256Hex("hello world");
    const b = await sha256Hex("hello world!");
    expect(countChangedBits(a, b)).toBe(changedBitFlags(a, b).filter(Boolean).length);
  });

  it("counts a hand-checked case", () => {
    // 0x0 = 0000 vs 0xf = 1111 in the first nibble: four flipped bits.
    const a = "0".repeat(HEX_CHARS);
    const b = "f" + "0".repeat(HEX_CHARS - 1);
    expect(countChangedBits(a, b)).toBe(4);
    expect(changedHexChars(a, b).filter(Boolean)).toHaveLength(1);
    expect(commonHexPrefix(a, b)).toBe(0);
  });

  it("measures the shared prefix up to the first difference", () => {
    const a = "abcd" + "0".repeat(HEX_CHARS - 4);
    const b = "abce" + "0".repeat(HEX_CHARS - 4);
    expect(commonHexPrefix(a, b)).toBe(3);
  });
});

describe("the avalanche claim the lab is built on", () => {
  it("flips roughly half the bits when one character changes", async () => {
    const pairs: [string, string][] = [
      ["hello world", "hello world!"],
      ["hello world", "Hello world"],
      ["a", "b"],
      ["the quick brown fox", "the quick brown fax"],
    ];
    for (const [a, b] of pairs) {
      const changed = countChangedBits(await sha256Hex(a), await sha256Hex(b));
      // Expected value is 128. A wide band keeps this a claim about the
      // avalanche effect rather than a snapshot of four specific digests.
      expect(changed).toBeGreaterThan(90);
      expect(changed).toBeLessThan(166);
    }
  });
});
