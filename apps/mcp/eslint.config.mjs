import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      // _ を冒頭につけることで未使用変数を許可
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // anyの明示的な使用を禁止
      '@typescript-eslint/no-explicit-any': 'error',

      // Node.js API用の設定
      'no-console': 'off', // サーバーログ用にconsoleを許可
      'prefer-const': 'error',
    },
  },
];