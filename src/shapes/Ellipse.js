// Ellipse/Oval Shape

import Object2D from '../base/Object2D.js'

class Ellipse extends Object2D {
  constructor (_radiusX = 20, _radiusY = 10) {
    super()
    this._radiusX = _radiusX
    this._radiusY = _radiusY
  }

  get radiusX () {
    return this._radiusX
  }
  set radiusX (val) {
    this._radiusX = val
    return this.trigger('changed', this)
  }

  get radiusY () {
    return this._radiusY
  }
  set radiusY (val) {
    this._radiusY = val
    return this.trigger('changed', this)
  }
}

Ellipse.prototype.type = 'Ellipse'
Ellipse.prototype.fillable = true

export default Ellipse
