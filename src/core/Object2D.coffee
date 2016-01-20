# hierarchy manage

class Geom2D.Object2D

	constructor: () ->
		Geom2D.Colorful.apply @

		@visible = yes

		@position = new Geom2D.Point()
		@rotation = 0
		@scale = new Geom2D.Point(1, 1)
		@skew = new Geom2D.Point()

		@children = []
