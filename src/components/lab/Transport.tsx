import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * Run / pause, step, reset.
 *
 * ## Why this is shared and the rest of the controls are not
 *
 * Four labs had already written this exact trio by hand — pathfinding,
 * sorting-race, gradient-descent and the neural playground's descent
 * section — against the same three handlers (`run`, `stepOnce`, `reset`) with
 * the same pause-on-second-press behaviour. They had started to disagree about
 * the details: the order of the buttons, which variant each one took, and
 * whether Step stays live while a run is going. That is drift in the one
 * control a visitor uses in every lab, which makes it worth a primitive.
 *
 * Nothing else about a lab's controls is shared. An algorithm picker, a
 * learning-rate slider and a drawing tool have nothing in common but their
 * container.
 *
 * ## One primary
 *
 * Run is the primary; Step is secondary; Reset is a ghost. Pathfinding's old
 * layout was a two-by-two grid holding a primary, a secondary and two ghosts,
 * which left nothing looking like the thing to press. Anything a lab needs
 * beyond these three belongs in the stage's disclosure, not here.
 */
export interface TransportProps {
  running: boolean;
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  /**
   * Overrides "Run" where a lab's own verb is clearer — sorting-race says
   * "Sort". The pause label never changes: pausing is pausing.
   */
  runLabel?: string;
  /** Most labs disable stepping mid-run; a few have no reason to. */
  stepDisabled?: boolean;
  className?: string;
}

export function Transport({
  running,
  onRun,
  onStep,
  onReset,
  runLabel,
  stepDisabled,
  className,
}: TransportProps) {
  const t = useT();

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button onClick={onRun} className="min-h-[44px] flex-1">
        {running ? t.common.pause : (runLabel ?? t.common.run)}
      </Button>
      <Button
        variant="secondary"
        onClick={onStep}
        disabled={stepDisabled ?? running}
        className="min-h-[44px]"
      >
        {t.common.step}
      </Button>
      <Button variant="ghost" onClick={onReset} className="min-h-[44px]">
        {t.common.reset}
      </Button>
    </div>
  );
}
