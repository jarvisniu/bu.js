// global config

import Bu from './base/Bu.js'

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
    for (let bu of Bu.$bues) {
      bu.$renderer.dom.style.cursor = this._cursor
    }
  },
}

export default config
