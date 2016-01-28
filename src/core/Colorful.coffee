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
