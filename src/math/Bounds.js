// Axis-aligned bounding box

import Vector from '../math/Vector.js'

class Bounds {
  constructor(target) {
    this.target = target

    this.x1 = 0
    this.y1 = 0
    this.x2 = 0
    this.y2 = 0
    this.isEmpty = true

    this.point1 = new Vector()
    this.point2 = new Vector()

    this.update()
    this.bindEvent()
  }

  containsPoint(p) {
    return this.x1 < p.x && this.x2 > p.x && this.y1 < p.y && this.y2 > p.y
  }

  update() {
    this.clear()
    switch (this.target.type) {
      case 'Line':
      case 'Triangle':
      case 'Rectangle':
        for (let v of this.target.points) {
          this.expandByPoint(v)
        }
        break
      case 'Circle':
      case 'Bow':
      case 'Fan':
        this.expandByCircle(this.target)
        break
      case 'Polyline':
      case 'Polygon':
        for (let v of this.target.vertices) {
          this.expandByPoint(v)
        }
        break
      case 'Ellipse':
        this.x1 = -this.target.radiusX
        this.x2 = this.target.radiusX
        this.y1 = -this.target.radiusY
        this.y2 = this.target.radiusY
        break
      default:
        console.warn(`Bu.Bounds: not supported shape type ${this.target.type}`)
    }
  }

  clear() {
    this.x1 = this.y1 = this.x2 = this.y2 = 0
    this.isEmpty = true
    return this
  }

  bindEvent() {
    switch (this.target.type) {
      case 'Circle':
      case 'Bow':
      case 'Fan':
        this.target.on('centerChanged', this.update.bind(this))
        this.target.on('radiusChanged', this.update.bind(this))
        break
      case 'Ellipse':
        this.target.on('changed', this.update.bind(this))
    }
  }

  expandByPoint(v) {
    if (this.isEmpty) {
      this.isEmpty = false
      this.x1 = this.x2 = v.x
      this.y1 = this.y2 = v.y
    } else {
      if (v.x < this.x1) this.x1 = v.x
      if (v.x > this.x2) this.x2 = v.x
      if (v.y < this.y1) this.y1 = v.y
      if (v.y > this.y2) this.y2 = v.y
    }
    return this
  }

  expandByCircle(c) {
    let center = c.center
    let radius = c.radius
    if (this.isEmpty) {
      this.isEmpty = false
      this.x1 = center.x - radius
      this.x2 = center.x + radius
      this.y1 = center.y - radius
      this.y2 = center.y + radius
    } else {
      if (center.x - radius < this.x1) this.x1 = center.x - radius
      if (center.x + radius > this.x2) this.x2 = center.x + radius
      if (center.y - radius < this.y1) this.y1 = center.y - radius
      if (center.y + radius > this.y2) this.y2 = center.y + radius
    }
    return this
  }
}

export default Bounds
