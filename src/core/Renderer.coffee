# Used to render all the drawable objects to the canvas

class Bu.Renderer

	constructor: () ->
		Bu.Event.apply @
		@type = 'Renderer'

		# API
		@scene = new Bu.Scene @
		@camera = new Bu.Camera
		@tickCount = 0
		@isRunning = yes
		@pixelRatio = Bu.global.devicePixelRatio or 1
		@clipMeter = new ClipMeter() if ClipMeter?

		# Receive options
		options = Bu.combineOptions arguments,
			container: 'body'
			fps: 60
			showKeyPoints: no
			showBounds: no
			originAtCenter: no
			imageSmoothing: yes

		# Copy options
		for name in ['container', 'width', 'height', 'fps', 'fps', 'showKeyPoints', 'showBounds', 'originAtCenter']
			@[name] = options[name]

		# If options.width is not given, then fillParent is true
		@fillParent = not Bu.isNumber options.width

		# Convert width and height from dip(device independent pixels) to physical pixels
		@width *= @pixelRatio
		@height *= @pixelRatio

		# Set canvas dom
		@dom = document.createElement 'canvas'
		@dom.style.cursor = options.cursor or 'default'
		@dom.style.boxSizing = 'content-box'
		@dom.oncontextmenu = -> false

		# Set context
		@context = @dom.getContext '2d'
		@context.textBaseline = 'top'

		# Set container dom
		@container = document.querySelector @container if Bu.isString @container
		if @fillParent and @container == document.body
			$('body').style('margin', 0).style('overflow', 'hidden')
			$('html, body').style('width', '100%').style('height', '100%')

		# Set sizes for renderer property, dom attribute and dom style
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

		if not @fillParent
			@dom.style.width = (@width / @pixelRatio) + 'px'
			@dom.style.height = (@height / @pixelRatio) + 'px'
			@dom.width = @width
			@dom.height = @height
		else
			@width = @container.clientWidth
			@height = @container.clientHeight
			Bu.global.window.addEventListener 'resize', onResize
			@dom.addEventListener 'DOMNodeInserted', onResize

		# Run the loop
		tick = =>
			if @isRunning
				@clipMeter.start() if @clipMeter?
				@render()
				@trigger 'update', @
				@tickCount += 1
				@clipMeter.tick() if @clipMeter?
			requestAnimationFrame tick
		tick()

		# Append <canvas> dom into the container
		delayed = =>
			@container.appendChild @dom
			@imageSmoothing = options.imageSmoothing
		setTimeout delayed, 1

		# Hook up with running components
		Bu.animationRunner.hookUp @
		Bu.dashFlowManager.hookUp @


	# Pause/continue/toggle the rendering loop
	pause: -> @isRunning = false
	continue: -> @isRunning = true
	toggle: -> @isRunning = not @isRunning


	# Perform the full render process
	render: ->
		@context.save()

		# Clear the canvas
		@clearCanvas()

		# Move center from left-top corner to screen center
		@context.translate @width / 2, @height / 2 if @originAtCenter

		# Zoom the canvas with devicePixelRatio to support high definition screen
		@context.scale @pixelRatio, @pixelRatio

		# Transform the camera
		@context.scale 1 / @camera.scale.x, 1 / @camera.scale.y
		@context.rotate -@camera.rotation
		@context.translate -@camera.position.x, -@camera.position.y

		# Draw the scene tree
		@drawShape @scene
		@context.restore()
		@

	# Clear the canvas
	clearCanvas: ->
		@context.fillStyle = @scene.background
		@context.fillRect 0, 0, @width, @height
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
			when 'Ellipse' then @drawEllipse shape
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


		if shape.fillStyle? and shape.fillable
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
		@context.arc shape.x, shape.y, Bu.POINT_RENDER_SIZE, 0, Bu.TWO_PI
		@


	drawLine: (shape) ->
		@context.moveTo shape.points[0].x, shape.points[0].y
		@context.lineTo shape.points[1].x, shape.points[1].y
		@


	drawCircle: (shape) ->
		@context.arc shape.cx, shape.cy, shape.radius, 0, Bu.TWO_PI
		@


	drawEllipse: (shape) ->
		@context.ellipse 0, 0, shape.radiusX, shape.radiusY, 0, Bu.TWO_PI, no
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

		if Bu.isString font
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
		if shape.ready
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

	# property

	@property 'imageSmoothing',
		get: -> @_imageSmoothing
		set: (val) ->
			@_imageSmoothing = @context.imageSmoothingEnabled = val

#----------------------------------------------------------------------
# Static members
#----------------------------------------------------------------------

# Stroke style of bounds
Bu.Renderer.BOUNDS_STROKE_STYLE = 'red'

# Dash style of bounds
Bu.Renderer.BOUNDS_DASH_STYLE = [6, 6]
