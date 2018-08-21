// line shape

import Object2D from '../base/Object2D.js'

import Point from '../shapes/Point.js'

class Line extends Object2D {
  static initClass () {
    this.prototype.type = 'Line'
    this.prototype.fillable = false
  }

  constructor (p1, p2, p3, p4) {
    super()

    if (arguments.length < 2) {
      this.points = [new Point(), new Point()]
    } else if (arguments.length < 4) {
      this.points = [p1.clone(), p2.clone()]
    } else {  // if len >= 4
      this.points = [new Point(p1, p2), new Point(p3, p4)]
    }

    this.length = 0
    this.midpoint = new Point()
    this.keyPoints = this.points

    this.on('changed', () => {
      this.length = this.points[0].distanceTo(this.points[1])
      return this.midpoint.set((this.points[0].x + this.points[1].x) / 2, (this.points[0].y + this.points[1].y) / 2)
    })

    this.trigger('changed')
  }

  clone () {
    return new Line(this.points[0], this.points[1])
  }

  // edit

  set (a1, a2, a3, a4) {
    if (a4 != null) {
      this.points[0].set(a1, a2)
      this.points[1].set(a3, a4)
    } else {
      this.points[0] = a1
      this.points[1] = a2
    }
    this.trigger('changed')
    return this
  }

  setPoint1 (a1, a2) {
    if (a2 != null) {
      this.points[0].set(a1, a2)
    } else {
      this.points[0].copy(a1)
    }
    this.trigger('changed')
    return this
  }

  setPoint2 (a1, a2) {
    if (a2 != null) {
      this.points[1].set(a1, a2)
    } else {
      this.points[1].copy(a1)
    }
    this.trigger('changed')
    return this
  }
}
Line.initClass()

export default Line
