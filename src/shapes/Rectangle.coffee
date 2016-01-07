# rectangle shape

class Geom2D.Rectangle

	constructor: (x, y, width, height) ->
		Geom2D.Colorful.apply @
		@type = "Rectangle"
		@position = new Geom2D.Point(x, y)
		@size = new Geom2D.Size(width, height)
		@rightBottomPoint = new Geom2D.Point(x + width, y + height)
		@points = [this.position, this.rightBottomPoint]

	containsPoint: (point) ->
		return point.x > @position.x and
			 point.y > this.position.y and
			 point.x < this.position.x + this.size.width and
			 point.y < this.position.y + this.size.height
