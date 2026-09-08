import { useId } from "react";
import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { useDebouncedValue } from "@/hooks";
import { HASH_BITS, HEX_CHARS } from "../hashUtils";
import { CopyButton, DigestPanel } from "./DigestPanel";
import { MessageField } from "./MessageField";

export interface DigestStageProps {
  input: string;
  onInputChange: (value: string) => void;
  hash: string;
}

/**
 * Section 1: a message, the function, and what comes out.
 *
 * ## Why the input lives in the viewport
 *
 * Everywhere else in the collection the viewport is a drawing and the controls
 * sit beside it. Here the chain being taught *is* message → SHA-256 → digest,
 * and putting the field in the rail would break that chain across two columns
 * on desktop and two blocks on a phone. So the field, the function and the
 * digest are one object, stacked in the order they happen, and the stage's
 * primary action is the one thing you do to the answer: copy it.
 *
 * Nothing here is staged. The digest is `crypto.subtle.digest("SHA-256", …)`
 * on whatever is in the field.
 */
export function DigestStage({ input, onInputChange, hash }: DigestStageProps) {
  const t = useT().labs["hash-playground"];
  const helpId = useId();
  // One announcement per burst of typing. Announcing all 64 characters on
  // every keystroke would be unusable, so this says that it changed and
  // enough of it to tell two digests apart.
  const settled = useDebouncedValue(hash);

  return (
    <Stage
      width="wide"
      caption={t.hero.caption}
      announcement={t.hero.announce(settled.slice(0, 8))}
      viewport={
        <div className="space-y-3">
          <MessageField
            value={input}
            onChange={onInputChange}
            label={t.inputLabel}
            describedBy={helpId}
          />
          <p id={helpId} className="sr-only">
            {t.hero.help}
          </p>

          {/* The function, named once, between what goes in and what comes out. */}
          <div aria-hidden className="flex items-center gap-3">
            <span className="font-mono text-caption text-fg-faint">↓</span>
            <span className="text-overline uppercase text-accent">SHA-256</span>
            <span className="h-px flex-1 bg-line/10" />
          </div>

          <DigestPanel hex={hash} label={t.hero.digestLabel} />
        </div>
      }
      primary={<CopyButton hex={hash} className="w-full" />}
      figures={
        <>
          <Figure label={t.figures.messageLength} value={String(input.length)} hint={t.figures.characters} />
          <Figure label={t.figures.digestLength} value={String(HEX_CHARS)} hint={t.figures.hexChars} />
          <Figure label={t.figures.digestBits} value={String(HASH_BITS)} hint={t.figures.alwaysBits} />
        </>
      }
    />
  );
}
