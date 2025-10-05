// ESLint Flat Config
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files-new
import js from '@eslint/js'
import globals from 'globals'
import pluginHtml from 'eslint-plugin-html'
import eslintPluginImport from 'eslint-plugin-import'
import pluginLit from 'eslint-plugin-lit'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginWc from 'eslint-plugin-wc'

export default [
  js.configs.recommended,
  prettierRecommended,
  {
    name: 'globals',
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // explicit overrides or additions
        window: 'readonly',
        document: 'readonly',
        customElements: 'readonly',
        URL: 'readonly',
      },
    },
  },
  {
    name: 'project',
    files: ['**/*.{js,mjs,cjs}', '**/*.html'],
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', 'public/**'],
    plugins: {
      import: eslintPluginImport,
      html: pluginHtml,
      wc: pluginWc,
      lit: pluginLit,
    },
    rules: {
      // Core
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': [
        'warn',
        {
          allow: [
            'warn',
            'error',
            'log',
            'info',
            'debug',
            'table',
            'time',
            'timeEnd',
            'group',
            'groupEnd',
          ],
        },
      ],

      // import plugin
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // web components and lit best practices
      'wc/guard-super-call': 'error',
      'wc/no-constructor-params': 'error',
      'lit/no-legacy-template-syntax': 'warn',
      'lit/no-property-change-update': 'warn',
      'lit/no-useless-template-literals': 'warn',
    },
  },
]
