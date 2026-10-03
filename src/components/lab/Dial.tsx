import { useId, useRef, type KeyboardEvent } from "react";
import { useDrag } from "@/hooks/useDrag";
import { cn } from "@/lib/cn";

export interface DialProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Format the value shown under the dial. */
  format?: (value: number) => string;
  /** What a screen reader hears instead of the raw number. */
  valueText?: (value: number) => string;
  /** Diameter in CSS pixels. */
  size?: number;
  className?: string;
}

/** The needle sweeps ±135°: three quarters of a turn, top centre is the middle. */
const SWEEP = (135 * Math.PI) / 180;

/**
 * A knob you turn.
 *
 * For a quantity that is felt better as an amount of turning than as a
 * position along a track — how much a ball remembers, how sharp a softmax
 * is. Drag round it, or drag up and down on it, whichever the hand finds;
 * the keyboard has the arrow keys, Page Up and Down for big steps, Home and
 * End. It is a real `slider` to assistive technology.
 */
export function Dial({
  label,
  value,
  min,
  max,
  step = (max - min) / 100,
  onChange,
  format,
  valueText,
  size = 88,
  className,
}: DialProps) {
  const id = useId();
  const startRef = useRef<{ value: number; y: number } | null>(null);
  const span = max - min;
  const frac = span > 0 ? (Math.min(Math.max(value, min), max) - min) / span : 0;
  const angle = -SWEEP + frac * 2 * SWEEP;

  const snap = (v: number) => {
    const clamped = Math.min(max, Math.max(min, v));
    const n = Math.round((clamped - min) / step);
    return Number((min + n * step).toFixed(10));
  };

  const drag = useDrag({
    onStart: (p) => {
      startRef.current = { value, y: p.y };
    },
    onMove: (p) => {
      // Round the dial, measured from its centre…
      const dx = p.fx - 0.5;
      const dy = p.fy - 0.5;
      if (Math.hypot(dx, dy) > 0.18) {
        const a = Math.max(-SWEEP, Math.min(SWEEP, Math.atan2(dx, -dy)));
        onChange(snap(min + ((a + SWEEP) / (2 * SWEEP)) * span));
        return;
      }
      // …or straight up and down, near the middle where an angle means nothing.
      const s = startRef.current;
      if (s) onChange(snap(s.value + ((s.y - p.y) / (size * 2)) * span));
    },
  });

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const big = step * 10;
    const next =
      event.key === "ArrowUp" || event.key === "ArrowRight"
        ? value + step
        : event.key === "ArrowDown" || event.key === "ArrowLeft"
          ? value - step
          : event.key === "PageUp"
            ? value + big
            : event.key === "PageDown"
              ? value - big
              : event.key === "Home"
                ? min
                : event.key === "End"
                  ? max
                  : null;
    if (next === null) return;
    event.preventDefault();
    onChange(snap(next));
  };

  const r = 40;
  const ticks = Array.from({ length: 11 }, (_, i) => -SWEEP + (i / 10) * 2 * SWEEP);

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <span id={id} className="text-caption font-medium text-fg-muted">
        {label}
      </span>
      <div
        role="slider"
        tabIndex={0}
        aria-labelledby={id}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(4))}
        aria-valuetext={valueText?.(value)}
        onKeyDown={onKey}
        {...drag}
        className="cursor-grab touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 active:cursor-grabbing"
        style={{ width: size, height: size }}
      >
        <svg viewBox="-50 -50 100 100" className="block h-full w-full" aria-hidden>
          <circle r={r} className="fill-ink-800 stroke-line/25" strokeWidth={2} />
          {/* the swept part of the track */}
          <path
            d={arc(r + 5, -SWEEP, angle)}
            className="fill-none stroke-accent"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={Math.sin(t) * (r - 6)}
              y1={-Math.cos(t) * (r - 6)}
              x2={Math.sin(t) * (r - 2)}
              y2={-Math.cos(t) * (r - 2)}
              className="stroke-line/30"
            />
          ))}
          <line
            x1={0}
            y1={0}
            x2={Math.sin(angle) * (r - 10)}
            y2={-Math.cos(angle) * (r - 10)}
            className="stroke-fg"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle r={4} className="fill-fg" />
        </svg>
      </div>
      <output className="font-mono text-caption text-fg">{format ? format(value) : value}</output>
    </div>
  );
}

/** An SVG arc from angle a to angle b (0 at the top, clockwise), radius r. */
function arc(r: number, a: number, b: number): string {
  if (b <= a + 1e-6) return "";
  const p = (t: number) => `${(Math.sin(t) * r).toFixed(2)} ${(-Math.cos(t) * r).toFixed(2)}`;
  const large = b - a > Math.PI ? 1 : 0;
  return `M ${p(a)} A ${r} ${r} 0 ${large} 1 ${p(b)}`;
}
