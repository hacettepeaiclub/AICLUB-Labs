import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { VocabularyItem } from "../vocabulary";
import { searchWords, type SearchHit } from "../view";

/**
 * Find a word by typing it, in either language.
 *
 * Matching folds Turkish properly, which is the whole reason `foldSearch`
 * exists: `köpek`, `KÖPEK` and `kopek` all reach the same word, and so do `saç`
 * and `sac`. A Turkish visitor types Turkish and lands on the English word the
 * vectors were actually built from — which is honest about what this dataset is
 * rather than pretending the space is bilingual.
 *
 * No debounce. Filtering 318 items costs a fraction of a millisecond, so
 * delaying it would add latency and buy nothing.
 */

export interface WordSearchCopy {
  readonly label: string;
  readonly placeholder: string;
  readonly noMatch: (query: string) => string;
  readonly resultsLabel: string;
  readonly optionLabel: (word: string, gloss: string) => string;
}

export interface WordSearchProps {
  vocabulary: readonly VocabularyItem[];
  onSelect: (index: number) => void;
  copy: WordSearchCopy;
}

export function WordSearch({ vocabulary, onSelect, copy }: WordSearchProps) {
  const baseId = useId();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const hits: SearchHit[] = query.trim() ? searchWords(vocabulary, query) : [];
  const open = query.trim().length > 0;
  const active = hits[Math.min(cursor, hits.length - 1)];
  const optionId = (hit: SearchHit) => `${baseId}-hit-${hit.index}`;

  const commit = (hit: SearchHit | undefined) => {
    if (!hit) return;
    onSelect(hit.index);
    setQuery("");
    setCursor(0);
  };

  return (
    <div className="relative">
      <label htmlFor={`${baseId}-input`} className="text-overline uppercase text-fg-faint">
        {copy.label}
      </label>
      <input
        id={`${baseId}-input`}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={`${baseId}-list`}
        aria-activedescendant={active ? optionId(active) : undefined}
        value={query}
        placeholder={copy.placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setCursor(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setCursor((c) => Math.min(c + 1, hits.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            commit(active);
          } else if (event.key === "Escape") {
            setQuery("");
            setCursor(0);
          }
        }}
        className={cn(
          "mt-2 h-11 w-full rounded-md border border-line/20 bg-transparent px-3",
          "font-mono text-body-sm text-fg placeholder:text-fg-faint",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        )}
      />

      {open && (
        <ul
          id={`${baseId}-list`}
          role="listbox"
          aria-label={copy.resultsLabel}
          className="mt-2 overflow-hidden rounded-md border border-line/10"
        >
          {hits.length === 0 && (
            <li className="px-3 py-2 text-body-sm text-fg-faint">{copy.noMatch(query.trim())}</li>
          )}
          {hits.map((hit) => (
            <li key={hit.index} id={optionId(hit)} role="option" aria-selected={hit === active}>
              <button
                type="button"
                onClick={() => commit(hit)}
                aria-label={copy.optionLabel(hit.item.en, hit.item.tr)}
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-between gap-3 px-3 py-2 text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                  hit === active ? "bg-fg/5" : "hover:bg-fg/5",
                )}
              >
                <span className="font-mono text-body-sm text-fg">{hit.item.en}</span>
                <span className="text-caption text-fg-faint">{hit.item.tr}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
