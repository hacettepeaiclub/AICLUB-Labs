import { useId } from "react";
import { cn } from "@/lib/cn";

/** A labelled text field, for a key or a number the visitor types. */
export function TextField({
  value,
  onChange,
  label,
  note,
  error,
  inputMode,
  maxLength = 40,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Shown under the field, quietly. */
  note?: string | null;
  /** Shown under the field when what was typed cannot be used. */
  error?: string | null;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  className?: string;
}) {
  const id = useId();
  const noteId = useId();
  const message = error ?? note;
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-overline uppercase text-fg-faint">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? noteId : undefined}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={cn(
          "mt-1.5 min-h-[44px] w-full rounded border bg-ink-950 px-4 py-2 font-mono text-body text-fg",
          "transition-colors duration-fast hover:border-line/25",
          error
            ? "border-signal-amber/60 focus:border-signal-amber"
            : "border-line/15 focus:border-accent/50",
        )}
      />
      {message && (
        <p
          id={noteId}
          className={cn("mt-1.5 text-caption", error ? "text-signal-amber" : "text-fg-faint")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
