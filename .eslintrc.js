module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  overrides: [
    {
      files: [".eslintrc.{js,cjs}", "server/modules/**/**/*.js"],
      env: {
        node: true,
        browser: false,
      },
      parserOptions: {
        sourceType: "script",
      },
      rules: {
        "no-unused-vars": "warn",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-useless-escape": "off",
    "no-empty": "off",
  },
  ignorePatterns: ["client/build/*"],
};
