# Circle shape

class Bu.Circle extends Bu.Object2D

	constructor: (@_radius = 1, cx = 0, cy = 0) ->
		super()
		@type = 'Circle'

		@_center = new Bu.Point(cx, cy)
		@bounds = null # for accelerate contain test

		@keyPoints = [@_center]
		@on 'centerChanged', @updateKeyPoints

	clone: () -> new Bu.Circle @radius, @cx, @cy

	updateKeyPoints: ->
		@keyPoints[0].set @cx, @cy

	# property

	@property 'cx',
		get: -> @_center.x
		set: (val) ->
			@_center.x = val
			@trigger 'centerChanged', @

	@property 'cy',
		get: -> @_center.y
		set: (val) ->
			@_center.y = val
			@trigger 'centerChanged', @

	@property 'center',
		get: -> @_center
		set: (val) ->
			@_center = val
			@cx = val.x
			@cy = val.y
			@keyPoints[0] = val
			@trigger 'centerChanged', @

	@property 'radius',
		get: -> @_radius
		set: (val) ->
			@_radius = val
			@trigger 'radiusChanged', @
			@
