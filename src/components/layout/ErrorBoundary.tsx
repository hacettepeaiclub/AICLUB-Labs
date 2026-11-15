import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui";
import { useOnline } from "@/hooks/useOnline";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/i18n";
import type { Translation } from "@/i18n/types";
import { ErrorPanel } from "./ErrorPanel";
import { failedFile, fileIsGone, isLoadFailure, reloadPage, siteAnswers } from "./loadFailure";

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Changing this resets the boundary.
   *
   * The route path is the natural value: navigating somewhere else should not
   * leave the visitor looking at the failure of the page they left.
   */
  resetKey?: string;
  /** Offer a way back to the collection. Off on the home page, which is it. */
  showBackLink?: boolean;
  /** Whether this boundary holds one lab's experiment, or a whole page. */
  scope?: "lab" | "page";
}

type Copy = Translation["shell"]["errors"];

interface BoundaryProps extends ErrorBoundaryProps {
  copy: Copy;
  online: boolean;
  reduced: boolean;
  path: string;
}

interface BoundaryState {
  /** What failed: a file that could not be downloaded, or the page itself. */
  kind: "load" | "runtime" | null;
  /** The failed file is gone from the server: the site was deployed again. */
  stale: boolean;
  /** An attempt is under way; the button says so and ignores clicks. */
  busy: boolean;
  /** The result of the last attempt, when it did not work. */
  note: "" | "unreachable" | "restartFailed";
  /** Bumped to remount the children from scratch. */
  generation: number;
}

/**
 * After the connection comes back, the site is asked whether it answers this
 * many times, this far apart: a network often reports itself up a moment
 * before it can reach anything. Then it stops; the visitor can still press
 * the button.
 */
const AUTO_RETRY_DELAYS = [0, 3000, 10000];
/** A failure this soon after a restart is the same failure again. */
const RESTART_WINDOW = 2000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The one thing standing between a thrown component and a blank page.
 *
 * Before this existed, any error below the router took the whole tree with it:
 * React 18 unmounts the root on an uncaught render error, so the header, the
 * navigation and the footer went with the lab. It sits inside the page chrome,
 * so those survive whatever happens here.
 *
 * ## Three failures, three answers
 *
 * - **Offline, and the page was not downloaded yet.** Only when the browser
 *   says it is offline, which it reports reliably. The boundary waits for the
 *   connection, then retries on its own (`AUTO_RETRY_DELAYS`).
 * - **A file could not be downloaded** while the browser believes it is
 *   online: the server is down, or the site was deployed again and the old
 *   file names are gone. It does not claim the connection is down, because it
 *   does not know that.
 * - **The page broke while running.** A bug. Restarting remounts it.
 *
 * ## Why a retry reloads the page
 *
 * A lab is `React.lazy(load)`, and React keeps a rejected `lazy` for good, as
 * does the lab-copy cache in `i18n/labs`. Rendering again would only throw
 * the same rejection. Chrome does fetch a failed module again on a new
 * `import()`, but nothing here would call it. A full reload starts all of
 * them over and also picks up a new deployment. It loses nothing: the part
 * that failed never ran. And it happens only after `siteAnswers()` has heard
 * from the server, so an attempt can never land the visitor on the browser's
 * own offline page. `reloadPage()` first asks again for any preload that
 * failed, which WebKit would otherwise keep failing after the reload.
 *
 * ## What it deliberately does not do
 *
 * It does not show the error. `error.message` is a sentence written for
 * whoever wrote the code, and a visitor can act on none of it. It goes to the
 * console and no further. There is no telemetry here and should not be.
 */
class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { kind: null, stale: false, busy: false, note: "", generation: 0 };

  /** Bumped on reset and unmount, which ends any waiting retry loop. */
  private epoch = 0;
  /** Set synchronously, so two attempts can never overlap. */
  private attempting = false;
  /** Which recovery loop is current; starting or cancelling one bumps it. */
  private loop = 0;
  private restartedAt = 0;

  static getDerivedStateFromError(error: unknown): Partial<BoundaryState> {
    return { kind: isLoadFailure(error) ? "load" : "runtime", busy: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // The existing mechanism, and the only appropriate one here.
    console.error("Page render failed:", error, info.componentStack);

    if (!isLoadFailure(error)) {
      if (Date.now() - this.restartedAt < RESTART_WINDOW) this.setState({ note: "restartFailed" });
      return;
    }
    // Is the file gone, rather than out of reach? Then only a reload helps,
    // and the screen says so instead of offering the same retry again.
    const file = failedFile(error, window.location.origin);
    if (!file || !this.props.online) return;
    const epoch = this.epoch;
    void fileIsGone(file).then((gone) => {
      if (gone && epoch === this.epoch) this.setState({ stale: true });
    });
  }

  componentDidUpdate(previous: BoundaryProps): void {
    // A new route is a new chance. Without this the fallback would survive
    // navigation and the visitor would think the whole site had broken.
    if (this.state.kind && previous.resetKey !== this.props.resetKey) {
      this.epoch++;
      this.attempting = false;
      this.setState({ kind: null, stale: false, busy: false, note: "" });
      return;
    }
    // Back online after failing to download: retry, a bounded number of
    // times. Going offline again ends that loop, so only one ever runs.
    if (this.state.kind === "load" && previous.online !== this.props.online) {
      this.loop++;
      if (this.props.online) void this.retryWhenBack();
    }
  }

  componentWillUnmount(): void {
    this.epoch++;
  }

  private retryWhenBack = async (): Promise<void> => {
    const epoch = this.epoch;
    const loop = this.loop;
    for (const delay of AUTO_RETRY_DELAYS) {
      await wait(delay);
      if (epoch !== this.epoch || loop !== this.loop || !this.props.online) return;
      if (await this.attempt()) return;
    }
  };

  /**
   * Ask the server, and reload only if it answers. Resolves `true` when the
   * page is reloading, `false` when the attempt did not get through — or
   * when another one was already under way.
   */
  private attempt = async (): Promise<boolean> => {
    if (this.attempting) return false;
    this.attempting = true;
    const epoch = this.epoch;
    const loop = this.loop;
    const current = () => epoch === this.epoch && loop === this.loop;
    this.setState({ busy: true });
    const answers = await siteAnswers();
    if (epoch !== this.epoch) return false;
    if (answers && current() && (await reloadPage(current))) return true;
    if (epoch !== this.epoch) return false;
    this.attempting = false;
    if (!current()) {
      this.setState({ busy: false });
      return false;
    }
    this.setState({ busy: false, note: "unreachable" });
    return false;
  };

  private retry = (): void => {
    void this.attempt();
  };

  private reload = (): void => {
    const epoch = this.epoch;
    void reloadPage(() => epoch === this.epoch);
  };

  /** Mount the page again from nothing: what it held in memory starts over. */
  private restart = (): void => {
    this.restartedAt = Date.now();
    this.setState((state) => ({ kind: null, note: "", generation: state.generation + 1 }));
  };

  render(): ReactNode {
    const { kind, stale, busy, note, generation } = this.state;
    if (!kind) return <Fragment key={generation}>{this.props.children}</Fragment>;

    const { copy, online, reduced, path, showBackLink = true, scope = "page" } = this.props;
    const back = showBackLink && (
      <Link
        to="/"
        className="text-body-sm text-fg-muted underline decoration-line/30 underline-offset-2
          transition-colors duration-fast hover:text-fg"
      >
        {copy.backToLabs}
      </Link>
    );
    // A page-wide failure has replaced the page, its h1 included; inside a lab
    // the lab's own title is still the h1 above it.
    const shared = {
      path,
      reduced,
      heading: scope === "page" ? ("h1" as const) : ("h2" as const),
      announce: true,
    };

    if (kind === "runtime") {
      const lab = scope === "lab";
      return (
        <ErrorPanel
          {...shared}
          icon="runtime"
          title={copy.runtime.title}
          body={lab ? copy.runtime.lab : copy.runtime.page}
          note={note === "restartFailed" ? copy.runtime.restartFailed : ""}
          actions={
            <>
              <Button onClick={this.restart}>
                {lab ? copy.runtime.restartLab : copy.runtime.restartPage}
              </Button>
              <span className="text-caption text-fg-muted">
                {lab ? copy.runtime.restartNoteLab : copy.runtime.restartNotePage}
              </span>
              {note === "restartFailed" && (
                <Button variant="ghost" onClick={this.reload}>
                  {copy.reload}
                </Button>
              )}
              {back}
            </>
          }
        />
      );
    }

    const tryButton = (
      <Button
        onClick={busy ? undefined : this.retry}
        aria-disabled={busy || undefined}
        style={busy ? { opacity: 0.6, cursor: "progress" } : undefined}
      >
        {busy ? copy.retrying : copy.retry}
      </Button>
    );
    const unreachable = note === "unreachable" ? copy.unreachable : "";

    if (!online) {
      return (
        <ErrorPanel
          {...shared}
          icon="offline"
          tag={{ text: busy ? copy.trying : copy.waiting, tone: "status" }}
          waiting
          title={copy.offline.title}
          body={scope === "lab" ? copy.offline.lab : copy.offline.page}
          note={unreachable}
          actions={
            <>
              {tryButton}
              {back}
            </>
          }
        />
      );
    }

    return (
      <ErrorPanel
        {...shared}
        icon="load"
        title={scope === "lab" ? copy.load.lab : copy.load.page}
        body={stale ? copy.load.stale : copy.load.body}
        note={stale ? "" : unreachable}
        actions={
          <>
            {stale ? <Button onClick={this.reload}>{copy.reload}</Button> : tryButton}
            {back}
          </>
        }
      />
    );
  }
}

/**
 * The boundary, with what it needs from hooks.
 *
 * A class component cannot call them, and the fallback has to be readable in
 * the language the visitor chose — so they run out here and are handed down.
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const t = useT();
  const online = useOnline();
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  return (
    <Boundary {...props} copy={t.shell.errors} online={online} reduced={reduced} path={pathname} />
  );
}
