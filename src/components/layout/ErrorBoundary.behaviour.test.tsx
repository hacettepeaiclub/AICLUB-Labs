// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/en";
import { LanguageProvider } from "@/i18n";
import { installMatchMedia, restoreDom, setOnline } from "@/test/dom";
import { ErrorBoundary } from "./ErrorBoundary";

const copy = en.shell.errors;

/**
 * The boundary, rendered.
 *
 * What these pin is what a visitor sees: which of the three screens a failure
 * lands on, that the underlying error never reaches the page, that a restart
 * really remounts, and that navigation clears the failure. The retry loop's
 * network probing is exercised end to end in e2e/errors.e2e.ts.
 */

let fault: Error | null = null;
let mounts = 0;

function Child() {
  mounts++;
  if (fault) throw fault;
  return <p>experiment</p>;
}

const loadError = () =>
  new TypeError(
    "Failed to fetch dynamically imported module: http://localhost:3000/assets/lab-abc.js",
  );

function Harness({ scope = "lab" as "lab" | "page" }) {
  const [key, setKey] = useState("a");
  return (
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <button onClick={() => setKey("b")}>navigate</button>
        <ErrorBoundary resetKey={key} scope={scope}>
          <Child />
        </ErrorBoundary>
      </LanguageProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  fault = null;
  mounts = 0;
  installMatchMedia(false);
  setOnline(true);
  // The boundary logs what it caught; React logs it as well. Both are expected.
  vi.spyOn(console, "error").mockImplementation(() => {});
  // `fileIsGone` asks the server about the failed file; here it is still there.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 200 })),
  );
});

afterEach(() => {
  cleanup();
  restoreDom();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders its children when nothing fails", () => {
    render(<Harness />);
    expect(screen.getByText("experiment")).toBeTruthy();
  });

  it("says the lab could not load when a file failed to download while online", () => {
    fault = loadError();
    render(<Harness />);
    expect(screen.getByText(copy.load.lab)).toBeTruthy();
    expect(screen.getByRole("button", { name: copy.retry })).toBeTruthy();
    expect(screen.queryByText(copy.offline.title)).toBeNull();
  });

  it("says there is no connection only when the browser is offline", () => {
    fault = loadError();
    setOnline(false);
    render(<Harness />);
    expect(screen.getByText(copy.offline.title)).toBeTruthy();
    expect(screen.getByText(copy.offline.lab)).toBeTruthy();
    expect(screen.queryByText(copy.load.lab)).toBeNull();
  });

  it("treats anything else as a runtime failure, and restarting remounts the child", () => {
    fault = new Error("boom: internal detail");
    render(<Harness />);
    expect(screen.getByText(copy.runtime.title)).toBeTruthy();
    // The developer's message stays in the console.
    expect(screen.queryByText(/internal detail/)).toBeNull();

    fault = null;
    const before = mounts;
    fireEvent.click(screen.getByRole("button", { name: copy.runtime.restartLab }));
    expect(screen.getByText("experiment")).toBeTruthy();
    expect(mounts).toBeGreaterThan(before);
  });

  it("offers a reload when a restart fails again straight away", () => {
    fault = new Error("boom");
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: copy.runtime.restartLab }));
    expect(screen.getByText(copy.runtime.restartFailed)).toBeTruthy();
    expect(screen.getByRole("button", { name: copy.reload })).toBeTruthy();
  });

  it("clears the failure when the reset key changes", () => {
    fault = loadError();
    render(<Harness />);
    expect(screen.getByText(copy.load.lab)).toBeTruthy();
    fault = null;
    fireEvent.click(screen.getByText("navigate"));
    expect(screen.getByText("experiment")).toBeTruthy();
    expect(screen.queryByText(copy.load.lab)).toBeNull();
  });

  it("switches from the load screen to the offline screen when the connection drops", () => {
    fault = loadError();
    render(<Harness />);
    act(() => setOnline(false));
    expect(screen.getByText(copy.offline.title)).toBeTruthy();
  });

  it("uses an h1 when it replaces a whole page, and an h2 inside a lab", () => {
    fault = loadError();
    const { unmount } = render(<Harness scope="page" />);
    expect(screen.getByRole("heading", { level: 1, name: copy.load.page })).toBeTruthy();
    unmount();
    render(<Harness scope="lab" />);
    expect(screen.getByRole("heading", { level: 2, name: copy.load.lab })).toBeTruthy();
  });
});
