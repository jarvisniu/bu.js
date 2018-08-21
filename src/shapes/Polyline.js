// polyline shape

import Object2D from '../base/Object2D.js'

import Line from '../shapes/Line.js'
import Point from '../shapes/Point.js'

class Polyline extends Object2D {
  static initClass () {
    this.prototype.type = 'Polyline'
    this.prototype.fillable = false
  }

  constructor (vertices = []) {
    super()

    this.vertices = vertices

    if (arguments.length > 1) {
      vertices = []
      for (let i = 0; i < arguments.length / 2; i++) {
        vertices.push(new Point(arguments[i * 2], arguments[(i * 2) + 1]))
      }
      this.vertices = vertices
    }

    this.lines = []
    this.keyPoints = this.vertices

    this.fill(false)

    this.on('changed', () => {
      if (this.vertices.length > 1) {
        this.updateLines()
        if (typeof this.calcLength === 'function') {
          this.calcLength()
        }
        if (typeof this.calcPointNormalizedPos === 'function') {
          this.calcPointNormalizedPos()
        }
      }
    })
    this.trigger('changed')
  }

  clone () {
    const polyline = new Polyline(this.vertices)
    polyline.strokeStyle = this.strokeStyle
    polyline.fillStyle = this.fillStyle
    polyline.dashStyle = this.dashStyle
    polyline.lineWidth = this.lineWidth
    polyline.dashOffset = this.dashOffset
    return polyline
  }

  updateLines () {
    for (let i = 0, end = this.vertices.length - 1, asc = end >= 0; asc ? i < end : i > end; asc ? i++ : i--) {
      if (this.lines[i] != null) {
        this.lines[i].set(this.vertices[i], this.vertices[i + 1])
      } else {
        this.lines[i] = new Line(this.vertices[i], this.vertices[i + 1])
      }
    }
    // TODO remove the rest
    return this
  }

  set (points) {
    // points
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].copy(points[i])
    }

    // remove the extra points
    if (this.vertices.length > points.length) {
      this.vertices.splice(points.length)
    }

    this.trigger('changed')
    return this
  }

  addPoint (point, insertIndex) {
    if ((insertIndex == null)) {
      // add point
      this.vertices.push(point)
      // add line
      if (this.vertices.length > 1) {
        this.lines.push(new Line(
          this.vertices[this.vertices.length - 2],
          this.vertices[this.vertices.length - 1],
        ))
      }
    } else {
      this.vertices.splice(insertIndex, 0, point)
    }
    // TODO add lines
    this.trigger('changed')
    return this
  }
}
Polyline.initClass()

export default Polyline
