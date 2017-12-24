# Draw circle by dragging out a radius

class Bu.DrawCircleReactor extends Bu.ReactorBase

  constructor: (@bu) ->
    super()

    mousePos = new Bu.Point
    mousePosDown = new Bu.Point

    isConfirmed = true

    circle = null
    line = null

    # create new circles every time
    @onMouseDown = (e) =>
      if not isConfirmed
        circle = null
        isConfirmed = yes
      else
        mousePosDown.set e.offsetX, e.offsetY
        circle = new Bu.Circle 1, mousePosDown.x, mousePosDown.y
        @bu.scene.addChild circle

        line = new Bu.Line mousePosDown, mousePosDown
        line.stroke '#f44'
        @bu.scene.addChild line
        isConfirmed = no

    # change radius
    @onMouseMove = (e) =>
      mousePos.set e.offsetX, e.offsetY
      if (not isConfirmed) or (e.buttons == Bu.MOUSE.LEFT and circle?)
        circle.radius = mousePos.distanceTo mousePosDown
        line.setPoint1 mousePos

    @onMouseUp = =>
      isConfirmed = mousePos.distanceTo(mousePosDown) > Bu.POINT_RENDER_SIZE
