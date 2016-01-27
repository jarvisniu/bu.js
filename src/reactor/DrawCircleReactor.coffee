# Draw circle by dragging out a radius

class Bu.DrawCircleReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		self = @

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mousePosDown = new Bu.Point

		circle = null
		line = null

		# create new circles every time
		@onMouseDown = (e) ->
			mousePosDown.set e.offsetX, e.offsetY

			circle = new Bu.Circle mousePosDown.x, mousePosDown.y, 1
			self.renderer.append circle

			line = new Bu.Line mousePosDown, mousePosDown
			line.stroke "#f44"
			self.renderer.append line

			mouseButton = e.button

		# change radius
		@onMouseMove = (e) ->
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				mousePos.set e.offsetX, e.offsetY
				circle.radius = mousePos.distanceTo mousePosDown
				line.setPoint1 mousePos

		@onMouseUp = ->
			mouseButton = Bu.MOUSE_BUTTON_NONE
