// Used to render bitmap to the screen

import Size from '../math/Size.js'
import Vector from '../math/Vector.js'

import Object2D from '../base/Object2D.js'

class Image extends Object2D {
  static initClass () {
    this.property('image', {
      get () {
        return this._image
      },
      set (val) {
        this._image = val
        this.ready = true
      },
    },
    )
  }

  constructor (url, x = 0, y = 0, width, height) {
    super()

    this.url = url
    this.type = 'Image'

    this.autoSize = true
    this.size = new Size()
    this.position = new Vector(x, y)
    this.center = new Vector(x + (width / 2), y + (height / 2))
    if (width != null) {
      this.size.set(width, height)
      this.autoSize = false
    }

    this.pivot = new Vector(0.5, 0.5)

    this._image = new window.Image()
    this.ready = false

    this._image.onload = ev => {
      if (this.autoSize) {
        this.size.set(this._image.width, this._image.height)
      }
      this.ready = true
    }

    if (this.url != null) {
      this._image.src = this.url
    }
  }
}
Image.initClass()

export default Image
