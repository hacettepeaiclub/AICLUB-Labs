import { useT } from "@/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-line/10">
      <div className="shell flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-caption text-fg-faint">
        <p>{t.shell.footerTagline}</p>
        <p>{t.shell.footerRights(new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
