# Bow shape
class Bu.Bow extends Bu.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		[@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

		@type = 'Bow'

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line @center.arcTo(@radius, @aFrom),
				@center.arcTo(@radius, @aTo)
		@keyPoints = @string.points

	_containsPoint: (point) ->
		if Bu.bevel(@cx - point.x, @cy - point.y) < @radius
			sameSide = @string.isTwoPointsSameSide(@center, point)
			smallThanHalfCircle = @aTo - @aFrom < Math.PI
			return sameSide ^ smallThanHalfCircle
		else
			return false
