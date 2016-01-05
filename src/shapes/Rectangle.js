
var Geom2D = Geom2D || {};

Geom2D.Rectangle = function (x, y, width, height) {

    Geom2D.Colorful.apply(this);

    this.type = "Rectangle";

    this.position = new Geom2D.Point(x, y);
    this.size = new Geom2D.Size(width, height);
    this.rightBottomPoint = new Geom2D.Point(x + width, y + height);

    this.points = [this.position, this.rightBottomPoint];

    this.containsPoint = function(point) {
        return point.x > this.position.x
            && point.y > this.position.y
            && point.x < this.position.x + this.size.width
            && point.y < this.position.y + this.size.height;
    };
};
