import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  // The brand navy, with a hairline in `accent` so the surface has an edge on
  // a dark ground: #003588 alone sits at 1.75:1 against the page, which is
  // under the 3:1 a control boundary needs. Hover lifts the fill slightly
  // rather than jumping to a different colour — the old rule swapped in
  // `accent/90` on hover, a 26x luminance jump from an almost invisible rest
  // state.
  primary:
    "bg-accent-fill text-accent-fg border border-accent/50 hover:border-accent hover:bg-accent-fill/85 active:bg-accent-fill",
  secondary: "bg-ink-700 text-fg border border-line/10 hover:bg-ink-700/70 active:bg-ink-800",
  // A hairline at rest, and nothing else: these are real actions — "Run 1,000
  // rounds", "Back to the start" — and with no boundary at all they read as a
  // line of muted text, which is what the visual QA found. Still lighter than
  // `secondary`, which carries a fill as well as an edge.
  ghost:
    "border border-line/20 text-fg-muted hover:border-line/35 hover:bg-line/5 hover:text-fg active:bg-line/10",
};

// `md` is 44px rather than 40 because the labs had already decided that:
// nineteen call sites across six labs pinned `min-h-11` onto a Button to reach
// it. The default now is what they were reaching for, and those overrides
// become no-ops instead of the house style being a thing you opt into.
// `sm` stays 32px for genuinely dense secondary controls, `lg` 48px.
const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-body-sm rounded",
  md: "h-11 px-4 text-body-sm rounded",
  lg: "h-12 px-6 text-body rounded",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-medium",
        "transition-colors duration-fast disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
