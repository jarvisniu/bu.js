/**
 * Move a Point by dragging it.
 */

var Geom2D = Geom2D || {};

Geom2D.MovePointReactor = function(renderer) {

    // variables
    var buttonDown = false;
    var mousePos = new Geom2D.Point();
    var mousePosDown = new Geom2D.Point();
    var mousePosDownDelta = new Geom2D.Point();

    var hoveredPoint;

    // API
    this.enabled = false;

    this.enable = function () {
        addListeners();
        this.enabled = true;
    };

    this.disable = function () {
        removeListeners();
        this.enabled = false;
    };

    // functions
    function addListeners() {
        renderer.dom.addEventListener("mousedown", onMouseDown);
        renderer.dom.addEventListener("mousemove", onMouseMove);
        renderer.dom.addEventListener("mouseup", onMouseUp);
    }

    function removeListeners() {
        renderer.dom.removeEventListener("mousedown", onMouseDown);
        renderer.dom.removeEventListener("mousemove", onMouseMove);
        renderer.dom.removeEventListener("mouseup", onMouseUp);
    }

    function onMouseDown(e) {
        // add
        mousePosDown.set(e.offsetX, e.offsetY);
        if (hoveredPoint != null) {
            mousePosDownDelta.set(
                mousePosDown.x - hoveredPoint.x,
                mousePosDown.y - hoveredPoint.y
            );
        }

        buttonDown = true;
    }

    function onMouseMove(e) {

        mousePos.set(e.offsetX, e.offsetY);

        if (buttonDown) {
            hoveredPoint.set(
                mousePos.x - mousePosDownDelta.x,
                mousePos.y - mousePosDownDelta.y
            );
        } else {
            if ( hoveredPoint != null ) {
                if(!hoveredPoint.isNear(mousePos)) {
                    hoveredPoint.stroke(false);
                    hoveredPoint = null;
                }
            } else {
                var shapes = renderer.shapes;
                for(var i = 0; i < renderer.shapes.length; i++) {

                    if (shapes[i].type == "Point" && shapes[i].isNear(mousePos)) {
                        hoveredPoint = shapes[i];
                        hoveredPoint.stroke();
                    }
                }
            }
        }
    }

    function onMouseUp(e) {
        buttonDown = false;
    }
};