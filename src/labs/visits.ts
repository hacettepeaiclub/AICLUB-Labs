/**
 * Which labs this browser has opened, and which one it opened last.
 *
 * The most useful thing a collection can remember is "what have I already
 * tried?". It is kept in this browser only — no account, nothing sent
 * anywhere — and every read and write survives storage being unavailable
 * (private windows, blocked site data), in which case the home page simply
 * shows no marks and no "continue" link.
 */

const VISITED_KEY = "aiclub-labs-visited";
const LAST_KEY = "aiclub-labs-last";

export interface Visits {
  visited: ReadonlySet<string>;
  last: string | null;
}

export function readVisits(): Visits {
  try {
    const raw = window.localStorage.getItem(VISITED_KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    const visited = new Set(
      Array.isArray(list) ? list.filter((s): s is string => typeof s === "string") : [],
    );
    return { visited, last: window.localStorage.getItem(LAST_KEY) };
  } catch {
    return { visited: new Set(), last: null };
  }
}

export function recordVisit(slug: string): void {
  try {
    const { visited } = readVisits();
    const next = new Set(visited).add(slug);
    window.localStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
    window.localStorage.setItem(LAST_KEY, slug);
  } catch {
    // Storage unavailable: the lab still works, it just is not remembered.
  }
}
