import { useId } from "react";
import { cn } from "@/lib/cn";

export interface TokenPickerProps {
  label: string;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * The selected word, as a control in a stage rail.
 *
 * Every stage below the sentence answers a question about one token, and
 * before this the only way to ask it about a different token was to scroll back
 * up to the sentence and lose sight of the thing you wanted to compare. So the
 * same selection is mounted once per stage — one piece of state, several views
 * of it, following `hash-playground/MessageField`.
 *
 * Native radios in a fieldset: the browser supplies the group semantics, the
 * arrow-key roving and the checked state, none of which is then ours to get
 * wrong. Selection is carried by the fill *and* by the caret above the chip, so
 * it survives greyscale. Chips are 44px tall.
 */
export function TokenPicker({ label, words, selected, onSelect }: TokenPickerProps) {
  const name = useId();
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-caption font-medium text-fg-muted">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded border border-line/10 bg-ink-900 p-1">
        {words.map((word, index) => {
          const id = `${name}-${index}`;
          const isSelected = index === selected;
          return (
            <span key={index} className="contents">
              <input
                type="radio"
                id={id}
                name={name}
                checked={isSelected}
                onChange={() => onSelect(index)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "relative flex min-h-11 cursor-pointer select-none items-center rounded px-2.5",
                  "font-mono text-body-sm transition-colors duration-fast",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                  "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-950",
                  isSelected
                    ? "bg-accent-fill font-semibold text-accent-fg"
                    : "text-fg-muted hover:bg-line/5 hover:text-fg",
                )}
              >
                {isSelected && (
                  <span
                    aria-hidden
                    className="absolute inset-x-1 top-0.5 h-0.5 rounded-pill bg-accent-fg"
                  />
                )}
                {word}
              </label>
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}
