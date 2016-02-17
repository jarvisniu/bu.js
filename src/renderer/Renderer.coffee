# canvas renderer

class Bu.Renderer

	constructor: () ->
		Bu.Event.apply @

		@type = 'Renderer'

		@pixelRatio = window?.devicePixelRatio || 1

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
			@startRenderTime = Bu.now()
			if @isRunning
				@clipMeter.start() if @clipMeter?
				@render()
				@trigger 'update', {'tickCount': @tickCount}
				@tickCount += 1
				@clipMeter.tick() if @clipMeter?

			@endRenderTime = Bu.now()
			@nextRenderTime = Math.max 1000 / @fps - @endRenderTime + @startRenderTime, 1
			setTimeout tick, @nextRenderTime

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
				@drawShape shape
		@

	drawShape: (shape) =>
		return @ unless shape.visible
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
			when 'PointText' then @drawPointText(shape)
			when 'Image' then @drawImage(shape)
			when 'Bounds' then @drawBounds(shape)
			else
				console.log 'drawShapes(): unknown shape: ', shape
		@drawShapes shape.children if shape.children?
		@drawShapes shape.keyPoints if @isShowKeyPoints
		@


	drawPoint: (shape) ->
		@context.globalAlpha = shape.opacity

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fillRect(
					shape.x - Bu.POINT_RENDER_SIZE / 2
					shape.y - Bu.POINT_RENDER_SIZE / 2
					Bu.POINT_RENDER_SIZE
					Bu.POINT_RENDER_SIZE
			)

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.strokeRect(
					shape.x - Bu.POINT_RENDER_SIZE / 2
					shape.y - Bu.POINT_RENDER_SIZE / 2
					Bu.POINT_RENDER_SIZE
					Bu.POINT_RENDER_SIZE
			)
		@


	drawLine: (shape) ->
		@context.globalAlpha = shape.opacity

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.beginPath()
			if shape.dashStyle
				@context.dashedLine(
						shape.points[0].x, shape.points[0].y,
						shape.points[1].x, shape.points[1].y,
						shape.dashStyle, shape.dashOffset
				)
			else
				@context.lineTo shape.points[0].x, shape.points[0].y
				@context.lineTo shape.points[1].x, shape.points[1].y
				@context.closePath()

			@context.stroke()
		@


	drawCircle: (shape) ->
		@context.globalAlpha = shape.opacity

		@context.beginPath()
		@context.arc shape.cx, shape.cy, shape.radius, 0, Math.PI * 2
		@context.closePath()
		# TODO add dashed arc support

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.stroke()
		@


	drawTriangle: (shape) ->
		@context.globalAlpha = shape.opacity

		@context.beginPath()
		@context.lineTo shape.points[0].x, shape.points[0].y
		@context.lineTo shape.points[1].x, shape.points[1].y
		@context.lineTo shape.points[2].x, shape.points[2].y
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			if shape.dashStyle
				@context.beginPath() # clear prev lineTo
				pts = shape.points
				@context.dashedLine pts[0].x, pts[0].y, pts[1].x, pts[1].y, shape.dashStyle, shape.dashOffset
				@context.dashedLine pts[1].x, pts[1].y, pts[2].x, pts[2].y, shape.dashStyle, shape.dashOffset
				@context.dashedLine pts[2].x, pts[2].y, pts[0].x, pts[0].y, shape.dashStyle, shape.dashOffset
			@context.stroke()
		@


	drawRectangle: (shape) ->
		@context.globalAlpha = shape.opacity

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fillRect shape.position.x, shape.position.y, shape.size.width, shape.size.height

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
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
		@context.globalAlpha = shape.opacity

		@context.beginPath()
		@context.arc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo
		@context.lineTo shape.cx, shape.cy
		@context.closePath()
		# TODO dashed arc

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.stroke()
		@


	drawBow: (shape) ->
		@context.globalAlpha = shape.opacity

		@context.beginPath()
		@context.arc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo
		@context.closePath()
		# TODO dashed arc

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.stroke()
		@


	drawPolygon: (shape) ->
		@context.globalAlpha = shape.opacity

		@context.beginPath()
		for point in shape.vertices
			@context.lineTo point.x, point.y
		@context.closePath()

		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			len = shape.vertices.length
			if shape.dashStyle && len > 0
				@context.beginPath()
				pts = shape.vertices
				for i in [0 ... len - 1]
					@context.dashedLine pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, shape.dashStyle, shape.dashOffset
				@context.dashedLine pts[len - 1].x, pts[len - 1].y, pts[0].x, pts[0].y, shape.dashStyle, shape.dashOffset
				@context.stroke()
			@context.stroke()
		@


	drawPolyline: (shape) ->
		if shape.strokeStyle?
			@context.globalAlpha = shape.opacity
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
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


	drawPointText: (shape) ->
		@context.globalAlpha = shape.opacity
		@context.textAlign = shape.textAlign
		@context.textBaseline = shape.textBaseline
		@context.font = shape.font
		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.strokeText shape.text, shape.x, shape.y
		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fillText shape.text, shape.x, shape.y
		@


	drawImage: (shape) ->
		if shape.loaded
			@context.save()
			@context.globalAlpha = shape.opacity
			w = shape.size.width * shape.scale.x
			h = shape.size.height * shape.scale.y
			dx = -w * shape.pivot.x
			dy = -h * shape.pivot.y
			@context.translate shape.position.x, shape.position.y
			@context.rotate shape.rotation
			@context.drawImage shape.image, dx, dy, w, h
			@context.restore()
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
	CP.dashedLine = (x, y, x2, y2, da, offset) ->
		da = Bu.DEFAULT_DASH_STYLE if not da?
		offset = 0 if not offset?
		@save()
		dx = x2 - x
		dy = y2 - y
		len = Bu.bevel dx, dy
		rot = Math.atan2 dy, dx
		@translate x, y
		@rotate rot
		dc = da.length
		di = 0
		draw = true

		lenU = 0
		for i in da
			lenU += i
		offset %= lenU
		x = offset

		@moveTo 0, 0
		# TODO need a small fix
		while len > x
			di += 1
			x += da[di % dc]
			x = len if x > len
			if draw
				@lineTo x, 0
			else
				@moveTo x, 0
			draw = not draw
		@restore()
		@
)()
