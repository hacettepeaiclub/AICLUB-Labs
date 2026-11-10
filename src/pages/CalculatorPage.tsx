import { useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { isModelId, MODEL_STORAGE_KEY } from "@/calculator/storage";
import { calculatorMeta } from "@/app/siteMeta";
import { useDocumentHead } from "@/app/useDocumentHead";
import { CALCULATOR_COPY } from "@/calculator/copy";
import { display, initialState, press, type CalcState } from "@/calculator/engine/machine";
import { MODEL_IDS, MODELS } from "@/calculator/engine/models";
import type { KeyId, ModelId } from "@/calculator/engine/types";
import { LESSONS, type Lesson } from "@/calculator/lessons";
import {
  afterAnswer,
  answered,
  dailyStore,
  dayKey,
  isFinished,
  judge,
  makePuzzle,
  puzzleNumber,
  TRIES,
  type Progress,
} from "@/calculator/daily";
import { CalcDevice } from "@/calculator/ui/CalcDevice";
import { summarize } from "@/calculator/ui/CalcScreen";
import { KeyChip, LessonPanel } from "@/calculator/ui/LessonPanel";
import { DailyCta, DailyPanel, DailyQuestion, type Daily } from "@/calculator/ui/DailyPuzzle";
import { LabSection } from "@/components/lab/LabSection";
import { Badge, Segmented } from "@/components/ui";
import { useReducedMotion } from "@/hooks";
import { useLanguage, useT } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * "How to use my calculator": pick your model, then learn it one key at a time.
 *
 * ## Why it is here
 *
 * Students in the club's courses lose marks to their calculator rather than
 * to the mathematics: an angle in the wrong unit, a variance they cannot find
 * because there is no key for it, a matrix menu they have never opened. The
 * page teaches the device itself, on a simulation of the model they own.
 *
 * ## Why it is not a lab in the collection
 *
 * The collection is an argument with an order, from what a hash does to what
 * attention is, and the home page counts it. This page is a tool every lab
 * might need, so it has its own address and sits beside the collection rather
 * than inside it.
 *
 * ## How a lesson runs
 *
 * In a lesson, the calculator accepts only the key the lesson wants next and
 * lights it; any other key is refused with the name of the right one, so the
 * screen can never drift away from the text beside it. Free use takes every
 * key. "Show me" presses the remaining keys itself, a beat apart, or all at
 * once for a visitor who asked for less motion.
 *
 * ## The daily puzzle
 *
 * Five questions a day, the same for everyone with the same model, three
 * tries each and no keys shown (see `daily.ts`). It has its own card at the
 * top of the page rather than a place among the practice modes, because it is
 * what brings a student back. The calculator takes every key, as in free use,
 * and is cleared before each question; "This is my answer" reads the screen.
 */

interface Bench {
  model: ModelId;
  lesson: string;
  practice: "lesson" | "free" | "daily";
  calc: CalcState;
  progress: number;
  miss: KeyId | null;
  playing: boolean;
  daily: Daily | null;
}

type BenchAction =
  | { type: "key"; key: KeyId }
  | { type: "advance" }
  | { type: "finish" }
  | { type: "play" }
  | { type: "model"; model: ModelId }
  | { type: "lesson"; id: string }
  | { type: "practice"; practice: Bench["practice"] }
  | { type: "restart" }
  | { type: "dailyOpen"; day: string; progress: Progress }
  | { type: "dailyAnswer" }
  | { type: "dailyGiveUp" };

const lessonById = (id: string): Lesson => LESSONS.find((l) => l.id === id) ?? LESSONS[0]!;

const keysOf = (bench: Pick<Bench, "lesson" | "model">): KeyId[] =>
  (lessonById(bench.lesson).steps[bench.model] ?? []).flatMap((step) => step.keys);

function restart(bench: Bench, changes: Partial<Bench> = {}): Bench {
  const next = { ...bench, ...changes };
  return {
    ...next,
    calc: initialState(next.model),
    progress: 0,
    miss: null,
    playing: false,
    daily: null,
  };
}

/** The puzzle after an answer or giving up; a finished question clears the calculator. */
function answer(bench: Bench, gaveUp: boolean): Bench {
  const daily = bench.practice === "daily" ? bench.daily : null;
  if (!daily || isFinished(daily.progress)) return bench;
  const index = answered(daily.progress);
  const task = daily.tasks[index]!;
  const judgement = gaveUp ? null : judge(task, bench.calc);
  if (judgement?.kind === "empty") return { ...bench, daily: { ...daily, verdict: judgement } };
  const progress = afterAnswer(daily.progress, judgement);
  const row = progress[index]!;
  if (row.done) {
    const kind = row.done === "solved" ? "right" : "missed";
    return {
      ...bench,
      calc: initialState(bench.model),
      daily: { ...daily, progress, verdict: { kind, answer: task.answer } },
    };
  }
  const hint = judgement?.kind === "wrong" ? judgement.hint : "higher";
  const left = TRIES - row.misses.length;
  return { ...bench, daily: { ...daily, progress, verdict: { kind: "wrong", hint, left } } };
}

function reduce(bench: Bench, action: BenchAction): Bench {
  switch (action.type) {
    case "key": {
      const keys = keysOf(bench);
      const playing = false;
      if (bench.practice !== "lesson" || bench.progress >= keys.length) {
        const daily = bench.daily?.verdict ? { ...bench.daily, verdict: null } : bench.daily;
        return { ...bench, calc: press(bench.calc, action.key), miss: null, playing, daily };
      }
      const expected = keys[bench.progress]!;
      if (action.key !== expected) return { ...bench, miss: expected, playing };
      return {
        ...bench,
        calc: press(bench.calc, expected),
        progress: bench.progress + 1,
        miss: null,
        playing,
      };
    }
    case "advance": {
      const expected = keysOf(bench)[bench.progress];
      if (!expected) return { ...bench, playing: false };
      return {
        ...bench,
        calc: press(bench.calc, expected),
        progress: bench.progress + 1,
        miss: null,
      };
    }
    case "finish": {
      const keys = keysOf(bench);
      const calc = keys.slice(bench.progress).reduce(press, bench.calc);
      return { ...bench, calc, progress: keys.length, miss: null, playing: false };
    }
    case "play":
      return { ...bench, playing: true, miss: null };
    case "model":
      return restart(bench, { model: action.model });
    case "lesson":
      return restart(bench, { lesson: action.id, practice: "lesson" });
    case "practice":
      return restart(bench, { practice: action.practice });
    case "restart":
      return restart(bench);
    case "dailyOpen":
      return {
        ...restart(bench, { practice: "daily" }),
        daily: {
          day: action.day,
          model: bench.model,
          number: puzzleNumber(action.day),
          tasks: makePuzzle(bench.model, action.day),
          progress: action.progress,
          verdict: null,
        },
      };
    case "dailyAnswer":
      return answer(bench, false);
    case "dailyGiveUp":
      return answer(bench, true);
  }
}

function initialBench(): Bench {
  let model: ModelId = "fx991ex";
  try {
    const stored = window.localStorage.getItem(MODEL_STORAGE_KEY);
    if (isModelId(stored)) model = stored;
  } catch {
    // Storage blocked: the default model stands.
  }
  return {
    model,
    lesson: LESSONS[0]!.id,
    practice: "lesson",
    calc: initialState(model),
    progress: 0,
    miss: null,
    playing: false,
    daily: null,
  };
}

/** A beat between keys when the lesson plays itself. */
const PLAY_MS = 350;

export function CalculatorPage() {
  const t = useT();
  const { language } = useLanguage();
  const copy = CALCULATOR_COPY[language];
  useDocumentHead(calculatorMeta(copy.title, copy.description));
  const reduced = useReducedMotion();
  const [bench, dispatch] = useReducer(reduce, undefined, initialBench);

  const model = MODELS[bench.model];
  const lesson = lessonById(bench.lesson);
  const keys = keysOf(bench);
  const inLesson = bench.practice === "lesson";
  const inDaily = bench.practice === "daily";
  const daily = inDaily ? bench.daily : null;
  const target = inLesson ? (keys[bench.progress] ?? null) : null;
  const view = display(bench.calc);

  // Remember the model: a student has one calculator and comes back with it.
  useEffect(() => {
    try {
      window.localStorage.setItem(MODEL_STORAGE_KEY, bench.model);
    } catch {
      // Not remembered; nothing else depends on it.
    }
  }, [bench.model]);

  // The daily puzzle: opened for today whenever the mode is on without one,
  // which is also what happens when the model changes under it.
  const store = useMemo(() => dailyStore(), []);
  const today = dayKey(new Date());
  const [stats, setStats] = useState(() => store.stats(today));
  useEffect(() => {
    if (bench.practice === "daily" && !bench.daily) {
      dispatch({ type: "dailyOpen", day: today, progress: store.load(today, bench.model) });
    }
  }, [bench.practice, bench.daily, bench.model, store, today]);
  // Every answer is kept at once, so a reload carries on where it was.
  const saving = bench.daily;
  useEffect(() => {
    if (!saving) return;
    store.save(saving.day, saving.model, saving.progress);
    setStats(store.stats(dayKey(new Date())));
    // Only a new answer is worth saving, not a key press that cleared a verdict.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving?.day, saving?.model, saving?.progress, store]);
  const todays =
    daily && daily.day === today && daily.model === bench.model
      ? daily.progress
      : store.load(today, bench.model);
  const openDaily = () => {
    if (!inDaily || daily?.day !== today) {
      dispatch({ type: "dailyOpen", day: today, progress: store.load(today, bench.model) });
    }
    document
      .getElementById("calc-practice")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  // "Show me": one key a beat, or the rest at once under reduced motion.
  useEffect(() => {
    if (!bench.playing) return;
    if (reduced) {
      dispatch({ type: "finish" });
      return;
    }
    const id = window.setTimeout(() => dispatch({ type: "advance" }), PLAY_MS);
    return () => window.clearTimeout(id);
  }, [bench.playing, bench.progress, reduced]);

  const notice =
    bench.calc.notice === "unsupported"
      ? copy.unsupported
      : bench.calc.notice === "full"
        ? copy.full
        : null;

  return (
    <div className="lab-workspace lab-console shell py-7 md:py-10">
      <nav aria-label={t.shell.breadcrumb} className="mb-6">
        <Link
          to="/"
          className="-my-3 inline-flex min-h-11 items-center rounded text-body-sm text-fg-muted transition-colors duration-fast hover:text-fg"
        >
          {t.shell.backToLabs}
        </Link>
      </nav>

      <header className="lab-header mb-9 max-w-prose">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge dotClassName="bg-accent">{copy.badge}</Badge>
          <Badge>{copy.minutes}</Badge>
        </div>
        <p className="mb-2 text-overline uppercase text-fg-faint">{copy.overline}</p>
        <h1 className="text-[clamp(2rem,3.6vw,2.75rem)] font-semibold leading-tight tracking-[-0.025em] text-fg">
          {copy.title}
        </h1>
        <p className="mt-4 text-body text-fg-muted">{copy.description}</p>
      </header>

      <DailyCta
        copy={copy}
        number={puzzleNumber(today)}
        modelName={model.name}
        progress={todays}
        stats={stats}
        onOpen={openDaily}
      />

      <LabSection kicker={copy.pickKicker} title={copy.pickTitle} lede={copy.pickLede}>
        <Segmented
          label={copy.modelLabel}
          value={bench.model}
          options={MODEL_IDS.map((id) => ({
            value: id,
            label: MODELS[id].name,
          }))}
          onChange={(next) => dispatch({ type: "model", model: next })}
          className="max-w-2xl"
        />
        <p className="mt-2 text-caption text-fg-faint">{copy.sameKeys(model.siblings)}</p>
        <p className="mt-1 max-w-prose text-caption text-fg-faint">{copy.notListed}</p>
      </LabSection>

      <div id="calc-practice" className="calc-section">
        <LabSection
          kicker={copy.practiseKicker}
          title={copy.practiseTitle}
          lede={copy.practiseLede}
        >
          <div className="stage-chassis rounded-lg border border-line/15 bg-ink-800 p-3 md:p-5">
            <Segmented
              label={copy.practiceLabel}
              value={bench.practice}
              options={[
                { value: "lesson", label: copy.lessonMode },
                { value: "free", label: copy.freeMode },
              ]}
              onChange={(next) => dispatch({ type: "practice", practice: next })}
              className="mb-5 max-w-sm"
            />

            <div className="calc-bench">
              <div className="min-w-0 space-y-3">
                {/* On a phone the lesson panel is below the device; the step
                    you are on stays here, beside the keys it is about. */}
                {inLesson && target && (
                  <CurrentStep
                    text={currentStepText(lesson, bench.model, bench.progress, language)}
                    chip={<KeyChip model={model} id={target} state="next" />}
                    label={copy.nextKey}
                  />
                )}
                {daily && (
                  <DailyQuestion
                    daily={daily}
                    copy={copy}
                    language={language}
                    onAnswer={() => dispatch({ type: "dailyAnswer" })}
                    onGiveUp={() => dispatch({ type: "dailyGiveUp" })}
                  />
                )}
                <CalcDevice
                  model={model}
                  view={view}
                  target={target}
                  onKey={(key) => dispatch({ type: "key", key })}
                  label={copy.device(model.name)}
                />
                <p aria-live="polite" className="sr-only">
                  {summarize(view)}
                </p>
                <p className={cn("calc-notice", notice ? "text-signal-amber" : "text-fg-faint")}>
                  {notice ?? (view.shift ? copy.shiftLabel : "")}
                </p>
              </div>

              {inLesson ? (
                <LessonPanel
                  copy={copy}
                  language={language}
                  model={model}
                  lesson={lesson}
                  progress={bench.progress}
                  miss={bench.miss}
                  playing={bench.playing}
                  onPick={(id) => dispatch({ type: "lesson", id })}
                  onShowMe={() => dispatch({ type: "play" })}
                  onRestart={() => dispatch({ type: "restart" })}
                />
              ) : inDaily ? (
                daily && (
                  <DailyPanel
                    daily={daily}
                    copy={copy}
                    language={language}
                    modelName={model.name}
                    stats={stats}
                    today={today}
                    onOpenToday={openDaily}
                  />
                )
              ) : (
                <p className="max-w-prose text-body-sm text-fg-muted">{copy.freeHint}</p>
              )}
            </div>
          </div>
          <p className="mt-3 hidden max-w-prose text-body-sm text-fg-muted md:block">
            {copy.keyboardHint}
          </p>
          <p className="mt-3 max-w-prose text-caption text-fg-faint">{copy.disclaimer}</p>
        </LabSection>
      </div>
    </div>
  );
}

function currentStepText(
  lesson: Lesson,
  model: ModelId,
  progress: number,
  language: "en" | "tr",
): string {
  let at = 0;
  for (const step of lesson.steps[model] ?? []) {
    at += step.keys.length;
    if (progress < at) return step.say[language];
  }
  return "";
}

function CurrentStep({ text, chip, label }: { text: string; chip: ReactNode; label: string }) {
  return (
    <div className="calc-now">
      <p className="text-body-sm text-fg">{text}</p>
      <p className="mt-1.5 flex items-center gap-2 text-caption text-fg-muted">
        {label} {chip}
      </p>
    </div>
  );
}
