import { Link } from "react-router-dom";
import { LabPlate } from "@/components/lab";
import { useDocumentHead } from "@/app/useDocumentHead";
import { notFoundMeta } from "@/app/siteMeta";
import { useT } from "@/i18n";

/**
 * The page for a lab that is not there.
 *
 * Its picture is an empty plate: the frame, the plotting paper and the
 * registration marks every lab's figure stands on, and nothing drawn on them
 * but the outline of where the drawing would go. It says "not found" in the
 * same language as every lab page, which a big grey 404 on its own did not.
 *
 * It used to be a photograph — the one empty plinth in a series of rendered
 * sculptures, one per lab. The labs stopped using those for their own drawn
 * plates, and this page was the last place left speaking the old language.
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
      <LabPlate caption={t.notFound.figure} className="mx-auto max-w-xs md:max-w-none">
        {/* The drawing's place, marked and empty. Same viewBox as every
            signature, so it sits on the plate exactly where one would. */}
        <svg viewBox="0 0 64 40" className="h-full w-full" aria-hidden>
          <rect
            x={20}
            y={8}
            width={24}
            height={24}
            rx={1.5}
            fill="none"
            strokeWidth={0.6}
            strokeDasharray="2 1.6"
            className="stroke-fg-faint/70"
          />
          <path
            d="M30.5 16.5a1.5 1.5 0 1 1 2.2 1.3c-.5.3-.7.6-.7 1.2v.6"
            fill="none"
            strokeWidth={0.6}
            strokeLinecap="round"
            className="stroke-fg-faint"
          />
          <circle cx={32} cy={22.8} r={0.45} className="fill-fg-faint" />
        </svg>
      </LabPlate>
    </div>
  );
}
