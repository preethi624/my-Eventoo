
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

 
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      //"react/prop-types": "off",
      //"@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off", // disable prop-types for TS
      "react/react-in-jsx-scope": "off", // ✅ no need for React import in React 17+
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
