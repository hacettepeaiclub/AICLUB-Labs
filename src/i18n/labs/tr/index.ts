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

import type { LabsCopy } from "../types";

/**
 * Türkçe lab metinleri, tek nesnede toplanmış hâli.
 *
 * Uygulama bunu okumaz: her lab'ın metni kendi dosyasında durur ve yalnızca
 * açılan lab'ınki indirilir. Bu nesne testler içindir. Şekli `enLabs` ile
 * birebir aynı olmak zorundadır.
 */
export const trLabs: LabsCopy = {
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
