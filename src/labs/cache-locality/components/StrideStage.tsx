import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLanguage } from "@/i18n";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { STRIDES, STRIDE_LENGTH } from "../bench";
import { countMisses, strideOrder } from "../engine";
import type { Bench } from "../useBench";
import { formatNumber, formatRatio } from "../view";

const LINE = 8;
/** The strip drawn above the chart: 64 numbers, eight lines of eight. */
const STRIP = 64;

type Stride = (typeof STRIDES)[number];

/**
 * Section 3: step further apart, pay more per read — until a whole line.
 *
 * Every number in a 32 MB array is read once at every stride; only the
 * order changes. The model says the misses per read double with the stride
 * until it reaches a line (eight numbers), and then stay at one: past that
 * point, every read is the only one its line ever gets. The bars are the
 * visitor's own processor answering the same question in nanoseconds.
 *
 * They do not have to agree exactly, and the copy says so. Real processors
 * fetch the next line before it is asked for, and some fetch lines in pairs,
 * so the measured climb often stops a stride or two later than the model's,
 * and can fall again once the prefetcher learns the pattern. What carries
 * over is the shape: a cost that rises with the distance between reads.
 */
export function StrideStage({ bench }: { bench: Bench }) {
  const t = useLabCopy("cache-locality").stride;
  const { language } = useLanguage();
  const [measured, setMeasured] = useState<Partial<Record<Stride, number>>>({});
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const [chosen, setChosen] = useState<Stride>(8);

  // The model's misses per read at each stride, from the engine.
  const model = useMemo(
    () =>
      Object.fromEntries(
        STRIDES.map((s) => [
          s,
          countMisses(strideOrder(8192, s), { lineSize: LINE, lines: 32 }) / 8192,
        ]),
      ) as Record<Stride, number>,
    [],
  );

  const measure = () => {
    setRunning(true);
    setFailed(false);
    setMeasured({});
    bench
      .stride((stride, ns) => setMeasured((m) => ({ ...m, [stride]: ns })))
      .catch(() => setFailed(true))
      .finally(() => setRunning(false));
  };

  const values = STRIDES.map((s) => measured[s]);
  const top = Math.max(...values.map((v) => v ?? 0), 0);
  const first = measured[1];
  const dearest = STRIDES.reduce<Stride | null>(
    (best, s) => ((measured[s] ?? -1) > (best === null ? -1 : (measured[best] ?? -1)) ? s : best),
    null,
  );
  const complete = values.every((v) => v !== undefined);

  const fraction = (miss: number) => (miss >= 1 ? t.everyRead : t.oneIn(Math.round(1 / miss)));

  return (
    <Stage
      width="wide"
      caption={t.caption(formatNumber(STRIDE_LENGTH, language, 0))}
      announcement={
        complete && first !== undefined && dearest !== null
          ? t.announce(
              formatNumber(first, language),
              dearest,
              formatNumber(measured[dearest]!, language),
            )
          : failed
            ? t.error
            : ""
      }
      viewport={
        <div className="space-y-5 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          {/* Which numbers one pass at the chosen stride reads, and so how
              many lines it has to bring in. */}
          <div>
            <p className="mb-2 text-caption text-fg-muted">{t.stripLabel(chosen)}</p>
            <div aria-hidden className="grid grid-cols-8 gap-1">
              {Array.from({ length: STRIP / LINE }, (_, line) => (
                <div key={line} className="grid grid-cols-8 gap-px rounded bg-ink-900 p-0.5">
                  {Array.from({ length: LINE }, (_, k) => {
                    const i = line * LINE + k;
                    return (
                      <span
                        key={k}
                        className={cn(
                          "h-3 rounded-[1px]",
                          i % chosen === 0 ? "bg-signal-amber" : "bg-fg-faint/15",
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 text-caption text-fg-faint">
              {t.stripNote(fraction(model[chosen]))}
            </p>
          </div>

          {/* The visitor's processor: nanoseconds per read at each stride,
              with the model's misses per read under each bar. */}
          <div>
            <div className="flex h-40 items-end gap-1.5 sm:gap-3" aria-hidden>
              {STRIDES.map((s) => {
                const v = measured[s];
                return (
                  <div key={s} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-1">
                    <span className="text-center font-mono text-[0.6rem] tabular-nums text-fg-muted sm:text-caption">
                      {v === undefined ? "" : formatNumber(v, language)}
                    </span>
                    <div
                      className={cn(
                        "rounded-t transition-[height] duration-slow ease-out-expo",
                        s === chosen ? "bg-accent" : "bg-accent/45",
                      )}
                      style={{
                        height: v === undefined || top === 0 ? "2px" : `${(v / top) * 100}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 flex gap-1.5 sm:gap-3" aria-hidden>
              {STRIDES.map((s) => (
                <div key={s} className="min-w-0 flex-1 text-center">
                  <p className="font-mono text-caption text-fg">{s}</p>
                  <p className="text-[0.6rem] leading-tight text-fg-faint sm:text-caption">
                    {model[s] >= 1 ? "1" : `1/${Math.round(1 / model[s])}`}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-caption text-fg-faint">{failed ? t.error : t.axisNote}</p>
            {/* Wrapped: a table ignores the 1px box `sr-only` gives it and
                would widen the page on a phone. */}
            <div className="sr-only">
              <table>
                <caption>{t.tableCaption}</caption>
                <thead>
                  <tr>
                    <th>{t.strideHeader}</th>
                    <th>{t.nsHeader}</th>
                    <th>{t.modelHeader}</th>
                  </tr>
                </thead>
                <tbody>
                  {STRIDES.map((s) => (
                    <tr key={s}>
                      <td>{s}</td>
                      <td>
                        {measured[s] === undefined ? "—" : formatNumber(measured[s]!, language)}
                      </td>
                      <td>{fraction(model[s])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      primary={
        <Button onClick={measure} disabled={running} className="min-h-[44px] w-full">
          {running ? t.running : complete ? t.again : t.run}
        </Button>
      }
      secondary={
        <Segmented
          label={t.chooseLabel}
          value={String(chosen)}
          onChange={(v) => setChosen(Number(v) as Stride)}
          options={STRIDES.map((s) => ({ value: String(s), label: String(s) }))}
        />
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure
            label={t.figures.first}
            value={first === undefined ? "—" : t.ns(formatNumber(first, language))}
            hint={t.figures.firstHint}
          />
          <Figure
            label={t.figures.dearest}
            value={dearest === null ? "—" : String(dearest)}
            hint={
              dearest !== null && first !== undefined
                ? t.figures.dearestHint(formatRatio(measured[dearest]! / first, language))
                : t.figures.dearestEmpty
            }
            tone="accent"
          />
          <Figure
            label={t.figures.model}
            value={fraction(model[chosen])}
            hint={t.figures.modelHint(chosen)}
          />
        </>
      }
    />
  );
}
