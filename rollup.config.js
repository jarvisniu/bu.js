import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

import pkg from './package.json'

let banner = `// bu.js v${pkg.version} - https://github.com/jarvisniu/bu.js\n`

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
    babel({ exclude: 'node_modules/**' }),
    serve({
      contentBase: '',
      port: 3000,
    }),
    livereload({
      watch: ['build', 'examples'],
    }),
  ],
}
