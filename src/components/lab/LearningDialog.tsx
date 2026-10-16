import { useEffect, useRef } from "react";
import { useT } from "@/i18n";
import { GUIDES, RESOURCES, type ResourceId } from "@/labs/learning";
import type { LearnCopy } from "./LabLearning";

/**
 * The learning guide's window: the lab's ideas as headings, and under each the
 * resources that teach it, with one sentence on why each one is there.
 *
 * A native <dialog>, like the rest of the site's windows: the browser keeps
 * focus inside it and Esc closes it.
 */
export default function LearningDialog({
  slug,
  title,
  learn,
  onClose,
}: {
  slug: string;
  title: string;
  learn: LearnCopy;
  onClose: () => void;
}) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const guide = GUIDES[slug] ?? [];

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="lab-learning-title"
      className="lab-palette lab-guide-welcome"
      onClose={onClose}
      // A click on the dialog itself, not on the panel, is on the backdrop.
      onClick={(event) => event.target === ref.current && ref.current?.close()}
    >
      <div className="lab-palette-panel flex max-h-[min(48rem,calc(100dvh-2rem))] max-w-2xl flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line/10 p-5 md:p-6">
          <div>
            <p className="text-overline uppercase text-fg-faint">{t.learn.dialogKicker}</p>
            <h2 id="lab-learning-title" className="mt-1 text-title text-fg">
              {title}
            </h2>
            <p className="mt-1 text-caption text-fg-faint">{t.learn.inEnglish}</p>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t.learn.close}
            className="-mr-2 grid size-10 shrink-0 place-items-center rounded text-fg-muted
              transition-colors duration-fast hover:bg-line/10 hover:text-fg"
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain p-5 md:p-6">
          <div className="space-y-8">
            {guide.map(({ topic, items }) => (
              <section key={topic} aria-labelledby={`learn-${topic}`}>
                <h3 id={`learn-${topic}`} className="text-body-lg font-semibold text-fg">
                  {learn.topics[topic]}
                </h3>
                <ul className="mt-3 space-y-4">
                  {items.map((id) => (
                    <Item key={id} id={id} note={learn.notes[id] ?? ""} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function Item({ id, note }: { id: ResourceId; note: string }) {
  const t = useT();
  const r = RESOURCES[id];
  const length = "length" in r ? r.length : undefined;
  const year = "year" in r ? r.year : undefined;
  const meta = [r.by, length ?? year].filter(Boolean).join(" · ");

  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
      <span className="mt-0.5 h-fit rounded border border-line/15 px-1.5 py-0.5 text-center text-caption text-fg-muted">
        {t.learn.kinds[r.kind]}
      </span>
      <div className="min-w-0">
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-sm font-medium text-fg underline decoration-line/30 underline-offset-2
            transition-colors duration-fast hover:text-accent hover:decoration-accent"
        >
          {r.title}
          <span aria-hidden className="ml-1 text-fg-faint">
            ↗
          </span>
          <span className="sr-only"> {t.learn.newTab}</span>
        </a>
        <p className="mt-0.5 text-caption text-fg-faint">{meta}</p>
        {note && <p className="mt-1 text-body-sm text-fg-muted">{note}</p>}
      </div>
    </li>
  );
}
