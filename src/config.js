// global config

import Bu from './base/Bu.js'

let config = {
  originAtCenter: true,
  font: '12px Verdana',
  background: '#eee',
  showKeyPoints: false,
}

let cursor = 'default'
Object.defineProperty(config, 'cursor', {
  get () {
    return cursor
  },
  set (val) {
    cursor = val
    for (let bu of Bu.$bues) {
      bu.$renderer.dom.style.cursor = cursor
    }
  },
})

export default config
