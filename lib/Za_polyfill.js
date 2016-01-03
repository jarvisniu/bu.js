// Array
Array.prototype.each = Array.prototype.each || function(fn) {
    for (var i = 0; i < this.length; i++) {
        fn(this[i]);
    };
};

Array.prototype.map = Array.prototype.map || function(fn) {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        arr.push(fn(this[i]));
    };
    return arr;
};

Array.prototype.contains = Array.prototype.contains || function(obj) {
    return this.indexOf(obj) !== -1;
};

Array.prototype.clear = Array.prototype.clear || function() {
    this.length = 0;
};

Array.prototype.insertAt = Array.prototype.insertAt || function(index, obj) {
    this.splice(index, 0, obj);
};

Array.prototype.removeAt = Array.prototype.removeAt || function(index) {
    this.splice(index, 1);
};

Array.prototype.remove = Array.prototype.remove || function(item) {
    var index = this.indexOf(item);
    while (index >= 0) {
        this.removeAt(index);
        index = this.indexOf(item);
    }
};

// Math
Math.bevel = Math.bevel || function(x, y) {
    return Math.sqrt(x * x + y * y);
};

Math.rand = Math.bevel || function(from, to) {
    if (to == undefined) {
        to = from;
        from = 0;
    }
    return Math.random() * (to - from) + from;
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
