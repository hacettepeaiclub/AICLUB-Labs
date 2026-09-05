import { useId } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * A row of mutually exclusive choices.
 *
 * Built on real radio inputs rather than buttons, so arrow-key navigation,
 * grouping, and screen-reader semantics come from the platform instead of
 * being re-implemented with ARIA.
 */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  const name = useId();
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-2 text-caption font-medium text-fg-muted">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded border border-line/10 bg-ink-900 p-1">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const selected = option.value === value;
          return (
            <span key={option.value} className="contents">
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "cursor-pointer select-none rounded px-3 py-1.5 text-body-sm",
                  "transition-colors duration-fast",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                  "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-950",
                  selected
                    ? "bg-accent-fill text-accent-fg"
                    : "text-fg-muted hover:bg-line/5 hover:text-fg",
                )}
              >
                {option.label}
              </label>
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}
