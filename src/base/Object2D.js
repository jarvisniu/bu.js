// Base class of all shapes and other renderable objects

import Bu from '../core/Bu.js'
import utils from '../base/utils.js'

import Bounds from '../math/Bounds.coffee'
import Vector from '../math/Vector.coffee'

import Styled from './Styled.js'
import Event from './Event.js'

class Object2D {

	constructor() {
		Styled.apply(this)
		Event.apply(this)

		this.visible = true
		this.opacity = 1

		this.position = new Vector
		this.rotation = 0
		this._scale = new Vector(1, 1)
		this.skew = new Vector
		// this.toWorldMatrix = new Matrix()

		// geometry related
		this.bounds = null // used to accelerate the hit testing
		this.keyPoints = null

		// hierarchy
		this.children = []
		this.parent = null
	}

	// Translate an object
	translate(dx, dy) {
		this.position.x += dx
		this.position.y += dy
		return this
	}

	// Rotate an object
	rotate(da) {
		this.rotation += da
		return this
	}

	// Scale an object by
	scaleBy(ds) {
		this.scale *= ds
		return this
	}

	// Scale an object to
	scaleTo(s) {
		this.scale = s
		return this
	}

	// Get the root node of the scene tree
	getScene() {
		let node = this
		while (true) {
			if (node.type === 'Scene') { // TODO circular reference
				break
			}
			node = node.parent
		}
		return node
	}

	// Add object(s) to children
	addChild(shape) {
		if (utils.isArray(shape)) {
			for (let s of shape) {
				this.children.push(s)
				s.parent = this
			}
		} else {
			this.children.push(shape)
			shape.parent = this
		}
		return this
	}

	// Remove object from children
	removeChild(shape) {
		let index = this.children.indexOf(shape)
		if (index > -1) this.children.splice(index, 1)
		return this
	}

	// Apply an animation on this object
	// The type of `anim` may be:
	//     1. Preset animations: the animation name(string type), ie. key in `Bu.animations`
	//     2. Custom animations: the animation object of `Animation` type
	//     3. Multiple animations: An array whose children are above two types
	animate(anim, args) {
		if (!utils.isArray(args)) args = [args]
		if (typeof anim === 'string') {
			if (anim in Bu.animations) {
				Bu.animations[anim].applyTo(this, args)
			} else {
				console.warn(`Bu.animations["${anim}"] doesn't exists.`)
			}
		} else if (utils.isArray(anim)) {
			for (let i in anim) {
				if (!anim.hasOwnProperty(i)) continue
				this.animate(anim[i], args)
			}
		} else {
			anim.applyTo(this, args)
		}
		return this
	}

	// Create Bounds for this object
	createBounds() {
		this.bounds = new Bounds(this)
		return this
	}

	// Hit testing with unprojections
	hitTest(v) {
		let renderer = this.getScene().renderer
		if (renderer.originAtCenter) {
			v.offset(-renderer.width / 2, -renderer.height / 2)
		}
		v.project(renderer.camera)
		v.unProject(this)
		return this.containsPoint(v)
	}

	// Hit testing in the same coordinate
	containsPoint(p) {
		if (this.bounds && !this.bounds.containsPoint(p)) {
			return false
		} else if (this._containsPoint) {
			return this._containsPoint(p)
		} else {
			return false
		}
	}

}

Object2D.prototype.type = 'Object2D'
Object2D.prototype.fillable = false

Object2D.property('scale', {
	get: function () {
		return this._scale
	},
	set: function (val) {
		if (typeof val === 'number') {
			return this._scale.x = this._scale.y = val
		} else {
			return this._scale = val
		}
	}
})

export default Object2D
