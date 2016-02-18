# left click to add point to polyline
# right click to finish the current polyline

class Bu.DrawPolylineReactor extends Bu.ReactorBase

	constructor: (@bu) ->
		super()

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		polyline = null
		line = null

		@onMouseDown = (e) =>
			mouseDownPos.set e.offsetX, e.offsetY
			mouseButton = e.button

			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				if not polyline?
					polyline = new Bu.Polyline
					polyline.stroke Bu.DEFAULT_STROKE_STYLE_HOVER
					@bu.append polyline

				if not line?
					line = new Bu.Line mousePos, mousePos
					line.stroke Bu.DEFAULT_STROKE_STYLE_HOVER
					line.dash()
					@bu.append line
				else if line.visible == off
					line.setPoint1 mousePos
					line.setPoint2 mousePos
					line.visible = on

				line.setPoint1 line.points[1]
				polyline.addPoint mousePos.clone()
			else if mouseButton == Bu.MOUSE_BUTTON_RIGHT
				polyline.stroke()
				polyline = null
				line.visible = off

		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if polyline?
				line.setPoint2 mousePos

		@onMouseUp = =>
			mouseButton = Bu.MOUSE_BUTTON_NONE
			if polyline?
				line.setPoint2 line.points[0]
				line.setPoint1 mousePos
				points = polyline.vertices
				len = mousePos.distanceTo points[points.length - 1]
				polyline.addPoint mousePos.clone() if len > Bu.POINT_RENDER_SIZE