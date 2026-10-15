import type { TourAction, TourTarget } from "./tours";

/**
 * The tour's hands: find the thing a step points at, and do to it what a
 * visitor would. Kept apart from the component so the timing and the
 * rendering are not tangled up with how a slider is dragged.
 */

const visible = (el: Element) => el.getClientRects().length > 0;

/** Every match of a target, in document order. */
function candidates(stage: HTMLElement, lab: HTMLElement, target: TourTarget): HTMLElement[] {
  let scopes: HTMLElement[] = [target.inLab ? lab : stage];
  if (target.part) {
    // Only this stage's own parts, not those of a stage nested in it.
    scopes = scopes.flatMap((scope) =>
      Array.from(scope.querySelectorAll<HTMLElement>(`[data-stage-part="${target.part}"]`)),
    );
    // A stage's secondary controls are written twice, once in a disclosure
    // for narrow screens and once in the rail: only one is ever shown.
    const shown = scopes.filter(visible);
    if (shown.length > 0) scopes = shown;
  }
  if (!target.select) return scopes;
  const select = target.select;
  return scopes.flatMap((scope) => Array.from(scope.querySelectorAll<HTMLElement>(select)));
}

/**
 * The element a step points at, once it exists.
 *
 * A step can point at something the step before it brought about (the host
 * opens a door, then the stay and switch buttons appear), and a tour started
 * from the welcome can begin before the lab has loaded, so this waits for its
 * target rather than failing on the first look.
 */
export async function findTarget(
  stageOf: () => HTMLElement | null,
  lab: HTMLElement,
  target: TourTarget,
  cancelled: () => boolean,
  timeout = 2500,
): Promise<HTMLElement | null> {
  const started = performance.now();
  for (;;) {
    const stage = stageOf();
    const all = stage ? candidates(stage, lab, target) : [];
    const shown = all.filter(visible);
    // A control inside a closed disclosure is still the right control: open it.
    const pool = shown.length > 0 ? shown : all;
    // Counted from the end when negative: -1 is the last match.
    const nth = target.nth ?? 0;
    const el = pool[nth < 0 ? pool.length + nth : nth];
    if (el) {
      openDisclosures(el);
      return el;
    }
    if (cancelled() || performance.now() - started > timeout) return null;
    await wait(100);
  }
}

function openDisclosures(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    if (node instanceof HTMLDetailsElement && !node.open) node.open = true;
  }
}

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Where on the target the cursor's tip goes, relative to its top-left
 * corner: a slider's thumb, a field's text, otherwise the middle.
 */
export function aimPoint(el: HTMLElement, fraction?: number): { dx: number; dy: number } {
  const rect = el.getBoundingClientRect();
  if (el instanceof HTMLInputElement && el.type === "range") {
    const span = Number(el.max) - Number(el.min) || 1;
    const at = fraction ?? (Number(el.value) - Number(el.min)) / span;
    return { dx: 8 + at * Math.max(0, rect.width - 16), dy: rect.height / 2 };
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return { dx: Math.min(rect.width - 12, 48), dy: Math.min(rect.height / 2, 22) };
  }
  // A big region (a whole viewport) is pointed at, not into: a cursor in the
  // middle of a chart covers the thing being explained.
  if (rect.height > 160) return { dx: rect.width * 0.5, dy: Math.min(rect.height * 0.35, 120) };
  return { dx: rect.width / 2, dy: rect.height / 2 };
}

/**
 * Set a field's value the way typing does.
 *
 * React keeps its own record of an input's value and ignores an `input` event
 * whose value it already knows, so the value is set through the prototype's
 * setter, under React's own, before the event is sent.
 */
function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export interface Hands {
  /** Move the cursor's tip to this point on the target, without gliding. */
  track: (dx: number, dy: number) => void;
  /** A character has just been typed: the text caret moves on. */
  typed: () => void;
  /** The press: a ring, and the cursor dipping. */
  press: () => Promise<void>;
  cancelled: () => boolean;
  reduced: boolean;
}

export async function perform(el: HTMLElement, action: TourAction, hands: Hands): Promise<void> {
  switch (action.kind) {
    case "point":
      return;

    case "click": {
      // A button can be disabled for a moment while the lab gets ready
      // (the tokenizer is still training, say).
      const started = performance.now();
      while (el instanceof HTMLButtonElement && el.disabled && performance.now() - started < 2500) {
        if (hands.cancelled()) return;
        await wait(100);
      }
      await hands.press();
      if (hands.cancelled()) return;
      // Targets are typed as HTML, but a stage can draw its controls in SVG,
      // and an SVG node has no click(): it gets the event a click would send.
      const node: Element = el;
      if (node instanceof HTMLElement) node.click();
      else node.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      return;
    }

    case "keys":
      await hands.press();
      for (const key of action.keys) {
        if (hands.cancelled()) return;
        el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
        await wait(hands.reduced ? 0 : 260);
      }
      return;

    case "slide": {
      if (!(el instanceof HTMLInputElement)) return;
      const min = Number(el.min);
      const max = Number(el.max);
      const step = Number(el.step) || 1;
      const from = Number(el.value);
      const to = min + action.to * (max - min);
      const frames = hands.reduced ? 1 : 24;
      await hands.press();
      for (let i = 1; i <= frames; i++) {
        if (hands.cancelled()) return;
        const raw = from + ((to - from) * i) / frames;
        const value = Math.round((raw - min) / step) * step + min;
        setValue(el, String(value));
        const { dx, dy } = aimPoint(el, (value - min) / (max - min || 1));
        hands.track(dx, dy);
        await wait(hands.reduced ? 0 : 30);
      }
      return;
    }

    case "type": {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
      const start = action.replace ? "" : el.value;
      if (action.replace) {
        setValue(el, "");
        hands.typed();
      }
      if (hands.reduced) {
        setValue(el, start + action.text);
        hands.typed();
        return;
      }
      // One letter at a time, at an uneven pace, as a person types.
      for (let i = 1; i <= action.text.length; i++) {
        if (hands.cancelled()) return;
        await wait(i === 1 ? 300 : 90 + Math.random() * 110);
        setValue(el, start + action.text.slice(0, i));
        hands.typed();
      }
      return;
    }
  }
}

/**
 * Where the end of a field's text is on screen, for the tour's text caret.
 *
 * A field that is not focused draws no caret, and focusing it to borrow the
 * real one would open the keyboard on a phone and take the focus from the
 * tour's card. So the text is laid out again in an invisible copy of the
 * field, with the same font and padding, and the end of it measured there.
 */
export function caretPoint(el: HTMLInputElement | HTMLTextAreaElement): {
  x: number;
  y: number;
  height: number;
} {
  const style = getComputedStyle(el);
  const mirror = document.createElement("div");
  for (const name of [
    "boxSizing",
    "width",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderStyle",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "lineHeight",
    "textTransform",
    "wordSpacing",
    "tabSize",
  ] as const) {
    mirror.style[name] = style[name];
  }
  Object.assign(mirror.style, {
    position: "fixed",
    left: "0",
    top: "0",
    visibility: "hidden",
    overflow: "hidden",
    whiteSpace: el instanceof HTMLTextAreaElement ? "pre-wrap" : "pre",
    overflowWrap: "break-word",
  });
  mirror.textContent = el.value;
  const marker = document.createElement("span");
  marker.textContent = "​";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);
  const at = marker.getBoundingClientRect();
  const origin = mirror.getBoundingClientRect();
  mirror.remove();

  const rect = el.getBoundingClientRect();
  const fontSize = parseFloat(style.fontSize) || 16;
  const height = parseFloat(style.lineHeight) || fontSize * 1.2;
  const x = Math.min(
    rect.left + (at.left - origin.left) - el.scrollLeft,
    rect.right - (parseFloat(style.paddingRight) || 0),
  );
  // A single-line field centres its line; a textarea starts at the top.
  const y =
    el instanceof HTMLInputElement
      ? rect.top + (rect.height - height) / 2
      : rect.top + (at.top - origin.top) - el.scrollTop;
  return { x, y, height };
}
