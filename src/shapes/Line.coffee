# line shape

class Geom2D.Line

	constructor: (p1, p2, p3, p4) ->
		Geom2D.Colorful.apply @
		@type = "Line"
		if arguments.length == 2
			@points = [ p1, p2 ]
		else  # len == 4
			@points = [ new Geom2D.Point(p1, p2), new Geom2D.Point(p3, p4) ]
		@midpoint = new Geom2D.Point()
		@onPointChange()

	onPointChange: =>
		@length = @points[0].distanceTo(@points[1])
		@midpoint.set((@points[0].x + @points[1].x) / 2, (@points[0].y + @points[1].y) / 2)

	# edit

	set: (args...) ->
		if args.length == 2
			@points = [ args[0], args[1] ]
		else  # len == 4
			@points = [ new Geom2D.Point(args[0], args[1]), new Geom2D.Point(args[2], args[3]) ]
		@onPointChange()
		@

	setPoint1: (p1) ->
		@points[0].copy(p1)
		@onPointChange()
		@

	setPoint2: (p2) ->
		@points[1].copy(p2)
		@onPointChange()
		@

	# point related

	isTwoPointsSameSide: (p1, p2) ->
		pA = @points[0]
		pB = @points[1]
		if pA.x == pB.x
			# if both of the two points are on the line then we consider they are in the same side
			return (p1.x - pA.x) * (p2.x - pA.x) > 0
		else
			y01 = (pA.y - pB.y) * (p1.x - pA.x) / (pA.x - pB.x) + pA.y
			y02 = (pA.y - pB.y) * (p2.x - pA.x) / (pA.x - pB.x) + pA.y
			return (p1.y - y01) * (p2.y - y02) > 0

	distanceTo: (point) ->
		p1 = @points[0]
		p2 = @points[1]
		a = (p1.y - p2.y) / (p1.x - p2.x)
		b = p1.y - a * p1.x
		return Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1)

	# 这个是自己推导的
	distanceTo2: (point) ->
		p1 = @points[0]
		p2 = @points[1]
		a = (p1.y - p2.y) / (p1.x - p2.x)
		b = p1.y - (p1.y - p2.y) * p1.x / (p1.x - p2.x)
		czX = (point.y + point.x / a - b) / (a + 1 / a)
		czY = a * czX + b
		return Math.bevel(czX - point.x, czY - point.y)

	# get foot point from a point 计算垂足点
	# save to footPoint or create a new point
	footPointFrom: (point, footPoint) ->
		p1 = @points[0]
		p2 = @points[1]
		A = (p1.y - p2.y) / (p1.x - p2.x)
		B = (p1.y - A * p1.x)
		m = point.x + A * point.y
		x = (m - A * B) / (A * A + 1)
		y = A * x + B

		if footPoint != null
			footPoint.set(x, y)
		else
			return new Geom2D.Point(x, y)

	# line related

	# TODO getCrossPointWith: (line) ->

	# whether cross with another line
	isCrossWithLine: (line) ->
		x1 = @points[0].x
		y1 = @points[0].y
		x2 = @points[1].x
		y2 = @points[1].y
		x3 = line.points[0].x
		y3 = line.points[0].y
		x4 = line.points[1].x
		y4 = line.points[1].y
		d = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1)
		if d == 0
			return false
		else
			x0 = ((x2 - x1) * (x4 - x3) * (y3 - y1) + (y2 - y1) * (x4 - x3) * x1 - (y4 - y3) * (x2 - x1) * x3) / d
			y0 = ((y2 - y1) * (y4 - y3) * (x3 - x1) + (x2 - x1) * (y4 - y3) * y1 - (x4 - x3) * (y2 - y1) * y3) / -d
		return (x0 - x1) * (x0 - x2) < 0 and
			 (x0 - x3) * (x0 - x4) < 0 and
			 (y0 - y1) * (y0 - y2) < 0 and
			 (y0 - y3) * (y0 - y4) < 0

