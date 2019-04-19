// spline shape

import utils from '../utils.js'
import Object2D from '../base/Object2D.js'

import Point from '../shapes/Point.js'
import Polyline from '../shapes/Polyline.js'

class Spline extends Object2D {
  constructor(vertices) {
    super()

    if (vertices instanceof Polyline) {
      let polyline = vertices
      this.vertices = polyline.vertices
      polyline.on('pointChange', polyline => {
        this.vertices = polyline.vertices
        return calcControlPoints(this)
      })
    } else {
      this.vertices = utils.clone(vertices)
    }

    this.keyPoints = this.vertices
    this.controlPointsAhead = []
    this.controlPointsBehind = []

    this.fill(false)
    this.smoothFactor = utils.DEFAULT_SPLINE_SMOOTH
    this._smoother = false

    calcControlPoints(this)
  }

  get smoother() {
    return this._smoother
  }
  set smoother(val) {
    let oldVal = this._smoother
    this._smoother = val
    if (oldVal !== this._smoother) {
      return calcControlPoints(this)
    }
  }

  clone() {
    return new Spline(this.vertices)
  }

  addPoint(point) {
    this.vertices.push(point)
    return calcControlPoints(this)
  }
}

Spline.prototype.type = 'Spline'
Spline.prototype.fillable = false

function calcControlPoints(spline) {
  spline.keyPoints = spline.vertices

  let p = spline.vertices
  let len = p.length
  if (len >= 1) {
    spline.controlPointsBehind[0] = p[0]
  }
  if (len >= 2) {
    spline.controlPointsAhead[len - 1] = p[len - 1]
  }
  if (len >= 3) {
    for (let i = 1; i < len - 1; i++) {
      let theta1 = Math.atan2(p[i].y - p[i - 1].y, p[i].x - p[i - 1].x)
      let theta2 = Math.atan2(p[i + 1].y - p[i].y, p[i + 1].x - p[i].x)
      let len1 = utils.bevel(p[i].y - p[i - 1].y, p[i].x - p[i - 1].x)
      let len2 = utils.bevel(p[i].y - p[i + 1].y, p[i].x - p[i + 1].x)
      let theta =
        theta1 +
        (theta2 - theta1) * (spline._smoother ? len1 / (len1 + len2) : 0.5)
      if (Math.abs(theta - theta1) > utils.HALF_PI) {
        theta += Math.PI
      }
      let xA = p[i].x - len1 * spline.smoothFactor * Math.cos(theta)
      let yA = p[i].y - len1 * spline.smoothFactor * Math.sin(theta)
      let xB = p[i].x + len2 * spline.smoothFactor * Math.cos(theta)
      let yB = p[i].y + len2 * spline.smoothFactor * Math.sin(theta)
      spline.controlPointsAhead[i] = new Point(xA, yA)
      spline.controlPointsBehind[i] = new Point(xB, yB)
    }
  }
}

// add control lines for debugging
// spline.children[i * 2 - 2] = new Line spline.vertices[i], spline.controlPointsAhead[i]
// spline.children[i * 2 - 1] =  new Line spline.vertices[i], spline.controlPointsBehind[i]

export default Spline
