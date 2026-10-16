import { Component, type ReactNode } from "react";

/**
 * Renders nothing if anything below it throws.
 *
 * For the extras around a lab (its tour, its learning guide) that read the
 * lab's copy: if the copy never arrives the lab has failed too, and says so
 * itself, so these stay out of the way rather than add a second error.
 */
export class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
