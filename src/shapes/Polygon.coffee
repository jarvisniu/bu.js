# polygon shape

class Geom2D.Polygon

	constructor: (@points = []) ->
		Geom2D.Colorful.apply @
		@type = "Polygon"
		@lines = []
		@triangles = []

		# init lines
		if @points.length > 1
			for i in [0 ... @points.length - 1]
				@lines.push(new Geom2D.Line(@points[i], @points[i + 1]))
			@lines.push(new Geom2D.Line(@points[@points.length - 1], @points[0]))

		# init triangles
		if @points.length > 2
			for i in [1 ... @points.length - 1]
				@triangles.push(new Geom2D.Triangle(@points[0], @points[i], @points[i + 1]))

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
