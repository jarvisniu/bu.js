import coffeescript from 'rollup-plugin-coffee-script'
import eslint from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

import pkg from './package.json'

let banner = `// bu.js v${ pkg.version } - https://github.com/jarvisniu/bu.js\n`

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
    eslint({ include: 'src/**/*.js' }),
    coffeescript(),
    babel({ babelrc: false, presets: ['es2015-rollup'] }),
    serve({
      contentBase: '',
      port: 3000,
      // open: true,
    }),
    livereload({
      watch: ['build', 'examples'],
    }),
  ],
}
