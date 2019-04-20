// Draw circle by dragging out a radius

class DrawCircleReactor extends Bu.ReactorBase {
  constructor(bu) {
    super()
    this.bu = bu
    this.circle = null
    this.line = null

    this.mousePos = new Bu.Point()
    this.mousePosDown = new Bu.Point()
    this.isConfirmed = true
  }

  // create new circles every time
  onMouseDown(ev) {
    if (!this.isConfirmed) {
      this.circle = null
      this.isConfirmed = true
    } else {
      this.mousePosDown.set(ev.offsetX, ev.offsetY)
      this.circle = new Bu.Circle(1, this.mousePosDown.x, this.mousePosDown.y)
      this.bu.scene.addChild(this.circle)

      this.line = new Bu.Line(this.mousePosDown, this.mousePosDown)
      this.line.stroke('#f44')
      this.bu.scene.addChild(this.line)
      this.isConfirmed = false
    }
  }

  // change radius
  onMouseMove(ev) {
    this.mousePos.set(ev.offsetX, ev.offsetY)
    if (
      !this.isConfirmed ||
      (ev.buttons === Bu.MOUSE.LEFT && this.circle != null)
    ) {
      this.circle.radius = this.mousePos.distanceTo(this.mousePosDown)
      this.line.setPoint1(this.mousePos)
    }
  }

  onMouseUp(ev) {
    this.isConfirmed =
      this.mousePos.distanceTo(this.mousePosDown) > Bu.POINT_RENDER_SIZE
  }
}

Bu.DrawCircleReactor = DrawCircleReactor
