import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

/**
 * ESLint — correctness only.
 *
 * Formatting is Prettier's job and stays there: `eslint-config-prettier` is
 * applied last to switch off anything that would argue with it. What is left
 * are rules that catch bugs the compiler cannot see — above all the Rules of
 * Hooks, which is the one class of error TypeScript is structurally unable to
 * detect (a hook after an early return type-checks perfectly and then breaks
 * at runtime).
 *
 * Type-aware linting is deliberately not enabled. It would add a second full
 * type-check to every lint run for rules that mostly overlap with what
 * `strict` + `noUncheckedIndexedAccess` already enforce.
 */
export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "*.tsbuildinfo"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      // --- The reason this config exists -------------------------------
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // --- JSX mistakes the compiler does not catch --------------------
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/no-children-prop": "error",
      "react/no-direct-mutation-state": "error",

      // --- Handled better elsewhere ------------------------------------
      // tsc already reports these via noUnusedLocals / noUnusedParameters;
      // reporting them twice just doubles the noise.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // The automatic JSX runtime means React need not be in scope, and
      // TypeScript resolves every JSX identifier itself.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // Tests run in Node and reach for its APIs.
  {
    files: ["**/*.test.{ts,tsx}"],
    languageOptions: { globals: { ...globals.node } },
  },

  // Config files are Node scripts, not browser code.
  {
    files: ["*.config.{js,ts}", "postcss.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },

  prettier,
);
