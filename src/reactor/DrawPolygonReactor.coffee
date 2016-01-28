# left click to add point to polygon
# right click to finish the current polygon

class Bu.DrawPolygonReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		renderer = @renderer

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mouseDownPos = new Bu.Vector

		polygon = null

		@onMouseDown = (e) ->
			mouseDownPos.set e.offsetX, e.offsetY
			mouseButton = e.button

			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				if not polygon?
					polygon = new Bu.Polygon
					polygon.fill(Bu.DEFAULT_FILL_STYLE_HOVER)
					renderer.append polygon

				polygon.addPoint mousePos.clone()
			else if mouseButton == Bu.MOUSE_BUTTON_RIGHT
				polygon.fill()
				polygon = null

		@onMouseMove = (e) ->
			mousePos.set e.offsetX, e.offsetY
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				points = polygon.vertices
				points[points.length - 1].set mousePos.x, mousePos.y
			else if mouseButton == Bu.MOUSE_BUTTON_NONE and polygon?
				if polygon.containsPoint mousePos
					polygon.fill 'yellow'
				else
					polygon.fill Bu.DEFAULT_FILL_STYLE_HOVER

		@onMouseUp = ->
			mouseButton = Bu.MOUSE_BUTTON_NONE