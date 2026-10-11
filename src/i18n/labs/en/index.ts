import attention from "./attention";
import backpropagation from "./backpropagation";
import convolution from "./convolution";
import cryptographicHashing from "./cryptographic-hashing";
import floatingPoint from "./floating-point";
import gradientDescent from "./gradient-descent";
import graphSearch from "./graph-search";
import hashTables from "./hash-tables";
import hypothesisTesting from "./hypothesis-testing";
import multilayerPerceptrons from "./multilayer-perceptrons";
import probability from "./probability";
import reinforcementLearning from "./reinforcement-learning";
import sorting from "./sorting";
import tokenization from "./tokenization";
import wordEmbeddings from "./word-embeddings";
import wordEmbeddings3D from "./word-embeddings-3d";

/**
 * English lab prose — every section, recap and source note in the collection,
 * gathered back into one object.
 *
 * ## Who reads this
 *
 * Tests and types, not the app. Each lab's copy lives in its own file beside
 * this one and the app fetches only the file for the lab being opened (see
 * `../index.ts`). Nothing at runtime imports this module, so it never reaches
 * a bundle; it exists so a test can walk the whole collection and so
 * `LabsCopy` has one shape to be derived from.
 *
 * The lab names and one-line descriptions are not here but in `en.labMeta`:
 * the grid needs those before any lab is chosen.
 */
export const enLabs = {
  "word-embeddings-3d": wordEmbeddings3D,
  "word-embeddings": wordEmbeddings,
  "hypothesis-testing": hypothesisTesting,
  "reinforcement-learning": reinforcementLearning,
  attention: attention,
  "gradient-descent": gradientDescent,
  backpropagation: backpropagation,
  convolution: convolution,
  "floating-point": floatingPoint,
  "hash-tables": hashTables,
  "cryptographic-hashing": cryptographicHashing,
  "multilayer-perceptrons": multilayerPerceptrons,
  "graph-search": graphSearch,
  probability: probability,
  sorting: sorting,
  tokenization: tokenization,
};
