import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { createRng } from "@/lib/random";
import { createSort, runToEnd, step, type Sort } from "@/labs/sorting-race/engine";
import { cn } from "@/lib/cn";

/**
 * The hero's miniature: a real insertion sort, actually running.
 *
 * ## Why this is the real engine and not an animation
 *
 * The claim on this page is that you learn by watching a system behave. A
 * scripted loop that *looks* like sorting would make that claim while breaking
 * it. So this imports `sorting-race/engine` — the same pure module the lab
 * uses, the same `step()` producing one observable operation at a time — and
 * draws whatever it reports. The bars are the engine's own `values`; the
 * highlight is the pair it just compared.
 *
 * ## Why it is the only engine the home page imports
 *
 * Nine live previews would mean nine engine imports in the entry chunk, and the
 * registry is lazy precisely so a visitor downloads one lab, not all of them.
 * `sorting-race/engine` is pure TypeScript with no React and no dataset, so it
 * costs a couple of kilobytes. The other labs are represented by `LabSignature`,
 * which draws from their shape rather than their code.
 *
 * ## Why it stops
 *
 * The loop cancels itself the moment the sort reports `done`. Nothing in this
 * collection is allowed to hold a `requestAnimationFrame` open at rest, and a
 * decorative one on the busiest page would be the worst place to start.
 *
 * Under reduced motion it never animates at all: `runToEnd` — which the engine
 * documents as exactly this path — produces the finished array on the first
 * render, so the picture is the same one everybody else ends up looking at.
 */

/** Bars, and the pause between operations. Small enough to stay cheap. */
const COUNT = 28;
const MS_PER_STEP = 45;

/** A fixed, seeded starting array so the hero is the same on every load. */
function startingValues(): Int32Array {
  const rng = createRng(0x5a17);
  const values = new Int32Array(COUNT);
  for (let i = 0; i < COUNT; i++) values[i] = 8 + Math.floor(rng() * 92);
  return values;
}

export interface SortingPreviewProps {
  /** Described to assistive technology; the bars themselves are decorative. */
  label: string;
  className?: string;
}

export function SortingPreview({ label, className }: SortingPreviewProps) {
  const reduced = useReducedMotion();
  const [sort, setSort] = useState<Sort>(() => {
    const s = createSort(startingValues(), "insertion");
    if (reduced) runToEnd(s);
    return s;
  });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    let live = true;
    let last = 0;
    const tick = (now: number) => {
      if (!live) return;
      if (now - last >= MS_PER_STEP) {
        last = now;
        setSort((current) => {
          if (current.status === "done") return current;
          step(current);
          // The engine mutates in place; a shallow copy is what tells React
          // the frame changed without copying the values array every step.
          return { ...current };
        });
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      live = false;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [reduced]);

  // Nothing is scheduled once the sort finishes: the effect above returns to
  // the browser and never asks for another frame.
  useEffect(() => {
    if (sort.status === "done" && frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, [sort.status]);

  const max = 100;
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("flex h-full w-full items-end gap-[2px]", className)}
    >
      {Array.from(sort.values, (value, index) => {
        const settled = index < sort.sortedPrefix;
        const touched = index === sort.a || index === sort.b;
        return (
          <span
            key={index}
            aria-hidden
            className={cn(
              "min-w-0 flex-1 rounded-[1px]",
              // Three states, three roles: the value being worked on is live
              // data, the finished prefix is the brand, the rest is inert.
              touched ? "bg-data" : settled ? "bg-accent" : "bg-fg-faint/35",
            )}
            style={{ height: `${(value / max) * 100}%` }}
          />
        );
      })}
    </div>
  );
}
