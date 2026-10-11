/** English prose for the multilayer-perceptrons lab. Its shape is the contract `tr/multilayer-perceptrons.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    backpropagation:
      "Supports backpropagation, the method this lab trains with. The network here is a small teaching model rather than the one the paper describes.",
  },
  question: "What does one layer actually change?",
  diagram: {
    diagramLabel: (shape: string) =>
      `Network diagram: ${shape} neurons. Each node shows what that neuron responds to across the input square.`,
    neuron: (label: string) => `Neuron ${label}`,
    layers: {
      input: "Input",
      output: "Output",
      hidden: (layer: number) => `Hidden ${layer}`,
      hiddenShort: (layer: number) => `H${layer}`,
    },
    inputNode: "input",
    bias: "bias",
    eachSquare: "Each square is one neuron's own picture of the input.",
    pushesUp: "pushes up",
    pushesDown: "pushes down",
    thickness: "thickness is strength",
    editHint:
      "Build the network here: − and + under each hidden layer. Any change starts training over.",
    addLayer: "+ Add a layer",
    addNeuron: (layer: string) => `Add a neuron to ${layer}`,
    removeNeuron: (layer: string) => `Remove a neuron from ${layer}`,
    removeLayer: (layer: string) => `Remove ${layer}`,
  },
  liveTraining: "Live training",

  canvasLabel: (points: number, accuracy: number) =>
    `${points} points in two classes. The network currently gets ${accuracy}% of the training points right; the shaded background is the class it predicts everywhere else.`,
  datasets: {
    gauss: { label: "Two blobs", hint: "One straight line is enough." },
    circle: { label: "Circle", hint: "Needs a curve: no line can do it." },
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
    flat: {
      title: "No hidden layer",
      subtitle: "Two inputs wired straight to the output, a single neuron.",
    },
    deep: {
      title: "One hidden layer",
      subtitle: "The same thing, with four neurons in between.",
    },
  },
  descentNote: {
    overshoot:
      "Overshot. Each step jumps past the bottom and lands further up the far wall, the loss explodes.",
    deep: "Settled in the deepest valley. This is what a healthy training run looks like.",
    shallow:
      "Settled, but in the shallow basin on the right. Gradient descent only ever sees the slope under its feet, never the whole landscape.",
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
    currentlyWrong: "Currently wrong",
    dataAndArchitecture: "Data and learning",
    drawHint: "Click or drag on the canvas to add points.",
    caption:
      "Left: what the network predicts everywhere. Right: the same network from the inside, one square per neuron.",
    draw: "Draw",
    data: "Data",
    noise: "Noise",
    activation: "Activation",
    learningRate: "Learning rate",
    train: "Train",
    pause: "Pause",
    clearPoints: "Clear",
    newSample: "New sample",
    insideTitle: "The network, from the inside",
    insideBody:
      "Same network, second view. Every square is one neuron’s own answer across the whole input square: the features the layer before it built, and what the next layer has to work with.",
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
    dragHint:
      "Drag across the square to move the line; drag the blue tip to turn it and sharpen its edge.",
    slideHandle: "The line's position. Arrow keys slide it along its arrow.",
    turnHandle:
      "The arrow's tip: the two weights. Left and right turn it, up and down sharpen or soften it.",
    weightsAndBias: "Weights and bias",
    caption:
      "Notice what you cannot do: however you move it, the boundary stays a straight line. That is the whole limitation of one neuron, and the reason the next section exists.",
    notes: {
      tanh: "Squashes to \u22121\u20261. Smooth, symmetric, a safe default.",
      relu: "Passes positives through, flattens negatives. Fast and the modern default.",
      sigmoid: "Squashes to 0\u20261. Historic, and prone to stalling.",
    },
    kicker: "Zoom all the way in",
    title: "A neuron is smaller than you think.",
    lede: "No memory, no logic, no cleverness. Three numbers and a squash: that is the entire unit the whole field is built from.",
    weight1: "Weight on x₁",
    weight2: "Weight on x₂",
    bias: "Bias",
    activation: "Activation",
    note: "Notice what you cannot do: however you move it, the boundary stays a straight line. That is the whole limitation of one neuron, and the reason the next section exists.",
    canvasLabel: "The output of a single neuron across the input square.",
    activations: {
      tanh: "Squashes to −1…1. Smooth, symmetric, a safe default.",
      relu: "Passes positives through, flattens negatives. Fast and the modern default.",
      sigmoid: "Squashes to 0…1. Historic, and prone to stalling.",
    },
  },

  handXor: {
    caption:
      "Each point is right or wrong by the side of the line it falls on; the ringed ones are wrong. Which side means which class is chosen for you, whichever scores better.",
    announce: (accuracy: string) => `${accuracy} of the points on the right side.`,
    canvasLabel: (lines: number, accuracy: string) =>
      `The XOR points with ${lines === 1 ? "one line" : "two lines"} you can drag. ${accuracy} are on the right side.`,
    slideHandle: (i: number) => `Line ${i}: its position. Arrow keys slide it.`,
    turnHandle: (i: number) =>
      `Line ${i}: the arrow's tip, its two weights. Arrow keys turn and sharpen it.`,
    modeLabel: "Neurons you place",
    modes: { one: "One line", two: "Two lines" },
    oneHint: "Drag the line, and turn it by its tip. Try to get every point on its own side.",
    ceilingReached: (ceiling: string) =>
      `That is as good as one line gets: ${ceiling}. No line on this square does better. This is the wall a single neuron hits.`,
    twoHint:
      "Now two neurons, and an output that says yes only where both arrows point. Make a band that holds two opposite corners.",
    twoBeaten: (ceiling: string) =>
      `Past ${ceiling}, the most one line can do. Two hidden neurons and one output: you have built a hidden layer by hand.`,
    figures: {
      accuracy: "Right side",
      best: "Your best, one line",
      bestHint: "this visit",
      ceiling: "Best any line can do",
      ceilingHint: "found by searching every angle",
    },
  },
  layers: {
    panelLabel: (title: string, accuracy: number, epoch: number) =>
      `${title}: ${accuracy}% of the XOR points classified correctly after ${epoch} epochs.`,
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
    slopeHint: "the only number backprop hands each weight",
    kicker: "How it learns",
    title: "Downhill, one small step at a time.",
    lede: "Learning is not insight. It is a ball on a slope, moving against the gradient, and the size of its steps decides everything.",
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
        body: "Compare the guess to the true label and square the difference. One number for the whole network, and the only thing it is ever trying to make smaller.",
      },
      backprop: {
        title: "Backpropagation",
        body: "Walk the error backwards through the layers with the chain rule. Every single weight learns how much it contributed, its gradient.",
      },
      descent: {
        slopeHint: "the only number backprop hands each weight",
        title: "Gradient descent",
        body: "Move each weight a small step against its gradient. The learning rate is the size of that step. Then do it again, thousands of times.",
      },
    },
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
      "A neuron is a weighted sum and a squash: on its own, only ever a straight line",
      "Hidden layers bend that line; XOR is impossible without one",
      "Every neuron learns its own feature, and the next layer combines them",
      "Loss says how wrong the network is; backprop says which weight to blame",
      "Gradient descent nudges every weight downhill: the learning rate is the step size",
      "Too small and it crawls, too large and it overshoots, and neither ever sees the whole landscape",
    ],
    footer:
      "Everything you just watched was 300 lines of plain arithmetic. The models behind today’s AI are the same four steps: with a great many more weights.",
  },
};

export default copy;
