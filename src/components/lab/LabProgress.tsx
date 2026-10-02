import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

/**
 * How far through a lab the visitor is: a hairline along the top edge of the
 * window, in the lab's field colour.
 *
 * ## Why a lab needs one
 *
 * A lab page is long — the tokenizer runs past 6,000px across six sections —
 * and nothing on it said how much was left. The sections have headings, but a
 * heading tells you where you are, not how far there is to go, and on a page
 * built to be worked through rather than skimmed that second thing is what
 * decides whether someone settles in or gives up.
 *
 * ## Why it is not a progress bar
 *
 * It has no role and is hidden from assistive technology. Scroll position is
 * something a screen reader already reports, and a `progressbar` that changed
 * on every scroll would be announced on every scroll. This is a sighted
 * convenience, and says so.
 *
 * ## Why it never re-renders
 *
 * The position is written straight into a CSS variable on the bar, once per
 * frame at most, from a passive listener. Following the scroll through React
 * state would re-render the bar on every scroll event for a value only the
 * compositor needs; this way a scroll costs one `getBoundingClientRect` and
 * one style write. `transform: scaleX` keeps it off the layout path entirely.
 *
 * It takes no transition: it follows the scroll, and a bar that lagged behind
 * the page would be a bar that was briefly wrong.
 */
export function LabProgress({
  targetRef,
  colour,
}: {
  /** The element whose extent counts as "the lab". */
  targetRef: RefObject<HTMLElement>;
  /** An RGB triplet variable, as `CATEGORY_VAR` produces. */
  colour: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const target = targetRef.current;
    if (!bar || !target) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      // Zero while the top of the lab is still in view, one when its bottom
      // edge reaches the bottom of the window.
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / travel));
      bar.style.setProperty("--lab-progress", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The lab's own content grows after mount — a lazy chunk, a dataset — and
    // the denominator has to grow with it.
    const resize = new ResizeObserver(schedule);
    resize.observe(target);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
    };
  }, [targetRef]);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="lab-progress"
      style={{ "--c": colour } as CSSProperties}
    />
  );
}
