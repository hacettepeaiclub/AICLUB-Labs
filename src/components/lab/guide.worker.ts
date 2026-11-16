import { GUIDES, RESOURCES, type LearningResource } from "@/labs/learning";
import type { GuideData } from "./loadGuide";

/**
 * Hands one lab's learning guide to the page.
 *
 * The full list of resources is the heavy part of the guide, and only the
 * window needs it, so it lives in this worker's file rather than in every
 * page's bundle. The page starts a worker when the guide is opened, sends the
 * lab's slug, and gets back only that lab's topics and resources.
 *
 * Why a worker and not `import()`: a new worker downloads its script afresh
 * every time, while a browser can remember a module whose download failed and
 * fail the next `import()` of it without asking the network. Retrying here is
 * just starting another worker (see loadGuide.ts).
 */

const scope = globalThis as unknown as {
  postMessage: (reply: GuideData) => void;
  onmessage: ((event: MessageEvent<string>) => void) | null;
};

scope.onmessage = (event) => {
  const sections = GUIDES[event.data] ?? [];
  const resources: Record<string, LearningResource> = {};
  for (const { items } of sections) {
    for (const id of items) resources[id] = RESOURCES[id];
  }
  scope.postMessage({ sections, resources });
};
