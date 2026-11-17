import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyLanguage,
  readLanguage,
  writePreference,
  LANGUAGE_KEY,
  type Language,
} from "@/app/preferences";
import { en } from "./en";
import type { Translation } from "./types";

/**
 * Something the page needs in a language before it can be shown in it.
 *
 * The shell dictionary is always one. A lab on screen adds its teaching copy
 * (see `useLanguageDependency`), so a switch inside a lab waits for that too
 * instead of committing the language and then suspending the lab behind its
 * spinner while its copy downloads.
 */
type Dependency = (language: Language) => Promise<unknown>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** The language a switch to failed, until it is dismissed or retried. */
  failed: Language | null;
  dismissFailure: () => void;
  /** The whole dictionary for the active language. */
  t: Translation;
  register: (dependency: Dependency) => () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Dictionaries already resolved. English is here from the start; Turkish
 * arrives the first time anyone asks for it.
 */
const loaded = new Map<Language, Translation>([["en", en]]);

/**
 * Fetch a dictionary, loading it if this is the first time.
 *
 * Shipping both to everyone means every English visitor downloads a Turkish
 * copy they will never read, so the non-default one is a separate chunk.
 *
 * This is the *shell* dictionary only — chrome, the home page, category names
 * and the lab titles the grid prints. The teaching copy travels separately and
 * per lab; see `i18n/labs`.
 */
async function load(language: Language): Promise<Translation> {
  const cached = loaded.get(language);
  if (cached) return cached;
  const module = await import("./tr");
  loaded.set("tr", module.tr);
  return module.tr;
}

/**
 * Load the visitor's dictionary before the app first renders.
 *
 * Without it a returning Turkish visitor saw the page in English for as long
 * as the Turkish chunk took to arrive. `main.tsx` waits on this, and the page
 * has usually started fetching the chunk already (see `index.html`), so the
 * wait is short. A failure to load is not fatal: the app renders in English
 * and tries again once mounted (see `LanguageProvider`).
 */
export function preloadLanguage(language: Language): Promise<void> {
  return load(language).then(
    () => undefined,
    () => undefined,
  );
}

/** A language together with its dictionary: the two only ever change as one. */
interface Active {
  language: Language;
  t: Translation;
}

/**
 * Owns the visitor's language.
 *
 * There is no key-string lookup here and no `t("some.dotted.key")`: components
 * read `useLabCopy("tokenization").guess.heading` straight off a typed object. A missing
 * or misspelt key is a compile error rather than a string that renders as its
 * own name, and every interpolated value keeps its type — a count is a number
 * on both sides of the translation.
 *
 * ## A switch is atomic
 *
 * The language and its dictionary are one piece of state, and a switch
 * commits it only once everything the page needs in the new language has
 * arrived: the shell dictionary and the copy of any lab on screen. Until then
 * the page stays, whole, in the old language. `<html lang>` follows the
 * *committed* language in a layout effect, so it is never written ahead of the
 * dictionary — the order that used to give "İNSTRUMENTS": Turkish uppercase
 * rules applied to English labels. (`startTransition` would not have helped:
 * it defers React's render, not a direct DOM write made before it.)
 *
 * A switch that cannot load leaves everything as it was and sets `failed`,
 * which the switcher reports. Only the most recent request counts: switching
 * back while a download is under way cancels it.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Active>(() => {
    const wanted: Language = typeof document === "undefined" ? "en" : readLanguage();
    const t = loaded.get(wanted);
    // A stored language whose dictionary did not load before the first render
    // starts in English, and the effect below switches once it arrives.
    return t ? { language: wanted, t } : { language: "en", t: en };
  });
  const [failed, setFailed] = useState<Language | null>(null);
  const dependencies = useRef(new Set<Dependency>());
  const request = useRef(0);
  const current = useRef(active.language);
  current.current = active.language;

  useLayoutEffect(() => {
    applyLanguage(active.language);
  }, [active.language]);

  const switchTo = useCallback((next: Language, remember: boolean) => {
    const id = ++request.current;
    if (next === current.current) {
      setFailed(null);
      return;
    }
    const needs = [...dependencies.current].map((dependency) => dependency(next));
    Promise.all([load(next), ...needs]).then(
      ([t]) => {
        if (id !== request.current) return;
        if (remember) writePreference(LANGUAGE_KEY, next);
        setFailed(null);
        setActive({ language: next, t });
      },
      (error: unknown) => {
        if (id !== request.current) return;
        console.error(`Could not switch the language to "${next}":`, error);
        setFailed(next);
      },
    );
  }, []);

  const setLanguage = useCallback((next: Language) => switchTo(next, true), [switchTo]);

  // A returning visitor whose dictionary was not ready for the first render
  // (see above): finish the switch now. The preference is already stored.
  useEffect(() => {
    const wanted = readLanguage();
    if (wanted !== current.current) switchTo(wanted, false);
  }, [switchTo]);

  const dismissFailure = useCallback(() => setFailed(null), []);

  const register = useCallback((dependency: Dependency) => {
    dependencies.current.add(dependency);
    return () => {
      dependencies.current.delete(dependency);
    };
  }, []);

  const value = useMemo(
    () => ({ ...active, setLanguage, failed, dismissFailure, register }),
    [active, setLanguage, failed, dismissFailure, register],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

/** The active language, the setter, and how the last switch went. For the switcher, mostly. */
export function useLanguage(): Pick<
  LanguageContextValue,
  "language" | "setLanguage" | "failed" | "dismissFailure"
> {
  const { language, setLanguage, failed, dismissFailure } = useLanguageContext();
  return { language, setLanguage, failed, dismissFailure };
}

/** The dictionary. What almost every component wants. */
export function useT(): Translation {
  return useLanguageContext().t;
}

/**
 * Make a language switch wait for `dependency` while this component is mounted.
 *
 * The switch commits only once it resolves, and is abandoned if it rejects. It
 * is read through a ref, so passing a new function every render is fine.
 */
export function useLanguageDependency(dependency: Dependency): void {
  const { register } = useLanguageContext();
  const latest = useRef(dependency);
  latest.current = dependency;
  useEffect(() => register((language) => latest.current(language)), [register]);
}

/** The slugs the grid can name — every registered lab. */
export type LabSlug = keyof Translation["labMeta"];

export const isLabSlug = (slug: string): slug is LabSlug =>
  Object.prototype.hasOwnProperty.call(en.labMeta, slug);

/**
 * Canonical English identity with a description in the active language.
 *
 * The registry keeps `meta.ts` as the structural source of truth (slug,
 * category, minutes) and the wording lives here, so the home page can list a
 * lab without loading it and still say its name in Turkish.
 *
 * `termLang` is "en" when the active language leaves the term in English;
 * put it on whatever shows the term, as `lang`. Lab names stay English; subject terms follow the selected language.
 *
 * `term` is the subject's own technical name — "Floating point" under the
 * title "0.1 + 0.2". The title says what the lab is about; the term says what
 * a student would search for, and both are shown and both are searchable.
 *
 * These strings stayed in the shell dictionary when the rest of the teaching
 * copy moved to its own chunk (`i18n/labs`), because the grid says them
 * before a visitor has chosen anything.
 */
export function useLabMeta(
  slug: string,
): { title: string; term: string; termLang?: "en"; figure: string; description: string } | null {
  const t = useT();
  if (!isLabSlug(slug)) return null;
  return {
    ...t.labMeta[slug],
    title: en.labMeta[slug].title,
    term: t.labMeta[slug].term,
    termLang: t.englishTerms.includes(slug) ? "en" : undefined,
  };
}

export type { Translation } from "./types";
export { markEnglish } from "./markEnglish";
export { en } from "./en";
