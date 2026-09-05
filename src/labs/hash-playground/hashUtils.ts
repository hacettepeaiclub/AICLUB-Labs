/**
 * Pure helpers for SHA-256 hex digests. No React, no side effects —
 * everything here is trivially unit-testable.
 */

export const HASH_BITS = 256;
export const HEX_CHARS = 64;

/** SHA-256 of a UTF-8 string via the Web Crypto API, as lowercase hex. */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const nibble = (hex: string, i: number): number => parseInt(hex[i] ?? "0", 16);

/** Expand a 64-char hex digest into 256 individual bits (MSB first). */
export function hexToBits(hex: string): number[] {
  const bits: number[] = new Array(HASH_BITS).fill(0);
  for (let i = 0; i < HEX_CHARS; i++) {
    const v = nibble(hex, i);
    bits[i * 4] = (v >> 3) & 1;
    bits[i * 4 + 1] = (v >> 2) & 1;
    bits[i * 4 + 2] = (v >> 1) & 1;
    bits[i * 4 + 3] = v & 1;
  }
  return bits;
}

/** Per-bit "did this bit flip between the two digests" flags. */
export function changedBitFlags(aHex: string, bHex: string): boolean[] {
  const flags: boolean[] = new Array(HASH_BITS).fill(false);
  for (let i = 0; i < HEX_CHARS; i++) {
    const x = nibble(aHex, i) ^ nibble(bHex, i);
    if (x === 0) continue;
    flags[i * 4] = ((x >> 3) & 1) === 1;
    flags[i * 4 + 1] = ((x >> 2) & 1) === 1;
    flags[i * 4 + 2] = ((x >> 1) & 1) === 1;
    flags[i * 4 + 3] = (x & 1) === 1;
  }
  return flags;
}

/** Number of bits that differ between two digests (0–256). */
export function countChangedBits(aHex: string, bHex: string): number {
  let count = 0;
  for (let i = 0; i < HEX_CHARS; i++) {
    let x = nibble(aHex, i) ^ nibble(bHex, i);
    while (x) {
      count += x & 1;
      x >>= 1;
    }
  }
  return count;
}

/** Per-hex-character "did this character change" flags. */
export function changedHexChars(aHex: string, bHex: string): boolean[] {
  const flags: boolean[] = new Array(HEX_CHARS).fill(false);
  for (let i = 0; i < HEX_CHARS; i++) flags[i] = aHex[i] !== bHex[i];
  return flags;
}

/** Length of the shared leading run of identical hex characters. */
export function commonHexPrefix(aHex: string, bHex: string): number {
  let i = 0;
  while (i < HEX_CHARS && aHex[i] === bHex[i]) i++;
  return i;
}
