# Namespace, constants, utility functions and polyfills

#----------------------------------------------------------------------
# Namespace
#----------------------------------------------------------------------

global = window or @
global.Bu = {global}


#----------------------------------------------------------------------
# Constants
#----------------------------------------------------------------------

# Version info
Bu.VERSION = '0.4.0'

# Browser vendor prefixes, used in experimental features
Bu.BROWSER_VENDOR_PREFIXES = ['webkit', 'moz', 'ms']

# Math
Bu.HALF_PI = Math.PI / 2
Bu.TWO_PI = Math.PI * 2

# Default font for the text
Bu.DEFAULT_FONT_FAMILY = 'Verdana'
Bu.DEFAULT_FONT_SIZE = 11
Bu.DEFAULT_FONT = '11px Verdana'

# Point is rendered as a small circle on screen. This is the radius of the circle.
Bu.POINT_RENDER_SIZE = 2.25

# Point can have a label attached near it. This is the gap distance between them.
Bu.POINT_LABEL_OFFSET = 5

# Default smooth factor of spline, range in [0, 1] and 1 is the smoothest
Bu.DEFAULT_SPLINE_SMOOTH = 0.25

# How close a point to a line is regarded that the point is **ON** the line.
Bu.DEFAULT_NEAR_DIST = 5

# Enumeration of mouse buttons, used to compare with `e.buttons` of mouse events
Bu.MOUSE =
	NONE:   0
	LEFT:   1
	RIGHT: 2
	MIDDLE:  4


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
	[from, to] = [0, from] unless to?
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
	if Bu.isPlainObject givenOptions
		for i of givenOptions when givenOptions[i]?
			defaultOptions[i] = givenOptions[i]
	return defaultOptions

# Check if an variable is a number
Bu.isNumber = (o) ->
	typeof o == 'number'

# Check if an variable is a string
Bu.isString = (o) ->
	typeof o == 'string'

# Check if an object is an plain object, not instance of class/function
Bu.isPlainObject = (o) ->
	o instanceof Object and o.constructor.name == 'Object'

# Check if an object is a function
Bu.isFunction = (o) ->
	o instanceof Object and o.constructor.name == 'Function'

# Check if an object is a Array
Bu.isArray = (o) ->
	o instanceof Array

# Clone an Object or Array
Bu.clone = (target) ->
	if typeof(target) != 'object' or target == null or Bu.isFunction target
		target
	else
		return target.clone() if target.clone?

		# FIXME cause stack overflow when its a circular structure
		if Bu.isArray target
			clone = []
		else if Bu.isPlainObject target
			clone = {}
		else # instance of class
			clone = Object.create target.constructor.prototype

		for own i of target
			clone[i] = Bu.clone target[i]

		clone

# Use localStorage to persist data
Bu.data = (key, value) ->
	if value?
		localStorage['Bu.' + key] = JSON.stringify value
	else
		value = localStorage['Bu.' + key]
		if value? then JSON.parse value else null

# Execute a callback function when the document is ready
Bu.ready = (cb, context, args) ->
	if document.readyState == 'complete'
		cb.apply context, args
	else
		document.addEventListener 'DOMContentLoaded', -> cb.apply context, args

#----------------------------------------------------------------------
# Polyfills
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

#----------------------------------------------------------------------
# Others
#----------------------------------------------------------------------

# Output version info to the console, at most one time in a minute.
currentTime = Date.now()
lastTime = Bu.data 'version.timestamp'
unless lastTime? and currentTime - lastTime < 60 * 1000
	console.info? 'Bu.js v' + Bu.VERSION + ' - [https://github.com/jarvisniu/Bu.js]'
	Bu.data 'version.timestamp', currentTime
