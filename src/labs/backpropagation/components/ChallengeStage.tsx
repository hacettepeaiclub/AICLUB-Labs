import { useEffect, useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { CASES, caseOf, culprit, type CaseId } from "../cases";
import { gradient, numericGradient, parameterNodes } from "../engine";
import { formatValue } from "../view";

/**
 * Section 7: someone's backward pass is wrong. Find where.
 *
 * Three graphs from earlier on the page, each with one mistake planted in
 * its backward pass — the mistakes people actually make. The visitor's
 * instrument is the one practitioners use: a gradient check, comparing the
 * backward pass with central differences one parameter at a time. Which
 * parameters come out wrong, and how, points at the node; the visitor names
 * it. A wrong accusation says nothing about where the fault is, only that
 * it is not there.
 */
export function ChallengeStage() {
  const lab = useLabs().backpropagation;
  const t = lab.challenge;
  const [progress, save] = useLocalControls("acl:backpropagation:challenge", {
    solved: [] as string[],
  });
  const [id, setId] = useState<CaseId>("neuron");
  const [checked, setChecked] = useState<Record<CaseId, string[]>>({
    neuron: [],
    fork: [],
    sign: [],
  });
  const [accused, setAccused] = useState<Record<CaseId, number | null>>({
    neuron: null,
    fork: null,
    sign: null,
  });

  const c = useMemo(() => caseOf(id), [id]);
  const broken = useMemo(() => gradient(c.graph, c.params, c.bug), [c]);
  const names = useMemo(() => [...parameterNodes(c.graph).keys()], [c]);
  const solvedNow = accused[id] === culprit(c);

  useEffect(() => {
    if (solvedNow && !progress.solved.includes(id)) save({ solved: [...progress.solved, id] });
  }, [solvedNow, id, progress.solved, save]);

  const solvedCount = CASES.filter((x) => progress.solved.includes(x)).length;
  const nodeName = (i: number) => c.graph.nodes[i]?.name ?? "";

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(solvedCount, CASES.length)}
      viewport={
        <div className="space-y-4">
          <p className="text-body text-fg">{t.cases[id].task}</p>
          <p className="text-caption text-fg-faint">{t.cases[id].hint}</p>

          <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
            <div>
              <p className="text-overline uppercase text-fg-faint">{t.checkTitle}</p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {names.map((name) => {
                  const done = checked[id].includes(name);
                  const ours = broken[name] ?? 0;
                  const truth = numericGradient(c.graph, c.params, name);
                  const ok = Math.abs(ours - truth) <= 1e-6 * Math.max(1, Math.abs(truth));
                  return (
                    <li
                      key={name}
                      className="flex items-center justify-between gap-3 rounded border border-line/10 px-3 py-2"
                    >
                      <span className="font-mono text-body-sm text-fg">{name}</span>
                      {done ? (
                        <span
                          className={cn(
                            "font-mono text-caption",
                            ok ? "text-signal-green" : "text-signal-amber",
                          )}
                        >
                          {formatValue(ours, 4)} {ok ? "=" : "≠"} {formatValue(truth, 4)}{" "}
                          {ok ? "✓" : "✗"}
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setChecked((s) => ({ ...s, [id]: [...s[id], name] }))}
                          className="min-h-9"
                        >
                          {t.check}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-caption text-fg-faint">{t.checkLegend}</p>
            </div>

            <div className="border-t border-line/10 pt-4">
              <p className="text-overline uppercase text-fg-faint">{t.accuseTitle}</p>
              <div role="group" aria-label={t.accuseTitle} className="mt-2 flex flex-wrap gap-2">
                {c.suspects.map((i) => (
                  <Button
                    key={i}
                    variant={accused[id] === i ? "primary" : "secondary"}
                    aria-pressed={accused[id] === i}
                    onClick={() => setAccused((s) => ({ ...s, [id]: i }))}
                    className="min-h-[44px] font-mono"
                  >
                    {nodeName(i)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <p
            key={`${id}-${accused[id]}`}
            role="status"
            className={cn(
              "verdict-enter rounded-card border px-5 py-4 text-body-sm",
              solvedNow
                ? "border-signal-green/30 bg-signal-green/10 text-signal-green"
                : "border-line/10 bg-ink-950 text-fg-muted",
            )}
          >
            {solvedNow
              ? t.cases[id].solved
              : accused[id] === null
                ? t.notYet
                : t.wrong(nodeName(accused[id] ?? 0))}
          </p>
        </div>
      }
      primary={
        <Segmented
          label={t.pickLabel}
          value={id}
          options={CASES.map((x) => ({
            value: x,
            label: `${progress.solved.includes(x) ? "✓ " : ""}${t.cases[x].tab}`,
          }))}
          onChange={setId}
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
          value={`${solvedCount} / ${CASES.length}`}
          tone={solvedCount === CASES.length ? "accent" : "default"}
        />
      }
    />
  );
}
