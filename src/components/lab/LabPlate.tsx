import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LabSignature } from "./LabSignature";

/**
 * A lab's figure: its own diagram, set as a numbered plate.
 *
 * ## What it replaces
 *
 * The lab header used to carry a photograph from a series called "Specimens
 * of Computation" — every lab rebuilt as a sculpture on a plinth and lit in
 * a dark room. They were rendered images of objects that do not exist, and
 * however well made, a glossy pedestal shot is the visual vocabulary of a
 * product launch, not of a laboratory.
 *
 * What a lab can honestly show beside its title is the structure it is
 * built on, and the collection already draws that: each `LabSignature` is
 * the lab's own diagram — a frontier spreading through a grid, a kernel
 * sliding over pixels, bits laid over a ruler of floats. Here it is drawn
 * large, on plotting paper inside a hairline frame with registration marks,
 * and captioned the way a journal captions a figure.
 *
 * The field colour arrives as `--c`, as it does on the cards.
 */
export function LabPlate({
  slug,
  colour,
  caption,
  className,
  children,
}: {
  /** The lab whose diagram is drawn. Omit, with `children`, for an empty plate. */
  slug?: string;
  /** The field's colour triplet, `CATEGORY_VAR[...]`. */
  colour?: string;
  caption: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={cn("w-full", className)} style={{ "--c": colour } as CSSProperties}>
      <div className="plate-frame relative aspect-[4/3] border border-line/15 bg-ink-950">
        <div aria-hidden className="plate-ground absolute inset-0" />
        <div aria-hidden className="absolute inset-0 grid place-items-center p-6">
          {slug ? <LabSignature slug={slug} className="h-full w-full" /> : children}
        </div>
      </div>
      <figcaption className="mt-2.5 text-caption leading-relaxed text-fg-muted">{caption}</figcaption>
    </figure>
  );
}
