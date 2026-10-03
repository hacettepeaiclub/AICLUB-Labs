import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  absR,
  addFloats,
  compare,
  decode,
  decodeFinite,
  equal,
  type Float,
  floatsEqual,
  FORMATS,
  isFinite,
  parseNumber,
  rational,
  round,
  shortest,
} from "../engine";
import { FloatField } from "./FloatField";

type Puzzle = "plusOne" | "associative" | "exact";
const PUZZLES: readonly Puzzle[] = ["plusOne", "associative", "exact"];
const ONE32 = round(rational(1n), FORMATS.float32);
const HALF = rational(1n, 2n);

/**
 * Section 7: three things ordinary arithmetic forbids, each found by hand.
 *
 * Every verdict is computed by the same engine the rest of the page uses, so
 * there is no answer key: anything that works, works. Two loopholes are
 * closed on purpose — Infinity + 1 is Infinity, which would "solve" the first
 * puzzle without saying anything about gaps, and a NaN never equals anything,
 * which would "solve" the second by breaking it.
 *
 * Solved puzzles are kept across visits, like every other challenge in the
 * collection; the inputs are this sitting's.
 */
export function ChallengeStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.challenge;
  const [progress, save] = useLocalControls("acl:floating-point:challenge", {
    solved: [] as string[],
    smallest: "",
  });
  const [puzzle, setPuzzle] = useState<Puzzle>("plusOne");
  const [x, setX] = useState("1000");
  const [a, setA] = useState("1");
  const [b, setB] = useState("2");
  const [c, setC] = useState("3");
  const [guess, setGuess] = useState("0.1");

  // ---- x + 1 = x, in float32
  const plusOne = useMemo(() => {
    const parsed = parseNumber(x);
    if (!parsed) return null;
    const X = round(parsed, FORMATS.float32);
    const R = addFloats(X, ONE32);
    return { X, R, finite: isFinite(X), solved: isFinite(X) && floatsEqual(R, X) };
  }, [x]);

  // ---- (a + b) + c ≠ a + (b + c), in float64
  const assoc = useMemo(() => {
    const [pa, pb, pc] = [a, b, c].map(parseNumber);
    if (!pa || !pb || !pc) return null;
    const [A, B, C] = [pa, pb, pc].map((p) => round(p, FORMATS.float64)) as [Float, Float, Float];
    const left = addFloats(addFloats(A, B), C);
    const right = addFloats(A, addFloats(B, C));
    const finite = isFinite(left) && isFinite(right);
    return { left, right, finite, solved: finite && !floatsEqual(left, right) };
  }, [a, b, c]);

  // ---- an exact decimal in (0, 1), at most three places, not 0.5
  const exact = useMemo(() => {
    const parsed = parseNumber(guess);
    const value = parsed?.kind === "finite" ? parsed.value : null;
    const range = !!value && value.num > 0n && value.num < value.den;
    const places = !!value && (value.num * 1000n) % value.den === 0n;
    const notHalf = !!value && !equal(value, HALF);
    const stored = value ? decode(round(value, FORMATS.float32)) : null;
    const isExact = !!value && !!stored && equal(stored, value);
    return {
      rules: { range, places, notHalf, exact: isExact },
      solved: range && places && notHalf && isExact,
    };
  }, [guess]);

  const solvedNow: Record<Puzzle, boolean> = {
    plusOne: !!plusOne?.solved,
    associative: !!assoc?.solved,
    exact: exact.solved,
  };

  useEffect(() => {
    const now: Record<Puzzle, boolean> = {
      plusOne: !!plusOne?.solved,
      associative: !!assoc?.solved,
      exact: exact.solved,
    };
    const solved = new Set(progress.solved);
    let changed = false;
    for (const p of PUZZLES) {
      if (now[p] && !solved.has(p)) {
        solved.add(p);
        changed = true;
      }
    }
    // Remember the smallest x the visitor found that loses its + 1.
    let smallest = progress.smallest;
    if (plusOne?.solved) {
      const current = parseNumber(smallest);
      const here = decodeFinite(plusOne.X);
      const before = current?.kind === "finite" ? current.value : null;
      if (!before || compare(absR(here), absR(before)) < 0) {
        smallest = shortest(plusOne.X);
        changed = true;
      }
    }
    if (changed) save({ solved: [...solved], smallest });
  }, [plusOne, assoc, exact, progress, save]);

  const solvedCount = PUZZLES.filter((p) => progress.solved.includes(p)).length;
  const current = solvedNow[puzzle];

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(solvedCount, PUZZLES.length)}
      viewport={
        <div className="space-y-4">
          {puzzle === "plusOne" && (
            <PuzzleBody task={t.plusOne.task} hint={t.plusOne.hint}>
              <FloatField
                value={x}
                onChange={setX}
                label={t.plusOne.xLabel}
                error={plusOne ? null : lab.invalid}
              />
              {plusOne && (
                <Rows
                  rows={[
                    [t.plusOne.stored, shortest(plusOne.X)],
                    [t.plusOne.result, shortest(plusOne.R)],
                  ]}
                />
              )}
              {progress.smallest && (
                <p className="text-caption text-fg-muted">{t.plusOne.best(progress.smallest)}</p>
              )}
            </PuzzleBody>
          )}

          {puzzle === "associative" && (
            <PuzzleBody task={t.associative.task} hint={t.associative.hint}>
              <div className="grid gap-3 sm:grid-cols-3">
                <FloatField
                  value={a}
                  onChange={setA}
                  label="a"
                  compact
                  error={parseNumber(a) ? null : lab.invalid}
                />
                <FloatField
                  value={b}
                  onChange={setB}
                  label="b"
                  compact
                  error={parseNumber(b) ? null : lab.invalid}
                />
                <FloatField
                  value={c}
                  onChange={setC}
                  label="c"
                  compact
                  error={parseNumber(c) ? null : lab.invalid}
                />
              </div>
              {assoc && (
                <Rows
                  rows={[
                    [t.associative.left, shortest(assoc.left)],
                    [t.associative.right, shortest(assoc.right)],
                  ]}
                />
              )}
            </PuzzleBody>
          )}

          {puzzle === "exact" && (
            <PuzzleBody task={t.exact.task} hint={t.exact.hint}>
              <FloatField value={guess} onChange={setGuess} label={t.exact.inputLabel} />
              <ul className="space-y-1.5 text-body-sm">
                {(Object.keys(t.exact.rules) as (keyof typeof t.exact.rules)[]).map((rule) => (
                  <li
                    key={rule}
                    className={cn(
                      "flex items-center gap-2",
                      exact.rules[rule] ? "text-signal-green" : "text-fg-muted",
                    )}
                  >
                    <span aria-hidden className="w-4 text-center font-mono">
                      {exact.rules[rule] ? "✓" : "·"}
                    </span>
                    {t.exact.rules[rule]}
                  </li>
                ))}
              </ul>
              {progress.solved.includes("exact") && (
                <p className="text-body-sm text-fg-muted">{t.exact.reveal}</p>
              )}
            </PuzzleBody>
          )}

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
              : puzzle === "plusOne"
                ? plusOne && !plusOne.finite
                  ? t.plusOne.infinite
                  : t.plusOne.notYet
                : puzzle === "associative"
                  ? assoc && !assoc.finite
                    ? t.associative.notFinite
                    : t.associative.notYet
                  : t.exact.notYet}
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
          onClick={() => save({ solved: [], smallest: "" })}
          disabled={solvedCount === 0 && !progress.smallest}
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

function PuzzleBody({ task, hint, children }: { task: string; hint: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-body text-fg">{task}</p>
      <p className="text-caption text-fg-faint">{hint}</p>
      {children}
    </div>
  );
}

function Rows({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded border border-line/10 bg-line/10 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="bg-ink-950 px-4 py-3">
          <dt className="text-overline uppercase text-fg-faint">{label}</dt>
          <dd className="mt-1 break-all font-mono text-body text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
