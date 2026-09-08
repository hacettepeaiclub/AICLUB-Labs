import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Stage, Transport } from "@/components/lab";
import { useT } from "@/i18n";
import { buildPreset, SIZE } from "../arrays";
import type { Algorithm } from "../engine";
import { useSortRun } from "../useSortRun";
import { BarCanvas } from "./BarCanvas";
import { SortFigures } from "./SortMetrics";

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
 *
 * ## Why both charts are one viewport
 *
 * `Stage` has a single viewport slot, and this section needs two charts. They
 * go in together, because they are one picture: the comparison is the lesson,
 * and the counters have to sit under their own chart for it to read. Nothing
 * about the chassis had to change to allow that — the slot takes whatever the
 * lab draws.
 *
 * The charts are shorter here than in the single-array sections. Two of them
 * stacked on a phone would otherwise push the Run button off the screen, and a
 * race you cannot start while looking at it is not a race.
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
    // Both panels in one sentence: the comparison is the point, so reading
    // them out separately would bury it.
    describeFinish: (sorts) =>
      [lab.sorterA, lab.sorterB]
        .map((name, i) => {
          const s = sorts[i];
          return s ? `${name}: ${lab.state.done(s.comparisons, s.moves)}` : "";
        })
        .join(" "),
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
    <Stage
      width="full"
      caption={lab.race.caption}
      announcement={run.announcement}
      viewport={
        <div className="grid gap-4 md:grid-cols-2">
          {panels.map((panel) => (
            <div key={panel.key} className="min-w-0 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-body-lg font-semibold text-fg">{panel.title}</h3>
                {/* Not a badge: a word, in the colour that means "settled"
                    everywhere else in this lab. */}
                <span className="text-caption text-accent">
                  {panel.metrics.status === "done" ? lab.race.sorted : " "}
                </span>
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
                heightClass="h-28 sm:h-40"
                label={lab.race.panelLabel(
                  panel.title,
                  SIZE,
                  panel.metrics.status === "done"
                    ? lab.state.done(panel.metrics.comparisons, panel.metrics.moves)
                    : lab.state.running(panel.metrics.comparisons, panel.metrics.moves),
                )}
              />
              <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
                <SortFigures metrics={panel.metrics} compact />
              </div>
            </div>
          ))}
        </div>
      }
      readout={
        <p className="text-caption text-fg-faint">
          {bothDone ? lab.race.bothDone : lab.race.oneButton}
        </p>
      }
      primary={
        <Transport
          running={run.running}
          onRun={run.start}
          onStep={run.stepOnce}
          onReset={handleReset}
          runLabel={lab.sort}
        />
      }
    />
  );
}
