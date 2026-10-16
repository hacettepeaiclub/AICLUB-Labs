/** English prose for the tokenization lab. Its shape is the contract `tr/tokenization.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    subwordBpe:
      "Supports byte-pair encoding as a subword segmentation method. The vocabulary here is trained on this lab's own small corpus and is not any production model's tokenizer.",
  },
  honesty:
    "A small BPE tokenizer trained for this lab on a few kilobytes of text, not the tokenizer any GPT model uses.",
  nothingToTokenize: "Nothing to tokenize yet.",
  stripSummary: (label: string, count: number, list: string) =>
    `${label}. ${count} tokens: ${list}`,

  guess: {
    sectionLabel: "Guess the cuts",
    heading: "Where do you think this gets cut?",
    lede: "A language model never sees this sentence as letters, and never quite sees it as words either. Before we say what it does see: mark the places you think it breaks the sentence apart. Then reveal.",
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
    describe: (
      guessed: number,
      matched: number,
      imagined: number,
      missed: number,
      actual: number,
      tokens: number,
    ) =>
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
    figures: {
      yourCuts: "Your cuts",
      matched: "Matched",
      actualCuts: "Real cuts",
      tokens: "Pieces",
    },
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
      `Nothing left to merge: no pair occurs more than once any more, so fusing one would be memorising rather than learning. It stopped at ${merges} merges, a vocabulary of ${vocabulary} pieces.`,
    explain:
      "That is byte-pair encoding. Count every neighbouring pair, fuse the commonest one, count again. The pieces it ends up with are its vocabulary, and each fusion is a merge. Nobody told it that “·read” is a word: it is simply what the first four rounds of counting produced, one pair at a time. Note that the space came along from the very first merge: the piece it learned is “·read”, not “read”. And “·every” stays in pieces to the end, because it only ever appears once.",
    announceFinished:
      "Training finished. No pair is left that occurs more than once, so there is nothing worth merging.",
    announceFinishedAfter: (merges: number) => `Training finished after ${merges} merges.`,
    announceReset: "Corpus reset. Nothing learned yet.",
    mergesLabel: "Merges",
    vocabularyLabel: "Vocabulary",
    corpusTokensLabel: "Corpus pieces",
  },

  merge: {
    kicker: "How much has it learned?",
    title: "“One token” is a moving target.",
    lede: "This tokenizer read a few kilobytes of Turkish. Drag the slider to rewind its training, and edit the sentence to anything you like. The pieces are recomputed for real at every position.",
    sentenceLabel: "Your sentence",
    sentenceHint:
      "Edit it, or write your own. Turkish or English: the tokenizer will answer either way.",
    mergesLearned: "Merges learned",
    mergesValueText: (merges: number, max: number) => `${merges} of ${max} merges`,
    untrained: "Untrained",
    full: "Full",
    stripLabel: (merges: number) => `Your sentence at ${merges} merges`,
    trainingProgress: (done: number, total: number) =>
      `Training the tokenizer… ${done} of ${total} merges.`,
    ready: "The tokenizer has finished training. Drag the merges slider.",
    explain:
      "At zero merges every character is its own token, because the tokenizer knows nothing but letters. Drag right and watch “·ev · ler · imiz · den” become “·ev · lerimiz · den” and then “·evlerimiz · den”. Those pieces are Turkish suffixes, and nothing in the algorithm knows what a suffix is: they are simply the neighbours that kept turning up together.",
    jumpTo: "Jump to",
  },

  compare: {
    kicker: "Trained on what?",
    title: "It cheapens whatever it has read.",
    lede: "Two tokenizers, same algorithm, same amount of training, different reading. Give them both the same text and watch the bill diverge, then try to write something that closes the gap.",
    textLabel: "The text both tokenizers get",
    textHint:
      "Change it to anything. You will not find a sentence that makes either tokenizer fluent in a language it never read.",
    trainedOnEnglish: "Trained on English",
    trainedOnTurkish: "Trained on Turkish",
    englishCorpus: "a few kilobytes of English prose",
    turkishCorpus: "a few kilobytes of Turkish prose",
    tokens: "tokens",
    cheaper: "Cheaper here: this is a language it has read.",
    ratio: (ratio: string) =>
      `Same characters, same algorithm, same number of merges, and one of them costs ${ratio}× what the other does. The difference is entirely in what each one was given to read.`,
    sampleLoaded: (label: string, words: number, characters: number) =>
      `${label} sample loaded: ${words} words, ${characters} characters.`,
    samples: {
      "tr-sea": "Türkçe",
      "tr-visit": "Türkçe 2",
      "en-room": "English",
      "en-bread": "English 2",
    },
    sampleLabel: "Text",
  },

  metrics: {
    tokens: "Tokens",
    characters: "Characters",
    words: "Words",
    merges: "Merges",
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
      `${unknown} ${unknown === 1 ? "piece is" : "pieces are"} dashed and marked ?: characters this tokenizer has never seen. It read ordinary prose, and prose is almost all lower-case.`,
    englishCeiling:
      "That is the English tokenizer fully trained: as good as it will ever get on this sentence. More training is not the missing ingredient.",
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
        `${tokens} tokens: ${tokens - budget} over the budget of ${budget}.`,
      passed: (tokens: number, budget: number) =>
        `${tokens} tokens, inside the budget of ${budget}.`,
      solvedAnnounce: (message: string) => `Solved. ${message}`,
    },
    puzzleLabel: "Puzzle",
    tokensLabel: "Tokens",
    budgetLabel: "Budget",
  },

  recap: {
    lessons: [
      "A tokenizer does not split text into words: it splits it into pieces that happened to be common",
      "Those pieces are learned by counting: fuse the commonest neighbouring pair, then count again",
      "How many merges it has learned decides what counts as one token, and the gains arrive early",
      "A leading space belongs to the word after it, so spacing and capitals have a price",
      "The same sentence costs wildly different amounts depending on what the tokenizer was trained on",
      "Turkish suffixes become single tokens only for a tokenizer that has actually read Turkish",
    ],
    footer:
      "Real models are trained this way too, on far more text and on raw bytes rather than characters, which is why a language that is scarce in the training data stays expensive to write in, long after the model has learned to speak it.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "A language model reads text in pieces. Guess where it cuts a sentence, then reveal where it really does.",
    stages: {
      guess: {
        strip: "This sentence is what the model reads. Mark where you think it gets cut.",
        cut: "Tap a letter to put a cut in front of it. The tour put one.",
        reveal: "Mark the rest of your guesses, then “Reveal” shows the real cuts.",
      },
      train: {
        corpus: "A corpus small enough to read. Right now every piece is a single character.",
        merge: "Merge: the commonest neighbouring pair fuses into one piece, everywhere it occurs.",
        figures: "Merges so far, the size of the vocabulary, and what the corpus costs in tokens.",
        all: "Or train it all the way at once.",
      },
      merge: {
        sentence: "Edit the sentence to anything you like. The tour added a word.",
        rewind:
          "This slider rewinds the training. With few merges learned, the same sentence costs many more tokens.",
        cost: "Pieces and cost at this point of the training.",
      },
      compare: {
        text: "Two tokenizers, one trained on English, one on Turkish. Give them the same text: the tour added a word.",
        samples: "Or pick a sample here.",
        bill: "What the same text costs each of them. Each is cheap at what it has read.",
      },
      challenge: {
        puzzle: "Two puzzles, one budget. Pick the puzzle above.",
        verdict: "The verdict updates as you work: tokens used against the budget.",
        figures: "Tokens and budget. Only one of the two puzzles can be solved by trying harder.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      bpe: "Pieces learned by counting",
      quirks: "What a token is, and what it costs",
    },
    notes: {
      "karpathy-tokenizer": "A BPE tokenizer built from scratch, merges and all.",
      "hf-bpe": "The BPE training loop with a worked example.",
      "cp-glitch": "Odd tokens a tokenizer learned, and what they do to a model.",
      "petrov-unfair": "The same text costs very different amounts across languages.",
    },
  },
};

export default copy;
