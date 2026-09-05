import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_LANGUAGE, DEFAULT_THEME, isLanguage, isTheme } from "./preferences";
import { colors } from "@/design/tokens";

/**
 * Contrast is checked against the stylesheet itself rather than a copy of the
 * numbers, so a theme edit that quietly drops a pair below AA fails here.
 */
const css = readFileSync("src/styles/globals.css", "utf8");

type Rgb = [number, number, number];

function block(selector: string): Record<string, Rgb> {
  const start = css.indexOf(selector);
  expect(start, `missing block: ${selector}`).toBeGreaterThan(-1);
  const body = css.slice(start, css.indexOf("}", start));
  const found: Record<string, Rgb> = {};
  for (const match of body.matchAll(/--([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+);/g)) {
    found[match[1]!] = [Number(match[2]), Number(match[3]), Number(match[4])];
  }
  return found;
}

const dark = block(":root,\n:root[data-theme=\"dark\"]");
const light = block(':root[data-theme="light"]');

const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const luminance = ([r, g, b]: Rgb) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const contrast = (a: Rgb, b: Rgb) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** `fg` at `alpha` over `bg` — how a low-alpha border actually lands. */
const over = (fg: Rgb, bg: Rgb, alpha: number): Rgb =>
  [0, 1, 2].map((i) => bg[i]! * (1 - alpha) + fg[i]! * alpha) as Rgb;

describe("preferences", () => {
  it("keeps the collection's original look as the default", () => {
    expect(DEFAULT_THEME).toBe("dark");
    expect(DEFAULT_LANGUAGE).toBe("en");
  });

  it("only accepts values it knows", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isLanguage("tr")).toBe(true);
    expect(isLanguage("de")).toBe(false);
    expect(isLanguage(undefined)).toBe(false);
  });
});

describe("tokens", () => {
  it("defines every token in both themes", () => {
    const required = [
      "ink-950",
      "ink-900",
      "ink-800",
      "ink-700",
      "line",
      "fg",
      "fg-muted",
      "fg-faint",
      "accent",
      "accent-fill",
      "accent-fg",
      "accent-soft",
      "signal-cyan",
      "signal-green",
      "signal-amber",
      "signal-rose",
      "signal-blue",
    ];
    for (const token of required) {
      expect(dark[token], `dark --${token}`).toBeDefined();
      expect(light[token], `light --${token}`).toBeDefined();
    }
  });

  it("keeps the TypeScript fallback in step with the dark stylesheet", () => {
    // `design/tokens.ts` falls back to these wherever there is no document.
    expect(colors.ink950.split(" ").map(Number)).toEqual(dark["ink-950"]);
    expect(colors.fg.split(" ").map(Number)).toEqual(dark["fg"]);
    expect(colors.accent.split(" ").map(Number)).toEqual(dark["accent"]);
  });

  it("reverses the elevation ramp for a light ground", () => {
    // Dark: the page is the darkest thing and cards sit above it.
    expect(luminance(dark["ink-950"]!)).toBeLessThan(luminance(dark["ink-800"]!));
    // Light: the page is off-white and cards are whiter still.
    expect(luminance(light["ink-950"]!)).toBeLessThan(luminance(light["ink-800"]!));
    expect(luminance(light["ink-800"]!)).toBeGreaterThan(0.9);
  });

  it("flips the stroke colour, so borders stay borders", () => {
    expect(luminance(dark["line"]!)).toBeGreaterThan(0.9);
    expect(luminance(light["line"]!)).toBeLessThan(0.1);
  });
});

describe("contrast — WCAG AA", () => {
  const surfaces = (theme: Record<string, Rgb>) => [
    ["page", theme["ink-950"]!],
    ["inset", theme["ink-900"]!],
    ["card", theme["ink-800"]!],
    ["raised", theme["ink-700"]!],
  ] as const;

  for (const [name, theme] of [
    ["dark", dark],
    ["light", light],
  ] as const) {
    it(`${name}: body text clears 4.5:1 on every surface`, () => {
      for (const [surface, bg] of surfaces(theme)) {
        expect(contrast(theme["fg"]!, bg), `${name} fg on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${name}: muted text clears 4.5:1 on page and card`, () => {
      for (const surface of ["ink-950", "ink-800"] as const) {
        expect(
          contrast(theme["fg-muted"]!, theme[surface]!),
          `${name} fg-muted on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${name}: faint text clears 3:1, the large/secondary floor`, () => {
      expect(contrast(theme["fg-faint"]!, theme["ink-950"]!)).toBeGreaterThanOrEqual(3);
      expect(contrast(theme["fg-faint"]!, theme["ink-800"]!)).toBeGreaterThanOrEqual(3);
    });

    it(`${name}: accent text clears 4.5:1 on every surface`, () => {
      for (const [surface, bg] of surfaces(theme)) {
        expect(
          contrast(theme["accent"]!, bg),
          `${name} accent text on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${name}: a label on the accent fill clears 4.5:1`, () => {
      // The reason the accent is two tokens: no single violet can be light
      // enough to read on ink and dark enough to carry a near-white label.
      expect(contrast(theme["accent-fg"]!, theme["accent-fill"]!)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${name}: the focus ring is visible against every surface`, () => {
      for (const [surface, bg] of surfaces(theme)) {
        expect(contrast(theme["accent"]!, bg), `${name} ring on ${surface}`).toBeGreaterThanOrEqual(
          3,
        );
      }
    });

    it(`${name}: every state signal clears 3:1 on the card surface`, () => {
      for (const signal of ["signal-green", "signal-amber", "signal-rose", "signal-cyan"] as const) {
        expect(
          contrast(theme[signal]!, theme["ink-800"]!),
          `${name} ${signal} on card`,
        ).toBeGreaterThanOrEqual(3);
      }
    });

    it(`${name}: hairline borders are actually visible`, () => {
      // Borders are drawn at 10% alpha; they only have to be perceptible.
      const border = over(theme["line"]!, theme["ink-800"]!, 0.1);
      expect(contrast(border, theme["ink-800"]!), `${name} border/10`).toBeGreaterThan(1.1);
    });
  }
});
