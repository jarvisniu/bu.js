# Scene is the root of the object tree

class Bu.Scene extends Bu.Object2D

	constructor: (@renderer) ->
		super()
		@type = 'Scene'
