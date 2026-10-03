import { Suspense, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { LabShell } from "@/components/lab";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { useT } from "@/i18n";
import { findLab } from "@/labs/registry";
import { RENAMED } from "@/labs/renamed";
import { recordVisit } from "@/labs/visits";
import { NotFoundPage } from "./NotFoundPage";

function LabLoading() {
  const t = useT();
  return (
    <div
      role="status"
      aria-label={t.shell.loadingLab}
      className="card-surface grid min-h-96 place-items-center"
    >
      <span className="size-8 animate-spin rounded-pill border-2 border-line/15 border-t-accent" />
    </div>
  );
}

/** Resolves /labs/:slug against the registry and renders the lab in its shell. */
export function LabPage() {
  const { slug } = useParams<{ slug: string }>();
  const lab = slug ? findLab(slug) : undefined;

  // Remembered for the home page's "visited" marks and "continue" link.
  useEffect(() => {
    if (lab) recordVisit(lab.meta.slug);
  }, [lab]);

  // An address from before the labs were renamed: go to where it lives now.
  const moved = slug ? RENAMED[slug] : undefined;
  if (!lab && moved) return <Navigate to={`/labs/${moved}`} replace />;
  if (!lab) return <NotFoundPage />;

  const { meta, Component } = lab;
  return (
    <LabShell meta={meta}>
      {/* A second boundary, inside the lab's own shell. The one in PageShell
          would already prevent the blank page, but it would take the lab's
          title and breadcrumb down with the experiment; here the visitor keeps
          their bearings and only the experiment is replaced.

          It also catches the common case: a lazy chunk that fails to load
          throws out of this Suspense. */}
      <ErrorBoundary resetKey={meta.slug}>
        <Suspense fallback={<LabLoading />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    </LabShell>
  );
}
