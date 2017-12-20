## axis aligned bounding box

import Vector from '../math/Vector'

class Bounds

	constructor: (@target) ->

		# TODO use min, max: Vector
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = yes

		@point1 = new Vector
		@point2 = new Vector

		@update()
		@bindEvent()

	containsPoint: (p) ->
		@x1 < p.x && @x2 > p.x && @y1 < p.y && @y2 > p.y

	update: =>
		@clear()
		switch @target.type
			when 'Line', 'Triangle', 'Rectangle'
				for v in @target.points
					@expandByPoint(v)
			when 'Circle', 'Bow', 'Fan'
				@expandByCircle @target
			when 'Polyline', 'Polygon'
				for v in @target.vertices
					@expandByPoint(v)
			when 'Ellipse'
				@x1 = -@target.radiusX
				@x2 = @target.radiusX
				@y1 = -@target.radiusY
				@y2 = @target.radiusY
			else
				console.warn "Bounds: not support shape type #{ @target.type }"

	bindEvent: ->
		switch @target.type
			when 'Circle', 'Bow', 'Fan'
				@target.on 'centerChanged', @update
				@target.on 'radiusChanged', @update
			when 'Ellipse'
				@target.on 'changed', @update

	clear: () ->
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = yes
		@

	expandByPoint: (v) ->
		if @isEmpty
			@isEmpty = no
			@x1 = @x2 = v.x
			@y1 = @y2 = v.y
		else
			@x1 = v.x if v.x < @x1
			@x2 = v.x if v.x > @x2
			@y1 = v.y if v.y < @y1
			@y2 = v.y if v.y > @y2
		@

	expandByCircle: (c) ->
		cp = c.center
		r = c.radius
		if @isEmpty
			@isEmpty = no
			@x1 = cp.x - r
			@x2 = cp.x + r
			@y1 = cp.y - r
			@y2 = cp.y + r
		else
			@x1 = cp.x - r if cp.x - r < @x1
			@x2 = cp.x + r if cp.x + r > @x2
			@y1 = cp.y - r if cp.y - r < @y1
			@y2 = cp.y + r if cp.y + r > @y2
		@

export default Bounds
