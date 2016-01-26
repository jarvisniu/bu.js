# the size of rectangle, Bounds etc.

class Bu.Size
	constructor: (@width, @height) ->
		@type = "Size"

	set: (width, height) ->
		@width = width
		@height = height
