import "./LabExperience.css";
import { useEffect, useId, useState, type RefObject } from "react";
import { useLanguage } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui";
import { journeys } from "./journeyCopy";
import { useJourneySlug } from "./journeyContext";

function reveal(element: HTMLElement, reduced: boolean) {
  let ancestor: HTMLElement | null = element.parentElement;
  while (ancestor) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
    ancestor = ancestor.parentElement;
  }
  element.tabIndex = -1;
  element.focus({ preventScroll: true });
  element.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export function LabOrientation({ rootRef }: { rootRef: RefObject<HTMLElement> }) {
  const slug = useJourneySlug();
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === "tr";
  const copy = journeys[slug]?.[language];
  const [chapters, setChapters] = useState<{ element: HTMLElement; title: string }[]>([]);
  const [start, setStart] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const discover = () => {
      setStart(
        root.querySelector<HTMLElement>(
          ".lab-content [data-tour=predict], .lab-content [data-stage]",
        ),
      );
      const headings = Array.from(root.querySelectorAll<HTMLElement>(".lab-content h2")).filter(
        (h) => !h.closest("[data-lab-summary]"),
      );
      setChapters(headings.map((element) => ({ element, title: element.textContent ?? "" })));
    };
    discover();
    const observer = new MutationObserver((records) => {
      // Engines update SVG values constantly. Only rediscover when lesson
      // headings / stages arrive, disappear or change language.
      if (
        records.some(
          (record) =>
            (record.target instanceof Element && record.target.closest("h2")) ||
            [...record.addedNodes, ...record.removedNodes].some(
              (node) =>
                node instanceof Element &&
                (node.matches("h2, [data-stage], [data-tour=predict]") ||
                  node.querySelector("h2, [data-stage], [data-tour=predict]")),
            ),
        )
      )
        discover();
    });
    observer.observe(root.querySelector(".lab-content") ?? root, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [rootRef, slug, language]);

  if (!copy) return null;
  return (
    <div className="lab-orientation" data-lab-orientation>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-overline uppercase text-accent">
            {tr ? "İlk hamlen" : "Your first move"}
          </p>
          <p className="mt-2 text-body-sm text-fg">{copy[1]}</p>
        </div>
        <Button size="sm" disabled={!start} onClick={() => start && reveal(start, reduced)}>
          {tr ? "Deneyi aç" : "Try it"} <span aria-hidden>↓</span>
        </Button>
      </div>
      <details className="mt-3 border-t border-line/15 pt-1">
        <summary className="min-h-11 cursor-pointer py-3 text-caption text-fg-muted">
          {tr ? "Neye bakmalı? · Keşif rotası" : "What to watch · Explore the route"}
        </summary>
        <p className="text-body-sm text-fg">{copy[0]}</p>
        <p className="mt-2 text-body-sm text-fg-muted">{copy[2]}</p>
        <nav
          aria-label={tr ? "Labın keşif rotası" : "Lab exploration route"}
          className="mt-4 grid gap-1"
        >
          {chapters.map(({ element, title }, i) => (
            <button
              key={i}
              type="button"
              onClick={() => reveal(element, reduced)}
              className="journey-chapter"
            >
              <span aria-hidden className="text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{title}</span>
              {element.closest("details.lab-section") && (
                <span className="text-caption text-fg-faint">{tr ? "İleri" : "Deeper"}</span>
              )}
            </button>
          ))}
        </nav>
      </details>
    </div>
  );
}

export function LabTransfer() {
  const slug = useJourneySlug();
  const { language } = useLanguage();
  const tr = language === "tr";
  const copy = journeys[slug]?.[language];
  const [selected, setSelected] = useState<number | null>(null);
  const id = useId();
  if (!copy) return null;
  // Stable ordering across language switches; don't always put the answer first.
  const offset = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3;
  const order = [offset, (offset + 1) % 3, (offset + 2) % 3];
  return (
    <section data-transfer-check aria-labelledby={id} className="transfer-check">
      <p className="text-overline uppercase text-accent">
        {tr ? "Yeni bir durumda dene" : "Try a new situation"}
      </p>
      <h2 id={id} className="mt-3 text-title font-semibold text-fg">
        {copy[3]}
      </h2>
      <p className="mt-2 text-body-sm text-fg-muted">
        {tr
          ? "Bir açıklama seç. Sonra gerekçeyi karşılaştır."
          : "Choose an explanation, then compare the reasoning."}
      </p>
      <div className="mt-5 grid gap-2" role="group" aria-labelledby={id}>
        {order.map((answer, position) => (
          <button
            key={answer}
            type="button"
            aria-pressed={selected === answer}
            onClick={() => setSelected(answer)}
            className="transfer-option"
          >
            <span aria-hidden className="transfer-letter">
              {String.fromCharCode(65 + position)}
            </span>
            <span>{copy[4 + answer]}</span>
          </button>
        ))}
      </div>
      <div aria-live="polite" aria-atomic="true">
        {selected !== null && (
          <div className="mt-4 border-l-2 border-accent bg-accent-soft p-4">
            <p className="text-body-sm font-semibold text-fg">
              {selected === 0
                ? tr
                  ? "Evet — işte nedeni."
                  : "Yes — here is why."
                : tr
                  ? "Şu ayrımı düşün."
                  : "Consider this distinction."}
            </p>
            <p className="mt-2 text-body-sm text-fg-muted">{copy[7]}</p>
          </div>
        )}
      </div>
    </section>
  );
}
