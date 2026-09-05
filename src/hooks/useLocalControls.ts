import { useCallback, useMemo, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * A small bag of control values that survives a reload.
 *
 * Settings someone dialled in are state they created, so they are worth
 * keeping (docs/GUIDELINES.md). Stored values are merged over the defaults, so
 * adding a control later never breaks a visitor's saved settings.
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
  const merged = useMemo(() => ({ ...defaultsRef.current, ...stored }), [stored]);

  const patch = useCallback(
    (next: Partial<T>) => setStored((prev) => ({ ...prev, ...next })),
    [setStored],
  );

  return [merged, patch];
}
