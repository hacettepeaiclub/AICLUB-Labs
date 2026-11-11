import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { DisplayModel } from "../engine/machine";
import type { ModelSpec } from "../engine/models";
import type { KeyDef, KeyId } from "../engine/types";
import { CalcScreen } from "./CalcScreen";
import "./calculator.css";

/**
 * The calculator: its screen and its keyboard, laid out the way the real
 * model's keys are, so a key found here is in the same place on the device.
 *
 * The labels above a key are what it does after SHIFT (amber) or ALPHA
 * (rose), the two colours the real keyboards use for them. Only the ones the
 * simulation actually performs are printed: a label that did nothing would be
 * a promise this page cannot keep.
 *
 * Styled by `calculator.css`, which loads with this page only.
 */

/** Physical keys and the calculator keys they press. */
export const KEYBOARD: Record<string, KeyId> = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  ".": "dot",
  ",": "dot",
  "+": "plus",
  "-": "minus",
  "*": "times",
  "/": "divide",
  "(": "lp",
  ")": "rp",
  "^": "pow",
  "=": "eq",
  Enter: "eq",
  Backspace: "del",
  Escape: "ac",
  Delete: "ac",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export interface CalcDeviceProps {
  model: ModelSpec;
  view: DisplayModel;
  /** The key a lesson wants next; it is lit. */
  target: KeyId | null;
  onKey: (key: KeyId) => void;
  label: string;
}

export function CalcDevice({ model, view, target, onKey, label }: CalcDeviceProps) {
  const typing = useRef(false);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === "Tab") typing.current = false;
    // Enter or Space on a focused key is that key's own click.
    if (
      (event.key === " " || (event.key === "Enter" && !typing.current)) &&
      (event.target as HTMLElement).tagName === "BUTTON"
    ) {
      return;
    }
    // The MS has a comma key of its own; elsewhere a comma is a decimal point.
    const hasComma = model.functionRows.flat().some((def) => def.id === "comma");
    const key = event.key === "," && hasComma ? "comma" : KEYBOARD[event.key];
    if (!key) return;
    typing.current = true;
    event.preventDefault();
    onKey(key);
  };

  const keyProps = { onKey, target, view };

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="calc-device mx-auto w-full border border-line/20 bg-ink-900"
    >
      <div lang="en" className="mb-2 flex items-baseline justify-between gap-2 px-1 font-mono">
        <span className="text-caption font-semibold text-fg">{model.name}</span>
        <span className="truncate text-overline uppercase text-fg-faint">{model.series}</span>
      </div>

      <CalcScreen view={view} />

      <div className="calc-top">
        <div className="calc-pair">
          {model.top.map(([a, b], row) =>
            [a, b].map((def, i) =>
              def ? <Key key={def.id} def={def} {...keyProps} /> : <span key={`gap-${row}-${i}`} />,
            ),
          )}
        </div>
        <CursorPad onKey={onKey} target={target} ok={!!model.okKey} />
        <div className="calc-pair">
          {model.top.map(([, , c, d], row) =>
            [c, d].map((def, i) =>
              def ? <Key key={def.id} def={def} {...keyProps} /> : <span key={`gap-${row}-${i}`} />,
            ),
          )}
        </div>
      </div>

      <div className="calc-functions">
        {model.functionRows.flat().map((def) => (
          <Key key={def.id} def={def} {...keyProps} />
        ))}
      </div>

      <div className="calc-digits">
        {model.digitRows.flat().map((def) => (
          <Key key={def.id} def={def} {...keyProps} />
        ))}
      </div>
    </div>
  );
}

function Key({
  def,
  onKey,
  target,
  view,
}: {
  def: KeyDef;
  onKey: (key: KeyId) => void;
  target: KeyId | null;
  view: DisplayModel;
}) {
  const on = (def.id === "shift" && view.shift) || (def.id === "alpha" && view.alpha);
  const name = [def.label, def.shift && `SHIFT: ${def.shift}`, def.alpha && `ALPHA: ${def.alpha}`]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="flex min-w-0 flex-col">
      <span aria-hidden className="calc-legend">
        {def.shift && <span className="text-signal-amber">{def.shift}</span>}
        {def.alpha && <span className="text-signal-rose">{def.alpha}</span>}
      </span>
      <button
        type="button"
        data-key={def.id}
        data-tone={def.tone ?? "function"}
        data-long={def.label.length > 2 || undefined}
        aria-label={name}
        aria-pressed={def.tone === "modifier" ? on : undefined}
        onClick={() => onKey(def.id)}
        className={cn("calc-key", target === def.id && "calc-target")}
      >
        {def.label}
      </button>
    </div>
  );
}

const PAD: { id: KeyId; label: string }[] = [
  { id: "up", label: "▲" },
  { id: "left", label: "◀" },
  { id: "right", label: "▶" },
  { id: "down", label: "▼" },
];

/** The REPLAY pad between the top rows: four arrows round a disc, and OK in the middle on the CW. */
function CursorPad({
  onKey,
  target,
  ok,
}: {
  onKey: (key: KeyId) => void;
  target: KeyId | null;
  ok: boolean;
}) {
  return (
    <div className="calc-pad">
      {ok && (
        <button
          type="button"
          data-key="ok"
          aria-label="OK"
          onClick={() => onKey("ok")}
          className={cn(target === "ok" && "calc-target")}
        >
          OK
        </button>
      )}
      {PAD.map((arrow) => (
        <button
          key={arrow.id}
          type="button"
          data-key={arrow.id}
          aria-label={arrow.id}
          onClick={() => onKey(arrow.id)}
          className={cn(target === arrow.id && "calc-target")}
        >
          {arrow.label}
        </button>
      ))}
    </div>
  );
}
