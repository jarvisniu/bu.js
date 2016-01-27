# click to draw a point

class Bu.DrawPointReactor extends Bu.ReactorBase

	constructor: (@renderer) ->
		super()
		self = @
		@mouseDownPos = new Bu.Vector

		@drawingPoint = null

		@onMouseDown = (e) ->
			self.mouseDownPos.set e.offsetX, e.offsetY
			self.mouseButton = e.button

			self.drawingPoint = new Bu.Point e.offsetX, e.offsetY
			self.renderer.append self.drawingPoint

		@onMouseMove = (e) ->
			self.mousePos.set e.offsetX, e.offsetY
			if self.mouseButton == Bu.MOUSE_BUTTON_LEFT
				self.drawingPoint.set  self.mousePos.x, self.mousePos.y

		@onMouseUp = =>
			self.mouseButton = Bu.MOUSE_BUTTON_NONE
			self.drawingPoint = null