# Bow shape
class Geom2D.Bow

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		Geom2D.Colorful.apply @

		[@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

		@type = "Bow"

		@centralPoint = new Geom2D.Point(@cx, @cy)
		@string = new Geom2D.Line(
				@centralPoint.arcTo(@radius, @aFrom)
				@centralPoint.arcTo(@radius, @aTo)
		)

	containsPoint: (point) ->
		if Math.bevel(@cx - point.x, @cy - point.y) < @radius
			sameSide = @string.isTwoPointsSameSide(@centralPoint, point)
			smallThanHalfCircle = @aTo - @aFrom < Math.PI
			return sameSide ^ smallThanHalfCircle
		else
			return false
