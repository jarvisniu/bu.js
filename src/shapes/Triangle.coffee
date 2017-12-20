# triangle shape

import Object2D from '../base/Object2D'

import Line from '../shapes/Line'
import Point from '../shapes/Point'

class Triangle extends Object2D

	type: 'Triangle'
	fillable: yes

	constructor: (p1, p2, p3) ->
		super()

		if arguments.length == 6
			[x1, y1, x2, y2, x3, y3] = arguments
			p1 = new Point x1, y1
			p2 = new Point x2, y2
			p3 = new Point x3, y3

		@lines = [
			new Line(p1, p2)
			new Line(p2, p3)
			new Line(p3, p1)
		]
		#@center = new Point Bu.average(p1.x, p2.x, p3.x), Bu.average(p1.y, p2.y, p3.y)
		@points = [p1, p2, p3]
		@keyPoints = @points
		@on 'changed', @update
		@on 'changed', => @.bounds?.update()

	clone: -> new Triangle @points[0], @points[1], @points[2]

	update: ->
		@lines[0].points[0].copy @points[0]
		@lines[0].points[1].copy @points[1]
		@lines[1].points[0].copy @points[1]
		@lines[1].points[1].copy @points[2]
		@lines[2].points[0].copy @points[2]
		@lines[2].points[1].copy @points[0]

export default Triangle
