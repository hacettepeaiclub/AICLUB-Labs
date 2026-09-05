import { useSyncExternalStore } from "react";
import { paletteVersion, subscribePalette } from "@/design/tokens";

/**
 * A number that changes whenever the theme does.
 *
 * Put it in the dependency list of a canvas repaint and that canvas follows the
 * theme without knowing what a theme is. Components with their own frame loop
 * do not need this — their next frame already reads the new palette.
 */
export function usePaletteVersion(): number {
  return useSyncExternalStore(subscribePalette, paletteVersion, paletteVersion);
}
