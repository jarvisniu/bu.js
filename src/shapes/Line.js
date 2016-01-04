
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
    //this.midpoint = new Geom2D.Point();

    // edit
    this.set = function (p1, p2) {
        _self.points[0].copy(p1);
        _self.points[1].copy(p2);
    };

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

    // 这个是自己推导的
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

    // 求与另一条直线求交点
    //this.getCrossPointWith = function(line) {
    //    return new Geom2D.Point();
    //};

    // whether cross with another line
    this.isCrossWithLine = function (line) {

        var x1 = this.points[0].x, y1 = this.points[0].y,
            x2 = this.points[1].x, y2 = this.points[1].y,
            x3 = line.points[0].x, y3 = line.points[0].y,
            x4 = line.points[1].x, y4 = line.points[1].y;
        var d = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1);
        if (d == 0) {
            return false;
        } else {
            var x0 = ((x2 - x1) * (x4 - x3) * (y3 - y1) + (y2 - y1) * (x4 - x3) * x1 - (y4 - y3) * (x2 - x1) * x3) / d;
            var y0 = ((y2 - y1) * (y4 - y3) * (x3 - x1) + (x2 - x1) * (y4 - y3) * y1 - (x4 - x3) * (y2 - y1) * y3) / -d;
            x0 = Math.round4(x0); y0 = Math.round4(y0);
            x1 = Math.round4(x1); y1 = Math.round4(y1);
            x2 = Math.round4(x2); y2 = Math.round4(y2);
            x3 = Math.round4(x3); y3 = Math.round4(y3);
            x4 = Math.round4(x4); y4 = Math.round4(y4);
            return (x0 - x1) * (x0 - x2) < 0 &&
                (x0 - x3) * (x0 - x4) < 0 &&
                (y0 - y1) * (y0 - y2) < 0 &&
                (y0 - y3) * (y0 - y4) < 0 ;
        }
    }
};
