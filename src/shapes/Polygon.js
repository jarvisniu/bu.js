
var Geom2D = Geom2D || {};

Geom2D.Polygon = function (points) {

    Geom2D.Colorful.apply(this);

    points = points || [];

    this.type = "Polygon";

    var _self = this;

    this.points = points;
    this.lines = [];
    this.triangles = [];

    function init() {
        // init lines
        if (points.length > 1) {
            for ( var i = 0; i < _self.points.length - 1; i++ )
                _self.lines.push(new Geom2D.Line( points[i], points[i + 1] ));
            _self.lines.push( new Geom2D.Line( points[points.length - 1], points[0] ));
        }

        // init triangles
        if (points.length > 2) {
            for (var i = 2; i < _self.points.length; i++) {
                _self.triangles.push(new Geom2D.Triangle(_self.points[0], _self.points[i - 1], _self.points[i]));
            }
        }
    }

    // edit
    this.addPoint = function(point, insertIndex) {
        if (insertIndex === undefined) {
            // add point
            this.points.push(point);
            // add line
            if (points.length > 2)
                this.lines[this.lines.length - 1].points[1] = point;
            if (points.length > 1)
                this.lines.push(new Geom2D.Line( points[points.length - 1], points[0] ));

            // add triangle
            if (points.length > 2)
                _self.triangles.push(new Geom2D.Triangle(
                    _self.points[0],
                    _self.points[points.length - 2],
                    _self.points[points.length - 1]
                ));
        } else {
            this.points.splice(insertIndex, 0, point);
            // TODO add lines and triangles
        }
    };

    // with point
    this.containsPoint = function(p) {
        for ( var i = 0; i < this.triangles.length; i++ ) {
            if (this.triangles[i].containsPoint(p))
                return true;
        }
        return false;
    };

    init();
};
