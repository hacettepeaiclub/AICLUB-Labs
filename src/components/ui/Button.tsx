import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent-fill text-accent-fg hover:bg-accent/90 active:bg-accent/80 shadow-[0_1px_0_rgb(255_255_255/0.15)_inset]",
  secondary:
    "bg-ink-700 text-fg border border-line/10 hover:bg-ink-700/70 active:bg-ink-800",
  ghost: "text-fg-muted hover:text-fg hover:bg-line/5 active:bg-line/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-body-sm rounded",
  md: "h-10 px-4 text-body-sm rounded",
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
