import { useId } from "react";
import { cn } from "@/lib/cn";

export interface FloatFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Shown under the field when the text is not a number. */
  error?: string | null;
  placeholder?: string;
  className?: string;
  /** For a field that sits in a row of fields and wants less height. */
  compact?: boolean;
}

/**
 * A field that takes a number the way a person types it.
 *
 * A text input, not `type="number"`: a number input rounds what you type to a
 * double before the page ever sees it, which would make this lab's first
 * claim — "here is what was lost" — impossible to show. It also rejects `1/3`,
 * and refuses a decimal comma in some locales and accepts it in others. The
 * engine parses the text itself, exactly.
 */
export function FloatField({
  value,
  onChange,
  label,
  error,
  placeholder,
  className,
  compact,
}: FloatFieldProps) {
  const id = useId();
  const errorId = useId();
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-overline uppercase text-fg-faint">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        maxLength={400}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        className={cn(
          "mt-1.5 min-h-[44px] w-full rounded border bg-ink-950 px-4 font-mono text-fg",
          "placeholder:text-fg-faint transition-colors duration-fast hover:border-line/25",
          compact ? "py-2 text-body-sm" : "py-3 text-body",
          error
            ? "border-signal-amber/60 focus:border-signal-amber"
            : "border-line/15 focus:border-accent/50",
        )}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-caption text-signal-amber">
          {error}
        </p>
      )}
    </div>
  );
}
