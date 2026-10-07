/**
 * The finder's key, kept apart from the finder.
 *
 * The header prints it and the shell listens for it on every page, but the
 * palette itself is only fetched once someone is about to use it. Keeping the
 * key here is what lets those two stay in the entry bundle without dragging
 * the palette in after them.
 */

/** Mac shows ⌘, everyone else Ctrl. Read once; it does not change. */
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
export const PALETTE_SHORTCUT = isMac ? "⌘K" : "Ctrl K";

/**
 * ⌘K / Ctrl+K, and nothing else. Claimed anywhere, including inside a lab's
 * own text fields: the combination types nothing, so taking it costs no one a
 * keystroke.
 */
export const isPaletteShortcut = (event: KeyboardEvent): boolean =>
  event.key.toLowerCase() === "k" &&
  (event.metaKey || event.ctrlKey) &&
  !event.altKey &&
  !event.shiftKey;
