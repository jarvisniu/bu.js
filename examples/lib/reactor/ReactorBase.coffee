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
		@onMouseDown? @bu.processArgs e

	_onMouseMove: (e) =>
		@onMouseMove? @bu.processArgs e

	_onMouseUp: (e) =>
		@onMouseUp? @bu.processArgs e

	addListeners: ->
		@bu.dom.addEventListener 'mousedown', @_onMouseDown
		@bu.dom.addEventListener 'mousemove', @_onMouseMove
		@bu.dom.addEventListener 'mouseup', @_onMouseUp

	removeListeners: ->
		@bu.dom.removeEventListener 'mousedown', @_onMouseDown
		@bu.dom.removeEventListener 'mousemove', @_onMouseMove
		@bu.dom.removeEventListener 'mouseup', @_onMouseUp
