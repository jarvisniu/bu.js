function Polyline() {

	var points = [];
	var _self = this;

	this.length = 0;

	this.addPoint = function(x, y) {

		points.push(new Point(x, y));

		// TODO this two function is inefficient
		calcLength();
		calcPointPositions();

	};

	// for renderer
	this.getPoints = function() {

		return points;

	};

	function calcLength() {

		if (points.length < 2) {
			_self.length = 0;
			return;
		}

		var len = 0;

		for (var i = 0; i < points.length - 1; i ++) {
			len += points[i].disTo(points[i + 1]);
		}

		_self.length = len;
		// console.log("Polyling length = " + len);

	};

	// be sure to calc the length before using this
	function calcPointPositions() {

		var currPos = 0;

		points[0].position = 0;

		for (var i = 1; i < points.length; i ++) {

			currPos += points[i].disTo(points[i - 1]) / _self.length;

			points[i].position = currPos;

		}

	};

}

function Point(x, y) {

	this.x = x;
	this.y = y;

	this.disTo = function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		return Math.sqrt(dx * dx + dy * dy);
	};

	this.position = -1;  // 0 ~ 1: position in polyline

}