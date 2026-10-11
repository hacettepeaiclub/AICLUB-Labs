import { Figure } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { COUNTER, isFinished } from "../engine";
import { SchedulerStage } from "./SchedulerStage";

/**
 * Section 1: you are the scheduler.
 *
 * Two threads, each about to run `counter++` once, from 0. Everyone expects
 * 2. The visitor runs one step at a time, either thread, and the challenge is
 * to make it end at 1 — to lose an update with their own hand. It takes six
 * presses, and the trick (both loads before either store) is found by
 * trying, which is the lesson: nothing in the code is wrong, only the order.
 */
export function GameStage() {
  const t = useLabCopy("race-condition").game;
  return (
    <SchedulerStage
      program={COUNTER}
      hint={t.hint}
      caption={t.caption}
      verdict={(state) => (state.memory.counter === 1 ? t.lost : t.kept)}
      figures={(state) => {
        const counter = state.memory.counter ?? 0;
        const over = isFinished(COUNTER, state);
        return (
          <>
            <Figure
              label={t.figures.counter}
              value={String(counter)}
              hint={
                over
                  ? counter === 1
                    ? t.figures.lostHint
                    : t.figures.keptHint
                  : t.figures.counterHint
              }
              tone="accent"
            />
            <Figure label={t.figures.expected} value="2" hint={t.figures.expectedHint} />
          </>
        );
      }}
    />
  );
}
