# Fan shape

class Bu.Fan extends Bu.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		@type = 'Fan'

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line(
				@center.arcTo @radius, @aFrom
				@center.arcTo @radius, @aTo
		)
		@keyPoints = [
			@string.points[0]
			@string.points[1]
			new Bu.Point @cx, @cy
		]

	clone: -> new Bu.Fan @cx, @cy, @radius, @aFrom, @aTo
