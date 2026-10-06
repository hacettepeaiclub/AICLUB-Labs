import { BookOpenText, LinkSimple } from "@phosphor-icons/react";
import ArxivIcon from "@scienceicons/react/24/solid/ArxivIcon";
import { SOURCES, formatSource, type SourceId } from "@/labs/sources";

/**
 * Where a lab's theory comes from.
 *
 * Deliberately the quietest thing on the page: small, muted, and last. It is
 * not a trust badge and it is not there to make the lab look scholarly. It is
 * there so that somebody who doubts a claim can go and check it.
 *
 * ## What each entry says, and what it does not
 *
 * The bibliographic line comes from `labs/sources.ts`, which holds one
 * verified record per work, so a citation cannot drift between languages or
 * between labs. The sentence under it is the lab's own, and it names what the
 * source supports — a method, a theorem, a standard. None of these papers
 * describes our implementation, and no entry is allowed to imply otherwise.
 *
 * ## The marks beside the links
 *
 * Each identifier wears the mark of what it is: arXiv's own glyph for a
 * preprint (ScienceIcons, the open-science icon set), a book for a DOI, a
 * plain link for anything else. They say at a glance which kind of source
 * a line is, the way a reference manager does, and they are hidden from
 * assistive technology because the link text already says it.
 *
 * A lab with no source it can verify renders nothing at all. An empty Sources
 * heading would be worse than none: it promises provenance and delivers an
 * absence.
 */

export interface LabSourceEntry {
  readonly id: SourceId;
  /** One localized sentence: what this source supports in this lab. */
  readonly supports: string;
}

export interface LabSourcesProps {
  title: string;
  entries: readonly LabSourceEntry[];
}

export function LabSources({ title, entries }: LabSourcesProps) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="lab-sources-heading" className="max-w-prose">
      <h2
        id="lab-sources-heading"
        className="font-mono text-caption uppercase tracking-wide text-fg-muted"
      >
        {title}
      </h2>
      <ol className="mt-3 space-y-3 text-caption leading-relaxed text-fg-muted">
        {entries.map((entry) => {
          const source = SOURCES[entry.id];
          return (
            <li key={entry.id}>
              <p>{formatSource(entry.id)}</p>
              {source.doi !== null && (
                <p className="mt-0.5 flex items-center gap-1.5">
                  <BookOpenText size={13} aria-hidden className="shrink-0 text-fg-faint" />
                  <a
                    href={`https://doi.org/${source.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-line/30 underline-offset-2
                      transition-colors duration-fast hover:text-fg"
                  >
                    {`DOI: ${source.doi}`}
                  </a>
                </p>
              )}
              {source.doi === null && source.url !== null && (
                <p className="mt-0.5 flex items-start gap-1.5">
                  {source.url.includes("arxiv.org") ? (
                    <ArxivIcon aria-hidden width={13} height={13} className="mt-0.5 shrink-0 text-fg-faint" />
                  ) : (
                    <LinkSimple size={13} aria-hidden className="mt-0.5 shrink-0 text-fg-faint" />
                  )}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    // A URL has no spaces to wrap at; without this one long
                    // address pushes the whole page sideways on a phone.
                    className="break-all underline decoration-line/30 underline-offset-2
                      transition-colors duration-fast hover:text-fg"
                  >
                    {source.url}
                  </a>
                </p>
              )}
              <p className="mt-1 text-fg-faint">{entry.supports}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
