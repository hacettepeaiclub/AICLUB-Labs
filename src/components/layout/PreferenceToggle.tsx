import { cn } from "@/lib/cn";

export interface ToggleOption<T extends string> {
  value: T;
  /** What the button says. Always a word — never an icon on its own. */
  label: string;
  /** The fuller name, for screen readers where two letters are not enough. */
  title?: string;
}

export interface PreferenceToggleProps<T extends string> {
  label: string;
  value: T;
  options: readonly ToggleOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * The two global preference switches: language and theme.
 *
 * Native `<button>`s inside a labelled group, with `aria-pressed` carrying the
 * state — not `role="button"`, not a checkbox pretending to be a switch, and
 * no flag or sun-and-moon emoji. The label is text in both languages, because
 * an icon alone would be the only thing in the collection encoding meaning
 * without words.
 *
 * The group is small enough to sit in the header at every width; the label is
 * visually hidden because the buttons already read as what they are.
 */
export function PreferenceToggle<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: PreferenceToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex items-center gap-0.5 rounded-pill border border-line/10 bg-ink-800 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-w-11 rounded-pill px-2.5 py-1.5 text-caption font-medium",
              "transition-colors duration-fast",
              selected
                ? "bg-accent-fill text-accent-fg"
                : "text-fg-muted hover:bg-line/5 hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
