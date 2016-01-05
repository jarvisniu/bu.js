/**
 * Add color to the shapes.
 */

var Geom2D = Geom2D || {};

Geom2D.Colorful = function() {

    this.strokeStyle = Geom2D.Colorful.DEFAULT_STROKE_STYLE;
    this.fillStyle = Geom2D.Colorful.DEFAULT_FILL_STYLE;

    this.stroke = function(v) {
        if (v === false)
            this.strokeStyle = null;
        else if (v === true || v === undefined)
            this.strokeStyle = Geom2D.Colorful.DEFAULT_STROKE_STYLE;
        else
            this.strokeStyle = v;
    };

    this.fill = function(v) {
        if (v === false)
            this.fillStyle = null;
        else if (v === true || v === undefined)
            this.fillStyle = Geom2D.Colorful.DEFAULT_FILL_STYLE;
        else
            this.fillStyle = v;
    };

};

Geom2D.Colorful.DEFAULT_STROKE_STYLE = "#048";
Geom2D.Colorful.DEFAULT_FILL_STYLE = "rgba(64, 128, 192, 0.5)";
Geom2D.Colorful.DEFAULT_FILL_STYLE_HOVER = "rgba(255, 192, 0, 0.5)";
