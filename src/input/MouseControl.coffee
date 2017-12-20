# Pan and zoom the camera by the mouse
# Drag left mouse button to pan, wheel up/down to zoom in/out

import Vector from '../math/Vector'

import Animation from '../anim/Animation'

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

	constructor: (@camera, dom) ->
		@zoomScaleAnim = scaleAnimation.applyTo @camera
		@zoomTransAnim = translateAnimation.applyTo @camera

		@smoothZooming = yes
		@desScale = new Vector 1, 1

		dom.addEventListener 'mousemove', @onMouseMove
		dom.addEventListener 'mousewheel', @onMouseWheel

	onMouseMove: (e) =>
		if e.buttons == Bu.MOUSE.LEFT
			scale = @camera.scale.x
			dx = -e.movementX * scale
			dy = -e.movementY * scale

			@camera.translate dx, dy

	onMouseWheel: (e) =>
		deltaScaleStep = Math.pow(1.25, -e.wheelDelta / 120)
		@desScale.multiplyScalar deltaScaleStep
		deltaScaleAll = @desScale.x / @camera.scale.x

		mx = e.offsetX - $(e.target).width() / 2
		my = e.offsetY - $(e.target).height() / 2
		dx = -mx * (deltaScaleAll - 1) * @camera.scale.x
		dy = -my * (deltaScaleAll - 1) * @camera.scale.y

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
