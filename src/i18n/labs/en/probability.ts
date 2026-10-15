/** English prose for the probability lab. Its shape is the contract `tr/probability.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    statisticalInference:
      "Supports the conditional-probability rules behind the two-children experiment (conditional probability, p. 20; the problem itself appears as Exercise 1.25, p. 40), the binomial coefficients behind Pascal's row (p. 15), and the law of large numbers (weak, p. 232; strong, p. 235). The simulations here illustrate those results; they do not establish them.",
    simpson:
      "Supports the reversal the fourth experiment shows: an association that holds within every subgroup and turns around once the subgroups are pooled.",
  },

  scope:
    "Four worked problems, not a survey of probability. Each uses a stated model (a host bound by two rules, 365 equally likely birthdays, two children each independently a boy or a girl, one published clinical table), and the answers belong to those models. Where a number is simulated it is labelled as simulated: running an experiment many times illustrates a result, it does not prove one.",

  prediction: {
    yours: "You said",
    actual: "It is",
    agreed: "Your intuition agreed with the model.",
    disagreed: "Your intuition and the model disagree. That is the interesting part.",
  },

  // The two steps below every result: the reason, then the arithmetic.
  explain: {
    why: "Why does that happen?",
    maths: "Show me the numbers",
  },

  monty: {
    title: "Three doors",
    question: "Can you beat the host?",
    setup: [
      "Three doors. A car behind one of them, a goat behind each of the other two.",
      "You pick a door. It stays shut.",
      "The host knows where the car is, and opens one of the other two: always one with a goat behind it.",
      "Now you choose: keep your door, or take the one the host left alone.",
    ],
    coachLabel: "Questions people ask",
    coach: {
      notHalf: {
        q: "Two doors are left. Why isn't it 50/50?",
        a: "Because the two doors did not arrive here the same way. You chose yours while you knew nothing. The other one survived a choice made by somebody who knew exactly where the car was, and who was never going to open it.",
      },
      whySwitch: {
        q: "Why is switching better?",
        a: (stay: string, swap: string) =>
          `Your first pick is the car ${stay} of the time, and that is the only time staying wins. The other ${swap} of the time the car is behind one of the two doors you did not pick, and the host has just shown you which of those two it is not.`,
      },
      hostKnows: {
        q: "Does it matter that the host knows?",
        a: "It is the whole thing. A host opening a door at random (sometimes revealing the car by accident) would leave staying and switching equally good. The host's knowledge is what makes the opened door tell you something.",
      },
    },
    caption:
      "The host is bound by two rules: never open your door, never open the car. Those rules are what make the reveal informative: a host opening at random would leave both choices equal.",
    predictQuestion: "You have played a round. Over many rounds, which does better?",
    predict: { stay: "Stay", switch: "Switch", same: "No difference" },
    predictAnswer: (value: string) => `Switching wins ${value} of the time`,
    strategy: { stay: "Stay", switch: "Switch" },
    doorsIdle: "Three closed doors. One hides a car, two hide goats.",
    doorsLabel: (picked: number, opened: number) =>
      `Three doors. You picked door ${picked}. The host opened door ${opened} to show a goat.`,
    doorLabel: (n: number, state: string) => `Door ${n}, ${state}`,
    doorState: {
      closed: "closed",
      picked: "your pick",
      opened: "opened by the host, a goat",
      revealed: "the car",
    },
    won: "you won the car",
    lost: "you did not win the car",
    promptPick: "Pick a door.",
    promptDecide: (opened: number, other: number) =>
      `The host opened door ${opened} and it was a goat. Keep your door, or take door ${other}?`,
    resultLine: (strategy: string, result: string) =>
      `You chose to ${strategy.toLowerCase()}, ${result}.`,
    again: "Play again",
    announceOpened: (n: number) => `The host opened door ${n}. It was a goat.`,
    announceResult: (result: string) => `Round over: ${result}.`,
    runBatch: (n: number) => `Run ${n.toLocaleString("en-US")} rounds`,
    batchTitle: "Simulated rounds",
    batchIdle: (n: number) =>
      `Playing a few rounds by hand will not settle this. Run ${n.toLocaleString("en-US")} of them.`,
    batchCaption: (n: number) =>
      `Win rates for staying and for switching over ${n} simulated rounds, beside the exact probabilities.`,
    strategyHeader: "Strategy",
    simulatedHeader: (n: number) => `Simulated (${n.toLocaleString("en-US")})`,
    exactHeader: "Exact",
    wins: (wins: number, rounds: number) => `${wins}/${rounds}`,
    playedLabel: "Rounds you played",
    yourStayLabel: "Staying would have won",
    yourSwitchLabel: "Switching would have won",
    handHint: "in your rounds",

    // The host, speaking. The rule that makes the puzzle work is easier to
    // believe from the person bound by it than from a caption.
    hostPick: "Pick a door. Any of them.",
    hostReveal: (opened: number) =>
      `I know what is behind all three. Look: door ${opened} has a goat.`,
    hostDecide: (other: number) =>
      `So: keep the door you picked, or take door ${other}. Your call.`,
    hostWon: "You won the car.",
    hostLost: "A goat. Play again?",
    // After the round, in three widening steps.
    explainWhat: "Switching wins about twice as often as staying.",
    explainWhy:
      "Your first pick was one door out of three, so it was the car one time in three. That leaves two times in three for the other two doors together, and the host has just opened the one of those two that was never the car.",
    explainMaths: (stay: string, swap: string) =>
      `Staying wins exactly when your first pick was already the car: ${stay}. Switching wins in every other case: ${swap}.`,
    batchInvite: "Two doors, and it is not a coin flip. Want to see it over 1,000 games?",
  },

  birthday: {
    kicker: "A smaller room than you think",
    title: "How many people before two share a birthday?",
    setup: [
      "People walk into a room, one at a time.",
      "Everybody's birthday is one of 365 days, and every day is equally likely.",
      "The question is not whether somebody shares your birthday. It is whether any two people in the room share one.",
    ],
    addPerson: "Add a person",
    addPersonHint: "Watch what happens to the number of pairs.",
    roomFull: "The room is full.",
    coachLabel: "Questions people ask",
    coach: {
      soonWhy: {
        q: (n: number) => `How do ${n} people get to a coin flip?`,
        a: (n: number, pairs: string) =>
          `Count pairs rather than people. ${n} people make ${pairs} different pairs, and every single pair is its own chance to match. Add one more person and they bring a new pair with everybody already in the room, so the chances pile up much faster than the crowd does.`,
      },
      notMine: {
        q: "Isn't this about my birthday?",
        a: "That is the swap your intuition makes, and it is a much harder question. For somebody to match your birthday specifically you need about 253 people. For any two people to match each other you need 23.",
      },
      realBirthdays: {
        q: "Are birthdays really spread evenly?",
        a: "No: real birthdays cluster by season, and clustering makes matches more likely, not less. So the even-spread model used here gives the cautious answer; reality passes 50% slightly sooner.",
      },
    },
    caption:
      "The model: 365 equally likely birthdays, no leap years, everyone independent. Real birthdays cluster by season, which nudges the true chance slightly higher, so this is the conservative version.",
    predictQuestion: "Where do you think the chance first passes 50%?",
    predict: { count: (n: number) => `${n} people` },
    predictAnswer: (n: number, value: string) => `${n} people, at ${value}`,
    peopleLabel: "People in the room",
    peopleValue: (n: number, value: string) => `${n} people, ${value} chance of a shared birthday`,
    peopleHint: "Drag it slowly through the twenties.",
    roomLabel: (n: number) => `A room of ${n} people. No two share a birthday.`,
    roomLabelMatch: (n: number, a: number, b: number, day: string) =>
      `A room of ${n} people. Person ${a} and person ${b} both have a birthday on ${day}.`,
    foundPair: (a: number, b: number, day: string) =>
      `Person ${a} and person ${b} share a birthday: ${day}.`,
    noPair: (n: number) => `In this particular room of ${n}, everyone has a different birthday.`,
    tableCaption: (n: number) =>
      `Exact and simulated chance of a shared birthday among ${n} people.`,
    exactRow: "Exact probability",
    simulatedRow: (rooms: number) => `Simulated (${rooms.toLocaleString("en-US")} rooms)`,
    stale: (n: number) => `run again: last run was ${n} people`,
    reading: (n: number, pairs: number) =>
      `${n} people make ${pairs.toLocaleString("en-US")} different pairs, and every one of them is a chance to match.`,
    peopleFigure: "People",
    pairsFigure: "Pairs",
    pairsHint: "chances to match",
    chanceFigure: "Shared birthday",
    exactHint: "exact",
    thresholdFigure: "Passes 50% at",
    thresholdHint: "people",

    // Each person is a card with a date on it, so "two of these match" is
    // something you can see rather than a claim about the room.
    personName: (n: number) => `Person ${n}`,
    personLabel: (n: number, day: string) => `Person ${n}, born ${day}`,
    personMatchLabel: (n: number, day: string, other: number) =>
      `Person ${n}, born ${day}: the same day as person ${other}`,
    justArrived: "just arrived",
    sameDay: "same day",
    roomEmpty: "Nobody is in the room yet.",
    explainWhat: "It takes far fewer people than most people guess.",
    explainWhy:
      "You are not asking whether somebody matches you. You are asking whether any two people match each other, and every new arrival makes a new pair with everybody already in the room. The pairs pile up much faster than the people do.",
    explainMaths: (n: number, pairs: string, value: string) =>
      `With ${n} people there are ${pairs} pairs. The chance that no pair matches is 365/365 × 364/365 × … , and one minus that is ${value}.`,
    simulateLabel: "Run it instead",
    runRooms: (n: number) => `Fill ${n.toLocaleString("en-US")} rooms`,
    simulateNote: (days: number) =>
      `Each room draws one birthday per person from ${days} equally likely days, then looks for a repeat.`,
    announce: (n: number, value: string) => `${n} people. Chance of a shared birthday: ${value}.`,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },

  conditional: {
    kicker: "The clue does the work",
    title: "A family has two children. Are both boys?",
    setup: [
      "A family has two children, an older one and a younger one.",
      "Each child is a boy or a girl, and each is equally likely, so there are four equally likely families.",
      "Somebody tells you one true sentence about this family.",
      "Your question: what are the chances both children are boys?",
    ],
    coachLabel: "Questions people ask",
    coach: {
      notHalf: {
        q: "One child is a boy, so isn't the other one just 50/50?",
        a: (value: string) =>
          `That would be the answer to a different sentence: \u201cthe older one is a boy\u201d. What you were told is that at least one of the two is a boy, which does not say which one. Three of the four families fit that sentence and only one of them is two boys, so the chance is ${value}.`,
      },
      twoWays: {
        q: "Why do boy-then-girl and girl-then-boy count separately?",
        a: "Because they are different families, and they are each as likely as two boys. A family with one of each is twice as easy to end up with as a family with two boys: there are two ways to get it and only one way to get BB.",
      },
      wording: {
        q: "How can the wording change the answer?",
        a: "The wording is the evidence. \u201cAt least one is a boy\u201d rules out one family; \u201cthe older one is a boy\u201d rules out two. Fewer families left, and the two boys are a bigger share of what remains. Nothing about any family changed: only what you were told.",
      },
    },
    caption:
      "This assumes each child is independently a boy or a girl with probability 1/2, and that the clue is exactly as written. A third version (you meet one child at random and it is a boy) gives 1/2 again, and is not modelled here.",
    predictQuestion: "Two children, at least one a boy. Chance both are boys?",
    predict: { half: "1/2", third: "1/3", quarter: "1/4" },
    predictAnswer: (value: string) => `1/3, or ${value}`,
    clueLabel: "The clue",
    clueShort: { atLeastOneBoy: "At least one is a boy", firstIsBoy: "The first is a boy" },
    clue: {
      atLeastOneBoy: "At least one is a boy",
      firstIsBoy: "The first child is a boy",
    },
    clueHint: "Same family, different sentence. Watch which boxes survive.",
    outcome: { GG: "GG", GB: "GB", BG: "BG", BB: "BB" },
    possible: "still possible",
    counts: "both boys",
    ruledOut: "ruled out",
    matrixLabel: (clue: string, kept: string, value: string) =>
      `Four equally likely outcomes. Given that ${clue.toLowerCase()}, the ones still possible are ${kept}, so the chance both are boys is ${value}.`,
    fraction: (counts: string, value: string) => `${counts} of the remaining outcomes = ${value}`,
    compareCaption:
      "The two clues, the outcomes each leaves standing, and the resulting probability.",
    clueHeader: "Clue",
    leftHeader: "Still possible",
    answerHeader: "Both boys",
    explain: {
      atLeastOneBoy:
        "Ruling out GG leaves three outcomes, and only one of them is BB. The clue says nothing about which child is the boy, so GB and BG both survive, and together they outnumber BB two to one.",
      firstIsBoy:
        "Naming the first child rules out GG and GB together, leaving two outcomes. Now BB is one of two rather than one of three. Nothing about the family changed; the sentence did.",
    },
    keptFigure: "Outcomes left",
    keptHint: "out of four",
    bothFigure: "Both boys",
    bothHint: "of what is left",
    answerFigure: "Probability",

    // Words, not initials. "BG" is only shorter if you already know the
    // convention, and the whole difficulty of this problem is that birth
    // order is what "at least one" refuses to tell you.
    older: "Older",
    younger: "Younger",
    boy: "Boy",
    girl: "Girl",
    familyLabel: (older: string, younger: string) =>
      `A family whose older child is a ${older} and whose younger child is a ${younger}`,
    familiesTitle: "The four families, all equally likely",
    explainWhat: "Being told about one child changes what the other one probably is.",
    explainWhy:
      "“At least one is a boy” does not say which one. It only rules out the family with two girls, and two of the three families left have a girl in them. Say instead that the older child is a boy and you rule out two families, not one: same family, different sentence, different answer.",
    explainMaths: (kept: number, value: string) =>
      `${kept} of the four families fit the clue, and one of those ${kept} is two boys: ${value}.`,
    announce: (clue: string, kept: number, value: string) =>
      `Clue: ${clue}. ${kept} outcomes remain. Chance both are boys: ${value}.`,
  },

  simpson: {
    kicker: "Two treatments, one decision",
    title: "Which treatment would you choose?",
    setup: [
      "Two treatments for kidney stones, A and B, from a real 1986 study.",
      "Patients arrive with either small stones or large stones: large ones are the harder cases.",
      "The table shows how each treatment did in each group, and how it did across both groups together.",
      "Read it, and pick the treatment you would want.",
    ],
    // The name arrives here, after the reversal has been seen and not
    // before: it is a label for something the visitor has already noticed.
    named:
      "What you are looking at has a name: Simpson's paradox: a comparison that reverses when the groups are added together.",
    coachLabel: "Questions people ask",
    coach: {
      howBoth: {
        q: "How can A win both groups and still lose overall?",
        a: "Because the two treatments were not given to the same kind of patient. A was used mostly on the hard cases and B mostly on the easy ones. Adding the groups together mixes \u201cwhich treatment\u201d with \u201cwhich patients\u201d, and the patient mix is the stronger effect.",
      },
      whichWrong: {
        q: "Is one of the numbers wrong?",
        a: "Neither. Both are arithmetic on the same counts, and you can check every percentage against the two numbers printed beside it. They are correct answers to two different questions.",
      },
      whichBelieve: {
        q: "So which number should I believe?",
        a: "The group rows, when you are choosing a treatment for one patient, because that patient has either small stones or large ones, never an average of both. The combined row answers a different question: what happened to this particular mix of patients.",
      },
    },
    caption:
      "The per-group success rates are from Charig et al. (1986), a comparison of two kidney-stone treatments. The sliders move patients between the groups; the rates stay put. Every percentage is the counts printed next to it.",
    predictQuestion: "Can one treatment win in every group and still lose overall?",
    predict: { impossible: "No, that is impossible", possible: "Yes, it can happen" },
    predictAnswer: "Yes, and the table below is a real example",
    tableCaption: "Success rates and counts per group and treatment, with the aggregate.",
    groupHeader: "Group",
    group: { small: "Small stones", large: "Large stones" },
    treatment: { a: "Treatment A", b: "Treatment B" },
    treatmentShort: { a: "A", b: "B" },
    overall: "Both groups",
    ahead: "ahead",
    barsLabel: (
      smallA: string,
      smallB: string,
      largeA: string,
      largeB: string,
      overallA: string,
      overallB: string,
    ) =>
      `Small stones: A ${smallA}, B ${smallB}. Large stones: A ${largeA}, B ${largeB}. Both groups combined: A ${overallA}, B ${overallB}.`,
    reversedBody:
      "A is ahead in both groups and behind overall. A was given mostly to the hard cases and B mostly to the easy ones, so the aggregate is comparing two different mixes of patient rather than two treatments.",
    notReversedBody:
      "With the groups allocated like this, the aggregate agrees with the groups. The reversal needs the two treatments to be given to different mixes of patient.",
    shareLabel: (treatment: string) => `${treatment}: patients with small stones`,
    shareValue: (treatment: string, small: number, large: number) =>
      `${treatment}: ${small} small-stone patients, ${large} large-stone`,
    shareHint:
      "Each treatment keeps 350 patients and its per-group success rates. Only the mix moves.",
    restore: "Back to the published table",
    overallA: "A overall",
    overallB: "B overall",
    reversedFigure: "Reversed?",
    reversedYes: "Yes",
    reversedNo: "No",

    // The two treatments Charig et al. actually compared. Naming them is
    // not decoration: "A" and "B" give a beginner nothing to think with,
    // and the reason the allocation was lopsided is that surgeons sent the
    // harder cases to the operation.
    treatmentName: { a: "Open surgery", b: "Keyhole procedure" },
    treatmentNote: {
      a: "the bigger operation",
      b: "a small incision, no open surgery",
    },
    // The staged reveal: one group, then the other, then the total.
    stepSmallTitle: "Start with the easier cases",
    stepLargeButton: "Now show the large stones",
    stepOverallButton: "Add the two groups together",
    seenBoth: "Same winner in both groups.",
    chooseQuestion: "Both groups agree. Which treatment would you take?",
    choose: { a: "Open surgery", b: "Keyhole procedure" },
    chooseAnswer: (leader: string) =>
      `Both groups point to ${leader}. Now add the two groups together.`,
    explainWhat: "The winner in every group can lose once the groups are added up.",
    explainWhy:
      "The two treatments were not given to the same kind of patient. Open surgery took most of the large stones (the hard cases) and the keyhole procedure took most of the small ones. Adding the groups together mixes “which treatment” with “which patients”, and the patient mix is the stronger effect.",
    explainMaths:
      "Each overall rate is a weighted average of that treatment's two group rates, weighted by how many patients were in each group. Different weights, different average, even with the group rates fixed.",
    illustrative:
      "Counts from a 1986 published comparison, used here to show an effect in data. Not medical advice.",
    announce: (a: string, b: string, reversed: string) =>
      `Overall: A ${a}, B ${b}. Reversed: ${reversed}.`,
  },

  bridge:
    "Two models of one board, disagreeing about the same bins. The next experiment fixes the model first, so that what changes is only how many times it is run.",

  pascal: {
    kicker: "Pascal's balls",
    title: "Two models of the same board.",
    setup: [
      "A ball is released above a triangle of pegs and falls under gravity.",
      "Every change of direction comes from a collision, not from a coin.",
      "It is counted in whichever bin it finally comes to rest in.",
    ],
    caption:
      "The ideal model treats each row as an independent left or right step, which gives the binomial distribution. The board on screen has no steps in it: gravity, contact geometry, restitution and friction decide where a ball goes. The two are different mechanisms, and the table keeps them in separate columns.",
    predictQuestion: "Drop some balls. Where do they come to rest?",
    predict: {
      edges: "At the two edges",
      centre: "In the middle",
      even: "Evenly across the bins",
    },
    predictAnswer: (bin: number, share: string) =>
      `bin ${bin} under the ideal model, which gives it ${share}`,
    dropLabel: "Drop balls",
    dropBatch: (n: number) => (n === 1 ? "1 ball" : `${n} balls`),
    dropHint: "Every ball here is simulated by the physics engine. Nothing is added by arithmetic.",
    falling: (n: number) => `${n} still falling`,
    boardLabel: (dropped: number, rows: number) =>
      `A board of ${rows} rows of pegs. ${dropped} balls have physically fallen through it and come to rest in the bins below.`,
    boardEmptyLabel: (rows: number) => `A board of ${rows} rows of pegs, with empty bins below.`,
    tableCaption: (rows: number, dropped: number) =>
      `Each bin of a ${rows} row board: the number of routes the ideal model counts, the share it predicts, and the share actually reached by ${dropped} physically simulated balls.`,
    binColumn: "Bin",
    pathsColumn: "Routes",
    idealColumn: "Ideal model",
    physicalColumn: "Physical board",
    shapeColumn: "Shape",
    legend:
      "Upper bar: the ideal binomial model. Lower bar: the physical outcomes. Where they differ, the board is telling you something the arithmetic does not model.",
    reading: (dropped: number, rows: number) =>
      `${dropped} balls, each through ${rows} rows of pegs, every one of them simulated.`,
    readingEmpty: "The bins are empty. Drop a ball and watch gravity and the pegs decide for it.",
    explainWhat:
      "Both models put most balls near the middle, and they do not agree about how many.",
    explainWhy:
      "The ideal model asks a counting question: of all the left and right sequences a board of this size allows, how many end in each bin? On the physical board nothing takes a sequence of steps. A ball arrives at a peg with a speed and an angle, leaves with whatever the contact gives it, and loses some sideways motion to friction on the way to the next one. That loss pulls it back towards the middle, so this board concentrates more tightly than the counting argument predicts. Neither answer is the wrong one. They are answers to different questions.",
    explainMaths: (rows: number, paths: string, total: string) =>
      `In the ideal model a board of ${rows} rows allows ${total} routes, one per sequence of decisions, and the number ending in a given bin is that bin's entry in Pascal's row. The busiest bin is reached by ${paths} of them, so its share is that count over ${total}. Those entries are the binomial coefficients and the shares are the binomial distribution. The physical column is not computed from any of this: it is a tally of where the simulated balls stopped.`,
    ballsFigure: "Balls simulated",
    ballsHint: "Each one a physical trial",
    rowsFigure: "Rows",
    pathsFigure: "Routes in the ideal model",
    pathsHint: "2 raised to the number of rows",
    peakFigure: "Busiest bin",
    peakHint: (ideal: number) => `The ideal model's busiest is ${ideal}`,
    boardSettings: "The board",
    rowsLabel: "Rows of pegs",
    rowsValue: (rows: number, paths: string) => `${rows} rows, ${paths} routes in the ideal model`,
    rowsHint: "Rebuilding the board empties the bins: a different board is a different experiment.",
    emptyBoard: "Empty the bins",
    announce: (dropped: number, bin: number) =>
      `${dropped} balls simulated. Bin ${bin} holds the most.`,
    coachLabel: "Questions people ask",
    coach: {
      twoModels: {
        q: "Why are there two distributions?",
        a: "Because there are two models. One counts routes through an idealised board where each row is an independent fair step. The other is a rigid-body simulation with gravity, contact and friction in it. They describe the same picture and they are not the same thing, so they are shown in separate columns rather than averaged into one.",
      },
      whyDiffer: {
        q: "Which one is correct?",
        a: "Both, for what each is about. The binomial distribution is exactly right about the counting model. The physical column is exactly what this simulated board did. A model is an idealisation of a mechanism, and when the mechanism has more in it than the idealisation, the two part company. Noticing where they part company is the useful part.",
      },
      whyMiddle: {
        q: "Why does the middle fill up in either model?",
        a: (paths: string, total: string) =>
          `In the ideal model it is a matter of counting: of the ${total} routes the board allows, ${paths} end in the busiest bin and exactly one ends in each outer bin. On the physical board a ball would have to be deflected the same way at every row to reach an edge, and each contact takes a little of its sideways speed away, which makes that run of luck rarer still.`,
      },
    },
  },

  largeNumbers: {
    kicker: "The law of large numbers",
    title: "Repeat the decision, and the proportion settles.",
    setup: [
      "One peg, one fair decision: left or right.",
      "The decision is repeated, independently, many times.",
      "The share that went right is compared with the theoretical probability.",
    ],
    caption:
      "The law says that as independent trials accumulate the observed proportion tends towards the theoretical probability. It does not say the gap shrinks at every step, and this run does not: watch the line move away before it settles.",
    predictQuestion: "As the number of trials grows, what does the observed proportion do?",
    predict: {
      settles: "Settles near the theoretical value",
      swings: "Keeps swinging just as widely",
      exact: "Becomes exactly the theoretical value",
    },
    predictAnswer: "settling near it, without ever having to land on it exactly",
    thousands: ",",
    scaleLabel: "Number of trials",
    watchHint: "Small enough to watch each decision arrive.",
    acceleratedHint: "Too many to draw one at a time. Every trial is still counted.",
    chartLabel: (trials: string, observed: string, theoretical: string) =>
      `The observed proportion over ${trials} trials, on a logarithmic scale. It ends at ${observed} against a theoretical probability of ${theoretical}, drawn as a flat reference line.`,
    axisStart: "1 trial",
    axisEnd: (trials: string) => `${trials} trials`,
    outcomesLabel: (n: number) => `The first ${n} decisions, in order`,
    outcomeLabel: (index: number, side: string) => `Trial ${index}: ${side}`,
    right: "right",
    left: "left",
    rightMark: "R",
    leftMark: "L",
    tableCaption:
      "The same run read at each scale it has passed through: the theoretical probability, the observed proportion, and the distance between them.",
    trialsColumn: "Trials",
    theoreticalColumn: "Theoretical",
    observedColumn: "Observed",
    deviationColumn: "Deviation",
    tableNote:
      "Read the deviation column downwards. It tends to fall, and it is not required to fall at every line.",
    reading: (trials: string) =>
      `${trials} independent decisions, from one seed. The same seed gives the same run every time.`,
    explainWhat: "The proportion wanders early, then settles close to the theoretical probability.",
    explainWhy:
      "Each new trial moves the running proportion by less than the one before it, because it is one outcome among ever more of them. Early on a single result can shift the share by a tenth; after ten thousand trials it cannot shift it by more than a ten-thousandth. The wandering does not stop, it just stops being visible at this scale.",
    explainMaths:
      "The observed proportion is the number of rights divided by the number of trials, and the deviation is the distance from that proportion to the theoretical probability. Both are read from the run itself rather than from a formula, which is why the deviation column goes back up now and then.",
    theoreticalFigure: "Theoretical probability",
    theoreticalHint: "A fair decision, stated rather than measured",
    observedFigure: "Observed proportion",
    deviationFigure: "Deviation",
    deviationHint: "Distance from the theoretical value",
    trialsFigure: "Trials",
    announce: (trials: string, observed: string) =>
      `${trials} trials. The observed proportion is ${observed}.`,
    coachLabel: "Questions people ask",
    coach: {
      notEvenly: {
        q: "Shouldn't the two sides even out exactly?",
        a: "No. The share of rights approaches one half, but the difference between the counts is free to grow. A run can finish ten thousand ahead on one side and still sit very close to half in proportion, because the proportion is divided by a much larger number.",
      },
      dueForOne: {
        q: "After a run of lefts, is a right due?",
        a: "No. Each decision is independent, so the next one is as likely to go either way as the first was. What corrects a lopsided start is not a compensating run the other way, but the sheer number of later trials diluting it.",
      },
      howMany: {
        q: "How many trials are enough?",
        a: "That depends on how close you need to be and how sure you want to be of it. The law describes a tendency rather than a schedule, and gives no number after which the observed proportion is guaranteed to stay near the theoretical one.",
      },
    },
  },

  recap: {
    lessons: [
      "Intuition is not a probability calculator. In all four experiments the common first answer is the wrong one.",
      'A clue changes which outcomes are still possible, and the wording decides which ones. "At least one is a boy" and "the first is a boy" leave different sets standing.',
      "Collisions are about pairs, not people. Twenty-three people make 253 pairs, which is why a shared birthday arrives so much sooner than it feels like it should.",
      "Adding groups together can reverse the comparison inside them, whenever the groups were not filled the same way.",
    ],
    footer:
      "Each of these is a worked problem with a stated model, not a general rule about chance. The exact probabilities are computed in closed form; the simulated ones come from running the experiment against a seeded generator and are always labelled as such. Where a question is genuinely ambiguous (the two-children problem is the clearest case), the assumption is written down rather than chosen quietly.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Three doors, one car. Play a round against the host and find out whether to keep your door or switch.",
    stages: {
      monty: {
        pick: "Pick a door. The tour picked the first one.",
        choose:
          "The host opened a door with a goat behind it. Your choice: keep your door, or switch to the other closed one.",
        score: "Your rounds add up here. After a few, you can play a thousand at once.",
      },
      birthday: {
        guess: "Guess first: how many people until a shared birthday is more likely than not?",
        people: "Add people one at a time with the button, or jump with this slider.",
        room: "Every new person brings a new pair with everyone already in the room.",
        chance: "People, pairs and the exact chance. The pairs outrun the head count fast.",
      },
      conditional: {
        families:
          "Every two-child family, equally likely. The clue crosses out the ones it rules out.",
        clue: "Change the wording of the clue. The tour switched it: a different set of families is left.",
        answer: "Families kept, how many have two boys, and the answer.",
      },
      simpson: {
        table: "Two kidney-stone treatments, small stones first.",
        large: "Add the large stones. The same treatment wins in both groups.",
        choose: "Choose a treatment, then see both groups added together.",
        rates: "Better in every group, worse overall: the groups are not the same size.",
      },
      pascal: {
        board: "A board of pegs, and the binomial model's prediction beside it.",
        drop: "Drop a ball: gravity and the pegs decide where it lands. The tour dropped one.",
        many: "Drop a lot at once and the bell shape appears.",
        rows: "Change the number of rows here.",
      },
      largeNumbers: {
        chart: "The proportion of wins as rounds add up, against the theoretical value.",
        trials: "Choose how many rounds to play. The tour picked the most.",
        figures:
          "Observed against theoretical. The gap does not shrink at every step, but it settles.",
      },
    },
  },
};

export default copy;
