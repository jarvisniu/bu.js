# animation class and preset animations

class Bu.Animation

	constructor: (options) ->
		@from = options.from
		@to = options.to
		@duration = options.duration or 0.5
		@easing = options.easing or false
		@repeat = !!options.repeat
		@init = options.init
		@update = options.update
		@finish = options.finish

	applyTo: (target, args) ->
		task = new Bu.AnimationTask @, target, args
		Bu.animationRunner.add task
		task

	isLegal: ->
		return true unless @from? and @to?

		if Bu.isPlainObject @from
			for own key of @from
				return false unless @to[key]?
		else
			return false unless @to?
		true

# Preset Animations
# Some of the animations are consistent with jQuery UI
Bu.animations =

	#----------------------------------------------------------------------
	# Simple
	#----------------------------------------------------------------------

	fadeIn: new Bu.Animation
		update: (anim) ->
			@opacity = anim.t

	fadeOut: new Bu.Animation
		update: (anim) ->
			@opacity = 1 - anim.t

	spin: new Bu.Animation
		update: (anim) ->
			@rotation = anim.t * Math.PI * 2

	spinIn: new Bu.Animation
		init: (anim) ->
			anim.data.desScale = anim.arg or 1
		update: (anim) ->
			@opacity = anim.t
			@rotation = anim.t * Math.PI * 4
			@scale = anim.t * anim.data.desScale

	spinOut: new Bu.Animation
		update: (anim) ->
			@opacity = 1 - anim.t
			@rotation = anim.t * Math.PI * 4
			@scale = 1 - anim.t

	blink: new Bu.Animation
		duration: 0.2
		from: 0
		to: 512
		update: (anim) ->
			d = Math.floor Math.abs(anim.current - 256)
			@fillStyle = "rgb(#{ d }, #{ d }, #{ d })"

	shake: new Bu.Animation
		init: (anim) ->
			anim.data.ox = @position.x
			anim.data.range = anim.arg or 20
		update: (anim) ->
			@position.x = Math.sin(anim.t * Math.PI * 8) * anim.data.range + anim.data.ox

	#----------------------------------------------------------------------
	# Toggled: detect and save original status
	#----------------------------------------------------------------------

	puff: new Bu.Animation
		duration: 0.15
		init: (anim) ->
			anim.from =
				opacity: @opacity
				scale: @scale.x
			anim.to =
				if @opacity == 1
					opacity: 0
					scale: @scale.x * 1.5
				else
					opacity: 1
					scale: @scale.x / 1.5
		update: (anim) ->
			@opacity = anim.current.opacity
			@scale = anim.current.scale

	clip: new Bu.Animation
		init: (anim) ->
			if @scale.y != 0
				anim.from = @scale.y
				anim.to = 0
			else
				anim.from = @scale.y
				anim.to = @scale.x
		update: (anim) ->
			@scale.y = anim.current

	flipX: new Bu.Animation
		init: (anim) ->
			anim.from = @scale.x
			anim.to = -anim.from
		update: (anim) ->
			@scale.x = anim.current

	flipY: new Bu.Animation
		init: (anim) ->
			anim.from = @scale.y
			anim.to = -anim.from
		update: (anim) ->
			@scale.y = anim.current

	#----------------------------------------------------------------------
	# With Arguments
	#----------------------------------------------------------------------

	moveTo: new Bu.Animation
		init: (anim) ->
			if anim.arg?
				anim.from = @position.x
				anim.to = parseFloat anim.arg
			else
				console.error 'animation moveTo need an argument'
		update: (anim) ->
			@position.x = anim.current

	moveBy: new Bu.Animation
		init: (anim) ->
			if anim.args?
				anim.from = @position.x
				anim.to = @position.x + parseFloat(anim.args)
			else
				console.error 'animation moveTo need an argument'
		update: (anim) ->
			@position.x = anim.current

	discolor: new Bu.Animation
		init: (anim) ->
			desColor = anim.arg
			desColor = new Bu.Color desColor if Bu.isString desColor
			anim.from = new Bu.Color @fillStyle
			anim.to = desColor
		update: (anim) ->
			@fillStyle = anim.current.toRGBA()
