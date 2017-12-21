import coffeescript from 'rollup-plugin-coffee-script'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default [
  {
    input: 'src/index.coffee',
    output: {
      file: 'build/bu.js',
      format: 'iife',
      name: 'Bu',
      sourcemap: true,
    },
    plugins: [
      coffeescript(),
    ],
  },
  {
    input: 'src/index.coffee',
    output: {
      file: 'build/bu.min.js',
      format: 'iife',
      name: 'Bu',
    },
    plugins: [
      coffeescript(),
      babel(),
      uglify(),
    ],
  }
]
