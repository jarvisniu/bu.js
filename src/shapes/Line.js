
var Geom2D = Geom2D || {};

Geom2D.Line = function (p1, p2) {

    if (arguments.length == 4) {
        p1 = new Geom2D.Point(arguments[0], arguments[1]);
        p2 = new Geom2D.Point(arguments[2], arguments[3]);
    } else if (arguments.length == 0) {
        p1 = new Geom2D.Point();
        p2 = new Geom2D.Point();
    }

    var _self = this;
    var dX = p2.x - p1.x,
        dY = p2.y - p1.y;

    this.points = [p1, p2];  // TODO need clone?
    this.length = Math.sqrt( dX * dX + dY * dY );
    this.midpoint = new Geom2D.Point();

    // with point
    this.isTwoPointsSameSide = function(p1, p2) {

        var pA = this.points[0],
            pB = this.points[1];

        var x1 = p1.x, y1 = p1.y,
            x2 = p2.x, y2 = p2.y,
            xA = pA.x, yA = pA.y,
            xB = pB.x, yB = pB.y;

        if (xA == xB) {
            // if both of the two points are on the line then we consider they are in the same side
            return (x1 - xA) * (x2 - xA) > 0;
        } else {
            var x01 = x1;
            var x02 = x2;
            var y01 = (yA - yB) * (x01 - xA) / (xA - xB) + yA;
            var y02 = (yA - yB) * (x02 - xA) / (xA - xB) + yA;

            return (y1 - y01) * (y2 - y02) > 0;
        }
    };

    this.distanceTo = function(point) {
        var p1 = _self.points[0];
        var p2 = _self.points[1];
        var a = (p1.y - p2.y) / (p1.x - p2.x);
        var b = p1.y - a * p1.x;
        return Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1);
    };

    this.distanceTo2 = function(point) {
        var p1 = _self.points[0];
        var p2 = _self.points[1];
        var a = (p1.y - p2.y) / (p1.x - p2.x);
        var b = p1.y - (p1.y - p2.y) * p1.x / (p1.x - p2.x);
        var czX = (point.y + point.x / a - b) / (a + 1 / a);
        var czY = a * czX + b;
        return Math.bevel(czX - point.x, czY - point.y);
    };

    // get foot point from a point 计算垂足点
    // save to footPoint or create a new point
    this.footPointFrom = function(point, footPoint) {
        var p1 = this.points[0],
            p2 = this.points[1];
        var A = (p1.y - p2.y) / (p1.x - p2.x);
        var B = (p1.y - A * p1.x);
        var m = point.x + A * point.y;
        var x = (m - A * B) / (A * A + 1);
        var y = A * x + B;

        if (footPoint != null)
            footPoint.set(x, y);
        else
            return new Geom2D.Point(x, y);
    };

    // with line
    //this.crossPointWith = function(line) {
    //    return new Geom2D.Point();
    //};
};
