/**
 * Browser pieces jsdom does not provide, for behaviour tests that render.
 *
 * The suite runs in node by default; a test that needs a DOM opts in with a
 * `// @vitest-environment jsdom` docblock on its first line and installs only
 * the fakes it uses, from here. Each installer returns a handle the test drives
 * and restores what it replaced in `afterEach` (see `restoreDom`), so no fake
 * outlives the file that asked for it.
 *
 * Nothing here is clever: the point of these fakes is that a test can say
 * exactly how many animation frames are pending, or exactly when an element
 * was resized, rather than waiting on real time.
 */
import { vi } from "vitest";

const restorers: (() => void)[] = [];

/** Put back everything the installers below replaced. Call from `afterEach`. */
export function restoreDom(): void {
  while (restorers.length) restorers.pop()?.();
}

function replace<T extends object, K extends keyof T>(target: T, key: K, value: T[K]): void {
  const had = Object.prototype.hasOwnProperty.call(target, key);
  const previous = target[key];
  Object.defineProperty(target, key, { configurable: true, writable: true, value });
  restorers.push(() => {
    if (had)
      Object.defineProperty(target, key, { configurable: true, writable: true, value: previous });
    else delete target[key];
  });
}

export interface FrameClock {
  /** Callbacks waiting for the next frame. A still canvas keeps this at 0. */
  pending: () => number;
  /** Every `requestAnimationFrame` call so far. */
  requested: () => number;
  /** Run one frame: every callback pending now, at `now` (advances 16 ms by default). */
  frame: (now?: number) => void;
}

/**
 * A `requestAnimationFrame` that only advances when the test says so.
 *
 * `performance.now()` is left alone; frames carry their own timestamp, which
 * starts at 1000 so a first `dt` against a real `performance.now()` is
 * bounded by the hook's clamp, never negative in a way that matters.
 */
export function installFrameClock(): FrameClock {
  let nextId = 1;
  let requested = 0;
  let now = 1000;
  const queue = new Map<number, FrameRequestCallback>();
  replace(window, "requestAnimationFrame", (callback: FrameRequestCallback) => {
    requested++;
    const id = nextId++;
    queue.set(id, callback);
    return id;
  });
  replace(window, "cancelAnimationFrame", (id: number) => {
    queue.delete(id);
  });
  return {
    pending: () => queue.size,
    requested: () => requested,
    frame: (at?: number) => {
      now = at ?? now + 16;
      const due = [...queue.values()];
      queue.clear();
      for (const callback of due) callback(now);
    },
  };
}

export interface ResizeObservers {
  /** Elements currently observed. */
  observed: () => Element[];
  /** Report a new border-box size for `target`, as the browser would after layout. */
  resize: (target: Element, width: number, height: number) => void;
}

/** A `ResizeObserver` that reports only when the test resizes something. */
export function installResizeObserver(): ResizeObservers {
  const live = new Set<FakeResizeObserver>();

  class FakeResizeObserver {
    readonly targets = new Set<Element>();
    constructor(private readonly callback: ResizeObserverCallback) {
      live.add(this);
    }
    observe(target: Element) {
      this.targets.add(target);
    }
    unobserve(target: Element) {
      this.targets.delete(target);
    }
    disconnect() {
      this.targets.clear();
      live.delete(this);
    }
    report(target: Element, width: number, height: number) {
      const size = [{ inlineSize: width, blockSize: height }];
      const entry = {
        target,
        borderBoxSize: size,
        contentBoxSize: size,
        devicePixelContentBoxSize: size,
        contentRect: { width, height, x: 0, y: 0, top: 0, left: 0, right: width, bottom: height },
      } as unknown as ResizeObserverEntry;
      this.callback([entry], this as unknown as ResizeObserver);
    }
  }

  replace(window, "ResizeObserver", FakeResizeObserver as unknown as typeof ResizeObserver);
  return {
    observed: () => [...live].flatMap((observer) => [...observer.targets]),
    resize: (target, width, height) => {
      for (const observer of [...live]) {
        if (observer.targets.has(target)) observer.report(target, width, height);
      }
    },
  };
}

/**
 * A 2D context that records nothing and draws nothing.
 *
 * jsdom has no canvas: `getContext` returns null and logs "not implemented".
 * Hooks under test only need a context object to exist and accept calls.
 */
export function installCanvasContext(): CanvasRenderingContext2D {
  const ctx = new Proxy(
    {},
    {
      get: (target: Record<string | symbol, unknown>, key) => {
        if (!(key in target)) target[key] = vi.fn();
        return target[key];
      },
      set: (target: Record<string | symbol, unknown>, key, value) => {
        target[key] = value;
        return true;
      },
    },
  ) as unknown as CanvasRenderingContext2D;
  replace(
    HTMLCanvasElement.prototype,
    "getContext",
    (() => ctx) as unknown as HTMLCanvasElement["getContext"],
  );
  return ctx;
}

/**
 * A fresh, empty, in-memory `localStorage`.
 *
 * Needed, not just tidy: Node 22+ defines its own global `localStorage`, which
 * is `undefined` unless Node was started with `--localstorage-file`, and it
 * shadows jsdom's. Pass `throwing` for a browser where storage is blocked
 * (Safari private mode, a full quota): every call throws, as there.
 */
export function installLocalStorage({ throwing = false } = {}): Storage {
  const items = new Map<string, string>();
  const guard = () => {
    if (throwing) throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
  };
  const storage: Storage = {
    get length() {
      return items.size;
    },
    clear: () => {
      guard();
      items.clear();
    },
    getItem: (key) => {
      guard();
      return items.get(key) ?? null;
    },
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      guard();
      items.delete(key);
    },
    setItem: (key, value) => {
      guard();
      items.set(key, String(value));
    },
  };
  replace(window, "localStorage", storage);
  return storage;
}

/** `matchMedia`, answering `matches` for every query. jsdom has none. */
export function installMatchMedia(matches = false): void {
  replace(window, "matchMedia", (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

/** Set what `navigator.onLine` reports, and tell listeners it changed. */
export function setOnline(online: boolean): void {
  replace(navigator, "onLine", online);
  window.dispatchEvent(new Event(online ? "online" : "offline"));
}
