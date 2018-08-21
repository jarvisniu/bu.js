// Ellipse/Oval Shape

import Object2D from '../base/Object2D.js'

class Ellipse extends Object2D {
  static initClass () {
    this.prototype.type = 'Ellipse'
    this.prototype.fillable = true

    // property

    this.property('radiusX', {
      get () {
        return this._radiusX
      },
      set (val) {
        this._radiusX = val
        return this.trigger('changed', this)
      },
    },
    )

    this.property('radiusY', {
      get () {
        return this._radiusY
      },
      set (val) {
        this._radiusY = val
        return this.trigger('changed', this)
      },
    },
    )
  }

  constructor (_radiusX, _radiusY) {
    super()
    if (_radiusX == null) {
      _radiusX = 20
    }
    this._radiusX = _radiusX
    if (_radiusY == null) {
      _radiusY = 10
    }
    this._radiusY = _radiusY
  }
}
Ellipse.initClass()

export default Ellipse
