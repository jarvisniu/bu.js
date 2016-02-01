# Draw circle by dragging out a radius

class Bu.DrawCircleReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mousePosDown = new Bu.Point

		isConfirmed = true

		circle = null
		line = null

		# create new circles every time
		@onMouseDown = (e) =>
			if not isConfirmed
				circle = null
				isConfirmed = yes
			else
				mousePosDown.set e.offsetX, e.offsetY
				circle = new Bu.Circle mousePosDown.x, mousePosDown.y, 1
				@renderer.append circle

				line = new Bu.Line mousePosDown, mousePosDown
				line.stroke '#f44'
				@renderer.append line
				isConfirmed = no
			mouseButton = e.button

		# change radius
		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if (not isConfirmed) or (mouseButton == Bu.MOUSE_BUTTON_LEFT and circle?)
				circle.radius = mousePos.distanceTo mousePosDown
				line.setPoint1 mousePos

		@onMouseUp = =>
			mouseButton = Bu.MOUSE_BUTTON_NONE
			isConfirmed = mousePos.distanceTo(mousePosDown) > Bu.POINT_RENDER_SIZE
