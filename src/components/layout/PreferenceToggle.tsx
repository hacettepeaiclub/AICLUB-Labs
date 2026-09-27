import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ToggleOption<T extends string> {
  value: T;
  /** The button's name. Shown as text, or kept for screen readers when an icon is given. */
  label: string;
  /** The fuller name, for screen readers where two letters are not enough. */
  title?: string;
  /** Drawn in place of the visible label. The label still names the button. */
  icon?: ReactNode;
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
 * no flag emoji. The theme switch draws a sun and a moon, but never as the
 * only name: the word stays in the button for screen readers and as its
 * tooltip, so the icon adds a shape without taking the meaning away.
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
            title={option.title ?? (option.icon ? option.label : undefined)}
            onClick={() => onChange(option.value)}
            className={cn(
              // `min-w-11` was here alone, and the height came out at 37.6px
              // only because `text-caption` was being dropped at merge time.
              // With the size applying, padding alone would leave a 28.8px
              // target — so the minimum is stated in both directions now.
              "inline-flex min-h-11 min-w-11 items-center justify-center",
              "rounded-pill px-2.5 py-1.5 text-caption font-medium",
              "transition-colors duration-fast",
              selected
                ? "bg-accent-fill text-accent-fg"
                : "text-fg-muted hover:bg-line/5 hover:text-fg",
            )}
          >
            {option.icon ? (
              <>
                {option.icon}
                <span className="sr-only">{option.label}</span>
              </>
            ) : (
              option.label
            )}
          </button>
        );
      })}
    </div>
  );
}
