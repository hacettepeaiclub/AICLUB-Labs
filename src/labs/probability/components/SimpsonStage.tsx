import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import {
  DEFAULT_SMALL_SHARE,
  GROUPS,
  TREATMENTS,
  TRIALS_PER_TREATMENT,
  build,
  cellOf,
  type TreatmentId,
} from "../engine/simpson";
import { percent, ratio } from "../view";
import { Prediction } from "./Prediction";

/**
 * Section 4 — better in every group, worse overall.
 *
 * Every percentage on screen is a quotient of two counts printed beside it, so
 * there is nowhere for a trick to hide: the group rates come from the group
 * cells, the overall rates come from the summed cells, and the visitor can
 * check any of them by dividing.
 *
 * ## What the sliders do
 *
 * They move patients between the two groups, not between outcomes. Each
 * treatment keeps its per-group success rate and its arm size; only the mix
 * changes. Slide them together and the reversal disappears, which is the
 * lesson stated as an interaction: the paradox is caused by the allocation,
 * not by either treatment.
 *
 * The bars are drawn from the same rates as the table and are labelled with
 * them, so the picture cannot say something the numbers do not.
 */
export function SimpsonStage() {
  const copy = useT().labs.probability;
  const s = copy.simpson;

  const reduced = useReducedMotion() ?? false;
  const [share, setShare] = useState<Record<TreatmentId, number>>({ ...DEFAULT_SMALL_SHARE });
  const [guess, setGuess] = useState<"impossible" | "possible" | null>(null);

  const table = build(share);
  const leader: TreatmentId =
    (table.overall.a.rate ?? 0) >= (table.overall.b.rate ?? 0) ? "a" : "b";

  const bar = (rate: number | null) => `${Math.round((rate ?? 0) * 100)}%`;

  return (
    <Stage
      width="full"
      caption={s.caption}
      announcement={s.announce(
        percent(table.overall.a.rate ?? 0),
        percent(table.overall.b.rate ?? 0),
        table.reversed ? s.reversedYes : s.reversedNo,
      )}
      viewport={
        <div className="space-y-3">
          <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-4">
            <table className="w-full min-w-[22rem] border-collapse text-body-sm">
              <caption className="sr-only">{s.tableCaption}</caption>
              <thead>
                <tr className="text-overline uppercase text-fg-faint">
                  <th scope="col" className="py-1.5 text-left font-normal">
                    {s.groupHeader}
                  </th>
                  {TREATMENTS.map((t) => (
                    <th key={t} scope="col" className="py-1.5 text-right font-normal">
                      {s.treatment[t]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GROUPS.map((group) => (
                  <tr key={group} className="border-t border-line/10">
                    <th scope="row" className="py-2 text-left font-normal text-fg-muted">
                      {s.group[group]}
                    </th>
                    {TREATMENTS.map((t) => {
                      const cell = cellOf(table, group, t);
                      return (
                        <td key={t} className="py-2 text-right font-mono tabular-nums text-fg">
                          {cell && cell.rate !== null ? percent(cell.rate) : "—"}
                          <span className="ml-2 text-caption text-fg-faint">
                            {cell ? ratio(cell.successes, cell.trials) : ""}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* The aggregate is separated by a heavier rule: it is a
                    different question from the two rows above it. */}
                <tr className="border-t-2 border-line/25">
                  <th scope="row" className="py-2 text-left font-normal text-fg">
                    {s.overall}
                  </th>
                  {TREATMENTS.map((t) => (
                    <td
                      key={t}
                      className={cn(
                        "py-2 text-right font-mono tabular-nums",
                        leader === t ? "text-accent" : "text-fg",
                      )}
                    >
                      {percent(table.overall[t].rate ?? 0)}
                      <span className="ml-2 text-caption text-fg-faint">
                        {ratio(table.overall[t].successes, table.overall[t].trials)}
                      </span>
                      {/* Named, not just tinted. */}
                      {leader === t && (
                        <span className="ml-2 text-overline uppercase text-accent">{s.ahead}</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* The same rates as bars, labelled with their own numbers. */}
          <div
            role="img"
            aria-label={s.barsLabel(
              percent(cellOf(table, "small", "a")?.rate ?? 0),
              percent(cellOf(table, "small", "b")?.rate ?? 0),
              percent(cellOf(table, "large", "a")?.rate ?? 0),
              percent(cellOf(table, "large", "b")?.rate ?? 0),
              percent(table.overall.a.rate ?? 0),
              percent(table.overall.b.rate ?? 0),
            )}
            className="space-y-3 rounded border border-line/10 bg-ink-950 p-4"
          >
            {[
              {
                key: "small",
                label: s.group.small,
                a: cellOf(table, "small", "a")?.rate ?? null,
                b: cellOf(table, "small", "b")?.rate ?? null,
                delay: 0,
              },
              {
                key: "large",
                label: s.group.large,
                a: cellOf(table, "large", "a")?.rate ?? null,
                b: cellOf(table, "large", "b")?.rate ?? null,
                delay: 0,
              },
              {
                key: "overall",
                label: s.overall,
                a: table.overall.a.rate,
                b: table.overall.b.rate,
                // The aggregate settles after the groups it is built from. Not
                // decoration: the delay is the argument, because the overall bar is a
                // consequence of the two above it and this is the only way the picture
                // can say so.
                delay: 180,
              },
            ].map((row) => (
              <div key={row.key}>
                <p className="text-caption text-fg-faint">{row.label}</p>
                <div className="mt-1 space-y-1">
                  {(["a", "b"] as const).map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 font-mono text-caption text-fg-muted">
                        {s.treatmentShort[t]}
                      </span>
                      <span aria-hidden className="h-2.5 flex-1 rounded-pill bg-line/10">
                        <span
                          className={cn(
                            "block h-full rounded-pill",
                            t === "a" ? "bg-accent" : "bg-data",
                            !reduced && "transition-[width] duration-base ease-out",
                          )}
                          style={{
                            width: bar(row[t]),
                            ...(reduced ? {} : { transitionDelay: `${row.delay}ms` }),
                          }}
                        />
                      </span>
                      <span className="w-14 shrink-0 text-right font-mono text-caption tabular-nums text-fg">
                        {row[t] === null ? "—" : percent(row[t])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      readout={
        <div
          className={cn(
            "rounded border px-4 py-3",
            table.reversed ? "border-accent/40 bg-accent/10" : "border-line/10 bg-ink-950",
          )}
        >
          <p className="text-body-sm text-fg">
            {table.reversed ? s.reversedBody : s.notReversedBody}
          </p>
        </div>
      }
      primary={
        <div className="space-y-4">
          <Prediction
            question={s.predictQuestion}
            options={[
              { value: "impossible" as const, label: s.predict.impossible },
              { value: "possible" as const, label: s.predict.possible },
            ]}
            chosen={guess}
            onChoose={setGuess}
            answer={s.predictAnswer}
            matched={guess === null ? undefined : guess === "possible"}
            copy={copy.prediction}
          />

          {TREATMENTS.map((t) => (
            <LabSlider
              key={t}
              label={s.shareLabel(s.treatment[t])}
              value={share[t]}
              min={0}
              max={TRIALS_PER_TREATMENT}
              onChange={(value) => setShare((was) => ({ ...was, [t]: value }))}
              format={() => String(share[t])}
              valueText={() =>
                s.shareValue(s.treatment[t], share[t], TRIALS_PER_TREATMENT - share[t])
              }
            />
          ))}
          <p className="text-caption text-fg-muted">{s.shareHint}</p>
          <Button
            variant="ghost"
            onClick={() => setShare({ ...DEFAULT_SMALL_SHARE })}
            className="min-h-11 w-full justify-center"
          >
            {s.restore}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure
            label={s.overallA}
            value={percent(table.overall.a.rate ?? 0)}
            hint={ratio(table.overall.a.successes, table.overall.a.trials)}
          />
          <Figure
            label={s.overallB}
            value={percent(table.overall.b.rate ?? 0)}
            hint={ratio(table.overall.b.successes, table.overall.b.trials)}
          />
          <Figure
            label={s.reversedFigure}
            value={table.reversed ? s.reversedYes : s.reversedNo}
            tone={table.reversed ? "accent" : "default"}
          />
        </>
      }
    />
  );
}
