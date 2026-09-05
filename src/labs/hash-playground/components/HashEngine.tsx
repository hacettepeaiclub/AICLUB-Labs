import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/design/motion";

const BARS = 28;

/** Deterministic pseudo-random heights so the engine looks organic, not uniform. */
const heightOf = (i: number) => 8 + ((i * 37 + 11) % 5) * 3.5;

/**
 * The "hash engine" — an abstract signal strip between input and output.
 * Every new digest fires a pulse that sweeps left → right (~450ms), turning
 * "the hash updated" into something you can see travel. Purely decorative
 * for screen readers; the real output is announced below.
 */
export const HashEngine = memo(function HashEngine({ version }: { version: number }) {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="my-5 flex h-10 items-center justify-center gap-4">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-line/20" />
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: BARS }, (_, i) => (
          <motion.span
            key={`${version}-${i}`}
            style={{ height: heightOf(i) }}
            initial={false}
            animate={
              reduced
                ? { opacity: 0.5 }
                : { opacity: [0.18, 1, 0.18], scaleY: [0.45, 1.25, 0.45] }
            }
            transition={{
              duration: 0.3,
              delay: i * 0.011,
              ease: [...ease.inOut],
            }}
            className="w-[3px] origin-center rounded-pill bg-accent-fill"
          />
        ))}
      </div>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-line/20" />
    </div>
  );
});
