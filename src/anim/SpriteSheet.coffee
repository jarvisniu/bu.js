# Sprite Sheet

import Event from '../base/Event'

class SpriteSheet

	constructor: (@url) ->
		Event.apply @

		@ready = no  # If this sprite sheet is loaded and parsed.
		@height = 0  # Height of this sprite

		@data = null  # The JSON data
		@images = []  # The `Image` list loaded
		@frameImages = []  # Parsed frame images

		# load and trigger parseData()
		$.ajax @url, success: (text) =>
			@data = JSON.parse text

			if not @data.images?
				@data.images = [@url.substring(@url.lastIndexOf('/'), @url.length - 5) + '.png']

			baseUrl = @url.substring 0, @url.lastIndexOf('/') + 1
			for own i of @data.images
				@data.images[i] = baseUrl + @data.images[i]

				countLoaded = 0
				@images[i] = new Image
				@images[i].onload = () =>
					countLoaded += 1
					@parseData() if countLoaded == @data.images.length
				@images[i].src = @data.images[i]

	parseData: ->
		# Clip the image for every frames
		frames = @data.frames
		for own i of frames
			for j in [0..4]
				if not frames[i][j]?
					frames[i][j] = if frames[i - 1]?[j]? then frames[i - 1][j] else 0
			x = frames[i][0]
			y = frames[i][1]
			w = frames[i][2]
			h = frames[i][3]
			frameIndex = frames[i][4]
			@frameImages[i] = clipImage @images[frameIndex], x, y, w, h
			@height = h if @height == 0

		@ready = yes
		@trigger 'loaded'

	getFrameImage: (key, index = 0) ->
		return null unless @ready
		animation = @data.animations[key]
		return null unless animation?

		return @frameImages[animation.frames[index]]

	measureTextWidth: (text) ->
		width = 0
		for char in text
			width += @getFrameImage(char).width
		width

	#----------------------------------------------------------------------
	# Private members
	#----------------------------------------------------------------------

	canvas = document.createElement 'canvas'
	context = canvas.getContext '2d'

	clipImage = (image, x, y, w, h) ->
		canvas.width = w
		canvas.height = h
		context.drawImage image, x, y, w, h, 0, 0, w, h

		newImage = new Image()
		newImage.src = canvas.toDataURL()
		return newImage

export default SpriteSheet
