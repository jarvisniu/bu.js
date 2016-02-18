# click to draw a point

class Bu.DrawPointReactor extends Bu.ReactorBase

	constructor: (@bu) ->
		super()

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		drawingPoint = null

		@onMouseDown = (e) =>
			mouseDownPos.set e.offsetX, e.offsetY
			mouseButton = e.button

			drawingPoint = new Bu.Point e.offsetX, e.offsetY
			@bu.append drawingPoint

		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				drawingPoint.set mousePos.x, mousePos.y

		@onMouseUp = =>
			mouseButton = Bu.MOUSE_BUTTON_NONE
			drawingPoint = null