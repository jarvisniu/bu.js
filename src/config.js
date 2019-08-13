// global config

import Bu from './core/Bu.js'

let config = {
  originAtCenter: true,
  font: '12px Verdana',
  background: '#eee',
  showKeyPoints: false,
  _cursor: 'default',
  get cursor() {
    return this._cursor
  },
  set cursor(val) {
    this._cursor = val
    for (let bu of Bu.$instances) {
      bu.$renderer.dom.style.cursor = this._cursor
    }
  },
}

export default config
