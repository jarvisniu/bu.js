(=>
	libs = [
		'Bu',

		'math/Vector',

		'core/Object2D',
		'core/Size',
		'core/Bounds',
		'core/Colorful',

		'shapes/Point',
		'shapes/Line',
		'shapes/Circle',
		'shapes/Triangle',
		'shapes/Rectangle',
		'shapes/Fan',
		'shapes/Bow',
		'shapes/Polygon',
		'shapes/Polyline',

		'drawable/PointText',
		'drawable/Image',

		'morph/PolylineMorph',

		'reactor/ReactorBase',
		'reactor/MovePointReactor',
		'reactor/DrawCircleReactor',
		'reactor/DrawPointReactor',
		'reactor/DrawCircleDiameterReactor',
		'reactor/DrawPolylineReactor',
		'reactor/DrawPolygonReactor',

		'renderer/Renderer',

		'extra/RandomShapeGenerator',
	]

	for lib in libs
		document.write '<script src="../src/' + lib + '.js"></script>')()
