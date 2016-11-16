# move a point by dragging it

class Bu.MovePointReactor extends Bu.ReactorBase

	constructor: (@bu) ->
		super()

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

		# change x, y
		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if e.buttons == Bu.MOUSE.LEFT
				hoveredPoint.set(
						mousePos.x - mousePosDownDelta.x
						mousePos.y - mousePosDownDelta.y
				) if hoveredPoint?
			else
				if hoveredPoint?
					if not hoveredPoint.isNear(mousePos)
						hoveredPoint.lineWidth = 0.5
						hoveredPoint.fill()
						hoveredPoint = null
				else
					for shape in @bu.scene.children
						if shape.type is 'Point' and shape.isNear mousePos
							hoveredPoint = shape
							hoveredPoint.lineWidth = 1
							hoveredPoint.fill '#f80'
							break
