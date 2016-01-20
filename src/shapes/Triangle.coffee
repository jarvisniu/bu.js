# triangle shape

class Geom2D.Triangle extends Geom2D.Object2D

	constructor: (p1, p2, p3) ->
		super()
		@type = "Triangle"
		@lines = [
			new Geom2D.Line(p1, p2)
			new Geom2D.Line(p2, p3)
			new Geom2D.Line(p3, p1)
		]
		@center = new Geom2D.Point(Geom2D.average(p1.x, p2.x, p3.x), Geom2D.average(p1.y, p2.y, p3.y))
		@points = [p1, p2, p3]

	# TODO test
	area: () ->
		a = @points[0]
		b = @points[1]
		c = @points[2]
		((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y))

	containsPoint: (p) ->
		return @lines[0].isTwoPointsSameSide(p, @points[2]) and
				@lines[1].isTwoPointsSameSide(p, @points[0]) and
				@lines[2].isTwoPointsSameSide(p, @points[1])
