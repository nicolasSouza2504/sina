/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    process: 'readonly'
  },
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
