# draw bitmap

class Geom2D.Image extends Geom2D.Object2D

	constructor: (@url, x, y, width, height) ->
		super()
		self = @
		@type = "Image"

		@autoSize = yes
		@size = new Geom2D.Size Geom2D.DEFAULT_IMAGE_SIZE, Geom2D.DEFAULT_IMAGE_SIZE
		@position = new Geom2D.Vector x, y
		@center = new Geom2D.Vector x + width / 2, y + height / 2
		if width?
			@size.set width, height
			@autoSize = no

		@pivot = new Geom2D.Vector 0.5, 0.5

		@image = new window.Image
		@loaded = false

		@image.onload = (e) ->
			if self.autoSize
				self.size.set self.image.width, self.image.height
			self.loaded = true

		@image.src = @url
