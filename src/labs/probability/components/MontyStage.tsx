import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
import { Prediction } from "./Prediction";

const BATCH = 1000;

/**
 * How long each beat lasts, in milliseconds. All of them are skipped when
 * motion is off.
 *
 * The host's pause is the shortest thing that reads as a separate event rather
 * than as suspense: it exists so that "you chose" and "the host chose" are two
 * moments instead of one, not to make anybody wait.
 */
const BEAT = { hostThinks: 260, doorSwing: 250, finalSwing: 250 } as const;

/**
 * The presentation phases.
 *
 * These say what is on screen, never what is true. The round — the car, the
 * host's door, which strategy wins — is settled by the engine the instant a
 * door is picked, and every phase below is a stage in revealing that already
 * decided result. Nothing here can change an outcome, which is the property
 * that keeps the animation honest.
 */
type Phase = "idle" | "selected" | "hostRevealing" | "hostRevealed" | "finalRevealing" | "result";

/** Whether the host's door is drawn open in a given phase. */
const hostOpen = (phase: Phase): boolean =>
  phase === "hostRevealing" ||
  phase === "hostRevealed" ||
  phase === "finalRevealing" ||
  phase === "result";

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
 * ## Why the door opens rather than simply being open
 *
 * The whole point of this problem is that the host's action carries
 * information, and information arriving is an event. A door that is closed in
 * one frame and open in the next states a fact; a door that swings open shows
 * something happening, and that difference is exactly the dependency the
 * visitor has to notice — your choice, then the host's, then yours again.
 *
 * So Stay and Switch are inert until the reveal has landed. Not for suspense:
 * choosing before the reveal would be a different problem with a different
 * answer, and the interface should not offer to play it.
 *
 * The swing is a 2-D hinge — a panel scaled to nothing from its left edge —
 * rather than any kind of perspective transform. One CSS property, and it
 * reads as a door at every size.
 */
export function MontyStage() {
  const copy = useT().labs.probability;
  const m = copy.monty;
  const reduced = useReducedMotion() ?? false;

  const rngRef = useRef(createRng(20260910));
  const [round, setRound] = useState<Round | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [outcome, setOutcome] = useState<{ strategy: Strategy; won: boolean } | null>(null);
  const [played, setPlayed] = useState<Tally>(EMPTY_TALLY);
  const [batch, setBatch] = useState<Tally | null>(null);
  const [guess, setGuess] = useState<"stay" | "switch" | "same" | null>(null);

  /** Pending phase advances, cleared on reset and on unmount. */
  const timers = useRef<number[]>([]);
  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  /** Advance after a beat, or straight away when motion is off. */
  const later = useCallback(
    (ms: number, run: () => void) => {
      if (reduced) {
        run();
        return;
      }
      timers.current.push(window.setTimeout(run, ms));
    },
    [reduced],
  );

  const pick = useCallback(
    (door: Door) => {
      if (phase !== "idle") return;
      // The round is settled here, before any of it is drawn. The car
      // placement and the host's reveal come from the engine; the phases
      // below only decide when the visitor sees them.
      const rng = rngRef.current;
      const car = Math.floor(rng() * 3) as Door;
      setRound(resolve(car, door, rng()));
      setOutcome(null);
      setPhase("selected");
      later(BEAT.hostThinks, () => {
        setPhase("hostRevealing");
        later(BEAT.doorSwing, () => setPhase("hostRevealed"));
      });
    },
    [phase, later],
  );

  const decide = (strategy: Strategy) => {
    // Only once the reveal has landed: choosing earlier would be a different
    // problem, with a different answer.
    if (!round || phase !== "hostRevealed") return;
    const won = strategy === "stay" ? round.stayWins : round.switchWins;
    setOutcome({ strategy, won });
    setPlayed((tally) => add(tally, round));
    setPhase("finalRevealing");
    later(BEAT.finalSwing, () => setPhase("result"));
  };

  const again = () => {
    clearTimers();
    setRound(null);
    setOutcome(null);
    setPhase("idle");
  };

  const runBatch = () => setBatch(simulate(97531, BATCH));

  const stayRate = batch ? rateOf(batch.stayWins, batch.rounds) : null;
  const switchRate = batch ? rateOf(batch.switchWins, batch.rounds) : null;

  /** The door the final reveal opens: whichever one the visitor ended on. */
  const landedOn =
    round && outcome ? (outcome.strategy === "stay" ? round.picked : round.other) : null;
  const finalOpen = phase === "finalRevealing" || phase === "result";

  const doorState = (door: Door): "closed" | "picked" | "opened" | "revealed" => {
    if (!round) return "closed";
    if (round.opened === door && hostOpen(phase)) return "opened";
    if (landedOn === door && finalOpen) return "revealed";
    if (round.picked === door) return "picked";
    return "closed";
  };

  /** Whether a door's panel is drawn swung away. */
  const isOpen = (door: Door): boolean => {
    const state = doorState(door);
    return state === "opened" || state === "revealed";
  };

  /** What is behind a door, once it is open. */
  const behind = (door: Door): string => (round && round.car === door ? m.car : m.goat);

  const announcement = (() => {
    if (phase === "hostRevealed" && round) return m.announceRevealed(round.opened + 1);
    if (phase === "result" && outcome) {
      return m.announceFinal(
        m.strategy[outcome.strategy],
        landedOn === null ? "" : String(landedOn + 1),
        outcome.won ? m.won : m.lost,
      );
    }
    return "";
  })();

  const canDecide = phase === "hostRevealed";

  return (
    <Stage
      width="full"
      caption={m.caption}
      announcement={announcement}
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
                const open = isOpen(door);
                return (
                  <button
                    key={door}
                    type="button"
                    // Not `disabled`: a focused element that becomes disabled
                    // drops focus to <body>, so pressing Enter on a door threw
                    // a keyboard user to the top of the page at the exact
                    // moment the reveal started. `aria-disabled` says the same
                    // thing to assistive technology, `pick` refuses the click,
                    // and focus stays where the visitor put it.
                    aria-disabled={phase !== "idle"}
                    onClick={() => pick(door)}
                    aria-label={m.doorLabel(door + 1, m.doorState[state])}
                    className={cn(
                      "relative flex aspect-[3/4] min-h-11 items-center justify-center",
                      "overflow-hidden rounded border-2",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      "focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
                      state === "picked" && "border-accent",
                      state === "closed" && "border-line/20",
                      open && "border-line/15",
                      phase === "idle" && "hover:border-accent/50",
                      phase !== "idle" && "cursor-default",
                    )}
                  >
                    {/* What the door is hiding. Always in the DOM, covered by
                        the panel until it swings away. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center bg-ink-800"
                    >
                      <span className="font-mono text-caption text-fg">{behind(door)}</span>
                    </span>

                    {/* The panel. A 2-D hinge: scaled to nothing from its left
                        edge, which reads as a door swinging away with no
                        perspective transform anywhere. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        "origin-left border-r border-line/20",
                        state === "picked" ? "bg-accent/10" : "bg-ink-900",
                        !reduced && "transition-transform duration-base ease-out",
                        open && "scale-x-0",
                      )}
                    >
                      <span className="font-mono text-body-lg text-fg-muted">{door + 1}</span>
                    </span>

                    {/* The caret marks your pick and outlives the panel: it is
                        drawn over both layers. */}
                    {round?.picked === door && (
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
            {phase === "idle"
              ? m.promptPick
              : phase === "selected"
                ? m.hostThinking
                : phase === "hostRevealing"
                  ? m.hostOpening
                  : phase === "hostRevealed" && round
                    ? m.promptDecide(round.opened + 1, round.other + 1)
                    : phase === "finalRevealing"
                      ? m.opening
                      : outcome
                        ? m.resultLine(m.strategy[outcome.strategy], outcome.won ? m.won : m.lost)
                        : ""}
          </p>
        </div>
      }
      primary={
        <div className="space-y-4">
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

          {/* Present from the moment a door is picked, so the controls do not
              appear under the pointer mid-reveal and move the layout. They are
              simply inert until the host has finished. */}
          {phase !== "idle" && phase !== "result" && (
            <div className="flex flex-wrap gap-2">
              {/* The visible words are short so they read at a glance, but the
                  accessible names say which door each one means — the
                  prediction above offers options called "Stay" and "Switch"
                  too, and two buttons with one name in a single stage is a
                  question nobody should have to answer by context. */}
              <Button
                onClick={() => decide("stay")}
                disabled={!canDecide}
                aria-label={round ? m.stayWith(round.picked + 1) : m.strategy.stay}
                className="min-h-11"
              >
                {m.strategy.stay}
              </Button>
              <Button
                variant="secondary"
                onClick={() => decide("switch")}
                disabled={!canDecide}
                aria-label={round ? m.switchTo(round.other + 1) : m.strategy.switch}
                className="min-h-11"
              >
                {m.strategy.switch}
              </Button>
            </div>
          )}
          {phase === "result" && (
            <Button variant="secondary" onClick={again} className="min-h-11 w-full justify-center">
              {m.again}
            </Button>
          )}

          <Button variant="ghost" onClick={runBatch} className="min-h-11 w-full justify-center">
            {m.runBatch(BATCH)}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure label={m.playedLabel} value={String(played.rounds)} />
          <Figure
            label={m.yourStayLabel}
            value={played.rounds === 0 ? "—" : percent(rateOf(played.stayWins, played.rounds) ?? 0)}
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
  );
}
