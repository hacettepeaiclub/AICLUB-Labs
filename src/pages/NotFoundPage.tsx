import { Link, useLocation } from "react-router-dom";
import { useDocumentHead } from "@/app/useDocumentHead";
import { notFoundMeta } from "@/app/siteMeta";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/i18n";

/**
 * The page for an address that is not there.
 *
 * It stands in the same terminal frame as every other error screen, with
 * nothing to retry and nothing to wait for: the address is wrong, and the way
 * on is back to the collection.
 */
export function NotFoundPage() {
  const t = useT();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  useDocumentHead(notFoundMeta(t.notFound.title, t.notFound.body));
  return (
    <ErrorPanel
      icon="missing"
      path={pathname}
      tag={{ text: "404", tone: "plain" }}
      reduced={reduced}
      heading="h1"
      title={t.notFound.title}
      body={t.notFound.body}
      actions={
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded border border-accent/50 bg-accent-fill px-4
            text-body-sm font-medium text-accent-fg transition-colors duration-fast
            hover:bg-accent-fill/85"
        >
          {t.notFound.back}
        </Link>
      }
    />
  );
}
