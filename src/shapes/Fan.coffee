# Fan shape

class Bu.Fan extends Bu.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		@type = 'Fan'

		[@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line @center.arcTo(@radius, @aFrom), @center.arcTo(@radius, @aTo)

		@keyPoints = [
			@string.points[0]
			@string.points[1]
			@center
		]
		@on 'changed', @updateKeyPoints
		@on 'changed', => @.bounds?.update()

	clone: -> new Bu.Fan @cx, @cy, @radius, @aFrom, @aTo

	updateKeyPoints: ->
		@center.set @cx, @cy
		@string.points[0].copy @center.arcTo @radius, @aFrom
		@string.points[1].copy @center.arcTo @radius, @aTo
		@
