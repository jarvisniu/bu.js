// Pan and zoom the camera by the mouse
// Drag left mouse button to pan, wheel up/down to zoom in/out

import utils from '../utils.js'

import Vector from '../math/Vector.js'

import Animation from '../anim/Animation.js'

class MouseControl {
  constructor (renderer) {
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseWheel = this.onMouseWheel.bind(this)
    this.renderer = renderer
    this.camera = this.renderer.camera
    this.zoomScaleAnim = scaleAnimation.applyTo(this.camera)
    this.zoomTransAnim = translateAnimation.applyTo(this.camera)

    this.smoothZooming = true
    this.desScale = new Vector(1, 1)

    this.renderer.dom.addEventListener('mousemove', this.onMouseMove)
    this.renderer.dom.addEventListener('mousewheel', this.onMouseWheel)
  }

  onMouseMove (ev) {
    if (ev.buttons === utils.MOUSE.LEFT) {
      const scale = this.camera.scale.x
      const dx = -ev.movementX * scale
      const dy = -ev.movementY * scale

      return this.camera.translate(dx, dy)
    }
  }

  onMouseWheel (ev) {
    const [x, y] = Array.from(this.renderer.projectToWorld(ev.offsetX, ev.offsetY))
    const deltaScaleStep = Math.pow(1.25, -ev.wheelDelta / 120)
    this.desScale.multiplyScalar(deltaScaleStep)
    const deltaScaleAll = this.desScale.x / this.camera.scale.x

    const dx = -x * (deltaScaleAll - 1) * this.camera.scale.x
    const dy = -y * (deltaScaleAll - 1) * this.camera.scale.y

    if (this.smoothZooming) {
      this.zoomScaleAnim.from.copy(this.camera.scale)
      this.zoomScaleAnim.to.copy(this.desScale)
      this.zoomScaleAnim.restart()

      this.zoomTransAnim.from.copy(this.camera.position)
      this.zoomTransAnim.to.set(this.camera.position.x + dx, this.camera.position.y + dy)
      return this.zoomTransAnim.restart()
    } else {
      this.camera.translate(dx, dy)
      return this.camera.scale.copy(this.desScale)
    }
  }
}

let scaleAnimation = new Animation({
  duration: 0.2,
  init (anim) {
    if (anim.arg == null) anim.arg = 1
    anim.from = this.scale.clone()
    anim.to = this.scale.clone().multiplyScalar(parseFloat(anim.arg))
  },
  update (anim) {
    this.scale = anim.current
  },
})

let translateAnimation = new Animation({
  duration: 0.2,
  init (anim) {
    if (anim.arg == null) anim.arg = new Vector()
    anim.from = this.position.clone()
    anim.to = this.position.clone().add(anim.arg)
  },
  update (anim) {
    this.position.copy(anim.current)
  },
})

export default MouseControl
