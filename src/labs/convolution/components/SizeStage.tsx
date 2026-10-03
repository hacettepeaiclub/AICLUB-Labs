import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useLocalControls } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { grid, leftover, outputSize, windowStart } from "../engine";
import { GridView } from "./GridView";
import { Panel } from "./Panel";

const DEFAULTS = { n: 7, k: 3, p: 1, s: 2 };

/**
 * Section 4: how big the output is, counted rather than recited.
 *
 * Four numbers decide it — input n, kernel k, padding p, stride s — and the
 * formula ⌊(n + 2p − k)/s⌋ + 1 is written out with the visitor's own values
 * in it, beside the grid it describes. Clicking an output cell shows the
 * window that made it.
 *
 * The floor is not hidden. When the stride does not divide n + 2p − k, the
 * last cells of the padded input are never under any window, and they are
 * marked: frameworks compute exactly this and drop them without comment.
 */
export function SizeStage() {
  const t = useLabs().convolution.size;
  const [stored, save] = useLocalControls("acl:convolution:size", DEFAULTS);
  const n = clampInt(stored.n, 3, 10);
  const k = clampInt(stored.k, 1, 5);
  const p = clampInt(stored.p, 0, 2);
  const s = clampInt(stored.s, 1, 3);
  const o = outputSize(n, k, p, s);
  const extra = leftover(n, k, p, s);
  const [picked, setPicked] = useState({ x: 0, y: 0 });
  const sel = {
    x: Math.min(picked.x, Math.max(o - 1, 0)),
    y: Math.min(picked.y, Math.max(o - 1, 0)),
  };

  const input = useMemo(() => grid(n, n, 0.3), [n]);
  const output = useMemo(() => grid(Math.max(o, 0), Math.max(o, 0), 0), [o]);
  const reach = o > 0 ? (o - 1) * s + k : 0;
  const padded = n + 2 * p;
  const unreached = o > 0 ? padded * padded - reach * reach : padded * padded;

  const marks =
    o > 0 && extra > 0
      ? ([
          { x: reach - p, y: -p, w: padded - reach, h: padded, tone: "amber" },
          { x: -p, y: reach - p, w: reach, h: padded - reach, tone: "amber" },
        ] as const)
      : [];

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(o)}
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-4">
          <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start gap-4">
            <Panel label={t.input}>
              <GridView
                grid={input}
                kind="image"
                padding={p}
                marks={marks}
                window={
                  o > 0
                    ? { x: windowStart(sel.x, p, s), y: windowStart(sel.y, p, s), w: k, h: k }
                    : null
                }
                ariaLabel={t.inputLabel(n, p)}
              />
            </Panel>
            <Panel label={t.output}>
              {o > 0 ? (
                <div style={{ width: `${Math.min(100, (o / padded) * 100 * 1.5)}%` }}>
                  <GridView
                    grid={output}
                    kind="image"
                    selected={sel}
                    onCell={(x, y) => setPicked({ x, y })}
                    onArrow={(dx, dy) =>
                      setPicked({
                        x: Math.min(Math.max(sel.x + dx, 0), o - 1),
                        y: Math.min(Math.max(sel.y + dy, 0), o - 1),
                      })
                    }
                    ariaLabel={t.outputLabel(o, sel.x + 1, sel.y + 1)}
                  />
                </div>
              ) : (
                <p className="text-body-sm text-signal-amber">{t.noFit}</p>
              )}
            </Panel>
          </div>

          <div className="border-t border-line/10 pt-3">
            <p className="font-mono text-body-sm text-fg-muted">
              ⌊(n + 2p − k) / s⌋ + 1 = ⌊({n} + 2·{p} − {k}) / {s}⌋ + 1 ={" "}
              <span className="text-accent">{o}</span>
            </p>
            {o > 0 && extra > 0 && (
              <p className="mt-2 text-caption text-signal-amber">{t.leftover(extra)}</p>
            )}
          </div>
        </div>
      }
      primary={
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
          <LabSlider
            label={t.labels.n}
            value={n}
            min={3}
            max={10}
            onChange={(v) => save({ n: v })}
          />
          <LabSlider
            label={t.labels.k}
            value={k}
            min={1}
            max={5}
            onChange={(v) => save({ k: v })}
          />
          <LabSlider
            label={t.labels.p}
            value={p}
            min={0}
            max={2}
            onChange={(v) => save({ p: v })}
          />
          <LabSlider
            label={t.labels.s}
            value={s}
            min={1}
            max={3}
            onChange={(v) => save({ s: v })}
          />
        </div>
      }
      figures={
        <>
          <Figure label={t.figures.output} value={`${o} × ${o}`} tone="accent" />
          <Figure label={t.figures.windows} value={String(o * o)} />
          <Figure
            label={t.figures.unreached}
            value={String(unreached)}
            hint={t.figures.unreachedHint}
          />
        </>
      }
    />
  );
}

const clampInt = (v: number, lo: number, hi: number) => Math.min(Math.max(Math.round(v), lo), hi);
