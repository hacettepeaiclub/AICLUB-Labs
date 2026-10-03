import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  FLAT_PICTURE,
  HORIZONTAL_LINE,
  judgeFlat,
  judgeShift,
  judgeVertical,
  PUZZLES,
  SHIFT_GOAL,
  SHIFT_PICTURE,
  VERTICAL_LINE,
  type PuzzleId,
} from "../puzzles";
import { GridView } from "./GridView";
import { kernelOf, KernelEditor } from "./KernelEditor";
import { Panel } from "./Panel";

const IDENTITY = ["0", "0", "0", "0", "1", "0", "0", "0", "0"];

/**
 * Section 7: three kernels to find by hand.
 *
 * Each is a property rather than an answer — move the picture, ignore what
 * is flat, see one direction and not the other — judged by running the
 * visitor's kernel on fixed pictures (`puzzles.ts`). The first is a trap
 * on purpose: the obvious kernel moves the picture the wrong way, because
 * the layer does not flip it, and the verdict says so instead of "wrong".
 *
 * Solved puzzles persist, as in every challenge in the collection; each
 * puzzle keeps its own nine cells for the sitting.
 */
export function ChallengeStage() {
  const lab = useLabs().convolution;
  const t = lab.challenge;
  const [progress, save] = useLocalControls("acl:convolution:challenge", {
    solved: [] as string[],
  });
  const [puzzle, setPuzzle] = useState<PuzzleId>("shift");
  const [cells, setCells] = useState<Record<PuzzleId, string[]>>({
    shift: IDENTITY,
    flat: IDENTITY,
    vertical: IDENTITY,
  });

  const kernel = useMemo(() => kernelOf(cells[puzzle]), [cells, puzzle]);
  const verdict = useMemo(() => {
    if (!kernel) return null;
    if (puzzle === "shift") return { kind: "shift" as const, ...judgeShift(kernel) };
    if (puzzle === "flat") return { kind: "flat" as const, ...judgeFlat(kernel) };
    return { kind: "vertical" as const, ...judgeVertical(kernel) };
  }, [kernel, puzzle]);
  const solvedNow = !!verdict?.solved;

  useEffect(() => {
    if (solvedNow && !progress.solved.includes(puzzle)) {
      save({ solved: [...progress.solved, puzzle] });
    }
  }, [solvedNow, puzzle, progress.solved, save]);

  const solvedCount = PUZZLES.filter((p) => progress.solved.includes(p)).length;

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(solvedCount, PUZZLES.length)}
      viewport={
        <div className="space-y-4">
          <p className="text-body text-fg">{t[puzzle].task}</p>
          <p className="text-caption text-fg-faint">{t[puzzle].hint}</p>

          <div className="grid gap-4 rounded border border-line/10 bg-ink-950 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-start">
            <KernelEditor
              cells={cells[puzzle]}
              onChange={(next) => setCells((c) => ({ ...c, [puzzle]: next }))}
              label={lab.kernelWord}
              cellLabel={lab.cellLabel}
              invalid={lab.invalidWeight}
              className="mx-auto w-40 sm:w-full"
            />

            <div
              className={cn(
                "grid min-w-0 gap-3",
                puzzle === "shift" ? "grid-cols-3" : "grid-cols-2",
              )}
            >
              {puzzle === "shift" && (
                <>
                  <Panel label={t.shift.input}>
                    <GridView grid={SHIFT_PICTURE} kind="image" ariaLabel={t.shift.input} />
                  </Panel>
                  <Panel label={t.shift.goal}>
                    <GridView grid={SHIFT_GOAL} kind="image" ariaLabel={t.shift.goal} />
                  </Panel>
                  <Panel label={t.yours}>
                    {verdict?.kind === "shift" && (
                      <GridView grid={verdict.output} kind="auto" ariaLabel={t.yours} />
                    )}
                  </Panel>
                </>
              )}
              {puzzle === "flat" && (
                <>
                  <Panel label={t.flat.input}>
                    <GridView grid={FLAT_PICTURE} kind="image" ariaLabel={t.flat.input} />
                  </Panel>
                  <Panel label={t.yours}>
                    {verdict?.kind === "flat" && (
                      <GridView grid={verdict.output} kind="signed" ariaLabel={t.yours} />
                    )}
                  </Panel>
                  <Rules
                    rules={verdict?.kind === "flat" ? verdict.rules : null}
                    text={t.flat.rules}
                  />
                </>
              )}
              {puzzle === "vertical" && (
                <>
                  <Panel label={t.vertical.vertical}>
                    <GridView grid={VERTICAL_LINE} kind="image" ariaLabel={t.vertical.vertical} />
                    {verdict?.kind === "vertical" && (
                      <div className="mt-2">
                        <GridView
                          grid={verdict.vertical}
                          kind="signed"
                          ariaLabel={t.vertical.verticalOut}
                        />
                      </div>
                    )}
                  </Panel>
                  <Panel label={t.vertical.horizontal}>
                    <GridView
                      grid={HORIZONTAL_LINE}
                      kind="image"
                      ariaLabel={t.vertical.horizontal}
                    />
                    {verdict?.kind === "vertical" && (
                      <div className="mt-2">
                        <GridView
                          grid={verdict.horizontal}
                          kind="signed"
                          ariaLabel={t.vertical.horizontalOut}
                        />
                      </div>
                    )}
                  </Panel>
                  <Rules
                    rules={verdict?.kind === "vertical" ? verdict.rules : null}
                    text={t.vertical.rules}
                  />
                </>
              )}
            </div>
          </div>

          <p
            key={`${puzzle}-${solvedNow}`}
            role="status"
            className={cn(
              "verdict-enter rounded-card border px-5 py-4 text-body-sm",
              solvedNow
                ? "border-signal-green/30 bg-signal-green/10 text-signal-green"
                : "border-line/10 bg-ink-950 text-fg-muted",
            )}
          >
            {!verdict
              ? lab.invalidWeight
              : solvedNow
                ? t[puzzle].solved
                : verdict.kind === "shift" && verdict.mirrored
                  ? t.shift.mirrored
                  : t[puzzle].notYet}
          </p>
        </div>
      }
      primary={
        <Segmented
          label={t.pickLabel}
          value={puzzle}
          options={PUZZLES.map((p) => ({
            value: p,
            label: `${progress.solved.includes(p) ? "✓ " : ""}${t[p].tab}`,
          }))}
          onChange={setPuzzle}
        />
      }
      secondary={
        <Button
          variant="secondary"
          onClick={() => save({ solved: [] })}
          disabled={solvedCount === 0}
          className="min-h-[44px] w-full"
        >
          {t.reset}
        </Button>
      }
      figures={
        <Figure
          label={t.solvedLabel}
          value={`${solvedCount} / ${PUZZLES.length}`}
          tone={solvedCount === PUZZLES.length ? "accent" : "default"}
        />
      }
    />
  );
}

function Rules<K extends string>({
  rules,
  text,
}: {
  rules: Readonly<Record<K, boolean>> | null;
  text: Readonly<Record<K, string>>;
}): ReactNode {
  return (
    <ul className="col-span-2 space-y-1.5 text-body-sm">
      {(Object.keys(text) as K[]).map((rule) => {
        const ok = !!rules?.[rule];
        return (
          <li key={rule} className={cn("flex gap-2", ok ? "text-signal-green" : "text-fg-muted")}>
            <span aria-hidden className="w-4 shrink-0 text-center font-mono">
              {ok ? "✓" : "·"}
            </span>
            {text[rule]}
          </li>
        );
      })}
    </ul>
  );
}
