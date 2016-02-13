# drag to draw a freeline

class Bu.DrawFreelineReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()

		@lineSplitThresh = 8

		mouseButton = Bu.MOUSE_BUTTON_NONE
		mousePos = new Bu.Point
		mouseDownPos = new Bu.Point

		polyline = null
		line = null

		@onMouseDown = (e) =>
			mouseDownPos.set e.offsetX, e.offsetY
			mouseButton = e.button

			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				polyline = new Bu.Polyline
				polyline.stroke Bu.DEFAULT_STROKE_STYLE_HOVER
				@renderer.append polyline

		@onMouseMove = (e) =>
			mousePos.set e.offsetX, e.offsetY
			if mouseButton == Bu.MOUSE_BUTTON_LEFT
				if mousePos.distanceTo(mouseDownPos) > @lineSplitThresh or polyline.vertices.length < 2
					polyline.addPoint mousePos.clone()
					mouseDownPos.copy mousePos
				else
					polyline.vertices[polyline.vertices.length - 1].copy mousePos

		@onMouseUp = =>
			mouseButton = Bu.MOUSE_BUTTON_NONE
			if polyline?
				polyline.stroke Bu.DEFAULT_STROKE_STYLE
				polyline = null
