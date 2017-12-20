# Used to generate random shapes

import Bow from '../shapes/Bow'
import Circle from '../shapes/Circle'

class Bu.ShapeRandomizer

	MARGIN = 30

	rangeX: 0
	rangeY: 0
	rangeWidth: 800
	rangeHeight: 450

	constructor: ->

	randomX: ->
		Bu.rand @rangeX + MARGIN, @rangeX + @rangeWidth - MARGIN * 2

	randomY: ->
		Bu.rand @rangeY + MARGIN, @rangeY + @rangeHeight - MARGIN * 2

	randomRadius: ->
		Bu.rand 10, Math.min(@rangeX + @rangeWidth, @rangeY + @rangeHeight) / 2

	setRange: (a, b, c, d) ->
		if c?
			@rangeX = a
			@rangeY = b
			@rangeWidth = c
			@rangeHeight = d
		else
			@rangeWidth = a
			@rangeHeight = b
		@

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

	randomize: (shape) ->
		if Bu.isArray shape
			@randomize s for s in shape
		else
			switch shape.type
				when 'Circle' then @randomizeCircle shape
				when 'Ellipse' then @randomizeEllipse shape
				when 'Bow' then @randomizeBow shape
				when 'Triangle' then @randomizeTriangle shape
				when 'Rectangle' then @randomizeRectangle shape
				when 'Fan' then @randomizeFan shape
				when 'Polygon' then @randomizePolygon shape
				when 'Line' then @randomizeLine shape
				when 'Polyline' then @randomizePolyline shape
				else console.warn 'not support shape: ' + shape.type
		@

	randomizePosition: (shape) ->
		shape.position.x = @randomX()
		shape.position.y = @randomY()
		shape.trigger 'changed'
		@

	generateCircle: ->
		circle = new Circle @randomRadius(), @randomX(), @randomY()
		circle.center.label = 'O'
		circle

	randomizeCircle: (circle) ->
		circle.cx = @randomX()
		circle.cy = @randomY()
		circle.radius = @randomRadius()
		@

	generateEllipse: ->
		ellipse = new Bu.Ellipse @randomRadius(), @randomRadius()
		@randomizePosition ellipse
		ellipse

	randomizeEllipse: (ellipse) ->
		ellipse.radiusX = @randomRadius()
		ellipse.radiusY = @randomRadius()
		@randomizePosition ellipse
		@

	generateBow: ->
		aFrom = Bu.rand Bu.TWO_PI
		aTo = aFrom + Bu.rand Bu.HALF_PI, Bu.TWO_PI

		bow = new Bow @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		bow.string.points[0].label = 'A'
		bow.string.points[1].label = 'B'
		bow

	randomizeBow: (bow) ->
		aFrom = Bu.rand Bu.TWO_PI
		aTo = aFrom + Bu.rand Bu.HALF_PI, Bu.TWO_PI

		bow.cx = @randomX()
		bow.cy = @randomY()
		bow.radius = @randomRadius()
		bow.aFrom = aFrom
		bow.aTo = aTo
		bow.trigger 'changed'
		@

	generateFan: ->
		aFrom = Bu.rand Bu.TWO_PI
		aTo = aFrom + Bu.rand Bu.HALF_PI, Bu.TWO_PI

		fan = new Bu.Fan @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		fan.center.label = 'O'
		fan.string.points[0].label = 'A'
		fan.string.points[1].label = 'B'
		fan

	randomizeFan: @::randomizeBow

	generateTriangle: ->
		points = []
		for i in [0..2]
			points[i] = new Bu.Point @randomX(), @randomY()

		triangle = new Bu.Triangle points[0], points[1], points[2]
		triangle.points[0].label = 'A'
		triangle.points[1].label = 'B'
		triangle.points[2].label = 'C'
		triangle

	randomizeTriangle: (triangle) ->
		triangle.points[i].set @randomX(), @randomY() for i in [0..2]
		triangle.trigger 'changed'
		@

	generateRectangle: ->
		rect = new Bu.Rectangle(
			Bu.rand(@rangeX + @rangeWidth)
			Bu.rand(@rangeY + @rangeHeight)
			Bu.rand(@rangeWidth / 2)
			Bu.rand(@rangeHeight / 2)
		)
		rect.pointLT.label = 'A'
		rect.pointRT.label = 'B'
		rect.pointRB.label = 'C'
		rect.pointLB.label = 'D'
		rect

	randomizeRectangle: (rectangle) ->
		rectangle.set @randomX(), @randomY(), @randomRadius(), @randomRadius()
		rectangle.trigger 'changed'
		@

	generatePolygon: ->
		points = []

		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			points.push point

		new Bu.Polygon points

	randomizePolygon: (polygon) ->
		vertex.set @randomX(), @randomY() for vertex in polygon.vertices
		polygon.trigger 'changed'
		@

	generateLine: ->
		line = new Bu.Line @randomX(), @randomY(), @randomX(), @randomY()
		line.points[0].label = 'A'
		line.points[1].label = 'B'
		line

	randomizeLine: (line) ->
		point.set @randomX(), @randomY() for point in line.points
		line.trigger 'changed'
		@

	generatePolyline: ->
		polyline = new Bu.Polyline
		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			polyline.addPoint point
		polyline

	randomizePolyline: (polyline) ->
		vertex.set @randomX(), @randomY() for vertex in polyline.vertices
		polyline.trigger 'changed'
		@
