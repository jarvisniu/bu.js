# Namespace, constants, utility functions and polyfills

import utils from './utils.js'

#----------------------------------------------------------------------
# Namespace
#----------------------------------------------------------------------

Bu = window.Bu = {}

#----------------------------------------------------------------------
# Constants
#----------------------------------------------------------------------

# Version info
Bu.version = '0.4.0'

# Math
Bu.HALF_PI = Math.PI / 2
Bu.TWO_PI = Math.PI * 2

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

# utils in examples

Bu[name] = utils[name] for name in ['d2r', 'rand']

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

#----------------------------------------------------------------------
# Others
#----------------------------------------------------------------------

# Output version info to the console, at most one time in a minute.
currentTime = Date.now()
lastTime = utils.data 'version.timestamp'
unless lastTime? and currentTime - lastTime < 60 * 1000
	console.info? 'Bu.js v' + Bu.version + ' - [https://github.com/jarvisniu/Bu.js]'
	utils.data 'version.timestamp', currentTime

export default Bu
