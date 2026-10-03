import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import { useDocumentHead } from "@/app/useDocumentHead";
import { headTitle, labMeta as labPageMeta } from "@/app/siteMeta";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, CATEGORY_VAR, type LabMeta } from "@/labs/types";
import { LabNext } from "./LabNext";
import { LabProgress } from "./LabProgress";
import { Specimen } from "./Specimen";

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
    <div ref={rootRef} className="shell py-10 md:py-14">
      <LabProgress targetRef={rootRef} colour={CATEGORY_VAR[meta.category]} />

      <nav aria-label={t.shell.breadcrumb} className="mb-6">
        <Link
          to="/"
          className="rounded text-body-sm text-fg-muted transition-colors duration-fast hover:text-fg"
        >
          {t.shell.backToLabs}
        </Link>
      </nav>

      {/* The specimen sits beside the title from tablet width up. On a phone
          it would push the experiment a full screen down, and the experiment
          is what the visitor came for, so it is left out there. It stays
          lazy for the same reason: a lazy image that is display:none is never
          fetched, so phones do not download a picture they will not see. */}
      <header className="mb-10 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_16rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="max-w-prose">
          <div className="mb-4 flex items-center gap-2">
            <Badge dotClassName={category.dot}>{t.category[meta.category]}</Badge>
            <Badge>{t.difficulty[meta.difficulty]}</Badge>
            <Badge>{t.shell.minutes(meta.minutes)}</Badge>
          </div>
          {term && <p className="mb-2 text-overline uppercase text-fg-faint">{term}</p>}
          <h1 className="text-display-lg text-fg">{title}</h1>
          <p className="mt-4 text-body-lg text-fg-muted">{description}</p>
        </div>
        <Specimen name={meta.slug} className="hidden md:block" />
      </header>

      {children}

      <LabNext slug={meta.slug} />
    </div>
  );
}
