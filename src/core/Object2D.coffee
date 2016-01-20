# hierarchy manage

class Geom2D.Object2D

	constructor: () ->
		Geom2D.Colorful.apply @
		@children = []
		@stroke = () =>
