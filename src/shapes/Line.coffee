# line shape

class Bu.Line extends Bu.Object2D

	constructor: (p1, p2, p3, p4) ->
		super()
		@type = 'Line'

		if arguments.length < 2
			@points = [new Bu.Point(), new Bu.Point()]
		else if arguments.length < 4
			@points = [p1.clone(), p2.clone()]
		else  # len >= 4
			@points = [new Bu.Point(p1, p2), new Bu.Point(p3, p4)]

		@length
		@midpoint = new Bu.Point()
		@keyPoints = @points

		@on "pointChange", =>
			@length = @points[0].distanceTo(@points[1])
			@midpoint.set((@points[0].x + @points[1].x) / 2, (@points[0].y + @points[1].y) / 2)

		@trigger "pointChange", @

	clone: -> new Bu.Line @points[0], @points[1]

	# edit

	set: (a1, a2, a3, a4) ->
		if p4?
			@points[0].set a1, a2
			@points[1].set a3, a4
		else
			@points[0] = a1
			@points[1] = a2
		@trigger "pointChange", @
		@

	setPoint1: (a1, a2) ->
		if a2?
			@points[0].set a1, a2
		else
			@points[0].copy a1
		@trigger "pointChange", @
		@

	setPoint2: (a1, a2) ->
		if a2?
			@points[1].set a1, a2
		else
			@points[1].copy a1
		@trigger "pointChange", @
		@