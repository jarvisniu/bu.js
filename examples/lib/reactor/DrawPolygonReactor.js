// left click to add point to polygon
// right click to finish the current polygon
// TODO:
// 1. Drag out new point from each edge's center point;
// 2. Select a vertex and delete it;

class DrawPolygonReactor extends Bu.ReactorBase {
  constructor(bu) {
    super()
    this.bu = bu
    this.polygon = null

    this.mousePos = new Bu.Point()
    this.mouseDownPos = new Bu.Vector()
    this.guideLineEnd = null
    this.guideLineStart = null
  }

  onMouseDown(ev) {
    this.mouseDownPos.set(ev.offsetX, ev.offsetY)

    if (ev.buttons === Bu.MOUSE.LEFT) {
      if (this.polygon == null) {
        this.polygon = new Bu.Polygon()
        this.polygon.style('selected')
        this.bu.scene.addChild(this.polygon)
      }

      if (this.guideLineEnd == null) {
        this.guideLineEnd = new Bu.Line(this.mousePos, this.mousePos)
        this.guideLineEnd.style('dash')
        this.bu.scene.addChild(this.guideLineEnd)

        this.guideLineStart = new Bu.Line(this.mousePos, this.mousePos)
        this.guideLineStart.style('dash')
        this.bu.scene.addChild(this.guideLineStart)
      } else if (this.guideLineEnd.visible === false) {
        this.guideLineEnd.setPoint1(this.mousePos)
        this.guideLineEnd.setPoint2(this.mousePos)
        this.guideLineEnd.visible = true

        this.guideLineStart.setPoint1(this.mousePos)
        this.guideLineStart.setPoint2(this.mousePos)
        this.guideLineStart.visible = true
      }

      this.guideLineEnd.setPoint1(this.guideLineEnd.points[1])
      this.polygon.addPoint(this.mousePos.clone())
    } else if (ev.buttons === Bu.MOUSE.RIGHT) {
      this.polygon.style()
      this.polygon = null
      this.guideLineEnd.visible = false
      this.guideLineStart.visible = false
    }
  }

  onMouseMove(ev) {
    this.mousePos.set(ev.offsetX, ev.offsetY)
    if (ev.buttons === Bu.MOUSE.NONE && this.polygon != null) {
      if (this.polygon.containsPoint(this.mousePos)) {
        this.polygon.fill('hover')
      } else {
        this.polygon.fill('selected')
      }
    }

    if (this.polygon) {
      this.guideLineEnd.setPoint2(this.mousePos)
      this.guideLineStart.setPoint2(this.mousePos)
    }
  }

  onMouseUp(ev) {
    if (this.polygon != null) {
      this.guideLineEnd.setPoint2(this.guideLineEnd.points[0])
      this.guideLineEnd.setPoint1(this.mousePos)

      const points = this.polygon.vertices
      const len = this.mousePos.distanceTo(points[points.length - 1])
      if (len > Bu.POINT_RENDER_SIZE) {
        this.polygon.addPoint(this.mousePos.clone())
      }
    }
  }
}

Bu.DrawPolygonReactor = DrawPolygonReactor
