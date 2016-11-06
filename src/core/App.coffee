# Declarative framework for Bu.js apps

###=================================================================##
All supported constructor options:
(The appearance sequence is the process sequence.)
{
    canvas: # settings to the canvas
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
		for k in ["canvas", "camera", "data", "objects", "hierarchy", "methods", "events"]
			@options[k] or= {}

		if document.readyState == 'complete'
			@init()
		else
			document.addEventListener 'DOMContentLoaded', => @init()

	init: () ->
		# canvas
		@$canvas = new Bu
			container: @options.canvas.container
			showKeyPoints: @options.canvas.showKeyPoints
			background: @options.canvas.background
		@$canvas.dom.style.cursor and= @options.canvas.cursor

		# data & methods
		@[k] = @options.data[k] for k of @options.data
		@[k] = @options.methods[k] for k of @options.methods

		# objects
		if @options.objects instanceof Function
			@$objects = @options.objects.apply this
		else
			@$objects[name] = @options.objects[name] for name of @options.objects

		# hierarchy
		# TODO use an algorithm to avoid circular structure
		assembleObjects = (children, parent) =>
			for own name of children
				parent.push @$objects[name]
				assembleObjects children[name], @$objects[name].children
		assembleObjects @options.hierarchy, @$canvas.shapes

		# init
		@options.init?.call @

		# events
		@events = @options.events
		for type of @events
			if type == 'mousedown'
				@$canvas.dom.addEventListener 'mousedown', (e) => @events['mousedown'].call this, e
			else if type == 'mousemove'
				@$canvas.dom.addEventListener 'mousemove', (e) => @events['mousemove'].call this, e
			else if type == 'mouseup'
				@$canvas.dom.addEventListener 'mouseup', (e) => @events['mouseup'].call this, e
		# TODO add supports for "keydown.Ctrl+F", "mousedown.Left"

		# update
		if @options.update?
			@$canvas.on 'update', => @options.update.apply this, arguments

	trigger: (type, arg) ->
		@events[type]?.call @, arg
