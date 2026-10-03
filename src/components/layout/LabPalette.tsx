import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Kbd } from "@/components/ui";
import { LabSignature } from "@/components/lab/LabSignature";
import { useLanguage, useT } from "@/i18n";
import { prefetchLabs } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { orderedLabs, preloadLab } from "@/labs/registry";
import { CATEGORY_VAR, type LabMeta } from "@/labs/types";
import { readVisits } from "@/labs/visits";
import { search } from "./labSearch";

/**
 * A finder for the collection, on ⌘K / Ctrl+K.
 *
 * ## What it is for
 *
 * Moving between labs without going back through the grid. The audience is
 * people who study computer science, most of whom already reach for this key
 * in their editor, and with eleven labs and a registry built for a hundred,
 * "go to the tokenizer" should be two keystrokes from anywhere.
 *
 * It finds labs and nothing else. There is nothing else on the site to find,
 * and a box that promised a search would mostly answer with nothing.
 *
 * ## Why a native `<dialog>`
 *
 * `showModal()` gives the things a hand-rolled overlay has to get right and
 * usually gets slightly wrong: the page behind becomes inert, focus is held
 * inside, Escape closes it, it renders in the top layer above any stacking
 * context, and focus goes back to whatever opened it. The same reasoning put
 * a real `<details>` in `Stage` and real buttons in `PreferenceToggle`.
 *
 * ## The listbox
 *
 * Focus stays in the input the whole time; the arrow keys move
 * `aria-activedescendant`, which is the combobox pattern screen readers
 * expect. The pointer sets the active row on *move*, not on enter, so a list
 * scrolling under a resting cursor during keyboard use does not steal the
 * selection.
 *
 * Whichever lab is active is already downloading: a highlighted row is a
 * strong enough guess that Enter is next.
 */

interface Entry {
  meta: LabMeta;
  title: string;
  term: string;
  rest: string;
  field: string;
}

/** Mac shows ⌘, everyone else Ctrl. Read once; it does not change. */
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
export const PALETTE_SHORTCUT = isMac ? "⌘K" : "Ctrl K";

export function LabPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<string>>(new Set());
  const listId = useId();

  // ⌘K / Ctrl+K anywhere, including inside a lab's own text fields: the
  // combination types nothing, so claiming it costs no one a keystroke.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      if (event.altKey || event.shiftKey) return;
      event.preventDefault();
      onOpenChange(!open);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // The dialog follows `open` rather than owning it, so the header's button
  // and the shortcut go through the same state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery("");
      setActive(0);
      setVisited(readVisits().visited);
      dialog.showModal();
      // `showModal` focuses the first focusable thing in the dialog, which is
      // this input — but saying so outright survives someone adding a button
      // above it.
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const entries = useMemo<Entry[]>(
    () =>
      orderedLabs().map(({ meta }) => {
        const copy = t.labMeta[meta.slug as keyof typeof t.labMeta];
        const title = copy?.title ?? meta.title;
        const field = t.category[meta.category];
        return {
          meta,
          title,
          term: copy?.term ?? "",
          field,
          // The technical term, the English name and the slug are in here on
          // purpose: "floating" should find 0,1 + 0,2, and "gradient" should
          // find Adımın Boyu for someone reading in Turkish.
          rest: [
            copy?.term ?? "",
            copy?.description ?? meta.description,
            field,
            meta.title,
            meta.slug,
          ].join(" "),
        };
      }),
    [t],
  );

  const results = useMemo(() => search(query, entries), [query, entries]);
  const current = pathname.startsWith("/labs/") ? pathname.slice("/labs/".length) : null;
  const activeEntry = results[Math.min(active, results.length - 1)];

  // Warm whatever is highlighted, and keep it on screen when the keyboard
  // moves past the edge of the list.
  useEffect(() => {
    if (!open || !activeEntry) return;
    preloadLab(activeEntry.meta.slug);
    prefetchLabs(language);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-slug="${activeEntry.meta.slug}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeEntry, language]);

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    onOpenChange(false);
    if (entry.meta.slug !== current) navigate(`/labs/${entry.meta.slug}`);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const last = results.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i >= last ? 0 : i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? last : i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(last);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(activeEntry);
    }
  };

  const optionId = (slug: string) => `${listId}-${slug}`;

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.palette.label}
      className="lab-palette"
      onClose={() => onOpenChange(false)}
      // A click that lands on the dialog itself, rather than on anything in
      // it, landed on the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div className="lab-palette-panel">
        <div className="flex items-center gap-3 border-b border-line/10 px-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
            className="shrink-0 text-fg-faint"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeEntry ? optionId(activeEntry.meta.slug) : undefined}
            aria-label={t.palette.label}
            placeholder={t.palette.placeholder}
            spellCheck={false}
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 min-w-0 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-faint
              focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Kbd>esc</Kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-10 text-center text-body-sm text-fg-muted">
            {t.palette.empty(query.trim())}
          </p>
        ) : (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={t.palette.label}
            className="lab-palette-list"
          >
            {results.map((entry, index) => {
              const selected = entry === activeEntry;
              const here = entry.meta.slug === current;
              return (
                <li
                  key={entry.meta.slug}
                  id={optionId(entry.meta.slug)}
                  data-slug={entry.meta.slug}
                  role="option"
                  aria-selected={selected}
                  onMouseMove={() => !selected && setActive(index)}
                  onClick={() => go(entry)}
                  className={cn("lab-palette-option", selected && "is-active")}
                  style={{ "--c": CATEGORY_VAR[entry.meta.category] } as CSSProperties}
                >
                  <span
                    aria-hidden
                    className="grid h-10 w-14 shrink-0 place-items-center border border-line/5 bg-ink-950"
                  >
                    <LabSignature slug={entry.meta.slug} className="h-[72%] w-[78%]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-sm font-medium text-fg">
                      {entry.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-caption text-fg-muted">
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-pill bg-[rgb(var(--c))]"
                      />
                      {entry.field}
                      {entry.term && <span className="truncate text-fg-faint">· {entry.term}</span>}
                    </span>
                  </span>
                  {here ? (
                    <span className="shrink-0 font-mono text-caption uppercase tracking-[0.12em] text-[rgb(var(--c))]">
                      {t.palette.current}
                    </span>
                  ) : (
                    visited.has(entry.meta.slug) && (
                      <span className="shrink-0 font-mono text-caption uppercase tracking-[0.12em] text-fg-faint">
                        {t.home.visited}
                      </span>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div
          className="flex items-center justify-between gap-4 border-t border-line/10 px-4 py-2.5 text-caption
            text-fg-faint"
        >
          <p aria-live="polite">{t.palette.results(results.length)}</p>
          <p className="hidden items-center gap-3 sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              {t.palette.navigate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              {t.palette.select}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>esc</Kbd>
              {t.palette.dismiss}
            </span>
          </p>
        </div>
      </div>
    </dialog>
  );
}
