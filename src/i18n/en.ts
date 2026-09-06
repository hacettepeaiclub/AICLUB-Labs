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
    title: "Play with the ideas behind computer science and artificial intelligence.",
    lede: "Interactive experiments that let you touch algorithms, neural networks, and the machinery of computation — no lectures, just levers to pull.",
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
    keyboardHint: "With the chart focused,",
  },

  labs: {
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
        learningRate: "Step size η",
        learningRateValue: (value: string) => `Step size ${value}`,
        beta: "Momentum β",
        betaValue: (value: string) => `Momentum beta ${value}`,
        curvature: "Curvature ratio",
        curvatureValue: (value: string) => `Condition number ${value}`,
        optimizer: "Optimizer",
        resetPoint: "Recentre",
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
        question: "Which step size reaches the centre in the fewest steps?",
        caption:
          "Same starting point every time, and only one thing to change. Watch the shape of the route rather than the numbers: it does not head straight for the centre. It leans off to one side first, then comes back.",
      },

      direction: {
        kicker: "Why that direction",
        title: "A gradient is a vector, and it is not a pointer to the answer.",
        lede: "Two arrows leave the current point. The solid one is where a step actually goes — the negative gradient. The dashed one is the straight line to the minimum. Drag the point, then drag the curvature, and watch what happens to the angle between them.",
        descent: "Where a step goes: −∇f",
        target: "Straight line to the minimum",
        equalLength:
          "Both arrows are drawn at the same length, so the only thing being compared is their direction.",
        angle: "Angle between them",
        angleHint: "0° means the two agree",
        aligned:
          "The two curvatures are equal here, so −∇f = −(a·x, b·y) is a positive multiple of −(x, y) and the directions coincide exactly.",
        apart:
          "The directions differ. −∇f = −(a·x, b·y) scales each coordinate by that coordinate's own curvature, so on an unequal landscape the step is pulled towards the steeper axis instead of towards the minimum.",
        onAxis:
          "The point is on an axis, where one coordinate is already zero. The two directions agree here whatever the curvatures are, because there is nothing for the unequal scaling to act on. Move it off the axis to separate them.",
        dragHint: "Drag anywhere on the map to move the point, or focus the map and use",
        keyboardHint: "to move it, and this to send it back:",
        label: (x: string, y: string, kappa: string, angle: string) =>
          `Contour map with a movable point at ${x}, ${y}. Condition number ${kappa}. The descent direction is ${angle} degrees away from the straight line to the minimum.`,
        caption:
          "Slide the curvature ratio down to 1 and the two arrows fold into one. Away from the axes that is the only case where they agree — and it is a case a one-dimensional picture cannot show you at all, because along a single axis a gradient is just a sign.",
      },

      rate: {
        kicker: "The step size",
        title: "The ceiling belongs to the surface.",
        lede: "Same landscape, same starting point, one number to change. The two marks under the slider are computed from this landscape's curvature; they were not chosen to make the demonstration work.",
        marks: { monotone: "no overshoot", stability: "stability limit" },
        regimes: {
          monotone: "Approaching directly",
          oscillating: "Overshooting, still closing in",
          boundary: "On the boundary",
          divergent: "Diverging",
        },
        regimeNote: {
          monotone:
            "η is below 1/c for both curvatures, so neither coordinate passes the minimum on its way in.",
          oscillating:
            "η is past 1/c on the steeper axis. That coordinate changes sign every step but still shrinks, so the path zig-zags inward.",
          boundary:
            "η is exactly 2/c on the steeper axis. That coordinate is multiplied by −1 every step: it neither shrinks nor grows, and only the flatter axis makes progress.",
          divergent:
            "η is past 2/c on the steeper axis, so that coordinate grows every step and the run leaves the map.",
        },
        scope:
          "These thresholds are exact for the quadratic objective used here, whose curvature is the same at every point. On a surface where curvature changes as you move, the usable step size changes with it.",
        caption:
          "The stability limit is 2 ÷ the larger curvature, so it moves when the landscape does. That is why no step size is large or small on its own: the same η that leaves this landscape entirely settles quietly on a gentler one, which is what the second challenge is about.",
      },

      momentumSection: {
        kicker: "Momentum",
        title: "Carrying something over from the last step.",
        lede: "Momentum keeps a running velocity: v ← β·v + ∇f, and then θ ← θ − η·v. Pushes that keep pointing the same way accumulate; pushes that keep reversing cancel. Both panels start from the same point and advance one step at a time together, so finishing first means needing fewer steps rather than being quicker to compute.",
        marks: { plain: "plain limit", momentum: "momentum limit" },
        caption:
          "With this convention the stability condition is η·max(a,b) < 2(1+β), which is wider than plain descent's η·max(a,b) < 2 — so momentum can carry a larger step size than plain descent can. What it charges for that extra range is oscillation. Hold the step size still and raise β: the run gets shorter, and then past a point it gets longer again.",
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
          "After the bias correction the first moment is exactly g and the second is exactly g², so the first update is η·g ÷ (|g| + ε). The size of the gradient cancels, and both axes move by about η. That is what an adaptive per-parameter step means here — and it is why the correction has to be real rather than skipped.",
        rate: "Adam step size η",
        honesty:
          "None of that says Adam converges faster. On the κ = 60 valley above, sweeping 300 step sizes, Adam's quickest result is 17 steps, while a well-chosen momentum setting reaches the same tolerance in about 10 — and at a modest step size such as 0.10, Adam needs 66. There is still a step size to choose, and choosing it badly still costs. Those figures belong to this objective, this starting point and this search; they are not a ranking of optimizers.",
      },

      challenge: {
        kicker: "Three questions",
        title: "The budget is counted in steps.",
        lede: "Each one fixes a landscape, a starting point and a number of steps. Arriving slowly is not a pass, and the three of them do not have the same answer.",
        budget: (n: number) => `${n} steps`,
        goal: (budget: number, tolerance: string) =>
          `Goal: objective ≤ ${tolerance} within ${budget} steps.`,
        progress: (done: number, total: number) => `${done} of ${total} solved`,
        pressRun: "Press Run, or drag the step slider to the end, to see how this attempt did.",
        pass: "Solved.",
        notYet: "Not yet.",
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
          "The largest step size a landscape tolerates is 2 ÷ its steepest curvature. That is a property of the surface, not of the algorithm — so no step size is large or small on its own.",
          "Below half of that limit the approach is direct; between the two the path overshoots and still closes in; exactly at it the steep coordinate stops shrinking; above it the run leaves.",
          "The condition number κ is the steeper curvature divided by the flatter one, and it is what stops a single step size from serving both directions: the flat axis is still crawling while the steep one is already at its ceiling.",
          "Momentum accumulates past gradients. It widens the stable range to η·max(a,b) < 2(1+β) and can cut a long zig-zag short — and past a point, more of it makes the run longer again.",
          "Adam scales each coordinate's step by that coordinate's own gradient history, so a millionfold gap in gradient size does not become a millionfold gap in step size. There is still a step size to choose.",
        ],
        footer:
          "Everything here is a convex quadratic: the curvature is the same at every point, the gradient is exact, and the answer is known before you start. Real training gives up all three. What survives is the relationship you have been moving back and forth — the shape of the surface decides what step size you are allowed to take.",
      },
    },

    // ---------------------------------------------------------- hash ----
    "hash-playground": {
      title: "Hash Playground",
      description: "Change one character. Watch everything change.",
      inputLabel: "Type anything",
      soundOn: "Sound on",
      soundOff: "Sound off",
      turnSoundOn: "Turn sound on",
      turnSoundOff: "Turn sound off",
      inputPlaceholder: "hello world",
      emptyNote: "Even an empty string has a hash.",
      lengthNote: (chars: number) =>
        `${chars} character${chars === 1 ? "" : "s"} in — 256 bits out. Always.`,
      liveHashing: "Live hashing",
      digestBits: "64 hex · 256 bits",
      hoverPair: "Hover a pair to see inside",
      copy: "Copy",
      copied: "Copied ✓",
      hashCopied: "Hash copied",
      bitsChangedLabel: "bits changed",
      copyHash: "Copy hash to clipboard",

      avalanche: {
        kicker: "The avalanche effect",
        title: "One keystroke rewrites everything.",
        lede: "Compare the hash before and after your last edit. The input barely moved — the output exploded.",
        before: "Before",
        after: "After",
        changed: (n: number) => `${n} / 256 bits changed`,
        expected: "Expected: 50%",
        editPrompt: "Edit one character above.",
      },

      bits: {
        kicker: "Under the hood",
        title: "Your hash, bit by bit.",
        lede: "All 256 bits, as a 16×16 grid. Keep typing above and watch the wave. Hover any square to meet a single bit.",
        bitLabel: (index: number, value: number) => `Bit ${index}: ${value}`,
      },

      properties: {
        kicker: "Why it works",
        title: "Four properties, one superpower.",
        lede: "Everything you just saw comes from these four guarantees.",
        items: {
          deterministic: {
            title: "Deterministic",
            top: "Same input",
            bottom: "Same output",
            detail:
              "Hash “hello” today, tomorrow, on any machine on Earth — you get the exact same 64 characters.",
          },
          fixedLength: {
            title: "Fixed length",
            top: "One letter or one library",
            bottom: "Always 256 bits",
            detail: "The input can be any size. The output never grows, never shrinks.",
          },
          oneWay: {
            title: "One-way",
            top: "Easy to hash",
            bottom: "Impossible to reverse",
            detail:
              "Computing a hash takes microseconds. Recovering the input from a hash? There is no known way except guessing.",
          },
          avalanche: {
            title: "Avalanche",
            top: "Tiny change",
            bottom: "Huge difference",
            detail:
              "Flip one character and about half of all 256 bits flip with it — the new hash is unrecognizable.",
          },
        },
      },

      usage: {
        kicker: "In the wild",
        title: "You used hashes today. Probably a thousand times.",
        tablist: "Real-world uses of hashing",
        replay: "Replay",
        replayAnimation: "Replay animation",
        items: {
          git: {
            label: "Git",
            headline: "Every commit is a hash",
            body: "Git identifies each commit by hashing its content and its parent's hash. Rewrite any line in history and every hash after it changes — tampering is instantly visible.",
            steps: ["file.txt", "SHA-256", "commit a3f9c21", "✓ history verified"],
          },
          passwords: {
            label: "Passwords",
            headline: "Servers never store your password",
            body: "They store its (salted) hash. At login, your password is hashed again and the hashes are compared. If the database leaks, the one-way property means attackers hold hashes, not passwords.",
            steps: [
              "hunter2",
              "SHA-256 + salt",
              "database",
              "attacker steals DB",
              "✗ can't reverse it",
            ],
          },
          https: {
            label: "HTTPS",
            headline: "Hashes keep the connection honest",
            body: "TLS uses hashes to fingerprint certificates and to verify no one altered the data in transit. A single flipped byte breaks the hash — so tampering can't hide.",
            steps: ["message", "SHA-256", "signature", "✓ verified on arrival"],
          },
          blockchain: {
            label: "Blockchain",
            headline: "Each block hashes the one before",
            body: "A block contains the previous block's hash, chaining them together. Change an old block and every later hash breaks — that's what makes the ledger tamper-evident. Mining is searching for a hash below a target.",
            steps: ["block 41", "SHA-256", "block 42", "✓ change one, break all"],
          },
          signatures: {
            label: "Signatures",
            headline: "You sign the hash, not the document",
            body: "Digital signatures encrypt a document's hash with a private key. Anyone can re-hash the document and check the signature — proving who signed it and that not a single byte changed since.",
            steps: ["contract.pdf", "SHA-256", "signed with key", "✓ anyone can verify"],
          },
        },
      },

      challenge: {
        kicker: "The challenge",
        title: "Find two inputs with the same hash.",
        lede: "Go ahead — the entire security of the internet bets you can't.",
        inputA: "Input A",
        inputB: "Input B",
        rounds: "Rounds",
        identical:
          "Both inputs are identical, so the hashes match by definition. A collision needs two different inputs.",
        matching: (n: number) =>
          n === 0
            ? "No leading characters match."
            : `${n} leading ${n === 1 ? "character matches" : "characters match"}.`,
        odds: (r: number) => `1 in ${r}`,
        roundLabel: (r: number) => `R${r}`,
      },

      recap: {
        lessons: [
          "Deterministic — same input, same hash, every time",
          "One-way — easy to compute, no way back",
          "Fixed length — always 256 bits, whatever goes in",
          "Avalanche effect — one character flips half the bits",
          "Real-world applications — Git, passwords, HTTPS, blockchains, signatures",
        ],
        footer: "Scroll back up and keep typing — the avalanche never gets old.",
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
        oneButton: "One button. Both start from the same data.",
        bothDone:
          "Same array, same answer — and one of them asked a fraction of the questions.",
        caption:
          "Same array, same answer. The counters are not the same, and that difference is the whole lab.",
      },
      watch: {
        kicker: "Watch them work",
        title: "One sweeps. The other tiptoes.",
        lede: "Step through it. Sorter A scans the entire remaining array on every pass before it moves anything. Sorter B lifts one value out and walks it backwards only as far as it has to.",
        caption:
          "Those are Selection Sort and Insertion Sort. The long uninterrupted runs of comparisons belong to the first; the short compare-shift-compare rhythm belongs to the second.",
      },
      data: {
        kicker: "Draw the data",
        title: "The work is in the data.",
        lede: "Drag across the chart to reshape it, or pick a shape, then sort it again. Watch what happens to each number.",
        caption:
          "Selection Sort asks 496 questions here every single time — sorted, shuffled or reversed — because it checks every remaining pair regardless. Insertion Sort's number moves with the shape you draw.",
      },
      distance: {
        kicker: "How far from home",
        title: "It isn't how many are wrong.",
        lede: "Start from the ordered shape. Drag one bar a long way from where it belongs, then instead try nudging three bars slightly. Compare what each costs.",
        caption:
          "An inversion is a pair that is out of order. This insertion sort shifts exactly once for every inversion in the array it was given — so one value far from home can cost more than several small mistakes.",
      },
      challenge: {
        kicker: "The challenge",
        title: "Cheaper depends on what you are counting.",
        lede: "Three fixed arrays. Each one has a budget, and the budget is not always about the same number.",
        budget: "Budget",
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
          "Selection sort scans the whole remainder every pass, so it asks the same number of questions whatever you give it",
          "Insertion sort walks backwards only as far as it must, so its cost is a property of the data",
          "The shape of the input, not just its size, decides how much work there is to do",
          "An inversion is a pair that is out of order — this insertion sort shifts once for each one",
          "There is no single better algorithm: fewer questions and fewer writes are different goals",
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
