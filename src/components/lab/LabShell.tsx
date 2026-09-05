import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import { useLabMeta, useT } from "@/i18n";
import { CATEGORY_STYLE, type LabMeta } from "@/labs/types";

/**
 * Frame that every experiment renders inside. Gives all 100+ labs the same
 * header anatomy (breadcrumb, title, description, metadata) so the product
 * feels like one system. The lab itself renders as `children`.
 */
export function LabShell({ meta, children }: { meta: LabMeta; children: ReactNode }) {
  const t = useT();
  const copy = useLabMeta(meta.slug);
  const category = CATEGORY_STYLE[meta.category];

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

      <header className="mb-10 max-w-prose">
        <div className="mb-4 flex items-center gap-2">
          <Badge dotClassName={category.dot}>{t.category[meta.category]}</Badge>
          <Badge>{t.difficulty[meta.difficulty]}</Badge>
          <Badge>{t.shell.minutes(meta.minutes)}</Badge>
        </div>
        <h1 className="text-display-lg text-fg">{copy?.title ?? meta.title}</h1>
        <p className="mt-4 text-body-lg text-fg-muted">{copy?.description ?? meta.description}</p>
      </header>

      {children}
    </div>
  );
}
