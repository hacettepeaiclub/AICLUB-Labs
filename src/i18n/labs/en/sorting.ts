/** English prose for the sorting lab. Its shape is the contract `tr/sorting.ts` must meet. */

const copy = {
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
  chartLabel: (size: number, algorithm: string, disorder: number, state: string) =>
    `Bar chart of ${size} values. ${algorithm}. Disorder: ${disorder} inversions. ${state}`,
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
    bothDone: "Same answer, and one of them asked a fraction of the questions.",
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
    lede: "Reshape the chart (drag across it, or pick a shape), then sort it again.",
    caption:
      "Selection Sort asks 496 questions here every time, sorted or shuffled or reversed, because it checks every remaining pair regardless. Insertion Sort's number moves with the shape you draw.",
  },
  distance: {
    kicker: "How far from home",
    title: "It isn't how many are wrong.",
    lede: "Start from the ordered shape. Drag one bar far from where it belongs, then instead nudge three bars slightly. Compare what each costs.",
    caption:
      "An inversion is a pair in the wrong order. This insertion sort shifts once for every inversion in the array it was given, so one value far from home can cost more than several small mistakes. Moves counts those shifts plus the one write that lands each relocated value, which is why it sits a little above Disorder.",
  },
  challenge: {
    architecture: "Architecture",
    neuronsUsed: "Neurons used",
    testAccuracy: "Test accuracy",
    target: "Target",
    objectiveLine: (accuracy: string) =>
      `Reach ${accuracy} test accuracy on the spiral: using as few hidden neurons as you can.`,
    solvedNote: "Solved. Now take a neuron away and try again.",
    noBest: "Nothing yet. Start with plenty of neurons, then take them away until it breaks.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `Best: ${neurons} hidden neurons, at ${accuracy} after ${epoch.toLocaleString("en-US")} epochs.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral challenge: ${neurons} hidden neurons, ${accuracy} test accuracy after ${epoch} epochs.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `Solved with ${neurons} hidden neurons at ${accuracy} test accuracy.`,
    kicker: "The challenge",
    title: "Cheaper depends on what you count.",
    lede: "Three fixed arrays, three budgets, and the budget is not always about the same number.",
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
        brief: "Ask as many questions as you like: just don't move much data.",
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
      "An inversion is a pair out of order and this insertion sort shifts once for each; Moves adds the write that lands each relocated value, but asking fewer questions is not the same goal as writing less data",
    ],
    footer:
      "Real sorting libraries lean on exactly this: they hand nearly-ordered runs to an insertion sort, because on that shape the work has almost already been done.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Two sorting algorithms get the same shuffled bars. One button starts both, and the counters show the difference.",
    stages: {
      race: {
        bars: "Two sorters, the same shuffled bars.",
        sort: "One button starts both.",
        counters: "Under each one: comparisons and moves. The same answer, at very different cost.",
      },
      watch: {
        bars: "One sorter at a time, slowed down.",
        step: "Step: one comparison or one move. The highlighted bars are the ones being looked at.",
        algorithm: "Switch between Sorter A and Sorter B here and step through both.",
      },
      data: {
        shape:
          "Pick a shape for the data here: shuffled, nearly sorted, reversed. You can also drag across the chart.",
        sort: "Sort it again.",
        figures:
          "Selection Sort asks the same number of questions every time; Insertion Sort's number moves with the data.",
      },
      distance: {
        bars: "Sorted bars. Drag one far from where it belongs, or nudge a few slightly.",
        sort: "Sort it and compare the cost.",
        figures:
          "It is not how many are wrong, but how far: each pair in the wrong order costs one shift.",
      },
      challenge: {
        array: "Three fixed arrays, three budgets. Pick the puzzle above.",
        algorithm: "Choose the sorter: the cheaper one depends on what is counted.",
        sort: "Sort it and see whether it stays within budget.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      two: "Selection sort and insertion sort",
      cost: "The work is in the data",
    },
    notes: {
      "sambol-selection": "Selection sort in under three minutes.",
      "sambol-insertion": "Insertion sort in under three minutes.",
      "mit-6006-sorting": "MIT's lecture on sorting, both algorithms included.",
      "tomscott-sorting": "Why counting the work matters more than the code.",
      "algs4-sorts": "Insertion sort's exchanges equal the number of inversions.",
    },
  },
};

export default copy;
