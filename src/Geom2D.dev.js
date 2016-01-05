;(function() {

    var libs = [

        "Geom2D",

        "core/Size",
        "core/Colorful",

        "shapes/Point",
        "shapes/Line",
        "shapes/Circle",
        "shapes/Triangle",
        "shapes/Rectangle",
        "shapes/Fan",
        "shapes/Bow",
        "shapes/Polygon",
        "shapes/Polyline",

        "morph/PolylineMorph",

        "reactor/MovePointReactor",
        "reactor/DrawCircleReactor",
        "reactor/DrawCircleReactor2",

        "renderer/Renderer",
    ];

    for (var i in libs) {
        if (libs.hasOwnProperty(i))
            document.write('<script src="../../src/' + libs[i] + '.js"></script>');
    }

})();
