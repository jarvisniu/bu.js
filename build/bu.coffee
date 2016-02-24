# bu.coffee
# Generated: 2016-02-24 18:14:27

# File: Bu.coffee

# namespace, constants and utility functions

# global object
global = window or this

# namespace `Bu` is also a shortcut to class `Bu.Renderer`
global.Bu = () -> new Bu.Renderer arguments...

# save global
Bu.global = global


###
# constants
###

# library version
Bu.VERSION = '0.3.2'

# shapes related
Bu.DEFAULT_STROKE_STYLE = '#048'
Bu.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)'
Bu.DEFAULT_DASH_STYLE = [8, 4]

# curve related
Bu.DEFAULT_SPLINE_SMOOTH = 0.25 # range in [0 ~ 1]

# interaction related
Bu.DEFAULT_STROKE_STYLE_HOVER = 'rgba(255, 128, 0, 0.75)'
Bu.DEFAULT_FILL_STYLE_HOVER = 'rgba(255, 128, 128, 0.5)'

# texts related
Bu.DEFAULT_TEXT_FILL_STYLE = 'black'

# default size
Bu.DEFAULT_IMAGE_SIZE = 20
Bu.POINT_RENDER_SIZE = 2.25
Bu.POINT_LABEL_OFFSET = 5

# bounds related
Bu.DEFAULT_BOUND_STROKE_STYLE = '#444'
Bu.DEFAULT_BOUND_DASH_STYLE = [6, 6]

# computation related
Bu.DEFAULT_NEAR_DIST = 5

# mouse interact
Bu.MOUSE_BUTTON_NONE = -1
Bu.MOUSE_BUTTON_LEFT = 0
Bu.MOUSE_BUTTON_MIDDLE = 1
Bu.MOUSE_BUTTON_RIGHT = 2


###
# utility functions
###

# calculate the mean value of several numbers
Bu.average = ()->
	ns = arguments
	ns = arguments[0] if typeof arguments[0] is 'object'
	sum = 0
	for i in ns
		sum += i
	sum / ns.length

# calculate the hypotenuse from the cathetuses
Bu.bevel = (x, y) ->
	Math.sqrt x * x + y * y

# generate a random number between two numbers
Bu.rand = (from, to) ->
	if not to?
		to = from
		from = 0
	Math.random() * (to - from) + from

# convert an angle from radian to deg
Bu.r2d = (r) -> (r * 180 / Math.PI).toFixed(1)

# convert an angle from deg to radian
Bu.d2r = (r) -> r * Math.PI / 180

# get current time
Bu.now = if window?.performance? then -> window.performance.now() else -> Date.now()

# combine the given options (last item of arguments) with the default options
Bu.combineOptions = (args, defaultOptions) ->
	defaultOptions = {} if not defaultOptions?
	givenOptions = args[args.length - 1]
	if typeof givenOptions is 'object'
		for i of givenOptions
			defaultOptions[i] = givenOptions[i]
	return defaultOptions

# clone an Object or Array
Bu.clone = (target, deep = false) ->
	# TODO deal with deep
	if target instanceof Array
		clone = []
		clone[i] = target[i] for own i of target
	else if target instanceof Object
		clone = {}
		clone[i] = target[i] for own i of target

# use localStorage to persist data
Bu.data = (key, value) ->
	if value?
		localStorage['Bu.' + key] = JSON.stringify value
	else
		value = localStorage['Bu.' + key]
		return if value? then JSON.parse value else null

###
# polyfill
###

# define a property for a class
Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

# throttle: limit the frequency of function call
Function::throttle = (limit = 0.5) ->
	currTime = 0
	lastTime = 0

	return () =>
		currTime = Date.now()
		if currTime - lastTime > limit * 1000
			@apply null, arguments
			lastTime = currTime

# debounce: delay the call of function
Function::debounce = (delay = 0.5) ->
	args = null
	timeout = null

	later = =>
		@apply null, args

	return () ->
		args = arguments
		clearTimeout timeout
		timeout = setTimeout later, delay * 1000


# Iterate this Array and do something with the items
Array::each or= (fn) ->
	i = 0
	while i < @length
		fn @[i]
		i++
	return @

# Iterate this Array and map the items to a new Array
Array::map or= (fn) ->
	arr = []
	i = 0
	while i < @length
		arr.push fn(@[i])
		i++
	return @

# File: math/Vector.coffee

# 2d vector

class Bu.Vector

	constructor: (@x = 0, @y = 0) ->

	set: (@x, @y) ->

# File: math/Size.coffee

# the size of rectangle, Bounds etc.

class Bu.Size
	constructor: (@width, @height) ->
		@type = 'Size'

	set: (width, height) ->
		@width = width
		@height = height

# File: math/Bounds.coffee

## axis aligned bounding box

class Bu.Bounds

	constructor: (@target) ->

		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = true

		@point1 = new Bu.Vector
		@point2 = new Bu.Vector

		@strokeStyle = Bu.DEFAULT_BOUND_STROKE_STYLE
		@dashStyle = Bu.DEFAULT_BOUND_DASH_STYLE
		@dashOffset = 0

		switch @target.type
			when 'Line', 'Triangle', 'Rectangle'
				for v in @target.points
					@expandByPoint(v)
			when 'Circle', 'Bow', 'Fan'
				@expandByCircle(@target)
				@target.on 'centerChanged', =>
					@clear()
					@expandByCircle @target
				@target.on 'radiusChanged', =>
					@clear()
					@expandByCircle @target
			when 'Polyline', 'Polygon'
				for v in @target.vertices
					@expandByPoint(v)
			else
				console.warn 'Bounds: not support shape type "' + @target.type + '"'

	containsPoint: (p) ->
		@x1 < p.x && @x2 > p.x && @y1 < p.y && @y2 > p.y

	clear: () ->
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = true

	expandByPoint: (v) ->
		if @isEmpty
			@isEmpty = false
			@x1 = @x2 = v.x
			@y1 = @y2 = v.y
		else
			@x1 = v.x if v.x < @x1
			@x2 = v.x if v.x > @x2
			@y1 = v.y if v.y < @y1
			@y2 = v.y if v.y > @y2

	expandByCircle: (c) ->
		cp = c.center
		r = c.radius
		if @isEmpty
			@isEmpty = false
			@x1 = cp.x - r
			@x2 = cp.x + r
			@y1 = cp.y - r
			@y2 = cp.y + r
		else
			@x1 = cp.x - r if cp.x - r < @x1
			@x2 = cp.x + r if cp.x + r > @x2
			@y1 = cp.y - r if cp.y - r < @y1
			@y2 = cp.y + r if cp.y + r > @y2

# File: core/Event.coffee

# add event listener to custom objects
Bu.Event = ->
	types = {}

	@on = (type, listener) ->
		listeners = types[type] or= []
		listeners.push listener if listeners.indexOf listener == -1

	@once = (type, listener) ->
		listener.once = true
		@on type, listener

	@off = (type, listener) ->
		listeners = types[type]
		if listener?
			if listeners?
				index = listeners.indexOf listener
				listeners.splice index, 1 if index > -1
		else
			listeners.length = 0 if listeners?

	@trigger = (type, eventData) ->
		listeners = types[type]

		if listeners?
			eventData or= {}
			eventData.target = this
			for listener in listeners
				listener.call this, eventData
				if listener.once
					listeners.splice i, 1
					i -= 1

# File: core/MicroJQuery.coffee

###
# MicroJQuery - A micro version of jQuery
#
# Supported features:
#   $. - static methods
#     .ready(cb) - call the callback function after the page is loaded
#     .ajax([url,] options) - perform an ajax request
#   $(selector) - select element(s)
#     .on(type, callback) - add an event listener
#     .off(type, callback) - remove an event listener
#     .append(tagName) - append a tag
#     .text(text) - set the inner text
#     .html(htmlText) - set the inner HTML
#     .style(name, value) - set style (a css attribute)
#     #.css(object) - set styles (multiple css attribute)
#     .hasClass(className) - detect whether a class exists
#     .addClass(className) - add a class
#     .removeClass(className) - remove a class
#     .toggleClass(className) - toggle a class
#     .attr(name, value) - set an attribute
#     .hasAttr(name) - detect whether an attribute exists
#     .removeAttr(name) - remove an attribute
#   Notes:
#        # is planned but not implemented
###

((global) ->

	# selector
	global.$ = (selector) ->
		selections = []
		if typeof selector == 'string'
			selections = [].slice.call document.querySelectorAll selector
		jQuery.apply selections
		selections

	jQuery = ->

		# event
		@on = (type, callback) =>
			@each (dom) ->
				dom.addEventListener type, callback
			@

		@off = (type, callback) =>
			@each (dom) ->
				dom.removeEventListener type, callback
			@

		# DOM Manipulation

		SVG_TAGS = 'svg line rect circle ellipse polyline polygon path text'

		@append = (tag) =>
			@each (dom, i) =>
				tagIndex = SVG_TAGS.indexOf tag.toLowerCase()
				if tagIndex > -1
					newDom = document.createElementNS 'http://www.w3.org/2000/svg', tag
				else
					newDom = document.createElement tag
				@[i] = dom.appendChild newDom
			@

		@text = (str) =>
			@each (dom) ->
				dom.textContent = str
			@

		@html = (str) =>
			@each (dom) ->
				dom.innerHTML = str
			@

		@style = (name, value) =>
			@each (dom) ->
				styleText = dom.getAttribute 'style'
				styles = {}
				if styleText
					styleText.split(';').each (n) ->
						nv = n.split ':'
						styles[nv[0]] = nv[1]
				styles[name] = value
				# concat
				styleText = ''
				for i of styles
					styleText += i + ': ' + styles[i] + '; '
				dom.setAttribute 'style', styleText
			@

		@hasClass = (name) =>
			if @length == 0
				return false
			# if multiple, every DOM should have the class
			i = 0
			while i < @length
				classText = @[i].getAttribute 'class' or ''
				# not use ' ' to avoid multiple spaces like 'a   b'
				classes = classText.split RegExp ' +'
				if !classes.contains name
					return false
				i++
			@

		@addClass = (name) =>
			@each (dom) ->
				classText = dom.getAttribute 'class' or ''
				classes = classText.split RegExp ' +'
				if not classes.contains name
					classes.push name
					dom.setAttribute 'class', classes.join ' '
			@

		@removeClass = (name) =>
			@each (dom) ->
				classText = dom.getAttribute('class') or ''
				classes = classText.split RegExp ' +'
				if classes.contains name
					classes.remove name
					if classes.length > 0
						dom.setAttribute 'class', classes.join ' '
					else
						dom.removeAttribute 'class'
			@

		@toggleClass = (name) =>
			@each (dom) ->
				classText = dom.getAttribute 'class' or ''
				classes = classText.split RegExp ' +'
				if classes.contains name
					classes.remove name
				else
					classes.push name
				if classes.length > 0
					dom.setAttribute 'class', classes.join ' '
				else
					dom.removeAttribute 'class'
			@

		@attr = (name, value) =>
			if value?
				@each (dom) -> dom.setAttribute name, value
				return @
			else
				return @[0].getAttribute name

		@hasAttr = (name) =>
			if @length == 0
				return false
			i = 0
			while i < @length
				if not @[i].hasAttribute name
					return false
				i++
			@

		@removeAttr = (name) =>
			@each (dom) ->
				dom.removeAttribute name
			@

		@val = => @[0]?.value

	# $.ready()
	global.$.ready = (onLoad) ->
		document.addEventListener 'DOMContentLoaded', onLoad

	### $.ajax()
		options:
			url: string
			====
			async = true: bool
			## data: object - query parameters TODO: implement this
			method = GET: POST, PUT, DELETE, HEAD
			username: string
			password: string
			success: function
			error: function
			complete: function
	###
	global.$.ajax = (url, ops) ->
		if !ops
			if typeof url == 'object'
				ops = url
				url = ops.url
			else
				ops = {}
		ops.method or= 'GET'
		ops.async = true unless ops.async?

		xhr = new XMLHttpRequest
		xhr.onreadystatechange = ->
			if xhr.readyState == 4
				if xhr.status == 200
					ops.success xhr.responseText, xhr.status, xhr if ops.success?
				else
					ops.error xhr, xhr.status if ops.error?
					ops.complete xhr, xhr.status if ops.complete?

		xhr.open ops.method, url, ops.async, ops.username, ops.password
		xhr.send null) window or this

# File: core/Object2D.coffee

# hierarchy manage

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Bu.Event.apply @

		@visible = yes
		@opacity = 1

		@translate = new Bu.Vector
		@rotation = 0
		@_scale = new Bu.Vector 1, 1
		@skew = new Bu.Vector

		#@toWorldMatrix = new Bu.Matrix()
		#@updateMatrix ->

		@bounds = null # for accelerate contain test
		@keyPoints = null
		@children = []
		@parent = null

	@property 'scale',
		get: -> @_scale
		set: (val) ->
			if typeof val == 'number'
				@_scale.x = @_scale.y = val
			else
				@scale = val

	animate: (anim, args) ->
		if typeof anim == 'string'
			if anim of Bu.animations
				Bu.animations[anim].apply @, args
			else
				console.warn "Bu.animations[\"#{ anim }\"] doesn't exists."
		else if anim instanceof Array
			args = [args] unless args instanceof Array
			@animate anim[i], args for own i of anim
		else
			anim.apply @, args

	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no

# File: core/Colorful.coffee

# Add color to the shapes

Bu.Colorful = () ->
	@strokeStyle = Bu.DEFAULT_STROKE_STYLE
	@fillStyle = Bu.DEFAULT_FILL_STYLE
	@dashStyle = false

	@lineWidth = 1
	@dashOffset = 0

	@stroke = (v) ->
		v = true if not v?
		switch v
			when true then @strokeStyle = Bu.DEFAULT_STROKE_STYLE
			when false then @strokeStyle = null
			else
				@strokeStyle = v
		@

	@fill = (v) ->
		v = true if not v?
		switch v
			when false then @fillStyle = null
			when true then @fillStyle = Bu.DEFAULT_FILL_STYLE
			else
				@fillStyle = v
		@

	@dash = (v) ->
		v = true if not v?
		v = [v, v] if typeof v is 'number'
		switch v
			when false then @dashStyle = null
			when true then @dashStyle = Bu.DEFAULT_DASH_STYLE
			else
				@dashStyle = v
		@

# File: core/Renderer.coffee

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
			@dom.style.width = @width + 'px'
			@dom.style.height = @height + 'px'
			@dom.width = @width * @pixelRatio
			@dom.height = @height * @pixelRatio
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

#	processArgs: (e) ->
#		offsetX: e.offsetX * @pixelRatio
#		offsetY: e.offsetY * @pixelRatio
#		button: e.button

	append: (shape) ->
		if shape instanceof Array
			@shapes.push s for s in shape
		else
			@shapes.push shape
		@


	render: ->
		@context.save()
		@context.scale @pixelRatio, @pixelRatio
		@clearCanvas()
		@drawShapes @shapes
		@context.restore()
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
			when 'Bounds' then @drawBounds shape
			else console.log 'drawShapes(): unknown shape: ', shape


		if shape.fillStyle?
			@context.fillStyle = shape.fillStyle
			@context.fill()

		if shape.dashStyle# and (shape.type == 'Spline' or shape.type == 'Rectangle' and shape.cornerRadius > 0)
			@context.lineDashOffset = shape.dashOffset
			@context.setLineDash? shape.dashStyle
			@context.stroke()
			@context.setLineDash []
		else if shape.strokeStyle?
			@context.stroke()

		@drawShapes shape.children if shape.children?
		@drawShapes shape.keyPoints if @isShowKeyPoints
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
		@context.rect shape.position.x, shape.position.y, shape.size.width, shape.size.height
		@


	drawRoundRectangle: (shape) ->
		x1 = shape.position.x
		x2 = shape.pointRB.x
		y1 = shape.position.y
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
						shape.controlPointsBehind[i - 1].x,
						shape.controlPointsBehind[i - 1].y,
						shape.controlPointsAhead[i].x,
						shape.controlPointsAhead[i].y,
						shape.vertices[i].x,
						shape.vertices[i].y
					)
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
		@context.rect bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1
		@

# File: shapes/Point.coffee

# point shape

class Bu.Point extends Bu.Object2D

	constructor: (@x = 0, @y = 0) ->
		super()
		@type = 'Point'

		@lineWidth = 0.5
		@_labelIndex = -1

	clone: -> new Bu.Point @x, @y

	@property 'label',
		get: -> if @_labelIndex > -1 then @children[@_labelIndex].text else ''
		set: (val) ->
			if @_labelIndex == -1
				pointText = new Bu.PointText val, @x + Bu.POINT_LABEL_OFFSET, @y, {align: '+0'}
				@children.push pointText
				@_labelIndex = @children.length - 1
			else
				@children[@_labelIndex].text = val

	arcTo: (radius, arc) ->
		return new Bu.Point @x + Math.cos(arc) * radius, @y + Math.sin(arc) * radius


	# copy value from other line
	copy: (point) ->
		@x = point.x
		@y = point.y
		@updateLabel()

	# set value from x, y
	set: (x, y) ->
		@x = x
		@y = y
		@updateLabel()

	updateLabel: ->
		if @_labelIndex > -1
			@children[@_labelIndex].x = @x + Bu.POINT_LABEL_OFFSET
			@children[@_labelIndex].y = @y

	# point related

	distanceTo: (point) ->
		Bu.bevel(@x - point.x, @y - point.y)

	footPoint = null

	isNear: (target, limit = Bu.DEFAULT_NEAR_DIST) ->
		switch target.type
			when 'Point' then @distanceTo(target) < limit
			when 'Line'
				verticalDist = target.distanceTo @

				footPoint = new Bu.Point unless footPoint?
				target.footPointFrom @, footPoint

				isBetween1 = footPoint.distanceTo(target.points[0]) < target.length + Bu.DEFAULT_NEAR_DIST
				isBetween2 = footPoint.distanceTo(target.points[1]) < target.length + Bu.DEFAULT_NEAR_DIST

				return verticalDist < limit and isBetween1 and isBetween2
			when 'Polyline'
				for line in target.lines
					return yes if @isNear line
				return no

Bu.Point.interpolate = (p1, p2, k, p3) ->
	x = p1.x + (p2.x - p1.x) * k
	y = p1.y + (p2.y - p1.y) * k

	if p3?
		p3.set x, y
	else
		return new Bu.Point x, y

# File: shapes/Line.coffee

# line shape

class Bu.Line extends Bu.Object2D

	constructor: (p1, p2, p3, p4) ->
		super()
		@type = 'Line'

		if arguments.length < 2
			@points = [new Bu.Point(), new Bu.Point()]
		else if arguments.length < 4
			@points = [p1.clone(), p2.clone()]
		else  # len >= 4
			@points = [new Bu.Point(p1, p2), new Bu.Point(p3, p4)]

		@length
		@midpoint = new Bu.Point()
		@keyPoints = @points

		@on "pointChange", (e) =>
			@length = @points[0].distanceTo(@points[1])
			@midpoint.set((@points[0].x + @points[1].x) / 2, (@points[0].y + @points[1].y) / 2)

		@trigger "pointChange", @

	clone: -> new Bu.Line @points[0], @points[1]

	# edit

	set: (a1, a2, a3, a4) ->
		if p4?
			@points[0].set a1, a2
			@points[1].set a3, a4
		else
			@points[0] = a1
			@points[1] = a2
		@trigger "pointChange", @
		@

	setPoint1: (a1, a2) ->
		if a2?
			@points[0].set a1, a2
		else
			@points[0].copy a1
		@trigger "pointChange", @
		@

	setPoint2: (a1, a2) ->
		if a2?
			@points[1].set a1, a2
		else
			@points[1].copy a1
		@trigger "pointChange", @
		@

	# point related

	isTwoPointsSameSide: (p1, p2) ->
		pA = @points[0]
		pB = @points[1]
		if pA.x == pB.x
			# if both of the two points are on the line then we consider they are in the same side
			return (p1.x - pA.x) * (p2.x - pA.x) > 0
		else
			y01 = (pA.y - pB.y) * (p1.x - pA.x) / (pA.x - pB.x) + pA.y
			y02 = (pA.y - pB.y) * (p2.x - pA.x) / (pA.x - pB.x) + pA.y
			return (p1.y - y01) * (p2.y - y02) > 0

	distanceTo: (point) ->
		p1 = @points[0]
		p2 = @points[1]
		a = (p1.y - p2.y) / (p1.x - p2.x)
		b = p1.y - a * p1.x
		return Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1)

	# this one is inferred by myself
	distanceTo2: (point) ->
		p1 = @points[0]
		p2 = @points[1]
		a = (p1.y - p2.y) / (p1.x - p2.x)
		b = p1.y - (p1.y - p2.y) * p1.x / (p1.x - p2.x)
		czX = (point.y + point.x / a - b) / (a + 1 / a)
		czY = a * czX + b
		return Bu.bevel(czX - point.x, czY - point.y)

	# get foot point from a point
	# save to footPoint or create a new point
	footPointFrom: (point, footPoint) ->
		p1 = @points[0]
		p2 = @points[1]
		A = (p1.y - p2.y) / (p1.x - p2.x)
		B = (p1.y - A * p1.x)
		m = point.x + A * point.y
		x = (m - A * B) / (A * A + 1)
		y = A * x + B

		if footPoint?
			footPoint.set(x, y)
		else
			return new Bu.Point(x, y)

	# line related

	getCrossPointWith: (line) ->
		p1 = @points[0]
		p2 = @points[1]
		q1 = line.points[0]
		q2 = line.points[1]

		a1 = p2.y - p1.y
		b1 = p1.x - p2.x
		c1 = (a1 * p1.x) + (b1 * p1.y)
		a2 = q2.y - q1.y
		b2 = q1.x - q2.x
		c2 = (a2 * q1.x) + (b2 * q1.y)
		det = (a1 * b2) - (a2 * b1)

		return new Bu.Point ((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det

	# whether cross with another line
	isCrossWithLine: (line) ->
		x1 = @points[0].x
		y1 = @points[0].y
		x2 = @points[1].x
		y2 = @points[1].y
		x3 = line.points[0].x
		y3 = line.points[0].y
		x4 = line.points[1].x
		y4 = line.points[1].y
		d = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1)
		if d == 0
			return false
		else
			x0 = ((x2 - x1) * (x4 - x3) * (y3 - y1) + (y2 - y1) * (x4 - x3) * x1 - (y4 - y3) * (x2 - x1) * x3) / d
			y0 = ((y2 - y1) * (y4 - y3) * (x3 - x1) + (x2 - x1) * (y4 - y3) * y1 - (x4 - x3) * (y2 - y1) * y3) / -d
		return (x0 - x1) * (x0 - x2) < 0 and
				(x0 - x3) * (x0 - x4) < 0 and
				(y0 - y1) * (y0 - y2) < 0 and
				(y0 - y3) * (y0 - y4) < 0

	# TODO test
	isCrossWithLine2: (line) ->
		p1 = @points[0]
		p2 = @points[1]
		q1 = line.points[0]
		q2 = line.points[1]

		dx = p2.x - p1.x
		dy = p2.y - p1.y
		da = q2.x - q1.x
		db = q2.y - q1.y

		# segments are parallel
		if da * dy - db * dx == 0
			return false

		s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx)
		t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy)

		return s >= 0 && s <= 1 and t >= 0 && t <= 1

# File: shapes/Circle.coffee

# Circle shape

class Bu.Circle extends Bu.Object2D

	constructor: (cx = 0, cy = 0, @_radius = 1) ->
		super()
		@type = 'Circle'

		@_center = new Bu.Point(cx, cy)
		@bounds = null # for accelerate contain test

		@keyPoints = [@_center]

	clone: () -> new Bu.Circle @cx, @cy, @radius

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

	# point related
	_containsPoint: (p) ->
		dx = p.x - @cx
		dy = p.y - @cy
		return Bu.bevel(dx, dy) < @radius

# File: shapes/Triangle.coffee

# triangle shape

class Bu.Triangle extends Bu.Object2D

	constructor: (p1, p2, p3) ->
		super()
		@type = 'Triangle'

		if arguments.length == 6
			[x1, y1, x2, y2, x3, y3] = arguments
			p1 = new Bu.Point x1, y1
			p2 = new Bu.Point x2, y2
			p3 = new Bu.Point x3, y3

		@lines = [
			new Bu.Line(p1, p2)
			new Bu.Line(p2, p3)
			new Bu.Line(p3, p1)
		]
		#@center = new Bu.Point Bu.average(p1.x, p2.x, p3.x), Bu.average(p1.y, p2.y, p3.y)
		@points = [p1, p2, p3]
		@keyPoints = @points

	clone: => new Bu.Triangle @points[0], @points[1], @points[2]

	# TODO test
	area: () ->
		[a, b, c] = @points
		return Math.abs(((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y))) / 2

	_containsPoint: (p) ->
		return @lines[0].isTwoPointsSameSide(p, @points[2]) and
				@lines[1].isTwoPointsSameSide(p, @points[0]) and
				@lines[2].isTwoPointsSameSide(p, @points[1])

# File: shapes/Rectangle.coffee

# rectangle shape

class Bu.Rectangle extends Bu.Object2D

	constructor: (x, y, width, height, cornerRadius = 0) ->
		super()
		@type = 'Rectangle'

		@position = new Bu.Point(x, y)
		@center = new Bu.Point(x + width / 2, y + height / 2)
		@size = new Bu.Size(width, height)

		@pointRT = new Bu.Point(x + width, y)
		@pointRB = new Bu.Point(x + width, y + height)
		@pointLB = new Bu.Point(x, y + height)

		@points = [@position, @pointRT, @pointRB, @pointLB]

		@cornerRadius = cornerRadius

	@property 'cornerRadius',
		get: -> @_cornerRadius
		set: (val) ->
			@_cornerRadius = val
			@keyPoints = if val > 0 then [] else @points

	clone: -> new Bu.Rectangle @position.x, @position.y, @size.width, @size.height

	containsPoint: (point) ->
		return point.x > @position.x and
				point.y > @position.y and
				point.x < @position.x + @size.width and
				point.y < @position.y + @size.height

# File: shapes/Fan.coffee

# Fan shape

class Bu.Fan extends Bu.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		@type = 'Fan'

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line(
				@center.arcTo @radius, @aFrom
				@center.arcTo @radius, @aTo
		)
		@keyPoints = [
			@string.points[0]
			@string.points[1]
			new Bu.Point @cx, @cy
		]

	clone: -> new Bu.Fan @cx, @cy, @radius, @aFrom, @aTo

	_containsPoint: (p) ->
		dx = p.x - @cx
		dy = p.y - @cy
		a = Math.atan2(p.y - @cy, p.x - @cx)
		a += Math.PI * 2 while a < @aFrom
		return Bu.bevel(dx, dy) < @radius && a > @aFrom && a < @aTo

# File: shapes/Bow.coffee

# Bow shape

class Bu.Bow extends Bu.Object2D

	constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
		super()
		@type = 'Bow'

		[@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line @center.arcTo(@radius, @aFrom),
				@center.arcTo(@radius, @aTo)
		@keyPoints = @string.points

	clone: -> new Bu.Bow @cx, @cy, @radius, @aFrom, @aTo

	_containsPoint: (point) ->
		if Bu.bevel(@cx - point.x, @cy - point.y) < @radius
			sameSide = @string.isTwoPointsSameSide(@center, point)
			smallThanHalfCircle = @aTo - @aFrom < Math.PI
			return sameSide ^ smallThanHalfCircle
		else
			return false

# File: shapes/Polygon.coffee

# polygon shape

class Bu.Polygon extends Bu.Object2D

	###
    constructors
    1. Polygon(points)
    2. Polygon(x, y, radius, n, options): to generate regular polygon
    	options: angle - start angle of regular polygon
	###
	constructor: (points) ->
		super()
		@type = 'Polygon'

		@vertices = []
		@lines = []
		@triangles = []

		options = Bu.combineOptions arguments,
			angle: 0

		if points instanceof Array
			@vertices = points if points?
		else
			if arguments.length < 4
				x = 0
				y = 0
				radius = arguments[0]
				n = arguments[1]
			else
				x = arguments[0]
				y = arguments[1]
				radius = arguments[2]
				n = arguments[3]
			@vertices = Bu.Polygon.generateRegularPoints x, y, radius, n, options

		# init lines
		if @vertices.length > 1
			for i in [0 ... @vertices.length - 1]
				@lines.push(new Bu.Line(@vertices[i], @vertices[i + 1]))
			@lines.push(new Bu.Line(@vertices[@vertices.length - 1], @vertices[0]))

		# init triangles
		if @vertices.length > 2
			for i in [1 ... @vertices.length - 1]
				@triangles.push(new Bu.Triangle(@vertices[0], @vertices[i], @vertices[i + 1]))

		@keyPoints = @vertices

	clone: -> new Bu.Polygon @vertices

	# detect

	isSimple: () ->
		len = @lines.length
		for i in [0...len]
			for j in [i + 1...len]
				if @lines[i].isCrossWithLine(@lines[j])
					return false
		return true

	# edit

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@vertices.push point

			# add line
			if @vertices.length > 1
				@lines[@lines.length - 1].points[1] = point
			if @vertices.length > 0
				@lines.push(new Bu.Line(@vertices[@vertices.length - 1], @vertices[0]))

			# add triangle
			if @vertices.length > 2
				@triangles.push(new Bu.Triangle(
						@vertices[0]
						@vertices[@vertices.length - 2]
						@vertices[@vertices.length - 1]
				))
		else
			@vertices.splice(insertIndex, 0, point)
	# TODO add lines and triangles

	# point related

	_containsPoint: (p) ->
		for triangle in @triangles
			if triangle.containsPoint p
				return true
		return false

	@generateRegularPoints = (cx, cy, radius, n, options) ->
		angleDelta = options.angle
		r = radius
		points = []
		angleSection = Math.PI * 2 / n
		for i in [0 ... n]
			a = i * angleSection + angleDelta
			x = cx + r * Math.cos(a)
			y = cy + r * Math.sin(a)
			points[i] = new Bu.Point x, y
		return points

# File: shapes/Polyline.coffee

# polyline shape

class Bu.Polyline extends Bu.Object2D

	constructor: (@vertices = []) ->
		super()
		@type = 'Polyline'

		if arguments.length > 1
			vertices = []
			for i in [0 ... arguments.length / 2]
				vertices.push new Bu.Point arguments[i * 2], arguments[i * 2 + 1]
			@vertices = vertices

		@lines = []
		@length = 0
		@pointNormalizedPos = []
		@keyPoints = @vertices

		@fill off

		@on "pointChange", =>
			if @vertices.length > 1
				@updateLines()
				@calcLength()
				@calcPointNormalizedPos()
		@trigger "pointChange", @

	clone: => new Bu.Polyline @vertices

	updateLines: =>
		for i in [0 ... @vertices.length - 1]
			if @lines[i]?
				@lines[i].set @vertices[i], @vertices[i + 1]
			else
				@lines[i] = new Bu.Line @vertices[i], @vertices[i + 1]
	# TODO remove the rest

	calcLength: =>
		if @vertices.length < 2
			@length = 0
		else
			len = 0
			for i in [1 ... @vertices.length]
				len += @vertices[i].distanceTo @vertices[i - 1]
			@length = len

	calcPointNormalizedPos: () ->
		currPos = 0
		@pointNormalizedPos[0] = 0
		for i in [1 ... @vertices.length]
			currPos += @vertices[i].distanceTo(@vertices[i - 1]) / @length
			@pointNormalizedPos[i] = currPos

	getNormalizedPos: (index) ->
		if index?
			return @pointNormalizedPos[index]
		else
			return @pointNormalizedPos

	compress: (strength = 0.8) ->
		compressed = []
		for own i of @vertices
			if i < 2
				compressed[i] = @vertices[i]
			else
				[pA, pM] = compressed[-2..-1]
				pB = @vertices[i]
				obliqueAngle = Math.abs(Math.atan2(pA.y - pM.y, pA.x - pM.x) - Math.atan2(pM.y - pB.y, pM.x - pB.x))
				if obliqueAngle < strength * strength * Math.PI / 2
					compressed[compressed.length - 1] = pB
				else
					compressed.push pB
		@vertices = compressed
		@keyPoints = @vertices
		@

	# edit

	set = (points) ->
		# points
		for i in [0 ... @vertices.length]
			@vertices[i].copy points[i]

		# remove the extra points
		if @vertices.length > points.length
			@vertices.splice points.length

		@trigger "pointChange", @

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@vertices.push point
			# add line
			if @vertices.length > 1
				@lines.push new Bu.Line @vertices[@vertices.length - 2], @vertices[@vertices.length - 1]
		else
			@vertices.splice insertIndex, 0, point
		# TODO add lines
		@trigger "pointChange", @

# File: shapes/Spline.coffee

# spline shape

class Bu.Spline extends Bu.Object2D

	constructor: (vertices) ->
		super()
		@type = 'Spline'

		if vertices instanceof Bu.Polyline
			polyline = vertices
			@vertices = polyline.vertices
			polyline.on 'pointChange', (polyline) =>
				@vertices = polyline.vertices
				calcControlPoints @
		else
			@vertices = Bu.clone vertices

		@keyPoints = @vertices
		@controlPointsAhead = []
		@controlPointsBehind = []

		@fill off
		@smoothFactor = Bu.DEFAULT_SPLINE_SMOOTH
		@_smoother = no

		calcControlPoints @

	@property 'smoother',
		get: -> @_smoother
		set: (val) ->
			oldVal = @_smoother
			@_smoother = val
			calcControlPoints @ if oldVal != @_smoother

	clone: -> new Bu.Spline @vertices

	addPoint: (point) ->
		@vertices.push point
		calcControlPoints @

	calcControlPoints = (spline) ->
		spline.keyPoints = spline.vertices

		p = spline.vertices
		len = p.length
		if len >= 1
			spline.controlPointsBehind[0] = p[0]
		if len >= 2
			spline.controlPointsAhead[len - 1] = p[len - 1]
		if len >= 3
			for i in [1...len - 1]
				theta1 = Math.atan2 p[i].y - p[i - 1].y, p[i].x - p[i - 1].x
				theta2 = Math.atan2 p[i + 1].y - p[i].y, p[i + 1].x - p[i].x
				len1 = Bu.bevel p[i].y - p[i - 1].y, p[i].x - p[i - 1].x
				len2 = Bu.bevel p[i].y - p[i + 1].y, p[i].x - p[i + 1].x
				theta = theta1 + (theta2 - theta1) * if spline._smoother then len1 / (len1 + len2) else 0.5
				theta += Math.PI if Math.abs(theta - theta1) > Math.PI / 2
				xA = p[i].x - len1 * spline.smoothFactor * Math.cos(theta)
				yA = p[i].y - len1 * spline.smoothFactor * Math.sin(theta)
				xB = p[i].x + len2 * spline.smoothFactor * Math.cos(theta)
				yB = p[i].y + len2 * spline.smoothFactor * Math.sin(theta)
				spline.controlPointsAhead[i] = new Bu.Point xA, yA
				spline.controlPointsBehind[i] = new Bu.Point xB, yB

				# add control lines for debugging
				#spline.children[i * 2 - 2] = new Bu.Line spline.vertices[i], spline.controlPointsAhead[i]
				#spline.children[i * 2 - 1] =  new Bu.Line spline.vertices[i], spline.controlPointsBehind[i]

# File: drawable/PointText.coffee

# draw text by a point

class Bu.PointText extends Bu.Object2D

	###
	options.align:
	----------------------
	|   --    0-    +-   |
	|         |↙00      |
	|   -0  --+->   +0   |
	|         ↓          |
	|   -+    0+    ++   |
	----------------------
	for example: text is in the right top of the point, then align = "+-"
	###
	constructor: (@text, @x = 0, @y = 0) ->
		super()
		@type = 'PointText'
		@strokeStyle = null # no stroke by default
		@fillStyle = Bu.DEFAULT_TEXT_FILL_STYLE

		options = Bu.combineOptions arguments,
			align: '00'
			fontFamily: 'Verdana'
			fontSize: 11
		@align = options.align
		@_fontFamily = options.fontFamily
		@_fontSize = options.fontSize
		@font = "#{ @_fontSize }px #{ @_fontFamily }" or options.font

		@setContextAlign @align

	@property 'fontFamily',
		get: -> @_fontFamily
		set: (val) ->
			@_fontFamily = val
			@font = "#{ @_fontSize }px #{ @_fontFamily }"

	@property 'fontSize',
		get: -> @_fontSize
		set: (val) ->
			@_fontSize = val
			@font = "#{ @_fontSize }px #{ @_fontFamily }"

	setContextAlign: (align) =>
		if align.length == 1
			align = '' + align + align
		alignX = align.substring(0, 1)
		alignY = align.substring(1, 2)
		@textAlign = switch alignX
			when '-' then 'right'
			when '0' then 'center'
			when '+' then 'left'
		@textBaseline = switch alignY
			when '-' then 'bottom'
			when '0' then 'middle'
			when '+' then 'top'

# File: drawable/Image.coffee

# draw bitmap

class Bu.Image extends Bu.Object2D

	constructor: (@url, x = 0, y = 0, width, height) ->
		super()
		@type = 'Image'

		@autoSize = yes
		@size = new Bu.Size Bu.DEFAULT_IMAGE_SIZE, Bu.DEFAULT_IMAGE_SIZE
		@translate = new Bu.Vector x, y
		@center = new Bu.Vector x + width / 2, y + height / 2
		if width?
			@size.set width, height
			@autoSize = no

		@pivot = new Bu.Vector 0.5, 0.5

		@image = new window.Image
		@loaded = false

		@image.onload = (e) =>
			if @autoSize
				@size.set @image.width, @image.height
			@loaded = true

		@image.src = @url

# File: anim/Animation.coffee

# animation

class Bu.Animation

	constructor: (options) ->
		@from = options.from
		@to = options.to
		@data = options.data or {}
		@duration = options.duration or 0.5
		@repeat = if options.repeat? then options.repeat else false
		@init = options.init
		@update = options.update
		@finish = options.finish

	apply: (target, args) ->
		Bu.animationRunner.add @, target, args

# prefab animations
# The names are according to jQuery UI
Bu.animations =

	# simple

	fadeIn: new Bu.Animation
		update: (t) ->
			@opacity = t

	fadeOut: new Bu.Animation
		update: (t) ->
			@opacity = 1 - t

	spin: new Bu.Animation
		update: (t) ->
			@rotation = t * Math.PI * 2

	spinIn: new Bu.Animation
		init: (anim, arg = 1) ->
			anim.data.ds = arg
		update: (t, data) ->
			@opacity = t
			@rotation = t * Math.PI * 4
			@scale = t * data.ds

	spinOut: new Bu.Animation
		update: (t) ->
			@opacity = 1 - t
			@rotation = t * Math.PI * 4
			@scale = 1 - t

	blink: new Bu.Animation
		duration: 0.2
		from: 0
		to: 512
		update: (data) ->
			data = Math.floor Math.abs(d - 256)
			@fillStyle = "rgb(#{ data }, #{ data }, #{ data })"

	shake: new Bu.Animation
		init: (anim, arg) ->
			anim.data.ox = @translate.x
			anim.data.range = arg or 20
		update: (t, data) ->
			@translate.x = Math.sin(t * Math.PI * 8) * data.range + data.ox

	# toggle: detect and save original status

	puff: new Bu.Animation
		duration: 0.15
		init: (anim) ->
			anim.from =
				opacity: @opacity
				scale: @scale.x
			anim.to =
				opacity: if @opacity == 1 then 0 else 1
				scale: if @opacity == 1 then @scale.x * 1.5 else @scale.x / 1.5
		update: (data) ->
			@opacity = data.opacity
			@scale = data.scale

	clip: new Bu.Animation
		init: (anim) ->
			if @scale.y != 0
				anim.from = @scale.y
				anim.to = 0
			else
				anim.from = @scale.y
				anim.to = @scale.x
		update: (data) ->
			@scale.y = data

	flipX: new Bu.Animation
		init: (anim) ->
			anim.from = @scale.x
			anim.to = -anim.from
		update: (data) ->
			@scale.x = data

	flipY: new Bu.Animation
		init: (anim) ->
			anim.from = @scale.y
			anim.to = -anim.from
		update: (data) ->
			@scale.y = data

	# with arguments

	moveTo: new Bu.Animation
		init: (anim, args) ->
			if args?
				anim.from = @translate.x
				anim.to = args
			else
				console.error 'animation moveTo need an argument'
		update: (data) ->
			@translate.x = data

	moveBy: new Bu.Animation
		init: (anim, args) ->
			if args?
				anim.from = @translate.x
				anim.to = @translate.x + parseFloat(args)
			else
				console.error 'animation moveTo need an argument'
		update: (data) ->
			@translate.x = data

# File: anim/AnimationRunner.coffee

# run the animations

class Bu.AnimationRunner

	constructor: () ->
		@runningAnimations = []

	add: (animation, target, args) ->
		@runningAnimations.push
			animation: animation
			target: target
			startTime: Bu.now()
			current: animation.data
			finished: no
		animation.init?.call target, animation, args

	update: ->
		now = Bu.now()
		for task in @runningAnimations
			continue if task.finished

			anim = task.animation
			t = (now - task.startTime) / (anim.duration * 1000)
			if t > 1
				finish = true
				if anim.repeat
					t = 0
					task.startTime = Bu.now()
				else
					## TODO remove out of array
					t = 1
					task.finished = yes

			if anim.from?
				if anim.from instanceof Object
					for own key of anim.from when key of anim.to
						task.current[key] = anim.to[key] * t - anim.from[key] * (t - 1)
				else
					task.current = anim.to * t - anim.from * (t - 1)
				anim.update.apply task.target, [task.current, t]
			else
				anim.update.apply task.target, [t, task.current]
			if finish then anim.finish?.call task.target, anim

	# hook up on an renderer, remove own setInternal
	hookUp: (renderer) ->
		renderer.on 'update', => @update()

# global unique instance
Bu.animationRunner = new Bu.AnimationRunner

# File: extra/RandomShapeGenerator.coffee

# generator random shapes

class Bu.RandomShapeGenerator

	MARGIN = 30

	constructor: (@bu) ->

	randomX: ->
		return Bu.rand MARGIN, @bu.width - MARGIN * 2

	randomY: ->
		return Bu.rand MARGIN, @bu.height - MARGIN * 2

	randomRadius: ->
		return Bu.rand 5, Math.min(@bu.width, @bu.height) / 2


	generate: (type) ->
		switch type
			when 'circle' then @generateCircle()
			when 'bow' then @generateBow()
			when 'triangle' then @generateTriangle()
			when 'rectangle' then @generateRectangle()
			when 'fan' then @generateFan()
			when 'polygon' then @generatePolygon()
			when 'line' then @generateLine()
			when 'polyline' then @generatePolyline()
			else console.warn 'not support shape: ' + type

	generateCircle: ->
		circle = new Bu.Circle @randomX(), @randomY(), @randomRadius()
		circle.center.label = 'O'
		return circle

	generateBow: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		bow = new Bu.Bow @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		bow.string.points[0].label = 'A'
		bow.string.points[1].label = 'B'
		return bow

	generateTriangle: ->
		points = []
		for i in [0..2]
			points[i] = new Bu.Point @randomX(), @randomY()

		triangle = new Bu.Triangle points[0], points[1], points[2]
		triangle.points[0].label = 'A'
		triangle.points[1].label = 'B'
		triangle.points[2].label = 'C'
		return triangle

	generateRectangle: ->
		return new Bu.Rectangle(
			Bu.rand(@bu.width)
			Bu.rand(@bu.height)
			Bu.rand(@bu.width / 2)
			Bu.rand(@bu.height / 2)
		)

	generateFan: ->
		aFrom = Bu.rand Math.PI * 2
		aTo = aFrom + Bu.rand Math.PI / 2, Math.PI * 2

		fan = new Bu.Fan @randomX(), @randomY(), @randomRadius(), aFrom, aTo
		fan.string.points[0].label = 'A'
		fan.string.points[1].label = 'B'
		return fan

	generatePolygon: ->
		points = []

		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			points.push point

		return new Bu.Polygon points

	generateLine: ->
		line = new Bu.Line @randomX(), @randomY(), @randomX(), @randomY()
		line.points[0].label = 'A'
		line.points[1].label = 'B'
		return line

	generatePolyline: ->
		polyline = new Bu.Polyline
		for i in [0..3]
			point = new Bu.Point @randomX(), @randomY()
			point.label = 'P' + i
			polyline.addPoint point
		return polyline

