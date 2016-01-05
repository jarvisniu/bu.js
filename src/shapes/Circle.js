
var Geom2D = Geom2D || {};

Geom2D.Circle = function(cx, cy, r) {

    Geom2D.Colorful.apply(this);

    this.type = "Circle";

    this.cx = cx;
    this.cy = cy;
    this.radius = r;

    this.centralPoint = new Geom2D.Point(cx, cy);

    // edit
    this.setCenter = function (point) {
        this.centralPoint.copy(point);
        this.cx = point.x;
        this.cy = point.y;
    };

    this.containsPoint = function(p) {
        var dx = p.x - this.cx,
            dy = p.y - this.cy;
        return Math.bevel(dx, dy) < this.radius;
    };
};
