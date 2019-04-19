// Used to render all the drawable objects to the canvas

import Bu from '../base/Bu.js'

import utils from '../utils.js'
import Event from '../base/Event.js'

import Camera from '../core/Camera.js'
import Scene from '../core/Scene.js'

class Renderer {
  constructor() {
    Event.apply(this)
    this.type = 'Renderer'

    // API
    this.scene = new Scene(this)
    this.camera = new Camera()
    this.tickCount = 0
    this.isRunning = true
    this.pixelRatio = window.devicePixelRatio || 1
    if (typeof ClipMeter !== 'undefined' && window.ClipMeter !== null) {
      this.clipMeter = new window.ClipMeter()
    }

    // Receive options
    const options = utils.combineOptions(arguments, {
      container: 'body',
      showBounds: false,
      imageSmoothing: true,
    })

    // Copy options
    for (let name of ['container', 'width', 'height', 'showBounds']) {
      this[name] = options[name]
    }

    // If options.width is not given, then fillParent is true
    this.fillParent = typeof options.width !== 'number'

    // Convert width and height from dip(device independent pixels) to physical pixels
    this.pixelWidth = this.width * this.pixelRatio
    this.pixelHeight = this.height * this.pixelRatio

    // Set canvas dom
    this.dom = document.createElement('canvas')
    this.dom.style.cursor = Bu.config.cursor
    this.dom.style.boxSizing = 'content-box'
    this.dom.oncontextmenu = () => false

    // Set context
    this.context = this.dom.getContext('2d')
    this.context.textBaseline = 'top'

    // Set container dom
    if (typeof this.container === 'string') {
      this.container = document.querySelector(this.container)
    }
    if (this.fillParent && this.container === document.body) {
      const domHtml = document.querySelector('html')
      const domBody = document.querySelector('body')
      domBody.style.margin = '0'
      domBody.style.overflow = 'hidden'
      domHtml.style.width = domHtml.style.height = domBody.style.width = domBody.style.height =
        '100%'
    }

    // Set sizes for renderer property, dom attribute and dom style
    const onResize = () => {
      const canvasRatio = this.dom.height / this.dom.width
      const containerRatio =
        this.container.clientHeight / this.container.clientWidth
      if (containerRatio < canvasRatio) {
        this.height = this.container.clientHeight
        this.width = this.height / containerRatio
      } else {
        this.width = this.container.clientWidth
        this.height = this.width * containerRatio
      }
      this.pixelWidth = this.dom.width = this.width * this.pixelRatio
      this.pixelHeight = this.dom.height = this.height * this.pixelRatio
      this.dom.style.width = this.width + 'px'
      this.dom.style.height = this.height + 'px'
      return this.render()
    }

    if (!this.fillParent) {
      this.dom.style.width = this.width + 'px'
      this.dom.style.height = this.height + 'px'
      this.dom.width = this.pixelWidth
      this.dom.height = this.pixelHeight
    } else {
      this.pixelWidth = this.container.clientWidth
      this.pixelHeight = this.container.clientHeight
      this.width = this.pixelWidth / this.pixelRatio
      this.height = this.pixelHeight / this.pixelRatio
      window.addEventListener('resize', onResize)
      this.dom.addEventListener('DOMNodeInserted', onResize)
    }

    // Run the loop
    var tick = () => {
      if (this.isRunning) {
        if (this.clipMeter != null) {
          this.clipMeter.start()
        }
        this.render()
        this.trigger('update', this)
        this.tickCount += 1
        if (this.clipMeter != null) {
          this.clipMeter.tick()
        }
      }
      return window.requestAnimationFrame(tick)
    }
    tick()

    // Append <canvas> dom into the container
    const delayed = () => {
      this.container.appendChild(this.dom)
      this.imageSmoothing = options.imageSmoothing
    }
    setTimeout(delayed, 1)

    // Hook up with running components
    Bu.animationRunner.hookUp(this)
    Bu.dashFlowManager.hookUp(this)
  }

  get imageSmoothing() {
    return this._imageSmoothing
  }
  set imageSmoothing(val) {
    this._imageSmoothing = this.context.imageSmoothingEnabled = val
  }

  // Pause/continue/toggle the rendering loop
  pause() {
    this.isRunning = false
  }
  continue() {
    this.isRunning = true
  }
  toggle() {
    this.isRunning = !this.isRunning
  }

  // Project from DOM coordinates to world coordinates
  projectToWorld(x, y) {
    if (!Bu.config.originAtCenter) {
      return [x, y]
    } else {
      return [x - this.width / 2, y - this.height / 2]
    }
  }

  // Perform the full render process
  render() {
    this.context.save()

    // Clear the canvas
    this.clearCanvas()

    // Move center from left-top corner to screen center
    if (Bu.config.originAtCenter) {
      this.context.translate(this.pixelWidth / 2, this.pixelHeight / 2)
    }

    // Zoom the canvas with devicePixelRatio to support high definition screen
    this.context.scale(this.pixelRatio, this.pixelRatio)

    // Transform the camera
    this.context.scale(1 / this.camera.scale.x, 1 / this.camera.scale.y)
    this.context.rotate(-this.camera.rotation)
    this.context.translate(-this.camera.position.x, -this.camera.position.y)

    // Draw the scene tree
    this.drawShape(this.scene)
    this.context.restore()
    return this
  }

  // Clear the canvas
  clearCanvas() {
    this.context.fillStyle = this.scene.background
    this.context.fillRect(0, 0, this.pixelWidth, this.pixelHeight)
    return this
  }

  // Draw an array of drawables
  drawShapes(shapes) {
    if (shapes != null) {
      for (let shape of Array.from(shapes)) {
        this.context.save()
        this.drawShape(shape)
        this.context.restore()
      }
    }
    return this
  }

  // Draw an drawable to the canvas
  drawShape(shape) {
    if (!shape.visible) {
      return this
    }

    this.context.translate(shape.position.x, shape.position.y)
    this.context.rotate(shape.rotation)
    let sx = shape.scale.x
    let sy = shape.scale.y
    if (sx / sy > 100 || sx / sy < 0.01) {
      if (Math.abs(sx) < 0.02) {
        sx = 0
      }
      if (Math.abs(sy) < 0.02) {
        sy = 0
      }
    }
    this.context.scale(sx, sy)

    this.context.globalAlpha *= shape.opacity
    if (shape.strokeStyle != null) {
      this.context.strokeStyle = shape.strokeStyle
      this.context.lineWidth = shape.lineWidth
      if (shape.lineCap != null) {
        this.context.lineCap = shape.lineCap
      }
      if (shape.lineJoin != null) {
        this.context.lineJoin = shape.lineJoin
      }
    }

    this.context.beginPath()

    switch (shape.type) {
      case 'Point':
        this.drawPoint(shape)
        break
      case 'Line':
        this.drawLine(shape)
        break
      case 'Circle':
        this.drawCircle(shape)
        break
      case 'Ellipse':
        this.drawEllipse(shape)
        break
      case 'Triangle':
        this.drawTriangle(shape)
        break
      case 'Rectangle':
        this.drawRectangle(shape)
        break
      case 'Fan':
        this.drawFan(shape)
        break
      case 'Bow':
        this.drawBow(shape)
        break
      case 'Polygon':
        this.drawPolygon(shape)
        break
      case 'Polyline':
        this.drawPolyline(shape)
        break
      case 'Spline':
        this.drawSpline(shape)
        break
      case 'PointText':
        this.drawPointText(shape)
        break
      case 'Image':
        this.drawImage(shape)
        break
      case 'Object2D':
      case 'Scene': // then do nothing
        break
      default:
        console.log('drawShapes(): unknown shape: ', shape.type, shape)
    }

    if (shape.fillStyle != null && shape.fillable) {
      this.context.fillStyle = shape.fillStyle
      this.context.fill()
    }

    if (shape.dashStyle) {
      this.context.lineDashOffset = shape.dashOffset
      if (typeof this.context.setLineDash === 'function') {
        this.context.setLineDash(shape.dashStyle)
      }
      this.context.stroke()
      this.context.setLineDash([])
    } else if (shape.strokeStyle != null) {
      this.context.stroke()
    }

    if (shape.children != null) {
      this.drawShapes(shape.children)
    }
    if (Bu.config.showKeyPoints) {
      this.drawShapes(shape.keyPoints)
    }
    if (this.showBounds && shape.bounds != null) {
      this.drawBounds(shape.bounds)
    }
    return this
  }

  drawPoint(shape) {
    this.context.arc(shape.x, shape.y, utils.POINT_RENDER_SIZE, 0, utils.TWO_PI)
    return this
  }

  drawLine(shape) {
    this.context.moveTo(shape.points[0].x, shape.points[0].y)
    this.context.lineTo(shape.points[1].x, shape.points[1].y)
    return this
  }

  drawCircle(shape) {
    this.context.arc(shape.cx, shape.cy, shape.radius, 0, utils.TWO_PI)
    return this
  }

  drawEllipse(shape) {
    this.context.ellipse(
      0,
      0,
      shape.radiusX,
      shape.radiusY,
      0,
      utils.TWO_PI,
      false,
    )
    return this
  }

  drawTriangle(shape) {
    this.context.lineTo(shape.points[0].x, shape.points[0].y)
    this.context.lineTo(shape.points[1].x, shape.points[1].y)
    this.context.lineTo(shape.points[2].x, shape.points[2].y)
    this.context.closePath()
    return this
  }

  drawRectangle(shape) {
    if (shape.cornerRadius !== 0) {
      return this.drawRoundRectangle(shape)
    }
    this.context.rect(
      shape.pointLT.x,
      shape.pointLT.y,
      shape.size.width,
      shape.size.height,
    )
    return this
  }

  drawRoundRectangle(shape) {
    const x1 = shape.pointLT.x
    const x2 = shape.pointRB.x
    const y1 = shape.pointLT.y
    const y2 = shape.pointRB.y
    const r = shape.cornerRadius

    this.context.moveTo(x1, y1 + r)
    this.context.arcTo(x1, y1, x1 + r, y1, r)
    this.context.lineTo(x2 - r, y1)
    this.context.arcTo(x2, y1, x2, y1 + r, r)
    this.context.lineTo(x2, y2 - r)
    this.context.arcTo(x2, y2, x2 - r, y2, r)
    this.context.lineTo(x1 + r, y2)
    this.context.arcTo(x1, y2, x1, y2 - r, r)
    this.context.closePath()

    if (shape.strokeStyle != null && shape.dashStyle) {
      if (typeof this.context.setLineDash === 'function') {
        this.context.setLineDash(shape.dashStyle)
      }
    }
    return this
  }

  drawFan(shape) {
    this.context.arc(shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo)
    this.context.lineTo(shape.cx, shape.cy)
    this.context.closePath()
    return this
  }

  drawBow(shape) {
    this.context.arc(shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo)
    this.context.closePath()
    return this
  }

  drawPolygon(shape) {
    for (let point of Array.from(shape.vertices)) {
      this.context.lineTo(point.x, point.y)
    }
    this.context.closePath()
    return this
  }

  drawPolyline(shape) {
    for (let point of Array.from(shape.vertices)) {
      this.context.lineTo(point.x, point.y)
    }
    return this
  }

  drawSpline(shape) {
    if (shape.strokeStyle != null) {
      const len = shape.vertices.length
      if (len === 2) {
        this.context.moveTo(shape.vertices[0].x, shape.vertices[0].y)
        this.context.lineTo(shape.vertices[1].x, shape.vertices[1].y)
      } else if (len > 2) {
        this.context.moveTo(shape.vertices[0].x, shape.vertices[0].y)
        for (
          let i = 1, end = len - 1, asc = end >= 1;
          asc ? i <= end : i >= end;
          asc ? i++ : i--
        ) {
          this.context.bezierCurveTo(
            shape.controlPointsBehind[i - 1].x,
            shape.controlPointsBehind[i - 1].y,
            shape.controlPointsAhead[i].x,
            shape.controlPointsAhead[i].y,
            shape.vertices[i].x,
            shape.vertices[i].y,
          )
        }
      }
    }
    return this
  }

  drawPointText(shape) {
    const font = shape.font || Bu.config.font

    if (typeof font === 'string') {
      this.context.textAlign = shape.textAlign
      this.context.textBaseline = shape.textBaseline
      this.context.font = font

      if (shape.strokeStyle != null) {
        this.context.strokeText(shape.text, shape.x, shape.y)
      }
      if (shape.fillStyle != null) {
        this.context.fillStyle = shape.fillStyle
        this.context.fillText(shape.text, shape.x, shape.y)
      }
    } else if (font instanceof Bu.SpriteSheet && font.ready) {
      const textWidth = font.measureTextWidth(shape.text)
      let xOffset = (() => {
        switch (shape.textAlign) {
          case 'left':
            return 0
          case 'center':
            return -textWidth / 2
          case 'right':
            return -textWidth
        }
      })()
      const yOffset = (() => {
        switch (shape.textBaseline) {
          case 'top':
            return 0
          case 'middle':
            return -font.height / 2
          case 'bottom':
            return -font.height
        }
      })()
      for (let i = 0; i < shape.text.length; i++) {
        const char = shape.text[i]
        const charBitmap = font.getFrameImage(char)
        if (charBitmap != null) {
          this.context.drawImage(
            charBitmap,
            shape.x + xOffset,
            shape.y + yOffset,
          )
          xOffset += charBitmap.width
        } else {
          xOffset += 10
        }
      }
    }
    return this
  }

  drawImage(shape) {
    if (shape.ready) {
      const w = shape.size.width
      const h = shape.size.height
      const dx = -w * shape.pivot.x
      const dy = -h * shape.pivot.y
      this.context.drawImage(shape.image, dx, dy, w, h)
    }
    return this
  }

  drawBounds(bounds) {
    this.context.beginPath()
    this.context.strokeStyle = Renderer.BOUNDS_STROKE_STYLE
    if (typeof this.context.setLineDash === 'function') {
      this.context.setLineDash(Renderer.BOUNDS_DASH_STYLE)
    }
    this.context.rect(
      bounds.x1,
      bounds.y1,
      bounds.x2 - bounds.x1,
      bounds.y2 - bounds.y1,
    )
    this.context.stroke()
    return this
  }
}

// Static Properties -----------------------------------------------------------

// Stroke style of bounds
Renderer.BOUNDS_STROKE_STYLE = 'red'

// Dash style of bounds
Renderer.BOUNDS_DASH_STYLE = [6, 6]

export default Renderer
