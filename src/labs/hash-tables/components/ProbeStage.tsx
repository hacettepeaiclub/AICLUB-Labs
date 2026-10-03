import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { createRng } from "@/lib/random";
import { clusters, EMPTY, linear, mean, probe } from "../engine";
import { formatValue } from "../view";

const M = 32;

const homesFor = (seed: number) => {
  const rng = createRng(seed);
  return Array.from({ length: M }, () => Math.floor(rng() * M));
};

/**
 * Section 3: no lists, one array, and a key that does not fit steps right.
 *
 * Linear probing, one key at a time, with every slot the newest key looked
 * at outlined. Homes are random, as a good hash makes them. Early keys land
 * where they belong; later ones land on a run of full slots and walk to its
 * end, which makes the run longer, which makes the next walk longer. The
 * figures are measured on this very table, so the visitor watches the mean
 * cost bend upward as the last few slots fill.
 */
export function ProbeStage() {
  const lab = useLabs()["hash-tables"];
  const t = lab.probe;
  const [seed, setSeed] = useState(3);
  const [count, setCount] = useState(8);
  const homes = useMemo(() => homesFor(seed), [seed]);

  const before = useMemo(() => linear(homes.slice(0, Math.max(count - 1, 0)), M), [homes, count]);
  const now = useMemo(() => linear(homes.slice(0, count), M), [homes, count]);
  const lastHome = count > 0 ? homes[count - 1] : undefined;
  const lastPath = lastHome === undefined ? null : probe(before.table, lastHome);
  const path = new Set(lastPath?.path ?? []);
  const runs = clusters(now.table);
  const longest = runs.reduce((a, r) => Math.max(a, r[1]), 0);
  const full = count >= M;

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={
        lastPath ? t.announce(count, lastHome ?? 0, lastPath.slot, lastPath.probes) : ""
      }
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          <ol
            aria-label={t.tableLabel(count, M)}
            className="grid grid-cols-8 gap-1.5 sm:grid-cols-[repeat(16,minmax(0,1fr))]"
          >
            {Array.from(now.table, (key, slot) => {
              const filled = key !== EMPTY;
              const placed = lastPath?.slot === slot;
              const walked = path.has(slot) && !placed;
              return (
                <li
                  key={slot}
                  aria-label={filled ? t.slotFull(slot, homes[key] ?? 0) : t.slotEmpty(slot)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center rounded border font-mono text-caption",
                    placed
                      ? "border-accent bg-accent text-ink-950"
                      : walked
                        ? "border-signal-amber bg-accent/25 text-fg"
                        : filled
                          ? "border-transparent bg-accent/25 text-fg-muted"
                          : "border-line/10 bg-ink-900 text-fg-faint",
                  )}
                >
                  <span className="text-[0.65rem] leading-none opacity-70">{slot}</span>
                  {filled && <span className="mt-0.5 leading-none">→{homes[key]}</span>}
                </li>
              );
            })}
          </ol>
          <p className="text-caption text-fg-muted">
            {lastPath && lastHome !== undefined
              ? t.pathLine(lastHome, lastPath.slot, lastPath.probes)
              : t.emptyLine}
          </p>
          <p className="text-caption text-fg-faint">
            {runs.length ? t.clusterLine(runs.map((r) => r[1]).join(", ")) : t.noClusters}
          </p>
        </div>
      }
      primary={
        <div className="flex gap-2">
          <Button
            onClick={() => setCount((c) => Math.min(c + 1, M))}
            disabled={full}
            className="min-h-[44px] flex-1"
          >
            {full ? t.full : t.add}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCount((c) => Math.min(c + 4, M))}
            disabled={full}
            className="min-h-[44px]"
          >
            {t.addFour}
          </Button>
        </div>
      }
      secondary={
        <Button
          variant="secondary"
          onClick={() => {
            setSeed((s) => s + 1);
            setCount(0);
          }}
          className="min-h-[44px] w-full"
        >
          {t.restart}
        </Button>
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure
            label={t.figures.load}
            value={`${count} / ${M}`}
            hint={t.figures.loadHint(formatValue(count / M))}
          />
          <Figure
            label={t.figures.last}
            value={lastPath ? String(lastPath.probes) : "—"}
            hint={t.figures.lastHint}
            tone="accent"
          />
          <Figure
            label={t.figures.mean}
            value={count ? formatValue(mean(now.costs)) : "—"}
            hint={t.figures.meanHint}
          />
          <Figure label={t.figures.longest} value={String(longest)} />
        </>
      }
    />
  );
}
