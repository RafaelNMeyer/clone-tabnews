const js = require("@eslint/js");
const globals = require("globals");

const eslintConfig = [
  js.configs.recommended,
  {
    ignores: [".next/*", "infra/migrations/*", "pages/index.js"],
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];

module.exports = eslintConfig;
