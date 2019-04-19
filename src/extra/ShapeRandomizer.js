// Used to generate random shapes

import utils from '../utils.js'

import Bow from '../shapes/Bow.js'
import Circle from '../shapes/Circle.js'
import Ellipse from '../shapes/Ellipse.js'
import Fan from '../shapes/Fan.js'
import Line from '../shapes/Line.js'
import Point from '../shapes/Point.js'
import Polyline from '../shapes/Polyline.js'
import Polygon from '../shapes/Polygon.js'
import Rectangle from '../shapes/Rectangle.js'
import Triangle from '../shapes/Triangle.js'

const MARGIN = 30

class ShapeRandomizer {
  static initClass() {
    this.prototype.rangeX = 0
    this.prototype.rangeY = 0
    this.prototype.rangeWidth = 800
    this.prototype.rangeHeight = 450

    this.prototype.randomizeFan = this.prototype.randomizeBow
  }

  randomX() {
    return utils.rand(
      this.rangeX + MARGIN,
      this.rangeX + this.rangeWidth - MARGIN * 2,
    )
  }

  randomY() {
    return utils.rand(
      this.rangeY + MARGIN,
      this.rangeY + this.rangeHeight - MARGIN * 2,
    )
  }

  randomRadius() {
    return utils.rand(
      10,
      Math.min(this.rangeX + this.rangeWidth, this.rangeY + this.rangeHeight) /
        2,
    )
  }

  setRange(a, b, c, d) {
    if (c != null) {
      this.rangeX = a
      this.rangeY = b
      this.rangeWidth = c
      this.rangeHeight = d
    } else {
      this.rangeWidth = a
      this.rangeHeight = b
    }
    return this
  }

  generate(type) {
    switch (type) {
      case 'circle':
        return this.generateCircle()
      case 'bow':
        return this.generateBow()
      case 'triangle':
        return this.generateTriangle()
      case 'rectangle':
        return this.generateRectangle()
      case 'fan':
        return this.generateFan()
      case 'polygon':
        return this.generatePolygon()
      case 'line':
        return this.generateLine()
      case 'polyline':
        return this.generatePolyline()
      default:
        return console.warn(`not support shape: ${type}`)
    }
  }

  randomize(shape) {
    if (utils.isArray(shape)) {
      for (let s of Array.from(shape)) {
        this.randomize(s)
      }
    } else {
      switch (shape.type) {
        case 'Circle':
          this.randomizeCircle(shape)
          break
        case 'Ellipse':
          this.randomizeEllipse(shape)
          break
        case 'Bow':
          this.randomizeBow(shape)
          break
        case 'Triangle':
          this.randomizeTriangle(shape)
          break
        case 'Rectangle':
          this.randomizeRectangle(shape)
          break
        case 'Fan':
          this.randomizeFan(shape)
          break
        case 'Polygon':
          this.randomizePolygon(shape)
          break
        case 'Line':
          this.randomizeLine(shape)
          break
        case 'Polyline':
          this.randomizePolyline(shape)
          break
        default:
          console.warn(`not support shape: ${shape.type}`)
      }
    }
    return this
  }

  randomizePosition(shape) {
    shape.position.x = this.randomX()
    shape.position.y = this.randomY()
    shape.trigger('changed')
    return this
  }

  generateCircle() {
    const circle = new Circle(
      this.randomRadius(),
      this.randomX(),
      this.randomY(),
    )
    circle.center.label = 'O'
    return circle
  }

  randomizeCircle(circle) {
    circle.cx = this.randomX()
    circle.cy = this.randomY()
    circle.radius = this.randomRadius()
    return this
  }

  generateEllipse() {
    const ellipse = new Ellipse(this.randomRadius(), this.randomRadius())
    this.randomizePosition(ellipse)
    return ellipse
  }

  randomizeEllipse(ellipse) {
    ellipse.radiusX = this.randomRadius()
    ellipse.radiusY = this.randomRadius()
    this.randomizePosition(ellipse)
    return this
  }

  generateBow() {
    const aFrom = utils.rand(utils.TWO_PI)
    const aTo = aFrom + utils.rand(utils.HALF_PI, utils.TWO_PI)

    const bow = new Bow(
      this.randomX(),
      this.randomY(),
      this.randomRadius(),
      aFrom,
      aTo,
    )
    bow.string.points[0].label = 'A'
    bow.string.points[1].label = 'B'
    return bow
  }

  randomizeBow(bow) {
    const aFrom = utils.rand(utils.TWO_PI)
    const aTo = aFrom + utils.rand(utils.HALF_PI, utils.TWO_PI)

    bow.cx = this.randomX()
    bow.cy = this.randomY()
    bow.radius = this.randomRadius()
    bow.aFrom = aFrom
    bow.aTo = aTo
    bow.trigger('changed')
    return this
  }

  generateFan() {
    const aFrom = utils.rand(utils.TWO_PI)
    const aTo = aFrom + utils.rand(utils.HALF_PI, utils.TWO_PI)

    const fan = new Fan(
      this.randomX(),
      this.randomY(),
      this.randomRadius(),
      aFrom,
      aTo,
    )
    fan.center.label = 'O'
    fan.string.points[0].label = 'A'
    fan.string.points[1].label = 'B'
    return fan
  }

  generateTriangle() {
    const points = []
    for (let i = 0; i <= 2; i++) {
      points[i] = new Point(this.randomX(), this.randomY())
    }

    const triangle = new Triangle(points[0], points[1], points[2])
    triangle.points[0].label = 'A'
    triangle.points[1].label = 'B'
    triangle.points[2].label = 'C'
    return triangle
  }

  randomizeTriangle(triangle) {
    for (let i = 0; i <= 2; i++) {
      triangle.points[i].set(this.randomX(), this.randomY())
    }
    triangle.trigger('changed')
    return this
  }

  generateRectangle() {
    const rect = new Rectangle(
      utils.rand(this.rangeX + this.rangeWidth),
      utils.rand(this.rangeY + this.rangeHeight),
      utils.rand(this.rangeWidth / 2),
      utils.rand(this.rangeHeight / 2),
    )
    rect.pointLT.label = 'A'
    rect.pointRT.label = 'B'
    rect.pointRB.label = 'C'
    rect.pointLB.label = 'D'
    return rect
  }

  randomizeRectangle(rectangle) {
    rectangle.set(
      this.randomX(),
      this.randomY(),
      this.randomRadius(),
      this.randomRadius(),
    )
    rectangle.trigger('changed')
    return this
  }

  generatePolygon() {
    const points = []

    for (let i = 0; i <= 3; i++) {
      const point = new Point(this.randomX(), this.randomY())
      point.label = `P${i}`
      points.push(point)
    }

    return new Polygon(points)
  }

  randomizePolygon(polygon) {
    for (let vertex of Array.from(polygon.vertices)) {
      vertex.set(this.randomX(), this.randomY())
    }
    polygon.trigger('changed')
    return this
  }

  generateLine() {
    const line = new Line(
      this.randomX(),
      this.randomY(),
      this.randomX(),
      this.randomY(),
    )
    line.points[0].label = 'A'
    line.points[1].label = 'B'
    return line
  }

  randomizeLine(line) {
    for (let point of Array.from(line.points)) {
      point.set(this.randomX(), this.randomY())
    }
    line.trigger('changed')
    return this
  }

  generatePolyline() {
    const polyline = new Polyline()
    for (let i = 0; i <= 3; i++) {
      const point = new Point(this.randomX(), this.randomY())
      point.label = `P${i}`
      polyline.addPoint(point)
    }
    return polyline
  }

  randomizePolyline(polyline) {
    for (let vertex of Array.from(polyline.vertices)) {
      vertex.set(this.randomX(), this.randomY())
    }
    polyline.trigger('changed')
    return this
  }
}
ShapeRandomizer.initClass()

export default ShapeRandomizer
