# namespace and constants

@Bu =
	version: '0.1.0'

	# shapes related
	DEFAULT_STROKE_STYLE:       '#048'
	DEFAULT_FILL_STYLE:         'rgba(64, 128, 192, 0.5)'
	DEFAULT_DASH_STYLE:         [8, 4]

	# interaction related
	DEFAULT_STROKE_STYLE_HOVER:   'rgba(255, 128, 0, 0.75)'
	DEFAULT_FILL_STYLE_HOVER:   'rgba(255, 128, 128, 0.5)'

	# texts related
	DEFAULT_TEXT_FILL_STYLE:    'black'

	# default size
	DEFAULT_IMAGE_SIZE: 20
	POINT_RENDER_SIZE: 4


	# bounds related
	DEFAULT_BOUND_STROKE_STYLE:  '#444'
	DEFAULT_BOUND_DASH_STYLE:    [6, 6]

	# computation related
	DEFAULT_NEAR_DIST: 5

	# mouse interact
	MOUSE_BUTTON_NONE:   -1
	MOUSE_BUTTON_LEFT:   0
	MOUSE_BUTTON_MIDDLE: 1
	MOUSE_BUTTON_RIGHT:  2

###
# math
###

# calculate the mean value of several numbers
Bu.average = ()->
	ns = arguments
	ns = arguments[0] if typeof arguments[0] is 'object'
	sum = 0
	for i in ns
		sum += i
	sum / ns.length

# calculate the hypotenuse from the cathetuses
Bu.bevel = (x, y) ->
	Math.sqrt x * x + y * y

# generate a random number between two numbers
Bu.rand = (from, to) ->
	if not to?
		to = from
		from = 0
	Math.random() * (to - from) + from

###
# utils
###

# combine the given options(last item in arguments) with the default options
Bu.combineOptions = (args, defaultOptions) ->
	defaultOptions = {} if not defaultOptions?
	givenOptions = args[args.length - 1]
	if typeof givenOptions is 'object'
		for i of givenOptions
			defaultOptions[i] = givenOptions[i]
	return defaultOptions

###
# polyfill
###

# define a property for a class
Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

# Array
Array::each or= (fn) ->
	i = 0
	while i < @length
		fn @[i]
		i++
	return @

Array::map or= (fn) ->
	arr = []
	i = 0
	while i < @length
		arr.push fn(@[i])
		i++
	return @
