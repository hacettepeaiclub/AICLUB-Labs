import { useMemo } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { floorMod, gcd } from "../engine";
import { formatValue } from "../view";

const KEYS = 32;

/**
 * Section 6: a good table can still be given bad keys.
 *
 * Keys that share a step — IDs 0, 8, 16, …, prices in tens, addresses
 * aligned to 64 — are common, and the remainder by m sees only the part of
 * the step that m does not cancel. They land in exactly m / gcd(step, m)
 * buckets, every time, however random the rest of the table is. A power of
 * two with an even step is the worst case; a prime m has no factor to share.
 *
 * This is why `HashMap`, whose sizes are always powers of two, mixes a
 * hash's high bits into its low ones before taking the bucket.
 */
export function ModulusStage() {
  const t = useLabs()["hash-table"].modulus;
  const [stored, save] = useLocalControls("acl:hash-table:modulus", { m: 16, step: 8 });
  const m = Math.min(Math.max(Math.round(stored.m), 8), 32);
  const step = Math.min(Math.max(Math.round(stored.step), 1), 12);

  const counts = useMemo(() => {
    const c = new Array<number>(m).fill(0);
    for (let i = 0; i < KEYS; i++) {
      const b = floorMod(i * step, m);
      c[b] = (c[b] ?? 0) + 1;
    }
    return c;
  }, [m, step]);
  const used = counts.filter((c) => c > 0).length;
  const most = Math.max(...counts);
  const g = gcd(step, m);

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(used, m, most)}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-overline uppercase text-fg-faint">{t.keysLine(step, KEYS)}</p>
          <ol
            aria-label={t.chartLabel(m, used, most)}
            className="mt-3 flex h-40 items-end gap-[2px]"
          >
            {counts.map((c, b) => (
              <li key={b} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                <span
                  className={cn("block rounded-t-sm", c > 0 ? "bg-accent" : "bg-fg/10")}
                  style={{ height: c > 0 ? `${(c / KEYS) * 100}%` : "2px" }}
                />
              </li>
            ))}
          </ol>
          <div className="mt-1 flex justify-between font-mono text-caption text-fg-faint">
            <span>0</span>
            <span>{t.axis}</span>
            <span>{m - 1}</span>
          </div>
          <p className="mt-3 font-mono text-body-sm text-fg-muted">
            {m} / gcd({step}, {m}) = {m} / {g} = <span className="text-accent">{m / g}</span>
          </p>
        </div>
      }
      primary={
        <div className="space-y-4">
          <LabSlider label={t.mLabel} value={m} min={8} max={32} onChange={(v) => save({ m: v })} />
          <LabSlider
            label={t.stepLabel}
            value={step}
            min={1}
            max={12}
            onChange={(v) => save({ step: v })}
          />
        </div>
      }
      figures={
        <>
          <Figure label={t.figures.used} value={`${used} / ${m}`} tone="accent" />
          <Figure
            label={t.figures.most}
            value={String(most)}
            hint={t.figures.mostHint(formatValue(KEYS / m))}
          />
        </>
      }
    />
  );
}
