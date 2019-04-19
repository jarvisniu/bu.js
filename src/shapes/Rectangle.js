// rectangle shape

import Size from '../math/Size.js'
import Object2D from '../base/Object2D.js'

import Point from '../shapes/Point.js'

class Rectangle extends Object2D {
  constructor (x, y, width, height, cornerRadius = 0) {
    super()

    this.center = new Point(x + (width / 2), y + (height / 2))
    this.size = new Size(width, height)

    this.pointLT = new Point(x, y)
    this.pointRT = new Point(x + width, y)
    this.pointRB = new Point(x + width, y + height)
    this.pointLB = new Point(x, y + height)

    this.points = [this.pointLT, this.pointRT, this.pointRB, this.pointLB]

    this.cornerRadius = cornerRadius
    this.on('changed', () => {
      if (this.bounds != null) this.bounds.update()
    })
  }

  get cornerRadius () {
    return this._cornerRadius
  }
  set cornerRadius (val) {
    this._cornerRadius = val
    this.keyPoints = val > 0 ? [] : this.points
  }

  clone () {
    return new Rectangle(this.pointLT.x, this.pointLT.y, this.size.width, this.size.height)
  }

  set (x, y, width, height) {
    this.center.set(x + (width / 2), y + (height / 2))
    this.size.set(width, height)

    this.pointLT.set(x, y)
    this.pointRT.set(x + width, y)
    this.pointRB.set(x + width, y + height)
    return this.pointLB.set(x, y + height)
  }
}

Rectangle.prototype.type = 'Rectangle'
Rectangle.prototype.fillable = true

export default Rectangle
