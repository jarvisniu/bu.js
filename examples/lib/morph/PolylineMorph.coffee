# polyline morph

class Bu.PolylineMorph

	constructor: (@polylineA, @polylineB) ->
		@type = 'PolylineMorph'
		@polyline = new Bu.Polyline()

		@hPointsA = []
		@hPointsB = []

		@update()

	setTime: (time) ->
		for i in [0 ... @hPointsA.length]
			Bu.Point.interpolate(@hPointsA[i], @hPointsB[i], time, @polyline.vertices[i])
		@polyline.trigger 'pointChange', @polyline

	update: =>
		@hPointsA = []
		@hPointsB = []

		pointsA = @polylineA.vertices
		pointsB = @polylineB.vertices

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
				@hPointsB.push Bu.Point.interpolate(pointsB[indexB - 1], pointsB[indexB], secPosB)
				indexA += 1
			else if posA > posB
				secPosA = (posB - posAPrev) / (posA - posAPrev)
				@hPointsA.push Bu.Point.interpolate(pointsA[indexA - 1], pointsA[indexA], secPosA)
				@hPointsB.push pointsB[indexB]
				indexB += 1
			else # posA == posB
				@hPointsA.push pointsA[indexA]
				@hPointsB.push pointsB[indexB]
				indexA += 1
				indexB += 1

		for i in [ 0 ... @hPointsA.length ]
			if @polyline.vertices[i]?
				@polyline.vertices[i].set @hPointsA[i].x, @hPointsA[i].y
			else
				@polyline.vertices[i] = new Bu.Point(@hPointsA[i].x, @hPointsA[i].y)

		if @polyline.vertices.length < @hPointsA.length
			@polyline.vertices.splice @hPointsA.length
		@polyline.trigger 'pointChange', @polyline
