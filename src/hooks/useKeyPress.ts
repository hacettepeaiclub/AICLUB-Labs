import { useEffect, useRef } from "react";

/**
 * Bind a keyboard shortcut. Ignores events while the user is typing in an
 * input, and never intercepts browser/system combinations.
 *
 *   useKeyPress(" ", togglePlay);   // spacebar
 *   useKeyPress("r", reset);
 */
export function useKeyPress(key: string, handler: (event: KeyboardEvent) => void, enabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      handlerRef.current(event);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, enabled]);
}
