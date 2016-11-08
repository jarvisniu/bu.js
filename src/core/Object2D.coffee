# Base class of all shapes and other renderable objects

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Bu.Event.apply @
		@type = 'Object2D'

		@visible = yes
		@opacity = 1

		@position = new Bu.Vector
		@rotation = 0
		@_scale = new Bu.Vector 1, 1
		@skew = new Bu.Vector

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


	# Add object(s) to children
	addChild: (shape) ->
		if Bu.isArray shape
			@children.push s for s in shape
		else
			@children.push shape
		@

	# Remove object from children
	removeChild: (shape) ->
		index = @children.indexOf shape
		@children.splice index, 1 if index > -1
		@

	# Apply an animation on this object
	# The type of `anim` may be:
	#     1. Preset animations: the animation name(string type), ie. key in `Bu.animations`
	#     2. Custom animations: the animation object of `Bu.Animation` type
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
		@bounds = new Bu.Bounds @
		@

	# Hit testing
	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no
