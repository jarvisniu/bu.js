# Bu.coffee: namespace, constants, utility functions and polyfills

# Save the previous value of `global` variable.
previousGlobal = global

# Get the root object
global = window or @

# Define our namespace `Bu`. It is also a shortcut to class `Bu.Renderer`.
global.Bu = () -> new Bu.Renderer arguments...

# Save the root object to our namespace.
Bu.global = global

# Return back the previous global variable.
global = previousGlobal


#----------------------------------------------------------------------
# Constants
#----------------------------------------------------------------------

# Version info of this library
Bu.VERSION = '0.3.4'

# Math
Bu.HALF_PI = Math.PI / 2
Bu.TWO_PI = Math.PI * 2

# Default render style of shapes
Bu.DEFAULT_STROKE_STYLE = '#048'
Bu.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)'
Bu.DEFAULT_DASH_STYLE = [8, 4]

# Default render style when then mouse is hovered on
Bu.DEFAULT_STROKE_STYLE_HOVER = 'rgba(255, 128, 0, 0.75)'
Bu.DEFAULT_FILL_STYLE_HOVER = 'rgba(255, 128, 128, 0.5)'

# The default color of rendered text, PointText for now
Bu.DEFAULT_TEXT_FILL_STYLE = 'black'

# Point is rendered as a small circle on screen. This is the radius of the circle.
Bu.POINT_RENDER_SIZE = 2.25

# Point can have label aside it. This is the offset distance from the point.
Bu.POINT_LABEL_OFFSET = 5

# Default render style of bounds
Bu.DEFAULT_BOUND_STROKE_STYLE = '#444'

# Default dash style of bounds
Bu.DEFAULT_BOUND_DASH_STYLE = [6, 6]

# Default smooth factor of spline, range in [0, 1] and 1 is the smoothest
Bu.DEFAULT_SPLINE_SMOOTH = 0.25

# How close a point to a line is regarded that the point is **ON** the line.
Bu.DEFAULT_NEAR_DIST = 5

# Enumeration of mouse button
Bu.MOUSE_BUTTON_NONE = -1
Bu.MOUSE_BUTTON_LEFT = 0
Bu.MOUSE_BUTTON_MIDDLE = 1
Bu.MOUSE_BUTTON_RIGHT = 2


#----------------------------------------------------------------------
# Utility functions
#----------------------------------------------------------------------

# Calculate the mean value of numbers
Bu.average = ()->
	ns = arguments
	ns = arguments[0] if typeof arguments[0] is 'object'
	sum = 0
	for i in ns
		sum += i
	sum / ns.length

# Calculate the hypotenuse from the cathetuses
Bu.bevel = (x, y) ->
	Math.sqrt x * x + y * y

# Limit a number by minimum value and maximum value
Bu.clamp = (x, min, max) ->
	x = min if x < min
	x = max if x > max
	x

# Generate a random number between two numbers
Bu.rand = (from, to) ->
	if not to?
		to = from
		from = 0
	Math.random() * (to - from) + from

# Convert an angle from radian to deg
Bu.r2d = (r) -> (r * 180 / Math.PI).toFixed(1)

# Convert an angle from deg to radian
Bu.d2r = (r) -> r * Math.PI / 180

# Get the current timestamp
Bu.now = if Bu.global.performance? then -> Bu.global.performance.now() else -> Date.now()

# Combine the given options (last item of arguments) with the default options
Bu.combineOptions = (args, defaultOptions) ->
	defaultOptions = {} if not defaultOptions?
	givenOptions = args[args.length - 1]
	if typeof givenOptions is 'object'
		for i of givenOptions when givenOptions[i]?
			defaultOptions[i] = givenOptions[i]
	return defaultOptions

# Check if an object is an plain object, not instance of class/function
Bu.isPlainObject = (o) ->
	o instanceof Object and o.constructor.name == 'Object'

# Check if an object is a function
Bu.isFunction = (o) ->
	o instanceof Object and o.constructor.name == 'Function'

# Clone an Object or Array
Bu.clone = (target) ->
	if typeof(target) != 'object' or target == null or Bu.isFunction target
		return target
	else
		# FIXME cause stack overflow when its a circular structure
		if target instanceof Array
			clone = []
		else if Bu.isPlainObject target
			clone = {}
		else # instance of class
			clone = Object.create target.constructor.prototype

		for own i of target
			clone[i] = Bu.clone target[i]

		if clone.constructor.name == 'Function'
			console.log(clone);
		return clone

# Use localStorage to persist data
Bu.data = (key, value) ->
	if value?
		localStorage['Bu.' + key] = JSON.stringify value
	else
		value = localStorage['Bu.' + key]
		if value? then JSON.parse value else null

#----------------------------------------------------------------------
# Polyfill
#----------------------------------------------------------------------

# Shortcut to define a property for a class. This is used to solve the problem
# that CoffeeScript didn't support getters and setters.
# class Person
#   @constructor: (age) ->
#     @_age = age
#
#   @property 'age',
#     get: -> @_age
#     set: (val) ->
#       @_age = val
#
Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

# Make a copy of this function which has a limited shortest executing interval.
Function::throttle = (limit = 0.5) ->
	currTime = 0
	lastTime = 0

	return () =>
		currTime = Date.now()
		if currTime - lastTime > limit * 1000
			@apply null, arguments
			lastTime = currTime

# Make a copy of this function whose execution will be continuously put off
# after every calling of this function.
Function::debounce = (delay = 0.5) ->
	args = null
	timeout = null

	later = =>
		@apply null, args

	return () ->
		args = arguments
		clearTimeout timeout
		timeout = setTimeout later, delay * 1000


# Iterate this Array and do something with the items.
Array::each or= (fn) ->
	i = 0
	while i < @length
		fn @[i]
		i++
	return @

# Iterate this Array and map the items to a new Array.
Array::map or= (fn) ->
	arr = []
	i = 0
	while i < @length
		arr.push fn(@[i])
		i++
	return @

# Display version info. It will appear at most one time a minute.
lastBootTime = Bu.data 'lastInfo'
currentTime = Date.now()
unless lastBootTime? and currentTime - lastBootTime < 60 * 1000
	console.info? 'Bu.js v' + Bu.VERSION + ' - [https://github.com/jarvisniu/Bu.js]'
	Bu.data 'lastInfo', currentTime
