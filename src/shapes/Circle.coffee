# Circle shape

import Object2D from '../base/Object2D'

import Point from '../shapes/Point'

class Circle extends Object2D

	type: 'Circle'
	fillable: yes

	constructor: (@_radius = 1, cx = 0, cy = 0) ->
		super()

		@_center = new Point(cx, cy)
		@bounds = null # for accelerate contain test

		@keyPoints = [@_center]
		@on 'centerChanged', @updateKeyPoints

	clone: () -> new Circle @radius, @cx, @cy

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

export default Circle
