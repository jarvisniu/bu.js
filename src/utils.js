// Utils Functions

// Execute a callback function when the document is ready
function ready(cb, context, args) {
	if (document.readyState === 'complete') {
		cb.apply(context, args)
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			cb.apply(context, args)
		})
	}
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
	ready,
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
	data,
}
