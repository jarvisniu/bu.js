// Bu.js v0.4.0 - https://github.com/jarvisniu/Bu.js
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bu = function () {
  'use strict';

  // Namespace, constants, utility functions and polyfills

  //----------------------------------------------------------------------
  // Namespace
  //----------------------------------------------------------------------

  var Bu$2;
  var base;
  var base1;
  var currentTime;
  var lastTime;
  var hasProp = {}.hasOwnProperty;

  Bu$2 = window.Bu = {
    global: window
  };

  //----------------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------------

  // Version info
  Bu$2.version = '0.4.0';

  // Browser vendor prefixes, used in experimental features
  Bu$2.BROWSER_VENDOR_PREFIXES = ['webkit', 'moz', 'ms'];

  // Math
  Bu$2.HALF_PI = Math.PI / 2;

  Bu$2.TWO_PI = Math.PI * 2;

  // Default font for the text
  Bu$2.DEFAULT_FONT_FAMILY = 'Verdana';

  Bu$2.DEFAULT_FONT_SIZE = 11;

  Bu$2.DEFAULT_FONT = '11px Verdana';

  // Point is rendered as a small circle on screen. This is the radius of the circle.
  Bu$2.POINT_RENDER_SIZE = 2.25;

  // Point can have a label attached near it. This is the gap distance between them.
  Bu$2.POINT_LABEL_OFFSET = 5;

  // Default smooth factor of spline, range in [0, 1] and 1 is the smoothest
  Bu$2.DEFAULT_SPLINE_SMOOTH = 0.25;

  // How close a point to a line is regarded that the point is **ON** the line.
  Bu$2.DEFAULT_NEAR_DIST = 5;

  // Enumeration of mouse buttons, used to compare with `e.buttons` of mouse events
  Bu$2.MOUSE = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    MIDDLE: 4
  };

  //----------------------------------------------------------------------
  // Utility functions
  //----------------------------------------------------------------------

  // Calculate the mean value of numbers
  Bu$2.average = function () {
    var i, j, len, ns, sum;
    ns = arguments;
    if (_typeof(arguments[0]) === 'object') {
      ns = arguments[0];
    }
    sum = 0;
    for (j = 0, len = ns.length; j < len; j++) {
      i = ns[j];
      sum += i;
    }
    return sum / ns.length;
  };

  // Calculate the hypotenuse from the cathetuses
  Bu$2.bevel = function (x, y) {
    return Math.sqrt(x * x + y * y);
  };

  // Limit a number by minimum value and maximum value
  Bu$2.clamp = function (x, min, max) {
    if (x < min) {
      x = min;
    }
    if (x > max) {
      x = max;
    }
    return x;
  };

  // Generate a random number between two numbers
  Bu$2.rand = function (from, to) {
    if (to == null) {
      var _ref = [0, from];
      from = _ref[0];
      to = _ref[1];
    }
    return Math.random() * (to - from) + from;
  };

  // Convert an angle from radian to deg
  Bu$2.r2d = function (r) {
    return (r * 180 / Math.PI).toFixed(1);
  };

  // Convert an angle from deg to radian
  Bu$2.d2r = function (r) {
    return r * Math.PI / 180;
  };

  // Get the current timestamp
  Bu$2.now = Bu$2.global.performance != null ? function () {
    return Bu$2.global.performance.now();
  } : function () {
    return Date.now();
  };

  // Combine the given options (last item of arguments) with the default options
  Bu$2.combineOptions = function (args, defaultOptions) {
    var givenOptions, i;
    if (defaultOptions == null) {
      defaultOptions = {};
    }
    givenOptions = args[args.length - 1];
    if (Bu$2.isPlainObject(givenOptions)) {
      for (i in givenOptions) {
        if (givenOptions[i] != null) {
          defaultOptions[i] = givenOptions[i];
        }
      }
    }
    return defaultOptions;
  };

  // Check if an variable is a number
  Bu$2.isNumber = function (o) {
    return typeof o === 'number';
  };

  // Check if an variable is a string
  Bu$2.isString = function (o) {
    return typeof o === 'string';
  };

  // Check if an object is an plain object, not instance of class/function
  Bu$2.isPlainObject = function (o) {
    return o instanceof Object && o.constructor.name === 'Object';
  };

  // Check if an object is a function
  Bu$2.isFunction = function (o) {
    return o instanceof Object && o.constructor.name === 'Function';
  };

  // Check if an object is a Array
  Bu$2.isArray = function (o) {
    return o instanceof Array;
  };

  // Clone an Object or Array
  Bu$2.clone = function (target) {
    var clone, i;
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || target === null || Bu$2.isFunction(target)) {
      return target;
    } else {
      if (target.clone != null) {
        return target.clone();
      }
      // FIXME cause stack overflow when its a circular structure
      if (Bu$2.isArray(target)) {
        clone = [];
      } else if (Bu$2.isPlainObject(target)) {
        clone = {}; // instance of class
      } else {
        clone = Object.create(target.constructor.prototype);
      }
      for (i in target) {
        if (!hasProp.call(target, i)) continue;
        clone[i] = Bu$2.clone(target[i]);
      }
      return clone;
    }
  };

  // Use localStorage to persist data
  Bu$2.data = function (key, value) {
    if (value != null) {
      return localStorage['Bu.' + key] = JSON.stringify(value);
    } else {
      value = localStorage['Bu.' + key];
      if (value != null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    }
  };

  // Execute a callback function when the document is ready
  Bu$2.ready = function (cb, context, args) {
    if (document.readyState === 'complete') {
      return cb.apply(context, args);
    } else {
      return document.addEventListener('DOMContentLoaded', function () {
        return cb.apply(context, args);
      });
    }
  };

  //----------------------------------------------------------------------
  // Polyfills
  //----------------------------------------------------------------------

  // Shortcut to define a property for a class. This is used to solve the problem
  // that CoffeeScript didn't support getters and setters.
  // class Person
  //   @constructor: (age) ->
  //     @_age = age

  //   @property 'age',
  //     get: -> @_age
  //     set: (val) ->
  //       @_age = val

  Function.prototype.property = function (prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  // Make a copy of this function which has a limited shortest executing interval.
  Function.prototype.throttle = function () {
    var _this = this,
        _arguments = arguments;

    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

    var currTime, lastTime;
    currTime = 0;
    lastTime = 0;
    return function () {
      currTime = Date.now();
      if (currTime - lastTime > limit * 1000) {
        _this.apply(null, _arguments);
        return lastTime = currTime;
      }
    };
  };

  // Make a copy of this function whose execution will be continuously put off
  // after every calling of this function.
  Function.prototype.debounce = function () {
    var _this2 = this;

    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

    var args, later, timeout;
    args = null;
    timeout = null;
    later = function later() {
      return _this2.apply(null, args);
    };
    return function () {
      args = arguments;
      clearTimeout(timeout);
      return timeout = setTimeout(later, delay * 1000);
    };
  };

  // Iterate this Array and do something with the items.
  (base = Array.prototype).each || (base.each = function (fn) {
    var i;
    i = 0;
    while (i < this.length) {
      fn(this[i]);
      i++;
    }
    return this;
  });

  // Iterate this Array and map the items to a new Array.
  (base1 = Array.prototype).map || (base1.map = function (fn) {
    var arr, i;
    arr = [];
    i = 0;
    while (i < this.length) {
      arr.push(fn(this[i]));
      i++;
    }
    return this;
  });

  //----------------------------------------------------------------------
  // Others
  //----------------------------------------------------------------------

  // Output version info to the console, at most one time in a minute.
  currentTime = Date.now();

  lastTime = Bu$2.data('version.timestamp');

  if (!(lastTime != null && currentTime - lastTime < 60 * 1000)) {
    if (typeof console.info === "function") {
      console.info('Bu.js v' + Bu$2.version + ' - [https://github.com/jarvisniu/Bu.js]');
    }
    Bu$2.data('version.timestamp', currentTime);
  }

  var Bu$3 = Bu$2;

  // 2d vector
  var Vector;

  Vector = function () {
    function Vector() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Vector);

      this.x = x;
      this.y = y;
    }

    _createClass(Vector, [{
      key: 'clone',
      value: function clone() {
        return new Vector(this.x, this.y);
      }
    }, {
      key: 'add',
      value: function add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
      }
    }, {
      key: 'set',
      value: function set(x, y) {
        this.x = x;
        this.y = y;
        return this;
      }
    }, {
      key: 'offset',
      value: function offset(dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
      }
    }, {
      key: 'copy',
      value: function copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
      }
    }, {
      key: 'multiplyScalar',
      value: function multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
      }
    }, {
      key: 'project',
      value: function project(obj) {
        var a, len;
        // scale
        this.x *= obj.scale.x;
        this.y *= obj.scale.y;
        // rotation
        len = Bu.bevel(this.x, this.y);
        a = Math.atan2(this.y, this.x) + obj.rotation;
        this.x = len * Math.cos(a);
        this.y = len * Math.sin(a);
        // translate
        this.x += obj.position.x;
        this.y += obj.position.y;
        return this;
      }
    }, {
      key: 'unProject',
      value: function unProject(obj) {
        var a, len;
        // translate
        this.x -= obj.position.x;
        this.y -= obj.position.y;
        // rotation
        len = Bu.bevel(this.x, this.y);
        a = Math.atan2(this.y, this.x) - obj.rotation;
        this.x = len * Math.cos(a);
        this.y = len * Math.sin(a);
        // scale
        this.x /= obj.scale.x;
        this.y /= obj.scale.y;
        return this;
      }
    }]);

    return Vector;
  }();

  var Vector$1 = Vector;

  //# axis aligned bounding box
  var Bounds;

  Bounds = function () {
    function Bounds(target) {
      _classCallCheck(this, Bounds);

      this.update = this.update.bind(this);
      this.target = target;
      // TODO use min, max: Vector
      this.x1 = this.y1 = this.x2 = this.y2 = 0;
      this.isEmpty = true;
      this.point1 = new Vector$1();
      this.point2 = new Vector$1();
      this.update();
      this.bindEvent();
    }

    _createClass(Bounds, [{
      key: 'containsPoint',
      value: function containsPoint(p) {
        return this.x1 < p.x && this.x2 > p.x && this.y1 < p.y && this.y2 > p.y;
      }
    }, {
      key: 'update',
      value: function update() {
        var i, j, len, len1, ref, ref1, results, results1, v;
        this.clear();
        switch (this.target.type) {
          case 'Line':
          case 'Triangle':
          case 'Rectangle':
            ref = this.target.points;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              v = ref[i];
              results.push(this.expandByPoint(v));
            }
            return results;
            break;
          case 'Circle':
          case 'Bow':
          case 'Fan':
            return this.expandByCircle(this.target);
          case 'Polyline':
          case 'Polygon':
            ref1 = this.target.vertices;
            results1 = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              v = ref1[j];
              results1.push(this.expandByPoint(v));
            }
            return results1;
            break;
          case 'Ellipse':
            this.x1 = -this.target.radiusX;
            this.x2 = this.target.radiusX;
            this.y1 = -this.target.radiusY;
            return this.y2 = this.target.radiusY;
          default:
            return console.warn('Bounds: not support shape type ' + this.target.type);
        }
      }
    }, {
      key: 'bindEvent',
      value: function bindEvent() {
        switch (this.target.type) {
          case 'Circle':
          case 'Bow':
          case 'Fan':
            this.target.on('centerChanged', this.update);
            return this.target.on('radiusChanged', this.update);
          case 'Ellipse':
            return this.target.on('changed', this.update);
        }
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.x1 = this.y1 = this.x2 = this.y2 = 0;
        this.isEmpty = true;
        return this;
      }
    }, {
      key: 'expandByPoint',
      value: function expandByPoint(v) {
        if (this.isEmpty) {
          this.isEmpty = false;
          this.x1 = this.x2 = v.x;
          this.y1 = this.y2 = v.y;
        } else {
          if (v.x < this.x1) {
            this.x1 = v.x;
          }
          if (v.x > this.x2) {
            this.x2 = v.x;
          }
          if (v.y < this.y1) {
            this.y1 = v.y;
          }
          if (v.y > this.y2) {
            this.y2 = v.y;
          }
        }
        return this;
      }
    }, {
      key: 'expandByCircle',
      value: function expandByCircle(c) {
        var cp, r;
        cp = c.center;
        r = c.radius;
        if (this.isEmpty) {
          this.isEmpty = false;
          this.x1 = cp.x - r;
          this.x2 = cp.x + r;
          this.y1 = cp.y - r;
          this.y2 = cp.y + r;
        } else {
          if (cp.x - r < this.x1) {
            this.x1 = cp.x - r;
          }
          if (cp.x + r > this.x2) {
            this.x2 = cp.x + r;
          }
          if (cp.y - r < this.y1) {
            this.y1 = cp.y - r;
          }
          if (cp.y + r > this.y2) {
            this.y2 = cp.y + r;
          }
        }
        return this;
      }
    }]);

    return Bounds;
  }();

  var Bounds$1 = Bounds;

  // Parse and serialize color
  // TODO Support hsl(0, 100%, 50%) format.
  var Color;

  Color = function () {
    var CSS3_COLORS, RE_HEX3, RE_HEX6, RE_HSL, RE_HSLA, RE_RGB, RE_RGBA, RE_RGBA_PER, RE_RGB_PER, clampAlpha, hsl2rgb;

    var Color = function () {
      function Color() {
        _classCallCheck(this, Color);

        var arg;
        this.r = this.g = this.b = 255;
        this.a = 1;
        if (arguments.length === 1) {
          arg = arguments[0];
          if (Bu.isString(arg)) {
            this.parse(arg);
            this.a = clampAlpha(this.a);
          } else if (arg instanceof Color) {
            this.copy(arg); // if arguments.length == 3 or 4
          }
        } else {
          this.r = arguments[0];
          this.g = arguments[1];
          this.b = arguments[2];
          this.a = arguments[3] || 1;
        }
      }

      _createClass(Color, [{
        key: 'parse',
        value: function parse(str) {
          var found, h, hex, l, s;
          if (found = str.match(RE_RGB)) {
            this.r = +found[1];
            this.g = +found[2];
            this.b = +found[3];
            this.a = 1;
          } else if (found = str.match(RE_HSL)) {
            h = +found[1];
            s = +found[2] / 100;
            l = +found[3] / 100;

            var _hsl2rgb = hsl2rgb(h, s, l);

            var _hsl2rgb2 = _slicedToArray(_hsl2rgb, 3);

            this.r = _hsl2rgb2[0];
            this.g = _hsl2rgb2[1];
            this.b = _hsl2rgb2[2];

            this.a = 1;
          } else if (found = str.match(RE_RGBA)) {
            this.r = +found[1];
            this.g = +found[2];
            this.b = +found[3];
            this.a = +found[4];
          } else if (found = str.match(RE_HSLA)) {
            h = +found[1];
            s = +found[2] / 100;
            l = +found[3] / 100;

            var _hsl2rgb3 = hsl2rgb(h, s, l);

            var _hsl2rgb4 = _slicedToArray(_hsl2rgb3, 3);

            this.r = _hsl2rgb4[0];
            this.g = _hsl2rgb4[1];
            this.b = _hsl2rgb4[2];

            this.a = parseFloat(found[4]);
          } else if (found = str.match(RE_RGBA_PER)) {
            this.r = +found[1] * 255 / 100;
            this.g = +found[2] * 255 / 100;
            this.b = +found[3] * 255 / 100;
            this.a = +found[4];
          } else if (found = str.match(RE_RGB_PER)) {
            this.r = +found[1] * 255 / 100;
            this.g = +found[2] * 255 / 100;
            this.b = +found[3] * 255 / 100;
            this.a = 1;
          } else if (found = str.match(RE_HEX3)) {
            hex = found[1];
            this.r = parseInt(hex[0], 16);
            this.r = this.r * 16 + this.r;
            this.g = parseInt(hex[1], 16);
            this.g = this.g * 16 + this.g;
            this.b = parseInt(hex[2], 16);
            this.b = this.b * 16 + this.b;
            this.a = 1;
          } else if (found = str.match(RE_HEX6)) {
            hex = found[1];
            this.r = parseInt(hex.substring(0, 2), 16);
            this.g = parseInt(hex.substring(2, 4), 16);
            this.b = parseInt(hex.substring(4, 6), 16);
            this.a = 1;
          } else if (CSS3_COLORS[str = str.toLowerCase().trim()] != null) {
            this.r = CSS3_COLORS[str][0];
            this.g = CSS3_COLORS[str][1];
            this.b = CSS3_COLORS[str][2];
            this.a = CSS3_COLORS[str][3];
            if (this.a == null) {
              this.a = 1;
            }
          } else {
            console.error('Color.parse("' + str + '") error.');
          }
          return this;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new Color().copy(this);
        }
      }, {
        key: 'copy',
        value: function copy(color) {
          this.r = color.r;
          this.g = color.g;
          this.b = color.b;
          this.a = color.a;
          return this;
        }
      }, {
        key: 'setRGB',
        value: function setRGB(r, g, b) {
          this.r = parseInt(r);
          this.g = parseInt(g);
          this.b = parseInt(b);
          this.a = 1;
          return this;
        }
      }, {
        key: 'setRGBA',
        value: function setRGBA(r, g, b, a) {
          this.r = parseInt(r);
          this.g = parseInt(g);
          this.b = parseInt(b);
          this.a = clampAlpha(parseFloat(a));
          return this;
        }
      }, {
        key: 'toRGB',
        value: function toRGB() {
          return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        }
      }, {
        key: 'toRGBA',
        value: function toRGBA() {
          return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
        }
      }]);

      return Color;
    }();

    // Private functions


    clampAlpha = function clampAlpha(a) {
      return Bu.clamp(a, 0, 1);
    };

    hsl2rgb = function hsl2rgb(h, s, l) {
      var i, j, k, p, q, rgb, t;
      h %= 360;
      h /= 360;
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      t = [h + 1 / 3, h, h - 1 / 3];
      rgb = [];
      for (i = j = 0; j <= 2; i = ++j) {
        if (t[i] < 0) {
          t[i] += 1;
        }
        if (t[i] > 1) {
          t[i] -= 1;
        }
      }
      for (i = k = 0; k <= 2; i = ++k) {
        if (t[i] < 1 / 6) {
          rgb[i] = p + (q - p) * 6 * t[i];
        } else if (t[i] < 0.5) {
          rgb[i] = q;
        } else if (t[i] < 2 / 3) {
          rgb[i] = p + (q - p) * 6 * (2 / 3 - t[i]);
        } else {
          rgb[i] = p;
        }
        rgb[i] = Math.round(rgb[i] * 255);
      }
      return rgb;
    };

    RE_HSL = /hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/i;

    RE_HSLA = /hsla\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i;

    RE_RGB = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i;

    RE_RGBA = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+)\s*,\s*([.\d]+)\s*\)/i;

    RE_RGB_PER = /rgb\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*\)/i;

    RE_RGBA_PER = /rgba\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i;

    RE_HEX3 = /#([0-9A-F]{3})\s*$/i;

    RE_HEX6 = /#([0-9A-F]{6})\s*$/i;

    CSS3_COLORS = {
      transparent: [0, 0, 0, 0],
      aliceblue: [240, 248, 255],
      antiquewhite: [250, 235, 215],
      aqua: [0, 255, 255],
      aquamarine: [127, 255, 212],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      bisque: [255, 228, 196],
      black: [0, 0, 0],
      blanchedalmond: [255, 235, 205],
      blue: [0, 0, 255],
      blueviolet: [138, 43, 226],
      brown: [165, 42, 42],
      burlywood: [222, 184, 135],
      cadetblue: [95, 158, 160],
      chartreuse: [127, 255, 0],
      chocolate: [210, 105, 30],
      coral: [255, 127, 80],
      cornflowerblue: [100, 149, 237],
      cornsilk: [255, 248, 220],
      crimson: [220, 20, 60],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgoldenrod: [184, 134, 11],
      darkgray: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkgrey: [169, 169, 169],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkseagreen: [143, 188, 143],
      darkslateblue: [72, 61, 139],
      darkslategray: [47, 79, 79],
      darkslategrey: [47, 79, 79],
      darkturquoise: [0, 206, 209],
      darkviolet: [148, 0, 211],
      deeppink: [255, 20, 147],
      deepskyblue: [0, 191, 255],
      dimgray: [105, 105, 105],
      dimgrey: [105, 105, 105],
      dodgerblue: [30, 144, 255],
      firebrick: [178, 34, 34],
      floralwhite: [255, 250, 240],
      forestgreen: [34, 139, 34],
      fuchsia: [255, 0, 255],
      gainsboro: [220, 220, 220],
      ghostwhite: [248, 248, 255],
      gold: [255, 215, 0],
      goldenrod: [218, 165, 32],
      gray: [128, 128, 128],
      green: [0, 128, 0],
      greenyellow: [173, 255, 47],
      grey: [128, 128, 128],
      honeydew: [240, 255, 240],
      hotpink: [255, 105, 180],
      indianred: [205, 92, 92],
      indigo: [75, 0, 130],
      ivory: [255, 255, 240],
      khaki: [240, 230, 140],
      lavender: [230, 230, 250],
      lavenderblush: [255, 240, 245],
      lawngreen: [124, 252, 0],
      lemonchiffon: [255, 250, 205],
      lightblue: [173, 216, 230],
      lightcoral: [240, 128, 128],
      lightcyan: [224, 255, 255],
      lightgoldenrodyellow: [250, 250, 210],
      lightgray: [211, 211, 211],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightsalmon: [255, 160, 122],
      lightseagreen: [32, 178, 170],
      lightskyblue: [135, 206, 250],
      lightslategray: [119, 136, 153],
      lightslategrey: [119, 136, 153],
      lightsteelblue: [176, 196, 222],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      limegreen: [50, 205, 50],
      linen: [250, 240, 230],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      mediumaquamarine: [102, 205, 170],
      mediumblue: [0, 0, 205],
      mediumorchid: [186, 85, 211],
      mediumpurple: [147, 112, 219],
      mediumseagreen: [60, 179, 113],
      mediumslateblue: [123, 104, 238],
      mediumspringgreen: [0, 250, 154],
      mediumturquoise: [72, 209, 204],
      mediumvioletred: [199, 21, 133],
      midnightblue: [25, 25, 112],
      mintcream: [245, 255, 250],
      mistyrose: [255, 228, 225],
      moccasin: [255, 228, 181],
      navajowhite: [255, 222, 173],
      navy: [0, 0, 128],
      oldlace: [253, 245, 230],
      olive: [128, 128, 0],
      olivedrab: [107, 142, 35],
      orange: [255, 165, 0],
      orangered: [255, 69, 0],
      orchid: [218, 112, 214],
      palegoldenrod: [238, 232, 170],
      palegreen: [152, 251, 152],
      paleturquoise: [175, 238, 238],
      palevioletred: [219, 112, 147],
      papayawhip: [255, 239, 213],
      peachpuff: [255, 218, 185],
      peru: [205, 133, 63],
      pink: [255, 192, 203],
      plum: [221, 160, 221],
      powderblue: [176, 224, 230],
      purple: [128, 0, 128],
      red: [255, 0, 0],
      rosybrown: [188, 143, 143],
      royalblue: [65, 105, 225],
      saddlebrown: [139, 69, 19],
      salmon: [250, 128, 114],
      sandybrown: [244, 164, 96],
      seagreen: [46, 139, 87],
      seashell: [255, 245, 238],
      sienna: [160, 82, 45],
      silver: [192, 192, 192],
      skyblue: [135, 206, 235],
      slateblue: [106, 90, 205],
      slategray: [112, 128, 144],
      slategrey: [112, 128, 144],
      snow: [255, 250, 250],
      springgreen: [0, 255, 127],
      steelblue: [70, 130, 180],
      tan: [210, 180, 140],
      teal: [0, 128, 128],
      thistle: [216, 191, 216],
      tomato: [255, 99, 71],
      turquoise: [64, 224, 208],
      violet: [238, 130, 238],
      wheat: [245, 222, 179],
      white: [255, 255, 255],
      whitesmoke: [245, 245, 245],
      yellow: [255, 255, 0],
      yellowgreen: [154, 205, 50]
    };

    return Color;
  }();

  var Color$1 = Color;

  // the size of rectangle, Bounds etc.
  var Size;

  Size = function () {
    function Size(width, height) {
      _classCallCheck(this, Size);

      this.width = width;
      this.height = height;
      this.type = 'Size';
    }

    _createClass(Size, [{
      key: 'set',
      value: function set(width, height) {
        this.width = width;
        this.height = height;
      }
    }]);

    return Size;
  }();

  var Size$1 = Size;

  //----------------------------------------------------------------------
  // MicroJQuery - A micro version of jQuery

  // Supported features:
  //   $. - static methods
  //     .ready(cb) - call the callback function after the page is loaded
  //     .ajax([url,] options) - perform an ajax request
  //   $(selector) - select element(s)
  //     .on(type, callback) - add an event listener
  //     .off(type, callback) - remove an event listener
  //     .append(tagName) - append a tag
  //     .text(text) - set the inner text
  //     .html(htmlText) - set the inner HTML
  //     .style(name, value) - set style (a css attribute)
  //     #.css(object) - set styles (multiple css attribute)
  //     .hasClass(className) - detect whether a class exists
  //     .addClass(className) - add a class
  //     .removeClass(className) - remove a class
  //     .toggleClass(className) - toggle a class
  //     .attr(name, value) - set an attribute
  //     .hasAttr(name) - detect whether an attribute exists
  //     .removeAttr(name) - remove an attribute
  //   Notes:
  //        # is planned but not implemented
  //----------------------------------------------------------------------
  (function (global) {
    var jQuery;
    // selector
    global.$ = function (selector) {
      var selections;
      selections = [];
      if (typeof selector === 'string') {
        selections = [].slice.call(document.querySelectorAll(selector));
      } else if (selector instanceof HTMLElement) {
        selections.push(selector);
      }
      jQuery.apply(selections);
      return selections;
    };
    jQuery = function jQuery() {
      var _this3 = this;

      var SVG_TAGS;
      // event
      this.on = function (type, callback) {
        _this3.each(function (dom) {
          return dom.addEventListener(type, callback);
        });
        return _this3;
      };
      this.off = function (type, callback) {
        _this3.each(function (dom) {
          return dom.removeEventListener(type, callback);
        });
        return _this3;
      };
      // DOM Manipulation
      SVG_TAGS = 'svg line rect circle ellipse polyline polygon path text';
      this.append = function (tag) {
        _this3.each(function (dom, i) {
          var newDom, tagIndex;
          tagIndex = SVG_TAGS.indexOf(tag.toLowerCase());
          if (tagIndex > -1) {
            newDom = document.createElementNS('http://www.w3.org/2000/svg', tag);
          } else {
            newDom = document.createElement(tag);
          }
          return _this3[i] = dom.appendChild(newDom);
        });
        return _this3;
      };
      this.text = function (str) {
        _this3.each(function (dom) {
          return dom.textContent = str;
        });
        return _this3;
      };
      this.html = function (str) {
        _this3.each(function (dom) {
          return dom.innerHTML = str;
        });
        return _this3;
      };
      this.width = function (w) {
        if (w != null) {
          _this3.each(function (dom) {
            return dom.style.width = w + 'px';
          });
          return _this3;
        } else {
          return parseFloat(getComputedStyle(_this3[0]).width);
        }
      };
      this.height = function (h) {
        if (h != null) {
          _this3.each(function (dom) {
            return dom.style.height = h + 'px';
          });
          return _this3;
        } else {
          return parseFloat(getComputedStyle(_this3[0]).height);
        }
      };
      this.style = function (name, value) {
        _this3.each(function (dom) {
          var i, styleText, styles;
          styleText = dom.getAttribute('style');
          styles = {};
          if (styleText) {
            styleText.split(';').each(function (n) {
              var nv;
              nv = n.split(':');
              return styles[nv[0]] = nv[1];
            });
          }
          styles[name] = value;
          // concat
          styleText = '';
          for (i in styles) {
            styleText += i + ': ' + styles[i] + '; ';
          }
          return dom.setAttribute('style', styleText);
        });
        return _this3;
      };
      this.hasClass = function (name) {
        var classText, classes, i;
        if (_this3.length === 0) {
          return false;
        }
        // if multiple, every DOM should have the class
        i = 0;
        while (i < _this3.length) {
          classText = _this3[i].getAttribute('class' || '');
          // not use ' ' to avoid multiple spaces like 'a   b'
          classes = classText.split(RegExp(' +'));
          if (!classes.contains(name)) {
            return false;
          }
          i++;
        }
        return _this3;
      };
      this.addClass = function (name) {
        _this3.each(function (dom) {
          var classText, classes;
          classText = dom.getAttribute('class' || '');
          classes = classText.split(RegExp(' +'));
          if (!classes.contains(name)) {
            classes.push(name);
            return dom.setAttribute('class', classes.join(' '));
          }
        });
        return _this3;
      };
      this.removeClass = function (name) {
        _this3.each(function (dom) {
          var classText, classes;
          classText = dom.getAttribute('class') || '';
          classes = classText.split(RegExp(' +'));
          if (classes.contains(name)) {
            classes.remove(name);
            if (classes.length > 0) {
              return dom.setAttribute('class', classes.join(' '));
            } else {
              return dom.removeAttribute('class');
            }
          }
        });
        return _this3;
      };
      this.toggleClass = function (name) {
        _this3.each(function (dom) {
          var classText, classes;
          classText = dom.getAttribute('class' || '');
          classes = classText.split(RegExp(' +'));
          if (classes.contains(name)) {
            classes.remove(name);
          } else {
            classes.push(name);
          }
          if (classes.length > 0) {
            return dom.setAttribute('class', classes.join(' '));
          } else {
            return dom.removeAttribute('class');
          }
        });
        return _this3;
      };
      this.attr = function (name, value) {
        if (value != null) {
          _this3.each(function (dom) {
            return dom.setAttribute(name, value);
          });
          return _this3;
        } else {
          return _this3[0].getAttribute(name);
        }
      };
      this.hasAttr = function (name) {
        var i;
        if (_this3.length === 0) {
          return false;
        }
        i = 0;
        while (i < _this3.length) {
          if (!_this3[i].hasAttribute(name)) {
            return false;
          }
          i++;
        }
        return _this3;
      };
      this.removeAttr = function (name) {
        _this3.each(function (dom) {
          return dom.removeAttribute(name);
        });
        return _this3;
      };
      return this.val = function () {
        var ref;
        return (ref = _this3[0]) != null ? ref.value : void 0;
      };
    };
    // $.ready()
    global.$.ready = function (onLoad) {
      return document.addEventListener('DOMContentLoaded', onLoad);
    };
    //----------------------------------------------------------------------
    // $.ajax()
    //	options:
    //		url: string
    //		====
    //		async = true: bool
    //	data: object - query parameters TODO: implement this
    //		method = GET: POST, PUT, DELETE, HEAD
    //		username: string
    //		password: string
    //		success: function
    //		error: function
    //		complete: function
    //----------------------------------------------------------------------
    return global.$.ajax = function (url, ops) {
      var xhr;
      if (!ops) {
        if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
          ops = url;
          url = ops.url;
        } else {
          ops = {};
        }
      }
      ops.method || (ops.method = 'GET');
      if (ops.async == null) {
        ops.async = true;
      }
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (ops.success != null) {
              return ops.success(xhr.responseText, xhr.status, xhr);
            }
          } else {
            if (ops.error != null) {
              ops.error(xhr, xhr.status);
            }
            if (ops.complete != null) {
              return ops.complete(xhr, xhr.status);
            }
          }
        }
      };
      xhr.open(ops.method, url, ops.async, ops.username, ops.password);
      return xhr.send(null);
    };
  })(Bu.global);

  // Add event listener feature to custom objects
  var Event;

  Event = function Event() {
    var types;
    types = {};
    this.on = function (type, listener) {
      var listeners;
      listeners = types[type] || (types[type] = []);
      if (listeners.indexOf(listener === -1)) {
        return listeners.push(listener);
      }
    };
    this.once = function (type, listener) {
      listener.once = true;
      return this.on(type, listener);
    };
    this.off = function (type, listener) {
      var index, listeners;
      listeners = types[type];
      if (listener != null) {
        if (listeners != null) {
          index = listeners.indexOf(listener);
          if (index > -1) {
            return listeners.splice(index, 1);
          }
        }
      } else {
        if (listeners != null) {
          return listeners.length = 0;
        }
      }
    };
    return this.trigger = function (type, eventData) {
      var i, len, listener, listeners, results;
      listeners = types[type];
      if (listeners != null) {
        eventData || (eventData = {});
        eventData.target = this;
        results = [];
        for (i = 0, len = listeners.length; i < len; i++) {
          listener = listeners[i];
          listener.call(this, eventData);
          if (listener.once) {
            results.push(listeners.splice(listeners.indexOf(listener), 1));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };
  };

  var Event$1 = Event;

  // Add color to the shapes
  // This object is dedicated to mixed-in the Object2D.
  var _Styled;

  _Styled = function Styled() {
    this.strokeStyle = _Styled.DEFAULT_STROKE_STYLE;
    this.fillStyle = _Styled.DEFAULT_FILL_STYLE;
    this.dashStyle = false;
    this.dashFlowSpeed = 0;
    this.lineWidth = 1;
    this.dashOffset = 0;
    // Set/copy style from other style
    this.style = function (style) {
      var i, k, len, ref;
      if (Bu.isString(style)) {
        style = Bu.styles[style];
        if (style == null) {
          style = Bu.styles.default;
          console.warn('Styled: Bu.styles.' + style + ' doesn\'t exists, fell back to default.');
        }
      } else if (style == null) {
        style = Bu.styles['default'];
      }
      ref = ['strokeStyle', 'fillStyle', 'dashStyle', 'dashFlowSpeed', 'lineWidth'];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        this[k] = style[k];
      }
      return this;
    };
    // Set the stroke style
    this.stroke = function (v) {
      if (v == null) {
        v = true;
      }
      if (Bu.styles != null && v in Bu.styles) {
        v = Bu.styles[v].strokeStyle;
      }
      switch (v) {
        case true:
          this.strokeStyle = _Styled.DEFAULT_STROKE_STYLE;
          break;
        case false:
          this.strokeStyle = null;
          break;
        default:
          this.strokeStyle = v;
      }
      return this;
    };
    // Set the fill style
    this.fill = function (v) {
      if (v == null) {
        v = true;
      }
      if (Bu.styles != null && v in Bu.styles) {
        v = Bu.styles[v].fillStyle;
      }
      switch (v) {
        case false:
          this.fillStyle = null;
          break;
        case true:
          this.fillStyle = _Styled.DEFAULT_FILL_STYLE;
          break;
        default:
          this.fillStyle = v;
      }
      return this;
    };
    // Set the dash style
    this.dash = function (v) {
      if (v == null) {
        v = true;
      }
      if (Bu.styles != null && v in Bu.styles) {
        v = Bu.styles[v].dashStyle;
      }
      if (Bu.isNumber(v)) {
        v = [v, v];
      }
      switch (v) {
        case false:
          this.dashStyle = null;
          break;
        case true:
          this.dashStyle = _Styled.DEFAULT_DASH_STYLE;
          break;
        default:
          this.dashStyle = v;
      }
      return this;
    };
    // Set the dash flowing speed
    this.dashFlow = function (speed) {
      if (speed === true || speed == null) {
        speed = 1;
      }
      if (speed === false) {
        speed = 0;
      }
      Bu.dashFlowManager.setSpeed(this, speed);
      return this;
    };
    // Set the lineWidth
    this.setLineWidth = function (w) {
      this.lineWidth = w;
      return this;
    };
    return this;
  };

  _Styled.DEFAULT_STROKE_STYLE = '#048';

  _Styled.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)';

  _Styled.DEFAULT_DASH_STYLE = [8, 4];

  // TODO move out of here
  Bu.styles = {
    default: new _Styled().stroke().fill(),
    hover: new _Styled().stroke('hsla(0, 100%, 40%, 0.75)').fill('hsla(0, 100%, 75%, 0.5)'),
    text: new _Styled().stroke(false).fill('black'),
    line: new _Styled().fill(false),
    selected: new _Styled().setLineWidth(3),
    dash: new _Styled().dash()
  };

  var Styled$1 = _Styled;

  // Base class of all shapes and other renderable objects
  var Object2D;
  var hasProp$1 = {}.hasOwnProperty;

  Object2D = function () {
    var Object2D = function () {
      function Object2D() {
        _classCallCheck(this, Object2D);

        Styled$1.apply(this);
        Event$1.apply(this);
        this.visible = true;
        this.opacity = 1;
        this.position = new Vector$1();
        this.rotation = 0;
        this._scale = new Vector$1(1, 1);
        this.skew = new Vector$1();
        //@toWorldMatrix = new Bu.Matrix()
        //@updateMatrix ->

        // geometry related
        this.bounds = null; // used to accelerate the hit testing
        this.keyPoints = null;
        // hierarchy
        this.children = [];
        this.parent = null;
      }

      // Translate an object


      _createClass(Object2D, [{
        key: 'translate',
        value: function translate(dx, dy) {
          this.position.x += dx;
          this.position.y += dy;
          return this;
        }

        // Rotate an object

      }, {
        key: 'rotate',
        value: function rotate(da) {
          this.rotation += da;
          return this;
        }

        // Scale an object by

      }, {
        key: 'scaleBy',
        value: function scaleBy(ds) {
          this.scale *= ds;
          return this;
        }

        // Scale an object to

      }, {
        key: 'scaleTo',
        value: function scaleTo(s) {
          this.scale = s;
          return this;
        }

        // Get the root node of the scene tree

      }, {
        key: 'getScene',
        value: function getScene() {
          var node;
          node = this;
          while (true) {
            if (node instanceof Bu.Scene) {
              // TODO circular reference
              break;
            }
            node = node.parent;
          }
          return node;
        }

        // Add object(s) to children

      }, {
        key: 'addChild',
        value: function addChild(shape) {
          var j, len, s;
          if (Bu.isArray(shape)) {
            for (j = 0, len = shape.length; j < len; j++) {
              s = shape[j];
              this.children.push(s);
              s.parent = this;
            }
          } else {
            this.children.push(shape);
            shape.parent = this;
          }
          return this;
        }

        // Remove object from children

      }, {
        key: 'removeChild',
        value: function removeChild(shape) {
          var index;
          index = this.children.indexOf(shape);
          if (index > -1) {
            this.children.splice(index, 1);
          }
          return this;
        }

        // Apply an animation on this object
        // The type of `anim` may be:
        //     1. Preset animations: the animation name(string type), ie. key in `Bu.animations`
        //     2. Custom animations: the animation object of `Animation` type
        //     3. Multiple animations: An array whose children are above two types

      }, {
        key: 'animate',
        value: function animate(anim, args) {
          var i;
          if (!Bu.isArray(args)) {
            args = [args];
          }
          if (Bu.isString(anim)) {
            if (anim in Bu.animations) {
              Bu.animations[anim].applyTo(this, args);
            } else {
              console.warn('Bu.animations["' + anim + '"] doesn\'t exists.');
            }
          } else if (Bu.isArray(anim)) {
            for (i in anim) {
              if (!hasProp$1.call(anim, i)) continue;
              this.animate(anim[i], args);
            }
          } else {
            anim.applyTo(this, args);
          }
          return this;
        }

        // Create Bounds for this object

      }, {
        key: 'createBounds',
        value: function createBounds() {
          this.bounds = new Bounds$1(this);
          return this;
        }

        // Hit testing with unprojections

      }, {
        key: 'hitTest',
        value: function hitTest(v) {
          var renderer;
          renderer = this.getScene().renderer;
          if (renderer.originAtCenter) {
            v.offset(-renderer.width / 2, -renderer.height / 2);
          }
          v.project(renderer.camera);
          v.unProject(this);
          return this.containsPoint(v);
        }

        // Hit testing in the same coordinate

      }, {
        key: 'containsPoint',
        value: function containsPoint(p) {
          if (this.bounds != null && !this.bounds.containsPoint(p)) {
            return false;
          } else if (this._containsPoint) {
            return this._containsPoint(p);
          } else {
            return false;
          }
        }
      }]);

      return Object2D;
    }();

    Object2D.prototype.type = 'Object2D';

    Object2D.prototype.fillable = false;

    Object2D.property('scale', {
      get: function get() {
        return this._scale;
      },
      set: function set(val) {
        if (Bu.isNumber(val)) {
          return this._scale.x = this._scale.y = val;
        } else {
          return this._scale = val;
        }
      }
    });

    return Object2D;
  }();

  var Object2D$1 = Object2D;

  // Camera: change the view range at the scene
  var Camera;

  Camera = function (_Object2D$) {
    _inherits(Camera, _Object2D$);

    function Camera() {
      _classCallCheck(this, Camera);

      var _this4 = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

      _this4.type = 'Camera';
      return _this4;
    }

    return Camera;
  }(Object2D$1);

  var Camera$1 = Camera;

  // Scene is the root of the object tree
  var Scene;

  Scene = function (_Object2D$2) {
    _inherits(Scene, _Object2D$2);

    function Scene() {
      _classCallCheck(this, Scene);

      var _this5 = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

      _this5.type = 'Scene';
      _this5.background = Scene.DEFAULT_BACKGROUND;
      _this5.renderer = null;
      return _this5;
    }

    return Scene;
  }(Object2D$1);

  Scene.DEFAULT_BACKGROUND = '#eee';

  var Scene$1 = Scene;

  // Used to render all the drawable objects to the canvas
  var Renderer;

  Renderer = function () {
    var Renderer = function () {
      function Renderer() {
        var _this6 = this;

        _classCallCheck(this, Renderer);

        var delayed, j, len1, name, onResize, options, ref, _tick;
        // Draw an array of drawables
        this.drawShapes = this.drawShapes.bind(this);
        // Draw an drawable to the canvas
        this.drawShape = this.drawShape.bind(this);
        Event$1.apply(this);
        this.type = 'Renderer';
        // API
        this.scene = new Scene$1(this);
        this.camera = new Camera$1();
        this.tickCount = 0;
        this.isRunning = true;
        this.pixelRatio = Bu.global.devicePixelRatio || 1;
        if (typeof ClipMeter !== "undefined" && ClipMeter !== null) {
          this.clipMeter = new ClipMeter();
        }
        // Receive options
        options = Bu.combineOptions(arguments, {
          container: 'body',
          showKeyPoints: false,
          showBounds: false,
          originAtCenter: false,
          imageSmoothing: true
        });
        ref = ['container', 'width', 'height', 'showKeyPoints', 'showBounds', 'originAtCenter'];
        // Copy options
        for (j = 0, len1 = ref.length; j < len1; j++) {
          name = ref[j];
          this[name] = options[name];
        }
        // If options.width is not given, then fillParent is true
        this.fillParent = !Bu.isNumber(options.width);
        // Convert width and height from dip(device independent pixels) to physical pixels
        this.pixelWidth = this.width * this.pixelRatio;
        this.pixelHeight = this.height * this.pixelRatio;
        // Set canvas dom
        this.dom = document.createElement('canvas');
        this.dom.style.cursor = options.cursor || 'default';
        this.dom.style.boxSizing = 'content-box';
        this.dom.oncontextmenu = function () {
          return false;
        };
        // Set context
        this.context = this.dom.getContext('2d');
        this.context.textBaseline = 'top';
        if (Bu.isString(this.container)) {
          // Set container dom
          this.container = document.querySelector(this.container);
        }
        if (this.fillParent && this.container === document.body) {
          $('body').style('margin', 0).style('overflow', 'hidden');
          $('html, body').style('width', '100%').style('height', '100%');
        }
        // Set sizes for renderer property, dom attribute and dom style
        onResize = function onResize() {
          var canvasRatio, containerRatio;
          canvasRatio = _this6.dom.height / _this6.dom.width;
          containerRatio = _this6.container.clientHeight / _this6.container.clientWidth;
          if (containerRatio < canvasRatio) {
            _this6.height = _this6.container.clientHeight;
            _this6.width = _this6.height / containerRatio;
          } else {
            _this6.width = _this6.container.clientWidth;
            _this6.height = _this6.width * containerRatio;
          }
          _this6.pixelWidth = _this6.dom.width = _this6.width * _this6.pixelRatio;
          _this6.pixelHeight = _this6.dom.height = _this6.height * _this6.pixelRatio;
          _this6.dom.style.width = _this6.width + 'px';
          _this6.dom.style.height = _this6.height + 'px';
          return _this6.render();
        };
        if (!this.fillParent) {
          this.dom.style.width = this.width + 'px';
          this.dom.style.height = this.height + 'px';
          this.dom.width = this.pixelWidth;
          this.dom.height = this.pixelHeight;
        } else {
          this.pixelWidth = this.container.clientWidth;
          this.pixelHeight = this.container.clientHeight;
          this.width = this.pixelWidth / this.pixelRatio;
          this.height = this.pixelHeight / this.pixelRatio;
          Bu.global.window.addEventListener('resize', onResize);
          this.dom.addEventListener('DOMNodeInserted', onResize);
        }
        // Run the loop
        _tick = function tick() {
          if (_this6.isRunning) {
            if (_this6.clipMeter != null) {
              _this6.clipMeter.start();
            }
            _this6.render();
            _this6.trigger('update', _this6);
            _this6.tickCount += 1;
            if (_this6.clipMeter != null) {
              _this6.clipMeter.tick();
            }
          }
          return requestAnimationFrame(_tick);
        };
        _tick();
        // Append <canvas> dom into the container
        delayed = function delayed() {
          _this6.container.appendChild(_this6.dom);
          return _this6.imageSmoothing = options.imageSmoothing;
        };
        setTimeout(delayed, 1);
        // Hook up with running components
        Bu.animationRunner.hookUp(this);
        Bu.dashFlowManager.hookUp(this);
      }

      // Pause/continue/toggle the rendering loop


      _createClass(Renderer, [{
        key: 'pause',
        value: function pause() {
          return this.isRunning = false;
        }
      }, {
        key: 'continue',
        value: function _continue() {
          return this.isRunning = true;
        }
      }, {
        key: 'toggle',
        value: function toggle() {
          return this.isRunning = !this.isRunning;
        }

        // Perform the full render process

      }, {
        key: 'render',
        value: function render() {
          this.context.save();
          // Clear the canvas
          this.clearCanvas();
          if (this.originAtCenter) {
            // Move center from left-top corner to screen center
            this.context.translate(this.pixelWidth / 2, this.pixelHeight / 2);
          }
          // Zoom the canvas with devicePixelRatio to support high definition screen
          this.context.scale(this.pixelRatio, this.pixelRatio);
          // Transform the camera
          this.context.scale(1 / this.camera.scale.x, 1 / this.camera.scale.y);
          this.context.rotate(-this.camera.rotation);
          this.context.translate(-this.camera.position.x, -this.camera.position.y);
          // Draw the scene tree
          this.drawShape(this.scene);
          this.context.restore();
          return this;
        }

        // Clear the canvas

      }, {
        key: 'clearCanvas',
        value: function clearCanvas() {
          this.context.fillStyle = this.scene.background;
          this.context.fillRect(0, 0, this.pixelWidth, this.pixelHeight);
          return this;
        }
      }, {
        key: 'drawShapes',
        value: function drawShapes(shapes) {
          var j, len1, shape;
          if (shapes != null) {
            for (j = 0, len1 = shapes.length; j < len1; j++) {
              shape = shapes[j];
              this.context.save();
              this.drawShape(shape);
              this.context.restore();
            }
          }
          return this;
        }
      }, {
        key: 'drawShape',
        value: function drawShape(shape) {
          var base, sx, sy;
          if (!shape.visible) {
            return this;
          }
          this.context.translate(shape.position.x, shape.position.y);
          this.context.rotate(shape.rotation);
          sx = shape.scale.x;
          sy = shape.scale.y;
          if (sx / sy > 100 || sx / sy < 0.01) {
            if (Math.abs(sx) < 0.02) {
              sx = 0;
            }
            if (Math.abs(sy) < 0.02) {
              sy = 0;
            }
          }
          this.context.scale(sx, sy);
          this.context.globalAlpha *= shape.opacity;
          if (shape.strokeStyle != null) {
            this.context.strokeStyle = shape.strokeStyle;
            this.context.lineWidth = shape.lineWidth;
            if (shape.lineCap != null) {
              this.context.lineCap = shape.lineCap;
            }
            if (shape.lineJoin != null) {
              this.context.lineJoin = shape.lineJoin;
            }
          }
          this.context.beginPath();
          switch (shape.type) {
            case 'Point':
              this.drawPoint(shape);
              break;
            case 'Line':
              this.drawLine(shape);
              break;
            case 'Circle':
              this.drawCircle(shape);
              break;
            case 'Ellipse':
              this.drawEllipse(shape);
              break;
            case 'Triangle':
              this.drawTriangle(shape);
              break;
            case 'Rectangle':
              this.drawRectangle(shape);
              break;
            case 'Fan':
              this.drawFan(shape);
              break;
            case 'Bow':
              this.drawBow(shape);
              break;
            case 'Polygon':
              this.drawPolygon(shape);
              break;
            case 'Polyline':
              this.drawPolyline(shape);
              break;
            case 'Spline':
              this.drawSpline(shape);
              break;
            case 'PointText':
              this.drawPointText(shape);
              break;
            case 'Image':
              this.drawImage(shape);
              break;
            case 'Object2D':
            case 'Scene':
              // then do nothing
              break;
            default:
              console.log('drawShapes(): unknown shape: ', shape.type, shape);
          }
          if (shape.fillStyle != null && shape.fillable) {
            this.context.fillStyle = shape.fillStyle;
            this.context.fill();
          }
          if (shape.dashStyle) {
            this.context.lineDashOffset = shape.dashOffset;
            if (typeof (base = this.context).setLineDash === "function") {
              base.setLineDash(shape.dashStyle);
            }
            this.context.stroke();
            this.context.setLineDash([]);
          } else if (shape.strokeStyle != null) {
            this.context.stroke();
          }
          if (shape.children != null) {
            this.drawShapes(shape.children);
          }
          if (this.showKeyPoints) {
            this.drawShapes(shape.keyPoints);
          }
          if (this.showBounds && shape.bounds != null) {
            this.drawBounds(shape.bounds);
          }
          return this;
        }
      }, {
        key: 'drawPoint',
        value: function drawPoint(shape) {
          this.context.arc(shape.x, shape.y, Bu.POINT_RENDER_SIZE, 0, Bu.TWO_PI);
          return this;
        }
      }, {
        key: 'drawLine',
        value: function drawLine(shape) {
          this.context.moveTo(shape.points[0].x, shape.points[0].y);
          this.context.lineTo(shape.points[1].x, shape.points[1].y);
          return this;
        }
      }, {
        key: 'drawCircle',
        value: function drawCircle(shape) {
          this.context.arc(shape.cx, shape.cy, shape.radius, 0, Bu.TWO_PI);
          return this;
        }
      }, {
        key: 'drawEllipse',
        value: function drawEllipse(shape) {
          this.context.ellipse(0, 0, shape.radiusX, shape.radiusY, 0, Bu.TWO_PI, false);
          return this;
        }
      }, {
        key: 'drawTriangle',
        value: function drawTriangle(shape) {
          this.context.lineTo(shape.points[0].x, shape.points[0].y);
          this.context.lineTo(shape.points[1].x, shape.points[1].y);
          this.context.lineTo(shape.points[2].x, shape.points[2].y);
          this.context.closePath();
          return this;
        }
      }, {
        key: 'drawRectangle',
        value: function drawRectangle(shape) {
          if (shape.cornerRadius !== 0) {
            return this.drawRoundRectangle(shape);
          }
          this.context.rect(shape.pointLT.x, shape.pointLT.y, shape.size.width, shape.size.height);
          return this;
        }
      }, {
        key: 'drawRoundRectangle',
        value: function drawRoundRectangle(shape) {
          var base, r, x1, x2, y1, y2;
          x1 = shape.pointLT.x;
          x2 = shape.pointRB.x;
          y1 = shape.pointLT.y;
          y2 = shape.pointRB.y;
          r = shape.cornerRadius;
          this.context.moveTo(x1, y1 + r);
          this.context.arcTo(x1, y1, x1 + r, y1, r);
          this.context.lineTo(x2 - r, y1);
          this.context.arcTo(x2, y1, x2, y1 + r, r);
          this.context.lineTo(x2, y2 - r);
          this.context.arcTo(x2, y2, x2 - r, y2, r);
          this.context.lineTo(x1 + r, y2);
          this.context.arcTo(x1, y2, x1, y2 - r, r);
          this.context.closePath();
          if (shape.strokeStyle != null && shape.dashStyle) {
            if (typeof (base = this.context).setLineDash === "function") {
              base.setLineDash(shape.dashStyle);
            }
          }
          return this;
        }
      }, {
        key: 'drawFan',
        value: function drawFan(shape) {
          this.context.arc(shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo);
          this.context.lineTo(shape.cx, shape.cy);
          this.context.closePath();
          return this;
        }
      }, {
        key: 'drawBow',
        value: function drawBow(shape) {
          this.context.arc(shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo);
          this.context.closePath();
          return this;
        }
      }, {
        key: 'drawPolygon',
        value: function drawPolygon(shape) {
          var j, len1, point, ref;
          ref = shape.vertices;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            point = ref[j];
            this.context.lineTo(point.x, point.y);
          }
          this.context.closePath();
          return this;
        }
      }, {
        key: 'drawPolyline',
        value: function drawPolyline(shape) {
          var j, len1, point, ref;
          ref = shape.vertices;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            point = ref[j];
            this.context.lineTo(point.x, point.y);
          }
          return this;
        }
      }, {
        key: 'drawSpline',
        value: function drawSpline(shape) {
          var i, j, len, ref;
          if (shape.strokeStyle != null) {
            len = shape.vertices.length;
            if (len === 2) {
              this.context.moveTo(shape.vertices[0].x, shape.vertices[0].y);
              this.context.lineTo(shape.vertices[1].x, shape.vertices[1].y);
            } else if (len > 2) {
              this.context.moveTo(shape.vertices[0].x, shape.vertices[0].y);
              for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
                this.context.bezierCurveTo(shape.controlPointsBehind[i - 1].x, shape.controlPointsBehind[i - 1].y, shape.controlPointsAhead[i].x, shape.controlPointsAhead[i].y, shape.vertices[i].x, shape.vertices[i].y);
              }
            }
          }
          return this;
        }
      }, {
        key: 'drawPointText',
        value: function drawPointText(shape) {
          var char, charBitmap, font, i, j, ref, textWidth, xOffset, yOffset;
          font = shape.font || Bu.DEFAULT_FONT;
          if (Bu.isString(font)) {
            this.context.textAlign = shape.textAlign;
            this.context.textBaseline = shape.textBaseline;
            this.context.font = font;
            if (shape.strokeStyle != null) {
              this.context.strokeText(shape.text, shape.x, shape.y);
            }
            if (shape.fillStyle != null) {
              this.context.fillStyle = shape.fillStyle;
              this.context.fillText(shape.text, shape.x, shape.y);
            }
          } else if (font instanceof Bu.SpriteSheet && font.ready) {
            textWidth = font.measureTextWidth(shape.text);
            xOffset = function () {
              switch (shape.textAlign) {
                case 'left':
                  return 0;
                case 'center':
                  return -textWidth / 2;
                case 'right':
                  return -textWidth;
              }
            }();
            yOffset = function () {
              switch (shape.textBaseline) {
                case 'top':
                  return 0;
                case 'middle':
                  return -font.height / 2;
                case 'bottom':
                  return -font.height;
              }
            }();
            for (i = j = 0, ref = shape.text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
              char = shape.text[i];
              charBitmap = font.getFrameImage(char);
              if (charBitmap != null) {
                this.context.drawImage(charBitmap, shape.x + xOffset, shape.y + yOffset);
                xOffset += charBitmap.width;
              } else {
                xOffset += 10;
              }
            }
          }
          return this;
        }
      }, {
        key: 'drawImage',
        value: function drawImage(shape) {
          var dx, dy, h, w;
          if (shape.ready) {
            w = shape.size.width;
            h = shape.size.height;
            dx = -w * shape.pivot.x;
            dy = -h * shape.pivot.y;
            this.context.drawImage(shape.image, dx, dy, w, h);
          }
          return this;
        }
      }, {
        key: 'drawBounds',
        value: function drawBounds(bounds) {
          var base;
          this.context.beginPath();
          this.context.strokeStyle = Renderer.BOUNDS_STROKE_STYLE;
          if (typeof (base = this.context).setLineDash === "function") {
            base.setLineDash(Renderer.BOUNDS_DASH_STYLE);
          }
          this.context.rect(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
          this.context.stroke();
          return this;
        }
      }]);

      return Renderer;
    }();

    // property


    Renderer.property('imageSmoothing', {
      get: function get() {
        return this._imageSmoothing;
      },
      set: function set(val) {
        return this._imageSmoothing = this.context.imageSmoothingEnabled = val;
      }
    });

    return Renderer;
  }();

  //----------------------------------------------------------------------
  // Static members
  //----------------------------------------------------------------------

  // Stroke style of bounds
  Renderer.BOUNDS_STROKE_STYLE = 'red';

  // Dash style of bounds
  Renderer.BOUNDS_DASH_STYLE = [6, 6];

  var Renderer$1 = Renderer;

  // Manage the user input, like mouse, keyboard, touchscreen etc
  var InputManager;

  InputManager = function () {
    var InputManager = function () {
      function InputManager() {
        var _this7 = this;

        _classCallCheck(this, InputManager);

        this.keyStates = [];
        window.addEventListener('keydown', function (e) {
          return _this7.keyStates[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
          return _this7.keyStates[e.keyCode] = false;
        });
      }

      // To detect whether a key is pressed down


      _createClass(InputManager, [{
        key: 'isKeyDown',
        value: function isKeyDown(key) {
          var keyCode;
          keyCode = this.keyToKeyCode(key);
          return this.keyStates[keyCode];
        }

        // Convert from keyIdentifiers/keyValues to keyCode

      }, {
        key: 'keyToKeyCode',
        value: function keyToKeyCode(key) {
          var keyCode;
          key = this.keyAliasToKeyMap[key] || key;
          return keyCode = this.keyToKeyCodeMap[key];
        }

        // Recieve and bind the mouse/keyboard events listeners

      }, {
        key: 'handleAppEvents',
        value: function handleAppEvents(app, events) {
          var key, keyCode, keydownListeners, keyupListeners, results, type;
          keydownListeners = {};
          keyupListeners = {};
          window.addEventListener('keydown', function (e) {
            var ref;
            return (ref = keydownListeners[e.keyCode]) != null ? ref.call(app, e) : void 0;
          });
          window.addEventListener('keyup', function (e) {
            var ref;
            return (ref = keyupListeners[e.keyCode]) != null ? ref.call(app, e) : void 0;
          });
          results = [];
          for (type in events) {
            if (type === 'mousedown' || type === 'mousemove' || type === 'mouseup' || type === 'mousewheel') {
              results.push(app.$renderer.dom.addEventListener(type, events[type].bind(app)));
            } else if (type === 'keydown' || type === 'keyup') {
              results.push(window.addEventListener(type, events[type].bind(app)));
            } else if (type.indexOf('keydown.') === 0) {
              key = type.substring(8);
              keyCode = this.keyToKeyCode(key);
              results.push(keydownListeners[keyCode] = events[type]);
            } else if (type.indexOf('keyup.') === 0) {
              key = type.substring(6);
              keyCode = this.keyToKeyCode(key);
              results.push(keyupListeners[keyCode] = events[type]);
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }]);

      return InputManager;
    }();

    // Map from keyIdentifiers/keyValues to keyCode


    InputManager.prototype.keyToKeyCodeMap = {
      Backspace: 8,
      Tab: 9,
      Enter: 13,
      Shift: 16,
      Control: 17,
      Alt: 18,
      CapsLock: 20,
      Escape: 27,
      ' ': 32, // Space
      PageUp: 33,
      PageDown: 34,
      End: 35,
      Home: 36,
      ArrowLeft: 37,
      ArrowUp: 38,
      ArrowRight: 39,
      ArrowDown: 40,
      Delete: 46,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      A: 65,
      B: 66,
      C: 67,
      D: 68,
      E: 69,
      F: 70,
      G: 71,
      H: 72,
      I: 73,
      J: 74,
      K: 75,
      L: 76,
      M: 77,
      N: 78,
      O: 79,
      P: 80,
      Q: 81,
      R: 82,
      S: 83,
      T: 84,
      U: 85,
      V: 86,
      W: 87,
      X: 88,
      Y: 89,
      Z: 90,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      '`': 192,
      '=': 187,
      ',': 188,
      '-': 189,
      '.': 190,
      '/': 191,
      ';': 186,
      "'": 222,
      '[': 219,
      ']': 221,
      '\\': 220
    };

    // Map from not standard, but commonly known keyValues/keyIdentifiers to keyCode
    InputManager.prototype.keyAliasToKeyMap = {
      Ctrl: 'Control', // 17
      Ctl: 'Control', // 17
      Esc: 'Escape', // 27
      Space: ' ', // 32
      PgUp: 'PageUp', // 33
      'Page Up': 'PageUp', // 33
      PgDn: 'PageDown', // 34
      'Page Down': 'PageDown', // 34
      Left: 'ArrowLeft', // 37
      Up: 'ArrowUp', // 38
      Right: 'ArrowRight', // 39
      Down: 'ArrowDown', // 40
      Del: 'Delete' // 46
    };

    return InputManager;
  }();

  var InputManager$1 = InputManager;

  // Declarative framework for Bu.js apps
  var App;
  var hasProp$2 = {}.hasOwnProperty;

  App = function () {
    function App() {
      var $options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, App);

      var base, i, k, len, ref;
      this.$options = $options;
      ref = ["renderer", "data", "objects", "methods", "events"];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        (base = this.$options)[k] || (base[k] = {});
      }
      this.$inputManager = new InputManager$1();
      Bu.ready(this.init, this);
    }

    _createClass(App, [{
      key: 'init',
      value: function init() {
        var _this8 = this,
            _arguments2 = arguments;

        var _assembleObjects, k, name, objects, ref, scene;
        // scene
        scene = new Scene$1();
        scene.background = this.$options.background || Scene$1.DEFAULT_BACKGROUND;
        // renderer
        this.$renderer = new Renderer$1(this.$options.renderer);
        this.$renderer.scene = scene;
        scene.renderer = this.$renderer;
        // data
        if (Bu.isFunction(this.$options.data)) {
          this.$options.data = this.$options.data.apply(this);
        }
        for (k in this.$options.data) {
          this[k] = this.$options.data[k];
        }
        for (k in this.$options.methods) {
          // methods
          this[k] = this.$options.methods[k];
        }
        // objects
        objects = Bu.isFunction(this.$options.objects) ? this.$options.objects.apply(this) : this.$options.objects;
        for (name in objects) {
          this[name] = objects[name];
        }
        // create default scene tree
        if (!this.$options.scene) {
          this.$options.scene = {};
          for (name in objects) {
            this.$options.scene[name] = {};
          }
        }
        // assemble scene tree
        // TODO use an algorithm to avoid circular structure
        _assembleObjects = function assembleObjects(children, parent) {
          var results;
          results = [];
          for (name in children) {
            if (!hasProp$2.call(children, name)) continue;
            parent.addChild(objects[name]);
            results.push(_assembleObjects(children[name], objects[name]));
          }
          return results;
        };
        _assembleObjects(this.$options.scene, this.$renderer.scene);
        // init
        if ((ref = this.$options.init) != null) {
          ref.call(this);
        }
        // events
        this.$inputManager.handleAppEvents(this, this.$options.events);
        // update
        if (this.$options.update != null) {
          return this.$renderer.on('update', function () {
            return _this8.$options.update.apply(_this8, _arguments2);
          });
        }
      }
    }]);

    return App;
  }();

  var App$1 = App;

  // Audio
  var Audio;

  Audio = function () {
    function Audio(url) {
      _classCallCheck(this, Audio);

      this.audio = document.createElement('audio');
      this.url = '';
      this.ready = false;
      if (url) {
        this.load(url);
      }
    }

    _createClass(Audio, [{
      key: 'load',
      value: function load(url) {
        var _this9 = this;

        this.url = url;
        this.audio.addEventListener('canplay', function () {
          return _this9.ready = true;
        });
        return this.audio.src = url;
      }
    }, {
      key: 'play',
      value: function play() {
        if (this.ready) {
          return this.audio.play();
        } else {
          return console.warn('The audio file ' + this.url + ' hasn\'t been ready.');
        }
      }
    }]);

    return Audio;
  }();

  var Audio$1 = Audio;

  // Render text around a point
  var PointText;

  PointText = function () {
    var PointText = function (_Object2D$3) {
      _inherits(PointText, _Object2D$3);

      /*
      options.align:
      ----------------------
      |   --    0-    +-   |
      |         |↙00      |
      |   -0  --+->   +0   |
      |         ↓          |
      |   -+    0+    ++   |
      ----------------------
      for example: text is in the right top of the point, then align = "+-"
       */
      function PointText(text) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, PointText);

        var options;

        var _this10 = _possibleConstructorReturn(this, (PointText.__proto__ || Object.getPrototypeOf(PointText)).call(this));

        _this10.text = text;
        _this10.x = x;
        _this10.y = y;
        _this10.type = 'PointText';
        _this10.strokeStyle = null; // no stroke by default
        _this10.fillStyle = 'black';
        options = Bu.combineOptions(arguments, {
          align: '00'
        });
        _this10.align = options.align;
        if (options.font != null) {
          _this10.font = options.font;
        } else if (options.fontFamily != null || options.fontSize != null) {
          _this10._fontFamily = options.fontFamily || Bu.DEFAULT_FONT_FAMILY;
          _this10._fontSize = options.fontSize || Bu.DEFAULT_FONT_SIZE;
          _this10.font = _this10._fontSize + 'px ' + _this10._fontFamily;
        } else {
          _this10.font = null;
        }
        return _this10;
      }

      _createClass(PointText, [{
        key: 'setAlign',
        value: function setAlign(align) {
          var alignX, alignY;
          if (align.length === 1) {
            align = '' + align + align;
          }
          alignX = align.substring(0, 1);
          alignY = align.substring(1, 2);
          this.textAlign = function () {
            switch (alignX) {
              case '-':
                return 'right';
              case '0':
                return 'center';
              case '+':
                return 'left';
            }
          }();
          this.textBaseline = function () {
            switch (alignY) {
              case '-':
                return 'bottom';
              case '0':
                return 'middle';
              case '+':
                return 'top';
            }
          }();
          return this;
        }
      }, {
        key: 'setFontFamily',
        value: function setFontFamily(family) {
          this.fontFamily = family;
          return this;
        }
      }, {
        key: 'setFontSize',
        value: function setFontSize(size) {
          this.fontSize = size;
          return this;
        }
      }]);

      return PointText;
    }(Object2D$1);

    PointText.property('align', {
      get: function get() {
        return this._align;
      },
      set: function set(val) {
        this._align = val;
        return this.setAlign(this._align);
      }
    });

    PointText.property('fontFamily', {
      get: function get() {
        return this._fontFamily;
      },
      set: function set(val) {
        this._fontFamily = val;
        return this.font = this._fontSize + 'px ' + this._fontFamily;
      }
    });

    PointText.property('fontSize', {
      get: function get() {
        return this._fontSize;
      },
      set: function set(val) {
        this._fontSize = val;
        return this.font = this._fontSize + 'px ' + this._fontFamily;
      }
    });

    return PointText;
  }();

  var PointText$1 = PointText;

  // point shape
  var Point;

  Point = function () {
    var Point = function (_Object2D$4) {
      _inherits(Point, _Object2D$4);

      function Point() {
        var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, Point);

        var _this11 = _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));

        _this11.x = x1;
        _this11.y = y1;
        _this11.lineWidth = 0.5;
        _this11._labelIndex = -1;
        return _this11;
      }

      _createClass(Point, [{
        key: 'clone',
        value: function clone() {
          return new Point(this.x, this.y);
        }
      }, {
        key: 'arcTo',
        value: function arcTo(radius, arc) {
          return new Point(this.x + Math.cos(arc) * radius, this.y + Math.sin(arc) * radius);
        }

        // copy value from other line

      }, {
        key: 'copy',
        value: function copy(point) {
          this.x = point.x;
          this.y = point.y;
          this.updateLabel();
          return this;
        }

        // set value from x, y

      }, {
        key: 'set',
        value: function set(x, y) {
          this.x = x;
          this.y = y;
          this.updateLabel();
          return this;
        }

        // set label text

      }, {
        key: 'setLabel',
        value: function setLabel(text) {
          this.label = text;
          this.updateLabel();
          return this;
        }
      }, {
        key: 'updateLabel',
        value: function updateLabel() {
          if (this._labelIndex > -1) {
            this.children[this._labelIndex].x = this.x + Bu.POINT_LABEL_OFFSET;
            this.children[this._labelIndex].y = this.y;
          }
          return this;
        }
      }]);

      return Point;
    }(Object2D$1);

    Point.prototype.type = 'Point';

    Point.prototype.fillable = true;

    Point.property('label', {
      get: function get() {
        if (this._labelIndex > -1) {
          return this.children[this._labelIndex].text;
        } else {
          return '';
        }
      },
      set: function set(val) {
        var pointText;
        if (this._labelIndex === -1) {
          pointText = new PointText$1(val, this.x + Bu.POINT_LABEL_OFFSET, this.y, {
            align: '+0'
          });
          this.children.push(pointText);
          return this._labelIndex = this.children.length - 1;
        } else {
          return this.children[this._labelIndex].text = val;
        }
      }
    });

    return Point;
  }();

  var Point$1 = Point;

  // line shape
  var Line;

  Line = function () {
    var Line = function (_Object2D$5) {
      _inherits(Line, _Object2D$5);

      function Line(p1, p2, p3, p4) {
        _classCallCheck(this, Line);

        var _this12 = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));

        if (arguments.length < 2) {
          _this12.points = [new Point$1(), new Point$1()];
        } else if (arguments.length < 4) {
          _this12.points = [p1.clone(), p2.clone() // len >= 4
          ];
        } else {
          _this12.points = [new Point$1(p1, p2), new Point$1(p3, p4)];
        }
        _this12.length = 0;
        _this12.midpoint = new Point$1();
        _this12.keyPoints = _this12.points;
        _this12.on("changed", function () {
          _this12.length = _this12.points[0].distanceTo(_this12.points[1]);
          return _this12.midpoint.set((_this12.points[0].x + _this12.points[1].x) / 2, (_this12.points[0].y + _this12.points[1].y) / 2);
        });
        _this12.trigger("changed");
        return _this12;
      }

      _createClass(Line, [{
        key: 'clone',
        value: function clone() {
          return new Line(this.points[0], this.points[1]);
        }

        // edit

      }, {
        key: 'set',
        value: function set(a1, a2, a3, a4) {
          if (typeof p4 !== "undefined" && p4 !== null) {
            this.points[0].set(a1, a2);
            this.points[1].set(a3, a4);
          } else {
            this.points[0] = a1;
            this.points[1] = a2;
          }
          this.trigger("changed");
          return this;
        }
      }, {
        key: 'setPoint1',
        value: function setPoint1(a1, a2) {
          if (a2 != null) {
            this.points[0].set(a1, a2);
          } else {
            this.points[0].copy(a1);
          }
          this.trigger("changed");
          return this;
        }
      }, {
        key: 'setPoint2',
        value: function setPoint2(a1, a2) {
          if (a2 != null) {
            this.points[1].set(a1, a2);
          } else {
            this.points[1].copy(a1);
          }
          this.trigger("changed");
          return this;
        }
      }]);

      return Line;
    }(Object2D$1);

    Line.prototype.type = 'Line';

    Line.prototype.fillable = false;

    return Line;
  }();

  var Line$1 = Line;

  // Bow shape
  var Bow;

  Bow = function () {
    var Bow = function (_Object2D$6) {
      _inherits(Bow, _Object2D$6);

      function Bow(cx, cy, radius, aFrom, aTo) {
        _classCallCheck(this, Bow);

        var _this13 = _possibleConstructorReturn(this, (Bow.__proto__ || Object.getPrototypeOf(Bow)).call(this));

        _this13.cx = cx;
        _this13.cy = cy;
        _this13.radius = radius;
        _this13.aFrom = aFrom;
        _this13.aTo = aTo;
        if (_this13.aFrom > _this13.aTo) {
          var _ref2 = [_this13.aTo, _this13.aFrom];
          _this13.aFrom = _ref2[0];
          _this13.aTo = _ref2[1];
        }
        _this13.center = new Point$1(_this13.cx, _this13.cy);
        _this13.string = new Line$1(_this13.center.arcTo(_this13.radius, _this13.aFrom), _this13.center.arcTo(_this13.radius, _this13.aTo));
        _this13.keyPoints = _this13.string.points;
        _this13.updateKeyPoints();
        _this13.on('changed', _this13.updateKeyPoints);
        _this13.on('changed', function () {
          var ref;
          return (ref = _this13.bounds) != null ? ref.update() : void 0;
        });
        return _this13;
      }

      _createClass(Bow, [{
        key: 'clone',
        value: function clone() {
          return new Bow(this.cx, this.cy, this.radius, this.aFrom, this.aTo);
        }
      }, {
        key: 'updateKeyPoints',
        value: function updateKeyPoints() {
          this.center.set(this.cx, this.cy);
          this.string.points[0].copy(this.center.arcTo(this.radius, this.aFrom));
          this.string.points[1].copy(this.center.arcTo(this.radius, this.aTo));
          this.keyPoints = this.string.points;
          return this;
        }
      }]);

      return Bow;
    }(Object2D$1);

    Bow.prototype.type = 'Bow';

    Bow.prototype.fillable = true;

    return Bow;
  }();

  var Bow$1 = Bow;

  // Circle shape
  var Circle;

  Circle = function () {
    var Circle = function (_Object2D$7) {
      _inherits(Circle, _Object2D$7);

      function Circle() {
        var _radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, Circle);

        var _this14 = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));

        _this14._radius = _radius;
        _this14._center = new Point$1(cx, cy);
        _this14.bounds = null; // for accelerate contain test
        _this14.keyPoints = [_this14._center];
        _this14.on('centerChanged', _this14.updateKeyPoints);
        return _this14;
      }

      _createClass(Circle, [{
        key: 'clone',
        value: function clone() {
          return new Circle(this.radius, this.cx, this.cy);
        }
      }, {
        key: 'updateKeyPoints',
        value: function updateKeyPoints() {
          return this.keyPoints[0].set(this.cx, this.cy);
        }
      }]);

      return Circle;
    }(Object2D$1);

    Circle.prototype.type = 'Circle';

    Circle.prototype.fillable = true;

    // property
    Circle.property('cx', {
      get: function get() {
        return this._center.x;
      },
      set: function set(val) {
        this._center.x = val;
        return this.trigger('centerChanged', this);
      }
    });

    Circle.property('cy', {
      get: function get() {
        return this._center.y;
      },
      set: function set(val) {
        this._center.y = val;
        return this.trigger('centerChanged', this);
      }
    });

    Circle.property('center', {
      get: function get() {
        return this._center;
      },
      set: function set(val) {
        this._center = val;
        this.cx = val.x;
        this.cy = val.y;
        this.keyPoints[0] = val;
        return this.trigger('centerChanged', this);
      }
    });

    Circle.property('radius', {
      get: function get() {
        return this._radius;
      },
      set: function set(val) {
        this._radius = val;
        this.trigger('radiusChanged', this);
        return this;
      }
    });

    return Circle;
  }();

  var Circle$1 = Circle;

  // Ellipse/Oval Shape
  var Ellipse;

  Ellipse = function () {
    var Ellipse = function (_Object2D$8) {
      _inherits(Ellipse, _Object2D$8);

      function Ellipse() {
        var _radiusX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

        var _radiusY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

        _classCallCheck(this, Ellipse);

        var _this15 = _possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this));

        _this15._radiusX = _radiusX;
        _this15._radiusY = _radiusY;
        return _this15;
      }

      return Ellipse;
    }(Object2D$1);

    Ellipse.prototype.type = 'Ellipse';

    Ellipse.prototype.fillable = true;

    // property
    Ellipse.property('radiusX', {
      get: function get() {
        return this._radiusX;
      },
      set: function set(val) {
        this._radiusX = val;
        return this.trigger('changed', this);
      }
    });

    Ellipse.property('radiusY', {
      get: function get() {
        return this._radiusY;
      },
      set: function set(val) {
        this._radiusY = val;
        return this.trigger('changed', this);
      }
    });

    return Ellipse;
  }();

  var Ellipse$1 = Ellipse;

  // Fan shape
  var Fan;

  Fan = function () {
    var Fan = function (_Object2D$9) {
      _inherits(Fan, _Object2D$9);

      function Fan(cx, cy, radius, aFrom, aTo) {
        _classCallCheck(this, Fan);

        var _this16 = _possibleConstructorReturn(this, (Fan.__proto__ || Object.getPrototypeOf(Fan)).call(this));

        _this16.cx = cx;
        _this16.cy = cy;
        _this16.radius = radius;
        _this16.aFrom = aFrom;
        _this16.aTo = aTo;
        if (_this16.aFrom > _this16.aTo) {
          var _ref3 = [_this16.aTo, _this16.aFrom];
          _this16.aFrom = _ref3[0];
          _this16.aTo = _ref3[1];
        }
        _this16.center = new Point$1(_this16.cx, _this16.cy);
        _this16.string = new Line$1(_this16.center.arcTo(_this16.radius, _this16.aFrom), _this16.center.arcTo(_this16.radius, _this16.aTo));
        _this16.keyPoints = [_this16.string.points[0], _this16.string.points[1], _this16.center];
        _this16.on('changed', _this16.updateKeyPoints);
        _this16.on('changed', function () {
          var ref;
          return (ref = _this16.bounds) != null ? ref.update() : void 0;
        });
        return _this16;
      }

      _createClass(Fan, [{
        key: 'clone',
        value: function clone() {
          return new Fan(this.cx, this.cy, this.radius, this.aFrom, this.aTo);
        }
      }, {
        key: 'updateKeyPoints',
        value: function updateKeyPoints() {
          this.center.set(this.cx, this.cy);
          this.string.points[0].copy(this.center.arcTo(this.radius, this.aFrom));
          this.string.points[1].copy(this.center.arcTo(this.radius, this.aTo));
          return this;
        }
      }]);

      return Fan;
    }(Object2D$1);

    Fan.prototype.type = 'Fan';

    Fan.prototype.fillable = true;

    return Fan;
  }();

  var Fan$1 = Fan;

  // triangle shape
  var Triangle;

  Triangle = function () {
    var Triangle = function (_Object2D$10) {
      _inherits(Triangle, _Object2D$10);

      function Triangle(p1, p2, p3) {
        _classCallCheck(this, Triangle);

        var x1, x2, x3, y1, y2, y3;

        var _this17 = _possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this));

        if (arguments.length === 6) {
          var _arguments3 = Array.prototype.slice.call(arguments);

          x1 = _arguments3[0];
          y1 = _arguments3[1];
          x2 = _arguments3[2];
          y2 = _arguments3[3];
          x3 = _arguments3[4];
          y3 = _arguments3[5];

          p1 = new Point$1(x1, y1);
          p2 = new Point$1(x2, y2);
          p3 = new Point$1(x3, y3);
        }
        _this17.lines = [new Line$1(p1, p2), new Line$1(p2, p3), new Line$1(p3, p1)];
        //@center = new Point Bu.average(p1.x, p2.x, p3.x), Bu.average(p1.y, p2.y, p3.y)
        _this17.points = [p1, p2, p3];
        _this17.keyPoints = _this17.points;
        _this17.on('changed', _this17.update);
        _this17.on('changed', function () {
          var ref;
          return (ref = _this17.bounds) != null ? ref.update() : void 0;
        });
        return _this17;
      }

      _createClass(Triangle, [{
        key: 'clone',
        value: function clone() {
          return new Triangle(this.points[0], this.points[1], this.points[2]);
        }
      }, {
        key: 'update',
        value: function update() {
          this.lines[0].points[0].copy(this.points[0]);
          this.lines[0].points[1].copy(this.points[1]);
          this.lines[1].points[0].copy(this.points[1]);
          this.lines[1].points[1].copy(this.points[2]);
          this.lines[2].points[0].copy(this.points[2]);
          return this.lines[2].points[1].copy(this.points[0]);
        }
      }]);

      return Triangle;
    }(Object2D$1);

    Triangle.prototype.type = 'Triangle';

    Triangle.prototype.fillable = true;

    return Triangle;
  }();

  var Triangle$1 = Triangle;

  // polygon shape
  var Polygon;

  Polygon = function () {
    var Polygon = function (_Object2D$11) {
      _inherits(Polygon, _Object2D$11);

      /*
         constructors
         1. Polygon(points)
         2. Polygon(x, y, radius, n, options): to generate regular polygon
         	options: angle - start angle of regular polygon
      */
      function Polygon(points) {
        _classCallCheck(this, Polygon);

        var n, options, radius, x, y;

        var _this18 = _possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this));

        _this18.vertices = [];
        _this18.lines = [];
        _this18.triangles = [];
        options = Bu.combineOptions(arguments, {
          angle: 0
        });
        if (Bu.isArray(points)) {
          if (points != null) {
            _this18.vertices = points;
          }
        } else {
          if (arguments.length < 4) {
            x = 0;
            y = 0;
            radius = arguments[0];
            n = arguments[1];
          } else {
            x = arguments[0];
            y = arguments[1];
            radius = arguments[2];
            n = arguments[3];
          }
          _this18.vertices = Polygon.generateRegularPoints(x, y, radius, n, options);
        }
        _this18.onVerticesChanged();
        _this18.on('changed', _this18.onVerticesChanged);
        _this18.on('changed', function () {
          var ref;
          return (ref = _this18.bounds) != null ? ref.update() : void 0;
        });
        _this18.keyPoints = _this18.vertices;
        return _this18;
      }

      _createClass(Polygon, [{
        key: 'clone',
        value: function clone() {
          return new Polygon(this.vertices);
        }
      }, {
        key: 'onVerticesChanged',
        value: function onVerticesChanged() {
          var i, k, l, ref, ref1, results;
          this.lines = [];
          this.triangles = [];
          // init lines
          if (this.vertices.length > 1) {
            for (i = k = 0, ref = this.vertices.length - 1; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
              this.lines.push(new Line$1(this.vertices[i], this.vertices[i + 1]));
            }
            this.lines.push(new Line$1(this.vertices[this.vertices.length - 1], this.vertices[0]));
          }
          // init triangles
          if (this.vertices.length > 2) {
            results = [];
            for (i = l = 1, ref1 = this.vertices.length - 1; 1 <= ref1 ? l < ref1 : l > ref1; i = 1 <= ref1 ? ++l : --l) {
              results.push(this.triangles.push(new Triangle$1(this.vertices[0], this.vertices[i], this.vertices[i + 1])));
            }
            return results;
          }
        }

        // detect

      }, {
        key: 'isSimple',
        value: function isSimple() {
          var i, j, k, l, len, ref, ref1, ref2;
          len = this.lines.length;
          for (i = k = 0, ref = len; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            for (j = l = ref1 = i + 1, ref2 = len; ref1 <= ref2 ? l < ref2 : l > ref2; j = ref1 <= ref2 ? ++l : --l) {
              if (this.lines[i].isCrossWithLine(this.lines[j])) {
                return false;
              }
            }
          }
          return true;
        }

        // edit

      }, {
        key: 'addPoint',
        value: function addPoint(point, insertIndex) {
          if (insertIndex == null) {
            // add point
            this.vertices.push(point);
            // add line
            if (this.vertices.length > 1) {
              this.lines[this.lines.length - 1].points[1] = point;
            }
            if (this.vertices.length > 0) {
              this.lines.push(new Line$1(this.vertices[this.vertices.length - 1], this.vertices[0]));
            }
            // add triangle
            if (this.vertices.length > 2) {
              return this.triangles.push(new Triangle$1(this.vertices[0], this.vertices[this.vertices.length - 2], this.vertices[this.vertices.length - 1]));
            }
          } else {
            return this.vertices.splice(insertIndex, 0, point);
          }
        }

        // TODO add lines and triangles

      }], [{
        key: 'generateRegularPoints',
        value: function generateRegularPoints(cx, cy, radius, n, options) {
          var a, angleDelta, angleSection, i, k, points, r, ref, x, y;
          angleDelta = options.angle;
          r = radius;
          points = [];
          angleSection = Bu.TWO_PI / n;
          for (i = k = 0, ref = n; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            a = i * angleSection + angleDelta;
            x = cx + r * Math.cos(a);
            y = cy + r * Math.sin(a);
            points[i] = new Point$1(x, y);
          }
          return points;
        }
      }]);

      return Polygon;
    }(Object2D$1);

    Polygon.prototype.type = 'Polygon';

    Polygon.prototype.fillable = true;

    return Polygon;
  }();

  var Polygon$1 = Polygon;

  // polyline shape
  var Polyline;

  Polyline = function () {
    var Polyline = function (_Object2D$12) {
      _inherits(Polyline, _Object2D$12);

      function Polyline() {
        var vertices1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Polyline);

        var i, j, ref, vertices;

        var _this19 = _possibleConstructorReturn(this, (Polyline.__proto__ || Object.getPrototypeOf(Polyline)).call(this));

        _this19.vertices = vertices1;
        if (arguments.length > 1) {
          vertices = [];
          for (i = j = 0, ref = arguments.length / 2; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            vertices.push(new Point$1(arguments[i * 2], arguments[i * 2 + 1]));
          }
          _this19.vertices = vertices;
        }
        _this19.lines = [];
        _this19.keyPoints = _this19.vertices;
        _this19.fill(false);
        _this19.on("changed", function () {
          if (_this19.vertices.length > 1) {
            _this19.updateLines();
            if (typeof _this19.calcLength === "function") {
              _this19.calcLength();
            }
            return typeof _this19.calcPointNormalizedPos === "function" ? _this19.calcPointNormalizedPos() : void 0;
          }
        });
        _this19.trigger("changed");
        return _this19;
      }

      _createClass(Polyline, [{
        key: 'clone',
        value: function clone() {
          var polyline;
          polyline = new Polyline(this.vertices);
          polyline.strokeStyle = this.strokeStyle;
          polyline.fillStyle = this.fillStyle;
          polyline.dashStyle = this.dashStyle;
          polyline.lineWidth = this.lineWidth;
          polyline.dashOffset = this.dashOffset;
          return polyline;
        }
      }, {
        key: 'updateLines',
        value: function updateLines() {
          var i, j, ref;
          for (i = j = 0, ref = this.vertices.length - 1; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            if (this.lines[i] != null) {
              this.lines[i].set(this.vertices[i], this.vertices[i + 1]);
            } else {
              this.lines[i] = new Line$1(this.vertices[i], this.vertices[i + 1]);
            }
          }
          return this;
        }
      }, {
        key: 'addPoint',
        value: function addPoint(point, insertIndex) {
          if (insertIndex == null) {
            // add point
            this.vertices.push(point);
            // add line
            if (this.vertices.length > 1) {
              this.lines.push(new Line$1(this.vertices[this.vertices.length - 2], this.vertices[this.vertices.length - 1]));
            }
          } else {
            this.vertices.splice(insertIndex, 0, point);
          }
          // TODO add lines
          this.trigger("changed");
          return this;
        }
      }]);

      return Polyline;
    }(Object2D$1);

    Polyline.prototype.type = 'Polyline';

    Polyline.prototype.fillable = false;

    // edit
    return Polyline;
  }();

  var Polyline$1 = Polyline;

  // rectangle shape
  var Rectangle;

  Rectangle = function () {
    var Rectangle = function (_Object2D$13) {
      _inherits(Rectangle, _Object2D$13);

      function Rectangle(x, y, width, height) {
        var cornerRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        _classCallCheck(this, Rectangle);

        var _this20 = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this));

        _this20.center = new Point$1(x + width / 2, y + height / 2);
        _this20.size = new Size$1(width, height);
        _this20.pointLT = new Point$1(x, y);
        _this20.pointRT = new Point$1(x + width, y);
        _this20.pointRB = new Point$1(x + width, y + height);
        _this20.pointLB = new Point$1(x, y + height);
        _this20.points = [_this20.pointLT, _this20.pointRT, _this20.pointRB, _this20.pointLB];
        _this20.cornerRadius = cornerRadius;
        _this20.on('changed', function () {
          var ref;
          return (ref = _this20.bounds) != null ? ref.update() : void 0;
        });
        return _this20;
      }

      _createClass(Rectangle, [{
        key: 'clone',
        value: function clone() {
          return new Rectangle(this.pointLT.x, this.pointLT.y, this.size.width, this.size.height);
        }
      }, {
        key: 'set',
        value: function set(x, y, width, height) {
          this.center.set(x + width / 2, y + height / 2);
          this.size.set(width, height);
          this.pointLT.set(x, y);
          this.pointRT.set(x + width, y);
          this.pointRB.set(x + width, y + height);
          return this.pointLB.set(x, y + height);
        }
      }]);

      return Rectangle;
    }(Object2D$1);

    Rectangle.prototype.type = 'Rectangle';

    Rectangle.prototype.fillable = true;

    Rectangle.property('cornerRadius', {
      get: function get() {
        return this._cornerRadius;
      },
      set: function set(val) {
        this._cornerRadius = val;
        return this.keyPoints = val > 0 ? [] : this.points;
      }
    });

    return Rectangle;
  }();

  var Rectangle$1 = Rectangle;

  // spline shape
  var Spline;

  Spline = function () {
    var calcControlPoints;

    var Spline = function (_Object2D$14) {
      _inherits(Spline, _Object2D$14);

      function Spline(vertices) {
        _classCallCheck(this, Spline);

        var polyline;

        var _this21 = _possibleConstructorReturn(this, (Spline.__proto__ || Object.getPrototypeOf(Spline)).call(this));

        if (vertices instanceof Polyline$1) {
          polyline = vertices;
          _this21.vertices = polyline.vertices;
          polyline.on('pointChange', function (polyline) {
            _this21.vertices = polyline.vertices;
            return calcControlPoints(_this21);
          });
        } else {
          _this21.vertices = Bu.clone(vertices);
        }
        _this21.keyPoints = _this21.vertices;
        _this21.controlPointsAhead = [];
        _this21.controlPointsBehind = [];
        _this21.fill(false);
        _this21.smoothFactor = Bu.DEFAULT_SPLINE_SMOOTH;
        _this21._smoother = false;
        calcControlPoints(_this21);
        return _this21;
      }

      _createClass(Spline, [{
        key: 'clone',
        value: function clone() {
          return new Spline(this.vertices);
        }
      }, {
        key: 'addPoint',
        value: function addPoint(point) {
          this.vertices.push(point);
          return calcControlPoints(this);
        }
      }]);

      return Spline;
    }(Object2D$1);

    Spline.prototype.type = 'Spline';

    Spline.prototype.fillable = false;

    Spline.property('smoother', {
      get: function get() {
        return this._smoother;
      },
      set: function set(val) {
        var oldVal;
        oldVal = this._smoother;
        this._smoother = val;
        if (oldVal !== this._smoother) {
          return calcControlPoints(this);
        }
      }
    });

    calcControlPoints = function calcControlPoints(spline) {
      var i, j, len, len1, len2, p, ref, results, theta, theta1, theta2, xA, xB, yA, yB;
      spline.keyPoints = spline.vertices;
      p = spline.vertices;
      len = p.length;
      if (len >= 1) {
        spline.controlPointsBehind[0] = p[0];
      }
      if (len >= 2) {
        spline.controlPointsAhead[len - 1] = p[len - 1];
      }
      if (len >= 3) {
        results = [];
        for (i = j = 1, ref = len - 1; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
          theta1 = Math.atan2(p[i].y - p[i - 1].y, p[i].x - p[i - 1].x);
          theta2 = Math.atan2(p[i + 1].y - p[i].y, p[i + 1].x - p[i].x);
          len1 = Bu.bevel(p[i].y - p[i - 1].y, p[i].x - p[i - 1].x);
          len2 = Bu.bevel(p[i].y - p[i + 1].y, p[i].x - p[i + 1].x);
          theta = theta1 + (theta2 - theta1) * (spline._smoother ? len1 / (len1 + len2) : 0.5);
          if (Math.abs(theta - theta1) > Bu.HALF_PI) {
            theta += Math.PI;
          }
          xA = p[i].x - len1 * spline.smoothFactor * Math.cos(theta);
          yA = p[i].y - len1 * spline.smoothFactor * Math.sin(theta);
          xB = p[i].x + len2 * spline.smoothFactor * Math.cos(theta);
          yB = p[i].y + len2 * spline.smoothFactor * Math.sin(theta);
          spline.controlPointsAhead[i] = new Point$1(xA, yA);
          results.push(spline.controlPointsBehind[i] = new Point$1(xB, yB));
        }
        return results;
      }
    };

    return Spline;
  }();

  // add control lines for debugging
  //spline.children[i * 2 - 2] = new Bu.Line spline.vertices[i], spline.controlPointsAhead[i]
  //spline.children[i * 2 - 1] =  new Bu.Line spline.vertices[i], spline.controlPointsBehind[i]
  var Spline$1 = Spline;

  // Used to render bitmap to the screen
  var Image$1;

  Image$1 = function () {
    var Image = function (_Object2D$15) {
      _inherits(Image, _Object2D$15);

      function Image(url) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments[3];
        var height = arguments[4];

        _classCallCheck(this, Image);

        var _this22 = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this));

        _this22.url = url;
        _this22.type = 'Image';
        _this22.autoSize = true;
        _this22.size = new Size$1();
        _this22.position = new Vector$1(x, y);
        _this22.center = new Vector$1(x + width / 2, y + height / 2);
        if (width != null) {
          _this22.size.set(width, height);
          _this22.autoSize = false;
        }
        _this22.pivot = new Vector$1(0.5, 0.5);
        _this22._image = new Bu.global.Image();
        _this22.ready = false;
        _this22._image.onload = function (e) {
          if (_this22.autoSize) {
            _this22.size.set(_this22._image.width, _this22._image.height);
          }
          return _this22.ready = true;
        };
        if (_this22.url != null) {
          _this22._image.src = _this22.url;
        }
        return _this22;
      }

      return Image;
    }(Object2D$1);

    Image.property('image', {
      get: function get() {
        return this._image;
      },
      set: function set(val) {
        this._image = val;
        return this.ready = true;
      }
    });

    return Image;
  }();

  var Image$2 = Image$1;

  // AnimationTask is an instance of Animation, run by AnimationRunner
  var AnimationTask;
  var hasProp$4 = {}.hasOwnProperty;

  AnimationTask = function () {
    var interpolateColor, interpolateNum, interpolateVector;

    var AnimationTask = function () {
      function AnimationTask(animation, target) {
        var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        _classCallCheck(this, AnimationTask);

        this.animation = animation;
        this.target = target;
        this.args = args;
        this.startTime = 0;
        this.finished = false;
        this.from = Bu.clone(this.animation.from);
        this.current = Bu.clone(this.animation.from);
        this.to = Bu.clone(this.animation.to);
        this.data = {};
        this.t = 0;
        this.arg = this.args[0];
      }

      _createClass(AnimationTask, [{
        key: 'init',
        value: function init() {
          var ref;
          if ((ref = this.animation.init) != null) {
            ref.call(this.target, this);
          }
          return this.current = Bu.clone(this.from);
        }

        // Change the animation progress to the start

      }, {
        key: 'restart',
        value: function restart() {
          this.startTime = Bu.now();
          return this.finished = false;
        }

        // Change the animation progress to the end

      }, {
        key: 'end',
        value: function end() {
          return this.startTime = Bu.now() - this.animation.duration * 1000;
        }

        // Interpolate `current` according `from`, `to` and `t`

      }, {
        key: 'interpolate',
        value: function interpolate() {
          var key, ref, results;
          if (this.from == null) {
            return;
          }
          if (Bu.isNumber(this.from)) {
            return this.current = interpolateNum(this.from, this.to, this.t);
          } else if (this.from instanceof Color$1) {
            return interpolateColor(this.from, this.to, this.t, this.current);
          } else if (this.from instanceof Vector$1) {
            return interpolateVector(this.from, this.to, this.t, this.current);
          } else if (Bu.isPlainObject(this.from)) {
            ref = this.from;
            results = [];
            for (key in ref) {
              if (!hasProp$4.call(ref, key)) continue;
              if (Bu.isNumber(this.from[key])) {
                results.push(this.current[key] = interpolateNum(this.from[key], this.to[key], this.t));
              } else {
                results.push(interpolateObject(this.from[key], this.to[key], this.t, this.current[key]));
              }
            }
            return results;
          } else {
            return console.error("Animation not support interpolate type: ", this.from);
          }
        }
      }]);

      return AnimationTask;
    }();

    interpolateNum = function interpolateNum(a, b, t) {
      return b * t - a * (t - 1);
    };

    interpolateColor = function interpolateColor(a, b, t, c) {
      return c.setRGBA(interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t));
    };

    interpolateVector = function interpolateVector(a, b, t, c) {
      c.x = interpolateNum(a.x, b.x, t);
      return c.y = interpolateNum(a.y, b.y, t);
    };

    return AnimationTask;
  }();

  var AnimationTask$1 = AnimationTask;

  // animation class and preset animations
  var Animation;
  var hasProp$3 = {}.hasOwnProperty;

  Animation = function () {
    function Animation(options) {
      _classCallCheck(this, Animation);

      this.from = options.from;
      this.to = options.to;
      this.duration = options.duration || 0.5;
      this.easing = options.easing || false;
      this.repeat = !!options.repeat;
      this.init = options.init;
      this.update = options.update;
      this.finish = options.finish;
    }

    _createClass(Animation, [{
      key: 'applyTo',
      value: function applyTo(target, args) {
        var task;
        if (!Bu.isArray(args)) {
          args = [args];
        }
        task = new AnimationTask$1(this, target, args);
        Bu.animationRunner.add(task);
        return task;
      }
    }, {
      key: 'isLegal',
      value: function isLegal() {
        var key, ref;
        if (!(this.from != null && this.to != null)) {
          return true;
        }
        if (Bu.isPlainObject(this.from)) {
          ref = this.from;
          for (key in ref) {
            if (!hasProp$3.call(ref, key)) continue;
            if (this.to[key] == null) {
              return false;
            }
          }
        } else {
          if (this.to == null) {
            return false;
          }
        }
        return true;
      }
    }]);

    return Animation;
  }();

  // Preset Animations
  // Some of the animations are consistent with jQuery UI
  Bu.animations = {
    //----------------------------------------------------------------------
    // Simple
    //----------------------------------------------------------------------
    fadeIn: new Animation({
      update: function update(anim) {
        return this.opacity = anim.t;
      }
    }),
    fadeOut: new Animation({
      update: function update(anim) {
        return this.opacity = 1 - anim.t;
      }
    }),
    spin: new Animation({
      update: function update(anim) {
        return this.rotation = anim.t * Math.PI * 2;
      }
    }),
    spinIn: new Animation({
      init: function init(anim) {
        return anim.data.desScale = anim.arg || 1;
      },
      update: function update(anim) {
        this.opacity = anim.t;
        this.rotation = anim.t * Math.PI * 4;
        return this.scale = anim.t * anim.data.desScale;
      }
    }),
    spinOut: new Animation({
      update: function update(anim) {
        this.opacity = 1 - anim.t;
        this.rotation = anim.t * Math.PI * 4;
        return this.scale = 1 - anim.t;
      }
    }),
    blink: new Animation({
      duration: 0.2,
      from: 0,
      to: 512,
      update: function update(anim) {
        var d;
        d = Math.floor(Math.abs(anim.current - 256));
        return this.fillStyle = 'rgb(' + d + ', ' + d + ', ' + d + ')';
      }
    }),
    shake: new Animation({
      init: function init(anim) {
        anim.data.ox = this.position.x;
        return anim.data.range = anim.arg || 20;
      },
      update: function update(anim) {
        return this.position.x = Math.sin(anim.t * Math.PI * 8) * anim.data.range + anim.data.ox;
      }
    }),
    jump: new Animation({
      init: function init(anim) {
        anim.data.oy = this.position.y;
        return anim.data.height = anim.arg || 100;
      },
      update: function update(anim) {
        return this.position.y = -anim.data.height * Math.sin(anim.t * Math.PI) + anim.data.oy;
      }
    }),
    //----------------------------------------------------------------------
    // Toggled: detect and save original status
    //----------------------------------------------------------------------
    puff: new Animation({
      duration: 0.15,
      init: function init(anim) {
        anim.from = {
          opacity: this.opacity,
          scale: this.scale.x
        };
        return anim.to = this.opacity === 1 ? {
          opacity: 0,
          scale: this.scale.x * 1.5
        } : {
          opacity: 1,
          scale: this.scale.x / 1.5
        };
      },
      update: function update(anim) {
        this.opacity = anim.current.opacity;
        return this.scale = anim.current.scale;
      }
    }),
    clip: new Animation({
      init: function init(anim) {
        if (this.scale.y !== 0) {
          anim.from = this.scale.y;
          return anim.to = 0;
        } else {
          anim.from = this.scale.y;
          return anim.to = this.scale.x;
        }
      },
      update: function update(anim) {
        return this.scale.y = anim.current;
      }
    }),
    flipX: new Animation({
      init: function init(anim) {
        anim.from = this.scale.x;
        return anim.to = -anim.from;
      },
      update: function update(anim) {
        return this.scale.x = anim.current;
      }
    }),
    flipY: new Animation({
      init: function init(anim) {
        anim.from = this.scale.y;
        return anim.to = -anim.from;
      },
      update: function update(anim) {
        return this.scale.y = anim.current;
      }
    }),
    //----------------------------------------------------------------------
    // With Arguments
    //----------------------------------------------------------------------
    moveTo: new Animation({
      init: function init(anim) {
        if (anim.arg != null) {
          anim.from = this.position.x;
          return anim.to = parseFloat(anim.arg);
        } else {
          return console.error('Bu.animations.moveTo need an argument');
        }
      },
      update: function update(anim) {
        return this.position.x = anim.current;
      }
    }),
    moveBy: new Animation({
      init: function init(anim) {
        if (anim.args != null) {
          anim.from = this.position.x;
          return anim.to = this.position.x + parseFloat(anim.args);
        } else {
          return console.error('Bu.animations.moveBy need an argument');
        }
      },
      update: function update(anim) {
        return this.position.x = anim.current;
      }
    }),
    discolor: new Animation({
      init: function init(anim) {
        var desColor;
        desColor = anim.arg;
        if (Bu.isString(desColor)) {
          desColor = new Color$1(desColor);
        }
        anim.from = new Color$1(this.fillStyle);
        return anim.to = desColor;
      },
      update: function update(anim) {
        return this.fillStyle = anim.current.toRGBA();
      }
    })
  };

  var Animation$1 = Animation;

  // Run the animation tasks
  var AnimationRunner;

  AnimationRunner = function () {
    var DEFAULT_EASING_FUNCTION, easingFunctions;

    var AnimationRunner = function () {
      function AnimationRunner() {
        _classCallCheck(this, AnimationRunner);

        this.runningAnimations = [];
      }

      _createClass(AnimationRunner, [{
        key: 'add',
        value: function add(task) {
          task.init();
          if (task.animation.isLegal()) {
            task.startTime = Bu.now();
            return this.runningAnimations.push(task);
          } else {
            return console.error('AnimationRunner: animation setting is illegal: ', task.animation);
          }
        }
      }, {
        key: 'update',
        value: function update() {
          var anim, finish, i, len, now, ref, ref1, results, t, task;
          now = Bu.now();
          ref = this.runningAnimations;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            task = ref[i];
            if (task.finished) {
              continue;
            }
            anim = task.animation;
            t = (now - task.startTime) / (anim.duration * 1000);
            if (t >= 1) {
              finish = true;
              if (anim.repeat) {
                t = 0;
                task.startTime = Bu.now();
              } else {
                // TODO remove the finished tasks out
                t = 1;
                task.finished = true;
              }
            }
            if (anim.easing === true) {
              t = easingFunctions[DEFAULT_EASING_FUNCTION](t);
            } else if (easingFunctions[anim.easing] != null) {
              t = easingFunctions[anim.easing](t);
            }
            task.t = t;
            task.interpolate();
            anim.update.call(task.target, task);
            if (finish) {
              results.push((ref1 = anim.finish) != null ? ref1.call(task.target, task) : void 0);
            } else {
              results.push(void 0);
            }
          }
          return results;
        }

        // Hook up on an renderer, remove own setInternal

      }, {
        key: 'hookUp',
        value: function hookUp(renderer) {
          var _this23 = this;

          return renderer.on('update', function () {
            return _this23.update();
          });
        }
      }]);

      return AnimationRunner;
    }();

    //----------------------------------------------------------------------
    // Private variables
    //----------------------------------------------------------------------


    DEFAULT_EASING_FUNCTION = 'quad';

    easingFunctions = {
      quadIn: function quadIn(t) {
        return t * t;
      },
      quadOut: function quadOut(t) {
        return t * (2 - t);
      },
      quad: function quad(t) {
        if (t < 0.5) {
          return 2 * t * t;
        } else {
          return -2 * t * t + 4 * t - 1;
        }
      },
      cubicIn: function cubicIn(t) {
        return Math.pow(t, 3);
      },
      cubicOut: function cubicOut(t) {
        return Math.pow(t - 1, 3) + 1;
      },
      cubic: function cubic(t) {
        if (t < 0.5) {
          return 4 * Math.pow(t, 3);
        } else {
          return 4 * Math.pow(t - 1, 3) + 1;
        }
      },
      sineIn: function sineIn(t) {
        return Math.sin((t - 1) * Bu.HALF_PI) + 1;
      },
      sineOut: function sineOut(t) {
        return Math.sin(t * Bu.HALF_PI);
      },
      sine: function sine(t) {
        if (t < 0.5) {
          return (Math.sin((t * 2 - 1) * Bu.HALF_PI) + 1) / 2;
        } else {
          return Math.sin((t - 0.5) * Math.PI) / 2 + 0.5;
        }
      }
    };

    return AnimationRunner;
  }();

  // TODO add quart, quint, expo, circ, back, elastic, bounce

  // Define the global unique instance of this class
  Bu.animationRunner = new AnimationRunner();

  var AnimationRunner$1 = AnimationRunner;

  // Manage an Object2D list and update its dashOffset
  var DashFlowManager;

  DashFlowManager = function () {
    function DashFlowManager() {
      _classCallCheck(this, DashFlowManager);

      this.flowingObjects = [];
    }

    _createClass(DashFlowManager, [{
      key: 'setSpeed',
      value: function setSpeed(target, speed) {
        var i;
        target.dashFlowSpeed = speed;
        i = this.flowingObjects.indexOf(target);
        if (speed !== 0) {
          if (i === -1) {
            return this.flowingObjects.push(target);
          }
        } else {
          if (i > -1) {
            return this.flowingObjects.splice(i, 1);
          }
        }
      }
    }, {
      key: 'update',
      value: function update() {
        var j, len, o, ref, results;
        ref = this.flowingObjects;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          o = ref[j];
          results.push(o.dashOffset += o.dashFlowSpeed);
        }
        return results;
      }

      // Hook up on an renderer, remove own setInternal

    }, {
      key: 'hookUp',
      value: function hookUp(renderer) {
        var _this24 = this;

        return renderer.on('update', function () {
          return _this24.update();
        });
      }
    }]);

    return DashFlowManager;
  }();

  // Global unique instance
  Bu.dashFlowManager = new DashFlowManager();

  var DashFlowManager$1 = DashFlowManager;

  // Sprite Sheet
  var SpriteSheet;
  var hasProp$5 = {}.hasOwnProperty;

  SpriteSheet = function () {
    var canvas, clipImage, context;

    var SpriteSheet = function () {
      function SpriteSheet(url) {
        var _this25 = this;

        _classCallCheck(this, SpriteSheet);

        this.url = url;
        Event$1.apply(this);
        this.ready = false; // If this sprite sheet is loaded and parsed.
        this.height = 0; // Height of this sprite
        this.data = null; // The JSON data
        this.images = []; // The `Image` list loaded
        this.frameImages = []; // Parsed frame images

        // load and trigger parseData()
        $.ajax(this.url, {
          success: function success(text) {
            var baseUrl, countLoaded, i, ref, results;
            _this25.data = JSON.parse(text);
            if (_this25.data.images == null) {
              _this25.data.images = [_this25.url.substring(_this25.url.lastIndexOf('/'), _this25.url.length - 5) + '.png'];
            }
            baseUrl = _this25.url.substring(0, _this25.url.lastIndexOf('/') + 1);
            ref = _this25.data.images;
            results = [];
            for (i in ref) {
              if (!hasProp$5.call(ref, i)) continue;
              _this25.data.images[i] = baseUrl + _this25.data.images[i];
              countLoaded = 0;
              _this25.images[i] = new Image();
              _this25.images[i].onload = function () {
                countLoaded += 1;
                if (countLoaded === _this25.data.images.length) {
                  return _this25.parseData();
                }
              };
              results.push(_this25.images[i].src = _this25.data.images[i]);
            }
            return results;
          }
        });
      }

      _createClass(SpriteSheet, [{
        key: 'parseData',
        value: function parseData() {
          var frameIndex, frames, h, i, j, k, ref, w, x, y;
          // Clip the image for every frames
          frames = this.data.frames;
          for (i in frames) {
            if (!hasProp$5.call(frames, i)) continue;
            for (j = k = 0; k <= 4; j = ++k) {
              if (frames[i][j] == null) {
                frames[i][j] = ((ref = frames[i - 1]) != null ? ref[j] : void 0) != null ? frames[i - 1][j] : 0;
              }
            }
            x = frames[i][0];
            y = frames[i][1];
            w = frames[i][2];
            h = frames[i][3];
            frameIndex = frames[i][4];
            this.frameImages[i] = clipImage(this.images[frameIndex], x, y, w, h);
            if (this.height === 0) {
              this.height = h;
            }
          }
          this.ready = true;
          return this.trigger('loaded');
        }
      }, {
        key: 'getFrameImage',
        value: function getFrameImage(key) {
          var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          var animation;
          if (!this.ready) {
            return null;
          }
          animation = this.data.animations[key];
          if (animation == null) {
            return null;
          }
          return this.frameImages[animation.frames[index]];
        }
      }, {
        key: 'measureTextWidth',
        value: function measureTextWidth(text) {
          var char, k, len, width;
          width = 0;
          for (k = 0, len = text.length; k < len; k++) {
            char = text[k];
            width += this.getFrameImage(char).width;
          }
          return width;
        }
      }]);

      return SpriteSheet;
    }();

    //----------------------------------------------------------------------
    // Private members
    //----------------------------------------------------------------------


    canvas = document.createElement('canvas');

    context = canvas.getContext('2d');

    clipImage = function clipImage(image, x, y, w, h) {
      var newImage;
      canvas.width = w;
      canvas.height = h;
      context.drawImage(image, x, y, w, h, 0, 0, w, h);
      newImage = new Image();
      newImage.src = canvas.toDataURL();
      return newImage;
    };

    return SpriteSheet;
  }();

  var SpriteSheet$1 = SpriteSheet;

  // Pan and zoom the camera by the mouse
  // Drag left mouse button to pan, wheel up/down to zoom in/out
  var MouseControl;

  MouseControl = function () {
    var scaleAnimation, translateAnimation;

    var MouseControl = function () {
      function MouseControl(camera, dom) {
        _classCallCheck(this, MouseControl);

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.camera = camera;
        this.zoomScaleAnim = scaleAnimation.applyTo(this.camera);
        this.zoomTransAnim = translateAnimation.applyTo(this.camera);
        this.smoothZooming = true;
        this.desScale = new Vector$1(1, 1);
        dom.addEventListener('mousemove', this.onMouseMove);
        dom.addEventListener('mousewheel', this.onMouseWheel);
      }

      _createClass(MouseControl, [{
        key: 'onMouseMove',
        value: function onMouseMove(e) {
          var dx, dy, scale;
          if (e.buttons === Bu.MOUSE.LEFT) {
            scale = this.camera.scale.x;
            dx = -e.movementX * scale;
            dy = -e.movementY * scale;
            return this.camera.translate(dx, dy);
          }
        }
      }, {
        key: 'onMouseWheel',
        value: function onMouseWheel(e) {
          var deltaScaleAll, deltaScaleStep, dx, dy, mx, my;
          deltaScaleStep = Math.pow(1.25, -e.wheelDelta / 120);
          this.desScale.multiplyScalar(deltaScaleStep);
          deltaScaleAll = this.desScale.x / this.camera.scale.x;
          mx = e.offsetX - $(e.target).width() / 2;
          my = e.offsetY - $(e.target).height() / 2;
          dx = -mx * (deltaScaleAll - 1) * this.camera.scale.x;
          dy = -my * (deltaScaleAll - 1) * this.camera.scale.y;
          if (this.smoothZooming) {
            this.zoomScaleAnim.from.copy(this.camera.scale);
            this.zoomScaleAnim.to.copy(this.desScale);
            this.zoomScaleAnim.restart();
            this.zoomTransAnim.from.copy(this.camera.position);
            this.zoomTransAnim.to.set(this.camera.position.x + dx, this.camera.position.y + dy);
            return this.zoomTransAnim.restart();
          } else {
            this.camera.translate(dx, dy);
            return this.camera.scale.copy(this.desScale);
          }
        }
      }]);

      return MouseControl;
    }();

    scaleAnimation = new Animation$1({
      duration: 0.2,
      init: function init(anim) {
        if (anim.arg == null) {
          anim.arg = 1;
        }
        anim.from = this.scale.clone();
        return anim.to = this.scale.clone().multiplyScalar(parseFloat(anim.arg));
      },
      update: function update(anim) {
        return this.scale = anim.current;
      }
    });

    translateAnimation = new Animation$1({
      duration: 0.2,
      init: function init(anim) {
        if (anim.arg == null) {
          anim.arg = new Vector$1();
        }
        anim.from = this.position.clone();
        return anim.to = this.position.clone().add(anim.arg);
      },
      update: function update(anim) {
        return this.position.copy(anim.current);
      }
    });

    return MouseControl;
  }();

  var MouseControl$1 = MouseControl;

  // Geometry Algorithm Collection
  var G;
  var geometryAlgorithm;
  var indexOf = [].indexOf;
  var hasProp$6 = {}.hasOwnProperty;

  geometryAlgorithm = G = {
    inject: function inject() {
      return this.injectInto(['point', 'line', 'circle', 'ellipse', 'triangle', 'rectangle', 'fan', 'bow', 'polygon', 'polyline']);
    },
    injectInto: function injectInto(shapes) {
      if (Bu.isString(shapes)) {
        shapes = [shapes];
      }
      if (indexOf.call(shapes, 'point') >= 0) {
        Point$1.prototype.inCircle = function (circle) {
          return G.pointInCircle(this, circle);
        };
        Point$1.prototype.distanceTo = function (point) {
          return G.distanceFromPointToPoint(this, point);
        };
        Point$1.prototype.isNear = function (target) {
          var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Bu.DEFAULT_NEAR_DIST;

          switch (target.type) {
            case 'Point':
              return G.pointNearPoint(this, target, limit);
            case 'Line':
              return G.pointNearLine(this, target, limit);
            case 'Polyline':
              return G.pointNearPolyline(this, target, limit);
          }
        };
        Point$1.interpolate = G.interpolateBetweenTwoPoints;
      }
      if (indexOf.call(shapes, 'line') >= 0) {
        Line$1.prototype.distanceTo = function (point) {
          return G.distanceFromPointToLine(point, this);
        };
        Line$1.prototype.isTwoPointsSameSide = function (p1, p2) {
          return G.twoPointsSameSideOfLine(p1, p2, this);
        };
        Line$1.prototype.footPointFrom = function (point, saveTo) {
          return G.footPointFromPointToLine(point, this, saveTo);
        };
        Line$1.prototype.getCrossPointWith = function (line) {
          return G.getCrossPointOfTwoLines(line, this);
        };
        Line$1.prototype.isCrossWithLine = function (line) {
          return G.isTwoLinesCross(line, this);
        };
        Rectangle$1.prototype.intersectRect = function (rect) {
          return G.isLineIntersectRect(this, rect);
        };
      }
      if (indexOf.call(shapes, 'circle') >= 0) {
        Circle$1.prototype._containsPoint = function (point) {
          return G.pointInCircle(point, this);
        };
      }
      if (indexOf.call(shapes, 'ellipse') >= 0) {
        Ellipse$1.prototype._containsPoint = function (point) {
          return G.pointInEllipse(point, this);
        };
      }
      if (indexOf.call(shapes, 'triangle') >= 0) {
        Triangle$1.prototype._containsPoint = function (point) {
          return G.pointInTriangle(point, this);
        };
        Triangle$1.prototype.area = function () {
          return G.calcTriangleArea(this);
        };
      }
      if (indexOf.call(shapes, 'rectangle') >= 0) {
        Rectangle$1.prototype.containsPoint = function (point) {
          return G.pointInRectangle(point, this);
        };
        Rectangle$1.prototype.intersectLine = function (line) {
          return G.isLineIntersectRect(line, this);
        };
      }
      if (indexOf.call(shapes, 'fan') >= 0) {
        Fan$1.prototype._containsPoint = function (point) {
          return G.pointInFan(point, this);
        };
      }
      if (indexOf.call(shapes, 'bow') >= 0) {
        Bow$1.prototype._containsPoint = function (point) {
          return G.pointInBow(point, this);
        };
      }
      if (indexOf.call(shapes, 'polygon') >= 0) {
        Polygon$1.prototype._containsPoint = function (point) {
          return G.pointInPolygon(point, this);
        };
      }
      if (indexOf.call(shapes, 'polyline') >= 0) {
        Polyline$1.prototype.length = 0;
        Polyline$1.prototype.pointNormalizedPos = [];
        Polyline$1.prototype.calcLength = function () {
          return this.length = G.calcPolylineLength(this);
        };
        Polyline$1.prototype.calcPointNormalizedPos = function () {
          return G.calcNormalizedVerticesPosOfPolyline(this);
        };
        Polyline$1.prototype.getNormalizedPos = function (index) {
          if (index != null) {
            return this.pointNormalizedPos[index];
          } else {
            return this.pointNormalizedPos;
          }
        };
        return Polyline$1.prototype.compress = function () {
          var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.8;

          return G.compressPolyline(this, strength);
        };
      }
    },
    // Point in shapes
    pointNearPoint: function pointNearPoint(point, target) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Bu.DEFAULT_NEAR_DIST;

      return point.distanceTo(target) < limit;
    },
    pointNearLine: function pointNearLine(point, line) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Bu.DEFAULT_NEAR_DIST;

      var footPoint, isBetween1, isBetween2, verticalDist;
      verticalDist = line.distanceTo(point);
      footPoint = line.footPointFrom(point);
      isBetween1 = footPoint.distanceTo(line.points[0]) < line.length + limit;
      isBetween2 = footPoint.distanceTo(line.points[1]) < line.length + limit;
      return verticalDist < limit && isBetween1 && isBetween2;
    },
    pointNearPolyline: function pointNearPolyline(point, polyline) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Bu.DEFAULT_NEAR_DIST;

      var j, len1, line, ref;
      ref = polyline.lines;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        line = ref[j];
        if (G.pointNearLine(point, line, limit)) {
          return true;
        }
      }
      return false;
    },
    pointInCircle: function pointInCircle(point, circle) {
      var dx, dy;
      dx = point.x - circle.cx;
      dy = point.y - circle.cy;
      return Bu.bevel(dx, dy) < circle.radius;
    },
    pointInEllipse: function pointInEllipse(point, ellipse) {
      return Bu.bevel(point.x / ellipse.radiusX, point.y / ellipse.radiusY) < 1;
    },
    pointInRectangle: function pointInRectangle(point, rectangle) {
      return point.x > rectangle.pointLT.x && point.y > rectangle.pointLT.y && point.x < rectangle.pointLT.x + rectangle.size.width && point.y < rectangle.pointLT.y + rectangle.size.height;
    },
    pointInTriangle: function pointInTriangle(point, triangle) {
      return G.twoPointsSameSideOfLine(point, triangle.points[2], triangle.lines[0]) && G.twoPointsSameSideOfLine(point, triangle.points[0], triangle.lines[1]) && G.twoPointsSameSideOfLine(point, triangle.points[1], triangle.lines[2]);
    },
    pointInFan: function pointInFan(point, fan) {
      var a, dx, dy;
      dx = point.x - fan.cx;
      dy = point.y - fan.cy;
      a = Math.atan2(point.y - fan.cy, point.x - fan.cx);
      while (a < fan.aFrom) {
        a += Bu.TWO_PI;
      }
      return Bu.bevel(dx, dy) < fan.radius && a > fan.aFrom && a < fan.aTo;
    },
    pointInBow: function pointInBow(point, bow) {
      var sameSide, smallThanHalfCircle;
      if (Bu.bevel(bow.cx - point.x, bow.cy - point.y) < bow.radius) {
        sameSide = bow.string.isTwoPointsSameSide(bow.center, point);
        smallThanHalfCircle = bow.aTo - bow.aFrom < Math.PI;
        return sameSide ^ smallThanHalfCircle;
      } else {
        return false;
      }
    },
    pointInPolygon: function pointInPolygon(point, polygon) {
      var j, len1, ref, triangle;
      ref = polygon.triangles;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        triangle = ref[j];
        if (triangle.containsPoint(point)) {
          return true;
        }
      }
      return false;
    },
    // Distance
    distanceFromPointToPoint: function distanceFromPointToPoint(point1, point2) {
      return Bu.bevel(point1.x - point2.x, point1.y - point2.y);
    },
    distanceFromPointToLine: function distanceFromPointToLine(point, line) {
      var a, b, p1, p2;
      p1 = line.points[0];
      p2 = line.points[1];
      a = (p1.y - p2.y) / (p1.x - p2.x);
      b = p1.y - a * p1.x;
      return Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1);
    },
    // Point Related
    interpolateBetweenTwoPoints: function interpolateBetweenTwoPoints(p1, p2, k, p3) {
      var x, y;
      x = p1.x + (p2.x - p1.x) * k;
      y = p1.y + (p2.y - p1.y) * k;
      if (p3 != null) {
        return p3.set(x, y);
      } else {
        return new Point$1(x, y);
      }
    },
    // Point with Line
    twoPointsSameSideOfLine: function twoPointsSameSideOfLine(p1, p2, line) {
      var pA, pB, y01, y02;
      pA = line.points[0];
      pB = line.points[1];
      if (pA.x === pB.x) {
        // if both of the two points are on the line then we consider they are in the same side
        return (p1.x - pA.x) * (p2.x - pA.x) > 0;
      } else {
        y01 = (pA.y - pB.y) * (p1.x - pA.x) / (pA.x - pB.x) + pA.y;
        y02 = (pA.y - pB.y) * (p2.x - pA.x) / (pA.x - pB.x) + pA.y;
        return (p1.y - y01) * (p2.y - y02) > 0;
      }
    },
    footPointFromPointToLine: function footPointFromPointToLine(point, line) {
      var saveTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point$1();

      var A, B, m, p1, p2, x, y;
      p1 = line.points[0];
      p2 = line.points[1];
      A = (p1.y - p2.y) / (p1.x - p2.x);
      B = p1.y - A * p1.x;
      m = point.x + A * point.y;
      x = (m - A * B) / (A * A + 1);
      y = A * x + B;
      saveTo.set(x, y);
      return saveTo;
    },
    getCrossPointOfTwoLines: function getCrossPointOfTwoLines(line1, line2) {
      var a1, a2, b1, b2, c1, c2, det, p1, p2, q1, q2;

      var _line1$points = _slicedToArray(line1.points, 2);

      p1 = _line1$points[0];
      p2 = _line1$points[1];

      var _line2$points = _slicedToArray(line2.points, 2);

      q1 = _line2$points[0];
      q2 = _line2$points[1];

      a1 = p2.y - p1.y;
      b1 = p1.x - p2.x;
      c1 = a1 * p1.x + b1 * p1.y;
      a2 = q2.y - q1.y;
      b2 = q1.x - q2.x;
      c2 = a2 * q1.x + b2 * q1.y;
      det = a1 * b2 - a2 * b1;
      return new Point$1((b2 * c1 - b1 * c2) / det, (a1 * c2 - a2 * c1) / det);
    },
    isTwoLinesCross: function isTwoLinesCross(line1, line2) {
      var d, x0, x1, x2, x3, x4, y0, y1, y2, y3, y4;
      x1 = line1.points[0].x;
      y1 = line1.points[0].y;
      x2 = line1.points[1].x;
      y2 = line1.points[1].y;
      x3 = line2.points[0].x;
      y3 = line2.points[0].y;
      x4 = line2.points[1].x;
      y4 = line2.points[1].y;
      d = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1);
      if (d === 0) {
        return false;
      } else {
        x0 = ((x2 - x1) * (x4 - x3) * (y3 - y1) + (y2 - y1) * (x4 - x3) * x1 - (y4 - y3) * (x2 - x1) * x3) / d;
        y0 = ((y2 - y1) * (y4 - y3) * (x3 - x1) + (x2 - x1) * (y4 - y3) * y1 - (x4 - x3) * (y2 - y1) * y3) / -d;
      }
      return (x0 - x1) * (x0 - x2) <= 0 && (x0 - x3) * (x0 - x4) <= 0 && (y0 - y1) * (y0 - y2) <= 0 && (y0 - y3) * (y0 - y4) <= 0;
    },
    // Line with rectangle
    isLineIntersectRect: function isLineIntersectRect(line, rect) {
      var lines;
      lines = [new Line$1(), new Line$1(), new Line$1(), new Line$1()];
      lines[0].set(rect.points[0], rect.points[1]);
      lines[1].set(rect.points[1], rect.points[2]);
      lines[2].set(rect.points[2], rect.points[3]);
      lines[3].set(rect.points[3], rect.points[0]);
      // console.log line.points[0].x, line.points[0].y, rect.points[0].x, rect.points[0].y
      return G.isTwoLinesCross(line, lines[0]) || G.isTwoLinesCross(line, lines[1]) || G.isTwoLinesCross(line, lines[2]) || G.isTwoLinesCross(line, lines[3]);
    },
    // Polyline
    calcPolylineLength: function calcPolylineLength(polyline) {
      var i, j, len, ref;
      len = 0;
      if (polyline.vertices.length >= 2) {
        for (i = j = 1, ref = polyline.vertices.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
          len += polyline.vertices[i].distanceTo(polyline.vertices[i - 1]);
        }
      }
      return len;
    },
    calcNormalizedVerticesPosOfPolyline: function calcNormalizedVerticesPosOfPolyline(polyline) {
      var currPos, i, j, ref, results;
      currPos = 0;
      polyline.pointNormalizedPos[0] = 0;
      results = [];
      for (i = j = 1, ref = polyline.vertices.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
        currPos += polyline.vertices[i].distanceTo(polyline.vertices[i - 1]) / polyline.length;
        results.push(polyline.pointNormalizedPos[i] = currPos);
      }
      return results;
    },
    compressPolyline: function compressPolyline(polyline, strength) {
      var compressed, i, obliqueAngle, pA, pB, pM, ref;
      compressed = [];
      ref = polyline.vertices;
      for (i in ref) {
        if (!hasProp$6.call(ref, i)) continue;
        if (i < 2) {
          compressed[i] = polyline.vertices[i];
        } else {
          var _compressed$slice = compressed.slice(-2);

          var _compressed$slice2 = _slicedToArray(_compressed$slice, 2);

          pA = _compressed$slice2[0];
          pM = _compressed$slice2[1];

          pB = polyline.vertices[i];
          obliqueAngle = Math.abs(Math.atan2(pA.y - pM.y, pA.x - pM.x) - Math.atan2(pM.y - pB.y, pM.x - pB.x));
          if (obliqueAngle < strength * strength * Bu.HALF_PI) {
            compressed[compressed.length - 1] = pB;
          } else {
            compressed.push(pB);
          }
        }
      }
      polyline.vertices = compressed;
      polyline.keyPoints = polyline.vertices;
      return polyline;
    },
    // Area Calculation
    calcTriangleArea: function calcTriangleArea(triangle) {
      var a, b, c;

      var _triangle$points = _slicedToArray(triangle.points, 3);

      a = _triangle$points[0];
      b = _triangle$points[1];
      c = _triangle$points[2];

      return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
    }
  };

  G.inject();

  var geometryAlgorithm$1 = geometryAlgorithm;

  // Used to generate random shapes
  var ShapeRandomizer;

  ShapeRandomizer = function () {
    var MARGIN;

    var ShapeRandomizer = function () {
      function ShapeRandomizer() {
        _classCallCheck(this, ShapeRandomizer);
      }

      _createClass(ShapeRandomizer, [{
        key: 'randomX',
        value: function randomX() {
          return Bu.rand(this.rangeX + MARGIN, this.rangeX + this.rangeWidth - MARGIN * 2);
        }
      }, {
        key: 'randomY',
        value: function randomY() {
          return Bu.rand(this.rangeY + MARGIN, this.rangeY + this.rangeHeight - MARGIN * 2);
        }
      }, {
        key: 'randomRadius',
        value: function randomRadius() {
          return Bu.rand(10, Math.min(this.rangeX + this.rangeWidth, this.rangeY + this.rangeHeight) / 2);
        }
      }, {
        key: 'setRange',
        value: function setRange(a, b, c, d) {
          if (c != null) {
            this.rangeX = a;
            this.rangeY = b;
            this.rangeWidth = c;
            this.rangeHeight = d;
          } else {
            this.rangeWidth = a;
            this.rangeHeight = b;
          }
          return this;
        }
      }, {
        key: 'generate',
        value: function generate(type) {
          switch (type) {
            case 'circle':
              return this.generateCircle();
            case 'bow':
              return this.generateBow();
            case 'triangle':
              return this.generateTriangle();
            case 'rectangle':
              return this.generateRectangle();
            case 'fan':
              return this.generateFan();
            case 'polygon':
              return this.generatePolygon();
            case 'line':
              return this.generateLine();
            case 'polyline':
              return this.generatePolyline();
            default:
              return console.warn('not support shape: ' + type);
          }
        }
      }, {
        key: 'randomize',
        value: function randomize(shape) {
          var j, len, s;
          if (Bu.isArray(shape)) {
            for (j = 0, len = shape.length; j < len; j++) {
              s = shape[j];
              this.randomize(s);
            }
          } else {
            switch (shape.type) {
              case 'Circle':
                this.randomizeCircle(shape);
                break;
              case 'Ellipse':
                this.randomizeEllipse(shape);
                break;
              case 'Bow':
                this.randomizeBow(shape);
                break;
              case 'Triangle':
                this.randomizeTriangle(shape);
                break;
              case 'Rectangle':
                this.randomizeRectangle(shape);
                break;
              case 'Fan':
                this.randomizeFan(shape);
                break;
              case 'Polygon':
                this.randomizePolygon(shape);
                break;
              case 'Line':
                this.randomizeLine(shape);
                break;
              case 'Polyline':
                this.randomizePolyline(shape);
                break;
              default:
                console.warn('not support shape: ' + shape.type);
            }
          }
          return this;
        }
      }, {
        key: 'randomizePosition',
        value: function randomizePosition(shape) {
          shape.position.x = this.randomX();
          shape.position.y = this.randomY();
          shape.trigger('changed');
          return this;
        }
      }, {
        key: 'generateCircle',
        value: function generateCircle() {
          var circle;
          circle = new Circle$1(this.randomRadius(), this.randomX(), this.randomY());
          circle.center.label = 'O';
          return circle;
        }
      }, {
        key: 'randomizeCircle',
        value: function randomizeCircle(circle) {
          circle.cx = this.randomX();
          circle.cy = this.randomY();
          circle.radius = this.randomRadius();
          return this;
        }
      }, {
        key: 'generateEllipse',
        value: function generateEllipse() {
          var ellipse;
          ellipse = new Bu.Ellipse(this.randomRadius(), this.randomRadius());
          this.randomizePosition(ellipse);
          return ellipse;
        }
      }, {
        key: 'randomizeEllipse',
        value: function randomizeEllipse(ellipse) {
          ellipse.radiusX = this.randomRadius();
          ellipse.radiusY = this.randomRadius();
          this.randomizePosition(ellipse);
          return this;
        }
      }, {
        key: 'generateBow',
        value: function generateBow() {
          var aFrom, aTo, bow;
          aFrom = Bu.rand(Bu.TWO_PI);
          aTo = aFrom + Bu.rand(Bu.HALF_PI, Bu.TWO_PI);
          bow = new Bow$1(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
          bow.string.points[0].label = 'A';
          bow.string.points[1].label = 'B';
          return bow;
        }
      }, {
        key: 'randomizeBow',
        value: function randomizeBow(bow) {
          var aFrom, aTo;
          aFrom = Bu.rand(Bu.TWO_PI);
          aTo = aFrom + Bu.rand(Bu.HALF_PI, Bu.TWO_PI);
          bow.cx = this.randomX();
          bow.cy = this.randomY();
          bow.radius = this.randomRadius();
          bow.aFrom = aFrom;
          bow.aTo = aTo;
          bow.trigger('changed');
          return this;
        }
      }, {
        key: 'generateFan',
        value: function generateFan() {
          var aFrom, aTo, fan;
          aFrom = Bu.rand(Bu.TWO_PI);
          aTo = aFrom + Bu.rand(Bu.HALF_PI, Bu.TWO_PI);
          fan = new Bu.Fan(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
          fan.center.label = 'O';
          fan.string.points[0].label = 'A';
          fan.string.points[1].label = 'B';
          return fan;
        }
      }, {
        key: 'generateTriangle',
        value: function generateTriangle() {
          var i, j, points, triangle;
          points = [];
          for (i = j = 0; j <= 2; i = ++j) {
            points[i] = new Bu.Point(this.randomX(), this.randomY());
          }
          triangle = new Bu.Triangle(points[0], points[1], points[2]);
          triangle.points[0].label = 'A';
          triangle.points[1].label = 'B';
          triangle.points[2].label = 'C';
          return triangle;
        }
      }, {
        key: 'randomizeTriangle',
        value: function randomizeTriangle(triangle) {
          var i, j;
          for (i = j = 0; j <= 2; i = ++j) {
            triangle.points[i].set(this.randomX(), this.randomY());
          }
          triangle.trigger('changed');
          return this;
        }
      }, {
        key: 'generateRectangle',
        value: function generateRectangle() {
          var rect;
          rect = new Bu.Rectangle(Bu.rand(this.rangeX + this.rangeWidth), Bu.rand(this.rangeY + this.rangeHeight), Bu.rand(this.rangeWidth / 2), Bu.rand(this.rangeHeight / 2));
          rect.pointLT.label = 'A';
          rect.pointRT.label = 'B';
          rect.pointRB.label = 'C';
          rect.pointLB.label = 'D';
          return rect;
        }
      }, {
        key: 'randomizeRectangle',
        value: function randomizeRectangle(rectangle) {
          rectangle.set(this.randomX(), this.randomY(), this.randomRadius(), this.randomRadius());
          rectangle.trigger('changed');
          return this;
        }
      }, {
        key: 'generatePolygon',
        value: function generatePolygon() {
          var i, j, point, points;
          points = [];
          for (i = j = 0; j <= 3; i = ++j) {
            point = new Bu.Point(this.randomX(), this.randomY());
            point.label = 'P' + i;
            points.push(point);
          }
          return new Bu.Polygon(points);
        }
      }, {
        key: 'randomizePolygon',
        value: function randomizePolygon(polygon) {
          var j, len, ref, vertex;
          ref = polygon.vertices;
          for (j = 0, len = ref.length; j < len; j++) {
            vertex = ref[j];
            vertex.set(this.randomX(), this.randomY());
          }
          polygon.trigger('changed');
          return this;
        }
      }, {
        key: 'generateLine',
        value: function generateLine() {
          var line;
          line = new Bu.Line(this.randomX(), this.randomY(), this.randomX(), this.randomY());
          line.points[0].label = 'A';
          line.points[1].label = 'B';
          return line;
        }
      }, {
        key: 'randomizeLine',
        value: function randomizeLine(line) {
          var j, len, point, ref;
          ref = line.points;
          for (j = 0, len = ref.length; j < len; j++) {
            point = ref[j];
            point.set(this.randomX(), this.randomY());
          }
          line.trigger('changed');
          return this;
        }
      }, {
        key: 'generatePolyline',
        value: function generatePolyline() {
          var i, j, point, polyline;
          polyline = new Bu.Polyline();
          for (i = j = 0; j <= 3; i = ++j) {
            point = new Bu.Point(this.randomX(), this.randomY());
            point.label = 'P' + i;
            polyline.addPoint(point);
          }
          return polyline;
        }
      }, {
        key: 'randomizePolyline',
        value: function randomizePolyline(polyline) {
          var j, len, ref, vertex;
          ref = polyline.vertices;
          for (j = 0, len = ref.length; j < len; j++) {
            vertex = ref[j];
            vertex.set(this.randomX(), this.randomY());
          }
          polyline.trigger('changed');
          return this;
        }
      }]);

      return ShapeRandomizer;
    }();

    MARGIN = 30;

    ShapeRandomizer.prototype.rangeX = 0;

    ShapeRandomizer.prototype.rangeY = 0;

    ShapeRandomizer.prototype.rangeWidth = 800;

    ShapeRandomizer.prototype.rangeHeight = 450;

    ShapeRandomizer.prototype.randomizeFan = ShapeRandomizer.prototype.randomizeBow;

    return ShapeRandomizer;
  }();

  var ShapeRandomizer$1 = ShapeRandomizer;

  Bu$3.Bounds = Bounds$1;

  Bu$3.Color = Color$1;

  Bu$3.Size = Size$1;

  Bu$3.Vector = Vector$1;

  Bu$3.Event = Event$1;

  Bu$3.Object2D = Object2D$1;

  Bu$3.Styled = Styled$1;

  Bu$3.App = App$1;

  Bu$3.Audio = Audio$1;

  Bu$3.Camera = Camera$1;

  Bu$3.Renderer = Renderer$1;

  Bu$3.Scene = Scene$1;

  Bu$3.Bow = Bow$1;

  Bu$3.Circle = Circle$1;

  Bu$3.Ellipse = Ellipse$1;

  Bu$3.Fan = Fan$1;

  Bu$3.Line = Line$1;

  Bu$3.Point = Point$1;

  Bu$3.Polygon = Polygon$1;

  Bu$3.Polyline = Polyline$1;

  Bu$3.Rectangle = Rectangle$1;

  Bu$3.Spline = Spline$1;

  Bu$3.Triangle = Triangle$1;

  Bu$3.Image = Image$2;

  Bu$3.PointText = PointText$1;

  Bu$3.Animation = Animation$1;

  Bu$3.AnimationRunner = AnimationRunner$1;

  Bu$3.AnimationTask = AnimationTask$1;

  Bu$3.DashFlowManager = DashFlowManager$1;

  Bu$3.SpriteSheet = SpriteSheet$1;

  Bu$3.InputManager = InputManager$1;

  Bu$3.MouseControl = MouseControl$1;

  Bu$3.geometryAlgorithm = geometryAlgorithm$1;

  Bu$3.ShapeRandomizer = ShapeRandomizer$1;

  return Bu$3;
}();
//# sourceMappingURL=bu.js.map
