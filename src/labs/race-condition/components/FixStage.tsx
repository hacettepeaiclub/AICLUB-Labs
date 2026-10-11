import { useState } from "react";
import { Figure } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useLabCopy } from "@/i18n/labs";
import {
  ATOMIC_COUNTER,
  COUNTER,
  LOCKED_COUNTER,
  enumerate,
  isFinished,
  type Program,
} from "../engine";
import { SchedulerStage } from "./SchedulerStage";

type Fix = "none" | "lock" | "atomic";

const PROGRAMS: Record<Fix, Program> = {
  none: COUNTER,
  lock: LOCKED_COUNTER,
  atomic: ATOMIC_COUNTER,
};

/** For each version: every order the scheduler has, and how many lose. */
const COUNTS = Object.fromEntries(
  (Object.keys(PROGRAMS) as Fix[]).map((fix) => {
    const outcomes = enumerate(PROGRAMS[fix]);
    return [
      fix,
      { orders: outcomes.length, lost: outcomes.filter((o) => o.memory.counter !== 2).length },
    ];
  }),
) as Record<Fix, { orders: number; lost: number }>;

/**
 * Section 4: two ways to close the gap.
 *
 * The same game, the same goal — make it end at 1 — with the increment
 * protected. Under a lock, the second thread's first step is to wait, and its
 * button says so: the scheduler can still choose who goes first, but never
 * between a load and its store. An atomic add has no between: it is one step.
 * The figures count every order each version allows, from `enumerate`, so the
 * claim "none of them lose" is checked rather than asserted.
 */
export function FixStage() {
  const t = useLabCopy("race-condition").fix;
  const [fix, setFix] = useState<Fix>("lock");
  const program = PROGRAMS[fix];
  const counts = COUNTS[fix];

  return (
    <SchedulerStage
      key={fix}
      program={program}
      hint={t.hint[fix]}
      caption={t.caption}
      verdict={(state) => (state.memory.counter === 2 ? t.kept[fix] : t.lost)}
      secondary={
        <Segmented
          label={t.fixLabel}
          value={fix}
          onChange={setFix}
          options={[
            { value: "none", label: t.fixes.none },
            { value: "lock", label: t.fixes.lock },
            { value: "atomic", label: t.fixes.atomic },
          ]}
        />
      }
      secondaryLabel={t.secondaryLabel}
      figures={(state) => (
        <>
          <Figure
            label={t.figures.counter}
            value={String(state.memory.counter ?? 0)}
            hint={isFinished(program, state) ? t.figures.finalHint : t.figures.counterHint}
          />
          <Figure
            label={t.figures.lost}
            value={`${counts.lost} / ${counts.orders}`}
            hint={t.figures.lostHint}
            tone="accent"
          />
          <Figure
            label={t.figures.steps}
            value={String(program.lines.length)}
            hint={t.figures.stepsHint}
          />
        </>
      )}
    />
  );
}
