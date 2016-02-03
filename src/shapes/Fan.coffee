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
		@keyPoints = @string.points

	_containsPoint: (p) ->
		dx = p.x - @cx
		dy = p.y - @cy
		a = Math.atan2(p.y - @cy, p.x - @cx)
		a += Math.PI * 2 while a < @aFrom
		return Bu.bevel(dx, dy) < @radius && a > @aFrom && a < @aTo
