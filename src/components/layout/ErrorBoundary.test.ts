import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";

const read = (path: string) => readFileSync(path, "utf8");
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

/**
 * The boundary, checked at the source.
 *
 * What it shows for each failure, that it hides the error, restarts and
 * resets is rendered and asserted in ErrorBoundary.behaviour.test.tsx. What
 * stays here is placement and shape that a render of the boundary alone cannot
 * see: that it wraps the routed content *inside* the chrome rather than around
 * it, that the auto-retry loop keeps its bounds, that it adds no telemetry,
 * and that its copy exists in both languages.
 */
describe("error boundary", () => {
  const boundary = read("src/components/layout/ErrorBoundary.tsx");

  it("sits inside the page chrome, so the header and footer survive", () => {
    // The whole point: wrapping PageShell instead of its children would have
    // taken the navigation down with the page, which is the bug being fixed.
    const shell = stripComments(read("src/components/layout/PageShell.tsx"));
    const header = shell.indexOf("<SiteHeader");
    const boundaryAt = shell.indexOf("<ErrorBoundary");
    const footer = shell.indexOf("<SiteFooter");
    expect(header).toBeGreaterThan(-1);
    expect(boundaryAt).toBeGreaterThan(header);
    expect(footer).toBeGreaterThan(boundaryAt);
  });

  it("also wraps the lazy lab, so a failed chunk keeps the lab shell", () => {
    const page = stripComments(read("src/pages/LabPage.tsx"));
    const boundaryAt = page.indexOf("<ErrorBoundary");
    const suspense = page.indexOf("<Suspense");
    expect(boundaryAt).toBeGreaterThan(-1);
    expect(suspense).toBeGreaterThan(boundaryAt);
    expect(page).toMatch(/<LabShell[\s\S]*<ErrorBoundary/);
  });

  it("recovers: reload on retry, and the page shell resets it per route", () => {
    // A state reset alone would not clear a cached lazy-import rejection,
    // which is the failure this boundary most often catches. That a new
    // resetKey clears the screen is exercised in ErrorBoundary.behaviour.test.tsx.
    expect(boundary).toMatch(/reloadPage\(/);
    expect(stripComments(read("src/components/layout/PageShell.tsx"))).toMatch(
      /resetKey=\{pathname\}/,
    );
  });

  it("retries on its own only after a failed download, a bounded number of times, never two at once", () => {
    const body = stripComments(boundary);
    // The behaviour itself is exercised in e2e/errors.e2e.ts; this pins its shape.
    expect(body).toMatch(
      /this\.state\.kind === "load" && previous\.online !== this\.props\.online/,
    );
    expect(body).toMatch(/loop !== this\.loop/);
    expect(body).toMatch(/const AUTO_RETRY_DELAYS = \[[^\]]+\]/);
    expect(body).toMatch(/for \(const delay of AUTO_RETRY_DELAYS\)/);
    expect(body).toMatch(/if \(this\.attempting\) return false;/);
  });

  it("reloads only once the site has answered", () => {
    const body = stripComments(boundary);
    const attempt = body.slice(
      body.indexOf("private attempt = "),
      body.indexOf("private retry = "),
    );
    expect(attempt).toMatch(/await siteAnswers\(\)/);
    expect(attempt).toMatch(/answers && current\(\) && \(await reloadPage\(current\)\)/);
    // A failed attempt frees the button again.
    expect(attempt).toMatch(/this\.setState\(\{ busy: false, note: "unreachable" \}\)/);
  });

  it("shows the attempt on the button and ignores clicks during it", () => {
    const body = stripComments(boundary);
    expect(body).toMatch(/onClick=\{busy \? undefined : this\.retry\}/);
    expect(body).toMatch(/aria-disabled=\{busy \|\| undefined\}/);
    expect(body).toMatch(/busy \? copy\.retrying : copy\.retry/);
  });

  it("is announced once per message, and offers a way out", () => {
    const panel = stripComments(read("src/components/layout/ErrorPanel.tsx"));
    // The title and body are the alert; the button and top bar change on
    // every attempt and are outside it.
    expect(panel).toMatch(/role=\{announce \? "alert" : undefined\}/);
    expect(panel).toMatch(/role="status"/);
    expect(stripComments(boundary)).toMatch(/copy\.backToLabs/);
    expect(boundary).toMatch(/<Link/);
  });

  it("holds the cursor still for a visitor who asked for less motion", () => {
    const panel = stripComments(read("src/components/layout/ErrorPanel.tsx"));
    expect(panel).toMatch(/blinking=\{waiting && !reduced\}/);
    expect(panel).toMatch(/\{blinking && \(\s*<animate/);
  });

  it("gives the not-found page the same frame, with nothing to retry", () => {
    const page = stripComments(read("src/pages/NotFoundPage.tsx"));
    expect(page).toMatch(/<ErrorPanel/);
    expect(page).toMatch(/heading="h1"/);
    expect(page).not.toMatch(/retry|waiting|onClick/i);
  });

  it("tells the visitor they are offline before they click into a failure", () => {
    const shell = stripComments(read("src/components/layout/PageShell.tsx"));
    expect(shell).toMatch(/<OfflineNotice \/>/);
    expect(shell).toMatch(/role="status"/);
    expect(shell).toMatch(/t\.shell\.offlineNotice/);
  });

  it("introduces no telemetry", () => {
    for (const banned of ["fetch(", "sendBeacon", "analytics", "Sentry", "track("]) {
      expect({ banned, found: boundary.includes(banned) }).toEqual({ banned, found: false });
    }
  });

  it("has its copy in both languages, and it explains rather than codes", () => {
    for (const dict of [en, tr]) {
      const e = dict.shell.errors;
      const all = [
        e.offline.title,
        e.offline.lab,
        e.offline.page,
        e.load.lab,
        e.load.page,
        e.load.body,
        e.load.stale,
        e.runtime.title,
        e.runtime.lab,
        e.runtime.page,
        e.runtime.restartFailed,
        e.unreachable,
        dict.notFound.title,
        dict.notFound.body,
        dict.shell.offlineNotice,
      ];
      for (const text of all) expect(text.length).toBeGreaterThan(8);
      // No developer vocabulary in anything a visitor reads.
      const joined = all.join(" ").toLowerCase();
      for (const banned of ["undefined", "null", "exception", "stack", "chunk", "import"]) {
        expect({ banned, found: joined.includes(banned) }).toEqual({ banned, found: false });
      }
    }
    expect(tr.shell.errors.offline.title).toBe("İnternet bağlantısı yok");
    expect(tr.shell.errors.load.lab).toBe("Lab yüklenemedi");
    expect(tr.shell.errors.runtime.title).toBe("Beklenmeyen hata");
    expect(tr.notFound.title).toBe("Bu sayfa bulunamadı.");
    expect(tr.shell.errors.retrying).toBe("Yeniden deneniyor…");
  });
});
