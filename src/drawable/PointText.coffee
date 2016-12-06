# Render text around a point

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
		@fillStyle = 'black'

		options = Bu.combineOptions arguments,
			align: '00'
		@align = options.align
		if options.font?
			@font = options.font
		else if options.fontFamily? or options.fontSize?
			@_fontFamily = options.fontFamily or Bu.DEFAULT_FONT_FAMILY
			@_fontSize = options.fontSize or Bu.DEFAULT_FONT_SIZE
			@font = "#{ @_fontSize }px #{ @_fontFamily }"
		else
			@font = null

	@property 'align',
		get: -> @_align
		set: (val) ->
			@_align = val
			@setAlign @_align

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

	setAlign: (align) ->
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
		@

	setFontFamily: (family) ->
		@fontFamily = family
		@

	setFontSize: (size) ->
		@fontSize = size
		@
