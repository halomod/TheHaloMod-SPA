const path = require('path');
const { DEFAULT_RESOLVER_SETTING } = require('@vue/eslint-config-airbnb/createAliasSetting');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  settings: {
    'import/resolver': {
      ...DEFAULT_RESOLVER_SETTING,
      [require.resolve('eslint-import-resolver-custom-alias')]: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
        // Adds `.vue` to the default extensions list so single-file
        // components resolve through the `@` alias.
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.vue'],
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    /**
     * Turned off because quite a few variables from the HaloMod library
     * that use underscores for variable names are used.
     */
    camelcase: 'off',
    /**
     * Turned off because it doesn't allow importing a component from a folder
     * where `index.vue` might exist. This is proper formatting though according
     * to vue: https://vueschool.io/articles/vuejs-tutorials/structuring-vue-components/
     */
    'import/extensions': 'off',
    /**
     * Turned off because some of the parameters that come in from the server
     * have a leading underscore.
     */
    'no-underscore-dangle': [0],
    'no-irregular-whitespace': [0],
    /**
     * The rules below are newly introduced (or newly enforced) by the
     * @vue/eslint-config-airbnb 8 / eslint-plugin-vue 9 upgrade. Fixing the
     * codebase to satisfy them is a real, separate effort (renaming
     * long-standing single-word component names, auditing template
     * accessibility, adding default values to every prop, etc.), not a
     * side effect of a dependency version bump, so they're turned off here
     * pending that follow-up work.
     */
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/eqeqeq': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/alt-text': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    'vue/no-template-target-blank': 'off',
    'vue/no-mutating-props': 'off',
    'class-methods-use-this': 'off',
    'prefer-regex-literals': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/**/*.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
