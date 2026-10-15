import { createContext, useContext } from "react";

/**
 * What a lab page offers its stages once the lab's tour has loaded: a way to
 * start the tour of one experiment. `null` until then, and on a lab without a
 * tour, so a stage renders no button it cannot honour.
 */
export interface Guide {
  /** Tour this stage, or, given `null`, the lab's first experiment. */
  start: (stage: HTMLElement | null) => void;
}

export const GuideContext = createContext<Guide | null>(null);

export const useGuide = () => useContext(GuideContext);
