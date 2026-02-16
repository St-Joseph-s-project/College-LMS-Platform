import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // Allow `src/api/apiservice.ts` to import the internal axios instance
  {
    files: ['src/api/apiservice.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // General rules for the project: disallow importing the raw axios interceptor
  // from anywhere except `src/api/apiservice.ts`. This enforces using the
  // `getApi`/`postApi` helpers which manage loading state and toasts.
  {
    files: ['**/*.{ts,tsx}'],
    excludedFiles: ['src/api/apiservice.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          '**/axiosinterceptor',
          '**/axiosinterceptor.*',
          'axiosinterceptor'
        ]
      }]
    }
  },
])
