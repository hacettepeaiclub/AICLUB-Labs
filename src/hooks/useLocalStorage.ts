import { useCallback, useState } from "react";

/** Says whether a value read back from storage is still a `T`. */
export type StoredGuard<T> = (value: unknown) => value is T;

/** A guard that also accepts `null`, for "nothing recorded yet". */
export const orNull =
  <T>(guard: StoredGuard<T>): StoredGuard<T | null> =>
  (value): value is T | null =>
    value === null || guard(value);

/** A finite number: what JSON can hold that arithmetic will not be poisoned by. */
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Persist lab state (progress, settings) under a namespaced key.
 * Keys follow the convention `acl:<lab-slug>:<name>`.
 *
 * The guard is required. What comes back from storage is whatever this
 * browser kept: an older version's shape, a hand edit, another tab's bug. It
 * used to be cast straight to `T`, so `{"neurons":"six"}` reached the lab as
 * an attempt. Now anything the guard rejects — like anything that is not JSON,
 * or storage that throws — falls back to `initialValue`, and the stored value
 * is left alone until the lab writes a real one.
 */
export function useLocalStorage<T>(key: string, initialValue: T, isValid: StoredGuard<T>) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;
      const parsed: unknown = JSON.parse(stored);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage full or unavailable — state still works in-memory.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}
