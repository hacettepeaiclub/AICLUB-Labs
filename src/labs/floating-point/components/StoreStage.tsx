import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useDebouncedValue } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { absR, classify, decode, FORMATS, parseNumber, round, shortest, sub } from "../engine";
import { divergence, readable, relative } from "../view";
import { ExactDigits } from "./ExactDigits";
import { FloatField } from "./FloatField";

/**
 * The examples "Show me another" walks through, each chosen for what it shows:
 * a third with no end, a value that is exact, a whole number past 2^53 that
 * loses its last digit, 0.3 for the next section, a subnormal that keeps only
 * a few digits, and one too large for 64 bits.
 */
const EXAMPLES = ["0.1", "1/3", "0.5", "9007199254740993", "0.3", "1e-320", "1e309"];

/**
 * Section 1: a number goes in, and what is kept comes out.
 *
 * Nothing is named here but the format doing the work. The visitor types, and
 * the stored value appears beneath with the digits marked where it stops
 * agreeing — exact, every one of them, because `round` and `exactDecimal`
 * work on whole numbers. Under it, what the browser would print for that same
 * value, which is the second surprise: the console's 0.1 is not a claim that
 * the stored number is 0.1, only that no shorter decimal maps to it.
 */
export function StoreStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.store;
  const [text, setText] = useState("0.1");
  const [next, setNext] = useState(1);

  const view = useMemo(() => {
    const parsed = parseNumber(text);
    if (!parsed) return null;
    const stored = round(parsed, FORMATS.float64);
    const kind = classify(stored);
    const value = decode(stored);
    const typed = parsed.kind === "finite" ? parsed.value : null;
    const error = typed && value ? sub(value, typed) : null;
    return {
      parsed,
      stored,
      kind,
      typed,
      value,
      error,
      digits: typed && value ? divergence(typed, value) : null,
      printed: shortest(stored),
    };
  }, [text]);

  const settled = useDebouncedValue(view?.printed ?? "");

  const another = () => {
    setText(EXAMPLES[next % EXAMPLES.length] as string);
    setNext((n) => n + 1);
  };

  const overflow = view?.typed && view.kind === "infinity";
  const underflow = view?.typed && view.typed.num !== 0n && view.kind === "zero";
  const exact = view?.error && view.error.num === 0n;

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={settled ? t.announce(settled) : ""}
      viewport={
        <div className="space-y-3">
          <FloatField
            value={text}
            onChange={setText}
            label={t.inputLabel}
            error={view ? null : lab.invalid}
          />

          <div aria-hidden className="flex items-center gap-3">
            <span className="font-mono text-caption text-fg-faint">↓</span>
            <span className="text-overline uppercase text-accent">{t.format}</span>
            <span className="h-px flex-1 bg-line/10" />
          </div>

          {view && (
            <div className="rounded border border-line/10 bg-ink-950 p-4">
              <p className="text-overline uppercase text-fg-faint">{t.storedAs}</p>
              <div className="mt-2">
                {overflow ? (
                  <p className="text-body-sm text-signal-amber">{t.tooBig}</p>
                ) : underflow ? (
                  <p className="text-body-sm text-signal-amber">{t.tooSmall}</p>
                ) : view.kind === "nan" ? (
                  <p className="text-body-sm text-fg-muted">{t.notANumber}</p>
                ) : view.kind === "infinity" ? (
                  <p className="text-body-sm text-fg-muted">{t.infinity}</p>
                ) : view.digits ? (
                  <ExactDigits
                    text={view.digits.text}
                    from={view.digits.from}
                    showAll={lab.showAll}
                    showLess={lab.showLess}
                  />
                ) : null}
              </div>
              {exact && (
                <p className="mt-3 flex items-center gap-2 text-caption text-signal-green">
                  <span aria-hidden>✓</span>
                  {lab.storedExactly}
                </p>
              )}
              {view.kind !== "nan" && !overflow && !underflow && (
                <p className="mt-3 text-caption text-fg-muted">{t.prints(view.printed)}</p>
              )}
            </div>
          )}
        </div>
      }
      primary={
        <Button onClick={another} variant="secondary" className="min-h-[44px] w-full">
          {t.another}
        </Button>
      }
      figures={
        <>
          <Figure
            label={t.figures.offBy}
            value={view?.error ? readable(absR(view.error)) : "—"}
            tone={view?.error && view.error.num !== 0n ? "accent" : "default"}
          />
          <Figure
            label={t.figures.relative}
            value={
              view?.error && view.typed
                ? readable(relative(view.error, view.typed) ?? absR(view.error))
                : "—"
            }
          />
          <Figure label={t.figures.bits} value="64" hint={t.figures.bitsHint} />
        </>
      }
    />
  );
}
