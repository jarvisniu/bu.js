# Circle shape

class Geom2D.Circle extends Geom2D.Object2D

	constructor: (@cx = 0, @cy = 0, @radius = 1) ->
		super()
		@type = "Circle"
		@centralPoint = new Geom2D.Point(@cx, @cy)
		@bounds = new Geom2D.Bounds

		@bounds.expandByCircle @

	# edit
	setCenter: (p) ->
		@centralPoint.copy p
		@cx = p.x
		@cy = p.y
		return @

	setRadius: (r) ->
		@radius = r
		@bounds.clear()
		@bounds.expandByCircle @
		return @

	# point related
	containsPoint: (p) ->
		if @bounds.containsPoint p
			dx = p.x - @cx
			dy = p.y - @cy
			Math.bevel(dx, dy) < @radius
		else
			false
