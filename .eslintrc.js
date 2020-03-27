module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-null-keyword': 0,
    '@typescript-eslint/ordered-imports': 0,
    '@typescript-eslint/no-namespace': 1,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-for-in-array': 1,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-interface': 0,
  },
};
