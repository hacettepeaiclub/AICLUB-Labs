import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabCopy, type LabsCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  THREADS,
  canRun,
  isBlocked,
  isDone,
  isFinished,
  replay,
  type Event,
  type Program,
  type State,
  type Thread,
} from "../engine";
import { THREAD_STYLE } from "../view";

export interface SchedulerStageProps {
  program: Program;
  /** Shown under the threads before the run is over. */
  hint: string;
  /** Shown once both threads are done, judging how it went. */
  verdict: (state: State) => string;
  caption: string;
  figures: (state: State) => ReactNode;
  secondary?: ReactNode;
  secondaryLabel?: string;
}

/**
 * Two threads, one shared memory, and the visitor as the scheduler.
 *
 * Each thread's next step is a button on that thread: pressing it runs
 * exactly one instruction, so the visitor decides every interleaving by
 * hand. Undo takes a step back and the whole run is replayed from the order
 * alone (`replay`), so nothing on screen can drift from what the engine says
 * that order does.
 *
 * Shortcuts are scoped to the stage, not the page: A and B run a step, U
 * undoes and R starts over, while focus is anywhere inside it. Several of
 * these stages share the page, and a page-wide "A" would run them all.
 */
export function SchedulerStage({
  program,
  hint,
  verdict,
  caption,
  figures,
  secondary,
  secondaryLabel,
}: SchedulerStageProps) {
  const t = useLabCopy("race-condition").scheduler;
  const [order, setOrder] = useState<Thread[]>([]);

  const { states, events } = useMemo(() => replay(program, order), [program, order]);
  const state = states[states.length - 1]!;
  const last = events[events.length - 1];
  const finished = isFinished(program, state);
  const hasLock = program.lines.some((l) => l.instruction.op === "lock");
  const variables = Object.keys(program.memory);

  const run = (thread: Thread) => {
    if (canRun(program, state, thread)) setOrder((o) => [...o, thread]);
  };
  const undo = () => setOrder((o) => o.slice(0, -1));
  const reset = () => setOrder([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();
    const action =
      key === "a"
        ? () => run(0)
        : key === "b"
          ? () => run(1)
          : key === "u"
            ? undo
            : key === "r"
              ? reset
              : null;
    if (!action) return;
    event.preventDefault();
    action();
  };

  const said = last ? narrate(t, last) : "";

  return (
    // Shortcuts only: every one of them is also a button.
    <div onKeyDown={onKeyDown}>
      <Stage
        width="wide"
        caption={caption}
        announcement={finished ? `${said} ${verdict(state)}` : said}
        viewport={
          <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
            <div className="grid gap-3 [grid-template-areas:'mem_mem''a_b'] [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] md:[grid-template-areas:'a_mem_b'] md:[grid-template-columns:minmax(0,1fr)_minmax(0,9rem)_minmax(0,1fr)]">
              {THREADS.map((thread) => (
                <ThreadCard
                  key={thread}
                  program={program}
                  state={state}
                  thread={thread}
                  onRun={() => run(thread)}
                />
              ))}

              {/* Shared memory: the only thing both threads can see. */}
              <section
                aria-label={t.memory}
                className="rounded border border-line/15 bg-ink-900 p-3 [grid-area:mem]"
              >
                <h3 className="text-overline uppercase text-fg-faint">{t.memory}</h3>
                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2 md:block md:space-y-2">
                  {variables.map((v) => (
                    <div key={v}>
                      <dt className="font-mono text-caption text-fg-muted">{v}</dt>
                      <dd
                        className={cn(
                          "font-mono text-title tabular-nums",
                          last && "v" in last.instruction && last.instruction.v === v
                            ? "text-accent"
                            : "text-fg",
                        )}
                      >
                        {state.memory[v]}
                      </dd>
                    </div>
                  ))}
                  {hasLock && (
                    <div>
                      <dt className="font-mono text-caption text-fg-muted">m</dt>
                      <dd className="text-body-sm text-fg">
                        {state.holder === null ? t.lockFree : t.lockHeld(t.name(state.holder))}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            </div>

            {/* The order so far: the one thing the visitor chose. */}
            <div>
              <p className="mb-1.5 text-caption text-fg-muted">{t.orderLabel}</p>
              <ol aria-label={t.orderLabel} className="flex min-h-7 flex-wrap gap-1">
                {order.length === 0 ? (
                  <li className="text-caption text-fg-faint">{t.orderEmpty}</li>
                ) : (
                  order.map((thread, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex h-7 min-w-7 items-center justify-center rounded px-1.5 font-mono text-caption",
                        THREAD_STYLE[thread].chip,
                      )}
                    >
                      {t.name(thread)}
                    </li>
                  ))
                )}
              </ol>
            </div>

            <p className="min-h-[2.5rem] text-body-sm text-fg-muted">
              {finished ? <span className="text-fg">{verdict(state)}</span> : last ? said : hint}
            </p>
          </div>
        }
        primary={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={undo}
              disabled={order.length === 0}
              className="flex-1"
            >
              {t.undo}
            </Button>
            <Button
              variant="ghost"
              onClick={reset}
              disabled={order.length === 0}
              className="flex-1"
            >
              {t.reset}
            </Button>
          </div>
        }
        figures={figures(state)}
        secondary={secondary}
        secondaryLabel={secondaryLabel}
      />
    </div>
  );
}

function ThreadCard({
  program,
  state,
  thread,
  onRun,
}: {
  program: Program;
  state: State;
  thread: Thread;
  onRun: () => void;
}) {
  const t = useLabCopy("race-condition").scheduler;
  const done = isDone(program, state, thread);
  const blocked = isBlocked(program, state, thread);
  const pc = state.pc[thread];
  const style = THREAD_STYLE[thread];
  const name = t.name(thread);
  // Only the split increment keeps anything in a register; elsewhere it would
  // be a number that never changes.
  const usesRegister = program.lines.some((l) => l.instruction.op === "load");

  return (
    <section
      aria-label={t.thread(name)}
      className={cn(
        "flex min-w-0 flex-col rounded border bg-ink-900 p-2 sm:p-3",
        style.border,
        thread === 0 ? "[grid-area:a]" : "[grid-area:b]",
      )}
    >
      {/* The thread's state is on its button: ready, waiting, done. */}
      <h3 className={cn("font-mono text-body-sm font-medium", style.text)}>{t.thread(name)}</h3>

      <ol className="my-2.5 space-y-0.5 font-mono text-[0.7rem] leading-relaxed sm:text-caption">
        {program.lines.map((line, i) => {
          const next = i === pc && !done;
          return (
            <li
              key={i}
              aria-current={next ? "step" : undefined}
              className={cn(
                "flex items-start gap-1 rounded px-0.5 py-0.5 sm:px-1",
                next ? cn(style.line, "text-fg") : "text-fg-faint",
              )}
            >
              <span aria-hidden className="w-2 shrink-0">
                {next ? "▸" : ""}
              </span>
              <span
                className="min-w-0 break-words"
                style={{ paddingLeft: `${(line.indent ?? 0) * 0.5}rem` }}
              >
                {line.code}
              </span>
            </li>
          );
        })}
      </ol>

      {usesRegister && (
        <p className="mb-2.5 font-mono text-caption text-fg-muted">
          {t.register} = <span className="tabular-nums text-fg">{state.reg[thread]}</span>
        </p>
      )}

      <Button
        onClick={onRun}
        disabled={done || blocked}
        aria-keyshortcuts={thread === 0 ? "A" : "B"}
        className="mt-auto w-full px-2"
      >
        {done ? t.status.done : blocked ? t.status.waiting : t.run(name)}
      </Button>
    </section>
  );
}

type SchedulerCopy = LabsCopy["race-condition"]["scheduler"];

/** One sentence for what a step just did. */
function narrate(t: SchedulerCopy, e: Event): string {
  const who = t.name(e.thread);
  const i = e.instruction;
  switch (i.op) {
    case "load":
      return t.said.load(who, i.v, e.read ?? 0);
    case "add":
      return t.said.add(who, e.wrote ?? 0);
    case "store":
      return t.said.store(who, i.v, e.wrote ?? 0);
    case "lock":
      return t.said.lock(who);
    case "unlock":
      return t.said.unlock(who);
    case "atomicAdd":
      return t.said.atomicAdd(who, i.v, e.read ?? 0, e.wrote ?? 0);
    case "check":
      return e.passed ? t.said.checkPass(who, e.read ?? 0) : t.said.checkFail(who, e.read ?? 0);
    case "withdraw":
      return t.said.withdraw(who, e.read ?? 0, e.wrote ?? 0);
  }
}
