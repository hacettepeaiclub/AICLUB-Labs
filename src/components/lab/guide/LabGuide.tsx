import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { useLabCopy, type LabSlug } from "@/i18n/labs";
import { Quiet } from "../Quiet";
import { GuideContext, useGuide, type Guide } from "./context";

/**
 * The way in to a lab for someone who has never seen one.
 *
 * Every experiment carries a "How does it work?" button under it (see
 * `Stage`), the lab's header carries one for its first experiment, and the
 * inline first-move card introduces the experiment without interrupting it.
 *
 * The tour itself (the cursor, the text caret, the lit control, the card) is
 * its own chunk, fetched when it is asked for; what ships with every lab page
 * is this file.
 */

const TourRunner = lazy(() => import("./TourRunner"));

/** The tour's words, as the lab's copy carries them. */
export interface TourCopy {
  intro: string;
  stages: Record<string, Record<string, string>>;
}

// ------------------------------------------------------------ provider --

export interface LabGuideProps {
  slug: string;
  title: string;
  /** The lab page, where the tour looks for what it points at. */
  rootRef: RefObject<HTMLElement>;
  children: ReactNode;
}

export function LabGuideProvider({ slug, rootRef, children }: LabGuideProps) {
  const [tour, setTour] = useState<TourCopy | null>(null);
  const [run, setRun] = useState<{ n: number; stage: HTMLElement | null } | null>(null);
  const guide = useMemo<Guide | null>(
    () => (tour ? { start: (stage) => setRun((r) => ({ n: (r?.n ?? 0) + 1, stage })) } : null),
    [tour],
  );

  return (
    <GuideContext.Provider value={guide}>
      {children}

      {/* The lab's own copy carries the tour's words. Until it is here there
          is nothing to offer, and if it never arrives the lab has failed too,
          and says so itself: the guide stays out of the way either way. */}
      <Quiet>
        <Suspense fallback={null}>
          <LoadTour slug={slug} onTour={setTour} />
        </Suspense>
      </Quiet>

      {tour && run && rootRef.current && (
        <Quiet>
          <Suspense fallback={null}>
            <TourRunner
              key={run.n}
              slug={slug}
              root={rootRef.current}
              stage={run.stage}
              texts={tour.stages}
              onClose={() => setRun(null)}
            />
          </Suspense>
        </Quiet>
      )}
    </GuideContext.Provider>
  );
}

function LoadTour({ slug, onTour }: { slug: string; onTour: (tour: TourCopy | null) => void }) {
  const copy = useLabCopy(slug as LabSlug);
  const tour = "tour" in copy ? (copy.tour as TourCopy) : null;
  useEffect(() => onTour(tour), [tour, onTour]);
  return null;
}

/** "How does it work?": the header's for the first experiment, a stage's for its own. */
export function GuideButton({
  stageRef,
  className,
}: {
  stageRef?: RefObject<HTMLElement>;
  className?: string;
}) {
  const t = useT();
  const guide = useGuide();
  if (!guide) return null;
  return (
    <Button
      variant="ghost"
      size={stageRef ? "sm" : "md"}
      onClick={() => guide.start(stageRef?.current ?? null)}
      className={className}
    >
      <span
        aria-hidden
        className="grid size-4 place-items-center rounded-pill border border-current font-mono text-[0.625rem] leading-none"
      >
        ?
      </span>
      {t.guide.howItWorks}
    </Button>
  );
}
