
var Geom2D = Geom2D || {};

Geom2D.Bow = function(cx, cy, r, aFrom, aTo) {

    Geom2D.Colorful.apply(this);

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

    this.containsPoint = function(p) {
        var dx = p.x - cx,
            dy = p.y - cy;
        if ( Math.sqrt(dx * dx + dy * dy) < r) {
            var sameSide = this.string.isTwoPointsSameSide(this.centralPoint, p);
            var smallThanHalfCircle = aTo - aFrom < Math.PI;
            return sameSide ^ smallThanHalfCircle;
        } else {
            return false;
        }
    };
};
