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

  _onMouseDown: (ev) =>
    @onMouseDown? ev

  _onMouseMove: (ev) =>
    @onMouseMove? ev

  _onMouseUp: (ev) =>
    @onMouseUp? ev

  addListeners: ->
    @bu.dom.addEventListener 'mousedown', @_onMouseDown
    @bu.dom.addEventListener 'mousemove', @_onMouseMove
    @bu.dom.addEventListener 'mouseup', @_onMouseUp

  removeListeners: ->
    @bu.dom.removeEventListener 'mousedown', @_onMouseDown
    @bu.dom.removeEventListener 'mousemove', @_onMouseMove
    @bu.dom.removeEventListener 'mouseup', @_onMouseUp
