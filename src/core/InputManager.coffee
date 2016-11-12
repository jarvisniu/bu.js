# Manage the user input, like mouse, keyboard, touchscreen etc

class Bu.InputManager

	constructor: () ->
		@keyStates = []

		window.addEventListener 'keydown', (e) =>
			@keyStates[e.keyCode] = yes
		window.addEventListener 'keyup', (e) =>
			@keyStates[e.keyCode] = no

	isKeyDown: (key) ->
		keyCode = @keyToKeyCode key
		@keyStates[keyCode]

	keyToKeyCode: (key) ->
		keyCode = @keyToKeyCodeMap[key]
		return if keyCode? then keyCode	else null

	handleAppEvents: (app, events) ->
		keydownListeners = {}
		window.addEventListener 'keydown', (e) =>
			keydownListeners[e.key]?.call app, e

		for type of events
			if type in ['mousedown', 'mousemove', 'mouseup', 'keydown', 'keyup']
				app.$renderer.dom.addEventListener type, events[type].bind(app)
			else if type.indexOf('keydown.') == 0
				key = type.substring 8
				keydownListeners[key] = events[type]

	keyToKeyCodeMap:
		1: 49
		2: 50
		3: 51
		4: 52
		5: 53
		6: 54
		7: 55
		8: 56
		9: 57
		A: 65
		B: 66
		C: 67
		D: 68
		E: 69
		F: 70
		G: 71
		H: 72
		I: 73
		J: 74
		K: 75
		L: 76
		M: 77
		N: 78
		O: 79
		P: 80
		Q: 81
		R: 82
		S: 83
		T: 84
		U: 85
		V: 86
		W: 87
		X: 88
		Y: 89
		Z: 90
		Backspace: 8
		Tab: 9
		Enter: 13
		Shift: 16
		Ctrl: 17
		Alt: 18
		Esc: 27
		Space: 32
		PageUp: 33
		PageDown: 34
		End: 35
		Home: 36
		Left: 37
		Up: 38
		Right: 39
		Down: 40
		Del: 46
		F1: 112
		F2: 113
		F3: 114
		F4: 115
		F5: 116
		F6: 117
		F7: 118
		F8: 119
		F9: 120
		F10: 121
		F11: 122
		F12: 123
		'`': 192
		'=': 187
		',': 188
		'-': 189
		'.': 190
		'/': 191
		';': 186
		"'": 222
		'[': 219
		']': 221
		'\\': 220
