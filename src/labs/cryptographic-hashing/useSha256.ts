import { useEffect, useState } from "react";
import { hashingUnavailable, sha256Hex, type HashUnavailable } from "./hashUtils";

export interface DigestState {
  /** Null until the first digest resolves, and whenever hashing has failed. */
  readonly hash: string | null;
  /** Why there is no digest, or null while things are working. */
  readonly unavailable: HashUnavailable | null;
}

/**
 * Live SHA-256 of a string.
 *
 * Guards against out-of-order async results while typing fast, and against the
 * API not being there at all: `crypto.subtle` is undefined outside a secure
 * context, and the unguarded version rejected into nothing, leaving the lab
 * with a permanently null digest and no way to say so.
 */
export function useSha256(input: string): DigestState {
  const [state, setState] = useState<DigestState>({ hash: null, unavailable: null });

  useEffect(() => {
    let cancelled = false;

    // Ask before trying, so the common cause is reported as itself rather than
    // as whatever TypeError the missing property happens to produce.
    const missing = hashingUnavailable();
    if (missing) {
      setState({ hash: null, unavailable: missing });
      return;
    }

    sha256Hex(input).then(
      (hex) => {
        if (!cancelled) setState({ hash: hex, unavailable: null });
      },
      (cause: unknown) => {
        if (cancelled) return;
        console.error("SHA-256 failed:", cause);
        setState({ hash: null, unavailable: hashingUnavailable() ?? "unsupported" });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [input]);

  return state;
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
