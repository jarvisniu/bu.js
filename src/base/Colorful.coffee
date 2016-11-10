# Add color to the shapes
# This object is dedicated to mixed-in the Object2D.

Bu.Colorful = () ->
	@strokeStyle = Bu.DEFAULT_STROKE_STYLE
	@fillStyle = Bu.DEFAULT_FILL_STYLE
	@dashStyle = false
	@dashFlowSpeed = 0
	@lineWidth = 1

	@dashOffset = 0

	# Set/copy style from other colorful object
	@style = (o) ->
		for k in ['strokeStyle', 'fillStyle', 'dashStyle', 'dashFlowSpeed', 'lineWidth']
			@[k] = o[k]
		@

	# Set the stroke style
	@stroke = (v) ->
		v = true if not v?
		switch v
			when true then @strokeStyle = Bu.DEFAULT_STROKE_STYLE
			when false then @strokeStyle = null
			else
				@strokeStyle = v
		@

	# Set the fill style
	@fill = (v) ->
		v = true if not v?
		switch v
			when false then @fillStyle = null
			when true then @fillStyle = Bu.DEFAULT_FILL_STYLE
			else
				@fillStyle = v
		@

	# Set the dash style
	@dash = (v) ->
		v = true if not v?
		v = [v, v] if Bu.isNumber v
		switch v
			when false then @dashStyle = null
			when true then @dashStyle = Bu.DEFAULT_DASH_STYLE
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
