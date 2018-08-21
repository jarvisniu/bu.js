// polygon shape

import utils from '../utils.js'
import Object2D from '../base/Object2D.js'

import Line from '../shapes/Line.js'
import Point from '../shapes/Point.js'
import Triangle from '../shapes/Triangle.js'

class Polygon extends Object2D {
  static initClass () {
    this.prototype.type = 'Polygon'
    this.prototype.fillable = true
  }

  /*
    constructors
    1. Polygon(points)
    2. Polygon(x, y, radius, n, options): to generate regular polygon
      options: angle - start angle of regular polygon
  */
  constructor (points) {
    super()

    this.vertices = []
    this.lines = []
    this.triangles = []

    const options = utils.combineOptions(arguments, {
      angle: 0,
    })

    if (utils.isArray(points)) {
      if (points != null) {
        this.vertices = points
      }
    } else {
      let n, radius, x, y
      if (arguments.length < 4) {
        x = 0
        y = 0
        radius = arguments[0]
        n = arguments[1]
      } else {
        x = arguments[0]
        y = arguments[1]
        radius = arguments[2]
        n = arguments[3]
      }
      this.vertices = Polygon.generateRegularPoints(x, y, radius, n, options)
    }

    this.onVerticesChanged()
    this.on('changed', this.onVerticesChanged)
    this.on('changed', () => {
      if (this.bounds != null) {
        this.bounds.update()
      }
    })
    this.keyPoints = this.vertices
  }

  clone () {
    return new Polygon(this.vertices)
  }

  onVerticesChanged () {
    this.lines = []
    this.triangles = []
    // init lines
    if (this.vertices.length > 1) {
      for (let i = 0; i < this.vertices.length - 1; i++) {
        this.lines.push(new Line(this.vertices[i], this.vertices[i + 1]))
      }
      this.lines.push(new Line(this.vertices[this.vertices.length - 1], this.vertices[0]))
    }

    // init triangles
    if (this.vertices.length > 2) {
      for (let i = 1; i < this.vertices.length - 1; i++) {
        this.triangles.push(new Triangle(this.vertices[0], this.vertices[i], this.vertices[i + 1]))
      }
    }
  }

  // detect

  isSimple () {
    const len = this.lines.length
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; i < len; i++) {
        if (this.lines[i].isCrossWithLine(this.lints[j])) {
          return false
        }
      }
    }
    return true
  }

  // edit

  addPoint (point, insertIndex) {
    if ((insertIndex == null)) {
      // add point
      this.vertices.push(point)

      // add line
      if (this.vertices.length > 1) {
        this.lines[this.lines.length - 1].points[1] = point
      }
      if (this.vertices.length > 0) {
        this.lines.push(new Line(this.vertices[this.vertices.length - 1], this.vertices[0]))
      }

      // add triangle
      if (this.vertices.length > 2) {
        return this.triangles.push(new Triangle(
          this.vertices[0],
          this.vertices[this.vertices.length - 2],
          this.vertices[this.vertices.length - 1],
        ))
      }
    } else {
      return this.vertices.splice(insertIndex, 0, point)
    }
  }
  // TODO add lines and triangles

  static generateRegularPoints (cx, cy, radius, n, options) {
    let angleDelta = options.angle
    let r = radius
    let points = []
    let angleSection = utils.TWO_PI / n
    for (let i = 0; i < n; i++) {
      let a = (i * angleSection) + angleDelta
      let x = cx + (r * Math.cos(a))
      let y = cy + (r * Math.sin(a))
      points[i] = new Point(x, y)
    }
    return points
  }
}
Polygon.initClass()

export default Polygon
