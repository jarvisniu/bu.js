# draw bitmap

class Bu.Image extends Bu.Object2D

	constructor: (@url, x = 0, y = 0, width, height) ->
		super()
		@type = 'Image'

		@autoSize = yes
		@size = new Bu.Size
		@translate = new Bu.Vector x, y
		@center = new Bu.Vector x + width / 2, y + height / 2
		if width?
			@size.set width, height
			@autoSize = no

		@pivot = new Bu.Vector 0.5, 0.5

		@image = new Bu.global.Image
		@loaded = false

		@image.onload = (e) =>
			if @autoSize
				@size.set @image.width, @image.height
			@loaded = true

		@image.src = @url
