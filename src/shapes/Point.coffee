# point shape

class Bu.Point extends Bu.Object2D

	constructor: (@x = 0, @y = 0) ->
		super()
		@type = 'Point'

		@lineWidth = 0.5
		@_labelIndex = -1

	clone: -> new Bu.Point @x, @y

	@property 'label',
		get: -> if @_labelIndex > -1 then @children[@_labelIndex].text else ''
		set: (val) ->
			if @_labelIndex == -1
				pointText = new Bu.PointText val, @x + Bu.POINT_LABEL_OFFSET, @y, {align: '+0'}
				@children.push pointText
				@_labelIndex = @children.length - 1
			else
				@children[@_labelIndex].text = val

	arcTo: (radius, arc) ->
		return new Bu.Point @x + Math.cos(arc) * radius, @y + Math.sin(arc) * radius


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
			@children[@_labelIndex].x = @x + Bu.POINT_LABEL_OFFSET
			@children[@_labelIndex].y = @y
