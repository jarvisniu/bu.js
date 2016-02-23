# animation

class Bu.Animation

	constructor: (options) ->
		@from = options.from
		@to = options.to
		@data = options.data or {}
		@duration = options.duration or 0.5
		@repeat = if options.repeat? then options.repeat else false
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
		update: (t) ->
			@opacity = t
			@rotation = t * Math.PI * 4
			@scale = t

	spinOut: new Bu.Animation
		update: (t) ->
			@opacity = 1 - t
			@rotation = t * Math.PI * 4
			@scale = 1 - t

	blink: new Bu.Animation
		duration: 0.2
		from: 0
		to: 512
		update: (d) ->
			d = Math.floor Math.abs(d - 256)
			@fillStyle = "rgb(#{ d }, #{ d }, #{ d })"

	shake: new Bu.Animation
		init: (anim, arg) ->
			anim.data.ox = @translate.x
			anim.data.range = arg or 20
		update: (t, data) ->
			@translate.x = Math.sin(t * Math.PI * 8) * data.range + data.ox

	# toggle: detect and save original status

	puff: new Bu.Animation
		duration: 0.15
		init: (anim) ->
			anim.from =
				opacity: @opacity
				scale: if @opacity == 1 then 1 else 1.5
			anim.to =
				opacity: if @opacity == 1 then 0 else 1
				scale: if @opacity == 1 then 1.5 else 1
		update: (d) ->
			@opacity = d.opacity
			@scale = d.scale

	clip: new Bu.Animation
		init: (anim) ->
			if typeof @scale == 'number'
				@scale = new Bu.Vector @scale, @scale
			if @scale.y == 0
				anim.from = 0
				anim.to = 1
			else
				anim.from = 1
				anim.to = 0
		update: (d) ->
			@scale.y = d

	flipX: new Bu.Animation
		init: (anim) ->
			if typeof @scale == 'number'
				@scale = new Bu.Vector @scale, @scale
			anim.from = @scale.x
			anim.to = -anim.from
		update: (data) ->
			@scale.x = data

	flipY: new Bu.Animation
		init: (anim) ->
			if typeof @scale == 'number'
				@scale = new Bu.Vector @scale, @scale
			anim.from = @scale.y
			anim.to = -anim.from
		update: (d) ->
			@scale.y = d

	# with arguments

	moveTo: new Bu.Animation
		init: (anim, args) ->
			if args?
				anim.from = @translate.x
				anim.to = args
			else
				console.error 'animation moveTo need an argument'
		update: (data) ->
			@translate.x = data

	moveBy: new Bu.Animation
		init: (anim, args) ->
			if args?
				anim.from = @translate.x
				anim.to = @translate.x + parseFloat(args)
			else
				console.error 'animation moveTo need an argument'
		update: (data) ->
			@translate.x = data
