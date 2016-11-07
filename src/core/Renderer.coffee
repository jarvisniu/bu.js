# Used to render all the drawable objects to the canvas

class Bu.Renderer

	constructor: () ->
		Bu.Event.apply @
		@type = 'Renderer'

		options = Bu.combineOptions arguments,
			container: 'body'
			fps: 60
			showKeyPoints: no
			showBounds: no
			background: '#eee'
		@[k] = options[k] for k in ['container', 'width', 'height', 'fps', 'showKeyPoints', 'showBounds']
		@container = document.querySelector @container if typeof @container is 'string'
		@fillParent = typeof options.width != 'number'

		@tickCount = 0
		@isRunning = no
		@pixelRatio = Bu.global.devicePixelRatio or 1
		@dom = document.createElement 'canvas'
		@context = @dom.getContext '2d'
		@context.textBaseline = 'top'
		@clipMeter = new ClipMeter() if ClipMeter?

		# API
		@scene = new Bu.Scene()

		if not @fillParent
			@dom.style.width = @width + 'px'
			@dom.style.height = @height + 'px'
			@dom.width = @width * @pixelRatio
			@dom.height = @height * @pixelRatio
		@dom.style.cursor = options.cursor or 'default'
		@dom.style.boxSizing = 'content-box'
		@dom.style.background = options.background
		@dom.oncontextmenu = -> false

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
			@width = @container.clientWidth
			@height = @container.clientHeight
			Bu.global.window.addEventListener 'resize', onResize
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
		setTimeout =>
			@container.appendChild @dom
		, 100

		Bu.animationRunner?.hookUp @

		@isRunning = true

	# Pause/continue/toggle the rendering loop
	pause: -> @isRunning = false
	continue: -> @isRunning = true
	toggle: -> @isRunning = not @isRunning

	# Add object(s) to the scene
	add: (shape) ->
		if Bu.isArray shape
			@scene.children.push s for s in shape
		else
			@scene.children.push shape
		@

	# Remove object from the scene
	remove: (shape) ->
		index = @scene.children.indexOf shape
		@scene.children.splice index, 1 if index > -1
		@

	# Perform the full render process
	render: ->
		@context.save()
		@context.scale @pixelRatio, @pixelRatio
		@clearCanvas()
		@drawShape @scene
		@context.restore()
		@

	# Clear the canvas
	clearCanvas: ->
		@context.clearRect 0, 0, @width, @height
		@

	# Draw an array of drawables
	drawShapes: (shapes) =>
		if shapes?
			for shape in shapes
				@context.save()
				@drawShape shape
				@context.restore()
		@

	# Draw an drawable to the canvas
	drawShape: (shape) =>
		return @ unless shape.visible

		@context.translate shape.position.x, shape.position.y
		@context.rotate shape.rotation
		sx = shape.scale.x
		sy = shape.scale.y
		if sx / sy > 100 or sx / sy < 0.01
			sx = 0 if Math.abs(sx) < 0.02
			sy = 0 if Math.abs(sy) < 0.02
		@context.scale sx, sy

		@context.globalAlpha *= shape.opacity
		if shape.strokeStyle?
			@context.strokeStyle = shape.strokeStyle
			@context.lineWidth = shape.lineWidth
			@context.lineCap = shape.lineCap if shape.lineCap?
			@context.lineJoin = shape.lineJoin if shape.lineJoin?

		@context.beginPath()

		switch shape.type
			when 'Point' then @drawPoint shape
			when 'Line' then @drawLine shape
			when 'Circle' then @drawCircle shape
			when 'Triangle' then @drawTriangle shape
			when 'Rectangle' then @drawRectangle shape
			when 'Fan' then @drawFan shape
			when 'Bow' then @drawBow shape
			when 'Polygon' then @drawPolygon shape
			when 'Polyline' then @drawPolyline shape
			when 'Spline' then @drawSpline shape
			when 'PointText' then @drawPointText shape
			when 'Image' then @drawImage shape
			when 'Object2D', 'Scene' # then do nothing
			else
				console.log 'drawShapes(): unknown shape: ', shape.type, shape


		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.dashStyle
			@context.lineDashOffset = shape.dashOffset
			@context.setLineDash? shape.dashStyle
			@context.stroke()
			@context.setLineDash []
		else if shape.strokeStyle?
			@context.stroke()

		@drawShapes shape.children if shape.children?
		@drawShapes shape.keyPoints if @showKeyPoints
		@drawBounds shape.bounds if @showBounds and shape.bounds?
		@



	drawPoint: (shape) ->
		@context.arc shape.x, shape.y, Bu.POINT_RENDER_SIZE, 0, Math.PI * 2
		@


	drawLine: (shape) ->
		@context.moveTo shape.points[0].x, shape.points[0].y
		@context.lineTo shape.points[1].x, shape.points[1].y
		@


	drawCircle: (shape) ->
		@context.arc shape.cx, shape.cy, shape.radius, 0, Math.PI * 2
		@


	drawTriangle: (shape) ->
		@context.lineTo shape.points[0].x, shape.points[0].y
		@context.lineTo shape.points[1].x, shape.points[1].y
		@context.lineTo shape.points[2].x, shape.points[2].y
		@context.closePath()
		@


	drawRectangle: (shape) ->
		return @drawRoundRectangle shape if shape.cornerRadius != 0
		@context.rect shape.pointLT.x, shape.pointLT.y, shape.size.width, shape.size.height
		@


	drawRoundRectangle: (shape) ->
		x1 = shape.pointLT.x
		x2 = shape.pointRB.x
		y1 = shape.pointLT.y
		y2 = shape.pointRB.y
		r = shape.cornerRadius

		@context.moveTo x1, y1 + r
		@context.arcTo x1, y1, x1 + r, y1, r
		@context.lineTo x2 - r, y1
		@context.arcTo x2, y1, x2, y1 + r, r
		@context.lineTo x2, y2 - r
		@context.arcTo x2, y2, x2 - r, y2, r
		@context.lineTo x1 + r, y2
		@context.arcTo x1, y2, x1, y2 - r, r
		@context.closePath()

		@context.setLineDash? shape.dashStyle if shape.strokeStyle? and shape.dashStyle
		@


	drawFan: (shape) ->
		@context.arc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo
		@context.lineTo shape.cx, shape.cy
		@context.closePath()
		@


	drawBow: (shape) ->
		@context.arc shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo
		@context.closePath()
		@


	drawPolygon: (shape) ->
		for point in shape.vertices
			@context.lineTo point.x, point.y
		@context.closePath()
		@


	drawPolyline: (shape) ->
		for point in shape.vertices
			@context.lineTo point.x, point.y
		@


	drawSpline: (shape) ->
		if shape.strokeStyle?
			len = shape.vertices.length
			if len == 2
				@context.moveTo shape.vertices[0].x, shape.vertices[0].y
				@context.lineTo shape.vertices[1].x, shape.vertices[1].y
			else if len > 2
				@context.moveTo shape.vertices[0].x, shape.vertices[0].y
				for i in [1..len - 1]
					@context.bezierCurveTo(
							shape.controlPointsBehind[i - 1].x
							shape.controlPointsBehind[i - 1].y
							shape.controlPointsAhead[i].x
							shape.controlPointsAhead[i].y
							shape.vertices[i].x
							shape.vertices[i].y
					)
		@


	drawPointText: (shape) ->
		font = shape.font or Bu.DEFAULT_FONT

		if typeof font == 'string'
			@context.textAlign = shape.textAlign
			@context.textBaseline = shape.textBaseline
			@context.font = font

			if shape.strokeStyle?
				@context.strokeText shape.text, shape.x, shape.y
			if shape.fillStyle?
				@context.fillStyle = shape.fillStyle
				@context.fillText shape.text, shape.x, shape.y
		else if font instanceof Bu.SpriteSheet and font.ready
			textWidth = font.measureTextWidth shape.text
			xOffset = switch shape.textAlign
				when 'left' then 0
				when 'center' then -textWidth / 2
				when 'right' then -textWidth
			yOffset = switch shape.textBaseline
				when 'top' then 0
				when 'middle' then -font.height / 2
				when 'bottom' then -font.height
			for i in [0...shape.text.length]
				char = shape.text[i]
				charBitmap = font.getFrameImage char
				if charBitmap?
					@context.drawImage charBitmap, shape.x + xOffset, shape.y + yOffset
					xOffset += charBitmap.width
				else
					xOffset += 10
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
		@context.beginPath()
		@context.strokeStyle = Bu.Renderer.BOUNDS_STROKE_STYLE
		@context.setLineDash? Bu.Renderer.BOUNDS_DASH_STYLE
		@context.rect bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1
		@context.stroke()
		@

#----------------------------------------------------------------------
# Static members
#----------------------------------------------------------------------

# Stroke style of bounds
Bu.Renderer.BOUNDS_STROKE_STYLE = 'red'

# Dash style of bounds
Bu.Renderer.BOUNDS_DASH_STYLE = [6, 6]
