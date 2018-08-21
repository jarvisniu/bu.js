// Geometry Algorithm Collection

import utils from '../utils.js'

import Bow from '../shapes/Bow.js'
import Circle from '../shapes/Circle.js'
import Ellipse from '../shapes/Ellipse.js'
import Fan from '../shapes/Fan.js'
import Line from '../shapes/Line.js'
import Point from '../shapes/Point.js'
import Polygon from '../shapes/Polygon.js'
import Polyline from '../shapes/Polyline.js'
import Rectangle from '../shapes/Rectangle.js'
// import Spline from '../shapes/Spline.js'
import Triangle from '../shapes/Triangle.js'

let G = {

  inject () {
    this.injectInto([
      'point',
      'line',
      'circle',
      'ellipse',
      'triangle',
      'rectangle',
      'fan',
      'bow',
      'polygon',
      'polyline',
    ])
  },

  injectInto (shapes) {
    if (typeof shapes === 'string') {
      shapes = [shapes]
    }

    if (Array.from(shapes).includes('point')) {
      Point.prototype.inCircle = function (circle) {
        return G.pointInCircle(this, circle)
      }
      Point.prototype.distanceTo = function (point) {
        return G.distanceFromPointToPoint(this, point)
      }
      Point.prototype.isNear = function (target, limit) {
        if (limit == null) {
          limit = utils.DEFAULT_NEAR_DIST
        }
        switch (target.type) {
          case 'Point':
            return G.pointNearPoint(this, target, limit)
          case 'Line':
            return G.pointNearLine(this, target, limit)
          case 'Polyline':
            return G.pointNearPolyline(this, target, limit)
        }
      }
      Point.interpolate = G.interpolateBetweenTwoPoints
    }

    if (Array.from(shapes).includes('line')) {
      Line.prototype.distanceTo = function (point) {
        return G.distanceFromPointToLine(point, this)
      }
      Line.prototype.isTwoPointsSameSide = function (p1, p2) {
        return G.twoPointsSameSideOfLine(p1, p2, this)
      }
      Line.prototype.footPointFrom = function (point, saveTo) {
        return G.footPointFromPointToLine(point, this, saveTo)
      }
      Line.prototype.getCrossPointWith = function (line) {
        return G.getCrossPointOfTwoLines(line, this)
      }
      Line.prototype.isCrossWithLine = function (line) {
        return G.isTwoLinesCross(line, this)
      }
      Rectangle.prototype.intersectRect = function (rect) {
        return G.isLineIntersectRect(this, rect)
      }
    }

    if (Array.from(shapes).includes('circle')) {
      Circle.prototype._containsPoint = function (point) {
        return G.pointInCircle(point, this)
      }
    }

    if (Array.from(shapes).includes('ellipse')) {
      Ellipse.prototype._containsPoint = function (point) {
        return G.pointInEllipse(point, this)
      }
    }

    if (Array.from(shapes).includes('triangle')) {
      Triangle.prototype._containsPoint = function (point) {
        return G.pointInTriangle(point, this)
      }
      Triangle.prototype.area = function () {
        return G.calcTriangleArea(this)
      }
    }

    if (Array.from(shapes).includes('rectangle')) {
      Rectangle.prototype.containsPoint = function (point) {
        return G.pointInRectangle(point, this)
      }
      Rectangle.prototype.intersectLine = function (line) {
        return G.isLineIntersectRect(line, this)
      }
    }

    if (Array.from(shapes).includes('fan')) {
      Fan.prototype._containsPoint = function (point) {
        return G.pointInFan(point, this)
      }
    }

    if (Array.from(shapes).includes('bow')) {
      Bow.prototype._containsPoint = function (point) {
        return G.pointInBow(point, this)
      }
    }

    if (Array.from(shapes).includes('polygon')) {
      Polygon.prototype._containsPoint = function (point) {
        return G.pointInPolygon(point, this)
      }
    }

    if (Array.from(shapes).includes('polyline')) {
      Polyline.prototype.length = 0
      Polyline.prototype.pointNormalizedPos = []
      Polyline.prototype.calcLength = function () {
        this.length = G.calcPolylineLength(this)
      }
      Polyline.prototype.calcPointNormalizedPos = function () {
        return G.calcNormalizedVerticesPosOfPolyline(this)
      }
      Polyline.prototype.getNormalizedPos = function (index) {
        if (index != null) {
          return this.pointNormalizedPos[index]
        } else {
          return this.pointNormalizedPos
        }
      }
      Polyline.prototype.compress = function (strength) {
        if (strength == null) {
          strength = 0.8
        }
        return G.compressPolyline(this, strength)
      }
    }
  },

  // Point in shapes

  pointNearPoint (point, target, limit) {
    if (limit == null) {
      limit = utils.DEFAULT_NEAR_DIST
    }
    return point.distanceTo(target) < limit
  },

  pointNearLine (point, line, limit) {
    if (limit == null) {
      limit = utils.DEFAULT_NEAR_DIST
    }
    const verticalDist = line.distanceTo(point)
    const footPoint = line.footPointFrom(point)

    const isBetween1 = footPoint.distanceTo(line.points[0]) < (line.length + limit)
    const isBetween2 = footPoint.distanceTo(line.points[1]) < (line.length + limit)

    return (verticalDist < limit) && isBetween1 && isBetween2
  },

  pointNearPolyline (point, polyline, limit) {
    if (limit == null) {
      limit = utils.DEFAULT_NEAR_DIST
    }
    for (let line of Array.from(polyline.lines)) {
      if (G.pointNearLine(point, line, limit)) {
        return true
      }
    }
    return false
  },

  pointInCircle (point, circle) {
    const dx = point.x - circle.cx
    const dy = point.y - circle.cy
    return utils.bevel(dx, dy) < circle.radius
  },

  pointInEllipse (point, ellipse) {
    return utils.bevel(point.x / ellipse.radiusX, point.y / ellipse.radiusY) < 1
  },

  pointInRectangle (point, rectangle) {
    return (point.x > rectangle.pointLT.x) &&
      (point.y > rectangle.pointLT.y) &&
      (point.x < (rectangle.pointLT.x + rectangle.size.width)) &&
      (point.y < (rectangle.pointLT.y + rectangle.size.height))
  },

  pointInTriangle (point, triangle) {
    return G.twoPointsSameSideOfLine(point, triangle.points[2], triangle.lines[0]) &&
      G.twoPointsSameSideOfLine(point, triangle.points[0], triangle.lines[1]) &&
      G.twoPointsSameSideOfLine(point, triangle.points[1], triangle.lines[2])
  },

  pointInFan (point, fan) {
    const dx = point.x - fan.cx
    const dy = point.y - fan.cy
    let a = Math.atan2(point.y - fan.cy, point.x - fan.cx)
    while (a < fan.aFrom) {
      a += utils.TWO_PI
    }
    return (utils.bevel(dx, dy) < fan.radius) && (a > fan.aFrom) && (a < fan.aTo)
  },

  pointInBow (point, bow) {
    if (utils.bevel(bow.cx - point.x, bow.cy - point.y) < bow.radius) {
      const sameSide = bow.string.isTwoPointsSameSide(bow.center, point)
      const smallThanHalfCircle = (bow.aTo - bow.aFrom) < Math.PI
      return sameSide ^ smallThanHalfCircle
    } else {
      return false
    }
  },

  pointInPolygon (point, polygon) {
    for (let triangle of Array.from(polygon.triangles)) {
      if (triangle.containsPoint(point)) {
        return true
      }
    }
    return false
  },

  // Distance

  distanceFromPointToPoint (point1, point2) {
    return utils.bevel(point1.x - point2.x, point1.y - point2.y)
  },

  distanceFromPointToLine (point, line) {
    const p1 = line.points[0]
    const p2 = line.points[1]
    const a = (p1.y - p2.y) / (p1.x - p2.x)
    const b = p1.y - (a * p1.x)
    return Math.abs(((a * point.x) + b) - point.y) / Math.sqrt((a * a) + 1)
  },

  // Point Related

  interpolateBetweenTwoPoints (p1, p2, k, p3) {
    const x = p1.x + ((p2.x - p1.x) * k)
    const y = p1.y + ((p2.y - p1.y) * k)

    if (p3 != null) {
      return p3.set(x, y)
    } else {
      return new Point(x, y)
    }
  },

  // Point with Line

  twoPointsSameSideOfLine (p1, p2, line) {
    const pA = line.points[0]
    const pB = line.points[1]
    if (pA.x === pB.x) {
      // if both of the two points are on the line then we consider they are in the same side
      return ((p1.x - pA.x) * (p2.x - pA.x)) > 0
    } else {
      const y01 = (((pA.y - pB.y) * (p1.x - pA.x)) / (pA.x - pB.x)) + pA.y
      const y02 = (((pA.y - pB.y) * (p2.x - pA.x)) / (pA.x - pB.x)) + pA.y
      return ((p1.y - y01) * (p2.y - y02)) > 0
    }
  },

  footPointFromPointToLine (point, line, saveTo) {
    if (saveTo == null) {
      saveTo = new Point()
    }
    const p1 = line.points[0]
    const p2 = line.points[1]
    const A = (p1.y - p2.y) / (p1.x - p2.x)
    const B = p1.y - (A * p1.x)
    const m = point.x + (A * point.y)
    const x = (m - (A * B)) / ((A * A) + 1)
    const y = (A * x) + B

    saveTo.set(x, y)
    return saveTo
  },

  getCrossPointOfTwoLines (line1, line2) {
    const [p1, p2] = Array.from(line1.points)
    const [q1, q2] = Array.from(line2.points)

    const a1 = p2.y - p1.y
    const b1 = p1.x - p2.x
    const c1 = (a1 * p1.x) + (b1 * p1.y)
    const a2 = q2.y - q1.y
    const b2 = q1.x - q2.x
    const c2 = (a2 * q1.x) + (b2 * q1.y)
    const det = (a1 * b2) - (a2 * b1)

    return new Point(((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det)
  },

  isTwoLinesCross (line1, line2) {
    let x0, y0
    const x1 = line1.points[0].x
    const y1 = line1.points[0].y
    const x2 = line1.points[1].x
    const y2 = line1.points[1].y
    const x3 = line2.points[0].x
    const y3 = line2.points[0].y
    const x4 = line2.points[1].x
    const y4 = line2.points[1].y

    const d = ((y2 - y1) * (x4 - x3)) - ((y4 - y3) * (x2 - x1))

    if (d === 0) {
      return false
    } else {
      x0 = ((((x2 - x1) * (x4 - x3) * (y3 - y1)) + ((y2 - y1) * (x4 - x3) * x1)) - ((y4 - y3) * (x2 - x1) * x3)) / d
      y0 = ((((y2 - y1) * (y4 - y3) * (x3 - x1)) + ((x2 - x1) * (y4 - y3) * y1)) - ((x4 - x3) * (y2 - y1) * y3)) / -d
    }
    return (((x0 - x1) * (x0 - x2)) <= 0) &&
        (((x0 - x3) * (x0 - x4)) <= 0) &&
        (((y0 - y1) * (y0 - y2)) <= 0) &&
        (((y0 - y3) * (y0 - y4)) <= 0)
  },

  // Line with rectangle

  isLineIntersectRect (line, rect) {
    const lines = [new Line(), new Line(), new Line(), new Line()]
    lines[0].set(rect.points[0], rect.points[1])
    lines[1].set(rect.points[1], rect.points[2])
    lines[2].set(rect.points[2], rect.points[3])
    lines[3].set(rect.points[3], rect.points[0])
    // console.log line.points[0].x, line.points[0].y, rect.points[0].x, rect.points[0].y
    return G.isTwoLinesCross(line, lines[0]) ||
      G.isTwoLinesCross(line, lines[1]) ||
      G.isTwoLinesCross(line, lines[2]) ||
      G.isTwoLinesCross(line, lines[3])
  },

  // Polyline

  calcPolylineLength (polyline) {
    let len = 0
    if (polyline.vertices.length >= 2) {
      for (let i = 1, end = polyline.vertices.length, asc = end >= 1; asc ? i < end : i > end; asc ? i++ : i--) {
        len += polyline.vertices[i].distanceTo(polyline.vertices[i - 1])
      }
    }
    return len
  },

  calcNormalizedVerticesPosOfPolyline (polyline) {
    let currPos = 0
    polyline.pointNormalizedPos[0] = 0
    return (() => {
      const result = []
      for (let i = 1, end = polyline.vertices.length, asc = end >= 1; asc ? i < end : i > end; asc ? i++ : i--) {
        currPos += polyline.vertices[i].distanceTo(polyline.vertices[i - 1]) / polyline.length
        result.push(polyline.pointNormalizedPos[i] = currPos)
      }
      return result
    })()
  },

  compressPolyline (polyline, strength) {
    const compressed = []
    for (let i of Object.keys(polyline.vertices)) {
      if (i < 2) {
        compressed[i] = polyline.vertices[i]
      } else {
        const [pA, pM] = Array.from(compressed.slice(-2))
        const pB = polyline.vertices[i]
        const obliqueAngle = Math.abs(Math.atan2(pA.y - pM.y, pA.x - pM.x) - Math.atan2(pM.y - pB.y, pM.x - pB.x))
        if (obliqueAngle < (strength * strength * utils.HALF_PI)) {
          compressed[compressed.length - 1] = pB
        } else {
          compressed.push(pB)
        }
      }
    }
    polyline.vertices = compressed
    polyline.keyPoints = polyline.vertices
    return polyline
  },

  // Area Calculation

  calcTriangleArea (triangle) {
    const [a, b, c] = Array.from(triangle.points)
    return Math.abs(((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y))) / 2
  },
}

G.inject()

export default G
