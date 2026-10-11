/**
 * Counting what visitors do, without knowing who they are.
 *
 * ## What collects it
 *
 * Umami (cloud.umami.is), loaded by one script tag in `index.html`. It sets
 * no cookies and stores no personal data: a visitor is an anonymous hash of
 * site, IP and browser that changes every month, and the IP itself is never
 * kept. Page views — the address bar changing, here as anywhere — it counts
 * on its own. The events below are the questions page views cannot answer.
 *
 * ## Where it runs
 *
 * Only on `labs.hacettepeaiclub.com`: the script's `data-domains` keeps a dev
 * server, a preview or a fork from counting into the club's numbers. A
 * browser asking not to be tracked (Do Not Track) is not counted at all.
 *
 * ## Why every call is fire-and-forget
 *
 * The script loads after the page, may be blocked, and is never required. So
 * `track` reads it at call time, does nothing when it is absent, and swallows
 * anything it throws: counting must never be the reason a page breaks.
 *
 * ## Why the events are few and small
 *
 * Each event and each property on it counts against the plan's monthly
 * allowance, and every one is something someone has to read. Each answers a
 * question about the product: which labs are opened, from where, and how many
 * people reach the end of one; whether the game is played; what visitors look
 * for that the collection does not have.
 */

type EventMap = {
  /** A lab page opened. `from` is how the visitor got there. */
  lab_open: { lab: string; from: LabSource };
  /** The bottom of a lab came into view: the lab was read to the end. */
  lab_end: { lab: string };
  /** The lab finder opened. */
  finder_open: { via: "key" | "button" };
  /** A search in the finder that matched nothing: something people want. */
  finder_empty: { query: string };
  /** A field picked in the home page filter. */
  filter: { field: string };
  /** The game in the hero's mark. */
  game_start: Record<string, never>;
  game_stop: Record<string, never>;
  game_finish: { seconds: number; best: boolean };
  /** A preference changed. */
  language: { to: string };
  theme: { to: string };
};

/** How a visitor arrived at a lab. */
export type LabSource = "grid" | "continue" | "finder" | "next" | "game" | "link" | "direct";

type Umami = { track: (event: string, data?: Record<string, unknown>) => unknown };

export function track<E extends keyof EventMap>(
  event: E,
  ...data: EventMap[E] extends Record<string, never> ? [] : [EventMap[E]]
): void {
  try {
    const umami = (window as unknown as { umami?: Umami }).umami;
    umami?.track(event, data[0]);
  } catch {
    // Counting is never worth an error on a working page.
  }
}

/**
 * The router state a link to a lab carries, so the lab can say where the
 * visitor came from: `<Link state={fromState("grid")}>`.
 */
export const fromState = (from: LabSource) => ({ from });

const SOURCES: readonly LabSource[] = [
  "grid",
  "continue",
  "finder",
  "next",
  "game",
  "link",
  "direct",
];

/**
 * Where a lab visit came from, read off the router's location.
 *
 * A link that says where it is gives its answer. One that does not is still
 * a link inside the site — any navigation after the first page has a key of
 * its own — and the first page of a visit, typed, bookmarked or opened from a
 * message, has React Router's `"default"` key: that is a direct visit.
 */
export function labSource(state: unknown, key: string): LabSource {
  const from = (state as { from?: unknown } | null)?.from;
  if (SOURCES.includes(from as LabSource)) return from as LabSource;
  return key === "default" ? "direct" : "link";
}
