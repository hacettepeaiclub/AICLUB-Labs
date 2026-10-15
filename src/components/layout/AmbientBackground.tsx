/**
 * The room every page stands in: the club navy, folded into the dark in one
 * corner of the viewport.
 *
 * ## Why it is still, and why there is nothing else
 *
 * It used to be two pools of navy drifting on a forty-second cycle and a
 * field of a few hundred points wandering across them. None of it said
 * anything: the motion was not caused by the visitor and did not stand for
 * any computation, and on a page whose whole subject is motion that means
 * something, decoration that moves competes with the experiment for the eye.
 * What it did well was the colour, so the colour stays and the movement goes.
 *
 * It is fixed to the viewport, behind everything, and drawn by CSS alone:
 * no canvas, no frame loop, nothing to pause.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <i className="ambient-fog" />
    </div>
  );
}
