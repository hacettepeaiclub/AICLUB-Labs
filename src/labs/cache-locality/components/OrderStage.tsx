import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLanguage } from "@/i18n";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { PRODUCT_N } from "../bench";
import { LOOP_ORDERS, innerWalk, productMisses, type LoopOrder, type Matrix } from "../engine";
import type { Bench } from "../useBench";
import { formatNumber } from "../view";

/** The model's product: small enough to simulate on every render, big enough to leave its cache. */
const MODEL = { n: 16, cache: { lineSize: 8, lines: 8 } } as const;

const MATRICES: readonly Matrix[] = ["A", "B", "C"];

/** The orders in three pairs, by which loop is innermost: j, then k, then i. */
const PAIRS: readonly (readonly LoopOrder[])[] = [
  ["ikj", "kij"],
  ["ijk", "jik"],
  ["jki", "kji"],
];

/**
 * Section 4: your turn. Three loops, six ways to nest them.
 *
 * A matrix product is the same arithmetic in any loop order, and the visitor
 * picks one. The page shows the loops as they would be written, how the
 * innermost one walks each matrix — along a row, down a column, or not at
 * all — and the model's misses per step for every order at once. Then the
 * visitor's own processor times the order they picked on a 512 × 512
 * product, and the two rankings sit side by side.
 *
 * Nothing here is graded against an answer key. The model predicts three
 * pairs; the stopwatch either agrees or it does not, and the page says which
 * — that comparison is the result.
 */
export function OrderStage({ bench }: { bench: Bench }) {
  const t = useLabCopy("cache-locality").order;
  const { language } = useLanguage();
  const [order, setOrder] = useState<LoopOrder>("ijk");
  const [measured, setMeasured] = useState<Partial<Record<LoopOrder, number>>>({});
  const [running, setRunning] = useState<LoopOrder | "all" | null>(null);
  const [failed, setFailed] = useState(false);

  const model = useMemo(
    () =>
      Object.fromEntries(
        LOOP_ORDERS.map((o) => [o, productMisses(o, MODEL.n, MODEL.cache).perStep.total]),
      ) as Record<LoopOrder, number>,
    [],
  );
  const modelTop = Math.max(...LOOP_ORDERS.map((o) => model[o]));
  const measuredTop = Math.max(0, ...LOOP_ORDERS.map((o) => measured[o] ?? 0));

  const measureOne = async (o: LoopOrder) => {
    const ms = await bench.product(o);
    setMeasured((m) => ({ ...m, [o]: ms }));
  };

  const measure = (which: LoopOrder | "all") => {
    setRunning(which);
    setFailed(false);
    const queue = which === "all" ? [...LOOP_ORDERS] : [which];
    queue
      .reduce((p, o) => p.then(() => measureOne(o)), Promise.resolve())
      .catch(() => setFailed(true))
      .finally(() => setRunning(null));
  };

  const all = LOOP_ORDERS.every((o) => measured[o] !== undefined);
  const mean = (os: readonly LoopOrder[]) =>
    os.reduce((s, o) => s + (measured[o] ?? 0), 0) / os.length;
  const pairMeans = PAIRS.map(mean);
  const agrees = all && pairMeans[0]! < pairMeans[1]! && pairMeans[1]! < pairMeans[2]!;
  const fastest = LOOP_ORDERS.filter((o) => measured[o] !== undefined).sort(
    (a, b) => measured[a]! - measured[b]!,
  )[0];

  const [outer, middle, inner] = order.split("") as ("i" | "j" | "k")[];
  const code = [
    `for (let ${outer} = 0; ${outer} < n; ${outer}++)`,
    `  for (let ${middle} = 0; ${middle} < n; ${middle}++)`,
    `    for (let ${inner} = 0; ${inner} < n; ${inner}++)`,
    `      C[i][j] += A[i][k] * B[k][j];`,
  ].join("\n");

  return (
    <Stage
      width="wide"
      caption={t.caption(formatNumber(PRODUCT_N, language, 0))}
      announcement={
        failed
          ? t.error
          : all
            ? agrees
              ? t.announceAgree
              : t.announceDisagree
            : measured[order] !== undefined
              ? t.announceOne(order, formatNumber(measured[order]!, language, 0))
              : ""
      }
      viewport={
        <div className="space-y-5 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
            <pre className="overflow-x-auto rounded bg-ink-900 p-3 font-mono text-caption leading-relaxed text-fg">
              <code>{code}</code>
            </pre>
            <ul className="space-y-1.5" aria-label={t.walkLabel}>
              {MATRICES.map((m) => {
                const walk = innerWalk(order, m);
                return (
                  <li key={m} className="flex items-center justify-between gap-3 text-caption">
                    <span className="font-mono text-fg">{m}</span>
                    <span
                      className={cn(
                        "rounded-pill px-2 py-0.5",
                        walk === "column"
                          ? "bg-signal-amber/20 text-signal-amber"
                          : walk === "row"
                            ? "bg-signal-green/20 text-signal-green"
                            : "bg-ink-900 text-fg-muted",
                      )}
                    >
                      {t.walk[walk]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div
              className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-caption text-fg-muted"
              aria-hidden
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-[2px] border border-accent" />
                {t.legendModel}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-[2px] bg-signal-blue" />
                {t.legendMeasured}
              </span>
            </div>
            <ul className="space-y-1">
              {LOOP_ORDERS.map((o) => {
                const ms = measured[o];
                return (
                  <li key={o}>
                    <button
                      type="button"
                      onClick={() => setOrder(o)}
                      aria-pressed={o === order}
                      aria-label={t.rowLabel(
                        o,
                        formatNumber(model[o], language, 2),
                        ms === undefined ? null : formatNumber(ms, language, 0),
                      )}
                      className={cn(
                        "grid w-full grid-cols-[2.75rem_minmax(0,1fr)_4.5rem] items-center gap-3 rounded px-2 py-1.5 text-left",
                        o === order ? "bg-ink-800 ring-1 ring-accent/60" : "hover:bg-ink-900",
                      )}
                    >
                      <span className="font-mono text-body-sm text-fg">{o}</span>
                      <span className="space-y-1">
                        <span
                          className="block h-2 rounded-[2px] border border-accent"
                          style={{ width: `${Math.max(3, (model[o] / modelTop) * 100)}%` }}
                        />
                        <span
                          className="block h-2 rounded-[2px] bg-signal-blue transition-[width] duration-slow ease-out-expo"
                          style={{
                            width:
                              ms === undefined || measuredTop === 0
                                ? "0%"
                                : `${Math.max(3, (ms / measuredTop) * 100)}%`,
                          }}
                        />
                      </span>
                      <span className="text-right font-mono text-caption tabular-nums text-fg-muted">
                        {running === o || (running === "all" && ms === undefined)
                          ? "…"
                          : ms === undefined
                            ? "—"
                            : t.ms(formatNumber(ms, language, 0))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-caption text-fg-faint">{failed ? t.error : t.chartNote}</p>
          </div>
        </div>
      }
      primary={
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => measure(order)}
            disabled={running !== null}
            className="min-h-[44px] flex-1"
          >
            {running !== null ? t.running : t.measure(order)}
          </Button>
          <Button
            variant="secondary"
            onClick={() => measure("all")}
            disabled={running !== null}
            className="min-h-[44px]"
          >
            {t.measureAll}
          </Button>
        </div>
      }
      secondary={
        <Segmented
          label={t.orderLabel}
          value={order}
          onChange={setOrder}
          options={LOOP_ORDERS.map((o) => ({ value: o, label: o }))}
        />
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure
            label={t.figures.model}
            value={formatNumber(model[order], language, 2)}
            hint={t.figures.modelHint}
          />
          <Figure
            label={t.figures.fastest}
            value={fastest ?? "—"}
            hint={
              fastest
                ? t.figures.fastestHint(formatNumber(measured[fastest]!, language, 0))
                : t.figures.fastestEmpty
            }
          />
          <Figure
            label={t.figures.verdict}
            value={all ? (agrees ? t.figures.agree : t.figures.disagree) : t.figures.pending}
            hint={t.figures.verdictHint}
            tone="accent"
          />
        </>
      }
    />
  );
}
