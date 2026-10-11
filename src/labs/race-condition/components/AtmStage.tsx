import { useState } from "react";
import { Figure } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useLabCopy } from "@/i18n/labs";
import { ATM, LOCKED_ATM, enumerate, isFinished } from "../engine";
import { SchedulerStage } from "./SchedulerStage";

type Guard = "none" | "lock";

const COUNTS: Record<Guard, { orders: number; over: number }> = {
  none: count(ATM),
  lock: count(LOCKED_ATM),
};

function count(program: typeof ATM) {
  const outcomes = enumerate(program);
  return {
    orders: outcomes.length,
    over: outcomes.filter((o) => (o.memory.paid ?? 0) > 100).length,
  };
}

/**
 * Section 5: your turn — a race with no `++` in it.
 *
 * Two cash machines share one account with exactly 100 in it, and each wants
 * to pay out 100. Every step here is already indivisible, including the
 * withdrawal itself. The visitor's job is to make the bank pay 200 anyway,
 * which takes one idea from section 1 applied somewhere new: let both
 * machines check before either withdraws. Then the lock, around the check
 * and the withdrawal together, and the same attempt is impossible.
 *
 * The point it earns: atomic steps are not enough when a decision depends on
 * a value that can change before it is acted on. The gap between "check" and
 * "act" is a gap all the same.
 */
export function AtmStage() {
  const t = useLabCopy("race-condition").atm;
  const [guard, setGuard] = useState<Guard>("none");
  const program = guard === "none" ? ATM : LOCKED_ATM;
  const counts = COUNTS[guard];

  return (
    <SchedulerStage
      key={guard}
      program={program}
      hint={t.hint[guard]}
      caption={t.caption}
      verdict={(state) => ((state.memory.paid ?? 0) > 100 ? t.overdrawn : t.safe[guard])}
      secondary={
        <Segmented
          label={t.guardLabel}
          value={guard}
          onChange={setGuard}
          options={[
            { value: "none", label: t.guards.none },
            { value: "lock", label: t.guards.lock },
          ]}
        />
      }
      secondaryLabel={t.secondaryLabel}
      figures={(state) => (
        <>
          <Figure
            label={t.figures.paid}
            value={String(state.memory.paid ?? 0)}
            hint={
              isFinished(program, state) && (state.memory.paid ?? 0) > 100
                ? t.figures.paidOver
                : t.figures.paidHint
            }
            tone="accent"
          />
          <Figure
            label={t.figures.over}
            value={`${counts.over} / ${counts.orders}`}
            hint={t.figures.overHint}
          />
        </>
      )}
    />
  );
}
