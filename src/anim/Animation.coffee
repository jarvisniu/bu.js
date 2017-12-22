# animation class and preset animations

import Color from '../math/Color.coffee'

import AnimationTask from './AnimationTask.coffee'

class Animation

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
		args = [args] unless Bu.isArray args
		task = new AnimationTask @, target, args
		Bu.animationRunner.add task # TODO use module
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
# TODO remove out of here
Bu.animations =

	#----------------------------------------------------------------------
	# Simple
	#----------------------------------------------------------------------

	fadeIn: new Animation
		update: (anim) ->
			@opacity = anim.t

	fadeOut: new Animation
		update: (anim) ->
			@opacity = 1 - anim.t

	spin: new Animation
		update: (anim) ->
			@rotation = anim.t * Math.PI * 2

	spinIn: new Animation
		init: (anim) ->
			anim.data.desScale = anim.arg or 1
		update: (anim) ->
			@opacity = anim.t
			@rotation = anim.t * Math.PI * 4
			@scale = anim.t * anim.data.desScale

	spinOut: new Animation
		update: (anim) ->
			@opacity = 1 - anim.t
			@rotation = anim.t * Math.PI * 4
			@scale = 1 - anim.t

	blink: new Animation
		duration: 0.2
		from: 0
		to: 512
		update: (anim) ->
			d = Math.floor Math.abs(anim.current - 256)
			@fillStyle = "rgb(#{ d }, #{ d }, #{ d })"

	shake: new Animation
		init: (anim) ->
			anim.data.ox = @position.x
			anim.data.range = anim.arg or 20
		update: (anim) ->
			@position.x = Math.sin(anim.t * Math.PI * 8) * anim.data.range + anim.data.ox

	jump: new Animation
		init: (anim) ->
			anim.data.oy = @position.y
			anim.data.height = anim.arg or 100
		update: (anim) ->
			@position.y = - anim.data.height * Math.sin(anim.t * Math.PI) + anim.data.oy

	#----------------------------------------------------------------------
	# Toggled: detect and save original status
	#----------------------------------------------------------------------

	puff: new Animation
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

	clip: new Animation
		init: (anim) ->
			if @scale.y != 0
				anim.from = @scale.y
				anim.to = 0
			else
				anim.from = @scale.y
				anim.to = @scale.x
		update: (anim) ->
			@scale.y = anim.current

	flipX: new Animation
		init: (anim) ->
			anim.from = @scale.x
			anim.to = -anim.from
		update: (anim) ->
			@scale.x = anim.current

	flipY: new Animation
		init: (anim) ->
			anim.from = @scale.y
			anim.to = -anim.from
		update: (anim) ->
			@scale.y = anim.current

	#----------------------------------------------------------------------
	# With Arguments
	#----------------------------------------------------------------------

	moveTo: new Animation
		init: (anim) ->
			if anim.arg?
				anim.from = @position.x
				anim.to = parseFloat anim.arg
			else
				console.error 'Bu.animations.moveTo need an argument'
		update: (anim) ->
			@position.x = anim.current

	moveBy: new Animation
		init: (anim) ->
			if anim.args?
				anim.from = @position.x
				anim.to = @position.x + parseFloat(anim.args)
			else
				console.error 'Bu.animations.moveBy need an argument'
		update: (anim) ->
			@position.x = anim.current

	discolor: new Animation
		init: (anim) ->
			desColor = anim.arg
			desColor = new Color desColor if typeof desColor == 'string'
			anim.from = new Color @fillStyle
			anim.to = desColor
		update: (anim) ->
			@fillStyle = anim.current.toRGBA()

export default Animation
