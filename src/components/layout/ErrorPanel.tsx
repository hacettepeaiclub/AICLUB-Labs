import type { ReactNode } from "react";

/** The theme's colours, for the few places a utility class has no shade. */
const accent = (alpha: number) => `rgb(var(--accent) / ${alpha})`;
const AMBER = "rgb(var(--signal-amber))";

export type ErrorIcon = "offline" | "load" | "runtime" | "missing";

interface ErrorPanelProps {
  icon: ErrorIcon;
  /** The address the visitor tried to open, shown as the terminal's one command. */
  path: string;
  /** A short state in the top bar. `status` is the one place amber is used. */
  tag?: { text: string; tone: "status" | "plain" };
  /** The cursor blinks while the page is waiting for something; otherwise it stands still. */
  waiting?: boolean;
  reduced: boolean;
  heading: "h1" | "h2";
  title: string;
  body: string;
  /**
   * Announce the title and body when they appear or change. Only that block
   * is a live region: the button's "Trying…" and the top bar's state change on
   * every attempt, and a screen reader should not hear them each time.
   */
  announce?: boolean;
  actions: ReactNode;
  /** A short result of the last attempt, read out politely, and only when it changes. */
  note?: string;
}

/**
 * The frame every error screen shares: the site's terminal, in the phosphor
 * green of the background. The message and what to do about it come first;
 * the terminal is one line of context above them, not the story.
 */
export function ErrorPanel({
  icon,
  path,
  tag,
  waiting = false,
  reduced,
  heading: Heading,
  title,
  body,
  announce = false,
  actions,
  note = "",
}: ErrorPanelProps) {
  const line = accent(0.22);
  return (
    <div className="shell py-section">
      <div
        className="card-surface mx-auto max-w-prose overflow-hidden text-left"
        style={{ borderColor: line, boxShadow: `0 0 48px ${accent(0.08)}` }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b px-4 py-3 font-mono text-caption text-fg-faint"
          style={{ borderColor: line }}
        >
          <span className="min-w-0 truncate">
            <span className="text-accent" aria-hidden>
              $
            </span>{" "}
            open {path} <Cursor blinking={waiting && !reduced} />
          </span>
          {tag && (
            <span className="shrink-0" style={tag.tone === "status" ? { color: AMBER } : undefined}>
              [ {tag.text} ]
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Icon name={icon} />
            <div className="min-w-0" role={announce ? "alert" : undefined}>
              <Heading className="text-title text-fg">{title}</Heading>
              <p className="mt-2 text-body-sm text-fg-muted">{body}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
          {/* Always mounted, so a screen reader is already listening when it fills. */}
          <p role="status" className={note ? "mt-3 text-body-sm text-fg-muted" : "sr-only"}>
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

/** A block cursor; it blinks only while something is being waited for. */
function Cursor({ blinking }: { blinking: boolean }) {
  return (
    <svg
      viewBox="0 0 6 12"
      width="0.55em"
      height="1.1em"
      aria-hidden
      style={{ verticalAlign: "-0.2em", display: "inline" }}
    >
      <rect width="6" height="12" fill={accent(0.8)}>
        {blinking && (
          <animate
            attributeName="opacity"
            values="1;0"
            dur="1.1s"
            calcMode="discrete"
            repeatCount="indefinite"
          />
        )}
      </rect>
    </svg>
  );
}

/** One still line drawing per kind of failure, so the state is never told by colour alone. */
function Icon({ name }: { name: ErrorIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden
      fill="none"
      stroke={accent(1)}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none", marginTop: "0.15rem" }}
    >
      {name === "offline" && (
        <>
          {/* A signal with a line through it. */}
          <path d="M2.5 9.5a14 14 0 0 1 19 0M5.5 12.8a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0" />
          <circle cx="12" cy="19.2" r="0.9" fill={accent(1)} />
          <path d="M3.5 3.5l17 17" />
        </>
      )}
      {name === "load" && (
        <>
          {/* A download that did not reach the tray. */}
          <path d="M12 3.5v9M8 9l4 4 4-4" />
          <path d="M4 15.5v2.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5" strokeDasharray="3 2.2" />
        </>
      )}
      {name === "runtime" && (
        <>
          {/* A warning sign. */}
          <path d="M12 3.8 21 19.5H3z" />
          <path d="M12 9.5v4.5" />
          <circle cx="12" cy="16.9" r="0.9" fill={accent(1)} />
        </>
      )}
      {name === "missing" && (
        <>
          {/* An empty frame with a question in it. */}
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" strokeDasharray="3 2.4" />
          <path d="M9.7 9.6a2.3 2.3 0 1 1 3.4 2c-.7.4-1.1.9-1.1 1.7v.4" />
          <circle cx="12" cy="16.6" r="0.9" fill={accent(1)} />
        </>
      )}
    </svg>
  );
}
