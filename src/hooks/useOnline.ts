import { useSyncExternalStore } from "react";

/**
 * Whether the browser believes it has a network connection.
 *
 * `navigator.onLine` is only half reliable: `false` means the device really
 * is cut off, but `true` only means some network is up, not that it reaches
 * the internet. So this is trusted in one direction only. The site uses it
 * to explain a failure as "no connection" when it says so, and never to stop
 * anything from being tried.
 *
 * The prerender and the tests have no `navigator`, and count as online.
 */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, readOnline, () => true);
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function readOnline(): boolean {
  return typeof navigator === "undefined" || navigator.onLine !== false;
}
