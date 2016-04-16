# run the animations

class Bu.AnimationRunner

	constructor: () ->
		@runningAnimations = []

	add: (animation, target, args) ->
		@runningAnimations.push
			animation: animation
			target: target
			startTime: Bu.now()
			current: animation.data
			finished: no
		animation.init?.call target, animation, args

	update: ->
		now = Bu.now()
		for task in @runningAnimations
			continue if task.finished

			anim = task.animation
			t = (now - task.startTime) / (anim.duration * 1000)
			if t > 1
				finish = true
				if anim.repeat
					t = 0
					task.startTime = Bu.now()
				else
					## TODO remove out of array
					t = 1
					task.finished = yes

			if anim.easing == true
				t = easingFunctions[DEFAULT_EASING_FUNCTION] t
			else if easingFunctions[anim.easing]?
				t = easingFunctions[anim.easing] t

			if anim.from?
				if anim.from instanceof Object
					for own key of anim.from when key of anim.to
						task.current[key] = anim.to[key] * t - anim.from[key] * (t - 1)
				else
					task.current = anim.to * t - anim.from * (t - 1)
				anim.update.apply task.target, [task.current, t]
			else
				anim.update.apply task.target, [t, task.current]
			if finish then anim.finish?.call task.target, anim

	# hook up on an renderer, remove own setInternal
	hookUp: (renderer) ->
		renderer.on 'update', => @update()

	DEFAULT_EASING_FUNCTION = 'quad'
	easingFunctions =
		quadIn: (t) -> t * t
		quadOut: (t) -> t * (2 - t)
		quad: (t) ->
			if t < 0.5
				2 * t * t
			else
				-2 * t * t + 4 * t - 1

		cubicIn: (t) -> t ** 3
		cubicOut: (t) -> (t - 1) ** 3 + 1
		cubic: (t) ->
			if t < 0.5
				4 * t ** 3
			else
				4 * (t - 1) ** 3 + 1

		sineIn: (t) -> Math.sin((t - 1) * Bu.HALF_PI) + 1
		sineOut: (t) -> Math.sin t * Bu.HALF_PI
		sine: (t) ->
			if t < 0.5
				(Math.sin((t * 2 - 1) * Bu.HALF_PI) + 1) / 2
			else
				Math.sin((t - 0.5) * Math.PI) / 2 + 0.5

		# TODO add quart, quint, expo, circ, back, elastic, bounce

# global unique instance
Bu.animationRunner = new Bu.AnimationRunner
