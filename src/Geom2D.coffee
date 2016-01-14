# namespace and constants

@Geom2D =
	version: "0.0.1"

	# constants
	DEFAULT_NEAR_DIST: 5
	DEFAULT_TEXT_FILL_STYLE:    "black"
	DEFAULT_STROKE_STYLE:       "#048"
	DEFAULT_FILL_STYLE:         "rgba(64, 128, 192, 0.5)"
	DEFAULT_FILL_STYLE_HOVER:   "rgba(255, 128, 128, 0.5)"
	DEFAULT_DASH_STYLE:         [8, 4]

Geom2D.combineOptions = (args, defaultOptions) ->
	options = defaultOptions or {}
	lastArg = args[args.length - 1]
	if typeof lastArg is "object"
		for i of lastArg
			options[i] = lastArg[i]
	return options
