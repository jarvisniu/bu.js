# triangle shape

class Geom2D.Triangle

	constructor: (p1, p2, p3) ->
		Geom2D.Colorful.apply @
		@type = "Triangle"
		@points = [p1, p2, p3]
		@lines = [
			new Geom2D.Line(p1, p2)
			new Geom2D.Line(p2, p3)
			new Geom2D.Line(p3, p1)
		]

	containsPoint: (p) ->
		return @lines[0].isTwoPointsSameSide(p, @points[2]) and
			@lines[1].isTwoPointsSameSide(p, @points[0]) and
			@lines[2].isTwoPointsSameSide(p, @points[1])
