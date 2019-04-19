// Render text around a point

import utils from '../utils.js'

import Object2D from '../base/Object2D.js'

// TODO add global settings
const DEFAULT_FONT_FAMILY = 'Verdana'
const DEFAULT_FONT_SIZE = 12

class PointText extends Object2D {
  /*
  options.align:
  ----------------------
  |   --    0-    +-   |
  |         |↙00      |
  |   -0  --+->   +0   |
  |         ↓          |
  |   -+    0+    ++   |
  ----------------------
  for example: text is in the right top of the point, then align = "+-"
  */
  constructor (text, x = 0, y = 0) {
    super()

    this.text = text
    this.x = x
    this.y = y
    this.type = 'PointText'
    this.strokeStyle = null // no stroke by default
    this.fillStyle = 'black'

    const options = utils.combineOptions(arguments, {
      align: '00',
    })
    this.align = options.align
    if (options.font != null) {
      this.font = options.font
    } else if ((options.fontFamily != null) || (options.fontSize != null)) {
      this._fontFamily = options.fontFamily || DEFAULT_FONT_FAMILY
      this._fontSize = options.fontSize || DEFAULT_FONT_SIZE
      this.font = `${ this._fontSize }px ${ this._fontFamily }`
    } else {
      this.font = null
    }
  }

  get align () {
    return this._align
  }
  set align (val) {
    this._align = val
    return this.setAlign(this._align)
  }

  get fontFamily () {
    return this._fontFamily
  }
  set fontFamily (val) {
    this._fontFamily = val
    this.font = `${ this._fontSize }px ${ this._fontFamily }`
  }

  get fontSize () {
    return this._fontSize
  }
  set fontSize (val) {
    this._fontSize = val
    this.font = `${ this._fontSize }px ${ this._fontFamily }`
  }

  setAlign (align) {
    if (align.length === 1) align = `${ align }${ align }`
    let alignX = align.substring(0, 1)
    let alignY = align.substring(1, 2)
    this.textAlign = (() => {
      switch (alignX) {
        case '-': return 'right'
        case '0': return 'center'
        case '+': return 'left'
      }
    })()
    this.textBaseline = (() => {
      switch (alignY) {
        case '-': return 'bottom'
        case '0': return 'middle'
        case '+': return 'top'
      }
    })()
    return this
  }

  setFontFamily (family) {
    this.fontFamily = family
    return this
  }

  setFontSize (size) {
    this.fontSize = size
    return this
  }
}

export default PointText
