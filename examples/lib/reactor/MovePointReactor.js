// move a point by dragging it

class MovePointReactor extends Bu.ReactorBase {
  constructor(bu) {
    super()
    this.bu = bu

    this.hoveredPoint = null

    this.mousePos = new Bu.Point()
    this.mousePosDown = new Bu.Vector()
    this.mousePosDownDelta = new Bu.Vector()
  }

  // record the delta
  onMouseDown(ev) {
    this.mousePosDown.set(ev.offsetX, ev.offsetY)

    if (this.hoveredPoint != null) {
      this.mousePosDownDelta.set(
        this.mousePosDown.x - this.hoveredPoint.x,
        this.mousePosDown.y - this.hoveredPoint.y,
      )
    }
  }

  // change x, y
  onMouseMove(ev) {
    this.mousePos.set(ev.offsetX, ev.offsetY)
    if (ev.buttons === Bu.MOUSE.LEFT) {
      if (this.hoveredPoint != null) {
        this.hoveredPoint.set(
          this.mousePos.x - this.mousePosDownDelta.x,
          this.mousePos.y - this.mousePosDownDelta.y,
        )
      }
    } else {
      if (this.hoveredPoint != null) {
        if (!this.hoveredPoint.isNear(this.mousePos)) {
          this.hoveredPoint.lineWidth = 0.5
          this.hoveredPoint.fill()
          this.hoveredPoint = null
        }
      } else {
        for (let shape of this.bu.scene.children) {
          if (shape.type === 'Point' && shape.isNear(this.mousePos)) {
            this.hoveredPoint = shape
            this.hoveredPoint.lineWidth = 1
            this.hoveredPoint.fill('#f80')
            break
          }
        }
      }
    }
  }
}

Bu.MovePointReactor = MovePointReactor
