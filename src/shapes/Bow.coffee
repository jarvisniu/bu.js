# Bow shape

class Bu.Bow extends Bu.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		@type = 'Bow'

		[@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line @center.arcTo(@radius, @aFrom),
				@center.arcTo(@radius, @aTo)
		@keyPoints = @string.points

	clone: -> new Bu.Bow @cx, @cy, @radius, @aFrom, @aTo
