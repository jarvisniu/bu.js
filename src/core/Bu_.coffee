# Declarative framework for Bu.js apps

###=================================================================##
All supported constructor options:
(The appearance sequence is the process sequence.)
{
    renderer: # settings to the renderer
    	container: '#container' # css selector of the container dom or itself
        background: 'pink' # the default background of the <canvas>
    	showKeyPoints: true # whether to show the key points of shapes (if they have).
    data: { var } # variables of this Bu.js app, will be copied to the app object
    methods: { function }# functions of this Bu.js app, will be copied to the app object
    objects: {} or function that returns {} # all the renderable objects
	scene: # an tree that represent the object tree of the scene, the keys are in `objects`
    events: # event listeners, 'mousedown', 'mousemove', 'mouseup' will automatically be bound to <canvas>
    init: function # called when the document is ready
    update: function # called every frame
}
##=================================================================###

import utils from '../base/utils.js'

import Renderer from '../core/Renderer.coffee'
import Scene from '../core/Scene.coffee'

import InputManager from '../input/InputManager.coffee'

class Bu

	constructor: (@$options = {}) ->
		for k in ["renderer", "data", "objects", "methods", "events"]
			@$options[k] or= {}

		@$inputManager = new InputManager

		utils.ready @init, @

	init: () ->

# scene
		scene = new Scene
		scene.background = @$options.background or Scene.DEFAULT_BACKGROUND

		# renderer
		@$renderer = new Renderer @$options.renderer

		@$renderer.scene = scene
		scene.renderer = @$renderer

		# data
		if typeof @$options.data == 'function'
			@$options.data = @$options.data.apply this
		@[k] = @$options.data[k] for k of @$options.data

		# methods
		@[k] = @$options.methods[k] for k of @$options.methods

		# objects
		objects = if typeof @$options.objects == 'function'
			@$options.objects.apply this
		else
			@$options.objects
		@[name] = objects[name] for name of objects

		# create default scene tree
		unless @$options.scene
			@$options.scene = {}
			for name of objects
				@$options.scene[name] = {}

		# assemble scene tree
		# TODO use an algorithm to avoid circular structure
		assembleObjects = (children, parent) =>
			for own name of children
				parent.addChild objects[name]
				assembleObjects children[name], objects[name]
		assembleObjects @$options.scene, @$renderer.scene

		# init
		@$options.init?.call @

		# events
		@$inputManager.handleAppEvents @, @$options.events

		# update
		if @$options.update?
			@$renderer.on 'update', => @$options.update.apply this, arguments

export default Bu
