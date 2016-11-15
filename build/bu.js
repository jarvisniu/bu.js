// Bu.js v0.4.0 - https://github.com/jarvisniu/Bu.js
(function() {
  var base, base1, currentTime, global, lastTime,
    hasProp = {}.hasOwnProperty;

  global = window || this;

  global.Bu = {
    global: global
  };

  Bu.VERSION = '0.4.0';

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

  Bu.MOUSE_BUTTON_NONE = -1;

  Bu.MOUSE_BUTTON_LEFT = 0;

  Bu.MOUSE_BUTTON_MIDDLE = 1;

  Bu.MOUSE_BUTTON_RIGHT = 2;

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
    if (to == null) {
      to = from;
      from = 0;
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
      if (clone.constructor.name === 'Function') {
        console.log(clone);
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
      console.info('Bu.js v' + Bu.VERSION + ' - [https://github.com/jarvisniu/Bu.js]');
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
    var CSS3_COLORS, RE_HEX3, RE_HEX6, RE_RGB, RE_RGBA, RE_RGBA_PER, RE_RGB_PER, clampAlpha;

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
      var found, hex;
      if (found = str.match(RE_RGBA)) {
        this.r = parseInt(found[1]);
        this.g = parseInt(found[2]);
        this.b = parseInt(found[3]);
        this.a = parseFloat(found[4]);
      } else if (found = str.match(RE_RGB)) {
        this.r = parseInt(found[1]);
        this.g = parseInt(found[2]);
        this.b = parseInt(found[3]);
        this.a = 1;
      } else if (found = str.match(RE_RGBA_PER)) {
        this.r = parseInt(found[1] * 255 / 100);
        this.g = parseInt(found[2] * 255 / 100);
        this.b = parseInt(found[3] * 255 / 100);
        this.a = parseFloat(found[4]);
      } else if (found = str.match(RE_RGB_PER)) {
        this.r = parseInt(found[1] * 255 / 100);
        this.g = parseInt(found[2] * 255 / 100);
        this.b = parseInt(found[3] * 255 / 100);
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

    Vector.prototype.set = function(x, y) {
      this.x = x;
      this.y = y;
      return this;
    };

    Vector.prototype.copy = function(v) {
      this.x = v.x;
      this.y = v.y;
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

    Object2D.prototype.addChild = function(shape) {
      var j, len, s;
      if (Bu.isArray(shape)) {
        for (j = 0, len = shape.length; j < len; j++) {
          s = shape[j];
          this.children.push(s);
        }
      } else {
        this.children.push(shape);
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

    Object2D.prototype.hitTest = function(p) {
      p.unProject(this);
      return this.containsPoint(p);
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
    hover: new Bu.Styled().stroke('hsla(0, 100%, 25%, 0.75)').fill('hsla(0, 100%, 75%, 0.5)'),
    text: new Bu.Styled().stroke(false).fill('black'),
    line: new Bu.Styled().fill(false),
    selected: new Bu.Styled().stroke('#AA0').fill(),
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
	hierarchy: # an tree that represent the object hierarchy of the scene, the keys are in `objects`
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
      ref = ["renderer", "data", "objects", "hierarchy", "methods", "events"];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        (base = this.$options)[k] || (base[k] = {});
      }
      this.$objects = {};
      this.$inputManager = new Bu.InputManager;
      Bu.ready(this.init, this);
    }

    App.prototype.init = function() {
      var assembleObjects, k, name, ref;
      this.$renderer = new Bu.Renderer(this.$options.renderer);
      if (Bu.isFunction(this.$options.data)) {
        this.$options.data = this.$options.data.apply(this);
      }
      for (k in this.$options.data) {
        this[k] = this.$options.data[k];
      }
      for (k in this.$options.methods) {
        this[k] = this.$options.methods[k];
      }
      if (Bu.isFunction(this.$options.objects)) {
        this.$objects = this.$options.objects.apply(this);
      } else {
        for (name in this.$options.objects) {
          this.$objects[name] = this.$options.objects[name];
        }
      }
      assembleObjects = (function(_this) {
        return function(children, parent) {
          var results;
          results = [];
          for (name in children) {
            if (!hasProp.call(children, name)) continue;
            parent.children.push(_this.$objects[name]);
            results.push(assembleObjects(children[name], _this.$objects[name]));
          }
          return results;
        };
      })(this);
      assembleObjects(this.$options.hierarchy, this.$renderer.scene);
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
        if (type === 'mousedown' || type === 'mousemove' || type === 'mouseup' || type === 'keydown' || type === 'keyup') {
          results.push(app.$renderer.dom.addEventListener(type, events[type].bind(app)));
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

  Bu.Renderer = (function() {
    function Renderer() {
      this.drawShape = bind(this.drawShape, this);
      this.drawShapes = bind(this.drawShapes, this);
      var appendDom, j, len1, name, onResize, options, ref, tick;
      Bu.Event.apply(this);
      this.type = 'Renderer';
      this.scene = new Bu.Scene;
      this.camera = new Bu.Camera;
      this.tickCount = 0;
      this.isRunning = true;
      this.pixelRatio = Bu.global.devicePixelRatio || 1;
      if (typeof ClipMeter !== "undefined" && ClipMeter !== null) {
        this.clipMeter = new ClipMeter();
      }
      options = Bu.combineOptions(arguments, {
        container: 'body',
        background: '#eee',
        fps: 60,
        showKeyPoints: false,
        showBounds: false,
        originAtCenter: false,
        imageSmoothing: true
      });
      ref = ['container', 'width', 'height', 'fps', 'showKeyPoints', 'showBounds', 'originAtCenter'];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        name = ref[j];
        this[name] = options[name];
      }
      this.fillParent = !Bu.isNumber(options.width);
      this.width *= this.pixelRatio;
      this.height *= this.pixelRatio;
      this.dom = document.createElement('canvas');
      this.dom.style.cursor = options.cursor || 'default';
      this.dom.style.boxSizing = 'content-box';
      this.dom.style.background = options.background;
      this.dom.oncontextmenu = function() {
        return false;
      };
      this.context = this.dom.getContext('2d');
      this.context.textBaseline = 'top';
      this.context.imageSmoothingEnabled = options.imageSmoothing;
      if (Bu.isString(this.container)) {
        this.container = document.querySelector(this.container);
      }
      if (this.fillParent && this.container === document.body) {
        $('body').style('margin', 0).style('overflow', 'hidden');
        $('html, body').style('width', '100%').style('height', '100%');
      }
      onResize = (function(_this) {
        return function() {
          var canvasRatio, containerRatio, height, width;
          canvasRatio = _this.dom.height / _this.dom.width;
          containerRatio = _this.container.clientHeight / _this.container.clientWidth;
          if (containerRatio < canvasRatio) {
            height = _this.container.clientHeight;
            width = height / containerRatio;
          } else {
            width = _this.container.clientWidth;
            height = width * containerRatio;
          }
          _this.width = _this.dom.width = width * _this.pixelRatio;
          _this.height = _this.dom.height = height * _this.pixelRatio;
          _this.dom.style.width = width + 'px';
          _this.dom.style.height = height + 'px';
          return _this.render();
        };
      })(this);
      if (!this.fillParent) {
        this.dom.style.width = (this.width / this.pixelRatio) + 'px';
        this.dom.style.height = (this.height / this.pixelRatio) + 'px';
        this.dom.width = this.width;
        this.dom.height = this.height;
      } else {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
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
      appendDom = (function(_this) {
        return function() {
          return _this.container.appendChild(_this.dom);
        };
      })(this);
      setTimeout(appendDom, 1);
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
        this.context.translate(this.width / 2, this.height / 2);
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
      this.context.clearRect(0, 0, this.width, this.height);
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
    }

    return Scene;

  })(Bu.Object2D);

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
      return this.updateLabel();
    };

    Point.prototype.set = function(x, y) {
      this.x = x;
      this.y = y;
      return this.updateLabel();
    };

    Point.prototype.updateLabel = function() {
      if (this._labelIndex > -1) {
        this.children[this._labelIndex].x = this.x + Bu.POINT_LABEL_OFFSET;
        return this.children[this._labelIndex].y = this.y;
      }
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
          return console.error('animation moveTo need an argument');
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
          return console.error('animation moveTo need an argument');
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
        if (t > 1) {
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
    var interpolateNum, interpolateObject;

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

    AnimationTask.prototype.interpolate = function() {
      var key, ref, results;
      if (Bu.isNumber(this.from)) {
        return this.current = interpolateNum(this.from, this.to, this.t);
      } else if (this.from instanceof Bu.Color) {
        return interpolateObject(this.from, this.to, this.t, this.current);
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
      }
    };

    interpolateNum = function(a, b, t) {
      return b * t - a * (t - 1);
    };

    interpolateObject = function(a, b, t, c) {
      if (a instanceof Bu.Color) {
        return c.setRGBA(interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t));
      } else {
        return console.error("AnimationTask.interpolateObject() doesn't support object type: ", a);
      }
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
      return (x0 - x1) * (x0 - x2) < 0 && (x0 - x3) * (x0 - x4) < 0 && (y0 - y1) * (y0 - y2) < 0 && (y0 - y3) * (y0 - y4) < 0;
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

    ShapeRandomizer.prototype.rangeWidth = 800;

    ShapeRandomizer.prototype.rangeHeight = 450;

    function ShapeRandomizer() {}

    ShapeRandomizer.prototype.randomX = function() {
      return Bu.rand(MARGIN, this.rangeWidth - MARGIN * 2);
    };

    ShapeRandomizer.prototype.randomY = function() {
      return Bu.rand(MARGIN, this.rangeHeight - MARGIN * 2);
    };

    ShapeRandomizer.prototype.randomRadius = function() {
      return Bu.rand(5, Math.min(this.rangeWidth, this.rangeHeight) / 2);
    };

    ShapeRandomizer.prototype.setRange = function(w, h) {
      this.rangeWidth = w;
      return this.rangeHeight = h;
    };

    ShapeRandomizer.prototype.generate = function(type) {
      switch (type) {
        case 'circle':
          this.generateCircle();
          break;
        case 'bow':
          this.generateBow();
          break;
        case 'triangle':
          this.generateTriangle();
          break;
        case 'rectangle':
          this.generateRectangle();
          break;
        case 'fan':
          this.generateFan();
          break;
        case 'polygon':
          this.generatePolygon();
          break;
        case 'line':
          this.generateLine();
          break;
        case 'polyline':
          this.generatePolyline();
          break;
        default:
          console.warn('not support shape: ' + type);
      }
      return this.rangeHeight = h;
    };

    ShapeRandomizer.prototype.randomize = function(shape) {
      var j, len, results, s;
      if (Bu.isArray(shape)) {
        results = [];
        for (j = 0, len = shape.length; j < len; j++) {
          s = shape[j];
          results.push(this.randomize(s));
        }
        return results;
      } else {
        switch (shape.type) {
          case 'Circle':
            return this.randomizeCircle(shape);
          case 'Ellipse':
            return this.randomizeEllipse(shape);
          case 'Bow':
            return this.randomizeBow(shape);
          case 'Triangle':
            return this.randomizeTriangle(shape);
          case 'Rectangle':
            return this.randomizeRectangle(shape);
          case 'Fan':
            return this.randomizeFan(shape);
          case 'Polygon':
            return this.randomizePolygon(shape);
          case 'Line':
            return this.randomizeLine(shape);
          case 'Polyline':
            return this.randomizePolyline(shape);
          default:
            return console.warn('not support shape: ' + shape.type);
        }
      }
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
      rect = new Bu.Rectangle(Bu.rand(this.rangeWidth), Bu.rand(this.rangeHeight), Bu.rand(this.rangeWidth / 2), Bu.rand(this.rangeHeight / 2));
      rect.pointLT.label = 'A';
      rect.pointRT.label = 'B';
      rect.pointRB.label = 'C';
      rect.pointLB.label = 'D';
      return rect;
    };

    ShapeRandomizer.prototype.randomizeRectangle = function(rectangle) {
      rectangle.set(this.randomX(), this.randomY(), this.randomX(), this.randomY());
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJ1LmNvZmZlZSIsIkJvdW5kcy5jb2ZmZWUiLCJDb2xvci5jb2ZmZWUiLCJTaXplLmNvZmZlZSIsIlZlY3Rvci5jb2ZmZWUiLCJFdmVudC5jb2ZmZWUiLCJNaWNyb0pRdWVyeS5jb2ZmZWUiLCJPYmplY3QyRC5jb2ZmZWUiLCJTdHlsZWQuY29mZmVlIiwiQXBwLmNvZmZlZSIsIkF1ZGlvLmNvZmZlZSIsIkNhbWVyYS5jb2ZmZWUiLCJJbnB1dE1hbmFnZXIuY29mZmVlIiwiUmVuZGVyZXIuY29mZmVlIiwiU2NlbmUuY29mZmVlIiwiQm93LmNvZmZlZSIsIkNpcmNsZS5jb2ZmZWUiLCJFbGxpcHNlLmNvZmZlZSIsIkZhbi5jb2ZmZWUiLCJMaW5lLmNvZmZlZSIsIlBvaW50LmNvZmZlZSIsIlBvbHlnb24uY29mZmVlIiwiUG9seWxpbmUuY29mZmVlIiwiUmVjdGFuZ2xlLmNvZmZlZSIsIlNwbGluZS5jb2ZmZWUiLCJUcmlhbmdsZS5jb2ZmZWUiLCJJbWFnZS5jb2ZmZWUiLCJQb2ludFRleHQuY29mZmVlIiwiQW5pbWF0aW9uLmNvZmZlZSIsIkFuaW1hdGlvblJ1bm5lci5jb2ZmZWUiLCJBbmltYXRpb25UYXNrLmNvZmZlZSIsIkRhc2hGbG93TWFuYWdlci5jb2ZmZWUiLCJTcHJpdGVTaGVldC5jb2ZmZWUiLCJnZW9tZXRyeUFsZ29yaXRobS5jb2ZmZWUiLCJTaGFwZVJhbmRvbWl6ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQTtBQUFBLE1BQUEsMENBQUE7SUFBQTs7RUFBQSxNQUFBLEdBQVMsTUFBQSxJQUFVOztFQUNuQixNQUFNLENBQUMsRUFBUCxHQUFZO0lBQUMsUUFBQSxNQUFEOzs7RUFRWixFQUFFLENBQUMsT0FBSCxHQUFhOztFQUdiLEVBQUUsQ0FBQyx1QkFBSCxHQUE2QixDQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLElBQWxCOztFQUc3QixFQUFFLENBQUMsT0FBSCxHQUFhLElBQUksQ0FBQyxFQUFMLEdBQVU7O0VBQ3ZC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QUFFLENBQUMsS0FBSCxDQUFTLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVCxFQUFxQixJQUFDLENBQUEsT0FBRCxDQUFBLENBQXJCO1FBQ1osS0FBSyxDQUFDLEtBQU4sR0FBYyxHQUFBLEdBQU07UUFDcEIsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsS0FBbEI7QUFIRDthQUlBO0lBTmlCOzs4QkFRbEIsaUJBQUEsR0FBbUIsU0FBQyxRQUFEO0FBQ2xCLFVBQUE7QUFBQTtBQUFBLFdBQUEscUNBQUE7O1FBQUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVgsRUFBdUIsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUF2QjtBQUFBO01BQ0EsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsU0FBakI7YUFDQTtJQUhrQjs7Ozs7QUFwTHBCIiwiZmlsZSI6ImJ1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBOYW1lc3BhY2UsIGNvbnN0YW50cywgdXRpbGl0eSBmdW5jdGlvbnMgYW5kIHBvbHlmaWxsc1xyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBOYW1lc3BhY2VcclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbmdsb2JhbCA9IHdpbmRvdyBvciBAXHJcbmdsb2JhbC5CdSA9IHtnbG9iYWx9XHJcblxyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBDb25zdGFudHNcclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiMgVmVyc2lvbiBpbmZvXHJcbkJ1LlZFUlNJT04gPSAnMC40LjAnXHJcblxyXG4jIEJyb3dzZXIgdmVuZG9yIHByZWZpeGVzLCB1c2VkIGluIGV4cGVyaW1lbnRhbCBmZWF0dXJlc1xyXG5CdS5CUk9XU0VSX1ZFTkRPUl9QUkVGSVhFUyA9IFsnd2Via2l0JywgJ21veicsICdtcyddXHJcblxyXG4jIE1hdGhcclxuQnUuSEFMRl9QSSA9IE1hdGguUEkgLyAyXHJcbkJ1LlRXT19QSSA9IE1hdGguUEkgKiAyXHJcblxyXG4jIERlZmF1bHQgZm9udCBmb3IgdGhlIHRleHRcclxuQnUuREVGQVVMVF9GT05UX0ZBTUlMWSA9ICdWZXJkYW5hJ1xyXG5CdS5ERUZBVUxUX0ZPTlRfU0laRSA9IDExXHJcbkJ1LkRFRkFVTFRfRk9OVCA9ICcxMXB4IFZlcmRhbmEnXHJcblxyXG4jIFBvaW50IGlzIHJlbmRlcmVkIGFzIGEgc21hbGwgY2lyY2xlIG9uIHNjcmVlbi4gVGhpcyBpcyB0aGUgcmFkaXVzIG9mIHRoZSBjaXJjbGUuXHJcbkJ1LlBPSU5UX1JFTkRFUl9TSVpFID0gMi4yNVxyXG5cclxuIyBQb2ludCBjYW4gaGF2ZSBhIGxhYmVsIGF0dGFjaGVkIG5lYXIgaXQuIFRoaXMgaXMgdGhlIGdhcCBkaXN0YW5jZSBiZXR3ZWVuIHRoZW0uXHJcbkJ1LlBPSU5UX0xBQkVMX09GRlNFVCA9IDVcclxuXHJcbiMgRGVmYXVsdCBzbW9vdGggZmFjdG9yIG9mIHNwbGluZSwgcmFuZ2UgaW4gWzAsIDFdIGFuZCAxIGlzIHRoZSBzbW9vdGhlc3RcclxuQnUuREVGQVVMVF9TUExJTkVfU01PT1RIID0gMC4yNVxyXG5cclxuIyBIb3cgY2xvc2UgYSBwb2ludCB0byBhIGxpbmUgaXMgcmVnYXJkZWQgdGhhdCB0aGUgcG9pbnQgaXMgKipPTioqIHRoZSBsaW5lLlxyXG5CdS5ERUZBVUxUX05FQVJfRElTVCA9IDVcclxuXHJcbiMgRW51bWVyYXRpb24gb2YgbW91c2UgYnV0dG9uc1xyXG5CdS5NT1VTRV9CVVRUT05fTk9ORSA9IC0xXHJcbkJ1Lk1PVVNFX0JVVFRPTl9MRUZUID0gMFxyXG5CdS5NT1VTRV9CVVRUT05fTUlERExFID0gMVxyXG5CdS5NT1VTRV9CVVRUT05fUklHSFQgPSAyXHJcblxyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBVdGlsaXR5IGZ1bmN0aW9uc1xyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuIyBDYWxjdWxhdGUgdGhlIG1lYW4gdmFsdWUgb2YgbnVtYmVyc1xyXG5CdS5hdmVyYWdlID0gKCktPlxyXG5cdG5zID0gYXJndW1lbnRzXHJcblx0bnMgPSBhcmd1bWVudHNbMF0gaWYgdHlwZW9mIGFyZ3VtZW50c1swXSBpcyAnb2JqZWN0J1xyXG5cdHN1bSA9IDBcclxuXHRmb3IgaSBpbiBuc1xyXG5cdFx0c3VtICs9IGlcclxuXHRzdW0gLyBucy5sZW5ndGhcclxuXHJcbiMgQ2FsY3VsYXRlIHRoZSBoeXBvdGVudXNlIGZyb20gdGhlIGNhdGhldHVzZXNcclxuQnUuYmV2ZWwgPSAoeCwgeSkgLT5cclxuXHRNYXRoLnNxcnQgeCAqIHggKyB5ICogeVxyXG5cclxuIyBMaW1pdCBhIG51bWJlciBieSBtaW5pbXVtIHZhbHVlIGFuZCBtYXhpbXVtIHZhbHVlXHJcbkJ1LmNsYW1wID0gKHgsIG1pbiwgbWF4KSAtPlxyXG5cdHggPSBtaW4gaWYgeCA8IG1pblxyXG5cdHggPSBtYXggaWYgeCA+IG1heFxyXG5cdHhcclxuXHJcbiMgR2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIG51bWJlcnNcclxuQnUucmFuZCA9IChmcm9tLCB0bykgLT5cclxuXHRpZiBub3QgdG8/XHJcblx0XHR0byA9IGZyb21cclxuXHRcdGZyb20gPSAwXHJcblx0TWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pICsgZnJvbVxyXG5cclxuIyBDb252ZXJ0IGFuIGFuZ2xlIGZyb20gcmFkaWFuIHRvIGRlZ1xyXG5CdS5yMmQgPSAocikgLT4gKHIgKiAxODAgLyBNYXRoLlBJKS50b0ZpeGVkKDEpXHJcblxyXG4jIENvbnZlcnQgYW4gYW5nbGUgZnJvbSBkZWcgdG8gcmFkaWFuXHJcbkJ1LmQyciA9IChyKSAtPiByICogTWF0aC5QSSAvIDE4MFxyXG5cclxuIyBHZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wXHJcbkJ1Lm5vdyA9IGlmIEJ1Lmdsb2JhbC5wZXJmb3JtYW5jZT8gdGhlbiAtPiBCdS5nbG9iYWwucGVyZm9ybWFuY2Uubm93KCkgZWxzZSAtPiBEYXRlLm5vdygpXHJcblxyXG4jIENvbWJpbmUgdGhlIGdpdmVuIG9wdGlvbnMgKGxhc3QgaXRlbSBvZiBhcmd1bWVudHMpIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9uc1xyXG5CdS5jb21iaW5lT3B0aW9ucyA9IChhcmdzLCBkZWZhdWx0T3B0aW9ucykgLT5cclxuXHRkZWZhdWx0T3B0aW9ucyA9IHt9IGlmIG5vdCBkZWZhdWx0T3B0aW9ucz9cclxuXHRnaXZlbk9wdGlvbnMgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV1cclxuXHRpZiBCdS5pc1BsYWluT2JqZWN0IGdpdmVuT3B0aW9uc1xyXG5cdFx0Zm9yIGkgb2YgZ2l2ZW5PcHRpb25zIHdoZW4gZ2l2ZW5PcHRpb25zW2ldP1xyXG5cdFx0XHRkZWZhdWx0T3B0aW9uc1tpXSA9IGdpdmVuT3B0aW9uc1tpXVxyXG5cdHJldHVybiBkZWZhdWx0T3B0aW9uc1xyXG5cclxuIyBDaGVjayBpZiBhbiB2YXJpYWJsZSBpcyBhIG51bWJlclxyXG5CdS5pc051bWJlciA9IChvKSAtPlxyXG5cdHR5cGVvZiBvID09ICdudW1iZXInXHJcblxyXG4jIENoZWNrIGlmIGFuIHZhcmlhYmxlIGlzIGEgc3RyaW5nXHJcbkJ1LmlzU3RyaW5nID0gKG8pIC0+XHJcblx0dHlwZW9mIG8gPT0gJ3N0cmluZydcclxuXHJcbiMgQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGFuIHBsYWluIG9iamVjdCwgbm90IGluc3RhbmNlIG9mIGNsYXNzL2Z1bmN0aW9uXHJcbkJ1LmlzUGxhaW5PYmplY3QgPSAobykgLT5cclxuXHRvIGluc3RhbmNlb2YgT2JqZWN0IGFuZCBvLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ09iamVjdCdcclxuXHJcbiMgQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgZnVuY3Rpb25cclxuQnUuaXNGdW5jdGlvbiA9IChvKSAtPlxyXG5cdG8gaW5zdGFuY2VvZiBPYmplY3QgYW5kIG8uY29uc3RydWN0b3IubmFtZSA9PSAnRnVuY3Rpb24nXHJcblxyXG4jIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIEFycmF5XHJcbkJ1LmlzQXJyYXkgPSAobykgLT5cclxuXHRvIGluc3RhbmNlb2YgQXJyYXlcclxuXHJcbiMgQ2xvbmUgYW4gT2JqZWN0IG9yIEFycmF5XHJcbkJ1LmNsb25lID0gKHRhcmdldCkgLT5cclxuXHRpZiB0eXBlb2YodGFyZ2V0KSAhPSAnb2JqZWN0JyBvciB0YXJnZXQgPT0gbnVsbCBvciBCdS5pc0Z1bmN0aW9uIHRhcmdldFxyXG5cdFx0cmV0dXJuIHRhcmdldFxyXG5cdGVsc2VcclxuXHRcdCMgRklYTUUgY2F1c2Ugc3RhY2sgb3ZlcmZsb3cgd2hlbiBpdHMgYSBjaXJjdWxhciBzdHJ1Y3R1cmVcclxuXHRcdGlmIEJ1LmlzQXJyYXkgdGFyZ2V0XHJcblx0XHRcdGNsb25lID0gW11cclxuXHRcdGVsc2UgaWYgQnUuaXNQbGFpbk9iamVjdCB0YXJnZXRcclxuXHRcdFx0Y2xvbmUgPSB7fVxyXG5cdFx0ZWxzZSAjIGluc3RhbmNlIG9mIGNsYXNzXHJcblx0XHRcdGNsb25lID0gT2JqZWN0LmNyZWF0ZSB0YXJnZXQuY29uc3RydWN0b3IucHJvdG90eXBlXHJcblxyXG5cdFx0Zm9yIG93biBpIG9mIHRhcmdldFxyXG5cdFx0XHRjbG9uZVtpXSA9IEJ1LmNsb25lIHRhcmdldFtpXVxyXG5cclxuXHRcdGlmIGNsb25lLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ0Z1bmN0aW9uJ1xyXG5cdFx0XHRjb25zb2xlLmxvZyhjbG9uZSk7XHJcblx0XHRyZXR1cm4gY2xvbmVcclxuXHJcbiMgVXNlIGxvY2FsU3RvcmFnZSB0byBwZXJzaXN0IGRhdGFcclxuQnUuZGF0YSA9IChrZXksIHZhbHVlKSAtPlxyXG5cdGlmIHZhbHVlP1xyXG5cdFx0bG9jYWxTdG9yYWdlWydCdS4nICsga2V5XSA9IEpTT04uc3RyaW5naWZ5IHZhbHVlXHJcblx0ZWxzZVxyXG5cdFx0dmFsdWUgPSBsb2NhbFN0b3JhZ2VbJ0J1LicgKyBrZXldXHJcblx0XHRpZiB2YWx1ZT8gdGhlbiBKU09OLnBhcnNlIHZhbHVlIGVsc2UgbnVsbFxyXG5cclxuIyBFeGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcclxuQnUucmVhZHkgPSAoY2IsIGNvbnRleHQsIGFyZ3MpIC0+XHJcblx0aWYgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnXHJcblx0XHRjYi5hcHBseSBjb250ZXh0LCBhcmdzXHJcblx0ZWxzZVxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnRE9NQ29udGVudExvYWRlZCcsIC0+IGNiLmFwcGx5IGNvbnRleHQsIGFyZ3NcclxuXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgUG9seWZpbGxzXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4jIFNob3J0Y3V0IHRvIGRlZmluZSBhIHByb3BlcnR5IGZvciBhIGNsYXNzLiBUaGlzIGlzIHVzZWQgdG8gc29sdmUgdGhlIHByb2JsZW1cclxuIyB0aGF0IENvZmZlZVNjcmlwdCBkaWRuJ3Qgc3VwcG9ydCBnZXR0ZXJzIGFuZCBzZXR0ZXJzLlxyXG4jIGNsYXNzIFBlcnNvblxyXG4jICAgQGNvbnN0cnVjdG9yOiAoYWdlKSAtPlxyXG4jICAgICBAX2FnZSA9IGFnZVxyXG4jXHJcbiMgICBAcHJvcGVydHkgJ2FnZScsXHJcbiMgICAgIGdldDogLT4gQF9hZ2VcclxuIyAgICAgc2V0OiAodmFsKSAtPlxyXG4jICAgICAgIEBfYWdlID0gdmFsXHJcbiNcclxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsIHByb3AsIGRlc2NcclxuXHJcbiMgTWFrZSBhIGNvcHkgb2YgdGhpcyBmdW5jdGlvbiB3aGljaCBoYXMgYSBsaW1pdGVkIHNob3J0ZXN0IGV4ZWN1dGluZyBpbnRlcnZhbC5cclxuRnVuY3Rpb246OnRocm90dGxlID0gKGxpbWl0ID0gMC41KSAtPlxyXG5cdGN1cnJUaW1lID0gMFxyXG5cdGxhc3RUaW1lID0gMFxyXG5cclxuXHRyZXR1cm4gKCkgPT5cclxuXHRcdGN1cnJUaW1lID0gRGF0ZS5ub3coKVxyXG5cdFx0aWYgY3VyclRpbWUgLSBsYXN0VGltZSA+IGxpbWl0ICogMTAwMFxyXG5cdFx0XHRAYXBwbHkgbnVsbCwgYXJndW1lbnRzXHJcblx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWVcclxuXHJcbiMgTWFrZSBhIGNvcHkgb2YgdGhpcyBmdW5jdGlvbiB3aG9zZSBleGVjdXRpb24gd2lsbCBiZSBjb250aW51b3VzbHkgcHV0IG9mZlxyXG4jIGFmdGVyIGV2ZXJ5IGNhbGxpbmcgb2YgdGhpcyBmdW5jdGlvbi5cclxuRnVuY3Rpb246OmRlYm91bmNlID0gKGRlbGF5ID0gMC41KSAtPlxyXG5cdGFyZ3MgPSBudWxsXHJcblx0dGltZW91dCA9IG51bGxcclxuXHJcblx0bGF0ZXIgPSA9PlxyXG5cdFx0QGFwcGx5IG51bGwsIGFyZ3NcclxuXHJcblx0cmV0dXJuICgpIC0+XHJcblx0XHRhcmdzID0gYXJndW1lbnRzXHJcblx0XHRjbGVhclRpbWVvdXQgdGltZW91dFxyXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQgbGF0ZXIsIGRlbGF5ICogMTAwMFxyXG5cclxuXHJcbiMgSXRlcmF0ZSB0aGlzIEFycmF5IGFuZCBkbyBzb21ldGhpbmcgd2l0aCB0aGUgaXRlbXMuXHJcbkFycmF5OjplYWNoIG9yPSAoZm4pIC0+XHJcblx0aSA9IDBcclxuXHR3aGlsZSBpIDwgQGxlbmd0aFxyXG5cdFx0Zm4gQFtpXVxyXG5cdFx0aSsrXHJcblx0cmV0dXJuIEBcclxuXHJcbiMgSXRlcmF0ZSB0aGlzIEFycmF5IGFuZCBtYXAgdGhlIGl0ZW1zIHRvIGEgbmV3IEFycmF5LlxyXG5BcnJheTo6bWFwIG9yPSAoZm4pIC0+XHJcblx0YXJyID0gW11cclxuXHRpID0gMFxyXG5cdHdoaWxlIGkgPCBAbGVuZ3RoXHJcblx0XHRhcnIucHVzaCBmbihAW2ldKVxyXG5cdFx0aSsrXHJcblx0cmV0dXJuIEBcclxuXHJcbiMgT3V0cHV0IHZlcnNpb24gaW5mbyB0byB0aGUgY29uc29sZSwgYXQgbW9zdCBvbmUgdGltZSBpbiBhIG1pbnV0ZS5cclxuY3VycmVudFRpbWUgPSBEYXRlLm5vdygpXHJcbmxhc3RUaW1lID0gQnUuZGF0YSAndmVyc2lvbi50aW1lc3RhbXAnXHJcbnVubGVzcyBsYXN0VGltZT8gYW5kIGN1cnJlbnRUaW1lIC0gbGFzdFRpbWUgPCA2MCAqIDEwMDBcclxuXHRjb25zb2xlLmluZm8/ICdCdS5qcyB2JyArIEJ1LlZFUlNJT04gKyAnIC0gW2h0dHBzOi8vZ2l0aHViLmNvbS9qYXJ2aXNuaXUvQnUuanNdJ1xyXG5cdEJ1LmRhdGEgJ3ZlcnNpb24udGltZXN0YW1wJywgY3VycmVudFRpbWVcclxuIiwiIyMgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIGJveFxyXG5cclxuY2xhc3MgQnUuQm91bmRzXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cclxuXHJcblx0XHQjIFRPRE8gdXNlIG1pbiwgbWF4OiBWZWN0b3JcclxuXHRcdEB4MSA9IEB5MSA9IEB4MiA9IEB5MiA9IDBcclxuXHRcdEBpc0VtcHR5ID0geWVzXHJcblxyXG5cdFx0QHBvaW50MSA9IG5ldyBCdS5WZWN0b3JcclxuXHRcdEBwb2ludDIgPSBuZXcgQnUuVmVjdG9yXHJcblxyXG5cdFx0QHVwZGF0ZSgpXHJcblx0XHRAYmluZEV2ZW50KClcclxuXHJcblx0Y29udGFpbnNQb2ludDogKHApIC0+XHJcblx0XHRAeDEgPCBwLnggJiYgQHgyID4gcC54ICYmIEB5MSA8IHAueSAmJiBAeTIgPiBwLnlcclxuXHJcblx0dXBkYXRlOiA9PlxyXG5cdFx0QGNsZWFyKClcclxuXHRcdHN3aXRjaCBAdGFyZ2V0LnR5cGVcclxuXHRcdFx0d2hlbiAnTGluZScsICdUcmlhbmdsZScsICdSZWN0YW5nbGUnXHJcblx0XHRcdFx0Zm9yIHYgaW4gQHRhcmdldC5wb2ludHNcclxuXHRcdFx0XHRcdEBleHBhbmRCeVBvaW50KHYpXHJcblx0XHRcdHdoZW4gJ0NpcmNsZScsICdCb3cnLCAnRmFuJ1xyXG5cdFx0XHRcdEBleHBhbmRCeUNpcmNsZSBAdGFyZ2V0XHJcblx0XHRcdHdoZW4gJ1BvbHlsaW5lJywgJ1BvbHlnb24nXHJcblx0XHRcdFx0Zm9yIHYgaW4gQHRhcmdldC52ZXJ0aWNlc1xyXG5cdFx0XHRcdFx0QGV4cGFuZEJ5UG9pbnQodilcclxuXHRcdFx0d2hlbiAnRWxsaXBzZSdcclxuXHRcdFx0XHRAeDEgPSAtQHRhcmdldC5yYWRpdXNYXHJcblx0XHRcdFx0QHgyID0gQHRhcmdldC5yYWRpdXNYXHJcblx0XHRcdFx0QHkxID0gLUB0YXJnZXQucmFkaXVzWVxyXG5cdFx0XHRcdEB5MiA9IEB0YXJnZXQucmFkaXVzWVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiQm91bmRzOiBub3Qgc3VwcG9ydCBzaGFwZSB0eXBlICN7IEB0YXJnZXQudHlwZSB9XCJcclxuXHJcblx0YmluZEV2ZW50OiAtPlxyXG5cdFx0c3dpdGNoIEB0YXJnZXQudHlwZVxyXG5cdFx0XHR3aGVuICdDaXJjbGUnLCAnQm93JywgJ0ZhbidcclxuXHRcdFx0XHRAdGFyZ2V0Lm9uICdjZW50ZXJDaGFuZ2VkJywgQHVwZGF0ZVxyXG5cdFx0XHRcdEB0YXJnZXQub24gJ3JhZGl1c0NoYW5nZWQnLCBAdXBkYXRlXHJcblx0XHRcdHdoZW4gJ0VsbGlwc2UnXHJcblx0XHRcdFx0QHRhcmdldC5vbiAnY2hhbmdlZCcsIEB1cGRhdGVcclxuXHJcblx0Y2xlYXI6ICgpIC0+XHJcblx0XHRAeDEgPSBAeTEgPSBAeDIgPSBAeTIgPSAwXHJcblx0XHRAaXNFbXB0eSA9IHllc1xyXG5cdFx0QFxyXG5cclxuXHRleHBhbmRCeVBvaW50OiAodikgLT5cclxuXHRcdGlmIEBpc0VtcHR5XHJcblx0XHRcdEBpc0VtcHR5ID0gbm9cclxuXHRcdFx0QHgxID0gQHgyID0gdi54XHJcblx0XHRcdEB5MSA9IEB5MiA9IHYueVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAeDEgPSB2LnggaWYgdi54IDwgQHgxXHJcblx0XHRcdEB4MiA9IHYueCBpZiB2LnggPiBAeDJcclxuXHRcdFx0QHkxID0gdi55IGlmIHYueSA8IEB5MVxyXG5cdFx0XHRAeTIgPSB2LnkgaWYgdi55ID4gQHkyXHJcblx0XHRAXHJcblxyXG5cdGV4cGFuZEJ5Q2lyY2xlOiAoYykgLT5cclxuXHRcdGNwID0gYy5jZW50ZXJcclxuXHRcdHIgPSBjLnJhZGl1c1xyXG5cdFx0aWYgQGlzRW1wdHlcclxuXHRcdFx0QGlzRW1wdHkgPSBub1xyXG5cdFx0XHRAeDEgPSBjcC54IC0gclxyXG5cdFx0XHRAeDIgPSBjcC54ICsgclxyXG5cdFx0XHRAeTEgPSBjcC55IC0gclxyXG5cdFx0XHRAeTIgPSBjcC55ICsgclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAeDEgPSBjcC54IC0gciBpZiBjcC54IC0gciA8IEB4MVxyXG5cdFx0XHRAeDIgPSBjcC54ICsgciBpZiBjcC54ICsgciA+IEB4MlxyXG5cdFx0XHRAeTEgPSBjcC55IC0gciBpZiBjcC55IC0gciA8IEB5MVxyXG5cdFx0XHRAeTIgPSBjcC55ICsgciBpZiBjcC55ICsgciA+IEB5MlxyXG5cdFx0QFxyXG4iLCIjIFBhcnNlIGFuZCBzZXJpYWxpemUgY29sb3JcbiMgVE9ETyBTdXBwb3J0IGhzbCgwLCAxMDAlLCA1MCUpIGZvcm1hdC5cblxuY2xhc3MgQnUuQ29sb3JcblxuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICBAciA9IEBnID0gQGIgPSAyNTVcbiAgICAgICAgQGEgPSAxXG5cbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgICAgIGlmIEJ1LmlzU3RyaW5nIGFyZ1xuICAgICAgICAgICAgICAgIEBwYXJzZSBhcmdcbiAgICAgICAgICAgICAgICBAYSA9IGNsYW1wQWxwaGEgQGFcbiAgICAgICAgICAgIGVsc2UgaWYgYXJnIGluc3RhbmNlb2YgQnUuQ29sb3JcbiAgICAgICAgICAgICAgICBAY29weSBhcmdcbiAgICAgICAgZWxzZSAjIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMyBvciA0XG4gICAgICAgICAgICBAciA9IGFyZ3VtZW50c1swXVxuICAgICAgICAgICAgQGcgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgICAgIEBiID0gYXJndW1lbnRzWzJdXG4gICAgICAgICAgICBAYSA9IGFyZ3VtZW50c1szXSBvciAxXG5cbiAgICBwYXJzZTogKHN0cikgLT5cbiAgICAgICAgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfUkdCQVxuICAgICAgICAgICAgQHIgPSBwYXJzZUludCBmb3VuZFsxXVxuICAgICAgICAgICAgQGcgPSBwYXJzZUludCBmb3VuZFsyXVxuICAgICAgICAgICAgQGIgPSBwYXJzZUludCBmb3VuZFszXVxuICAgICAgICAgICAgQGEgPSBwYXJzZUZsb2F0IGZvdW5kWzRdXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfUkdCXG4gICAgICAgICAgICBAciA9IHBhcnNlSW50IGZvdW5kWzFdXG4gICAgICAgICAgICBAZyA9IHBhcnNlSW50IGZvdW5kWzJdXG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50IGZvdW5kWzNdXG4gICAgICAgICAgICBAYSA9IDFcbiAgICAgICAgZWxzZSBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9SR0JBX1BFUlxuICAgICAgICAgICAgQHIgPSBwYXJzZUludChmb3VuZFsxXSAqIDI1NSAvIDEwMClcbiAgICAgICAgICAgIEBnID0gcGFyc2VJbnQoZm91bmRbMl0gKiAyNTUgLyAxMDApXG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50KGZvdW5kWzNdICogMjU1IC8gMTAwKVxuICAgICAgICAgICAgQGEgPSBwYXJzZUZsb2F0IGZvdW5kWzRdXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfUkdCX1BFUlxuICAgICAgICAgICAgQHIgPSBwYXJzZUludChmb3VuZFsxXSAqIDI1NSAvIDEwMClcbiAgICAgICAgICAgIEBnID0gcGFyc2VJbnQoZm91bmRbMl0gKiAyNTUgLyAxMDApXG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50KGZvdW5kWzNdICogMjU1IC8gMTAwKVxuICAgICAgICAgICAgQGEgPSAxXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfSEVYM1xuICAgICAgICAgICAgaGV4ID0gZm91bmRbMV1cbiAgICAgICAgICAgIEByID0gcGFyc2VJbnQgaGV4WzBdLCAxNlxuICAgICAgICAgICAgQHIgPSBAciAqIDE2ICsgQHJcbiAgICAgICAgICAgIEBnID0gcGFyc2VJbnQgaGV4WzFdLCAxNlxuICAgICAgICAgICAgQGcgPSBAZyAqIDE2ICsgQGdcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQgaGV4WzJdLCAxNlxuICAgICAgICAgICAgQGIgPSBAYiAqIDE2ICsgQGJcbiAgICAgICAgICAgIEBhID0gMVxuICAgICAgICBlbHNlIGlmIGZvdW5kID0gc3RyLm1hdGNoIFJFX0hFWDZcbiAgICAgICAgICAgIGhleCA9IGZvdW5kWzFdXG4gICAgICAgICAgICBAciA9IHBhcnNlSW50IGhleC5zdWJzdHJpbmcoMCwgMiksIDE2XG4gICAgICAgICAgICBAZyA9IHBhcnNlSW50IGhleC5zdWJzdHJpbmcoMiwgNCksIDE2XG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50IGhleC5zdWJzdHJpbmcoNCwgNiksIDE2XG4gICAgICAgICAgICBAYSA9IDFcbiAgICAgICAgZWxzZSBpZiBDU1MzX0NPTE9SU1tzdHIgPSBzdHIudG9Mb3dlckNhc2UoKS50cmltKCldP1xuICAgICAgICAgICAgQHIgPSBDU1MzX0NPTE9SU1tzdHJdWzBdXG4gICAgICAgICAgICBAZyA9IENTUzNfQ09MT1JTW3N0cl1bMV1cbiAgICAgICAgICAgIEBiID0gQ1NTM19DT0xPUlNbc3RyXVsyXVxuICAgICAgICAgICAgQGEgPSBDU1MzX0NPTE9SU1tzdHJdWzNdXG4gICAgICAgICAgICBAYSA9IDEgdW5sZXNzIEBhP1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yIFwiQnUuQ29sb3IucGFyc2UoXFxcIiN7IHN0ciB9XFxcIikgZXJyb3IuXCJcbiAgICAgICAgQFxuXG4gICAgY29weTogKGNvbG9yKSAtPlxuICAgICAgICBAciA9IGNvbG9yLnJcbiAgICAgICAgQGcgPSBjb2xvci5nXG4gICAgICAgIEBiID0gY29sb3IuYlxuICAgICAgICBAYSA9IGNvbG9yLmFcbiAgICAgICAgQFxuXG4gICAgc2V0UkdCOiAociwgZywgYikgLT5cbiAgICAgICAgQHIgPSBwYXJzZUludCByXG4gICAgICAgIEBnID0gcGFyc2VJbnQgZ1xuICAgICAgICBAYiA9IHBhcnNlSW50IGJcbiAgICAgICAgQGEgPSAxXG4gICAgICAgIEBcblxuICAgIHNldFJHQkE6IChyLCBnLCBiLCBhKSAtPlxuICAgICAgICBAciA9IHBhcnNlSW50IHJcbiAgICAgICAgQGcgPSBwYXJzZUludCBnXG4gICAgICAgIEBiID0gcGFyc2VJbnQgYlxuICAgICAgICBAYSA9IGNsYW1wQWxwaGEgcGFyc2VGbG9hdCBhXG4gICAgICAgIEBcblxuICAgIHRvUkdCOiAtPlxuICAgICAgICBcInJnYigjeyBAciB9LCAjeyBAZyB9LCAjeyBAYiB9KVwiXG5cbiAgICB0b1JHQkE6IC0+XG4gICAgICAgIFwicmdiYSgjeyBAciB9LCAjeyBAZyB9LCAjeyBAYiB9LCAjeyBAYSB9KVwiXG5cblxuICAgICMgUHJpdmF0ZSBmdW5jdGlvbnNcblxuICAgIGNsYW1wQWxwaGEgPSAoYSkgLT4gQnUuY2xhbXAgYSwgMCwgMVxuXG5cbiAgICAjIFByaXZhdGUgdmFyaWFibGVzXG5cbiAgICBSRV9SR0IgPSAvcmdiXFwoXFxzKihcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKylcXHMqXFwpL2lcbiAgICBSRV9SR0JBID0gL3JnYmFcXChcXHMqKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKVxccyosXFxzKihbLlxcZF0rKVxccypcXCkvaVxuICAgIFJFX1JHQl9QRVIgPSAvcmdiXFwoXFxzKihcXGQrKSUsXFxzKihcXGQrKSUsXFxzKihcXGQrKSVcXHMqXFwpL2lcbiAgICBSRV9SR0JBX1BFUiA9IC9yZ2JhXFwoXFxzKihcXGQrKSUsXFxzKihcXGQrKSUsXFxzKihcXGQrKSVcXHMqLFxccyooWy5cXGRdKylcXHMqXFwpL2lcbiAgICBSRV9IRVgzID0gLyMoWzAtOUEtRl17M30pXFxzKiQvaVxuICAgIFJFX0hFWDYgPSAvIyhbMC05QS1GXXs2fSlcXHMqJC9pXG4gICAgQ1NTM19DT0xPUlMgPVxuICAgICAgICB0cmFuc3BhcmVudDogWzAsIDAsIDAsIDBdXG5cbiAgICAgICAgYWxpY2VibHVlOiBbMjQwLCAyNDgsIDI1NV1cbiAgICAgICAgYW50aXF1ZXdoaXRlOiBbMjUwLCAyMzUsIDIxNV1cbiAgICAgICAgYXF1YTogWzAsIDI1NSwgMjU1XVxuICAgICAgICBhcXVhbWFyaW5lOiBbMTI3LCAyNTUsIDIxMl1cbiAgICAgICAgYXp1cmU6IFsyNDAsIDI1NSwgMjU1XVxuICAgICAgICBiZWlnZTogWzI0NSwgMjQ1LCAyMjBdXG4gICAgICAgIGJpc3F1ZTogWzI1NSwgMjI4LCAxOTZdXG4gICAgICAgIGJsYWNrOiBbMCwgMCwgMF1cbiAgICAgICAgYmxhbmNoZWRhbG1vbmQ6IFsyNTUsIDIzNSwgMjA1XVxuICAgICAgICBibHVlOiBbMCwgMCwgMjU1XVxuICAgICAgICBibHVldmlvbGV0OiBbMTM4LCA0MywgMjI2XVxuICAgICAgICBicm93bjogWzE2NSwgNDIsIDQyXVxuICAgICAgICBidXJseXdvb2Q6IFsyMjIsIDE4NCwgMTM1XVxuICAgICAgICBjYWRldGJsdWU6IFs5NSwgMTU4LCAxNjBdXG4gICAgICAgIGNoYXJ0cmV1c2U6IFsxMjcsIDI1NSwgMF1cbiAgICAgICAgY2hvY29sYXRlOiBbMjEwLCAxMDUsIDMwXVxuICAgICAgICBjb3JhbDogWzI1NSwgMTI3LCA4MF1cbiAgICAgICAgY29ybmZsb3dlcmJsdWU6IFsxMDAsIDE0OSwgMjM3XVxuICAgICAgICBjb3Juc2lsazogWzI1NSwgMjQ4LCAyMjBdXG4gICAgICAgIGNyaW1zb246IFsyMjAsIDIwLCA2MF1cbiAgICAgICAgY3lhbjogWzAsIDI1NSwgMjU1XVxuICAgICAgICBkYXJrYmx1ZTogWzAsIDAsIDEzOV1cbiAgICAgICAgZGFya2N5YW46IFswLCAxMzksIDEzOV1cbiAgICAgICAgZGFya2dvbGRlbnJvZDogWzE4NCwgMTM0LCAxMV1cbiAgICAgICAgZGFya2dyYXk6IFsxNjksIDE2OSwgMTY5XVxuICAgICAgICBkYXJrZ3JlZW46IFswLCAxMDAsIDBdXG4gICAgICAgIGRhcmtncmV5OiBbMTY5LCAxNjksIDE2OV1cbiAgICAgICAgZGFya2toYWtpOiBbMTg5LCAxODMsIDEwN11cbiAgICAgICAgZGFya21hZ2VudGE6IFsxMzksIDAsIDEzOV1cbiAgICAgICAgZGFya29saXZlZ3JlZW46IFs4NSwgMTA3LCA0N11cbiAgICAgICAgZGFya29yYW5nZTogWzI1NSwgMTQwLCAwXVxuICAgICAgICBkYXJrb3JjaGlkOiBbMTUzLCA1MCwgMjA0XVxuICAgICAgICBkYXJrcmVkOiBbMTM5LCAwLCAwXVxuICAgICAgICBkYXJrc2FsbW9uOiBbMjMzLCAxNTAsIDEyMl1cbiAgICAgICAgZGFya3NlYWdyZWVuOiBbMTQzLCAxODgsIDE0M11cbiAgICAgICAgZGFya3NsYXRlYmx1ZTogWzcyLCA2MSwgMTM5XVxuICAgICAgICBkYXJrc2xhdGVncmF5OiBbNDcsIDc5LCA3OV1cbiAgICAgICAgZGFya3NsYXRlZ3JleTogWzQ3LCA3OSwgNzldXG4gICAgICAgIGRhcmt0dXJxdW9pc2U6IFswLCAyMDYsIDIwOV1cbiAgICAgICAgZGFya3Zpb2xldDogWzE0OCwgMCwgMjExXVxuICAgICAgICBkZWVwcGluazogWzI1NSwgMjAsIDE0N11cbiAgICAgICAgZGVlcHNreWJsdWU6IFswLCAxOTEsIDI1NV1cbiAgICAgICAgZGltZ3JheTogWzEwNSwgMTA1LCAxMDVdXG4gICAgICAgIGRpbWdyZXk6IFsxMDUsIDEwNSwgMTA1XVxuICAgICAgICBkb2RnZXJibHVlOiBbMzAsIDE0NCwgMjU1XVxuICAgICAgICBmaXJlYnJpY2s6IFsxNzgsIDM0LCAzNF1cbiAgICAgICAgZmxvcmFsd2hpdGU6IFsyNTUsIDI1MCwgMjQwXVxuICAgICAgICBmb3Jlc3RncmVlbjogWzM0LCAxMzksIDM0XVxuICAgICAgICBmdWNoc2lhOiBbMjU1LCAwLCAyNTVdXG4gICAgICAgIGdhaW5zYm9ybzogWzIyMCwgMjIwLCAyMjBdXG4gICAgICAgIGdob3N0d2hpdGU6IFsyNDgsIDI0OCwgMjU1XVxuICAgICAgICBnb2xkOiBbMjU1LCAyMTUsIDBdXG4gICAgICAgIGdvbGRlbnJvZDogWzIxOCwgMTY1LCAzMl1cbiAgICAgICAgZ3JheTogWzEyOCwgMTI4LCAxMjhdXG4gICAgICAgIGdyZWVuOiBbMCwgMTI4LCAwXVxuICAgICAgICBncmVlbnllbGxvdzogWzE3MywgMjU1LCA0N11cbiAgICAgICAgZ3JleTogWzEyOCwgMTI4LCAxMjhdXG4gICAgICAgIGhvbmV5ZGV3OiBbMjQwLCAyNTUsIDI0MF1cbiAgICAgICAgaG90cGluazogWzI1NSwgMTA1LCAxODBdXG4gICAgICAgIGluZGlhbnJlZDogWzIwNSwgOTIsIDkyXVxuICAgICAgICBpbmRpZ286IFs3NSwgMCwgMTMwXVxuICAgICAgICBpdm9yeTogWzI1NSwgMjU1LCAyNDBdXG4gICAgICAgIGtoYWtpOiBbMjQwLCAyMzAsIDE0MF1cbiAgICAgICAgbGF2ZW5kZXI6IFsyMzAsIDIzMCwgMjUwXVxuICAgICAgICBsYXZlbmRlcmJsdXNoOiBbMjU1LCAyNDAsIDI0NV1cbiAgICAgICAgbGF3bmdyZWVuOiBbMTI0LCAyNTIsIDBdXG4gICAgICAgIGxlbW9uY2hpZmZvbjogWzI1NSwgMjUwLCAyMDVdXG4gICAgICAgIGxpZ2h0Ymx1ZTogWzE3MywgMjE2LCAyMzBdXG4gICAgICAgIGxpZ2h0Y29yYWw6IFsyNDAsIDEyOCwgMTI4XVxuICAgICAgICBsaWdodGN5YW46IFsyMjQsIDI1NSwgMjU1XVxuICAgICAgICBsaWdodGdvbGRlbnJvZHllbGxvdzogWzI1MCwgMjUwLCAyMTBdXG4gICAgICAgIGxpZ2h0Z3JheTogWzIxMSwgMjExLCAyMTFdXG4gICAgICAgIGxpZ2h0Z3JlZW46IFsxNDQsIDIzOCwgMTQ0XVxuICAgICAgICBsaWdodGdyZXk6IFsyMTEsIDIxMSwgMjExXVxuICAgICAgICBsaWdodHBpbms6IFsyNTUsIDE4MiwgMTkzXVxuICAgICAgICBsaWdodHNhbG1vbjogWzI1NSwgMTYwLCAxMjJdXG4gICAgICAgIGxpZ2h0c2VhZ3JlZW46IFszMiwgMTc4LCAxNzBdXG4gICAgICAgIGxpZ2h0c2t5Ymx1ZTogWzEzNSwgMjA2LCAyNTBdXG4gICAgICAgIGxpZ2h0c2xhdGVncmF5OiBbMTE5LCAxMzYsIDE1M11cbiAgICAgICAgbGlnaHRzbGF0ZWdyZXk6IFsxMTksIDEzNiwgMTUzXVxuICAgICAgICBsaWdodHN0ZWVsYmx1ZTogWzE3NiwgMTk2LCAyMjJdXG4gICAgICAgIGxpZ2h0eWVsbG93OiBbMjU1LCAyNTUsIDIyNF1cbiAgICAgICAgbGltZTogWzAsIDI1NSwgMF1cbiAgICAgICAgbGltZWdyZWVuOiBbNTAsIDIwNSwgNTBdXG4gICAgICAgIGxpbmVuOiBbMjUwLCAyNDAsIDIzMF1cbiAgICAgICAgbWFnZW50YTogWzI1NSwgMCwgMjU1XVxuICAgICAgICBtYXJvb246IFsxMjgsIDAsIDBdXG4gICAgICAgIG1lZGl1bWFxdWFtYXJpbmU6IFsxMDIsIDIwNSwgMTcwXVxuICAgICAgICBtZWRpdW1ibHVlOiBbMCwgMCwgMjA1XVxuICAgICAgICBtZWRpdW1vcmNoaWQ6IFsxODYsIDg1LCAyMTFdXG4gICAgICAgIG1lZGl1bXB1cnBsZTogWzE0NywgMTEyLCAyMTldXG4gICAgICAgIG1lZGl1bXNlYWdyZWVuOiBbNjAsIDE3OSwgMTEzXVxuICAgICAgICBtZWRpdW1zbGF0ZWJsdWU6IFsxMjMsIDEwNCwgMjM4XVxuICAgICAgICBtZWRpdW1zcHJpbmdncmVlbjogWzAsIDI1MCwgMTU0XVxuICAgICAgICBtZWRpdW10dXJxdW9pc2U6IFs3MiwgMjA5LCAyMDRdXG4gICAgICAgIG1lZGl1bXZpb2xldHJlZDogWzE5OSwgMjEsIDEzM11cbiAgICAgICAgbWlkbmlnaHRibHVlOiBbMjUsIDI1LCAxMTJdXG4gICAgICAgIG1pbnRjcmVhbTogWzI0NSwgMjU1LCAyNTBdXG4gICAgICAgIG1pc3R5cm9zZTogWzI1NSwgMjI4LCAyMjVdXG4gICAgICAgIG1vY2Nhc2luOiBbMjU1LCAyMjgsIDE4MV1cbiAgICAgICAgbmF2YWpvd2hpdGU6IFsyNTUsIDIyMiwgMTczXVxuICAgICAgICBuYXZ5OiBbMCwgMCwgMTI4XVxuICAgICAgICBvbGRsYWNlOiBbMjUzLCAyNDUsIDIzMF1cbiAgICAgICAgb2xpdmU6IFsxMjgsIDEyOCwgMF1cbiAgICAgICAgb2xpdmVkcmFiOiBbMTA3LCAxNDIsIDM1XVxuICAgICAgICBvcmFuZ2U6IFsyNTUsIDE2NSwgMF1cbiAgICAgICAgb3JhbmdlcmVkOiBbMjU1LCA2OSwgMF1cbiAgICAgICAgb3JjaGlkOiBbMjE4LCAxMTIsIDIxNF1cbiAgICAgICAgcGFsZWdvbGRlbnJvZDogWzIzOCwgMjMyLCAxNzBdXG4gICAgICAgIHBhbGVncmVlbjogWzE1MiwgMjUxLCAxNTJdXG4gICAgICAgIHBhbGV0dXJxdW9pc2U6IFsxNzUsIDIzOCwgMjM4XVxuICAgICAgICBwYWxldmlvbGV0cmVkOiBbMjE5LCAxMTIsIDE0N11cbiAgICAgICAgcGFwYXlhd2hpcDogWzI1NSwgMjM5LCAyMTNdXG4gICAgICAgIHBlYWNocHVmZjogWzI1NSwgMjE4LCAxODVdXG4gICAgICAgIHBlcnU6IFsyMDUsIDEzMywgNjNdXG4gICAgICAgIHBpbms6IFsyNTUsIDE5MiwgMjAzXVxuICAgICAgICBwbHVtOiBbMjIxLCAxNjAsIDIyMV1cbiAgICAgICAgcG93ZGVyYmx1ZTogWzE3NiwgMjI0LCAyMzBdXG4gICAgICAgIHB1cnBsZTogWzEyOCwgMCwgMTI4XVxuICAgICAgICByZWQ6IFsyNTUsIDAsIDBdXG4gICAgICAgIHJvc3licm93bjogWzE4OCwgMTQzLCAxNDNdXG4gICAgICAgIHJveWFsYmx1ZTogWzY1LCAxMDUsIDIyNV1cbiAgICAgICAgc2FkZGxlYnJvd246IFsxMzksIDY5LCAxOV1cbiAgICAgICAgc2FsbW9uOiBbMjUwLCAxMjgsIDExNF1cbiAgICAgICAgc2FuZHlicm93bjogWzI0NCwgMTY0LCA5Nl1cbiAgICAgICAgc2VhZ3JlZW46IFs0NiwgMTM5LCA4N11cbiAgICAgICAgc2Vhc2hlbGw6IFsyNTUsIDI0NSwgMjM4XVxuICAgICAgICBzaWVubmE6IFsxNjAsIDgyLCA0NV1cbiAgICAgICAgc2lsdmVyOiBbMTkyLCAxOTIsIDE5Ml1cbiAgICAgICAgc2t5Ymx1ZTogWzEzNSwgMjA2LCAyMzVdXG4gICAgICAgIHNsYXRlYmx1ZTogWzEwNiwgOTAsIDIwNV1cbiAgICAgICAgc2xhdGVncmF5OiBbMTEyLCAxMjgsIDE0NF1cbiAgICAgICAgc2xhdGVncmV5OiBbMTEyLCAxMjgsIDE0NF1cbiAgICAgICAgc25vdzogWzI1NSwgMjUwLCAyNTBdXG4gICAgICAgIHNwcmluZ2dyZWVuOiBbMCwgMjU1LCAxMjddXG4gICAgICAgIHN0ZWVsYmx1ZTogWzcwLCAxMzAsIDE4MF1cbiAgICAgICAgdGFuOiBbMjEwLCAxODAsIDE0MF1cbiAgICAgICAgdGVhbDogWzAsIDEyOCwgMTI4XVxuICAgICAgICB0aGlzdGxlOiBbMjE2LCAxOTEsIDIxNl1cbiAgICAgICAgdG9tYXRvOiBbMjU1LCA5OSwgNzFdXG4gICAgICAgIHR1cnF1b2lzZTogWzY0LCAyMjQsIDIwOF1cbiAgICAgICAgdmlvbGV0OiBbMjM4LCAxMzAsIDIzOF1cbiAgICAgICAgd2hlYXQ6IFsyNDUsIDIyMiwgMTc5XVxuICAgICAgICB3aGl0ZTogWzI1NSwgMjU1LCAyNTVdXG4gICAgICAgIHdoaXRlc21va2U6IFsyNDUsIDI0NSwgMjQ1XVxuICAgICAgICB5ZWxsb3c6IFsyNTUsIDI1NSwgMF1cbiAgICAgICAgeWVsbG93Z3JlZW46IFsxNTQsIDIwNSwgNTBdXG4iLCIjIHRoZSBzaXplIG9mIHJlY3RhbmdsZSwgQm91bmRzIGV0Yy5cclxuXHJcbmNsYXNzIEJ1LlNpemVcclxuXHRjb25zdHJ1Y3RvcjogKEB3aWR0aCwgQGhlaWdodCkgLT5cclxuXHRcdEB0eXBlID0gJ1NpemUnXHJcblxyXG5cdHNldDogKEB3aWR0aCwgQGhlaWdodCkgLT5cclxuIiwiIyAyZCB2ZWN0b3JcclxuXHJcbmNsYXNzIEJ1LlZlY3RvclxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB4ID0gMCwgQHkgPSAwKSAtPlxyXG5cclxuXHRzZXQ6IChAeCwgQHkpIC0+XHJcblx0XHRAXHJcblxyXG5cdGNvcHk6ICh2KSAtPlxyXG5cdFx0QHggPSB2LnhcclxuXHRcdEB5ID0gdi55XHJcblx0XHRAXHJcblxyXG5cdHVuUHJvamVjdDogKG9iaikgLT5cclxuXHRcdCMgdHJhbnNsYXRlXHJcblx0XHRAeCAtPSBvYmoucG9zaXRpb24ueFxyXG5cdFx0QHkgLT0gb2JqLnBvc2l0aW9uLnlcclxuXHRcdCMgcm90YXRpb25cclxuXHRcdGxlbiA9IEJ1LmJldmVsKEB4LCBAeSlcclxuXHRcdGEgPSBNYXRoLmF0YW4yKEB5LCBAeCkgLSBvYmoucm90YXRpb25cclxuXHRcdEB4ID0gbGVuICogTWF0aC5jb3MoYSlcclxuXHRcdEB5ID0gbGVuICogTWF0aC5zaW4oYSlcclxuXHRcdCMgc2NhbGVcclxuXHRcdEB4IC89IG9iai5zY2FsZS54XHJcblx0XHRAeSAvPSBvYmouc2NhbGUueVxyXG5cdFx0QCIsIiMgQWRkIGV2ZW50IGxpc3RlbmVyIGZlYXR1cmUgdG8gY3VzdG9tIG9iamVjdHNcclxuXHJcbkJ1LkV2ZW50ID0gLT5cclxuXHR0eXBlcyA9IHt9XHJcblxyXG5cdEBvbiA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVycyA9IHR5cGVzW3R5cGVdIG9yPSBbXVxyXG5cdFx0bGlzdGVuZXJzLnB1c2ggbGlzdGVuZXIgaWYgbGlzdGVuZXJzLmluZGV4T2YgbGlzdGVuZXIgPT0gLTFcclxuXHJcblx0QG9uY2UgPSAodHlwZSwgbGlzdGVuZXIpIC0+XHJcblx0XHRsaXN0ZW5lci5vbmNlID0gdHJ1ZVxyXG5cdFx0QG9uIHR5cGUsIGxpc3RlbmVyXHJcblxyXG5cdEBvZmYgPSAodHlwZSwgbGlzdGVuZXIpIC0+XHJcblx0XHRsaXN0ZW5lcnMgPSB0eXBlc1t0eXBlXVxyXG5cdFx0aWYgbGlzdGVuZXI/XHJcblx0XHRcdGlmIGxpc3RlbmVycz9cclxuXHRcdFx0XHRpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mIGxpc3RlbmVyXHJcblx0XHRcdFx0bGlzdGVuZXJzLnNwbGljZSBpbmRleCwgMSBpZiBpbmRleCA+IC0xXHJcblx0XHRlbHNlXHJcblx0XHRcdGxpc3RlbmVycy5sZW5ndGggPSAwIGlmIGxpc3RlbmVycz9cclxuXHJcblx0QHRyaWdnZXIgPSAodHlwZSwgZXZlbnREYXRhKSAtPlxyXG5cdFx0bGlzdGVuZXJzID0gdHlwZXNbdHlwZV1cclxuXHJcblx0XHRpZiBsaXN0ZW5lcnM/XHJcblx0XHRcdGV2ZW50RGF0YSBvcj0ge31cclxuXHRcdFx0ZXZlbnREYXRhLnRhcmdldCA9IEBcclxuXHRcdFx0Zm9yIGxpc3RlbmVyIGluIGxpc3RlbmVyc1xyXG5cdFx0XHRcdGxpc3RlbmVyLmNhbGwgdGhpcywgZXZlbnREYXRhXHJcblx0XHRcdFx0aWYgbGlzdGVuZXIub25jZVxyXG5cdFx0XHRcdFx0bGlzdGVuZXJzLnNwbGljZSBsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lciksIDFcclxuIiwiIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBNaWNyb0pRdWVyeSAtIEEgbWljcm8gdmVyc2lvbiBvZiBqUXVlcnlcclxuI1xyXG4jIFN1cHBvcnRlZCBmZWF0dXJlczpcclxuIyAgICQuIC0gc3RhdGljIG1ldGhvZHNcclxuIyAgICAgLnJlYWR5KGNiKSAtIGNhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBwYWdlIGlzIGxvYWRlZFxyXG4jICAgICAuYWpheChbdXJsLF0gb3B0aW9ucykgLSBwZXJmb3JtIGFuIGFqYXggcmVxdWVzdFxyXG4jICAgJChzZWxlY3RvcikgLSBzZWxlY3QgZWxlbWVudChzKVxyXG4jICAgICAub24odHlwZSwgY2FsbGJhY2spIC0gYWRkIGFuIGV2ZW50IGxpc3RlbmVyXHJcbiMgICAgIC5vZmYodHlwZSwgY2FsbGJhY2spIC0gcmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyXHJcbiMgICAgIC5hcHBlbmQodGFnTmFtZSkgLSBhcHBlbmQgYSB0YWdcclxuIyAgICAgLnRleHQodGV4dCkgLSBzZXQgdGhlIGlubmVyIHRleHRcclxuIyAgICAgLmh0bWwoaHRtbFRleHQpIC0gc2V0IHRoZSBpbm5lciBIVE1MXHJcbiMgICAgIC5zdHlsZShuYW1lLCB2YWx1ZSkgLSBzZXQgc3R5bGUgKGEgY3NzIGF0dHJpYnV0ZSlcclxuIyAgICAgIy5jc3Mob2JqZWN0KSAtIHNldCBzdHlsZXMgKG11bHRpcGxlIGNzcyBhdHRyaWJ1dGUpXHJcbiMgICAgIC5oYXNDbGFzcyhjbGFzc05hbWUpIC0gZGV0ZWN0IHdoZXRoZXIgYSBjbGFzcyBleGlzdHNcclxuIyAgICAgLmFkZENsYXNzKGNsYXNzTmFtZSkgLSBhZGQgYSBjbGFzc1xyXG4jICAgICAucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSAtIHJlbW92ZSBhIGNsYXNzXHJcbiMgICAgIC50b2dnbGVDbGFzcyhjbGFzc05hbWUpIC0gdG9nZ2xlIGEgY2xhc3NcclxuIyAgICAgLmF0dHIobmFtZSwgdmFsdWUpIC0gc2V0IGFuIGF0dHJpYnV0ZVxyXG4jICAgICAuaGFzQXR0cihuYW1lKSAtIGRldGVjdCB3aGV0aGVyIGFuIGF0dHJpYnV0ZSBleGlzdHNcclxuIyAgICAgLnJlbW92ZUF0dHIobmFtZSkgLSByZW1vdmUgYW4gYXR0cmlidXRlXHJcbiMgICBOb3RlczpcclxuIyAgICAgICAgIyBpcyBwbGFubmVkIGJ1dCBub3QgaW1wbGVtZW50ZWRcclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbigoZ2xvYmFsKSAtPlxyXG5cclxuXHQjIHNlbGVjdG9yXHJcblx0Z2xvYmFsLiQgPSAoc2VsZWN0b3IpIC0+XHJcblx0XHRzZWxlY3Rpb25zID0gW11cclxuXHRcdGlmIHR5cGVvZiBzZWxlY3RvciA9PSAnc3RyaW5nJ1xyXG5cdFx0XHRzZWxlY3Rpb25zID0gW10uc2xpY2UuY2FsbCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsIHNlbGVjdG9yXHJcblx0XHRqUXVlcnkuYXBwbHkgc2VsZWN0aW9uc1xyXG5cdFx0c2VsZWN0aW9uc1xyXG5cclxuXHRqUXVlcnkgPSAtPlxyXG5cclxuXHRcdCMgZXZlbnRcclxuXHRcdEBvbiA9ICh0eXBlLCBjYWxsYmFjaykgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRkb20uYWRkRXZlbnRMaXN0ZW5lciB0eXBlLCBjYWxsYmFja1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QG9mZiA9ICh0eXBlLCBjYWxsYmFjaykgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lciB0eXBlLCBjYWxsYmFja1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0IyBET00gTWFuaXB1bGF0aW9uXHJcblxyXG5cdFx0U1ZHX1RBR1MgPSAnc3ZnIGxpbmUgcmVjdCBjaXJjbGUgZWxsaXBzZSBwb2x5bGluZSBwb2x5Z29uIHBhdGggdGV4dCdcclxuXHJcblx0XHRAYXBwZW5kID0gKHRhZykgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSwgaSkgPT5cclxuXHRcdFx0XHR0YWdJbmRleCA9IFNWR19UQUdTLmluZGV4T2YgdGFnLnRvTG93ZXJDYXNlKClcclxuXHRcdFx0XHRpZiB0YWdJbmRleCA+IC0xXHJcblx0XHRcdFx0XHRuZXdEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGFnXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bmV3RG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCB0YWdcclxuXHRcdFx0XHRAW2ldID0gZG9tLmFwcGVuZENoaWxkIG5ld0RvbVxyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHRleHQgPSAoc3RyKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS50ZXh0Q29udGVudCA9IHN0clxyXG5cdFx0XHRAXHJcblxyXG5cdFx0QGh0bWwgPSAoc3RyKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS5pbm5lckhUTUwgPSBzdHJcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBzdHlsZSA9IChuYW1lLCB2YWx1ZSkgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRzdHlsZVRleHQgPSBkb20uZ2V0QXR0cmlidXRlICdzdHlsZSdcclxuXHRcdFx0XHRzdHlsZXMgPSB7fVxyXG5cdFx0XHRcdGlmIHN0eWxlVGV4dFxyXG5cdFx0XHRcdFx0c3R5bGVUZXh0LnNwbGl0KCc7JykuZWFjaCAobikgLT5cclxuXHRcdFx0XHRcdFx0bnYgPSBuLnNwbGl0ICc6J1xyXG5cdFx0XHRcdFx0XHRzdHlsZXNbbnZbMF1dID0gbnZbMV1cclxuXHRcdFx0XHRzdHlsZXNbbmFtZV0gPSB2YWx1ZVxyXG5cdFx0XHRcdCMgY29uY2F0XHJcblx0XHRcdFx0c3R5bGVUZXh0ID0gJydcclxuXHRcdFx0XHRmb3IgaSBvZiBzdHlsZXNcclxuXHRcdFx0XHRcdHN0eWxlVGV4dCArPSBpICsgJzogJyArIHN0eWxlc1tpXSArICc7ICdcclxuXHRcdFx0XHRkb20uc2V0QXR0cmlidXRlICdzdHlsZScsIHN0eWxlVGV4dFxyXG5cdFx0XHRAXHJcblxyXG5cdFx0QGhhc0NsYXNzID0gKG5hbWUpID0+XHJcblx0XHRcdGlmIEBsZW5ndGggPT0gMFxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHQjIGlmIG11bHRpcGxlLCBldmVyeSBET00gc2hvdWxkIGhhdmUgdGhlIGNsYXNzXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdHdoaWxlIGkgPCBAbGVuZ3RoXHJcblx0XHRcdFx0Y2xhc3NUZXh0ID0gQFtpXS5nZXRBdHRyaWJ1dGUgJ2NsYXNzJyBvciAnJ1xyXG5cdFx0XHRcdCMgbm90IHVzZSAnICcgdG8gYXZvaWQgbXVsdGlwbGUgc3BhY2VzIGxpa2UgJ2EgICBiJ1xyXG5cdFx0XHRcdGNsYXNzZXMgPSBjbGFzc1RleHQuc3BsaXQgUmVnRXhwICcgKydcclxuXHRcdFx0XHRpZiAhY2xhc3Nlcy5jb250YWlucyBuYW1lXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0XHRpKytcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBhZGRDbGFzcyA9IChuYW1lKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGNsYXNzVGV4dCA9IGRvbS5nZXRBdHRyaWJ1dGUgJ2NsYXNzJyBvciAnJ1xyXG5cdFx0XHRcdGNsYXNzZXMgPSBjbGFzc1RleHQuc3BsaXQgUmVnRXhwICcgKydcclxuXHRcdFx0XHRpZiBub3QgY2xhc3Nlcy5jb250YWlucyBuYW1lXHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2ggbmFtZVxyXG5cdFx0XHRcdFx0ZG9tLnNldEF0dHJpYnV0ZSAnY2xhc3MnLCBjbGFzc2VzLmpvaW4gJyAnXHJcblx0XHRcdEBcclxuXHJcblx0XHRAcmVtb3ZlQ2xhc3MgPSAobmFtZSkgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRjbGFzc1RleHQgPSBkb20uZ2V0QXR0cmlidXRlKCdjbGFzcycpIG9yICcnXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmIGNsYXNzZXMuY29udGFpbnMgbmFtZVxyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5yZW1vdmUgbmFtZVxyXG5cdFx0XHRcdFx0aWYgY2xhc3Nlcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdGRvbS5zZXRBdHRyaWJ1dGUgJ2NsYXNzJywgY2xhc3Nlcy5qb2luICcgJ1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRkb20ucmVtb3ZlQXR0cmlidXRlICdjbGFzcydcclxuXHRcdFx0QFxyXG5cclxuXHRcdEB0b2dnbGVDbGFzcyA9IChuYW1lKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGNsYXNzVGV4dCA9IGRvbS5nZXRBdHRyaWJ1dGUgJ2NsYXNzJyBvciAnJ1xyXG5cdFx0XHRcdGNsYXNzZXMgPSBjbGFzc1RleHQuc3BsaXQgUmVnRXhwICcgKydcclxuXHRcdFx0XHRpZiBjbGFzc2VzLmNvbnRhaW5zIG5hbWVcclxuXHRcdFx0XHRcdGNsYXNzZXMucmVtb3ZlIG5hbWVcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2ggbmFtZVxyXG5cdFx0XHRcdGlmIGNsYXNzZXMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0ZG9tLnNldEF0dHJpYnV0ZSAnY2xhc3MnLCBjbGFzc2VzLmpvaW4gJyAnXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZG9tLnJlbW92ZUF0dHJpYnV0ZSAnY2xhc3MnXHJcblx0XHRcdEBcclxuXHJcblx0XHRAYXR0ciA9IChuYW1lLCB2YWx1ZSkgPT5cclxuXHRcdFx0aWYgdmFsdWU/XHJcblx0XHRcdFx0QGVhY2ggKGRvbSkgLT4gZG9tLnNldEF0dHJpYnV0ZSBuYW1lLCB2YWx1ZVxyXG5cdFx0XHRcdHJldHVybiBAXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gQFswXS5nZXRBdHRyaWJ1dGUgbmFtZVxyXG5cclxuXHRcdEBoYXNBdHRyID0gKG5hbWUpID0+XHJcblx0XHRcdGlmIEBsZW5ndGggPT0gMFxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHR3aGlsZSBpIDwgQGxlbmd0aFxyXG5cdFx0XHRcdGlmIG5vdCBAW2ldLmhhc0F0dHJpYnV0ZSBuYW1lXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0XHRpKytcclxuXHRcdFx0QFxyXG5cclxuXHRcdEByZW1vdmVBdHRyID0gKG5hbWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLnJlbW92ZUF0dHJpYnV0ZSBuYW1lXHJcblx0XHRcdEBcclxuXHJcblx0XHRAdmFsID0gPT4gQFswXT8udmFsdWVcclxuXHJcblx0IyAkLnJlYWR5KClcclxuXHRnbG9iYWwuJC5yZWFkeSA9IChvbkxvYWQpIC0+XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdET01Db250ZW50TG9hZGVkJywgb25Mb2FkXHJcblxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0IyAkLmFqYXgoKVxyXG5cdCNcdG9wdGlvbnM6XHJcblx0I1x0XHR1cmw6IHN0cmluZ1xyXG5cdCNcdFx0PT09PVxyXG5cdCNcdFx0YXN5bmMgPSB0cnVlOiBib29sXHJcblx0I1x0ZGF0YTogb2JqZWN0IC0gcXVlcnkgcGFyYW1ldGVycyBUT0RPOiBpbXBsZW1lbnQgdGhpc1xyXG5cdCNcdFx0bWV0aG9kID0gR0VUOiBQT1NULCBQVVQsIERFTEVURSwgSEVBRFxyXG5cdCNcdFx0dXNlcm5hbWU6IHN0cmluZ1xyXG5cdCNcdFx0cGFzc3dvcmQ6IHN0cmluZ1xyXG5cdCNcdFx0c3VjY2VzczogZnVuY3Rpb25cclxuXHQjXHRcdGVycm9yOiBmdW5jdGlvblxyXG5cdCNcdFx0Y29tcGxldGU6IGZ1bmN0aW9uXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Z2xvYmFsLiQuYWpheCA9ICh1cmwsIG9wcykgLT5cclxuXHRcdGlmICFvcHNcclxuXHRcdFx0aWYgdHlwZW9mIHVybCA9PSAnb2JqZWN0J1xyXG5cdFx0XHRcdG9wcyA9IHVybFxyXG5cdFx0XHRcdHVybCA9IG9wcy51cmxcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9wcyA9IHt9XHJcblx0XHRvcHMubWV0aG9kIG9yPSAnR0VUJ1xyXG5cdFx0b3BzLmFzeW5jID0gdHJ1ZSB1bmxlc3Mgb3BzLmFzeW5jP1xyXG5cclxuXHRcdHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdFxyXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IC0+XHJcblx0XHRcdGlmIHhoci5yZWFkeVN0YXRlID09IDRcclxuXHRcdFx0XHRpZiB4aHIuc3RhdHVzID09IDIwMFxyXG5cdFx0XHRcdFx0b3BzLnN1Y2Nlc3MgeGhyLnJlc3BvbnNlVGV4dCwgeGhyLnN0YXR1cywgeGhyIGlmIG9wcy5zdWNjZXNzP1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG9wcy5lcnJvciB4aHIsIHhoci5zdGF0dXMgaWYgb3BzLmVycm9yP1xyXG5cdFx0XHRcdFx0b3BzLmNvbXBsZXRlIHhociwgeGhyLnN0YXR1cyBpZiBvcHMuY29tcGxldGU/XHJcblxyXG5cdFx0eGhyLm9wZW4gb3BzLm1ldGhvZCwgdXJsLCBvcHMuYXN5bmMsIG9wcy51c2VybmFtZSwgb3BzLnBhc3N3b3JkXHJcblx0XHR4aHIuc2VuZCBudWxsKSBCdS5nbG9iYWxcclxuIiwiIyBCYXNlIGNsYXNzIG9mIGFsbCBzaGFwZXMgYW5kIG90aGVyIHJlbmRlcmFibGUgb2JqZWN0c1xyXG5cclxuY2xhc3MgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6ICgpIC0+XHJcblx0XHRCdS5TdHlsZWQuYXBwbHkgQFxyXG5cdFx0QnUuRXZlbnQuYXBwbHkgQFxyXG5cclxuXHRcdEB2aXNpYmxlID0geWVzXHJcblx0XHRAb3BhY2l0eSA9IDFcclxuXHJcblx0XHRAcG9zaXRpb24gPSBuZXcgQnUuVmVjdG9yXHJcblx0XHRAcm90YXRpb24gPSAwXHJcblx0XHRAX3NjYWxlID0gbmV3IEJ1LlZlY3RvciAxLCAxXHJcblx0XHRAc2tldyA9IG5ldyBCdS5WZWN0b3JcclxuXHJcblx0XHQjQHRvV29ybGRNYXRyaXggPSBuZXcgQnUuTWF0cml4KClcclxuXHRcdCNAdXBkYXRlTWF0cml4IC0+XHJcblxyXG5cdFx0IyBnZW9tZXRyeSByZWxhdGVkXHJcblx0XHRAYm91bmRzID0gbnVsbCAjIHVzZWQgdG8gYWNjZWxlcmF0ZSB0aGUgaGl0IHRlc3RpbmdcclxuXHRcdEBrZXlQb2ludHMgPSBudWxsXHJcblxyXG5cdFx0IyBoaWVyYXJjaHlcclxuXHRcdEBjaGlsZHJlbiA9IFtdXHJcblx0XHRAcGFyZW50ID0gbnVsbFxyXG5cclxuXHRAcHJvcGVydHkgJ3NjYWxlJyxcclxuXHRcdGdldDogLT4gQF9zY2FsZVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRpZiBCdS5pc051bWJlciB2YWxcclxuXHRcdFx0XHRAX3NjYWxlLnggPSBAX3NjYWxlLnkgPSB2YWxcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdEBfc2NhbGUgPSB2YWxcclxuXHJcblx0IyBUcmFuc2xhdGUgYW4gb2JqZWN0XHJcblx0dHJhbnNsYXRlOiAoZHgsIGR5KSAtPlxyXG5cdFx0QHBvc2l0aW9uLnggKz0gZHhcclxuXHRcdEBwb3NpdGlvbi55ICs9IGR5XHJcblx0XHRAXHJcblxyXG5cdCMgUm90YXRlIGFuIG9iamVjdFxyXG5cdHJvdGF0ZTogKGRhKSAtPlxyXG5cdFx0QHJvdGF0aW9uICs9IGRhXHJcblx0XHRAXHJcblxyXG5cdCMgU2NhbGUgYW4gb2JqZWN0IGJ5XHJcblx0c2NhbGVCeTogKGRzKSAtPlxyXG5cdFx0QHNjYWxlICo9IGRzXHJcblx0XHRAXHJcblxyXG5cdCMgU2NhbGUgYW4gb2JqZWN0IHRvXHJcblx0c2NhbGVUbzogKHMpIC0+XHJcblx0XHRAc2NhbGUgPSBzXHJcblx0XHRAXHJcblxyXG5cdCMgQWRkIG9iamVjdChzKSB0byBjaGlsZHJlblxyXG5cdGFkZENoaWxkOiAoc2hhcGUpIC0+XHJcblx0XHRpZiBCdS5pc0FycmF5IHNoYXBlXHJcblx0XHRcdEBjaGlsZHJlbi5wdXNoIHMgZm9yIHMgaW4gc2hhcGVcclxuXHRcdGVsc2VcclxuXHRcdFx0QGNoaWxkcmVuLnB1c2ggc2hhcGVcclxuXHRcdEBcclxuXHJcblx0IyBSZW1vdmUgb2JqZWN0IGZyb20gY2hpbGRyZW5cclxuXHRyZW1vdmVDaGlsZDogKHNoYXBlKSAtPlxyXG5cdFx0aW5kZXggPSBAY2hpbGRyZW4uaW5kZXhPZiBzaGFwZVxyXG5cdFx0QGNoaWxkcmVuLnNwbGljZSBpbmRleCwgMSBpZiBpbmRleCA+IC0xXHJcblx0XHRAXHJcblxyXG5cdCMgQXBwbHkgYW4gYW5pbWF0aW9uIG9uIHRoaXMgb2JqZWN0XHJcblx0IyBUaGUgdHlwZSBvZiBgYW5pbWAgbWF5IGJlOlxyXG5cdCMgICAgIDEuIFByZXNldCBhbmltYXRpb25zOiB0aGUgYW5pbWF0aW9uIG5hbWUoc3RyaW5nIHR5cGUpLCBpZS4ga2V5IGluIGBCdS5hbmltYXRpb25zYFxyXG5cdCMgICAgIDIuIEN1c3RvbSBhbmltYXRpb25zOiB0aGUgYW5pbWF0aW9uIG9iamVjdCBvZiBgQnUuQW5pbWF0aW9uYCB0eXBlXHJcblx0IyAgICAgMy4gTXVsdGlwbGUgYW5pbWF0aW9uczogQW4gYXJyYXkgd2hvc2UgY2hpbGRyZW4gYXJlIGFib3ZlIHR3byB0eXBlc1xyXG5cdGFuaW1hdGU6IChhbmltLCBhcmdzKSAtPlxyXG5cdFx0YXJncyA9IFthcmdzXSB1bmxlc3MgQnUuaXNBcnJheSBhcmdzXHJcblx0XHRpZiBCdS5pc1N0cmluZyBhbmltXHJcblx0XHRcdGlmIGFuaW0gb2YgQnUuYW5pbWF0aW9uc1xyXG5cdFx0XHRcdEJ1LmFuaW1hdGlvbnNbYW5pbV0uYXBwbHlUbyBALCBhcmdzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJCdS5hbmltYXRpb25zW1xcXCIjeyBhbmltIH1cXFwiXSBkb2Vzbid0IGV4aXN0cy5cIlxyXG5cdFx0ZWxzZSBpZiBCdS5pc0FycmF5IGFuaW1cclxuXHRcdFx0QGFuaW1hdGUgYW5pbVtpXSwgYXJncyBmb3Igb3duIGkgb2YgYW5pbVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRhbmltLmFwcGx5VG8gQCwgYXJnc1xyXG5cdFx0QFxyXG5cclxuXHQjIENyZWF0ZSBCb3VuZHMgZm9yIHRoaXMgb2JqZWN0XHJcblx0Y3JlYXRlQm91bmRzOiAtPlxyXG5cdFx0QGJvdW5kcyA9IG5ldyBCdS5Cb3VuZHMgQFxyXG5cdFx0QFxyXG5cclxuXHQjIEhpdCB0ZXN0aW5nIHdpdGggdW5wcm9qZWN0aW9uc1xyXG5cdGhpdFRlc3Q6IChwKSAtPlxyXG5cdFx0cC51blByb2plY3QgQFxyXG5cdFx0QGNvbnRhaW5zUG9pbnQgcFxyXG5cclxuXHQjIEhpdCB0ZXN0aW5nIGluIHRoZSBzYW1lIGNvb3JkaW5hdGVcclxuXHRjb250YWluc1BvaW50OiAocCkgLT5cclxuXHRcdGlmIEBib3VuZHM/IGFuZCBub3QgQGJvdW5kcy5jb250YWluc1BvaW50IHBcclxuXHRcdFx0cmV0dXJuIG5vXHJcblx0XHRlbHNlIGlmIEBfY29udGFpbnNQb2ludFxyXG5cdFx0XHRyZXR1cm4gQF9jb250YWluc1BvaW50IHBcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG5vXHJcbiIsIiMgQWRkIGNvbG9yIHRvIHRoZSBzaGFwZXNcclxuIyBUaGlzIG9iamVjdCBpcyBkZWRpY2F0ZWQgdG8gbWl4ZWQtaW4gdGhlIE9iamVjdDJELlxyXG5cclxuQnUuU3R5bGVkID0gKCkgLT5cclxuXHRAc3Ryb2tlU3R5bGUgPSBCdS5TdHlsZWQuREVGQVVMVF9TVFJPS0VfU1RZTEVcclxuXHRAZmlsbFN0eWxlID0gQnUuU3R5bGVkLkRFRkFVTFRfRklMTF9TVFlMRVxyXG5cdEBkYXNoU3R5bGUgPSBmYWxzZVxyXG5cdEBkYXNoRmxvd1NwZWVkID0gMFxyXG5cdEBsaW5lV2lkdGggPSAxXHJcblxyXG5cdEBkYXNoT2Zmc2V0ID0gMFxyXG5cclxuXHQjIFNldC9jb3B5IHN0eWxlIGZyb20gb3RoZXIgc3R5bGVcclxuXHRAc3R5bGUgPSAoc3R5bGUpIC0+XHJcblx0XHRpZiBCdS5pc1N0cmluZyBzdHlsZVxyXG5cdFx0XHRzdHlsZSA9IEJ1LnN0eWxlc1tzdHlsZV1cclxuXHRcdFx0aWYgbm90IHN0eWxlP1xyXG5cdFx0XHRcdHN0eWxlID0gQnUuc3R5bGVzLmRlZmF1bHRcclxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJCdS5TdHlsZWQ6IEJ1LnN0eWxlcy4jeyBzdHlsZSB9IGRvZXNuJ3QgZXhpc3RzLCBmZWxsIGJhY2sgdG8gZGVmYXVsdC5cIlxyXG5cdFx0ZWxzZSBpZiBub3Qgc3R5bGU/XHJcblx0XHRcdHN0eWxlID0gQnUuc3R5bGVzWydkZWZhdWx0J11cclxuXHJcblx0XHRmb3IgayBpbiBbJ3N0cm9rZVN0eWxlJywgJ2ZpbGxTdHlsZScsICdkYXNoU3R5bGUnLCAnZGFzaEZsb3dTcGVlZCcsICdsaW5lV2lkdGgnXVxyXG5cdFx0XHRAW2tdID0gc3R5bGVba11cclxuXHRcdEBcclxuXHJcblx0IyBTZXQgdGhlIHN0cm9rZSBzdHlsZVxyXG5cdEBzdHJva2UgPSAodikgLT5cclxuXHRcdHYgPSB0cnVlIGlmIG5vdCB2P1xyXG5cdFx0c3dpdGNoIHZcclxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gQHN0cm9rZVN0eWxlID0gQnUuU3R5bGVkLkRFRkFVTFRfU1RST0tFX1NUWUxFXHJcblx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAc3Ryb2tlU3R5bGUgPSBudWxsXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAc3Ryb2tlU3R5bGUgPSB2XHJcblx0XHRAXHJcblxyXG5cdCMgU2V0IHRoZSBmaWxsIHN0eWxlXHJcblx0QGZpbGwgPSAodikgLT5cclxuXHRcdHYgPSB0cnVlIGlmIG5vdCB2P1xyXG5cdFx0c3dpdGNoIHZcclxuXHRcdFx0d2hlbiBmYWxzZSB0aGVuIEBmaWxsU3R5bGUgPSBudWxsXHJcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBmaWxsU3R5bGUgPSBCdS5TdHlsZWQuREVGQVVMVF9GSUxMX1NUWUxFXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAZmlsbFN0eWxlID0gdlxyXG5cdFx0QFxyXG5cclxuXHQjIFNldCB0aGUgZGFzaCBzdHlsZVxyXG5cdEBkYXNoID0gKHYpIC0+XHJcblx0XHR2ID0gdHJ1ZSBpZiBub3Qgdj9cclxuXHRcdHYgPSBbdiwgdl0gaWYgQnUuaXNOdW1iZXIgdlxyXG5cdFx0c3dpdGNoIHZcclxuXHRcdFx0d2hlbiBmYWxzZSB0aGVuIEBkYXNoU3R5bGUgPSBudWxsXHJcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBkYXNoU3R5bGUgPSBCdS5TdHlsZWQuREVGQVVMVF9EQVNIX1NUWUxFXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAZGFzaFN0eWxlID0gdlxyXG5cdFx0QFxyXG5cclxuXHQjIFNldCB0aGUgZGFzaCBmbG93aW5nIHNwZWVkXHJcblx0QGRhc2hGbG93ID0gKHNwZWVkKSAtPlxyXG5cdFx0c3BlZWQgPSAxIGlmIHNwZWVkID09IHRydWUgb3Igbm90IHNwZWVkP1xyXG5cdFx0c3BlZWQgPSAwIGlmIHNwZWVkID09IGZhbHNlXHJcblx0XHRCdS5kYXNoRmxvd01hbmFnZXIuc2V0U3BlZWQgQCwgc3BlZWRcclxuXHRcdEBcclxuXHJcblx0IyBTZXQgdGhlIGxpbmVXaWR0aFxyXG5cdEBzZXRMaW5lV2lkdGggPSAodykgLT5cclxuXHRcdEBsaW5lV2lkdGggPSB3XHJcblx0XHRAXHJcblxyXG5cdEBcclxuXHJcbkJ1LlN0eWxlZC5ERUZBVUxUX1NUUk9LRV9TVFlMRSA9ICcjMDQ4J1xyXG5CdS5TdHlsZWQuREVGQVVMVF9GSUxMX1NUWUxFID0gJ3JnYmEoNjQsIDEyOCwgMTkyLCAwLjUpJ1xyXG5CdS5TdHlsZWQuREVGQVVMVF9EQVNIX1NUWUxFID0gWzgsIDRdXHJcblxyXG5CdS5zdHlsZXMgPVxyXG5cdGRlZmF1bHQ6IG5ldyBCdS5TdHlsZWQoKS5zdHJva2UoKS5maWxsKClcclxuXHRob3ZlcjogbmV3IEJ1LlN0eWxlZCgpLnN0cm9rZSgnaHNsYSgwLCAxMDAlLCAyNSUsIDAuNzUpJykuZmlsbCgnaHNsYSgwLCAxMDAlLCA3NSUsIDAuNSknKVxyXG5cdHRleHQ6IG5ldyBCdS5TdHlsZWQoKS5zdHJva2UoZmFsc2UpLmZpbGwoJ2JsYWNrJylcclxuXHRsaW5lOiBuZXcgQnUuU3R5bGVkKCkuZmlsbChmYWxzZSlcclxuXHRzZWxlY3RlZDogbmV3IEJ1LlN0eWxlZCgpLnN0cm9rZSgnI0FBMCcpLmZpbGwoKVxyXG5cdGRhc2g6IG5ldyBCdS5TdHlsZWQoKS5kYXNoKClcclxuIiwiIyBEZWNsYXJhdGl2ZSBmcmFtZXdvcmsgZm9yIEJ1LmpzIGFwcHNcclxuXHJcbiMjIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IyNcclxuQWxsIHN1cHBvcnRlZCBjb25zdHJ1Y3RvciBvcHRpb25zOlxyXG4oVGhlIGFwcGVhcmFuY2Ugc2VxdWVuY2UgaXMgdGhlIHByb2Nlc3Mgc2VxdWVuY2UuKVxyXG57XHJcbiAgICByZW5kZXJlcjogIyBzZXR0aW5ncyB0byB0aGUgcmVuZGVyZXJcclxuICAgIFx0Y29udGFpbmVyOiAnI2NvbnRhaW5lcicgIyBjc3Mgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciBkb20gb3IgaXRzZWxmXHJcbiAgICAgICAgY3Vyc29yOiAnY3Jvc3NoYW5kJyAjIHRoZSBkZWZhdWx0IGN1cnNvciBzdHlsZSBvbiB0aGUgPGNhbnZhcz5cclxuICAgICAgICBiYWNrZ3JvdW5kOiAncGluaycgIyB0aGUgZGVmYXVsdCBiYWNrZ3JvdW5kIG9mIHRoZSA8Y2FudmFzPlxyXG4gICAgXHRzaG93S2V5UG9pbnRzOiB0cnVlICMgd2hldGhlciB0byBzaG93IHRoZSBrZXkgcG9pbnRzIG9mIHNoYXBlcyAoaWYgdGhleSBoYXZlKS5cclxuICAgIGRhdGE6IHsgdmFyIH0gIyB2YXJpYWJsZXMgb2YgdGhpcyBCdS5qcyBhcHAsIHdpbGwgYmUgY29waWVkIHRvIHRoZSBhcHAgb2JqZWN0XHJcbiAgICBtZXRob2RzOiB7IGZ1bmN0aW9uIH0jIGZ1bmN0aW9ucyBvZiB0aGlzIEJ1LmpzIGFwcCwgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIGFwcCBvYmplY3RcclxuICAgIG9iamVjdHM6IHt9IG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB7fSAjIGFsbCB0aGUgcmVuZGVyYWJsZSBvYmplY3RzXHJcblx0aGllcmFyY2h5OiAjIGFuIHRyZWUgdGhhdCByZXByZXNlbnQgdGhlIG9iamVjdCBoaWVyYXJjaHkgb2YgdGhlIHNjZW5lLCB0aGUga2V5cyBhcmUgaW4gYG9iamVjdHNgXHJcbiAgICBldmVudHM6ICMgZXZlbnQgbGlzdGVuZXJzLCAnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJyB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgYm91bmQgdG8gPGNhbnZhcz5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICMgY2FsbGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICMgY2FsbGVkIGV2ZXJ5IGZyYW1lXHJcbn1cclxuIyM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSMjI1xyXG5cclxuY2xhc3MgQnUuQXBwXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQCRvcHRpb25zID0ge30pIC0+XHJcblx0XHRmb3IgayBpbiBbXCJyZW5kZXJlclwiLCBcImRhdGFcIiwgXCJvYmplY3RzXCIsIFwiaGllcmFyY2h5XCIsIFwibWV0aG9kc1wiLCBcImV2ZW50c1wiXVxyXG5cdFx0XHRAJG9wdGlvbnNba10gb3I9IHt9XHJcblxyXG5cdFx0QCRvYmplY3RzID0ge31cclxuXHRcdEAkaW5wdXRNYW5hZ2VyID0gbmV3IEJ1LklucHV0TWFuYWdlclxyXG5cclxuXHRcdEJ1LnJlYWR5IEBpbml0LCBAXHJcblxyXG5cdGluaXQ6ICgpIC0+XHJcblx0XHQjIHJlbmRlcmVyXHJcblx0XHRAJHJlbmRlcmVyID0gbmV3IEJ1LlJlbmRlcmVyIEAkb3B0aW9ucy5yZW5kZXJlclxyXG5cclxuXHRcdCMgZGF0YVxyXG5cdFx0aWYgQnUuaXNGdW5jdGlvbiBAJG9wdGlvbnMuZGF0YVxyXG5cdFx0XHRAJG9wdGlvbnMuZGF0YSA9IEAkb3B0aW9ucy5kYXRhLmFwcGx5IHRoaXNcclxuXHRcdEBba10gPSBAJG9wdGlvbnMuZGF0YVtrXSBmb3IgayBvZiBAJG9wdGlvbnMuZGF0YVxyXG5cclxuXHRcdCMgbWV0aG9kc1xyXG5cdFx0QFtrXSA9IEAkb3B0aW9ucy5tZXRob2RzW2tdIGZvciBrIG9mIEAkb3B0aW9ucy5tZXRob2RzXHJcblxyXG5cdFx0IyBvYmplY3RzXHJcblx0XHRpZiBCdS5pc0Z1bmN0aW9uIEAkb3B0aW9ucy5vYmplY3RzXHJcblx0XHRcdEAkb2JqZWN0cyA9IEAkb3B0aW9ucy5vYmplY3RzLmFwcGx5IHRoaXNcclxuXHRcdGVsc2VcclxuXHRcdFx0QCRvYmplY3RzW25hbWVdID0gQCRvcHRpb25zLm9iamVjdHNbbmFtZV0gZm9yIG5hbWUgb2YgQCRvcHRpb25zLm9iamVjdHNcclxuXHJcblx0XHQjIGhpZXJhcmNoeVxyXG5cdFx0IyBUT0RPIHVzZSBhbiBhbGdvcml0aG0gdG8gYXZvaWQgY2lyY3VsYXIgc3RydWN0dXJlXHJcblx0XHRhc3NlbWJsZU9iamVjdHMgPSAoY2hpbGRyZW4sIHBhcmVudCkgPT5cclxuXHRcdFx0Zm9yIG93biBuYW1lIG9mIGNoaWxkcmVuXHJcblx0XHRcdFx0cGFyZW50LmNoaWxkcmVuLnB1c2ggQCRvYmplY3RzW25hbWVdXHJcblx0XHRcdFx0YXNzZW1ibGVPYmplY3RzIGNoaWxkcmVuW25hbWVdLCBAJG9iamVjdHNbbmFtZV1cclxuXHRcdGFzc2VtYmxlT2JqZWN0cyBAJG9wdGlvbnMuaGllcmFyY2h5LCBAJHJlbmRlcmVyLnNjZW5lXHJcblxyXG5cdFx0IyBpbml0XHJcblx0XHRAJG9wdGlvbnMuaW5pdD8uY2FsbCBAXHJcblxyXG5cdFx0IyBldmVudHNcclxuXHRcdEAkaW5wdXRNYW5hZ2VyLmhhbmRsZUFwcEV2ZW50cyBALCBAJG9wdGlvbnMuZXZlbnRzXHJcblxyXG5cdFx0IyB1cGRhdGVcclxuXHRcdGlmIEAkb3B0aW9ucy51cGRhdGU/XHJcblx0XHRcdEAkcmVuZGVyZXIub24gJ3VwZGF0ZScsID0+IEAkb3B0aW9ucy51cGRhdGUuYXBwbHkgdGhpcywgYXJndW1lbnRzXHJcbiIsIiMgQXVkaW9cclxuXHJcbmNsYXNzIEJ1LkF1ZGlvXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAodXJsKSAtPlxyXG5cdFx0QGF1ZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnYXVkaW8nXHJcblx0XHRAdXJsID0gJydcclxuXHRcdEByZWFkeSA9IG5vXHJcblxyXG5cdFx0QGxvYWQgdXJsIGlmIHVybFxyXG5cclxuXHRsb2FkOiAodXJsKSAtPlxyXG5cdFx0QHVybCA9IHVybFxyXG5cdFx0QGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIgJ2NhbnBsYXknLCA9PlxyXG5cdFx0XHRAcmVhZHkgPSB5ZXNcclxuXHRcdEBhdWRpby5zcmMgPSB1cmxcclxuXHJcblx0cGxheTogLT5cclxuXHRcdGlmIEByZWFkeVxyXG5cdFx0XHRAYXVkaW8ucGxheSgpXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbnNvbGUud2FybiBcIlRoZSBhdWRpbyBmaWxlICN7IEB1cmwgfSBoYXNuJ3QgYmVlbiByZWFkeS5cIlxyXG4iLCIjIENhbWVyYTogY2hhbmdlIHRoZSB2aWV3IHJhbmdlIGF0IHRoZSBzY2VuZVxyXG5cclxuY2xhc3MgQnUuQ2FtZXJhIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6ICgpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdDYW1lcmEnXHJcblxyXG4iLCIjIE1hbmFnZSB0aGUgdXNlciBpbnB1dCwgbGlrZSBtb3VzZSwga2V5Ym9hcmQsIHRvdWNoc2NyZWVuIGV0Y1xyXG5cclxuY2xhc3MgQnUuSW5wdXRNYW5hZ2VyXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxyXG5cdFx0QGtleVN0YXRlcyA9IFtdXHJcblxyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2tleWRvd24nLCAoZSkgPT5cclxuXHRcdFx0QGtleVN0YXRlc1tlLmtleUNvZGVdID0geWVzXHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAna2V5dXAnLCAoZSkgPT5cclxuXHRcdFx0QGtleVN0YXRlc1tlLmtleUNvZGVdID0gbm9cclxuXHJcblx0IyBUbyBkZXRlY3Qgd2hldGhlciBhIGtleSBpcyBwcmVzc2VkIGRvd25cclxuXHRpc0tleURvd246IChrZXkpIC0+XHJcblx0XHRrZXlDb2RlID0gQGtleVRvS2V5Q29kZSBrZXlcclxuXHRcdEBrZXlTdGF0ZXNba2V5Q29kZV1cclxuXHJcblx0IyBDb252ZXJ0IGZyb20ga2V5SWRlbnRpZmllcnMva2V5VmFsdWVzIHRvIGtleUNvZGVcclxuXHRrZXlUb0tleUNvZGU6IChrZXkpIC0+XHJcblx0XHRrZXkgPSBAa2V5QWxpYXNUb0tleU1hcFtrZXldIG9yIGtleVxyXG5cdFx0a2V5Q29kZSA9IEBrZXlUb0tleUNvZGVNYXBba2V5XVxyXG5cclxuXHQjIFJlY2lldmUgYW5kIGJpbmQgdGhlIG1vdXNlL2tleWJvYXJkIGV2ZW50cyBsaXN0ZW5lcnNcclxuXHRoYW5kbGVBcHBFdmVudHM6IChhcHAsIGV2ZW50cykgLT5cclxuXHRcdGtleWRvd25MaXN0ZW5lcnMgPSB7fVxyXG5cdFx0a2V5dXBMaXN0ZW5lcnMgPSB7fVxyXG5cclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGUpID0+XHJcblx0XHRcdGtleWRvd25MaXN0ZW5lcnNbZS5rZXlDb2RlXT8uY2FsbCBhcHAsIGVcclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdrZXl1cCcsIChlKSA9PlxyXG5cdFx0XHRrZXl1cExpc3RlbmVyc1tlLmtleUNvZGVdPy5jYWxsIGFwcCwgZVxyXG5cclxuXHRcdGZvciB0eXBlIG9mIGV2ZW50c1xyXG5cdFx0XHRpZiB0eXBlIGluIFsnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJywgJ2tleWRvd24nLCAna2V5dXAnXVxyXG5cdFx0XHRcdGFwcC4kcmVuZGVyZXIuZG9tLmFkZEV2ZW50TGlzdGVuZXIgdHlwZSwgZXZlbnRzW3R5cGVdLmJpbmQoYXBwKVxyXG5cdFx0XHRlbHNlIGlmIHR5cGUuaW5kZXhPZigna2V5ZG93bi4nKSA9PSAwXHJcblx0XHRcdFx0a2V5ID0gdHlwZS5zdWJzdHJpbmcgOFxyXG5cdFx0XHRcdGtleUNvZGUgPSBAa2V5VG9LZXlDb2RlIGtleVxyXG5cdFx0XHRcdGtleWRvd25MaXN0ZW5lcnNba2V5Q29kZV0gPSBldmVudHNbdHlwZV1cclxuXHRcdFx0ZWxzZSBpZiB0eXBlLmluZGV4T2YoJ2tleXVwLicpID09IDBcclxuXHRcdFx0XHRrZXkgPSB0eXBlLnN1YnN0cmluZyA2XHJcblx0XHRcdFx0a2V5Q29kZSA9IEBrZXlUb0tleUNvZGUga2V5XHJcblx0XHRcdFx0a2V5dXBMaXN0ZW5lcnNba2V5Q29kZV0gPSBldmVudHNbdHlwZV1cclxuXHJcblx0IyBNYXAgZnJvbSBrZXlJZGVudGlmaWVycy9rZXlWYWx1ZXMgdG8ga2V5Q29kZVxyXG5cdGtleVRvS2V5Q29kZU1hcDpcclxuXHRcdEJhY2tzcGFjZTogICAgOFxyXG5cdFx0VGFiOiAgICAgICAgICA5XHJcblx0XHRFbnRlcjogICAgICAgMTNcclxuXHRcdFNoaWZ0OiAgICAgICAxNlxyXG5cdFx0Q29udHJvbDogICAgIDE3XHJcblx0XHRBbHQ6ICAgICAgICAgMThcclxuXHRcdENhcHNMb2NrOiAgICAyMFxyXG5cdFx0RXNjYXBlOiAgICAgIDI3XHJcblx0XHQnICc6ICAgICAgICAgMzIgICMgU3BhY2VcclxuXHRcdFBhZ2VVcDogICAgICAzM1xyXG5cdFx0UGFnZURvd246ICAgIDM0XHJcblx0XHRFbmQ6ICAgICAgICAgMzVcclxuXHRcdEhvbWU6ICAgICAgICAzNlxyXG5cdFx0QXJyb3dMZWZ0OiAgIDM3XHJcblx0XHRBcnJvd1VwOiAgICAgMzhcclxuXHRcdEFycm93UmlnaHQ6ICAzOVxyXG5cdFx0QXJyb3dEb3duOiAgIDQwXHJcblx0XHREZWxldGU6ICAgICAgNDZcclxuXHJcblx0XHQxOiA0OVxyXG5cdFx0MjogNTBcclxuXHRcdDM6IDUxXHJcblx0XHQ0OiA1MlxyXG5cdFx0NTogNTNcclxuXHRcdDY6IDU0XHJcblx0XHQ3OiA1NVxyXG5cdFx0ODogNTZcclxuXHRcdDk6IDU3XHJcblx0XHRBOiA2NVxyXG5cdFx0QjogNjZcclxuXHRcdEM6IDY3XHJcblx0XHREOiA2OFxyXG5cdFx0RTogNjlcclxuXHRcdEY6IDcwXHJcblx0XHRHOiA3MVxyXG5cdFx0SDogNzJcclxuXHRcdEk6IDczXHJcblx0XHRKOiA3NFxyXG5cdFx0SzogNzVcclxuXHRcdEw6IDc2XHJcblx0XHRNOiA3N1xyXG5cdFx0TjogNzhcclxuXHRcdE86IDc5XHJcblx0XHRQOiA4MFxyXG5cdFx0UTogODFcclxuXHRcdFI6IDgyXHJcblx0XHRTOiA4M1xyXG5cdFx0VDogODRcclxuXHRcdFU6IDg1XHJcblx0XHRWOiA4NlxyXG5cdFx0VzogODdcclxuXHRcdFg6IDg4XHJcblx0XHRZOiA4OVxyXG5cdFx0WjogOTBcclxuXHJcblx0XHRGMTogIDExMlxyXG5cdFx0RjI6ICAxMTNcclxuXHRcdEYzOiAgMTE0XHJcblx0XHRGNDogIDExNVxyXG5cdFx0RjU6ICAxMTZcclxuXHRcdEY2OiAgMTE3XHJcblx0XHRGNzogIDExOFxyXG5cdFx0Rjg6ICAxMTlcclxuXHRcdEY5OiAgMTIwXHJcblx0XHRGMTA6IDEyMVxyXG5cdFx0RjExOiAxMjJcclxuXHRcdEYxMjogMTIzXHJcblxyXG5cdFx0J2AnOiAxOTJcclxuXHRcdCc9JzogMTg3XHJcblx0XHQnLCc6IDE4OFxyXG5cdFx0Jy0nOiAxODlcclxuXHRcdCcuJzogMTkwXHJcblx0XHQnLyc6IDE5MVxyXG5cdFx0JzsnOiAxODZcclxuXHRcdFwiJ1wiOiAyMjJcclxuXHRcdCdbJzogMjE5XHJcblx0XHQnXSc6IDIyMVxyXG5cdFx0J1xcXFwnOiAyMjBcclxuXHJcblx0IyBNYXAgZnJvbSBub3Qgc3RhbmRhcmQsIGJ1dCBjb21tb25seSBrbm93biBrZXlWYWx1ZXMva2V5SWRlbnRpZmllcnMgdG8ga2V5Q29kZVxyXG5cdGtleUFsaWFzVG9LZXlNYXA6XHJcblx0XHRDdHJsOiAgICAgICAgJ0NvbnRyb2wnICAgICAjIDE3XHJcblx0XHRDdGw6ICAgICAgICAgJ0NvbnRyb2wnICAgICAjIDE3XHJcblx0XHRFc2M6ICAgICAgICAgJ0VzY2FwZScgICAgICAjIDI3XHJcblx0XHRTcGFjZTogICAgICAgJyAnICAgICAgICAgICAjIDMyXHJcblx0XHRQZ1VwOiAgICAgICAgJ1BhZ2VVcCcgICAgICAjIDMzXHJcblx0XHQnUGFnZSBVcCc6ICAgJ1BhZ2VVcCcgICAgICAjIDMzXHJcblx0XHRQZ0RuOiAgICAgICAgJ1BhZ2VEb3duJyAgICAjIDM0XHJcblx0XHQnUGFnZSBEb3duJzogJ1BhZ2VEb3duJyAgICAjIDM0XHJcblx0XHRMZWZ0OiAgICAgICAgJ0Fycm93TGVmdCcgICAjIDM3XHJcblx0XHRVcDogICAgICAgICAgJ0Fycm93VXAnICAgICAjIDM4XHJcblx0XHRSaWdodDogICAgICAgJ0Fycm93UmlnaHQnICAjIDM5XHJcblx0XHREb3duOiAgICAgICAgJ0Fycm93RG93bicgICAjIDQwXHJcblx0XHREZWw6ICAgICAgICAgJ0RlbGV0ZScgICAgICAjIDQ2XHJcbiIsIiMgVXNlZCB0byByZW5kZXIgYWxsIHRoZSBkcmF3YWJsZSBvYmplY3RzIHRvIHRoZSBjYW52YXNcclxuXHJcbmNsYXNzIEJ1LlJlbmRlcmVyXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxyXG5cdFx0QnUuRXZlbnQuYXBwbHkgQFxyXG5cdFx0QHR5cGUgPSAnUmVuZGVyZXInXHJcblxyXG5cdFx0IyBBUElcclxuXHRcdEBzY2VuZSA9IG5ldyBCdS5TY2VuZVxyXG5cdFx0QGNhbWVyYSA9IG5ldyBCdS5DYW1lcmFcclxuXHRcdEB0aWNrQ291bnQgPSAwXHJcblx0XHRAaXNSdW5uaW5nID0geWVzXHJcblx0XHRAcGl4ZWxSYXRpbyA9IEJ1Lmdsb2JhbC5kZXZpY2VQaXhlbFJhdGlvIG9yIDFcclxuXHRcdEBjbGlwTWV0ZXIgPSBuZXcgQ2xpcE1ldGVyKCkgaWYgQ2xpcE1ldGVyP1xyXG5cclxuXHRcdCMgUmVjZWl2ZSBvcHRpb25zXHJcblx0XHRvcHRpb25zID0gQnUuY29tYmluZU9wdGlvbnMgYXJndW1lbnRzLFxyXG5cdFx0XHRjb250YWluZXI6ICdib2R5J1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAnI2VlZSdcclxuXHRcdFx0ZnBzOiA2MFxyXG5cdFx0XHRzaG93S2V5UG9pbnRzOiBub1xyXG5cdFx0XHRzaG93Qm91bmRzOiBub1xyXG5cdFx0XHRvcmlnaW5BdENlbnRlcjogbm9cclxuXHRcdFx0aW1hZ2VTbW9vdGhpbmc6IHllc1xyXG5cclxuXHRcdCMgQ29weSBvcHRpb25zXHJcblx0XHRmb3IgbmFtZSBpbiBbJ2NvbnRhaW5lcicsICd3aWR0aCcsICdoZWlnaHQnLCAnZnBzJywgJ3Nob3dLZXlQb2ludHMnLCAnc2hvd0JvdW5kcycsICdvcmlnaW5BdENlbnRlciddXHJcblx0XHRcdEBbbmFtZV0gPSBvcHRpb25zW25hbWVdXHJcblxyXG5cdFx0IyBJZiBvcHRpb25zLndpZHRoIGlzIG5vdCBnaXZlbiwgdGhlbiBmaWxsUGFyZW50IGlzIHRydWVcclxuXHRcdEBmaWxsUGFyZW50ID0gbm90IEJ1LmlzTnVtYmVyIG9wdGlvbnMud2lkdGhcclxuXHJcblx0XHQjIENvbnZlcnQgd2lkdGggYW5kIGhlaWdodCBmcm9tIGRpcChkZXZpY2UgaW5kZXBlbmRlbnQgcGl4ZWxzKSB0byBwaHlzaWNhbCBwaXhlbHNcclxuXHRcdEB3aWR0aCAqPSBAcGl4ZWxSYXRpb1xyXG5cdFx0QGhlaWdodCAqPSBAcGl4ZWxSYXRpb1xyXG5cclxuXHRcdCMgU2V0IGNhbnZhcyBkb21cclxuXHRcdEBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdjYW52YXMnXHJcblx0XHRAZG9tLnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yIG9yICdkZWZhdWx0J1xyXG5cdFx0QGRvbS5zdHlsZS5ib3hTaXppbmcgPSAnY29udGVudC1ib3gnXHJcblx0XHRAZG9tLnN0eWxlLmJhY2tncm91bmQgPSBvcHRpb25zLmJhY2tncm91bmRcclxuXHRcdEBkb20ub25jb250ZXh0bWVudSA9IC0+IGZhbHNlXHJcblxyXG5cdFx0IyBTZXQgY29udGV4dFxyXG5cdFx0QGNvbnRleHQgPSBAZG9tLmdldENvbnRleHQgJzJkJ1xyXG5cdFx0QGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ3RvcCdcclxuXHRcdEBjb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IG9wdGlvbnMuaW1hZ2VTbW9vdGhpbmdcclxuXHJcblx0XHQjIFNldCBjb250YWluZXIgZG9tXHJcblx0XHRAY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciBAY29udGFpbmVyIGlmIEJ1LmlzU3RyaW5nIEBjb250YWluZXJcclxuXHRcdGlmIEBmaWxsUGFyZW50IGFuZCBAY29udGFpbmVyID09IGRvY3VtZW50LmJvZHlcclxuXHRcdFx0JCgnYm9keScpLnN0eWxlKCdtYXJnaW4nLCAwKS5zdHlsZSgnb3ZlcmZsb3cnLCAnaGlkZGVuJylcclxuXHRcdFx0JCgnaHRtbCwgYm9keScpLnN0eWxlKCd3aWR0aCcsICcxMDAlJykuc3R5bGUoJ2hlaWdodCcsICcxMDAlJylcclxuXHJcblx0XHQjIFNldCBzaXplcyBmb3IgcmVuZGVyZXIgcHJvcGVydHksIGRvbSBhdHRyaWJ1dGUgYW5kIGRvbSBzdHlsZVxyXG5cdFx0b25SZXNpemUgPSA9PlxyXG5cdFx0XHRjYW52YXNSYXRpbyA9IEBkb20uaGVpZ2h0IC8gQGRvbS53aWR0aFxyXG5cdFx0XHRjb250YWluZXJSYXRpbyA9IEBjb250YWluZXIuY2xpZW50SGVpZ2h0IC8gQGNvbnRhaW5lci5jbGllbnRXaWR0aFxyXG5cdFx0XHRpZiBjb250YWluZXJSYXRpbyA8IGNhbnZhc1JhdGlvXHJcblx0XHRcdFx0aGVpZ2h0ID0gQGNvbnRhaW5lci5jbGllbnRIZWlnaHRcclxuXHRcdFx0XHR3aWR0aCA9IGhlaWdodCAvIGNvbnRhaW5lclJhdGlvXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR3aWR0aCA9IEBjb250YWluZXIuY2xpZW50V2lkdGhcclxuXHRcdFx0XHRoZWlnaHQgPSB3aWR0aCAqIGNvbnRhaW5lclJhdGlvXHJcblx0XHRcdEB3aWR0aCA9IEBkb20ud2lkdGggPSB3aWR0aCAqIEBwaXhlbFJhdGlvXHJcblx0XHRcdEBoZWlnaHQgPSBAZG9tLmhlaWdodCA9IGhlaWdodCAqIEBwaXhlbFJhdGlvXHJcblx0XHRcdEBkb20uc3R5bGUud2lkdGggPSB3aWR0aCArICdweCdcclxuXHRcdFx0QGRvbS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnXHJcblx0XHRcdEByZW5kZXIoKVxyXG5cclxuXHRcdGlmIG5vdCBAZmlsbFBhcmVudFxyXG5cdFx0XHRAZG9tLnN0eWxlLndpZHRoID0gKEB3aWR0aCAvIEBwaXhlbFJhdGlvKSArICdweCdcclxuXHRcdFx0QGRvbS5zdHlsZS5oZWlnaHQgPSAoQGhlaWdodCAvIEBwaXhlbFJhdGlvKSArICdweCdcclxuXHRcdFx0QGRvbS53aWR0aCA9IEB3aWR0aFxyXG5cdFx0XHRAZG9tLmhlaWdodCA9IEBoZWlnaHRcclxuXHRcdGVsc2VcclxuXHRcdFx0QHdpZHRoID0gQGNvbnRhaW5lci5jbGllbnRXaWR0aFxyXG5cdFx0XHRAaGVpZ2h0ID0gQGNvbnRhaW5lci5jbGllbnRIZWlnaHRcclxuXHRcdFx0QnUuZ2xvYmFsLndpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCBvblJlc2l6ZVxyXG5cdFx0XHRAZG9tLmFkZEV2ZW50TGlzdGVuZXIgJ0RPTU5vZGVJbnNlcnRlZCcsIG9uUmVzaXplXHJcblxyXG5cdFx0IyBSdW4gdGhlIGxvb3BcclxuXHRcdHRpY2sgPSA9PlxyXG5cdFx0XHRpZiBAaXNSdW5uaW5nXHJcblx0XHRcdFx0QGNsaXBNZXRlci5zdGFydCgpIGlmIEBjbGlwTWV0ZXI/XHJcblx0XHRcdFx0QHJlbmRlcigpXHJcblx0XHRcdFx0QHRyaWdnZXIgJ3VwZGF0ZScsIEBcclxuXHRcdFx0XHRAdGlja0NvdW50ICs9IDFcclxuXHRcdFx0XHRAY2xpcE1ldGVyLnRpY2soKSBpZiBAY2xpcE1ldGVyP1xyXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgdGlja1xyXG5cdFx0dGljaygpXHJcblxyXG5cdFx0IyBBcHBlbmQgPGNhbnZhcz4gZG9tIGludG8gdGhlIGNvbnRhaW5lclxyXG5cdFx0YXBwZW5kRG9tID0gPT5cclxuXHRcdFx0QGNvbnRhaW5lci5hcHBlbmRDaGlsZCBAZG9tXHJcblx0XHRzZXRUaW1lb3V0IGFwcGVuZERvbSwgMVxyXG5cclxuXHRcdCMgSG9vayB1cCB3aXRoIHJ1bm5pbmcgY29tcG9uZW50c1xyXG5cdFx0QnUuYW5pbWF0aW9uUnVubmVyLmhvb2tVcCBAXHJcblx0XHRCdS5kYXNoRmxvd01hbmFnZXIuaG9va1VwIEBcclxuXHJcblxyXG5cdCMgUGF1c2UvY29udGludWUvdG9nZ2xlIHRoZSByZW5kZXJpbmcgbG9vcFxyXG5cdHBhdXNlOiAtPiBAaXNSdW5uaW5nID0gZmFsc2VcclxuXHRjb250aW51ZTogLT4gQGlzUnVubmluZyA9IHRydWVcclxuXHR0b2dnbGU6IC0+IEBpc1J1bm5pbmcgPSBub3QgQGlzUnVubmluZ1xyXG5cclxuXHJcblx0IyBQZXJmb3JtIHRoZSBmdWxsIHJlbmRlciBwcm9jZXNzXHJcblx0cmVuZGVyOiAtPlxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblxyXG5cdFx0IyBDbGVhciB0aGUgY2FudmFzXHJcblx0XHRAY2xlYXJDYW52YXMoKVxyXG5cclxuXHRcdCMgTW92ZSBjZW50ZXIgZnJvbSBsZWZ0LXRvcCBjb3JuZXIgdG8gc2NyZWVuIGNlbnRlclxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlIEB3aWR0aCAvIDIsIEBoZWlnaHQgLyAyIGlmIEBvcmlnaW5BdENlbnRlclxyXG5cclxuXHRcdCMgWm9vbSB0aGUgY2FudmFzIHdpdGggZGV2aWNlUGl4ZWxSYXRpbyB0byBzdXBwb3J0IGhpZ2ggZGVmaW5pdGlvbiBzY3JlZW5cclxuXHRcdEBjb250ZXh0LnNjYWxlIEBwaXhlbFJhdGlvLCBAcGl4ZWxSYXRpb1xyXG5cclxuXHRcdCMgVHJhbnNmb3JtIHRoZSBjYW1lcmFcclxuXHRcdEBjb250ZXh0LnNjYWxlIDEgLyBAY2FtZXJhLnNjYWxlLngsIDEgLyBAY2FtZXJhLnNjYWxlLnlcclxuXHRcdEBjb250ZXh0LnJvdGF0ZSAtQGNhbWVyYS5yb3RhdGlvblxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlIC1AY2FtZXJhLnBvc2l0aW9uLngsIC1AY2FtZXJhLnBvc2l0aW9uLnlcclxuXHJcblx0XHQjIERyYXcgdGhlIHNjZW5lIHRyZWVcclxuXHRcdEBkcmF3U2hhcGUgQHNjZW5lXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHRcdEBcclxuXHJcblx0IyBDbGVhciB0aGUgY2FudmFzXHJcblx0Y2xlYXJDYW52YXM6IC0+XHJcblx0XHRAY29udGV4dC5jbGVhclJlY3QgMCwgMCwgQHdpZHRoLCBAaGVpZ2h0XHJcblx0XHRAXHJcblxyXG5cdCMgRHJhdyBhbiBhcnJheSBvZiBkcmF3YWJsZXNcclxuXHRkcmF3U2hhcGVzOiAoc2hhcGVzKSA9PlxyXG5cdFx0aWYgc2hhcGVzP1xyXG5cdFx0XHRmb3Igc2hhcGUgaW4gc2hhcGVzXHJcblx0XHRcdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRcdFx0QGRyYXdTaGFwZSBzaGFwZVxyXG5cdFx0XHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cdFx0QFxyXG5cclxuXHQjIERyYXcgYW4gZHJhd2FibGUgdG8gdGhlIGNhbnZhc1xyXG5cdGRyYXdTaGFwZTogKHNoYXBlKSA9PlxyXG5cdFx0cmV0dXJuIEAgdW5sZXNzIHNoYXBlLnZpc2libGVcclxuXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUgc2hhcGUucG9zaXRpb24ueCwgc2hhcGUucG9zaXRpb24ueVxyXG5cdFx0QGNvbnRleHQucm90YXRlIHNoYXBlLnJvdGF0aW9uXHJcblx0XHRzeCA9IHNoYXBlLnNjYWxlLnhcclxuXHRcdHN5ID0gc2hhcGUuc2NhbGUueVxyXG5cdFx0aWYgc3ggLyBzeSA+IDEwMCBvciBzeCAvIHN5IDwgMC4wMVxyXG5cdFx0XHRzeCA9IDAgaWYgTWF0aC5hYnMoc3gpIDwgMC4wMlxyXG5cdFx0XHRzeSA9IDAgaWYgTWF0aC5hYnMoc3kpIDwgMC4wMlxyXG5cdFx0QGNvbnRleHQuc2NhbGUgc3gsIHN5XHJcblxyXG5cdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgKj0gc2hhcGUub3BhY2l0eVxyXG5cdFx0aWYgc2hhcGUuc3Ryb2tlU3R5bGU/XHJcblx0XHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gc2hhcGUuc3Ryb2tlU3R5bGVcclxuXHRcdFx0QGNvbnRleHQubGluZVdpZHRoID0gc2hhcGUubGluZVdpZHRoXHJcblx0XHRcdEBjb250ZXh0LmxpbmVDYXAgPSBzaGFwZS5saW5lQ2FwIGlmIHNoYXBlLmxpbmVDYXA/XHJcblx0XHRcdEBjb250ZXh0LmxpbmVKb2luID0gc2hhcGUubGluZUpvaW4gaWYgc2hhcGUubGluZUpvaW4/XHJcblxyXG5cdFx0QGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHJcblx0XHRzd2l0Y2ggc2hhcGUudHlwZVxyXG5cdFx0XHR3aGVuICdQb2ludCcgdGhlbiBAZHJhd1BvaW50IHNoYXBlXHJcblx0XHRcdHdoZW4gJ0xpbmUnIHRoZW4gQGRyYXdMaW5lIHNoYXBlXHJcblx0XHRcdHdoZW4gJ0NpcmNsZScgdGhlbiBAZHJhd0NpcmNsZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdFbGxpcHNlJyB0aGVuIEBkcmF3RWxsaXBzZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdUcmlhbmdsZScgdGhlbiBAZHJhd1RyaWFuZ2xlIHNoYXBlXHJcblx0XHRcdHdoZW4gJ1JlY3RhbmdsZScgdGhlbiBAZHJhd1JlY3RhbmdsZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdGYW4nIHRoZW4gQGRyYXdGYW4gc2hhcGVcclxuXHRcdFx0d2hlbiAnQm93JyB0aGVuIEBkcmF3Qm93IHNoYXBlXHJcblx0XHRcdHdoZW4gJ1BvbHlnb24nIHRoZW4gQGRyYXdQb2x5Z29uIHNoYXBlXHJcblx0XHRcdHdoZW4gJ1BvbHlsaW5lJyB0aGVuIEBkcmF3UG9seWxpbmUgc2hhcGVcclxuXHRcdFx0d2hlbiAnU3BsaW5lJyB0aGVuIEBkcmF3U3BsaW5lIHNoYXBlXHJcblx0XHRcdHdoZW4gJ1BvaW50VGV4dCcgdGhlbiBAZHJhd1BvaW50VGV4dCBzaGFwZVxyXG5cdFx0XHR3aGVuICdJbWFnZScgdGhlbiBAZHJhd0ltYWdlIHNoYXBlXHJcblx0XHRcdHdoZW4gJ09iamVjdDJEJywgJ1NjZW5lJyAjIHRoZW4gZG8gbm90aGluZ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2RyYXdTaGFwZXMoKTogdW5rbm93biBzaGFwZTogJywgc2hhcGUudHlwZSwgc2hhcGVcclxuXHJcblxyXG5cdFx0aWYgc2hhcGUuZmlsbFN0eWxlPyBhbmQgc2hhcGUuZmlsbGFibGVcclxuXHRcdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gc2hhcGUuZmlsbFN0eWxlXHJcblx0XHRcdEBjb250ZXh0LmZpbGwoKVxyXG5cclxuXHRcdGlmIHNoYXBlLmRhc2hTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5saW5lRGFzaE9mZnNldCA9IHNoYXBlLmRhc2hPZmZzZXRcclxuXHRcdFx0QGNvbnRleHQuc2V0TGluZURhc2g/IHNoYXBlLmRhc2hTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cdFx0XHRAY29udGV4dC5zZXRMaW5lRGFzaCBbXVxyXG5cdFx0ZWxzZSBpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHJcblx0XHRAZHJhd1NoYXBlcyBzaGFwZS5jaGlsZHJlbiBpZiBzaGFwZS5jaGlsZHJlbj9cclxuXHRcdEBkcmF3U2hhcGVzIHNoYXBlLmtleVBvaW50cyBpZiBAc2hvd0tleVBvaW50c1xyXG5cdFx0QGRyYXdCb3VuZHMgc2hhcGUuYm91bmRzIGlmIEBzaG93Qm91bmRzIGFuZCBzaGFwZS5ib3VuZHM/XHJcblx0XHRAXHJcblxyXG5cclxuXHJcblx0ZHJhd1BvaW50OiAoc2hhcGUpIC0+XHJcblx0XHRAY29udGV4dC5hcmMgc2hhcGUueCwgc2hhcGUueSwgQnUuUE9JTlRfUkVOREVSX1NJWkUsIDAsIEJ1LlRXT19QSVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0xpbmU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0Lm1vdmVUbyBzaGFwZS5wb2ludHNbMF0ueCwgc2hhcGUucG9pbnRzWzBdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMV0ueCwgc2hhcGUucG9pbnRzWzFdLnlcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdDaXJjbGU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmFyYyBzaGFwZS5jeCwgc2hhcGUuY3ksIHNoYXBlLnJhZGl1cywgMCwgQnUuVFdPX1BJXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3RWxsaXBzZTogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuZWxsaXBzZSAwLCAwLCBzaGFwZS5yYWRpdXNYLCBzaGFwZS5yYWRpdXNZLCAwLCBCdS5UV09fUEksIG5vXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3VHJpYW5nbGU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMF0ueCwgc2hhcGUucG9pbnRzWzBdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMV0ueCwgc2hhcGUucG9pbnRzWzFdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMl0ueCwgc2hhcGUucG9pbnRzWzJdLnlcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3UmVjdGFuZ2xlOiAoc2hhcGUpIC0+XHJcblx0XHRyZXR1cm4gQGRyYXdSb3VuZFJlY3RhbmdsZSBzaGFwZSBpZiBzaGFwZS5jb3JuZXJSYWRpdXMgIT0gMFxyXG5cdFx0QGNvbnRleHQucmVjdCBzaGFwZS5wb2ludExULngsIHNoYXBlLnBvaW50TFQueSwgc2hhcGUuc2l6ZS53aWR0aCwgc2hhcGUuc2l6ZS5oZWlnaHRcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdSb3VuZFJlY3RhbmdsZTogKHNoYXBlKSAtPlxyXG5cdFx0eDEgPSBzaGFwZS5wb2ludExULnhcclxuXHRcdHgyID0gc2hhcGUucG9pbnRSQi54XHJcblx0XHR5MSA9IHNoYXBlLnBvaW50TFQueVxyXG5cdFx0eTIgPSBzaGFwZS5wb2ludFJCLnlcclxuXHRcdHIgPSBzaGFwZS5jb3JuZXJSYWRpdXNcclxuXHJcblx0XHRAY29udGV4dC5tb3ZlVG8geDEsIHkxICsgclxyXG5cdFx0QGNvbnRleHQuYXJjVG8geDEsIHkxLCB4MSArIHIsIHkxLCByXHJcblx0XHRAY29udGV4dC5saW5lVG8geDIgLSByLCB5MVxyXG5cdFx0QGNvbnRleHQuYXJjVG8geDIsIHkxLCB4MiwgeTEgKyByLCByXHJcblx0XHRAY29udGV4dC5saW5lVG8geDIsIHkyIC0gclxyXG5cdFx0QGNvbnRleHQuYXJjVG8geDIsIHkyLCB4MiAtIHIsIHkyLCByXHJcblx0XHRAY29udGV4dC5saW5lVG8geDEgKyByLCB5MlxyXG5cdFx0QGNvbnRleHQuYXJjVG8geDEsIHkyLCB4MSwgeTIgLSByLCByXHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cclxuXHRcdEBjb250ZXh0LnNldExpbmVEYXNoPyBzaGFwZS5kYXNoU3R5bGUgaWYgc2hhcGUuc3Ryb2tlU3R5bGU/IGFuZCBzaGFwZS5kYXNoU3R5bGVcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdGYW46IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmFyYyBzaGFwZS5jeCwgc2hhcGUuY3ksIHNoYXBlLnJhZGl1cywgc2hhcGUuYUZyb20sIHNoYXBlLmFUb1xyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLmN4LCBzaGFwZS5jeVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdCb3c6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmFyYyBzaGFwZS5jeCwgc2hhcGUuY3ksIHNoYXBlLnJhZGl1cywgc2hhcGUuYUZyb20sIHNoYXBlLmFUb1xyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdQb2x5Z29uOiAoc2hhcGUpIC0+XHJcblx0XHRmb3IgcG9pbnQgaW4gc2hhcGUudmVydGljZXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvIHBvaW50LngsIHBvaW50LnlcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3UG9seWxpbmU6IChzaGFwZSkgLT5cclxuXHRcdGZvciBwb2ludCBpbiBzaGFwZS52ZXJ0aWNlc1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8gcG9pbnQueCwgcG9pbnQueVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1NwbGluZTogKHNoYXBlKSAtPlxyXG5cdFx0aWYgc2hhcGUuc3Ryb2tlU3R5bGU/XHJcblx0XHRcdGxlbiA9IHNoYXBlLnZlcnRpY2VzLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPT0gMlxyXG5cdFx0XHRcdEBjb250ZXh0Lm1vdmVUbyBzaGFwZS52ZXJ0aWNlc1swXS54LCBzaGFwZS52ZXJ0aWNlc1swXS55XHJcblx0XHRcdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnZlcnRpY2VzWzFdLngsIHNoYXBlLnZlcnRpY2VzWzFdLnlcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPiAyXHJcblx0XHRcdFx0QGNvbnRleHQubW92ZVRvIHNoYXBlLnZlcnRpY2VzWzBdLngsIHNoYXBlLnZlcnRpY2VzWzBdLnlcclxuXHRcdFx0XHRmb3IgaSBpbiBbMS4ubGVuIC0gMV1cclxuXHRcdFx0XHRcdEBjb250ZXh0LmJlemllckN1cnZlVG8oXHJcblx0XHRcdFx0XHRcdFx0c2hhcGUuY29udHJvbFBvaW50c0JlaGluZFtpIC0gMV0ueFxyXG5cdFx0XHRcdFx0XHRcdHNoYXBlLmNvbnRyb2xQb2ludHNCZWhpbmRbaSAtIDFdLnlcclxuXHRcdFx0XHRcdFx0XHRzaGFwZS5jb250cm9sUG9pbnRzQWhlYWRbaV0ueFxyXG5cdFx0XHRcdFx0XHRcdHNoYXBlLmNvbnRyb2xQb2ludHNBaGVhZFtpXS55XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUudmVydGljZXNbaV0ueFxyXG5cdFx0XHRcdFx0XHRcdHNoYXBlLnZlcnRpY2VzW2ldLnlcclxuXHRcdFx0XHRcdClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdQb2ludFRleHQ6IChzaGFwZSkgLT5cclxuXHRcdGZvbnQgPSBzaGFwZS5mb250IG9yIEJ1LkRFRkFVTFRfRk9OVFxyXG5cclxuXHRcdGlmIEJ1LmlzU3RyaW5nIGZvbnRcclxuXHRcdFx0QGNvbnRleHQudGV4dEFsaWduID0gc2hhcGUudGV4dEFsaWduXHJcblx0XHRcdEBjb250ZXh0LnRleHRCYXNlbGluZSA9IHNoYXBlLnRleHRCYXNlbGluZVxyXG5cdFx0XHRAY29udGV4dC5mb250ID0gZm9udFxyXG5cclxuXHRcdFx0aWYgc2hhcGUuc3Ryb2tlU3R5bGU/XHJcblx0XHRcdFx0QGNvbnRleHQuc3Ryb2tlVGV4dCBzaGFwZS50ZXh0LCBzaGFwZS54LCBzaGFwZS55XHJcblx0XHRcdGlmIHNoYXBlLmZpbGxTdHlsZT9cclxuXHRcdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSBzaGFwZS5maWxsU3R5bGVcclxuXHRcdFx0XHRAY29udGV4dC5maWxsVGV4dCBzaGFwZS50ZXh0LCBzaGFwZS54LCBzaGFwZS55XHJcblx0XHRlbHNlIGlmIGZvbnQgaW5zdGFuY2VvZiBCdS5TcHJpdGVTaGVldCBhbmQgZm9udC5yZWFkeVxyXG5cdFx0XHR0ZXh0V2lkdGggPSBmb250Lm1lYXN1cmVUZXh0V2lkdGggc2hhcGUudGV4dFxyXG5cdFx0XHR4T2Zmc2V0ID0gc3dpdGNoIHNoYXBlLnRleHRBbGlnblxyXG5cdFx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gMFxyXG5cdFx0XHRcdHdoZW4gJ2NlbnRlcicgdGhlbiAtdGV4dFdpZHRoIC8gMlxyXG5cdFx0XHRcdHdoZW4gJ3JpZ2h0JyB0aGVuIC10ZXh0V2lkdGhcclxuXHRcdFx0eU9mZnNldCA9IHN3aXRjaCBzaGFwZS50ZXh0QmFzZWxpbmVcclxuXHRcdFx0XHR3aGVuICd0b3AnIHRoZW4gMFxyXG5cdFx0XHRcdHdoZW4gJ21pZGRsZScgdGhlbiAtZm9udC5oZWlnaHQgLyAyXHJcblx0XHRcdFx0d2hlbiAnYm90dG9tJyB0aGVuIC1mb250LmhlaWdodFxyXG5cdFx0XHRmb3IgaSBpbiBbMC4uLnNoYXBlLnRleHQubGVuZ3RoXVxyXG5cdFx0XHRcdGNoYXIgPSBzaGFwZS50ZXh0W2ldXHJcblx0XHRcdFx0Y2hhckJpdG1hcCA9IGZvbnQuZ2V0RnJhbWVJbWFnZSBjaGFyXHJcblx0XHRcdFx0aWYgY2hhckJpdG1hcD9cclxuXHRcdFx0XHRcdEBjb250ZXh0LmRyYXdJbWFnZSBjaGFyQml0bWFwLCBzaGFwZS54ICsgeE9mZnNldCwgc2hhcGUueSArIHlPZmZzZXRcclxuXHRcdFx0XHRcdHhPZmZzZXQgKz0gY2hhckJpdG1hcC53aWR0aFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHhPZmZzZXQgKz0gMTBcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdJbWFnZTogKHNoYXBlKSAtPlxyXG5cdFx0aWYgc2hhcGUucmVhZHlcclxuXHRcdFx0dyA9IHNoYXBlLnNpemUud2lkdGhcclxuXHRcdFx0aCA9IHNoYXBlLnNpemUuaGVpZ2h0XHJcblx0XHRcdGR4ID0gLXcgKiBzaGFwZS5waXZvdC54XHJcblx0XHRcdGR5ID0gLWggKiBzaGFwZS5waXZvdC55XHJcblx0XHRcdEBjb250ZXh0LmRyYXdJbWFnZSBzaGFwZS5pbWFnZSwgZHgsIGR5LCB3LCBoXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3Qm91bmRzOiAoYm91bmRzKSAtPlxyXG5cdFx0QGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gQnUuUmVuZGVyZXIuQk9VTkRTX1NUUk9LRV9TVFlMRVxyXG5cdFx0QGNvbnRleHQuc2V0TGluZURhc2g/IEJ1LlJlbmRlcmVyLkJPVU5EU19EQVNIX1NUWUxFXHJcblx0XHRAY29udGV4dC5yZWN0IGJvdW5kcy54MSwgYm91bmRzLnkxLCBib3VuZHMueDIgLSBib3VuZHMueDEsIGJvdW5kcy55MiAtIGJvdW5kcy55MVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHRcdEBcclxuXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgU3RhdGljIG1lbWJlcnNcclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiMgU3Ryb2tlIHN0eWxlIG9mIGJvdW5kc1xyXG5CdS5SZW5kZXJlci5CT1VORFNfU1RST0tFX1NUWUxFID0gJ3JlZCdcclxuXHJcbiMgRGFzaCBzdHlsZSBvZiBib3VuZHNcclxuQnUuUmVuZGVyZXIuQk9VTkRTX0RBU0hfU1RZTEUgPSBbNiwgNl1cclxuIiwiIyBTY2VuZSBpcyB0aGUgcm9vdCBvZiB0aGUgb2JqZWN0IHRyZWVcclxuXHJcbmNsYXNzIEJ1LlNjZW5lIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdTY2VuZSdcclxuIiwiIyBCb3cgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkJvdyBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdHR5cGU6ICdCb3cnXHJcblx0ZmlsbGFibGU6IHllc1xyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG8pIC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0W0BhRnJvbSwgQGFUb10gPSBbQGFUbywgQGFGcm9tXSBpZiBAYUZyb20gPiBAYVRvXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZyA9IG5ldyBCdS5MaW5lIEBjZW50ZXIuYXJjVG8oQHJhZGl1cywgQGFGcm9tKSwgQGNlbnRlci5hcmNUbyhAcmFkaXVzLCBAYVRvKVxyXG5cdFx0QGtleVBvaW50cyA9IEBzdHJpbmcucG9pbnRzXHJcblxyXG5cdFx0QHVwZGF0ZUtleVBvaW50cygpXHJcblx0XHRAb24gJ2NoYW5nZWQnLCBAdXBkYXRlS2V5UG9pbnRzXHJcblx0XHRAb24gJ2NoYW5nZWQnLCA9PiBALmJvdW5kcz8udXBkYXRlKClcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Cb3cgQGN4LCBAY3ksIEByYWRpdXMsIEBhRnJvbSwgQGFUb1xyXG5cclxuXHR1cGRhdGVLZXlQb2ludHM6IC0+XHJcblx0XHRAY2VudGVyLnNldCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZy5wb2ludHNbMF0uY29weSBAY2VudGVyLmFyY1RvIEByYWRpdXMsIEBhRnJvbVxyXG5cdFx0QHN0cmluZy5wb2ludHNbMV0uY29weSBAY2VudGVyLmFyY1RvIEByYWRpdXMsIEBhVG9cclxuXHRcdEBrZXlQb2ludHMgPSBAc3RyaW5nLnBvaW50c1xyXG5cdFx0QFxyXG4iLCIjIENpcmNsZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuQ2lyY2xlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0dHlwZTogJ0NpcmNsZSdcclxuXHRmaWxsYWJsZTogeWVzXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQF9yYWRpdXMgPSAxLCBjeCA9IDAsIGN5ID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0XHRAX2NlbnRlciA9IG5ldyBCdS5Qb2ludChjeCwgY3kpXHJcblx0XHRAYm91bmRzID0gbnVsbCAjIGZvciBhY2NlbGVyYXRlIGNvbnRhaW4gdGVzdFxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBbQF9jZW50ZXJdXHJcblx0XHRAb24gJ2NlbnRlckNoYW5nZWQnLCBAdXBkYXRlS2V5UG9pbnRzXHJcblxyXG5cdGNsb25lOiAoKSAtPiBuZXcgQnUuQ2lyY2xlIEByYWRpdXMsIEBjeCwgQGN5XHJcblxyXG5cdHVwZGF0ZUtleVBvaW50czogLT5cclxuXHRcdEBrZXlQb2ludHNbMF0uc2V0IEBjeCwgQGN5XHJcblxyXG5cdCMgcHJvcGVydHlcclxuXHJcblx0QHByb3BlcnR5ICdjeCcsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyLnhcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jZW50ZXIueCA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2VudGVyQ2hhbmdlZCcsIEBcclxuXHJcblx0QHByb3BlcnR5ICdjeScsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyLnlcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jZW50ZXIueSA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2VudGVyQ2hhbmdlZCcsIEBcclxuXHJcblx0QHByb3BlcnR5ICdjZW50ZXInLFxyXG5cdFx0Z2V0OiAtPiBAX2NlbnRlclxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2NlbnRlciA9IHZhbFxyXG5cdFx0XHRAY3ggPSB2YWwueFxyXG5cdFx0XHRAY3kgPSB2YWwueVxyXG5cdFx0XHRAa2V5UG9pbnRzWzBdID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdjZW50ZXJDaGFuZ2VkJywgQFxyXG5cclxuXHRAcHJvcGVydHkgJ3JhZGl1cycsXHJcblx0XHRnZXQ6IC0+IEBfcmFkaXVzXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfcmFkaXVzID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdyYWRpdXNDaGFuZ2VkJywgQFxyXG5cdFx0XHRAXHJcbiIsIiMgRWxsaXBzZS9PdmFsIFNoYXBlXHJcblxyXG5jbGFzcyBCdS5FbGxpcHNlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0dHlwZTogJ0VsbGlwc2UnXHJcblx0ZmlsbGFibGU6IHllc1xyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBfcmFkaXVzWCA9IDIwLCBAX3JhZGl1c1kgPSAxMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0IyBwcm9wZXJ0eVxyXG5cclxuXHRAcHJvcGVydHkgJ3JhZGl1c1gnLFxyXG5cdFx0Z2V0OiAtPiBAX3JhZGl1c1hcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9yYWRpdXNYID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdjaGFuZ2VkJywgQFxyXG5cclxuXHJcblx0QHByb3BlcnR5ICdyYWRpdXNZJyxcclxuXHRcdGdldDogLT4gQF9yYWRpdXNZXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfcmFkaXVzWSA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2hhbmdlZCcsIEBcclxuIiwiIyBGYW4gc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkZhbiBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdHR5cGU6ICdGYW4nXHJcblx0ZmlsbGFibGU6IHllc1xyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG8pIC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0W0BhRnJvbSwgQGFUb10gPSBbQGFUbywgQGFGcm9tXSBpZiBAYUZyb20gPiBAYVRvXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZyA9IG5ldyBCdS5MaW5lIEBjZW50ZXIuYXJjVG8oQHJhZGl1cywgQGFGcm9tKSwgQGNlbnRlci5hcmNUbyhAcmFkaXVzLCBAYVRvKVxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBbXHJcblx0XHRcdEBzdHJpbmcucG9pbnRzWzBdXHJcblx0XHRcdEBzdHJpbmcucG9pbnRzWzFdXHJcblx0XHRcdEBjZW50ZXJcclxuXHRcdF1cclxuXHRcdEBvbiAnY2hhbmdlZCcsIEB1cGRhdGVLZXlQb2ludHNcclxuXHRcdEBvbiAnY2hhbmdlZCcsID0+IEAuYm91bmRzPy51cGRhdGUoKVxyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LkZhbiBAY3gsIEBjeSwgQHJhZGl1cywgQGFGcm9tLCBAYVRvXHJcblxyXG5cdHVwZGF0ZUtleVBvaW50czogLT5cclxuXHRcdEBjZW50ZXIuc2V0IEBjeCwgQGN5XHJcblx0XHRAc3RyaW5nLnBvaW50c1swXS5jb3B5IEBjZW50ZXIuYXJjVG8gQHJhZGl1cywgQGFGcm9tXHJcblx0XHRAc3RyaW5nLnBvaW50c1sxXS5jb3B5IEBjZW50ZXIuYXJjVG8gQHJhZGl1cywgQGFUb1xyXG5cdFx0QFxyXG4iLCIjIGxpbmUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHR0eXBlOiAnTGluZSdcclxuXHRmaWxsYWJsZTogbm9cclxuXHJcblx0Y29uc3RydWN0b3I6IChwMSwgcDIsIHAzLCBwNCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxyXG5cdFx0XHRAcG9pbnRzID0gW25ldyBCdS5Qb2ludCgpLCBuZXcgQnUuUG9pbnQoKV1cclxuXHRcdGVsc2UgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDRcclxuXHRcdFx0QHBvaW50cyA9IFtwMS5jbG9uZSgpLCBwMi5jbG9uZSgpXVxyXG5cdFx0ZWxzZSAgIyBsZW4gPj0gNFxyXG5cdFx0XHRAcG9pbnRzID0gW25ldyBCdS5Qb2ludChwMSwgcDIpLCBuZXcgQnUuUG9pbnQocDMsIHA0KV1cclxuXHJcblx0XHRAbGVuZ3RoID0gMFxyXG5cdFx0QG1pZHBvaW50ID0gbmV3IEJ1LlBvaW50KClcclxuXHRcdEBrZXlQb2ludHMgPSBAcG9pbnRzXHJcblxyXG5cdFx0QG9uIFwiY2hhbmdlZFwiLCA9PlxyXG5cdFx0XHRAbGVuZ3RoID0gQHBvaW50c1swXS5kaXN0YW5jZVRvKEBwb2ludHNbMV0pXHJcblx0XHRcdEBtaWRwb2ludC5zZXQoKEBwb2ludHNbMF0ueCArIEBwb2ludHNbMV0ueCkgLyAyLCAoQHBvaW50c1swXS55ICsgQHBvaW50c1sxXS55KSAvIDIpXHJcblxyXG5cdFx0QHRyaWdnZXIgXCJjaGFuZ2VkXCJcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5MaW5lIEBwb2ludHNbMF0sIEBwb2ludHNbMV1cclxuXHJcblx0IyBlZGl0XHJcblxyXG5cdHNldDogKGExLCBhMiwgYTMsIGE0KSAtPlxyXG5cdFx0aWYgcDQ/XHJcblx0XHRcdEBwb2ludHNbMF0uc2V0IGExLCBhMlxyXG5cdFx0XHRAcG9pbnRzWzFdLnNldCBhMywgYTRcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBvaW50c1swXSA9IGExXHJcblx0XHRcdEBwb2ludHNbMV0gPSBhMlxyXG5cdFx0QHRyaWdnZXIgXCJjaGFuZ2VkXCJcclxuXHRcdEBcclxuXHJcblx0c2V0UG9pbnQxOiAoYTEsIGEyKSAtPlxyXG5cdFx0aWYgYTI/XHJcblx0XHRcdEBwb2ludHNbMF0uc2V0IGExLCBhMlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcG9pbnRzWzBdLmNvcHkgYTFcclxuXHRcdEB0cmlnZ2VyIFwiY2hhbmdlZFwiXHJcblx0XHRAXHJcblxyXG5cdHNldFBvaW50MjogKGExLCBhMikgLT5cclxuXHRcdGlmIGEyP1xyXG5cdFx0XHRAcG9pbnRzWzFdLnNldCBhMSwgYTJcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBvaW50c1sxXS5jb3B5IGExXHJcblx0XHRAdHJpZ2dlciBcImNoYW5nZWRcIlxyXG5cdFx0QFxyXG4iLCIjIHBvaW50IHNoYXBlXHJcblxyXG5jbGFzcyBCdS5Qb2ludCBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdHR5cGU6ICdQb2ludCdcclxuXHRmaWxsYWJsZTogeWVzXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHggPSAwLCBAeSA9IDApIC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0QGxpbmVXaWR0aCA9IDAuNVxyXG5cdFx0QF9sYWJlbEluZGV4ID0gLTFcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Qb2ludCBAeCwgQHlcclxuXHJcblx0QHByb3BlcnR5ICdsYWJlbCcsXHJcblx0XHRnZXQ6IC0+IGlmIEBfbGFiZWxJbmRleCA+IC0xIHRoZW4gQGNoaWxkcmVuW0BfbGFiZWxJbmRleF0udGV4dCBlbHNlICcnXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdGlmIEBfbGFiZWxJbmRleCA9PSAtMVxyXG5cdFx0XHRcdHBvaW50VGV4dCA9IG5ldyBCdS5Qb2ludFRleHQgdmFsLCBAeCArIEJ1LlBPSU5UX0xBQkVMX09GRlNFVCwgQHksIHthbGlnbjogJyswJ31cclxuXHRcdFx0XHRAY2hpbGRyZW4ucHVzaCBwb2ludFRleHRcclxuXHRcdFx0XHRAX2xhYmVsSW5kZXggPSBAY2hpbGRyZW4ubGVuZ3RoIC0gMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGNoaWxkcmVuW0BfbGFiZWxJbmRleF0udGV4dCA9IHZhbFxyXG5cclxuXHRhcmNUbzogKHJhZGl1cywgYXJjKSAtPlxyXG5cdFx0cmV0dXJuIG5ldyBCdS5Qb2ludCBAeCArIE1hdGguY29zKGFyYykgKiByYWRpdXMsIEB5ICsgTWF0aC5zaW4oYXJjKSAqIHJhZGl1c1xyXG5cclxuXHJcblx0IyBjb3B5IHZhbHVlIGZyb20gb3RoZXIgbGluZVxyXG5cdGNvcHk6IChwb2ludCkgLT5cclxuXHRcdEB4ID0gcG9pbnQueFxyXG5cdFx0QHkgPSBwb2ludC55XHJcblx0XHRAdXBkYXRlTGFiZWwoKVxyXG5cclxuXHQjIHNldCB2YWx1ZSBmcm9tIHgsIHlcclxuXHRzZXQ6ICh4LCB5KSAtPlxyXG5cdFx0QHggPSB4XHJcblx0XHRAeSA9IHlcclxuXHRcdEB1cGRhdGVMYWJlbCgpXHJcblxyXG5cdHVwZGF0ZUxhYmVsOiAtPlxyXG5cdFx0aWYgQF9sYWJlbEluZGV4ID4gLTFcclxuXHRcdFx0QGNoaWxkcmVuW0BfbGFiZWxJbmRleF0ueCA9IEB4ICsgQnUuUE9JTlRfTEFCRUxfT0ZGU0VUXHJcblx0XHRcdEBjaGlsZHJlbltAX2xhYmVsSW5kZXhdLnkgPSBAeVxyXG4iLCIjIHBvbHlnb24gc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlBvbHlnb24gZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHR0eXBlOiAnUG9seWdvbidcclxuXHRmaWxsYWJsZTogeWVzXHJcblxyXG5cdCMjI1xyXG4gICAgY29uc3RydWN0b3JzXHJcbiAgICAxLiBQb2x5Z29uKHBvaW50cylcclxuICAgIDIuIFBvbHlnb24oeCwgeSwgcmFkaXVzLCBuLCBvcHRpb25zKTogdG8gZ2VuZXJhdGUgcmVndWxhciBwb2x5Z29uXHJcbiAgICBcdG9wdGlvbnM6IGFuZ2xlIC0gc3RhcnQgYW5nbGUgb2YgcmVndWxhciBwb2x5Z29uXHJcblx0IyMjXHJcblx0Y29uc3RydWN0b3I6IChwb2ludHMpIC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0QHZlcnRpY2VzID0gW11cclxuXHRcdEBsaW5lcyA9IFtdXHJcblx0XHRAdHJpYW5nbGVzID0gW11cclxuXHJcblx0XHRvcHRpb25zID0gQnUuY29tYmluZU9wdGlvbnMgYXJndW1lbnRzLFxyXG5cdFx0XHRhbmdsZTogMFxyXG5cclxuXHRcdGlmIEJ1LmlzQXJyYXkgcG9pbnRzXHJcblx0XHRcdEB2ZXJ0aWNlcyA9IHBvaW50cyBpZiBwb2ludHM/XHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIGFyZ3VtZW50cy5sZW5ndGggPCA0XHJcblx0XHRcdFx0eCA9IDBcclxuXHRcdFx0XHR5ID0gMFxyXG5cdFx0XHRcdHJhZGl1cyA9IGFyZ3VtZW50c1swXVxyXG5cdFx0XHRcdG4gPSBhcmd1bWVudHNbMV1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHggPSBhcmd1bWVudHNbMF1cclxuXHRcdFx0XHR5ID0gYXJndW1lbnRzWzFdXHJcblx0XHRcdFx0cmFkaXVzID0gYXJndW1lbnRzWzJdXHJcblx0XHRcdFx0biA9IGFyZ3VtZW50c1szXVxyXG5cdFx0XHRAdmVydGljZXMgPSBCdS5Qb2x5Z29uLmdlbmVyYXRlUmVndWxhclBvaW50cyB4LCB5LCByYWRpdXMsIG4sIG9wdGlvbnNcclxuXHJcblx0XHRAb25WZXJ0aWNlc0NoYW5nZWQoKVxyXG5cdFx0QG9uICdjaGFuZ2VkJywgQG9uVmVydGljZXNDaGFuZ2VkXHJcblx0XHRAb24gJ2NoYW5nZWQnLCA9PiBALmJvdW5kcz8udXBkYXRlKClcclxuXHRcdEBrZXlQb2ludHMgPSBAdmVydGljZXNcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Qb2x5Z29uIEB2ZXJ0aWNlc1xyXG5cclxuXHRvblZlcnRpY2VzQ2hhbmdlZDogLT5cclxuXHRcdEBsaW5lcyA9IFtdXHJcblx0XHRAdHJpYW5nbGVzID0gW11cclxuXHRcdCMgaW5pdCBsaW5lc1xyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0Zm9yIGkgaW4gWzAgLi4uIEB2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tpXSwgQHZlcnRpY2VzW2kgKyAxXSkpXHJcblx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMV0sIEB2ZXJ0aWNlc1swXSkpXHJcblxyXG5cdFx0IyBpbml0IHRyaWFuZ2xlc1xyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDJcclxuXHRcdFx0Zm9yIGkgaW4gWzEgLi4uIEB2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdEB0cmlhbmdsZXMucHVzaChuZXcgQnUuVHJpYW5nbGUoQHZlcnRpY2VzWzBdLCBAdmVydGljZXNbaV0sIEB2ZXJ0aWNlc1tpICsgMV0pKVxyXG5cclxuXHQjIGRldGVjdFxyXG5cclxuXHRpc1NpbXBsZTogKCkgLT5cclxuXHRcdGxlbiA9IEBsaW5lcy5sZW5ndGhcclxuXHRcdGZvciBpIGluIFswLi4ubGVuXVxyXG5cdFx0XHRmb3IgaiBpbiBbaSArIDEuLi5sZW5dXHJcblx0XHRcdFx0aWYgQGxpbmVzW2ldLmlzQ3Jvc3NXaXRoTGluZShAbGluZXNbal0pXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdCMgZWRpdFxyXG5cclxuXHRhZGRQb2ludDogKHBvaW50LCBpbnNlcnRJbmRleCkgLT5cclxuXHRcdGlmIG5vdCBpbnNlcnRJbmRleD9cclxuXHRcdFx0IyBhZGQgcG9pbnRcclxuXHRcdFx0QHZlcnRpY2VzLnB1c2ggcG9pbnRcclxuXHJcblx0XHRcdCMgYWRkIGxpbmVcclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAbGluZXNbQGxpbmVzLmxlbmd0aCAtIDFdLnBvaW50c1sxXSA9IHBvaW50XHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0QGxpbmVzLnB1c2gobmV3IEJ1LkxpbmUoQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXSwgQHZlcnRpY2VzWzBdKSlcclxuXHJcblx0XHRcdCMgYWRkIHRyaWFuZ2xlXHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAyXHJcblx0XHRcdFx0QHRyaWFuZ2xlcy5wdXNoKG5ldyBCdS5UcmlhbmdsZShcclxuXHRcdFx0XHRcdFx0QHZlcnRpY2VzWzBdXHJcblx0XHRcdFx0XHRcdEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMl1cclxuXHRcdFx0XHRcdFx0QHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdCkpXHJcblx0XHRlbHNlXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHBvaW50KVxyXG5cdCMgVE9ETyBhZGQgbGluZXMgYW5kIHRyaWFuZ2xlc1xyXG5cclxuXHRAZ2VuZXJhdGVSZWd1bGFyUG9pbnRzID0gKGN4LCBjeSwgcmFkaXVzLCBuLCBvcHRpb25zKSAtPlxyXG5cdFx0YW5nbGVEZWx0YSA9IG9wdGlvbnMuYW5nbGVcclxuXHRcdHIgPSByYWRpdXNcclxuXHRcdHBvaW50cyA9IFtdXHJcblx0XHRhbmdsZVNlY3Rpb24gPSBCdS5UV09fUEkgLyBuXHJcblx0XHRmb3IgaSBpbiBbMCAuLi4gbl1cclxuXHRcdFx0YSA9IGkgKiBhbmdsZVNlY3Rpb24gKyBhbmdsZURlbHRhXHJcblx0XHRcdHggPSBjeCArIHIgKiBNYXRoLmNvcyhhKVxyXG5cdFx0XHR5ID0gY3kgKyByICogTWF0aC5zaW4oYSlcclxuXHRcdFx0cG9pbnRzW2ldID0gbmV3IEJ1LlBvaW50IHgsIHlcclxuXHRcdHJldHVybiBwb2ludHNcclxuIiwiIyBwb2x5bGluZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuUG9seWxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHR0eXBlOiAnUG9seWxpbmUnXHJcblx0ZmlsbGFibGU6IG5vXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHZlcnRpY2VzID0gW10pIC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0aWYgYXJndW1lbnRzLmxlbmd0aCA+IDFcclxuXHRcdFx0dmVydGljZXMgPSBbXVxyXG5cdFx0XHRmb3IgaSBpbiBbMCAuLi4gYXJndW1lbnRzLmxlbmd0aCAvIDJdXHJcblx0XHRcdFx0dmVydGljZXMucHVzaCBuZXcgQnUuUG9pbnQgYXJndW1lbnRzW2kgKiAyXSwgYXJndW1lbnRzW2kgKiAyICsgMV1cclxuXHRcdFx0QHZlcnRpY2VzID0gdmVydGljZXNcclxuXHJcblx0XHRAbGluZXMgPSBbXVxyXG5cdFx0QGtleVBvaW50cyA9IEB2ZXJ0aWNlc1xyXG5cclxuXHRcdEBmaWxsIG9mZlxyXG5cclxuXHRcdEBvbiBcImNoYW5nZWRcIiwgPT5cclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAdXBkYXRlTGluZXMoKVxyXG5cdFx0XHRcdEBjYWxjTGVuZ3RoPygpXHJcblx0XHRcdFx0QGNhbGNQb2ludE5vcm1hbGl6ZWRQb3M/KClcclxuXHRcdEB0cmlnZ2VyIFwiY2hhbmdlZFwiXHJcblxyXG5cdGNsb25lOiAtPlxyXG5cdFx0cG9seWxpbmUgPSBuZXcgQnUuUG9seWxpbmUgQHZlcnRpY2VzXHJcblx0XHRwb2x5bGluZS5zdHJva2VTdHlsZSA9IEBzdHJva2VTdHlsZVxyXG5cdFx0cG9seWxpbmUuZmlsbFN0eWxlID0gQGZpbGxTdHlsZVxyXG5cdFx0cG9seWxpbmUuZGFzaFN0eWxlID0gQGRhc2hTdHlsZVxyXG5cdFx0cG9seWxpbmUubGluZVdpZHRoID0gQGxpbmVXaWR0aFxyXG5cdFx0cG9seWxpbmUuZGFzaE9mZnNldCA9IEBkYXNoT2Zmc2V0XHJcblx0XHRwb2x5bGluZVxyXG5cclxuXHR1cGRhdGVMaW5lczogLT5cclxuXHRcdGZvciBpIGluIFswIC4uLiBAdmVydGljZXMubGVuZ3RoIC0gMV1cclxuXHRcdFx0aWYgQGxpbmVzW2ldP1xyXG5cdFx0XHRcdEBsaW5lc1tpXS5zZXQgQHZlcnRpY2VzW2ldLCBAdmVydGljZXNbaSArIDFdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAbGluZXNbaV0gPSBuZXcgQnUuTGluZSBAdmVydGljZXNbaV0sIEB2ZXJ0aWNlc1tpICsgMV1cclxuXHRcdCMgVE9ETyByZW1vdmUgdGhlIHJlc3RcclxuXHRcdEBcclxuXHJcblx0IyBlZGl0XHJcblxyXG5cdHNldCA9IChwb2ludHMpIC0+XHJcblx0XHQjIHBvaW50c1xyXG5cdFx0Zm9yIGkgaW4gWzAgLi4uIEB2ZXJ0aWNlcy5sZW5ndGhdXHJcblx0XHRcdEB2ZXJ0aWNlc1tpXS5jb3B5IHBvaW50c1tpXVxyXG5cclxuXHRcdCMgcmVtb3ZlIHRoZSBleHRyYSBwb2ludHNcclxuXHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiBwb2ludHMubGVuZ3RoXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UgcG9pbnRzLmxlbmd0aFxyXG5cclxuXHRcdEB0cmlnZ2VyIFwiY2hhbmdlZFwiXHJcblx0XHRAXHJcblxyXG5cdGFkZFBvaW50OiAocG9pbnQsIGluc2VydEluZGV4KSAtPlxyXG5cdFx0aWYgbm90IGluc2VydEluZGV4P1xyXG5cdFx0XHQjIGFkZCBwb2ludFxyXG5cdFx0XHRAdmVydGljZXMucHVzaCBwb2ludFxyXG5cdFx0XHQjIGFkZCBsaW5lXHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAxXHJcblx0XHRcdFx0QGxpbmVzLnB1c2ggbmV3IEJ1LkxpbmUgQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAyXSwgQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAdmVydGljZXMuc3BsaWNlIGluc2VydEluZGV4LCAwLCBwb2ludFxyXG5cdFx0IyBUT0RPIGFkZCBsaW5lc1xyXG5cdFx0QHRyaWdnZXIgXCJjaGFuZ2VkXCJcclxuXHRcdEBcclxuIiwiIyByZWN0YW5nbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlJlY3RhbmdsZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdHR5cGU6ICdSZWN0YW5nbGUnXHJcblx0ZmlsbGFibGU6IHllc1xyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHgsIHksIHdpZHRoLCBoZWlnaHQsIGNvcm5lclJhZGl1cyA9IDApIC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCB4ICsgd2lkdGggLyAyLCB5ICsgaGVpZ2h0IC8gMlxyXG5cdFx0QHNpemUgPSBuZXcgQnUuU2l6ZSB3aWR0aCwgaGVpZ2h0XHJcblxyXG5cdFx0QHBvaW50TFQgPSBuZXcgQnUuUG9pbnQgeCwgeVxyXG5cdFx0QHBvaW50UlQgPSBuZXcgQnUuUG9pbnQgeCArIHdpZHRoLCB5XHJcblx0XHRAcG9pbnRSQiA9IG5ldyBCdS5Qb2ludCB4ICsgd2lkdGgsIHkgKyBoZWlnaHRcclxuXHRcdEBwb2ludExCID0gbmV3IEJ1LlBvaW50IHgsIHkgKyBoZWlnaHRcclxuXHJcblx0XHRAcG9pbnRzID0gW0Bwb2ludExULCBAcG9pbnRSVCwgQHBvaW50UkIsIEBwb2ludExCXVxyXG5cclxuXHRcdEBjb3JuZXJSYWRpdXMgPSBjb3JuZXJSYWRpdXNcclxuXHRcdEBvbiAnY2hhbmdlZCcsID0+IEAuYm91bmRzPy51cGRhdGUoKVxyXG5cclxuXHRAcHJvcGVydHkgJ2Nvcm5lclJhZGl1cycsXHJcblx0XHRnZXQ6IC0+IEBfY29ybmVyUmFkaXVzXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfY29ybmVyUmFkaXVzID0gdmFsXHJcblx0XHRcdEBrZXlQb2ludHMgPSBpZiB2YWwgPiAwIHRoZW4gW10gZWxzZSBAcG9pbnRzXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuUmVjdGFuZ2xlIEBwb2ludExULngsIEBwb2ludExULnksIEBzaXplLndpZHRoLCBAc2l6ZS5oZWlnaHRcclxuXHJcblx0c2V0OiAoeCwgeSwgd2lkdGgsIGhlaWdodCkgLT5cclxuXHRcdEBjZW50ZXIuc2V0IHggKyB3aWR0aCAvIDIsIHkgKyBoZWlnaHQgLyAyXHJcblx0XHRAc2l6ZS5zZXQgd2lkdGgsIGhlaWdodFxyXG5cclxuXHRcdEBwb2ludExULnNldCB4LCB5XHJcblx0XHRAcG9pbnRSVC5zZXQgeCArIHdpZHRoLCB5XHJcblx0XHRAcG9pbnRSQi5zZXQgeCArIHdpZHRoLCB5ICsgaGVpZ2h0XHJcblx0XHRAcG9pbnRMQi5zZXQgeCwgeSArIGhlaWdodFxyXG4iLCIjIHNwbGluZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuU3BsaW5lIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0dHlwZTogJ1NwbGluZSdcclxuXHRmaWxsYWJsZTogbm9cclxuXHJcblx0Y29uc3RydWN0b3I6ICh2ZXJ0aWNlcykgLT5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0XHRpZiB2ZXJ0aWNlcyBpbnN0YW5jZW9mIEJ1LlBvbHlsaW5lXHJcblx0XHRcdHBvbHlsaW5lID0gdmVydGljZXNcclxuXHRcdFx0QHZlcnRpY2VzID0gcG9seWxpbmUudmVydGljZXNcclxuXHRcdFx0cG9seWxpbmUub24gJ3BvaW50Q2hhbmdlJywgKHBvbHlsaW5lKSA9PlxyXG5cdFx0XHRcdEB2ZXJ0aWNlcyA9IHBvbHlsaW5lLnZlcnRpY2VzXHJcblx0XHRcdFx0Y2FsY0NvbnRyb2xQb2ludHMgQFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAdmVydGljZXMgPSBCdS5jbG9uZSB2ZXJ0aWNlc1xyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBAdmVydGljZXNcclxuXHRcdEBjb250cm9sUG9pbnRzQWhlYWQgPSBbXVxyXG5cdFx0QGNvbnRyb2xQb2ludHNCZWhpbmQgPSBbXVxyXG5cclxuXHRcdEBmaWxsIG9mZlxyXG5cdFx0QHNtb290aEZhY3RvciA9IEJ1LkRFRkFVTFRfU1BMSU5FX1NNT09USFxyXG5cdFx0QF9zbW9vdGhlciA9IG5vXHJcblxyXG5cdFx0Y2FsY0NvbnRyb2xQb2ludHMgQFxyXG5cclxuXHRAcHJvcGVydHkgJ3Ntb290aGVyJyxcclxuXHRcdGdldDogLT4gQF9zbW9vdGhlclxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRvbGRWYWwgPSBAX3Ntb290aGVyXHJcblx0XHRcdEBfc21vb3RoZXIgPSB2YWxcclxuXHRcdFx0Y2FsY0NvbnRyb2xQb2ludHMgQCBpZiBvbGRWYWwgIT0gQF9zbW9vdGhlclxyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LlNwbGluZSBAdmVydGljZXNcclxuXHJcblx0YWRkUG9pbnQ6IChwb2ludCkgLT5cclxuXHRcdEB2ZXJ0aWNlcy5wdXNoIHBvaW50XHJcblx0XHRjYWxjQ29udHJvbFBvaW50cyBAXHJcblxyXG5cdGNhbGNDb250cm9sUG9pbnRzID0gKHNwbGluZSkgLT5cclxuXHRcdHNwbGluZS5rZXlQb2ludHMgPSBzcGxpbmUudmVydGljZXNcclxuXHJcblx0XHRwID0gc3BsaW5lLnZlcnRpY2VzXHJcblx0XHRsZW4gPSBwLmxlbmd0aFxyXG5cdFx0aWYgbGVuID49IDFcclxuXHRcdFx0c3BsaW5lLmNvbnRyb2xQb2ludHNCZWhpbmRbMF0gPSBwWzBdXHJcblx0XHRpZiBsZW4gPj0gMlxyXG5cdFx0XHRzcGxpbmUuY29udHJvbFBvaW50c0FoZWFkW2xlbiAtIDFdID0gcFtsZW4gLSAxXVxyXG5cdFx0aWYgbGVuID49IDNcclxuXHRcdFx0Zm9yIGkgaW4gWzEuLi5sZW4gLSAxXVxyXG5cdFx0XHRcdHRoZXRhMSA9IE1hdGguYXRhbjIgcFtpXS55IC0gcFtpIC0gMV0ueSwgcFtpXS54IC0gcFtpIC0gMV0ueFxyXG5cdFx0XHRcdHRoZXRhMiA9IE1hdGguYXRhbjIgcFtpICsgMV0ueSAtIHBbaV0ueSwgcFtpICsgMV0ueCAtIHBbaV0ueFxyXG5cdFx0XHRcdGxlbjEgPSBCdS5iZXZlbCBwW2ldLnkgLSBwW2kgLSAxXS55LCBwW2ldLnggLSBwW2kgLSAxXS54XHJcblx0XHRcdFx0bGVuMiA9IEJ1LmJldmVsIHBbaV0ueSAtIHBbaSArIDFdLnksIHBbaV0ueCAtIHBbaSArIDFdLnhcclxuXHRcdFx0XHR0aGV0YSA9IHRoZXRhMSArICh0aGV0YTIgLSB0aGV0YTEpICogaWYgc3BsaW5lLl9zbW9vdGhlciB0aGVuIGxlbjEgLyAobGVuMSArIGxlbjIpIGVsc2UgMC41XHJcblx0XHRcdFx0dGhldGEgKz0gTWF0aC5QSSBpZiBNYXRoLmFicyh0aGV0YSAtIHRoZXRhMSkgPiBCdS5IQUxGX1BJXHJcblx0XHRcdFx0eEEgPSBwW2ldLnggLSBsZW4xICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguY29zKHRoZXRhKVxyXG5cdFx0XHRcdHlBID0gcFtpXS55IC0gbGVuMSAqIHNwbGluZS5zbW9vdGhGYWN0b3IgKiBNYXRoLnNpbih0aGV0YSlcclxuXHRcdFx0XHR4QiA9IHBbaV0ueCArIGxlbjIgKiBzcGxpbmUuc21vb3RoRmFjdG9yICogTWF0aC5jb3ModGhldGEpXHJcblx0XHRcdFx0eUIgPSBwW2ldLnkgKyBsZW4yICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguc2luKHRoZXRhKVxyXG5cdFx0XHRcdHNwbGluZS5jb250cm9sUG9pbnRzQWhlYWRbaV0gPSBuZXcgQnUuUG9pbnQgeEEsIHlBXHJcblx0XHRcdFx0c3BsaW5lLmNvbnRyb2xQb2ludHNCZWhpbmRbaV0gPSBuZXcgQnUuUG9pbnQgeEIsIHlCXHJcblxyXG5cdFx0XHRcdCMgYWRkIGNvbnRyb2wgbGluZXMgZm9yIGRlYnVnZ2luZ1xyXG5cdFx0XHRcdCNzcGxpbmUuY2hpbGRyZW5baSAqIDIgLSAyXSA9IG5ldyBCdS5MaW5lIHNwbGluZS52ZXJ0aWNlc1tpXSwgc3BsaW5lLmNvbnRyb2xQb2ludHNBaGVhZFtpXVxyXG5cdFx0XHRcdCNzcGxpbmUuY2hpbGRyZW5baSAqIDIgLSAxXSA9ICBuZXcgQnUuTGluZSBzcGxpbmUudmVydGljZXNbaV0sIHNwbGluZS5jb250cm9sUG9pbnRzQmVoaW5kW2ldXHJcbiIsIiMgdHJpYW5nbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlRyaWFuZ2xlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0dHlwZTogJ1RyaWFuZ2xlJ1xyXG5cdGZpbGxhYmxlOiB5ZXNcclxuXHJcblx0Y29uc3RydWN0b3I6IChwMSwgcDIsIHAzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cclxuXHRcdGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gNlxyXG5cdFx0XHRbeDEsIHkxLCB4MiwgeTIsIHgzLCB5M10gPSBhcmd1bWVudHNcclxuXHRcdFx0cDEgPSBuZXcgQnUuUG9pbnQgeDEsIHkxXHJcblx0XHRcdHAyID0gbmV3IEJ1LlBvaW50IHgyLCB5MlxyXG5cdFx0XHRwMyA9IG5ldyBCdS5Qb2ludCB4MywgeTNcclxuXHJcblx0XHRAbGluZXMgPSBbXHJcblx0XHRcdG5ldyBCdS5MaW5lKHAxLCBwMilcclxuXHRcdFx0bmV3IEJ1LkxpbmUocDIsIHAzKVxyXG5cdFx0XHRuZXcgQnUuTGluZShwMywgcDEpXHJcblx0XHRdXHJcblx0XHQjQGNlbnRlciA9IG5ldyBCdS5Qb2ludCBCdS5hdmVyYWdlKHAxLngsIHAyLngsIHAzLngpLCBCdS5hdmVyYWdlKHAxLnksIHAyLnksIHAzLnkpXHJcblx0XHRAcG9pbnRzID0gW3AxLCBwMiwgcDNdXHJcblx0XHRAa2V5UG9pbnRzID0gQHBvaW50c1xyXG5cdFx0QG9uICdjaGFuZ2VkJywgQHVwZGF0ZVxyXG5cdFx0QG9uICdjaGFuZ2VkJywgPT4gQC5ib3VuZHM/LnVwZGF0ZSgpXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuVHJpYW5nbGUgQHBvaW50c1swXSwgQHBvaW50c1sxXSwgQHBvaW50c1syXVxyXG5cclxuXHR1cGRhdGU6IC0+XHJcblx0XHRAbGluZXNbMF0ucG9pbnRzWzBdLmNvcHkgQHBvaW50c1swXVxyXG5cdFx0QGxpbmVzWzBdLnBvaW50c1sxXS5jb3B5IEBwb2ludHNbMV1cclxuXHRcdEBsaW5lc1sxXS5wb2ludHNbMF0uY29weSBAcG9pbnRzWzFdXHJcblx0XHRAbGluZXNbMV0ucG9pbnRzWzFdLmNvcHkgQHBvaW50c1syXVxyXG5cdFx0QGxpbmVzWzJdLnBvaW50c1swXS5jb3B5IEBwb2ludHNbMl1cclxuXHRcdEBsaW5lc1syXS5wb2ludHNbMV0uY29weSBAcG9pbnRzWzBdXHJcbiIsIiMgVXNlZCB0byByZW5kZXIgYml0bWFwIHRvIHRoZSBzY3JlZW5cclxuXHJcbmNsYXNzIEJ1LkltYWdlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChAdXJsLCB4ID0gMCwgeSA9IDAsIHdpZHRoLCBoZWlnaHQpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdJbWFnZSdcclxuXHJcblx0XHRAYXV0b1NpemUgPSB5ZXNcclxuXHRcdEBzaXplID0gbmV3IEJ1LlNpemVcclxuXHRcdEBwb3NpdGlvbiA9IG5ldyBCdS5WZWN0b3IgeCwgeVxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5WZWN0b3IgeCArIHdpZHRoIC8gMiwgeSArIGhlaWdodCAvIDJcclxuXHRcdGlmIHdpZHRoP1xyXG5cdFx0XHRAc2l6ZS5zZXQgd2lkdGgsIGhlaWdodFxyXG5cdFx0XHRAYXV0b1NpemUgPSBub1xyXG5cclxuXHRcdEBwaXZvdCA9IG5ldyBCdS5WZWN0b3IgMC41LCAwLjVcclxuXHJcblx0XHRAX2ltYWdlID0gbmV3IEJ1Lmdsb2JhbC5JbWFnZVxyXG5cdFx0QHJlYWR5ID0gZmFsc2VcclxuXHJcblx0XHRAX2ltYWdlLm9ubG9hZCA9IChlKSA9PlxyXG5cdFx0XHRpZiBAYXV0b1NpemVcclxuXHRcdFx0XHRAc2l6ZS5zZXQgQF9pbWFnZS53aWR0aCwgQF9pbWFnZS5oZWlnaHRcclxuXHRcdFx0QHJlYWR5ID0gdHJ1ZVxyXG5cclxuXHRcdEBfaW1hZ2Uuc3JjID0gQHVybCBpZiBAdXJsP1xyXG5cclxuXHRAcHJvcGVydHkgJ2ltYWdlJyxcclxuXHRcdGdldDogLT4gQF9pbWFnZVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2ltYWdlID0gdmFsXHJcblx0XHRcdEByZWFkeSA9IHllc1xyXG4iLCIjIFJlbmRlciB0ZXh0IGFyb3VuZCBhIHBvaW50XHJcblxyXG5jbGFzcyBCdS5Qb2ludFRleHQgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHQjIyNcclxuXHRvcHRpb25zLmFsaWduOlxyXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR8ICAgLS0gICAgMC0gICAgKy0gICB8XHJcblx0fCAgICAgICAgIHzihpkwMCAgICAgIHxcclxuXHR8ICAgLTAgIC0tKy0+ICAgKzAgICB8XHJcblx0fCAgICAgICAgIOKGkyAgICAgICAgICB8XHJcblx0fCAgIC0rICAgIDArICAgICsrICAgfFxyXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRmb3IgZXhhbXBsZTogdGV4dCBpcyBpbiB0aGUgcmlnaHQgdG9wIG9mIHRoZSBwb2ludCwgdGhlbiBhbGlnbiA9IFwiKy1cIlxyXG5cdCMjI1xyXG5cdGNvbnN0cnVjdG9yOiAoQHRleHQsIEB4ID0gMCwgQHkgPSAwKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnUG9pbnRUZXh0J1xyXG5cdFx0QHN0cm9rZVN0eWxlID0gbnVsbCAjIG5vIHN0cm9rZSBieSBkZWZhdWx0XHJcblx0XHRAZmlsbFN0eWxlID0gJ2JsYWNrJ1xyXG5cclxuXHRcdG9wdGlvbnMgPSBCdS5jb21iaW5lT3B0aW9ucyBhcmd1bWVudHMsXHJcblx0XHRcdGFsaWduOiAnMDAnXHJcblx0XHRAYWxpZ24gPSBvcHRpb25zLmFsaWduXHJcblx0XHRpZiBvcHRpb25zLmZvbnQ/XHJcblx0XHRcdEBmb250ID0gb3B0aW9ucy5mb250XHJcblx0XHRlbHNlIGlmIG9wdGlvbnMuZm9udEZhbWlseT8gb3Igb3B0aW9ucy5mb250U2l6ZT9cclxuXHRcdFx0QF9mb250RmFtaWx5ID0gb3B0aW9ucy5mb250RmFtaWx5IG9yIEJ1LkRFRkFVTFRfRk9OVF9GQU1JTFlcclxuXHRcdFx0QF9mb250U2l6ZSA9IG9wdGlvbnMuZm9udFNpemUgb3IgQnUuREVGQVVMVF9GT05UX1NJWkVcclxuXHRcdFx0QGZvbnQgPSBcIiN7IEBfZm9udFNpemUgfXB4ICN7IEBfZm9udEZhbWlseSB9XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0QGZvbnQgPSBudWxsXHJcblxyXG5cdEBwcm9wZXJ0eSAnYWxpZ24nLFxyXG5cdFx0Z2V0OiAtPiBAX2FsaWduXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfYWxpZ24gPSB2YWxcclxuXHRcdFx0QHNldEFsaWduIEBfYWxpZ25cclxuXHJcblx0QHByb3BlcnR5ICdmb250RmFtaWx5JyxcclxuXHRcdGdldDogLT4gQF9mb250RmFtaWx5XHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfZm9udEZhbWlseSA9IHZhbFxyXG5cdFx0XHRAZm9udCA9IFwiI3sgQF9mb250U2l6ZSB9cHggI3sgQF9mb250RmFtaWx5IH1cIlxyXG5cclxuXHRAcHJvcGVydHkgJ2ZvbnRTaXplJyxcclxuXHRcdGdldDogLT4gQF9mb250U2l6ZVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2ZvbnRTaXplID0gdmFsXHJcblx0XHRcdEBmb250ID0gXCIjeyBAX2ZvbnRTaXplIH1weCAjeyBAX2ZvbnRGYW1pbHkgfVwiXHJcblxyXG5cdHNldEFsaWduOiAoYWxpZ24pIC0+XHJcblx0XHRpZiBhbGlnbi5sZW5ndGggPT0gMVxyXG5cdFx0XHRhbGlnbiA9ICcnICsgYWxpZ24gKyBhbGlnblxyXG5cdFx0YWxpZ25YID0gYWxpZ24uc3Vic3RyaW5nKDAsIDEpXHJcblx0XHRhbGlnblkgPSBhbGlnbi5zdWJzdHJpbmcoMSwgMilcclxuXHRcdEB0ZXh0QWxpZ24gPSBzd2l0Y2ggYWxpZ25YXHJcblx0XHRcdHdoZW4gJy0nIHRoZW4gJ3JpZ2h0J1xyXG5cdFx0XHR3aGVuICcwJyB0aGVuICdjZW50ZXInXHJcblx0XHRcdHdoZW4gJysnIHRoZW4gJ2xlZnQnXHJcblx0XHRAdGV4dEJhc2VsaW5lID0gc3dpdGNoIGFsaWduWVxyXG5cdFx0XHR3aGVuICctJyB0aGVuICdib3R0b20nXHJcblx0XHRcdHdoZW4gJzAnIHRoZW4gJ21pZGRsZSdcclxuXHRcdFx0d2hlbiAnKycgdGhlbiAndG9wJ1xyXG5cdFx0QFxyXG4iLCIjIGFuaW1hdGlvbiBjbGFzcyBhbmQgcHJlc2V0IGFuaW1hdGlvbnNcclxuXHJcbmNsYXNzIEJ1LkFuaW1hdGlvblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XHJcblx0XHRAZnJvbSA9IG9wdGlvbnMuZnJvbVxyXG5cdFx0QHRvID0gb3B0aW9ucy50b1xyXG5cdFx0QGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiBvciAwLjVcclxuXHRcdEBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyBvciBmYWxzZVxyXG5cdFx0QHJlcGVhdCA9ICEhb3B0aW9ucy5yZXBlYXRcclxuXHRcdEBpbml0ID0gb3B0aW9ucy5pbml0XHJcblx0XHRAdXBkYXRlID0gb3B0aW9ucy51cGRhdGVcclxuXHRcdEBmaW5pc2ggPSBvcHRpb25zLmZpbmlzaFxyXG5cclxuXHRhcHBseVRvOiAodGFyZ2V0LCBhcmdzKSAtPlxyXG5cdFx0dGFzayA9IG5ldyBCdS5BbmltYXRpb25UYXNrIEAsIHRhcmdldCwgYXJnc1xyXG5cdFx0QnUuYW5pbWF0aW9uUnVubmVyLmFkZCB0YXNrXHJcblx0XHR0YXNrXHJcblxyXG5cdGlzTGVnYWw6IC0+XHJcblx0XHRyZXR1cm4gdHJ1ZSB1bmxlc3MgQGZyb20/IGFuZCBAdG8/XHJcblxyXG5cdFx0aWYgQnUuaXNQbGFpbk9iamVjdCBAZnJvbVxyXG5cdFx0XHRmb3Igb3duIGtleSBvZiBAZnJvbVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZSB1bmxlc3MgQHRvW2tleV0/XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZSB1bmxlc3MgQHRvP1xyXG5cdFx0dHJ1ZVxyXG5cclxuIyBQcmVzZXQgQW5pbWF0aW9uc1xyXG4jIFNvbWUgb2YgdGhlIGFuaW1hdGlvbnMgYXJlIGNvbnNpc3RlbnQgd2l0aCBqUXVlcnkgVUlcclxuQnUuYW5pbWF0aW9ucyA9XHJcblxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0IyBTaW1wbGVcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRmYWRlSW46IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBvcGFjaXR5ID0gYW5pbS50XHJcblxyXG5cdGZhZGVPdXQ6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBvcGFjaXR5ID0gMSAtIGFuaW0udFxyXG5cclxuXHRzcGluOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAcm90YXRpb24gPSBhbmltLnQgKiBNYXRoLlBJICogMlxyXG5cclxuXHRzcGluSW46IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRhbmltLmRhdGEuZGVzU2NhbGUgPSBhbmltLmFyZyBvciAxXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IGFuaW0udFxyXG5cdFx0XHRAcm90YXRpb24gPSBhbmltLnQgKiBNYXRoLlBJICogNFxyXG5cdFx0XHRAc2NhbGUgPSBhbmltLnQgKiBhbmltLmRhdGEuZGVzU2NhbGVcclxuXHJcblx0c3Bpbk91dDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0dXBkYXRlOiAoYW5pbSkgLT5cclxuXHRcdFx0QG9wYWNpdHkgPSAxIC0gYW5pbS50XHJcblx0XHRcdEByb3RhdGlvbiA9IGFuaW0udCAqIE1hdGguUEkgKiA0XHJcblx0XHRcdEBzY2FsZSA9IDEgLSBhbmltLnRcclxuXHJcblx0Ymxpbms6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGR1cmF0aW9uOiAwLjJcclxuXHRcdGZyb206IDBcclxuXHRcdHRvOiA1MTJcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdGQgPSBNYXRoLmZsb29yIE1hdGguYWJzKGFuaW0uY3VycmVudCAtIDI1NilcclxuXHRcdFx0QGZpbGxTdHlsZSA9IFwicmdiKCN7IGQgfSwgI3sgZCB9LCAjeyBkIH0pXCJcclxuXHJcblx0c2hha2U6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRhbmltLmRhdGEub3ggPSBAcG9zaXRpb24ueFxyXG5cdFx0XHRhbmltLmRhdGEucmFuZ2UgPSBhbmltLmFyZyBvciAyMFxyXG5cdFx0dXBkYXRlOiAoYW5pbSkgLT5cclxuXHRcdFx0QHBvc2l0aW9uLnggPSBNYXRoLnNpbihhbmltLnQgKiBNYXRoLlBJICogOCkgKiBhbmltLmRhdGEucmFuZ2UgKyBhbmltLmRhdGEub3hcclxuXHJcblx0anVtcDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZGF0YS5veSA9IEBwb3NpdGlvbi55XHJcblx0XHRcdGFuaW0uZGF0YS5oZWlnaHQgPSBhbmltLmFyZyBvciAxMDBcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBwb3NpdGlvbi55ID0gLSBhbmltLmRhdGEuaGVpZ2h0ICogTWF0aC5zaW4oYW5pbS50ICogTWF0aC5QSSkgKyBhbmltLmRhdGEub3lcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFRvZ2dsZWQ6IGRldGVjdCBhbmQgc2F2ZSBvcmlnaW5hbCBzdGF0dXNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWZmOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRkdXJhdGlvbjogMC4xNVxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9XHJcblx0XHRcdFx0b3BhY2l0eTogQG9wYWNpdHlcclxuXHRcdFx0XHRzY2FsZTogQHNjYWxlLnhcclxuXHRcdFx0YW5pbS50byA9XHJcblx0XHRcdFx0aWYgQG9wYWNpdHkgPT0gMVxyXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxyXG5cdFx0XHRcdFx0c2NhbGU6IEBzY2FsZS54ICogMS41XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxyXG5cdFx0XHRcdFx0c2NhbGU6IEBzY2FsZS54IC8gMS41XHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IGFuaW0uY3VycmVudC5vcGFjaXR5XHJcblx0XHRcdEBzY2FsZSA9IGFuaW0uY3VycmVudC5zY2FsZVxyXG5cclxuXHRjbGlwOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRpbml0OiAoYW5pbSkgLT5cclxuXHRcdFx0aWYgQHNjYWxlLnkgIT0gMFxyXG5cdFx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS55XHJcblx0XHRcdFx0YW5pbS50byA9IDBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS55XHJcblx0XHRcdFx0YW5pbS50byA9IEBzY2FsZS54XHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAc2NhbGUueSA9IGFuaW0uY3VycmVudFxyXG5cclxuXHRmbGlwWDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS54XHJcblx0XHRcdGFuaW0udG8gPSAtYW5pbS5mcm9tXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAc2NhbGUueCA9IGFuaW0uY3VycmVudFxyXG5cclxuXHRmbGlwWTogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS55XHJcblx0XHRcdGFuaW0udG8gPSAtYW5pbS5mcm9tXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAc2NhbGUueSA9IGFuaW0uY3VycmVudFxyXG5cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCMgV2l0aCBBcmd1bWVudHNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRtb3ZlVG86IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRpZiBhbmltLmFyZz9cclxuXHRcdFx0XHRhbmltLmZyb20gPSBAcG9zaXRpb24ueFxyXG5cdFx0XHRcdGFuaW0udG8gPSBwYXJzZUZsb2F0IGFuaW0uYXJnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yICdhbmltYXRpb24gbW92ZVRvIG5lZWQgYW4gYXJndW1lbnQnXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAcG9zaXRpb24ueCA9IGFuaW0uY3VycmVudFxyXG5cclxuXHRtb3ZlQnk6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRpZiBhbmltLmFyZ3M/XHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHBvc2l0aW9uLnhcclxuXHRcdFx0XHRhbmltLnRvID0gQHBvc2l0aW9uLnggKyBwYXJzZUZsb2F0KGFuaW0uYXJncylcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgJ2FuaW1hdGlvbiBtb3ZlVG8gbmVlZCBhbiBhcmd1bWVudCdcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBwb3NpdGlvbi54ID0gYW5pbS5jdXJyZW50XHJcblxyXG5cdGRpc2NvbG9yOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRpbml0OiAoYW5pbSkgLT5cclxuXHRcdFx0ZGVzQ29sb3IgPSBhbmltLmFyZ1xyXG5cdFx0XHRkZXNDb2xvciA9IG5ldyBCdS5Db2xvciBkZXNDb2xvciBpZiBCdS5pc1N0cmluZyBkZXNDb2xvclxyXG5cdFx0XHRhbmltLmZyb20gPSBuZXcgQnUuQ29sb3IgQGZpbGxTdHlsZVxyXG5cdFx0XHRhbmltLnRvID0gZGVzQ29sb3JcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBmaWxsU3R5bGUgPSBhbmltLmN1cnJlbnQudG9SR0JBKClcclxuIiwiIyBSdW4gdGhlIGFuaW1hdGlvbiB0YXNrc1xyXG5cclxuY2xhc3MgQnUuQW5pbWF0aW9uUnVubmVyXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxyXG5cdFx0QHJ1bm5pbmdBbmltYXRpb25zID0gW11cclxuXHJcblx0YWRkOiAodGFzaykgLT5cclxuXHRcdHRhc2suaW5pdCgpXHJcblx0XHRpZiB0YXNrLmFuaW1hdGlvbi5pc0xlZ2FsKClcclxuXHRcdFx0dGFzay5zdGFydFRpbWUgPSBCdS5ub3coKVxyXG5cdFx0XHRAcnVubmluZ0FuaW1hdGlvbnMucHVzaCB0YXNrXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgJ0J1LkFuaW1hdGlvblJ1bm5lcjogYW5pbWF0aW9uIHNldHRpbmcgaXMgaWxsZWdhbDogJywgdGFzay5hbmltYXRpb25cclxuXHJcblx0dXBkYXRlOiAtPlxyXG5cdFx0bm93ID0gQnUubm93KClcclxuXHRcdGZvciB0YXNrIGluIEBydW5uaW5nQW5pbWF0aW9uc1xyXG5cdFx0XHRjb250aW51ZSBpZiB0YXNrLmZpbmlzaGVkXHJcblxyXG5cdFx0XHRhbmltID0gdGFzay5hbmltYXRpb25cclxuXHRcdFx0dCA9IChub3cgLSB0YXNrLnN0YXJ0VGltZSkgLyAoYW5pbS5kdXJhdGlvbiAqIDEwMDApXHJcblx0XHRcdGlmIHQgPiAxXHJcblx0XHRcdFx0ZmluaXNoID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIGFuaW0ucmVwZWF0XHJcblx0XHRcdFx0XHR0ID0gMFxyXG5cdFx0XHRcdFx0dGFzay5zdGFydFRpbWUgPSBCdS5ub3coKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMgVE9ETyByZW1vdmUgdGhlIGZpbmlzaGVkIHRhc2tzIG91dFxyXG5cdFx0XHRcdFx0dCA9IDFcclxuXHRcdFx0XHRcdHRhc2suZmluaXNoZWQgPSB5ZXNcclxuXHJcblx0XHRcdGlmIGFuaW0uZWFzaW5nID09IHRydWVcclxuXHRcdFx0XHR0ID0gZWFzaW5nRnVuY3Rpb25zW0RFRkFVTFRfRUFTSU5HX0ZVTkNUSU9OXSB0XHJcblx0XHRcdGVsc2UgaWYgZWFzaW5nRnVuY3Rpb25zW2FuaW0uZWFzaW5nXT9cclxuXHRcdFx0XHR0ID0gZWFzaW5nRnVuY3Rpb25zW2FuaW0uZWFzaW5nXSB0XHJcblxyXG5cdFx0XHR0YXNrLnQgPSB0XHJcblx0XHRcdHRhc2suaW50ZXJwb2xhdGUoKVxyXG5cclxuXHRcdFx0YW5pbS51cGRhdGUuY2FsbCB0YXNrLnRhcmdldCwgdGFza1xyXG5cdFx0XHRpZiBmaW5pc2ggdGhlbiBhbmltLmZpbmlzaD8uY2FsbCB0YXNrLnRhcmdldCwgdGFza1xyXG5cclxuXHQjIEhvb2sgdXAgb24gYW4gcmVuZGVyZXIsIHJlbW92ZSBvd24gc2V0SW50ZXJuYWxcclxuXHRob29rVXA6IChyZW5kZXJlcikgLT5cclxuXHRcdHJlbmRlcmVyLm9uICd1cGRhdGUnLCA9PiBAdXBkYXRlKClcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFByaXZhdGUgdmFyaWFibGVzXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0REVGQVVMVF9FQVNJTkdfRlVOQ1RJT04gPSAncXVhZCdcclxuXHRlYXNpbmdGdW5jdGlvbnMgPVxyXG5cdFx0cXVhZEluOiAodCkgLT4gdCAqIHRcclxuXHRcdHF1YWRPdXQ6ICh0KSAtPiB0ICogKDIgLSB0KVxyXG5cdFx0cXVhZDogKHQpIC0+XHJcblx0XHRcdGlmIHQgPCAwLjVcclxuXHRcdFx0XHQyICogdCAqIHRcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdC0yICogdCAqIHQgKyA0ICogdCAtIDFcclxuXHJcblx0XHRjdWJpY0luOiAodCkgLT4gdCAqKiAzXHJcblx0XHRjdWJpY091dDogKHQpIC0+ICh0IC0gMSkgKiogMyArIDFcclxuXHRcdGN1YmljOiAodCkgLT5cclxuXHRcdFx0aWYgdCA8IDAuNVxyXG5cdFx0XHRcdDQgKiB0ICoqIDNcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdDQgKiAodCAtIDEpICoqIDMgKyAxXHJcblxyXG5cdFx0c2luZUluOiAodCkgLT4gTWF0aC5zaW4oKHQgLSAxKSAqIEJ1LkhBTEZfUEkpICsgMVxyXG5cdFx0c2luZU91dDogKHQpIC0+IE1hdGguc2luIHQgKiBCdS5IQUxGX1BJXHJcblx0XHRzaW5lOiAodCkgLT5cclxuXHRcdFx0aWYgdCA8IDAuNVxyXG5cdFx0XHRcdChNYXRoLnNpbigodCAqIDIgLSAxKSAqIEJ1LkhBTEZfUEkpICsgMSkgLyAyXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRNYXRoLnNpbigodCAtIDAuNSkgKiBNYXRoLlBJKSAvIDIgKyAwLjVcclxuXHJcblx0XHQjIFRPRE8gYWRkIHF1YXJ0LCBxdWludCwgZXhwbywgY2lyYywgYmFjaywgZWxhc3RpYywgYm91bmNlXHJcblxyXG4jIERlZmluZSB0aGUgZ2xvYmFsIHVuaXF1ZSBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzXHJcbkJ1LmFuaW1hdGlvblJ1bm5lciA9IG5ldyBCdS5BbmltYXRpb25SdW5uZXJcclxuIiwiIyBBbmltYXRpb25UYXNrIGlzIGFuIGluc3RhbmNlIG9mIEFuaW1hdGlvbiwgcnVuIGJ5IEFuaW1hdGlvblJ1bm5lclxuXG5jbGFzcyBCdS5BbmltYXRpb25UYXNrXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBhbmltYXRpb24sIEB0YXJnZXQsIEBhcmdzID0gW10pIC0+XG4gICAgICAgIEBzdGFydFRpbWUgPSAwXG4gICAgICAgIEBmaW5pc2hlZCA9IG5vXG4gICAgICAgIEBmcm9tID0gQnUuY2xvbmUgQGFuaW1hdGlvbi5mcm9tXG4gICAgICAgIEBjdXJyZW50ID0gQnUuY2xvbmUgQGFuaW1hdGlvbi5mcm9tXG4gICAgICAgIEB0byA9IEJ1LmNsb25lIEBhbmltYXRpb24udG9cbiAgICAgICAgQGRhdGEgPSB7fVxuICAgICAgICBAdCA9IDBcbiAgICAgICAgQGFyZyA9IEBhcmdzWzBdXG5cbiAgICBpbml0OiAtPlxuICAgICAgICBAYW5pbWF0aW9uLmluaXQ/LmNhbGwgQHRhcmdldCwgQFxuICAgICAgICBAY3VycmVudCA9IEJ1LmNsb25lIEBmcm9tXG5cbiAgICBpbnRlcnBvbGF0ZTogLT5cbiAgICAgICAgaWYgQnUuaXNOdW1iZXIgQGZyb21cbiAgICAgICAgICAgIEBjdXJyZW50ID0gaW50ZXJwb2xhdGVOdW0gQGZyb20sIEB0bywgQHRcbiAgICAgICAgZWxzZSBpZiBAZnJvbSBpbnN0YW5jZW9mIEJ1LkNvbG9yXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZU9iamVjdCBAZnJvbSwgQHRvLCBAdCwgQGN1cnJlbnRcbiAgICAgICAgZWxzZSBpZiBCdS5pc1BsYWluT2JqZWN0IEBmcm9tXG4gICAgICAgICAgICBmb3Igb3duIGtleSBvZiBAZnJvbVxuICAgICAgICAgICAgICAgIGlmIEJ1LmlzTnVtYmVyIEBmcm9tW2tleV1cbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRba2V5XSA9IGludGVycG9sYXRlTnVtIEBmcm9tW2tleV0sIEB0b1trZXldLCBAdFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVPYmplY3QgQGZyb21ba2V5XSwgQHRvW2tleV0sIEB0LCBAY3VycmVudFtrZXldXG5cbiAgICBpbnRlcnBvbGF0ZU51bSA9IChhLCBiLCB0KSAtPiBiICogdCAtIGEgKiAodCAtIDEpXG5cbiAgICBpbnRlcnBvbGF0ZU9iamVjdCA9IChhLCBiLCB0LCBjKSAtPlxuICAgICAgICBpZiBhIGluc3RhbmNlb2YgQnUuQ29sb3JcbiAgICAgICAgICAgIGMuc2V0UkdCQSBpbnRlcnBvbGF0ZU51bShhLnIsIGIuciwgdCksIGludGVycG9sYXRlTnVtKGEuZywgYi5nLCB0KSwgaW50ZXJwb2xhdGVOdW0oYS5iLCBiLmIsIHQpLCBpbnRlcnBvbGF0ZU51bShhLmEsIGIuYSwgdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvciBcIkFuaW1hdGlvblRhc2suaW50ZXJwb2xhdGVPYmplY3QoKSBkb2Vzbid0IHN1cHBvcnQgb2JqZWN0IHR5cGU6IFwiLCBhXG4iLCIjIE1hbmFnZSBhbiBPYmplY3QyRCBsaXN0IGFuZCB1cGRhdGUgaXRzIGRhc2hPZmZzZXRcclxuXHJcbmNsYXNzIEJ1LkRhc2hGbG93TWFuYWdlclxyXG5cclxuXHRjb25zdHJ1Y3RvcjogLT5cclxuXHRcdEBmbG93aW5nT2JqZWN0cyA9IFtdXHJcblxyXG5cdHNldFNwZWVkOiAodGFyZ2V0LCBzcGVlZCkgLT5cclxuXHRcdHRhcmdldC5kYXNoRmxvd1NwZWVkID0gc3BlZWRcclxuXHRcdGkgPSBAZmxvd2luZ09iamVjdHMuaW5kZXhPZiB0YXJnZXRcclxuXHRcdGlmIHNwZWVkICE9IDBcclxuXHRcdFx0QGZsb3dpbmdPYmplY3RzLnB1c2ggdGFyZ2V0IGlmIGkgPT0gLTFcclxuXHRcdGVsc2VcclxuXHRcdFx0QGZsb3dpbmdPYmplY3RzLnNwbGljZShpLCAxKSBpZiBpID4gLTFcclxuXHJcblx0dXBkYXRlOiAtPlxyXG5cdFx0Zm9yIG8gaW4gQGZsb3dpbmdPYmplY3RzXHJcblx0XHRcdG8uZGFzaE9mZnNldCArPSBvLmRhc2hGbG93U3BlZWRcclxuXHJcblx0IyBIb29rIHVwIG9uIGFuIHJlbmRlcmVyLCByZW1vdmUgb3duIHNldEludGVybmFsXHJcblx0aG9va1VwOiAocmVuZGVyZXIpIC0+XHJcblx0XHRyZW5kZXJlci5vbiAndXBkYXRlJywgPT4gQHVwZGF0ZSgpXHJcblxyXG4jIEdsb2JhbCB1bmlxdWUgaW5zdGFuY2VcclxuQnUuZGFzaEZsb3dNYW5hZ2VyID0gbmV3IEJ1LkRhc2hGbG93TWFuYWdlclxyXG4iLCIjIFNwcml0ZSBTaGVldFxyXG5cclxuY2xhc3MgQnUuU3ByaXRlU2hlZXRcclxuXHJcblx0Y29uc3RydWN0b3I6IChAdXJsKSAtPlxyXG5cdFx0QnUuRXZlbnQuYXBwbHkgQFxyXG5cclxuXHRcdEByZWFkeSA9IG5vICAjIElmIHRoaXMgc3ByaXRlIHNoZWV0IGlzIGxvYWRlZCBhbmQgcGFyc2VkLlxyXG5cdFx0QGhlaWdodCA9IDAgICMgSGVpZ2h0IG9mIHRoaXMgc3ByaXRlXHJcblxyXG5cdFx0QGRhdGEgPSBudWxsICAjIFRoZSBKU09OIGRhdGFcclxuXHRcdEBpbWFnZXMgPSBbXSAgIyBUaGUgYEltYWdlYCBsaXN0IGxvYWRlZFxyXG5cdFx0QGZyYW1lSW1hZ2VzID0gW10gICMgUGFyc2VkIGZyYW1lIGltYWdlc1xyXG5cclxuXHRcdCMgbG9hZCBhbmQgdHJpZ2dlciBwYXJzZURhdGEoKVxyXG5cdFx0JC5hamF4IEB1cmwsIHN1Y2Nlc3M6ICh0ZXh0KSA9PlxyXG5cdFx0XHRAZGF0YSA9IEpTT04ucGFyc2UgdGV4dFxyXG5cclxuXHRcdFx0aWYgbm90IEBkYXRhLmltYWdlcz9cclxuXHRcdFx0XHRAZGF0YS5pbWFnZXMgPSBbQHVybC5zdWJzdHJpbmcoQHVybC5sYXN0SW5kZXhPZignLycpLCBAdXJsLmxlbmd0aCAtIDUpICsgJy5wbmcnXVxyXG5cclxuXHRcdFx0YmFzZVVybCA9IEB1cmwuc3Vic3RyaW5nIDAsIEB1cmwubGFzdEluZGV4T2YoJy8nKSArIDFcclxuXHRcdFx0Zm9yIG93biBpIG9mIEBkYXRhLmltYWdlc1xyXG5cdFx0XHRcdEBkYXRhLmltYWdlc1tpXSA9IGJhc2VVcmwgKyBAZGF0YS5pbWFnZXNbaV1cclxuXHJcblx0XHRcdFx0Y291bnRMb2FkZWQgPSAwXHJcblx0XHRcdFx0QGltYWdlc1tpXSA9IG5ldyBJbWFnZVxyXG5cdFx0XHRcdEBpbWFnZXNbaV0ub25sb2FkID0gKCkgPT5cclxuXHRcdFx0XHRcdGNvdW50TG9hZGVkICs9IDFcclxuXHRcdFx0XHRcdEBwYXJzZURhdGEoKSBpZiBjb3VudExvYWRlZCA9PSBAZGF0YS5pbWFnZXMubGVuZ3RoXHJcblx0XHRcdFx0QGltYWdlc1tpXS5zcmMgPSBAZGF0YS5pbWFnZXNbaV1cclxuXHJcblx0cGFyc2VEYXRhOiAtPlxyXG5cdFx0IyBDbGlwIHRoZSBpbWFnZSBmb3IgZXZlcnkgZnJhbWVzXHJcblx0XHRmcmFtZXMgPSBAZGF0YS5mcmFtZXNcclxuXHRcdGZvciBvd24gaSBvZiBmcmFtZXNcclxuXHRcdFx0Zm9yIGogaW4gWzAuLjRdXHJcblx0XHRcdFx0aWYgbm90IGZyYW1lc1tpXVtqXT9cclxuXHRcdFx0XHRcdGZyYW1lc1tpXVtqXSA9IGlmIGZyYW1lc1tpIC0gMV0/W2pdPyB0aGVuIGZyYW1lc1tpIC0gMV1bal0gZWxzZSAwXHJcblx0XHRcdHggPSBmcmFtZXNbaV1bMF1cclxuXHRcdFx0eSA9IGZyYW1lc1tpXVsxXVxyXG5cdFx0XHR3ID0gZnJhbWVzW2ldWzJdXHJcblx0XHRcdGggPSBmcmFtZXNbaV1bM11cclxuXHRcdFx0ZnJhbWVJbmRleCA9IGZyYW1lc1tpXVs0XVxyXG5cdFx0XHRAZnJhbWVJbWFnZXNbaV0gPSBjbGlwSW1hZ2UgQGltYWdlc1tmcmFtZUluZGV4XSwgeCwgeSwgdywgaFxyXG5cdFx0XHRAaGVpZ2h0ID0gaCBpZiBAaGVpZ2h0ID09IDBcclxuXHJcblx0XHRAcmVhZHkgPSB5ZXNcclxuXHRcdEB0cmlnZ2VyICdsb2FkZWQnXHJcblxyXG5cdGdldEZyYW1lSW1hZ2U6IChrZXksIGluZGV4ID0gMCkgLT5cclxuXHRcdHJldHVybiBudWxsIHVubGVzcyBAcmVhZHlcclxuXHRcdGFuaW1hdGlvbiA9IEBkYXRhLmFuaW1hdGlvbnNba2V5XVxyXG5cdFx0cmV0dXJuIG51bGwgdW5sZXNzIGFuaW1hdGlvbj9cclxuXHJcblx0XHRyZXR1cm4gQGZyYW1lSW1hZ2VzW2FuaW1hdGlvbi5mcmFtZXNbaW5kZXhdXVxyXG5cclxuXHRtZWFzdXJlVGV4dFdpZHRoOiAodGV4dCkgLT5cclxuXHRcdHdpZHRoID0gMFxyXG5cdFx0Zm9yIGNoYXIgaW4gdGV4dFxyXG5cdFx0XHR3aWR0aCArPSBAZ2V0RnJhbWVJbWFnZShjaGFyKS53aWR0aFxyXG5cdFx0d2lkdGhcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFByaXZhdGUgbWVtYmVyc1xyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcclxuXHRjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQgJzJkJ1xyXG5cclxuXHRjbGlwSW1hZ2UgPSAoaW1hZ2UsIHgsIHksIHcsIGgpIC0+XHJcblx0XHRjYW52YXMud2lkdGggPSB3XHJcblx0XHRjYW52YXMuaGVpZ2h0ID0gaFxyXG5cdFx0Y29udGV4dC5kcmF3SW1hZ2UgaW1hZ2UsIHgsIHksIHcsIGgsIDAsIDAsIHcsIGhcclxuXHJcblx0XHRuZXdJbWFnZSA9IG5ldyBJbWFnZSgpXHJcblx0XHRuZXdJbWFnZS5zcmMgPSBjYW52YXMudG9EYXRhVVJMKClcclxuXHRcdHJldHVybiBuZXdJbWFnZVxyXG4iLCIjIEdlb21ldHJ5IEFsZ29yaXRobSBDb2xsZWN0aW9uXHJcblxyXG5CdS5nZW9tZXRyeUFsZ29yaXRobSA9IEcgPVxyXG5cclxuXHRpbmplY3Q6IC0+XHJcblx0XHRAaW5qZWN0SW50byBbXHJcblx0XHRcdCdwb2ludCdcclxuXHRcdFx0J2xpbmUnXHJcblx0XHRcdCdjaXJjbGUnXHJcblx0XHRcdCdlbGxpcHNlJ1xyXG5cdFx0XHQndHJpYW5nbGUnXHJcblx0XHRcdCdyZWN0YW5nbGUnXHJcblx0XHRcdCdmYW4nXHJcblx0XHRcdCdib3cnXHJcblx0XHRcdCdwb2x5Z29uJ1xyXG5cdFx0XHQncG9seWxpbmUnXHJcblx0XHRdXHJcblxyXG5cdGluamVjdEludG86IChzaGFwZXMpIC0+XHJcblx0XHRzaGFwZXMgPSBbc2hhcGVzXSBpZiBCdS5pc1N0cmluZyBzaGFwZXNcclxuXHJcblx0XHRpZiAncG9pbnQnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5Qb2ludDo6aW5DaXJjbGUgPSAoY2lyY2xlKSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkNpcmNsZSBALCBjaXJjbGVcclxuXHRcdFx0QnUuUG9pbnQ6OmRpc3RhbmNlVG8gPSAocG9pbnQpIC0+XHJcblx0XHRcdFx0Ry5kaXN0YW5jZUZyb21Qb2ludFRvUG9pbnQgQCwgcG9pbnRcclxuXHRcdFx0QnUuUG9pbnQ6OmlzTmVhciA9ICh0YXJnZXQsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHRcdFx0c3dpdGNoIHRhcmdldC50eXBlXHJcblx0XHRcdFx0XHR3aGVuICdQb2ludCdcclxuXHRcdFx0XHRcdFx0Ry5wb2ludE5lYXJQb2ludCBALCB0YXJnZXQsIGxpbWl0XHJcblx0XHRcdFx0XHR3aGVuICdMaW5lJ1xyXG5cdFx0XHRcdFx0XHRHLnBvaW50TmVhckxpbmUgQCwgdGFyZ2V0LCBsaW1pdFxyXG5cdFx0XHRcdFx0d2hlbiAnUG9seWxpbmUnXHJcblx0XHRcdFx0XHRcdEcucG9pbnROZWFyUG9seWxpbmUgQCwgdGFyZ2V0LCBsaW1pdFxyXG5cdFx0XHRCdS5Qb2ludC5pbnRlcnBvbGF0ZSA9IEcuaW50ZXJwb2xhdGVCZXR3ZWVuVHdvUG9pbnRzXHJcblxyXG5cdFx0aWYgJ2xpbmUnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5MaW5lOjpkaXN0YW5jZVRvID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcuZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUgcG9pbnQsIEBcclxuXHRcdFx0QnUuTGluZTo6aXNUd29Qb2ludHNTYW1lU2lkZSA9IChwMSwgcDIpIC0+XHJcblx0XHRcdFx0Ry50d29Qb2ludHNTYW1lU2lkZU9mTGluZSBwMSwgcDIsIEBcclxuXHRcdFx0QnUuTGluZTo6Zm9vdFBvaW50RnJvbSA9IChwb2ludCwgc2F2ZVRvKSAtPlxyXG5cdFx0XHRcdEcuZm9vdFBvaW50RnJvbVBvaW50VG9MaW5lIHBvaW50LCBALCBzYXZlVG9cclxuXHRcdFx0QnUuTGluZTo6Z2V0Q3Jvc3NQb2ludFdpdGggPSAobGluZSkgLT5cclxuXHRcdFx0XHRHLmdldENyb3NzUG9pbnRPZlR3b0xpbmVzIGxpbmUsIEBcclxuXHRcdFx0QnUuTGluZTo6aXNDcm9zc1dpdGhMaW5lID0gKGxpbmUpIC0+XHJcblx0XHRcdFx0Ry5pc1R3b0xpbmVzQ3Jvc3MgbGluZSwgQFxyXG5cclxuXHRcdGlmICdjaXJjbGUnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5DaXJjbGU6Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkNpcmNsZSBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdlbGxpcHNlJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuRWxsaXBzZTo6X2NvbnRhaW5zUG9pbnQgPSAocG9pbnQpIC0+XHJcblx0XHRcdFx0Ry5wb2ludEluRWxsaXBzZSBwb2ludCwgQFxyXG5cclxuXHRcdGlmICd0cmlhbmdsZScgaW4gc2hhcGVzXHJcblx0XHRcdEJ1LlRyaWFuZ2xlOjpfY29udGFpbnNQb2ludCA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5UcmlhbmdsZSBwb2ludCwgQFxyXG5cdFx0XHRCdS5UcmlhbmdsZTo6YXJlYSA9IC0+XHJcblx0XHRcdFx0Ry5jYWxjVHJpYW5nbGVBcmVhIEBcclxuXHJcblx0XHRpZiAncmVjdGFuZ2xlJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuUmVjdGFuZ2xlOjpjb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJblJlY3RhbmdsZSBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdmYW4nIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5GYW46Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkZhbiBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdib3cnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5Cb3c6Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkJvdyBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdwb2x5Z29uJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuUG9seWdvbjo6X2NvbnRhaW5zUG9pbnQgPSAocG9pbnQpIC0+XHJcblx0XHRcdFx0Ry5wb2ludEluUG9seWdvbiBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdwb2x5bGluZScgaW4gc2hhcGVzXHJcblx0XHRcdEJ1LlBvbHlsaW5lOjpsZW5ndGggPSAwXHJcblx0XHRcdEJ1LlBvbHlsaW5lOjpwb2ludE5vcm1hbGl6ZWRQb3MgPSBbXVxyXG5cdFx0XHRCdS5Qb2x5bGluZTo6Y2FsY0xlbmd0aCA9ICgpIC0+XHJcblx0XHRcdFx0QGxlbmd0aCA9IEcuY2FsY1BvbHlsaW5lTGVuZ3RoIEBcclxuXHRcdFx0QnUuUG9seWxpbmU6OmNhbGNQb2ludE5vcm1hbGl6ZWRQb3MgPSAtPlxyXG5cdFx0XHRcdEcuY2FsY05vcm1hbGl6ZWRWZXJ0aWNlc1Bvc09mUG9seWxpbmUgQFxyXG5cdFx0XHRCdS5Qb2x5bGluZTo6Z2V0Tm9ybWFsaXplZFBvcyA9IChpbmRleCkgLT5cclxuXHRcdFx0XHRpZiBpbmRleD8gdGhlbiBAcG9pbnROb3JtYWxpemVkUG9zW2luZGV4XSBlbHNlIEBwb2ludE5vcm1hbGl6ZWRQb3NcclxuXHRcdFx0QnUuUG9seWxpbmU6OmNvbXByZXNzID0gKHN0cmVuZ3RoID0gMC44KSAtPlxyXG5cdFx0XHRcdEcuY29tcHJlc3NQb2x5bGluZSBALCBzdHJlbmd0aFxyXG5cclxuXHQjIFBvaW50IGluIHNoYXBlc1xyXG5cclxuXHRwb2ludE5lYXJQb2ludDogKHBvaW50LCB0YXJnZXQsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHRwb2ludC5kaXN0YW5jZVRvKHRhcmdldCkgPCBsaW1pdFxyXG5cclxuXHRwb2ludE5lYXJMaW5lOiAocG9pbnQsIGxpbmUsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHR2ZXJ0aWNhbERpc3QgPSBsaW5lLmRpc3RhbmNlVG8gcG9pbnRcclxuXHRcdGZvb3RQb2ludCA9IGxpbmUuZm9vdFBvaW50RnJvbSBwb2ludFxyXG5cclxuXHRcdGlzQmV0d2VlbjEgPSBmb290UG9pbnQuZGlzdGFuY2VUbyhsaW5lLnBvaW50c1swXSkgPCBsaW5lLmxlbmd0aCArIGxpbWl0XHJcblx0XHRpc0JldHdlZW4yID0gZm9vdFBvaW50LmRpc3RhbmNlVG8obGluZS5wb2ludHNbMV0pIDwgbGluZS5sZW5ndGggKyBsaW1pdFxyXG5cclxuXHRcdHJldHVybiB2ZXJ0aWNhbERpc3QgPCBsaW1pdCBhbmQgaXNCZXR3ZWVuMSBhbmQgaXNCZXR3ZWVuMlxyXG5cclxuXHRwb2ludE5lYXJQb2x5bGluZTogKHBvaW50LCBwb2x5bGluZSwgbGltaXQgPSBCdS5ERUZBVUxUX05FQVJfRElTVCkgLT5cclxuXHRcdGZvciBsaW5lIGluIHBvbHlsaW5lLmxpbmVzXHJcblx0XHRcdHJldHVybiB5ZXMgaWYgRy5wb2ludE5lYXJMaW5lIHBvaW50LCBsaW5lLCBsaW1pdFxyXG5cdFx0bm9cclxuXHJcblx0cG9pbnRJbkNpcmNsZTogKHBvaW50LCBjaXJjbGUpIC0+XHJcblx0XHRkeCA9IHBvaW50LnggLSBjaXJjbGUuY3hcclxuXHRcdGR5ID0gcG9pbnQueSAtIGNpcmNsZS5jeVxyXG5cdFx0cmV0dXJuIEJ1LmJldmVsKGR4LCBkeSkgPCBjaXJjbGUucmFkaXVzXHJcblxyXG5cdHBvaW50SW5FbGxpcHNlOiAocG9pbnQsIGVsbGlwc2UpIC0+XHJcblx0XHRyZXR1cm4gQnUuYmV2ZWwocG9pbnQueCAvIGVsbGlwc2UucmFkaXVzWCwgcG9pbnQueSAvIGVsbGlwc2UucmFkaXVzWSkgPCAxXHJcblxyXG5cdHBvaW50SW5SZWN0YW5nbGU6IChwb2ludCwgcmVjdGFuZ2xlKSAtPlxyXG5cdFx0cG9pbnQueCA+IHJlY3RhbmdsZS5wb2ludExULnggYW5kXHJcblx0XHRcdFx0cG9pbnQueSA+IHJlY3RhbmdsZS5wb2ludExULnkgYW5kXHJcblx0XHRcdFx0cG9pbnQueCA8IHJlY3RhbmdsZS5wb2ludExULnggKyByZWN0YW5nbGUuc2l6ZS53aWR0aCBhbmRcclxuXHRcdFx0XHRwb2ludC55IDwgcmVjdGFuZ2xlLnBvaW50TFQueSArIHJlY3RhbmdsZS5zaXplLmhlaWdodFxyXG5cclxuXHRwb2ludEluVHJpYW5nbGU6IChwb2ludCwgdHJpYW5nbGUpIC0+XHJcblx0XHRHLnR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lKHBvaW50LCB0cmlhbmdsZS5wb2ludHNbMl0sIHRyaWFuZ2xlLmxpbmVzWzBdKSBhbmRcclxuXHRcdFx0XHRHLnR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lKHBvaW50LCB0cmlhbmdsZS5wb2ludHNbMF0sIHRyaWFuZ2xlLmxpbmVzWzFdKSBhbmRcclxuXHRcdFx0XHRHLnR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lKHBvaW50LCB0cmlhbmdsZS5wb2ludHNbMV0sIHRyaWFuZ2xlLmxpbmVzWzJdKVxyXG5cclxuXHRwb2ludEluRmFuOiAocG9pbnQsIGZhbikgLT5cclxuXHRcdGR4ID0gcG9pbnQueCAtIGZhbi5jeFxyXG5cdFx0ZHkgPSBwb2ludC55IC0gZmFuLmN5XHJcblx0XHRhID0gTWF0aC5hdGFuMihwb2ludC55IC0gZmFuLmN5LCBwb2ludC54IC0gZmFuLmN4KVxyXG5cdFx0YSArPSBCdS5UV09fUEkgd2hpbGUgYSA8IGZhbi5hRnJvbVxyXG5cdFx0cmV0dXJuIEJ1LmJldmVsKGR4LCBkeSkgPCBmYW4ucmFkaXVzICYmIGEgPiBmYW4uYUZyb20gJiYgYSA8IGZhbi5hVG9cclxuXHJcblx0cG9pbnRJbkJvdzogKHBvaW50LCBib3cpIC0+XHJcblx0XHRpZiBCdS5iZXZlbChib3cuY3ggLSBwb2ludC54LCBib3cuY3kgLSBwb2ludC55KSA8IGJvdy5yYWRpdXNcclxuXHRcdFx0c2FtZVNpZGUgPSBib3cuc3RyaW5nLmlzVHdvUG9pbnRzU2FtZVNpZGUoYm93LmNlbnRlciwgcG9pbnQpXHJcblx0XHRcdHNtYWxsVGhhbkhhbGZDaXJjbGUgPSBib3cuYVRvIC0gYm93LmFGcm9tIDwgTWF0aC5QSVxyXG5cdFx0XHRyZXR1cm4gc2FtZVNpZGUgXiBzbWFsbFRoYW5IYWxmQ2lyY2xlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRwb2ludEluUG9seWdvbjogKHBvaW50LCBwb2x5Z29uKSAtPlxyXG5cdFx0Zm9yIHRyaWFuZ2xlIGluIHBvbHlnb24udHJpYW5nbGVzXHJcblx0XHRcdGlmIHRyaWFuZ2xlLmNvbnRhaW5zUG9pbnQgcG9pbnRcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0ZmFsc2VcclxuXHJcblx0IyBEaXN0YW5jZVxyXG5cclxuXHRkaXN0YW5jZUZyb21Qb2ludFRvUG9pbnQ6IChwb2ludDEsIHBvaW50MikgLT5cclxuXHRcdEJ1LmJldmVsIHBvaW50MS54IC0gcG9pbnQyLngsIHBvaW50MS55IC0gcG9pbnQyLnlcclxuXHJcblx0ZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmU6IChwb2ludCwgbGluZSkgLT5cclxuXHRcdHAxID0gbGluZS5wb2ludHNbMF1cclxuXHRcdHAyID0gbGluZS5wb2ludHNbMV1cclxuXHRcdGEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KVxyXG5cdFx0YiA9IHAxLnkgLSBhICogcDEueFxyXG5cdFx0cmV0dXJuIE1hdGguYWJzKGEgKiBwb2ludC54ICsgYiAtIHBvaW50LnkpIC8gTWF0aC5zcXJ0KGEgKiBhICsgMSlcclxuXHJcblx0IyBQb2ludCBSZWxhdGVkXHJcblxyXG5cdGludGVycG9sYXRlQmV0d2VlblR3b1BvaW50czogKHAxLCBwMiwgaywgcDMpIC0+XHJcblx0XHR4ID0gcDEueCArIChwMi54IC0gcDEueCkgKiBrXHJcblx0XHR5ID0gcDEueSArIChwMi55IC0gcDEueSkgKiBrXHJcblxyXG5cdFx0aWYgcDM/XHJcblx0XHRcdHAzLnNldCB4LCB5XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBuZXcgQnUuUG9pbnQgeCwgeVxyXG5cclxuXHQjIFBvaW50IGFuZCBMaW5lXHJcblxyXG5cdHR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lOiAocDEsIHAyLCBsaW5lKSAtPlxyXG5cdFx0cEEgPSBsaW5lLnBvaW50c1swXVxyXG5cdFx0cEIgPSBsaW5lLnBvaW50c1sxXVxyXG5cdFx0aWYgcEEueCA9PSBwQi54XHJcblx0XHRcdCMgaWYgYm90aCBvZiB0aGUgdHdvIHBvaW50cyBhcmUgb24gdGhlIGxpbmUgdGhlbiB3ZSBjb25zaWRlciB0aGV5IGFyZSBpbiB0aGUgc2FtZSBzaWRlXHJcblx0XHRcdHJldHVybiAocDEueCAtIHBBLngpICogKHAyLnggLSBwQS54KSA+IDBcclxuXHRcdGVsc2VcclxuXHRcdFx0eTAxID0gKHBBLnkgLSBwQi55KSAqIChwMS54IC0gcEEueCkgLyAocEEueCAtIHBCLngpICsgcEEueVxyXG5cdFx0XHR5MDIgPSAocEEueSAtIHBCLnkpICogKHAyLnggLSBwQS54KSAvIChwQS54IC0gcEIueCkgKyBwQS55XHJcblx0XHRcdHJldHVybiAocDEueSAtIHkwMSkgKiAocDIueSAtIHkwMikgPiAwXHJcblxyXG5cdGZvb3RQb2ludEZyb21Qb2ludFRvTGluZTogKHBvaW50LCBsaW5lLCBzYXZlVG8gPSBuZXcgQnUuUG9pbnQpIC0+XHJcblx0XHRwMSA9IGxpbmUucG9pbnRzWzBdXHJcblx0XHRwMiA9IGxpbmUucG9pbnRzWzFdXHJcblx0XHRBID0gKHAxLnkgLSBwMi55KSAvIChwMS54IC0gcDIueClcclxuXHRcdEIgPSBwMS55IC0gQSAqIHAxLnhcclxuXHRcdG0gPSBwb2ludC54ICsgQSAqIHBvaW50LnlcclxuXHRcdHggPSAobSAtIEEgKiBCKSAvIChBICogQSArIDEpXHJcblx0XHR5ID0gQSAqIHggKyBCXHJcblxyXG5cdFx0c2F2ZVRvLnNldCB4LCB5XHJcblx0XHRyZXR1cm4gc2F2ZVRvXHJcblxyXG5cdGdldENyb3NzUG9pbnRPZlR3b0xpbmVzOiAobGluZTEsIGxpbmUyKSAtPlxyXG5cdFx0W3AxLCBwMl0gPSBsaW5lMS5wb2ludHNcclxuXHRcdFtxMSwgcTJdID0gbGluZTIucG9pbnRzXHJcblxyXG5cdFx0YTEgPSBwMi55IC0gcDEueVxyXG5cdFx0YjEgPSBwMS54IC0gcDIueFxyXG5cdFx0YzEgPSAoYTEgKiBwMS54KSArIChiMSAqIHAxLnkpXHJcblx0XHRhMiA9IHEyLnkgLSBxMS55XHJcblx0XHRiMiA9IHExLnggLSBxMi54XHJcblx0XHRjMiA9IChhMiAqIHExLngpICsgKGIyICogcTEueSlcclxuXHRcdGRldCA9IChhMSAqIGIyKSAtIChhMiAqIGIxKVxyXG5cclxuXHRcdHJldHVybiBuZXcgQnUuUG9pbnQgKChiMiAqIGMxKSAtIChiMSAqIGMyKSkgLyBkZXQsICgoYTEgKiBjMikgLSAoYTIgKiBjMSkpIC8gZGV0XHJcblxyXG5cdGlzVHdvTGluZXNDcm9zczogKGxpbmUxLCBsaW5lMikgLT5cclxuXHRcdHgxID0gbGluZTEucG9pbnRzWzBdLnhcclxuXHRcdHkxID0gbGluZTEucG9pbnRzWzBdLnlcclxuXHRcdHgyID0gbGluZTEucG9pbnRzWzFdLnhcclxuXHRcdHkyID0gbGluZTEucG9pbnRzWzFdLnlcclxuXHRcdHgzID0gbGluZTIucG9pbnRzWzBdLnhcclxuXHRcdHkzID0gbGluZTIucG9pbnRzWzBdLnlcclxuXHRcdHg0ID0gbGluZTIucG9pbnRzWzFdLnhcclxuXHRcdHk0ID0gbGluZTIucG9pbnRzWzFdLnlcclxuXHJcblx0XHRkID0gKHkyIC0geTEpICogKHg0IC0geDMpIC0gKHk0IC0geTMpICogKHgyIC0geDEpXHJcblxyXG5cdFx0aWYgZCA9PSAwXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR4MCA9ICgoeDIgLSB4MSkgKiAoeDQgLSB4MykgKiAoeTMgLSB5MSkgKyAoeTIgLSB5MSkgKiAoeDQgLSB4MykgKiB4MSAtICh5NCAtIHkzKSAqICh4MiAtIHgxKSAqIHgzKSAvIGRcclxuXHRcdFx0eTAgPSAoKHkyIC0geTEpICogKHk0IC0geTMpICogKHgzIC0geDEpICsgKHgyIC0geDEpICogKHk0IC0geTMpICogeTEgLSAoeDQgLSB4MykgKiAoeTIgLSB5MSkgKiB5MykgLyAtZFxyXG5cdFx0cmV0dXJuICh4MCAtIHgxKSAqICh4MCAtIHgyKSA8IDAgYW5kXHJcblx0XHRcdFx0XHRcdCh4MCAtIHgzKSAqICh4MCAtIHg0KSA8IDAgYW5kXHJcblx0XHRcdFx0XHRcdCh5MCAtIHkxKSAqICh5MCAtIHkyKSA8IDAgYW5kXHJcblx0XHRcdFx0XHRcdCh5MCAtIHkzKSAqICh5MCAtIHk0KSA8IDBcclxuXHJcblx0IyBQb2x5bGluZVxyXG5cclxuXHRjYWxjUG9seWxpbmVMZW5ndGg6IChwb2x5bGluZSkgLT5cclxuXHRcdGxlbiA9IDBcclxuXHRcdGlmIHBvbHlsaW5lLnZlcnRpY2VzLmxlbmd0aCA+PSAyXHJcblx0XHRcdGZvciBpIGluIFsxIC4uLiBwb2x5bGluZS52ZXJ0aWNlcy5sZW5ndGhdXHJcblx0XHRcdFx0bGVuICs9IHBvbHlsaW5lLnZlcnRpY2VzW2ldLmRpc3RhbmNlVG8gcG9seWxpbmUudmVydGljZXNbaSAtIDFdXHJcblx0XHRyZXR1cm4gbGVuXHJcblxyXG5cdGNhbGNOb3JtYWxpemVkVmVydGljZXNQb3NPZlBvbHlsaW5lOiAocG9seWxpbmUpIC0+XHJcblx0XHRjdXJyUG9zID0gMFxyXG5cdFx0cG9seWxpbmUucG9pbnROb3JtYWxpemVkUG9zWzBdID0gMFxyXG5cdFx0Zm9yIGkgaW4gWzEgLi4uIHBvbHlsaW5lLnZlcnRpY2VzLmxlbmd0aF1cclxuXHRcdFx0Y3VyclBvcyArPSBwb2x5bGluZS52ZXJ0aWNlc1tpXS5kaXN0YW5jZVRvKHBvbHlsaW5lLnZlcnRpY2VzW2kgLSAxXSkgLyBwb2x5bGluZS5sZW5ndGhcclxuXHRcdFx0cG9seWxpbmUucG9pbnROb3JtYWxpemVkUG9zW2ldID0gY3VyclBvc1xyXG5cclxuXHRjb21wcmVzc1BvbHlsaW5lOiAocG9seWxpbmUsIHN0cmVuZ3RoKSAtPlxyXG5cdFx0Y29tcHJlc3NlZCA9IFtdXHJcblx0XHRmb3Igb3duIGkgb2YgcG9seWxpbmUudmVydGljZXNcclxuXHRcdFx0aWYgaSA8IDJcclxuXHRcdFx0XHRjb21wcmVzc2VkW2ldID0gcG9seWxpbmUudmVydGljZXNbaV1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFtwQSwgcE1dID0gY29tcHJlc3NlZFstMi4uLTFdXHJcblx0XHRcdFx0cEIgPSBwb2x5bGluZS52ZXJ0aWNlc1tpXVxyXG5cdFx0XHRcdG9ibGlxdWVBbmdsZSA9IE1hdGguYWJzKE1hdGguYXRhbjIocEEueSAtIHBNLnksIHBBLnggLSBwTS54KSAtIE1hdGguYXRhbjIocE0ueSAtIHBCLnksIHBNLnggLSBwQi54KSlcclxuXHRcdFx0XHRpZiBvYmxpcXVlQW5nbGUgPCBzdHJlbmd0aCAqIHN0cmVuZ3RoICogQnUuSEFMRl9QSVxyXG5cdFx0XHRcdFx0Y29tcHJlc3NlZFtjb21wcmVzc2VkLmxlbmd0aCAtIDFdID0gcEJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjb21wcmVzc2VkLnB1c2ggcEJcclxuXHRcdHBvbHlsaW5lLnZlcnRpY2VzID0gY29tcHJlc3NlZFxyXG5cdFx0cG9seWxpbmUua2V5UG9pbnRzID0gcG9seWxpbmUudmVydGljZXNcclxuXHRcdHJldHVybiBwb2x5bGluZVxyXG5cclxuXHQjIEFyZWEgQ2FsY3VsYXRpb25cclxuXHJcblx0Y2FsY1RyaWFuZ2xlQXJlYTogKHRyaWFuZ2xlKSAtPlxyXG5cdFx0W2EsIGIsIGNdID0gdHJpYW5nbGUucG9pbnRzXHJcblx0XHRyZXR1cm4gTWF0aC5hYnMoKChiLnggLSBhLngpICogKGMueSAtIGEueSkpIC0gKChjLnggLSBhLngpICogKGIueSAtIGEueSkpKSAvIDJcclxuXHJcbkcuaW5qZWN0KClcclxuIiwiIyBVc2VkIHRvIGdlbmVyYXRlIHJhbmRvbSBzaGFwZXNcclxuXHJcbmNsYXNzIEJ1LlNoYXBlUmFuZG9taXplclxyXG5cclxuXHRNQVJHSU4gPSAzMFxyXG5cclxuXHRyYW5nZVdpZHRoOiA4MDBcclxuXHRyYW5nZUhlaWdodDogNDUwXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuXHRyYW5kb21YOiAtPlxyXG5cdFx0QnUucmFuZCBNQVJHSU4sIEByYW5nZVdpZHRoIC0gTUFSR0lOICogMlxyXG5cclxuXHRyYW5kb21ZOiAtPlxyXG5cdFx0QnUucmFuZCBNQVJHSU4sIEByYW5nZUhlaWdodCAtIE1BUkdJTiAqIDJcclxuXHJcblx0cmFuZG9tUmFkaXVzOiAtPlxyXG5cdFx0QnUucmFuZCA1LCBNYXRoLm1pbihAcmFuZ2VXaWR0aCwgQHJhbmdlSGVpZ2h0KSAvIDJcclxuXHJcblx0c2V0UmFuZ2U6ICh3LCBoKSAtPlxyXG5cdFx0QHJhbmdlV2lkdGggPSB3XHJcblx0XHRAcmFuZ2VIZWlnaHQgPSBoXHJcblxyXG5cdGdlbmVyYXRlOiAodHlwZSkgLT5cclxuXHRcdHN3aXRjaCB0eXBlXHJcblx0XHRcdHdoZW4gJ2NpcmNsZScgdGhlbiBAZ2VuZXJhdGVDaXJjbGUoKVxyXG5cdFx0XHR3aGVuICdib3cnIHRoZW4gQGdlbmVyYXRlQm93KClcclxuXHRcdFx0d2hlbiAndHJpYW5nbGUnIHRoZW4gQGdlbmVyYXRlVHJpYW5nbGUoKVxyXG5cdFx0XHR3aGVuICdyZWN0YW5nbGUnIHRoZW4gQGdlbmVyYXRlUmVjdGFuZ2xlKClcclxuXHRcdFx0d2hlbiAnZmFuJyB0aGVuIEBnZW5lcmF0ZUZhbigpXHJcblx0XHRcdHdoZW4gJ3BvbHlnb24nIHRoZW4gQGdlbmVyYXRlUG9seWdvbigpXHJcblx0XHRcdHdoZW4gJ2xpbmUnIHRoZW4gQGdlbmVyYXRlTGluZSgpXHJcblx0XHRcdHdoZW4gJ3BvbHlsaW5lJyB0aGVuIEBnZW5lcmF0ZVBvbHlsaW5lKClcclxuXHRcdFx0ZWxzZSBjb25zb2xlLndhcm4gJ25vdCBzdXBwb3J0IHNoYXBlOiAnICsgdHlwZVxyXG5cdFx0QHJhbmdlSGVpZ2h0ID0gaFxyXG5cclxuXHRyYW5kb21pemU6IChzaGFwZSkgLT5cclxuXHRcdGlmIEJ1LmlzQXJyYXkgc2hhcGVcclxuXHRcdFx0QHJhbmRvbWl6ZSBzIGZvciBzIGluIHNoYXBlXHJcblx0XHRlbHNlXHJcblx0XHRcdHN3aXRjaCBzaGFwZS50eXBlXHJcblx0XHRcdFx0d2hlbiAnQ2lyY2xlJyB0aGVuIEByYW5kb21pemVDaXJjbGUgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdFbGxpcHNlJyB0aGVuIEByYW5kb21pemVFbGxpcHNlIHNoYXBlXHJcblx0XHRcdFx0d2hlbiAnQm93JyB0aGVuIEByYW5kb21pemVCb3cgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdUcmlhbmdsZScgdGhlbiBAcmFuZG9taXplVHJpYW5nbGUgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdSZWN0YW5nbGUnIHRoZW4gQHJhbmRvbWl6ZVJlY3RhbmdsZSBzaGFwZVxyXG5cdFx0XHRcdHdoZW4gJ0ZhbicgdGhlbiBAcmFuZG9taXplRmFuIHNoYXBlXHJcblx0XHRcdFx0d2hlbiAnUG9seWdvbicgdGhlbiBAcmFuZG9taXplUG9seWdvbiBzaGFwZVxyXG5cdFx0XHRcdHdoZW4gJ0xpbmUnIHRoZW4gQHJhbmRvbWl6ZUxpbmUgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdQb2x5bGluZScgdGhlbiBAcmFuZG9taXplUG9seWxpbmUgc2hhcGVcclxuXHRcdFx0XHRlbHNlIGNvbnNvbGUud2FybiAnbm90IHN1cHBvcnQgc2hhcGU6ICcgKyBzaGFwZS50eXBlXHJcblxyXG5cdHJhbmRvbWl6ZVBvc2l0aW9uOiAoc2hhcGUpIC0+XHJcblx0XHRzaGFwZS5wb3NpdGlvbi54ID0gQHJhbmRvbVgoKVxyXG5cdFx0c2hhcGUucG9zaXRpb24ueSA9IEByYW5kb21ZKClcclxuXHRcdHNoYXBlLnRyaWdnZXIgJ2NoYW5nZWQnXHJcblx0XHRAXHJcblxyXG5cdGdlbmVyYXRlQ2lyY2xlOiAtPlxyXG5cdFx0Y2lyY2xlID0gbmV3IEJ1LkNpcmNsZSBAcmFuZG9tUmFkaXVzKCksIEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHRcdGNpcmNsZS5jZW50ZXIubGFiZWwgPSAnTydcclxuXHRcdGNpcmNsZVxyXG5cclxuXHRyYW5kb21pemVDaXJjbGU6IChjaXJjbGUpIC0+XHJcblx0XHRjaXJjbGUuY3ggPSBAcmFuZG9tWCgpXHJcblx0XHRjaXJjbGUuY3kgPSBAcmFuZG9tWSgpXHJcblx0XHRjaXJjbGUucmFkaXVzID0gQHJhbmRvbVJhZGl1cygpXHJcblx0XHRAXHJcblxyXG5cdGdlbmVyYXRlRWxsaXBzZTogLT5cclxuXHRcdGVsbGlwc2UgPSBuZXcgQnUuRWxsaXBzZSBAcmFuZG9tUmFkaXVzKCksIEByYW5kb21SYWRpdXMoKVxyXG5cdFx0QHJhbmRvbWl6ZVBvc2l0aW9uIGVsbGlwc2VcclxuXHRcdGVsbGlwc2VcclxuXHJcblx0cmFuZG9taXplRWxsaXBzZTogKGVsbGlwc2UpIC0+XHJcblx0XHRlbGxpcHNlLnJhZGl1c1ggPSBAcmFuZG9tUmFkaXVzKClcclxuXHRcdGVsbGlwc2UucmFkaXVzWSA9IEByYW5kb21SYWRpdXMoKVxyXG5cdFx0QHJhbmRvbWl6ZVBvc2l0aW9uIGVsbGlwc2VcclxuXHRcdEBcclxuXHJcblx0Z2VuZXJhdGVCb3c6IC0+XHJcblx0XHRhRnJvbSA9IEJ1LnJhbmQgQnUuVFdPX1BJXHJcblx0XHRhVG8gPSBhRnJvbSArIEJ1LnJhbmQgQnUuSEFMRl9QSSwgQnUuVFdPX1BJXHJcblxyXG5cdFx0Ym93ID0gbmV3IEJ1LkJvdyBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tUmFkaXVzKCksIGFGcm9tLCBhVG9cclxuXHRcdGJvdy5zdHJpbmcucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHRib3cuc3RyaW5nLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0Ym93XHJcblxyXG5cdHJhbmRvbWl6ZUJvdzogKGJvdykgLT5cclxuXHRcdGFGcm9tID0gQnUucmFuZCBCdS5UV09fUElcclxuXHRcdGFUbyA9IGFGcm9tICsgQnUucmFuZCBCdS5IQUxGX1BJLCBCdS5UV09fUElcclxuXHJcblx0XHRib3cuY3ggPSBAcmFuZG9tWCgpXHJcblx0XHRib3cuY3kgPSBAcmFuZG9tWSgpXHJcblx0XHRib3cucmFkaXVzID0gQHJhbmRvbVJhZGl1cygpXHJcblx0XHRib3cuYUZyb20gPSBhRnJvbVxyXG5cdFx0Ym93LmFUbyA9IGFUb1xyXG5cdFx0Ym93LnRyaWdnZXIgJ2NoYW5nZWQnXHJcblx0XHRAXHJcblxyXG5cdGdlbmVyYXRlRmFuOiAtPlxyXG5cdFx0YUZyb20gPSBCdS5yYW5kIEJ1LlRXT19QSVxyXG5cdFx0YVRvID0gYUZyb20gKyBCdS5yYW5kIEJ1LkhBTEZfUEksIEJ1LlRXT19QSVxyXG5cclxuXHRcdGZhbiA9IG5ldyBCdS5GYW4gQHJhbmRvbVgoKSwgQHJhbmRvbVkoKSwgQHJhbmRvbVJhZGl1cygpLCBhRnJvbSwgYVRvXHJcblx0XHRmYW4uY2VudGVyLmxhYmVsID0gJ08nXHJcblx0XHRmYW4uc3RyaW5nLnBvaW50c1swXS5sYWJlbCA9ICdBJ1xyXG5cdFx0ZmFuLnN0cmluZy5wb2ludHNbMV0ubGFiZWwgPSAnQidcclxuXHRcdGZhblxyXG5cclxuXHRyYW5kb21pemVGYW46IEA6OnJhbmRvbWl6ZUJvd1xyXG5cclxuXHRnZW5lcmF0ZVRyaWFuZ2xlOiAtPlxyXG5cdFx0cG9pbnRzID0gW11cclxuXHRcdGZvciBpIGluIFswLi4yXVxyXG5cdFx0XHRwb2ludHNbaV0gPSBuZXcgQnUuUG9pbnQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKVxyXG5cclxuXHRcdHRyaWFuZ2xlID0gbmV3IEJ1LlRyaWFuZ2xlIHBvaW50c1swXSwgcG9pbnRzWzFdLCBwb2ludHNbMl1cclxuXHRcdHRyaWFuZ2xlLnBvaW50c1swXS5sYWJlbCA9ICdBJ1xyXG5cdFx0dHJpYW5nbGUucG9pbnRzWzFdLmxhYmVsID0gJ0InXHJcblx0XHR0cmlhbmdsZS5wb2ludHNbMl0ubGFiZWwgPSAnQydcclxuXHRcdHRyaWFuZ2xlXHJcblxyXG5cdHJhbmRvbWl6ZVRyaWFuZ2xlOiAodHJpYW5nbGUpIC0+XHJcblx0XHR0cmlhbmdsZS5wb2ludHNbaV0uc2V0IEByYW5kb21YKCksIEByYW5kb21ZKCkgZm9yIGkgaW4gWzAuLjJdXHJcblx0XHR0cmlhbmdsZS50cmlnZ2VyICdjaGFuZ2VkJ1xyXG5cdFx0QFxyXG5cclxuXHRnZW5lcmF0ZVJlY3RhbmdsZTogLT5cclxuXHRcdHJlY3QgPSBuZXcgQnUuUmVjdGFuZ2xlKFxyXG5cdFx0XHRCdS5yYW5kKEByYW5nZVdpZHRoKVxyXG5cdFx0XHRCdS5yYW5kKEByYW5nZUhlaWdodClcclxuXHRcdFx0QnUucmFuZChAcmFuZ2VXaWR0aCAvIDIpXHJcblx0XHRcdEJ1LnJhbmQoQHJhbmdlSGVpZ2h0IC8gMilcclxuXHRcdClcclxuXHRcdHJlY3QucG9pbnRMVC5sYWJlbCA9ICdBJ1xyXG5cdFx0cmVjdC5wb2ludFJULmxhYmVsID0gJ0InXHJcblx0XHRyZWN0LnBvaW50UkIubGFiZWwgPSAnQydcclxuXHRcdHJlY3QucG9pbnRMQi5sYWJlbCA9ICdEJ1xyXG5cdFx0cmVjdFxyXG5cclxuXHRyYW5kb21pemVSZWN0YW5nbGU6IChyZWN0YW5nbGUpIC0+XHJcblx0XHRyZWN0YW5nbGUuc2V0IEByYW5kb21YKCksIEByYW5kb21ZKCksIEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHRcdHJlY3RhbmdsZS50cmlnZ2VyICdjaGFuZ2VkJ1xyXG5cdFx0QFxyXG5cclxuXHRnZW5lcmF0ZVBvbHlnb246IC0+XHJcblx0XHRwb2ludHMgPSBbXVxyXG5cclxuXHRcdGZvciBpIGluIFswLi4zXVxyXG5cdFx0XHRwb2ludCA9IG5ldyBCdS5Qb2ludCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRcdHBvaW50LmxhYmVsID0gJ1AnICsgaVxyXG5cdFx0XHRwb2ludHMucHVzaCBwb2ludFxyXG5cclxuXHRcdG5ldyBCdS5Qb2x5Z29uIHBvaW50c1xyXG5cclxuXHRyYW5kb21pemVQb2x5Z29uOiAocG9seWdvbikgLT5cclxuXHRcdHZlcnRleC5zZXQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKSBmb3IgdmVydGV4IGluIHBvbHlnb24udmVydGljZXNcclxuXHRcdHBvbHlnb24udHJpZ2dlciAnY2hhbmdlZCdcclxuXHRcdEBcclxuXHJcblx0Z2VuZXJhdGVMaW5lOiAtPlxyXG5cdFx0bGluZSA9IG5ldyBCdS5MaW5lIEByYW5kb21YKCksIEByYW5kb21ZKCksIEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHRcdGxpbmUucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHRsaW5lLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0bGluZVxyXG5cclxuXHRyYW5kb21pemVMaW5lOiAobGluZSkgLT5cclxuXHRcdHBvaW50LnNldCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpIGZvciBwb2ludCBpbiBsaW5lLnBvaW50c1xyXG5cdFx0bGluZS50cmlnZ2VyICdjaGFuZ2VkJ1xyXG5cdFx0QFxyXG5cclxuXHRnZW5lcmF0ZVBvbHlsaW5lOiAtPlxyXG5cdFx0cG9seWxpbmUgPSBuZXcgQnUuUG9seWxpbmVcclxuXHRcdGZvciBpIGluIFswLi4zXVxyXG5cdFx0XHRwb2ludCA9IG5ldyBCdS5Qb2ludCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRcdHBvaW50LmxhYmVsID0gJ1AnICsgaVxyXG5cdFx0XHRwb2x5bGluZS5hZGRQb2ludCBwb2ludFxyXG5cdFx0cG9seWxpbmVcclxuXHJcblx0cmFuZG9taXplUG9seWxpbmU6IChwb2x5bGluZSkgLT5cclxuXHRcdHZlcnRleC5zZXQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKSBmb3IgdmVydGV4IGluIHBvbHlsaW5lLnZlcnRpY2VzXHJcblx0XHRwb2x5bGluZS50cmlnZ2VyICdjaGFuZ2VkJ1xyXG5cdFx0QFxyXG4iXX0=
