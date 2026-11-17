// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installLocalStorage, installMatchMedia, restoreDom } from "@/test/dom";

/** The language switch's failure notice, as the visitor meets it. */

const TR_SHELL = "/src/i18n/tr.ts";

async function mountHeader() {
  const { ThemeProvider } = await import("@/app/ThemeProvider");
  const { LanguageProvider } = await import("@/i18n");
  const { SiteHeader } = await import("./SiteHeader");
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <LanguageProvider>
          <SiteHeader onFindLab={() => {}} onFindLabIntent={() => {}} />
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.resetModules();
  installLocalStorage();
  installMatchMedia(false);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  restoreDom();
  vi.doUnmock(TR_SHELL);
  vi.restoreAllMocks();
});

describe("SiteHeader language switch", () => {
  it("announces a failed switch in the current language, and can dismiss it", async () => {
    vi.doMock(TR_SHELL, () => {
      throw new TypeError("Failed to fetch dynamically imported module");
    });
    await mountHeader();
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "TR" }));
    await waitFor(() =>
      expect(status.textContent).toBe(
        "Couldn't switch to Türkçe. Check your connection and try again.",
      ),
    );
    // The switch itself still shows the language the page is in.
    expect(screen.getByRole("button", { name: "EN" }).getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(status.textContent).toBe("");
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
  });

  it("shows no notice after a switch that works", async () => {
    await mountHeader();
    fireEvent.click(screen.getByRole("button", { name: "TR" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "TR" }).getAttribute("aria-pressed")).toBe("true"),
    );
    expect(screen.getByRole("status").textContent).toBe("");
  });
});
