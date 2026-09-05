import { useEffect, useState } from "react";

/**
 * The value, but only once it stops changing.
 *
 * Written for live regions: a counter that updates on every keystroke — or on
 * every frame of an animation — turns `aria-live` into a stream of
 * interruptions. Announcing the settled value instead gives a screen reader
 * one useful sentence per burst of activity, which is what the visitor
 * actually wanted to know (docs/GUIDELINES.md → announce async results).
 */
export function useDebouncedValue<T>(value: T, delayMs = 600): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setSettled(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return settled;
}
