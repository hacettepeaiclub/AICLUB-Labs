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
    expect(boundary).toMatch(/window\.location\.reload\(\)/);
    expect(boundary).toMatch(/failed: false/);
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

  it("is announced, and offers a way out", () => {
    expect(boundary).toMatch(/role="alert"/);
    expect(boundary).toMatch(/copy\.errorRetry/);
    expect(boundary).toMatch(/copy\.errorBackToLabs/);
    expect(boundary).toMatch(/<Link/);
  });

  it("introduces no telemetry", () => {
    for (const banned of ["fetch(", "sendBeacon", "analytics", "Sentry", "track("]) {
      expect({ banned, found: boundary.includes(banned) }).toEqual({ banned, found: false });
    }
  });

  it("has its copy in both languages, and it explains rather than codes", () => {
    for (const dict of [en, tr]) {
      const shell = dict.shell;
      expect(shell.errorTitle.length).toBeGreaterThan(10);
      expect(shell.errorBody.length).toBeGreaterThan(40);
      expect(shell.errorRetry.length).toBeGreaterThan(2);
      expect(shell.errorBackToLabs.length).toBeGreaterThan(5);
      // No developer vocabulary in anything a visitor reads.
      const all = `${shell.errorTitle} ${shell.errorBody}`.toLowerCase();
      for (const banned of ["undefined", "null", "exception", "stack", "chunk"]) {
        expect({ banned, found: all.includes(banned) }).toEqual({ banned, found: false });
      }
    }
  });
});
