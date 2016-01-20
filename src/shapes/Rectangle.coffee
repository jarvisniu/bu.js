# rectangle shape

class Geom2D.Rectangle extends Geom2D.Object2D

	constructor: (x, y, width, height) ->
		super()
		@type = "Rectangle"

		@position = new Geom2D.Point(x, y)
		@center = new Geom2D.Point(x + width / 2, y + height / 2)
		@size = new Geom2D.Size(width, height)

		@pointRT = new Geom2D.Point(x + width, y)
		@pointRB = new Geom2D.Point(x + width, y + height)
		@pointLB = new Geom2D.Point(x, y + height)

		@points = [@position, @pointRT, @pointRB, @pointLB]

	containsPoint: (point) ->
		return point.x > @position.x and
			 point.y > @position.y and
			 point.x < @position.x + @size.width and
			 point.y < @position.y + @size.height
