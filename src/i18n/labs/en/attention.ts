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
    divisor: "Divided by",
    peakWith: "Biggest share",
  },

  scale: {
    kicker: "Why divide at all?",
    title: "Take the divisor away and the shares collapse.",
    lede: "Dividing by the square root of the number of axes is the one step whose effect you cannot see in the answer: the result looks reasonable either way until you change it. So the divisor is yours: turn it down to no division at all, or past what the model uses, and watch the same matches share out the budget differently.",
    collapse:
      "Skipping it leaves the scores larger, and a softmax over larger numbers is sharper: almost the whole budget goes to one word and the rest round away to nothing. The division is what leaves a distribution there to read at all.",
    note: "Every bar is recomputed here by the same softmax, on the same matches; the tick on each bar is the share the model actually uses. Only that one is used anywhere else on this page.",
    legend: "Bars: the share at your divisor. Tick: the model's own share, at ÷√d.",
    divisorLabel: "Divide the matches by",
    divisorValue: (value: string) => `÷${value}`,
    noneMark: "÷1, no division",
    modelMark: (root: string) => `÷${root}, the model`,
    atModel: "This is the model's own divisor, √d: the row every other section draws.",
    sharper:
      "Less division leaves the matches further apart, and the softmax sharpens: the leader takes more of the budget and everyone else less.",
    flatter:
      "More division squeezes the matches together, and the shares flatten towards an even split: the leader stops standing out.",
    peakNowHint: "at your divisor",
    peakModelLabel: "The model's",
    peakModelHint: "biggest share at ÷√d",
    announce: (divisor: string, peak: string) =>
      `Divided by ${divisor}, the biggest share is ${peak}.`,
    tableCaption:
      "For the strongest few words: the match, the share the model gives it, and its share at the divisor you chose.",
    colRaw: "Match",
    colWith: "Model's share",
    colNow: "Share at your divisor",
  },

  softmax: {
    kicker: "From matches to portions",
    title: "Ten scores, one budget.",
    lede: "Softmax turns the row of matches into a row of shares that adds up to 100%. Nothing is discarded and nothing is chosen: every word gets a portion, and the portions can only come out of each other. The matches are yours now: drag any of them.",
    caption:
      "Every share is recomputed from the whole row on every move, by the same softmax the model uses. The scores you drag are what-ifs; the model's own stay marked.",
    dragHint:
      "Drag any word's match. Push one up and watch every other share fall, including the ones you never touched.",
    reset: "Back to the model's matches",
    legend: "Ticks mark the model's own match and share.",
    pickAnother: "Ask about another word",
    scoreHandle: (word: string) => `Match for “${word}”`,
    scoreValue: (value: string) => `match ${value}`,
    touchedLabel: "Matches changed",
    touchedHint: "by your hand",
    announce: (word: string, share: string) => `The biggest share is now “${word}”, at ${share}.`,
  },

  mix: {
    kicker: "What the shares are spent on",
    title: "The shares are coefficients, not a verdict.",
    lede: "Each word that was attended to hands over its value vector in proportion to its share. Add those up and you have what the selected word becomes, which is what the next layer of a real model would receive.",
    tableCaption: "Share and value vector for the three heaviest contributors.",
    outputLabel: "The blended output, axis by axis",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Every word in a sentence weighs up every other word. Start by picking a word: the page shows where its attention goes, and you can change the sentence under it.",
    stages: {
      sentence: {
        sentence:
          "This is the sentence. One word is selected, and every other word shows the share of its attention it gets.",
        pick: "Pick another word and the shares are worked out again, for that word.",
        swap: "Now change one word of the sentence. The word you picked shifts its attention too, though you did not touch it.",
      },
      compare: {
        bars: "Left, what the selected word is looking for: its query. Right, what the word it matches best offers: its key.",
        pick: "Pick another word here: both sides are worked out again for it.",
        match:
          "Multiply the two bar by bar and add up: that is the raw match. Divided, it becomes the score.",
      },
      scale: {
        shares: "The same matches, turned into shares with the divisor below.",
        divisor:
          "The tour took the divisor away. Without it, the biggest match takes almost everything.",
        model: "This puts back the divisor the model uses: the square root of the number of axes.",
      },
      softmax: {
        rows: "Each row is one word's match score and its share. The shares always add up to 100%.",
        drag: "Drag a score, or focus it and use the arrow keys. The tour raised the first one; every other share fell.",
        reset: "This puts the model's own scores back.",
      },
      mix: {
        table:
          "Each word hands over its value vector in proportion to its share; the bars below are the sum.",
        pick: "Pick another word and the blend is made again from its shares.",
        out: "What the selected word becomes, axis by axis: this is what the next layer receives.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      qkv: "Query, key and the match score",
      softmax: "Softmax: one budget of 100%",
      transformer: "Where attention sits in a model",
    },
    notes: {
      "3b1b-attention":
        "The whole mechanism drawn step by step: what a word asks for, what the others offer, and how they are compared.",
      "sq-attention": "The same idea with small numbers you can follow by hand.",
      "d2l-attention": "The scaled dot product and its divisor, written out.",
      "sq-softmax": "Why softmax turns any scores into shares that add up to 1.",
      "3b1b-transformers":
        "The transformer around it: what comes before attention and what follows.",
      "karpathy-gpt": "A small GPT written from scratch, attention head included.",
      "alammar-transformer": "The architecture in annotated diagrams.",
    },
  },
};

export default copy;
