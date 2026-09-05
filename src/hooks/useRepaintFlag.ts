import { useCallback, useEffect, useState } from "react";
import { usePaletteVersion } from "./usePaletteVersion";

export interface RepaintFlag {
  /** Request one repaint. Stable, so it can be passed straight to useEffect. */
  markDirty: () => void;
  /**
   * Increments on every `markDirty`. Pass it to `useCanvas2D` as the repaint
   * key: a still canvas repaints exactly when this changes.
   */
  version: number;
}

/**
 * A repaint request for canvases that hold a still image most of the time.
 *
 * Several views here only change when a control moves — redrawing them sixty
 * times a second would burn a core to produce the same pixels.
 *
 * This used to be a mutable flag that the draw callback checked and cleared,
 * while the frame loop spun regardless. That skipped the *painting* but not the
 * loop, which cost about a thousand animation-frame callbacks a second on a
 * page nobody was touching. Now the counter drives `useCanvas2D`'s effect
 * directly, so a still canvas schedules nothing at all and no draw callback has
 * to guard itself.
 */
export function useRepaintFlag(): RepaintFlag {
  const [version, setVersion] = useState(0);
  // A theme change repaints every still canvas, without any of them having to
  // know a theme exists.
  const theme = usePaletteVersion();

  const markDirty = useCallback(() => {
    setVersion((n) => n + 1);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", markDirty);
    return () => window.removeEventListener("resize", markDirty);
  }, [markDirty]);

  return { markDirty, version: version + theme };
}
