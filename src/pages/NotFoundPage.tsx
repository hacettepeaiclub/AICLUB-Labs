import { Link } from "react-router-dom";
import { Specimen } from "@/components/lab";
import { useDocumentHead } from "@/app/useDocumentHead";
import { notFoundMeta } from "@/app/siteMeta";
import { useT } from "@/i18n";

/**
 * The page for a lab that is not there.
 *
 * Its picture is the one empty plinth in the specimen series: the room, the
 * light and the stand are all where they should be, and the exhibit is
 * missing. It says "not found" in the same language as every lab page, which
 * a big grey 404 on its own did not.
 */
export function NotFoundPage() {
  const t = useT();
  useDocumentHead(notFoundMeta(t.notFound.title, t.notFound.body));
  return (
    <div className="shell grid min-h-[60vh] items-center gap-10 py-section md:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="text-center md:text-left">
        <p className="font-mono text-display-lg text-fg-faint">404</p>
        <h1 className="mt-2 text-display-md text-fg">{t.notFound.title}</h1>
        <p className="mt-3 text-body text-fg-muted">{t.notFound.body}</p>
        <Link
          to="/"
          className="mt-8 inline-flex h-10 items-center rounded bg-accent-fill px-4 text-body-sm
            font-medium text-accent-fg transition-colors duration-fast hover:bg-accent/90"
        >
          {t.notFound.back}
        </Link>
      </div>
      <Specimen name="not-found" priority className="mx-auto w-full max-w-xs md:max-w-none" />
    </div>
  );
}
