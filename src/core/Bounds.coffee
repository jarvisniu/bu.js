## axis aligned bounding box

class Bu.Bounds extends Bu.Object2D

	constructor: (@target) ->
		super()
		@type = 'Bounds'
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = true

		@point1 = new Bu.Point
		@point2 = new Bu.Point

		@strokeStyle = Bu.DEFAULT_BOUND_STROKE_STYLE
		@dashStyle = Bu.DEFAULT_BOUND_DASH_STYLE
		@dashOffset = 0

		switch @target.type
			when 'Line', 'Triangle', 'Rectangle'
				for v in @target.points
					@expandByPoint(v)
			when 'Circle', 'Bow', 'Fan'
				@expandByCircle(@target)
				@target.on 'centerChanged', =>
					@clear()
					@expandByCircle @target
				@target.on 'radiusChanged', =>
					@clear()
					@expandByCircle @target
			when 'Polyline', 'Polygon'
				for v in @target.vertices
					@expandByPoint(v)
			else
				console.warn 'Bounds: not support shape type "' + @target.type + '"'

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
		cp = c.center
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
