# canvas renderer

class Geom2D.Renderer

	POINT_SIZE = 4

	constructor: (options) ->
		Za.EventListenerPattern.apply @

		# default options
		@width = 800
		@height = 600
		@fps = 60

		if options?
			@width = options.width if options.width?
			@height = options.height if options.height?
			@fps = options.fps if options.fps?

		@type = "Renderer"
		_self = @

		# variables
		@dom = document.createElement("canvas");
		@context = @dom.getContext("2d")
		@context.textBaseline = 'top';

		tickCount = 0

		# API
		@shapes = []

		@dom.width = @width
		@dom.height = @height
		@dom.style.width = @width + "px"
		@dom.style.height = @height + "px"
		@dom.style.border = "solid 1px gray"
		@dom.style.cursor = "crosshair"
		@dom.style.background = "#eee"
		@dom.oncontextmenu = => false

		tick = =>
			tickCount += 1
			_self.triggerEvent "update", {"tickCount": tickCount}
			clearCanvas();
			@drawShapes();

		setInterval(tick, 1000 / @fps);
		clearCanvas = =>
			@context.clearRect(0, 0, _self.width, _self.height)


	append: (shape) ->
		@shapes.push shape


	drawShapes: =>
		for shape in @shapes
			switch shape.type
				when "Point" then @drawPoint(shape)
				when "Line" then @drawLine(shape)
				when "Circle" then @drawCircle(shape)
				when "Triangle" then @drawTriangle(shape)
				when "Rectangle" then @drawRectangle(shape)
				when "Fan" then @drawFan(shape)
				when "Bow" then @drawBow(shape)
				when "Polygon" then @drawPolygon(shape)
				when "Polyline" then @drawPolyline(shape)
				else
					console.log("drawShapes(): unknown shape: ", shape)


	drawPoint: (point) ->
		if point.fillStyle?
			@context.fillStyle = point.fillStyle
			@context.fillRect(
					point.x - POINT_SIZE / 2
					point.y - POINT_SIZE / 2
					POINT_SIZE
					POINT_SIZE
			)

		if point.strokeStyle?
			@context.strokeStyle = point.strokeStyle
			@context.strokeRect(
					point.x - POINT_SIZE / 2
					point.y - POINT_SIZE / 2
					POINT_SIZE
					POINT_SIZE
			)

		if point.label?
			# console.log("drawPoint(): " + point.label + ", x: " + point.x + ", y: " + point.y);
			style = @context.fillStyle
			@context.fillStyle = "black"
			@context.fillText(
					point.label
					point.x - POINT_SIZE / 2 + 9
					point.y - POINT_SIZE / 2 + 6
			)
			@context.fillStyle = style


	drawPoints: (points) ->
		for point in points
			@drawPoint point


	drawLine: (line) ->
		if line.strokeStyle?
			@context.strokeStyle = line.strokeStyle
			@context.lineWidth = line.lineWidth
			if line.dashStyle
				@context.dashedLine(
						line.points[0].x, line.points[0].y,
						line.points[1].x, line.points[1].y,
						line.dashStyle
				)
			else
				@context.beginPath()
				@context.lineTo(line.points[0].x, line.points[0].y)
				@context.lineTo(line.points[1].x, line.points[1].y)
				@context.closePath()

			@context.stroke()
		@drawPoints(line.points)


	drawCircle: (circle) ->
		@context.beginPath();
		@context.arc(circle.cx, circle.cy, circle.radius, 0, Math.PI * 2);
		@context.closePath();
		# TODO add dashed arc support

		if circle.fillStyle?
			@context.fillStyle = circle.fillStyle
			@context.fill()

		if circle.strokeStyle?
			@context.strokeStyle = circle.strokeStyle
			@context.lineWidth = circle.lineWidth
			@context.stroke()
		@drawPoint(circle.centralPoint)


	drawTriangle: (triangle) ->
		@context.beginPath()
		@context.lineTo(triangle.points[0].x, triangle.points[0].y)
		@context.lineTo(triangle.points[1].x, triangle.points[1].y)
		@context.lineTo(triangle.points[2].x, triangle.points[2].y)
		@context.closePath()

		if triangle.fillStyle?
			@context.fillStyle = triangle.fillStyle
			@context.fill()

		if triangle.strokeStyle?
			@context.strokeStyle = triangle.strokeStyle
			@context.lineWidth = triangle.lineWidth
			if triangle.dashStyle
				@context.beginPath(); # clear prev lineTo
				pts = triangle.points
				@context.dashedLine(pts[0].x, pts[0].y, pts[1].x, pts[1].y, triangle.dashStyle)
				@context.dashedLine(pts[1].x, pts[1].y, pts[2].x, pts[2].y, triangle.dashStyle)
				@context.dashedLine(pts[2].x, pts[2].y, pts[0].x, pts[0].y, triangle.dashStyle)
			@context.stroke()
		@drawPoints(triangle.points)


	drawRectangle: (rectangle) ->
		if rectangle.fillStyle?
			@context.fillStyle = rectangle.fillStyle
			@context.fillRect(
					rectangle.position.x
					rectangle.position.y
					rectangle.size.width
					rectangle.size.height
			)

		if rectangle.strokeStyle?
			@context.strokeStyle = rectangle.strokeStyle
			@context.lineWidth = rectangle.lineWidth
			if not rectangle.dashStyle
				@context.strokeRect(
						rectangle.position.x
						rectangle.position.y
						rectangle.size.width
						rectangle.size.height)
			else
				@context.beginPath()
				pt1 = rectangle.position
				pt3 = rectangle.rightBottomPoint
				@context.dashedLine(pt1.x, pt1.y, pt3.x, pt1.y, rectangle.dashStyle)
				@context.dashedLine(pt3.x, pt1.y, pt3.x, pt3.y, rectangle.dashStyle)
				@context.dashedLine(pt3.x, pt3.y, pt1.x, pt3.y, rectangle.dashStyle)
				@context.dashedLine(pt1.x, pt3.y, pt1.x, pt1.y, rectangle.dashStyle)
				@context.stroke()
		@drawPoints(rectangle.points)


	drawFan: (fan) ->
		@context.beginPath()
		@context.arc(fan.cx, fan.cy, fan.radius, fan.aFrom, fan.aTo)
		@context.lineTo(fan.cx, fan.cy)
		@context.closePath()
		# TODO dashed arc

		if fan.fillStyle?
			@context.fillStyle = fan.fillStyle
			@context.fill()

		if fan.strokeStyle?
			@context.strokeStyle = fan.strokeStyle
			@context.lineWidth = fan.lineWidth
			@context.stroke()

		@drawPoints(fan.string.points)


	drawBow: (bow) ->
		@context.beginPath()
		@context.arc(bow.cx, bow.cy, bow.radius, bow.aFrom, bow.aTo)
		@context.closePath()
		# TODO dashed arc

		if bow.fillStyle?
			@context.fillStyle = bow.fillStyle
			@context.fill()

		if bow.strokeStyle?
			@context.strokeStyle = bow.strokeStyle
			@context.lineWidth = bow.lineWidth
			@context.stroke()

		@drawPoints(bow.string.points)


	drawPolygon: (polygon) ->
		@context.beginPath()
		for point in polygon.points
			@context.lineTo(point.x, point.y)
		@context.closePath()

		if polygon.fillStyle?
			@context.fillStyle = polygon.fillStyle
			@context.fill()

		if polygon.strokeStyle?
			@context.strokeStyle = polygon.strokeStyle
			@context.lineWidth = polygon.lineWidth
			len = polygon.points.length
			if polygon.dashStyle && len > 0
				@context.beginPath()
				pts = polygon.points
				for i in [0 ... len - 1]
					@context.dashedLine(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, polygon.dashStyle)
				@context.dashedLine(pts[len - 1].x, pts[len - 1].y, pts[0].x, pts[0].y, polygon.dashStyle)
				@context.stroke()
			@context.stroke()
		@drawPoints(polygon.points)


	drawPolyline: (polyline) ->
		if polyline.strokeStyle?
			@context.strokeStyle = polyline.strokeStyle
			@context.lineWidth = polyline.lineWidth
			@context.beginPath();
			if not polyline.dashStyle
				for point in polyline.points
					@context.lineTo(point.x, point.y)
			else
				pts = polyline.points;
				for i in [ 0 ... pts.length - 1]
					@context.dashedLine(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, polyline.dashStyle)
			@context.stroke()
		@drawPoints(polyline.points)


# Add draw dashed line feature to the canvas rendering context
# See: http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
(=>
	CP = window.CanvasRenderingContext2D and CanvasRenderingContext2D.prototype
	if CP.lineTo?
		CP.dashedLine = (x, y, x2, y2, da) ->
			da = Geom2D.Colorful.DEFAULT_DASH_STYLE if not da?
			@save()
			dx = x2 - x
			dy = y2 - y
			len = Math.bevel(dx, dy)
			rot = Math.atan2(dy, dx)
			@translate(x, y)
			@moveTo(0, 0)
			@rotate(rot)
			dc = da.length
			di = 0
			draw = true
			x = 0
			while len > x
				di += 1
				x += da[di % dc]
				x = len if x > len
				if draw
					@lineTo(x, 0)
				else
					@moveTo(x, 0)
				draw = not draw
			@restore()
			return @)()
