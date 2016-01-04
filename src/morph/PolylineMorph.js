
var Geom2D = Geom2D || {};

Geom2D.PolylineMorph = function (lineA, lineB) {

    // variables
    var _self = this;
	var polylineA = lineA;
    var polylineB = lineB;

	var hPointsA = [], hPointsB = [];

    // API
    this.polyline = new Geom2D.Polyline();

    this.update = function() {
        harmonize();
    };

	this.setTime = function(time) {
		for (var i = 0; i < hPointsA.length; i++)
            Geom2D.Point.interpolate(hPointsA[i], hPointsB[i], time, _self.polyline.points[i]);
	};

    // functions
    function init() {
        harmonize();
    }

	function harmonize() {
		hPointsA.clear();
		hPointsB.clear();

		var pointsA = polylineA.points;
		var pointsB = polylineB.points;

		var indexA = 0, indexB = 0;  // pointer

		while (indexA < pointsA.length && indexB < pointsB.length) {
            var posA = polylineA.getNormalizedPos(indexA);
            var posB = polylineB.getNormalizedPos(indexB);
            var posAPrev = polylineA.getNormalizedPos(indexA - 1);
            var posBPrev = polylineB.getNormalizedPos(indexB - 1);

			if (posA == posB) {

				hPointsA.push(pointsA[indexA]);
				hPointsB.push(pointsB[indexB]);

				indexA ++;
				indexB ++;

			} else if (posA < posB) {

				var secPosB = (posA - posBPrev) / (posB - posBPrev);
				hPointsB.push(Geom2D.Point.interpolate(pointsB[indexB - 1], pointsB[indexB], secPosB));
				hPointsA.push(pointsA[indexA]);
				indexA ++;

			} else {

				var secPosA = (posB - posAPrev) / (posA - posAPrev);
				hPointsA.push(Geom2D.Point.interpolate(pointsA[indexA - 1], pointsA[indexA], secPosA));
				hPointsB.push(pointsB[indexB]);
				indexB ++;
			}
		}

		if(hPointsA.length != hPointsB.length)
			console.warn("hPointsA.length != hPointsB.length");

		for (var i = 0; i < hPointsA.length; i++) {
            if (_self.polyline.points[i])
                _self.polyline.points[i].set(hPointsA[i].x, hPointsA[i].y);
            else
                _self.polyline.points[i] = new Geom2D.Point(hPointsA[i].x, hPointsA[i].y);
        }

        if (hPointsA.length > _self.polyline.points.length)
            _self.polyline.points.splice(hPointsA.length);
	}

    init();
}
