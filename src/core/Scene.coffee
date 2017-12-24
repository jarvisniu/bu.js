# Scene is the root of the object tree

import Object2D from '../base/Object2D.js'

class Scene extends Object2D

	constructor: () ->
		super()
		@type = 'Scene'
		@background = Bu.config.background
		@renderer = null

export default Scene
