import { cn } from "@/lib/cn";

/**
 * A photograph of a lab as a physical object on a plinth.
 *
 * ## What these are
 *
 * One series, "Specimens of Computation": every lab rebuilt as a museum piece
 * and shot in the same dark room, on the same plinth, under the same light. A
 * glass block of etched points for the embedding space, a carved loss surface
 * for gradient descent, a half-sorted row of rods. They are atmosphere for the
 * lab page, not instruction; the lab itself still does the teaching.
 *
 * ## Why they are cropped and small
 *
 * The originals are 2688×1520 PNGs with the object in the right half and empty
 * dark space on the left for type. The page does not need that space, so the
 * shipped files keep only the object, at two widths, as WebP: under 80 KB each
 * at the large size. The full-resolution masters live outside the repo.
 *
 * ## Why they are decorative
 *
 * Everything a picture says here is already in the title and description
 * beside it, so the image is hidden from assistive technology rather than
 * given an alt text that repeats the heading.
 */

const files = import.meta.glob<string>("../../assets/specimens/*.webp", {
  eager: true,
  import: "default",
});

/** Intrinsic size of the large file; the small one has the same aspect. */
const WIDTH = 960;
const HEIGHT = 905;

const url = (name: string): string | undefined => files[`../../assets/specimens/${name}.webp`];

export function Specimen({
  name,
  className,
  priority = false,
}: {
  /** A lab slug, or "not-found". */
  name: string;
  className?: string;
  /** Above the fold: fetch now rather than when scrolled near. */
  priority?: boolean;
}) {
  const large = url(name);
  const small = url(`${name}-sm`);
  // A lab added without a photograph simply shows none.
  if (!large || !small) return null;

  return (
    <figure
      aria-hidden
      className={cn(
        // The ground matches the photograph's own near-black, so there is no
        // flash of a different colour while the image decodes.
        "overflow-hidden rounded-card border border-line/10 bg-[#04060d]",
        className,
      )}
    >
      <img
        src={large}
        srcSet={`${small} 560w, ${large} ${WIDTH}w`}
        sizes="(min-width: 1024px) 20rem, (min-width: 768px) 16rem, 100vw"
        width={WIDTH}
        height={HEIGHT}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full"
      />
    </figure>
  );
}
