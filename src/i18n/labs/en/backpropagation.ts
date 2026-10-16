/** English prose for the backpropagation lab. Its shape is the contract `tr/backpropagation.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    backpropagation:
      "Supports backpropagation as a way to train layered networks: run the error backwards through the layers and adjust every weight by its share. The networks on this page are small teaching examples, not the paper's.",
    linnainmaa:
      "The first published account of reverse-mode differentiation, the general method of which backpropagation is a case: carry derivatives backwards through a computation, one local step at a time.",
    griewank:
      "The standard reference on algorithmic differentiation. It shows that the reverse mode delivers the full gradient of a scalar function for a small constant multiple of the cost of evaluating it, however many inputs there are, which is what the race in the fifth section measures.",
    autodiffSurvey:
      "Separates automatic differentiation from the numerical kind, whose finite differences need a pass per input and carry truncation and rounding error, and from the symbolic kind. It is why this page checks backprop against central differences and not the other way round.",
    vanishing:
      "Shows why gradients carried back through many steps shrink or blow up exponentially, which makes long-range dependencies hard to learn by gradient descent. The sixth section is the same product of factors, in a chain of layers.",
  },

  // 1 ----------------------------------------------------------------------
  pull: {
    title: "Pull the output",
    question: "Grab the network's output and pull it somewhere. Which weights have to move?",
    caption:
      "While you hold the output, every connection glows with its share of the pull: thicker for a bigger share, blue to grow, rose to shrink, and the dashes run backwards from the output to show which way the blame travels. Let go and the weights take exactly those shares.",
    announceLanded: (aimed: string, landed: string) => `Aimed at ${aimed}, landed at ${landed}.`,
    announceAim: (target: string, leader: string) =>
      `Pulling the output to ${target}. ${leader} carries the most.`,
    diagramLabel: (out: string) =>
      `A network with two inputs, two tanh neurons and one output, currently ${out}. Drag the output up or down, or focus it and use the arrow keys, then Enter.`,
    bias: (name: string, value: string) => `${name} ${value}`,
    handleLabel: "The network's output",
    handleValue: (out: string, target: string | null) =>
      target === null ? `Output ${out}` : `Output ${out}, pulled to ${target}`,
    leaderLine: (leader: string, share: string) =>
      `${leader} carries the most of this pull: it would change by ${share}.`,
    landedLine: (aimed: string, landed: string) =>
      `Aimed at ${aimed}, landed at ${landed}. A straight line through the network said exactly ${aimed}; the bend in tanh is the difference.`,
    hint: "Drag the white dot on the right. Every connection lights up with how much it would have to change.",
    letGo: "Let go",
    reset: "Start over",
    tableTitle: "Every weight and its gradient",
    columns: { weight: "Weight", value: "Value" },
    figures: {
      output: "Output",
      target: "Pulled to",
      landed: "Landed",
      missedBy: (miss: string) => `missed by ${miss}`,
    },
  },

  // 2 ----------------------------------------------------------------------
  zoom: {
    kicker: "What the number means",
    title: "Zoom in until the curve is a line.",
    lede: "Hold every weight still but one, and the loss becomes a curve. Zoom in on a single point of it and watch it straighten.",
    caption:
      "The dashed line has the slope backpropagation returned for this weight. Far away it is a poor fit; close up, the curve and the line cannot be told apart. That slope is all a gradient is: how fast the loss changes when this weight does, seen close enough. Drag the chart to move along the curve.",
    announce: (half: string, slope: string, gap: string) =>
      `Window ±${half}. Backprop says ${slope}; the measured slope differs by ${gap}.`,
    chartLabel: (w: string, half: string) =>
      `The loss as the weight w₁₁ varies around ${w}, within ±${half}, with the tangent backpropagation predicts. Drag to move along the curve.`,
    axis: "weight w₁₁",
    legend: { curve: "the loss", tangent: "slope from backprop" },
    zoomLabel: "Magnification",
    zoomValue: (x: string) => `${x} times`,
    figures: {
      backprop: "Backprop says",
      backpropHint: "∂L/∂w₁₁, from one backward pass",
      secant: "Measured slope",
      secantHint: "rise over run, across the window",
      gap: "Difference",
    },
  },

  // 3 ----------------------------------------------------------------------
  chain: {
    kicker: "The chain rule",
    title: "Turn the first dial. Watch the last.",
    lede: "Five dials on one shaft, each driven by the one before it. Each link turns its neighbour by its own ratio, and the ratios multiply.",
    caption:
      "Each number on a link is how much that stage turns for a tiny turn of the stage before it: its local derivative. The last dial moves by all of them multiplied together. Backpropagation is this multiplication, done from the far end.",
    announce: (x: string, d: string, product: string) =>
      `x is ${x}, d is ${d}, and d changes ${product} times as fast as x.`,
    diagramLabel: (values: string) =>
      `Five dials, x, a, b, c and d, at ${values}. The first is a control: drag it round, or use the arrow keys.`,
    stages: ["a = 1.5x", "b = tanh a", "c = b²", "d = 2c − 1"],
    dialLabel: "The first dial, x",
    hint: "Drag the blue dial round, or focus it and use the arrow keys. Small turns show the ratio best.",
    figures: {
      product: "Product of the links",
      productHint: "d′(x), by the chain rule",
      measured: "Your last turn",
      measuredHint: (dx: string) => `Δd ÷ Δx, for Δx = ${dx}`,
      measuredEmpty: "turn the first dial",
    },
  },

  // 4 ----------------------------------------------------------------------
  ledger: {
    kicker: "Your turn to compute",
    title: "Be the backward pass.",
    lede: "A real loss: one neuron, its squared error, and a penalty that keeps the weight small. The forward values are filled in. The backward ones are yours, and the order matters.",
    caption:
      "A node's gradient is the sum of what flows back from every node that reads it, so it can only be known once they all are. That is why backpropagation runs from the loss towards the weights, and why w, which two nodes read, adds two contributions.",
    refused: (node: string, waiting: string) =>
      `Not yet: ${node} is read by ${waiting}, whose gradient is still unknown. Every reader comes first.`,
    filledAnnounce: (name: string, adj: string) => `∂L/∂${name} = ${adj}.`,
    diagramLabel:
      "The computation graph of L = (tanh(w·x + b) − y)² + 0.1·w². Each node shows its forward value; tap a node to fill in its gradient.",
    nodeDone: (name: string, value: string, adj: string) =>
      `${name}, value ${value}, gradient ${adj}.`,
    nodeOpen: (name: string, value: string) =>
      `${name}, value ${value}, gradient not filled in yet.`,
    nodeConst: (name: string, value: string) => `${name}, a constant, ${value}.`,
    rootLine: "∂L/∂L = 1. Everything starts here: the loss changes exactly as fast as itself.",
    nodeLine: (name: string) =>
      `∂L/∂${name}: what flows back from each node that reads ${name}, times that node's local derivative.`,
    term: (reader: string) => `from ${reader}:`,
    sum: (parts: string, total: string) => `two paths, added: ${parts} = ${total}`,
    checked: (ours: string, numeric: string) =>
      `Done. Your ∂L/∂w is ${ours}; nudging w and measuring gives ${numeric}.`,
    reset: "Clear the gradients",
    figures: {
      filled: "Filled in",
      w: "∂L/∂w",
      wHint: "the sum of two paths",
    },
  },

  // 5 ----------------------------------------------------------------------
  cost: {
    kicker: "Why it won",
    title: "One pass back, against two passes per weight.",
    lede: "There is a simpler way to get a gradient: nudge each weight, run the network, see what changed. Race it against backpropagation, for real, in this browser.",
    caption:
      "Both columns compute the same gradient, and the race only counts because they agree. Nudging needs two runs of the network for every weight, so its time grows with the number of weights; backpropagation needs one run forwards and one back, whatever that number is. The times are your machine's; the ratio is what holds.",
    announce: (ratio: string, params: number) =>
      `Backpropagation was ${ratio} times faster, on ${params} weights.`,
    sizeLine: (count: string, passes: number) =>
      `A network with ${count} weights: nudging each one up and down means ${passes} runs of the network.`,
    numeric: "Nudge every weight",
    backprop: "Backpropagation",
    numericPasses: (n: number) => `${n} forward passes`,
    backpropPasses: "1 forward pass and 1 backward pass",
    agree: (worst: string) => `Both found the same gradient: they differ by at most ${worst}.`,
    widthLabel: "Neurons per hidden layer",
    running: "Racing…",
    race: "Race them",
    figures: {
      weights: "Weights",
      ratio: "Backprop faster by",
      ratioHint: "and the gap widens with the network",
    },
  },

  // 6 ----------------------------------------------------------------------
  depth: {
    kicker: "When it breaks",
    title: "Make the network longer and watch the signal fade.",
    lede: "A chain of layers, one neuron each. Drag the last one to the right to add layers, and see how much of the gradient still reaches the start.",
    caption:
      "Each layer multiplies the gradient by w times its activation's slope. A sigmoid's slope is at most a quarter, so at w = 1 ten layers cost at least six orders of magnitude, and the early layers stop learning. ReLU passes it through unchanged while the signal is positive, and a weight above 1 makes it grow instead: the gradient explodes.",
    announce: (depth: number, first: string) =>
      `${depth} layers. The gradient reaching the input is ${first}.`,
    chartLabel: (depth: number, activation: string, first: string) =>
      `A chain of ${depth} ${activation} layers. Bars show, on a log scale, how much gradient reaches each layer; at the input it is ${first}.`,
    handleLabel: "Number of layers",
    end: "end",
    hint: "Drag the blue dot at the end, or focus it and use the left and right arrow keys.",
    activationLabel: "Activation",
    activations: { sigmoid: "Sigmoid", tanh: "Tanh", relu: "ReLU" },
    weightLabel: "Weight w in every layer",
    depthLabel: "Layers",
    secondaryLabel: "Weight and depth",
    figures: {
      first: "At the input",
      firstHint: "of the gradient at the end",
      factor: "Per layer",
      factorHint: "on average",
    },
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Debugging",
    title: "Someone's backward pass is wrong. Find where.",
    lede: "Three graphs from this page, each with one mistake in its backward pass. You have the tool practitioners use: a gradient check.",
    caption:
      "Checking a parameter compares the backward pass with nudging that one parameter and measuring. Which ones disagree, and how, points to the fault. A wrong accusation only tells you where the fault is not.",
    announce: (solved: number, total: number) => `${solved} of ${total} faults found.`,
    cases: {
      neuron: {
        tab: "The neuron",
        task: "The small network from the top of the page. One neuron's backward step is wrong.",
        hint: "Check the weights one by one. Which neuron do all the wrong ones go through?",
        solved:
          "Found it. h₂ used tanh(z) as its slope, where 1 − tanh²(z) belongs. Only the weights behind h₂ were wrong, which is what pointed at it.",
      },
      fork: {
        tab: "The fork",
        task: "The graph you filled in by hand. Something goes wrong where a value is used twice.",
        hint: "b comes out right and w does not. What does w have that b does not?",
        solved:
          "Found it. Of w's two paths back, only the last one to arrive survived: it was assigned instead of added. Every shared value has to sum its contributions.",
      },
      sign: {
        tab: "The sign",
        task: "The same loss, written with the error as y − h. Both gradients come out wrong.",
        hint: "Compare the two closely: one is exactly the negative of the truth, the other is not. Where could a sign get lost?",
        solved:
          "Found it. The subtraction forgot the minus on its second input, h, so everything behind h came out negated. w's penalty path does not pass through it, which is why w was wrong but not exactly flipped.",
      },
    },
    checkTitle: "Gradient check",
    check: "Check",
    checkLegend: "Backward pass on the left, measured by nudging on the right.",
    accuseTitle: "Where is the fault?",
    notYet: "Check some parameters, then name the node.",
    wrong: (name: string) => `Not ${name}. Its backward step is right.`,
    pickLabel: "Case",
    reset: "Forget my progress",
    solvedLabel: "Found",
  },

  recap: {
    lessons: [
      "A gradient is a slope: zoom in far enough on the loss and it is a straight line",
      "The chain rule multiplies local derivatives; backpropagation does that multiplication from the loss backwards",
      "A value used in two places collects the gradient from both, added",
      "The backward pass must go in order: every reader of a node before the node",
      "One backward pass gives every weight's gradient; nudging needs two passes per weight",
      "Deep chains multiply many factors: below 1 the gradient vanishes, above 1 it explodes",
      "A gradient check compares backprop with nudging, and is how a broken backward pass is caught",
    ],
    footer:
      "Every neural network trained today, from the one at the top of this page to the ones with billions of weights, learns by this one backward walk. Frameworks write it for you; this is what they write.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "A small network, and its output as a dot you can grab. Pull it somewhere and every weight lights up with its share of the blame.",
    stages: {
      pull: {
        pull: "This dot is the network's output. Drag it up or down, or use the arrow keys: the tour pulled it up.",
        letGo: "Let go, and every weight moves by exactly its share of the pull.",
        result:
          "Where you aimed, where it landed, and by how much it missed. Pull it further and the miss grows.",
      },
      zoom: {
        curve:
          "The loss as one weight changes, with the slope backpropagation returned drawn as a dashed line. Drag along it.",
        zoom: "The tour zoomed all the way in: the curve and the line can no longer be told apart.",
        slope:
          "Backprop's slope beside the one measured across the window. Zoom in and the difference shrinks: that slope is all a gradient is.",
      },
      chain: {
        dial: "Turn the first dial by dragging it, or with the arrow keys. The tour turned it a little.",
        links:
          "The number on each link is how much that dial turns for a tiny turn of the one before it.",
        last: "The links multiplied together, beside what your last turn measured. They agree: that is the chain rule.",
      },
      ledger: {
        graph:
          "A real loss as a graph. Each node shows its forward value; the gradients are yours to fill in.",
        tap: "Tap a node to fill in its gradient. The loss comes first: the tour filled it in.",
        order:
          "How many you have filled in, and ∂L/∂w, which adds up two paths. Tap a node too early and it says what it is waiting for.",
      },
      cost: {
        columns:
          "Two ways to get the same gradient: nudge every weight and rerun, or one backward pass.",
        width: "This sets how many neurons each layer has. The tour made the network wider.",
        race: "Race them in this browser. The wider the network, the further behind nudging falls.",
      },
      depth: {
        chart:
          "How much of the gradient still reaches each layer, from the last back to the first.",
        add: "Drag the last layer to the right, or use the arrow keys, to add layers. The tour added four.",
        activation: "Try another activation here: with ReLU the signal passes through unchanged.",
      },
      challenge: {
        cases: "Three graphs, each with one mistake in its backward pass. Pick one here.",
        check:
          "Check a parameter: its backward-pass gradient is compared with a measured one. The tour checked the first.",
        accuse: "When you know where the fault is, accuse that node here.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      slope: "A gradient is a slope; the chain rule",
      graph: "The graph, and the order of the backward pass",
      depth: "Vanishing and exploding gradients",
      check: "Gradient check",
    },
    notes: {
      "3b1b-backprop": "What backpropagation is doing, without the formulas first.",
      "3b1b-backprop-calc": "The same, with the chain rule written out.",
      "sq-chain": "The chain rule worked through on real numbers.",
      "karpathy-micrograd":
        "Build backpropagation yourself, node by node, in about a hundred lines.",
      "sq-backprop": "One weight at a time: which way to move it and by how much.",
      "cs231n-backprop": "Gates, local gradients and the sum where a value is used twice.",
      "ng-vanishing": "Why a long chain of factors below or above 1 shrinks or blows up.",
      "ng-gradcheck": "Comparing backprop with nudging, as the lab's last section does.",
    },
  },
};

export default copy;
