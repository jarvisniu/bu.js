# polygon shape

class Bu.Polygon extends Bu.Object2D

	###
    constructors
    1. Polygon(points)
    2. Polygon(x, y, n, options): to generate regular polygon
    	options: radius, angle
	###
	constructor: (points) ->
		super()
		@type = 'Polygon'
		@vertices = []
		@lines = []
		@triangles = []

		options = Bu.combineOptions arguments,
			radius: 100
			angle: 0


		if points instanceof Array
			@vertices = points if points?
		else
			x = arguments[0]
			y = arguments[1]
			n = arguments[2]
			@vertices = Bu.Polygon.generateRegularPoints(x, y, n, options)

		# init lines
		if @vertices.length > 1
			for i in [0 ... @vertices.length - 1]
				@lines.push(new Bu.Line(@vertices[i], @vertices[i + 1]))
			@lines.push(new Bu.Line(@vertices[@vertices.length - 1], @vertices[0]))

		# init triangles
		if @vertices.length > 2
			for i in [1 ... @vertices.length - 1]
				@triangles.push(new Bu.Triangle(@vertices[0], @vertices[i], @vertices[i + 1]))

		@keyPoints = @vertices

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
			@vertices.push point

			# add line
			if @vertices.length > 1
				@lines[@lines.length - 1].points[1] = point
			if @vertices.length > 0
				@lines.push(new Bu.Line(@vertices[@vertices.length - 1], @vertices[0]))

			# add triangle
			if @vertices.length > 2
				@triangles.push(new Bu.Triangle(
						@vertices[0]
						@vertices[@vertices.length - 2]
						@vertices[@vertices.length - 1]
				))
		else
			@vertices.splice(insertIndex, 0, point)
	# TODO add lines and triangles

	# point related

	_containsPoint: (p) ->
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
			points[i] = new Bu.Point x, y
		return points
