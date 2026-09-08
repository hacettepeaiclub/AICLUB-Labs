import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Stage, Transport } from "@/components/lab";
import { Kbd, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { buildPreset, PRESETS, SIZE, type PresetId } from "../arrays";
import { inversions, isSorted, type Algorithm } from "../engine";
import { useSortRun } from "../useSortRun";
import { BarCanvas } from "./BarCanvas";
import { SortFigures, useAlgorithmLabel } from "./SortMetrics";

export interface SortStageProps {
  preset: PresetId;
  /** One entry means no picker — the algorithm is simply the one on show. */
  algorithms: readonly Algorithm[];
  showPresets?: boolean;
  /** Disorder is only named once the lab has a reason for it. */
  showInversions?: boolean;
  emphasis?: "comparisons" | "moves";
  caption?: string;
}

/** Events per frame. Slow enough to read the rhythm, quick enough to sit through. */
const EVENTS_PER_FRAME = 3;

/**
 * One array, one algorithm, and the numbers the run produced.
 *
 * The values live in a ref and are written in place — drawing never re-renders
 * React, and the canvas is the only thing that reads them every frame.
 *
 * ## What the chassis changed
 *
 * The chart, the draw hint, the caption, a paragraph of keyboard help and the
 * controls used to be five separate blocks; below `lg` they queued up, so on a
 * phone the Sort button sat under all of them. It is now one `Stage`: chart,
 * then Run, then the counters, then the shape picker and the keys behind a
 * disclosure.
 *
 * The draw hint stays *above* the chart rather than moving into the readout
 * strip. There is no cursor on a phone to hint that the chart can be drawn on,
 * and a hint underneath is read after the visitor has already decided the
 * chart is a picture. The viewport slot takes whatever the lab puts in it, so
 * keeping it there cost nothing.
 */
export function SortStage({
  preset,
  algorithms,
  showPresets = false,
  showInversions = false,
  emphasis,
  caption,
}: SortStageProps) {
  const t = useT();
  const lab = t.labs["sorting-race"];
  const names = useAlgorithmLabel();
  const reduced = useReducedMotion() ?? false;

  const valuesRef = useRef<Int32Array>(buildPreset(preset));
  const [algorithm, setAlgorithm] = useState<Algorithm>(algorithms[0] ?? "insertion");
  const [current, setCurrent] = useState<PresetId>(preset);
  const [cursor, setCursor] = useState(-1);
  const [edits, setEdits] = useState(0);

  const list = useMemo(() => [algorithm], [algorithm]);
  const run = useSortRun({
    valuesRef,
    algorithms: list,
    reduced,
    eventsPerFrame: EVENTS_PER_FRAME,
    describeFinish: (sorts) => {
      const s = sorts[0];
      return s ? lab.state.done(s.comparisons, s.moves) : "";
    },
  });

  const sortRef = useRef(run.sortsRef.current[0] ?? null);
  sortRef.current = run.sortsRef.current[0] ?? null;
  const editable = !run.running;
  const metrics = run.metrics[0] ?? { status: "idle" as const, comparisons: 0, moves: 0 };

  const handleEdit = useCallback(() => {
    run.reset();
    setEdits((n) => n + 1);
  }, [run]);

  const loadPreset = useCallback(
    (id: PresetId) => {
      valuesRef.current = buildPreset(id);
      setCurrent(id);
      run.reset();
      run.announce(lab.state.loaded(lab.shapes[id]));
      setEdits((n) => n + 1);
    },
    [run, lab],
  );

  const handleReset = useCallback(() => {
    valuesRef.current = buildPreset(current);
    run.reset();
    run.announce(lab.state.arrayReset);
    setEdits((n) => n + 1);
  }, [current, run, lab]);

  const handleAlgorithm = useCallback(
    (next: Algorithm) => {
      setAlgorithm(next);
      run.reset();
      run.announce(lab.state.selected(names[next]));
    },
    [run, lab, names],
  );

  // Recomputed each render rather than memoised: the values live in a ref, so
  // there is no dependency a memo could key on, and 32 bars cost nothing.
  const disorder = inversions(valuesRef.current);
  const state =
    (cursor >= 0 ? `${lab.state.cursor(cursor + 1, valuesRef.current[cursor] ?? 0)} ` : "") +
    (metrics.status === "done"
      ? lab.state.done(metrics.comparisons, metrics.moves)
      : metrics.status === "running"
        ? lab.state.running(metrics.comparisons, metrics.moves)
        : isSorted(valuesRef.current)
          ? lab.state.alreadySorted
          : lab.state.notStarted);
  const summary = lab.chartLabel(SIZE, names[algorithm], disorder, state);

  const helpId = `${preset}-bars-help`;

  return (
    <Stage
      width="full"
      secondaryLabel={lab.shapeAndKeys}
      caption={caption}
      announcement={run.announcement}
      viewport={
        <>
          {editable && <p className="text-caption text-fg-muted">{lab.drawHint}</p>}
          <BarCanvas
            valuesRef={valuesRef}
            sortRef={sortRef}
            running={run.running}
            onFrame={run.advanceFrame}
            revision={run.revision + edits}
            editable={editable}
            onEdit={handleEdit}
            cursor={cursor}
            onCursorChange={setCursor}
            label={summary}
            describedBy={helpId}
          />
          {/* Always in the DOM, never on screen: the description the chart
              points at must not depend on a disclosure being open. */}
          <p id={helpId} className="sr-only">
            {lab.keyboardHelp}
          </p>
        </>
      }
      readout={
        <p className="text-caption text-fg-faint">
          <span className="mr-1.5 inline-block h-2.5 w-2 rounded-[1px] bg-accent/55 align-middle" />
          {lab.legend.settled}
          <span className="ml-4 mr-1.5 inline-block h-2.5 w-2 rounded-[1px] bg-data align-middle" />
          {lab.legend.comparing}
          <span className="ml-4 mr-1.5 inline-block h-2.5 w-2 rounded-[1px] border border-fg-faint/50 align-middle" />
          {lab.legend.lifted}
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
      figures={
        <SortFigures
          metrics={metrics}
          emphasis={emphasis}
          inversions={showInversions ? disorder : undefined}
        />
      }
      secondary={
        <>
          {algorithms.length > 1 && (
            <Segmented
              label={lab.algorithm}
              value={algorithm}
              options={algorithms.map((a) => ({ value: a, label: names[a] }))}
              onChange={handleAlgorithm}
            />
          )}

          {showPresets && (
            <Segmented
              label={lab.shape}
              value={current}
              options={PRESETS.map((preset) => ({ value: preset.id, label: lab.shapes[preset.id] }))}
              onChange={loadPreset}
            />
          )}

          <p className="text-caption text-fg-faint">
            {t.common.keyboardHint} <Kbd>←</Kbd> <Kbd>→</Kbd> {lab.keyboardHint} <Kbd>↑</Kbd>{" "}
            <Kbd>↓</Kbd> {lab.keyboardHint2}
          </p>
        </>
      }
    />
  );
}
