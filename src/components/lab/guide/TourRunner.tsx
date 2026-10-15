import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { aimPoint, caretPoint, findTarget, perform, wait } from "./drive";
import { tourFor, type TourStep } from "./tours";

/**
 * The guided tour, as it runs: a dimmed page with the current control lit, a
 * cursor that moves to it and uses it, and a card that says what just
 * happened.
 *
 * Loaded only when a visitor asks for it, so a lab page that is never toured
 * pays nothing for it. Nothing here blocks the page: the visitor can scroll,
 * and can reach past the tour and use the lab at any point; the tour simply
 * follows whatever it is pointing at.
 */

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const sameBox = (a: Box | null, b: Box) =>
  a !== null &&
  Math.abs(a.left - b.left) < 0.5 &&
  Math.abs(a.top - b.top) < 0.5 &&
  Math.abs(a.width - b.width) < 0.5 &&
  Math.abs(a.height - b.height) < 0.5;

export interface TourRunnerProps {
  slug: string;
  root: HTMLElement;
  /** The stage to tour, or `null` for the lab's first experiment. */
  stage: HTMLElement | null;
  /** The sentence for each step, by stage and step id. */
  texts: Record<string, Record<string, string>>;
  onClose: () => void;
}

/**
 * Which of the lab's tours a stage gets, and where its targets are looked for.
 *
 * Tours are listed in the order their stages appear on the page, so a stage's
 * tour is the one at its position. A lab whose first experiment is not a
 * stage (the embedding lab opens with a guess) lists an `intro` tour, which
 * the header's button runs and no stage claims.
 */
function resolve(slug: string, root: HTMLElement, stage: HTMLElement | null) {
  const tours = tourFor(slug) ?? {};
  const keys = Object.keys(tours).filter((key) => key !== "intro");
  const stages = () => Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
  if (stage) {
    const key = keys[stages().indexOf(stage)];
    return { key, steps: key ? (tours[key] ?? []) : [], stageOf: () => stage };
  }
  if (tours.intro) return { key: "intro", steps: tours.intro, stageOf: () => root };
  const key = keys[0];
  return { key, steps: key ? (tours[key] ?? []) : [], stageOf: () => stages()[0] ?? null };
}

const NO_STEPS: readonly TourStep[] = [];

export default function TourRunner({ slug, root, stage, texts, onClose }: TourRunnerProps) {
  const [{ key, steps, stageOf }] = useState(() => resolve(slug, root, stage));
  const t = useT();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  // Where the cursor's tip sits on the element it has reached. Until it has
  // reached the current step's target it stays where it was.
  const [aim, setAim] = useState<{ el: HTMLElement; dx: number; dy: number } | null>(null);
  const [glide, setGlide] = useState(true);
  const [presses, setPresses] = useState(0);
  // Characters typed in this step: each one moves the text caret on.
  const [keystrokes, setKeystrokes] = useState(0);
  // It enters from the bottom of the window, where the card is on a phone.
  const lastPoint = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 120 });
  const nextRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(160);

  const step = (steps ?? NO_STEPS)[index];
  const last = index === steps.length - 1;

  // ---------------------------------------------------- run one step --
  useEffect(() => {
    if (!step) return;
    let dead = false;
    const cancelled = () => dead;
    void (async () => {
      setGlide(true);
      setKeystrokes(0);
      // The first step can arrive before the lab itself has loaded.
      const el = await findTarget(stageOf, root, step.target, cancelled, index === 0 ? 6000 : 2500);
      if (dead) return;
      setTarget(el);
      if (!el) return;
      el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
      await wait(reduced ? 0 : 500);
      if (dead) return;
      setAim({ el, ...aimPoint(el) });
      await wait(reduced ? 0 : 800);
      if (dead || !step.action) return;
      await perform(el, step.action, {
        reduced,
        cancelled,
        track: (dx, dy) => {
          setGlide(false);
          setAim({ el, dx, dy });
        },
        typed: () => setKeystrokes((n) => n + 1),
        press: async () => {
          setPresses((n) => n + 1);
          await wait(reduced ? 0 : 260);
        },
      });
      if (!dead) setGlide(true);
    })();
    return () => {
      dead = true;
    };
  }, [root, stageOf, step, index, reduced]);

  // ------------------------------------- follow the target as it moves --
  useEffect(() => {
    if (!target) {
      setBox(null);
      return;
    }
    let frame = 0;
    const tick = () => {
      const r = target.getBoundingClientRect();
      const next = { left: r.left, top: r.top, width: r.width, height: r.height };
      setBox((previous) => (sameBox(previous, next) ? previous : next));
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [target]);

  // ------------------------------------------------------- keyboard --
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // The card is where a keyboard is: each step hands it the focus.
  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, [index]);

  useLayoutEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight);
  }, [index, texts]);

  if (!step) return null;

  // ----------------------------------------------------------- layout --
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = vw < 640;
  const cardWidth = Math.min(352, vw - 32);

  let point = lastPoint.current;
  if (aim && aim.el === target && box) point = { x: box.left + aim.dx, y: box.top + aim.dy };
  lastPoint.current = point;

  const pad = 8;
  let card: { left: number; top: number } | null = null;
  if (!narrow) {
    const below = box ? box.top + box.height + pad + 12 : vh;
    const above = box ? box.top - pad - 12 - cardHeight : -1;
    const left = Math.min(
      Math.max(16, box ? box.left + box.width / 2 - cardWidth / 2 : vw / 2 - cardWidth / 2),
      vw - cardWidth - 16,
    );
    if (box && below + cardHeight < vh - 16) card = { left, top: below };
    else if (box && above > 16) card = { left, top: above };
    else card = { left: vw - cardWidth - 24, top: vh - cardHeight - 24 };
  }

  const text = (key && texts[key]?.[step.id]) ?? "";

  // The mouse is shown only where a visitor would use one: to click, or to
  // drag a slider. Pointing needs no hand, and typing needs a caret.
  const kind = step.action?.kind;
  const mouse = kind === "click" || kind === "slide";
  const arrived = aim !== null && aim.el === target;

  // The text caret, at the end of whatever is in the field, once the tour has
  // reached it. Re-measured on every keystroke and every move of the field.
  const field =
    kind === "type" &&
    arrived &&
    box &&
    (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      ? target
      : null;
  const caret = field ? caretPoint(field) : null;

  return createPortal(
    <>
      {/* The lit control, and the page dimmed around it. */}
      {box && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none fixed z-[60] rounded-card ring-2 ring-accent",
            !reduced && "transition-[left,top,width,height] duration-300 ease-out",
          )}
          style={{
            left: box.left - pad,
            top: box.top - pad,
            width: box.width + pad * 2,
            height: box.height + pad * 2,
            boxShadow: "0 0 0 100vmax rgb(var(--ink-950) / 0.62)",
          }}
        />
      )}

      {/* The ghost cursor. Its tip is the point; the arrow is drawn from there. */}
      {
        <div
          aria-hidden
          className="guide-cursor pointer-events-none fixed left-0 top-0 z-[80]"
          style={{
            transform: `translate(${point.x}px, ${point.y}px)`,
            opacity: mouse ? 1 : 0,
            transition: reduced
              ? "none"
              : glide
                ? "transform 0.75s cubic-bezier(0.22, 0.8, 0.24, 1), opacity 0.2s"
                : "opacity 0.2s",
          }}
        >
          {presses > 0 && <span key={presses} className="guide-ripple" />}
          <svg
            key={`press-${presses}`}
            width="26"
            height="26"
            viewBox="0 0 26 26"
            className={cn("guide-arrow", presses > 0 && "is-pressing")}
          >
            <path
              d="M3 2 L3 20.5 L8.2 15.8 L11.8 23.4 L15 22 L11.5 14.6 L18.2 14.6 Z"
              className="fill-fg stroke-ink-950"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      }

      {caret && (
        <span
          aria-hidden
          // Restarted on every keystroke, so it holds still while typing and
          // blinks once the typing stops, as a real caret does.
          key={keystrokes}
          className="guide-caret pointer-events-none fixed z-[80] w-0.5 rounded-pill bg-accent"
          style={{ left: caret.x, top: caret.y, height: caret.height }}
        />
      )}

      {/* What this step is about. */}
      <div
        ref={cardRef}
        role="dialog"
        aria-label={t.guide.tourLabel}
        className={cn(
          "fixed z-[70] rounded-card border border-line/15 bg-ink-800 p-4 shadow-card-hover",
          narrow ? "inset-x-4 bottom-4" : "",
          !reduced && !narrow && "transition-[left,top] duration-300 ease-out",
        )}
        style={narrow || !card ? undefined : { left: card.left, top: card.top, width: cardWidth }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-overline uppercase text-fg-faint">
            {t.guide.tourLabel} · {t.guide.progress(index + 1, steps.length)}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.guide.close}
            className="-mr-2 grid size-9 place-items-center rounded text-fg-muted transition-colors
              duration-fast hover:bg-line/10 hover:text-fg"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <p aria-live="polite" className="mt-1 text-body-sm text-fg">
          {text}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div aria-hidden className="flex gap-1">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={cn("size-1.5 rounded-pill", i === index ? "bg-accent" : "bg-line/20")}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setIndex((i) => i - 1)}>
                {t.guide.back}
              </Button>
            )}
            <Button
              ref={nextRef}
              size="sm"
              onClick={() => (last ? onClose() : setIndex((i) => i + 1))}
            >
              {last ? t.guide.done : t.guide.next}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
