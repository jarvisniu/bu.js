
var libs = [

    "Geom2D",

    "shapes/Point",
    "shapes/Line",
    "shapes/Circle",
    "shapes/Triangle",
    "shapes/Fan",
    "shapes/Bow",
    "shapes/Polygon",

    "renderer/Renderer",
];

for (var i in libs) {
    document.write('<script src="../../src/' + libs[i] + '.js"></script>');
}
