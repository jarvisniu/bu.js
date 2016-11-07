# rectangle shape

class Bu.Rectangle extends Bu.Object2D

	constructor: (x, y, width, height, cornerRadius = 0) ->
		super()
		@type = 'Rectangle'

		@center = new Bu.Point x + width / 2, y + height / 2
		@size = new Bu.Size width, height

		@pointLT = new Bu.Point x, y
		@pointRT = new Bu.Point x + width, y
		@pointRB = new Bu.Point x + width, y + height
		@pointLB = new Bu.Point x, y + height

		@points = [@pointLT, @pointRT, @pointRB, @pointLB]

		@cornerRadius = cornerRadius
		@on 'changed', => @.bounds?.update()

	@property 'cornerRadius',
		get: -> @_cornerRadius
		set: (val) ->
			@_cornerRadius = val
			@keyPoints = if val > 0 then [] else @points

	clone: -> new Bu.Rectangle @pointLT.x, @pointLT.y, @size.width, @size.height

	set: (x, y, width, height) ->
		@center.set x + width / 2, y + height / 2
		@size.set width, height

		@pointLT.set x, y
		@pointRT.set x + width, y
		@pointRB.set x + width, y + height
		@pointLB.set x, y + height
