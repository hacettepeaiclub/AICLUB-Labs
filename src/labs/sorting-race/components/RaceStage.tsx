import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Badge, Button } from "@/components/ui";
import { useT } from "@/i18n";
import { buildPreset, SIZE } from "../arrays";
import type { Algorithm } from "../engine";
import { useSortRun } from "../useSortRun";
import { BarCanvas } from "./BarCanvas";
import { SortMetrics } from "./SortMetrics";

/** Left panel, right panel. Deliberately not named on screen yet. */
const PAIR: readonly Algorithm[] = ["selection", "insertion"];
const EVENTS_PER_FRAME = 3;

/**
 * Two sorters, one array, one button.
 *
 * The array starts almost in order, which is the shape where the difference is
 * unmistakable: both panels reach the same result, and one of them plainly has
 * far less to do. Neither is named — the behaviour comes first, the names come
 * in the next section.
 *
 * Both panels take the same number of events per frame, so finishing first
 * means having done less work. No clock is involved and none is shown.
 */
export function RaceStage() {
  const t = useT();
  const lab = t.labs["sorting-race"];
  const reduced = useReducedMotion() ?? false;
  const valuesRef = useRef<Int32Array>(buildPreset("almost"));
  const [cursor, setCursor] = useState(-1);
  const [round, setRound] = useState(0);

  const algorithms = useMemo(() => PAIR, []);
  const run = useSortRun({
    valuesRef,
    algorithms,
    reduced,
    eventsPerFrame: EVENTS_PER_FRAME,
  });

  const leftRef = useRef(run.sortsRef.current[0] ?? null);
  leftRef.current = run.sortsRef.current[0] ?? null;
  const rightRef = useRef(run.sortsRef.current[1] ?? null);
  rightRef.current = run.sortsRef.current[1] ?? null;

  const handleReset = useCallback(() => {
    valuesRef.current = buildPreset("almost");
    run.reset();
    run.announce(lab.state.arrayReset);
    setRound((n) => n + 1);
  }, [run, lab]);

  const idle = { status: "idle" as const, comparisons: 0, moves: 0 };
  const left = run.metrics[0] ?? idle;
  const right = run.metrics[1] ?? idle;
  const bothDone = left.status === "done" && right.status === "done";

  const noop = useCallback(() => undefined, []);

  const panels = [
    { key: "left", title: lab.sorterA, sortRef: leftRef, metrics: left, drives: true },
    { key: "right", title: lab.sorterB, sortRef: rightRef, metrics: right, drives: false },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {panels.map((panel) => (
          <div key={panel.key} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-title text-fg">{panel.title}</h3>
              {panel.metrics.status === "done" && (
                <Badge dotClassName="bg-signal-green">sorted</Badge>
              )}
            </div>
            <BarCanvas
              valuesRef={valuesRef}
              sortRef={panel.sortRef}
              running={run.running}
              // Both canvases repaint every frame, but only one of them
              // advances the engines — that is what keeps the two panels in
              // lockstep instead of racing each other's frame rates.
              onFrame={panel.drives ? run.advanceFrame : noop}
              revision={run.revision + round}
              editable={false}
              onEdit={() => undefined}
              cursor={panel.key === "left" ? cursor : -1}
              onCursorChange={setCursor}
              label={
                `${panel.title}: bar chart of ${SIZE} values. ` +
                (panel.metrics.status === "done"
                  ? `Sorted with ${panel.metrics.comparisons} comparisons and ${panel.metrics.moves} moves.`
                  : `${panel.metrics.comparisons} comparisons, ${panel.metrics.moves} moves so far.`)
              }
            />
            <SortMetrics metrics={panel.metrics} compact />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={run.start} className="min-w-24">
          {run.running ? t.common.pause : lab.sort}
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          {t.common.reset}
        </Button>
        <p className="text-body-sm text-fg-muted" aria-live="polite">
          {bothDone ? lab.race.bothDone : lab.race.oneButton}
        </p>
      </div>
    </div>
  );
}
