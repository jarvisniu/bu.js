# drag to draw a freeline

class Bu.DrawFreelineReactor extends Bu.ReactorBase

  constructor: (@bu, @curvify = no) ->
    super()

    @lineSplitThresh = 8

    mousePos = new Bu.Point
    mouseDownPos = new Bu.Point

    polyline = null

    @onMouseDown = (ev) =>
      mouseDownPos.set ev.offsetX, ev.offsetY

      if ev.buttons == Bu.MOUSE.LEFT
        polyline = new Bu.Polyline
        polyline.style 'line'
        @bu.scene.addChild polyline

    @onMouseMove = (ev) =>
      mousePos.set ev.offsetX, ev.offsetY
      if ev.buttons == Bu.MOUSE.LEFT
        if mousePos.distanceTo(mouseDownPos) > @lineSplitThresh or polyline.vertices.length < 2
          polyline.addPoint mousePos.clone()
          mouseDownPos.copy mousePos
        else
          polyline.vertices[polyline.vertices.length - 1].copy mousePos

    @onMouseUp = =>
      if polyline?
        polyline.style()

        if @curvify
          polyline.compress 0.5
          spline = new Bu.Spline polyline
          spline.smoothFactor = 0.1
          @bu.scene.children[@bu.scene.children.length - 1] = spline
        else
          polyline.compress 0.2

        polyline = null
