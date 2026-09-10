import { useId } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

export interface MessageFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Permanently rendered help, pointed at by `aria-describedby`. */
  describedBy?: string;
  className?: string;
}

/**
 * The message being hashed.
 *
 * One real `<input>`, and nothing decorating it. The previous version sprang a
 * row of character blocks in beneath the field and dissolved "ghost" blocks on
 * every backspace, which animated the one thing in the lab that is not
 * interesting — the input is what you typed — while the digest above it, the
 * thing that actually changes, sat still.
 *
 * The same component is mounted twice against the same state: once in section
 * 1 and once in section 3, so a visitor reading about the avalanche can change
 * a character without scrolling back. Two views, one string.
 */
export function MessageField({
  value,
  onChange,
  label,
  describedBy,
  className,
}: MessageFieldProps) {
  const t = useT().labs["hash-playground"];
  const id = useId();

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-overline uppercase text-fg-faint">
        {label}
      </label>
      <input
        id={id}
        type="text"
        // Defence in depth. SHA-256 is native and asynchronous, so this is
        // nowhere near as costly as the tokenizer input — but a message this
        // long is already far past anything the lesson needs.
        maxLength={2000}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={describedBy}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={t.inputPlaceholder}
        className="mt-1.5 min-h-[44px] w-full rounded border border-line/15 bg-ink-950 px-4 py-3
          font-mono text-body text-fg placeholder:text-fg-faint
          transition-colors duration-fast hover:border-line/25 focus:border-accent/50"
      />
    </div>
  );
}
