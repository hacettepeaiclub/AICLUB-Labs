import { memo, useMemo, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/design/motion";
import { cn } from "@/lib/cn";

export interface BitMatrixProps {
  /** 256 bits of the current digest, MSB first. */
  bits: number[];
  /** Which bits flipped in the latest change. */
  changedFlags: boolean[];
  version: number;
}

const GRID = 16;

interface HoverInfo {
  index: number;
  bit: number;
  x: number;
  y: number;
}

/** One bit. Memoized so hover-tooltip state never re-renders all 256 cells. */
const Cell = memo(function Cell({
  bit,
  isChanged,
  delay,
  version,
  reduced,
  index,
}: {
  bit: number;
  isChanged: boolean;
  delay: number;
  version: number;
  reduced: boolean | null;
  index: number;
}) {
  return (
    <motion.span
      // Remount changed cells on each digest so the pulse re-fires.
      key={isChanged ? `${version}-${index}` : index}
      data-index={index}
      data-bit={bit}
      initial={isChanged && !reduced ? { scale: 0.25, opacity: 0.2 } : false}
      animate={
        isChanged && !reduced
          ? {
              scale: [0.25, 1.2, 1],
              opacity: [0.2, 1, 1],
              boxShadow: [
                "0 0 0px rgb(139 92 246 / 0)",
                "0 0 12px rgb(139 92 246 / 0.75)",
                "0 0 0px rgb(139 92 246 / 0)",
              ],
            }
          : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.55, delay: reduced ? 0 : delay, ease: [...ease.out] }}
      className={cn(
        "aspect-square rounded-[3px] transition-colors duration-base",
        "hover:!scale-125 hover:ring-1 hover:ring-fg/40",
        bit === 1 ? "bg-accent-fill" : "bg-ink-700",
      )}
    />
  );
});

/**
 * The digest as a 16×16 grid — one square per bit. Changed bits glow and pulse
 * in a ripple that spreads from the centroid of the change, so every avalanche
 * looks like an impact. Hovering any square reveals its index and value.
 */
export const BitMatrix = memo(function BitMatrix({ bits, changedFlags, version }: BitMatrixProps) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const litCount = bits.reduce((sum, b) => sum + b, 0);

  // Ripple origin = centroid of the changed bits (falls back to grid center).
  const delays = useMemo(() => {
    let sumR = 0;
    let sumC = 0;
    let n = 0;
    changedFlags.forEach((f, i) => {
      if (!f) return;
      sumR += Math.floor(i / GRID);
      sumC += i % GRID;
      n++;
    });
    const originR = n > 0 ? sumR / n : (GRID - 1) / 2;
    const originC = n > 0 ? sumC / n : (GRID - 1) / 2;
    return bits.map((_, i) => {
      const r = Math.floor(i / GRID);
      const c = i % GRID;
      return (Math.hypot(r - originR, c - originC) / GRID) * 0.55;
    });
  }, [changedFlags, bits]);

  // One shared tooltip via event delegation — no per-cell listeners or state.
  const handleOver = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const idx = target.dataset["index"];
    if (idx === undefined) return;
    const grid = e.currentTarget.getBoundingClientRect();
    const cell = target.getBoundingClientRect();
    setHover({
      index: Number(idx),
      bit: Number(target.dataset["bit"] ?? 0),
      x: cell.left - grid.left + cell.width / 2,
      y: cell.top - grid.top,
    });
  };

  return (
    <div className="card-surface p-6 md:p-8">
      <div
        role="img"
        aria-label={`The 256 bits of the current hash as a 16 by 16 grid. ${litCount} bits are 1, ${256 - litCount} are 0.`}
        onMouseOver={handleOver}
        onMouseLeave={() => setHover(null)}
        className="relative mx-auto grid max-w-md gap-1 md:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
      >
        {bits.map((bit, i) => (
          <Cell
            key={i}
            index={i}
            bit={bit}
            isChanged={changedFlags[i] === true}
            delay={delays[i] ?? 0}
            version={version}
            reduced={reduced}
          />
        ))}
        {hover && (
          <span
            role="tooltip"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full
              whitespace-nowrap rounded border border-line/15 bg-ink-700 px-2.5 py-1.5
              font-mono text-caption text-fg shadow-card"
            style={{ left: hover.x, top: hover.y - 6 }}
          >
            bit {hover.index} <span className="text-fg-faint">=</span>{" "}
            <span className={hover.bit === 1 ? "text-accent" : "text-fg-muted"}>{hover.bit}</span>
          </span>
        )}
      </div>
      <p className="mt-5 text-center text-caption text-fg-faint">
        <span className="mr-1.5 inline-block size-2 rounded-[2px] bg-accent-fill align-middle" /> 1
        <span className="ml-5 mr-1.5 inline-block size-2 rounded-[2px] bg-ink-700 align-middle" /> 0
        <span className="ml-5">{litCount} of 256 bits lit</span>
      </p>
    </div>
  );
});
