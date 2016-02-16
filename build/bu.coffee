# bu.coffee
# Generated: 2016-02-16 13:45:42

# File: Bu.coffee

# namespace and constants

@Bu =
	version: '0.2.0'

	# shapes related
	DEFAULT_STROKE_STYLE:       '#048'
	DEFAULT_FILL_STYLE:         'rgba(64, 128, 192, 0.5)'
	DEFAULT_DASH_STYLE:         [8, 4]

	# interaction related
	DEFAULT_STROKE_STYLE_HOVER:   'rgba(255, 128, 0, 0.75)'
	DEFAULT_FILL_STYLE_HOVER:   'rgba(255, 128, 128, 0.5)'

	# texts related
	DEFAULT_TEXT_FILL_STYLE:    'black'

	# default size
	DEFAULT_IMAGE_SIZE: 20
	POINT_RENDER_SIZE: 4


	# bounds related
	DEFAULT_BOUND_STROKE_STYLE:  '#444'
	DEFAULT_BOUND_DASH_STYLE:    [6, 6]

	# computation related
	DEFAULT_NEAR_DIST: 5

	# mouse interact
	MOUSE_BUTTON_NONE:   -1
	MOUSE_BUTTON_LEFT:   0
	MOUSE_BUTTON_MIDDLE: 1
	MOUSE_BUTTON_RIGHT:  2

###
# math
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

###
# utils
###

# get current time
# TODO use performance
Bu.now = Date.now

# combine the given options(last item in arguments) with the default options
Bu.combineOptions = (args, defaultOptions) ->
	defaultOptions = {} if not defaultOptions?
	givenOptions = args[args.length - 1]
	if typeof givenOptions is 'object'
		for i of givenOptions
			defaultOptions[i] = givenOptions[i]
	return defaultOptions

###
# polyfill
###

# define a property for a class
Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

# Array
Array::each or= (fn) ->
	i = 0
	while i < @length
		fn @[i]
		i++
	return @

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

	constructor: (@x, @y) ->

	set: (@x, @y) ->
# File: core/Event.coffee

# add event listener to custom objects
Bu.Event = ->
	types = {}

	@on = (type, listener) ->
		listeners = types[ type ] or= []
		listeners.push listener if listeners.indexOf listener == -1

	@once = (type, listener) ->
		listener.once = true
		@on type, listener

	@off = (type, listener) ->
		listeners = types[ type ]
		if listener?
			if listeners?
				index = listeners.indexOf listener
				listeners.splice index, 1 if index > -1
		else
			listeners.length = 0 if listeners?

	@trigger = ( type, eventData ) ->
		listeners = types[ type ]

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
				classText = dom.getAttribute 'class'  or ''
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

		# Not giving the attribute value means just add the attribute name
		# or clear the existing attribute value.
		# No, jQuery is to GET the value

		@attr = (name, value) =>
			value or= ''
			@each (dom) ->
				dom.setAttribute name, value
			@

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
		xhr.send null

) window or this

# File: core/Object2D.coffee

# hierarchy manage

class Bu.Object2D

	constructor: () ->
		Bu.Colorful.apply @
		Bu.Event.apply @

		@visible = yes
		@opacity = 1

		@position = new Bu.Vector()
		@rotation = 0
		@scale = new Bu.Vector(1, 1)
		@skew = new Bu.Vector()

#		@toWorldMatrix = new Bu.Matrix()
#		@updateMatrix ->

		@bounds = null  # for accelerate contain test
		@keyPoints = null
		@children = []
		@parent = null

	containsPoint: (p) ->
		if @bounds? and not @bounds.containsPoint p
			return no
		else if @_containsPoint
			return @_containsPoint p
		else
			return no
# File: core/Size.coffee

# the size of rectangle, Bounds etc.

class Bu.Size
	constructor: (@width, @height) ->
		@type = 'Size'

	set: (width, height) ->
		@width = width
		@height = height

# File: core/Bounds.coffee

## axis aligned bounding box

class Bu.Bounds extends Bu.Object2D

	constructor: (@target) ->
		super()
		@type = 'Bounds'
		@x1 = @y1 = @x2 = @y2 = 0
		@isEmpty = true

		@point1 = new Bu.Point
		@point2 = new Bu.Point

		@strokeStyle = Bu.DEFAULT_BOUND_STROKE_STYLE
		@dashStyle = Bu.DEFAULT_BOUND_DASH_STYLE
		@dashDelta = 0

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

# File: core/Colorful.coffee

# Add color to the shapes

Bu.Colorful = () ->
	@strokeStyle = Bu.DEFAULT_STROKE_STYLE
	@fillStyle = Bu.DEFAULT_FILL_STYLE
	@dashStyle = false

	@lineWidth = 1
	@dashDelta = 0

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

# File: shapes/Point.coffee

# point shape

class Bu.Point extends Bu.Object2D

	constructor: (@x = 0, @y = 0) ->
		super()
		@stroke no  # point has no stroke by default
		@type = 'Point'
		@_labelIndex = -1

	@property 'label',
		get: -> if @_labelIndex > -1 then @children[@_labelIndex].text else ''
		set: (val) ->
			if @_labelIndex == -1
				pointText = new Bu.PointText val, @x + Bu.POINT_RENDER_SIZE, @y, {align: '+0'}
				@children.push pointText
				@_labelIndex = @children.length - 1
			else
				@children[@_labelIndex].text = val

	arcTo: (radius, arc) ->
		return new Bu.Point(
		  @x + Math.cos(arc) * radius
		  @y + Math.sin(arc) * radius
		)

	clone: ->
		new Bu.Point(@x, @y)

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
			@children[@_labelIndex].x = @x + Bu.POINT_RENDER_SIZE
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

	# 这个是自己推导的
	distanceTo2: (point) ->
		p1 = @points[0]
		p2 = @points[1]
		a = (p1.y - p2.y) / (p1.x - p2.x)
		b = p1.y - (p1.y - p2.y) * p1.x / (p1.x - p2.x)
		czX = (point.y + point.x / a - b) / (a + 1 / a)
		czY = a * czX + b
		return Bu.bevel(czX - point.x, czY - point.y)

	# get foot point from a point 计算垂足点
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
		@bounds = null  # for accelerate contain test

		@keyPoints = [ @_center ]

	# property

	@property 'cx',
		get: ->  @_center.x
		set: (val) ->
			@_center.x = val
			@trigger 'centerChanged', @

	@property 'cy',
		get: ->  @_center.y
		set: (val) ->
			@_center.y = val
			@trigger 'centerChanged', @

	@property 'center',
		get: ->  @_center
		set: (val) ->
			@_center = val
			@cx = val.x
			@cy = val.y
			@keyPoints[0] = val
			@trigger 'centerChanged', @

	@property 'radius',
		get: ->  @_radius
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
		@lines = [
			new Bu.Line(p1, p2)
			new Bu.Line(p2, p3)
			new Bu.Line(p3, p1)
		]
		@center = new Bu.Point(Bu.average(p1.x, p2.x, p3.x), Bu.average(p1.y, p2.y, p3.y))
		@points = [p1, p2, p3]
		@keyPoints = @points

	# TODO test
	area: () ->
		a = @points[0]
		b = @points[1]
		c = @points[2]
		((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y))

	_containsPoint: (p) ->
		return @lines[0].isTwoPointsSameSide(p, @points[2]) and
				@lines[1].isTwoPointsSameSide(p, @points[0]) and
				@lines[2].isTwoPointsSameSide(p, @points[1])

# File: shapes/Rectangle.coffee

# rectangle shape

class Bu.Rectangle extends Bu.Object2D

	constructor: (x, y, width, height) ->
		super()
		@type = 'Rectangle'

		@position = new Bu.Point(x, y)
		@center = new Bu.Point(x + width / 2, y + height / 2)
		@size = new Bu.Size(width, height)

		@pointRT = new Bu.Point(x + width, y)
		@pointRB = new Bu.Point(x + width, y + height)
		@pointLB = new Bu.Point(x, y + height)

		@points = [@position, @pointRT, @pointRB, @pointLB]
		@keyPoints = @points

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
		@keyPoints = @string.points

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
		[@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

		@type = 'Bow'

		@center = new Bu.Point @cx, @cy
		@string = new Bu.Line @center.arcTo(@radius, @aFrom),
				@center.arcTo(@radius, @aTo)
		@keyPoints = @string.points

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
    2. Polygon(x, y, n, options): to generate regular polygon
    	options: radius, angle
	###
	constructor: (points) ->
		super()
		@type = 'Polygon'
		@vertices = []
		@lines = []
		@triangles = []

		options = Bu.combineOptions arguments,
			radius: 100
			angle: 0


		if points instanceof Array
			@vertices = points if points?
		else
			x = arguments[0]
			y = arguments[1]
			n = arguments[2]
			@vertices = Bu.Polygon.generateRegularPoints(x, y, n, options)

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

	@generateRegularPoints = (cx, cy, n, options) ->
		angleDelta = options.angle
		r = options.radius
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
		@lines = []
		@length = 0
		@pointNormalizedPos = []

		@keyPoints = @vertices
		onPointChange @

	onPointChange = (self) ->
		if self.vertices.length > 1
			self.updateLines()
			self.calcLength()
			self.calcPointNormalizedPos()

	updateLines: =>
		for i in [0 ... @vertices.length - 1]
			if @lines[i]?
				@lines[i].set(@vertices[i], @vertices[i + 1])
			else
				@lines[i] = new Bu.Line( @vertices[i], @vertices[i + 1] )
		# TODO remove the rest

	calcLength: =>
		if @vertices.length < 2
			@length = 0
		else
			len = 0
			for i in [1 ... @vertices.length]
				len += @vertices[i].distanceTo(@vertices[i - 1])
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

	# edit

	set = (points) ->
		# points
		for i in [0 ... @vertices.length]
			@vertices[i].copy points[i]

		# remove the extra points
		if @vertices.length > points.length
			@vertices.splice points.length

		onPointChange @

	addPoint: (point, insertIndex) ->
		if not insertIndex?
			# add point
			@vertices.push point
			# add line
			if @vertices.length > 1
				@lines.push(new Bu.Line( @vertices[@vertices.length - 2], @vertices[@vertices.length - 1] ))
		else
			@vertices.splice insertIndex, 0, point
		# TODO add lines
		onPointChange @

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
	constructor: (@text, @x, @y) ->
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

	constructor: (@url, x, y, width, height) ->
		super()
		@type = 'Image'

		@autoSize = yes
		@size = new Bu.Size Bu.DEFAULT_IMAGE_SIZE, Bu.DEFAULT_IMAGE_SIZE
		@position = new Bu.Vector x, y
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

# File: renderer/Renderer.coffee

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
			@dom.style.width = (@width / @pixelRatio) + 'px'
			@dom.style.height = (@height / @pixelRatio) + 'px'
			@dom.width = @width
			@dom.height = @height
		@dom.style.border = 'solid 1px gray' if options.border? and options.border
		@dom.style.cursor = 'crosshair'
		@dom.style.boxSizing = 'border-box'
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
						shape.dashStyle, shape.dashDelta
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
				@context.dashedLine pts[0].x, pts[0].y, pts[1].x, pts[1].y, shape.dashStyle, shape.dashDelta
				@context.dashedLine pts[1].x, pts[1].y, pts[2].x, pts[2].y, shape.dashStyle, shape.dashDelta
				@context.dashedLine pts[2].x, pts[2].y, pts[0].x, pts[0].y, shape.dashStyle, shape.dashDelta
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
				@context.dashedLine xL, yT, xR, yT, shape.dashStyle, shape.dashDelta
				@context.dashedLine xR, yT, xR, yB, shape.dashStyle, shape.dashDelta
				@context.dashedLine xR, yB, xL, yB, shape.dashStyle, shape.dashDelta
				@context.dashedLine xL, yB, xL, yT, shape.dashStyle, shape.dashDelta
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
					@context.dashedLine pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, shape.dashStyle, shape.dashDelta
				@context.dashedLine pts[len - 1].x, pts[len - 1].y, pts[0].x, pts[0].y, shape.dashStyle, shape.dashDelta
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
					@context.dashedLine pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, shape.dashStyle, shape.dashDelta
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
		@context.dashedLine bounds.x1, bounds.y1, bounds.x2, bounds.y1, bounds.dashStyle, bounds.dashDelta
		@context.dashedLine bounds.x2, bounds.y1, bounds.x2, bounds.y2, bounds.dashStyle, bounds.dashDelta
		@context.dashedLine bounds.x2, bounds.y2, bounds.x1, bounds.y2, bounds.dashStyle, bounds.dashDelta
		@context.dashedLine bounds.x1, bounds.y2, bounds.x1, bounds.y1, bounds.dashStyle, bounds.dashDelta
		@context.stroke()
		@


# Add draw dashed line feature to the canvas rendering context
# See: http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
(=>
	CP = window.CanvasRenderingContext2D and CanvasRenderingContext2D.prototype
	CP.dashedLine = (x, y, x2, y2, da, delta) ->
		da = Bu.DEFAULT_DASH_STYLE if not da?
		delta = 0 if not delta?
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
		delta %= lenU
		x = delta

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

# File: extra/RandomShapeGenerator.coffee

# generator random shapes

class Bu.RandomShapeGenerator

	MARGIN = 30

	constructor: (@renderer) ->

	randomX: ->
		return Bu.rand MARGIN, @renderer.width - MARGIN * 2

	randomY: ->
		return Bu.rand MARGIN, @renderer.height - MARGIN * 2

	randomRadius: ->
		return Bu.rand 5, Math.min(@renderer.width, @renderer.height) / 2


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
			Bu.rand(@renderer.width)
			Bu.rand(@renderer.height)
			Bu.rand(@renderer.width / 2)
			Bu.rand(@renderer.height / 2)
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
		line = new Bu.Line @randomX(),@randomY(),@randomX(),@randomY()
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

