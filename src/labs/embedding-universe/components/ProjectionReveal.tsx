import { Figure, FigureRow } from "@/components/lab";
import { Segmented } from "@/components/ui";
import type { DistortionPair } from "../engine";
import type { VocabularyItem } from "../vocabulary";

/**
 * Section 2: the map you have been reading is a shadow.
 *
 * Nothing here is written down in advance. The two pairs come from
 * `distortion()`, which scans every ordered pair and returns the two extremes —
 * the pair the projection pushed furthest apart despite them being close, and
 * the pair it pressed together despite them being unrelated. The percentages
 * come from `varianceExplained()`. Re-freeze the vocabulary and this section
 * says something different, because it is reporting a measurement rather than
 * illustrating a claim.
 *
 * The mode starts at `none` so section 1's exploration is never overridden by a
 * highlight the visitor did not ask for.
 */

export type RevealMode = "none" | "hidden" | "false";

export interface ProjectionRevealCopy {
  readonly modeLabel: string;
  readonly modeNone: string;
  readonly modeHidden: string;
  readonly modeFalse: string;
  /** Ordinals are irregular in English and regular in Turkish, so each language owns its own. */
  readonly ordinal: (n: number) => string;
  readonly hiddenBody: (
    a: string,
    b: string,
    rank: string,
    total: number,
    score: string,
    percent: string,
  ) => string;
  readonly falseBody: (
    a: string,
    b: string,
    screenRank: string,
    trueRank: string,
    total: number,
    score: string,
  ) => string;
  readonly idle: string;
  readonly varianceLabel: string;
  readonly varianceHint: (first: string, second: string) => string;
  readonly varianceBody: (percent: string, remaining: number) => string;
  readonly correlationLabel: string;
  readonly correlationHint: string;
  readonly pending: string;
}

export interface ProjectionRevealProps {
  mode: RevealMode;
  onModeChange: (mode: RevealMode) => void;
  hidden: DistortionPair | null;
  falsePair: DistortionPair | null;
  vocabulary: readonly VocabularyItem[];
  total: number;
  /** Fraction 0..1 per component, straight from `varianceExplained`. */
  variance: readonly number[] | null;
  combined: number | null;
  rankCorrelation: number | null;
  remainingDimensions: number;
  formatScore: (value: number) => string;
  formatPercent: (fraction: number, decimals?: number) => string;
  copy: ProjectionRevealCopy;
}

export function ProjectionReveal({
  mode,
  onModeChange,
  hidden,
  falsePair,
  vocabulary,
  total,
  variance,
  combined,
  rankCorrelation,
  remainingDimensions,
  formatScore,
  formatPercent,
  copy,
}: ProjectionRevealProps) {
  const word = (index: number): string => vocabulary[index]?.en ?? "";

  if (!hidden || !falsePair || !variance || combined === null || rankCorrelation === null) {
    return <p className="text-body-sm text-fg-faint">{copy.pending}</p>;
  }

  return (
    <div className="space-y-6">
      <Segmented
        label={copy.modeLabel}
        value={mode}
        options={[
          { value: "none", label: copy.modeNone },
          { value: "hidden", label: copy.modeHidden },
          { value: "false", label: copy.modeFalse },
        ]}
        onChange={onModeChange}
      />

      <p className="min-h-[4.5rem] max-w-prose text-body text-fg" aria-live="polite">
        {mode === "hidden" &&
          copy.hiddenBody(
            word(hidden.a),
            word(hidden.b),
            copy.ordinal(hidden.trueRank),
            total,
            formatScore(hidden.similarity),
            formatPercent(hidden.screenDistance, 1),
          )}
        {mode === "false" &&
          copy.falseBody(
            word(falsePair.a),
            word(falsePair.b),
            copy.ordinal(falsePair.screenRank),
            copy.ordinal(falsePair.trueRank),
            total,
            formatScore(falsePair.similarity),
          )}
        {mode === "none" && copy.idle}
      </p>

      <FigureRow>
        <Figure
          label={copy.varianceLabel}
          value={formatPercent(combined, 4)}
          hint={copy.varianceHint(
            formatPercent(variance[0] ?? 0, 4),
            formatPercent(variance[1] ?? 0, 4),
          )}
          tone="accent"
        />
        <Figure
          label={copy.correlationLabel}
          value={formatScore(rankCorrelation)}
          hint={copy.correlationHint}
        />
      </FigureRow>

      <p className="max-w-prose text-body text-fg-muted">
        {copy.varianceBody(formatPercent(combined, 4), remainingDimensions)}
      </p>
    </div>
  );
}
