/**
 * The collection's verified bibliography.
 *
 * One record per source, language-neutral, so a citation exists in exactly one
 * place and cannot drift between the English and Turkish dictionaries. What
 * each source supports *in a particular lab* is localized copy and lives in
 * the dictionaries, keyed by the ids below.
 *
 * ## The rule these records are held to
 *
 * Every field here was read from an authoritative register rather than
 * recalled: the DOI registry for anything with a DOI, the arXiv API for the
 * two preprints, and the book itself for the textbook. A field that could not
 * be verified is absent rather than guessed, which is why some entries carry
 * no DOI and the textbook carries no year.
 *
 * A source earns its place by supporting the theory or method a lab actually
 * implements. None of them describes our implementation, and the `supports`
 * copy in the dictionaries is written to say so.
 */

export interface Source {
  /** Authors, as the publication lists them. */
  readonly authors: string;
  /** Exact title, as published. */
  readonly title: string;
  /** Journal, proceedings or publisher, with volume and pages where they exist. */
  readonly venue: string;
  /** Publication year, or null when it could not be verified. */
  readonly year: number | null;
  /** Registered DOI, or null when the work has none. */
  readonly doi: string | null;
  /** A stable official address, for works without a DOI. */
  readonly url: string | null;
}

export const SOURCES = {
  astar: {
    authors: "Hart, P. E., Nilsson, N. J., & Raphael, B.",
    title: "A Formal Basis for the Heuristic Determination of Minimum Cost Paths",
    venue: "IEEE Transactions on Systems Science and Cybernetics, 4(2), 100–107",
    year: 1968,
    doi: "10.1109/TSSC.1968.300136",
    url: null,
  },
  dijkstra: {
    authors: "Dijkstra, E. W.",
    title: "A note on two problems in connexion with graphs",
    venue: "Numerische Mathematik, 1(1), 269–271",
    year: 1959,
    doi: "10.1007/BF01386390",
    url: null,
  },
  backpropagation: {
    authors: "Rumelhart, D. E., Hinton, G. E., & Williams, R. J.",
    title: "Learning representations by back-propagating errors",
    venue: "Nature, 323(6088), 533–536",
    year: 1986,
    doi: "10.1038/323533a0",
    url: null,
  },
  qLearning: {
    authors: "Watkins, C. J. C. H., & Dayan, P.",
    title: "Q-learning",
    venue: "Machine Learning, 8(3–4), 279–292",
    year: 1992,
    doi: "10.1007/BF00992698",
    url: null,
  },
  gloveVectors: {
    authors: "Pennington, J., Socher, R., & Manning, C. D.",
    title: "GloVe: Global Vectors for Word Representation",
    venue:
      "Proceedings of the 2014 Conference on Empirical Methods in Natural Language Processing (EMNLP), 1532–1543, Association for Computational Linguistics",
    year: 2014,
    doi: "10.3115/v1/D14-1162",
    url: null,
  },
  subwordBpe: {
    authors: "Sennrich, R., Haddow, B., & Birch, A.",
    title: "Neural Machine Translation of Rare Words with Subword Units",
    venue:
      "Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), 1715–1725",
    year: 2016,
    doi: "10.18653/v1/P16-1162",
    url: null,
  },
  transformer: {
    authors:
      "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I.",
    title: "Attention Is All You Need",
    venue: "arXiv:1706.03762",
    year: 2017,
    // The arXiv record carries no DOI, so none is printed.
    doi: null,
    url: "https://arxiv.org/abs/1706.03762",
  },
  adam: {
    authors: "Kingma, D. P., & Ba, J.",
    title: "Adam: A Method for Stochastic Optimization",
    venue:
      "3rd International Conference on Learning Representations (ICLR), San Diego; arXiv:1412.6980",
    year: 2015,
    doi: null,
    url: "https://arxiv.org/abs/1412.6980",
  },
  momentum: {
    authors: "Polyak, B. T.",
    title: "Some methods of speeding up the convergence of iteration methods",
    venue: "USSR Computational Mathematics and Mathematical Physics, 4(5), 1–17",
    year: 1964,
    doi: "10.1016/0041-5553(64)90137-5",
    url: null,
  },
  simpson: {
    authors: "Simpson, E. H.",
    title: "The Interpretation of Interaction in Contingency Tables",
    venue: "Journal of the Royal Statistical Society: Series B, 13(2), 238–241",
    year: 1951,
    doi: "10.1111/j.2517-6161.1951.tb00088.x",
    url: null,
  },
  sha2: {
    authors: "National Institute of Standards and Technology",
    title: "Secure Hash Standard (SHS), FIPS PUB 180-4",
    venue: "U.S. Department of Commerce",
    year: 2015,
    doi: "10.6028/NIST.FIPS.180-4",
    url: null,
  },
  statisticalInference: {
    authors: "Casella, G., & Berger, R. L.",
    title: "Statistical Inference, 2nd edition",
    venue: "Duxbury Press, Pacific Grove, CA",
    // The copy consulted carries no copyright page, so no year is claimed.
    year: null,
    doi: null,
    url: null,
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/** The bibliographic line, assembled in one place so every lab prints it alike. */
export function formatSource(id: SourceId): string {
  const source = SOURCES[id];
  // The year carries the separating full stop, so an author list that already
  // ends in an initial does not gain a second one: "Berger, R. L.." is not a
  // citation anybody would print, and stripping that stop would eat the
  // initial's own.
  const head = source.year === null ? source.authors : `${source.authors} (${source.year}).`;
  return `${head} ${source.title}. ${source.venue}.`;
}
