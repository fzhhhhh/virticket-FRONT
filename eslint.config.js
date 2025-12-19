import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'node_modules', '.next'] }, // ✅ Ignora más directorios innecesarios
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021, // ✅ Actualización a ES2021
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    env: { // ✅ Definir entorno explícitamente
      browser: true,
      es2021: true,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // ✅ Ajuste para configuraciones globales
      'react-hooks/exhaustive-deps': 'warn', // ✅ Mejor control de dependencias en Hooks
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];