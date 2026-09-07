import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Stage, Transport } from "@/components/lab";
import { Badge, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { useLocalControls } from "@/hooks";
import { spring } from "@/design/motion";
import { cn } from "@/lib/cn";
import { editCount } from "../arrayEdit";
import { inversions, type Algorithm } from "../engine";
import { beatenCount, CHALLENGES, judge, type ChallengeProgress } from "../challenge";
import { useSortRun } from "../useSortRun";
import { BarCanvas } from "./BarCanvas";
import { SortFigures, useAlgorithmLabel } from "./SortMetrics";

const ALGORITHMS: readonly Algorithm[] = ["selection", "insertion"];
const IDS = CHALLENGES.map((c) => c.id);
const EVENTS_PER_FRAME = 4;

/**
 * Three fixed arrays, three different questions.
 *
 * The first rewards noticing that the data is nearly in order. The second
 * punishes assuming that the adaptive algorithm is simply the better one. The
 * third takes the algorithm away and asks which single change to the data buys
 * the most. Failure always says which number missed and by how much.
 */
export function SortChallenge() {
  const t = useT();
  const lab = t.labs["sorting-race"];
  const c = lab.challenge;
  const names = useAlgorithmLabel();
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const spec = CHALLENGES[index] ?? CHALLENGES[0]!;

  const valuesRef = useRef<Int32Array>(Int32Array.from(spec.values));
  const [algorithm, setAlgorithm] = useState<Algorithm>(spec.algorithm ?? "selection");
  const [cursor, setCursor] = useState(-1);
  const [edits, setEdits] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const [progress, saveProgress] = useLocalControls<ChallengeProgress>(
    "acl:sorting-race:challenge",
    {},
  );

  const list = spec.algorithm ? [spec.algorithm] : [algorithm];
  const run = useSortRun({
    valuesRef,
    algorithms: list,
    reduced,
    eventsPerFrame: EVENTS_PER_FRAME,
    describeFinish: (sorts) => {
      const s = sorts[0];
      return s ? c.finished(s.comparisons, s.moves) : "";
    },
  });

  const sortRef = useRef(run.sortsRef.current[0] ?? null);
  sortRef.current = run.sortsRef.current[0] ?? null;
  const metrics = run.metrics[0] ?? { status: "idle" as const, comparisons: 0, moves: 0 };
  const result = run.results[0] ?? null;

  const changed = editCount(valuesRef.current, spec.values);
  const verdict = result && !run.running ? judge(spec, result, changed) : null;

  const selectChallenge = useCallback(
    (id: string) => {
      const next = CHALLENGES.findIndex((c) => c.id === id);
      const chosen = CHALLENGES[next];
      if (!chosen) return;
      setIndex(next);
      valuesRef.current = Int32Array.from(chosen.values);
      if (chosen.algorithm) setAlgorithm(chosen.algorithm);
      run.reset();
      run.announce(lab.state.loaded(c.puzzles[chosen.id].title));
      setEdits((n) => n + 1);
      setAttempt((n) => n + 1);
    },
    [run, lab, c],
  );

  const selectAlgorithm = useCallback(
    (next: Algorithm) => {
      setAlgorithm(next);
      run.reset();
      run.announce(lab.state.selected(names[next]));
    },
    [run, lab, names],
  );

  const handleReset = useCallback(() => {
    valuesRef.current = Int32Array.from(spec.values);
    run.reset();
    run.announce("Array reset.");
    setEdits((n) => n + 1);
  }, [spec, run]);

  const handleEdit = useCallback(() => {
    run.reset();
    setEdits((n) => n + 1);
  }, [run]);

  // Record a win once, in an effect rather than during render.
  const wonId = verdict?.kind === "passed" ? spec.id : null;
  const alreadyWon = wonId !== null && progress[wonId] === true;
  useEffect(() => {
    if (wonId === null || alreadyWon) return;
    saveProgress({ [wonId]: true });
  }, [wonId, alreadyWon, saveProgress]);

  const beaten = beatenCount(progress, IDS);
  const editable = !run.running && spec.maxEdits !== undefined;
  const helpId = `${spec.id}-bars-help`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented
          label={lab.puzzle}
          value={spec.id}
          options={CHALLENGES.map((spec) => ({ value: spec.id, label: c.puzzles[spec.id].title }))}
          onChange={selectChallenge}
        />
        <Badge dotClassName={beaten === IDS.length ? "bg-signal-green" : "bg-fg-faint"}>
          {c.beaten(beaten, IDS.length)}
        </Badge>
      </div>

      <Stage
        width="full"
        secondaryLabel={lab.algorithm}
        caption={c.puzzles[spec.id].brief}
        announcement={run.announcement}
        viewport={
          <>
            {editable && <p className="text-caption text-fg-muted">{lab.drawHint}</p>}
            <BarCanvas
              valuesRef={valuesRef}
              sortRef={sortRef}
              running={run.running}
              onFrame={run.advanceFrame}
              revision={run.revision + edits + attempt}
              editable={editable}
              onEdit={handleEdit}
              cursor={cursor}
              onCursorChange={setCursor}
              describedBy={helpId}
              label={c.chartLabel(
                c.puzzles[spec.id].title,
                valuesRef.current.length,
                inversions(valuesRef.current),
                c.goal(spec.budget, c.units[spec.objective]),
                (spec.maxEdits !== undefined ? `${c.editsUsed(changed, spec.maxEdits)} ` : "") +
                  (metrics.status === "done"
                    ? c.finished(metrics.comparisons, metrics.moves)
                    : lab.state.notStarted),
              )}
            />
            {/* One puzzle asks the visitor to reshape the array, so the chart
                needs the same permanently-rendered description the teaching
                sections have. It had none before. */}
            <p id={helpId} className="sr-only">
              {lab.keyboardHelp}
            </p>
          </>
        }
        readout={
          /* The budget, where it can be read against the counters without
             looking away from the chart. */
          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-caption">
            <div className="flex gap-2">
              <dt className="text-fg-faint">{c.atMost(c.units[spec.objective])}</dt>
              <dd className="tabular-nums text-fg">{spec.budget}</dd>
            </div>
            {spec.maxEdits !== undefined && (
              <div className="flex gap-2">
                <dt className="text-fg-faint">{c.barsChanged}</dt>
                <dd
                  className={cn(
                    "tabular-nums",
                    changed > spec.maxEdits ? "text-signal-amber" : "text-fg",
                  )}
                >
                  {changed} / {spec.maxEdits}
                </dd>
              </div>
            )}
          </dl>
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
        figures={<SortFigures metrics={metrics} emphasis={spec.objective} compact />}
        secondary={
          spec.algorithm ? (
            <p className="text-caption text-fg-faint">{c.fixedTo(names[spec.algorithm])}</p>
          ) : (
            <Segmented
              label={lab.algorithm}
              value={algorithm}
              options={ALGORITHMS.map((a) => ({ value: a, label: names[a] }))}
              onChange={selectAlgorithm}
            />
          )
        }
      />

      {verdict && (
        <motion.p
          key={`${spec.id}-${verdict.kind}-${attempt}`}
          role="status"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.smooth}
          className={cn(
            "rounded-card border px-5 py-4 text-body-sm",
            verdict.kind === "passed"
              ? "border-signal-green/30 bg-signal-green/10 text-signal-green"
              : "border-signal-amber/30 bg-signal-amber/10 text-signal-amber",
          )}
        >
          {verdict.kind === "too-many-edits"
            ? c.verdict.tooManyEdits(verdict.edits, verdict.maxEdits)
            : verdict.kind === "over-budget"
              ? c.verdict.overBudget(verdict.used, c.units[verdict.objective], verdict.budget)
              : c.verdict.passed(verdict.used, c.units[verdict.objective], verdict.budget)}
        </motion.p>
      )}

    </div>
  );
}
