/** English prose for the gradient-descent lab. Its shape is the contract `tr/gradient-descent.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    momentum:
      "Supports the momentum method the lab offers, and the heavy-ball update it comes from.",
    adam: "Supports the Adam optimiser the lab offers, including the moment estimates and the bias correction the engine computes.",
  },

  controls: {
    run: "Run",
    pause: "Pause",
    reset: "Reset",
    stepOnce: "One step",
    scrubber: "Step",
    scrubberValue: (index: number, total: number) => `Step ${index} of ${total}`,
    // Section 1 has no vocabulary yet, so the slider is named in words.
    // η arrives in section 3, where the thresholds are named with it.
    stepSize: "Step size",
    learningRate: "Step size η",
    learningRateValue: (value: string) => `Step size ${value}`,
    beta: "Momentum β",
    betaValue: (value: string) => `Momentum beta ${value}`,
    curvature: "Curvature ratio",
    curvatureValue: (value: string) => `Condition number ${value}`,
    optimizer: "Optimizer",
    resetPoint: "Recentre",
    aboutThisSurface: "About this surface",
    stepSizeAndScale: "Step size",
  },

  optimizers: {
    gd: "Gradient Descent",
    momentum: "Momentum",
    adam: "Adam",
  },

  status: {
    running: "Running",
    converged: "Reached the goal",
    diverged: "Diverged",
    exhausted: "Ran out of steps",
  },

  figures: {
    step: "Step",
    objective: "Objective",
    objectiveHint: "the value of f here",
    gradientNorm: "Gradient size",
    position: "Position",
    status: "Outcome",
    conditionNumber: "Condition number",
    conditionNumberHint: "κ = steeper curvature ÷ flatter curvature",
    stepsTaken: (n: number) => `${n} steps`,
    stepsToTolerance: "Steps to goal",
  },

  map: {
    label: (
      x: string,
      y: string,
      step: number,
      objective: string,
      gradient: string,
      status: string,
    ) =>
      `Contour map of the objective. Step ${step}. Position ${x}, ${y}. Objective ${objective}. Gradient size ${gradient}. ${status}.`,
  },

  chart: {
    label: (objective: string, step: number) =>
      `The objective plotted against step number on a logarithmic scale. At step ${step} the objective is ${objective}.`,
  },

  announce: {
    ready: "Back at the starting point.",
    finished: (steps: number, status: string) => `Finished after ${steps} steps. ${status}.`,
  },

  drop: {
    instruction:
      "Tap the map to drop the ball, and let go to watch it roll. Drag the cyan tip to make every step longer or shorter.",
    mapHint:
      "Tap or drag on the map to place the starting point and let go to run; arrow keys move it and Enter runs.",
    handleLabel: "Tip of the first step. Drag it, or use the arrow keys, to change the step size.",
    moreLabel: "Exact step size and step-by-step controls",
    momentumHint:
      "Turn the dial up to let the ball keep more of its last step. Tap either map to drop it somewhere new.",
  },
  find: {
    title: "Find the bottom",
    question: "How big a step can you take?",
    caption:
      "The cyan arrow is the first step, drawn to scale. Make it longer and every step grows with it. Watch the shape of the route rather than the numbers.",
  },

  direction: {
    kicker: "Why that direction",
    title: "A gradient is a vector, and it is not a pointer to the answer.",
    lede: "Two arrows leave the current point: the solid one is where a step actually goes, −∇f = −(a·x, b·y); the dashed one is the straight line to the minimum, −(x, y). Each coordinate is scaled by its own curvature, so the two agree only when the curvatures do. Drag the point, then drag the curvature.",
    descent: "Where a step goes: −∇f",
    target: "Straight line to the minimum",
    equalLength:
      "Both arrows are drawn at the same length, so only their direction is being compared.",
    angle: "Angle between them",
    angleHint: "0° means the two agree",
    aligned: "The curvatures are equal here, so the two directions coincide exactly.",
    apart:
      "The curvatures differ, so the step is pulled towards the steeper axis rather than towards the minimum.",
    onAxis:
      "One coordinate is already zero, so there is nothing for the unequal scaling to act on. Move the point off the axis to separate the arrows.",
    dragHint: "Drag anywhere on the map to move the point, or focus the map and use",
    keyboardHint: "to move it, and this to send it back:",
    keyboardHelp:
      "Drag anywhere on the map to move the point. With the map focused, the arrow keys move it and Home returns it to the centre-right starting position.",
    legendAndKeys: "Arrows and keyboard",
    label: (x: string, y: string, kappa: string, angle: string) =>
      `Contour map with a movable point at ${x}, ${y}. Condition number ${kappa}. The descent direction is ${angle} degrees away from the straight line to the minimum.`,
    caption:
      "Slide the curvature ratio down to 1 and the two arrows fold into one. Away from the axes that is the only case where they agree, and it is a case a one-dimensional picture cannot show at all, because along a single axis a gradient is just a sign.",
  },

  rate: {
    kicker: "The step size",
    title: "The ceiling belongs to the surface.",
    lede: "Same landscape, one number to change: the length of that first step. The two marks under the map are computed from this landscape's curvature; they were not chosen to make the demonstration work.",
    marks: { monotone: "no overshoot", stability: "stability limit" },
    regimes: {
      monotone: "Approaching directly",
      oscillating: "Overshooting, still closing in",
      boundary: "On the boundary",
      divergent: "Diverging",
    },
    regimeNote: {
      monotone: "η is below 1/c for both curvatures: neither coordinate overshoots.",
      oscillating:
        "η is past 1/c on the steeper axis: it changes sign each step but still shrinks.",
      boundary: "η is exactly 2/c on the steeper axis: that coordinate neither shrinks nor grows.",
      divergent: "η is past 2/c on the steeper axis: that coordinate grows every step.",
    },
    scope:
      "These thresholds are exact for the quadratic used here, whose curvature is the same at every point. Where curvature changes as you move, the usable step size changes with it.",
    caption:
      "The stability limit is 2 ÷ the larger curvature, so it moves when the landscape does. No step size is large or small on its own: the same η that leaves this landscape entirely settles quietly on a gentler one.",
  },

  golf: {
    kicker: "Now play it",
    title: "Gradient golf.",
    lede: "Six holes on the landscapes above. You cannot aim: the slope decides the direction of every stroke. You choose the club, and the club is the step size.",
    caption:
      "A stroke is one step of plain gradient descent, computed by the same engine as the rest of the lab. Par is found for each tee by searching the same six clubs you hold.",
    start: "Tee off",
    again: "Play a new round",
    hit: (club: string) => `Hit with the ${club}`,
    playOut: (club: string) => `Play every stroke with the ${club}`,
    nextHole: "Next hole",
    finish: "See the scorecard",
    out: "Out of bounds: one penalty stroke, and the ball is put back.",
    firstShot:
      "Pick a club and hit. The arrow shows which way the ball will go; how far it goes is up to the club.",
    didNotFinish: "Did not finish.",
    holeLabel: (i: number, total: number) => `Hole ${i} of ${total}`,
    freeRule: "Any club on any stroke",
    fixedRule: "One club for every stroke",
    mapLabel: (name: string, strokes: number) =>
      `${name}: contour map of the hole, ${strokes} ${strokes === 1 ? "stroke" : "strokes"} so far.`,
    clubLabel: "Club",
    clubs: {
      putter: "Putter",
      wedge: "Wedge",
      iron9: "9-iron",
      iron5: "5-iron",
      wood: "Wood",
      driver: "Driver",
    },
    shotLine: (n: number, club: string, eta: string, slope: string, distance: string) =>
      `${n}. ${club}: η ${eta} × slope ${slope} = ${distance}`,
    results: { out: "out of bounds, +1", holed: "in the cup" },
    figures: {
      par: "Par",
      strokes: "Strokes",
      slope: "Slope |∇f|",
      slopeHint: "the club multiplies this",
      round: "Round",
      best: "Best round",
    },
    announce: {
      hole: (i: number, name: string, par: number) => `Hole ${i}: ${name}. Par ${par}.`,
      holed: (strokes: number) => `In the cup. Strokes: ${strokes}.`,
      rolled: (strokes: number) => `Strokes: ${strokes}.`,
      round: (score: string) => `Round over: ${score} against par.`,
    },
    scoreNames: {
      holeInOne: "Hole in one!",
      eagle: "Eagle.",
      birdie: "Birdie.",
      par: "Par.",
      bogey: "Bogey.",
      doubleBogey: "Double bogey.",
      worse: "Well over par.",
    },
    holeScore: (strokes: number, par: number) =>
      `${strokes} ${strokes === 1 ? "stroke" : "strokes"}, par ${par}.`,
    parLine: (clubs: string) => `Par from this tee: ${clubs}.`,
    fixedLine: (club: string, par: number) =>
      `The best single club from this tee was the ${club}, in ${par} strokes.`,
    fixedFail: (club: string) =>
      `The ${club} never got there: either its η is at or past 2 over the steep curvature, or it is too short to arrive within the stroke limit.`,
    holes: {
      bowl: {
        name: "The Bowl",
        lesson:
          "On a round bowl the slope points straight at the cup, so one club sinks it from anywhere: the one whose η is 1 over the curvature, here 1/2. Twice that lands on the mirror point, and anything more throws the ball further out each time.",
      },
      oval: {
        name: "The Oval",
        lesson:
          "Stretch the bowl and the slope stops pointing at the cup. Each direction shrinks by its own factor, 1 − η·c, so a club that settles the steep direction barely moves the ball along the flat one, and one stroke is no longer enough.",
      },
      ravine: {
        name: "The Ravine",
        lesson:
          "Across the ravine the curvature is 20, so the wedge, η = 1/20, lands exactly on the floor. From there the slope runs along the ravine and a long club finishes. At η = 2/20 the steep direction stops shrinking, and beyond it the ball flies off the course.",
      },
      valley: {
        name: "The Long Valley",
        lesson:
          "No club lands exactly on this floor. A long shot multiplies whatever is left across the valley by 1 − η·18, so the steep direction has to be made small first, with short clubs, before the long club is safe.",
      },
      oneClub: {
        name: "One Club",
        lesson:
          "One club for every stroke is a fixed learning rate. It has to stay below 2 over the steepest curvature, so along the flat direction it crawls: this is the same landscape as hole 2, and it takes several times the strokes.",
      },
      oneClubNarrow: {
        name: "One Club, Narrow",
        lesson:
          "Narrower still, and the stroke count climbs again. With one learning rate the steep direction sets the limit and the flat direction pays for it. Momentum and Adam, in the next two sections, are two ways out.",
      },
    },
    scorecard: { title: "Scorecard", hole: "Hole", par: "Par", you: "You" },
    intro: {
      kicker: "The course",
      story:
        "The ball is the parameters and the cup is the minimum. You do not aim: every stroke goes downhill, straight along −∇f. All you choose is the club, and a club is a learning rate.",
      rules: [
        "A stroke moves the ball by η times the steepness under it. Steep ground sends it far; near the cup it barely moves.",
        "Leaving the map is out of bounds: one penalty stroke, and the ball comes back.",
        "Every round has new tees. Par is computed for each one by searching the same clubs you hold, so it can always be reached.",
        "The last two holes give you one club for every stroke, which is how an optimizer with a fixed learning rate works.",
      ],
    },
    end: {
      kicker: "The round",
      relative: "Against par: E is even, and minus is under par.",
      newBest: "A new best for this browser.",
      takeaways: [
        "The slope chose the direction of every stroke and you chose only η. The distance was η times the steepness, which is why the same club flew on the walls and crept near the cup.",
        "Each direction is multiplied by 1 − η·c for its own curvature c. At η = 1/c it lands on the floor, at 2/c it bounces to the mirror point, and beyond that it leaves. The steepest direction sets the ceiling.",
        "Choosing a club per stroke beat any single club. A plain optimizer has one learning rate for every step, so a badly conditioned landscape costs it strokes; the next two sections are about winning them back.",
      ],
    },
  },

  momentumSection: {
    kicker: "Momentum",
    title: "Carrying something over from the last step.",
    lede: "Momentum keeps a running velocity: v ← β·v + ∇f, then θ ← θ − η·v. Pushes that keep pointing the same way accumulate; pushes that keep reversing cancel. Raise β and watch the second mark move.",
    marks: { plain: "plain limit", momentum: "momentum limit" },
    caption:
      "The stability condition is η·max(a,b) < 2(1+β), wider than plain descent's η·max(a,b) < 2, so momentum can carry a larger step size than plain descent can. What it charges for that range is oscillation. Hold the step size still and raise β: the run gets shorter, and then past a point it gets longer again.",
    announce: (
      plainSteps: number,
      plainStatus: string,
      momentumSteps: number,
      momentumStatus: string,
    ) =>
      `Gradient descent: ${plainSteps} steps, ${plainStatus}. Momentum: ${momentumSteps} steps, ${momentumStatus}.`,
  },

  adam: {
    kicker: "Adam",
    title: "One step size per parameter.",
    lede: "Adam divides each coordinate's step by a running estimate of that coordinate's own gradient size. m is the average gradient, s the average squared gradient, both corrected for starting at zero, and the update is η·m̂ ÷ (√ŝ + ε).",
    firstStepTitle: "The first step, where the two curvatures are a million apart",
    firstStepLede: (a: string, b: string) =>
      `Curvature ${a} along one axis and ${b} along the other. The two components of the gradient are about a million times apart. Every number below is measured by running one step of the engine.`,
    tableCaption:
      "Gradient size and first-step size on each axis, for gradient descent and for Adam.",
    colQuantity: "Quantity",
    colX: "Steep axis",
    colY: "Flat axis",
    rowGradient: "Gradient size",
    rowGd: (rate: string) => `Gradient descent step, η = ${rate}`,
    rowAdam: (rate: string) => `Adam step, η = ${rate}`,
    firstStepNote:
      "After the bias correction the first update is η·g ÷ (|g| + ε). The size of the gradient cancels, and both axes move by about η, which is why the correction has to be real rather than skipped.",
    rate: "Adam step size η",
    honesty:
      "None of that says Adam converges faster. On the κ = 60 valley above, sweeping 300 step sizes, Adam's quickest result is 17 steps, while a well-chosen momentum setting reaches the same tolerance in about 10, and at a modest step size such as 0.10, Adam needs 66. There is still a step size to choose, and choosing it badly still costs.",
  },

  challenge: {
    kicker: "Three questions",
    title: "The budget is counted in steps.",
    lede: "Each one fixes a landscape, a starting point and a number of steps. Arriving slowly is not a pass, and the three do not have the same answer.",
    puzzle: "Question",
    budget: (n: number) => `${n} steps`,
    goal: (budget: number, tolerance: string) =>
      `Goal: objective ≤ ${tolerance} within ${budget} steps.`,
    progress: (done: number, total: number) => `${done} of ${total} solved`,
    pressRun: "Press Run, or drag the step slider to the end, to see how this attempt did.",
    pass: "Solved.",
    notYet: "Not yet.",
    optimizerAndSettings: "Optimizer and settings",
    boundaryHint: (limit: string, kappa: string) =>
      `Stability limit for these settings: ${limit}. Condition number κ = ${kappa}.`,
    verdicts: {
      solved: (steps: number, budget: number) =>
        `Reached the goal in ${steps} steps, inside the budget of ${budget}.`,
      overBudget: (steps: number, budget: number) =>
        `It gets there, but in ${steps} steps, and the budget is ${budget}.`,
      stalled: (budget: number) =>
        `This never reaches the goal at all. The budget is ${budget} steps.`,
      diverged:
        "The run left the landscape: at these settings the step size is at or above the stability limit here.",
    },
    transfer: {
      title: "The same number, on a gentler landscape",
      divergesHereConvergesThere: (
        rate: string,
        limitHere: string,
        limitThere: string,
        steps: number,
      ) =>
        `η = ${rate} is above this landscape's stability limit of ${limitHere}, so the run explodes. The gentler landscape's limit is ${limitThere}, and the very same η settles there in ${steps} steps. The step size did not change. The surface did.`,
      worksOnBoth: (steps: number) =>
        `This η converges on both landscapes: here, and in ${steps} steps on the gentler one. Push it upwards and watch which of the two gives out first.`,
      worksOnNeither:
        "This η reaches the goal on neither landscape within the steps allowed. It is too small rather than too large.",
      mapLabel: (rate: string, status: string, steps: number) =>
        `Contour map of the gentler landscape run at step size ${rate}. ${status} after ${steps} steps.`,
    },
    items: {
      c1: {
        title: "Sweet spot",
        brief:
          "One landscape, plain gradient descent, and a tight budget. There is a step size that gets there quickly, and a great many that do not.",
      },
      c2: {
        title: "Too big",
        brief:
          "This begins above the stability limit and explodes on the first Run. Find a step size that works, then look at what that same number does on a gentler surface.",
      },
      c3: {
        title: "Narrow valley",
        brief:
          "A valley with κ = 60. No step size lets plain gradient descent finish inside this budget, which is the reason the other two optimizers exist.",
      },
    },
  },

  recap: {
    lessons: [
      "The negative gradient points downhill, not at the minimum. Away from the axes the two coincide only where the curvature is the same in every direction.",
      "The largest step size a landscape tolerates is 2 ÷ its steepest curvature: a property of the surface, not of the algorithm. Below half of it the approach is direct, between the two the path overshoots and still closes in, and above it the run leaves.",
      "The condition number κ is the steeper curvature divided by the flatter one, and it is what stops a single step size from serving both directions: the flat axis is still crawling while the steep one is already at its ceiling.",
      "Momentum widens the stable range to η·max(a,b) < 2(1+β) and can cut a long zig-zag short; Adam scales each coordinate by its own gradient history, so a millionfold gap in gradient size is not a millionfold gap in step size. Both still leave you a step size to choose.",
    ],
    footer:
      "Everything here is a convex quadratic: the curvature is the same at every point, the gradient is exact, and the answer is known before you start. Real training gives up all three. What survives is the relationship you have been moving back and forth: the shape of the surface decides what step size you are allowed to take.",
  },
};

export default copy;
