# Run the animation tasks

class Bu.AnimationRunner

	constructor: () ->
		@runningAnimations = []

	add: (anim, target, args) ->
		anim.init?.call target, anim, args
		if isAnimationLegal anim
			task =
				animation: anim
				target: target
				startTime: Bu.now()
				current: anim.data
				finished: no
			@runningAnimations.push task
			initTask task, anim
		else
			console.error 'Bu.AnimationRunner: animation setting is ilegal: ', animation

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
					# TODO remove the finished tasks out
					t = 1
					task.finished = yes

			if anim.easing == true
				t = easingFunctions[DEFAULT_EASING_FUNCTION] t
			else if easingFunctions[anim.easing]?
				t = easingFunctions[anim.easing] t

			if anim.from?
				interpolateTask task, t
				anim.update.apply task.target, [task.current, t]
			else
				anim.update.apply task.target, [t, task.current]
			if finish then anim.finish?.call task.target, anim

	# Hook up on an renderer, remove own setInternal
	hookUp: (renderer) ->
		renderer.on 'update', => @update()

    #----------------------------------------------------------------------
    # Private functions
    #----------------------------------------------------------------------

	isAnimationLegal = (anim) ->
		return true unless anim.from? and anim.to?

		if Bu.isPlainObject anim.from
			for own key of anim.from
				return false unless anim.to[key]?
		else
			return false unless anim.to?
		true

	initTask = (task, anim) ->
		# Create the `task.current` object
		if anim.from?
			if Bu.isPlainObject anim.from
				for own key of anim.from
					task.current[key] = new anim.from[key].constructor
			else
				task.current = new anim.from.constructor

	interpolateTask = (task, t) ->
		anim = task.animation
		if typeof anim.from == 'number'
			task.current = interpolateNum anim.from, anim.to, t
		else if anim.from instanceof Bu.Color
			interpolateObject anim.from, anim.to, t, task.current
		else if Bu.isPlainObject anim.from
			for own key of anim.from
				if typeof anim.from[key] == 'number'
					task.current[key] = interpolateNum anim.from[key], anim.to[key], t
				else
					interpolateObject anim.from[key], anim.to[key], t, task.current[key]

	interpolateNum = (a, b, t) -> b * t - a * (t - 1)

	interpolateObject = (a, b, t, c) ->
		if a instanceof Bu.Color
			c.setRGBA interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t)
		else
			console.error "AnimationRunner.interpolateObject() doesn't support object type: ", a

	#----------------------------------------------------------------------
	# Private variables
	#----------------------------------------------------------------------

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

# Define the global unique instance of this class
Bu.animationRunner = new Bu.AnimationRunner
