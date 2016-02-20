# generator random shapes

class Bu.RandomShapeGenerator

	MARGIN = 30

	constructor: (@bu) ->

	randomX: ->
		return Bu.rand MARGIN, @bu.width - MARGIN * 2

	randomY: ->
		return Bu.rand MARGIN, @bu.height - MARGIN * 2

	randomRadius: ->
		return Bu.rand 5, Math.min(@bu.width, @bu.height) / 2


	generate: (type) ->
		switch type
			when 'circle' then @generateCircle()
			when 'bow' then @generateBow()
			when 'triangle' then @generateTriangle()
			when 'rectangle' then @generateRectangle()
			when 'fan' then @generateFan()
			when 'polygon' then @generatePolygon()
			when 'line' then @generateLine()
			when 'polyline' then @generatePolyline()
			else console.warn 'not support shape: ' + type

	generateCircle: ->
		circle = new Bu.Circle @randomX(), @randomY(), @randomRadius()
		circle.center.label = 'O'
		return circle

	generateBow: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		bow = new Bu.Bow @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		bow.string.points[0].label = 'A'
		bow.string.points[1].label = 'B'
		return bow

	generateTriangle: ->
		points = []
		for i in [0..2]
			points[i] = new Bu.Point @randomX(), @randomY()

		triangle = new Bu.Triangle points[0], points[1], points[2]
		triangle.points[0].label = 'A'
		triangle.points[1].label = 'B'
		triangle.points[2].label = 'C'
		return triangle

	generateRectangle: ->
		return new Bu.Rectangle(
			Bu.rand(@bu.width)
			Bu.rand(@bu.height)
			Bu.rand(@bu.width / 2)
			Bu.rand(@bu.height / 2)
		)

	generateFan: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		fan = new Bu.Fan @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		fan.string.points[0].label = 'A'
		fan.string.points[1].label = 'B'
		return fan

	generatePolygon: ->
		points = []

		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			points.push point

		return new Bu.Polygon points

	generateLine: ->
		line = new Bu.Line @randomX(), @randomY(), @randomX(), @randomY()
		line.points[0].label = 'A'
		line.points[1].label = 'B'
		return line

	generatePolyline: ->
		polyline = new Bu.Polyline
		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			polyline.addPoint point
		return polyline
