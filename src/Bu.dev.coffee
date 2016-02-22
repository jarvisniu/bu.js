(=>
	libs = [
		'Bu',

		'math/Vector',

		'core/Event',
		'core/MicroJQuery',
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
		'shapes/Spline',

		'drawable/PointText',
		'drawable/Image',

		'renderer/Renderer',

		'anim/Animation',
		'anim/AnimationRunner',

		'extra/RandomShapeGenerator',
	]

	for lib in libs
		document.write '<script src="../src/' + lib + '.js"></script>')()
