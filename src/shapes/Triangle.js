
var Geom2D = Geom2D || {};

Geom2D.Triangle = function (p1, p2, p3) {

    Geom2D.Colorful.apply(this);

    this.points = [p1, p2, p3];

    this.lines = [
        new Geom2D.Line(p1, p2),
        new Geom2D.Line(p2, p3),
        new Geom2D.Line(p3, p1),
    ];

    this.containsPoint = function(p) {
        return this.lines[0].isTwoPointsSameSide(p, this.points[2])
            && this.lines[1].isTwoPointsSameSide(p, this.points[0])
            && this.lines[2].isTwoPointsSameSide(p, this.points[1]);
    };
};
