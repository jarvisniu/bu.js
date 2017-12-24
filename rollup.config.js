import coffeescript from 'rollup-plugin-coffee-script'
import eslint from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

let banner = '// Bu.js v' + pkg.version + ' - https://github.com/jarvisniu/Bu.js\n'

export default {
  input: 'src/index.js',
  output: {
    file: 'build/bu.js',
    format: 'iife',
    name: 'Bu',
    sourcemap: true,
    banner,
  },
  plugins: [
    eslint({include: 'src/**/*.js'}),
    coffeescript(),
    babel({babelrc: false, presets: ['es2015-rollup']}),
  ],
}
