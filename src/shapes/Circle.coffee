# Circle shape

class Geom2D.Circle

	constructor: (@cx = 0, @cy = 0, @radius = 1) ->
		Geom2D.Colorful.apply @
		@type = "Circle"
		@centralPoint = new Geom2D.Point(@cx, @cy)
		@aabb = new Geom2D.AABB

		@aabb.expandByCircle @

	# edit
	setCenter: (p) ->
		@centralPoint.copy p
		@cx = p.x
		@cy = p.y
		return @

	setRadius: (r) ->
		@radius = r
		@aabb.clear()
		@aabb.expandByCircle @
		return @

	# point related
	containsPoint: (p) ->
		if @aabb.containsPoint p
			dx = p.x - @cx
			dy = p.y - @cy
			Math.bevel(dx, dy) < @radius
		else
			false
