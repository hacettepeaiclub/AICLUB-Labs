import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional colored dot class, e.g. "bg-signal-cyan". */
  dotClassName?: string;
}

/** Small metadata chip: category, difficulty, duration. */
export function Badge({ dotClassName, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-line/10 bg-ink-700/60",
        "px-2.5 py-1 text-caption font-medium text-fg-muted",
        className,
      )}
      {...props}
    >
      {dotClassName && <span aria-hidden className={cn("size-1.5 rounded-pill", dotClassName)} />}
      {children}
    </span>
  );
}
