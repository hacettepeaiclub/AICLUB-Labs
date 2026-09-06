/**
 * TypeScript view of the CSS custom properties in src/styles/globals.css.
 *
 * Use these ONLY where CSS variables can't reach: canvas drawing, SVG fills
 * computed in JS, chart scales. For DOM styling always use Tailwind classes.
 *
 * ## Why this reads the stylesheet
 *
 * The values below are the dark theme, and they are a *fallback*, not the
 * source of truth. At runtime the palette is read back out of the document's
 * computed styles, so a theme switch moves canvas colours and CSS colours
 * together and there is only ever one place a colour is defined. Without that,
 * flipping to light would repaint the DOM and leave every canvas painting in
 * the dark palette.
 *
 * Reading computed styles is not free, so the resolved palette is cached and
 * invalidated explicitly by the theme provider through `refreshPalette()`.
 * `paletteVersion()` lets a paint module cache its own derived colours and know
 * when to recompute them.
 */

const rgb = (triplet: string, alpha = 1) =>
  alpha === 1 ? `rgb(${triplet})` : `rgb(${triplet} / ${alpha})`;

/** The dark theme, and the fallback wherever there is no document (tests, SSR). */
export const colors = {
  ink950: "10 10 15",
  ink900: "16 16 24",
  ink800: "23 23 34",
  ink700: "32 32 46",
  fg: "237 237 244",
  fgMuted: "158 158 178",
  fgFaint: "108 108 128",
  accent: "75 148 213",
  accentSoft: "36 57 76",
  signalCyan: "34 211 238",
  signalGreen: "52 211 153",
  signalAmber: "251 191 36",
  signalRose: "251 113 133",
  signalBlue: "96 165 250",
} as const;

export type ColorToken = keyof typeof colors;
export type Palette = Record<ColorToken, string>;

/** Token name → the CSS custom property that holds it. */
const CSS_VARIABLE: Palette = {
  ink950: "--ink-950",
  ink900: "--ink-900",
  ink800: "--ink-800",
  ink700: "--ink-700",
  fg: "--fg",
  fgMuted: "--fg-muted",
  fgFaint: "--fg-faint",
  accent: "--accent",
  accentSoft: "--accent-soft",
  signalCyan: "--signal-cyan",
  signalGreen: "--signal-green",
  signalAmber: "--signal-amber",
  signalRose: "--signal-rose",
  signalBlue: "--signal-blue",
};

let cache: Palette | null = null;
let version = 0;
const listeners = new Set<() => void>();

/**
 * Subscribe to theme changes.
 *
 * Canvases that hold a still image have no frame loop to notice a new palette,
 * so they listen here and repaint once. Returns an unsubscribe function.
 */
export function subscribePalette(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read(): Palette {
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") {
    return { ...colors };
  }
  const computed = getComputedStyle(document.documentElement);
  const resolved = {} as Palette;
  for (const token of Object.keys(CSS_VARIABLE) as ColorToken[]) {
    const value = computed.getPropertyValue(CSS_VARIABLE[token]).trim();
    // A stylesheet that has not applied yet resolves to "", so fall back
    // rather than emitting `rgb()` and painting nothing.
    resolved[token] = value === "" ? colors[token] : value;
  }
  return resolved;
}

/** The palette for the theme currently on the document. */
export function palette(): Palette {
  cache ??= read();
  return cache;
}

/**
 * Bumps whenever the palette changes. Paint modules that derive colours once
 * (tints, alphas, gradients) compare against this to know when to rebuild.
 */
export const paletteVersion = (): number => version;

/** Called by the theme provider after `data-theme` changes on the document. */
export function refreshPalette(): void {
  cache = null;
  version++;
  for (const listener of listeners) listener();
}

/** Resolve a token to a CSS color string for canvas/SVG use. */
export const color = (token: ColorToken, alpha = 1): string => rgb(palette()[token], alpha);

/** Ordered categorical palette for data visualization inside labs. */
export const categorical = (): readonly string[] => [
  color("accent"),
  color("signalCyan"),
  color("signalGreen"),
  color("signalAmber"),
  color("signalRose"),
  color("signalBlue"),
];
