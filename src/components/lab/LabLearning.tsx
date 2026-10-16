import { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { useLabCopy, type LabSlug } from "@/i18n/labs";
import { Quiet } from "./Quiet";

/**
 * The foot of a lab: a way on from what the visitor just did, to the videos,
 * lectures and readings that teach the same ideas properly.
 *
 * The list itself (src/labs/learning.ts) and the window that shows it are
 * their own chunk, fetched when the button is pressed.
 */

const LearningDialog = lazy(() => import("./LearningDialog"));

export function LabLearning(props: { slug: string; title: string }) {
  return (
    <Quiet>
      <Suspense fallback={null}>
        <Learning {...props} />
      </Suspense>
    </Quiet>
  );
}

function Learning({ slug, title }: { slug: string; title: string }) {
  const t = useT();
  const copy = useLabCopy(slug as LabSlug);
  const learn = "study" in copy ? copy.study : null;
  const [open, setOpen] = useState(false);
  if (!learn) return null;

  return (
    <section
      aria-labelledby="lab-learning-heading"
      className="mt-24 flex flex-col gap-6 rounded-card border border-line/10 bg-ink-800 p-6 md:mt-32
        md:flex-row md:items-center md:justify-between md:p-8"
    >
      <div className="max-w-prose">
        <p className="text-overline uppercase text-fg-faint">{t.learn.kicker}</p>
        <h2 id="lab-learning-heading" className="mt-2 text-title text-fg">
          {t.learn.title}
        </h2>
        <p className="mt-2 text-body text-fg-muted">{t.learn.body}</p>
      </div>
      <Button onClick={() => setOpen(true)} className="shrink-0">
        {t.learn.open}
      </Button>

      {open && (
        <Suspense fallback={null}>
          <LearningDialog
            slug={slug}
            title={title}
            learn={learn as LearnCopy}
            onClose={() => setOpen(false)}
          />
        </Suspense>
      )}
    </section>
  );
}

/** The guide's words, as the lab's copy carries them. */
export interface LearnCopy {
  topics: Record<string, string>;
  notes: Record<string, string>;
}
