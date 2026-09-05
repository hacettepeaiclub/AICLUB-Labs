import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { spring } from "@/design/motion";

/** Cap the block strip so pathological inputs can't flood the DOM. */
const MAX_CHIPS = 24;

interface Ghost {
  id: number;
  char: string;
}

export interface HashInputProps {
  value: string;
  onChange: (value: string) => void;
  muted: boolean;
  onToggleMute: () => void;
}

/**
 * The hero input. The real <input> stays fully functional (focus, caret,
 * screen readers); beneath it, each character springs in as a block, and
 * deleted characters dissolve as short-lived "ghosts".
 */
export function HashInput({ value, onChange, muted, onToggleMute }: HashInputProps) {
  const t = useT().labs["hash-playground"];
  const id = useId();
  const reduced = useReducedMotion();
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const ghostId = useRef(0);

  const handleChange = (next: string) => {
    if (next.length < value.length && !reduced) {
      // Approximate the deleted run as the trailing difference — visually
      // right for backspace, harmless for mid-string edits.
      const removed = value.slice(next.length).slice(0, 3);
      const batch: Ghost[] = removed.split("").map((char) => ({ id: ghostId.current++, char }));
      setGhosts((g) => [...g, ...batch].slice(-6));
      window.setTimeout(() => {
        setGhosts((g) => g.filter((ghost) => !batch.some((b) => b.id === ghost.id)));
      }, 320);
    }
    onChange(next);
  };

  const visible = value.slice(-MAX_CHIPS);
  const overflow = value.length - visible.length;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-overline uppercase text-fg-muted">
          {t.inputLabel}
        </label>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleMute}
          aria-pressed={!muted}
          aria-label={muted ? t.turnSoundOn : t.turnSoundOff}
        >
          {muted ? t.soundOff : t.soundOn}
        </Button>
      </div>

      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={t.inputPlaceholder}
        className="mt-3 w-full rounded-card border border-line/15 bg-ink-900 px-6 py-5
          font-mono text-body-lg text-fg placeholder:text-fg-faint
          transition-[border-color,box-shadow] duration-base hover:border-line/25
          focus:border-accent/40 focus:shadow-glow md:px-8 md:py-6 md:text-display-md"
      />

      {/* Character blocks — presentation only; the input above is the source of truth. */}
      <div aria-hidden className="mt-4 flex min-h-9 flex-wrap items-center gap-1.5">
        {overflow > 0 && (
          <span className="grid h-8 place-items-center rounded border border-line/10 px-2 font-mono text-caption text-fg-faint">
            +{overflow}
          </span>
        )}
        {visible.split("").map((char, i) => (
          <motion.span
            key={`${overflow + i}-${char}`}
            initial={reduced ? false : { scale: 0.4, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={spring.bouncy}
            className="grid size-8 place-items-center rounded border border-line/10 bg-ink-800
              font-mono text-body-sm text-fg shadow-[0_1px_0_rgb(255_255_255/0.06)_inset]"
          >
            {char === " " ? <span className="text-fg-faint">␣</span> : char}
          </motion.span>
        ))}
        {ghosts.map((ghost) => (
          <motion.span
            key={`ghost-${ghost.id}`}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 0.3, opacity: 0, y: 10 }}
            transition={{ duration: 0.28 }}
            className="grid size-8 place-items-center rounded border border-line/10 bg-ink-800
              font-mono text-body-sm text-fg-faint"
          >
            {ghost.char === " " ? "␣" : ghost.char}
          </motion.span>
        ))}
      </div>

      <p className="mt-2 text-body-sm text-fg-faint" aria-live="off">
        {value.length === 0
          ? t.emptyNote
          : t.lengthNote(value.length)}
      </p>
    </div>
  );
}
