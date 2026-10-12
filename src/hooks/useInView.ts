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
 * Starts as false. It used to start as true, and that meant every loop on a
 * page ran its first frames at once, the ones far below the fold included,
 * until the observer's first report arrived a frame later and stopped them:
 * on the multilayer-perceptrons page that burst was one 600 ms frame on a
 * slow phone. The observer reports on its first frame, so what is on screen
 * starts a frame later than it did and nothing else starts at all. Where
 * there is no observer to ask, everything counts as visible.
 */
export function useInView(ref: RefObject<Element>, rootMargin = "100% 0px"): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), {
      rootMargin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
