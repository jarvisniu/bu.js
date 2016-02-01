# hierarchy manage

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Bu.Event.apply @

		@visible = yes
		@opacity = 1

		@position = new Bu.Vector()
		@rotation = 0
		@scale = new Bu.Vector(1, 1)
		@skew = new Bu.Vector()

#		@toWorldMatrix = new Bu.Matrix()
#		@updateMatrix ->

		@bounds = null  # for accelerate contain test
		@keyPoints = null
		@children = []
		@parent = null

	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no