import { MODEL_IDS } from "./engine/models";
import type { ModelId } from "./engine/types";

/** Which model this browser picked last: a student has one calculator. */
export const MODEL_STORAGE_KEY = "aiclub-labs-calculator-model";

export const isModelId = (value: unknown): value is ModelId =>
  typeof value === "string" && (MODEL_IDS as string[]).includes(value);
