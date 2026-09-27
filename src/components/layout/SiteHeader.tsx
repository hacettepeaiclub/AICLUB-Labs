import { useRef, type CSSProperties, type PointerEvent } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "@/app/ThemeProvider";
import type { Language, ThemeName } from "@/app/preferences";
import logoMark from "@/assets/aiclub-mark-white.png";
import { useLanguage, useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { PreferenceToggle, type ToggleOption } from "./PreferenceToggle";

const SunIcon = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </svg>
);

const MoonIcon = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
    <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1z" />
  </svg>
);

/**
 * The header: settled, one line, and still.
 *
 * Nothing in it moves on its own except the mark, once, on load: a signal runs
 * up the logo's own strands. After that it only answers the pointer — a short
 * light on the hairline below it, under wherever the pointer is — and the mark
 * replays its signal on hover. The pointer position is written straight to a
 * CSS variable rather than into React state, so following it never re-renders.
 */
export function SiteHeader() {
  const t = useT();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);

  const languages: readonly ToggleOption<Language>[] = [
    { value: "en", label: t.preferences.english, title: t.preferences.englishFull },
    { value: "tr", label: t.preferences.turkish, title: t.preferences.turkishFull },
  ];

  const themes: readonly ToggleOption<ThemeName>[] = [
    { value: "light", label: t.preferences.light, icon: SunIcon },
    { value: "dark", label: t.preferences.dark, icon: MoonIcon },
  ];

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    headerRef.current?.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  };
  const releasePointer = () => headerRef.current?.style.setProperty("--mx", "-200px");

  return (
    <header
      ref={headerRef}
      onPointerMove={followPointer}
      onPointerLeave={releasePointer}
      className="header-glow sticky top-0 z-40 border-b border-line/10 bg-ink-950/80 backdrop-blur-md"
    >
      {/* The header takes a tighter gutter than `.shell` at the smallest
          widths. At 360px the two preference pills plus the wordmark overran
          the viewport by 18px; the page gutter is generous for reading and too
          generous for a control bar. Everything else on the page keeps
          `.shell`. */}
      <div className="mx-auto flex min-h-16 w-full max-w-shell flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-2 sm:gap-x-3 sm:px-6 md:px-10">
        <Link to="/" className="brand-link flex shrink-0 items-center gap-2.5 rounded">
          <span
            aria-hidden
            className="brand-mark block h-8 w-[31px] shrink-0"
            style={{ "--mark": `url(${logoMark})` } as CSSProperties}
          />
          {/* The wordmark stays at every width. It used to be the first thing
              dropped, which left a phone showing a 32px deer and two preference
              toggles — a header where the controls outranked the product's own
              name. The theme toggle yields instead; it is the least urgent
              control on the page. */}
          <span className="whitespace-nowrap font-display text-caption font-semibold uppercase tracking-[0.18em] text-fg sm:text-body-sm sm:tracking-[0.22em]">
            {t.shell.brand} <span className="text-fg-muted">{t.shell.brandSuffix}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label={t.shell.primaryNav} className="hidden sm:block">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "rounded px-3 py-2 text-body-sm font-medium transition-colors duration-fast",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )
              }
            >
              {t.shell.allLabs}
            </NavLink>
          </nav>

          <PreferenceToggle
            label={t.preferences.languageLabel}
            value={language}
            options={languages}
            onChange={setLanguage}
          />
          <PreferenceToggle
            label={t.preferences.themeLabel}
            value={theme}
            options={themes}
            onChange={setTheme}
          />
        </div>
      </div>
    </header>
  );
}
