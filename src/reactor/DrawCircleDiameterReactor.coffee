# Draw circle by dragging out a radius

class Bu.DrawCircleDiameterReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		renderer = @renderer

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mousePosDown = new Bu.Point

		circle = null
		line = null

		# create new circles every time
		@onMouseDown = (e) ->
			mousePosDown.set e.offsetX, e.offsetY

			circle = new Bu.Circle mousePosDown.x, mousePosDown.y, 1
			renderer.append circle

			line = new Bu.Line mousePosDown, mousePosDown
			line.stroke '#f44'
			renderer.append line

			mouseButton = e.button

		# change radius
		@onMouseMove = (e) ->
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				mousePos.set e.offsetX, e.offsetY
				line.setPoint2(mousePos)
				circle.radius = mousePos.distanceTo(mousePosDown) / 2
				circle.center = line.midpoint

		@onMouseUp = ->
			mouseButton = Bu.MOUSE_BUTTON_NONE
