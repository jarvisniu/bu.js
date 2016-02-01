# Circle shape

class Bu.Circle extends Bu.Object2D

	constructor: (cx = 0, cy = 0, @_radius = 1) ->
		super()
		@type = 'Circle'
		@_center = new Bu.Point(cx, cy)
		@bounds = null  # for accelerate contain test

		@keyPoints = [ @_center ]

	# property

	@property 'cx',
		get: ->  @_center.x
		set: (val) ->
			@_center.x = val
			@trigger 'centerChanged', @

	@property 'cy',
		get: ->  @_center.y
		set: (val) ->
			@_center.y = val
			@trigger 'centerChanged', @

	@property 'center',
		get: ->  @_center
		set: (val) ->
			@_center = val
			@cx = val.x
			@cy = val.y
			@keyPoints[0] = val
			@trigger 'centerChanged', @

	@property 'radius',
		get: ->  @_radius
		set: (val) ->
			@_radius = val
			@trigger 'radiusChanged', @
			@

	# point related
	_containsPoint: (p) ->
		dx = p.x - @cx
		dy = p.y - @cy
		return Math.bevel(dx, dy) < @radius
