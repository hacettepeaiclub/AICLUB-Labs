import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import {
  DAYS,
  fillRoom,
  firstAbove,
  pairCount,
  sharedProbability,
  simulate,
} from "../engine/birthday";
import { COLUMNS, dayLabel, percent, seatOf } from "../view";
import { Prediction } from "./Prediction";

const MAX_PEOPLE = 60;
const ROOMS = 2000;

/**
 * Stagger between people arriving, and the cap on how long the whole arrival
 * can take.
 *
 * Dragging the slider from 5 to 60 must not queue fifty-five animations: the
 * stagger shrinks so that a large jump still finishes inside `ARRIVAL_CAP`.
 * Anybody who drags quickly is asking to see the room, not a queue.
 */
const STAGGER = 26;
const ARRIVAL_CAP = 420;

/**
 * Section 2 — a room filling up, and the odds climbing faster than expected.
 *
 * The threshold is not written anywhere in this file. `firstAbove(0.5)`
 * searches the closed form for it, so the famous 23 is an output of the model
 * rather than a number somebody typed next to a picture of it.
 *
 * ## Two numbers, two routes
 *
 * The exact probability comes from the complement; the simulated one comes
 * from filling two thousand independent rooms and counting. They are shown in
 * separate, labelled columns because they are different kinds of claim — and
 * they agree only because the model is right, which is worth being able to
 * see rather than being told.
 *
 * ## Why the pair count is a figure
 *
 * It is the actual answer to "why so soon". Twenty-three people is a small
 * room and 253 pairs is a large number of chances, and putting the second
 * beside the first is the whole explanation in two figures.
 */
export function BirthdayStage() {
  const copy = useT().labs.probability;
  const b = copy.birthday;

  const reduced = useReducedMotion() ?? false;
  const [people, setPeople] = useState(5);
  /**
   * Who is new since the last render, so only they animate.
   *
   * Existing people must not re-enter every time the count changes — the
   * arrival is meant to read as one more person walking in, and re-animating
   * the room would say something false about what just happened.
   */
  const previous = useRef(people);
  const [arrivedFrom, setArrivedFrom] = useState(people);
  useEffect(() => {
    setArrivedFrom(people > previous.current ? previous.current : people);
    previous.current = people;
  }, [people]);
  const [guess, setGuess] = useState<string | null>(null);
  const [trial, setTrial] = useState<{ n: number; withMatch: number; rooms: number } | null>(null);

  const threshold = useMemo(() => firstAbove(0.5), []);
  const exact = sharedProbability(people);
  const room = useMemo(() => fillRoom(4242, people), [people]);

  const runRooms = () => {
    const result = simulate(31337, people, ROOMS);
    setTrial({ n: people, withMatch: result.withMatch, rooms: result.rooms });
  };

  const matchSet = new Set(room.match ?? []);
  const arriving = Math.max(0, people - arrivedFrom);
  const stagger = arriving > 0 ? Math.min(STAGGER, ARRIVAL_CAP / arriving) : 0;
  const rows = Math.ceil(Math.max(people, 1) / COLUMNS);

  return (
    <Stage
      width="full"
      caption={b.caption}
      announcement={b.announce(people, percent(exact))}
      viewport={
        <div className="space-y-3">
          <div
            role="img"
            aria-label={
              room.match
                ? b.roomLabelMatch(
                    people,
                    room.match[0] + 1,
                    room.match[1] + 1,
                    dayLabel(room.birthdays[room.match[0]] ?? 0, b.months),
                  )
                : b.roomLabel(people)
            }
            className="rounded border border-line/10 bg-ink-950 p-4"
          >
            {/* Local keyframes, rendered only when motion is allowed: under
                `prefers-reduced-motion` the rule does not exist, so a person
                cannot animate even if the class were applied. */}
            {!reduced && (
              <style>{`
@keyframes prob-arrive {
  from { opacity: 0; transform: scale(0.4); }
  to   { opacity: 1; transform: scale(1); }
}
.prob-arrive { animation: prob-arrive 200ms ease-out both; }`}</style>
            )}
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: rows * COLUMNS }, (_, i) => {
                if (i >= people) return <span key={i} aria-hidden />;
                const isMatch = matchSet.has(i);
                const { col } = seatOf(i);
                const isNew = !reduced && i >= arrivedFrom;
                return (
                  <span
                    key={i}
                    aria-hidden
                    style={{
                      gridColumnStart: col + 1,
                      // Only the new arrivals carry a delay, and only until
                      // their own animation has run once.
                      ...(isNew ? { animationDelay: `${(i - arrivedFrom) * stagger}ms` } : {}),
                    }}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-full border text-[0.5rem]",
                      isMatch
                        ? "border-accent bg-accent/25 font-semibold text-fg"
                        : "border-line/15 bg-ink-900 text-transparent",
                      !reduced && "transition-colors duration-base",
                      isNew && "prob-arrive",
                    )}
                  >
                    {/* A ring and a printed mark, so the pair is not found by
                        colour alone. */}
                    {isMatch ? "●" : "·"}
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-caption text-fg-muted">
              {room.match
                ? b.foundPair(
                    room.match[0] + 1,
                    room.match[1] + 1,
                    dayLabel(room.birthdays[room.match[0]] ?? 0, b.months),
                  )
                : b.noPair(people)}
            </p>
          </div>

          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <table className="w-full border-collapse text-body-sm">
              <caption className="sr-only">{b.tableCaption(people)}</caption>
              <tbody>
                <tr>
                  <td className="py-1.5 text-fg-muted">{b.exactRow}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-accent">
                    {percent(exact)}
                  </td>
                </tr>
                <tr className="border-t border-line/10">
                  <td className="py-1.5 text-fg-muted">{b.simulatedRow(ROOMS)}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-fg">
                    {trial === null
                      ? "—"
                      : trial.n !== people
                        ? b.stale(trial.n)
                        : percent(trial.withMatch / trial.rooms)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">{b.reading(people, pairCount(people))}</p>
        </div>
      }
      primary={
        <div className="space-y-4">
          <Prediction
            question={b.predictQuestion}
            // The correct option is `threshold`, read from the model. The
            // other three are distractors, and are meant to be arbitrary.
            options={[10, threshold, 60, 180]
              .sort((a, z) => a - z)
              .map((n) => ({ value: String(n), label: b.predict.count(n) }))}
            chosen={guess}
            onChoose={(value) => {
              setGuess(value);
              setPeople(threshold);
            }}
            answer={b.predictAnswer(threshold, percent(sharedProbability(threshold)))}
            matched={guess === null ? undefined : Number(guess) === threshold}
            copy={copy.prediction}
          />

          <div className="space-y-2">
            <LabSlider
              label={b.peopleLabel}
              value={people}
              min={1}
              max={MAX_PEOPLE}
              onChange={setPeople}
              format={() => String(people)}
              valueText={() => b.peopleValue(people, percent(exact))}
            />
            <p className="text-caption text-fg-muted">{b.peopleHint}</p>
          </div>
        </div>
      }
      figures={
        <>
          <Figure label={b.peopleFigure} value={String(people)} />
          <Figure label={b.pairsFigure} value={String(pairCount(people))} hint={b.pairsHint} />
          <Figure label={b.chanceFigure} value={percent(exact)} tone="accent" hint={b.exactHint} />
          <Figure label={b.thresholdFigure} value={String(threshold)} hint={b.thresholdHint} />
        </>
      }
      secondaryLabel={b.simulateLabel}
      secondary={
        <div className="space-y-2">
          <button
            type="button"
            onClick={runRooms}
            className={cn(
              "min-h-11 w-full rounded border border-line/20 px-4 text-body-sm text-fg",
              "transition-colors duration-fast hover:border-accent/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            )}
          >
            {b.runRooms(ROOMS)}
          </button>
          <p className="text-caption text-fg-faint">{b.simulateNote(DAYS)}</p>
        </div>
      }
    />
  );
}
