/** English prose for the attention lab. Its shape is the contract `tr/attention.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    transformer:
      "Supports the scaled dot-product attention this lab computes. The lab builds a single head by hand and does not implement the full architecture the paper introduces.",
  },

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
    "Swap the fifth word and watch what happens to the word you have selected, even though you did not touch it.",
  dogNote:
    "Two animals now, and the model split its attention almost evenly between them. It moved, but it still cannot tell which one was tired.",

  reveal: {
    kicker: "How did it decide?",
    title: "One number, from beginning to end.",
    lede: "This follows whatever word is selected above. Change the selection, or change the swapped word, and every step here changes with it, because it is the same calculation, not a second copy of it.",
  },

  trace: {
    step1: "The word you picked",
    step1Title: (word: string) => `Start with “${word}”`,
    step1Note:
      "Everything below is this one word comparing itself with each of the others, in order.",

    step2: "What it is looking for",
    step2Title: (word: string) => `“${word}” asks for this: its query`,
    step2Note:
      "A bar to the right is a property the word wants; a bar to the left is one it is actively not looking for. These are the model's own words for what it wants, made readable: a real model's are not readable at all.",

    step3: "What the other word offers",
    step3Title: (word: string) => `“${word}” offers this: its key`,
    step3Note:
      "Query and key come from two different projections on purpose: what a word offers is not the same as what it wants. That is why attention is more than measuring similarity.",

    step4: "The match",
    step4Title: (score: string) => `They line up to ${score}`,
    step4Note: (from: string, to: string) =>
      `Multiply what “${from}” wants by what “${to}” offers, add it up, and divide by the square root of the number of axes. That last step keeps the numbers in a workable range as the model gets wider.`,

    step5: "Share of 100%",
    step5Title: (share: number) => `Which becomes ${share}% of the attention`,
    step5Note:
      "The shares always add up to 100%, so they are not scores: they are portions. That is the whole reason a new competitor makes every other share smaller, even the ones you were watching.",
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
    "This is a tiny educational self-attention model. Its seven features and three projection matrices were written by hand for this experiment: they were not learned from text. A real model learns representations nobody named, in hundreds of dimensions. What is real here is the arithmetic: the same comparison, scaling, softmax and weighted sum a Transformer performs.",

  recap: {
    lessons: [
      "Attention hands out a fixed 100% of focus across the context, so every word gets a share rather than a yes or a no.",
      "Changing one word changes the shares of the others, including words you did not touch, because they are all dividing the same 100%.",
      "Attention is one mechanism inside a much larger model. It decides where to look and what to mix in; it does not, on its own, understand the sentence.",
    ],
    footer:
      "The words here were given seven hand-written features, so the model can tell a cat from a ball but not a ball from a mirror. Real Transformers stack many heads and many layers to build far richer representations, which is a different and much longer story than the one this page tells.",
  },
  pickLabel: "Word",
  wholeRowLabel: "Every share, in sentence order",
  mixLabel: "What each one hands over",

  figures: {
    selected: "Selected",
    biggestShare: "Biggest share",
    sharesTotal: "Shares add up to",
    matchedWith: "Leans on",
    rawMatch: "Match",
    score: "After dividing",
    axes: "Axes",
    divisor: "Divided by",
    peakWith: "Biggest share",
    peakWithout: "Without dividing",
    aboveTen: "Words above a tenth",
  },

  scale: {
    kicker: "Why divide at all?",
    title: "Take the divisor away and the shares collapse.",
    lede: "Dividing by the square root of the number of axes is the one step whose effect you cannot see in the answer: the result looks reasonable either way until you compare it with the alternative. So here is the same row twice: once as this model computes it, and once with the division skipped.",
    collapse:
      "Skipping it leaves the scores larger, and a softmax over larger numbers is sharper: almost the whole budget goes to one word and the rest round away to nothing. The division is what leaves a distribution there to read at all.",
    note: "Both columns are computed here by the same softmax, on the same scores. Only the divided one is used anywhere else on this page.",
    tableCaption:
      "For the strongest few words: the match, the match after dividing, and the share each one ends up with in both cases.",
    colRaw: "Match",
    colScaled: "Divided",
    colWithout: "Share without",
    colWith: "Share with",
  },

  softmax: {
    kicker: "From matches to portions",
    title: "Ten scores, one budget.",
    lede: "Softmax turns the row of matches into a row of shares that adds up to 100%. Nothing is discarded and nothing is chosen: every word gets a portion, and the portions can only come out of each other.",
  },

  mix: {
    kicker: "What the shares are spent on",
    title: "The shares are coefficients, not a verdict.",
    lede: "Each word that was attended to hands over its value vector in proportion to its share. Add those up and you have what the selected word becomes, which is what the next layer of a real model would receive.",
    tableCaption: "Share and value vector for the three heaviest contributors.",
    outputLabel: "The blended output, axis by axis",
  },
};

export default copy;
