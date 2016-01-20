# hierarchy manage

class Geom2D.Object2D

	constructor: () ->
		Geom2D.Colorful.apply @

		@visible = yes

		@position = new Geom2D.Vector()
		@rotation = 0
		@scale = new Geom2D.Vector(1, 1)
		@skew = new Geom2D.Vector()

		@children = []
