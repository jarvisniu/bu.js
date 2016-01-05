
var Geom2D = Geom2D || {};

Geom2D.Renderer = function(w, h) {

    Za.EventListenerPattern.apply(this);

    w = w || 800;
    h = h || 450;

    // constants
    var POINT_SIZE = 2;

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
                point.x - POINT_SIZE / 2 + 6,
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

        _context.beginPath();
        _context.lineTo(line.points[0].x, line.points[0].y);
        _context.lineTo(line.points[1].x, line.points[1].y);
        _context.closePath();

        if (line.strokeStyle != null) {
            _context.strokeStyle = line.strokeStyle;
            _context.stroke();
        }

        drawPoints(line.points);
    }

    function drawCircle(circle) {

        _context.beginPath();
        _context.arc(circle.cx, circle.cy, circle.radius, 0, Math.PI * 2);
        _context.closePath();

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
            _context.stroke();
        }

        drawPoints(triangle.points);
    }

    function drawFan(fan) {

        _context.beginPath();
        _context.arc(fan.cx, fan.cy, fan.radius, fan.aFrom, fan.aTo);
        _context.lineTo(fan.cx, fan.cy);
        _context.closePath();

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
            _context.stroke();
        }

        drawPoints(polygon.points);
    }

    function drawPolyline(polyline) {

        _context.beginPath();
        for (var i = 0; i < polyline.points.length; i ++ ) {
            _context.lineTo(polyline.points[i].x, polyline.points[i].y);
        }

        if (polyline.strokeStyle != null) {
            _context.strokeStyle = polyline.strokeStyle;
            _context.stroke();
        }

        drawPoints(polyline.points);
    }

    function drawShapes() {
        for (var i = 0; i < _self.shapes.length; i++) {
            var shape = _self.shapes[i];

            // draw shape
            if (shape instanceof Geom2D.Point) {
                drawPoint(shape);
            } else if (shape instanceof Geom2D.Line) {
                drawLine(shape);
            } else if (shape instanceof Geom2D.Circle) {
                drawCircle(shape);
            } else if (shape instanceof Geom2D.Triangle) {
                drawTriangle(shape);
            } else if (shape instanceof Geom2D.Fan) {
                drawFan(shape);
            } else if (shape instanceof Geom2D.Bow) {
                drawBow(shape);
            } else if (shape instanceof Geom2D.Polygon) {
                drawPolygon(shape);
            } else if (shape instanceof Geom2D.Polyline) {
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
