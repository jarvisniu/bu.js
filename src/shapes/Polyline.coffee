# polyline shape

class Bu.Polyline extends Bu.Object2D

	constructor: (@vertices = []) ->
		super()
		@type = 'Polyline'

		if arguments.length > 1
			vertices = []
			for i in [0 ... arguments.length / 2]
				vertices.push new Bu.Point arguments[i * 2], arguments[i * 2 + 1]
			@vertices = vertices

		@lines = []
		@keyPoints = @vertices

		@fill off

		@on "pointChange", =>
			if @vertices.length > 1
				@updateLines()
				@calcLength?()
				@calcPointNormalizedPos?()
		@trigger "pointChange", @

	clone: ->
		polyline = new Bu.Polyline @vertices
		polyline.strokeStyle = @strokeStyle
		polyline.fillStyle = @fillStyle
		polyline.dashStyle = @dashStyle
		polyline.lineWidth = @lineWidth
		polyline.dashOffset = @dashOffset
		polyline

	updateLines: ->
		for i in [0 ... @vertices.length - 1]
			if @lines[i]?
				@lines[i].set @vertices[i], @vertices[i + 1]
			else
				@lines[i] = new Bu.Line @vertices[i], @vertices[i + 1]
		# TODO remove the rest
		@

	# edit

	set = (points) ->
		# points
		for i in [0 ... @vertices.length]
			@vertices[i].copy points[i]

		# remove the extra points
		if @vertices.length > points.length
			@vertices.splice points.length

		@trigger "pointChange", @
		@

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@vertices.push point
			# add line
			if @vertices.length > 1
				@lines.push new Bu.Line @vertices[@vertices.length - 2], @vertices[@vertices.length - 1]
		else
			@vertices.splice insertIndex, 0, point
		# TODO add lines
		@trigger "pointChange", @
		@
