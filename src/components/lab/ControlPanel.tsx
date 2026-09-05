import { useId, type CSSProperties, type ReactNode } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

/** Container for a lab's controls — consistent panel across all experiments. */
export function ControlPanel({ children, className }: { children: ReactNode; className?: string }) {
  const t = useT();
  return (
    <div
      role="group"
      aria-label={t.common.controlsLabel}
      className={cn("card-surface flex flex-wrap items-end gap-x-6 gap-y-4 p-5", className)}
    >
      {children}
    </div>
  );
}

export interface LabSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Format the displayed value, e.g. (v) => `${v}%`. */
  format?: (value: number) => string;
  /**
   * What a screen reader should read instead of the raw number. Needed when
   * the track's positions are not the quantity being set — a slider whose
   * scale is non-linear, say.
   */
  valueText?: (value: number) => string;
  className?: string;
}

/** Labeled range input — the standard parameter control for simulations. */
export function LabSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  valueText,
  className,
}: LabSliderProps) {
  const id = useId();
  // How much of the track is behind the thumb. Drives the fill gradient, so it
  // renders identically in every browser rather than only where the native
  // progress part exists.
  const span = max - min;
  const fill = span > 0 ? ((Math.min(Math.max(value, min), max) - min) / span) * 100 : 0;

  return (
    <div className={cn("flex min-w-44 flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-caption font-medium text-fg-muted">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-caption text-fg">
          {format ? format(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText ? valueText(value) : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--range-fill": `${fill}%` } as CSSProperties}
        className="lab-range"
      />
    </div>
  );
}
