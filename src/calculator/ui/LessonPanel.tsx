import type { Language } from "@/app/preferences";
import { Button } from "@/components/ui";
import type { CalculatorCopy } from "../copy";
import { keysOf, type ModelSpec } from "../engine/models";
import type { KeyId } from "../engine/types";
import { LESSONS, TOPICS, TOPIC_TITLE, later, offered, type Lesson } from "../lessons";

/** Where each step starts in the lesson's flat list of keys. */
export function stepStarts(lesson: Lesson, model: ModelSpec): number[] {
  const starts: number[] = [];
  let at = 0;
  for (const step of lesson.steps[model.id] ?? []) {
    starts.push(at);
    at += step.keys.length;
  }
  return starts;
}

const ARROWS: Partial<Record<KeyId, string>> = {
  up: "▲",
  down: "▼",
  left: "◀",
  right: "▶",
  ok: "OK",
};

/** What a key is called on this model's keyboard. */
export function keyName(model: ModelSpec, id: KeyId): string {
  const def = keysOf(model).find((key) => key.id === id);
  return def?.label ?? ARROWS[id] ?? id;
}

/** A key as a chip in the lesson text. */
export function KeyChip({
  model,
  id,
  state = "plain",
}: {
  model: ModelSpec;
  id: KeyId;
  state?: "plain" | "done" | "next";
}) {
  return (
    <kbd className="calc-chip" data-state={state} data-key={id}>
      {keyName(model, id)}
    </kbd>
  );
}

export interface LessonPanelProps {
  copy: CalculatorCopy;
  language: Language;
  model: ModelSpec;
  lesson: Lesson;
  /** Keys pressed so far in this lesson. */
  progress: number;
  /** The key the last wrong press was supposed to be. */
  miss: KeyId | null;
  playing: boolean;
  onPick: (id: string) => void;
  onShowMe: () => void;
  onRestart: () => void;
}

export function LessonPanel({
  copy,
  language,
  model,
  lesson,
  progress,
  miss,
  playing,
  onPick,
  onShowMe,
  onRestart,
}: LessonPanelProps) {
  const steps = lesson.steps[model.id] ?? [];
  const available = steps.length > 0;
  // Why a lesson is greyed out: the device cannot, or this simulator does not yet.
  const unavailable = (l: Lesson) =>
    later(l, model.id) ? copy.notYet(model.name) : copy.notOnModel(model.name);
  const starts = stepStarts(lesson, model);
  const total = steps.reduce((n, step) => n + step.keys.length, 0);
  const finished = available && progress >= total;
  const current = finished
    ? steps.length
    : starts.reduce((found, start, i) => (start <= progress ? i : found), 0);
  const index = LESSONS.findIndex((l) => l.id === lesson.id);
  // The next lesson this model can do.
  const next = LESSONS.slice(index + 1).find((l) => offered(l, model.id));

  return (
    <div className="calc-lessons min-w-0 space-y-5">
      <nav aria-label={copy.lessonsLabel} className="space-y-3">
        {TOPICS.map((topic) => (
          <div key={topic}>
            <p className="text-overline uppercase text-fg-faint">{TOPIC_TITLE[topic][language]}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {LESSONS.filter((l) => l.topic === topic).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-current={l.id === lesson.id ? "step" : undefined}
                  data-off={offered(l, model.id) ? undefined : true}
                  title={offered(l, model.id) ? undefined : unavailable(l)}
                  onClick={() => onPick(l.id)}
                  className="calc-lesson"
                >
                  <span>{l.title[language]}</span>
                  {!offered(l, model.id) && <span className="sr-only"> ({unavailable(l)})</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="calc-card">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="text-title text-fg">{lesson.title[language]}</h3>
          {available && (
            <p className="font-mono text-caption text-fg-faint">
              {finished ? copy.done : copy.step(current + 1, steps.length)}
            </p>
          )}
        </div>
        <p className="mt-1.5 text-body-sm text-fg-muted">{lesson.why[language]}</p>
        {!available && (
          <p role="status" className="mt-4 text-body-sm text-signal-amber">
            {unavailable(lesson)}
          </p>
        )}

        <ol className="mt-4 space-y-3">
          {steps.map((step, i) => {
            const state = i < current ? "done" : i === current ? "now" : "later";
            const start = starts[i] ?? 0;
            return (
              <li key={i} className="calc-step" data-state={state}>
                <span aria-hidden className="calc-dot">
                  {state === "done" ? "✓" : i + 1}
                </span>
                <div className="min-w-0">
                  <p
                    className={
                      state === "now" ? "text-body-sm text-fg" : "text-body-sm text-fg-muted"
                    }
                  >
                    {step.say[language]}
                  </p>
                  <p className="mt-1.5 flex flex-wrap gap-1">
                    {step.keys.map((id, k) => {
                      const at = start + k;
                      return (
                        <KeyChip
                          key={k}
                          model={model}
                          id={id}
                          state={at < progress ? "done" : at === progress ? "next" : "plain"}
                        />
                      );
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {miss && !finished && (
          <p
            role="alert"
            className="mt-4 flex flex-wrap items-center gap-2 text-body-sm text-signal-amber"
          >
            {copy.wrongKey} <KeyChip model={model} id={miss} state="next" />
          </p>
        )}

        {finished && (
          <p role="status" className="mt-4 text-body-sm text-accent">
            {copy.done} {lesson.outcome[language]}
            {!next && ` ${copy.allDone}`}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {available && !finished && (
            <Button variant="ghost" size="sm" onClick={onShowMe} disabled={playing}>
              {copy.showMe}
            </Button>
          )}
          {available && (
            <Button variant="ghost" size="sm" onClick={onRestart}>
              {copy.restart}
            </Button>
          )}
          {finished && next && (
            <Button size="sm" onClick={() => onPick(next.id)}>
              {copy.nextLesson}: <span>{next.title[language]}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
