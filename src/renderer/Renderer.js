
var Geom2D = Geom2D || {};

Geom2D.Renderer = function(w, h) {

    Za.EventListenerPattern.apply(this);

    this.type = "Renderer";

    w = w || 800;
    h = h || 600;

    // constants
    var POINT_SIZE = 4;

    // variables
    var _self = this;
    var _dom = document.createElement("canvas");
    var _context;

    var fps = 60;
    var tickCount = 0;

    // API
    this.dom = _dom;
    this.width = w;
    this.height = h;
    this.shapes = [];

    this.append = function(shape) {
        _self.shapes.push(shape);
    };

    function init() {

        _dom.width = w;
        _dom.height = h;
        _dom.style.width = w + "px";
        _dom.style.height = h + "px";
        _dom.style.border = "solid 1px gray";
        _dom.style.cursor = "crosshair";
        _dom.style.background = "#eee";
        _dom.oncontextmenu = function() { return false; };

        _context = _dom.getContext("2d");
        //_context.textBaseline = 'top';

        setInterval(tick, 1000 / fps);
    }

    function tick() {
        tickCount ++;
        _self.triggerEvent("update", { "tickCount": tickCount } );
        render();
    }
    // render
    function clearCanvas() {
        _context.clearRect(0, 0, w, h);
    }

    function drawPoint(point) {

        if (point.fillStyle != null) {
            _context.fillStyle = point.fillStyle;
            _context.fillRect (
                point.x - POINT_SIZE / 2,
                point.y - POINT_SIZE / 2,
                POINT_SIZE,
                POINT_SIZE
            );
        }

        if (point.strokeStyle != null) {
            _context.strokeStyle = point.strokeStyle;
            _context.strokeRect (
                point.x - POINT_SIZE / 2,
                point.y - POINT_SIZE / 2,
                POINT_SIZE,
                POINT_SIZE
            );
        }

        if (point.label != null) {
            //console.log("drawPoint(): " + point.label + ", x: " + point.x + ", y: " + point.y);
            var style = _context.fillStyle;
            _context.fillStyle = "black";
            _context.fillText (
                point.label,
                point.x - POINT_SIZE / 2 + 9,
                point.y - POINT_SIZE / 2 + 6);
            _context.fillStyle = style;
        }
    }

    function drawPoints(points) {

        for(var i in points) {
            if (points.hasOwnProperty(i))
                drawPoint(points[i]);
        }
    }

    function drawLine(line) {

        if (line.strokeStyle != null) {
            _context.strokeStyle = line.strokeStyle;
            if (!line.dashStyle) {
                _context.beginPath();
                _context.lineTo(line.points[0].x, line.points[0].y);
                _context.lineTo(line.points[1].x, line.points[1].y);
                _context.closePath();

            } else {
                _context.dashedLine(
                    line.points[0].x, line.points[0].y,
                    line.points[1].x, line.points[1].y,
                    line.dashStyle
                );
            }
            _context.stroke();
        }

        drawPoints(line.points);
    }

    function drawCircle(circle) {

        _context.beginPath();
        _context.arc(circle.cx, circle.cy, circle.radius, 0, Math.PI * 2);
        _context.closePath();
        // TODO add dashed arc support

        if (circle.fillStyle != null) {
            _context.fillStyle = circle.fillStyle;
            _context.fill();
        }
        if (circle.strokeStyle != null) {
            _context.strokeStyle = circle.strokeStyle;
            _context.stroke();
        }

        drawPoint(circle.centralPoint);
    }

    function drawTriangle(triangle) {

        _context.beginPath();
        _context.lineTo(triangle.points[0].x, triangle.points[0].y);
        _context.lineTo(triangle.points[1].x, triangle.points[1].y);
        _context.lineTo(triangle.points[2].x, triangle.points[2].y);
        _context.closePath();

        if (triangle.fillStyle != null) {
            _context.fillStyle = triangle.fillStyle;
            _context.fill();
        }

        if (triangle.strokeStyle != null) {
            _context.strokeStyle = triangle.strokeStyle;
            if (triangle.dashStyle) {
                _context.beginPath();  // clear prev lineTo
                var pts = triangle.points;
                _context.dashedLine(pts[0].x, pts[0].y, pts[1].x, pts[1].y, triangle.dashStyle);
                _context.dashedLine(pts[1].x, pts[1].y, pts[2].x, pts[2].y, triangle.dashStyle);
                _context.dashedLine(pts[2].x, pts[2].y, pts[0].x, pts[0].y, triangle.dashStyle);

            }
            _context.stroke();
        }

        drawPoints(triangle.points);
    }

    function drawRectangle(rectangle) {

        if (rectangle.fillStyle != null) {
            _context.fillStyle = rectangle.fillStyle;
            _context.fillRect (
                rectangle.position.x,
                rectangle.position.y,
                rectangle.size.width,
                rectangle.size.height
            );
        }

        if (rectangle.strokeStyle != null) {
            _context.strokeStyle = rectangle.strokeStyle;
            if (!triangle.dashStyle) {
                _context.strokeRect (
                    rectangle.position.x,
                    rectangle.position.y,
                    rectangle.size.width,
                    rectangle.size.height
                );
            } else {
                _context.beginPath();
                var pt1 = rectangle.position;
                var pt3 = rectangle.rightBottomPoint;
                _context.dashedLine(pt1.x, pt1.y, pt3.x, pt1.y, rectangle.dashStyle);
                _context.dashedLine(pt3.x, pt1.y, pt3.x, pt3.y, rectangle.dashStyle);
                _context.dashedLine(pt3.x, pt3.y, pt1.x, pt3.y, rectangle.dashStyle);
                _context.dashedLine(pt1.x, pt3.y, pt1.x, pt1.y, rectangle.dashStyle);
                _context.stroke();
            }
        }

        drawPoints(rectangle.points);
    }

    function drawFan(fan) {

        _context.beginPath();
        _context.arc(fan.cx, fan.cy, fan.radius, fan.aFrom, fan.aTo);
        _context.lineTo(fan.cx, fan.cy);
        _context.closePath();
        // TODO dashed arc

        if (fan.fillStyle != null) {
            _context.fillStyle = fan.fillStyle;
            _context.fill();
        }
        if (fan.strokeStyle != null) {
            _context.strokeStyle = fan.strokeStyle;
            _context.stroke();
        }

        drawPoints(fan.string.points);
    }

    function drawBow(bow) {

        _context.beginPath();
        _context.arc(bow.cx, bow.cy, bow.radius, bow.aFrom, bow.aTo);
        _context.closePath();
        // TODO dashed arc

        if (bow.fillStyle != null) {
            _context.fillStyle = bow.fillStyle;
            _context.fill();
        }
        if (bow.strokeStyle != null) {
            _context.strokeStyle = bow.strokeStyle;
            _context.stroke();
        }

        drawPoints(bow.string.points);
    }

    function drawPolygon(polygon) {

        _context.beginPath();
        for (var i = 0; i < polygon.points.length; i ++ ) {
            _context.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
        _context.closePath();

        if (polygon.fillStyle != null) {
            _context.fillStyle = polygon.fillStyle;
            _context.fill();
        }
        if (polygon.strokeStyle != null) {
            _context.strokeStyle = polygon.strokeStyle;

            if (triangle.dashStyle) {
                _context.beginPath();
                var pts = polygon.points;
                var len = polygon.points.length;
                for (i = 0; i < len - 1; i ++ ) {
                    _context.dashedLine(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, polygon.dashStyle);
                }
                _context.dashedLine(pts[len - 1].x, pts[len - 1].y, pts[0].x, pts[0].y, polygon.dashStyle);

                _context.stroke();
            }
            _context.stroke();
        }

        drawPoints(polygon.points);
    }

    function drawPolyline(polyline) {

        if (polyline.strokeStyle != null) {
            _context.strokeStyle = polyline.strokeStyle;
            _context.beginPath();
            if (!polyline.dashStyle) {
                for (var i = 0; i < polyline.points.length; i++) {
                    _context.lineTo(polyline.points[i].x, polyline.points[i].y);
                }
            } else {
                var pts = polyline.points;
                for (i = 0; i < pts.length - 1; i ++ ) {
                    _context.dashedLine(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, polyline.dashStyle);
                }
            }
            _context.stroke();
        }

        drawPoints(polyline.points);
    }

    function drawShapes() {
        for (var i = 0; i < _self.shapes.length; i++) {
            var shape = _self.shapes[i];

            // draw shape
            if (shape.type == "Point") {
                drawPoint(shape);
            } else if (shape.type == "Line") {
                drawLine(shape);
            } else if (shape.type == "Circle") {
                drawCircle(shape);
            } else if (shape.type == "Triangle") {
                drawTriangle(shape);
            } else if (shape.type == "Rectangle") {
                drawRectangle(shape);
            } else if (shape.type == "Fan") {
                drawFan(shape);
            } else if (shape.type == "Bow") {
                drawBow(shape);
            } else if (shape.type == "Polygon") {
                drawPolygon(shape);
            } else if (shape.type == "Polyline") {
                drawPolyline(shape);
            } else {
                console.log("drawShapes(): unknown shape: ", shape);
            }
        }
    }

    function render() {
        clearCanvas();
        drawShapes();
    }

    init();

};

// add draw dashed line feature to the canvas rendering context
// See: http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
(function(){
    var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (CP.lineTo) {
        CP.dashedLine = function(x, y, x2, y2, da) {
            if (!da) da = Geom2D.Colorful.DEFAULT_DASH_STYLE;
            this.save();
            var dx = x2 - x, dy = y2 - y;
            var len = Math.bevel(dx, dy);
            var rot = Math.atan2(dy, dx);
            this.translate(x, y);
            this.moveTo(0, 0);
            this.rotate(rot);
            var dc = da.length;
            var di = 0, draw = true;
            x = 0;
            while (len > x) {
                x += da[di++ % dc];
                if (x > len) x = len;
                draw ? this.lineTo(x, 0): this.moveTo(x, 0);
                draw = !draw;
            }
            this.restore();
            return this;
        }
    }
})();
