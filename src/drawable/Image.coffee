# Used to render bitmap to the screen

import Object2D from '../base/Object2D'

class Bu.Image extends Object2D

	constructor: (@url, x = 0, y = 0, width, height) ->
		super()
		@type = 'Image'

		@autoSize = yes
		@size = new Bu.Size
		@position = new Bu.Vector x, y
		@center = new Bu.Vector x + width / 2, y + height / 2
		if width?
			@size.set width, height
			@autoSize = no

		@pivot = new Bu.Vector 0.5, 0.5

		@_image = new Bu.global.Image
		@ready = false

		@_image.onload = (e) =>
			if @autoSize
				@size.set @_image.width, @_image.height
			@ready = true

		@_image.src = @url if @url?

	@property 'image',
		get: -> @_image
		set: (val) ->
			@_image = val
			@ready = yes
