import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { SAMPLES } from "../corpora";
import { tokenize, type Vocabulary } from "../engine";
import { useVocabulary } from "../useVocabulary";
import { TextEditor, countCharacters, countWords } from "./TextEditor";
import { TokenStrip } from "./TokenStrip";

interface SideProps {
  title: string;
  subtitle: string;
  vocabulary: Vocabulary | null;
  text: string;
  /** Marked when this side is the cheaper of the two. */
  winner: boolean;
  count: number;
}

function Side({ title, subtitle, vocabulary, text, winner, count }: SideProps) {
  const c = useT().labs.tokenizer.compare;
  const tokens = useMemo(
    () => (vocabulary ? tokenize(text, vocabulary) : []),
    [vocabulary, text],
  );

  return (
    <div
      className={cn(
        "space-y-3 rounded-card border p-4",
        // The cheaper side is marked by a label and a solid border, never by
        // colour on its own.
        winner ? "border-accent/40 bg-ink-800" : "border-line/10 bg-ink-900",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <p className="text-body-sm font-medium text-fg">{title}</p>
          <p className="text-caption text-fg-faint">{subtitle}</p>
        </div>
        <p className="shrink-0 font-mono text-title tabular-nums text-fg">
          {count}
          <span className="ml-1 text-caption text-fg-faint">{c.tokens}</span>
        </p>
      </div>
      <TokenStrip tokens={tokens} size="sm" label={`${title}: ${text}`} muted={!vocabulary} />
      {winner && (
        <p className="text-caption text-accent">{c.cheaper}</p>
      )}
    </div>
  );
}

/**
 * Section 4 — trained on what?
 *
 * The same text, at the same amount of training, handed to two tokenizers that
 * differ in one respect: what they read. Both are shown at once, because the
 * lesson is the *gap*, and a gap needs two things visible at the same time.
 *
 * The text is editable on purpose. The strongest version of this argument is
 * not a prepared example — it is discovering that nothing you can type makes
 * the English tokenizer good at Turkish, or the Turkish one good at English.
 * Neither side is the winner in general; each is cheap in its own language.
 */
export function CompareStage() {
  const lab = useT().labs.tokenizer;
  const c = lab.compare;
  const reduced = useReducedMotion() ?? false;
  const english = useVocabulary("english", reduced);
  const turkish = useVocabulary("turkish", reduced);

  const [text, setText] = useState(SAMPLES[0]!.text);
  const [announcement, setAnnouncement] = useState("");

  const englishCount = useMemo(
    () => (english.vocabulary ? tokenize(text, english.vocabulary).length : 0),
    [english.vocabulary, text],
  );
  const turkishCount = useMemo(
    () => (turkish.vocabulary ? tokenize(text, turkish.vocabulary).length : 0),
    [turkish.vocabulary, text],
  );

  const both = english.vocabulary !== null && turkish.vocabulary !== null;
  const ratio = both && Math.min(englishCount, turkishCount) > 0
    ? Math.max(englishCount, turkishCount) / Math.min(englishCount, turkishCount)
    : 0;

  const pick = (sample: string, label: string) => {
    setText(sample);
    setAnnouncement(c.sampleLoaded(label, countWords(sample), countCharacters(sample)));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((sample) => (
          <Button
            key={sample.id}
            size="sm"
            variant={sample.text === text ? "primary" : "secondary"}
            onClick={() => pick(sample.text, c.samples[sample.id])}
          >
            {c.samples[sample.id]}
          </Button>
        ))}
      </div>

      <TextEditor
        label={c.textLabel}
        value={text}
        onChange={setText}
        rows={2}
        hint={c.textHint}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Side
          title={c.trainedOnEnglish}
          subtitle={c.englishCorpus}
          vocabulary={english.vocabulary}
          text={text}
          count={englishCount}
          winner={both && englishCount < turkishCount}
        />
        <Side
          title={c.trainedOnTurkish}
          subtitle={c.turkishCorpus}
          vocabulary={turkish.vocabulary}
          text={text}
          count={turkishCount}
          winner={both && turkishCount < englishCount}
        />
      </div>

      {both && ratio > 1 && (
        <p className="text-body-sm text-fg-muted">{c.ratio(ratio.toFixed(1))}</p>
      )}

      <p className="text-caption text-fg-faint">{lab.honesty}</p>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
