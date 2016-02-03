# generator random shapes

class Bu.RandomShapeGenerator

	MARGIN = 30

	constructor: (@renderer) ->

	randomX: ->
		return Bu.rand MARGIN, @renderer.width - MARGIN * 2

	randomY: ->
		return Bu.rand MARGIN, @renderer.height - MARGIN * 2

	randomRadius: ->
		return Bu.rand 5, Math.min(@renderer.width, @renderer.height) / 2


	generateCircle: ->
		circle = new Bu.Circle @randomX(), @randomY(), @randomRadius()
		circle.center.label = "O"
		return circle

	generateBow: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		bow = new Bu.Bow @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		bow.string.points[0].label = "A"
		bow.string.points[1].label = "B"
		return bow

	generateTriangle: ->
		points = []
		for i in [0..2]
			points[i] = new Bu.Point @randomX(), @randomY()

		triangle = new Bu.Triangle points[0], points[1], points[2]
		triangle.points[0].label = "A"
		triangle.points[1].label = "B"
		triangle.points[2].label = "C"
		return triangle

	generateRectangle: ->
		return new Bu.Rectangle(
			Bu.rand(@renderer.width)
			Bu.rand(@renderer.height)
			Bu.rand(@renderer.width / 2)
			Bu.rand(@renderer.height / 2)
		)

	generateFan: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		fan = new Bu.Fan @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		fan.string.points[0].label = "A"
		fan.string.points[1].label = "B"
		return fan

	generatePolygon: ->
		points = []

		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = "P" + i
			points.push point

		return new Bu.Polygon points

	generateLine: ->
		return new Bu.Line @randomX(),@randomY(),@randomX(),@randomY()

	generatePolyline: ->
		polyline = new Bu.Polyline
		for i in [0..3]
			polyline.addPoint new Bu.Point @randomX(), @randomY()
		return polyline
