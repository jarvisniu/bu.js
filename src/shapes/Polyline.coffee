# polyline shape

class Bu.Polyline extends Bu.Object2D

	constructor: (@points = []) ->
		super()
		@type = "Polyline"
		@lines = []
		@length = 0
		@pointNormalizedPos = []
		onPointChange @

	onPointChange = (self) ->
		if self.points.length > 1
			self.updateLines()
			self.calcLength()
			self.calcPointNormalizedPos()

	updateLines: =>
		for i in [0 ... @points.length - 1]
			if @lines[i]?
				@lines[i].set(@points[i], @points[i + 1])
			else
				@lines[i] = new Bu.Line( @points[i], @points[i + 1] )
		# TODO remove the rest

	calcLength: =>
		if @points.length < 2
			@length = 0
		else
			len = 0
			for i in [1 ... @points.length]
				len += @points[i].distanceTo(@points[i - 1])
			@length = len

	calcPointNormalizedPos: () ->
		currPos = 0
		@pointNormalizedPos[0] = 0
		for i in [1 ... @points.length]
			currPos += @points[i].distanceTo(@points[i - 1]) / @length
			@pointNormalizedPos[i] = currPos

	getNormalizedPos: (index) ->
		if index?
			return @pointNormalizedPos[index]
		else
			return @pointNormalizedPos

	# edit

	set = (points) ->
		# points
		for i in [0 ... @points.length]
			@points[i].copy points[i]

		# remove the extra points
		if @points.length > points.length
			@points.splice points.length

		onPointChange @

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@points.push point
			# add line
			if @points.length > 1
				@lines.push(new Bu.Line( @points[@points.length - 2], @points[@points.length - 1] ))
		else
			@points.splice insertIndex, 0, point
		# TODO add lines
		onPointChange @
