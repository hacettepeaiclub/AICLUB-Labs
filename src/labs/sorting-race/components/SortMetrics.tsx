import { Figure, FigureRow } from "@/components/lab";
import { useT } from "@/i18n";
import type { Algorithm } from "../engine";
import type { RunMetrics } from "../useSortRun";

/** Algorithm names in the active language. */
export function useAlgorithmLabel(): Record<Algorithm, string> {
  return useT().labs["sorting-race"].algorithms;
}

export interface SortMetricsProps {
  metrics: RunMetrics;
  /** Whichever number this section is really about, so the eye lands on it. */
  emphasis?: "comparisons" | "moves";
  /** Shown once the visitor has a reason to care about disorder. */
  inversions?: number;
  compact?: boolean;
}

/**
 * Two numbers, and what they mean. Comparisons is questions asked; moves is
 * data actually relocated. Keeping them side by side is what lets the visitor
 * notice that each algorithm wins one of them.
 */
export function SortMetrics({ metrics, emphasis, inversions, compact }: SortMetricsProps) {
  const t = useT().labs["sorting-race"].metrics;
  return (
    <FigureRow>
      <Figure
        label={t.comparisons}
        value={metrics.comparisons.toLocaleString("en-US")}
        hint={compact ? undefined : t.questionsAsked}
        tone={emphasis === "comparisons" ? "accent" : "default"}
      />
      <Figure
        label={t.moves}
        value={metrics.moves.toLocaleString("en-US")}
        hint={compact ? undefined : t.valuesRelocated}
        tone={emphasis === "moves" ? "accent" : "default"}
      />
      {inversions !== undefined && <Figure label={t.disorder} value={t.inversions(inversions)} />}
    </FigureRow>
  );
}
