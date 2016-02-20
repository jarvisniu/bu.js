# spline shape

class Bu.Spline extends Bu.Object2D

	constructor: (@polyline = new Bu.Polyline) ->
		super()
		@type = 'Spline'

		if @polyline instanceof Array
			@polyline = new Bu.Polyline @polyline

		@smooth = Bu.DEFAULT_SPLINE_SMOOTH
		@vertices = @polyline.vertices
		@keyPoints = @vertices
		@controlPointsAhead = []
		@controlPointsBehind = []

		calcControlPoints @

	calcControlPoints = (spline) ->
		spline.keyPoints = spline.vertices

		vertices = spline.vertices
		len = vertices.length
		if len >= 1
			spline.controlPointsBehind[0] = vertices[0]
		if len >= 2
			spline.controlPointsAhead[len - 1] = vertices[len - 1]
		if len >= 3
			for i in [1...len - 1]
				theta1 = Math.atan2 vertices[i].y - vertices[i - 1].y, vertices[i].x - vertices[i - 1].x
				theta2 = Math.atan2 vertices[i + 1].y - vertices[i].y, vertices[i + 1].x - vertices[i].x
				theta = (theta2 + theta1) / 2
				theta += Math.PI if Math.abs(theta - theta1) > Math.PI / 2
				len1 = Bu.bevel vertices[i].y - vertices[i - 1].y, vertices[i].x - vertices[i - 1].x
				len2 = Bu.bevel vertices[i].y - vertices[i + 1].y, vertices[i].x - vertices[i + 1].x
				xA = vertices[i].x - len1 * spline.smooth * Math.cos(theta)
				yA = vertices[i].y - len1 * spline.smooth * Math.sin(theta)
				xB = vertices[i].x + len2 * spline.smooth * Math.cos(theta)
				yB = vertices[i].y + len2 * spline.smooth * Math.sin(theta)
				spline.controlPointsAhead[i] = new Bu.Point xA, yA
				spline.controlPointsBehind[i] = new Bu.Point xB, yB
