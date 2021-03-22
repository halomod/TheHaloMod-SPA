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
    parser: 'babel-eslint',
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
