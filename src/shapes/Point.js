
var Geom2D = Geom2D || {};

Geom2D.Point = function (x, y) {
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
};
