
var Geom2D = Geom2D || {};

Geom2D.Polyline = function (points) {

    Geom2D.Colorful.apply(this);

    var _self = this;
    var pointNormalizedPos = [];

    points = points || [];
    this.points = points;
    this.lines = [];

    this.length = 0;

    function init() {

        updateLines();

        if (_self.points.length > 1) {
            calcLength();
            calcPointNormalizedPos();
        }

    }

    this.set = function(points) {

        // points
        for (var i = 0; i < points.length; i++) {
                _self.points[i] = points[i];
        }

        // remove the extra points
        if (_self.points.length > points.length)
            _self.points.splice(_self.points.length);

        // do the calculations
        calcLength();
        calcPointNormalizedPos();

    };

    this.getNormalizedPos = function (index) {

        if(index !== undefined)
            return pointNormalizedPos[index];
        else
            return pointNormalizedPos;

    };

    function updateLines() {
        if (_self.points.length < 2) return;
        for ( var i = 0; i < _self.points.length - 1; i++ ) {
            if (_self.lines[i])
                _self.lines[i].set(_self.points[i], _self.points[i + 1]);
            else
                _self.lines.push(new Geom2D.Line( _self.points[i], _self.points[i + 1] ));
        }
    }

    function calcLength() {

        if (_self.points.length < 2) {
            _self.length = 0;
        } else {
            var len = 0;
            for (var i = 0; i < _self.points.length - 1; i ++) {
                len += _self.points[i].distanceTo(_self.points[i + 1]);
            }
            _self.length = len;
        }
        // console.log("Polyline length = " + len);
    }

    function calcPointNormalizedPos() {

        var currPos = 0;
        pointNormalizedPos[0] = 0;

        for (var i = 1; i < _self.points.length; i ++) {
            currPos += _self.points[i].distanceTo(_self.points[i - 1]) / _self.length;
            pointNormalizedPos[i] = currPos;
        }

    }

    // edit
    this.addPoint = function(point, insertIndex) {
        if (insertIndex === undefined) {
            // add point
            _self.points.push(point);
            // add line
            if (_self.points.length > 1)
                _self.lines.push(new Geom2D.Line( _self.points[_self.points.length - 2], _self.points[_self.points.length - 1] ));
        } else {
            _self.points.splice(insertIndex, 0, point);
            // TODO add lines
        }
        calcLength();
        calcPointNormalizedPos();
    };

    init();
};
