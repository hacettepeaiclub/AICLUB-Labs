import { useId } from "react";
import { cn } from "@/lib/cn";

/** Code points, not UTF-16 units — so an emoji counts as one character. */
export const countCharacters = (text: string): number => Array.from(text).length;

/** Whitespace-separated runs. The everyday meaning of "word". */
export const countWords = (text: string): number =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

export interface TextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  /** Fixed text — the challenge where the sentence is not the lever. */
  readOnly?: boolean;
  rows?: number;
  className?: string;
}

/**
 * The text under test.
 *
 * A plain `<textarea>`: native editing, native keyboard handling, native
 * mobile behaviour, and nothing to re-implement. It is deliberately monospaced
 * — the visitor is about to be told that two spaces cost more than one, and
 * that is invisible in a proportional face.
 */
export function TextEditor({
  label,
  value,
  onChange,
  hint,
  readOnly,
  rows = 3,
  className,
}: TextEditorProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-caption font-medium text-fg-muted">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        readOnly={readOnly}
        spellCheck={false}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "w-full resize-y rounded-card border border-line/10 bg-ink-900 p-3",
          "font-mono text-body-sm text-fg placeholder:text-fg-faint",
          readOnly && "cursor-default text-fg-muted",
        )}
      />
      {hint && (
        <p id={hintId} className="text-caption text-fg-faint">
          {hint}
        </p>
      )}
    </div>
  );
}
