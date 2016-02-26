# namespace, constants and utility functions

# global object
global = window or this

# namespace `Bu` is also a shortcut to class `Bu.Renderer`
global.Bu = () -> new Bu.Renderer arguments...

# save global
Bu.global = global


###
# constants
###

# library version
Bu.VERSION = '0.3.2'

# shapes related
Bu.DEFAULT_STROKE_STYLE = '#048'
Bu.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)'
Bu.DEFAULT_DASH_STYLE = [8, 4]

# curve related
Bu.DEFAULT_SPLINE_SMOOTH = 0.25 # range in [0 ~ 1]

# interaction related
Bu.DEFAULT_STROKE_STYLE_HOVER = 'rgba(255, 128, 0, 0.75)'
Bu.DEFAULT_FILL_STYLE_HOVER = 'rgba(255, 128, 128, 0.5)'

# texts related
Bu.DEFAULT_TEXT_FILL_STYLE = 'black'

# default size
Bu.DEFAULT_IMAGE_SIZE = 20
Bu.POINT_RENDER_SIZE = 2.25
Bu.POINT_LABEL_OFFSET = 5

# bounds related
Bu.DEFAULT_BOUND_STROKE_STYLE = '#444'
Bu.DEFAULT_BOUND_DASH_STYLE = [6, 6]

# computation related
Bu.DEFAULT_NEAR_DIST = 5

# mouse interact
Bu.MOUSE_BUTTON_NONE = -1
Bu.MOUSE_BUTTON_LEFT = 0
Bu.MOUSE_BUTTON_MIDDLE = 1
Bu.MOUSE_BUTTON_RIGHT = 2


###
# utility functions
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

# convert an angle from radian to deg
Bu.r2d = (r) -> (r * 180 / Math.PI).toFixed(1)

# convert an angle from deg to radian
Bu.d2r = (r) -> r * Math.PI / 180

# get current time
Bu.now = if window?.performance? then -> window.performance.now() else -> Date.now()

# combine the given options (last item of arguments) with the default options
Bu.combineOptions = (args, defaultOptions) ->
	defaultOptions = {} if not defaultOptions?
	givenOptions = args[args.length - 1]
	if typeof givenOptions is 'object'
		for i of givenOptions
			defaultOptions[i] = givenOptions[i]
	return defaultOptions

# clone an Object or Array
Bu.clone = (target, deep = false) ->
	# TODO deal with deep
	if target instanceof Array
		clone = []
		clone[i] = target[i] for own i of target
	else if target instanceof Object
		clone = {}
		clone[i] = target[i] for own i of target

# use localStorage to persist data
Bu.data = (key, value) ->
	if value?
		localStorage['Bu.' + key] = JSON.stringify value
	else
		value = localStorage['Bu.' + key]
		return if value? then JSON.parse value else null

###
# polyfill
###

# define a property for a class
Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

# throttle: limit the frequency of function call
Function::throttle = (limit = 0.5) ->
	currTime = 0
	lastTime = 0

	return () =>
		currTime = Date.now()
		if currTime - lastTime > limit * 1000
			@apply null, arguments
			lastTime = currTime

# debounce: delay the call of function
Function::debounce = (delay = 0.5) ->
	args = null
	timeout = null

	later = =>
		@apply null, args

	return () ->
		args = arguments
		clearTimeout timeout
		timeout = setTimeout later, delay * 1000


# Iterate this Array and do something with the items
Array::each or= (fn) ->
	i = 0
	while i < @length
		fn @[i]
		i++
	return @

# Iterate this Array and map the items to a new Array
Array::map or= (fn) ->
	arr = []
	i = 0
	while i < @length
		arr.push fn(@[i])
		i++
	return @

# Log lib info, at most one time per minute
lastBootTime = Bu.data 'lastInfo'
currentTime = Date.now()
if not lastBootTime? or currentTime - lastBootTime > 60 * 1000
	console.info? 'Bu.js v' + Bu.VERSION + ' - [https://github.com/jarvisniu/Bu.js]'
	Bu.data 'lastInfo', currentTime
