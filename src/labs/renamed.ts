/**
 * Labs that moved to a new address, old slug → new slug.
 *
 * On 2026-10-03 the slugs were changed to name each lab's subject
 * (`/labs/pathfinding` became `/labs/graph-search`). Links to the old
 * addresses are already out there — in chats, on slides, in browser history —
 * so none of them is allowed to break:
 *
 *   - the build writes a page at every old address that sends the browser on
 *     to the new one, with a canonical link and `noindex` (`tools/prerender`);
 *   - a click on an old link inside the app is redirected by `LabPage`;
 *   - progress saved under an old slug is moved to the new one, once, the
 *     first time the app starts (`migrateRenamedSlugs`).
 *
 * An entry stays here for good: removing it breaks every old link at once.
 */
export const RENAMED: Readonly<Record<string, string>> = {
  "hash-playground": "cryptographic-hashing",
  "hash-table": "hash-tables",
  "sorting-race": "sorting",
  pathfinding: "graph-search",
  tokenizer: "tokenization",
  "neural-playground": "multilayer-perceptrons",
  "reward-playground": "reinforcement-learning",
  "embedding-universe": "word-embeddings",
  "embedding-universe-3d": "word-embeddings-3d",
};

const VISITED_KEY = "aiclub-labs-visited";
const LAST_KEY = "aiclub-labs-last";

/**
 * Move what this browser saved under an old slug to its new one.
 *
 * Lab state lives under `acl:<slug>:<name>`; the visit record names slugs in
 * a list and in "last opened". A value already saved under the new slug wins
 * — it is newer — and the old key is removed either way, so running this
 * twice does nothing the second time. Storage that is unavailable or holds
 * something unexpected is left alone: losing a migration is better than
 * failing to start.
 */
export function migrateRenamedSlugs(storage: Storage | undefined = globalThis.localStorage): void {
  if (!storage) return;
  try {
    const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter(
      (k): k is string => k !== null,
    );
    for (const key of keys) {
      const match = /^acl:([^:]+):(.+)$/.exec(key);
      const next = match?.[1] ? RENAMED[match[1]] : undefined;
      if (!match || !next) continue;
      const target = `acl:${next}:${match[2]}`;
      const value = storage.getItem(key);
      if (storage.getItem(target) === null && value !== null) storage.setItem(target, value);
      storage.removeItem(key);
    }

    const raw = storage.getItem(VISITED_KEY);
    const list: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(list)) {
      const renamed = [
        ...new Set(list.map((s) => (typeof s === "string" ? (RENAMED[s] ?? s) : s))),
      ];
      if (renamed.some((s, i) => s !== list[i]) || renamed.length !== list.length) {
        storage.setItem(VISITED_KEY, JSON.stringify(renamed));
      }
    }
    const last = storage.getItem(LAST_KEY);
    const lastNext = last ? RENAMED[last] : undefined;
    if (lastNext) storage.setItem(LAST_KEY, lastNext);
  } catch {
    // Unreadable or full storage: start anyway.
  }
}
