import { useEffect, useState } from "react";
import { sha256Hex } from "./hashUtils";

/**
 * Live SHA-256 of a string. Returns null until the first digest resolves.
 * Guards against out-of-order async results while typing fast.
 */
export function useSha256(input: string): string | null {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void sha256Hex(input).then((hex) => {
      if (!cancelled) setHash(hex);
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return hash;
}

export interface HashSnapshot {
  /** Digest before the most recent change (null until the second digest). */
  prev: string | null;
  current: string | null;
  /** Increments on every distinct digest — used to key re-triggered animations. */
  version: number;
}

/** Track the current digest plus the one it replaced. */
export function useHashHistory(hash: string | null): HashSnapshot {
  const [snap, setSnap] = useState<HashSnapshot>({ prev: null, current: null, version: 0 });

  useEffect(() => {
    if (!hash) return;
    setSnap((s) =>
      s.current === hash ? s : { prev: s.current, current: hash, version: s.version + 1 },
    );
  }, [hash]);

  return snap;
}
