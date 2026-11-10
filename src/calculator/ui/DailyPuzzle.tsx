import { useEffect, useState } from "react";
import type { Language } from "@/app/preferences";
import { SITE_URL } from "@/app/siteMeta";
import { Button } from "@/components/ui";
import { CALCULATOR_PATH } from "@/lib/paths";
import type { CalculatorCopy } from "../copy";
import type { ModelId } from "../engine/types";
import {
  answered,
  formatAnswer,
  formatCountdown,
  isFinished,
  msToTomorrow,
  points,
  rowEmoji,
  MAX_POINTS,
  PUZZLE_LENGTH,
  TRIES,
  type Hint,
  type Progress,
  type PuzzleTask,
  type Row,
  type Stats,
} from "../daily";

/**
 * The daily puzzle's three pieces.
 *
 * - `DailyCta`: the card at the top of the page, so the puzzle is the first
 *   thing a returning student sees, with today's squares once it is started.
 * - `DailyQuestion`: the question, above the calculator, so on a phone the
 *   question and "This is my answer" stay where the thumbs are.
 * - `DailyPanel`: beside the calculator, the board of tries and, at the end,
 *   the points, the streak and a result to copy.
 */

export interface Daily {
  day: string;
  model: ModelId;
  number: number;
  tasks: PuzzleTask[];
  progress: Progress;
  /** What the last answer found, until the next key. */
  verdict:
    | { kind: "right" | "missed"; answer: number }
    | { kind: "wrong"; hint: Hint; left: number }
    | { kind: "empty" }
    | null;
}

/** Milliseconds to midnight, ticking once a second while `on`. */
function useCountdown(on: boolean): number {
  const [ms, setMs] = useState(() => msToTomorrow(new Date()));
  useEffect(() => {
    if (!on) return;
    setMs(msToTomorrow(new Date()));
    const id = window.setInterval(() => setMs(msToTomorrow(new Date())), 1000);
    return () => window.clearInterval(id);
  }, [on]);
  return ms;
}

/** Five squares, one a question, coloured as the shared result is. */
function Squares({ progress, className }: { progress: Progress; className?: string }) {
  return (
    <span aria-hidden className={className ?? "calc-squares"}>
      {Array.from({ length: PUZZLE_LENGTH }, (_, i) => {
        const row = progress[i];
        const state = !row?.done
          ? "open"
          : row.done === "missed"
            ? "missed"
            : `solved${row.misses.length}`;
        return <span key={i} className="calc-square" data-state={state} />;
      })}
    </span>
  );
}

export function DailyCta({
  copy,
  number,
  modelName,
  progress,
  stats,
  onOpen,
}: {
  copy: CalculatorCopy;
  number: number;
  modelName: string;
  progress: Progress;
  stats: Stats;
  onOpen: () => void;
}) {
  const finished = isFinished(progress);
  const countdown = useCountdown(finished);
  const label = finished
    ? copy.dailySeeResult
    : progress.length > 0
      ? copy.dailyContinue
      : copy.dailyPlay;
  return (
    <section className="calc-cta" aria-labelledby="calc-cta-title">
      <div className="min-w-0">
        <p className="calc-cta-overline">
          <span aria-hidden className="calc-cta-dot" />
          <span lang="en">{copy.dailyOverline(number)}</span>
          {stats.streak > 0 && (
            <span className="text-signal-amber">· {copy.dailyStreak(stats.streak)}</span>
          )}
        </p>
        <h2 id="calc-cta-title" lang="en" className="mt-1.5 text-title text-fg">
          {copy.dailyTitle}
        </h2>
        <p className="mt-1.5 max-w-prose text-body-sm text-fg-muted">{copy.dailyLede(modelName)}</p>
      </div>
      <div className="calc-cta-side">
        <Squares progress={progress} />
        <Button size="lg" onClick={onOpen}>
          {label}
        </Button>
        {finished && (
          <p className="font-mono text-caption text-fg-faint">
            {copy.dailyNext(formatCountdown(countdown))}
          </p>
        )}
      </div>
    </section>
  );
}

export function DailyQuestion({
  daily,
  copy,
  language,
  onAnswer,
  onGiveUp,
}: {
  daily: Daily;
  copy: CalculatorCopy;
  language: Language;
  onAnswer: () => void;
  onGiveUp: () => void;
}) {
  const index = answered(daily.progress);
  const task = daily.tasks[index];
  if (!task) return null;
  const used = daily.progress[index]?.misses.length ?? 0;
  const left = TRIES - used;
  const verdict = daily.verdict;
  return (
    <div className="calc-task">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-overline uppercase text-fg-faint">
          {copy.dailyQuestion(index + 1, PUZZLE_LENGTH)} · <span lang="en">{task.topic.en}</span>
        </p>
        <p className="calc-tries" aria-label={copy.dailyTriesLeft(left)}>
          {Array.from({ length: TRIES }, (_, i) => (
            <span key={i} data-used={i < used || undefined} />
          ))}
        </p>
      </div>
      <p className="mt-1.5 text-body text-fg">{task.prompt[language]}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={onAnswer}>
          {copy.dailyAnswer}
        </Button>
        <Button variant="ghost" size="sm" onClick={onGiveUp}>
          {copy.dailyGiveUp}
        </Button>
      </div>
      <p
        role="status"
        className="calc-verdict"
        data-tone={verdict?.kind === "right" ? "good" : verdict ? "warn" : undefined}
      >
        {verdictText(verdict, copy)}
      </p>
    </div>
  );
}

function verdictText(verdict: Daily["verdict"], copy: CalculatorCopy): string {
  if (!verdict) return "";
  switch (verdict.kind) {
    case "right":
      return copy.dailyRight(formatAnswer(verdict.answer));
    case "missed":
      return copy.dailyMissed(formatAnswer(verdict.answer));
    case "empty":
      return copy.dailyEmpty;
    case "wrong": {
      const say = verdict.hint === "higher" ? copy.dailyHigher : copy.dailyLower;
      return say(copy.dailyTriesLeft(verdict.left));
    }
  }
}

export function DailyPanel({
  daily,
  copy,
  modelName,
  stats,
  today,
  onOpenToday,
}: {
  daily: Daily;
  copy: CalculatorCopy;
  modelName: string;
  stats: Stats;
  today: string;
  onOpenToday: () => void;
}) {
  const finished = isFinished(daily.progress);
  const current = answered(daily.progress);
  const score = points(daily.progress);
  const countdown = useCountdown(finished);
  const [copied, setCopied] = useState<"yes" | "failed" | null>(null);
  const shareText = [
    copy.dailyShareText(daily.number, modelName),
    `${daily.progress.map(rowEmoji).join("")} ${score}/${MAX_POINTS}`,
    `${SITE_URL}${CALCULATOR_PATH}`,
  ].join("\n");

  const share = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied("yes");
    } catch {
      setCopied("failed");
    }
  };

  return (
    <div className="min-w-0 space-y-5">
      <div className="calc-card">
        <h3 lang="en" className="text-title text-fg">
          {copy.dailyBoard}
        </h3>
        <ol className="calc-grid">
          {daily.tasks.map((task, i) => (
            <BoardRow
              key={task.kind}
              row={daily.progress[i]}
              number={i + 1}
              topic={task.topic.en}
              current={!finished && i === current}
              copy={copy}
            />
          ))}
        </ol>
        {!finished && <p className="mt-4 text-body-sm text-fg-muted">{copy.dailyHow}</p>}
      </div>

      {finished && (
        <div className="calc-card">
          <p className="calc-score">{copy.dailyPoints(score, MAX_POINTS)}</p>
          <p className="text-body-sm text-fg">{copy.dailyVerdict(score)}</p>
          <dl className="calc-stats">
            <div>
              <dt>{copy.statsPlayed}</dt>
              <dd>{stats.played}</dd>
            </div>
            <div>
              <dt>{copy.statsStreak}</dt>
              <dd>{stats.streak}</dd>
            </div>
            <div>
              <dt>{copy.statsBest}</dt>
              <dd>{stats.best}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={() => void share()}>
              {copy.dailyShare}
            </Button>
            <p role="status" className="text-body-sm text-accent">
              {copied === "yes" ? copy.dailyCopied : ""}
            </p>
          </div>
          {copied === "failed" && (
            <>
              <p className="mt-3 text-caption text-fg-muted">{copy.dailyCopyHere}</p>
              <pre className="calc-share">{shareText}</pre>
            </>
          )}
          {daily.day === today ? (
            <p className="mt-4 font-mono text-caption text-fg-faint">
              {copy.dailyNext(formatCountdown(countdown))}
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-body-sm text-fg">{copy.dailyNewDay}</p>
              <Button variant="ghost" size="sm" onClick={onOpenToday}>
                {copy.dailyOpenNew}
              </Button>
            </div>
          )}
        </div>
      )}
      <p className="text-caption text-fg-faint">{copy.dailyLocal}</p>
    </div>
  );
}

function BoardRow({
  row,
  number,
  topic,
  current,
  copy,
}: {
  row: Row | undefined;
  number: number;
  topic: string;
  current: boolean;
  copy: CalculatorCopy;
}) {
  const misses = row?.misses ?? [];
  const cells: { state: string; mark: string; name: string }[] = misses.map((hint) => ({
    state: row?.done === "missed" ? "missed" : "miss",
    mark: hint === "higher" ? "↑" : "↓",
    name: copy.dailyCell[hint],
  }));
  if (row?.done === "solved")
    cells.push({ state: "solved", mark: "✓", name: copy.dailyCell.solved });
  if (row?.done === "missed" && misses.length < TRIES) {
    cells.push({ state: "missed", mark: "✕", name: copy.dailyCell.missed });
  }
  while (cells.length < TRIES) cells.push({ state: "open", mark: "", name: copy.dailyCell.open });
  return (
    <li className="calc-grid-row" data-current={current || undefined}>
      <span className="calc-grid-label">
        {number}. <span lang="en">{topic}</span>
      </span>
      <span className="calc-grid-cells">
        {cells.map((cell, i) => (
          <span key={i} className="calc-cell-try" data-state={cell.state} title={cell.name}>
            <span aria-hidden>{cell.mark}</span>
            <span className="sr-only">{cell.name}</span>
          </span>
        ))}
      </span>
    </li>
  );
}
