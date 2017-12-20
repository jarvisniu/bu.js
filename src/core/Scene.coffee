# Scene is the root of the object tree

import Object2D from '../base/Object2D'

class Bu.Scene extends Object2D

	constructor: () ->
		super()
		@type = 'Scene'
		@background = Bu.Scene.DEFAULT_BACKGROUND
		@renderer = null

Bu.Scene.DEFAULT_BACKGROUND = '#eee'
