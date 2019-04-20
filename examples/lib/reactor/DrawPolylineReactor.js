// left click to add point to polyline
// right click to finish the current polyline

class DrawPolylineReactor extends Bu.ReactorBase {
  constructor(bu) {
    super()
    this.bu = bu
    this.polyline = null
    this.line = null

    this.mousePos = new Bu.Point()
    this.mouseDownPos = new Bu.Vector()
  }

  onMouseDown(ev) {
    this.mouseDownPos.set(ev.offsetX, ev.offsetY)

    if (ev.buttons === Bu.MOUSE.LEFT) {
      if (this.polyline == null) {
        this.polyline = new Bu.Polyline()
        this.polyline.style('selected')
        this.bu.scene.addChild(this.polyline)
      }

      if (this.line == null) {
        this.line = new Bu.Line(this.mousePos, this.mousePos)
        this.line.style('dash')
        this.bu.scene.addChild(this.line)
      } else if (this.line.visible === false) {
        this.line.setPoint1(this.mousePos)
        this.line.setPoint2(this.mousePos)
        this.line.visible = true
      }

      this.line.setPoint1(this.line.points[1])
      this.polyline.addPoint(this.mousePos.clone())
    } else if (ev.buttons === Bu.MOUSE.RIGHT) {
      this.polyline.style()
      this.polyline = null
      this.line.visible = false
    }
  }

  onMouseMove(ev) {
    this.mousePos.set(ev.offsetX, ev.offsetY)
    if (this.polyline != null) {
      this.line.setPoint2(this.mousePos)
    }
  }

  onMouseUp() {
    if (this.polyline != null) {
      this.line.setPoint2(this.line.points[0])
      this.line.setPoint1(this.mousePos)
      const points = this.polyline.vertices
      const len = this.mousePos.distanceTo(points[points.length - 1])
      if (len > Bu.POINT_RENDER_SIZE) {
        this.polyline.addPoint(this.mousePos.clone())
      }
    }
  }
}

Bu.DrawPolylineReactor = DrawPolylineReactor
