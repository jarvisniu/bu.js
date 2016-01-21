# hierarchy manage

class Geom2D.Object2D

	constructor: () ->
		Geom2D.Colorful.apply @
		Za.EventListenerPattern.apply @

		@visible = yes
		@opacity = 1

		@position = new Geom2D.Vector()
		@rotation = 0
		@scale = new Geom2D.Vector(1, 1)
		@skew = new Geom2D.Vector()

#		@toWorldMatrix = new Geom2D.Matrix()
#		@updateMatrix ->

		@children = []
		@parent = null
