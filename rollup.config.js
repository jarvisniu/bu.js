import { eslint } from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

import pkg from './package.json'

let banner = `// bu.js v${pkg.version} - https://github.com/jarvisniu/bu.js\n`

// build plugins
let plugins = [
  eslint({ include: 'src/**/*.js' }),
  json(),
  babel({ exclude: 'node_modules/**' }),
]

// dev plugins
if (process.env.ROLLUP_WATCH) {
  plugins = plugins.concat([
    serve({
      contentBase: '',
      port: 3000,
    }),
    livereload({
      watch: ['build', 'examples'],
    }),
  ])
}

let devOptions = {
  input: 'src/index.js',
  output: {
    file: 'build/bu.js',
    format: 'iife',
    name: 'Bu',
    sourcemap: true,
    banner,
  },
  plugins,
}

if (process.env.ROLLUP_WATCH) {
}

export default devOptions
