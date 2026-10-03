import { cn } from "@/lib/cn";
import { fromRows, type Grid } from "../engine";
import { parseWeight } from "../view";

/** Nine cells of text, row by row. */
export type KernelText = readonly string[];

/**
 * The kernel the cells describe, or null while any cell is not a number.
 *
 * All nine have to read before anything is drawn: a kernel with a hole in it
 * is not a kernel, and quietly treating the hole as 0 would show the visitor
 * the output of weights they did not type.
 */
export function kernelOf(cells: KernelText): Grid | null {
  const values = cells.map(parseWeight);
  if (values.length !== 9 || values.some((v) => v === null)) return null;
  const v = values as number[];
  return fromRows([v.slice(0, 3), v.slice(3, 6), v.slice(6, 9)]);
}

export const textOf = (rows: readonly (readonly string[])[]): string[] => rows.flat();

/**
 * Nine fields, laid out as the kernel is.
 *
 * Plain text inputs: a number input would refuse `1/9`, and on most phones
 * its keypad has no minus sign — which, for a kernel, is half the weights.
 */
export function KernelEditor({
  cells,
  onChange,
  label,
  cellLabel,
  invalid,
  className,
}: {
  cells: KernelText;
  onChange: (cells: string[]) => void;
  label: string;
  cellLabel: (row: number, column: number) => string;
  invalid: string;
  className?: string;
}) {
  const bad = cells.map((c) => parseWeight(c) === null);
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-2 text-overline uppercase text-fg-faint">{label}</legend>
      <div className="grid grid-cols-3 gap-1.5">
        {cells.map((text, k) => (
          <input
            key={k}
            type="text"
            value={text}
            maxLength={8}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={cellLabel(Math.floor(k / 3) + 1, (k % 3) + 1)}
            aria-invalid={bad[k] ? true : undefined}
            onChange={(event) => {
              const next = [...cells];
              next[k] = event.target.value;
              onChange(next);
            }}
            onFocus={(event) => event.currentTarget.select()}
            className={cn(
              "min-h-[44px] w-full min-w-0 rounded border bg-ink-950 px-1 text-center font-mono text-body-sm text-fg",
              "transition-colors duration-fast hover:border-line/25",
              bad[k]
                ? "border-signal-amber/60 focus:border-signal-amber"
                : "border-line/15 focus:border-accent/50",
            )}
          />
        ))}
      </div>
      {bad.some(Boolean) && <p className="mt-1.5 text-caption text-signal-amber">{invalid}</p>}
    </fieldset>
  );
}
