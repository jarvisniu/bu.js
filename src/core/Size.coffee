# the size of rectangle, Bounds etc.

class Geom2D.Size
	constructor: (@width, @height) ->
		@type = "Size"

	set: (width, height) ->
		@width = width
		@height = height
