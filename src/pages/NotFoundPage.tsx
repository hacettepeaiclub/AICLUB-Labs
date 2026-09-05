import { Link } from "react-router-dom";
import { useT } from "@/i18n";

export function NotFoundPage() {
  const t = useT();
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-section text-center">
      <div>
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
    </div>
  );
}
