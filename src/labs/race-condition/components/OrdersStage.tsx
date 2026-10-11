import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { COUNTER, enumerate, replay } from "../engine";
import { THREAD_STYLE } from "../view";

/** Every order the scheduler could pick for two `counter++`, with its result. */
const OUTCOMES = enumerate(COUNTER);
const LOST = OUTCOMES.filter((o) => o.memory.counter === 1).length;
/** Start on strict alternation: the most familiar way to lose. */
const FIRST = OUTCOMES.findIndex((o) => o.order.join("") === "010101");

/**
 * Section 2: every order, not just yours.
 *
 * Six steps, three of them A's: twenty ways to interleave two increments, and
 * the page lists all of them with the result each one gives. Two come out
 * right — the two where one thread finishes before the other starts — and
 * eighteen lose an update. Pick any card and its trace below shows why: both
 * loads land before either store.
 *
 * The count is the engine's, not a hard-coded "18": `enumerate` walks every
 * branch the scheduler has, and the test suite pins the number the copy
 * quotes.
 */
export function OrdersStage() {
  const t = useLabCopy("race-condition").orders;
  const s = useLabCopy("race-condition").scheduler;
  const [chosen, setChosen] = useState(FIRST);

  const outcome = OUTCOMES[chosen]!;
  const { states, events } = useMemo(() => replay(COUNTER, outcome.order), [outcome]);
  const lost = outcome.memory.counter === 1;

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(
        outcome.order.map((th) => s.name(th)).join(" "),
        outcome.memory.counter ?? 0,
      )}
      viewport={
        <div className="space-y-5 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-1.5">
            {OUTCOMES.map((o, i) => {
              const right = o.memory.counter === 2;
              return (
                <li key={o.order.join("")}>
                  <button
                    type="button"
                    onClick={() => setChosen(i)}
                    aria-pressed={i === chosen}
                    aria-label={t.cardLabel(
                      o.order.map((th) => s.name(th)).join(" "),
                      o.memory.counter ?? 0,
                    )}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-1.5 rounded border px-1.5 py-1.5",
                      i === chosen ? "border-accent bg-ink-800" : "border-line/10 hover:bg-ink-900",
                    )}
                  >
                    <span aria-hidden className="flex gap-0.5">
                      {o.order.map((th, k) => (
                        <span
                          key={k}
                          className={cn(
                            "flex h-5 w-3.5 items-center justify-center rounded-[2px] font-mono text-[0.6rem]",
                            THREAD_STYLE[th].chip,
                          )}
                        >
                          {s.name(th)}
                        </span>
                      ))}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "font-mono text-caption tabular-nums",
                        right ? "text-signal-green" : "text-signal-amber",
                      )}
                    >
                      {right ? "2✓" : "1×"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* The chosen order, step by step: what each thread held, and what
              memory held, after every instruction. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[22rem] text-left font-mono text-caption">
              <caption className="mb-2 text-left font-body text-caption text-fg-muted">
                {t.traceCaption}
              </caption>
              <thead className="text-fg-faint">
                <tr>
                  <th className="py-1 pr-2 font-normal">#</th>
                  <th className="py-1 pr-2 font-normal">{t.stepHeader}</th>
                  <th className="py-1 pr-2 text-right font-normal">{t.regHeader(s.name(0))}</th>
                  <th className="py-1 pr-2 text-right font-normal">{t.regHeader(s.name(1))}</th>
                  <th className="py-1 text-right font-normal">counter</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, k) => {
                  const after = states[k + 1]!;
                  const writes = e.instruction.op === "store";
                  return (
                    <tr key={k} className="border-t border-line/10">
                      <td className="py-1 pr-2 text-fg-faint">{k + 1}</td>
                      <td className="py-1 pr-2">
                        <span className={THREAD_STYLE[e.thread].text}>{s.name(e.thread)}</span>
                        <span className="text-fg">: {COUNTER.lines[e.line]!.code}</span>
                      </td>
                      <td className="py-1 pr-2 text-right tabular-nums text-fg-muted">
                        {after.reg[0]}
                      </td>
                      <td className="py-1 pr-2 text-right tabular-nums text-fg-muted">
                        {after.reg[1]}
                      </td>
                      <td
                        className={cn(
                          "py-1 text-right tabular-nums",
                          writes ? "text-fg" : "text-fg-faint",
                        )}
                      >
                        {after.memory.counter}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-body-sm text-fg-muted">{lost ? t.whyLost : t.whyRight}</p>
        </div>
      }
      primary={null}
      figures={
        <>
          <Figure
            label={t.figures.orders}
            value={String(OUTCOMES.length)}
            hint={t.figures.ordersHint}
          />
          <Figure
            label={t.figures.lost}
            value={String(LOST)}
            hint={t.figures.lostHint}
            tone="accent"
          />
          <Figure
            label={t.figures.right}
            value={String(OUTCOMES.length - LOST)}
            hint={t.figures.rightHint}
          />
        </>
      }
    />
  );
}
