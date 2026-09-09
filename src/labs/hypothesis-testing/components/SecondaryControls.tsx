import { LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { BOUNDS, type Params, type Result } from "../engine";
import { coord } from "../view";

export type SecondaryLever = "mu0" | "sigma" | "n" | "alpha" | "mu1";

export interface SecondaryControlsProps {
  result: Result;
  onChange: (patch: Partial<Params>) => void;
  /** Which levers this stage puts behind its disclosure. */
  show: readonly SecondaryLever[];
}

/**
 * The levers a section is not about.
 *
 * Six controls in one rail would be a settings panel, and a settings panel is
 * what this lab is trying not to be: each section has one number it is making
 * an argument about, and the rest are here so the argument can be checked
 * rather than taken on trust. On a phone they sit behind the Stage's own
 * disclosure, which is where things you touch less often belong.
 *
 * The bounds are the reference implementation's slider bounds. Every track is
 * an integer, divided down on the way out, so a position always maps to the
 * same value rather than accumulating floating-point drift as it moves.
 */
export function SecondaryControls({ result, onChange, show }: SecondaryControlsProps) {
  const copy = useT().labs["hypothesis-testing"].controls;
  const { mu0, mu1, sigma, alpha, n } = result.params;

  return (
    <div className="space-y-4">
      {show.includes("mu0") && (
        <LabSlider
          label={copy.mu0}
          value={Math.round(mu0 * 10)}
          min={Math.round(BOUNDS.mu0.min * 10)}
          max={Math.round(BOUNDS.mu0.max * 10)}
          onChange={(value) => onChange({ mu0: value / 10 })}
          format={() => coord(mu0)}
          valueText={() => copy.mu0Value(coord(mu0))}
        />
      )}
      {show.includes("mu1") && (
        <LabSlider
          label={copy.mu1}
          value={Math.round(mu1 * 10)}
          min={Math.round(BOUNDS.mu1.min * 10)}
          max={Math.round(BOUNDS.mu1.max * 10)}
          onChange={(value) => onChange({ mu1: value / 10 })}
          format={() => coord(mu1)}
          valueText={() => copy.mu1Value(coord(mu1))}
        />
      )}
      {show.includes("sigma") && (
        <LabSlider
          label={copy.sigma}
          value={Math.round(sigma * 10)}
          min={Math.round(BOUNDS.sigma.min * 10)}
          max={Math.round(BOUNDS.sigma.max * 10)}
          onChange={(value) => onChange({ sigma: value / 10 })}
          format={() => coord(sigma)}
          valueText={() => copy.sigmaValue(coord(sigma))}
        />
      )}
      {show.includes("alpha") && (
        <LabSlider
          label={copy.alpha}
          value={Math.round(alpha * 100)}
          min={Math.round(BOUNDS.alpha.min * 100)}
          max={Math.round(BOUNDS.alpha.max * 100)}
          onChange={(value) => onChange({ alpha: value / 100 })}
          format={() => alpha.toFixed(2)}
          valueText={() => copy.alphaValue(alpha.toFixed(2))}
        />
      )}
      {show.includes("n") && (
        <LabSlider
          label={copy.n}
          value={n}
          min={BOUNDS.n.min}
          max={BOUNDS.n.max}
          onChange={(value) => onChange({ n: value })}
          format={() => String(n)}
          valueText={() => copy.nValue(n)}
        />
      )}
      <p className="text-caption text-fg-faint">{copy.note}</p>
    </div>
  );
}
