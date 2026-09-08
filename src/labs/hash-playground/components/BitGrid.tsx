import { memo } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { HASH_BITS } from "../hashUtils";

export interface BitGridProps {
  /** 256 bits of the current digest, MSB first. */
  bits: readonly number[];
  /** Which of them flipped in the latest change. */
  changed: readonly boolean[];
}

/**
 * The digest as a 16×16 grid — one square per bit.
 *
 * Three states, and none of them is carried by colour alone: a bit that is 1
 * is filled, a bit that is 0 is an empty well, and a bit that flipped in the
 * last edit carries a ring around it as well as the live colour. That is what
 * makes "about half of them changed" something you can see rather than a
 * number you are told.
 *
 * ## What was removed
 *
 * Every changed cell used to remount and pulse a purple glow outward from the
 * centroid of the change — `0 0 12px rgb(139 92 246 / 0.75)`, a colour from no
 * palette in this project — with a per-cell delay so the grid rippled like an
 * impact, and a hover rule that scaled cells 125%. It was an explosion where a
 * measurement belonged. The grid is now still, and the only thing that moves
 * is which squares are filled.
 */
export const BitGrid = memo(function BitGrid({ bits, changed }: BitGridProps) {
  const t = useT().labs["hash-playground"];
  const lit = bits.reduce((sum, b) => sum + b, 0);
  const flipped = changed.reduce((sum, c) => sum + (c ? 1 : 0), 0);

  return (
    <div
      role="img"
      aria-label={t.bits.gridLabel(HASH_BITS, lit, HASH_BITS - lit, flipped)}
      className="grid gap-[3px] rounded border border-line/10 bg-ink-950 p-2"
      style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
    >
      {bits.map((bit, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "aspect-square rounded-[2px]",
            bit === 1 ? "bg-accent" : "bg-ink-700",
            // Colour plus a ring: the flip is legible without hue.
            changed[i] && "ring-1 ring-data",
            changed[i] && bit === 1 && "bg-data",
          )}
        />
      ))}
    </div>
  );
});
