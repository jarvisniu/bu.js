# Manage the user input, like mouse, keyboard, touchscreen etc

class Bu.InputManager

	constructor: () ->

	handleAppEvents: (app, events) ->
		keydownListeners = {}
		window.addEventListener 'keydown', (e) =>
			listener = keydownListeners[e.key]
			if listener?
				listener.call app, e
			else
				console.log "You pressed an unbound key: #{ e.key }, keyCode: #{ e.keyCode }"

		for type of events
			if type in ['mousedown', 'mousemove', 'mouseup', 'keydown', 'keyup']
				app.$renderer.dom.addEventListener type, events[type].bind(app)
			else if type.indexOf('keydown.') == 0
				key = type.substring 8
				keydownListeners[key] = events[type]
