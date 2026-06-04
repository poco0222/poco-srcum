/**
 * @file ESLint flat-config baseline for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error"
    }
  },
  {
    ignores: [
      ".next/**",
      "dist/**",
      "coverage/**",
      "node_modules/**"
    ]
  }
);
