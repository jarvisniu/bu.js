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

	$objects: {}

	constructor: (@options = {}) ->
		for k in ["renderer", "camera", "data", "objects", "hierarchy", "methods", "events"]
			@options[k] or= {}

		Bu.ready @init, @

	init: () ->
		# renderer
		@$renderer = new Bu.Renderer @options.renderer

		# data
		if Bu.isFunction @options.data
			@options.data = @options.data.apply this
		@[k] = @options.data[k] for k of @options.data

		# methods
		@[k] = @options.methods[k] for k of @options.methods

		# objects
		if Bu.isFunction @options.objects
			@$objects = @options.objects.apply this
		else
			@$objects[name] = @options.objects[name] for name of @options.objects

		# hierarchy
		# TODO use an algorithm to avoid circular structure
		assembleObjects = (children, parent) =>
			for own name of children
				parent.children.push @$objects[name]
				assembleObjects children[name], @$objects[name]
		assembleObjects @options.hierarchy, @$renderer.scene

		# init
		@options.init?.call @

		# events
		@events = @options.events
		for type of @events
			if type == 'mousedown'
				@$renderer.dom.addEventListener 'mousedown', (e) => @events['mousedown'].call this, e
			else if type == 'mousemove'
				@$renderer.dom.addEventListener 'mousemove', (e) => @events['mousemove'].call this, e
			else if type == 'mouseup'
				@$renderer.dom.addEventListener 'mouseup', (e) => @events['mouseup'].call this, e
		# TODO add supports for "keydown.Ctrl+F", "mousedown.Left"

		# update
		if @options.update?
			@$renderer.on 'update', => @options.update.apply this, arguments

	trigger: (type, arg) ->
		@events[type]?.call @, arg
