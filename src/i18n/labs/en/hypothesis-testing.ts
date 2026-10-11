/** English prose for the hypothesis-testing lab. Its shape is the contract `tr/hypothesis-testing.ts` must meet. */

const copy = {
  scope:
    "This is the theoretical model: the sampling distribution of the sample mean X\u0304 under each hypothesis, both normal with standard error \u03c3/\u221an, with \u03c3 treated as known [Casella & Berger, 2nd ed., Thm. 5.3.1, p. 218]. The sample mean X\u0304 serves as the test statistic in this setup, and the rejection region is written in the units of X\u0304 rather than in standardised form [p. 374]. That is what makes the critical value a z rather than a t. No data is sampled anywhere in this lab: every number is the closed-form value of the equations shown, so what you are reading is the model itself rather than one run of an experiment.",
  credit: {
    inspiration: "Inspired by the work of Ar\u015f. G\u00f6r. Dolunay Ezgi Seyhan.",
    adaptation:
      "This interactive laboratory was developed as an educational adaptation inspired by her original hypothesis testing project.",
    profile: "View faculty profile →",
  },

  testType: {
    right: "\u03bc\u2081 > \u03bc\u2080",
    left: "\u03bc\u2081 < \u03bc\u2080",
    two: "\u03bc\u2081 \u2260 \u03bc\u2080",
  },

  plot: {
    h0: "H\u2080",
    h1: "H\u2081",
    alphaTag: (value: string) => `\u03b1 = ${value}`,
    betaTag: (value: string) => `\u03b2 = ${value}`,
    handleMu1: "H\u2081: drag along the axis",
    handleMu1Value: (value: string) => `\u03bc\u2081 is ${value}`,
    handleCritical: "Critical value: drag along the axis",
    handleCriticalValue: (critical: string, alpha: string) =>
      `boundary at ${critical}, \u03b1 is ${alpha}`,
    summary: (
      mu0: string,
      mu1: string,
      se: string,
      criticals: string,
      alpha: string,
      beta: string,
      power: string,
    ) =>
      `Two sampling distributions of the sample mean. Under H\u2080 it is centred at ${mu0} and under H\u2081 at ${mu1}, both with standard error ${se}. The rejection region begins at ${criticals}. The area under H\u2080 inside the rejection region is \u03b1 = ${alpha}; the area under H\u2081 outside it is \u03b2 = ${beta}. Power is ${power}.`,
  },

  controls: {
    moreLabel: "The other settings",
    note: "Every control retunes the same model. Nothing here is sampled.",
    mu0: "\u03bc\u2080: the null mean",
    mu0Value: (value: string) => `\u03bc\u2080 is ${value}`,
    mu1: "\u03bc\u2081: the alternative mean",
    mu1Value: (value: string) => `\u03bc\u2081 is ${value}`,
    sigma: "\u03c3: population standard deviation",
    sigmaValue: (value: string) => `\u03c3 is ${value}`,
    alpha: "\u03b1",
    alphaValue: (value: string) => `\u03b1 is ${value}`,
    n: "n: sample size",
    nValue: (value: number) => `n is ${value}`,
  },

  separation: {
    title: "Two hypotheses",
    question: "What happens when the two hypotheses move apart?",
    caption:
      "Two claims about the same population mean. Neither curve is the data: each is the sampling distribution of X\u0304, how the average of n measurements behaves if that claim is the true one [Casella & Berger, 2nd ed., pp. 213-214, 218].",
    mu1Hint:
      "Grab H\u2081 on the plot and drag it: through \u03bc\u2080, and back out the other side.",
    mu0Label: "\u03bc\u2080",
    mu1Figure: "\u03bc\u2081",
    gapLabel: "Gap",
    gapHint: "in standard errors",
    announce: (mu1: string, gap: string) =>
      `\u03bc\u2081 is ${mu1}. The two means are ${gap} standard errors apart.`,
  },

  alphaSection: {
    kicker: "Where you draw the line",
    title: "One rejection region, and everything inside it counts as evidence.",
    lede: "A test needs a rule: how far from \u03bc\u2080 must X\u0304 land before you reject H\u2080? The values that lead to rejection form the rejection region, which Casella and Berger also call the critical region, and the critical value is where that region begins. The significance level \u03b1 is the probability that X\u0304 falls in the region when \u03bc = \u03bc\u2080 [Casella & Berger, 2nd ed., Def. 8.1.3, p. 374; Defs. 8.3.5-8.3.6, p. 385].",
    caption:
      "\u03b1 is fixed before any data: it is the probability that X\u0304 falls in the rejection region when \u03bc = \u03bc\u2080, which is why setting it moves the critical value rather than the curve. Rejecting H\u2080 when it is true is a Type I error [Casella & Berger, 2nd ed., Sec. 8.3.1, pp. 382-383].",
    alphaHint:
      "Drag the dashed line. The hatched area of H\u2080 beyond it is \u03b1, exactly, and the number follows your hand.",
    alphaFigure: "\u03b1",
    criticalLabel: "Critical value",
    criticalHint: "\u03bc\u2080 \u00b1 z\u00b7SE",
    criticalLeft: "Lower bound",
    criticalRight: "Upper bound",
    seLabel: "SE",
    seHint: "\u03c3/\u221an",
    oneSided: (value: string) =>
      `All of \u03b1 sits in one tail: ${value} of the H\u2080 distribution lies inside the rejection region.`,
    twoSided: (half: string) =>
      `\u03b1 is split between two tails: ${half} at each end, so each critical value sits further out than a one-sided test would put it.`,
    announce: (alpha: string, criticals: string) =>
      `\u03b1 is ${alpha}. The boundary is at ${criticals}.`,
  },

  betaSection: {
    kicker: "The error nobody counts",
    title: "\u03b2 is what H\u2081 leaves outside the rejection region.",
    lede: "\u03b1 is computed under H\u2080 and \u03b2 under H\u2081, on opposite sides of the same rejection region. Moving the critical value to shrink one enlarges the other, which is why the direction the test is pointed matters as much as where the critical value sits [Casella & Berger, 2nd ed., p. 385].",
    caption:
      "\u03b2 is the probability of not rejecting H\u2080 when this particular \u03bc\u2081 is the true one, a Type II error, and power is 1 \u2212 \u03b2. Both are properties of the model, not of any sample. Evaluated across every possible \u03bc rather than at a single \u03bc\u2081, power becomes the power function [Casella & Berger, 2nd ed., Def. 8.3.1, p. 383].",
    testTypeLabel: "What H\u2081 claims",
    dragHint:
      "Both H\u2081 and the dashed line can be dragged. Push the line one way and \u03b2 shrinks while \u03b1 grows; then point the test the wrong way.",
    betaLabel: "\u03b2",
    betaHint: "H\u2081 area outside the region",
    powerLabel: "Power",
    powerHint: "1 \u2212 \u03b2",
    alphaLabel: "\u03b1",
    reading: (beta: string) =>
      `\u03b2 = ${beta}: that share of the H\u2081 distribution falls outside the rejection region, where the test does not reject H\u2080.`,
    warning: {
      left: "The test is looking for \u03bc\u2081 < \u03bc\u2080, but \u03bc\u2081 is not below \u03bc\u2080. The alternative sits away from the rejection region, so almost none of it is caught: \u03b2 is near 1 and power is near 0.",
      right:
        "The test is looking for \u03bc\u2081 > \u03bc\u2080, but \u03bc\u2081 is not above \u03bc\u2080. The alternative sits away from the rejection region, so almost none of it is caught: \u03b2 is near 1 and power is near 0.",
    },
    announce: (beta: string, power: string) => `\u03b2 is ${beta}. Power is ${power}.`,
  },

  sampleSection: {
    kicker: "The only lever that helps both",
    title: "More data narrows everything at once.",
    lede: "\u03b1 and \u03b2 trade against each other as long as the curves stay the same width. n is what changes their width: SE = \u03c3/\u221an, so both sampling distributions tighten around their own mean and the overlap shrinks without raising \u03b1 [Casella & Berger, 2nd ed., p. 217 and p. 385].",
    caption:
      "The x axis is drawn at \u00b14.5 SE, so the window narrows with the curves. \u221an is why the second half of the slider buys so much less than the first.",
    nLabel: "n: sample size",
    nValue: (value: number) => `n is ${value}`,
    formula: (se: string) => `SE = \u03c3/\u221an = ${se}`,
    nFigure: "n",
    seLabel: "SE",
    seHint: "\u03c3/\u221an",
    powerLabel: "Power",
    betaLabel: "\u03b2",
    curveTitle: "Power against sample size",
    curveHint: "Press or drag along the curve to choose n.",
    eighty: "0.80",
    curveLabel: (from: number, to: number, first: string, last: string) =>
      `Power from n = ${from} to n = ${to}, holding everything else. It starts near ${first} and reaches about ${last}.`,
    announce: (n: number, se: string, power: string) =>
      `n is ${n}. SE is ${se}. Power is ${power}.`,
  },

  challenge: {
    kicker: "Now hit a number",
    title: "Reach the power the task asks for.",
    lede: "Two tasks. Each states a result to reach rather than a control to move, so neither can be passed by putting a slider in a particular place: the model has to actually report the number.",
    puzzleLabel: "Task",
    reset: "Back to the start",
    powerLabel: "Power",
    alphaLabel: "\u03b1",
    seLabel: "SE",
    target: (value: string) => `target ${value}`,
    notYet: (power: string, target: string) => `Power is ${power}. It needs to reach ${target}.`,
    alphaTooHigh: (max: string) =>
      `\u03b1 is above the limit for this task: it must stay at or below ${max}.`,
    announceSolved: (power: string) => `Solved. Power is ${power}.`,
    announceAttempt: (power: string, alpha: string) => `Power ${power} at \u03b1 ${alpha}.`,
    puzzles: {
      "reach-power": {
        title: "Reach 0.80",
        brief: (power: string, alpha: string) =>
          `The effect is real but small: \u03bc\u2081 sits half a unit above \u03bc\u2080, and the test still misses it more often than it finds it. Get power to ${power} without letting \u03b1 go above ${alpha}.`,
        lesson:
          "Both levers raise power, but not in the same way. Raising \u03b1 widens the rejection region and accepts a higher Type I error rate; raising n narrows SE, which lowers \u03b2 without changing \u03b1 [Casella & Berger, 2nd ed., p. 385].",
        solved: (power: string, alpha: string) =>
          `Power is ${power} at \u03b1 = ${alpha}. Whatever mix of n and \u03b1 got you here, the critical value ended up close enough to \u03bc\u2080, relative to SE, for most of the H\u2081 distribution to land inside the rejection region.`,
      },
      noisy: {
        title: "Too much noise",
        brief: (power: string, alpha: string) =>
          `\u03c3 is 3 and the test is two-sided, so \u03b1 is split across two tails and both critical values sit a long way out. Reach ${power} power with \u03b1 at or below ${alpha}.`,
        lesson:
          "A two-sided test splits \u03b1 between both tails, so each critical value sits further out than a one-sided test would place it. A one-sided test puts all of \u03b1 in a single tail, which raises power when \u03bc\u2081 lies in that direction and lowers it when it does not [Casella & Berger, 2nd ed., p. 386].",
        solved: (power: string, alpha: string) =>
          `Power is ${power} at \u03b1 = ${alpha}. Narrowing \u03c3 or raising n shrinks SE; a one-sided test places all of \u03b1 in the tail where \u03bc\u2081 actually lies.`,
      },
    },
  },

  recap: {
    lessons: [
      "\u03b1 is the probability that X\u0304 falls in the rejection region when \u03bc = \u03bc\u2080: the Type I error rate fixed before seeing anything.",
      '\u03b2 is the probability that X\u0304 falls outside that region when \u03bc = \u03bc\u2081, and power is 1 \u2212 \u03b2. They are computed against one specific \u03bc\u2081, not against "some effect".',
      "Moving the critical value trades \u03b1 against \u03b2. Only a smaller SE = \u03c3/\u221an improves both, which is why n is the lever that is not a compromise.",
    ],
    footer:
      "Everything here is the closed-form normal model with \u03c3 known: two sampling distributions of the sample mean, one rejection region, and the areas either side of its boundary. Real testing has to estimate \u03c3 from the sample, which is what makes a t distribution necessary, and has to worry about whether the direction was chosen before the data or after it. This lab shows the geometry those complications sit on top of.",
  },
  sources: {
    title: "Sources",
    theoryLabel: "Theoretical source",
    theory:
      "George Casella and Roger L. Berger, Statistical Inference, 2nd edition, Duxbury Press. Chapter 8 for hypothesis tests, error probabilities and the power function (pp. 373-386); Chapter 5 for the sampling distribution of the sample mean (pp. 213-218).",
    implementationLabel: "Implementation and inspiration",
    implementation:
      "The numerical model is a port of the original hypothesis testing project by Ar\u015f. G\u00f6r. Dolunay Ezgi Seyhan. This interactive adaptation, its wording and its visual design are the work of AI CLUB LABS.",
    notation:
      "Notation: this lab writes \u03b2 for the probability of a Type II error and power as 1 \u2212 \u03b2, which is the common applied convention. Casella and Berger write \u03b2(\u03b8) for the power function itself, so their \u03b2(\u03b8) corresponds to 1 \u2212 \u03b2 here (Def. 8.3.1, p. 383).",
    pages:
      "Page numbers refer to the printed pages of the second edition consulted for this revision. No publication year is given because it could not be verified from the copy consulted.",
  },
};

export default copy;
