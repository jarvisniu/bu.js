# Scene is the root of the object tree

class Bu.Scene extends Bu.Object2D

	constructor: () ->
		super()
		@type = 'Scene'
		@background = Bu.Scene.DEFAULT_BACKGROUND
		@renderer = null

Bu.Scene.DEFAULT_BACKGROUND = '#eee'
