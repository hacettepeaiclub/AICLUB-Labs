import { useState } from "react";
import { cn } from "@/lib/cn";

export interface ExactDigitsProps {
  /** The full exact decimal. */
  text: string;
  /** Index from which the digits disagree with what was typed; null if none do. */
  from: number | null;
  /** Labels for the collapse control, from the lab's copy. */
  showAll: (count: number) => string;
  showLess: string;
  className?: string;
}

/** Above this many characters the middle of the number is folded away. */
const LIMIT = 96;
const TAIL = 24;

/**
 * An exact decimal, with the digits that drifted from the typed value marked.
 *
 * Marked digits are underlined as well as coloured, so the boundary reads
 * without hue. The value is every digit the stored number has — float64's 0.1
 * has 55 of them after the point, and its smallest subnormal more than 750 —
 * so a long one is folded in the middle with the count of what is hidden and
 * a way to see it. The head and the tail stay: the head is where the number
 * agrees with you, the tail is where it ends, and both are the point.
 */
export function ExactDigits({ text, from, showAll, showLess, className }: ExactDigitsProps) {
  const [open, setOpen] = useState(false);
  const folded = !open && text.length > LIMIT;
  const head = folded ? text.slice(0, LIMIT - TAIL) : text;
  const tail = folded ? text.slice(text.length - TAIL) : "";
  const tailStart = text.length - TAIL;

  const runs = (part: string, offset: number) => {
    if (from === null || from >= offset + part.length) return [{ s: part, marked: false }];
    if (from <= offset) return [{ s: part, marked: true }];
    return [
      { s: part.slice(0, from - offset), marked: false },
      { s: part.slice(from - offset), marked: true },
    ];
  };

  const render = (part: string, offset: number) =>
    runs(part, offset).map((run, i) =>
      run.marked ? (
        <span key={i} className="text-data underline decoration-data/60 underline-offset-[3px]">
          {run.s}
        </span>
      ) : (
        <span key={i} className="text-fg">
          {run.s}
        </span>
      ),
    );

  return (
    <div className={cn("min-w-0", className)}>
      <p className="break-all font-mono text-body-sm leading-relaxed tracking-wide">
        {render(head, 0)}
        {folded && (
          <>
            <span className="px-1 text-fg-faint">…</span>
            {render(tail, tailStart)}
          </>
        )}
      </p>
      {text.length > LIMIT && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-1 rounded text-caption text-fg-muted underline decoration-line/30 underline-offset-2
            transition-colors duration-fast hover:text-fg"
        >
          {open ? showLess : showAll(text.replace(/[^0-9]/g, "").length)}
        </button>
      )}
    </div>
  );
}
