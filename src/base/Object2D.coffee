# Base class of all shapes and other renderable objects

import Bounds from '../math/Bounds.coffee'
import Vector from '../math/Vector.coffee'
#import Scene from '../core/Scene.coffee'

import Styled from './Styled.coffee'
import Event from './Event.coffee'

class Object2D

	type: 'Object2D'
	fillable: no

	constructor: () ->
		Styled.apply @
		Event.apply @

		@visible = yes
		@opacity = 1

		@position = new Vector
		@rotation = 0
		@_scale = new Vector 1, 1
		@skew = new Vector

		#@toWorldMatrix = new Bu.Matrix()
		#@updateMatrix ->

		# geometry related
		@bounds = null # used to accelerate the hit testing
		@keyPoints = null

		# hierarchy
		@children = []
		@parent = null

	@property 'scale',
		get: -> @_scale
		set: (val) ->
			if typeof val == 'number'
				@_scale.x = @_scale.y = val
			else
				@_scale = val

	# Translate an object
	translate: (dx, dy) ->
		@position.x += dx
		@position.y += dy
		@

	# Rotate an object
	rotate: (da) ->
		@rotation += da
		@

	# Scale an object by
	scaleBy: (ds) ->
		@scale *= ds
		@

	# Scale an object to
	scaleTo: (s) ->
		@scale = s
		@

	# Get the root node of the scene tree
	getScene: ->
		node = @
		loop
			break if node instanceof Bu.Scene # TODO circular reference
			node = node.parent
		node

	# Add object(s) to children
	addChild: (shape) ->
		if Bu.isArray shape
			for s in shape
				@children.push s
				s.parent = @
		else
			@children.push shape
			shape.parent = @
		@

	# Remove object from children
	removeChild: (shape) ->
		index = @children.indexOf shape
		@children.splice index, 1 if index > -1
		@

	# Apply an animation on this object
	# The type of `anim` may be:
	#     1. Preset animations: the animation name(string type), ie. key in `Bu.animations`
	#     2. Custom animations: the animation object of `Animation` type
	#     3. Multiple animations: An array whose children are above two types
	animate: (anim, args) ->
		args = [args] unless Bu.isArray args
		if typeof anim == 'string'
			if anim of Bu.animations
				Bu.animations[anim].applyTo @, args
			else
				console.warn "Bu.animations[\"#{ anim }\"] doesn't exists."
		else if Bu.isArray anim
			@animate anim[i], args for own i of anim
		else
			anim.applyTo @, args
		@

	# Create Bounds for this object
	createBounds: ->
		@bounds = new Bounds @
		@

	# Hit testing with unprojections
	hitTest: (v) ->
		renderer = @getScene().renderer
		v.offset(-renderer.width / 2, -renderer.height / 2) if renderer.originAtCenter
		v.project renderer.camera
		v.unProject @
		@containsPoint v

	# Hit testing in the same coordinate
	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no

export default Object2D
