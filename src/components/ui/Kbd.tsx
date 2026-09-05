import type { ReactNode } from "react";

/** Keyboard-key hint, e.g. <Kbd>Space</Kbd> to play/pause. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line/15
        bg-ink-700 px-1.5 font-mono text-caption text-fg-muted
        shadow-[0_-1px_0_rgb(255_255_255/0.08)_inset]"
    >
      {children}
    </kbd>
  );
}
