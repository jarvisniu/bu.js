// Bu.js v0.4.0 - https://github.com/jarvisniu/Bu.js
(function() {
  var base, base1, currentTime, global, lastTime,
    hasProp = {}.hasOwnProperty;

  global = window || this;

  global.Bu = {
    global: global
  };

  Bu.version = '0.4.0';

  Bu.BROWSER_VENDOR_PREFIXES = ['webkit', 'moz', 'ms'];

  Bu.HALF_PI = Math.PI / 2;

  Bu.TWO_PI = Math.PI * 2;

  Bu.DEFAULT_FONT_FAMILY = 'Verdana';

  Bu.DEFAULT_FONT_SIZE = 11;

  Bu.DEFAULT_FONT = '11px Verdana';

  Bu.POINT_RENDER_SIZE = 2.25;

  Bu.POINT_LABEL_OFFSET = 5;

  Bu.DEFAULT_SPLINE_SMOOTH = 0.25;

  Bu.DEFAULT_NEAR_DIST = 5;

  Bu.MOUSE = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    MIDDLE: 4
  };

  Bu.average = function() {
    var i, j, len, ns, sum;
    ns = arguments;
    if (typeof arguments[0] === 'object') {
      ns = arguments[0];
    }
    sum = 0;
    for (j = 0, len = ns.length; j < len; j++) {
      i = ns[j];
      sum += i;
    }
    return sum / ns.length;
  };

  Bu.bevel = function(x, y) {
    return Math.sqrt(x * x + y * y);
  };

  Bu.clamp = function(x, min, max) {
    if (x < min) {
      x = min;
    }
    if (x > max) {
      x = max;
    }
    return x;
  };

  Bu.rand = function(from, to) {
    var ref;
    if (to == null) {
      ref = [0, from], from = ref[0], to = ref[1];
    }
    return Math.random() * (to - from) + from;
  };

  Bu.r2d = function(r) {
    return (r * 180 / Math.PI).toFixed(1);
  };

  Bu.d2r = function(r) {
    return r * Math.PI / 180;
  };

  Bu.now = Bu.global.performance != null ? function() {
    return Bu.global.performance.now();
  } : function() {
    return Date.now();
  };

  Bu.combineOptions = function(args, defaultOptions) {
    var givenOptions, i;
    if (defaultOptions == null) {
      defaultOptions = {};
    }
    givenOptions = args[args.length - 1];
    if (Bu.isPlainObject(givenOptions)) {
      for (i in givenOptions) {
        if (givenOptions[i] != null) {
          defaultOptions[i] = givenOptions[i];
        }
      }
    }
    return defaultOptions;
  };

  Bu.isNumber = function(o) {
    return typeof o === 'number';
  };

  Bu.isString = function(o) {
    return typeof o === 'string';
  };

  Bu.isPlainObject = function(o) {
    return o instanceof Object && o.constructor.name === 'Object';
  };

  Bu.isFunction = function(o) {
    return o instanceof Object && o.constructor.name === 'Function';
  };

  Bu.isArray = function(o) {
    return o instanceof Array;
  };

  Bu.clone = function(target) {
    var clone, i;
    if (typeof target !== 'object' || target === null || Bu.isFunction(target)) {
      return target;
    } else {
      if (target.clone != null) {
        return target.clone();
      }
      if (Bu.isArray(target)) {
        clone = [];
      } else if (Bu.isPlainObject(target)) {
        clone = {};
      } else {
        clone = Object.create(target.constructor.prototype);
      }
      for (i in target) {
        if (!hasProp.call(target, i)) continue;
        clone[i] = Bu.clone(target[i]);
      }
      return clone;
    }
  };

  Bu.data = function(key, value) {
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

  Bu.ready = function(cb, context, args) {
    if (document.readyState === 'complete') {
      return cb.apply(context, args);
    } else {
      return document.addEventListener('DOMContentLoaded', function() {
        return cb.apply(context, args);
      });
    }
  };

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  Function.prototype.throttle = function(limit) {
    var currTime, lastTime;
    if (limit == null) {
      limit = 0.5;
    }
    currTime = 0;
    lastTime = 0;
    return (function(_this) {
      return function() {
        currTime = Date.now();
        if (currTime - lastTime > limit * 1000) {
          _this.apply(null, arguments);
          return lastTime = currTime;
        }
      };
    })(this);
  };

  Function.prototype.debounce = function(delay) {
    var args, later, timeout;
    if (delay == null) {
      delay = 0.5;
    }
    args = null;
    timeout = null;
    later = (function(_this) {
      return function() {
        return _this.apply(null, args);
      };
    })(this);
    return function() {
      args = arguments;
      clearTimeout(timeout);
      return timeout = setTimeout(later, delay * 1000);
    };
  };

  (base = Array.prototype).each || (base.each = function(fn) {
    var i;
    i = 0;
    while (i < this.length) {
      fn(this[i]);
      i++;
    }
    return this;
  });

  (base1 = Array.prototype).map || (base1.map = function(fn) {
    var arr, i;
    arr = [];
    i = 0;
    while (i < this.length) {
      arr.push(fn(this[i]));
      i++;
    }
    return this;
  });

  currentTime = Date.now();

  lastTime = Bu.data('version.timestamp');

  if (!((lastTime != null) && currentTime - lastTime < 60 * 1000)) {
    if (typeof console.info === "function") {
      console.info('Bu.js v' + Bu.version + ' - [https://github.com/jarvisniu/Bu.js]');
    }
    Bu.data('version.timestamp', currentTime);
  }

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bu.Bounds = (function() {
    function Bounds(target) {
      this.target = target;
      this.update = bind(this.update, this);
      this.x1 = this.y1 = this.x2 = this.y2 = 0;
      this.isEmpty = true;
      this.point1 = new Bu.Vector;
      this.point2 = new Bu.Vector;
      this.update();
      this.bindEvent();
    }

    Bounds.prototype.containsPoint = function(p) {
      return this.x1 < p.x && this.x2 > p.x && this.y1 < p.y && this.y2 > p.y;
    };

    Bounds.prototype.update = function() {
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
          return console.warn("Bounds: not support shape type " + this.target.type);
      }
    };

    Bounds.prototype.bindEvent = function() {
      switch (this.target.type) {
        case 'Circle':
        case 'Bow':
        case 'Fan':
          this.target.on('centerChanged', this.update);
          return this.target.on('radiusChanged', this.update);
        case 'Ellipse':
          return this.target.on('changed', this.update);
      }
    };

    Bounds.prototype.clear = function() {
      this.x1 = this.y1 = this.x2 = this.y2 = 0;
      this.isEmpty = true;
      return this;
    };

    Bounds.prototype.expandByPoint = function(v) {
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
    };

    Bounds.prototype.expandByCircle = function(c) {
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
    };

    return Bounds;

  })();

}).call(this);

(function() {
  Bu.Color = (function() {
    var CSS3_COLORS, RE_HEX3, RE_HEX6, RE_HSL, RE_HSLA, RE_RGB, RE_RGBA, RE_RGBA_PER, RE_RGB_PER, clampAlpha, hsl2rgb, rgb2hsl;

    function Color() {
      var arg;
      this.r = this.g = this.b = 255;
      this.a = 1;
      if (arguments.length === 1) {
        arg = arguments[0];
        if (Bu.isString(arg)) {
          this.parse(arg);
          this.a = clampAlpha(this.a);
        } else if (arg instanceof Bu.Color) {
          this.copy(arg);
        }
      } else {
        this.r = arguments[0];
        this.g = arguments[1];
        this.b = arguments[2];
        this.a = arguments[3] || 1;
      }
    }

    Color.prototype.parse = function(str) {
      var found, h, hex, l, ref, ref1, s;
      if (found = str.match(RE_RGB)) {
        this.r = +found[1];
        this.g = +found[2];
        this.b = +found[3];
        this.a = 1;
      } else if (found = str.match(RE_HSL)) {
        h = +found[1];
        s = +found[2] / 100;
        l = +found[3] / 100;
        ref = hsl2rgb(h, s, l), this.r = ref[0], this.g = ref[1], this.b = ref[2];
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
        ref1 = hsl2rgb(h, s, l), this.r = ref1[0], this.g = ref1[1], this.b = ref1[2];
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
        console.error("Bu.Color.parse(\"" + str + "\") error.");
      }
      return this;
    };

    Color.prototype.clone = function() {
      return (new Bu.Color).copy(this);
    };

    Color.prototype.copy = function(color) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      this.a = color.a;
      return this;
    };

    Color.prototype.setRGB = function(r, g, b) {
      this.r = parseInt(r);
      this.g = parseInt(g);
      this.b = parseInt(b);
      this.a = 1;
      return this;
    };

    Color.prototype.setRGBA = function(r, g, b, a) {
      this.r = parseInt(r);
      this.g = parseInt(g);
      this.b = parseInt(b);
      this.a = clampAlpha(parseFloat(a));
      return this;
    };

    Color.prototype.toRGB = function() {
      return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    };

    Color.prototype.toRGBA = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };

    clampAlpha = function(a) {
      return Bu.clamp(a, 0, 1);
    };

    hsl2rgb = function(h, s, l) {
      var i, j, k, p, q, rgb, t;
      h %= 360;
      h /= 360;
      q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
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

    rgb2hsl = function(r, g, b) {
      var h, l, max, min, s;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = max === min ? 0 : max === r && g >= b ? 60 * (g - b) / (max - min) : max === r && g < b ? 60 * (g - b) / (max - min) + 360 : max === g ? 60 * (b - r) / (max - min) + 120 : 60 * (r - g) / (max - min) + 240;
      l = 0.5 * (max + min);
      s = l === 0 || max === min ? 0 : l > 0 && l <= 0.5 ? (max - min) / (2 * l) : (max - min) / (2 - 2 * l);
      return [h, s, l];
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

  })();

}).call(this);

(function() {
  Bu.Size = (function() {
    function Size(width, height) {
      this.width = width;
      this.height = height;
      this.type = 'Size';
    }

    Size.prototype.set = function(width, height) {
      this.width = width;
      this.height = height;
    };

    return Size;

  })();

}).call(this);

(function() {
  Bu.Vector = (function() {
    function Vector(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Vector.prototype.clone = function() {
      return new Bu.Vector(this.x, this.y);
    };

    Vector.prototype.add = function(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    };

    Vector.prototype.set = function(x, y) {
      this.x = x;
      this.y = y;
      return this;
    };

    Vector.prototype.offset = function(dx, dy) {
      this.x += dx;
      this.y += dy;
      return this;
    };

    Vector.prototype.copy = function(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    };

    Vector.prototype.multiplyScalar = function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    };

    Vector.prototype.project = function(obj) {
      var a, len;
      this.x *= obj.scale.x;
      this.y *= obj.scale.y;
      len = Bu.bevel(this.x, this.y);
      a = Math.atan2(this.y, this.x) + obj.rotation;
      this.x = len * Math.cos(a);
      this.y = len * Math.sin(a);
      this.x += obj.position.x;
      this.y += obj.position.y;
      return this;
    };

    Vector.prototype.unProject = function(obj) {
      var a, len;
      this.x -= obj.position.x;
      this.y -= obj.position.y;
      len = Bu.bevel(this.x, this.y);
      a = Math.atan2(this.y, this.x) - obj.rotation;
      this.x = len * Math.cos(a);
      this.y = len * Math.sin(a);
      this.x /= obj.scale.x;
      this.y /= obj.scale.y;
      return this;
    };

    return Vector;

  })();

}).call(this);

(function() {
  Bu.Event = function() {
    var types;
    types = {};
    this.on = function(type, listener) {
      var listeners;
      listeners = types[type] || (types[type] = []);
      if (listeners.indexOf(listener === -1)) {
        return listeners.push(listener);
      }
    };
    this.once = function(type, listener) {
      listener.once = true;
      return this.on(type, listener);
    };
    this.off = function(type, listener) {
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
    return this.trigger = function(type, eventData) {
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

}).call(this);

(function() {
  (function(global) {
    var jQuery;
    global.$ = function(selector) {
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
    jQuery = function() {
      var SVG_TAGS;
      this.on = (function(_this) {
        return function(type, callback) {
          _this.each(function(dom) {
            return dom.addEventListener(type, callback);
          });
          return _this;
        };
      })(this);
      this.off = (function(_this) {
        return function(type, callback) {
          _this.each(function(dom) {
            return dom.removeEventListener(type, callback);
          });
          return _this;
        };
      })(this);
      SVG_TAGS = 'svg line rect circle ellipse polyline polygon path text';
      this.append = (function(_this) {
        return function(tag) {
          _this.each(function(dom, i) {
            var newDom, tagIndex;
            tagIndex = SVG_TAGS.indexOf(tag.toLowerCase());
            if (tagIndex > -1) {
              newDom = document.createElementNS('http://www.w3.org/2000/svg', tag);
            } else {
              newDom = document.createElement(tag);
            }
            return _this[i] = dom.appendChild(newDom);
          });
          return _this;
        };
      })(this);
      this.text = (function(_this) {
        return function(str) {
          _this.each(function(dom) {
            return dom.textContent = str;
          });
          return _this;
        };
      })(this);
      this.html = (function(_this) {
        return function(str) {
          _this.each(function(dom) {
            return dom.innerHTML = str;
          });
          return _this;
        };
      })(this);
      this.width = (function(_this) {
        return function(w) {
          if (w != null) {
            _this.each(function(dom) {
              return dom.style.width = w + 'px';
            });
            return _this;
          } else {
            return parseFloat(getComputedStyle(_this[0]).width);
          }
        };
      })(this);
      this.height = (function(_this) {
        return function(h) {
          if (h != null) {
            _this.each(function(dom) {
              return dom.style.height = h + 'px';
            });
            return _this;
          } else {
            return parseFloat(getComputedStyle(_this[0]).height);
          }
        };
      })(this);
      this.style = (function(_this) {
        return function(name, value) {
          _this.each(function(dom) {
            var i, styleText, styles;
            styleText = dom.getAttribute('style');
            styles = {};
            if (styleText) {
              styleText.split(';').each(function(n) {
                var nv;
                nv = n.split(':');
                return styles[nv[0]] = nv[1];
              });
            }
            styles[name] = value;
            styleText = '';
            for (i in styles) {
              styleText += i + ': ' + styles[i] + '; ';
            }
            return dom.setAttribute('style', styleText);
          });
          return _this;
        };
      })(this);
      this.hasClass = (function(_this) {
        return function(name) {
          var classText, classes, i;
          if (_this.length === 0) {
            return false;
          }
          i = 0;
          while (i < _this.length) {
            classText = _this[i].getAttribute('class' || '');
            classes = classText.split(RegExp(' +'));
            if (!classes.contains(name)) {
              return false;
            }
            i++;
          }
          return _this;
        };
      })(this);
      this.addClass = (function(_this) {
        return function(name) {
          _this.each(function(dom) {
            var classText, classes;
            classText = dom.getAttribute('class' || '');
            classes = classText.split(RegExp(' +'));
            if (!classes.contains(name)) {
              classes.push(name);
              return dom.setAttribute('class', classes.join(' '));
            }
          });
          return _this;
        };
      })(this);
      this.removeClass = (function(_this) {
        return function(name) {
          _this.each(function(dom) {
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
          return _this;
        };
      })(this);
      this.toggleClass = (function(_this) {
        return function(name) {
          _this.each(function(dom) {
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
          return _this;
        };
      })(this);
      this.attr = (function(_this) {
        return function(name, value) {
          if (value != null) {
            _this.each(function(dom) {
              return dom.setAttribute(name, value);
            });
            return _this;
          } else {
            return _this[0].getAttribute(name);
          }
        };
      })(this);
      this.hasAttr = (function(_this) {
        return function(name) {
          var i;
          if (_this.length === 0) {
            return false;
          }
          i = 0;
          while (i < _this.length) {
            if (!_this[i].hasAttribute(name)) {
              return false;
            }
            i++;
          }
          return _this;
        };
      })(this);
      this.removeAttr = (function(_this) {
        return function(name) {
          _this.each(function(dom) {
            return dom.removeAttribute(name);
          });
          return _this;
        };
      })(this);
      return this.val = (function(_this) {
        return function() {
          var ref;
          return (ref = _this[0]) != null ? ref.value : void 0;
        };
      })(this);
    };
    global.$.ready = function(onLoad) {
      return document.addEventListener('DOMContentLoaded', onLoad);
    };
    return global.$.ajax = function(url, ops) {
      var xhr;
      if (!ops) {
        if (typeof url === 'object') {
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
      xhr = new XMLHttpRequest;
      xhr.onreadystatechange = function() {
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

}).call(this);

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.Object2D = (function() {
    Object2D.prototype.type = 'Object2D';

    Object2D.prototype.fillable = false;

    function Object2D() {
      Bu.Styled.apply(this);
      Bu.Event.apply(this);
      this.visible = true;
      this.opacity = 1;
      this.position = new Bu.Vector;
      this.rotation = 0;
      this._scale = new Bu.Vector(1, 1);
      this.skew = new Bu.Vector;
      this.bounds = null;
      this.keyPoints = null;
      this.children = [];
      this.parent = null;
    }

    Object2D.property('scale', {
      get: function() {
        return this._scale;
      },
      set: function(val) {
        if (Bu.isNumber(val)) {
          return this._scale.x = this._scale.y = val;
        } else {
          return this._scale = val;
        }
      }
    });

    Object2D.prototype.translate = function(dx, dy) {
      this.position.x += dx;
      this.position.y += dy;
      return this;
    };

    Object2D.prototype.rotate = function(da) {
      this.rotation += da;
      return this;
    };

    Object2D.prototype.scaleBy = function(ds) {
      this.scale *= ds;
      return this;
    };

    Object2D.prototype.scaleTo = function(s) {
      this.scale = s;
      return this;
    };

    Object2D.prototype.getScene = function() {
      var node;
      node = this;
      while (true) {
        if (node instanceof Bu.Scene) {
          break;
        }
        node = node.parent;
      }
      return node;
    };

    Object2D.prototype.addChild = function(shape) {
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
    };

    Object2D.prototype.removeChild = function(shape) {
      var index;
      index = this.children.indexOf(shape);
      if (index > -1) {
        this.children.splice(index, 1);
      }
      return this;
    };

    Object2D.prototype.animate = function(anim, args) {
      var i;
      if (!Bu.isArray(args)) {
        args = [args];
      }
      if (Bu.isString(anim)) {
        if (anim in Bu.animations) {
          Bu.animations[anim].applyTo(this, args);
        } else {
          console.warn("Bu.animations[\"" + anim + "\"] doesn't exists.");
        }
      } else if (Bu.isArray(anim)) {
        for (i in anim) {
          if (!hasProp.call(anim, i)) continue;
          this.animate(anim[i], args);
        }
      } else {
        anim.applyTo(this, args);
      }
      return this;
    };

    Object2D.prototype.createBounds = function() {
      this.bounds = new Bu.Bounds(this);
      return this;
    };

    Object2D.prototype.hitTest = function(v) {
      var renderer;
      renderer = this.getScene().renderer;
      if (renderer.originAtCenter) {
        v.offset(-renderer.width / 2, -renderer.height / 2);
      }
      v.project(renderer.camera);
      v.unProject(this);
      return this.containsPoint(v);
    };

    Object2D.prototype.containsPoint = function(p) {
      if ((this.bounds != null) && !this.bounds.containsPoint(p)) {
        return false;
      } else if (this._containsPoint) {
        return this._containsPoint(p);
      } else {
        return false;
      }
    };

    return Object2D;

  })();

}).call(this);

(function() {
  Bu.Styled = function() {
    this.strokeStyle = Bu.Styled.DEFAULT_STROKE_STYLE;
    this.fillStyle = Bu.Styled.DEFAULT_FILL_STYLE;
    this.dashStyle = false;
    this.dashFlowSpeed = 0;
    this.lineWidth = 1;
    this.dashOffset = 0;
    this.style = function(style) {
      var i, k, len, ref;
      if (Bu.isString(style)) {
        style = Bu.styles[style];
        if (style == null) {
          style = Bu.styles["default"];
          console.warn("Bu.Styled: Bu.styles." + style + " doesn't exists, fell back to default.");
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
    this.stroke = function(v) {
      if (v == null) {
        v = true;
      }
      if ((Bu.styles != null) && v in Bu.styles) {
        v = Bu.styles[v].strokeStyle;
      }
      switch (v) {
        case true:
          this.strokeStyle = Bu.Styled.DEFAULT_STROKE_STYLE;
          break;
        case false:
          this.strokeStyle = null;
          break;
        default:
          this.strokeStyle = v;
      }
      return this;
    };
    this.fill = function(v) {
      if (v == null) {
        v = true;
      }
      if ((Bu.styles != null) && v in Bu.styles) {
        v = Bu.styles[v].fillStyle;
      }
      switch (v) {
        case false:
          this.fillStyle = null;
          break;
        case true:
          this.fillStyle = Bu.Styled.DEFAULT_FILL_STYLE;
          break;
        default:
          this.fillStyle = v;
      }
      return this;
    };
    this.dash = function(v) {
      if (v == null) {
        v = true;
      }
      if ((Bu.styles != null) && v in Bu.styles) {
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
          this.dashStyle = Bu.Styled.DEFAULT_DASH_STYLE;
          break;
        default:
          this.dashStyle = v;
      }
      return this;
    };
    this.dashFlow = function(speed) {
      if (speed === true || (speed == null)) {
        speed = 1;
      }
      if (speed === false) {
        speed = 0;
      }
      Bu.dashFlowManager.setSpeed(this, speed);
      return this;
    };
    this.setLineWidth = function(w) {
      this.lineWidth = w;
      return this;
    };
    return this;
  };

  Bu.Styled.DEFAULT_STROKE_STYLE = '#048';

  Bu.Styled.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)';

  Bu.Styled.DEFAULT_DASH_STYLE = [8, 4];

  Bu.styles = {
    "default": new Bu.Styled().stroke().fill(),
    hover: new Bu.Styled().stroke('hsla(0, 100%, 40%, 0.75)').fill('hsla(0, 100%, 75%, 0.5)'),
    text: new Bu.Styled().stroke(false).fill('black'),
    line: new Bu.Styled().fill(false),
    selected: new Bu.Styled().setLineWidth(3),
    dash: new Bu.Styled().dash()
  };

}).call(this);


/*=================================================================##
All supported constructor options:
(The appearance sequence is the process sequence.)
{
    renderer: # settings to the renderer
    	container: '#container' # css selector of the container dom or itself
        cursor: 'crosshand' # the default cursor style on the <canvas>
        background: 'pink' # the default background of the <canvas>
    	showKeyPoints: true # whether to show the key points of shapes (if they have).
    data: { var } # variables of this Bu.js app, will be copied to the app object
    methods: { function }# functions of this Bu.js app, will be copied to the app object
    objects: {} or function that returns {} # all the renderable objects
	scene: # an tree that represent the object tree of the scene, the keys are in `objects`
    events: # event listeners, 'mousedown', 'mousemove', 'mouseup' will automatically be bound to <canvas>
    init: function # called when the document is ready
    update: function # called every frame
}
##=================================================================
 */

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.App = (function() {
    function App($options) {
      var base, i, k, len, ref;
      this.$options = $options != null ? $options : {};
      ref = ["renderer", "data", "objects", "methods", "events"];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        (base = this.$options)[k] || (base[k] = {});
      }
      this.$inputManager = new Bu.InputManager;
      Bu.ready(this.init, this);
    }

    App.prototype.init = function() {
      var assembleObjects, k, name, objects, ref, scene;
      scene = new Bu.Scene;
      scene.background = this.$options.background || Bu.Scene.DEFAULT_BACKGROUND;
      this.$renderer = new Bu.Renderer(this.$options.renderer);
      this.$renderer.scene = scene;
      scene.renderer = this.$renderer;
      if (Bu.isFunction(this.$options.data)) {
        this.$options.data = this.$options.data.apply(this);
      }
      for (k in this.$options.data) {
        this[k] = this.$options.data[k];
      }
      for (k in this.$options.methods) {
        this[k] = this.$options.methods[k];
      }
      objects = Bu.isFunction(this.$options.objects) ? this.$options.objects.apply(this) : this.$options.objects;
      for (name in objects) {
        this[name] = objects[name];
      }
      if (!this.$options.scene) {
        this.$options.scene = {};
        for (name in objects) {
          this.$options.scene[name] = {};
        }
      }
      assembleObjects = (function(_this) {
        return function(children, parent) {
          var results;
          results = [];
          for (name in children) {
            if (!hasProp.call(children, name)) continue;
            parent.addChild(objects[name]);
            results.push(assembleObjects(children[name], objects[name]));
          }
          return results;
        };
      })(this);
      assembleObjects(this.$options.scene, this.$renderer.scene);
      if ((ref = this.$options.init) != null) {
        ref.call(this);
      }
      this.$inputManager.handleAppEvents(this, this.$options.events);
      if (this.$options.update != null) {
        return this.$renderer.on('update', (function(_this) {
          return function() {
            return _this.$options.update.apply(_this, arguments);
          };
        })(this));
      }
    };

    return App;

  })();

}).call(this);

(function() {
  Bu.Audio = (function() {
    function Audio(url) {
      this.audio = document.createElement('audio');
      this.url = '';
      this.ready = false;
      if (url) {
        this.load(url);
      }
    }

    Audio.prototype.load = function(url) {
      this.url = url;
      this.audio.addEventListener('canplay', (function(_this) {
        return function() {
          return _this.ready = true;
        };
      })(this));
      return this.audio.src = url;
    };

    Audio.prototype.play = function() {
      if (this.ready) {
        return this.audio.play();
      } else {
        return console.warn("The audio file " + this.url + " hasn't been ready.");
      }
    };

    return Audio;

  })();

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Camera = (function(superClass) {
    extend(Camera, superClass);

    function Camera() {
      Camera.__super__.constructor.call(this);
      this.type = 'Camera';
    }

    return Camera;

  })(Bu.Object2D);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bu.Renderer = (function() {
    function Renderer() {
      this.drawShape = bind(this.drawShape, this);
      this.drawShapes = bind(this.drawShapes, this);
      var delayed, j, len1, name, onResize, options, ref, tick;
      Bu.Event.apply(this);
      this.type = 'Renderer';
      this.scene = new Bu.Scene(this);
      this.camera = new Bu.Camera;
      this.tickCount = 0;
      this.isRunning = true;
      this.pixelRatio = Bu.global.devicePixelRatio || 1;
      if (typeof ClipMeter !== "undefined" && ClipMeter !== null) {
        this.clipMeter = new ClipMeter();
      }
      options = Bu.combineOptions(arguments, {
        container: 'body',
        showKeyPoints: false,
        showBounds: false,
        originAtCenter: false,
        imageSmoothing: true
      });
      ref = ['container', 'width', 'height', 'showKeyPoints', 'showBounds', 'originAtCenter'];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        name = ref[j];
        this[name] = options[name];
      }
      this.fillParent = !Bu.isNumber(options.width);
      this.pixelWidth = this.width * this.pixelRatio;
      this.pixelHeight = this.height * this.pixelRatio;
      this.dom = document.createElement('canvas');
      this.dom.style.cursor = options.cursor || 'default';
      this.dom.style.boxSizing = 'content-box';
      this.dom.oncontextmenu = function() {
        return false;
      };
      this.context = this.dom.getContext('2d');
      this.context.textBaseline = 'top';
      if (Bu.isString(this.container)) {
        this.container = document.querySelector(this.container);
      }
      if (this.fillParent && this.container === document.body) {
        $('body').style('margin', 0).style('overflow', 'hidden');
        $('html, body').style('width', '100%').style('height', '100%');
      }
      onResize = (function(_this) {
        return function() {
          var canvasRatio, containerRatio;
          canvasRatio = _this.dom.height / _this.dom.width;
          containerRatio = _this.container.clientHeight / _this.container.clientWidth;
          if (containerRatio < canvasRatio) {
            _this.height = _this.container.clientHeight;
            _this.width = _this.height / containerRatio;
          } else {
            _this.width = _this.container.clientWidth;
            _this.height = _this.width * containerRatio;
          }
          _this.pixelWidth = _this.dom.width = _this.width * _this.pixelRatio;
          _this.pixelHeight = _this.dom.height = _this.height * _this.pixelRatio;
          _this.dom.style.width = _this.width + 'px';
          _this.dom.style.height = _this.height + 'px';
          return _this.render();
        };
      })(this);
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
      tick = (function(_this) {
        return function() {
          if (_this.isRunning) {
            if (_this.clipMeter != null) {
              _this.clipMeter.start();
            }
            _this.render();
            _this.trigger('update', _this);
            _this.tickCount += 1;
            if (_this.clipMeter != null) {
              _this.clipMeter.tick();
            }
          }
          return requestAnimationFrame(tick);
        };
      })(this);
      tick();
      delayed = (function(_this) {
        return function() {
          _this.container.appendChild(_this.dom);
          return _this.imageSmoothing = options.imageSmoothing;
        };
      })(this);
      setTimeout(delayed, 1);
      Bu.animationRunner.hookUp(this);
      Bu.dashFlowManager.hookUp(this);
    }

    Renderer.prototype.pause = function() {
      return this.isRunning = false;
    };

    Renderer.prototype["continue"] = function() {
      return this.isRunning = true;
    };

    Renderer.prototype.toggle = function() {
      return this.isRunning = !this.isRunning;
    };

    Renderer.prototype.render = function() {
      this.context.save();
      this.clearCanvas();
      if (this.originAtCenter) {
        this.context.translate(this.pixelWidth / 2, this.pixelHeight / 2);
      }
      this.context.scale(this.pixelRatio, this.pixelRatio);
      this.context.scale(1 / this.camera.scale.x, 1 / this.camera.scale.y);
      this.context.rotate(-this.camera.rotation);
      this.context.translate(-this.camera.position.x, -this.camera.position.y);
      this.drawShape(this.scene);
      this.context.restore();
      return this;
    };

    Renderer.prototype.clearCanvas = function() {
      this.context.fillStyle = this.scene.background;
      this.context.fillRect(0, 0, this.pixelWidth, this.pixelHeight);
      return this;
    };

    Renderer.prototype.drawShapes = function(shapes) {
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
    };

    Renderer.prototype.drawShape = function(shape) {
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
          break;
        default:
          console.log('drawShapes(): unknown shape: ', shape.type, shape);
      }
      if ((shape.fillStyle != null) && shape.fillable) {
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
      if (this.showBounds && (shape.bounds != null)) {
        this.drawBounds(shape.bounds);
      }
      return this;
    };

    Renderer.prototype.drawPoint = function(shape) {
      this.context.arc(shape.x, shape.y, Bu.POINT_RENDER_SIZE, 0, Bu.TWO_PI);
      return this;
    };

    Renderer.prototype.drawLine = function(shape) {
      this.context.moveTo(shape.points[0].x, shape.points[0].y);
      this.context.lineTo(shape.points[1].x, shape.points[1].y);
      return this;
    };

    Renderer.prototype.drawCircle = function(shape) {
      this.context.arc(shape.cx, shape.cy, shape.radius, 0, Bu.TWO_PI);
      return this;
    };

    Renderer.prototype.drawEllipse = function(shape) {
      this.context.ellipse(0, 0, shape.radiusX, shape.radiusY, 0, Bu.TWO_PI, false);
      return this;
    };

    Renderer.prototype.drawTriangle = function(shape) {
      this.context.lineTo(shape.points[0].x, shape.points[0].y);
      this.context.lineTo(shape.points[1].x, shape.points[1].y);
      this.context.lineTo(shape.points[2].x, shape.points[2].y);
      this.context.closePath();
      return this;
    };

    Renderer.prototype.drawRectangle = function(shape) {
      if (shape.cornerRadius !== 0) {
        return this.drawRoundRectangle(shape);
      }
      this.context.rect(shape.pointLT.x, shape.pointLT.y, shape.size.width, shape.size.height);
      return this;
    };

    Renderer.prototype.drawRoundRectangle = function(shape) {
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
      if ((shape.strokeStyle != null) && shape.dashStyle) {
        if (typeof (base = this.context).setLineDash === "function") {
          base.setLineDash(shape.dashStyle);
        }
      }
      return this;
    };

    Renderer.prototype.drawFan = function(shape) {
      this.context.arc(shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo);
      this.context.lineTo(shape.cx, shape.cy);
      this.context.closePath();
      return this;
    };

    Renderer.prototype.drawBow = function(shape) {
      this.context.arc(shape.cx, shape.cy, shape.radius, shape.aFrom, shape.aTo);
      this.context.closePath();
      return this;
    };

    Renderer.prototype.drawPolygon = function(shape) {
      var j, len1, point, ref;
      ref = shape.vertices;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        point = ref[j];
        this.context.lineTo(point.x, point.y);
      }
      this.context.closePath();
      return this;
    };

    Renderer.prototype.drawPolyline = function(shape) {
      var j, len1, point, ref;
      ref = shape.vertices;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        point = ref[j];
        this.context.lineTo(point.x, point.y);
      }
      return this;
    };

    Renderer.prototype.drawSpline = function(shape) {
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
    };

    Renderer.prototype.drawPointText = function(shape) {
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
        xOffset = (function() {
          switch (shape.textAlign) {
            case 'left':
              return 0;
            case 'center':
              return -textWidth / 2;
            case 'right':
              return -textWidth;
          }
        })();
        yOffset = (function() {
          switch (shape.textBaseline) {
            case 'top':
              return 0;
            case 'middle':
              return -font.height / 2;
            case 'bottom':
              return -font.height;
          }
        })();
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
    };

    Renderer.prototype.drawImage = function(shape) {
      var dx, dy, h, w;
      if (shape.ready) {
        w = shape.size.width;
        h = shape.size.height;
        dx = -w * shape.pivot.x;
        dy = -h * shape.pivot.y;
        this.context.drawImage(shape.image, dx, dy, w, h);
      }
      return this;
    };

    Renderer.prototype.drawBounds = function(bounds) {
      var base;
      this.context.beginPath();
      this.context.strokeStyle = Bu.Renderer.BOUNDS_STROKE_STYLE;
      if (typeof (base = this.context).setLineDash === "function") {
        base.setLineDash(Bu.Renderer.BOUNDS_DASH_STYLE);
      }
      this.context.rect(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
      this.context.stroke();
      return this;
    };

    Renderer.property('imageSmoothing', {
      get: function() {
        return this._imageSmoothing;
      },
      set: function(val) {
        return this._imageSmoothing = this.context.imageSmoothingEnabled = val;
      }
    });

    return Renderer;

  })();

  Bu.Renderer.BOUNDS_STROKE_STYLE = 'red';

  Bu.Renderer.BOUNDS_DASH_STYLE = [6, 6];

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Scene = (function(superClass) {
    extend(Scene, superClass);

    function Scene() {
      Scene.__super__.constructor.call(this);
      this.type = 'Scene';
      this.background = Bu.Scene.DEFAULT_BACKGROUND;
      this.renderer = null;
    }

    return Scene;

  })(Bu.Object2D);

  Bu.Scene.DEFAULT_BACKGROUND = '#eee';

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Bow = (function(superClass) {
    extend(Bow, superClass);

    Bow.prototype.type = 'Bow';

    Bow.prototype.fillable = true;

    function Bow(cx, cy, radius, aFrom, aTo) {
      var ref;
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.aFrom = aFrom;
      this.aTo = aTo;
      Bow.__super__.constructor.call(this);
      if (this.aFrom > this.aTo) {
        ref = [this.aTo, this.aFrom], this.aFrom = ref[0], this.aTo = ref[1];
      }
      this.center = new Bu.Point(this.cx, this.cy);
      this.string = new Bu.Line(this.center.arcTo(this.radius, this.aFrom), this.center.arcTo(this.radius, this.aTo));
      this.keyPoints = this.string.points;
      this.updateKeyPoints();
      this.on('changed', this.updateKeyPoints);
      this.on('changed', (function(_this) {
        return function() {
          var ref1;
          return (ref1 = _this.bounds) != null ? ref1.update() : void 0;
        };
      })(this));
    }

    Bow.prototype.clone = function() {
      return new Bu.Bow(this.cx, this.cy, this.radius, this.aFrom, this.aTo);
    };

    Bow.prototype.updateKeyPoints = function() {
      this.center.set(this.cx, this.cy);
      this.string.points[0].copy(this.center.arcTo(this.radius, this.aFrom));
      this.string.points[1].copy(this.center.arcTo(this.radius, this.aTo));
      this.keyPoints = this.string.points;
      return this;
    };

    return Bow;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Circle = (function(superClass) {
    extend(Circle, superClass);

    Circle.prototype.type = 'Circle';

    Circle.prototype.fillable = true;

    function Circle(_radius, cx, cy) {
      this._radius = _radius != null ? _radius : 1;
      if (cx == null) {
        cx = 0;
      }
      if (cy == null) {
        cy = 0;
      }
      Circle.__super__.constructor.call(this);
      this._center = new Bu.Point(cx, cy);
      this.bounds = null;
      this.keyPoints = [this._center];
      this.on('centerChanged', this.updateKeyPoints);
    }

    Circle.prototype.clone = function() {
      return new Bu.Circle(this.radius, this.cx, this.cy);
    };

    Circle.prototype.updateKeyPoints = function() {
      return this.keyPoints[0].set(this.cx, this.cy);
    };

    Circle.property('cx', {
      get: function() {
        return this._center.x;
      },
      set: function(val) {
        this._center.x = val;
        return this.trigger('centerChanged', this);
      }
    });

    Circle.property('cy', {
      get: function() {
        return this._center.y;
      },
      set: function(val) {
        this._center.y = val;
        return this.trigger('centerChanged', this);
      }
    });

    Circle.property('center', {
      get: function() {
        return this._center;
      },
      set: function(val) {
        this._center = val;
        this.cx = val.x;
        this.cy = val.y;
        this.keyPoints[0] = val;
        return this.trigger('centerChanged', this);
      }
    });

    Circle.property('radius', {
      get: function() {
        return this._radius;
      },
      set: function(val) {
        this._radius = val;
        this.trigger('radiusChanged', this);
        return this;
      }
    });

    return Circle;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Ellipse = (function(superClass) {
    extend(Ellipse, superClass);

    Ellipse.prototype.type = 'Ellipse';

    Ellipse.prototype.fillable = true;

    function Ellipse(_radiusX, _radiusY) {
      this._radiusX = _radiusX != null ? _radiusX : 20;
      this._radiusY = _radiusY != null ? _radiusY : 10;
      Ellipse.__super__.constructor.call(this);
    }

    Ellipse.property('radiusX', {
      get: function() {
        return this._radiusX;
      },
      set: function(val) {
        this._radiusX = val;
        return this.trigger('changed', this);
      }
    });

    Ellipse.property('radiusY', {
      get: function() {
        return this._radiusY;
      },
      set: function(val) {
        this._radiusY = val;
        return this.trigger('changed', this);
      }
    });

    return Ellipse;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Fan = (function(superClass) {
    extend(Fan, superClass);

    Fan.prototype.type = 'Fan';

    Fan.prototype.fillable = true;

    function Fan(cx, cy, radius, aFrom, aTo) {
      var ref;
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.aFrom = aFrom;
      this.aTo = aTo;
      Fan.__super__.constructor.call(this);
      if (this.aFrom > this.aTo) {
        ref = [this.aTo, this.aFrom], this.aFrom = ref[0], this.aTo = ref[1];
      }
      this.center = new Bu.Point(this.cx, this.cy);
      this.string = new Bu.Line(this.center.arcTo(this.radius, this.aFrom), this.center.arcTo(this.radius, this.aTo));
      this.keyPoints = [this.string.points[0], this.string.points[1], this.center];
      this.on('changed', this.updateKeyPoints);
      this.on('changed', (function(_this) {
        return function() {
          var ref1;
          return (ref1 = _this.bounds) != null ? ref1.update() : void 0;
        };
      })(this));
    }

    Fan.prototype.clone = function() {
      return new Bu.Fan(this.cx, this.cy, this.radius, this.aFrom, this.aTo);
    };

    Fan.prototype.updateKeyPoints = function() {
      this.center.set(this.cx, this.cy);
      this.string.points[0].copy(this.center.arcTo(this.radius, this.aFrom));
      this.string.points[1].copy(this.center.arcTo(this.radius, this.aTo));
      return this;
    };

    return Fan;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Line = (function(superClass) {
    extend(Line, superClass);

    Line.prototype.type = 'Line';

    Line.prototype.fillable = false;

    function Line(p1, p2, p3, p4) {
      Line.__super__.constructor.call(this);
      if (arguments.length < 2) {
        this.points = [new Bu.Point(), new Bu.Point()];
      } else if (arguments.length < 4) {
        this.points = [p1.clone(), p2.clone()];
      } else {
        this.points = [new Bu.Point(p1, p2), new Bu.Point(p3, p4)];
      }
      this.length = 0;
      this.midpoint = new Bu.Point();
      this.keyPoints = this.points;
      this.on("changed", (function(_this) {
        return function() {
          _this.length = _this.points[0].distanceTo(_this.points[1]);
          return _this.midpoint.set((_this.points[0].x + _this.points[1].x) / 2, (_this.points[0].y + _this.points[1].y) / 2);
        };
      })(this));
      this.trigger("changed");
    }

    Line.prototype.clone = function() {
      return new Bu.Line(this.points[0], this.points[1]);
    };

    Line.prototype.set = function(a1, a2, a3, a4) {
      if (typeof p4 !== "undefined" && p4 !== null) {
        this.points[0].set(a1, a2);
        this.points[1].set(a3, a4);
      } else {
        this.points[0] = a1;
        this.points[1] = a2;
      }
      this.trigger("changed");
      return this;
    };

    Line.prototype.setPoint1 = function(a1, a2) {
      if (a2 != null) {
        this.points[0].set(a1, a2);
      } else {
        this.points[0].copy(a1);
      }
      this.trigger("changed");
      return this;
    };

    Line.prototype.setPoint2 = function(a1, a2) {
      if (a2 != null) {
        this.points[1].set(a1, a2);
      } else {
        this.points[1].copy(a1);
      }
      this.trigger("changed");
      return this;
    };

    return Line;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Point = (function(superClass) {
    extend(Point, superClass);

    Point.prototype.type = 'Point';

    Point.prototype.fillable = true;

    function Point(x1, y1) {
      this.x = x1 != null ? x1 : 0;
      this.y = y1 != null ? y1 : 0;
      Point.__super__.constructor.call(this);
      this.lineWidth = 0.5;
      this._labelIndex = -1;
    }

    Point.prototype.clone = function() {
      return new Bu.Point(this.x, this.y);
    };

    Point.property('label', {
      get: function() {
        if (this._labelIndex > -1) {
          return this.children[this._labelIndex].text;
        } else {
          return '';
        }
      },
      set: function(val) {
        var pointText;
        if (this._labelIndex === -1) {
          pointText = new Bu.PointText(val, this.x + Bu.POINT_LABEL_OFFSET, this.y, {
            align: '+0'
          });
          this.children.push(pointText);
          return this._labelIndex = this.children.length - 1;
        } else {
          return this.children[this._labelIndex].text = val;
        }
      }
    });

    Point.prototype.arcTo = function(radius, arc) {
      return new Bu.Point(this.x + Math.cos(arc) * radius, this.y + Math.sin(arc) * radius);
    };

    Point.prototype.copy = function(point) {
      this.x = point.x;
      this.y = point.y;
      this.updateLabel();
      return this;
    };

    Point.prototype.set = function(x, y) {
      this.x = x;
      this.y = y;
      this.updateLabel();
      return this;
    };

    Point.prototype.setLabel = function(text) {
      this.label = text;
      this.updateLabel();
      return this;
    };

    Point.prototype.updateLabel = function() {
      if (this._labelIndex > -1) {
        this.children[this._labelIndex].x = this.x + Bu.POINT_LABEL_OFFSET;
        this.children[this._labelIndex].y = this.y;
      }
      return this;
    };

    return Point;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Polygon = (function(superClass) {
    extend(Polygon, superClass);

    Polygon.prototype.type = 'Polygon';

    Polygon.prototype.fillable = true;


    /*
       constructors
       1. Polygon(points)
       2. Polygon(x, y, radius, n, options): to generate regular polygon
       	options: angle - start angle of regular polygon
     */

    function Polygon(points) {
      var n, options, radius, x, y;
      Polygon.__super__.constructor.call(this);
      this.vertices = [];
      this.lines = [];
      this.triangles = [];
      options = Bu.combineOptions(arguments, {
        angle: 0
      });
      if (Bu.isArray(points)) {
        if (points != null) {
          this.vertices = points;
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
        this.vertices = Bu.Polygon.generateRegularPoints(x, y, radius, n, options);
      }
      this.onVerticesChanged();
      this.on('changed', this.onVerticesChanged);
      this.on('changed', (function(_this) {
        return function() {
          var ref;
          return (ref = _this.bounds) != null ? ref.update() : void 0;
        };
      })(this));
      this.keyPoints = this.vertices;
    }

    Polygon.prototype.clone = function() {
      return new Bu.Polygon(this.vertices);
    };

    Polygon.prototype.onVerticesChanged = function() {
      var i, k, l, ref, ref1, results;
      this.lines = [];
      this.triangles = [];
      if (this.vertices.length > 1) {
        for (i = k = 0, ref = this.vertices.length - 1; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
          this.lines.push(new Bu.Line(this.vertices[i], this.vertices[i + 1]));
        }
        this.lines.push(new Bu.Line(this.vertices[this.vertices.length - 1], this.vertices[0]));
      }
      if (this.vertices.length > 2) {
        results = [];
        for (i = l = 1, ref1 = this.vertices.length - 1; 1 <= ref1 ? l < ref1 : l > ref1; i = 1 <= ref1 ? ++l : --l) {
          results.push(this.triangles.push(new Bu.Triangle(this.vertices[0], this.vertices[i], this.vertices[i + 1])));
        }
        return results;
      }
    };

    Polygon.prototype.isSimple = function() {
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
    };

    Polygon.prototype.addPoint = function(point, insertIndex) {
      if (insertIndex == null) {
        this.vertices.push(point);
        if (this.vertices.length > 1) {
          this.lines[this.lines.length - 1].points[1] = point;
        }
        if (this.vertices.length > 0) {
          this.lines.push(new Bu.Line(this.vertices[this.vertices.length - 1], this.vertices[0]));
        }
        if (this.vertices.length > 2) {
          return this.triangles.push(new Bu.Triangle(this.vertices[0], this.vertices[this.vertices.length - 2], this.vertices[this.vertices.length - 1]));
        }
      } else {
        return this.vertices.splice(insertIndex, 0, point);
      }
    };

    Polygon.generateRegularPoints = function(cx, cy, radius, n, options) {
      var a, angleDelta, angleSection, i, k, points, r, ref, x, y;
      angleDelta = options.angle;
      r = radius;
      points = [];
      angleSection = Bu.TWO_PI / n;
      for (i = k = 0, ref = n; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        a = i * angleSection + angleDelta;
        x = cx + r * Math.cos(a);
        y = cy + r * Math.sin(a);
        points[i] = new Bu.Point(x, y);
      }
      return points;
    };

    return Polygon;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Polyline = (function(superClass) {
    var set;

    extend(Polyline, superClass);

    Polyline.prototype.type = 'Polyline';

    Polyline.prototype.fillable = false;

    function Polyline(vertices1) {
      var i, j, ref, vertices;
      this.vertices = vertices1 != null ? vertices1 : [];
      Polyline.__super__.constructor.call(this);
      if (arguments.length > 1) {
        vertices = [];
        for (i = j = 0, ref = arguments.length / 2; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          vertices.push(new Bu.Point(arguments[i * 2], arguments[i * 2 + 1]));
        }
        this.vertices = vertices;
      }
      this.lines = [];
      this.keyPoints = this.vertices;
      this.fill(false);
      this.on("changed", (function(_this) {
        return function() {
          if (_this.vertices.length > 1) {
            _this.updateLines();
            if (typeof _this.calcLength === "function") {
              _this.calcLength();
            }
            return typeof _this.calcPointNormalizedPos === "function" ? _this.calcPointNormalizedPos() : void 0;
          }
        };
      })(this));
      this.trigger("changed");
    }

    Polyline.prototype.clone = function() {
      var polyline;
      polyline = new Bu.Polyline(this.vertices);
      polyline.strokeStyle = this.strokeStyle;
      polyline.fillStyle = this.fillStyle;
      polyline.dashStyle = this.dashStyle;
      polyline.lineWidth = this.lineWidth;
      polyline.dashOffset = this.dashOffset;
      return polyline;
    };

    Polyline.prototype.updateLines = function() {
      var i, j, ref;
      for (i = j = 0, ref = this.vertices.length - 1; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (this.lines[i] != null) {
          this.lines[i].set(this.vertices[i], this.vertices[i + 1]);
        } else {
          this.lines[i] = new Bu.Line(this.vertices[i], this.vertices[i + 1]);
        }
      }
      return this;
    };

    set = function(points) {
      var i, j, ref;
      for (i = j = 0, ref = this.vertices.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        this.vertices[i].copy(points[i]);
      }
      if (this.vertices.length > points.length) {
        this.vertices.splice(points.length);
      }
      this.trigger("changed");
      return this;
    };

    Polyline.prototype.addPoint = function(point, insertIndex) {
      if (insertIndex == null) {
        this.vertices.push(point);
        if (this.vertices.length > 1) {
          this.lines.push(new Bu.Line(this.vertices[this.vertices.length - 2], this.vertices[this.vertices.length - 1]));
        }
      } else {
        this.vertices.splice(insertIndex, 0, point);
      }
      this.trigger("changed");
      return this;
    };

    return Polyline;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Rectangle = (function(superClass) {
    extend(Rectangle, superClass);

    Rectangle.prototype.type = 'Rectangle';

    Rectangle.prototype.fillable = true;

    function Rectangle(x, y, width, height, cornerRadius) {
      if (cornerRadius == null) {
        cornerRadius = 0;
      }
      Rectangle.__super__.constructor.call(this);
      this.center = new Bu.Point(x + width / 2, y + height / 2);
      this.size = new Bu.Size(width, height);
      this.pointLT = new Bu.Point(x, y);
      this.pointRT = new Bu.Point(x + width, y);
      this.pointRB = new Bu.Point(x + width, y + height);
      this.pointLB = new Bu.Point(x, y + height);
      this.points = [this.pointLT, this.pointRT, this.pointRB, this.pointLB];
      this.cornerRadius = cornerRadius;
      this.on('changed', (function(_this) {
        return function() {
          var ref;
          return (ref = _this.bounds) != null ? ref.update() : void 0;
        };
      })(this));
    }

    Rectangle.property('cornerRadius', {
      get: function() {
        return this._cornerRadius;
      },
      set: function(val) {
        this._cornerRadius = val;
        return this.keyPoints = val > 0 ? [] : this.points;
      }
    });

    Rectangle.prototype.clone = function() {
      return new Bu.Rectangle(this.pointLT.x, this.pointLT.y, this.size.width, this.size.height);
    };

    Rectangle.prototype.set = function(x, y, width, height) {
      this.center.set(x + width / 2, y + height / 2);
      this.size.set(width, height);
      this.pointLT.set(x, y);
      this.pointRT.set(x + width, y);
      this.pointRB.set(x + width, y + height);
      return this.pointLB.set(x, y + height);
    };

    return Rectangle;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Spline = (function(superClass) {
    var calcControlPoints;

    extend(Spline, superClass);

    Spline.prototype.type = 'Spline';

    Spline.prototype.fillable = false;

    function Spline(vertices) {
      var polyline;
      Spline.__super__.constructor.call(this);
      if (vertices instanceof Bu.Polyline) {
        polyline = vertices;
        this.vertices = polyline.vertices;
        polyline.on('pointChange', (function(_this) {
          return function(polyline) {
            _this.vertices = polyline.vertices;
            return calcControlPoints(_this);
          };
        })(this));
      } else {
        this.vertices = Bu.clone(vertices);
      }
      this.keyPoints = this.vertices;
      this.controlPointsAhead = [];
      this.controlPointsBehind = [];
      this.fill(false);
      this.smoothFactor = Bu.DEFAULT_SPLINE_SMOOTH;
      this._smoother = false;
      calcControlPoints(this);
    }

    Spline.property('smoother', {
      get: function() {
        return this._smoother;
      },
      set: function(val) {
        var oldVal;
        oldVal = this._smoother;
        this._smoother = val;
        if (oldVal !== this._smoother) {
          return calcControlPoints(this);
        }
      }
    });

    Spline.prototype.clone = function() {
      return new Bu.Spline(this.vertices);
    };

    Spline.prototype.addPoint = function(point) {
      this.vertices.push(point);
      return calcControlPoints(this);
    };

    calcControlPoints = function(spline) {
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
          spline.controlPointsAhead[i] = new Bu.Point(xA, yA);
          results.push(spline.controlPointsBehind[i] = new Bu.Point(xB, yB));
        }
        return results;
      }
    };

    return Spline;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Triangle = (function(superClass) {
    extend(Triangle, superClass);

    Triangle.prototype.type = 'Triangle';

    Triangle.prototype.fillable = true;

    function Triangle(p1, p2, p3) {
      var x1, x2, x3, y1, y2, y3;
      Triangle.__super__.constructor.call(this);
      if (arguments.length === 6) {
        x1 = arguments[0], y1 = arguments[1], x2 = arguments[2], y2 = arguments[3], x3 = arguments[4], y3 = arguments[5];
        p1 = new Bu.Point(x1, y1);
        p2 = new Bu.Point(x2, y2);
        p3 = new Bu.Point(x3, y3);
      }
      this.lines = [new Bu.Line(p1, p2), new Bu.Line(p2, p3), new Bu.Line(p3, p1)];
      this.points = [p1, p2, p3];
      this.keyPoints = this.points;
      this.on('changed', this.update);
      this.on('changed', (function(_this) {
        return function() {
          var ref;
          return (ref = _this.bounds) != null ? ref.update() : void 0;
        };
      })(this));
    }

    Triangle.prototype.clone = function() {
      return new Bu.Triangle(this.points[0], this.points[1], this.points[2]);
    };

    Triangle.prototype.update = function() {
      this.lines[0].points[0].copy(this.points[0]);
      this.lines[0].points[1].copy(this.points[1]);
      this.lines[1].points[0].copy(this.points[1]);
      this.lines[1].points[1].copy(this.points[2]);
      this.lines[2].points[0].copy(this.points[2]);
      return this.lines[2].points[1].copy(this.points[0]);
    };

    return Triangle;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Image = (function(superClass) {
    extend(Image, superClass);

    function Image(url, x, y, width, height) {
      this.url = url;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      Image.__super__.constructor.call(this);
      this.type = 'Image';
      this.autoSize = true;
      this.size = new Bu.Size;
      this.position = new Bu.Vector(x, y);
      this.center = new Bu.Vector(x + width / 2, y + height / 2);
      if (width != null) {
        this.size.set(width, height);
        this.autoSize = false;
      }
      this.pivot = new Bu.Vector(0.5, 0.5);
      this._image = new Bu.global.Image;
      this.ready = false;
      this._image.onload = (function(_this) {
        return function(e) {
          if (_this.autoSize) {
            _this.size.set(_this._image.width, _this._image.height);
          }
          return _this.ready = true;
        };
      })(this);
      if (this.url != null) {
        this._image.src = this.url;
      }
    }

    Image.property('image', {
      get: function() {
        return this._image;
      },
      set: function(val) {
        this._image = val;
        return this.ready = true;
      }
    });

    return Image;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.PointText = (function(superClass) {
    extend(PointText, superClass);


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

    function PointText(text, x, y) {
      var options;
      this.text = text;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      PointText.__super__.constructor.call(this);
      this.type = 'PointText';
      this.strokeStyle = null;
      this.fillStyle = 'black';
      options = Bu.combineOptions(arguments, {
        align: '00'
      });
      this.align = options.align;
      if (options.font != null) {
        this.font = options.font;
      } else if ((options.fontFamily != null) || (options.fontSize != null)) {
        this._fontFamily = options.fontFamily || Bu.DEFAULT_FONT_FAMILY;
        this._fontSize = options.fontSize || Bu.DEFAULT_FONT_SIZE;
        this.font = this._fontSize + "px " + this._fontFamily;
      } else {
        this.font = null;
      }
    }

    PointText.property('align', {
      get: function() {
        return this._align;
      },
      set: function(val) {
        this._align = val;
        return this.setAlign(this._align);
      }
    });

    PointText.property('fontFamily', {
      get: function() {
        return this._fontFamily;
      },
      set: function(val) {
        this._fontFamily = val;
        return this.font = this._fontSize + "px " + this._fontFamily;
      }
    });

    PointText.property('fontSize', {
      get: function() {
        return this._fontSize;
      },
      set: function(val) {
        this._fontSize = val;
        return this.font = this._fontSize + "px " + this._fontFamily;
      }
    });

    PointText.prototype.setAlign = function(align) {
      var alignX, alignY;
      if (align.length === 1) {
        align = '' + align + align;
      }
      alignX = align.substring(0, 1);
      alignY = align.substring(1, 2);
      this.textAlign = (function() {
        switch (alignX) {
          case '-':
            return 'right';
          case '0':
            return 'center';
          case '+':
            return 'left';
        }
      })();
      this.textBaseline = (function() {
        switch (alignY) {
          case '-':
            return 'bottom';
          case '0':
            return 'middle';
          case '+':
            return 'top';
        }
      })();
      return this;
    };

    PointText.prototype.setFontFamily = function(family) {
      this.fontFamily = family;
      return this;
    };

    PointText.prototype.setFontSize = function(size) {
      this.fontSize = size;
      return this;
    };

    return PointText;

  })(Bu.Object2D);

}).call(this);

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.Animation = (function() {
    function Animation(options) {
      this.from = options.from;
      this.to = options.to;
      this.duration = options.duration || 0.5;
      this.easing = options.easing || false;
      this.repeat = !!options.repeat;
      this.init = options.init;
      this.update = options.update;
      this.finish = options.finish;
    }

    Animation.prototype.applyTo = function(target, args) {
      var task;
      if (!Bu.isArray(args)) {
        args = [args];
      }
      task = new Bu.AnimationTask(this, target, args);
      Bu.animationRunner.add(task);
      return task;
    };

    Animation.prototype.isLegal = function() {
      var key, ref;
      if (!((this.from != null) && (this.to != null))) {
        return true;
      }
      if (Bu.isPlainObject(this.from)) {
        ref = this.from;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
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
    };

    return Animation;

  })();

  Bu.animations = {
    fadeIn: new Bu.Animation({
      update: function(anim) {
        return this.opacity = anim.t;
      }
    }),
    fadeOut: new Bu.Animation({
      update: function(anim) {
        return this.opacity = 1 - anim.t;
      }
    }),
    spin: new Bu.Animation({
      update: function(anim) {
        return this.rotation = anim.t * Math.PI * 2;
      }
    }),
    spinIn: new Bu.Animation({
      init: function(anim) {
        return anim.data.desScale = anim.arg || 1;
      },
      update: function(anim) {
        this.opacity = anim.t;
        this.rotation = anim.t * Math.PI * 4;
        return this.scale = anim.t * anim.data.desScale;
      }
    }),
    spinOut: new Bu.Animation({
      update: function(anim) {
        this.opacity = 1 - anim.t;
        this.rotation = anim.t * Math.PI * 4;
        return this.scale = 1 - anim.t;
      }
    }),
    blink: new Bu.Animation({
      duration: 0.2,
      from: 0,
      to: 512,
      update: function(anim) {
        var d;
        d = Math.floor(Math.abs(anim.current - 256));
        return this.fillStyle = "rgb(" + d + ", " + d + ", " + d + ")";
      }
    }),
    shake: new Bu.Animation({
      init: function(anim) {
        anim.data.ox = this.position.x;
        return anim.data.range = anim.arg || 20;
      },
      update: function(anim) {
        return this.position.x = Math.sin(anim.t * Math.PI * 8) * anim.data.range + anim.data.ox;
      }
    }),
    jump: new Bu.Animation({
      init: function(anim) {
        anim.data.oy = this.position.y;
        return anim.data.height = anim.arg || 100;
      },
      update: function(anim) {
        return this.position.y = -anim.data.height * Math.sin(anim.t * Math.PI) + anim.data.oy;
      }
    }),
    puff: new Bu.Animation({
      duration: 0.15,
      init: function(anim) {
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
      update: function(anim) {
        this.opacity = anim.current.opacity;
        return this.scale = anim.current.scale;
      }
    }),
    clip: new Bu.Animation({
      init: function(anim) {
        if (this.scale.y !== 0) {
          anim.from = this.scale.y;
          return anim.to = 0;
        } else {
          anim.from = this.scale.y;
          return anim.to = this.scale.x;
        }
      },
      update: function(anim) {
        return this.scale.y = anim.current;
      }
    }),
    flipX: new Bu.Animation({
      init: function(anim) {
        anim.from = this.scale.x;
        return anim.to = -anim.from;
      },
      update: function(anim) {
        return this.scale.x = anim.current;
      }
    }),
    flipY: new Bu.Animation({
      init: function(anim) {
        anim.from = this.scale.y;
        return anim.to = -anim.from;
      },
      update: function(anim) {
        return this.scale.y = anim.current;
      }
    }),
    moveTo: new Bu.Animation({
      init: function(anim) {
        if (anim.arg != null) {
          anim.from = this.position.x;
          return anim.to = parseFloat(anim.arg);
        } else {
          return console.error('Bu.animations.moveTo need an argument');
        }
      },
      update: function(anim) {
        return this.position.x = anim.current;
      }
    }),
    moveBy: new Bu.Animation({
      init: function(anim) {
        if (anim.args != null) {
          anim.from = this.position.x;
          return anim.to = this.position.x + parseFloat(anim.args);
        } else {
          return console.error('Bu.animations.moveBy need an argument');
        }
      },
      update: function(anim) {
        return this.position.x = anim.current;
      }
    }),
    discolor: new Bu.Animation({
      init: function(anim) {
        var desColor;
        desColor = anim.arg;
        if (Bu.isString(desColor)) {
          desColor = new Bu.Color(desColor);
        }
        anim.from = new Bu.Color(this.fillStyle);
        return anim.to = desColor;
      },
      update: function(anim) {
        return this.fillStyle = anim.current.toRGBA();
      }
    })
  };

}).call(this);

(function() {
  Bu.AnimationRunner = (function() {
    var DEFAULT_EASING_FUNCTION, easingFunctions;

    function AnimationRunner() {
      this.runningAnimations = [];
    }

    AnimationRunner.prototype.add = function(task) {
      task.init();
      if (task.animation.isLegal()) {
        task.startTime = Bu.now();
        return this.runningAnimations.push(task);
      } else {
        return console.error('Bu.AnimationRunner: animation setting is illegal: ', task.animation);
      }
    };

    AnimationRunner.prototype.update = function() {
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
    };

    AnimationRunner.prototype.hookUp = function(renderer) {
      return renderer.on('update', (function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    DEFAULT_EASING_FUNCTION = 'quad';

    easingFunctions = {
      quadIn: function(t) {
        return t * t;
      },
      quadOut: function(t) {
        return t * (2 - t);
      },
      quad: function(t) {
        if (t < 0.5) {
          return 2 * t * t;
        } else {
          return -2 * t * t + 4 * t - 1;
        }
      },
      cubicIn: function(t) {
        return Math.pow(t, 3);
      },
      cubicOut: function(t) {
        return Math.pow(t - 1, 3) + 1;
      },
      cubic: function(t) {
        if (t < 0.5) {
          return 4 * Math.pow(t, 3);
        } else {
          return 4 * Math.pow(t - 1, 3) + 1;
        }
      },
      sineIn: function(t) {
        return Math.sin((t - 1) * Bu.HALF_PI) + 1;
      },
      sineOut: function(t) {
        return Math.sin(t * Bu.HALF_PI);
      },
      sine: function(t) {
        if (t < 0.5) {
          return (Math.sin((t * 2 - 1) * Bu.HALF_PI) + 1) / 2;
        } else {
          return Math.sin((t - 0.5) * Math.PI) / 2 + 0.5;
        }
      }
    };

    return AnimationRunner;

  })();

  Bu.animationRunner = new Bu.AnimationRunner;

}).call(this);

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.AnimationTask = (function() {
    var interpolateColor, interpolateNum, interpolateVector;

    function AnimationTask(animation, target, args) {
      this.animation = animation;
      this.target = target;
      this.args = args != null ? args : [];
      this.startTime = 0;
      this.finished = false;
      this.from = Bu.clone(this.animation.from);
      this.current = Bu.clone(this.animation.from);
      this.to = Bu.clone(this.animation.to);
      this.data = {};
      this.t = 0;
      this.arg = this.args[0];
    }

    AnimationTask.prototype.init = function() {
      var ref;
      if ((ref = this.animation.init) != null) {
        ref.call(this.target, this);
      }
      return this.current = Bu.clone(this.from);
    };

    AnimationTask.prototype.restart = function() {
      this.startTime = Bu.now();
      return this.finished = false;
    };

    AnimationTask.prototype.end = function() {
      return this.startTime = Bu.now() - this.animation.duration * 1000;
    };

    AnimationTask.prototype.interpolate = function() {
      var key, ref, results;
      if (this.from == null) {
        return;
      }
      if (Bu.isNumber(this.from)) {
        return this.current = interpolateNum(this.from, this.to, this.t);
      } else if (this.from instanceof Bu.Color) {
        return interpolateColor(this.from, this.to, this.t, this.current);
      } else if (this.from instanceof Bu.Vector) {
        return interpolateVector(this.from, this.to, this.t, this.current);
      } else if (Bu.isPlainObject(this.from)) {
        ref = this.from;
        results = [];
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          if (Bu.isNumber(this.from[key])) {
            results.push(this.current[key] = interpolateNum(this.from[key], this.to[key], this.t));
          } else {
            results.push(interpolateObject(this.from[key], this.to[key], this.t, this.current[key]));
          }
        }
        return results;
      } else {
        return console.error("Bu.Animation not support interpolate type: ", this.from);
      }
    };

    interpolateNum = function(a, b, t) {
      return b * t - a * (t - 1);
    };

    interpolateColor = function(a, b, t, c) {
      return c.setRGBA(interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t));
    };

    interpolateVector = function(a, b, t, c) {
      c.x = interpolateNum(a.x, b.x, t);
      return c.y = interpolateNum(a.y, b.y, t);
    };

    return AnimationTask;

  })();

}).call(this);

(function() {
  Bu.DashFlowManager = (function() {
    function DashFlowManager() {
      this.flowingObjects = [];
    }

    DashFlowManager.prototype.setSpeed = function(target, speed) {
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
    };

    DashFlowManager.prototype.update = function() {
      var j, len, o, ref, results;
      ref = this.flowingObjects;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        o = ref[j];
        results.push(o.dashOffset += o.dashFlowSpeed);
      }
      return results;
    };

    DashFlowManager.prototype.hookUp = function(renderer) {
      return renderer.on('update', (function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    return DashFlowManager;

  })();

  Bu.dashFlowManager = new Bu.DashFlowManager;

}).call(this);

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.SpriteSheet = (function() {
    var canvas, clipImage, context;

    function SpriteSheet(url) {
      this.url = url;
      Bu.Event.apply(this);
      this.ready = false;
      this.height = 0;
      this.data = null;
      this.images = [];
      this.frameImages = [];
      $.ajax(this.url, {
        success: (function(_this) {
          return function(text) {
            var baseUrl, countLoaded, i, ref, results;
            _this.data = JSON.parse(text);
            if (_this.data.images == null) {
              _this.data.images = [_this.url.substring(_this.url.lastIndexOf('/'), _this.url.length - 5) + '.png'];
            }
            baseUrl = _this.url.substring(0, _this.url.lastIndexOf('/') + 1);
            ref = _this.data.images;
            results = [];
            for (i in ref) {
              if (!hasProp.call(ref, i)) continue;
              _this.data.images[i] = baseUrl + _this.data.images[i];
              countLoaded = 0;
              _this.images[i] = new Image;
              _this.images[i].onload = function() {
                countLoaded += 1;
                if (countLoaded === _this.data.images.length) {
                  return _this.parseData();
                }
              };
              results.push(_this.images[i].src = _this.data.images[i]);
            }
            return results;
          };
        })(this)
      });
    }

    SpriteSheet.prototype.parseData = function() {
      var frameIndex, frames, h, i, j, k, ref, w, x, y;
      frames = this.data.frames;
      for (i in frames) {
        if (!hasProp.call(frames, i)) continue;
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
    };

    SpriteSheet.prototype.getFrameImage = function(key, index) {
      var animation;
      if (index == null) {
        index = 0;
      }
      if (!this.ready) {
        return null;
      }
      animation = this.data.animations[key];
      if (animation == null) {
        return null;
      }
      return this.frameImages[animation.frames[index]];
    };

    SpriteSheet.prototype.measureTextWidth = function(text) {
      var char, k, len, width;
      width = 0;
      for (k = 0, len = text.length; k < len; k++) {
        char = text[k];
        width += this.getFrameImage(char).width;
      }
      return width;
    };

    canvas = document.createElement('canvas');

    context = canvas.getContext('2d');

    clipImage = function(image, x, y, w, h) {
      var newImage;
      canvas.width = w;
      canvas.height = h;
      context.drawImage(image, x, y, w, h, 0, 0, w, h);
      newImage = new Image();
      newImage.src = canvas.toDataURL();
      return newImage;
    };

    return SpriteSheet;

  })();

}).call(this);

(function() {
  Bu.InputManager = (function() {
    function InputManager() {
      this.keyStates = [];
      window.addEventListener('keydown', (function(_this) {
        return function(e) {
          return _this.keyStates[e.keyCode] = true;
        };
      })(this));
      window.addEventListener('keyup', (function(_this) {
        return function(e) {
          return _this.keyStates[e.keyCode] = false;
        };
      })(this));
    }

    InputManager.prototype.isKeyDown = function(key) {
      var keyCode;
      keyCode = this.keyToKeyCode(key);
      return this.keyStates[keyCode];
    };

    InputManager.prototype.keyToKeyCode = function(key) {
      var keyCode;
      key = this.keyAliasToKeyMap[key] || key;
      return keyCode = this.keyToKeyCodeMap[key];
    };

    InputManager.prototype.handleAppEvents = function(app, events) {
      var key, keyCode, keydownListeners, keyupListeners, results, type;
      keydownListeners = {};
      keyupListeners = {};
      window.addEventListener('keydown', (function(_this) {
        return function(e) {
          var ref;
          return (ref = keydownListeners[e.keyCode]) != null ? ref.call(app, e) : void 0;
        };
      })(this));
      window.addEventListener('keyup', (function(_this) {
        return function(e) {
          var ref;
          return (ref = keyupListeners[e.keyCode]) != null ? ref.call(app, e) : void 0;
        };
      })(this));
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
    };

    InputManager.prototype.keyToKeyCodeMap = {
      Backspace: 8,
      Tab: 9,
      Enter: 13,
      Shift: 16,
      Control: 17,
      Alt: 18,
      CapsLock: 20,
      Escape: 27,
      ' ': 32,
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

    InputManager.prototype.keyAliasToKeyMap = {
      Ctrl: 'Control',
      Ctl: 'Control',
      Esc: 'Escape',
      Space: ' ',
      PgUp: 'PageUp',
      'Page Up': 'PageUp',
      PgDn: 'PageDown',
      'Page Down': 'PageDown',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete'
    };

    return InputManager;

  })();

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bu.MouseControl = (function() {
    var scaleAnimation, translateAnimation;

    scaleAnimation = new Bu.Animation({
      duration: 0.2,
      init: function(anim) {
        if (anim.arg == null) {
          anim.arg = 1;
        }
        anim.from = this.scale.clone();
        return anim.to = this.scale.clone().multiplyScalar(parseFloat(anim.arg));
      },
      update: function(anim) {
        return this.scale = anim.current;
      }
    });

    translateAnimation = new Bu.Animation({
      duration: 0.2,
      init: function(anim) {
        if (anim.arg == null) {
          anim.arg = new Bu.Vector;
        }
        anim.from = this.position.clone();
        return anim.to = this.position.clone().add(anim.arg);
      },
      update: function(anim) {
        return this.position.copy(anim.current);
      }
    });

    function MouseControl(camera, dom) {
      this.camera = camera;
      this.onMouseWheel = bind(this.onMouseWheel, this);
      this.onMouseMove = bind(this.onMouseMove, this);
      this.zoomScaleAnim = scaleAnimation.applyTo(this.camera);
      this.zoomTransAnim = translateAnimation.applyTo(this.camera);
      this.smoothZooming = true;
      this.desScale = new Bu.Vector(1, 1);
      dom.addEventListener('mousemove', this.onMouseMove);
      dom.addEventListener('mousewheel', this.onMouseWheel);
    }

    MouseControl.prototype.onMouseMove = function(e) {
      var dx, dy, scale;
      if (e.buttons === Bu.MOUSE.LEFT) {
        scale = this.camera.scale.x;
        dx = -e.movementX * scale;
        dy = -e.movementY * scale;
        return this.camera.translate(dx, dy);
      }
    };

    MouseControl.prototype.onMouseWheel = function(e) {
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
    };

    return MouseControl;

  })();

}).call(this);

(function() {
  var G,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  Bu.geometryAlgorithm = G = {
    inject: function() {
      return this.injectInto(['point', 'line', 'circle', 'ellipse', 'triangle', 'rectangle', 'fan', 'bow', 'polygon', 'polyline']);
    },
    injectInto: function(shapes) {
      if (Bu.isString(shapes)) {
        shapes = [shapes];
      }
      if (indexOf.call(shapes, 'point') >= 0) {
        Bu.Point.prototype.inCircle = function(circle) {
          return G.pointInCircle(this, circle);
        };
        Bu.Point.prototype.distanceTo = function(point) {
          return G.distanceFromPointToPoint(this, point);
        };
        Bu.Point.prototype.isNear = function(target, limit) {
          if (limit == null) {
            limit = Bu.DEFAULT_NEAR_DIST;
          }
          switch (target.type) {
            case 'Point':
              return G.pointNearPoint(this, target, limit);
            case 'Line':
              return G.pointNearLine(this, target, limit);
            case 'Polyline':
              return G.pointNearPolyline(this, target, limit);
          }
        };
        Bu.Point.interpolate = G.interpolateBetweenTwoPoints;
      }
      if (indexOf.call(shapes, 'line') >= 0) {
        Bu.Line.prototype.distanceTo = function(point) {
          return G.distanceFromPointToLine(point, this);
        };
        Bu.Line.prototype.isTwoPointsSameSide = function(p1, p2) {
          return G.twoPointsSameSideOfLine(p1, p2, this);
        };
        Bu.Line.prototype.footPointFrom = function(point, saveTo) {
          return G.footPointFromPointToLine(point, this, saveTo);
        };
        Bu.Line.prototype.getCrossPointWith = function(line) {
          return G.getCrossPointOfTwoLines(line, this);
        };
        Bu.Line.prototype.isCrossWithLine = function(line) {
          return G.isTwoLinesCross(line, this);
        };
        Bu.Rectangle.prototype.intersectRect = function(rect) {
          return G.isLineIntersectRect(this, rect);
        };
      }
      if (indexOf.call(shapes, 'circle') >= 0) {
        Bu.Circle.prototype._containsPoint = function(point) {
          return G.pointInCircle(point, this);
        };
      }
      if (indexOf.call(shapes, 'ellipse') >= 0) {
        Bu.Ellipse.prototype._containsPoint = function(point) {
          return G.pointInEllipse(point, this);
        };
      }
      if (indexOf.call(shapes, 'triangle') >= 0) {
        Bu.Triangle.prototype._containsPoint = function(point) {
          return G.pointInTriangle(point, this);
        };
        Bu.Triangle.prototype.area = function() {
          return G.calcTriangleArea(this);
        };
      }
      if (indexOf.call(shapes, 'rectangle') >= 0) {
        Bu.Rectangle.prototype.containsPoint = function(point) {
          return G.pointInRectangle(point, this);
        };
        Bu.Rectangle.prototype.intersectLine = function(line) {
          return G.isLineIntersectRect(line, this);
        };
      }
      if (indexOf.call(shapes, 'fan') >= 0) {
        Bu.Fan.prototype._containsPoint = function(point) {
          return G.pointInFan(point, this);
        };
      }
      if (indexOf.call(shapes, 'bow') >= 0) {
        Bu.Bow.prototype._containsPoint = function(point) {
          return G.pointInBow(point, this);
        };
      }
      if (indexOf.call(shapes, 'polygon') >= 0) {
        Bu.Polygon.prototype._containsPoint = function(point) {
          return G.pointInPolygon(point, this);
        };
      }
      if (indexOf.call(shapes, 'polyline') >= 0) {
        Bu.Polyline.prototype.length = 0;
        Bu.Polyline.prototype.pointNormalizedPos = [];
        Bu.Polyline.prototype.calcLength = function() {
          return this.length = G.calcPolylineLength(this);
        };
        Bu.Polyline.prototype.calcPointNormalizedPos = function() {
          return G.calcNormalizedVerticesPosOfPolyline(this);
        };
        Bu.Polyline.prototype.getNormalizedPos = function(index) {
          if (index != null) {
            return this.pointNormalizedPos[index];
          } else {
            return this.pointNormalizedPos;
          }
        };
        return Bu.Polyline.prototype.compress = function(strength) {
          if (strength == null) {
            strength = 0.8;
          }
          return G.compressPolyline(this, strength);
        };
      }
    },
    pointNearPoint: function(point, target, limit) {
      if (limit == null) {
        limit = Bu.DEFAULT_NEAR_DIST;
      }
      return point.distanceTo(target) < limit;
    },
    pointNearLine: function(point, line, limit) {
      var footPoint, isBetween1, isBetween2, verticalDist;
      if (limit == null) {
        limit = Bu.DEFAULT_NEAR_DIST;
      }
      verticalDist = line.distanceTo(point);
      footPoint = line.footPointFrom(point);
      isBetween1 = footPoint.distanceTo(line.points[0]) < line.length + limit;
      isBetween2 = footPoint.distanceTo(line.points[1]) < line.length + limit;
      return verticalDist < limit && isBetween1 && isBetween2;
    },
    pointNearPolyline: function(point, polyline, limit) {
      var j, len1, line, ref;
      if (limit == null) {
        limit = Bu.DEFAULT_NEAR_DIST;
      }
      ref = polyline.lines;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        line = ref[j];
        if (G.pointNearLine(point, line, limit)) {
          return true;
        }
      }
      return false;
    },
    pointInCircle: function(point, circle) {
      var dx, dy;
      dx = point.x - circle.cx;
      dy = point.y - circle.cy;
      return Bu.bevel(dx, dy) < circle.radius;
    },
    pointInEllipse: function(point, ellipse) {
      return Bu.bevel(point.x / ellipse.radiusX, point.y / ellipse.radiusY) < 1;
    },
    pointInRectangle: function(point, rectangle) {
      return point.x > rectangle.pointLT.x && point.y > rectangle.pointLT.y && point.x < rectangle.pointLT.x + rectangle.size.width && point.y < rectangle.pointLT.y + rectangle.size.height;
    },
    pointInTriangle: function(point, triangle) {
      return G.twoPointsSameSideOfLine(point, triangle.points[2], triangle.lines[0]) && G.twoPointsSameSideOfLine(point, triangle.points[0], triangle.lines[1]) && G.twoPointsSameSideOfLine(point, triangle.points[1], triangle.lines[2]);
    },
    pointInFan: function(point, fan) {
      var a, dx, dy;
      dx = point.x - fan.cx;
      dy = point.y - fan.cy;
      a = Math.atan2(point.y - fan.cy, point.x - fan.cx);
      while (a < fan.aFrom) {
        a += Bu.TWO_PI;
      }
      return Bu.bevel(dx, dy) < fan.radius && a > fan.aFrom && a < fan.aTo;
    },
    pointInBow: function(point, bow) {
      var sameSide, smallThanHalfCircle;
      if (Bu.bevel(bow.cx - point.x, bow.cy - point.y) < bow.radius) {
        sameSide = bow.string.isTwoPointsSameSide(bow.center, point);
        smallThanHalfCircle = bow.aTo - bow.aFrom < Math.PI;
        return sameSide ^ smallThanHalfCircle;
      } else {
        return false;
      }
    },
    pointInPolygon: function(point, polygon) {
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
    distanceFromPointToPoint: function(point1, point2) {
      return Bu.bevel(point1.x - point2.x, point1.y - point2.y);
    },
    distanceFromPointToLine: function(point, line) {
      var a, b, p1, p2;
      p1 = line.points[0];
      p2 = line.points[1];
      a = (p1.y - p2.y) / (p1.x - p2.x);
      b = p1.y - a * p1.x;
      return Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1);
    },
    interpolateBetweenTwoPoints: function(p1, p2, k, p3) {
      var x, y;
      x = p1.x + (p2.x - p1.x) * k;
      y = p1.y + (p2.y - p1.y) * k;
      if (p3 != null) {
        return p3.set(x, y);
      } else {
        return new Bu.Point(x, y);
      }
    },
    twoPointsSameSideOfLine: function(p1, p2, line) {
      var pA, pB, y01, y02;
      pA = line.points[0];
      pB = line.points[1];
      if (pA.x === pB.x) {
        return (p1.x - pA.x) * (p2.x - pA.x) > 0;
      } else {
        y01 = (pA.y - pB.y) * (p1.x - pA.x) / (pA.x - pB.x) + pA.y;
        y02 = (pA.y - pB.y) * (p2.x - pA.x) / (pA.x - pB.x) + pA.y;
        return (p1.y - y01) * (p2.y - y02) > 0;
      }
    },
    footPointFromPointToLine: function(point, line, saveTo) {
      var A, B, m, p1, p2, x, y;
      if (saveTo == null) {
        saveTo = new Bu.Point;
      }
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
    getCrossPointOfTwoLines: function(line1, line2) {
      var a1, a2, b1, b2, c1, c2, det, p1, p2, q1, q2, ref, ref1;
      ref = line1.points, p1 = ref[0], p2 = ref[1];
      ref1 = line2.points, q1 = ref1[0], q2 = ref1[1];
      a1 = p2.y - p1.y;
      b1 = p1.x - p2.x;
      c1 = (a1 * p1.x) + (b1 * p1.y);
      a2 = q2.y - q1.y;
      b2 = q1.x - q2.x;
      c2 = (a2 * q1.x) + (b2 * q1.y);
      det = (a1 * b2) - (a2 * b1);
      return new Bu.Point(((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det);
    },
    isTwoLinesCross: function(line1, line2) {
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
    isLineIntersectRect: function(line, rect) {
      var lines;
      lines = [new Bu.Line, new Bu.Line, new Bu.Line, new Bu.Line];
      lines[0].set(rect.points[0], rect.points[1]);
      lines[1].set(rect.points[1], rect.points[2]);
      lines[2].set(rect.points[2], rect.points[3]);
      lines[3].set(rect.points[3], rect.points[0]);
      return G.isTwoLinesCross(line, lines[0]) || G.isTwoLinesCross(line, lines[1]) || G.isTwoLinesCross(line, lines[2]) || G.isTwoLinesCross(line, lines[3]);
    },
    calcPolylineLength: function(polyline) {
      var i, j, len, ref;
      len = 0;
      if (polyline.vertices.length >= 2) {
        for (i = j = 1, ref = polyline.vertices.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
          len += polyline.vertices[i].distanceTo(polyline.vertices[i - 1]);
        }
      }
      return len;
    },
    calcNormalizedVerticesPosOfPolyline: function(polyline) {
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
    compressPolyline: function(polyline, strength) {
      var compressed, i, obliqueAngle, pA, pB, pM, ref, ref1;
      compressed = [];
      ref = polyline.vertices;
      for (i in ref) {
        if (!hasProp.call(ref, i)) continue;
        if (i < 2) {
          compressed[i] = polyline.vertices[i];
        } else {
          ref1 = compressed.slice(-2), pA = ref1[0], pM = ref1[1];
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
    calcTriangleArea: function(triangle) {
      var a, b, c, ref;
      ref = triangle.points, a = ref[0], b = ref[1], c = ref[2];
      return Math.abs(((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y))) / 2;
    }
  };

  G.inject();

}).call(this);

(function() {
  Bu.ShapeRandomizer = (function() {
    var MARGIN;

    MARGIN = 30;

    ShapeRandomizer.prototype.rangeX = 0;

    ShapeRandomizer.prototype.rangeY = 0;

    ShapeRandomizer.prototype.rangeWidth = 800;

    ShapeRandomizer.prototype.rangeHeight = 450;

    function ShapeRandomizer() {}

    ShapeRandomizer.prototype.randomX = function() {
      return Bu.rand(this.rangeX + MARGIN, this.rangeX + this.rangeWidth - MARGIN * 2);
    };

    ShapeRandomizer.prototype.randomY = function() {
      return Bu.rand(this.rangeY + MARGIN, this.rangeY + this.rangeHeight - MARGIN * 2);
    };

    ShapeRandomizer.prototype.randomRadius = function() {
      return Bu.rand(10, Math.min(this.rangeX + this.rangeWidth, this.rangeY + this.rangeHeight) / 2);
    };

    ShapeRandomizer.prototype.setRange = function(a, b, c, d) {
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
    };

    ShapeRandomizer.prototype.generate = function(type) {
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
    };

    ShapeRandomizer.prototype.randomize = function(shape) {
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
    };

    ShapeRandomizer.prototype.randomizePosition = function(shape) {
      shape.position.x = this.randomX();
      shape.position.y = this.randomY();
      shape.trigger('changed');
      return this;
    };

    ShapeRandomizer.prototype.generateCircle = function() {
      var circle;
      circle = new Bu.Circle(this.randomRadius(), this.randomX(), this.randomY());
      circle.center.label = 'O';
      return circle;
    };

    ShapeRandomizer.prototype.randomizeCircle = function(circle) {
      circle.cx = this.randomX();
      circle.cy = this.randomY();
      circle.radius = this.randomRadius();
      return this;
    };

    ShapeRandomizer.prototype.generateEllipse = function() {
      var ellipse;
      ellipse = new Bu.Ellipse(this.randomRadius(), this.randomRadius());
      this.randomizePosition(ellipse);
      return ellipse;
    };

    ShapeRandomizer.prototype.randomizeEllipse = function(ellipse) {
      ellipse.radiusX = this.randomRadius();
      ellipse.radiusY = this.randomRadius();
      this.randomizePosition(ellipse);
      return this;
    };

    ShapeRandomizer.prototype.generateBow = function() {
      var aFrom, aTo, bow;
      aFrom = Bu.rand(Bu.TWO_PI);
      aTo = aFrom + Bu.rand(Bu.HALF_PI, Bu.TWO_PI);
      bow = new Bu.Bow(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
      bow.string.points[0].label = 'A';
      bow.string.points[1].label = 'B';
      return bow;
    };

    ShapeRandomizer.prototype.randomizeBow = function(bow) {
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
    };

    ShapeRandomizer.prototype.generateFan = function() {
      var aFrom, aTo, fan;
      aFrom = Bu.rand(Bu.TWO_PI);
      aTo = aFrom + Bu.rand(Bu.HALF_PI, Bu.TWO_PI);
      fan = new Bu.Fan(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
      fan.center.label = 'O';
      fan.string.points[0].label = 'A';
      fan.string.points[1].label = 'B';
      return fan;
    };

    ShapeRandomizer.prototype.randomizeFan = ShapeRandomizer.prototype.randomizeBow;

    ShapeRandomizer.prototype.generateTriangle = function() {
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
    };

    ShapeRandomizer.prototype.randomizeTriangle = function(triangle) {
      var i, j;
      for (i = j = 0; j <= 2; i = ++j) {
        triangle.points[i].set(this.randomX(), this.randomY());
      }
      triangle.trigger('changed');
      return this;
    };

    ShapeRandomizer.prototype.generateRectangle = function() {
      var rect;
      rect = new Bu.Rectangle(Bu.rand(this.rangeX + this.rangeWidth), Bu.rand(this.rangeY + this.rangeHeight), Bu.rand(this.rangeWidth / 2), Bu.rand(this.rangeHeight / 2));
      rect.pointLT.label = 'A';
      rect.pointRT.label = 'B';
      rect.pointRB.label = 'C';
      rect.pointLB.label = 'D';
      return rect;
    };

    ShapeRandomizer.prototype.randomizeRectangle = function(rectangle) {
      rectangle.set(this.randomX(), this.randomY(), this.randomRadius(), this.randomRadius());
      rectangle.trigger('changed');
      return this;
    };

    ShapeRandomizer.prototype.generatePolygon = function() {
      var i, j, point, points;
      points = [];
      for (i = j = 0; j <= 3; i = ++j) {
        point = new Bu.Point(this.randomX(), this.randomY());
        point.label = 'P' + i;
        points.push(point);
      }
      return new Bu.Polygon(points);
    };

    ShapeRandomizer.prototype.randomizePolygon = function(polygon) {
      var j, len, ref, vertex;
      ref = polygon.vertices;
      for (j = 0, len = ref.length; j < len; j++) {
        vertex = ref[j];
        vertex.set(this.randomX(), this.randomY());
      }
      polygon.trigger('changed');
      return this;
    };

    ShapeRandomizer.prototype.generateLine = function() {
      var line;
      line = new Bu.Line(this.randomX(), this.randomY(), this.randomX(), this.randomY());
      line.points[0].label = 'A';
      line.points[1].label = 'B';
      return line;
    };

    ShapeRandomizer.prototype.randomizeLine = function(line) {
      var j, len, point, ref;
      ref = line.points;
      for (j = 0, len = ref.length; j < len; j++) {
        point = ref[j];
        point.set(this.randomX(), this.randomY());
      }
      line.trigger('changed');
      return this;
    };

    ShapeRandomizer.prototype.generatePolyline = function() {
      var i, j, point, polyline;
      polyline = new Bu.Polyline;
      for (i = j = 0; j <= 3; i = ++j) {
        point = new Bu.Point(this.randomX(), this.randomY());
        point.label = 'P' + i;
        polyline.addPoint(point);
      }
      return polyline;
    };

    ShapeRandomizer.prototype.randomizePolyline = function(polyline) {
      var j, len, ref, vertex;
      ref = polyline.vertices;
      for (j = 0, len = ref.length; j < len; j++) {
        vertex = ref[j];
        vertex.set(this.randomX(), this.randomY());
      }
      polyline.trigger('changed');
      return this;
    };

    return ShapeRandomizer;

  })();

}).call(this);

//# sourceMappingURL=bu.js.map
