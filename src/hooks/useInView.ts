import { useEffect, useState, type RefObject } from "react";

/**
 * Whether an element is on screen, or near it.
 *
 * For the labs that animate by themselves: a network that trains as the
 * page opens, a board that drops balls. Their loops used to keep running
 * after the visitor scrolled past them, training and repainting a picture
 * nobody could see, and every other section on the page paid for it. A
 * margin of a screen's height means a loop is already running again by the
 * time its picture scrolls back into view.
 *
 * Starts as true, so nothing waits on the first observer callback to appear.
 */
export function useInView(ref: RefObject<Element>, rootMargin = "100% 0px"): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), {
      rootMargin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
