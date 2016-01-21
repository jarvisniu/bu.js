# Circle shape

class Geom2D.Circle extends Geom2D.Object2D

	constructor: (cx = 0, cy = 0, @_radius = 1) ->
		super()
		@type = "Circle"
		@_center = new Geom2D.Point(cx, cy)
		@bounds = null  # for accelerate contain test

	# property

	@property "cx",
		get: ->  @_center.x
		set: (val) ->
			@_center.x = val
			@triggerEvent("centerChanged", @)

	@property "cy",
		get: ->  @_center.y
		set: (val) ->
			@_center.y = val
			@triggerEvent("centerChanged", @)

	@property "center",
		get: ->  @_center
		set: (val) ->
			@_center = val
			@cx = val.x
			@cy = val.y
			@triggerEvent("centerChanged", @)

	@property "radius",
		get: ->  @_radius
		set: (val) ->
			@_radius = val
			@triggerEvent("radiusChanged", @)
			@

	# point related
	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else
			dx = p.x - @cx
			dy = p.y - @cy
			return Math.bevel(dx, dy) < @radius
