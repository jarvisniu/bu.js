# Used to generate random shapes
# TODO rename to ShapeRandomizer
# TODO finish the randomizeShape functions

class Bu.RandomShapeGenerator

	MARGIN = 30

	rangeWidth: 800
	rangeHeight: 450

	constructor: ->

	randomX: ->
		Bu.rand MARGIN, @rangeWidth - MARGIN * 2

	randomY: ->
		Bu.rand MARGIN, @rangeHeight - MARGIN * 2

	randomRadius: ->
		Bu.rand 5, Math.min(@rangeWidth, @rangeHeight) / 2

	setRange: (w, h) ->
		@rangeWidth = w
		@rangeHeight = h

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
		circle = new Bu.Circle @randomRadius(), @randomX(), @randomY()
		circle.center.label = 'O'
		circle

	randomizeCircle: (circle) ->
		circle.cx = @randomX()
		circle.cy = @randomY()
		circle.radius = @randomRadius()
		circle

	generateBow: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		bow = new Bu.Bow @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		bow.string.points[0].label = 'A'
		bow.string.points[1].label = 'B'
		bow

	generateTriangle: ->
		points = []
		for i in [0..2]
			points[i] = new Bu.Point @randomX(), @randomY()

		triangle = new Bu.Triangle points[0], points[1], points[2]
		triangle.points[0].label = 'A'
		triangle.points[1].label = 'B'
		triangle.points[2].label = 'C'
		triangle

	generateRectangle: ->
		new Bu.Rectangle(
			Bu.rand(@rangeWidth)
			Bu.rand(@rangeHeight)
			Bu.rand(@rangeWidth / 2)
			Bu.rand(@rangeHeight / 2)
		)

	generateFan: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		fan = new Bu.Fan @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		fan.string.points[0].label = 'A'
		fan.string.points[1].label = 'B'
		fan

	generatePolygon: ->
		points = []

		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			points.push point

		new Bu.Polygon points

	generateLine: ->
		line = new Bu.Line @randomX(), @randomY(), @randomX(), @randomY()
		line.points[0].label = 'A'
		line.points[1].label = 'B'
		line

	generatePolyline: ->
		polyline = new Bu.Polyline
		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			polyline.addPoint point
		polyline
