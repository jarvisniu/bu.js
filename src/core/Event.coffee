# add event listener to custom objects
Bu.Event = ->
	types = {}

	@on = (type, listener) ->
		listeners = types[type] or= []
		listeners.push listener if listeners.indexOf listener == -1

	@once = (type, listener) ->
		listener.once = true
		@on type, listener

	@off = (type, listener) ->
		listeners = types[type]
		if listener?
			if listeners?
				index = listeners.indexOf listener
				listeners.splice index, 1 if index > -1
		else
			listeners.length = 0 if listeners?

	@trigger = (type, eventData) ->
		listeners = types[type]

		if listeners?
			eventData or= {}
			eventData.target = this
			for listener in listeners
				listener.call this, eventData
				if listener.once
					listeners.splice i, 1
					i -= 1
