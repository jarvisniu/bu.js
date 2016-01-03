
var Geom2D = Geom2D || {};

Geom2D.Circle = function(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.radius = r;

    this.centralPoint = new Geom2D.Point(cx, cy);

    this.containsPoint = function(p) {
        var dx = p.x - this.cx,
            dy = p.y - this.cy;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    };
};
