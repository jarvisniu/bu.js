# rectangle shape

import Object2D from '../base/Object2D'

import Point from '../shapes/Point'

class Rectangle extends Object2D

	type: 'Rectangle'
	fillable: yes

	constructor: (x, y, width, height, cornerRadius = 0) ->
		super()

		@center = new Point x + width / 2, y + height / 2
		@size = new Bu.Size width, height

		@pointLT = new Point x, y
		@pointRT = new Point x + width, y
		@pointRB = new Point x + width, y + height
		@pointLB = new Point x, y + height

		@points = [@pointLT, @pointRT, @pointRB, @pointLB]

		@cornerRadius = cornerRadius
		@on 'changed', => @.bounds?.update()

	@property 'cornerRadius',
		get: -> @_cornerRadius
		set: (val) ->
			@_cornerRadius = val
			@keyPoints = if val > 0 then [] else @points

	clone: -> new Rectangle @pointLT.x, @pointLT.y, @size.width, @size.height

	set: (x, y, width, height) ->
		@center.set x + width / 2, y + height / 2
		@size.set width, height

		@pointLT.set x, y
		@pointRT.set x + width, y
		@pointRB.set x + width, y + height
		@pointLB.set x, y + height

export default Rectangle
