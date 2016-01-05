
var Geom2D = Geom2D || {};

Geom2D.Point = function (x, y) {

    Geom2D.Colorful.apply(this);
    this.stroke(false);  // point has no stroke by default

    this.type = "Point";

    this.x = x || 0;
    this.y = y || 0;
    this.label = null;

    this.arcTo = function(r, arc) {
        return new Geom2D.Point(
            this.x + Math.cos(arc) * r,
            this.y + Math.sin(arc) * r)
    };

    this.clone = function() {
        return new Geom2D.Point(this.x, this.y);
    };

    // copy value from other line
    this.copy = function (point) {
        this.x = point.x;
        this.y = point.y;
        this.label = point.label;
    };

    // set value from x, y
    this.set = function (x, y) {
        this.x = x;
        this.y = y;
    };

    // relation with point
    this.distanceTo = function (point) {
        return Math.bevel(this.x - point.x, this.y - point.y);
    };

    this.isNear = function (target, dist) {
        dist = dist || Geom2D.DEFAULT_NEAR_DIST;
        if (target.type == "Point") {
            return this.distanceTo(target) < dist;
        } else if (target.type == "Line") {
            // TODO is this point near a line
        }
    };
};

Geom2D.Point.interpolate = function(p1, p2, k, p3) {

    var x = p1.x + (p2.x - p1.x) * k;
    var y = p1.y + (p2.y - p1.y) * k;

    if (p3) {
        p3.set(x, y);
    } else {
        return new Geom2D.Point(x, y);
    }
};
