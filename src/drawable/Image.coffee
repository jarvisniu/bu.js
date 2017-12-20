# Used to render bitmap to the screen

import Size from '../math/Size'
import Vector from '../math/Vector'

import Object2D from '../base/Object2D'

class Image extends Object2D

	constructor: (@url, x = 0, y = 0, width, height) ->
		super()
		@type = 'Image'

		@autoSize = yes
		@size = new Size
		@position = new Vector x, y
		@center = new Vector x + width / 2, y + height / 2
		if width?
			@size.set width, height
			@autoSize = no

		@pivot = new Vector 0.5, 0.5

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

export default Image
