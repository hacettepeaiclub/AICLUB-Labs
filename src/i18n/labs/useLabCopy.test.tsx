// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { Component, Suspense, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installLocalStorage, restoreDom } from "@/test/dom";

/**
 * Loading one lab's teaching copy, rendered.
 *
 * The loader keeps module-level caches, so every test starts from a fresh copy
 * of the module graph (`vi.resetModules`) — which is also exactly what a page
 * reload gives a visitor.
 */

const SLUG = "sorting";
const COPY_MODULE = `/src/i18n/labs/en/${SLUG}.ts`;

class Catch extends Component<{ children: ReactNode }, { error: unknown }> {
  state = { error: null as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  render() {
    return this.state.error ? <p role="alert">failed</p> : this.props.children;
  }
}

/** A fresh module graph, as after a reload, with the provider and the hook. */
async function fresh() {
  const i18n = await import("@/i18n");
  const labs = await import("@/i18n/labs");
  function Reader() {
    const copy = labs.useLabCopy(SLUG);
    return <h2>{typeof copy === "object" && copy !== null ? "copy loaded" : "no copy"}</h2>;
  }
  const mount = () =>
    render(
      <i18n.LanguageProvider>
        <Catch>
          <Suspense fallback={<p role="status">loading</p>}>
            <Reader />
          </Suspense>
        </Catch>
      </i18n.LanguageProvider>,
    );
  return { ...labs, mount };
}

beforeEach(() => {
  vi.resetModules();
  installLocalStorage();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  restoreDom();
  vi.doUnmock(COPY_MODULE);
  vi.restoreAllMocks();
});

describe("useLabCopy", () => {
  it("suspends on first read, then renders the lab's copy", async () => {
    const { mount } = await fresh();
    mount();
    expect(screen.getByRole("status").textContent).toBe("loading");
    expect(await screen.findByText("copy loaded")).toBeTruthy();
  });

  it("reads synchronously once the copy is cached", async () => {
    const { mount } = await fresh();
    const first = mount();
    await screen.findByText("copy loaded");
    first.unmount();
    mount();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText("copy loaded")).toBeTruthy();
  });

  it("hands a failed download to the error boundary instead of spinning forever", async () => {
    vi.doMock(COPY_MODULE, () => {
      throw new TypeError("Failed to fetch dynamically imported module");
    });
    const { mount } = await fresh();
    mount();
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("recovers after a reload once the file can be fetched again", async () => {
    vi.doMock(COPY_MODULE, () => {
      throw new TypeError("Failed to fetch dynamically imported module");
    });
    const broken = await fresh();
    const view = broken.mount();
    await screen.findByRole("alert");
    view.unmount();

    vi.doUnmock(COPY_MODULE);
    vi.resetModules();
    const reloaded = await fresh();
    reloaded.mount();
    expect(await screen.findByText("copy loaded")).toBeTruthy();
  });

  describe("after a failed prefetch", () => {
    /** The copy file, unreachable until `restore()` — the network coming back. */
    function flakyCopy() {
      const state = { down: true, attempts: 0 };
      vi.doMock(COPY_MODULE, async () => {
        state.attempts++;
        if (state.down) throw new TypeError("Failed to fetch dynamically imported module");
        return vi.importActual(COPY_MODULE);
      });
      return state;
    }

    it("opens the lab normally once the copy can be fetched (R3)", async () => {
      const network = flakyCopy();
      const { mount, prefetchLabCopy } = await fresh();
      prefetchLabCopy(SLUG, "en");
      await vi.waitFor(() => expect(network.attempts).toBe(1));
      // Let the rejection settle before the visitor clicks.
      await new Promise((resolve) => setTimeout(resolve, 0));

      network.down = false;
      mount();
      expect(await screen.findByText("copy loaded")).toBeTruthy();
      expect(screen.queryByRole("alert")).toBeNull();
      expect(network.attempts).toBe(2);
    });

    it("still reports the failure when the read's own request fails", async () => {
      const network = flakyCopy();
      const { mount, prefetchLabCopy } = await fresh();
      prefetchLabCopy(SLUG, "en");
      await vi.waitFor(() => expect(network.attempts).toBe(1));
      await new Promise((resolve) => setTimeout(resolve, 0));

      mount();
      expect(await screen.findByRole("alert")).toBeTruthy();
      expect(network.attempts).toBe(2);
    });

    it("asks once more, as itself, when it joined a prefetch that then failed", async () => {
      const network = flakyCopy();
      const { mount, prefetchLabCopy } = await fresh();
      // The read starts while the prefetch is still under way.
      prefetchLabCopy(SLUG, "en");
      mount();
      expect(await screen.findByRole("alert")).toBeTruthy();
      // One request for the prefetch, one for the read: bounded, no loop.
      expect(network.attempts).toBe(2);
    });

    it("prefetching again after a failure is allowed, and its success is used", async () => {
      const network = flakyCopy();
      const { mount, prefetchLabCopy } = await fresh();
      prefetchLabCopy(SLUG, "en");
      await vi.waitFor(() => expect(network.attempts).toBe(1));
      await new Promise((resolve) => setTimeout(resolve, 0));

      network.down = false;
      prefetchLabCopy(SLUG, "en");
      await vi.waitFor(() => expect(network.attempts).toBe(2));
      await new Promise((resolve) => setTimeout(resolve, 0));
      mount();
      // Cached by the second prefetch: no spinner, no third request.
      expect(screen.getByText("copy loaded")).toBeTruthy();
      expect(network.attempts).toBe(2);
    });

    it("asks at a fresh address when the browser keeps the failed module (R3)", async () => {
      // Chromium's module map remembers a failed import: asking for the same
      // address again rejects at once, so this mock stays down for good. The
      // failure names the file, as Chromium's message does.
      let attempts = 0;
      vi.doMock(COPY_MODULE, () => {
        attempts++;
        throw new TypeError(
          `Failed to fetch dynamically imported module: ${window.location.origin}${COPY_MODULE}`,
        );
      });
      const { mount, prefetchLabCopy } = await fresh();
      prefetchLabCopy(SLUG, "en");
      await vi.waitFor(() => expect(attempts).toBe(1));
      await new Promise((resolve) => setTimeout(resolve, 0));

      mount();
      // The read went to `${COPY_MODULE}?retry=…`, which the map has never seen.
      expect(await screen.findByText("copy loaded")).toBeTruthy();
      expect(screen.queryByRole("alert")).toBeNull();
      expect(attempts).toBe(1);
    });

    // When the failure gives no trustworthy module address, the read asks the
    // original loader again (the WebKit path) and reports what it gets: here
    // the address stays down, so the lab's boundary takes over.
    for (const [name, error] of [
      ["names no file (WebKit)", () => new TypeError("Importing a module script failed.")],
      [
        "is not a module download failure",
        () => new Error(`boom at ${window.location.origin}${COPY_MODULE}`),
      ],
      [
        "names a stylesheet, not a module",
        () => new Error(`Unable to preload CSS for ${window.location.origin}/assets/pca.css`),
      ],
      [
        "names another lab's copy file",
        () =>
          new TypeError(
            `Failed to fetch dynamically imported module: ${window.location.origin}/src/i18n/labs/en/pca.ts`,
          ),
      ],
      [
        "names another host",
        () =>
          new TypeError("Failed to fetch dynamically imported module: https://example.com/x.js"),
      ],
    ] as const) {
      it(`does not ask at a fresh address when the failure ${name}`, async () => {
        let attempts = 0;
        vi.doMock(COPY_MODULE, () => {
          attempts++;
          throw error();
        });
        const { mount, prefetchLabCopy } = await fresh();
        prefetchLabCopy(SLUG, "en");
        await vi.waitFor(() => expect(attempts).toBe(1));
        await new Promise((resolve) => setTimeout(resolve, 0));

        mount();
        expect(await screen.findByRole("alert")).toBeTruthy();
        // The second request went to the original loader, not a fresh address.
        expect(attempts).toBe(2);
      });
    }
  });
});
