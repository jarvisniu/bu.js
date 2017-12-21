# Scene is the root of the object tree

import Object2D from '../base/Object2D.coffee'

class Scene extends Object2D

	constructor: () ->
		super()
		@type = 'Scene'
		@background = Scene.DEFAULT_BACKGROUND
		@renderer = null

Scene.DEFAULT_BACKGROUND = '#eee'

export default Scene
