# draw bitmap

class Geom2D.Image extends Geom2D.Object2D

	constructor: (@url, x, y, width, height) ->
		super()
		self = @
		@type = "Image"

		@position = new Geom2D.Point(x, y)
		@center = new Geom2D.Point(x + width / 2, y + height / 2)
		if width?
			@size = new Geom2D.Size(width, height)
		else
			@size = null

		@image = new window.Image
		@loaded = false

		@image.onload = (e) ->
			if not self.size?
				self.size = new Geom2D.Size(self.image.width, self.image.height)
			self.loaded = true

		@image.src = @url
