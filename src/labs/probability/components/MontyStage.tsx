import { useCallback, useRef, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { createRng } from "@/lib/random";
import {
  DOORS,
  EMPTY_TALLY,
  THEORETICAL,
  add,
  rateOf,
  resolve,
  simulate,
  type Door,
  type Round,
  type Strategy,
  type Tally,
} from "../engine/montyHall";
import { percent } from "../view";
import { Coach } from "./Framing";
import { Prediction } from "./Prediction";

const BATCH = 1000;

type Phase = "picking" | "opened" | "done";

/**
 * Section 1 — three doors, played by hand and then a thousand times.
 *
 * The hand-played rounds come first because the argument is not persuasive
 * until you have felt the host's constraint from the inside: you pick, a goat
 * appears, and the decision is now yours with information you did not have a
 * moment ago. The batch afterwards is what settles it, and it is kept visually
 * apart from the exact answer — a simulation illustrates a theorem, it does
 * not establish one.
 *
 * Every round comes from `playRound`, which enforces the host's rules. Nothing
 * in this component decides where the car is or which door opens.
 */
export function MontyStage() {
  const copy = useT().labs.probability;
  const m = copy.monty;

  const rngRef = useRef(createRng(20260910));
  const [round, setRound] = useState<Round | null>(null);
  const [phase, setPhase] = useState<Phase>("picking");
  const [outcome, setOutcome] = useState<{ strategy: Strategy; won: boolean } | null>(null);
  const [played, setPlayed] = useState<Tally>(EMPTY_TALLY);
  const [batch, setBatch] = useState<Tally | null>(null);
  const [guess, setGuess] = useState<"stay" | "switch" | "same" | null>(null);

  const pick = useCallback(
    (door: Door) => {
      if (phase !== "picking") return;
      // The round is drawn now: the car placement and the host's reveal are
      // decided by the engine from this pick, not by anything on screen.
      const rng = rngRef.current;
      const car = Math.floor(rng() * 3) as Door;
      // `resolve` owns the host's rules. This component draws a car and hands
      // over the pick; it does not decide which door opens.
      setRound(resolve(car, door, rng()));
      setPhase("opened");
      setOutcome(null);
    },
    [phase],
  );

  const decide = (strategy: Strategy) => {
    if (!round || phase !== "opened") return;
    const won = strategy === "stay" ? round.stayWins : round.switchWins;
    setOutcome({ strategy, won });
    setPlayed((tally) => add(tally, round));
    setPhase("done");
  };

  const again = () => {
    setRound(null);
    setOutcome(null);
    setPhase("picking");
  };

  const runBatch = () => setBatch(simulate(97531, BATCH));

  const stayRate = batch ? rateOf(batch.stayWins, batch.rounds) : null;
  const switchRate = batch ? rateOf(batch.switchWins, batch.rounds) : null;

  const doorState = (door: Door): "closed" | "picked" | "opened" | "revealed" => {
    if (!round) return "closed";
    if (round.opened === door) return "opened";
    if (phase === "done" && round.car === door) return "revealed";
    if (round.picked === door) return "picked";
    return "closed";
  };

  // The coach's numbers are the engine's, not a second opinion about them:
  // both of these are the same constants the table prints.
  const coach = [
    { q: m.coach.notHalf.q, a: m.coach.notHalf.a },
    {
      q: m.coach.whySwitch.q,
      a: m.coach.whySwitch.a(percent(THEORETICAL.stay), percent(THEORETICAL.switch)),
    },
    { q: m.coach.hostKnows.q, a: m.coach.hostKnows.a },
  ];

  return (
    <>
      <Stage
        width="full"
        caption={m.caption}
        announcement={
          phase === "opened" && round
            ? m.announceOpened(round.opened + 1)
            : outcome
              ? m.announceResult(outcome.won ? m.won : m.lost)
              : ""
        }
        viewport={
          <div className="space-y-3">
            <div
              role="img"
              aria-label={round ? m.doorsLabel(round.picked + 1, round.opened + 1) : m.doorsIdle}
              className="rounded border border-line/10 bg-ink-950 p-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {DOORS.map((door) => {
                  const state = doorState(door);
                  const open = state === "opened" || state === "revealed";
                  return (
                    <button
                      key={door}
                      type="button"
                      disabled={phase !== "picking"}
                      onClick={() => pick(door)}
                      aria-label={m.doorLabel(door + 1, m.doorState[state])}
                      className={cn(
                        "relative flex aspect-[3/4] min-h-11 flex-col items-center justify-center rounded",
                        "border-2 transition-colors duration-fast",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        "focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
                        state === "picked" && "border-accent bg-accent/10",
                        state === "closed" && "border-line/20 bg-ink-900",
                        open && "border-line/15 bg-ink-800",
                        phase === "picking" && "hover:border-accent/50",
                        phase !== "picking" && "cursor-default",
                      )}
                    >
                      {/* The number is the identity; the glyph and the word carry
                        the state. Nothing here is colour alone. */}
                      <span aria-hidden className="font-mono text-body-lg text-fg-muted">
                        {door + 1}
                      </span>
                      {open && (
                        <span aria-hidden className="mt-1 font-mono text-caption text-fg">
                          {state === "revealed" ? m.car : m.goat}
                        </span>
                      )}
                      {state === "picked" && (
                        <span
                          aria-hidden
                          className="absolute inset-x-2 top-1 h-0.5 rounded-pill bg-accent"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The batch, kept apart from the exact answer. */}
            <div className="rounded border border-line/10 bg-ink-950 p-4">
              <p className="text-overline uppercase text-fg-faint">{m.batchTitle}</p>
              {batch === null ? (
                <p className="mt-2 text-body-sm text-fg-muted">{m.batchIdle(BATCH)}</p>
              ) : (
                <table className="mt-3 w-full border-collapse text-body-sm">
                  <caption className="sr-only">{m.batchCaption(batch.rounds)}</caption>
                  <thead>
                    <tr className="text-overline uppercase text-fg-faint">
                      <th scope="col" className="py-1.5 text-left font-normal">
                        {m.strategyHeader}
                      </th>
                      <th scope="col" className="py-1.5 text-right font-normal">
                        {m.simulatedHeader(batch.rounds)}
                      </th>
                      <th scope="col" className="py-1.5 text-right font-normal">
                        {m.exactHeader}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["stay", stayRate, THEORETICAL.stay, batch.stayWins],
                        ["switch", switchRate, THEORETICAL.switch, batch.switchWins],
                      ] as const
                    ).map(([strategy, observed, exact, wins]) => (
                      <tr key={strategy} className="border-t border-line/10">
                        <td className="py-2 text-fg">{m.strategy[strategy]}</td>
                        <td className="py-2 text-right font-mono tabular-nums text-fg">
                          {percent(observed ?? 0)}
                          <span className="ml-2 text-caption text-fg-faint">
                            {m.wins(wins, batch.rounds)}
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono tabular-nums text-fg-muted">
                          {percent(exact)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        }
        readout={
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-body-sm text-fg-muted">
              {phase === "picking"
                ? m.promptPick
                : phase === "opened" && round
                  ? m.promptDecide(round.opened + 1, round.other + 1)
                  : outcome
                    ? m.resultLine(m.strategy[outcome.strategy], outcome.won ? m.won : m.lost)
                    : ""}
            </p>
          </div>
        }
        primary={
          <div className="space-y-4">
            {/* The strategy question used to be the first thing on the stage,
              asked before the visitor had seen a door open. That is a
              statistics exercise; playing a round first makes it a question
              about something that just happened to them. */}
            {played.rounds > 0 && (
              <Prediction
                question={m.predictQuestion}
                options={[
                  { value: "stay" as const, label: m.predict.stay },
                  { value: "switch" as const, label: m.predict.switch },
                  { value: "same" as const, label: m.predict.same },
                ]}
                chosen={guess}
                onChoose={setGuess}
                answer={m.predictAnswer(percent(THEORETICAL.switch))}
                matched={guess === null ? undefined : guess === "switch"}
                copy={copy.prediction}
              />
            )}

            {phase === "opened" && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => decide("stay")} className="min-h-11">
                  {m.strategy.stay}
                </Button>
                <Button variant="secondary" onClick={() => decide("switch")} className="min-h-11">
                  {m.strategy.switch}
                </Button>
              </div>
            )}
            {phase === "done" && (
              <Button
                variant="secondary"
                onClick={again}
                className="min-h-11 w-full justify-center"
              >
                {m.again}
              </Button>
            )}

            {/* "Now test it at scale", not "click this before playing". Before
                the first round this was the only control in the rail and so the
                most prominent thing on the stage — a thousand simulated rounds
                offered to somebody who had not yet opened a door. It arrives
                once there is something to test. */}
            {played.rounds > 0 && (
              <Button variant="ghost" onClick={runBatch} className="min-h-11 w-full justify-center">
                {m.runBatch(BATCH)}
              </Button>
            )}
          </div>
        }
        figures={
          <>
            <Figure label={m.playedLabel} value={String(played.rounds)} />
            <Figure
              label={m.yourStayLabel}
              value={
                played.rounds === 0 ? "—" : percent(rateOf(played.stayWins, played.rounds) ?? 0)
              }
              hint={m.handHint}
            />
            <Figure
              label={m.yourSwitchLabel}
              value={
                played.rounds === 0 ? "—" : percent(rateOf(played.switchWins, played.rounds) ?? 0)
              }
              tone="accent"
              hint={m.handHint}
            />
          </>
        }
      />
      <Coach label={m.coachLabel} questions={coach} />
    </>
  );
}
