# left click to add point to polyline
# right click to finish the current polyline

class Bu.DrawPolylineReactor extends Bu.ReactorBase

	constructor: (@bu) ->
		super()

		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		polyline = null
		line = null

		@onMouseDown = (e) =>
			mouseDownPos.set e.offsetX, e.offsetY

			if e.buttons == Bu.MOUSE.LEFT
				if not polyline?
					polyline = new Bu.Polyline
					polyline.style 'selected'
					@bu.scene.addChild polyline

				if not line?
					line = new Bu.Line mousePos, mousePos
					line.style 'dash'
					@bu.scene.addChild line
				else if line.visible == off
					line.setPoint1 mousePos
					line.setPoint2 mousePos
					line.visible = on

				line.setPoint1 line.points[1]
				polyline.addPoint mousePos.clone()
			else if e.buttons == Bu.MOUSE.RIGHT
				polyline.style()
				polyline = null
				line.visible = off

		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if polyline?
				line.setPoint2 mousePos

		@onMouseUp = =>
			if polyline?
				line.setPoint2 line.points[0]
				line.setPoint1 mousePos
				points = polyline.vertices
				len = mousePos.distanceTo points[points.length - 1]
				polyline.addPoint mousePos.clone() if len > Bu.POINT_RENDER_SIZE
