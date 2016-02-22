# canvas renderer

class Bu.Renderer

	constructor: () ->
		Bu.Event.apply @
		@type = 'Renderer'

		options = Bu.combineOptions arguments,
			width: 800
			height: 600
			fps: 60
			fillParent: off
			showKeyPoints: no
			border: off
		@width = options.width
		@height = options.height
		@fps = options.fps
		@container = options.container
		@fillParent = options.fillParent
		@isShowKeyPoints = options.showKeyPoints

		@tickCount = 0
		@isRunning = no

		@pixelRatio = window?.devicePixelRatio or 1

		@dom = document.createElement 'canvas'
		@context = @dom.getContext '2d'
		@context.textBaseline = 'top'
		@clipMeter = new ClipMeter() if ClipMeter?

		# API
		@shapes = []

		if not @fillParent
			@dom.style.width = Math.floor(@width / @pixelRatio) + 'px'
			@dom.style.height = Math.floor(@height / @pixelRatio) + 'px'
			@dom.width = @width
			@dom.height = @height
		@dom.style.border = 'solid 1px gray' if options.border? and options.border
		@dom.style.cursor = 'crosshair'
		@dom.style.boxSizing = 'content-box'
		@dom.style.background = '#eee'
		@dom.oncontextmenu = -> false

		window.canvas = @dom
		Bu.animationRunner?.hookUp @

		onResize = =>
			canvasRatio = @dom.height / @dom.width
			containerRatio = @container.clientHeight / @container.clientWidth
			if containerRatio < canvasRatio
				height = @container.clientHeight
				width = height / containerRatio
			else
				width = @container.clientWidth
				height = width * containerRatio
			@width = @dom.width = width * @pixelRatio
			@height = @dom.height = height * @pixelRatio
			@dom.style.width = width + 'px'
			@dom.style.height = height + 'px'
			@render()

		if @fillParent
			window.addEventListener 'resize', onResize
			@dom.addEventListener 'DOMNodeInserted', onResize


		tick = =>
			if @isRunning
				@clipMeter.start() if @clipMeter?
				@render()
				@trigger 'update', {'tickCount': @tickCount}
				@tickCount += 1
				@clipMeter.tick() if @clipMeter?

			requestAnimationFrame tick

		tick()

		# init
		if @container?
			@container = document.querySelector @container if typeof @container is 'string'
			setTimeout =>
				@container.appendChild @dom
			, 100
		@isRunning = true


	pause: ->
		@isRunning = false

	continue: ->
		@isRunning = true

	toggle: ->
		@isRunning = not @isRunning

	processArgs: (e) ->
		offsetX: e.offsetX * @pixelRatio
		offsetY: e.offsetY * @pixelRatio
		button: e.button

	append: (shape) ->
		if shape instanceof Array
			@shapes.push s for s in shape
		else
			@shapes.push shape
		@


	render: ->
		@clearCanvas()
		@drawShapes @shapes
		@

	clearCanvas: ->
		@context.clearRect 0, 0, @width, @height
		@

	drawShapes: (shapes) =>
		if shapes?
			for shape in shapes
				@context.save()
				@drawShape shape
				@context.restore()
		@

	drawShape: (shape) =>
		return @ unless shape.visible

		@context.translate shape.translate.x, shape.translate.y
		@context.rotate shape.rotation
		if typeof shape.scale == 'number'
			sx = shape.scale
			sy = shape.scale
		else
			sx = shape.scale.x
			sy = shape.scale.y
		if sx / sy > 100 or sx / sy < 0.01
			sx = 0 if Math.abs(sx) < 0.02
			sy = 0 if Math.abs(sy) < 0.02
		@context.scale sx, sy

		@context.globalAlpha = shape.opacity
		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.lineCap = shape.lineCap if shape.lineCap?
			@context.lineJoin = shape.lineJoin if shape.lineJoin?

		switch shape.type
			when 'Point' then @drawPoint(shape)
			when 'Line' then @drawLine(shape)
			when 'Circle' then @drawCircle(shape)
			when 'Triangle' then @drawTriangle(shape)
			when 'Rectangle' then @drawRectangle(shape)
			when 'Fan' then @drawFan(shape)
			when 'Bow' then @drawBow(shape)
			when 'Polygon' then @drawPolygon(shape)
			when 'Polyline' then @drawPolyline(shape)
			when 'Spline' then @drawSpline(shape)
			when 'PointText' then @drawPointText(shape)
			when 'Image' then @drawImage(shape)
			when 'Bounds' then @drawBounds(shape)
			else console.log 'drawShapes(): unknown shape: ', shape

		@drawShapes shape.children if shape.children?
		@drawShapes shape.keyPoints if @isShowKeyPoints
		@


	drawPoint: (shape) ->
		@context.globalAlpha = shape.opacity

		@context.beginPath()
		@context.arc shape.x, shape.y, Bu.POINT_RENDER_SIZE, 0, Math.PI * 2

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			@context.stroke()
		@


	drawLine: (shape) ->
		if shape.strokeStyle?
			@context.beginPath()
			if shape.dashStyle
				@context.dashedLine(
					shape.points[0].x, shape.points[0].y,
					shape.points[1].x, shape.points[1].y,
					shape.dashStyle, shape.dashOffset
				)
			else
				@context.moveTo shape.points[0].x, shape.points[0].y
				@context.lineTo shape.points[1].x, shape.points[1].y

			@context.stroke()
		@


	drawCircle: (shape) ->
		@context.beginPath()
		@context.arc shape.cx, shape.cy, shape.radius, 0, Math.PI * 2
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			if shape.dashStyle
				@context.beginPath()
				@context.dashedArc shape.cx, shape.cy, shape.radius, 0, Math.PI * 2, shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawTriangle: (shape) ->
		@context.beginPath()
		@context.lineTo shape.points[0].x, shape.points[0].y
		@context.lineTo shape.points[1].x, shape.points[1].y
		@context.lineTo shape.points[2].x, shape.points[2].y
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			if shape.dashStyle
				@context.beginPath() # clear prev lineTo
				pts = shape.points
				@context.dashedLine pts[0].x, pts[0].y, pts[1].x, pts[1].y, shape.dashStyle, shape.dashOffset
				@context.dashedLine pts[1].x, pts[1].y, pts[2].x, pts[2].y, shape.dashStyle, shape.dashOffset
				@context.dashedLine pts[2].x, pts[2].y, pts[0].x, pts[0].y, shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawRectangle: (shape) ->
		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fillRect shape.position.x, shape.position.y, shape.size.width, shape.size.height

		if shape.strokeStyle?
			if not shape.dashStyle
				@context.strokeRect(
					shape.position.x
					shape.position.y
					shape.size.width
					shape.size.height)
			else
				@context.beginPath()
				xL = shape.position.x
				xR = shape.pointRB.x
				yT = shape.position.y
				yB = shape.pointRB.y
				@context.dashedLine xL, yT, xR, yT, shape.dashStyle, shape.dashOffset
				@context.dashedLine xR, yT, xR, yB, shape.dashStyle, shape.dashOffset
				@context.dashedLine xR, yB, xL, yB, shape.dashStyle, shape.dashOffset
				@context.dashedLine xL, yB, xL, yT, shape.dashStyle, shape.dashOffset
				@context.stroke()
		@


	drawFan: (shape) ->
		@context.beginPath()
		@context.arc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo
		@context.lineTo shape.cx, shape.cy
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			if shape.dashStyle
				@context.beginPath()
				@context.dashedArc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo, shape.dashStyle, shape.dashOffset
				@context.dashedLine shape.cx, shape.cy,
					shape.cx + shape.radius * Math.cos(shape.aFrom),
					shape.cy + shape.radius * Math.sin(shape.aFrom),
					shape.dashStyle, shape.dashOffset
				@context.dashedLine shape.cx + shape.radius * Math.cos(shape.aTo),
					shape.cy + shape.radius * Math.sin(shape.aTo),
					shape.cx, shape.cy, shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawBow: (shape) ->
		@context.beginPath()
		@context.arc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			if shape.dashStyle
				@context.beginPath()
				@context.dashedArc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo, shape.dashStyle, shape.dashOffset
				@context.dashedLine shape.string.points[1].x, shape.string.points[1].y,
					shape.string.points[0].x, shape.string.points[0].y,
					shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawPolygon: (shape) ->
		@context.beginPath()
		for point in shape.vertices
			@context.lineTo point.x, point.y
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			len = shape.vertices.length
			if shape.dashStyle && len > 0
				@context.beginPath()
				pts = shape.vertices
				for i in [0 ... len - 1]
					@context.dashedLine pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, shape.dashStyle, shape.dashOffset
				@context.dashedLine pts[len - 1].x, pts[len - 1].y, pts[0].x, pts[0].y, shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawPolyline: (shape) ->
		if shape.strokeStyle?
			@context.beginPath()
			if not shape.dashStyle
				for point in shape.vertices
					@context.lineTo point.x, point.y
			else
				pts = shape.vertices
				for i in [ 0 ... pts.length - 1]
					@context.dashedLine pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawSpline: (shape) ->
		if shape.strokeStyle?
			@context.beginPath()
			len = shape.vertices.length
			if len == 2
				@context.moveTo shape.vertices[0].x, shape.vertices[0].y
				@context.lineTo shape.vertices[1].x, shape.vertices[1].y
			else if len > 2
				@context.moveTo shape.vertices[0].x, shape.vertices[0].y
				for i in [1..len - 1]
					@context.bezierCurveTo(
						shape.controlPointsBehind[i - 1].x,
						shape.controlPointsBehind[i - 1].y,
						shape.controlPointsAhead[i].x,
						shape.controlPointsAhead[i].y,
						shape.vertices[i].x,
						shape.vertices[i].y
					)
			if shape.dashStyle and @context.setLineDash?
				@context.setLineDash shape.dashStyle
				@context.stroke()
				@context.setLineDash [] # clear dashStyle
			else
				@context.stroke()
		@


	drawPointText: (shape) ->
		@context.textAlign = shape.textAlign
		@context.textBaseline = shape.textBaseline
		@context.font = shape.font
		if shape.strokeStyle?
			@context.strokeText shape.text, shape.x, shape.y
		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fillText shape.text, shape.x, shape.y
		@


	drawImage: (shape) ->
		if shape.loaded
			w = shape.size.width
			h = shape.size.height
			dx = -w * shape.pivot.x
			dy = -h * shape.pivot.y
			@context.drawImage shape.image, dx, dy, w, h
		@


	drawBounds: (bounds) ->
		@context.strokeStyle = bounds.strokeStyle
		@context.beginPath()
		@context.dashedLine bounds.x1, bounds.y1, bounds.x2, bounds.y1, bounds.dashStyle, bounds.dashOffset
		@context.dashedLine bounds.x2, bounds.y1, bounds.x2, bounds.y2, bounds.dashStyle, bounds.dashOffset
		@context.dashedLine bounds.x2, bounds.y2, bounds.x1, bounds.y2, bounds.dashStyle, bounds.dashOffset
		@context.dashedLine bounds.x1, bounds.y2, bounds.x1, bounds.y1, bounds.dashStyle, bounds.dashOffset
		@context.stroke()
		@


# Add draw dashed line feature to the canvas rendering context
# See: http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
(=>
	CP = window.CanvasRenderingContext2D and CanvasRenderingContext2D.prototype
	CP.dashedLine = (x, y, x2, y2, dashStyle, offset) ->
		dashStyle = Bu.DEFAULT_DASH_STYLE if not dashStyle?
		offset = 0 if not offset?
		@save()
		dx = x2 - x
		dy = y2 - y
		len = Bu.bevel dx, dy
		rot = Math.atan2 dy, dx
		@translate x, y
		@rotate rot
		dc = dashStyle.length

		lenU = 0
		for i in dashStyle
			lenU += i
		offset %= lenU

		# draw offset -> 0
		di = 0
		x = offset
		draw = false
		# no need `@moveTo offset, 0`, because `draw` is false, so the lineTo is in the first
		while x > 0
			di -= 1
			x -= dashStyle[di %% dc]
			x = 0 if x < 0
			if draw
				@lineTo x, 0
			else
				@moveTo x, 0
			draw = not draw

		# draw offset -> len
		di = 0
		x = offset
		draw = true
		@moveTo offset, 0
		while len > x
			x += dashStyle[di % dc]
			x = len if x > len
			if draw
				@lineTo x, 0
			else
				@moveTo x, 0
			draw = not draw
			di += 1
		@restore()
		@

	CP.dashedArc = (x, y, radius, startAngle, endAngle, dashStyle, offset) ->
		dashStyle = Bu.DEFAULT_DASH_STYLE if not dashStyle?
		offset = 0 if not offset?

		# convert dashStyle and offset from arc length to angle
		arcStyle = dashStyle.map (x) -> x / radius
		offset /= radius

		len = Math.abs endAngle - startAngle
		dc = arcStyle.length

		lenU = 0
		for i in arcStyle
			lenU += i
		offset %= lenU

		# draw offset -> 0
		di = 0
		xAngle = offset
		draw = false
		while xAngle > 0
			di -= 1
			xAngle -= arcStyle[di %% dc]
			xAngle = 0 if xAngle < 0
			if draw
				@lineTo x + radius * Math.cos(startAngle + xAngle), y + radius * Math.sin(startAngle + xAngle)
			else
				@moveTo x + radius * Math.cos(startAngle + xAngle), y + radius * Math.sin(startAngle + xAngle)
			draw = not draw

		# draw offset -> len
		di = 0
		xAngle = offset
		draw = true
		@moveTo x + radius * Math.cos(startAngle + offset), y + radius * Math.sin(startAngle + offset)
		while len > xAngle
			xAngle += arcStyle[di % dc]
			xAngle = len if xAngle > len
			if draw
				@lineTo x + radius * Math.cos(startAngle + xAngle), y + radius * Math.sin(startAngle + xAngle)
			else
				@moveTo x + radius * Math.cos(startAngle + xAngle), y + radius * Math.sin(startAngle + xAngle)
			draw = not draw
			di += 1
		@)()
