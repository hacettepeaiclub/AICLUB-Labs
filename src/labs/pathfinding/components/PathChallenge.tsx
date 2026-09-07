import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Stage, Transport } from "@/components/lab";
import { Badge, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { useLocalControls } from "@/hooks";
import { spring } from "@/design/motion";
import { cn } from "@/lib/cn";
import type { Algorithm, Grid } from "../engine";
import { CHALLENGES, challengeGrid } from "../mazes";
import { judge, solvedCount, type ChallengeProgress } from "../challenge";
import { useSearchRun } from "../useSearchRun";
import { GridCanvas } from "./GridCanvas";
import { ALGORITHM_LABEL, SearchFigures } from "./SearchMetrics";

const ALGORITHMS: readonly Algorithm[] = ["bfs", "dijkstra", "astar"];
const MAZE_IDS = CHALLENGES.map((m) => m.id);

/**
 * Same answer, less work.
 *
 * Two gates at once: the path has to be as cheap as the map allows, and the
 * search has to settle no more cells than the budget. Getting one without the
 * other is the common case, and the verdict says which one was missed —
 * failing here is meant to teach something.
 *
 * The maps cannot be edited. A budget only means anything if everyone is
 * solving the same puzzle.
 */
export function PathChallenge() {
  const t = useT();
  const lab = t.labs.pathfinding;
  const c = lab.challenge;
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const maze = CHALLENGES[index] ?? CHALLENGES[0];

  const gridRef = useRef<Grid>(challengeGrid(maze!));
  const [algorithm, setAlgorithm] = useState<Algorithm>("bfs");
  const [cursor, setCursor] = useState(-1);
  const [attempt, setAttempt] = useState(0);

  const [progress, saveProgress] = useLocalControls<ChallengeProgress>(
    "acl:pathfinding:challenge",
    {},
  );

  const run = useSearchRun({ gridRef, algorithm, reduced, eventsPerFrame: 5 });
  const result = run.results[algorithm];
  const verdict = maze && result && !run.running ? judge(maze, result) : null;

  const selectMaze = useCallback(
    (id: string) => {
      const next = CHALLENGES.findIndex((m) => m.id === id);
      const chosen = CHALLENGES[next];
      if (!chosen) return;
      setIndex(next);
      gridRef.current = challengeGrid(chosen);
      run.clearResults();
      run.announce(lab.status.loaded(c.maps[chosen.id].title));
      setAttempt((n) => n + 1);
    },
    [run, lab, c],
  );

  const selectAlgorithm = useCallback(
    (next: Algorithm) => {
      setAlgorithm(next);
      run.clearResults();
      run.announce(`Algorithm set to ${ALGORITHM_LABEL[next]}.`);
    },
    [run],
  );

  const handleRun = useCallback(() => {
    run.run();
  }, [run]);

  // Record a win once, in an effect rather than during render.
  const passedId = verdict?.kind === "passed" ? (maze?.id ?? null) : null;
  const alreadyWon = passedId !== null && progress[passedId] === true;
  useEffect(() => {
    if (passedId === null || alreadyWon) return;
    saveProgress({ [passedId]: true });
  }, [passedId, alreadyWon, saveProgress]);

  if (!maze) return null;

  const beaten = solvedCount(progress, MAZE_IDS);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented
          label={lab.map}
          value={maze.id}
          options={CHALLENGES.map((m) => ({ value: m.id, label: c.maps[m.id].title }))}
          onChange={selectMaze}
        />
        <Badge dotClassName={beaten === MAZE_IDS.length ? "bg-signal-green" : "bg-fg-faint"}>
          {c.beaten(beaten, MAZE_IDS.length)}
        </Badge>
      </div>

      <Stage
        width="full"
        secondaryLabel={lab.algorithm}
        caption={c.maps[maze.id].hint}
        announcement={run.announcement}
        viewport={
          <GridCanvas
            gridRef={gridRef}
            searchRef={run.searchRef}
            running={run.running}
            onFrame={run.advanceFrame}
            revision={run.revision + attempt}
            tool="wall"
            editable={false}
            onEdit={() => undefined}
            cursor={cursor}
            onCursorChange={setCursor}
            label={c.mazeLabel(
              c.maps[maze.id].title,
              gridRef.current.cols,
              gridRef.current.rows,
              maze.optimalCost,
              maze.budget,
              ALGORITHM_LABEL[algorithm],
            )}
          />
        }
        readout={
          /* The two gates, where the run can be checked against them without
             looking away from the grid. */
          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-caption">
            <div className="flex gap-2">
              <dt className="text-fg-faint">{c.costMustBe}</dt>
              <dd className="tabular-nums text-fg">{maze.optimalCost}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-fg-faint">{c.exploredAtMost}</dt>
              <dd className="tabular-nums text-fg">{maze.budget}</dd>
            </div>
          </dl>
        }
        primary={
          <Transport
            running={run.running}
            onRun={handleRun}
            onStep={run.stepOnce}
            onReset={run.reset}
          />
        }
        figures={<SearchFigures metrics={run.metrics} />}
        secondary={
          <Segmented
            label={lab.algorithm}
            value={algorithm}
            options={ALGORITHMS.map((a) => ({ value: a, label: ALGORITHM_LABEL[a] }))}
            onChange={selectAlgorithm}
          />
        }
      />

      {verdict && (
        <motion.p
          key={`${maze.id}-${algorithm}-${verdict.kind}`}
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
          {verdict.kind === "unsolved"
            ? c.verdict.unreachable
            : verdict.kind === "passed"
              ? c.verdict.solved(verdict.pathCost, verdict.explored)
              : verdict.kind === "effort"
                ? c.verdict.overBudget(verdict.explored, verdict.budget)
                : verdict.kind === "cost"
                  ? c.verdict.suboptimal(verdict.explored, verdict.pathCost, verdict.optimalCost)
                  : c.verdict.both(
                      verdict.pathCost,
                      verdict.optimalCost,
                      verdict.explored,
                      verdict.budget,
                    )}
        </motion.p>
      )}

    </div>
  );
}
