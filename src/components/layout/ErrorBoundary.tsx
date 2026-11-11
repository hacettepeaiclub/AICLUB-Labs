import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";

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
}

interface ErrorBoundaryState {
  failed: boolean;
}

/**
 * The one thing standing between a thrown component and a blank page.
 *
 * Before this existed, any error below the router took the whole tree with it:
 * React 18 unmounts the root on an uncaught render error, so the header, the
 * navigation and the footer went with the lab. The visitor was left with a
 * white page and no way back except editing the URL.
 *
 * The realistic trigger is not a bug in a lab. It is a visitor with a tab open
 * across a deployment: the chunk names are content-hashed, so the lazy import
 * for a lab 404s and `Failed to fetch dynamically imported module` is thrown
 * from inside `<Suspense>`. That is why "try again" is the primary action —
 * for that cause, re-rendering after a reload genuinely fixes it.
 *
 * ## What it deliberately does not do
 *
 * It does not show the error. `error.message` is a sentence written for
 * whoever wrote the code, and a visitor can act on none of it. It goes to the
 * console — where a developer is already looking — and no further. There is no
 * telemetry here and should not be.
 */
class Boundary extends Component<ErrorBoundaryProps & { copy: ErrorCopy }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidUpdate(previous: ErrorBoundaryProps): void {
    // A new route is a new chance. Without this the fallback would survive
    // navigation and the visitor would think the whole site had broken.
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // The existing mechanism, and the only appropriate one here.
    console.error("Lab render failed:", error, info.componentStack);
  }

  /**
   * Recovery, for the failure this actually sees.
   *
   * Clearing the flag is not enough. The common cause is a lazy import
   * that 404d, and React caches the rejected promise for that component —
   * so a re-render throws the same rejection again and the visitor is back
   * where they started. Browser QA caught exactly that: the button
   * appeared to do nothing.
   *
   * A reload is what genuinely fixes it: the visitor gets the current
   * index.html and the chunk names that go with it. It also fixes the
   * transient render error, at the cost of losing in-page state — which is
   * already lost, because the thing holding it did not render.
   */
  private retry = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    const { copy, showBackLink = true } = this.props;

    return (
      <div className="shell py-section">
        {/* `alert` so a screen reader is told the content it was about to read
            is not coming. One region, announced once. */}
        <div role="alert" className="card-surface mx-auto max-w-prose p-6 text-center">
          <h2 className="text-title text-fg">{copy.errorTitle}</h2>
          <p className="mt-2 text-body-sm text-fg-muted">{copy.errorBody}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={this.retry}>{copy.errorRetry}</Button>
            {showBackLink && (
              <Link
                to="/"
                className="text-body-sm text-fg-muted underline decoration-line/30
                  underline-offset-2 transition-colors duration-fast hover:text-fg"
              >
                {copy.errorBackToLabs}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}

interface ErrorCopy {
  errorTitle: string;
  errorBody: string;
  errorRetry: string;
  errorBackToLabs: string;
}

/**
 * The boundary, with copy.
 *
 * A class component cannot call `useT`, and the fallback has to be readable in
 * the language the visitor chose — so the hook runs out here and the strings
 * are handed down.
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const t = useT();
  return <Boundary {...props} copy={t.shell} />;
}
