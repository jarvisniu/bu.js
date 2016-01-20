# namespace and constants

@Geom2D =
	version: "0.0.1"

	###
		constants
	###

	# shapes related
	DEFAULT_STROKE_STYLE:       "#048"
	DEFAULT_FILL_STYLE:         "rgba(64, 128, 192, 0.5)"
	DEFAULT_DASH_STYLE:         [8, 4]

	# interaction related
	DEFAULT_FILL_STYLE_HOVER:   "rgba(255, 128, 128, 0.5)"

	# texts related
	DEFAULT_TEXT_FILL_STYLE:    "black"

	# bounds related
	DEFAULT_BOUND_STROKE_STYLE:  "#444"
	DEFAULT_BOUND_DASH_STYLE:    [6, 6]

	# computation related
	DEFAULT_NEAR_DIST: 5


Geom2D.combineOptions = (args, defaultOptions) ->
	options = defaultOptions or {}
	lastArg = args[args.length - 1]
	if typeof lastArg is "object"
		for i of lastArg
			options[i] = lastArg[i]
	return options


# calculate the average number of several numbers
# you can pass several numbers or a Array of numbers
Geom2D.average = ()->
	ns = arguments
	ns = arguments[0] if typeof arguments[0] is "object"
	sum = 0
	for i in ns
		sum += i
	sum / ns.length
