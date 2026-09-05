import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { LabShell } from "@/components/lab";
import { useT } from "@/i18n";
import { findLab } from "@/labs/registry";
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

  if (!lab) return <NotFoundPage />;

  const { meta, Component } = lab;
  return (
    <LabShell meta={meta}>
      <Suspense fallback={<LabLoading />}>
        <Component />
      </Suspense>
    </LabShell>
  );
}
