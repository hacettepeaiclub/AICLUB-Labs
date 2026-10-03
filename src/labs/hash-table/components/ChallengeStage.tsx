import { useEffect, useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  judgeCollide,
  judgePerfect,
  judgeSize,
  PUZZLES,
  SIZE_KEYS,
  type PuzzleId,
} from "../puzzles";
import { formatHash } from "../view";
import { TextField } from "./TextField";

const START_WORDS = ["red", "green", "blue", "cyan", "pink", "gold", "gray", "lime"];

/**
 * Section 7: three things to make a hash table do.
 *
 * Find two strings Java cannot tell apart, choose a table size that keeps
 * sixteen evenly spaced keys apart, and pick eight words that fill eight
 * buckets exactly. Each verdict is computed (`puzzles.ts`), so any answer
 * with the property passes; solved puzzles persist, as everywhere else.
 */
export function ChallengeStage() {
  const lab = useLabs()["hash-table"];
  const t = lab.challenge;
  const [progress, save] = useLocalControls("acl:hash-table:challenge", {
    solved: [] as string[],
  });
  const [puzzle, setPuzzle] = useState<PuzzleId>("collide");
  const [a, setA] = useState("Ab");
  const [b, setB] = useState("BB");
  const [size, setSize] = useState("16");
  const [words, setWords] = useState<string[]>(START_WORDS);

  const collide = useMemo(() => judgeCollide(a, b), [a, b]);
  const sized = useMemo(() => judgeSize(size), [size]);
  const perfect = useMemo(() => judgePerfect(words), [words]);
  const now: Record<PuzzleId, boolean> = {
    collide: collide.solved,
    size: sized.solved,
    perfect: perfect.solved,
  };
  const current = now[puzzle];

  useEffect(() => {
    if (current && !progress.solved.includes(puzzle))
      save({ solved: [...progress.solved, puzzle] });
  }, [current, puzzle, progress.solved, save]);

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

          <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
            {puzzle === "collide" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  value={a}
                  onChange={setA}
                  label={t.collide.first}
                  maxLength={16}
                  note={t.collide.hashOf(formatHash(collide.ha))}
                />
                <TextField
                  value={b}
                  onChange={setB}
                  label={t.collide.second}
                  maxLength={16}
                  note={t.collide.hashOf(formatHash(collide.hb))}
                />
              </div>
            )}

            {puzzle === "size" && (
              <>
                <TextField
                  value={size}
                  onChange={setSize}
                  label={t.size.label}
                  inputMode="numeric"
                  maxLength={3}
                  error={sized.m === null ? t.size.range : null}
                />
                {sized.m !== null && (
                  <ol
                    aria-label={t.size.chartLabel(sized.distinct)}
                    className="flex flex-wrap gap-1.5"
                  >
                    {SIZE_KEYS.map((k, i) => {
                      const bucket = sized.buckets[i] ?? 0;
                      const shared = sized.buckets.filter((x) => x === bucket).length > 1;
                      return (
                        <li
                          key={k}
                          className={cn(
                            "rounded px-2 py-1 font-mono text-caption",
                            shared
                              ? "bg-signal-amber/20 text-signal-amber"
                              : "bg-accent/15 text-fg",
                          )}
                        >
                          {k} → {bucket}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </>
            )}

            {puzzle === "perfect" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {words.map((w, i) => {
                  const bucket = perfect.buckets[i];
                  return (
                    <TextField
                      key={i}
                      value={w}
                      onChange={(v) => setWords((ws) => ws.map((x, j) => (j === i ? v : x)))}
                      label={t.perfect.word(i + 1)}
                      maxLength={16}
                      error={perfect.clash[i] ? t.perfect.bucket(bucket ?? 0, true) : null}
                      note={
                        bucket === null || bucket === undefined
                          ? null
                          : t.perfect.bucket(bucket, false)
                      }
                    />
                  );
                })}
              </div>
            )}

            {puzzle === "perfect" && (
              <ul className="space-y-1.5 text-body-sm">
                {(Object.keys(t.perfect.rules) as (keyof typeof t.perfect.rules)[]).map((rule) => (
                  <li
                    key={rule}
                    className={cn(
                      "flex gap-2",
                      perfect.rules[rule] ? "text-signal-green" : "text-fg-muted",
                    )}
                  >
                    <span aria-hidden className="w-4 shrink-0 text-center font-mono">
                      {perfect.rules[rule] ? "✓" : "·"}
                    </span>
                    {t.perfect.rules[rule]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p
            key={`${puzzle}-${current}`}
            role="status"
            className={cn(
              "verdict-enter rounded-card border px-5 py-4 text-body-sm",
              current
                ? "border-signal-green/30 bg-signal-green/10 text-signal-green"
                : "border-line/10 bg-ink-950 text-fg-muted",
            )}
          >
            {current
              ? t[puzzle].solved
              : puzzle === "collide" && !collide.different
                ? t.collide.sameString
                : puzzle === "size" && sized.m !== null
                  ? t.size.notYet(sized.distinct, SIZE_KEYS.length)
                  : t[puzzle].notYetPlain}
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
