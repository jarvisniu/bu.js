# point shape

class Bu.Point extends Bu.Object2D

	constructor: (@x = 0, @y = 0) ->
		super()
		@stroke no  # point has no stroke by default
		@type = "Point"
		@label = null

	arcTo: (radius, arc) ->
		return new Bu.Point(
		  @x + Math.cos(arc) * radius
		  @y + Math.sin(arc) * radius
		)

	clone: =>
		new Bu.Point(@x, @y)

	# copy value from other line
	copy: (point) ->
		@x = point.x
		@y = point.y

	# set value from x, y
	set: (x, y) ->
		@x = x
		@y = y

	# point related

	distanceTo: (point) ->
		Math.bevel(@x - point.x, @y - point.y)

	isNear: (target, limit = Bu.DEFAULT_NEAR_DIST) ->
		switch target.type
			when "Point" then @distanceTo(target) < limit
			when "Line"
				verticalDist = target.distanceTo @
				return verticalDist < limit  # TODO: and near along the line direction

Bu.Point.interpolate = (p1, p2, k, p3) ->
	x = p1.x + (p2.x - p1.x) * k
	y = p1.y + (p2.y - p1.y) * k

	if p3?
		p3.set x, y
	else
		return new Bu.Point x, y
