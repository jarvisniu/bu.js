# move a point by dragging it

class Bu.MovePointReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		self = @

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
			self.mouseButton = e.button

		# change x, y
		@onMouseMove = (e) ->
			self.mousePos.set e.offsetX, e.offsetY
			if self.mouseButton == Bu.MOUSE_BUTTON_LEFT
				hoveredPoint.set(
						self.mousePos.x - mousePosDownDelta.x
						self.mousePos.y - mousePosDownDelta.y
				) if hoveredPoint?
			else
				if hoveredPoint?
					if not hoveredPoint.isNear(self.mousePos)
						hoveredPoint.stroke false
						hoveredPoint = null
				else
					for shape in renderer.shapes
						if shape.type is "Point" and shape.isNear self.mousePos
							hoveredPoint = shape
							hoveredPoint.stroke()
							break

		@onMouseUp = =>
			self.mouseButton = Bu.MOUSE_BUTTON_NONE