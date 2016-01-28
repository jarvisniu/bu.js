# point shape

class Bu.Point extends Bu.Object2D

	constructor: (@x = 0, @y = 0) ->
		super()
		@stroke no  # point has no stroke by default
		@type = 'Point'
		@_labelIndex = -1

	@property 'label',
		get: -> if @_labelIndex > -1 then @children[@_labelIndex].text else ''
		set: (val) ->
			if @_labelIndex == -1
				pointText = new Bu.PointText val, @x + Bu.POINT_RENDER_SIZE, @y, {align: '+0'}
				@children.push pointText
				@_labelIndex = @children.length - 1
			else
				@children[@_labelIndex].text = val

	arcTo: (radius, arc) ->
		return new Bu.Point(
		  @x + Math.cos(arc) * radius
		  @y + Math.sin(arc) * radius
		)

	clone: ->
		new Bu.Point(@x, @y)

	# copy value from other line
	copy: (point) ->
		@x = point.x
		@y = point.y
		@updateLabel()

	# set value from x, y
	set: (x, y) ->
		@x = x
		@y = y
		@updateLabel()

	updateLabel: ->
		if @_labelIndex > -1
			@children[@_labelIndex].x = @x + Bu.POINT_RENDER_SIZE
			@children[@_labelIndex].y = @y

	# point related

	distanceTo: (point) ->
		Math.bevel(@x - point.x, @y - point.y)

	isNear: (target, limit = Bu.DEFAULT_NEAR_DIST) ->
		switch target.type
			when 'Point' then @distanceTo(target) < limit
			when 'Line'
				verticalDist = target.distanceTo @
				return verticalDist < limit  # TODO: and near along the line direction

Bu.Point.interpolate = (p1, p2, k, p3) ->
	x = p1.x + (p2.x - p1.x) * k
	y = p1.y + (p2.y - p1.y) * k

	if p3?
		p3.set x, y
	else
		return new Bu.Point x, y
