const copy = {
  question: "Perfect on familiar points. What about new ones?",
  training: "Training accuracy",
  validation: "Validation accuracy",
  test: "Final test accuracy",
  map: "Classifier regions and labelled examples. Circles and triangles are different classes; amber rings mark mistakes.",
  legend: "Circle / triangle: true class. Background: predicted class. Amber ring: a mistake.",
  settings: "Model settings",
  neighbours: "Neighbours voting (k)",
  kHint: "At k = 1, each training point votes for itself. Raise k to let more neighbours vote.",
  hide: "Show training points",
  show: "Reveal unseen examples",
  lock: "Lock model & test once",
  finalNote:
    "This score used a separate test set. Settings are locked: tuning against this score would turn the test into another validation set. Start a new dataset to explore again.",
  revealed: "New examples are visible. Compare their errors with the training result.",
  newData: "New dataset",
  dataSettings: "Sample size & label noise",
  samples: "Training examples",
  noise: "Label flip probability",
  dataHint:
    "Choose these before revealing validation points. Once seen, hiding them does not make them unseen again. Start a new dataset to change these settings.",
  scope:
    "A real k-nearest-neighbour classifier on synthetic circle data, with independent training, validation and test samples. Labels may be flipped at the chosen probability. No neural network is trained here; larger k smooths the boundary. Scores vary with the sample, and more smoothing is not always better.",
  bridgeTitle: "The same question applies to a neural network.",
  bridge:
    "A flexible boundary can fit noise. The model here memorises neighbours; a neural network adjusts weights. Both need evaluation on examples that did not choose their parameters.",
  link: "Explore neural network capacity",
  recap: {
    lessons: [
      "Training performance is not an estimate of performance on new data.",
      "Use validation examples to choose a model; keep a separate test for the final evaluation.",
      "More capacity and more smoothing are tradeoffs, not guarantees of improvement.",
    ],
  },
  tour: {
    intro: "Reveal the points the classifier has never seen.",
    stages: {
      experiment: {
        map: "The background is computed by neighbour voting. At k = 1, the training points classify themselves perfectly.",
        reveal:
          "Reveal a separate sample. Amber rings show predictions that disagree with its labels.",
        smooth:
          "Let more neighbours vote. Compare validation accuracy with the training score; neither is guaranteed to rise.",
      },
    },
  },
  study: {
    topics: { generalisation: "Generalisation and model selection" },
    notes: {
      "sklearn-generalization":
        "How to split training and evaluation data without leaking the test into model selection.",
      "isl-courses":
        "Start with the video lectures on statistical learning and resampling. R and Python options are available; edX access may require an account.",
      "isl-book":
        "Read the free book’s classification and resampling chapters. Connect the choice of k and validation data to why the final test must stay separate.",
      "d2l-generalization":
        "A mathematical follow-up on training error versus error on new data. Read after the lab; the examples use regression rather than k-nearest neighbours.",
    },
  },
};
export default copy;
