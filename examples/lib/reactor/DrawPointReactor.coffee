# click to draw a point

class Bu.DrawPointReactor extends Bu.ReactorBase

  constructor: (@bu) ->
    super()

    mousePos = new Bu.Point
    mouseDownPos = new Bu.Vector

    drawingPoint = null

    @onMouseDown = (ev) =>
      mouseDownPos.set ev.offsetX, ev.offsetY
      drawingPoint = new Bu.Point ev.offsetX, ev.offsetY
      @bu.scene.addChild drawingPoint

    @onMouseMove = (ev) =>
      mousePos.set ev.offsetX, ev.offsetY
      if ev.buttons == Bu.MOUSE.LEFT
        drawingPoint.set mousePos.x, mousePos.y

    @onMouseUp = =>
      drawingPoint = null
