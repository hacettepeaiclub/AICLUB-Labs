const copy = {
  percent: (n: number) => `${n}%`,
  decimal: (x: number, digits: number) => x.toFixed(digits),
  interaction: {
    step: "Advance 10 steps",
    before: "Before training",
    after: "Current model",
    preview: "Inspect the same example",
    previewHint: "Pick a patch to move the block. This does not retrain the model.",
    nextPicture: "New preview picture",
    all: "All patches",
    interior: "Same-texture interiors",
    boundary: "Boundary cases",
    counts: "Correct / evaluated",
    scoreHint:
      "All hidden patches with visible neighbours in 30 held-out pictures are counted. The boundary subset includes patches with at least one differently textured neighbour.",
    noScore: "No samples",
    unavailable: "Patches without visible neighbours are not scored.",
    method: "Training method",
    joint: "Gradients through both sides",
    detached: "Stop-gradient only",
    ema: "EMA + stop-gradient",
    advanced: "Inspect the two operations",
    stop: "Stop gradients through the target",
    resetHint:
      "Changing method or initial weights restarts training. Previous results are not carried over.",
    question: "Predict: does lower loss always mean better texture separation?",
    yes: "Yes, low loss is enough",
    no: "No, vectors can become alike",
    feedbackYes: "Not by itself. Giving every patch a similar vector can also lower the loss.",
    feedbackNo: "Correct. Inspect spread and held-out accuracy as well as loss.",
    pauseHint: "Training waits while this section is offscreen or the tab is hidden.",
    begin: "Train this comparison",
    readyHint:
      "This section does not train automatically. Start it here; it prepares the model only while visible.",
    projection:
      "PCA view: four dimensions → two. Axes can differ between views; accuracy uses four-dimensional vectors.",
  },
  flow: {
    title: "Trace a prediction",
    choose: "Hidden patch",
    context: "Visible neighbours → encoder E",
    predictor: "Predictor P → predicted vector",
    target: "Hidden patch → target encoder",
    compare: "Prediction ↔ target",
    trained: "Gradients update E and P",
    copied: "Target moves 1% toward E (EMA)",
    detached: "No gradients through the target",
    joint: "Target gradients also update E",
    distance: "Squared vector distance",
    decode: "Naming with labelled references",
    decodeHint:
      "The network does not output a name. Its four-dimensional prediction is compared with five nearest labelled references. This step does not enter the training loss.",
    details: [
      "Visible neighbours pass through the same encoder; their mean vector enters the predictor.",
      "The predictor produces four numbers for the hidden patch. Bars show this model’s actual output.",
      "During training, the target branch sees the hidden patch itself. This information is not an input to the predictor.",
      "Loss compares the two vectors. This value is for one preview patch; training loss averages different examples.",
    ],
    noContext: "This patch has no visible neighbours. Select another hidden patch.",
  },
  application: {
    title: "An application: visual search",
    kicker: "What is the representation useful for?",
    lede: "Choose a texture. Cover part of the image and change its lighting or noise. Catalogue rankings update immediately from the visible patch vectors.",
    query: "Camera image",
    catalog: "Nearest catalogue examples",
    mask: "Occluder size",
    light: "Lighting",
    noise: "Image noise",
    drag: "Drag across the image to move the cover, or select a patch with the keyboard.",
    preparing: "Preparing the encoder; you can already change the image.",
    ready: "Using the learned encoder",
    before: "Initial encoder",
    after: "Learned encoder",
    encoder: "Visible patches → encoder → four numbers",
    similarity: "Cosine similarity",
    notProbability:
      "This is not a probability or confidence percentage. Values closer to 1 mean more similar vector directions.",
    training: "Training: predict the hidden patch representation.",
    inference: "Use: encode the image and compare its vector with catalogue vectors.",
    scope:
      "A small visual search example using synthetic textures, not a pretrained product-photo model. Catalogue names are not used in training; heavy occlusion or different lighting can disrupt matches.",
    visible: "Visible patches",
    match: "Nearest example",
    model: "Which encoder?",
    input: "Image",
    representation: "Representation",
    results: "Matches",
  },
  network: {
    open: "Inspect the network layers",
    choose: "Network to inspect",
    encoder: "Visible patch encoder",
    predictor: "Hidden patch predictor",
    target: "Target encoder",
    input: "Input",
    hidden: "Hidden layer · tanh",
    output: "Output",
    neuron: "Hidden neuron",
    value: "Activation",
    note: "Each box is a small network, not a single layer. Only the selected network is shown below. Lines are connections; node colour and brightness show actual activations.",
    normalization:
      "Raw network outputs are shown here. Predicted and target vectors are normalised to unit length before comparison.",
    encoderHint: "The encoder takes 16 pixels through 16 hidden neurons to produce four numbers.",
    predictorHint:
      "The predictor takes a four-number mean of neighbour vectors through 16 hidden neurons to produce four numbers.",
    targetHint:
      "The target encoder processes the hidden patch itself. It does not feed hidden pixels to the predictor.",
  },
  simulation: {
    scrub: "Scrub through learning",
    goal: "Requested step",
    trace: "Scrub along the signal path",
    steps: ["Visible input", "Prediction", "Target", "Compare"],
    detail: "Selected step",
    remaining:
      "Computing up to the selected step. Scrubbing backwards recomputes from the same initial weights.",
  },
  pixel: {
    label: "Selected pixel brightness",
    hint: "Choose a pixel in the table, then drag its brightness. The image and number change together.",
    selected: "Selected pixel",
    reset: "Reset image",
  },
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
    lede: "Hide a block. The model predicts a hidden patch’s four-number representation from its visible neighbours. Compare the same preview before and after training.",
    pictureLabel:
      "Pick a patch to move the hidden block. This preview is separate from training and scoring data.",
    mapLabel:
      "Four-dimensional target vectors projected to two dimensions with PCA. Colours are evaluation-only texture labels. Rings are predictions; line ends are targets. Two-dimensional proximity can be misleading.",
    legendGuess: "Guess",
    legendGoal: "Its goal",
    lossLabel: "Loss over training",
    play: "Train",
    pause: "Pause",
    restart: "Start again",
    newStart: "Another starting point",
    newStartHint:
      "A new start uses different random weights with the same training batches. Different textures can acquire similar representations. Low loss alone does not establish useful separation.",
    startLabel: "Starting point and what it shows",
    steps: "Steps",
    loss: "Loss",
    separation: "Kinds apart vs. offsets apart",
    kindGuess: "All evaluated patches",
    times: (x: number) => `×${x.toFixed(1)}`,
    announceDone: (percent: number) =>
      `Training complete. ${percent}% of all evaluated patches were named correctly.`,
    caption:
      "A small JEPA trained in your browser: synthetic textures, about 500 parameters and Adam. Training never reads texture labels. Displayed names come from a separate 5-nearest-neighbours comparison with labelled reference vectors; the network itself outputs a vector.",
  },
  collapse: {
    kicker: "Is low loss enough?",
    title: "A loss of zero that learned nothing",
    lede: "Start with gradients through both sides. Then try stop-gradient alone or EMA + stop-gradient. Each selection restarts with identical initial weights and batches; compare methods at the same step count.",
    slowCopy: "Slow target copy (EMA)",
    slowCopyHint:
      "EMA targets receive no gradients. With EMA off, stop-gradient can be changed independently.",
    spread: "Spread of the vectors",
    announceCollapsed:
      "Very low vector spread. Representations are nearly identical in this run; lower loss may have come at the expense of texture separation.",
    caption:
      "Gradients through both sides can make representations converge to one point in this model. Stop-gradient and EMA are separate operations. EMA alone is not a universal guarantee against collapse. Compare loss, spread and accuracy at equal step counts.",
  },
  pixels: {
    kicker: "What information are we predicting?",
    title: "What should the guess be?",
    lede: "Compare different outputs for the same hidden patches: pixel values and texture names read from JEPA vectors. This is not a general benchmark of two equivalent models.",
    pictureLabel: "A picture with a 2×2 block hidden. Pick a patch to move the block there.",
    preparing: (percent: number) => `Training the model first: ${percent}%`,
    another: "Another picture",
    real: "Hidden patch",
    pixelGuess: "Linear pixel prediction",
    meaningGuess: "Name read from vector",
    noGuess: "No visible neighbour to guess from.",
    between: "Neighbours have different textures. This boundary prediction may be ambiguous.",
    rowLabel: (n: number) => `Hidden patch ${n}`,
    caption:
      "The pixel baseline is regularised linear regression fitted on 600 pictures. Random texture offsets in this dataset can wash out stripes in an average prediction. This does not apply to every pixel-generating model. Texture names in the other column come from comparing JEPA vectors with labelled references.",
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
      attention:
        "I-JEPA relates visible patches using a Vision Transformer. This small model only uses neighbours.",
    },
  },
  recap: {
    lessons: [
      "Predicting a hidden region’s representation provides a learning signal without texture labels.",
      "JEPA predicts a vector. Naming a texture requires a separate comparison with labelled reference vectors.",
      "Low loss is not sufficient evidence of success. Check spread, overall accuracy and difficult boundary cases together.",
    ],
    footer:
      "A small teaching model, not an I-JEPA reproduction: synthetic textures, four-dimensional representations and a neighbour-only predictor. Learned features are limited to this texture world.",
  },
  sources: {
    title: "Sources",
    ijepa:
      "I-JEPA: a context encoder, a predictor and an exponential-moving-average target encoder; the loss compares predicted and target representations of hidden blocks, not pixels.",
    byol: "BYOL uses an asymmetric online/target training procedure with a slowly updated target. Its results are not a general guarantee that EMA alone prevents collapse.",
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
        hidden:
          "Pick a patch to move the hidden block. The preview does not change training batches.",
        play: "Train. Each step hides blocks in sixteen new pictures.",
        watch:
          "Inspect overall and boundary accuracy separately. The map is a two-dimensional projection of four-dimensional vectors.",
      },
      application: {
        camera:
          "Choose another texture. Catalogue rankings are computed from the image representation.",
        mask: "Drag or resize the cover. The encoder only processes visible patches.",
        match:
          "Cosine similarity is not a probability. This small example shows one use for a learned encoder.",
      },
      collapse: {
        off: "Both EMA and stop-gradient are off here. Compare the three methods at equal step counts.",
        play: "Train, and watch the map.",
        zero: "Loss and spread may both shrink. Check accuracy too: low loss is not enough.",
      },
      pixels: {
        compare:
          "Compare the real patch, a linear pixel prediction and a name read from a vector. These are different outputs.",
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
