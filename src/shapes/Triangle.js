// triangle shape

import Object2D from '../base/Object2D.js'

import Line from '../shapes/Line.js'
import Point from '../shapes/Point.js'

class Triangle extends Object2D {
  static initClass () {
    this.prototype.type = 'Triangle'
    this.prototype.fillable = true
  }

  constructor (p1, p2, p3) {
    super()

    if (arguments.length === 6) {
      const [x1, y1, x2, y2, x3, y3] = Array.from(arguments)
      p1 = new Point(x1, y1)
      p2 = new Point(x2, y2)
      p3 = new Point(x3, y3)
    }

    this.lines = [
      new Line(p1, p2),
      new Line(p2, p3),
      new Line(p3, p1),
    ]
    // @center = new Point average(p1.x, p2.x, p3.x), average(p1.y, p2.y, p3.y)
    this.points = [p1, p2, p3]
    this.keyPoints = this.points
    this.on('changed', this.update)
    this.on('changed', () => {
      if (this.bounds != null) {
        this.bounds.update()
      }
    })
  }

  clone () {
    return new Triangle(this.points[0], this.points[1], this.points[2])
  }

  update () {
    this.lines[0].points[0].copy(this.points[0])
    this.lines[0].points[1].copy(this.points[1])
    this.lines[1].points[0].copy(this.points[1])
    this.lines[1].points[1].copy(this.points[2])
    this.lines[2].points[0].copy(this.points[2])
    this.lines[2].points[1].copy(this.points[0])
  }
}
Triangle.initClass()

export default Triangle
