import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from "eslint-plugin-boundaries";
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    plugins: { boundaries },
    files: ['**/*.{ts,tsx}'],
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
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.app.json",
        },
      },
      "boundaries/elements": [
        { type: "app", pattern: "src/app", mode: "folder" },
        { type: "feature", pattern: "src/features/*", mode: "folder", capture: ["feature"] },
        { type: "shared", pattern: "src/shared", mode: "folder" },
      ],
    },
    rules: {
      // tolera archivos fuera de las capas (main.tsx, assets…)
      ...boundaries.configs.recommended.rules,

      "boundaries/dependencies": [2, {
        default: "disallow",
        message: "{{from.type}} no puede importar {{to.type}} — rompe la dirección app → features → shared",
        rules: [
          // app (nucleo): puede usar features y shared
          { from: { type: "app" }, allow: { to: { type: ["app", "feature", "shared"] } } },
          // features: solo shared y otras features (vía su API pública)
          { from: { type: "feature" }, allow: { to: { type: ["feature", "shared"] } } },
          // shared: solo podrán importarse entre si
          { from: { type: "shared" }, allow: { to: { type: ["shared"] } } },
        ],
      }],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
])
