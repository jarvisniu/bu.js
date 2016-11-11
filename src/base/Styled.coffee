# Add color to the shapes
# This object is dedicated to mixed-in the Object2D.

Bu.Styled = () ->
	@strokeStyle = Bu.Styled.DEFAULT_STROKE_STYLE
	@fillStyle = Bu.Styled.DEFAULT_FILL_STYLE
	@dashStyle = false
	@dashFlowSpeed = 0
	@lineWidth = 1

	@dashOffset = 0

	# Set/copy style from other style
	@style = (style) ->
		if Bu.isString style
			style = Bu.styles[style]
			if not style?
				style = Bu.styles.default
				console.warn "Bu.Styled: Bu.styles.#{ style } doesn't exists, fell back to default."
		else if not style?
			style = Bu.styles['default']

		for k in ['strokeStyle', 'fillStyle', 'dashStyle', 'dashFlowSpeed', 'lineWidth']
			@[k] = style[k]
		@

	# Set the stroke style
	@stroke = (v) ->
		v = true if not v?
		switch v
			when true then @strokeStyle = Bu.Styled.DEFAULT_STROKE_STYLE
			when false then @strokeStyle = null
			else
				@strokeStyle = v
		@

	# Set the fill style
	@fill = (v) ->
		v = true if not v?
		switch v
			when false then @fillStyle = null
			when true then @fillStyle = Bu.Styled.DEFAULT_FILL_STYLE
			else
				@fillStyle = v
		@

	# Set the dash style
	@dash = (v) ->
		v = true if not v?
		v = [v, v] if Bu.isNumber v
		switch v
			when false then @dashStyle = null
			when true then @dashStyle = Bu.Styled.DEFAULT_DASH_STYLE
			else
				@dashStyle = v
		@

	# Set the dash flowing speed
	@dashFlow = (speed) ->
		speed = 1 if speed == true or not speed?
		speed = 0 if speed == false
		Bu.dashFlowManager.setSpeed @, speed
		@

	# Set the lineWidth
	@setLineWidth = (w) ->
		@lineWidth = w
		@

	@

Bu.Styled.DEFAULT_STROKE_STYLE = '#048'
Bu.Styled.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)'
Bu.Styled.DEFAULT_DASH_STYLE = [8, 4]

Bu.styles =
	default: new Bu.Styled().stroke().fill()
	hover: new Bu.Styled().stroke('hsla(0, 100%, 25%, 0.75)').fill('hsla(0, 100%, 75%, 0.5)')
	text: new Bu.Styled().stroke(false).fill('black')
	line: new Bu.Styled().fill(false)
	selected: new Bu.Styled().stroke('#AA0').fill()
	dash: new Bu.Styled().dash()
