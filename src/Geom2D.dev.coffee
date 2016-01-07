(=>

	libs = [
		"Geom2D",

		"core/Size",
		"core/Colorful",

		"shapes/Point",
		"shapes/Line",
		"shapes/Circle",
		"shapes/Triangle",
		"shapes/Rectangle",
		"shapes/Fan",
		"shapes/Bow",
		"shapes/Polygon",
		"shapes/Polyline",

		"morph/PolylineMorph",

		"reactor/MovePointReactor",
		"reactor/DrawCircleReactor",
		"reactor/DrawCircleReactor2",

		"renderer/Renderer",
	]

	for lib in libs
	  document.write '<script src="../../src/' + lib + '.js"></script>'

)()
