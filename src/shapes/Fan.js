
var Geom2D = Geom2D || {};

Geom2D.Fan = function(cx, cy, r, aFrom, aTo) {

    Geom2D.Colorful.apply(this);

    this.type = "Fan";

    this.cx = cx;
    this.cy = cy;
    this.radius = r;
    this.aFrom = aFrom;
    this.aTo = aTo;

    this.centralPoint = new Geom2D.Point(cx, cy);

    var stringPoints = [
        this.centralPoint.arcTo(r, aFrom),
        this.centralPoint.arcTo(r, aTo),
    ];
    this.string = new Geom2D.Line(stringPoints[0], stringPoints[1]);

    this.containsPoint = function(point) {
        var dx = point.x - this.cx,
            dy = point.y - this.cy;
        var a = Math.atan2(point.y - this.cy, point.x - this.cx);
        while (a < aFrom) a += Math.PI * 2;
        return  Math.sqrt(dx * dx + dy * dy) < r && a > aFrom && a < aTo;
    };
};
