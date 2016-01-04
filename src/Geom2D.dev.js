;(function() {
    var libs = [

        "Geom2D",

        "shapes/Point",
        "shapes/Line",
        "shapes/Circle",
        "shapes/Triangle",
        "shapes/Fan",
        "shapes/Bow",
        "shapes/Polygon",
        "shapes/Polyline",

        "renderer/Renderer",
    ];

    for (var i in libs) {
        if (libs.hasOwnProperty(i))
            document.write('<script src="../../src/' + libs[i] + '.js"></script>');
    }
})();
