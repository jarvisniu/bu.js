
var Geom2D = {
    version: "0.0.1"
};

// math extension
Math.bevel = Math.bevel || function(x, y) {
    return Math.sqrt(x * x + y * y);
};

Math.round1 = Math.round1 || function(n) {
    return Math.floor(n * 10) / 10;
};

Math.round2 = Math.round2 || function(n) {
    return Math.floor(n * 100) / 100;
};

Math.round3 = Math.round3 || function(n) {
    return Math.floor(n * 1000) / 1000;
};

Math.round4 = Math.round4 || function(n) {
    return Math.floor(n * 10000) / 10000;
};
