import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button, Kbd, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { colOf, rowOf, type Algorithm, type Grid } from "../engine";
import { clearTerrain, summarise, type Tool } from "../gridEdit";
import { buildPreset, NARROW, pickSize, type PresetId } from "../mazes";
import { useSearchRun } from "../useSearchRun";
import { GridCanvas } from "./GridCanvas";
import { AlgorithmComparison, ALGORITHM_LABEL, SearchMetrics } from "./SearchMetrics";

export interface PathfindingStageProps {
  preset: PresetId;
  /** One entry means no picker at all — section 1 should not offer a choice. */
  algorithms: readonly Algorithm[];
  /** Mud only appears once the lab has a reason for it. */
  allowMud?: boolean;
  /** Show the run-by-run table under the metrics. */
  compare?: boolean;
  emphasis?: "explored" | "cost";
  /** One short line under the grid. Behaviour first, names later. */
  caption?: string;
}

const describe = (grid: Grid, index: number): string =>
  `row ${rowOf(grid, index) + 1}, column ${colOf(grid, index) + 1}`;

/**
 * The interactive unit every section is built from: a grid you draw on, three
 * controls, and the numbers the run produced.
 *
 * The grid lives in a ref and is mutated in place — painting never re-renders
 * React — and the canvas is the only thing that reads it every frame.
 */
export function PathfindingStage({
  preset,
  algorithms,
  allowMud = false,
  compare = false,
  emphasis,
  caption,
}: PathfindingStageProps) {
  const t = useT();
  const lab = t.labs.pathfinding;
  const reduced = useReducedMotion() ?? false;

  // Chosen once. A grid that reflowed on resize would throw away the drawing.
  const [size] = useState(() =>
    typeof window === "undefined" ? NARROW : pickSize(window.innerWidth),
  );
  const gridRef = useRef<Grid>(buildPreset(preset, size));
  const [algorithm, setAlgorithm] = useState<Algorithm>(algorithms[0] ?? "bfs");
  const [tool, setTool] = useState<Tool>("wall");
  const [cursor, setCursor] = useState(-1);
  const [edits, setEdits] = useState(0);

  // Tuned so a full flood of the grid takes roughly three and a half seconds:
  // slow enough to watch the wave move, quick enough not to be a waiting game.
  const eventsPerFrame = Math.max(4, Math.round((size.cols * size.rows) / 110));
  const run = useSearchRun({ gridRef, algorithm, reduced, eventsPerFrame });

  const editable = !run.running;
  const showCost = allowMud;

  const handleEdit = useCallback(() => {
    run.clearResults();
    setEdits((n) => n + 1);
  }, [run]);

  const handleReset = useCallback(() => {
    gridRef.current = buildPreset(preset, size);
    run.clearResults();
    run.announce(lab.status.gridReset);
    setEdits((n) => n + 1);
  }, [preset, size, run, lab]);

  const handleClear = useCallback(() => {
    clearTerrain(gridRef.current);
    run.clearResults();
    run.announce(lab.status.gridCleared);
    setEdits((n) => n + 1);
  }, [run, lab]);

  const handleAlgorithm = useCallback(
    (next: Algorithm) => {
      setAlgorithm(next);
      run.reset();
      run.announce(`Algorithm set to ${ALGORITHM_LABEL[next]}.`);
    },
    [run],
  );

  const metrics = run.metrics;
  const revision = run.revision;
  // Recomputed every render rather than memoised: the grid lives in a ref, so
  // there is no dependency a memo could key on, and walking 651 cells a few
  // times a second costs nothing.
  const summary = (() => {
    const grid = gridRef.current;
    const { walls, mud } = summarise(grid);
    const result =
      metrics.status === "solved"
        ? lab.status.solved(metrics.explored, metrics.pathLength, metrics.pathCost)
        : metrics.status === "unreachable"
          ? lab.status.unreachable(metrics.explored)
          : metrics.status === "running"
            ? lab.status.running(metrics.explored)
            : lab.status.notStarted;
    return lab.gridSummary(
      grid.cols,
      grid.rows,
      describe(grid, grid.start),
      describe(grid, grid.goal),
      walls,
      mud,
      ALGORITHM_LABEL[algorithm],
      result,
    );
  })();

  const helpId = `${preset}-grid-help`;

  return (
    <div className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-3">
          <GridCanvas
            gridRef={gridRef}
            searchRef={run.searchRef}
            running={run.running}
            onFrame={run.advanceFrame}
            revision={revision + edits}
            tool={tool}
            editable={editable}
            onEdit={handleEdit}
            cursor={cursor}
            onCursorChange={setCursor}
            label={summary}
            describedBy={helpId}
          />

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="text-caption text-fg-faint">
              <span className="mr-1.5 inline-block size-2.5 rounded-[2px] bg-fg-muted/40 align-middle ring-1 ring-fg-muted/55" />
              {lab.legend.wall}
              <span className="ml-4 mr-1.5 inline-block size-2.5 rounded-[2px] bg-signal-cyan/25 align-middle ring-1 ring-signal-cyan" />
              {lab.legend.frontier}
              <span className="ml-4 mr-1.5 inline-block size-2.5 rounded-[2px] bg-signal-cyan/25 align-middle" />
              {lab.legend.settled}
              <span className="ml-4 mr-1.5 inline-block size-2.5 rounded-[2px] bg-accent-fill align-middle" />
              {lab.legend.path}
              {allowMud && (
                <>
                  <span className="ml-4 mr-1.5 inline-block size-2.5 rounded-[2px] bg-signal-amber/30 align-middle ring-1 ring-signal-amber/60" />
                  {lab.legend.mud}
                </>
              )}
            </p>
            <p className="font-mono text-caption text-fg-faint" aria-hidden>
              {cursor >= 0 ? describe(gridRef.current, cursor) : " "}
            </p>
          </div>

          {caption && <p className="max-w-prose text-body-sm text-fg-muted">{caption}</p>}

          <p id={helpId} className="text-caption text-fg-faint">
            {lab.gridHelpFull.drag} <span className="font-mono text-fg">S</span>{" "}
            {lab.gridHelpFull.or} <span className="font-mono text-fg">G</span>{" "}
            {lab.gridHelpFull.toMove} <Kbd>Space</Kbd> {lab.gridHelpFull.toggles} <Kbd>S</Kbd>{" "}
            {lab.gridHelpFull.or} <Kbd>G</Kbd> {lab.gridHelpFull.drops}
          </p>
        </div>

        <div className="space-y-4">
          {algorithms.length > 1 && (
            <Segmented
              label={lab.algorithm}
              value={algorithm}
              options={algorithms.map((a) => ({ value: a, label: ALGORITHM_LABEL[a] }))}
              onChange={handleAlgorithm}
            />
          )}

          {allowMud && (
            <Segmented
              label={lab.draw}
              value={tool}
              options={[
                { value: "wall", label: lab.tools.wall },
                { value: "mud", label: lab.tools.mud },
                { value: "erase", label: lab.tools.erase },
              ]}
              onChange={setTool}
            />
          )}

          {/* Two by two: four buttons do not fit the sidebar on one line, and a
              lone wrapped "Clear" read like a mistake. */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={run.run}>{run.running ? t.common.pause : t.common.run}</Button>
            <Button variant="secondary" onClick={run.stepOnce} disabled={run.running}>
              {t.common.step}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              {t.common.reset}
            </Button>
            <Button variant="ghost" onClick={handleClear}>
              {t.common.clear}
            </Button>
          </div>

          <SearchMetrics metrics={metrics} emphasis={emphasis} showCost={showCost} />
        </div>
      </div>

      {compare && (
        <AlgorithmComparison
          results={run.results}
          order={algorithms}
          emphasis={emphasis}
          showCost={showCost}
        />
      )}

      <p aria-live="polite" className="sr-only">
        {run.announcement}
      </p>
    </div>
  );
}
