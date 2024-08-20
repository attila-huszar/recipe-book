import js from '@eslint/js'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginImportX from 'eslint-plugin-import-x'
import globals from 'globals'

export default [
  js.configs.recommended,
  configPrettier,
  {
    ignores: ['dist/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'import-x': pluginImportX,
      prettier: pluginPrettier,
    },
    rules: {
      'import-x/no-unresolved': 'error',
      'prettier/prettier': 'warn',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
]
