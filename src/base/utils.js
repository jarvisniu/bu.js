// Constants and Utils Functions

// Math
const HALF_PI = Math.PI / 2
const TWO_PI = Math.PI * 2

// Point is rendered as a small circle on screen. This is the radius of the circle.
const POINT_RENDER_SIZE = 2.25

// Point can have a label attached near it. This is the gap distance between them.
const POINT_LABEL_OFFSET = 5

// Default smooth factor of spline, range in [0, 1] and 1 is the smoothest
const DEFAULT_SPLINE_SMOOTH = 0.25

// How close a point to a line is regarded that the point is **ON** the line.
const DEFAULT_NEAR_DIST = 5

// Enumeration of mouse buttons, used to compare with `e.buttons` of mouse events
const MOUSE = {
	NONE: 0,
	LEFT: 1,
	RIGHT: 2,
	MIDDLE: 4,
}

// Shortcut to define a property for a class. This is used to solve the problem
// that CoffeeScript didn't support getters and setters.
// TODO rewrite in js
// class Person
//   @constructor: (age) ->
//     @_age = age

//   @property 'age',
//     get: -> @_age
//     set: (val) ->
//       @_age = val

Function.prototype.property = function (prop, desc) {
	return Object.defineProperty(this.prototype, prop, desc)
}

// Calculate the mean value of numbers
function average() {
	let ns = arguments
	if (typeof ns[0] === 'object') ns = ns[0]

	let sum = 0
	for (let n of ns) {
		sum += n
	}
	return sum / ns.length
}

// Calculate the hypotenuse from the cathetuses
function bevel(x, y) {
	return Math.sqrt(x * x + y * y)
}

// Limit a number by minimum value and maximum value
function clamp(x, min, max) {
	if (x < min) {
		x = min
	}
	if (x > max) {
		x = max
	}
	return x
}

// Generate a random number between two numbers
function rand(from, to) {
	if (!to) {
		[from, to] = [0, from]
	}
	return Math.random() * (to - from) + from
}

// Convert an angle from radian to deg
function r2d(r) {
	return (r * 180 / Math.PI).toFixed(1)
}

// Convert an angle from deg to radian
function d2r(r) {
	return r * Math.PI / 180
}

// Get the current timestamp
function now() {
	return window.performance.now()
}

// Combine the given options (last item of arguments) with the default options
function combineOptions(args, defaultOptions) {
	if (!defaultOptions) defaultOptions = {}
	let givenOptions = args[args.length - 1]
	if (isPlainObject(givenOptions)) {
		for (let i in givenOptions) {
			if (givenOptions[i]) defaultOptions[i] = givenOptions[i]
		}
	}
	return defaultOptions
}

// Check if an object is an plain object, not instance of class/function
function isPlainObject(o) {
	return o instanceof Object && o.constructor.name === 'Object'
}

// Check if an object is a Array
function isArray(o) {
	return o instanceof Array
}

// Clone an Object or Array
function clone(target) {
	if (typeof target !== 'object' || target === null || typeof target === 'function') {
		return target
	} else {
		if (target.clone) {
			return target.clone()
		}
		// FIXME cause stack overflow when its a circular structure
		let newObj
		if (isArray(target)) {
			newObj = []
		} else if (isPlainObject(target)) {
			newObj = {} // instance of class
		} else {
			newObj = Object.create(target.constructor.prototype)
		}
		for (let i in target) {
			if (!target.hasOwnProperty(i))continue
			newObj[i] = clone(target[i])
		}
		return newObj
	}
}

// Make a copy of this function which has a limited shortest executing interval.
function throttle(fn, limit = 0.5) {
	let currTime = 0
	let lastTime = 0

	return function () {
		currTime = Date.now()
		if (currTime - lastTime > limit * 1000) {
			fn.apply(null, arguments)
			lastTime = currTime
		}
	}
}

// Make a copy of this function whose execution will be continuously put off
// after every calling of this function.
function debounce(fn, delay = 0.5) {
	let args = null
	let timeout = null

	let later = () => {
		fn.apply(null, args)
	}

	return function () {
		args = arguments
		clearTimeout(timeout)
		timeout = setTimeout(later, delay * 1000)
	}
}

// Use localStorage to persist data
// TODO rename to store
function data(key, value) {
	if (value) {
		return localStorage['Bu.' + key] = JSON.stringify(value)
	} else {
		value = localStorage['Bu.' + key]
		if (value) {
			return JSON.parse(value)
		} else {
			return null
		}
	}
}

export default {
	HALF_PI,
	TWO_PI,
	POINT_RENDER_SIZE,
	POINT_LABEL_OFFSET,
	DEFAULT_SPLINE_SMOOTH,
	DEFAULT_NEAR_DIST,
	MOUSE,

	average,
	bevel,
	clamp,
	rand,
	r2d,
	d2r,
	now,
	combineOptions,
	isPlainObject,
	isArray,
	clone,
	throttle,
	debounce,
	data,
}
