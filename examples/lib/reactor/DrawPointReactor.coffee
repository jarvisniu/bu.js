# click to draw a point

class Bu.DrawPointReactor extends Bu.ReactorBase

  constructor: (@bu) ->
    super()

    mousePos = new Bu.Point
    mouseDownPos = new Bu.Vector

    drawingPoint = null

    @onMouseDown = (e) =>
      mouseDownPos.set e.offsetX, e.offsetY
      drawingPoint = new Bu.Point e.offsetX, e.offsetY
      @bu.scene.addChild drawingPoint

    @onMouseMove = (e) =>
      mousePos.set e.offsetX, e.offsetY
      if e.buttons == Bu.MOUSE.LEFT
        drawingPoint.set mousePos.x, mousePos.y

    @onMouseUp = =>
      drawingPoint = null
