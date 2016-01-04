
var Geom2D = Geom2D || {};

Geom2D.Polyline = function (points) {

    var _self = this;
    var pointNormalizedPos = {};

    this.points = points;
    this.lines = [];

    this.length = 0;

    function init() {
        // init lines
        if (points.length > 1) {
            for ( var i = 0; i < _self.points.length - 1; i++ )
                _self.lines.push(new Geom2D.Line( points[i], points[i + 1] ));
            calcLength();
            calcPointNormalizedPos();
        }
    }

    function calcLength() {

        if (points.length < 2) {
            _self.length = 0;
        } else {
            var len = 0;
            for (var i = 0; i < points.length - 1; i ++) {
                len += points[i].distanceTo(points[i + 1]);
            }
            _self.length = len;
        }
        // console.log("Polyline length = " + len);
    }

    function calcPointNormalizedPos() {

        var currPos = 0;
        pointNormalizedPos[points[0]] = 0;

        for (var i = 1; i < points.length; i ++) {
            currPos += points[i].distanceTo(points[i - 1]) / _self.length;
            pointNormalizedPos[points[i]] = currPos;
        }

    }

    // edit
    this.addPoint = function(point, insertIndex) {
        if (insertIndex === undefined) {
            // add point
            this.points.push(point);
            // add line
            if (points.length > 1)
                this.lines.push(new Geom2D.Line( points[points.length - 2], points[points.length - 1] ));
        } else {
            this.points.splice(insertIndex, 0, point);
            // TODO add lines
        }
        calcLength();
        calcPointNormalizedPos();
    };

    init();
};
