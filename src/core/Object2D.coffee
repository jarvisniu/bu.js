# hierarchy manage

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Bu.Event.apply @

		@visible = yes
		@opacity = 1

		@translate = new Bu.Vector
		@rotation = 0
		@_scale = new Bu.Vector 1, 1
		@skew = new Bu.Vector

		#@toWorldMatrix = new Bu.Matrix()
		#@updateMatrix ->

		@bounds = null # for accelerate contain test
		@keyPoints = null
		@children = []
		@parent = null

	@property 'scale',
		get: -> @_scale
		set: (val) ->
			if typeof val == 'number'
				@_scale.x = @_scale.y = val
			else
				@scale = val

	animate: (anim, args) ->
		if typeof anim == 'string'
			if anim of Bu.animations
				Bu.animations[anim].apply @, args
			else
				console.warn "Bu.animations[\"#{ anim }\"] doesn't exists."
		else if anim instanceof Array
			args = [args] unless args instanceof Array
			@animate anim[i], args for own i of anim
		else
			anim.apply @, args

	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no
