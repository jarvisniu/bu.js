# left click to add point to polygon
# right click to finish the current polygon

class Bu.DrawPolygonReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		polygon = null
		guideLineEnd = null
		guideLineStart = null

		@onMouseDown = (e) =>
			mouseDownPos.set e.offsetX, e.offsetY
			mouseButton = e.button

			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				if not polygon?
					polygon = new Bu.Polygon
					polygon.fill(Bu.DEFAULT_FILL_STYLE_HOVER)
					@renderer.append polygon

				if not guideLineEnd?
					guideLineEnd = new Bu.Line mousePos, mousePos
					guideLineEnd.stroke Bu.DEFAULT_STROKE_STYLE_HOVER
					guideLineEnd.dash()
					@renderer.append guideLineEnd

					guideLineStart = new Bu.Line mousePos, mousePos
					guideLineStart.stroke Bu.DEFAULT_STROKE_STYLE_HOVER
					guideLineStart.dash()
					@renderer.append guideLineStart
				else if guideLineEnd.visible == off
					guideLineEnd.setPoint1 mousePos
					guideLineEnd.setPoint2 mousePos
					guideLineEnd.visible = on

					guideLineStart.setPoint1 mousePos
					guideLineStart.setPoint2 mousePos
					guideLineStart.visible = on

				guideLineEnd.setPoint1 guideLineEnd.points[1]
				polygon.addPoint mousePos.clone()
			else if mouseButton == Bu.MOUSE_BUTTON_RIGHT
				polygon.fill()
				polygon = null
				guideLineEnd.visible = off
				guideLineStart.visible = off

		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				points = polygon.vertices
#				points[points.length - 1].set mousePos.x, mousePos.y
			else if mouseButton == Bu.MOUSE_BUTTON_NONE and polygon?
				if polygon.containsPoint mousePos
					polygon.fill 'yellow'
				else
					polygon.fill Bu.DEFAULT_FILL_STYLE_HOVER

			if polygon
				guideLineEnd.setPoint2 mousePos
				guideLineStart.setPoint2 mousePos

		@onMouseUp = =>
			mouseButton = Bu.MOUSE_BUTTON_NONE
			if polygon?
				guideLineEnd.setPoint2 guideLineEnd.points[0]
				guideLineEnd.setPoint1 mousePos

				points = polygon.vertices
				len = mousePos.distanceTo points[points.length - 1]
				polygon.addPoint mousePos.clone() if len > Bu.POINT_RENDER_SIZE