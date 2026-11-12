const copy = {
  percent: (n: number) => `${n}%`,
  decimal: (x: number, digits: number) => x.toFixed(digits),
  degrees: (x: number) => `${x.toFixed(1)}°`,
  turn: {
    title: "A matrix bends space",
    question:
      "A matrix moves every arrow in space somewhere else. Aim the arrow and watch: most directions come out turned. Find the ones that do not.",
    planeLabel: (turn: string) =>
      `Space, bent by the matrix: the box was a cube and the egg was a ball. The blue arrow is v; the amber arrow is where the matrix sends it, Av. They are ${turn} apart.`,
    legendV: "v, your direction",
    legendAv: "Av, where the matrix sends it",
    legendFound: "a direction that stays",
    matrix: "Matrix",
    matrices: {
      stretch: "Symmetric",
      shear: "Shear",
      skew: "Lopsided",
      rotate: "Rotation",
    },
    direction: "v, around",
    tilt: "v, up or down",
    dragHint: "Drag the picture to look at it from another side.",
    turned: "Turned by",
    stretch: "Stretched by",
    found: "Directions found",
    foundCount: (found: number, total: number) => `${found} of ${total}`,
    announceFound: (stretch: string) =>
      `Found one: here Av lies on the same line as v, only stretched, by ${stretch}. That is an eigenvector, and ${stretch} is its eigenvalue.`,
    allFound: "Every direction this matrix leaves unturned is found.",
    rotateNote:
      "A rotation turns every direction but one: its axis, which it leaves where it was, stretched by 1. Its other two eigenvalues are complex numbers, with no direction in space to show them.",
    caption:
      "An eigenvector is a direction the matrix only stretches: Au = λu, and λ, the eigenvalue, says by how much. In three dimensions the symmetric and lopsided matrices keep three; the shear keeps two; the rotation keeps only its axis.",
    matrixEntries: (r1: string, r2: string, r3: string) =>
      `The matrix, row by row: ${r1}; ${r2}; ${r3}.`,
  },
  shadow: {
    kicker: "From a matrix to data",
    title: "The widest shadow",
    lede: "Here is a cloud of people: height across, weight up. Put a line through the middle and drop every point straight onto it. Turn the line until the shadows spread out as wide as they can.",
    cloudLabel: (angle: string) =>
      `Each dot is one person. The line through the middle is at ${angle}; each dot's shadow on it is marked.`,
    angle: "Angle of the line",
    reveal: "Show the eigenvectors",
    hide: "Hide them",
    variance: "Spread of the shadow (variance)",
    best: "Widest you have found",
    first: "λ₁, the widest",
    second: "λ₂, across it",
    covariance: "The cloud's covariance matrix",
    covarianceRows: (a: string, b: string, c: string, d: string) =>
      `Var(height) ${a}, Cov ${b}; Cov ${c}, Var(weight) ${d}`,
    revealed:
      "The widest shadow lies along the covariance matrix's first eigenvector, and its variance is that eigenvalue. The narrowest lies along the second, at a right angle to it.",
    data: "Data",
    clouds: { people: "People", round: "Round cloud" },
    newSample: "Another sample",
    dataLabel: "Which cloud",
    axisPeople: { x: "height (cm)", y: "weight (kg)" },
    axisRound: { x: "first quantity", y: "second quantity" },
    caption:
      "The cloud's covariance matrix is symmetric, like the first matrix above, so the directions it leaves unturned are at right angles: in two dimensions, there are two. The people are a made-up sample, drawn to match adults' usual spread and correlation; nothing here is measured.",
  },
  reduce: {
    kicker: "Fewer numbers",
    title: "Two numbers become one",
    lede: "Keep only each point's shadow on the widest line, and every person is one number instead of two. Most of the spread survives; what is left over is how far each point was from the line.",
    cloudLabel: (kept: string) =>
      `The cloud and its first principal component; the line keeps ${kept} of the variance.`,
    flatten: "Keep one number",
    restore: "Back to two",
    kept: "Variance kept",
    lost: "Variance lost",
    data: "Data",
    caption:
      "This is PCA: the eigenvectors of the covariance matrix, widest first, and the data described along them. On the people, one line keeps most of the spread. On the round cloud no direction is special, and one line keeps barely more than half.",
  },
  bridge: {
    title: "Where these directions turn up",
    intro: "The same eigenvectors appear across the collection.",
    items: {
      "word-embeddings":
        "Its map flattens 300 numbers per word onto the two widest directions, and shows what that hides.",
      "gradient-descent":
        "Its curvature ratio is the ratio of two eigenvalues of the landscape's curvature matrix.",
      jepa: "Its map of meanings is flattened the same way.",
    },
  },
  recap: {
    lessons: [
      "A matrix turns most directions; an eigenvector is a direction it only stretches, by its eigenvalue.",
      "The covariance matrix of a cloud is symmetric, so its eigenvectors are at right angles: the widest and the narrowest spread.",
      "PCA describes data along those directions, widest first, and can drop the narrow ones with little lost.",
    ],
    footer:
      "Two dimensions, so everything can be drawn; real PCA runs the same mathematics on hundreds of dimensions with numerical methods.",
  },
  sources: {
    title: "Sources",
    pearson:
      "Pearson's paper fits a line or plane to points by minimising the squared distances from them, the geometric idea behind the first principal component.",
    hotelling:
      "Hotelling's paper names principal components and finds them as the eigenvectors of the correlation or covariance matrix of the variables.",
  },
  tour: {
    intro:
      "Find the directions a matrix only stretches, then the line where a cloud spreads widest.",
    stages: {
      turn: {
        plane:
          "The blue arrow is v, the amber one is Av: where the matrix sends it. Drag the picture to turn it.",
        direction: "Aim v. Most directions come out turned.",
        turned: "Find where the turn is zero: that direction is an eigenvector.",
      },
      shadow: {
        cloud: "Each dot is one person, and each has a shadow on the line.",
        angle: "Turn the line and watch how wide the shadows spread.",
        reveal: "The widest one is the covariance matrix's first eigenvector.",
      },
      reduce: {
        line: "The widest line, found as an eigenvector.",
        flatten: "Keep only each shadow: one number per person.",
        kept: "Most of the variance survives.",
      },
    },
  },
  study: {
    topics: {
      eigen: "Eigenvectors and eigenvalues",
      pca: "Principal component analysis",
    },
    notes: {
      "3b1b-eigen":
        "Eigenvectors as the directions a transformation only stretches, drawn as the grid moves.",
      "sq-pca": "The same idea from the data side: the line of widest spread, in five minutes.",
    },
  },
};

export default copy;
