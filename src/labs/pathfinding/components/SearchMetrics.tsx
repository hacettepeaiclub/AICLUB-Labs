import { Figure, FigureRow } from "@/components/lab";
import { useT } from "@/i18n";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Algorithm, SearchResult } from "../engine";
import type { RunMetrics } from "../useSearchRun";

export const ALGORITHM_LABEL: Record<Algorithm, string> = {
  bfs: "BFS",
  dijkstra: "Dijkstra",
  astar: "A*",
};

export interface SearchMetricsProps {
  metrics: RunMetrics;
  /** The number this section is really about, so the eye lands on it. */
  emphasis?: "explored" | "cost";
  /** Hidden until mud exists — before that it only repeats the step count. */
  showCost?: boolean;
}

/** Explored, steps and cost. Nothing else: this is not a dashboard. */
export function SearchMetrics({ metrics, emphasis, showCost = true }: SearchMetricsProps) {
  const t = useT().labs.pathfinding;
  const solved = metrics.status === "solved";
  return (
    <FigureRow>
      <Figure
        label={t.metrics.explored}
        value={metrics.explored.toLocaleString("en-US")}
        tone={emphasis === "explored" ? "accent" : "default"}
      />
      <Figure label={t.metrics.path} value={solved ? t.steps(metrics.pathLength) : "—"} />
      {showCost && (
        <Figure
          label={t.metrics.cost}
          value={solved ? String(metrics.pathCost) : "—"}
          tone={emphasis === "cost" ? "accent" : "default"}
        />
      )}
      {metrics.status === "unreachable" && <Badge dotClassName="bg-signal-rose">{t.metrics.noPath}</Badge>}
    </FigureRow>
  );
}

export interface ComparisonProps {
  results: Partial<Record<Algorithm, SearchResult>>;
  order: readonly Algorithm[];
  emphasis?: "explored" | "cost";
  showCost?: boolean;
}

/**
 * What each algorithm did on this exact map. Filled in as the visitor runs
 * them, cleared the moment the map changes — a stale row would be a lie.
 */
export function AlgorithmComparison({
  results,
  order,
  emphasis,
  showCost = true,
}: ComparisonProps) {
  const rows = order.filter((algorithm) => results[algorithm]);
  if (rows.length === 0) return null;

  return (
    <div className="card-surface overflow-x-auto p-5">
      <table className="w-full min-w-72 text-body-sm">
        <caption className="mb-3 text-left text-caption text-fg-faint">
          Same map, run by run
        </caption>
        <thead>
          <tr className="text-overline uppercase text-fg-faint">
            <th scope="col" className="pb-2 text-left font-medium">
              Algorithm
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Explored
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Steps
            </th>
            {showCost && (
              <th scope="col" className="pb-2 text-right font-medium">
                Cost
              </th>
            )}
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {rows.map((algorithm) => {
            const result = results[algorithm];
            if (!result) return null;
            return (
              <tr key={algorithm} className="border-t border-line/10">
                <th scope="row" className="py-2 text-left font-medium text-fg">
                  {ALGORITHM_LABEL[algorithm]}
                </th>
                <td
                  className={cn(
                    "py-2 text-right",
                    emphasis === "explored" ? "text-accent" : "text-fg-muted",
                  )}
                >
                  {result.explored}
                </td>
                <td className="py-2 text-right text-fg-muted">{result.pathLength}</td>
                {showCost && (
                  <td
                    className={cn(
                      "py-2 text-right",
                      emphasis === "cost" ? "text-accent" : "text-fg-muted",
                    )}
                  >
                    {result.pathCost}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
