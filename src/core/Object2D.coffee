# hierarchy manage

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Za.EventListenerPattern.apply @

		@visible = yes
		@opacity = 1

		@position = new Bu.Vector()
		@rotation = 0
		@scale = new Bu.Vector(1, 1)
		@skew = new Bu.Vector()

#		@toWorldMatrix = new Bu.Matrix()
#		@updateMatrix ->

		@children = []
		@parent = null
