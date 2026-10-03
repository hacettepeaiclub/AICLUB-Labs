import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Figure, Stage } from "@/components/lab";
import { useDebouncedValue } from "@/hooks";
import { useLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import {
  bias,
  classify,
  decode,
  exactDecimal,
  FORMATS,
  fromBits,
  parseNumber,
  rational,
  round,
  shortest,
  toBits,
} from "../engine";
import { powerOfTwo } from "../view";
import { ExactDigits } from "./ExactDigits";
import { FloatField } from "./FloatField";

const F32 = FORMATS.float32;
const E = F32.exponentBits;
const BIAS = bias(F32);

type Field = "sign" | "exponent" | "fraction";

/** One colour per field, used only once the fields have names. */
const FILLED: Record<Field, string> = {
  sign: "bg-signal-rose text-ink-950 border-signal-rose",
  exponent: "bg-signal-amber text-ink-950 border-signal-amber",
  fraction: "bg-accent text-ink-950 border-accent",
};
const EMPTY: Record<Field, string> = {
  sign: "border-signal-rose/50",
  exponent: "border-signal-amber/50",
  fraction: "border-accent/50",
};

/**
 * Section 3: the 32 bits of a float32, each one a button.
 *
 * ## Show, then name
 *
 * The bits start as a plain row with gaps where the fields divide, and no
 * labels. The first flip is the visitor's own: one bit doubles or halves the
 * number, another barely moves it. Only then do the three groups get their
 * names and their colours — sign, exponent, fraction — and the formula that
 * reads them. By then the names describe something already seen.
 *
 * Colour is never the only carrier: every group has a text label, every bit
 * shows its 0 or 1, and a set bit is filled where a clear one is an outline.
 *
 * ## Keyboard
 *
 * The row is one tab stop. The arrow keys, Home and End move along it, and
 * Space or Enter flips the focused bit — a roving tabindex, so reaching the
 * value below does not take 32 presses of Tab.
 */
export function BitsStage() {
  const lab = useLabs()["floating-point"];
  const t = lab.bits;
  const [bits, setBits] = useState(() => toBits(round(rational(1n, 10n), F32)));
  const [named, setNamed] = useState(false);
  const [focus, setFocus] = useState(1);
  const [text, setText] = useState("0.1");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const x = useMemo(() => fromBits(bits, F32), [bits]);
  const kind = classify(x);
  const value = decode(x);
  const printed = shortest(x);
  const settled = useDebouncedValue(`${printed}|${kind}`);

  const flip = (i: number) => {
    setBits((current) => current.map((b, j) => (j === i ? ((1 - b) as 0 | 1) : b)));
    setNamed(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const to =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? Math.min(31, i + 1)
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? Math.max(0, i - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? 31
              : null;
    if (to === null) return;
    event.preventDefault();
    setFocus(to);
    refs.current[to]?.focus();
  };

  const setFromText = (next: string) => {
    setText(next);
    const parsed = parseNumber(next);
    if (parsed) {
      setBits(toBits(round(parsed, F32)));
      setNamed(true);
    }
  };

  const groups: { field: Field; from: number; to: number }[] = [
    { field: "sign", from: 0, to: 1 },
    { field: "exponent", from: 1, to: 1 + E },
    { field: "fraction", from: 1 + E, to: 32 },
  ];

  const fractionBits = bits.slice(1 + E).join("");
  const scale = kind === "subnormal" ? 1 - BIAS : x.exponent - BIAS;

  return (
    <Stage
      width="full"
      // Under the bits, not beside them: the row is the instrument, and a
      // rail would fold the 23 fraction bits onto three lines.
      controls="stack"
      caption={t.caption}
      announcement={settled ? t.announce(printed, lab.kinds[kind]) : ""}
      viewport={
        <div className="space-y-5">
          <div
            role="group"
            aria-label={t.groupLabel}
            className="flex flex-wrap items-end gap-x-4 gap-y-3"
          >
            {groups.map(({ field, from, to }) => (
              <div key={field} className={cn("min-w-0", field === "fraction" && "flex-1")}>
                <p
                  className={cn(
                    "mb-1.5 text-overline uppercase transition-opacity duration-base",
                    named ? "opacity-100" : "opacity-0",
                    field === "sign"
                      ? "text-signal-rose"
                      : field === "exponent"
                        ? "text-signal-amber"
                        : "text-accent",
                  )}
                  aria-hidden={!named}
                >
                  {t.fields[field]}
                </p>
                <div className="flex flex-wrap gap-1">
                  {bits.slice(from, to).map((bit, k) => {
                    const i = from + k;
                    return (
                      <button
                        key={i}
                        ref={(el) => {
                          refs.current[i] = el;
                        }}
                        type="button"
                        tabIndex={i === focus ? 0 : -1}
                        aria-pressed={bit === 1}
                        aria-label={t.bitLabel(i + 1, t.fields[field], bit)}
                        onClick={() => {
                          setFocus(i);
                          flip(i);
                        }}
                        onKeyDown={(event) => onKeyDown(event, i)}
                        className={cn(
                          "grid size-10 place-items-center rounded-[3px] border font-mono text-caption",
                          "transition-colors duration-fast sm:size-8 lg:size-6 lg:text-[10px]",
                          bit === 1
                            ? named
                              ? FILLED[field]
                              : "border-accent bg-accent text-ink-950"
                            : cn(
                                "bg-ink-950 text-fg-faint",
                                named ? EMPTY[field] : "border-line/25",
                              ),
                        )}
                      >
                        {bit}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {named ? (
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-fg-muted">
              {(["sign", "exponent", "fraction"] as const).map((field) => (
                <span key={field}>
                  <span
                    className={
                      field === "sign"
                        ? "text-signal-rose"
                        : field === "exponent"
                          ? "text-signal-amber"
                          : "text-accent"
                    }
                  >
                    {t.fields[field]}
                  </span>
                  {": "}
                  {t.fieldNotes[field]}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-caption text-fg-muted">{t.hint}</p>
          )}

          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="font-mono text-display-md text-fg">{printed}</p>
            {value && (kind === "normal" || kind === "subnormal") && (
              <ExactDigits
                text={exactDecimal(value) ?? ""}
                from={null}
                showAll={lab.showAll}
                showLess={lab.showLess}
                className="mt-2 text-fg-muted"
              />
            )}

            {named && (
              <div className="mt-4 border-t border-line/10 pt-3">
                {kind === "normal" || kind === "subnormal" ? (
                  <p className="break-all font-mono text-body-sm leading-relaxed">
                    <span className="text-overline uppercase text-fg-faint">{t.formula}</span>{" "}
                    <span className="text-signal-rose">{x.sign === 1 ? "−" : "+"}</span>{" "}
                    <span className="text-accent">
                      {kind === "normal" ? "1." : "0."}
                      {fractionBits}
                      <sub>2</sub>
                    </span>{" "}
                    <span className="text-fg-muted">×</span>{" "}
                    <span className="text-signal-amber">{powerOfTwo(scale)}</span>
                  </p>
                ) : null}
                {kind !== "normal" && (
                  <p className="mt-2 text-caption text-fg-muted">{t.specials[kind]}</p>
                )}
                {kind === "normal" && <p className="mt-2 text-caption text-fg-muted">{t.named}</p>}
              </div>
            )}
          </div>
        </div>
      }
      primary={
        <FloatField
          value={text}
          onChange={setFromText}
          label={t.setLabel}
          error={parseNumber(text) ? null : lab.invalid}
        />
      }
      figures={
        <>
          <Figure label={t.figures.value} value={printed} tone="accent" />
          <Figure
            label={t.figures.power}
            value={kind === "normal" || kind === "subnormal" ? powerOfTwo(scale) : "—"}
            // Only for normal numbers: a subnormal's scale is fixed at 2⁻¹²⁶, not
            // its field (0) minus the bias.
            hint={kind === "normal" ? t.figures.powerHint(x.exponent) : undefined}
          />
          <Figure label={t.figures.kind} value={lab.kinds[kind]} />
        </>
      }
    />
  );
}
