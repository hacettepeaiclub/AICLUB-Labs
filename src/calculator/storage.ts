import type { ModelId } from "./engine/types";

/** Which model this browser picked last: a student has one calculator. */
export const MODEL_STORAGE_KEY = "aiclub-labs-calculator-model";

export const isModelId = (value: unknown): value is ModelId =>
  value === "fx991ex" || value === "fx991esplus" || value === "fx570ms" || value === "fx82esplus";
