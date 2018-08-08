// Add color to the shapes
// This object is dedicated to mixed-in the Object2D.

import Bu from '../base/Bu.js'

let Styled = function () {
  this.strokeStyle = Styled.DEFAULT_STROKE_STYLE
  this.fillStyle = Styled.DEFAULT_FILL_STYLE
  this.dashStyle = false
  this.dashFlowSpeed = 0
  this.lineWidth = 1

  this.dashOffset = 0

  // Set/copy style from other style
  this.style = function (style) {
    if (typeof style === 'string') {
      style = Bu.styles[style]
      if (!style) {
        style = Bu.styles.default
        console.warn(`Styled: Bu.styles.${ style } doesn't exists, fell back to default.`)
      }
    } else if (!style) {
      style = Bu.styles['default']
    }
    for (let k of ['strokeStyle', 'fillStyle', 'dashStyle', 'dashFlowSpeed', 'lineWidth']) {
      this[k] = style[k]
    }
    return this
  }

  // Set the stroke style
  this.stroke = function (v) {
    if (v == null) v = true
    if (Bu.styles && v in Bu.styles) v = Bu.styles[v].strokeStyle

    switch (v) {
      case true:
        this.strokeStyle = Styled.DEFAULT_STROKE_STYLE
        break
      case false:
        this.strokeStyle = null
        break
      default:
        this.strokeStyle = v
    }
    return this
  }

  // Set the fill style
  this.fill = function (v) {
    if (v == null) v = true
    if (Bu.styles && v in Bu.styles) v = Bu.styles[v].fillStyle

    switch (v) {
      case false:
        this.fillStyle = null
        break
      case true:
        this.fillStyle = Styled.DEFAULT_FILL_STYLE
        break
      default:
        this.fillStyle = v
    }
    return this
  }

  // Set the dash style
  this.dash = function (v) {
    if (v == null) v = true
    else if (Bu.styles && v in Bu.styles) v = Bu.styles[v].dashStyle
    else if (typeof v === 'number') v = [v, v]

    switch (v) {
      case false:
        this.dashStyle = null
        break
      case true:
        this.dashStyle = Styled.DEFAULT_DASH_STYLE
        break
      default:
        this.dashStyle = v
    }
    return this
  }

  // Set the dash flowing speed
  this.dashFlow = function (speed) {
    if (speed === true || speed == null) speed = 1
    else if (speed === false) speed = 0

    Bu.dashFlowManager.setSpeed(this, speed)
    return this
  }

  // Set the lineWidth
  this.setLineWidth = function (w) {
    this.lineWidth = w
    return this
  }

  return this
}

Styled.DEFAULT_STROKE_STYLE = '#048'
Styled.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)'
Styled.DEFAULT_DASH_STYLE = [8, 4]

export default Styled
