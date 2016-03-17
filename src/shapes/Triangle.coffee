# triangle shape

class Bu.Triangle extends Bu.Object2D

	constructor: (p1, p2, p3) ->
		super()
		@type = 'Triangle'

		if arguments.length == 6
			[x1, y1, x2, y2, x3, y3] = arguments
			p1 = new Bu.Point x1, y1
			p2 = new Bu.Point x2, y2
			p3 = new Bu.Point x3, y3

		@lines = [
			new Bu.Line(p1, p2)
			new Bu.Line(p2, p3)
			new Bu.Line(p3, p1)
		]
		#@center = new Bu.Point Bu.average(p1.x, p2.x, p3.x), Bu.average(p1.y, p2.y, p3.y)
		@points = [p1, p2, p3]
		@keyPoints = @points

	clone: => new Bu.Triangle @points[0], @points[1], @points[2]
