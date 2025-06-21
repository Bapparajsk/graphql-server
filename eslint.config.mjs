import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  { ignores: ["src/graphql/types.ts","src/graphql/graphql.d.ts" ,"generated/*", "src/types/*"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      import: importPlugin // ✅ Add this
    },
    rules: {
      semi: "error",
      "@typescript-eslint/no-explicit-any": "off",
      "quotes": ["error", "double", { avoidEscape: true }],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "**/*.css",
              group: "index",
              position: "after"
            }
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          },
          "newlines-between": "always"
        }
      ],
      "import/no-duplicates": "error",
      "import/newline-after-import": "error"
    },
    languageOptions: {
      globals: globals.browser
    },
    extends: ["js/recommended"]
  },
  tseslint.configs.recommended
]);
