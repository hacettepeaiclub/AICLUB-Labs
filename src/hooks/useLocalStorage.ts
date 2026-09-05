import { useCallback, useState } from "react";

/**
 * Persist lab state (progress, settings) under a namespaced key.
 * Keys follow the convention `acl:<lab-slug>:<name>`.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
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
