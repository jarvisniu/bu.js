# Declarative framework for Bu.js apps

###=================================================================##
All supported constructor options:
(The appearance sequence is the process sequence.)
{
    renderer: # settings to the renderer
    	container: '#container' # css selector of the container dom or itself
        cursor: 'crosshand' # the default cursor style on the <canvas>
        background: 'pink' # the default background of the <canvas>
    	showKeyPoints: true # whether to show the key points of shapes (if they have).
    data: { var } # variables of this Bu.js app, will be copied to the app object
    methods: { function }# functions of this Bu.js app, will be copied to the app object
    objects: {} or function that returns {} # all the renderable objects
	hierarchy: # an tree that represent the object hierarchy of the scene, the keys are in `objects`
    events: # event listeners, 'mousedown', 'mousemove', 'mouseup' will automatically be bound to <canvas>
    init: function # called when the document is ready
    update: function # called every frame
}
##=================================================================###

class Bu.App

	constructor: (@$options = {}) ->
		for k in ["renderer", "data", "objects", "hierarchy", "methods", "events"]
			@$options[k] or= {}

		@$objects = {}
		@$inputManager = new Bu.InputManager

		Bu.ready @init, @

	init: () ->

		# scene
		scene = new Bu.Scene
		scene.background = @$options.background or Bu.Scene.DEFAULT_BACKGROUND

		# renderer
		@$renderer = new Bu.Renderer @$options.renderer

		@$renderer.scene = scene
		scene.renderer = @$renderer

		# data
		if Bu.isFunction @$options.data
			@$options.data = @$options.data.apply this
		@[k] = @$options.data[k] for k of @$options.data

		# methods
		@[k] = @$options.methods[k] for k of @$options.methods

		# objects
		if Bu.isFunction @$options.objects
			@$objects = @$options.objects.apply this
		else
			@$objects[name] = @$options.objects[name] for name of @$options.objects

		# hierarchy
		# TODO use an algorithm to avoid circular structure
		assembleObjects = (children, parent) =>
			for own name of children
				parent.addChild @$objects[name]
				assembleObjects children[name], @$objects[name]
		assembleObjects @$options.hierarchy, @$renderer.scene

		# init
		@$options.init?.call @

		# events
		@$inputManager.handleAppEvents @, @$options.events

		# update
		if @$options.update?
			@$renderer.on 'update', => @$options.update.apply this, arguments
