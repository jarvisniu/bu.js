function PolylineMorpher(lineA, lineB) {

	var polylineA, polylineB;

	var hPointsA, hPointsB;
	var hPointsC;

	polylineA = lineA;
	polylineB = lineB;

	this.length = 0;
	this.position = 0;

	harmonize();

	this.getHarmonizedPointsA = function() {

		return hPointsA;

	};

	this.getHarmonizedPointsB = function() {

		return hPointsB;

	};

	this.getHarmonizedPointsC = function() {

		return hPointsC;

	};

	this.setPos = function(p) {

		this.position = p;

		for (var i = 0; i < hPointsA.length; i++) {

			interplatePoint(hPointsA[i], hPointsB[i], p, hPointsC[i]);
			
		}

	};

	function harmonize() {

		hPointsA = [];
		hPointsB = [];

		var pointsA = polylineA.getPoints();
		var pointsB = polylineB.getPoints();

		hPointsA.push(pointsA[0]);
		hPointsB.push(pointsB[0]);

		var pA = pB = 1;  // pointer

		while (pA < pointsA.length && pB < pointsB.length) {

			if (pointsA[pA].position == pointsB[pB].position) {

				hPointsA.push(pointsA[pA]);
				hPointsB.push(pointsB[pB]);

				pA ++;
				pB ++;

			} else if (pointsA[pA].position < pointsB[pB].position) {

				var pos = (pointsA[pA].position - pointsB[pB - 1].position) / (pointsB[pB].position - pointsB[pB - 1].position);
				var newPoint = interplatePoint(pointsB[pB - 1], pointsB[pB], pos);
				hPointsB.push(newPoint);
				hPointsA.push(pointsA[pA]);
				pA ++;

			} else if (pointsA[pA].position > pointsB[pB].position) {

				var pos = (pointsB[pB].position - pointsA[pA - 1].position) / (pointsA[pA].position - pointsA[pA - 1].position);
				var newPoint = interplatePoint(pointsA[pA - 1], pointsA[pA], pos);
				hPointsA.push(newPoint);
				hPointsB.push(pointsB[pB]);
				pB ++;

			}

		}

		if(hPointsA.length != hPointsB.length)
			console.warn("hPointsA.length != hPointsB.length");

		this.length = hPointsA.length;


		this.position = 0;

		hPointsC = [];

		for (var i = 0; i < this.length; i++) {

			hPointsC.push(new Point(hPointsA[i].x, hPointsA[i].y));

		}

	};

	function interplatePoint(p1, p2, pos, p3) {

		var x = p1.x + (p2.x - p1.x) * pos;
		var y = p1.y + (p2.y - p1.y) * pos;

		if (p3) {
			p3.x = x;
			p3.y = y;
		} else {

			return new Point(x, y);

		}

	}

}