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
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
