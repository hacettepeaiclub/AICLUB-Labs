import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ScrubProps {
  /** The chart being scrubbed. Its x axis must run from `min` to `max`, left to right. */
  children: ReactNode;
  value: number;
  min: number;
  max: number;
  /** The smallest change a keyboard step, or a drag, can make. */
  step: number;
  /** The lowest value a drag or a key may set, when it is above `min`. */
  floor?: number;
  onChange: (value: number) => void;
  label: string;
  valueText: (value: number) => string;
  className?: string;
}

/**
 * A chart you set by pointing at it.
 *
 * Press anywhere on the chart and the marked value jumps there; drag and it
 * follows. A finger can still scroll the page vertically across it. The grip
 * on the marker line is a real slider for keyboards and screen readers: arrow
 * keys move one step, Shift ten. It replaces a slider that sat beside the
 * chart and moved a line on it — now the line is the control.
 */
export function Scrub({
  children,
  value,
  min,
  max,
  step,
  floor = min,
  onChange,
  label,
  valueText,
  className,
}: ScrubProps) {
  const area = useRef<HTMLDivElement>(null);
  const set = (v: number) => onChange(Math.min(max, Math.max(floor, Math.round(v / step) * step)));

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const box = area.current!.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    set(min + fraction * (max - min));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const sign =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0;
    if (sign === 0) return;
    event.preventDefault();
    set(value + sign * step * (event.shiftKey ? 10 : 1));
  };

  const at = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div
      ref={area}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
      className={cn("relative cursor-ew-resize touch-pan-y select-none", className)}
    >
      {children}
      <span
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={floor}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText(value)}
        onKeyDown={onKeyDown}
        style={{ left: at }}
        className="absolute top-0 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-data/70 bg-ink-900 text-body-sm text-data"
      >
        <span aria-hidden>↔</span>
      </span>
    </div>
  );
}
