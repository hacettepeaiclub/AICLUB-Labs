/**
 * The two preferences the visitor owns: theme and language.
 *
 * Kept in one small module with no React in it, because the same reading logic
 * has to run twice — once in the blocking script in `index.html` before React
 * exists, and once inside the providers. Two copies of "which theme is this"
 * is exactly how a theme flash gets introduced.
 */

export const THEME_KEY = "aiclub-labs-theme";
export const LANGUAGE_KEY = "aiclub-labs-language";

export type ThemeName = "dark" | "light";
export type Language = "en" | "tr";

/** Dark and English are what the collection shipped with; both stay default. */
export const DEFAULT_THEME: ThemeName = "dark";
export const DEFAULT_LANGUAGE: Language = "en";

export const isTheme = (value: unknown): value is ThemeName =>
  value === "dark" || value === "light";

export const isLanguage = (value: unknown): value is Language =>
  value === "en" || value === "tr";

/**
 * Read a stored preference.
 *
 * Storage can throw outright — Safari in private mode, an embedded webview, a
 * browser set to block site data — so every read is guarded and falls back to
 * the default rather than taking the page down with it.
 */
function readStored<T>(key: string, guard: (v: unknown) => v is T, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return guard(raw) ? raw : fallback;
  } catch {
    return fallback;
  }
}

export const readTheme = (): ThemeName => readStored(THEME_KEY, isTheme, DEFAULT_THEME);
export const readLanguage = (): Language => readStored(LANGUAGE_KEY, isLanguage, DEFAULT_LANGUAGE);

export function writePreference(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // A preference that cannot be saved is not worth breaking the page over.
  }
}

/**
 * Put the theme on the document.
 *
 * `data-theme` is what the CSS selectors key off, and `color-scheme` follows
 * from it so native controls, scrollbars and form widgets match.
 */
export function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute("data-theme", theme);
  // Mobile browsers paint their chrome with this; leaving it dark under a
  // light page is the one bit of theming a CSS variable cannot reach.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fb" : "#0a0a0f");
}

/** Put the language on the document, so `<html lang>` is honest. */
export function applyLanguage(language: Language): void {
  document.documentElement.setAttribute("lang", language);
}
