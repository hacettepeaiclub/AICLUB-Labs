import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale, exactly as `tailwind.config.ts` declares it.
 *
 * It has to be repeated here, and that is worth explaining rather than
 * apologising for. tailwind-merge does not read the Tailwind config; it
 * classifies a class by its *shape*. `text-lg` is a font size because `lg` is a
 * t-shirt size, and everything else after `text-` is assumed to be a colour.
 * So `text-title`, `text-body-sm`, `text-caption` and the rest were being filed
 * as colours — which put them in the same conflict group as `text-fg`, and
 * `cn("text-title", "text-fg")` dropped the size and kept the colour.
 *
 * That is why every `<Figure>` in the collection rendered its number at 16px
 * instead of the 20px the scale asks for: the size was silently deleted at
 * merge time, in a component whose two classes always arrive separately.
 *
 * Naming the scale here puts these back in the font-size group, so a size and a
 * colour stop competing and two sizes still override each other in source
 * order. `cn.test.ts` checks the list against the config so the two cannot
 * drift apart.
 */
export const FONT_SIZES = [
  "display-xl",
  "display-lg",
  "display-md",
  "title",
  "body-lg",
  "body",
  "body-sm",
  "caption",
  "overline",
] as const;

const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
    },
  },
});

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
