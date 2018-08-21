// Circle shape

import Object2D from '../base/Object2D.js'

import Point from '../shapes/Point.js'

class Circle extends Object2D {
  static initClass () {
    this.prototype.type = 'Circle'
    this.prototype.fillable = true

    // property

    this.property('cx', {
      get () {
        return this._center.x
      },
      set (val) {
        this._center.x = val
        return this.trigger('centerChanged', this)
      },
    })

    this.property('cy', {
      get () {
        return this._center.y
      },
      set (val) {
        this._center.y = val
        return this.trigger('centerChanged', this)
      },
    })

    this.property('center', {
      get () {
        return this._center
      },
      set (val) {
        this._center = val
        this.cx = val.x
        this.cy = val.y
        this.keyPoints[0] = val
        return this.trigger('centerChanged', this)
      },
    })

    this.property('radius', {
      get () {
        return this._radius
      },
      set (val) {
        this._radius = val
        this.trigger('radiusChanged', this)
        return this
      },
    })
  }

  constructor (_radius, cx, cy) {
    super()

    if (_radius == null) {
      _radius = 1
    }
    this._radius = _radius
    if (cx == null) {
      cx = 0
    }
    if (cy == null) {
      cy = 0
    }

    this._center = new Point(cx, cy)
    this.bounds = null // for accelerate contain test

    this.keyPoints = [this._center]
    this.on('centerChanged', this.updateKeyPoints)
  }

  clone () {
    return new Circle(this.radius, this.cx, this.cy)
  }

  updateKeyPoints () {
    return this.keyPoints[0].set(this.cx, this.cy)
  }
}
Circle.initClass()

export default Circle
