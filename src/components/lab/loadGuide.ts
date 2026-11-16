import type { LearningResource } from "@/labs/learning";

/** One lab's learning guide: its topics in order, and the resources they list. */
export interface GuideData {
  readonly sections: readonly { readonly topic: string; readonly items: readonly string[] }[];
  readonly resources: Readonly<Record<string, LearningResource>>;
}

/** Long enough for a slow connection; a stuck download ends as a failure. */
const TIMEOUT = 20_000;

/**
 * Fetch one lab's guide through a short-lived worker.
 *
 * Every call is a new worker, and so a new download of its script: a call
 * after a failed one really asks the network again, in every browser, with
 * no address read out of an error message. The address is the one Vite gives
 * the worker at build time, so nothing here guesses a file name.
 */
export function loadGuide(slug: string): Promise<GuideData> {
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("./guide.worker.ts", import.meta.url), { type: "module" });
    } catch (error) {
      reject(error);
      return;
    }
    const finish = (data: GuideData | null, error?: unknown) => {
      clearTimeout(timer);
      worker.terminate();
      if (data) resolve(data);
      else reject(error);
    };
    const timer = setTimeout(
      () => finish(null, new Error("The learning guide timed out")),
      TIMEOUT,
    );
    worker.onmessage = (event: MessageEvent<GuideData>) => finish(event.data);
    worker.onerror = (event) => {
      // The script did not download or did not run; reported here, not as an
      // uncaught error on the page.
      event.preventDefault();
      finish(null, new Error("The learning guide could not be loaded"));
    };
    worker.onmessageerror = () => finish(null, new Error("The learning guide could not be read"));
    worker.postMessage(slug);
  });
}
