## axis aligned bounding box

class Geom2D.AABB

	constructor: () ->
		@type = "AABB"
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = true

		@point1 = new Geom2D.Point
		@point2 = new Geom2D.Point

		@strokeStyle = Geom2D.DEFAULT_AABB_STROKE_STYLE
		@dashStyle = Geom2D.DEFAULT_AABB_DASH_STYLE
		@dashDelta = 0

	containsPoint: (p) ->
		@x1 < p.x && @x2 > p.x && @y1 < p.y && @y2 > p.y

	clear: () ->
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = true

	expandByPoint: (v) ->
		if @isEmpty
			@isEmpty = false
			@x1 = @x2 = v.x
			@y1 = @y2 = v.y
		else
			@x1 = v.x if v.x < @x1
			@x2 = v.x if v.x > @x2
			@y1 = v.y if v.y < @y1
			@y2 = v.y if v.y > @y2

	expandByCircle: (c) ->
		cp = c.centralPoint
		r = c.radius
		if @isEmpty
			@isEmpty = false
			@x1 = cp.x - r
			@x2 = cp.x + r
			@y1 = cp.y - r
			@y2 = cp.y + r
		else
			@x1 = cp.x - r if cp.x - r < @x1
			@x2 = cp.x + r if cp.x + r > @x2
			@y1 = cp.y - r if cp.y - r < @y1
			@y2 = cp.y + r if cp.y + r > @y2
