(=>
	libs = [
		"Geom2D",

		"core/Object2D",
		"core/Size",
		"core/AABB",
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

		"drawable/PointText",
		"drawable/Image",

		"morph/PolylineMorph",

		"reactor/MovePointReactor",
		"reactor/DrawCircleReactor",
		"reactor/DrawCircleDiameterReactor",

		"renderer/Renderer",
	]

	for lib in libs
		document.write '<script src="../../src/' + lib + '.js"></script>')()
