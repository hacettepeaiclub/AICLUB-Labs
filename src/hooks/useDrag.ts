import { useCallback, useRef, type PointerEvent, type RefObject } from "react";

export interface DragPoint {
  /** Position inside the reference element, in CSS pixels. */
  readonly x: number;
  readonly y: number;
  /** The same, as a fraction of the element's width and height (0–1, unclamped). */
  readonly fx: number;
  readonly fy: number;
}

export interface DragOptions {
  /** A press began. Return false to ignore this pointer. */
  onStart?: (point: DragPoint, event: PointerEvent<Element>) => boolean | void;
  /** The pointer moved while pressed. */
  onMove?: (point: DragPoint, event: PointerEvent<Element>) => void;
  /**
   * The press ended. `tap` is true when it barely moved and did not last
   * long — a tap rather than a drag.
   */
  onEnd?: (point: DragPoint, tap: boolean) => void;
  /** The browser took the pointer back, usually to scroll. Nothing should happen. */
  onCancel?: () => void;
  /**
   * Measure positions against this element instead of the one the handlers
   * are on — for a small handle that moves across a larger surface.
   */
  relativeTo?: RefObject<Element>;
}

/** Further than this, or longer than `TAP_MS`, and a press is a drag. */
const TAP_SLOP = 8;
const TAP_MS = 400;

/**
 * Pointer dragging, the one way every lab does it.
 *
 * It captures the pointer, so a drag that leaves the element keeps
 * reporting; it reports positions relative to the element the handlers are
 * spread on, in pixels and as fractions; and it tells a tap from a drag. It
 * never calls `preventDefault`. Whether a drag may also scroll the page is
 * decided by the element's CSS (`touch-action`): `touch-none` on a surface
 * that is only for dragging, nothing on one that sits in a scrolling page
 * and only answers taps — and a scroll that the browser starts arrives here
 * as `onCancel`, never as a drag.
 */
/** Where the pointer is, against `relativeTo` or the element handling it. */
function locate(event: PointerEvent<Element>, relativeTo?: RefObject<Element>): DragPoint {
  const r = (relativeTo?.current ?? event.currentTarget).getBoundingClientRect();
  const x = event.clientX - r.left;
  const y = event.clientY - r.top;
  return { x, y, fx: r.width ? x / r.width : 0, fy: r.height ? y / r.height : 0 };
}

export function useDrag({ onStart, onMove, onEnd, onCancel, relativeTo }: DragOptions) {
  const press = useRef<{ id: number; x: number; y: number; at: number; moved: boolean } | null>(
    null,
  );
  const handlers = useRef({ onStart, onMove, onEnd, onCancel, relativeTo });
  handlers.current = { onStart, onMove, onEnd, onCancel, relativeTo };

  const onPointerDown = useCallback((event: PointerEvent<Element>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const p = locate(event, handlers.current.relativeTo);
    if (handlers.current.onStart?.(p, event) === false) return;
    press.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      at: performance.now(),
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<Element>) => {
    const p = press.current;
    if (!p || p.id !== event.pointerId) return;
    if (!p.moved && Math.hypot(event.clientX - p.x, event.clientY - p.y) > TAP_SLOP) p.moved = true;
    handlers.current.onMove?.(locate(event, handlers.current.relativeTo), event);
  }, []);

  const onPointerUp = useCallback((event: PointerEvent<Element>) => {
    const p = press.current;
    if (!p || p.id !== event.pointerId) return;
    press.current = null;
    const tap = !p.moved && performance.now() - p.at < TAP_MS;
    handlers.current.onEnd?.(locate(event, handlers.current.relativeTo), tap);
  }, []);

  const onPointerCancel = useCallback(() => {
    if (!press.current) return;
    press.current = null;
    handlers.current.onCancel?.();
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
