import { labColor, type ColorToken } from "@/design/tokens";
import type { Texture } from "./engine";

/**
 * How the lab draws a kind: one theme colour each, read through `labColor`
 * so both themes work and nothing is added to the shared stylesheet.
 */
const KIND_TOKEN: Record<Texture, ColorToken> = {
  flat: "signalAmber",
  horizontal: "data",
  vertical: "signalRose",
  dots: "accent",
};

export const kindColor = (texture: Texture, alpha = 1): string =>
  labColor(KIND_TOKEN[texture], alpha);

/** A pixel's brightness as a grey, the same in either theme: a picture is data. */
export const grey = (value: number): string => {
  const level = Math.round(Math.min(1, Math.max(0, value)) * 255);
  return `rgb(${level} ${level} ${level})`;
};

/**
 * The map's half-width, in vector units, for points this far from the
 * middle: wide enough for them all, but never narrower than the floor, so a
 * collapse still shows as the cloud shrinking to a dot rather than being
 * zoomed back up to fill the frame.
 */
export const mapRange = (farthest: number): number => Math.max(0.4, farthest * 1.15);
