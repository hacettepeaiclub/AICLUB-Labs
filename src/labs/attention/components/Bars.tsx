import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface BarsProps {
  names: readonly string[];
  values: readonly number[];
  /** The magnitude drawn at full width. Shared between two Bars to compare them. */
  scale: number;
  /**
   * Draw from a centre line. A query can genuinely ask for the *absence* of a
   * property — a pronoun is not looking for a verb — and drawing that as a
   * short positive bar would invert the meaning.
   */
  signed?: boolean;
  /** Names the group for assistive technology when it sits on its own. */
  label?: string;
}

/**
 * A small row of labelled, signed bars.
 *
 * Lifted out of the old `AttentionTrace` unchanged, because three stages now
 * draw one: the query, the key, and the blended output. The number is printed
 * beside every bar, so length is never the only channel.
 */
export function Bars({ names, values, scale, signed = false, label }: BarsProps) {
  return (
    <ul className="space-y-2" aria-label={label}>
      {names.map((name, i) => {
        const value = values[i] ?? 0;
        const width = (Math.abs(value) / scale) * (signed ? 50 : 100);
        return (
          <li key={name} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-caption text-fg-muted">{name}</span>
            <span aria-hidden className="relative h-2 flex-1 rounded-pill bg-line/10">
              {signed && <span className="absolute inset-y-0 left-1/2 w-px bg-line/20" />}
              <span
                className={cn(
                  "absolute inset-y-0 rounded-pill",
                  value < 0 ? "bg-fg-faint" : "bg-accent",
                )}
                style={
                  signed
                    ? value < 0
                      ? { right: "50%", width: `${width}%` }
                      : { left: "50%", width: `${width}%` }
                    : { left: 0, width: `${width}%` }
                }
              />
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-caption tabular-nums text-fg">
              {formatNumber(value, 2)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
