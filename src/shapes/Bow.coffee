# Bow shape
Geom2D.Bow = (cx, cy, r, aFrom, aTo) ->
	Geom2D.Colorful.apply @

	[aFrom, aTo] = [aTo, aFrom] if aFrom > aTo

	@type = "Bow"

	@cx = cx
	@cy = cy
	@radius = r
	@aFrom = aFrom
	@aTo = aTo

	@centralPoint = new Geom2D.Point(cx, cy)

	stringPoints = [
		@centralPoint.arcTo(r, aFrom)
		@centralPoint.arcTo(r, aTo)
	]

	@string = new Geom2D.Line(stringPoints[0], stringPoints[1])

	@containsPoint = (point) ->
		if Math.bevel(@cx - point.x, @cy - point.y) < @radius
			sameSide = @string.isTwoPointsSameSide(@centralPoint, point)
			smallThanHalfCircle = aTo - aFrom < Math.PI
			return sameSide ^ smallThanHalfCircle
		else
			return false

	return @