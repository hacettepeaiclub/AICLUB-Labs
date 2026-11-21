import { useEffect, useState, type RefObject } from "react";

/** Half the 44px touch minimum, in CSS pixels. */
export const TOUCH_RADIUS_PX = 22;

/**
 * The radius, in viewBox units, of an SVG handle's invisible hit circle.
 *
 * A diagram drawn in a fixed viewBox shrinks with its container, and its
 * handles shrink with it: a 44-unit circle is 44px on a desktop and 14px on a
 * phone. This keeps the circle at least 44px across on screen, and never
 * smaller than `radius`, so the desktop target stays as it was.
 *
 * Assumes the default `preserveAspectRatio` ("xMidYMid meet"), where one
 * unit is the smaller of the two axis scales.
 */
export function useTouchRadius(
  svgRef: RefObject<SVGSVGElement>,
  viewBox: { width: number; height: number },
  radius: number,
): number {
  const { width, height } = viewBox;
  const [pxPerUnit, setPxPerUnit] = useState(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      if (box.width > 0 && box.height > 0)
        setPxPerUnit(Math.min(box.width / width, box.height / height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [svgRef, width, height]);

  return pxPerUnit > 0 ? Math.max(radius, TOUCH_RADIUS_PX / pxPerUnit) : radius;
}
