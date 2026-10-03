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
    parentOrg: "Hacettepe AI Club",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "A project by Hacettepe AI Club",
    // Who made this, and where to write. `{org}` is where the club's name
    // goes, as a link — it is a placeholder rather than two strings because
    // the two languages put it at opposite ends of the sentence.
    developedBy: "Developed by Metehan Özcan for {org}",
    feedback: "Spotted a problem or have feedback?",
    sourceLink: "Source on GitHub",
    minutes: (n: number) => `${n} min`,
    loadingLab: "Loading lab",
    openLab: "Open lab →",

    /**
     * What a visitor sees when something below the header failed to render.
     *
     * No stack trace and no error code: the underlying message is a developer's
     * sentence, and a visitor can do nothing with it. What they can do is try
     * again — a reload is the fix for the common cause, which is an old tab
     * meeting a new deployment.
     */
    errorTitle: "This part of the page did not load.",
    errorBody:
      "Something went wrong while showing it. Trying again usually fixes it, especially if this page has been open for a while.",
    errorRetry: "Try again",
    errorBackToLabs: "Back to all labs",
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
    lede: "Fifteen interactive experiments: algorithms, neural networks and the machinery of computation. No lectures, just levers to pull.",
    cta: "Start experimenting",
    labs: "Labs",
    labCount: (n: number) => `${n} instruments`,
    experiments: "Experiments",
    emptyTitle: "First experiments are brewing.",
    emptyBody: "The platform is ready: labs register themselves and appear here automatically.",
    // The hero's link down to the collection, and the one-line way back into
    // the lab a returning visitor last opened.
    browse: "Browse labs",
    continueLab: (title: string) => `Continue: ${title}`,
    // Field filter above the grid.
    filterLabel: "Filter labs by field",
    allFields: "All",
    otherLabs: "Other labs",
    showing: (shown: number, total: number, field: string) =>
      `${shown} of ${total} labs · ${field}`,
    visited: "Visited",
  },

  notFound: {
    title: "This lab doesn't exist. Yet.",
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
    // The way out of a lab, at the bottom of it. The collection is written as
    // a sequence, and until this existed the sequence stopped at the grid: a
    // lab ended with its sources and then the footer, 6,000px below the only
    // link anywhere else.
    nextLab: "Next in the collection",
    endOfCollection: "That is the whole collection.",
    endOfCollectionBody:
      "Every lab, in the order the argument runs. Go back to the grid to pick any one again.",
    backToCollection: "All labs",
  },

  /**
   * The lab finder, on ⌘K / Ctrl+K and behind the header's search button.
   *
   * It finds labs and nothing else. There is no site to search beyond eleven
   * instruments, and a box that promised more would be a box that mostly
   * returned nothing.
   */
  palette: {
    open: "Find a lab",
    label: "Find a lab",
    placeholder: "Search by name or field",
    results: (n: number) => (n === 1 ? "1 lab" : `${n} labs`),
    empty: (query: string) => `No lab matches “${query}”.`,
    current: "You are here",
    navigate: "move",
    select: "open",
    dismiss: "close",
  },
  /**
   * What each lab is called, and the one sentence under it.
   *
   * Here rather than with the lab's own prose because the grid says all of it
   * before any lab is opened — and `meta.ts` keeps the structural facts (slug,
   * category, minutes) so a lab can be listed without being loaded at all.
   */
  labMeta: {
    "word-embeddings-3d": {
      title: "The Map of Meaning, in 3D",
      term: "Word embeddings, prototype",
      description:
        "An experiment: the same 318 words projected onto three PCA axes instead of two.",
    },
    "word-embeddings": {
      title: "The Map of Meaning",
      term: "Word embeddings",
      description:
        "Guess which word a model thinks is closest to APPLE, then find out what the map of those words is hiding.",
    },
    "hypothesis-testing": {
      title: "The Price of Certainty",
      term: "Hypothesis testing",
      description:
        "Move two hypotheses apart and watch what it costs to be sure: the rejection region, the errors you accept, and the power you get back.",
    },
    "reinforcement-learning": {
      title: "Exactly What You Asked",
      term: "Reinforcement learning",
      description: "Decide what one square is worth to a robot, and watch it obey you exactly.",
    },
    attention: {
      title: "Where the Model Looks",
      term: "Attention",
      description: "Pick a word and watch which part of the sentence the model leans on.",
    },
    "gradient-descent": {
      title: "The Size of a Step",
      term: "Gradient descent",
      description:
        "Watch how the shape of a landscape decides how big a step you are allowed to take.",
    },
    backpropagation: {
      title: "Who Is to Blame?",
      term: "Backpropagation",
      description:
        "Pull a network's output and watch every weight learn its share of the blame, then run the backward pass yourself.",
    },
    convolution: {
      title: "Nine Weights",
      term: "Convolution",
      description:
        "Slide nine weights across a picture and watch them find edges, then let gradient descent find the weights for you.",
    },
    "floating-point": {
      title: "0.1 + 0.2",
      term: "Floating point",
      description:
        "Type 0.1 and see the number your computer actually keeps, then find out why 0.1 + 0.2 is not 0.3.",
    },
    "hash-tables": {
      title: "Computed Address",
      term: "Hash tables",
      description:
        "Turn a word into an address, then fill the table and watch the cost of finding anything explode.",
    },
    "cryptographic-hashing": {
      title: "Digital Fingerprint",
      term: "Cryptographic hashing",
      description: "Change one character. Watch everything change.",
    },
    "multilayer-perceptrons": {
      title: "Bending the Line",
      term: "Multilayer perceptrons",
      description: "Draw two kinds of dots. Watch a network learn to tell them apart.",
    },
    "graph-search": {
      title: "The Spreading Search",
      term: "Graph search",
      description: "Draw obstacles and watch BFS, Dijkstra, and A* search for a path.",
    },
    probability: {
      title: "Guess, Then Count",
      term: "Probability",
      description:
        "Six experiments that challenge your intuition about chance. Guess first, then find out how wrong the guess was.",
    },
    sorting: {
      title: "The Cost of Order",
      term: "Sorting algorithms",
      description: "Draw the data and watch how much work each algorithm needs to sort it.",
    },
    tokenization: {
      title: "Cheap Words",
      term: "BPE tokenization",
      description:
        "Train a tokenizer by hand and find out why what it read decides what is cheap to say.",
    },
  },
};
