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
 * The suite runs in node with no DOM, so rendering a throwing child and
 * asserting on the fallback is not available here — that part is covered by
 * the browser QA run. What can be pinned here is everything a later edit could
 * quietly undo: that the boundary exists, that it wraps the routed content
 * *inside* the chrome rather than around it, that it resets, and that it never
 * puts the underlying error on screen.
 */
describe("error boundary", () => {
  const boundary = read("src/components/layout/ErrorBoundary.tsx");

  it("is a real boundary", () => {
    expect(boundary).toMatch(/static getDerivedStateFromError/);
    expect(boundary).toMatch(/componentDidCatch/);
  });

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

  it("recovers: reload on retry, and a clean slate on navigation", () => {
    // A state reset alone would not clear a cached lazy-import rejection,
    // which is the failure this boundary most often catches.
    expect(boundary).toMatch(/reloadPage\(/);
    expect(boundary).toMatch(/kind: null/);
    expect(boundary).toMatch(/resetKey/);
    expect(stripComments(read("src/components/layout/PageShell.tsx"))).toMatch(
      /resetKey=\{pathname\}/,
    );
  });

  it("shows the visitor no stack trace and no error text", () => {
    const body = stripComments(boundary);
    // The caught error is logged and never rendered.
    expect(body).toMatch(/console\.error/);
    expect(body).not.toMatch(/\{error\.message\}|\{this\.state\.error|componentStack\}/);
  });

  it("tells the three failures apart, and only says 'no connection' when the browser is offline", () => {
    const body = stripComments(boundary);
    expect(body).toMatch(/isLoadFailure\(error\) \? "load" : "runtime"/);
    // The offline screen is chosen by the browser's own offline flag, which is
    // reliable when false; a failed download while online is not called that.
    expect(body).toMatch(/if \(!online\) \{[\s\S]*?copy\.offline\.title/);
    expect(body).toMatch(/copy\.load\.lab : copy\.load\.page/);
    expect(body).toMatch(/copy\.runtime\.title/);
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

  it("restarts a broken experiment by remounting it, and says what that costs", () => {
    const body = stripComments(boundary);
    expect(body).toMatch(/<Fragment key=\{generation\}>/);
    expect(body).toMatch(/generation: state\.generation \+ 1/);
    expect(body).toMatch(/copy\.runtime\.restartNoteLab/);
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
    expect(tr.shell.errors.offline.title).toBe("Bağlantı yok.");
    expect(tr.shell.errors.load.lab).toBe("Lab yüklenemedi.");
    expect(tr.shell.errors.runtime.title).toBe("Bir sorun oluştu.");
    expect(tr.notFound.title).toBe("Bu sayfa bulunamadı.");
    expect(tr.shell.errors.retrying).toBe("Deneniyor…");
  });
});
