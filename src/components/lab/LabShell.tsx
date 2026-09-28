import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import { useDocumentHead } from "@/app/useDocumentHead";
import { labMeta as labPageMeta } from "@/app/siteMeta";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, type LabMeta } from "@/labs/types";
import { Specimen } from "./Specimen";

/**
 * Frame that every experiment renders inside. Gives all 100+ labs the same
 * header anatomy (breadcrumb, title, description, metadata) so the product
 * feels like one system. The lab itself renders as `children`.
 */
export function LabShell({ meta, children }: { meta: LabMeta; children: ReactNode }) {
  const t = useT();
  const copy = useLabMeta(meta.slug);
  const category = CATEGORY_STYLE[meta.category];
  const title = copy?.title ?? meta.title;
  const description = copy?.description ?? meta.description;
  useDocumentHead(labPageMeta(meta.slug, title, description));

  return (
    <div className="shell py-10 md:py-14">
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
          <h1 className="text-display-lg text-fg">{title}</h1>
          <p className="mt-4 text-body-lg text-fg-muted">{description}</p>
        </div>
        <Specimen name={meta.slug} className="hidden md:block" />
      </header>

      {children}
    </div>
  );
}
