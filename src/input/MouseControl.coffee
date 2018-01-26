# Pan and zoom the camera by the mouse
# Drag left mouse button to pan, wheel up/down to zoom in/out

import utils from '../utils.js'

import Vector from '../math/Vector.js'

import Animation from '../anim/Animation.coffee'

class MouseControl

  scaleAnimation = new Animation
    duration: 0.2
    init: (anim) ->
      anim.arg = 1 unless anim.arg?
      anim.from = @scale.clone()
      anim.to = @scale.clone().multiplyScalar parseFloat anim.arg
    update: (anim) ->
      @scale = anim.current

  translateAnimation = new Animation
    duration: 0.2
    init: (anim) ->
      anim.arg = new Vector unless anim.arg?
      anim.from = @position.clone()
      anim.to = @position.clone().add anim.arg
    update: (anim) ->
      @position.copy anim.current

  constructor: (@renderer) ->
    @camera = @renderer.camera
    @zoomScaleAnim = scaleAnimation.applyTo @camera
    @zoomTransAnim = translateAnimation.applyTo @camera

    @smoothZooming = yes
    @desScale = new Vector 1, 1

    @renderer.dom.addEventListener 'mousemove', @onMouseMove
    @renderer.dom.addEventListener 'mousewheel', @onMouseWheel

  onMouseMove: (ev) =>
    if ev.buttons == utils.MOUSE.LEFT
      scale = @camera.scale.x
      dx = -ev.movementX * scale
      dy = -ev.movementY * scale

      @camera.translate dx, dy

  onMouseWheel: (ev) =>
    [x, y] = @renderer.projectToWorld(ev.offsetX, ev.offsetY)
    deltaScaleStep = Math.pow(1.25, -ev.wheelDelta / 120)
    @desScale.multiplyScalar deltaScaleStep
    deltaScaleAll = @desScale.x / @camera.scale.x

    targetStyle = getComputedStyle(ev.target)
    dx = -x * (deltaScaleAll - 1) * @camera.scale.x
    dy = -y * (deltaScaleAll - 1) * @camera.scale.y

    if @smoothZooming
      @zoomScaleAnim.from.copy @camera.scale
      @zoomScaleAnim.to.copy @desScale
      @zoomScaleAnim.restart()

      @zoomTransAnim.from.copy @camera.position
      @zoomTransAnim.to.set @camera.position.x + dx, @camera.position.y + dy
      @zoomTransAnim.restart()
    else
      @camera.translate dx, dy
      @camera.scale.copy this.desScale

export default MouseControl
