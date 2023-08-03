module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  ignorePatterns: ['**/*.spec.ts', '.eslintrc.cjs', './apps/bookwise/tailwindcss.config.js'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
