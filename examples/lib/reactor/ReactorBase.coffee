# move a point by dragging it

class Bu.ReactorBase

	constructor: ->
		@enabled = false

	enable: ->
		@addListeners()
		@enabled = true

	disable: ->
		@removeListeners()
		@enabled = false

	_onMouseDown: (e) =>
		@onMouseDown? e

	_onMouseMove: (e) =>
		@onMouseMove? e

	_onMouseUp: (e) =>
		@onMouseUp? e

	addListeners: ->
		@bu.dom.addEventListener 'mousedown', @_onMouseDown
		@bu.dom.addEventListener 'mousemove', @_onMouseMove
		@bu.dom.addEventListener 'mouseup', @_onMouseUp

	removeListeners: ->
		@bu.dom.removeEventListener 'mousedown', @_onMouseDown
		@bu.dom.removeEventListener 'mousemove', @_onMouseMove
		@bu.dom.removeEventListener 'mouseup', @_onMouseUp
