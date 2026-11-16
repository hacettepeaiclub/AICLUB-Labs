import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { useLabCopy, type LabSlug } from "@/i18n/labs";
import LearningDialog from "./LearningDialog";
import { loadGuide, type GuideData } from "./loadGuide";
import { Quiet } from "./Quiet";

/**
 * The foot of a lab: a way on from what the visitor just did, to the videos,
 * lectures and readings that teach the same ideas properly.
 *
 * The window is part of the page; the list of resources behind it
 * (src/labs/learning.ts) is fetched when the button is pressed, through a
 * worker (loadGuide.ts).
 *
 * ## When the list does not arrive
 *
 * The section says so itself and offers to try again, and nothing else on
 * the page moves: the lab, its simulation and whatever the visitor has set
 * stay as they are. A retry is a new download, never the old failure
 * replayed, and while one is under way the button ignores further presses.
 */

/** Guides already fetched, so reopening one is instant. */
const fetched = new Map<string, GuideData>();

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
  const [guide, setGuide] = useState<GuideData | null>(() => fetched.get(slug) ?? null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  // Once a download has failed, the next one is a retry, and says so.
  const [retrying, setRetrying] = useState(false);
  // Set synchronously, so two presses can never start two downloads.
  const loading = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  if (!learn) return null;

  const show = () => {
    if (guide) {
      setOpen(true);
      return;
    }
    if (loading.current) return;
    loading.current = true;
    setStatus("loading");
    loadGuide(slug).then(
      (data) => {
        loading.current = false;
        fetched.set(slug, data);
        if (!mounted.current) return;
        setGuide(data);
        setStatus("idle");
        setRetrying(false);
        setOpen(true);
      },
      (error: unknown) => {
        loading.current = false;
        console.error("Learning guide failed to load:", error);
        if (!mounted.current) return;
        setStatus("failed");
        setRetrying(true);
      },
    );
  };

  const busy = status === "loading";
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
        {/* Mounted from the start, so a screen reader is listening when it fills. */}
        <p role="alert" className={status === "failed" ? "mt-3 text-body-sm text-fg" : "sr-only"}>
          {status === "failed" ? t.learn.failed : ""}
        </p>
      </div>
      <Button
        onClick={busy ? undefined : show}
        aria-disabled={busy || undefined}
        style={busy ? { opacity: 0.6, cursor: "progress" } : undefined}
        className="shrink-0"
      >
        {busy && retrying ? t.learn.retrying : retrying ? t.learn.retry : t.learn.open}
      </Button>

      {open && guide && (
        <LearningDialog
          title={title}
          guide={guide}
          learn={learn as LearnCopy}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}

/** The guide's words, as the lab's copy carries them. */
export interface LearnCopy {
  topics: Record<string, string>;
  notes: Record<string, string>;
}
