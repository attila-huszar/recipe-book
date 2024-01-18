module.exports = {
  env: {
    commonjs: true,
    es2022: true,
    jest: true,
    browser: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-use-before-define': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
  },
}
