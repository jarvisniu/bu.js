# hierarchy manage

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Bu.Event.apply @

		@visible = yes
		@opacity = 1

		@translate = new Bu.Vector()
		@rotation = 0
		@scale = 1
		@skew = new Bu.Vector()

		#@toWorldMatrix = new Bu.Matrix()
		#@updateMatrix ->

		@bounds = null # for accelerate contain test
		@keyPoints = null
		@children = []
		@parent = null

	animate: (anim, args) ->
		if typeof anim == 'string'
			if anim of Bu.animations
				Bu.animations[anim].apply @, args
			else
				console.warn "Bu.animations[\"#{ anim }\"] doesn't exists."
		else if anim instanceof Array
			@animate a, args for a in anim
		else
			anim.apply @, args

	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no
