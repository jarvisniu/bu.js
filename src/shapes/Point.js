// point shape

import utils from '../utils.js'
import Object2D from '../base/Object2D.js'

import PointText from '../drawable/PointText.js'

class Point extends Object2D {
  static initClass () {
    this.prototype.type = 'Point'
    this.prototype.fillable = true

    this.property('label', {
      get () {
        if (this._labelIndex > -1) {
          return this.children[this._labelIndex].text
        } else {
          return ''
        }
      },
      set (val) {
        if (this._labelIndex === -1) {
          const pointText = new PointText(
            val,
            this.x + utils.POINT_LABEL_OFFSET,
            this.y,
            { align: '+0' },
          )
          this.children.push(pointText)
          this._labelIndex = this.children.length - 1
        } else {
          this.children[this._labelIndex].text = val
        }
      },
    },
    )
  }

  constructor (x = 0, y = 0) {
    super()

    this.x = x
    this.y = y

    this.lineWidth = 0.5
    this._labelIndex = -1
  }

  clone () {
    return new Point(this.x, this.y)
  }

  arcTo (radius, arc) {
    return new Point(
      this.x + (Math.cos(arc) * radius),
      this.y + (Math.sin(arc) * radius),
    )
  }

  // copy value from other line
  copy (point) {
    this.x = point.x
    this.y = point.y
    this.updateLabel()
    return this
  }

  // set value from x, y
  set (x, y) {
    this.x = x
    this.y = y
    this.updateLabel()
    return this
  }

  // set label text
  setLabel (text) {
    this.label = text
    this.updateLabel()
    return this
  }

  updateLabel () {
    if (this._labelIndex > -1) {
      this.children[this._labelIndex].x = this.x + utils.POINT_LABEL_OFFSET
      this.children[this._labelIndex].y = this.y
    }
    return this
  }
}
Point.initClass()

export default Point
