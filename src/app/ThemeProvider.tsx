import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { refreshPalette } from "@/design/tokens";
import {
  applyTheme,
  readTheme,
  writePreference,
  THEME_KEY,
  type ThemeName,
} from "./preferences";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Owns the visitor's theme.
 *
 * The document already carries the right `data-theme` before this mounts — the
 * blocking script in `index.html` puts it there — so the initial state is read
 * back from storage rather than applied, and nothing flashes.
 *
 * Switching does three things in order: write the attribute so CSS variables
 * change, tell `design/tokens` its cached palette is stale, and update React
 * state. The palette refresh is what carries the change into every canvas;
 * without it the DOM would recolour and the drawings would not.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() =>
    typeof document === "undefined" ? "dark" : readTheme(),
  );

  const setTheme = useCallback((next: ThemeName) => {
    applyTheme(next);
    // CSS has changed; the canvas palette cache has not until it is told.
    refreshPalette();
    writePreference(THEME_KEY, next);
    setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
