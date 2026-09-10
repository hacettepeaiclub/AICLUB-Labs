import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
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
import { Coach } from "./Framing";
import { Prediction } from "./Prediction";

const MAX_PEOPLE = 60;
const ROOMS = 2000;

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

  const [people, setPeople] = useState(5);
  const [guess, setGuess] = useState<string | null>(null);
  const [trial, setTrial] = useState<{ n: number; withMatch: number; rooms: number } | null>(null);

  const threshold = useMemo(() => firstAbove(0.5), []);
  const exact = sharedProbability(people);
  const room = useMemo(() => fillRoom(4242, people), [people]);

  const runRooms = () => {
    const result = simulate(31337, people, ROOMS);
    setTrial({ n: people, withMatch: result.withMatch, rooms: result.rooms });
  };

  // The guess is "where does this first pass 50%?", so the one number that
  // answers it waits for the guess. Everything else on screen describes the
  // room you are building, which is the question rather than the answer.
  const answered = guess !== null;

  const matchSet = new Set(room.match ?? []);
  const rows = Math.ceil(Math.max(people, 1) / COLUMNS);

  // Both numbers are this room's own: the head count on screen and the pair
  // count the engine derives from it.
  const coach = [
    {
      q: b.coach.soonWhy.q(threshold),
      a: b.coach.soonWhy.a(threshold, String(pairCount(threshold))),
    },
    { q: b.coach.notMine.q, a: b.coach.notMine.a },
    { q: b.coach.realBirthdays.q, a: b.coach.realBirthdays.a },
  ];

  return (
    <>
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
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: rows * COLUMNS }, (_, i) => {
                  if (i >= people) return <span key={i} aria-hidden />;
                  const isMatch = matchSet.has(i);
                  const { col } = seatOf(i);
                  return (
                    <span
                      key={i}
                      aria-hidden
                      style={{ gridColumnStart: col + 1 }}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-full border text-[0.5rem]",
                        isMatch
                          ? "border-accent bg-accent/25 font-semibold text-fg"
                          : "border-line/15 bg-ink-900 text-transparent",
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

            {/* One person at a time is the lesson: each new arrival brings a new
              pair with everybody already seated, and the pair count visibly
              outruns the head count. The slider stays for jumping around. */}
            <div className="space-y-2">
              <Button
                onClick={() => setPeople((n) => Math.min(n + 1, MAX_PEOPLE))}
                disabled={people >= MAX_PEOPLE}
                className="w-full justify-center"
              >
                {b.addPerson}
              </Button>
              <p className="text-caption text-fg-muted">
                {people >= MAX_PEOPLE ? b.roomFull : b.addPersonHint}
              </p>
            </div>

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
            <Figure
              label={b.chanceFigure}
              value={percent(exact)}
              tone="accent"
              hint={b.exactHint}
            />
            {answered && (
              <Figure label={b.thresholdFigure} value={String(threshold)} hint={b.thresholdHint} />
            )}
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
      <Coach label={b.coachLabel} questions={coach} />
    </>
  );
}
