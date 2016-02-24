# spline shape

class Bu.Spline extends Bu.Object2D

	constructor: (vertices) ->
		super()
		@type = 'Spline'

		if vertices instanceof Bu.Polyline
			polyline = vertices
			@vertices = polyline.vertices
			polyline.on 'pointChange', (polyline) =>
				@vertices = polyline.vertices
				calcControlPoints @
		else
			@vertices = Bu.clone vertices

		@keyPoints = @vertices
		@controlPointsAhead = []
		@controlPointsBehind = []

		@smoothFactor = Bu.DEFAULT_SPLINE_SMOOTH
		@_smoother = no

		calcControlPoints @

	@property 'smoother',
		get: -> @_smoother
		set: (val) ->
			oldVal = @_smoother
			@_smoother = val
			calcControlPoints @ if oldVal != @_smoother

	clone: -> new Bu.Spline @vertices

	addPoint: (point) ->
		@vertices.push point
		calcControlPoints @

	calcControlPoints = (spline) ->
		spline.keyPoints = spline.vertices

		p = spline.vertices
		len = p.length
		if len >= 1
			spline.controlPointsBehind[0] = p[0]
		if len >= 2
			spline.controlPointsAhead[len - 1] = p[len - 1]
		if len >= 3
			for i in [1...len - 1]
				theta1 = Math.atan2 p[i].y - p[i - 1].y, p[i].x - p[i - 1].x
				theta2 = Math.atan2 p[i + 1].y - p[i].y, p[i + 1].x - p[i].x
				len1 = Bu.bevel p[i].y - p[i - 1].y, p[i].x - p[i - 1].x
				len2 = Bu.bevel p[i].y - p[i + 1].y, p[i].x - p[i + 1].x
				theta = theta1 + (theta2 - theta1) * if spline._smoother then len1 / (len1 + len2) else 0.5
				theta += Math.PI if Math.abs(theta - theta1) > Math.PI / 2
				xA = p[i].x - len1 * spline.smoothFactor * Math.cos(theta)
				yA = p[i].y - len1 * spline.smoothFactor * Math.sin(theta)
				xB = p[i].x + len2 * spline.smoothFactor * Math.cos(theta)
				yB = p[i].y + len2 * spline.smoothFactor * Math.sin(theta)
				spline.controlPointsAhead[i] = new Bu.Point xA, yA
				spline.controlPointsBehind[i] = new Bu.Point xB, yB

				# add control lines for debugging
				#spline.children[i * 2 - 2] = new Bu.Line spline.vertices[i], spline.controlPointsAhead[i]
				#spline.children[i * 2 - 1] =  new Bu.Line spline.vertices[i], spline.controlPointsBehind[i]
