# polyline shape

class Bu.Polyline extends Bu.Object2D

	constructor: (@vertices = []) ->
		super()
		@type = 'Polyline'
		@lines = []
		@length = 0
		@pointNormalizedPos = []

		@keyPoints = @vertices
		onPointChange @

	onPointChange = (self) ->
		if self.vertices.length > 1
			self.updateLines()
			self.calcLength()
			self.calcPointNormalizedPos()

	updateLines: =>
		for i in [0 ... @vertices.length - 1]
			if @lines[i]?
				@lines[i].set(@vertices[i], @vertices[i + 1])
			else
				@lines[i] = new Bu.Line( @vertices[i], @vertices[i + 1] )
		# TODO remove the rest

	calcLength: =>
		if @vertices.length < 2
			@length = 0
		else
			len = 0
			for i in [1 ... @vertices.length]
				len += @vertices[i].distanceTo(@vertices[i - 1])
			@length = len

	calcPointNormalizedPos: () ->
		currPos = 0
		@pointNormalizedPos[0] = 0
		for i in [1 ... @vertices.length]
			currPos += @vertices[i].distanceTo(@vertices[i - 1]) / @length
			@pointNormalizedPos[i] = currPos

	getNormalizedPos: (index) ->
		if index?
			return @pointNormalizedPos[index]
		else
			return @pointNormalizedPos

	# edit

	set = (points) ->
		# points
		for i in [0 ... @vertices.length]
			@vertices[i].copy points[i]

		# remove the extra points
		if @vertices.length > points.length
			@vertices.splice points.length

		onPointChange @

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@vertices.push point
			# add line
			if @vertices.length > 1
				@lines.push(new Bu.Line( @vertices[@vertices.length - 2], @vertices[@vertices.length - 1] ))
		else
			@vertices.splice insertIndex, 0, point
		# TODO add lines
		onPointChange @
