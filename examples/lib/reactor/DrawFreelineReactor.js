// drag to draw a freeline

class DrawFreelineReactor extends Bu.ReactorBase {
  constructor(bu, curvify = false) {
    super()
    this.bu = bu
    this.polyline = null

    this.curvify = curvify
    this.lineSplitThresh = 8

    this.mousePos = new Bu.Point()
    this.mouseDownPos = new Bu.Point()
  }

  onMouseDown(ev) {
    this.mouseDownPos.set(ev.offsetX, ev.offsetY)

    if (ev.buttons === Bu.MOUSE.LEFT) {
      this.polyline = new Bu.Polyline()
      this.polyline.style('line')
      this.bu.scene.addChild(this.polyline)
    }
  }

  onMouseMove(ev) {
    this.mousePos.set(ev.offsetX, ev.offsetY)
    if (ev.buttons === Bu.MOUSE.LEFT) {
      if (
        this.mousePos.distanceTo(this.mouseDownPos) > this.lineSplitThresh ||
        this.polyline.vertices.length < 2
      ) {
        this.polyline.addPoint(this.mousePos.clone())
        this.mouseDownPos.copy(this.mousePos)
      } else {
        this.polyline.vertices[this.polyline.vertices.length - 1].copy(
          this.mousePos,
        )
      }
    }
  }

  onMouseUp() {
    if (this.polyline != null) {
      this.polyline.style()

      if (this.curvify) {
        this.polyline.compress(0.5)
        const spline = new Bu.Spline(this.polyline)
        spline.smoothFactor = 0.1
        this.bu.scene.children[this.bu.scene.children.length - 1] = spline
      } else {
        this.polyline.compress(0.2)
      }

      this.polyline = null
    }
  }
}

Bu.DrawFreelineReactor = DrawFreelineReactor
