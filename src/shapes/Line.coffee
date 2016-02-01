# line shape

class Bu.Line extends Bu.Object2D

	constructor: (p1, p2, p3, p4) ->
		super()
		@type = 'Line'

		if arguments.length < 2
			@points = [new Bu.Point(), new Bu.Point()]
		else if arguments.length < 4
			@points = [p1.clone(), p2.clone()]
		else  # len >= 4
			@points = [new Bu.Point(p1, p2), new Bu.Point(p3, p4)]

		@midpoint = new Bu.Point()
		@keyPoints = @points
		@onPointChange()

	onPointChange: =>
		@length = @points[0].distanceTo(@points[1])
		@midpoint.set((@points[0].x + @points[1].x) / 2, (@points[0].y + @points[1].y) / 2)

	# edit

	set: (a1, a2, a3, a4) ->
		if p4?
			@points[0].set a1, a2
			@points[1].set a3, a4
		else
			@points[0] = a1
			@points[1] = a2
		@onPointChange()
		@

	setPoint1: (a1, a2) ->
		if a2?
			@points[0].set a1, a2
		else
			@points[0].copy a1
		@onPointChange()
		@

	setPoint2: (a1, a2) ->
		if a2?
			@points[1].set a1, a2
		else
			@points[1].copy a1
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

		if footPoint?
			footPoint.set(x, y)
		else
			return new Bu.Point(x, y)

	# line related

	getCrossPointWith: (line) ->
		p1 = @points[0]
		p2 = @points[1]
		q1 = line.points[0]
		q2 = line.points[1]

		a1 = p2.y - p1.y
		b1 = p1.x - p2.x
		c1 = (a1 * p1.x) + (b1 * p1.y)
		a2 = q2.y - q1.y
		b2 = q1.x - q2.x
		c2 = (a2 * q1.x) + (b2 * q1.y)
		det = (a1 * b2) - (a2 * b1)

		return new Bu.Point ((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det

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

	# TODO test
	isCrossWithLine2: (line) ->
		p1 = @points[0]
		p2 = @points[1]
		q1 = line.points[0]
		q2 = line.points[1]

		dx = p2.x - p1.x
		dy = p2.y - p1.y
		da = q2.x - q1.x
		db = q2.y - q1.y

		# segments are parallel
		if da * dy - db * dx == 0
			return false

		s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx)
		t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy)

		return s >= 0 && s <= 1 and t >= 0 && t <= 1
