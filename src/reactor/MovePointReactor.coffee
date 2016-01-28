# move a point by dragging it

class Bu.MovePointReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		renderer = @renderer

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mousePosDown = new Bu.Vector
		mousePosDownDelta = new Bu.Vector

		hoveredPoint = null

		# record the delta
		@onMouseDown = (e) ->
			mousePosDown.set e.offsetX, e.offsetY

			if hoveredPoint?
				mousePosDownDelta.set(
						mousePosDown.x - hoveredPoint.x
						mousePosDown.y - hoveredPoint.y
				)
			mouseButton = e.button

		# change x, y
		@onMouseMove = (e) ->
			mousePos.set e.offsetX, e.offsetY
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				hoveredPoint.set(
						mousePos.x - mousePosDownDelta.x
						mousePos.y - mousePosDownDelta.y
				) if hoveredPoint?
			else
				if hoveredPoint?
					if not hoveredPoint.isNear(mousePos)
						hoveredPoint.stroke false
						hoveredPoint = null
				else
					for shape in renderer.shapes
						if shape.type is 'Point' and shape.isNear mousePos
							hoveredPoint = shape
							hoveredPoint.stroke()
							break

		@onMouseUp = =>
			mouseButton = Bu.MOUSE_BUTTON_NONE