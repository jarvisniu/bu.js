# Fan shape

class Geom2D.Fan extends Geom2D.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		@type = "Fan"
		@centralPoint = new Geom2D.Point(@cx, @cy)
		@string = new Geom2D.Line(
		  @centralPoint.arcTo(@radius, @aFrom)
		  @centralPoint.arcTo(@radius, @aTo)
		)

	containsPoint: (p) ->
		dx = p.x - @cx
		dy = p.y - @cy
		a = Math.atan2(p.y - @cy, p.x - @cx)
		a += Math.PI * 2 while a < @aFrom
		return Math.bevel(dx, dy) < @radius && a > @aFrom && a < @aTo
