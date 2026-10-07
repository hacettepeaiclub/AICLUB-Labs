/** English prose for the word-embeddings lab. Its shape is the contract `tr/word-embeddings.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    gloveVectors:
      "Supports the vectors this lab actually ships: it reads pretrained GloVe embeddings rather than implementing an embedding method of its own.",
  },

  predict: {
    question: (word: string) => `Which word is closest to ${word}?`,
    hint: "All three are related. Pick the one you would expect.",
    loading: "Loading word vectors…",
    chose: (word: string, rank: number, total: number, score: string) =>
      `You picked ${word}: the ${rank}th closest of ${total}, at ${score}.`,
    nearest: (word: string, score: string) => `The closest is ${word}, at ${score}.`,
    because:
      "These vectors were learned from how words are used, not from what they mean. In news and encyclopedia text, apple keeps company with software far more often than with fruit.",
  },

  explore: {
    title: "Explore the universe",
    neighboursTitle: "Nearest words",
    announce: (word: string, gloss: string) => `Selected ${word}, ${gloss}.`,
    selectedLabel: "Selected",
    nearestLabel: "Nearest, cosine",
  },

  map: {
    mapLabel: "Word map. Arrow keys move through the nearest words, Enter selects.",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. Number ${rank} nearest, similarity ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Selected`,
    pending: "Working out where the words sit…",
    linksNote:
      "The lines join the selected word to the eight listed beside it. They are a reading aid, not part of the model: the embedding has no links, only distances.",
    pinnedLabel: (word: string, gloss: string) => `${word} (${gloss}), held for comparison`,
    compareLabel: (a: string, b: string, score: string) =>
      `${a} and ${b} have a similarity of ${score}.`,
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
      `${a} and ${b} are the ${rank} closest pair out of ${total}, at ${score}. The projection put them ${percent} of the map apart: looking at the picture, you would never guess they were related.`,
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
      `These two axes explain ${percent} of the variance in this dataset. The rest of the variation has not gone anywhere: it lies along the other ${remaining} directions, which a flat screen has no room for.`,
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
      "The embedding space is English. Turkish words shown here are labels we added for reading: they were not embedded, and this is not a Turkish embedding space.",
  },
  compare: {
    title: "Compare two words",
    hold: "Hold this word",
    holding: (word: string) => `Holding ${word}`,
    release: "Let it go",
    idle: "Hold a word, then pick another one on the map. The cosine between them is measured, not looked up.",
    samePoint: "That is the word you are holding. Pick a different one.",
    scoreLabel: "Similarity",
    rankLabel: "Rank",
    rankValue: (rank: number, total: number) => `${rank} of ${total}`,
    sentence: (a: string, b: string, score: string, rank: number, total: number) =>
      `The cosine between ${a} and ${b} is ${score}. Out of ${total} other words, ${b} is the ${rank}th closest to ${a}.`,
  },
};

export default copy;
