# draw bitmap

class Bu.Image extends Bu.Object2D

	constructor: (@url, x, y, width, height) ->
		super()
		self = @
		@type = "Image"

		@autoSize = yes
		@size = new Bu.Size Bu.DEFAULT_IMAGE_SIZE, Bu.DEFAULT_IMAGE_SIZE
		@position = new Bu.Vector x, y
		@center = new Bu.Vector x + width / 2, y + height / 2
		if width?
			@size.set width, height
			@autoSize = no

		@pivot = new Bu.Vector 0.5, 0.5

		@image = new window.Image
		@loaded = false

		@image.onload = (e) ->
			if self.autoSize
				self.size.set self.image.width, self.image.height
			self.loaded = true

		@image.src = @url
