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
