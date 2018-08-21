// Bow shape

import Object2D from '../base/Object2D.js'

import Line from '../shapes/Line.js'
import Point from '../shapes/Point.js'

class Bow extends Object2D {
  static initClass () {
    this.prototype.type = 'Bow'
    this.prototype.fillable = true
  }

  constructor (cx, cy, radius, aFrom, aTo) {
    super()

    this.cx = cx
    this.cy = cy
    this.radius = radius
    this.aFrom = aFrom
    this.aTo = aTo

    if (this.aFrom > this.aTo) {
      [this.aFrom, this.aTo] = [this.aTo, this.aFrom]
    }

    this.center = new Point(this.cx, this.cy)
    this.string = new Line(
      this.center.arcTo(this.radius, this.aFrom),
      this.center.arcTo(this.radius, this.aTo),
    )
    this.keyPoints = this.string.points

    this.updateKeyPoints()
    this.on('changed', this.updateKeyPoints)
    this.on('changed', () => {
      if (this.bounds != null) {
        this.bounds.update()
      }
    })
  }

  clone () {
    return new Bow(this.cx, this.cy, this.radius, this.aFrom, this.aTo)
  }

  updateKeyPoints () {
    this.center.set(this.cx, this.cy)
    this.string.points[0].copy(this.center.arcTo(this.radius, this.aFrom))
    this.string.points[1].copy(this.center.arcTo(this.radius, this.aTo))
    this.keyPoints = this.string.points
    return this
  }
}
Bow.initClass()

export default Bow
