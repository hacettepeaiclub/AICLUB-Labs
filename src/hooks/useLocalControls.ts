import { useCallback, useMemo, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Keep a stored value only if it still looks like the default it replaces.
 *
 * `useLocalStorage` already survives malformed JSON — it catches the parse and
 * falls back. What it cannot see is JSON that parses perfectly well and is
 * still wrong: `{"w1": "abc"}` where a number belongs. That used to be spread
 * straight over the defaults, and the lab rendered `output = nope(NaN·x₁ …)`
 * with a figure reading `NaN`.
 *
 * Nobody reaches that by using the site; it takes a hand-edited localStorage.
 * The reason to guard it anyway is the next refactor: a control that changes
 * type in a later version meets values saved by an earlier one, and a returning
 * visitor gets the NaN with no devtools involved.
 *
 * The check is deliberately shallow — same `typeof`, and finite if it is a
 * number. Anything deeper would be a schema, and a schema would have to be
 * maintained alongside every control in the collection.
 */
const keeps = (stored: unknown, fallback: unknown): boolean => {
  if (typeof stored !== typeof fallback) return false;
  // typeof null is "object", and no control default is an object today; this
  // keeps a stored null from passing as one if that ever changes.
  if (stored === null || fallback === null) return stored === fallback;
  // NaN and ±Infinity are numbers by `typeof` and poison by arithmetic.
  if (typeof stored === "number") return Number.isFinite(stored);
  return true;
};

/**
 * A small bag of control values that survives a reload.
 *
 * Settings someone dialled in are state they created, so they are worth
 * keeping (docs/GUIDELINES.md). Stored values are merged over the defaults, so
 * adding a control later never breaks a visitor's saved settings — and now a
 * stored value that no longer matches its default's type is dropped rather
 * than passed through.
 *
 * `storageKey` is the full namespaced key, same as `useLocalStorage` — by
 * convention `acl:<lab-slug>:<name>`.
 */
export function useLocalControls<T extends object>(
  storageKey: string,
  defaults: T,
): [T, (patch: Partial<T>) => void] {
  const [stored, setStored] = useLocalStorage<Partial<T>>(storageKey, {});
  // Captured once. `defaults` is an object literal at every call site, so a
  // fresh identity arrives on every render; depending on it would rebuild the
  // merged object every time and defeat the memo. The values never change, so
  // reading the first one is equivalent — and it keeps the dependency list
  // honest rather than suppressed.
  const defaultsRef = useRef(defaults);

  const merged = useMemo(() => {
    const base = defaultsRef.current;
    const result = { ...base };
    // A stored bag that is not an object at all (`null`, an array, a number
    // somebody typed in) contributes nothing rather than throwing.
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return result;

    for (const key of Object.keys(base) as (keyof T)[]) {
      const value = (stored as Partial<T>)[key];
      // A key the visitor has never set is not a malformed key.
      if (value === undefined) continue;
      if (keeps(value, base[key])) result[key] = value as T[keyof T];
    }
    // Keys in storage that are not in `defaults` are ignored: they are either
    // a control that has since been removed, or noise.
    return result;
  }, [stored]);

  const patch = useCallback(
    (next: Partial<T>) => setStored((prev) => ({ ...prev, ...next })),
    [setStored],
  );

  return [merged, patch];
}
