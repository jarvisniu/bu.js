# polyline morph

class Geom2D.PolylineMorph

	constructor: (@polylineA, @polylineB) ->
		@type = "PolylineMorph"
		@polyline = new Geom2D.Polyline()

		@hPointsA = []
		@hPointsB = []

		@update()

	setTime: (time) ->
		for i in [0 ... @hPointsA.length]
			Geom2D.Point.interpolate(@hPointsA[i], @hPointsB[i], time, @polyline.points[i])

	update: =>
		@hPointsA.clear()
		@hPointsB.clear()

		pointsA = @polylineA.points
		pointsB = @polylineB.points

		indexA = 0
		indexB = 0

		while indexA < pointsA.length and indexB < pointsB.length
			posA = @polylineA.getNormalizedPos(indexA)
			posB = @polylineB.getNormalizedPos(indexB)
			posAPrev = @polylineA.getNormalizedPos(indexA - 1)
			posBPrev = @polylineB.getNormalizedPos(indexB - 1)

			if posA < posB
				secPosB = (posA - posBPrev) / (posB - posBPrev)
				@hPointsA.push pointsA[indexA]
				@hPointsB.push Geom2D.Point.interpolate(pointsB[indexB - 1], pointsB[indexB], secPosB)
				indexA += 1
			else if posA > posB
				secPosA = (posB - posAPrev) / (posA - posAPrev)
				@hPointsA.push Geom2D.Point.interpolate(pointsA[indexA - 1], pointsA[indexA], secPosA)
				@hPointsB.push pointsB[indexB]
				indexB += 1
			else # posA == posB
				@hPointsA.push pointsA[indexA]
				@hPointsB.push pointsB[indexB]
				indexA += 1
				indexB += 1

		for i in [ 0 ... @hPointsA.length ]
			if @polyline.points[i]?
				@polyline.points[i].set @hPointsA[i].x, @hPointsA[i].y
			else
				@polyline.points[i] = new Geom2D.Point(@hPointsA[i].x, @hPointsA[i].y)

		if @polyline.points.length < @hPointsA.length
			@polyline.points.splice @hPointsA.length
