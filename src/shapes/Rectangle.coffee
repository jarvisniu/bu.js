# rectangle shape

class Bu.Rectangle extends Bu.Object2D

	constructor: (x, y, width, height) ->
		super()
		@type = 'Rectangle'

		@position = new Bu.Point(x, y)
		@center = new Bu.Point(x + width / 2, y + height / 2)
		@size = new Bu.Size(width, height)

		@pointRT = new Bu.Point(x + width, y)
		@pointRB = new Bu.Point(x + width, y + height)
		@pointLB = new Bu.Point(x, y + height)

		@points = [@position, @pointRT, @pointRB, @pointLB]
		@keyPoints = @points

	clone: -> new Bu.Rectangle @position.x, @position.y, @size.width, @size.height

	containsPoint: (point) ->
		return point.x > @position.x and
				point.y > @position.y and
				point.x < @position.x + @size.width and
				point.y < @position.y + @size.height
