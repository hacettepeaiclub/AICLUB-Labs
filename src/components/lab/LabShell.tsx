import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import { useDocumentHead } from "@/app/useDocumentHead";
import { headTitle, labMeta as labPageMeta } from "@/app/siteMeta";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, CATEGORY_VAR, type LabMeta } from "@/labs/types";
import { LabNext } from "./LabNext";
import { LabProgress } from "./LabProgress";
import { orderedLabs } from "@/labs/registry";
import { LabPlate } from "./LabPlate";
import { GuideButton, LabGuideProvider } from "./guide/LabGuide";
import { LabLearning } from "./LabLearning";

/**
 * Frame that every experiment renders inside. Gives all 100+ labs the same
 * header anatomy (breadcrumb, title, description, metadata) so the product
 * feels like one system. The lab itself renders as `children`.
 *
 * It also owns the two things that place a lab within the collection rather
 * than inside itself: the hairline across the top that says how far through
 * it you are, and the card at the bottom that says where it goes next. Both
 * live here and not in the labs so that no lab can forget them.
 */
export function LabShell({ meta, children }: { meta: LabMeta; children: ReactNode }) {
  const t = useT();
  const copy = useLabMeta(meta.slug);
  const category = CATEGORY_STYLE[meta.category];
  const title = copy?.title ?? meta.title;
  const description = copy?.description ?? meta.description;
  const term = copy?.term;
  useDocumentHead(labPageMeta(meta.slug, headTitle(title, term), description));
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      data-lab={meta.slug}
      className="lab-workspace lab-console shell py-7 md:py-10"
    >
      <LabGuideProvider key={meta.slug} slug={meta.slug} title={title} rootRef={rootRef}>
        <LabProgress targetRef={rootRef} colour={CATEGORY_VAR[meta.category]} />

        <nav aria-label={t.shell.breadcrumb} className="mb-6">
          <Link
            to="/"
            className="-my-3 inline-flex min-h-11 items-center rounded text-body-sm text-fg-muted
            transition-colors duration-fast hover:text-fg"
          >
            {t.shell.backToLabs}
          </Link>
        </nav>

        {/* The lab's plate sits beside the title from tablet width up. On a
          phone it would push the experiment a full screen down, and the
          experiment is what the visitor came for, so it is left out there. */}
        <header className="lab-header mb-9 grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_12rem] lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="max-w-prose">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge dotClassName={category.dot}>{t.category[meta.category]}</Badge>
              <Badge>{t.difficulty[meta.difficulty]}</Badge>
              <Badge>{t.shell.minutes(meta.minutes)}</Badge>
            </div>
            {term && (
              <p lang={copy?.termLang} className="mb-2 text-overline uppercase text-fg-faint">
                {term}
              </p>
            )}
            <h1 className="text-[clamp(2rem,3.6vw,2.75rem)] font-semibold leading-tight tracking-[-0.025em] text-fg">
              {title}
            </h1>
            <p className="mt-4 text-body text-fg-muted">{description}</p>
            <GuideButton className="mt-4" />
          </div>
          <LabPlate
            slug={meta.slug}
            colour={CATEGORY_VAR[meta.category]}
            caption={t.shell.labPlate(plateNumber(meta.slug), term ?? title, copy?.figure ?? "")}
            className="hidden md:block"
          />
        </header>

        {children}

        <LabLearning key={meta.slug} slug={meta.slug} title={title} />

        <LabNext slug={meta.slug} />
      </LabGuideProvider>
    </div>
  );
}

/** The lab's place in the collection's reading order, as a plate number. */
function plateNumber(slug: string): string {
  const i = orderedLabs().findIndex((lab) => lab.meta.slug === slug);
  return String(i < 0 ? 0 : i + 1).padStart(2, "0");
}
