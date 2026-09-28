import { useEffect, useState } from "react";

/**
 * Whether the visitor has asked their system for less movement.
 *
 * ## Why this is ours
 *
 * Framer Motion shipped one of these, and for a while importing it was the
 * only reason 38 KB (gzipped) of animation library sat on the critical path of
 * a page whose motion is otherwise a handful of CSS keyframes. The hook itself
 * is a media query and a listener.
 *
 * ## Why it starts at `false`
 *
 * `matchMedia` is read in an effect rather than during render so the first
 * paint is identical on the server, in a test, and in a browser — a lab that
 * branches on this renders its full version for one frame and then settles,
 * which is the same order Framer Motion used. Nothing here starts an animation
 * on mount, so that frame is never a movement a visitor asked not to see.
 *
 * The CSS side is handled separately and unconditionally: `globals.css` clamps
 * every transition and animation under `prefers-reduced-motion`. This hook is
 * for the motion CSS cannot see — canvas loops, and gestures a component
 * chooses not to start at all.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
