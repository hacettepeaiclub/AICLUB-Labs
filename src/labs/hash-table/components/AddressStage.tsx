import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { bucketOf, hashSteps, javaHash } from "../engine";
import { formatHash } from "../view";
import { TextField } from "./TextField";

const M = 16;
const START = ["apple", "banana", "cherry", "grape", "lemon", "mango", "olive", "peach", "plum"];

/**
 * Section 1: a key is not searched for, its place is computed.
 *
 * The visitor types a word and watches it become a number, character by
 * character, with Java's own arithmetic; the remainder by 16 is the bucket,
 * and the bucket lights up before anything is put in it. That is the whole
 * idea of a hash table, and the figure beside it is the contrast: one or two
 * comparisons, where a plain list would compare against every word in it.
 *
 * Collisions are already here — two of the starting words share a bucket —
 * so the chain is visible from the first frame, without being named yet.
 */
export function AddressStage() {
  const t = useLabs()["hash-table"].address;
  const [keys, setKeys] = useState<string[]>(START);
  const [word, setWord] = useState("kiwi");

  const buckets = useMemo(() => {
    const b: string[][] = Array.from({ length: M }, () => []);
    for (const k of keys) b[bucketOf(k, M)]?.push(k);
    return b;
  }, [keys]);

  const typed = word.trim();
  const steps = hashSteps(typed);
  const hash = javaHash(typed);
  const bucket = bucketOf(typed, M);
  const chain = buckets[bucket] ?? [];
  const place = chain.indexOf(typed);
  const present = place >= 0;
  const looks = present ? place + 1 : chain.length;

  const add = () => {
    if (typed && !present) setKeys((k) => [...k, typed]);
  };

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={typed ? t.announce(typed, bucket, present, looks) : ""}
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          <TextField
            value={word}
            onChange={setWord}
            label={t.inputLabel}
            maxLength={24}
            note={typed ? null : t.emptyWord}
          />

          {typed && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[16rem] font-mono text-caption tabular-nums">
                <caption className="sr-only">{t.workingCaption}</caption>
                <thead>
                  <tr className="text-left text-fg-faint">
                    <th className="py-1 pr-3 font-normal">{t.columns.char}</th>
                    <th className="py-1 pr-3 font-normal">{t.columns.code}</th>
                    <th className="py-1 font-normal">{t.columns.hash}</th>
                  </tr>
                </thead>
                <tbody className="text-fg-muted">
                  {steps.map((s, i) => (
                    <tr key={i} className="border-t border-line/5">
                      <td className="py-1 pr-3 text-fg">{s.char === " " ? "␣" : s.char}</td>
                      <td className="py-1 pr-3">{s.code}</td>
                      <td className="py-1">
                        <Step
                          previous={i === 0 ? null : (steps[i - 1]?.hash ?? 0)}
                          code={s.code}
                          hash={s.hash}
                          wrapped={t.wrapped}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-mono text-body-sm text-fg-muted">
                {t.bucketLine(formatHash(hash), M)} <span className="text-accent">{bucket}</span>
              </p>
            </div>
          )}

          <ol
            aria-label={t.tableLabel(keys.length)}
            className="grid grid-cols-4 gap-1.5 sm:grid-cols-8"
          >
            {buckets.map((items, i) => {
              const lit = typed !== "" && i === bucket;
              return (
                <li
                  key={i}
                  aria-label={t.bucketName(i, items.join(", "))}
                  className={cn(
                    "min-h-[4.5rem] rounded border p-1.5 transition-colors duration-fast",
                    lit ? "border-accent bg-accent/10" : "border-line/10 bg-ink-900",
                  )}
                >
                  <p
                    className={cn("font-mono text-caption", lit ? "text-accent" : "text-fg-faint")}
                  >
                    {i}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {items.map((k) => (
                      <li
                        key={k}
                        className={cn(
                          "truncate rounded px-1 text-caption",
                          lit && k === typed
                            ? "bg-accent text-ink-950"
                            : "bg-line/10 text-fg-muted",
                        )}
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      }
      primary={
        <div className="flex gap-2">
          <Button onClick={add} disabled={!typed || present} className="min-h-[44px] flex-1">
            {present ? t.already : t.put}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setKeys(START)}
            disabled={keys.length === START.length}
            className="min-h-[44px]"
          >
            {t.reset}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure label={t.figures.bucket} value={typed ? String(bucket) : "—"} tone="accent" />
          <Figure
            label={t.figures.looks}
            value={typed ? String(looks) : "—"}
            hint={typed ? (present ? t.figures.found : t.figures.absent) : undefined}
          />
          <Figure
            label={t.figures.list}
            value={String(present ? keys.indexOf(typed) + 1 : keys.length)}
            hint={t.figures.listHint}
          />
        </>
      }
    />
  );
}

/**
 * One row of the working: 31 × previous + code, and — when that leaves the
 * 32-bit range — what it wraps to. Both are shown, because writing only the
 * wrapped value after an equals sign would be arithmetic that is false.
 * The exact value fits a double: |previous| < 2³¹, so 31 × previous < 2⁵³.
 */
function Step({
  previous,
  code,
  hash,
  wrapped,
}: {
  previous: number | null;
  code: number;
  hash: number;
  wrapped: string;
}) {
  if (previous === null) return <span className="text-fg">{code}</span>;
  const exact = 31 * previous + code;
  return (
    <>
      31 × {formatHash(previous)} + {code} ={" "}
      {exact === hash ? (
        <span className="text-fg">{formatHash(hash)}</span>
      ) : (
        <>
          {formatHash(exact)}
          <span className="text-fg-faint"> · {wrapped} </span>
          <span className="text-fg">{formatHash(hash)}</span>
        </>
      )}
    </>
  );
}
