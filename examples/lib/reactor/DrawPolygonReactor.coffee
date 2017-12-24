# left click to add point to polygon
# right click to finish the current polygon

class Bu.DrawPolygonReactor extends Bu.ReactorBase

	constructor: (@bu) ->
		super()

		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		polygon = null
		guideLineEnd = null
		guideLineStart = null

		@onMouseDown = (e) =>
			mouseDownPos.set e.offsetX, e.offsetY

			if e.buttons == Bu.MOUSE.LEFT
				if not polygon?
					polygon = new Bu.Polygon
					polygon.style 'selcted'
					@bu.scene.addChild polygon

				if not guideLineEnd?
					guideLineEnd = new Bu.Line mousePos, mousePos
					guideLineEnd.style 'dash'
					@bu.scene.addChild guideLineEnd

					guideLineStart = new Bu.Line mousePos, mousePos
					guideLineStart.style 'dash'
					@bu.scene.addChild guideLineStart
				else if guideLineEnd.visible == off
					guideLineEnd.setPoint1 mousePos
					guideLineEnd.setPoint2 mousePos
					guideLineEnd.visible = on

					guideLineStart.setPoint1 mousePos
					guideLineStart.setPoint2 mousePos
					guideLineStart.visible = on

				guideLineEnd.setPoint1 guideLineEnd.points[1]
				polygon.addPoint mousePos.clone()
			else if e.buttons == Bu.MOUSE.RIGHT
				polygon.style()
				polygon = null
				guideLineEnd.visible = off
				guideLineStart.visible = off

		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if e.buttons == Bu.MOUSE.LEFT
				points = polygon.vertices
#				points[points.length - 1].set mousePos.x, mousePos.y
			else if e.buttons == Bu.MOUSE.NONE and polygon?
				if polygon.containsPoint mousePos
					polygon.fill 'hover'
				else
					polygon.fill 'selected'

			if polygon
				guideLineEnd.setPoint2 mousePos
				guideLineStart.setPoint2 mousePos

		@onMouseUp = (e) =>
			if polygon?
				guideLineEnd.setPoint2 guideLineEnd.points[0]
				guideLineEnd.setPoint1 mousePos

				points = polygon.vertices
				len = mousePos.distanceTo points[points.length - 1]
				polygon.addPoint mousePos.clone() if len > Bu.POINT_RENDER_SIZE
