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
});
