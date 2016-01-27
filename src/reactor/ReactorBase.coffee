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

	addListeners: ->
		@renderer.dom.addEventListener "mousedown", @onMouseDown
		@renderer.dom.addEventListener "mousemove", @onMouseMove
		@renderer.dom.addEventListener "mouseup", @onMouseUp

	removeListeners: ->
		@renderer.dom.removeEventListener "mousedown", @onMouseDown
		@renderer.dom.removeEventListener "mousemove", @onMouseMove
		@renderer.dom.removeEventListener "mouseup", @onMouseUp
