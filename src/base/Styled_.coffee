# Add color to the shapes
# This object is dedicated to mixed-in the Object2D.

Styled = () ->
	@strokeStyle = Styled.DEFAULT_STROKE_STYLE
	@fillStyle = Styled.DEFAULT_FILL_STYLE
	@dashStyle = false
	@dashFlowSpeed = 0
	@lineWidth = 1

	@dashOffset = 0

	# Set/copy style from other style
	@style = (style) ->
		if typeof style == 'string'
			style = Bu.styles[style]
			if not style?
				style = Bu.styles.default
				console.warn "Styled: Bu.styles.#{ style } doesn't exists, fell back to default."
		else if not style?
			style = Bu.styles['default']

		for k in ['strokeStyle', 'fillStyle', 'dashStyle', 'dashFlowSpeed', 'lineWidth']
			@[k] = style[k]
		@

	# Set the stroke style
	@stroke = (v) ->
		v = true unless v?
		v = Bu.styles[v].strokeStyle if Bu.styles? and v of Bu.styles
		switch v
			when true then @strokeStyle = Styled.DEFAULT_STROKE_STYLE
			when false then @strokeStyle = null
			else
				@strokeStyle = v
		@

	# Set the fill style
	@fill = (v) ->
		v = true unless v?
		v = Bu.styles[v].fillStyle if Bu.styles? and v of Bu.styles
		switch v
			when false then @fillStyle = null
			when true then @fillStyle = Styled.DEFAULT_FILL_STYLE
			else
				@fillStyle = v
		@

	# Set the dash style
	@dash = (v) ->
		v = true unless v?
		v = Bu.styles[v].dashStyle if Bu.styles? and v of Bu.styles
		v = [v, v] if typeof v == 'number'
		switch v
			when false then @dashStyle = null
			when true then @dashStyle = Styled.DEFAULT_DASH_STYLE
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

Styled.DEFAULT_STROKE_STYLE = '#048'
Styled.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)'
Styled.DEFAULT_DASH_STYLE = [8, 4]

export default Styled
