# Manage an Object2D list and update its dashOffset

class DashFlowManager

	constructor: ->
		@flowingObjects = []

	setSpeed: (target, speed) ->
		target.dashFlowSpeed = speed
		i = @flowingObjects.indexOf target
		if speed != 0
			@flowingObjects.push target if i == -1
		else
			@flowingObjects.splice(i, 1) if i > -1

	update: ->
		for o in @flowingObjects
			o.dashOffset += o.dashFlowSpeed

	# Hook up on an renderer, remove own setInternal
	hookUp: (renderer) ->
		renderer.on 'update', => @update()

export default DashFlowManager
