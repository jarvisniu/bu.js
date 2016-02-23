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

# global unique instance
Bu.animationRunner = new Bu.AnimationRunner
