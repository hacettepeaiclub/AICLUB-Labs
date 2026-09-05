import { Fragment, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { duration, ease, spring } from "@/design/motion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

type StepTone = "input" | "hash" | "data" | "good" | "bad";

interface SceneStep {
  text: string;
  tone: StepTone;
}

type UsageKey = "git" | "passwords" | "https" | "blockchain" | "signatures";

interface Usage {
  id: UsageKey;
  tones: StepTone[];
}

/**
 * Which scene each tab plays. The words live in the dictionary; what stays
 * here is the shape of the animation — one tone per step.
 */
const USAGES: Usage[] = [
  { id: "git", tones: ["input", "hash", "data", "good"] },
  { id: "passwords", tones: ["input", "hash", "data", "bad", "good"] },
  { id: "https", tones: ["input", "hash", "data", "good"] },
  { id: "blockchain", tones: ["input", "hash", "data", "good"] },
  { id: "signatures", tones: ["input", "hash", "data", "good"] },
];

const TONE_CLASS: Record<StepTone, string> = {
  input: "border-line/15 bg-ink-700 text-fg",
  hash: "border-accent/40 bg-accent/15 text-accent-fg",
  data: "border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan",
  good: "border-signal-green/30 bg-signal-green/10 text-signal-green",
  bad: "border-signal-rose/30 bg-signal-rose/10 text-signal-rose",
};

const STEP_DELAY = 0.4;

/** A usage as a tiny animated story: nodes appear in causal order. */
function MiniScene({ steps, reduced }: { steps: SceneStep[]; reduced: boolean | null }) {
  return (
    <div
      aria-hidden
      className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border
        border-line/10 bg-ink-900 p-5"
    >
      {steps.map((step, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <motion.span
              initial={reduced ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduced ? 0 : i * STEP_DELAY - 0.15, duration: 0.25 }}
              className="text-body-sm text-fg-faint"
            >
              →
            </motion.span>
          )}
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring.smooth, delay: reduced ? 0 : i * STEP_DELAY }}
            className={cn(
              "rounded-pill border px-3.5 py-1.5 font-mono text-caption",
              TONE_CLASS[step.tone],
            )}
          >
            {step.text}
          </motion.span>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Real-world uses: pill selector + a small animated scene per use case.
 *
 * These are genuinely tabs — one panel, swapped in place — so they implement
 * the full pattern rather than only its roles: arrow keys and Home/End move
 * between them, and a roving tabindex keeps the group a single tab stop.
 * Selection follows focus, which is the recommended model when the panels are
 * cheap to render (these are static text).
 */
export function UsageCards() {
  const copy = useT().labs["hash-playground"].usage;
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string>("git");
  const [replay, setReplay] = useState(0);
  const active = USAGES.find((u) => u.id === activeId) ?? USAGES[0];
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const selectAt = (index: number) => {
    const next = USAGES[(index + USAGES.length) % USAGES.length];
    if (!next) return;
    setActiveId(next.id);
    tabRefs.current.get(next.id)?.focus();
  };

  const handleTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = USAGES.findIndex((u) => u.id === activeId);
    if (current < 0) return;
    switch (event.key) {
      case "ArrowRight":
        selectAt(current + 1);
        break;
      case "ArrowLeft":
        selectAt(current - 1);
        break;
      case "Home":
        selectAt(0);
        break;
      case "End":
        selectAt(USAGES.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  if (!active) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label={copy.tablist}
        onKeyDown={handleTabKeys}
        className="flex flex-wrap gap-2"
      >
        {USAGES.map((usage) => {
          const isActive = usage.id === activeId;
          return (
            <motion.button
              key={usage.id}
              ref={(node) => {
                if (node) tabRefs.current.set(usage.id, node);
                else tabRefs.current.delete(usage.id);
              }}
              type="button"
              role="tab"
              id={`usage-tab-${usage.id}`}
              aria-selected={isActive}
              aria-controls="usage-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(usage.id)}
              whileTap={reduced ? undefined : { scale: 0.96 }}
              className={cn(
                "rounded-pill border px-4 py-2 text-body-sm font-medium",
                "transition-colors duration-fast",
                isActive
                  ? "border-transparent bg-accent-fill text-accent-fg"
                  : "border-line/10 bg-ink-800 text-fg-muted hover:border-line/25 hover:text-fg",
              )}
            >
              {copy.items[usage.id].label}
            </motion.button>
          );
        })}
      </div>

      <div
        id="usage-panel"
        role="tabpanel"
        aria-labelledby={`usage-tab-${active.id}`}
        className="card-surface mt-5 overflow-hidden"
      >
        {/* Keyed remount: each switch replays the entrance. (AnimatePresence
            exit animations hang inside whileInView variant parents.) */}
        <motion.div
          key={`${active.id}-${replay}`}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: [...ease.out] }}
          className="p-6 md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-title text-fg">{copy.items[active.id].headline}</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setReplay((r) => r + 1)}
              aria-label={copy.replayAnimation}
            >
              {copy.replay}
            </Button>
          </div>
          <p className="mt-3 max-w-prose text-body text-fg-muted">{copy.items[active.id].body}</p>
          <MiniScene
            steps={copy.items[active.id].steps.map((text, i) => ({
              text,
              tone: active.tones[i] ?? "data",
            }))}
            reduced={reduced}
          />
        </motion.div>
      </div>
    </div>
  );
}
