/**
 * English — the source of truth for the translation shape.
 *
 * `types.ts` derives `Translation` from this object, so every other dictionary
 * must match it exactly: a key added here is a compile error in `tr.ts` until
 * it is translated, and a key removed here makes the leftover an excess
 * property. Interpolated strings are functions so their arguments are checked
 * too — a translation cannot drop a count or reorder two parameters silently.
 *
 * Only user-visible text lives here. Algorithm names, token strings, corpus
 * text and storage keys stay where they are.
 */

export const en = {
  // ------------------------------------------------------------- chrome ----
  shell: {
    skipToContent: "Skip to content",
    brand: "AI Club",
    brandSuffix: "Labs",
    primaryNav: "Primary",
    allLabs: "All labs",
    breadcrumb: "Breadcrumb",
    backToLabs: "← All labs",
    footerTagline: "AI Club Labs: Learn computer science by playing with it.",
    byLine: "by",
    parentOrg: "Hacettepe AI Club",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "A project by Hacettepe AI Club",
    minutes: (n: number) => `${n} min`,
    loadingLab: "Loading lab",
    openLab: "Open lab →",
  },

  preferences: {
    languageLabel: "Language",
    english: "EN",
    englishFull: "English",
    turkish: "TR",
    turkishFull: "Türkçe",
    themeLabel: "Theme",
    light: "Light",
    dark: "Dark",
  },

  home: {
    kicker: "AI Club Labs",
    // Restored from the original landing page. "Learn computer science by
    // making it move" was shorter but named only half of what is here, and
    // dropped the word visitors are actually looking for. This one says both
    // fields out loud and still leads with the verb.
    title: "Play with the ideas behind computer science and artificial intelligence.",
    // Also the original copy, tightened: it now states the size of the
    // collection, because the labs start one screen below and the count is
    // the fastest way to say what this place is.
    lede: "Nine interactive experiments — algorithms, neural networks and the machinery of computation. No lectures, just levers to pull.",
    cta: "Start experimenting",
    labs: "Labs",
    labCount: (n: number) => `${n} instruments`,
    experiments: "Experiments",
    emptyTitle: "First experiments are brewing.",
    emptyBody: "The platform is ready — labs register themselves and appear here automatically.",
  },

  notFound: {
    title: "This lab doesn't exist — yet.",
    body: "Maybe it's still an idea on a whiteboard somewhere.",
    back: "Back to all labs",
  },

  category: {
    algorithms: "Algorithms",
    "data-structures": "Data Structures",
    "machine-learning": "Machine Learning",
    "neural-networks": "Neural Networks",
    systems: "Systems",
    theory: "Theory",
  },

  difficulty: {
    intro: "intro",
    intermediate: "intermediate",
    advanced: "advanced",
  },

  // Controls that mean the same thing in more than one lab.
  common: {
    run: "Run",
    pause: "Pause",
    step: "Step",
    reset: "Reset",
    clear: "Clear",
    startOver: "Start over",
    tryAgain: "Try again",
    solved: (done: number, total: number) => `${done} of ${total} solved`,
    recapTitle: "Today you learned",
    controlsLabel: "Simulation controls",
    // Names what a stage's disclosure holds. Never "Advanced", never a
    // gear icon: a visitor should know what is behind it before opening it.
    moreControls: "Settings and help",
    keyboardHint: "With the chart focused,",
  },

  labs: {
    // ------------------------------- embedding universe (3D prototype) ----
  "embedding-universe-3d": {
      title: "Embedding Universe — 3D prototype",
      description:
        "An experiment: the same 318 words projected onto three PCA axes instead of two.",
      lede: "The same words, the same vectors, one more axis. Drag to turn the cloud.",
      honesty:
        "This is not what the embedding looks like. The space has 300 dimensions; what you are turning is a view of it reduced to three PCA axes, which is one more than the flat map and still almost none of them.",
      compare:
        "A prototype, kept apart from the lesson on purpose. Depth makes the cloud feel like a place, but it does not make the projection more truthful — and judging whether that trade is worth teaching is the point of building it.",
      error: "The word vectors could not be loaded.",
      varianceLabel: "Variance explained",
      varianceHint: (dimensions: number) => `three axes of ${dimensions}`,
      selectedLabel: "Selected",
      recapTitle: "What this prototype shows",
      recap: {
        lessons: [
          "Three axes carry a little more of the space than two — and still almost none of it.",
          "Depth makes the cloud feel like a place, which is persuasive whether or not it is informative.",
          "The words, the vectors and the nearest neighbours are identical to the flat map; only the view changed.",
        ],
      },
      map: {
        mapLabel:
          "Word cloud in three dimensions. Drag to turn it. Arrow keys move through the nearest words, Shift with arrow keys turns the view, Enter selects.",
        hint: "Drag to turn · Shift + arrows to orbit",
        pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
        neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. Number ${rank} nearest, similarity ${score}`,
        selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Selected`,
        pending: "Working out the three axes…",
      },
    },

    // ------------------------------------------------ embedding universe ----
    "embedding-universe": {
      title: "Embedding Universe",
      description:
        "Guess which word a model thinks is closest to APPLE, then find out what the map of those words is hiding.",

      predict: {
        question: (word: string) => `Which word is closest to ${word}?`,
        hint: "All three are related — pick the one you would expect.",
        loading: "Loading word vectors…",
        chose: (word: string, rank: number, total: number, score: string) =>
          `You picked ${word} — the ${rank}th closest of ${total}, at ${score}.`,
        nearest: (word: string, score: string) => `The closest is ${word}, at ${score}.`,
        because:
          "These vectors were learned from how words are used, not from what they mean. In news and encyclopedia text, apple keeps company with software far more often than with fruit.",
      },

      explore: {
        title: "Explore the universe",
        neighboursTitle: "Nearest words",
        announce: (word: string, gloss: string) => `Selected ${word}, ${gloss}.`,
      },

      map: {
        mapLabel: "Word map. Arrow keys move through the nearest words, Enter selects.",
        pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
        neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. Number ${rank} nearest, similarity ${score}`,
        selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Selected`,
        pending: "Working out where the words sit…",
        linksNote:
          "The lines join the selected word to the eight listed beside it. They are a reading aid, not part of the model — the embedding has no links, only distances.",
      },

      search: {
        label: "Find a word",
        placeholder: "english or türkçe…",
        noMatch: (query: string) => `No word in this set matches “${query}”.`,
        resultsLabel: "Search results",
        optionLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
      },

      neighbours: {
        title: (word: string) => `Nearest to ${word}`,
        rankHeader: "Rank",
        wordHeader: "Word",
        scoreHeader: "Similarity",
        rowLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. Number ${rank} nearest, similarity ${score}. Select to centre the map here.`,
      },

      projection: {
        kicker: "What the map is not showing",
        title: "You are not looking at the space",
        lede: "The words above are real. Their positions are a flattening of 300 numbers down to 2, and a flattening has to lose something. Here is exactly what it lost.",
        modeLabel: "Show me",
        modeNone: "My selection",
        modeHidden: "Close, drawn far apart",
        modeFalse: "Far apart, drawn close",
        idle: "Pick one of the two above, and watch where those words are on the map.",
        // English ordinals are irregular, so the language that needs suffixes
        // owns them. Defensive about its argument: the i18n coverage probe
        // calls every interpolated string with placeholder values.
        ordinal: (n: number) => {
          const value = Number(n);
          if (!Number.isFinite(value)) return String(n);
          const tens = value % 100;
          if (tens >= 11 && tens <= 13) return `${value}th`;
          const suffix = { 1: "st", 2: "nd", 3: "rd" }[value % 10] ?? "th";
          return `${value}${suffix}`;
        },
        hiddenBody: (
          a: string,
          b: string,
          rank: string,
          total: number,
          score: string,
          percent: string,
        ) =>
          `${a} and ${b} are the ${rank} closest pair out of ${total}, at ${score}. The projection put them ${percent} of the map apart — looking at the picture, you would never guess they were related.`,
        falseBody: (
          a: string,
          b: string,
          screenRank: string,
          trueRank: string,
          total: number,
          score: string,
        ) =>
          `${a} and ${b} sit ${screenRank} closest on screen, almost touching. In the real space they are ${trueRank} of ${total}, at ${score}. The picture invented that closeness.`,
        varianceLabel: "Variance explained",
        varianceHint: (first: string, second: string) => `PC1 ${first} + PC2 ${second}`,
        varianceBody: (percent: string, remaining: number) =>
          `These two axes explain ${percent} of the variance in this dataset. The rest of the variation has not gone anywhere — it lies along the other ${remaining} directions, which a flat screen has no room for.`,
        correlationLabel: "Distance agreement",
        correlationHint: "−1.00 would mean the map lost nothing",
        pending: "Working out the projection…",
      },

      data: {
        error: "The word vectors could not be loaded.",
      },

      recap: {
        lessons: [
          "An embedding turns an item into a vector, so relationships between items become distances.",
          "Those relationships come from how words are used together, not from what they mean.",
          "A 2-D map of a 300-D space is a shadow: some of what it shows is not there, and some of what is there is not shown.",
        ],
      },

      honesty: {
        source:
          "The vectors are GloVe 6B 300d, pretrained by Stanford NLP on Wikipedia 2014 and Gigaword 5. This lab looks each word up in that published table and normalises it to unit length; nothing is trained, fine-tuned or generated here.",
        turkish:
          "The embedding space is English. Turkish words shown here are labels we added for reading — they were not embedded, and this is not a Turkish embedding space.",
      },
    },

    // ------------------------------------------------ reward playground ----
    "reward-playground": {
      title: "Reward Playground",
      description: "Decide what one square is worth to a robot, and watch it obey you exactly.",

      room: {
        title: "The room",
        question:
          "Nobody showed this robot the way out. It worked the route out by trying things — and you get to decide what it cares about.",
        sliderLabel: "What is the marked square worth to the robot?",
        sliderValue: (value: string) => `The marked square is worth ${value}`,
        hint: "Drag it. The route is worked out again from scratch every time you move it.",
        wow: "You never told it to stop. You told it the square was worth more than the door.",
        behaviour: {
          avoided: "It walked the long way round to keep off the square, and reached the door.",
          passed: "It crossed the square on its way and reached the door.",
          stayed: "It never went to the door at all. It just stays by the square.",
        },
        readout: (steps: number, visits: number) =>
          `${steps} moves · stepped on the square ${visits} ${visits === 1 ? "time" : "times"}`,
        mapLabel: (behaviour: string, steps: number, visits: number, at: number) =>
          `A small room seen from above. ${behaviour} ${steps} moves in total, stepping on the marked square ${visits} times. The robot is at move ${at}.`,
      },

      learn: {
        kicker: "How did it work this out?",
        title: "It kept a number for every move it could make.",
        lede: "Nothing here is a picture of what the robot might have learned — it is what it did learn, at the moment you scrub to. Move the slider above and every number on this page is recomputed from a fresh run.",

        scrubber: "How much practice it has had",
        episode: (n: number) => `attempt ${n}`,
        scrubberValue: (episode: number, total: number) =>
          `After attempt ${episode} of ${total}`,
        episodeLabel: "Attempts so far",

        mapLabel: (episode: number) =>
          `The room after ${episode} attempts. Each square shows how good the robot thinks it is, and the direction it would move from there.`,
        cellLabel: (row: number, col: number, value: string, action: string) =>
          `Row ${row}, column ${col}. Worth ${value}. It would move ${action}.`,
        wallCell: (row: number, col: number) => `Row ${row}, column ${col}. Wall.`,

        actions: { 0: "up", 1: "down", 2: "left", 3: "right" },
        noAction: "nowhere — this is the door",
        bestAction: "best",
        selectedTitle: (row: number, col: number) => `Row ${row}, column ${col}`,
        chain: (row: number, col: number, action: string, value: string) =>
          `Standing at row ${row}, column ${col}, the robot has four moves it could make and a number for each one. It keeps the largest — ${value}, by moving ${action} — because that move led somewhere better the last time it tried. Repeat that a few hundred times and the numbers stop changing.`,

        unexploredLabel: "Squares its route skips",
        unexploredHint: "it stopped going there",

        propagation:
          "Scrub back to the very beginning. For the first dozen attempts nothing is worth anything: the robot is wandering, and every move it makes costs it a little. Then it stumbles into the door, one square near the door turns positive, and over the next handful of attempts that good news spreads outward across the room, one square at a time. That spread is the whole of the learning.",

        formulaTitle: "The rule it applies after every single move",
        formulaNote:
          "Read it as: nudge the number for the move you just made towards what you actually got, plus the best you now think is available from where you landed. α is how big a nudge, γ is how much a later reward is worth compared with one right now.",

        honesty:
          "The robot did not learn the whole room. It learned a route that works and stopped exploring the rest, so some squares still carry whatever it happened to think early on. That is not a fault in the method — it is what learning only from your own experience looks like.",

        scheduleWarning:
          "The saved attempts are evenly spaced, which hides the part where the learning happens.",
      },

      recap: {
        lessons: [
          "A reward is not an instruction. It is a score, and the robot will find whatever behaviour scores highest — including one you never had in mind.",
          "It learns by trying: each move updates a number, and the useful numbers spread outward from the first thing that ever went well.",
          "It optimises the reward you actually wrote down, not the outcome you were picturing when you wrote it.",
        ],
        footer:
          "This is real tabular Q-learning on a small deterministic grid: twenty-seven squares, four moves, one number per pair. Real robots and large reinforcement-learning systems are far more complicated — but the gap between what you rewarded and what you wanted does not get smaller as they grow.",
      },
    },

    // ------------------------------------------------------- attention ----
    attention: {
      title: "Attention Playground",
      description: "Pick a word and watch which part of the sentence the model leans on.",

      hero: {
        title: "Where is this word looking?",
        question: "Every word is looking at the others. Pick one and see where it looks.",
      },

      sentenceLabel: "The sentence. Pick a word to see where it looks.",
      sentenceHint:
        "Use the left and right arrow keys to move between words, Home and End to jump to either end.",
      tokenLabel: (word: string, share: number, position: number, total: number) =>
        `${word}, ${share} percent, word ${position} of ${total}`,
      percent: (share: number) => `${share}%`,
      pair: (word: string, share: number) => `${word} ${share} percent`,
      announce: (word: string, targets: string) => `${word} is looking mostly at ${targets}.`,
      mostlyLookingAt: (word: string) => `“${word}” is mostly looking at`,
      nearTie:
        "These two are almost level. This little model has no grammar, so it cannot tell which one belongs with the word you picked.",

      swapLabel: "Change one word",
      swapHint:
        "Swap the fifth word and watch what happens to the word you have selected — even though you did not touch it.",
      dogNote:
        "Two animals now, and the model split its attention almost evenly between them. It moved, but it still cannot tell which one was tired.",

      reveal: {
        kicker: "How did it decide?",
        title: "One number, from beginning to end.",
        lede: "This follows whatever word is selected above. Change the selection, or change the swapped word, and every step here changes with it — because it is the same calculation, not a second copy of it.",
      },

      trace: {
        step1: "The word you picked",
        step1Title: (word: string) => `Start with “${word}”`,
        step1Note:
          "Everything below is this one word comparing itself with each of the others, in order.",

        step2: "What it is looking for",
        step2Title: (word: string) => `“${word}” asks for this — its query`,
        step2Note:
          "A bar to the right is a property the word wants; a bar to the left is one it is actively not looking for. These are the model's own words for what it wants, made readable — a real model's are not readable at all.",

        step3: "What the other word offers",
        step3Title: (word: string) => `“${word}” offers this — its key`,
        step3Note:
          "Query and key come from two different projections on purpose: what a word offers is not the same as what it wants. That is why attention is more than measuring similarity.",

        step4: "The match",
        step4Title: (score: string) => `They line up to ${score}`,
        step4Note: (from: string, to: string) =>
          `Multiply what “${from}” wants by what “${to}” offers, add it up, and divide by the square root of the number of axes. That last step keeps the numbers in a workable range as the model gets wider.`,

        step5: "Share of 100%",
        step5Title: (share: number) => `Which becomes ${share}% of the attention`,
        step5Note:
          "The shares always add up to 100%, so they are not scores — they are portions. That is the whole reason a new competitor makes every other share smaller, even the ones you were watching.",
        tableCaption: "Match and share of attention for the strongest few words.",
        colToken: "Word",
        colScore: "Match",
        colShare: "Share",

        step6: "What it becomes",
        step6Title: (word: string) => `“${word}” now carries a blend`,
        step6Note:
          "Attention is not only about where to look. Each word it looked at contributes its value in proportion to its share, so the word ends up carrying a mixture of what it attended to. That mixture is what the next layer of a real model would receive.",

        axes: {
          nounness: "noun-like",
          animacy: "alive",
          verbness: "verb-like",
        },
      },

      honesty:
        "This is a tiny educational self-attention model. Its seven features and three projection matrices were written by hand for this experiment — they were not learned from text. A real model learns representations nobody named, in hundreds of dimensions. What is real here is the arithmetic: the same comparison, scaling, softmax and weighted sum a Transformer performs.",

      recap: {
        lessons: [
          "Attention hands out a fixed 100% of focus across the context, so every word gets a share rather than a yes or a no.",
          "Changing one word changes the shares of the others — including words you did not touch, because they are all dividing the same 100%.",
          "Attention is one mechanism inside a much larger model. It decides where to look and what to mix in; it does not, on its own, understand the sentence.",
        ],
        footer:
          "The words here were given seven hand-written features, so the model can tell a cat from a ball but not a ball from a mirror. Real Transformers stack many heads and many layers to build far richer representations — which is a different and much longer story than the one this page tells.",
      },
    },

    // ------------------------------------------------ gradient descent ----
    "gradient-descent": {
      title: "Gradient Descent",
      description:
        "Watch how the shape of a landscape decides how big a step you are allowed to take.",

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

      find: {
        title: "Find the bottom",
        question: "How big a step can you take?",
        caption:
          "Same starting point every time, and one thing to change. Watch the shape of the route rather than the numbers.",
      },

      direction: {
        kicker: "Why that direction",
        title: "A gradient is a vector, and it is not a pointer to the answer.",
        lede: "Two arrows leave the current point: the solid one is where a step actually goes, −∇f = −(a·x, b·y); the dashed one is the straight line to the minimum, −(x, y). Each coordinate is scaled by its own curvature, so the two agree only when the curvatures do. Drag the point, then drag the curvature.",
        descent: "Where a step goes: −∇f",
        target: "Straight line to the minimum",
        equalLength: "Both arrows are drawn at the same length, so only their direction is being compared.",
        angle: "Angle between them",
        angleHint: "0° means the two agree",
        aligned: "The curvatures are equal here, so the two directions coincide exactly.",
        apart: "The curvatures differ, so the step is pulled towards the steeper axis rather than towards the minimum.",
        onAxis: "One coordinate is already zero, so there is nothing for the unequal scaling to act on. Move the point off the axis to separate the arrows.",
        dragHint: "Drag anywhere on the map to move the point, or focus the map and use",
        keyboardHint: "to move it, and this to send it back:",
        keyboardHelp:
          "Drag anywhere on the map to move the point. With the map focused, the arrow keys move it and Home returns it to the centre-right starting position.",
        legendAndKeys: "Arrows and keyboard",
        label: (x: string, y: string, kappa: string, angle: string) =>
          `Contour map with a movable point at ${x}, ${y}. Condition number ${kappa}. The descent direction is ${angle} degrees away from the straight line to the minimum.`,
        caption:
          "Slide the curvature ratio down to 1 and the two arrows fold into one. Away from the axes that is the only case where they agree — and it is a case a one-dimensional picture cannot show at all, because along a single axis a gradient is just a sign.",
      },

      rate: {
        kicker: "The step size",
        title: "The ceiling belongs to the surface.",
        lede: "Same landscape, same starting point, one number to change. The two marks under the map are computed from this landscape's curvature; they were not chosen to make the demonstration work.",
        marks: { monotone: "no overshoot", stability: "stability limit" },
        regimes: {
          monotone: "Approaching directly",
          oscillating: "Overshooting, still closing in",
          boundary: "On the boundary",
          divergent: "Diverging",
        },
        regimeNote: {
          monotone: "η is below 1/c for both curvatures: neither coordinate overshoots.",
          oscillating: "η is past 1/c on the steeper axis: it changes sign each step but still shrinks.",
          boundary: "η is exactly 2/c on the steeper axis: that coordinate neither shrinks nor grows.",
          divergent: "η is past 2/c on the steeper axis: that coordinate grows every step.",
        },
        scope:
          "These thresholds are exact for the quadratic used here, whose curvature is the same at every point. Where curvature changes as you move, the usable step size changes with it.",
        caption:
          "The stability limit is 2 ÷ the larger curvature, so it moves when the landscape does. No step size is large or small on its own: the same η that leaves this landscape entirely settles quietly on a gentler one.",
      },

      momentumSection: {
        kicker: "Momentum",
        title: "Carrying something over from the last step.",
        lede: "Momentum keeps a running velocity: v ← β·v + ∇f, then θ ← θ − η·v. Pushes that keep pointing the same way accumulate; pushes that keep reversing cancel. Raise β and watch the second mark move.",
        marks: { plain: "plain limit", momentum: "momentum limit" },
        caption:
          "The stability condition is η·max(a,b) < 2(1+β), wider than plain descent's η·max(a,b) < 2 — so momentum can carry a larger step size than plain descent can. What it charges for that range is oscillation. Hold the step size still and raise β: the run gets shorter, and then past a point it gets longer again.",
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
          "After the bias correction the first update is η·g ÷ (|g| + ε). The size of the gradient cancels, and both axes move by about η — which is why the correction has to be real rather than skipped.",
        rate: "Adam step size η",
        honesty:
          "None of that says Adam converges faster. On the κ = 60 valley above, sweeping 300 step sizes, Adam's quickest result is 17 steps, while a well-chosen momentum setting reaches the same tolerance in about 10 — and at a modest step size such as 0.10, Adam needs 66. There is still a step size to choose, and choosing it badly still costs.",
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
            `This η converges on both landscapes — here, and in ${steps} steps on the gentler one. Push it upwards and watch which of the two gives out first.`,
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
              "This begins above the stability limit and explodes on the first Run. Find a step size that works — then look at what that same number does on a gentler surface.",
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
          "The largest step size a landscape tolerates is 2 ÷ its steepest curvature — a property of the surface, not of the algorithm. Below half of it the approach is direct, between the two the path overshoots and still closes in, and above it the run leaves.",
          "The condition number κ is the steeper curvature divided by the flatter one, and it is what stops a single step size from serving both directions: the flat axis is still crawling while the steep one is already at its ceiling.",
          "Momentum widens the stable range to η·max(a,b) < 2(1+β) and can cut a long zig-zag short; Adam scales each coordinate by its own gradient history, so a millionfold gap in gradient size is not a millionfold gap in step size. Both still leave you a step size to choose.",
        ],
        footer:
          "Everything here is a convex quadratic: the curvature is the same at every point, the gradient is exact, and the answer is known before you start. Real training gives up all three. What survives is the relationship you have been moving back and forth — the shape of the surface decides what step size you are allowed to take.",
      },
    },

    // ---------------------------------------------------------- hash ----
    "hash-playground": {
      title: "Hash Playground",
      description: "Change one character. Watch everything change.",
      inputLabel: "Your message",
      inputPlaceholder: "hello world",
      copy: "Copy",
      copied: "Copied",
      copyHash: "Copy digest",
      hashCopied: "Digest copied",

      figures: {
        messageLength: "Message",
        characters: "characters in",
        digestLength: "Digest",
        hexChars: "hex characters out",
        digestBits: "Bits",
        alwaysBits: "however long the message",
        bitsChanged: "Bits changed",
        percentChanged: "Of the digest",
        expectedHalf: "about half is expected",
        charsChanged: "Hex characters changed",
        ofSixtyFour: "of 64",
      },

      hero: {
        title: "What comes out",
        question: "Can two different messages produce the same length of output?",
        digestLabel: "SHA-256 digest",
        caption:
          "Type anything at all. However long the message, exactly 64 hex characters come back — and none of the message is in them.",
        help: "Type a message. Its SHA-256 digest appears below the field and updates as you type.",
        announce: (start: string) => `Digest updated, now starting ${start}.`,
      },

      determinism: {
        kicker: "Same message, same digest",
        title: "It answers the same way every time.",
        lede: "Hash the message again. Nothing is cached and nothing is copied from the run before — each press is a fresh call to SHA-256 on the same string.",
        hashAgain: "Hash it again",
        enough: "That is enough runs",
        empty: "No runs yet. Press the button to hash this message.",
        run: (n: number) => `Run ${n}`,
        runsLabel: "Runs",
        distinctLabel: "Distinct digests",
        distinctHint: "however many runs",
        caption:
          "Editing the message clears the list, because a run of the old message says nothing about the new one.",
        announce: (runs: number, distinct: number) =>
          `${runs} runs, ${distinct} distinct digest${distinct === 1 ? "" : "s"}.`,
      },

      avalanche: {
        kicker: "One tiny change",
        title: "One keystroke rewrites everything.",
        lede: "Change a single character and compare the two digests. Every character that differs is marked in both — struck through in the one that is gone, underlined in the one that replaced it.",
        before: "Before",
        after: "After",
        fieldLabel: "Change one character",
        help: "Edit the message. The digest before your edit and the digest after it are compared character by character above.",
        editPrompt: "Change a character in the message to compare two digests.",
        caption:
          "The count is measured across the two real digests, bit by bit — not estimated, and not animated towards a number.",
        announce: (changed: number, total: number, percent: number) =>
          `${changed} of ${total} bits changed, ${percent} percent of the digest.`,
      },

      bits: {
        gridLabel: (total: number, ones: number, zeros: number, flipped: number) =>
          `The ${total} bits of the current digest as a 16 by 16 grid. ${ones} are 1, ${zeros} are 0. ${flipped} changed in the last edit.`,
        legendOne: "bit is 1",
        legendZero: "bit is 0",
        legendChanged: "changed",
      },

      challenge: {
        kicker: "The challenge",
        title: "Can you make two different messages produce the same digest?",
        lede: "Not the whole digest — start with its first character. Each round asks for one more, and each round is sixteen times less likely than the one before. That curve is the whole of hash security, and this is the only honest way to feel it: no collision is found here, and none is faked.",
        inputA: "Message A",
        inputB: "Message B",
        identical:
          "Both messages are identical, so the digests match by definition. A collision needs two different messages.",
        target: (round: number, odds: string) =>
          `Round ${round}: share the first ${round} hex character${round === 1 ? "" : "s"}. Odds per guess: 1 in ${odds}.`,
        nextRound: (round: number) => `Round ${round} — sixteen times harder`,
        keepTrying: "Keep trying",
        maxRound: "That is where people stop",
        matchedLabel: "Shared prefix",
        roundLabelFull: "Round",
        oddsHint: (odds: string) => `1 in ${odds} per guess`,
        bestLabel: "Best so far",
        attemptsLabel: "Attempts",
        ladderLabel: (matched: number, total: number, round: number) =>
          `Shared prefix: ${matched} of ${total} hex characters match. This round needs ${round}.`,
        caption:
          "Matching all 64 characters by chance is 1 in 2^256. Even the birthday shortcut needs about 2^128 hashes — hashing a trillion per second, roughly 10^19 years.",
        announce: (matched: number, total: number, best: number, round: number) =>
          `${matched} of ${total} leading characters match. Best so far ${best}. Round ${round} needs ${round}.`,
      },

      usage: {
        kicker: "In the wild",
        title: "Where digests turn up.",
        lede: "The same fixed-size fingerprint, used five different ways.",
        items: {
          git: {
            label: "Git",
            body: "Git identifies each commit by hashing its content and its parent's hash. Rewrite any line in history and every hash after it changes — tampering is visible.",
          },
          passwords: {
            label: "Passwords",
            body: "Servers store a salted hash rather than the password. At login the password is hashed again and the hashes are compared, so a leaked database holds hashes, not passwords.",
          },
          https: {
            label: "HTTPS",
            body: "TLS uses hashes to fingerprint certificates and to verify that data was not altered in transit. A single flipped byte breaks the hash.",
          },
          blockchain: {
            label: "Blockchain",
            body: "A block contains the previous block's hash, chaining them together. Change an old block and every later hash breaks, which is what makes the ledger tamper-evident.",
          },
          signatures: {
            label: "Signatures",
            body: "A digital signature is made over a document's hash rather than the document. Anyone can re-hash the document and check the signature.",
          },
        },
      },

      recap: {
        lessons: [
          "The same message always produces the same digest, and the digest is the same length whatever went in",
          "Changing one character changes about half of the 256 bits — the avalanche effect, measured here rather than asserted",
          "Each extra hex character two digests share is sixteen times less likely, which is why matching all 64 is out of reach",
        ],
        footer:
          "Nothing on this page is stored or simulated: every digest is crypto.subtle.digest(\"SHA-256\", …) on what you typed, computed in your browser.",
      },
    },

    // -------------------------------------------------------- neural ----
    "neural-playground": {
      title: "Neural Playground",
      description: "Draw two kinds of dots. Watch a network learn to tell them apart.",
      liveTraining: "Live training",

      canvasLabel: (points: number, accuracy: number) =>
        `${points} points in two classes. The network currently gets ${accuracy}% of the training points right; the shaded background is the class it predicts everywhere else.`,
      datasets: {
        gauss: { label: "Two blobs", hint: "One straight line is enough." },
        circle: { label: "Circle", hint: "Needs a curve — no line can do it." },
        xor: { label: "XOR", hint: "The classic: impossible without a hidden layer." },
        spiral: { label: "Spiral", hint: "Brutal. Bring neurons and patience." },
      },
      classA: "Class A",
      classB: "Class B",
      keyboardHint: { trainPause: "train or pause ·", restart: "restart with fresh weights" },
      layersCaption: {
        solved:
          "The flat network is stuck near a coin flip: no straight line can separate these four corners. The hidden layer bends the boundary, and the problem dissolves.",
        idle: "Run them side by side and watch where the left one gives up.",
      },
      layersPanels: {
        flat: { title: "No hidden layer", subtitle: "Two inputs wired straight to the output — a single neuron." },
        deep: { title: "One hidden layer", subtitle: "The same thing, with four neurons in between." },
      },
      descentNote: {
        overshoot:
          "Overshot. Each step jumps past the bottom and lands further up the far wall — the loss explodes.",
        deep: "Settled in the deepest valley. This is what a healthy training run looks like.",
        shallow:
          "Settled — but in the shallow basin on the right. Gradient descent only ever sees the slope under its feet, never the whole landscape.",
        rolling: "Follow the tangent line: its steepness is the only information the step gets.",
      },
      neuronLabel: (w1: string, w2: string, bias: string) =>
        `A single neuron's output across the input square, with weights ${w1} and ${w2} and bias ${bias}.`,
      solvedBadge: "Solved",
      notYet: "Not yet",
      loopCards: {
        forward: { headline: "A guess" },
        loss: { headline: "How wrong was it?" },
        backprop: { headline: "Who is to blame?" },
        descent: { headline: "Nudge everything downhill" },
      },
      playground: {
        draw: "Draw",
        data: "Data",
        noise: "Noise",
        hiddenLayers: "Hidden layers",
        neuronsPerLayer: "Neurons per layer",
        activation: "Activation",
        learningRate: "Learning rate",
        regularization: "Regularization (L2)",
        speed: "Speed",
        train: "Train",
        pause: "Pause",
        clearPoints: "Clear",
        newSample: "New sample",
        insideTitle: "The network, from the inside",
        insideBody:
          "Same network, second view. Every square is one neuron’s own answer across the whole input square — the features the layer before it built, and what the next layer has to work with.",
        canvasLabel: "Decision surface with the training data drawn on top.",
        playPause: "Space",
      },

      stats: {
        epoch: "Epoch",
        loss: "Loss",
        trainAcc: "Train acc",
        testAcc: "Test acc",
        curveLabel: "Training loss over the last few seconds, on a logarithmic scale.",
        announce: (percent: number) => `Training accuracy ${percent} percent.`,
      },

      neuron: {
        kicker: "Zoom all the way in",
        title: "A neuron is smaller than you think.",
        lede: "No memory, no logic, no cleverness. Three numbers and a squash — that is the entire unit the whole field is built from.",
        weight1: "Weight on x₁",
        weight2: "Weight on x₂",
        bias: "Bias",
        activation: "Activation",
        note: "Notice what you cannot do: however you drag these three sliders, the boundary stays a straight line. That is the whole limitation of one neuron — and the reason the next section exists.",
        canvasLabel: "The output of a single neuron across the input square.",
        activations: {
          tanh: "Squashes to −1…1. Smooth, symmetric, a safe default.",
          relu: "Passes positives through, flattens negatives. Fast and the modern default.",
          sigmoid: "Squashes to 0…1. Historic, and prone to stalling.",
        },
      },

      layers: {
        kicker: "Why layers",
        title: "Four dots that broke AI for a decade.",
        lede: "XOR: two classes arranged in opposite corners. A single neuron cannot separate them, and in 1969 that observation nearly ended the field. One hidden layer is the whole fix.",
        noHidden: "No hidden layer",
        oneHidden: "One hidden layer",
        accuracy: "Accuracy",
        trainBoth: "Train both networks",
        trainBothShort: "Train both",
        pauseBoth: "Pause both",
        startOver: "Start over",
        caption: "Run them side by side and watch where the left one gives up.",
      },

      descent: {
        kicker: "How it learns",
        title: "Downhill, one small step at a time.",
        lede: "Learning is not insight. It is a ball on a slope, moving against the gradient — and the size of its steps decides everything.",
        learningRate: "Learning rate",
        roll: "Roll",
        oneStep: "One step",
        weight: "weight",
        loss: "loss",
        slope: "slope",
        nextStep: "next step",
        steps: "steps",
        curveLabel: (w: string, l: string, s: string) =>
          `Loss curve with a ball at weight ${w}, where the loss is ${l} and the slope is ${s}.`,
      },

      loop: {
        kicker: "The loop",
        title: "Four steps, repeated until it works.",
        lede: "Everything you have watched so far is these four stages, running thousands of times a second.",
        cards: {
          forward: {
            title: "Forward pass",
            body: "Every neuron multiplies its inputs by its weights, adds a bias, and squashes the result. Repeat layer by layer and a point in becomes a prediction out.",
          },
          loss: {
            title: "Loss",
            body: "Compare the guess to the true label and square the difference. One number for the whole network — and the only thing it is ever trying to make smaller.",
          },
          backprop: {
            title: "Backpropagation",
            body: "Walk the error backwards through the layers with the chain rule. Every single weight learns how much it contributed — its gradient.",
          },
          descent: {
            title: "Gradient descent",
            body: "Move each weight a small step against its gradient. The learning rate is the size of that step. Then do it again, thousands of times.",
          },
        },
      },

      challenge: {
        kicker: "The challenge",
        title: "Beat the spiral with as few neurons as you can.",
        lede: "Anyone can solve it with sixteen. The interesting question is how far down you can go before the network stops being able to hold the shape.",
        objective: "Objective",
        objectiveBody: (accuracy: number) =>
          `Reach ${accuracy}% test accuracy on the spiral. Then do it again with fewer neurons.`,
        hiddenLayers: "Hidden layers",
        neuronsPerLayer: "Neurons per layer",
        learningRate: "Learning rate",
        train: "Train",
        pause: "Pause",
        newAttempt: "New attempt",
        yourBest: "Your best",
        none: "Nothing yet.",
        best: (neurons: number, epoch: number) =>
          `${neurons} neurons, solved at epoch ${epoch.toLocaleString("en-US")}.`,
        totalNeurons: (n: number) => `${n} neurons`,
        solvedAnnounce: (neurons: number) => `Solved with ${neurons} neurons.`,
      },

      recap: {
        lessons: [
          "A neuron is a weighted sum and a squash — on its own, only ever a straight line",
          "Hidden layers bend that line; XOR is impossible without one",
          "Every neuron learns its own feature, and the next layer combines them",
          "Loss says how wrong the network is; backprop says which weight to blame",
          "Gradient descent nudges every weight downhill — the learning rate is the step size",
          "Too small and it crawls, too large and it overshoots, and neither ever sees the whole landscape",
        ],
        footer:
          "Everything you just watched was 300 lines of plain arithmetic. The models behind today’s AI are the same four steps — with a great many more weights.",
      },
    },

    // --------------------------------------------------- pathfinding ----
    pathfinding: {
      title: "Pathfinding",
      description: "Draw obstacles and watch BFS, Dijkstra, and A* search for a path.",
      findTheWay: "Find the way",
      algorithm: "Algorithm",
      draw: "Draw",
      gridAndKeys: "Map tools and keyboard",
      map: "Map",
      tools: { wall: "Wall", mud: "Mud", erase: "Erase", start: "Start", goal: "Goal" },
      legend: {
        wall: "wall",
        frontier: "frontier",
        settled: "settled",
        path: "path",
        mud: "mud",
      },
      metrics: { explored: "Explored", path: "Path", cost: "Cost", noPath: "No path" },
      steps: (n: number) => `${n} steps`,
      gridLabel: (
        walls: number,
        mud: number,
        state: string,
      ) => `Editable grid. Walls: ${walls}. Mud cells: ${mud}. ${state}`,
      gridHelp: "Drag on the grid to draw. With it focused, arrow keys move and Space paints.",
      gridHelpFull: {
        drag: "Drag on the grid to draw or erase. Drag",
        or: "or",
        toMove: "to move them. With the grid focused, the arrow keys move a cursor,",
        toggles: "toggles a cell, and",
        drops: "drops a marker.",
      },
      gridSummary: (cols: number, rows: number, start: string, goal: string, walls: number, mud: number, algorithm: string, result: string) =>
        `Pathfinding grid, ${cols} columns by ${rows} rows. Start at ${start}. Goal at ${goal}. Walls: ${walls}. Mud cells: ${mud}. Algorithm: ${algorithm}. ${result}`,
      status: {
        solved: (explored: number, steps: number, cost: number) =>
          `Solved: ${explored} cells explored, path ${steps} steps, cost ${cost}.`,
        unreachable: (explored: number) => `No path exists. ${explored} cells explored.`,
        running: (explored: number) => `Searching. ${explored} cells explored so far.`,
        notStarted: "Not started.",
        gridReset: "Grid reset.",
        gridCleared: "Grid cleared.",
        selected: (algorithm: string) => `${algorithm} selected.`,
        loaded: (map: string) => `${map} loaded.`,
      },
      row: (row: number, col: number) => `row ${row}, column ${col}`,
      intro: {
        // Behaviour first: one question, then the grid. The old section opened
        // straight into an instruction, which told the visitor what to do
        // without telling them what to watch for.
        question: "Which square does it look at first?",
        caption:
          "Draw a few walls, then press Run. Watch where the search actually goes — including everywhere the goal isn't.",
      },
      bfs: {
        kicker: "Watch it think",
        title: "It spreads in layers, not lines.",
        lede: "Step through it. Cells with a ring are known but unvisited — the frontier. Filled cells are settled: the search already knows the fewest moves to each one and will never look again.",
        caption:
          "Taking cells first-in, first-out is the whole trick: it settles them in order of distance, so the first route to reach the goal is the shortest one. That is breadth-first search.",
      },
      cost: {
        kicker: "Distance isn't cost",
        title: "Some ground is slower.",
        lede: "Mud costs 5 to enter; open ground costs 1. Run BFS across it, then Dijkstra, and compare the two numbers under the grid.",
        caption:
          "BFS still takes the fewest moves — straight through the swamp. Dijkstra takes more steps and pays less, because it always settles the cheapest cell it knows about rather than the nearest one.",
      },
      astar: {
        kicker: "Give the search a hint",
        title: "Right answer, far less looking.",
        lede: "Dijkstra has no idea where the goal is, so it spreads evenly in every direction. A* adds an estimate of the distance left and follows it: f = g + h, where g is the cost so far and h is the guess.",
        caption:
          "Same path, same cost — look at Explored. The guess here is Manhattan distance, which can never overstate what is left on a four-way grid, and that is exactly why A* gives up nothing by trusting it.",
      },
      challenge: {
        kicker: "The challenge",
        title: "Same answer, less work.",
        lede: "Three fixed maps. Each one wants the cheapest path AND a search that settles no more cells than the budget. One of those is easy on its own; both together are the point.",
        mazeLabel: (title: string, cols: number, rows: number, cost: number, budget: number, algorithm: string) =>
          `${title}: a fixed ${cols} by ${rows} maze. Reach the goal at the optimal cost of ${cost} while settling no more than ${budget} cells. Current algorithm: ${algorithm}.`,
        bothAtOnce: "Both at once",
        beaten: (done: number, total: number) => `${done} of ${total} beaten`,
        costMustBe: "cost must be",
        exploredAtMost: "explored at most",
        maps: {
          swamp: {
            title: "The swamp",
            hint: "The quickest way across is not the cheapest.",
          },
          "open-ground": {
            title: "Open ground",
            hint: "Nothing here is expensive. The only thing to save is effort.",
          },
          "wrong-door": {
            title: "The wrong door",
            hint: "The goal is close. The way in is not.",
          },
        },
        budget: (cost: number, budget: number) =>
          `Cheapest path costs ${cost}. Settle at most ${budget} cells.`,
        verdict: {
          unreachable: "That search never reached the goal.",
          solved: (cost: number, explored: number) =>
            `Solved. Cost ${cost}, and only ${explored} cells settled.`,
          overBudget: (explored: number, budget: number) =>
            `Optimal path — but you explored ${explored} cells. Budget: ${budget}.`,
          suboptimal: (explored: number, cost: number, optimal: number) =>
            `You explored only ${explored} cells, but your path costs ${cost}. Optimal cost: ${optimal}.`,
          both: (cost: number, optimal: number, explored: number, budget: number) =>
            `Your path costs ${cost} against an optimal ${optimal}, and it explored ${explored} cells against a budget of ${budget}.`,
        },
      },
      recap: {
        lessons: [
          "A search does not head for the goal — it spreads until the goal is one of the things it has reached",
          "BFS takes cells first-in, first-out, so it settles them in order of fewest moves",
          "Fewest moves and cheapest route are different questions once the ground stops being uniform",
          "Dijkstra always settles the cheapest cell it knows about, which is why its answer is the cheapest one",
          "A* adds an estimate of what is left, and spends its effort in the direction of the goal",
          "The estimate never overstates the distance, so A* gives up nothing to get there faster",
        ],
        footer:
          "Every route your phone has ever suggested came out of a loop like this one — a frontier, a settled set, and a rule for which cell to look at next.",
      },
    },

    // ------------------------------------------------------- sorting ----
    "sorting-race": {
      title: "Sorting Race",
      description: "Draw the data and watch how much work each algorithm needs to sort it.",
      theRace: "The race",
      algorithm: "Algorithm",
      shape: "Shape",
      shapeAndKeys: "Shape and keyboard",
      puzzle: "Puzzle",
      sorterA: "Sorter A",
      sorterB: "Sorter B",
      sort: "Sort",
      algorithms: { selection: "Selection Sort", insertion: "Insertion Sort" },
      shapes: {
        almost: "Almost sorted",
        sorted: "Sorted",
        random: "Shuffled",
        reversed: "Reversed",
      },
      legend: { settled: "settled", comparing: "comparing", lifted: "lifted out" },
      metrics: {
        comparisons: "Comparisons",
        moves: "Moves",
        disorder: "Disorder",
        questionsAsked: "questions asked",
        valuesRelocated: "values relocated",
        inversions: (n: number) => `${n} inversions`,
      },
      drawHint: "Drag across the chart to reshape the data.",
      keyboardHint: "pick a bar and",
      keyboardHint2: "change its height.",
      keyboardHelp:
        "Drag across the chart to reshape it. With it focused, left and right arrows pick a bar and up and down change its height.",
      chartLabel: (
        size: number,
        algorithm: string,
        disorder: number,
        state: string,
      ) => `Bar chart of ${size} values. ${algorithm}. Disorder: ${disorder} inversions. ${state}`,
      state: {
        done: (comparisons: number, moves: number) =>
          `Sorted with ${comparisons} comparisons and ${moves} moves.`,
        running: (comparisons: number, moves: number) =>
          `Sorting: ${comparisons} comparisons, ${moves} moves so far.`,
        alreadySorted: "Already in order. Not started.",
        notStarted: "Not started.",
        cursor: (index: number, value: number) => `Cursor on bar ${index}, value ${value}.`,
        sorting: "Sorting.",
        arrayReset: "Array reset.",
        loaded: (shape: string) => `${shape} loaded.`,
        selected: (algorithm: string) => `${algorithm} selected.`,
      },
      race: {
        question: "Which one finishes first?",
        oneButton: "One button. Both start from the same data.",
        bothDone: "Same answer — and one of them asked a fraction of the questions.",
        sorted: "sorted",
        caption: "Same array, same answer. The counters are not.",
        panelLabel: (title: string, size: number, state: string) =>
          `${title}: bar chart of ${size} values. ${state}`,
      },
      watch: {
        kicker: "Watch them work",
        title: "One sweeps. The other tiptoes.",
        lede: "Step through it. Sorter A rescans the whole remainder before it moves anything; Sorter B lifts one value and walks it back only as far as it must.",
        caption:
          "Those are Selection Sort and Insertion Sort. Long unbroken runs of comparisons belong to the first; the compare-shift-compare rhythm belongs to the second.",
      },
      data: {
        kicker: "Draw the data",
        title: "The work is in the data.",
        lede: "Reshape the chart — drag across it, or pick a shape — then sort it again.",
        caption:
          "Selection Sort asks 496 questions here every time, sorted or shuffled or reversed, because it checks every remaining pair regardless. Insertion Sort's number moves with the shape you draw.",
      },
      distance: {
        kicker: "How far from home",
        title: "It isn't how many are wrong.",
        lede: "Start from the ordered shape. Drag one bar far from where it belongs, then instead nudge three bars slightly. Compare what each costs.",
        caption:
          "An inversion is a pair in the wrong order. This insertion sort shifts once for every inversion in the array it was given — so one value far from home can cost more than several small mistakes.",
      },
      challenge: {
        kicker: "The challenge",
        title: "Cheaper depends on what you count.",
        lede: "Three fixed arrays, three budgets — and the budget is not always about the same number.",
        budget: "Budget",
        atMost: (unit: string) => `${unit} at most`,
        barsChanged: "bars changed",
        beaten: (done: number, total: number) => `${done} of ${total} beaten`,
        fixedTo: (algorithm: string) => `Fixed to ${algorithm}. Reshape the data instead.`,
        goal: (budget: number, unit: string) => `Goal: at most ${budget} ${unit}.`,
        chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
          `${title}: bar chart of ${size} values. Disorder: ${disorder} inversions. ${goal} ${state}`,
        editsUsed: (used: number, max: number) => `${used} of ${max} edits used.`,
        finished: (comparisons: number, moves: number) =>
          `Finished with ${comparisons} comparisons and ${moves} moves.`,
        budgetValue: (budget: number, unit: string) => `${budget} ${unit}`,
        editsLeft: (used: number, max: number) => `${used} of ${max} edits used`,
        units: { comparisons: "comparisons", moves: "moves" },
        puzzles: {
          "which-one-cares": {
            title: "Which one cares?",
            brief: "Sort it while asking fewer questions than the budget allows.",
          },
          "fewest-writes": {
            title: "Fewest writes",
            brief: "Ask as many questions as you like — just don't move much data.",
          },
          "three-edits": {
            title: "Three edits",
            brief: "Reshape at most three bars, then get under the budget.",
          },
        },
        verdict: {
          tooManyEdits: (edits: number, max: number) =>
            `You changed ${edits} bars. You may change ${max}.`,
          overBudget: (used: number, unit: string, budget: number) =>
            `${used} ${unit}. Budget: ${budget}.`,
          passed: (used: number, unit: string, budget: number) =>
            `Solved with ${used} ${unit}, under a budget of ${budget}.`,
        },
      },
      recap: {
        lessons: [
          "Two algorithms can reach the same answer having done wildly different amounts of work",
          "Selection sort rescans the whole remainder every pass, so its cost is fixed; insertion sort walks back only as far as it must, so its cost is a property of the data",
          "An inversion is a pair out of order and this insertion sort shifts once for each — but asking fewer questions is not the same goal as writing less data",
        ],
        footer:
          "Real sorting libraries lean on exactly this: they hand nearly-ordered runs to an insertion sort, because on that shape the work has almost already been done.",
      },
    },

    // ----------------------------------------------------- tokenizer ----
    tokenizer: {
      title: "Tokenizer Lab",
      description:
        "Train a tokenizer by hand and find out why what it read decides what is cheap to say.",
      honesty:
        "A small BPE tokenizer trained for this lab on a few kilobytes of text — not the tokenizer any GPT model uses.",
      nothingToTokenize: "Nothing to tokenize yet.",
      stripSummary: (label: string, count: number, list: string) =>
        `${label}. ${count} tokens: ${list}`,

      guess: {
        sectionLabel: "Guess the cuts",
        heading: "Where do you think this gets cut?",
        lede: "A language model never sees this sentence as letters, and never quite sees it as words either. Before we say what it does see — mark the places you think it breaks the sentence apart. Then reveal.",
        stripLabel: (sentence: string) =>
          `The sentence “${sentence}”. Mark where you think it gets cut. Use left and right arrows to move, space to place or remove a cut.`,
        cellLabel: (character: string, position: number) =>
          `Cut before ${character}, position ${position}`,
        theSpace: "the space",
        hint: "Tap a letter to cut in front of it. With the strip focused,",
        hintMove: "move and",
        hintPlace: "places a cut.",
        hintSpace: "is a space.",
        reveal: "Reveal",
        preparing: "Preparing…",
        cutEveryWord: "Cut at every word",
        legendReal: "where it really cuts",
        legendImagined: "a cut you marked that is not there",
        legendMatched: "you found this one",
        resultOne: (matched: boolean) =>
          `You marked 1 cut, and it ${matched ? "is" : "is not"} one of them.`,
        resultMany: (guessed: number, matched: number) =>
          `You marked ${guessed} cuts, and ${matched} ${matched === 1 ? "of them is" : "of them are"} real.`,
        resultTail: (actual: number, tokens: number) =>
          `It made ${actual} cuts in all, leaving ${tokens} pieces.`,
        explain:
          "Not words. “gardeners” came apart into “garden” and “ers”, the full stop stands alone, and every space belongs to the word after it rather than sitting between them.",
        actualLabel: "What the sentence was actually cut into",
        announceCleared: "Cleared. Mark the cuts again.",
        announceEveryWord: "Marked a cut in front of every word.",
        describe: (guessed: number, matched: number, imagined: number, missed: number, actual: number, tokens: number) =>
          guessed === 0
            ? `You marked no cuts. The tokenizer made ${actual}, splitting the sentence into ${tokens} tokens.`
            : `You marked ${guessed} ${guessed === 1 ? "cut" : "cuts"}. ` +
              (guessed === 1
                ? `It ${matched === 1 ? "is" : "is not"} one of the real ones`
                : matched === 1
                  ? "1 of them is real"
                  : `${matched} of them are real`) +
              `. ${
                imagined === 0
                  ? "None are in the wrong place"
                  : imagined === 1
                    ? "1 is not there"
                    : `${imagined} are not there`
              }. You missed ${missed}. The tokenizer made ${actual} cuts, splitting the sentence into ${tokens} tokens.`,
      },

      train: {
        kicker: "Where the pieces come from",
        title: "Nobody chose those pieces.",
        lede: "They were counted. Here is a corpus small enough to watch: press Merge and the commonest neighbouring pair in it fuses into one piece, everywhere it occurs. Then the counting starts again.",
        corpusLabel: "The corpus it is reading",
        mergeNext: "Merge next pair",
        trainAll: "Train all",
        training: "Training…",
        untouched: (base: number, tokens: number) =>
          `Right now every piece is a single character: ${base} of them, and the corpus costs ${tokens} tokens. Merge the commonest pair and watch what happens.`,
        merged: (
          index: number,
          left: string,
          right: string,
          frequency: number,
          token: string,
          vocabulary: number,
          tokens: number,
        ) =>
          `Merge ${index}: the commonest neighbouring pair was ${left} + ${right}, seen ${frequency} times. They are now one token: ${token}. Vocabulary: ${vocabulary} pieces. The corpus costs ${tokens} tokens.`,
        exhausted: (merges: number, vocabulary: number) =>
          `Nothing left to merge — no pair occurs more than once any more, so fusing one would be memorising rather than learning. It stopped at ${merges} merges, a vocabulary of ${vocabulary} pieces.`,
        explain:
          "That is byte-pair encoding. Count every neighbouring pair, fuse the commonest one, count again. The pieces it ends up with are its vocabulary, and each fusion is a merge. Nobody told it that “·read” is a word — it is simply what the first four rounds of counting produced, one pair at a time. Note that the space came along from the very first merge: the piece it learned is “·read”, not “read”. And “·every” stays in pieces to the end, because it only ever appears once.",
        announceFinished:
          "Training finished. No pair is left that occurs more than once, so there is nothing worth merging.",
        announceFinishedAfter: (merges: number) => `Training finished after ${merges} merges.`,
        announceReset: "Corpus reset. Nothing learned yet.",
      },

      merge: {
        kicker: "How much has it learned?",
        title: "“One token” is a moving target.",
        lede: "This tokenizer read a few kilobytes of Turkish. Drag the slider to rewind its training, and edit the sentence to anything you like. The pieces are recomputed for real at every position.",
        sentenceLabel: "Your sentence",
        sentenceHint:
          "Edit it, or write your own. Turkish or English — the tokenizer will answer either way.",
        mergesLearned: "Merges learned",
        mergesValueText: (merges: number, max: number) => `${merges} of ${max} merges`,
        untrained: "Untrained",
        full: "Full",
        stripLabel: (merges: number) => `Your sentence at ${merges} merges`,
        trainingProgress: (done: number, total: number) =>
          `Training the tokenizer… ${done} of ${total} merges.`,
        ready: "The tokenizer has finished training. Drag the merges slider.",
        explain:
          "At zero merges every character is its own token, because the tokenizer knows nothing but letters. Drag right and watch “·ev · ler · imiz · den” become “·ev · lerimiz · den” and then “·evlerimiz · den”. Those pieces are Turkish suffixes, and nothing in the algorithm knows what a suffix is — they are simply the neighbours that kept turning up together.",
      },

      compare: {
        kicker: "Trained on what?",
        title: "It cheapens whatever it has read.",
        lede: "Two tokenizers, same algorithm, same amount of training, different reading. Give them both the same text and watch the bill diverge — then try to write something that closes the gap.",
        textLabel: "The text both tokenizers get",
        textHint:
          "Change it to anything. You will not find a sentence that makes either tokenizer fluent in a language it never read.",
        trainedOnEnglish: "Trained on English",
        trainedOnTurkish: "Trained on Turkish",
        englishCorpus: "a few kilobytes of English prose",
        turkishCorpus: "a few kilobytes of Turkish prose",
        tokens: "tokens",
        cheaper: "Cheaper here — this is a language it has read.",
        ratio: (ratio: string) =>
          `Same characters, same algorithm, same number of merges — and one of them costs ${ratio}× what the other does. The difference is entirely in what each one was given to read.`,
        sampleLoaded: (label: string, words: number, characters: number) =>
          `${label} sample loaded: ${words} words, ${characters} characters.`,
        samples: {
          "tr-sea": "Türkçe",
          "tr-visit": "Türkçe 2",
          "en-room": "English",
          "en-bread": "English 2",
        },
      },

      metrics: {
        tokens: "Tokens",
        characters: "Characters",
        words: "Words",
        merges: "Merges",
      },

      challenge: {
        kicker: "The challenge",
        title: "One budget. Two ways to miss it.",
        lede: "In the first puzzle the tokenizer is fixed and the sentence is yours. In the second the sentence is fixed and the tokenizer is yours. Only one of them can be solved by trying harder.",
        budgetBadge: (budget: number) => `budget ${budget} tokens`,
        rewriteLabel: "Rewrite it",
        rewriteHint:
          "Capitals, spacing, punctuation and padding are all yours to change. The listed words have to survive.",
        rewriteStrip: "Your rewrite, tokenized",
        fixedLabel: "The sentence (fixed)",
        fixedStrip: "The sentence, tokenized",
        trainedOn: "Trained on",
        english: "English",
        turkish: "Turkish",
        mergesLearned: "Merges learned",
        unknownNote: (unknown: number) =>
          `${unknown} ${unknown === 1 ? "piece is" : "pieces are"} dashed and marked ? — characters this tokenizer has never seen. It read ordinary prose, and prose is almost all lower-case.`,
        englishCeiling:
          "That is the English tokenizer fully trained — as good as it will ever get on this sentence. More training is not the missing ingredient.",
        puzzles: {
          "say-it-cheaper": {
            title: "Say it cheaper",
            brief:
              "Keep every one of the required words, and get the same sentence under the budget. You may change anything else about how it is written.",
            lesson:
              "Nothing about the meaning changed. Capitals are pieces the tokenizer never learned, and a doubled space is a token of its own.",
          },
          "feed-it-the-right-words": {
            title: "Feed it the right words",
            brief:
              "This sentence cannot be edited. Choose what the tokenizer read, and how long it trained, until the sentence fits the budget.",
            lesson:
              "Training the English tokenizer harder never got there. It is not about effort: a tokenizer can only be cheap in a language it has actually read.",
          },
        },
        verdict: {
          untouched: (tokens: number, budget: number) =>
            `As it stands this costs ${tokens} tokens. The budget is ${budget}.`,
          missingWords: (words: readonly string[]) =>
            `Still needs ${words.map((w) => `“${w}”`).join(", ")}. The whole sentence has to survive.`,
          overBudget: (tokens: number, budget: number) =>
            `${tokens} tokens — ${tokens - budget} over the budget of ${budget}.`,
          passed: (tokens: number, budget: number) =>
            `${tokens} tokens, inside the budget of ${budget}.`,
          solvedAnnounce: (message: string) => `Solved. ${message}`,
        },
      },

      recap: {
        lessons: [
          "A tokenizer does not split text into words — it splits it into pieces that happened to be common",
          "Those pieces are learned by counting: fuse the commonest neighbouring pair, then count again",
          "How many merges it has learned decides what counts as one token, and the gains arrive early",
          "A leading space belongs to the word after it, so spacing and capitals have a price",
          "The same sentence costs wildly different amounts depending on what the tokenizer was trained on",
          "Turkish suffixes become single tokens only for a tokenizer that has actually read Turkish",
        ],
        footer:
          "Real models are trained this way too, on far more text and on raw bytes rather than characters — which is why a language that is scarce in the training data stays expensive to write in, long after the model has learned to speak it.",
      },
    },
  },
};
