# polygon shape

class Geom2D.Polygon

	###
    constructors
    1. Polygon(points)
    2. Polygon(x, y, n, options): to generate regular polygon
    	options: radius, angle
	###
	constructor: (points) ->
		Geom2D.Colorful.apply @
		@type = "Polygon"
		@points = []
		@lines = []
		@triangles = []

		options = Geom2D.combineOptions arguments, {
			radius: 100
			angle: 0
		}

		if points instanceof Array
			@points = points if points?
		else
			x = arguments[0]
			y = arguments[1]
			n = arguments[2]
			@points = Geom2D.Polygon.generateRegularPoints(x, y, n, options)

		# init lines
		if @points.length > 1
			for i in [0 ... @points.length - 1]
				@lines.push(new Geom2D.Line(@points[i], @points[i + 1]))
			@lines.push(new Geom2D.Line(@points[@points.length - 1], @points[0]))

		# init triangles
		if @points.length > 2
			for i in [1 ... @points.length - 1]
				@triangles.push(new Geom2D.Triangle(@points[0], @points[i], @points[i + 1]))

	# detect

	isSimple: () ->
		len = @lines.length
		for i in [0...len]
			for j in [i + 1...len]
				if @lines[i].isCrossWithLine(@lines[j])
					return false
		return true

	# edit

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@points.push point

			# add line
			if @points.length > 1
				@lines[@lines.length - 1].points[1] = point
			if @points.length > 0
				@lines.push(new Geom2D.Line(@points[@points.length - 1], @points[0]))

			# add triangle
			if @points.length > 2
				@triangles.push(new Geom2D.Triangle(
						@points[0]
						@points[@points.length - 2]
						@points[@points.length - 1]
				))
		else
			@points.splice(insertIndex, 0, point)
	# TODO add lines and triangles

	# point related

	containsPoint: (p) ->
		for triangle in @triangles
			if triangle.containsPoint p
				return true
		return false

	@generateRegularPoints = (cx, cy, n, options) ->
		angleDelta = options.angle
		r = options.radius
		points = []
		angleSection = Math.PI * 2 / n
		for i in [0 ... n]
			a = i * angleSection + angleDelta
			x = cx + r * Math.cos(a)
			y = cy + r * Math.sin(a)
			points[i] = new Geom2D.Point x, y
		return points
