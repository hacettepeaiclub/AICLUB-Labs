import logoMark from "@/assets/aiclub-mark-white.png";
import { useT } from "@/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-line/10">
      <div className="shell flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-caption text-fg-faint">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded bg-accent-fill p-1">
            <img src={logoMark} alt="" className="h-full w-full object-contain" />
          </span>
          <p>{t.shell.footerTagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p>{t.shell.footerRights(new Date().getFullYear())}</p>
          <a
            href="https://hacettepeaiclub.com"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line/30 underline-offset-2 transition-colors duration-fast hover:text-fg"
          >
            {t.shell.footerCredit}
          </a>
        </div>
      </div>
    </footer>
  );
}
