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
	for example: text is in the right top of the point, then align="+-"
	###
	constructor: (@text, @x, @y, options) ->
		super()
		@type = "PointText"
		@strokeStyle = null # no stroke by default
		@fillStyle = Bu.DEFAULT_TEXT_FILL_STYLE

		@align = "00"
		@fontFamily = "SimSun"
		@fontSize = 10
		if options?
			@align = options.align if options.align?
			@fontFamily = options.fontFamily if options.fontFamily?
			@fontSize = options.fontSize if options.fontSize?
			@font = options.font if options.font?
		@font = "#{ @fontSize }px #{ @fontFamily }" if @font?

		setContextAlign @, @align

	setContextAlign = (point, align) ->
		if align.length == 1
			align = "" + align + align
		alignX = align.substring(0, 1)
		alignY = align.substring(1, 2)
		point.textAlign = switch alignX
			when "-" then "right"
			when "0" then "center"
			when "+" then "left"
		point.textBaseline = switch alignY
			when "-" then "bottom"
			when "0" then "middle"
			when "+" then "top"
