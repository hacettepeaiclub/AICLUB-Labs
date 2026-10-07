/** English prose for the convolution lab. Its shape is the contract `tr/convolution.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    lecunZip:
      "Introduces the constrained network this lab is about: small kernels whose weights are shared across every position of the image, learned by backpropagation, reading handwritten digits.",
    convArithmetic:
      "Works through how input size, kernel size, padding and stride decide the size of the output, including the floor that drops cells a stride never reaches. The formula in the fourth section is its relationship for that general case.",
    vgg: "Argues for stacks of 3×3 layers: two of them see a 5×5 region and three see 7×7, with fewer weights than one large kernel would need.",
    alexnet:
      "Shows the kernels a deep network's first layer learned from photographs on its own: most of them respond to edges at particular orientations, or to colour.",
    hubelWiesel:
      "Describes cells in the visual cortex that each answer to a small region of the visual field, many of them to an edge or a bar at one orientation. The term receptive field comes from this work.",
  },

  cellLabel: (row: number, column: number) => `Weight, row ${row}, column ${column}`,
  invalidWeight: "Every cell needs a number: try 1, -2, 0.5 or 1/9.",
  kernelWord: "Kernel",

  // 1 ----------------------------------------------------------------------
  slide: {
    title: "A window that slides",
    question: "Nine weights slide across a picture. What do they leave behind?",
    input: "Picture",
    kernel: "Kernel",
    output: "Output",
    inputLabel:
      "A 9 by 9 picture of the letter T. The outlined square is the window. Click a pixel to switch it on or off.",
    kernelLabel: "The kernel: minus 1 in the left column, 0 in the middle, plus 1 on the right.",
    outputLabel: (done: number, total: number) =>
      `The output, ${done} of ${total} cells computed. Click a cell, or use the arrow keys, to move the window there.`,
    arithmetic: "This cell, in full",
    step: "Slide one step",
    fillRest: "Fill the rest",
    reset: "Start over",
    caption:
      "Each output cell is nine products added up: weight times the pixel under it. The weights never change; only the window moves. Positive where the picture gets brighter to the right, negative where it gets darker.",
    announce: (column: number, row: number, value: string) =>
      `Window at column ${column}, row ${row}. Output ${value}.`,
    figures: {
      cell: "This cell",
      computed: "Computed",
      weights: "Weights",
      weightsHint: "the same nine at every step",
    },
  },

  // 2 ----------------------------------------------------------------------
  kernels: {
    kicker: "Nine numbers",
    title: "Change the weights, change what it sees.",
    lede: "The same sliding sum, over a bigger picture. Pick a kernel or type your own, then draw on the picture and see what it picks up.",
    input: "Picture",
    output: "Output",
    inputLabel:
      "A 32 by 32 picture: a disc, a square, a slanted bar and a ring. Drag across it to draw.",
    outputLabel: "The picture after the kernel, the same size, because it is padded with zeros.",
    drawHint: "Drag to draw.",
    editorLabel: "Kernel",
    presetLabel: "Start from",
    presets: {
      identity: "Identity",
      blur: "Blur",
      sharpen: "Sharpen",
      vertical: "Vertical edges",
      horizontal: "Horizontal edges",
      outline: "Outline",
    },
    notes: {
      identity: "A single 1 in the middle copies the pixel under it: the output is the picture.",
      blur: "Nine ninths average each pixel with its neighbours. The weights add up to 1, so flat areas keep their brightness.",
      sharpen:
        "The pixel, plus how much it differs from its four neighbours. The weights add up to 1, so flat areas stay as they were and edges get steeper.",
      vertical:
        "Right column minus left column. It answers where brightness changes from left to right, and is silent on the square's top and bottom edges.",
      horizontal:
        "Bottom row minus top row: the same detector turned a quarter. Now the left and right edges are the ones it ignores.",
      outline:
        "The pixel against all eight neighbours. The weights add up to 0, so everything flat disappears and only the outlines are left.",
      custom:
        "Your own kernel. Watch the sum of the weights: it is what a flat area is multiplied by.",
    },
    restore: "Restore the picture",
    pictureLabel: "The picture",
    caption:
      "On a flat patch every pixel under the window is the same, so the output is that brightness times the sum of the weights. Edge detectors add up to zero: that is why flat areas vanish.",
    legend: { positive: "positive", negative: "negative" },
    figures: {
      sum: "Sum of weights",
      sumHint: "what a flat area is multiplied by",
      range: "Output range",
    },
    announce: (total: string, min: string, max: string) =>
      `Weights add up to ${total}. The output runs from ${min} to ${max}.`,
  },

  // 3 ----------------------------------------------------------------------
  shift: {
    kicker: "Anywhere in the picture",
    title: "Move the shape. The answer moves with it.",
    lede: "This kernel is the shape it looks for: plus one where a plus is, minus one around it. Move the plus and watch where the output is strongest.",
    input: "Picture",
    detector: "Kernel",
    output: "Output",
    inputLabel: (x: number, y: number) =>
      `A 16 by 16 picture with an X, a block, a bar and a plus centred at column ${x}, row ${y}. Arrow keys move the plus; clicking places it.`,
    outputNote: "Brighter is a closer match. Zero and below are left dark.",
    detectorLabel: "A 5 by 5 kernel: plus 1 on a plus shape, minus 1 everywhere else.",
    outputLabel: (x: number, y: number, value: string) =>
      `The output. Strongest at column ${x}, row ${y}, with ${value}.`,
    keyboardHint: "Click the picture to place the plus, or focus it and use the arrow keys.",
    moveLabel: "Move the plus",
    move: { left: "Move left", up: "Move up", down: "Move down", right: "Move right" },
    caption:
      "A window that holds exactly the plus scores 9, the most any window can. The X, the block and the bar all score less. Because the same 25 weights are used at every position, the peak follows the plus cell for cell, wherever it goes.",
    figures: {
      peak: "Strongest",
      peakAt: (x: number, y: number) => `at column ${x}, row ${y}`,
      weights: "Weights used",
      weightsHint: "shared by all 256 positions",
      dense: "Without sharing",
      denseHint: "one weight per pixel per output cell",
    },
    announce: (x: number, y: number, value: string) =>
      `Strongest response ${value}, at column ${x}, row ${y}.`,
  },

  // 4 ----------------------------------------------------------------------
  size: {
    kicker: "Counting the windows",
    title: "How big is the output?",
    lede: "Four numbers decide it: the input, the kernel, the padding around the edge and the stride, how far the window jumps. Change them and count.",
    input: "Input and padding",
    output: "Output",
    inputLabel: (n: number, p: number) =>
      `An input of ${n} by ${n} cells with ${p} cells of zero padding around it. The outlined square is the window for the chosen output cell.`,
    outputLabel: (o: number, x: number, y: number) =>
      `The output, ${o} by ${o}. Cell at column ${x}, row ${y} chosen. Click a cell or use the arrow keys.`,
    noFit: "The kernel is larger than the padded input: there is nowhere to put it, and no output.",
    leftover: (n: number) =>
      n === 1
        ? "The stride does not divide evenly: the last row and column of the padded input are never under the window."
        : `The stride does not divide evenly: the last ${n} rows and columns of the padded input are never under the window.`,
    caption:
      "Dashed cells are the zero padding. Click an output cell to see the window that made it. Cells marked in amber are never read: the formula rounds down, and so does every framework.",
    labels: { n: "Input n", k: "Kernel k", p: "Padding p", s: "Stride s" },
    figures: {
      output: "Output",
      windows: "Windows",
      unreached: "Never read",
      unreachedHint: "cells of the padded input",
    },
    announce: (o: number) => `The output is ${o} by ${o}.`,
  },

  // 5 ----------------------------------------------------------------------
  depth: {
    kicker: "Layers on layers",
    title: "Small windows, stacked, see far.",
    lede: "One 3×3 layer sees three cells across. Put another on top of it and each of its cells sees what three cells below saw. Pick a cell at the top and follow it down.",
    inputName: "Input",
    layerName: (l: number) => `Layer ${l}`,
    diagramLabel: (count: number, chosen: number, top: number, size: number) =>
      `${count} layers of 3 by 3 kernels over a row of 16 inputs. Cell ${chosen} of ${top} at the top is chosen; it depends on ${size} inputs across. Left and right arrow keys choose another.`,
    edgeNote:
      "Part of this cell's field falls outside the picture, on the zero padding, so fewer real inputs are lit than the field is wide.",
    layersLabel: "Layers",
    stridesLabel: "Stride of each layer",
    strideButton: (l: number, s: number) => `Layer ${l}: stride ${s}`,
    caption:
      "Each layer adds two cells to what the top can see, times the product of the strides below it. Two 3×3 layers see 5×5 with 18 weights; one 5×5 kernel would need 25. Deep networks are built from small kernels for exactly this reason.",
    figures: {
      field: "Receptive field",
      fieldHint: "of one cell at the top",
      weights: "Weights",
      weightsHint: (count: number) => (count === 1 ? "one 3×3 kernel" : `${count} kernels of 3×3`),
      single: "One kernel instead",
      singleHint: (size: number) => `${size}×${size} to see as far`,
    },
    announce: (size: number) => `Receptive field ${size} by ${size}.`,
  },

  // 6 ----------------------------------------------------------------------
  learn: {
    kicker: "Nobody designs them",
    title: "Let the weights find the kernel.",
    lede: "A hidden kernel has already been run over this picture; you can see its output, not its weights. Start from nine random numbers and let gradient descent close the gap.",
    input: "Picture",
    goal: "Target",
    current: "Current",
    inputLabel: "A 24 by 24 textured picture of a disc, a square, a slanted bar and a ring.",
    goalLabel: "The output of the hidden kernel on the picture.",
    currentLabel: (lossValue: string) => `The output of the current weights. Loss ${lossValue}.`,
    weightsLabel: "Weights",
    weightsAria: (list: string) => `Current weights, row by row: ${list}.`,
    hiddenLabel: "Hidden",
    hiddenAria: (list: string) => `The hidden kernel, row by row: ${list}.`,
    hiddenSecret: "The hidden kernel, not shown yet.",
    curve: "Loss, log scale",
    curveLabel: "The loss after every step, on a logarithmic scale.",
    found: (steps: number) =>
      `Found it in ${steps} steps. The weights are the hidden kernel: nobody told them what an edge is.`,
    ready: "Nine random weights. Press Train and watch them move.",
    searching: "Every step moves all nine weights against the gradient of the error.",
    train: "Train",
    pause: "Pause",
    resume: "Continue",
    again: "New random start",
    targetLabel: "Hidden kernel",
    targets: { vertical: "Edge detector", blur: "Blur", outline: "Outline" },
    reveal: "Show the hidden kernel now",
    secondaryLabel: "Choose another hidden kernel",
    caption:
      "The error is a bowl with one bottom, and the hidden kernel sits there, so descent from any start ends on it. The picture's average brightness is taken out first, as networks do with their inputs; it changes how fast the fit goes, not where it ends.",
    figures: { steps: "Steps", loss: "Loss" },
    announceDone: (steps: number) => `Found the hidden kernel in ${steps} steps.`,
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Your turn",
    title: "Three kernels to find by hand.",
    lede: "Each one asks for a behaviour, not an answer. Anything that behaves that way passes.",
    pickLabel: "Challenge",
    yours: "Yours",
    reset: "Forget my progress",
    solvedLabel: "Solved",
    caption:
      "Every verdict runs your kernel over the pictures shown, with the same arithmetic as the rest of the page. There is no answer key.",
    announce: (solved: number, total: number) => `${solved} of ${total} challenges solved.`,
    shift: {
      tab: "Shift",
      task: "Move the whole picture one cell to the right.",
      hint: "The output is padded to the same size, so every pixel has a place to go.",
      input: "Picture",
      goal: "Goal",
      solved:
        "Solved. A single 1 on the left: each output reads the pixel to its left, which moves the picture right.",
      notYet: "Not yet: your output does not match the goal.",
      mirrored:
        "That moved it left. A convolution layer lays the kernel down as written, without flipping it, so the 1 has to go on the other side.",
    },
    flat: {
      tab: "Flat",
      task: "Turn every flat area to 0 but still answer the square's edge.",
      hint: "Think about what a flat area is multiplied by.",
      input: "Picture",
      rules: {
        flatZero: "0 wherever the window sees one flat colour",
        edgeSeen: "Not 0 somewhere on the edge",
      },
      solved:
        "Solved. Your weights add up to zero, so flatness cancels and only change survives. Every edge detector has this property.",
      notYet: "Not yet: check the two conditions.",
    },
    vertical: {
      tab: "Vertical",
      task: "Answer a vertical line, but never a horizontal one.",
      hint: "Output above 0 somewhere on the vertical line, and nowhere above 0 on the horizontal one.",
      vertical: "Vertical line",
      horizontal: "Horizontal line",
      verticalOut: "Your output on the vertical line.",
      horizontalOut: "Your output on the horizontal line.",
      rules: {
        fires: "Above 0 somewhere on the vertical line",
        silent: "Never above 0 on the horizontal line",
      },
      solved:
        "Solved. Some column of your kernel adds up to more than 0, and no row adds up to more than 0. A detector for one orientation is exactly that.",
      notYet: "Not yet: check the two conditions.",
    },
  },

  recap: {
    lessons: [
      "A convolution slides one small kernel across the input; every output is a weighted sum of the pixels under it",
      "The weights decide what it finds: the same arithmetic blurs, sharpens or picks out edges",
      "On a flat patch the output is the brightness times the sum of the weights, so edge detectors sum to zero",
      "The same weights at every position means a pattern is found wherever it is, with a tiny fraction of the weights",
      "Output size is ⌊(n + 2p − k)/s⌋ + 1: padding keeps it, stride shrinks it",
      "Stacked small kernels see far: each layer widens the receptive field",
      "Kernels are not designed by hand: gradient descent finds them from examples",
    ],
    footer:
      "Convolutional networks, from the 1989 reader of handwritten zip codes to the models that recognise photographs, are layers of exactly this sum, with more channels and many more kernels.",
  },
};

export default copy;
