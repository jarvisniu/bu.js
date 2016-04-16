# animation

class Bu.Animation

	constructor: (options) ->
		@from = options.from
		@to = options.to
		@data = options.data or {}
		@duration = options.duration or 0.5
		@easing = options.easing or false
		@repeat = !!options.repeat
		@init = options.init
		@update = options.update
		@finish = options.finish

	apply: (target, args) ->
		Bu.animationRunner.add @, target, args

# prefab animations
# The names are according to jQuery UI
Bu.animations =

	# simple

	fadeIn: new Bu.Animation
		update: (t) ->
			@opacity = t

	fadeOut: new Bu.Animation
		update: (t) ->
			@opacity = 1 - t

	spin: new Bu.Animation
		update: (t) ->
			@rotation = t * Math.PI * 2

	spinIn: new Bu.Animation
		init: (anim, arg = 1) ->
			anim.data.ds = arg
		update: (t, data) ->
			@opacity = t
			@rotation = t * Math.PI * 4
			@scale = t * data.ds

	spinOut: new Bu.Animation
		update: (t) ->
			@opacity = 1 - t
			@rotation = t * Math.PI * 4
			@scale = 1 - t

	blink: new Bu.Animation
		duration: 0.2
		from: 0
		to: 512
		update: (data) ->
			data = Math.floor Math.abs(d - 256)
			@fillStyle = "rgb(#{ data }, #{ data }, #{ data })"

	shake: new Bu.Animation
		init: (anim, arg) ->
			anim.data.ox = @position.x
			anim.data.range = arg or 20
		update: (t, data) ->
			@position.x = Math.sin(t * Math.PI * 8) * data.range + data.ox

	# toggle: detect and save original status

	puff: new Bu.Animation
		duration: 0.15
		init: (anim) ->
			anim.from =
				opacity: @opacity
				scale: @scale.x
			anim.to =
				opacity: if @opacity == 1 then 0 else 1
				scale: if @opacity == 1 then @scale.x * 1.5 else @scale.x / 1.5
		update: (data) ->
			@opacity = data.opacity
			@scale = data.scale

	clip: new Bu.Animation
		init: (anim) ->
			if @scale.y != 0
				anim.from = @scale.y
				anim.to = 0
			else
				anim.from = @scale.y
				anim.to = @scale.x
		update: (data) ->
			@scale.y = data

	flipX: new Bu.Animation
		init: (anim) ->
			anim.from = @scale.x
			anim.to = -anim.from
		update: (data) ->
			@scale.x = data

	flipY: new Bu.Animation
		init: (anim) ->
			anim.from = @scale.y
			anim.to = -anim.from
		update: (data) ->
			@scale.y = data

	# with arguments

	moveTo: new Bu.Animation
		init: (anim, args) ->
			if args?
				anim.from = @position.x
				anim.to = args
			else
				console.error 'animation moveTo need an argument'
		update: (data) ->
			@position.x = data

	moveBy: new Bu.Animation
		init: (anim, args) ->
			if args?
				anim.from = @position.x
				anim.to = @position.x + parseFloat(args)
			else
				console.error 'animation moveTo need an argument'
		update: (data) ->
			@position.x = data
