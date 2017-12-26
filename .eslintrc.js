module.exports = {
  extends: 'standard',
  globals: {
    "alert": true,
    "Bu": true,
    "AStar": true,
  },
  rules: {
    'no-extend-native': 0,
    'no-new': 0,
    'no-unused-vars': 0,
    'import/first': 0,
    'comma-dangle': [2, 'always-multiline'],
    'no-multi-spaces': [2, {'ignoreEOLComments': true}],
  },
  plugins: ['html'],
}
