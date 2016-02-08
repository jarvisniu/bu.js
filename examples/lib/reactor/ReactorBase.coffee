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
		@onMouseDown? @renderer.processArgs e

	_onMouseMove: (e) =>
		@onMouseMove? @renderer.processArgs e

	_onMouseUp: (e) =>
		@onMouseUp? @renderer.processArgs e

	addListeners: ->
		@renderer.dom.addEventListener 'mousedown', @_onMouseDown
		@renderer.dom.addEventListener 'mousemove', @_onMouseMove
		@renderer.dom.addEventListener 'mouseup', @_onMouseUp

	removeListeners: ->
		@renderer.dom.removeEventListener 'mousedown', @_onMouseDown
		@renderer.dom.removeEventListener 'mousemove', @_onMouseMove
		@renderer.dom.removeEventListener 'mouseup', @_onMouseUp
