// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Suspense, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installLocalStorage, installMatchMedia, restoreDom } from "@/test/dom";

/**
 * Switching language, rendered.
 *
 * The invariant under test is the one the "İNSTRUMENTS" bug broke: the
 * document's `lang` and the dictionary on screen never disagree — not while a
 * switch is downloading, not after it lands, not after it fails. Every test
 * starts from a fresh module graph, because the dictionaries and the lab copy
 * are cached at module level, as they are for the life of a page.
 */

const SLUG = "sorting";
const TR_SHELL = "/src/i18n/tr.ts";
const TR_COPY = `/src/i18n/labs/tr/${SLUG}.ts`;
const OTHER = "pca";
const TR_OTHER = `/src/i18n/labs/tr/${OTHER}.ts`;

/** A promise the test settles by hand. */
function gate() {
  let open!: () => void;
  let fail!: () => void;
  const promise = new Promise<void>((resolve, reject) => {
    open = resolve;
    fail = () => reject(new TypeError("Failed to fetch dynamically imported module"));
  });
  return { promise, open, fail };
}
const unreachable = () => {
  throw new TypeError("Failed to fetch dynamically imported module");
};

/** Every `lang` written to <html>, with the page text at that moment. */
let writes: { lang: string; text: string }[] = [];
let observer: MutationObserver | null = null;

function watchLang() {
  writes = [];
  observer = new MutationObserver(() => {
    writes.push({
      lang: document.documentElement.lang,
      text: screen.queryByTestId("label")?.textContent ?? "",
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}

const LABEL = { en: "Language", tr: "Dil" } as const;

async function fresh() {
  const i18n = await import("@/i18n");
  const labs = await import("@/i18n/labs");
  const mismatches: string[] = [];
  let fallbacks = 0;

  /** Checks the invariant after every commit, and exposes the switch. */
  function Probe() {
    const t = i18n.useT();
    const { language, setLanguage, failed } = i18n.useLanguage();
    useEffect(() => {
      const lang = document.documentElement.lang;
      if (t.preferences.languageLabel !== LABEL[lang as "en" | "tr"]) {
        mismatches.push(`lang=${lang} label=${t.preferences.languageLabel}`);
      }
    });
    return (
      <>
        <p data-testid="label">{t.preferences.languageLabel}</p>
        <p data-testid="language">{language}</p>
        <p data-testid="failed">{failed ?? ""}</p>
        <button onClick={() => setLanguage("tr")}>tr</button>
        <button onClick={() => setLanguage("en")}>en</button>
      </>
    );
  }

  function Lab({ slug = SLUG }: { slug?: typeof SLUG | typeof OTHER }) {
    const copy = labs.useLabCopy(slug);
    return (
      <p data-testid={slug === SLUG ? "lab" : "other-lab"}>
        {Object.keys(copy).length > 0 ? "lab ready" : "empty"}
      </p>
    );
  }

  function Fallback() {
    fallbacks++;
    return <p>loading</p>;
  }

  const mount = (withLab = false) =>
    render(
      <i18n.LanguageProvider>
        <Probe />
        {withLab && (
          <Suspense fallback={<Fallback />}>
            <Lab />
          </Suspense>
        )}
      </i18n.LanguageProvider>,
    );

  /** Some labs on screen, each in its own boundary; rerender to open or leave one. */
  const page = (slugs: (typeof SLUG | typeof OTHER)[]) => (
    <i18n.LanguageProvider>
      <Probe />
      {slugs.map((slug) => (
        <Suspense key={slug} fallback={<Fallback />}>
          <Lab slug={slug} />
        </Suspense>
      ))}
    </i18n.LanguageProvider>
  );

  return { mount, page, mismatches, fallbacks: () => fallbacks };
}

const label = () => screen.getByTestId("label").textContent;
const lang = () => document.documentElement.lang;

beforeEach(() => {
  vi.resetModules();
  installLocalStorage();
  installMatchMedia(false);
  document.documentElement.setAttribute("lang", "en");
  vi.spyOn(console, "error").mockImplementation(() => {});
  watchLang();
});

afterEach(() => {
  observer?.disconnect();
  cleanup();
  restoreDom();
  vi.doUnmock(TR_SHELL);
  vi.doUnmock(TR_COPY);
  vi.doUnmock(TR_OTHER);
  vi.restoreAllMocks();
});

/** Every lang write happened with the matching text already on the page. */
function expectWritesConsistent() {
  for (const write of writes) {
    expect(write.text, `lang=${write.lang}`).toBe(LABEL[write.lang as "en" | "tr"]);
  }
}

describe("LanguageProvider", () => {
  it("switches language and dictionary in one step", async () => {
    const { mount, mismatches } = await fresh();
    mount();
    expect([lang(), label()]).toEqual(["en", "Language"]);

    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    // Still downloading: nothing has changed yet, on the page or on <html>.
    expect([lang(), label()]).toEqual(["en", "Language"]);

    await waitFor(() => expect(label()).toBe("Dil"));
    expect(lang()).toBe("tr");
    expect(window.localStorage.getItem("aiclub-labs-language")).toBe("tr");
    expect(mismatches).toEqual([]);
    expectWritesConsistent();
  });

  it("leaves everything as it was when the dictionary cannot load, and says so", async () => {
    vi.doMock(TR_SHELL, unreachable);
    const { mount, mismatches } = await fresh();
    mount();

    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    await waitFor(() => expect(screen.getByTestId("failed").textContent).toBe("tr"));
    expect([lang(), label()]).toEqual(["en", "Language"]);
    expect(screen.getByTestId("language").textContent).toBe("en");
    expect(window.localStorage.getItem("aiclub-labs-language")).toBeNull();
    expect(mismatches).toEqual([]);
    expect(writes.filter((write) => write.lang === "tr")).toEqual([]);
  });

  it("clears the failure once a later switch succeeds", async () => {
    vi.doMock(TR_SHELL, unreachable);
    const { mount } = await fresh();
    mount();
    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    await waitFor(() => expect(screen.getByTestId("failed").textContent).toBe("tr"));
    // Choosing the language already on screen is a no-op that dismisses it.
    fireEvent.click(screen.getByRole("button", { name: "en" }));
    expect(screen.getByTestId("failed").textContent).toBe("");
  });

  it("lets the latest choice win when the visitor switches back mid-download", async () => {
    const { mount, mismatches } = await fresh();
    mount();
    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    fireEvent.click(screen.getByRole("button", { name: "en" }));
    // Give the Turkish download every chance to land and (wrongly) commit.
    await act(async () => {
      await import("@/i18n/tr");
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect([lang(), label()]).toEqual(["en", "Language"]);
    expect(mismatches).toEqual([]);
  });

  it("switches an open lab without showing its loading spinner", async () => {
    const { mount, mismatches, fallbacks } = await fresh();
    mount(true);
    await screen.findByTestId("lab");
    const before = fallbacks();

    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    await waitFor(() => expect(label()).toBe("Dil"));
    expect(screen.getByTestId("lab")).toBeTruthy();
    expect(fallbacks()).toBe(before);
    expect(mismatches).toEqual([]);
    expectWritesConsistent();
  });

  it("does not switch when an open lab's copy cannot load in the new language", async () => {
    vi.doMock(TR_COPY, unreachable);
    const { mount, mismatches, fallbacks } = await fresh();
    mount(true);
    await screen.findByTestId("lab");
    const before = fallbacks();

    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    await waitFor(() => expect(screen.getByTestId("failed").textContent).toBe("tr"));
    expect([lang(), label()]).toEqual(["en", "Language"]);
    expect(screen.getByTestId("lab")).toBeTruthy();
    expect(fallbacks()).toBe(before);
    expect(mismatches).toEqual([]);
  });

  it("waits for a lab opened while the switch was downloading", async () => {
    // Lab A's Turkish copy is slow; lab B opens, in English, while it loads.
    const slow = gate();
    vi.doMock(TR_COPY, async () => {
      await slow.promise;
      return vi.importActual(TR_COPY);
    });
    const { page, mismatches, fallbacks } = await fresh();
    const view = render(page([SLUG]));
    await screen.findByTestId("lab");

    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    view.rerender(page([SLUG, OTHER]));
    await screen.findByTestId("other-lab");
    const before = fallbacks();

    await act(async () => slow.open());
    await waitFor(() => expect(label()).toBe("Dil"));
    // B's Turkish copy was waited for too, so neither lab suspended.
    expect(fallbacks()).toBe(before);
    expect(screen.getByTestId("lab")).toBeTruthy();
    expect(screen.getByTestId("other-lab")).toBeTruthy();
    expect(mismatches).toEqual([]);
    expectWritesConsistent();
  });

  it("is not cancelled by a lab the visitor left while its copy was failing", async () => {
    const doomed = gate();
    vi.doMock(TR_COPY, async () => {
      await doomed.promise;
      return vi.importActual(TR_COPY);
    });
    const { page, mismatches } = await fresh();
    const view = render(page([SLUG, OTHER]));
    await screen.findByTestId("lab");
    await screen.findByTestId("other-lab");

    fireEvent.click(screen.getByRole("button", { name: "tr" }));
    // The visitor leaves lab A; then its download fails.
    view.rerender(page([OTHER]));
    await act(async () => {
      doomed.fail();
      await doomed.promise.catch(() => {});
    });

    await waitFor(() => expect(label()).toBe("Dil"));
    expect(screen.getByTestId("failed").textContent).toBe("");
    expect(mismatches).toEqual([]);
  });

  it("starts in English and then switches when a stored language was not ready for the first render", async () => {
    window.localStorage.setItem("aiclub-labs-language", "tr");
    // What index.html does before the app loads.
    document.documentElement.setAttribute("lang", "tr");
    const { mount, mismatches } = await fresh();
    mount();
    await waitFor(() => expect(label()).toBe("Dil"));
    expect(lang()).toBe("tr");
    expect(mismatches).toEqual([]);
  });

  it("starts straight in the stored language when its dictionary was preloaded", async () => {
    window.localStorage.setItem("aiclub-labs-language", "tr");
    const { preloadLanguage } = await import("@/i18n");
    await preloadLanguage("tr");
    const { mount } = await fresh();
    mount();
    expect([lang(), label()]).toEqual(["tr", "Dil"]);
  });
});
