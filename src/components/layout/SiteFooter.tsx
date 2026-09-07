import logoMark from "@/assets/aiclub-mark-white.png";
import { useT } from "@/i18n";

/**
 * The footer, and the only place the parent organisation is named.
 *
 * Labs is a product of Hacettepe AI Club, not a second copy of its website —
 * so the relationship is one line and one link, not an About section. Anyone
 * who wants the community follows it; anyone who wants a lab never has to.
 */
export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-line/10">
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-8">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded bg-accent-fill p-1.5">
            <img src={logoMark} alt="" className="h-full w-full object-contain" />
          </span>
          <div className="text-caption leading-snug">
            <p className="font-display font-semibold text-fg">
              {t.shell.brand} {t.shell.brandSuffix}
            </p>
            <p className="text-fg-faint">
              {t.shell.byLine}{" "}
              <a
                href="https://www.hacettepeaiclub.com/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line/30 underline-offset-2 transition-colors duration-fast hover:text-fg"
              >
                {t.shell.parentOrg}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-fg-faint">
          <span className="font-mono text-accent">{t.shell.hashtag}</span>
          <p className="tabular-nums">{t.shell.footerRights(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}
