import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** The whole dictionary for the active language. */
  t: Translation;
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
 * copy they will never read, so the non-default one is a separate chunk. The
 * switch is imperceptible on any real connection, and the language simply
 * stays as it was until the file lands.
 *
 * This is the *shell* dictionary only — chrome, the home page, category names
 * and the lab titles the grid prints. The teaching copy travels separately and
 * per language too; see `i18n/labs`.
 */
async function load(language: Language): Promise<Translation> {
  const cached = loaded.get(language);
  if (cached) return cached;
  const module = await import("./tr");
  loaded.set("tr", module.tr);
  return module.tr;
}

/**
 * Owns the visitor's language.
 *
 * There is no key-string lookup here and no `t("some.dotted.key")`: components
 * read `useLabs().tokenizer.guess.heading` straight off a typed object. A missing
 * or misspelt key is a compile error rather than a string that renders as its
 * own name, and every interpolated value keeps its type — a count is a number
 * on both sides of the translation.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    typeof document === "undefined" ? "en" : readLanguage(),
  );
  const [dictionary, setDictionary] = useState<Translation>(() => loaded.get(language) ?? en);

  // Covers the first paint for a returning Turkish visitor: the preference is
  // read synchronously, the dictionary cannot be, so it arrives a tick later.
  useEffect(() => {
    let cancelled = false;
    const cached = loaded.get(language);
    if (cached) {
      setDictionary(cached);
      return;
    }
    void load(language).then((next) => {
      if (!cancelled) setDictionary(next);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    applyLanguage(next);
    writePreference(LANGUAGE_KEY, next);
    setLanguageState(next);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, t: dictionary }),
    [language, setLanguage, dictionary],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

/** The active language and the setter. For the switcher, mostly. */
export function useLanguage(): Omit<LanguageContextValue, "t"> {
  const { language, setLanguage } = useLanguageContext();
  return { language, setLanguage };
}

/** The dictionary. What almost every component wants. */
export function useT(): Translation {
  return useLanguageContext().t;
}

/** The slugs the grid can name — every registered lab. */
export type LabSlug = keyof Translation["labMeta"];

export const isLabSlug = (slug: string): slug is LabSlug =>
  Object.prototype.hasOwnProperty.call(en.labMeta, slug);

/**
 * A lab's name and one-line description, in the active language.
 *
 * The registry keeps `meta.ts` as the structural source of truth (slug,
 * category, minutes) and the wording lives here, so the home page can list a
 * lab without loading it and still say its name in Turkish.
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
): { title: string; term: string; description: string } | null {
  const t = useT();
  return isLabSlug(slug) ? t.labMeta[slug] : null;
}

export type { Translation } from "./types";
export { en } from "./en";
