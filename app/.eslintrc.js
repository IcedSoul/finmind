module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: [
    'metro.config.js',
    'react-native.config.js',
    'babel.config.js',
    'eslintrc.js',
    'index.js',
    '.eslintrc.js',
    'web/polyfills.js',
    'analyze_i18n_structure.js'
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
