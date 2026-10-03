import { useMemo, useState } from "react";
import { Stage } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useDebouncedValue } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  absR,
  classify,
  decode,
  FORMATS,
  largestFinite,
  parseNumber,
  round,
  smallestSubnormal,
  sub,
  totalBits,
  type FloatFormat,
} from "../engine";
import { decimalDigits, divergence, readable } from "../view";
import { ExactDigits } from "./ExactDigits";
import { FloatField } from "./FloatField";

type Preset = "weight" | "gradient" | "activation" | "third";

/**
 * Four values a network actually holds. The gradient sits below half of
 * float16's smallest subnormal (≈ 2.98 × 10⁻⁸), so float16 rounds it to zero;
 * the activation is past float16's largest finite value, 65504.
 */
const PRESETS: Record<Preset, string> = {
  weight: "0.0012345",
  gradient: "0.00000002",
  activation: "70000",
  third: "1/3",
};

const ORDER = [FORMATS.float64, FORMATS.float32, FORMATS.float16, FORMATS.bfloat16] as const;

/**
 * Section 6: the same number in four formats, for the reason AI cares.
 *
 * ## Why the exact stored value and not the shortest print
 *
 * Every other section shows what the browser would print beside the stored
 * value. This one deliberately does not. bfloat16 stores 70000 as 70144 —
 * and the shortest decimal that reads back as 70144 in bfloat16 is "70000",
 * because 70000 rounds there too. Printed that way the row would look exact
 * while being off by 144, which is the very thing the section exists to show.
 */
export function FormatsStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.formats;
  const [preset, setPreset] = useState<Preset>("gradient");
  const [text, setText] = useState(PRESETS.gradient);
  const parsed = parseNumber(text);

  const rows = useMemo(() => {
    const parsed = parseNumber(text);
    if (!parsed) return null;
    return ORDER.map((format) => {
      const stored = round(parsed, format);
      const kind = classify(stored);
      const value = decode(stored);
      const typed = parsed.kind === "finite" ? parsed.value : null;
      let status: string;
      let tone: "exact" | "rounded" | "lost" | "special";
      if (!typed) {
        status = t.status.special;
        tone = "special";
      } else if (kind === "infinity") {
        status = t.status.overflow;
        tone = "lost";
      } else if (kind === "zero" && typed.num !== 0n) {
        status = t.status.underflow;
        tone = "lost";
      } else {
        const error = sub(value!, typed);
        status = error.num === 0n ? t.status.exact : t.status.rounded(readable(absR(error)));
        tone = error.num === 0n ? "exact" : "rounded";
      }
      const digits = typed && value && kind !== "zero" ? divergence(typed, value) : null;
      return { format, kind, digits, status, tone };
    });
  }, [text, t]);

  const summary = rows ? rows.map((r) => `${r.format.id}: ${r.status}`).join("; ") : "";
  const settled = useDebouncedValue(summary);

  return (
    <Stage
      width="full"
      caption={t.caption}
      announcement={settled}
      viewport={
        <div className="space-y-4">
          <FloatField
            value={text}
            onChange={setText}
            label={t.inputLabel}
            error={parsed ? null : lab.invalid}
            compact
          />

          {rows && (
            <ul className="divide-y divide-line/5 rounded border border-line/10 bg-ink-950">
              {rows.map((row) => (
                <li
                  key={row.format.id}
                  className="grid gap-3 px-4 py-4 md:grid-cols-[9rem_minmax(0,1fr)] md:items-start"
                >
                  <div>
                    <p className="font-mono text-body-sm font-medium text-fg">{row.format.id}</p>
                    <Layout
                      format={row.format}
                      label={t.layout(row.format.exponentBits, row.format.fractionBits)}
                    />
                  </div>
                  <div className="min-w-0">
                    {row.digits ? (
                      <ExactDigits
                        text={row.digits.text}
                        from={row.digits.from}
                        showAll={lab.showAll}
                        showLess={lab.showLess}
                      />
                    ) : (
                      <p className="font-mono text-body-sm text-fg-muted">
                        {row.kind === "infinity" ? "Infinity" : row.kind === "nan" ? "NaN" : "0"}
                      </p>
                    )}
                    <p
                      className={cn(
                        "mt-2 flex items-start gap-2 text-caption",
                        row.tone === "exact" && "text-signal-green",
                        row.tone === "rounded" && "text-fg-muted",
                        row.tone === "lost" && "text-signal-amber",
                        row.tone === "special" && "text-fg-muted",
                      )}
                    >
                      <span aria-hidden>
                        {row.tone === "exact" ? "✓" : row.tone === "lost" ? "!" : "≈"}
                      </span>
                      {row.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-caption">
              <caption className="pb-2 text-left text-overline uppercase text-fg-faint">
                {t.table.caption}
              </caption>
              <thead className="text-fg-faint">
                <tr>
                  <th scope="col" className="py-1.5 pr-4 font-normal">
                    {t.table.format}
                  </th>
                  <th scope="col" className="py-1.5 pr-4 font-normal">
                    {t.table.bits}
                  </th>
                  <th scope="col" className="py-1.5 pr-4 font-normal">
                    {t.table.largest}
                  </th>
                  <th scope="col" className="py-1.5 pr-4 font-normal">
                    {t.table.smallest}
                  </th>
                  <th scope="col" className="py-1.5 font-normal">
                    {t.table.digits}
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono text-fg-muted">
                {ORDER.map((format) => (
                  <tr key={format.id} className="border-t border-line/5">
                    <th scope="row" className="py-1.5 pr-4 font-normal text-fg">
                      {format.id}
                    </th>
                    <td className="py-1.5 pr-4">{totalBits(format)}</td>
                    <td className="py-1.5 pr-4">{readable(largestFinite(format))}</td>
                    <td className="py-1.5 pr-4">{readable(smallestSubnormal(format))}</td>
                    <td className="py-1.5">≈ {decimalDigits(format).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-caption text-fg-faint">{t.bfloatNote}</p>
        </div>
      }
      primary={
        <Segmented
          label={t.examplesLabel}
          value={preset}
          options={(Object.keys(PRESETS) as Preset[]).map((p) => ({
            value: p,
            label: t.examples[p],
          }))}
          onChange={(p) => {
            setPreset(p);
            setText(PRESETS[p]);
          }}
        />
      }
    />
  );
}

/** The layout of a format: sign, exponent and fraction, to scale. */
function Layout({ format, label }: { format: FloatFormat; label: string }) {
  const total = totalBits(format);
  return (
    <div className="mt-2" role="img" aria-label={label}>
      <div className="flex h-2 w-full max-w-[10rem] overflow-hidden rounded-sm">
        <span className="bg-signal-rose" style={{ width: `${(1 / total) * 100}%` }} />
        <span
          className="bg-signal-amber"
          style={{ width: `${(format.exponentBits / total) * 100}%` }}
        />
        <span className="bg-accent" style={{ width: `${(format.fractionBits / total) * 100}%` }} />
      </div>
      <p aria-hidden className="mt-1 font-mono text-[11px] text-fg-faint">
        1 · {format.exponentBits} · {format.fractionBits}
      </p>
    </div>
  );
}
