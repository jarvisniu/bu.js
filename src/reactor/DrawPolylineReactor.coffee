# left click to add point to polyline
# right click to finish the current polyline

class Bu.DrawPolylineReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		renderer = @renderer

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		polyline = null

		@onMouseDown = (e) ->
			mouseDownPos.set e.offsetX, e.offsetY
			mouseButton = e.button

			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				if not polyline?
					polyline = new Bu.Polyline
					polyline.stroke(Bu.DEFAULT_FILL_STYLE_HOVER)
					renderer.append polyline

				polyline.addPoint mousePos.clone()
			else if mouseButton == Bu.MOUSE_BUTTON_RIGHT
				polyline.stroke()
				polyline = null

		@onMouseMove = (e) ->
			mousePos.set e.offsetX, e.offsetY
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				points = polyline.points
				points[points.length - 1].set mousePos.x, mousePos.y

		@onMouseUp = ->
			mouseButton = Bu.MOUSE_BUTTON_NONE