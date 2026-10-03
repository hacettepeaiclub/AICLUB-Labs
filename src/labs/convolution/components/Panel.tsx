import type { ReactNode } from "react";

/** A labelled pane inside a stage's screen: input, kernel, output. */
export function Panel({
  label,
  note,
  children,
}: {
  label: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 truncate text-overline uppercase text-fg-faint">{label}</p>
      {children}
      {note && <div className="mt-2 text-caption text-fg-faint">{note}</div>}
    </div>
  );
}
