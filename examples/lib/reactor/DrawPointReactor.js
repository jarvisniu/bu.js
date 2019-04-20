// click to draw a point

class DrawPointReactor extends Bu.ReactorBase {
  constructor(bu) {
    super()
    this.bu = bu
    this.drawingPoint = null

    this.mousePos = new Bu.Point()
    this.mouseDownPos = new Bu.Vector()
  }

  onMouseDown(ev) {
    this.mouseDownPos.set(ev.offsetX, ev.offsetY)
    this.drawingPoint = new Bu.Point(ev.offsetX, ev.offsetY)
    this.bu.scene.addChild(this.drawingPoint)
  }

  onMouseMove(ev) {
    this.mousePos.set(ev.offsetX, ev.offsetY)
    if (ev.buttons === Bu.MOUSE.LEFT) {
      this.drawingPoint.set(this.mousePos.x, this.mousePos.y)
    }
  }

  onMouseUp() {
    this.drawingPoint = null
  }
}

Bu.DrawPointReactor = DrawPointReactor
