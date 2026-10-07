/** English prose for the word-embeddings-3d lab. Its shape is the contract `tr/word-embeddings-3d.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    gloveVectors:
      "Supports the vectors this lab reads. The three-dimensional view changes the projection, not the embeddings underneath it.",
  },
  lede: "The same words, the same vectors, one more axis. Drag to turn the cloud.",
  honesty:
    "This is not what the embedding looks like. The space has 300 dimensions; what you are turning is a view of it reduced to three PCA axes, which is one more than the flat map and still almost none of them.",
  compare:
    "A prototype, kept apart from the lesson on purpose. Depth makes the cloud feel like a place, but it does not make the projection more truthful, and judging whether that trade is worth teaching is the point of building it.",
  error: "The word vectors could not be loaded.",
  varianceLabel: "Variance explained",
  varianceHint: (dimensions: number) => `three axes of ${dimensions}`,
  selectedLabel: "Selected",
  recapTitle: "What this prototype shows",
  recap: {
    lessons: [
      "Three axes carry a little more of the space than two, and still almost none of it.",
      "Depth makes the cloud feel like a place, which is persuasive whether or not it is informative.",
      "The words, the vectors and the nearest neighbours are identical to the flat map; only the view changed.",
    ],
  },
  map: {
    mapLabel:
      "Word cloud in three dimensions. Drag to turn it. Arrow keys move through the nearest words, Shift with arrow keys turns the view, Enter selects.",
    hint: "Drag to turn · Shift + arrows to orbit",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. Number ${rank} nearest, similarity ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Selected`,
    pending: "Working out the three axes…",
  },
};

export default copy;
