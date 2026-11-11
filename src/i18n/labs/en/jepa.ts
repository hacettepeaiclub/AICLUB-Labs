const copy = {
  percent: (n: number) => `${n}%`,
  decimal: (x: number, digits: number) => x.toFixed(digits),
  kinds: {
    flat: "Flat",
    horizontal: "Horizontal stripes",
    vertical: "Vertical stripes",
    dots: "Dots",
  },
  picture: {
    title: "A picture is numbers",
    question:
      "A computer does not see stripes or dots. It sees 256 numbers. Pick a patch and read its 16.",
    pictureLabel: "A 16 by 16 picture, cut into 16 patches of 4 by 4 pixels.",
    patchLabel: (n: number) => `Patch ${n}`,
    numbersTitle: (n: number) => `Patch ${n}: its 16 numbers`,
    numbersLabel: "The patch's brightness values, from 0 for black to 1 for white.",
    kindNote: (kind: string) => `Underneath: ${kind}. The model is never told.`,
    another: "Another picture",
    caption:
      "Every picture here is two regions of one texture each, and every patch's pattern starts at its own random place. Next to a stripe there is probably more stripe, but not the same pixels.",
  },
  train: {
    kicker: "Learning with no labels",
    title: "Hide, guess, compare",
    lede: "Hide a 2×2 block. A small network turns each visible patch into a vector of four numbers; a second network guesses, from the vectors around a hidden patch, what that patch's vector will be. Nobody says what anything is: the picture is its own answer key.",
    pictureLabel: "This step's picture, with the hidden block covered.",
    mapLabel:
      "Every patch of twelve pictures as a point: its vector, laid flat. Colour is the patch's kind, which the model never sees. Rings are this picture's guesses; lines join each guess to the vector it aims for.",
    legendGuess: "Guess",
    legendGoal: "Its goal",
    lossLabel: "Loss over training",
    play: "Train",
    pause: "Pause",
    restart: "Start again",
    newStart: "Another starting point",
    newStartHint:
      "Each starting point is a different set of random first weights. Sometimes two kinds end up in the same place: their guesses still match, so the loss does not mind, but the right-kind score drops. This is called dimensional collapse, and real systems fight it too.",
    startLabel: "Starting point and what it shows",
    steps: "Steps",
    loss: "Loss",
    separation: "Kinds apart vs. offsets apart",
    kindGuess: "Guesses land on the right kind",
    times: (x: number) => `×${x.toFixed(1)}`,
    announceDone: (percent: number) =>
      `Trained. Guesses land on the right kind ${percent}% of the time.`,
    caption:
      "A real joint-embedding predictive architecture (JEPA), trained here: about five hundred learned numbers, backpropagation and Adam written out by hand. The kinds are used only to colour the map and to score it; training never reads them.",
  },
  collapse: {
    kicker: "Why a slow copy?",
    title: "A loss of zero that learned nothing",
    lede: "The vector each guess aims for comes from a copy of the encoder that is never trained: after every step it moves a little toward the encoder, and that is all. Switch it off, so the guess aims at the encoder itself, and train.",
    slowCopy: "Aim at a slow copy of the encoder",
    slowCopyHint:
      "Off: the goal comes from the encoder being trained, and gradients flow through both sides.",
    spread: "Spread of the vectors",
    announceCollapsed:
      "Collapsed: every patch has the same vector. Every guess is right, and none of it says anything about the picture.",
    caption:
      "The cheapest way to make every guess right is to give every patch the same vector. With the slow copy, the goal cannot be dragged along by the same step that moves the guess, and that keeps the map from shrinking to one point. This asymmetry is how I-JEPA and BYOL avoid collapse.",
  },
  pixels: {
    kicker: "Meaning, not pixels",
    title: "What should the guess be?",
    lede: "There is another way to fill a hole: predict its pixels. Here the two guess the same hidden patches. Pick a patch on the picture to move the hidden block.",
    pictureLabel: "A picture with a 2×2 block hidden. Pick a patch to move the block there.",
    preparing: (percent: number) => `Training the model first: ${percent}%`,
    another: "Another picture",
    real: "Hidden patch",
    pixelGuess: "Guessing its pixels",
    meaningGuess: "Guessing its kind",
    noGuess: "No visible neighbour to guess from.",
    between: "Its neighbours are of two kinds, so the guess falls between them.",
    rowLabel: (n: number) => `Hidden patch ${n}`,
    caption:
      "The pixel guess is the best straight-line prediction from the neighbours' pixels, fitted on six hundred pictures. A stripe's offset is a coin toss, so the least wrong guess is the average of every offset: grey. The JEPA leaves the offset out of its vectors, and names the kind instead.",
  },
  bridge: {
    title: "What this lab is made of",
    intro: "Every part of this model has a lab of its own.",
    open: "Open",
    items: {
      convolution: "A picture is numbers, and small windows read it patch by patch.",
      "word-embeddings": "Meaning as a place: things alike end up close on a map.",
      "multilayer-perceptrons": "The encoder and the predictor are small networks like these.",
      backpropagation: "How each weight learns its share of the error.",
      "gradient-descent": "How big a step to take, and why Adam adapts it.",
      generalization: "A low loss is not the same as having learned.",
      attention: "Real JEPAs read the whole picture with attention, not just neighbours.",
    },
  },
  recap: {
    lessons: [
      "A model can learn from pictures nobody labelled, by hiding part of each and predicting it from the rest.",
      "A JEPA predicts the hidden part's vector, not its pixels, so it can leave out what cannot be predicted and keep what can.",
      "A loss of zero can mean collapse: the slow copy is what keeps the vectors from all becoming the same.",
    ],
    footer:
      "A teaching model: synthetic textures, about five hundred learned numbers and a predictor that sees only neighbours. I-JEPA's architecture, at the size of a lesson.",
  },
  sources: {
    title: "Sources",
    ijepa:
      "I-JEPA: a context encoder, a predictor and an exponential-moving-average target encoder; the loss compares predicted and target representations of hidden blocks, not pixels.",
    byol: "BYOL: an online network predicts a slowly updated target network's representation, and that slow target is what avoids collapse to a constant.",
    lecunPath:
      "The position paper that proposes joint-embedding predictive architectures: predict in representation space and leave out details that cannot be predicted.",
  },
  tour: {
    intro: "Hide part of a picture and watch a model learn by guessing what the hidden part is.",
    stages: {
      picture: {
        grid: "A picture is 256 numbers, cut into 16 patches.",
        patch: "Pick a patch: its 16 numbers are all the model will ever get.",
        another: "Every picture is two textures, each patch at its own offset.",
      },
      train: {
        hidden: "A 2×2 block is hidden. The guesses for it are the rings on the map.",
        play: "Train. Each step hides blocks in sixteen new pictures.",
        watch: "The loss falls and patches of one kind gather into one cloud.",
      },
      collapse: {
        off: "The slow copy is off here: the guesses aim at the encoder itself.",
        play: "Train, and watch the map.",
        zero: "The loss reaches zero, the spread reaches zero, and nothing is learned.",
      },
      pixels: {
        compare: "Real patch, pixel guess, kind guess: the pixel guess is grey.",
        another: "Try another picture.",
      },
    },
  },
  study: {
    topics: { jepa: "Joint-embedding predictive architectures" },
    notes: {
      "meta-ijepa":
        "Meta's own short account of I-JEPA: predicting abstract representations of hidden regions instead of their pixels.",
      "ijepa-paper":
        "The paper itself: the context and target encoders, the predictor, the masking, and the results.",
    },
  },
};

export default copy;
