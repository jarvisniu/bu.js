// Bu.js v0.3.5 - https://github.com/jarvisniu/Bu.js
(function() {
  var base, base1, currentTime, global, lastBootTime, previousGlobal,
    hasProp = {}.hasOwnProperty;

  previousGlobal = global;

  global = window || this;

  global.Bu = {};

  Bu.global = global;

  global = previousGlobal;

  Bu.VERSION = '0.3.5';

  Bu.BROWSER_VENDOR_PREFIXES = ['webkit', 'moz', 'ms'];

  Bu.HALF_PI = Math.PI / 2;

  Bu.TWO_PI = Math.PI * 2;

  Bu.DEFAULT_STROKE_STYLE = '#048';

  Bu.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)';

  Bu.DEFAULT_DASH_STYLE = [8, 4];

  Bu.DEFAULT_STROKE_STYLE_HOVER = 'rgba(255, 128, 0, 0.75)';

  Bu.DEFAULT_FILL_STYLE_HOVER = 'rgba(255, 128, 128, 0.5)';

  Bu.DEFAULT_TEXT_FILL_STYLE = 'black';

  Bu.POINT_RENDER_SIZE = 2.25;

  Bu.POINT_LABEL_OFFSET = 5;

  Bu.DEFAULT_FONT_FAMILY = 'Verdana';

  Bu.DEFAULT_FONT_SIZE = 11;

  Bu.DEFAULT_FONT = '11px Verdana';

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

  lastBootTime = Bu.data('lastInfo');

  currentTime = Date.now();

  if (!((lastBootTime != null) && currentTime - lastBootTime < 60 * 1000)) {
    if (typeof console.info === "function") {
      console.info('Bu.js v' + Bu.VERSION + ' - [https://github.com/jarvisniu/Bu.js]');
    }
    Bu.data('lastInfo', currentTime);
  }

}).call(this);

(function() {
  Bu.Bounds = (function() {
    function Bounds(target) {
      this.target = target;
      this.x1 = this.y1 = this.x2 = this.y2 = 0;
      this.isEmpty = true;
      this.point1 = new Bu.Vector;
      this.point2 = new Bu.Vector;
      this.update();
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
          this.expandByCircle(this.target);
          this.target.on('centerChanged', (function(_this) {
            return function() {
              _this.clear();
              return _this.expandByCircle(_this.target);
            };
          })(this));
          return this.target.on('radiusChanged', (function(_this) {
            return function() {
              _this.clear();
              return _this.expandByCircle(_this.target);
            };
          })(this));
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
        default:
          return console.warn('Bounds: not support shape type "' + this.target.type + '"');
      }
    };

    Bounds.prototype.clear = function() {
      this.x1 = this.y1 = this.x2 = this.y2 = 0;
      return this.isEmpty = true;
    };

    Bounds.prototype.expandByPoint = function(v) {
      if (this.isEmpty) {
        this.isEmpty = false;
        this.x1 = this.x2 = v.x;
        return this.y1 = this.y2 = v.y;
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
          return this.y2 = v.y;
        }
      }
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
        return this.y2 = cp.y + r;
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
          return this.y2 = cp.y + r;
        }
      }
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
    };

    return Vector;

  })();

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
    App.prototype.$objects = {};

    function App(options) {
      var base, i, k, len, ref;
      this.options = options != null ? options : {};
      ref = ["renderer", "camera", "data", "objects", "hierarchy", "methods", "events"];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        (base = this.options)[k] || (base[k] = {});
      }
      Bu.ready(this.init, this);
    }

    App.prototype.init = function() {
      var assembleObjects, k, name, ref, type;
      this.$renderer = new Bu.Renderer(this.options.renderer);
      if (Bu.isFunction(this.options.data)) {
        this.options.data = this.options.data.apply(this);
      }
      for (k in this.options.data) {
        this[k] = this.options.data[k];
      }
      for (k in this.options.methods) {
        this[k] = this.options.methods[k];
      }
      if (Bu.isFunction(this.options.objects)) {
        this.$objects = this.options.objects.apply(this);
      } else {
        for (name in this.options.objects) {
          this.$objects[name] = this.options.objects[name];
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
      assembleObjects(this.options.hierarchy, this.$renderer.scene);
      if ((ref = this.options.init) != null) {
        ref.call(this);
      }
      this.events = this.options.events;
      for (type in this.events) {
        if (type === 'mousedown') {
          this.$renderer.dom.addEventListener('mousedown', (function(_this) {
            return function(e) {
              return _this.events['mousedown'].call(_this, e);
            };
          })(this));
        } else if (type === 'mousemove') {
          this.$renderer.dom.addEventListener('mousemove', (function(_this) {
            return function(e) {
              return _this.events['mousemove'].call(_this, e);
            };
          })(this));
        } else if (type === 'mouseup') {
          this.$renderer.dom.addEventListener('mouseup', (function(_this) {
            return function(e) {
              return _this.events['mouseup'].call(_this, e);
            };
          })(this));
        }
      }
      if (this.options.update != null) {
        return this.$renderer.on('update', (function(_this) {
          return function() {
            return _this.options.update.apply(_this, arguments);
          };
        })(this));
      }
    };

    App.prototype.trigger = function(type, arg) {
      var ref;
      return (ref = this.events[type]) != null ? ref.call(this, arg) : void 0;
    };

    return App;

  })();

}).call(this);

(function() {
  Bu.Colorful = function() {
    this.strokeStyle = Bu.DEFAULT_STROKE_STYLE;
    this.fillStyle = Bu.DEFAULT_FILL_STYLE;
    this.dashStyle = false;
    this.lineWidth = 1;
    this.dashOffset = 0;
    this.stroke = function(v) {
      if (v == null) {
        v = true;
      }
      switch (v) {
        case true:
          this.strokeStyle = Bu.DEFAULT_STROKE_STYLE;
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
          this.fillStyle = Bu.DEFAULT_FILL_STYLE;
          break;
        default:
          this.fillStyle = v;
      }
      return this;
    };
    return this.dash = function(v) {
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
          this.dashStyle = Bu.DEFAULT_DASH_STYLE;
          break;
        default:
          this.dashStyle = v;
      }
      return this;
    };
  };

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
      Bu.Colorful.apply(this);
      Bu.Event.apply(this);
      this.type = 'Object2D';
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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bu.Renderer = (function() {
    function Renderer() {
      this.drawShape = bind(this.drawShape, this);
      this.drawShapes = bind(this.drawShapes, this);
      var appendDom, j, k, len1, onResize, options, ref, ref1, tick;
      Bu.Event.apply(this);
      this.type = 'Renderer';
      this.scene = new Bu.Scene();
      this.tickCount = 0;
      this.isRunning = true;
      this.pixelRatio = Bu.global.devicePixelRatio || 1;
      this.dom = document.createElement('canvas');
      this.context = this.dom.getContext('2d');
      if (typeof ClipMeter !== "undefined" && ClipMeter !== null) {
        this.clipMeter = new ClipMeter();
      }
      options = Bu.combineOptions(arguments, {
        container: 'body',
        background: '#eee',
        fps: 60,
        showKeyPoints: false,
        showBounds: false,
        imageSmoothing: true
      });
      ref = ['container', 'width', 'height', 'fps', 'showKeyPoints', 'showBounds'];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        k = ref[j];
        this[k] = options[k];
      }
      if (Bu.isString(this.container)) {
        this.container = document.querySelector(this.container);
      }
      this.fillParent = !Bu.isNumber(options.width);
      if (!this.fillParent) {
        this.dom.style.width = this.width + 'px';
        this.dom.style.height = this.height + 'px';
        this.dom.width = this.width * this.pixelRatio;
        this.dom.height = this.height * this.pixelRatio;
      }
      this.dom.style.cursor = options.cursor || 'default';
      this.dom.style.boxSizing = 'content-box';
      this.dom.style.background = options.background;
      this.dom.oncontextmenu = function() {
        return false;
      };
      this.context.textBaseline = 'top';
      this.context.imageSmoothingEnabled = options.imageSmoothing;
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
      if (this.fillParent) {
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
            _this.trigger('update', {
              'tickCount': _this.tickCount
            });
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
      if ((ref1 = Bu.animationRunner) != null) {
        ref1.hookUp(this);
      }
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
      this.context.scale(this.pixelRatio, this.pixelRatio);
      this.clearCanvas();
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
      if (shape.fillStyle != null) {
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
      this.context.arc(shape.x, shape.y, Bu.POINT_RENDER_SIZE, 0, Math.PI * 2);
      return this;
    };

    Renderer.prototype.drawLine = function(shape) {
      this.context.moveTo(shape.points[0].x, shape.points[0].y);
      this.context.lineTo(shape.points[1].x, shape.points[1].y);
      return this;
    };

    Renderer.prototype.drawCircle = function(shape) {
      this.context.arc(shape.cx, shape.cy, shape.radius, 0, Math.PI * 2);
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

    function Bow(cx, cy, radius, aFrom, aTo) {
      var ref;
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.aFrom = aFrom;
      this.aTo = aTo;
      Bow.__super__.constructor.call(this);
      this.type = 'Bow';
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

    function Circle(_radius, cx, cy) {
      this._radius = _radius != null ? _radius : 1;
      if (cx == null) {
        cx = 0;
      }
      if (cy == null) {
        cy = 0;
      }
      Circle.__super__.constructor.call(this);
      this.type = 'Circle';
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

  Bu.Fan = (function(superClass) {
    extend(Fan, superClass);

    function Fan(cx, cy, radius, aFrom, aTo) {
      var ref;
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.aFrom = aFrom;
      this.aTo = aTo;
      Fan.__super__.constructor.call(this);
      this.type = 'Fan';
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

    function Line(p1, p2, p3, p4) {
      Line.__super__.constructor.call(this);
      this.type = 'Line';
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

    function Point(x1, y1) {
      this.x = x1 != null ? x1 : 0;
      this.y = y1 != null ? y1 : 0;
      Point.__super__.constructor.call(this);
      this.type = 'Point';
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


    /*
       constructors
       1. Polygon(points)
       2. Polygon(x, y, radius, n, options): to generate regular polygon
       	options: angle - start angle of regular polygon
     */

    function Polygon(points) {
      var n, options, radius, x, y;
      Polygon.__super__.constructor.call(this);
      this.type = 'Polygon';
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
      angleSection = Math.PI * 2 / n;
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

    function Polyline(vertices1) {
      var i, j, ref, vertices;
      this.vertices = vertices1 != null ? vertices1 : [];
      Polyline.__super__.constructor.call(this);
      this.type = 'Polyline';
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

    function Rectangle(x, y, width, height, cornerRadius) {
      if (cornerRadius == null) {
        cornerRadius = 0;
      }
      Rectangle.__super__.constructor.call(this);
      this.type = 'Rectangle';
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

    function Spline(vertices) {
      var polyline;
      Spline.__super__.constructor.call(this);
      this.type = 'Spline';
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
          if (Math.abs(theta - theta1) > Math.PI / 2) {
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

    function Triangle(p1, p2, p3) {
      var x1, x2, x3, y1, y2, y3;
      Triangle.__super__.constructor.call(this);
      this.type = 'Triangle';
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
      this.fillStyle = Bu.DEFAULT_TEXT_FILL_STYLE;
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
        return console.error('Bu.AnimationRunner: animation setting is ilegal: ', task.animation);
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
      return this.injectInto(['point', 'line', 'circle', 'triangle', 'rectangle', 'fan', 'bow', 'polygon', 'polyline']);
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
        a += Math.PI * 2;
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
          if (obliqueAngle < strength * strength * Math.PI / 2) {
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

    ShapeRandomizer.prototype.generateBow = function() {
      var aFrom, aTo, bow;
      aFrom = Bu.rand(Math.PI * 2);
      aTo = aFrom + Bu.rand(Math.PI / 2, Math.PI * 2);
      bow = new Bu.Bow(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
      bow.string.points[0].label = 'A';
      bow.string.points[1].label = 'B';
      return bow;
    };

    ShapeRandomizer.prototype.randomizeBow = function(bow) {
      var aFrom, aTo;
      aFrom = Bu.rand(Math.PI * 2);
      aTo = aFrom + Bu.rand(Math.PI / 2, Math.PI * 2);
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
      aFrom = Bu.rand(Math.PI * 2);
      aTo = aFrom + Bu.rand(Math.PI / 2, Math.PI * 2);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJ1LmNvZmZlZSIsIkJvdW5kcy5jb2ZmZWUiLCJDb2xvci5jb2ZmZWUiLCJTaXplLmNvZmZlZSIsIlZlY3Rvci5jb2ZmZWUiLCJBcHAuY29mZmVlIiwiQ29sb3JmdWwuY29mZmVlIiwiRXZlbnQuY29mZmVlIiwiTWljcm9KUXVlcnkuY29mZmVlIiwiT2JqZWN0MkQuY29mZmVlIiwiUmVuZGVyZXIuY29mZmVlIiwiU2NlbmUuY29mZmVlIiwiQm93LmNvZmZlZSIsIkNpcmNsZS5jb2ZmZWUiLCJGYW4uY29mZmVlIiwiTGluZS5jb2ZmZWUiLCJQb2ludC5jb2ZmZWUiLCJQb2x5Z29uLmNvZmZlZSIsIlBvbHlsaW5lLmNvZmZlZSIsIlJlY3RhbmdsZS5jb2ZmZWUiLCJTcGxpbmUuY29mZmVlIiwiVHJpYW5nbGUuY29mZmVlIiwiSW1hZ2UuY29mZmVlIiwiUG9pbnRUZXh0LmNvZmZlZSIsIkFuaW1hdGlvbi5jb2ZmZWUiLCJBbmltYXRpb25SdW5uZXIuY29mZmVlIiwiQW5pbWF0aW9uVGFzay5jb2ZmZWUiLCJTcHJpdGVTaGVldC5jb2ZmZWUiLCJnZW9tZXRyeUFsZ29yaXRobS5jb2ZmZWUiLCJTaGFwZVJhbmRvbWl6ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQTtBQUFBLE1BQUEsOERBQUE7SUFBQTs7RUFBQSxjQUFBLEdBQWlCOztFQUdqQixNQUFBLEdBQVMsTUFBQSxJQUFVOztFQUduQixNQUFNLENBQUMsRUFBUCxHQUFZOztFQUdaLEVBQUUsQ0FBQyxNQUFILEdBQVk7O0VBR1osTUFBQSxHQUFTOztFQVFULEVBQUUsQ0FBQyxPQUFILEdBQWE7O0VBR2IsRUFBRSxDQUFDLHVCQUFILEdBQTZCLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsSUFBbEI7O0VBRzdCLEVBQUUsQ0FBQyxPQUFILEdBQWEsSUFBSSxDQUFDLEVBQUwsR0FBVTs7RUFDdkIsRUFBRSxDQUFDLE1BQUgsR0FBWSxJQUFJLENBQUMsRUFBTCxHQUFVOztFQUd0QixF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QkFLZixnQkFBQSxHQUFrQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxFQUFFLENBQUM7QUFDbEIsV0FBUywwQkFBVDtRQUNDLEtBQUEsR0FBWSxJQUFBLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFULEVBQXFCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBckI7UUFDWixLQUFLLENBQUMsS0FBTixHQUFjLEdBQUEsR0FBTTtRQUNwQixRQUFRLENBQUMsUUFBVCxDQUFrQixLQUFsQjtBQUhEO2FBSUE7SUFOaUI7OzhCQVFsQixpQkFBQSxHQUFtQixTQUFDLFFBQUQ7QUFDbEIsVUFBQTtBQUFBO0FBQUEsV0FBQSxxQ0FBQTs7UUFBQSxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBWCxFQUF1QixJQUFDLENBQUEsT0FBRCxDQUFBLENBQXZCO0FBQUE7TUFDQSxRQUFRLENBQUMsT0FBVCxDQUFpQixTQUFqQjthQUNBO0lBSGtCOzs7OztBQWxLcEIiLCJmaWxlIjoiYnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIEJ1LmNvZmZlZTogbmFtZXNwYWNlLCBjb25zdGFudHMsIHV0aWxpdHkgZnVuY3Rpb25zIGFuZCBwb2x5ZmlsbHNcclxuXHJcbiMgU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgYGdsb2JhbGAgdmFyaWFibGUuXHJcbnByZXZpb3VzR2xvYmFsID0gZ2xvYmFsXHJcblxyXG4jIEdldCB0aGUgcm9vdCBvYmplY3RcclxuZ2xvYmFsID0gd2luZG93IG9yIEBcclxuXHJcbiMgRGVmaW5lIG91ciBuYW1lc3BhY2UgYEJ1YC5cclxuZ2xvYmFsLkJ1ID0ge31cclxuXHJcbiMgU2F2ZSB0aGUgcm9vdCBvYmplY3QgdG8gb3VyIG5hbWVzcGFjZS5cclxuQnUuZ2xvYmFsID0gZ2xvYmFsXHJcblxyXG4jIFJldHVybiBiYWNrIHRoZSBwcmV2aW91cyBnbG9iYWwgdmFyaWFibGUuXHJcbmdsb2JhbCA9IHByZXZpb3VzR2xvYmFsXHJcblxyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBDb25zdGFudHNcclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiMgVmVyc2lvbiBpbmZvIG9mIHRoaXMgbGlicmFyeVxyXG5CdS5WRVJTSU9OID0gJzAuMy41J1xyXG5cclxuIyBCcm93c2VyIHZlbmRvciBwcmVmaXhlcywgdXNlZCBpbiBleHBlcmltZW50YWwgZmVhdHVyZXNcclxuQnUuQlJPV1NFUl9WRU5ET1JfUFJFRklYRVMgPSBbJ3dlYmtpdCcsICdtb3onLCAnbXMnXVxyXG5cclxuIyBNYXRoXHJcbkJ1LkhBTEZfUEkgPSBNYXRoLlBJIC8gMlxyXG5CdS5UV09fUEkgPSBNYXRoLlBJICogMlxyXG5cclxuIyBEZWZhdWx0IHJlbmRlciBzdHlsZSBvZiBzaGFwZXNcclxuQnUuREVGQVVMVF9TVFJPS0VfU1RZTEUgPSAnIzA0OCdcclxuQnUuREVGQVVMVF9GSUxMX1NUWUxFID0gJ3JnYmEoNjQsIDEyOCwgMTkyLCAwLjUpJ1xyXG5CdS5ERUZBVUxUX0RBU0hfU1RZTEUgPSBbOCwgNF1cclxuXHJcbiMgRGVmYXVsdCByZW5kZXIgc3R5bGUgd2hlbiB0aGVuIG1vdXNlIGlzIGhvdmVyZWQgb25cclxuQnUuREVGQVVMVF9TVFJPS0VfU1RZTEVfSE9WRVIgPSAncmdiYSgyNTUsIDEyOCwgMCwgMC43NSknXHJcbkJ1LkRFRkFVTFRfRklMTF9TVFlMRV9IT1ZFUiA9ICdyZ2JhKDI1NSwgMTI4LCAxMjgsIDAuNSknXHJcblxyXG4jIFRoZSBkZWZhdWx0IGNvbG9yIG9mIHJlbmRlcmVkIHRleHQsIFBvaW50VGV4dCBmb3Igbm93XHJcbkJ1LkRFRkFVTFRfVEVYVF9GSUxMX1NUWUxFID0gJ2JsYWNrJ1xyXG5cclxuIyBQb2ludCBpcyByZW5kZXJlZCBhcyBhIHNtYWxsIGNpcmNsZSBvbiBzY3JlZW4uIFRoaXMgaXMgdGhlIHJhZGl1cyBvZiB0aGUgY2lyY2xlLlxyXG5CdS5QT0lOVF9SRU5ERVJfU0laRSA9IDIuMjVcclxuXHJcbiMgUG9pbnQgY2FuIGhhdmUgbGFiZWwgYXNpZGUgaXQuIFRoaXMgaXMgdGhlIG9mZnNldCBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludC5cclxuQnUuUE9JTlRfTEFCRUxfT0ZGU0VUID0gNVxyXG5cclxuIyBEZWZhdWx0IGZvbnQgZm9yIHRoZSB0ZXh0XHJcbkJ1LkRFRkFVTFRfRk9OVF9GQU1JTFkgPSAnVmVyZGFuYSdcclxuQnUuREVGQVVMVF9GT05UX1NJWkUgPSAxMVxyXG5CdS5ERUZBVUxUX0ZPTlQgPSAnMTFweCBWZXJkYW5hJ1xyXG5cclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4jIERlZmF1bHQgc21vb3RoIGZhY3RvciBvZiBzcGxpbmUsIHJhbmdlIGluIFswLCAxXSBhbmQgMSBpcyB0aGUgc21vb3RoZXN0XHJcbkJ1LkRFRkFVTFRfU1BMSU5FX1NNT09USCA9IDAuMjVcclxuXHJcbiMgSG93IGNsb3NlIGEgcG9pbnQgdG8gYSBsaW5lIGlzIHJlZ2FyZGVkIHRoYXQgdGhlIHBvaW50IGlzICoqT04qKiB0aGUgbGluZS5cclxuQnUuREVGQVVMVF9ORUFSX0RJU1QgPSA1XHJcblxyXG4jIEVudW1lcmF0aW9uIG9mIG1vdXNlIGJ1dHRvblxyXG5CdS5NT1VTRV9CVVRUT05fTk9ORSA9IC0xXHJcbkJ1Lk1PVVNFX0JVVFRPTl9MRUZUID0gMFxyXG5CdS5NT1VTRV9CVVRUT05fTUlERExFID0gMVxyXG5CdS5NT1VTRV9CVVRUT05fUklHSFQgPSAyXHJcblxyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBVdGlsaXR5IGZ1bmN0aW9uc1xyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuIyBDYWxjdWxhdGUgdGhlIG1lYW4gdmFsdWUgb2YgbnVtYmVyc1xyXG5CdS5hdmVyYWdlID0gKCktPlxyXG5cdG5zID0gYXJndW1lbnRzXHJcblx0bnMgPSBhcmd1bWVudHNbMF0gaWYgdHlwZW9mIGFyZ3VtZW50c1swXSBpcyAnb2JqZWN0J1xyXG5cdHN1bSA9IDBcclxuXHRmb3IgaSBpbiBuc1xyXG5cdFx0c3VtICs9IGlcclxuXHRzdW0gLyBucy5sZW5ndGhcclxuXHJcbiMgQ2FsY3VsYXRlIHRoZSBoeXBvdGVudXNlIGZyb20gdGhlIGNhdGhldHVzZXNcclxuQnUuYmV2ZWwgPSAoeCwgeSkgLT5cclxuXHRNYXRoLnNxcnQgeCAqIHggKyB5ICogeVxyXG5cclxuIyBMaW1pdCBhIG51bWJlciBieSBtaW5pbXVtIHZhbHVlIGFuZCBtYXhpbXVtIHZhbHVlXHJcbkJ1LmNsYW1wID0gKHgsIG1pbiwgbWF4KSAtPlxyXG5cdHggPSBtaW4gaWYgeCA8IG1pblxyXG5cdHggPSBtYXggaWYgeCA+IG1heFxyXG5cdHhcclxuXHJcbiMgR2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIG51bWJlcnNcclxuQnUucmFuZCA9IChmcm9tLCB0bykgLT5cclxuXHRpZiBub3QgdG8/XHJcblx0XHR0byA9IGZyb21cclxuXHRcdGZyb20gPSAwXHJcblx0TWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pICsgZnJvbVxyXG5cclxuIyBDb252ZXJ0IGFuIGFuZ2xlIGZyb20gcmFkaWFuIHRvIGRlZ1xyXG5CdS5yMmQgPSAocikgLT4gKHIgKiAxODAgLyBNYXRoLlBJKS50b0ZpeGVkKDEpXHJcblxyXG4jIENvbnZlcnQgYW4gYW5nbGUgZnJvbSBkZWcgdG8gcmFkaWFuXHJcbkJ1LmQyciA9IChyKSAtPiByICogTWF0aC5QSSAvIDE4MFxyXG5cclxuIyBHZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wXHJcbkJ1Lm5vdyA9IGlmIEJ1Lmdsb2JhbC5wZXJmb3JtYW5jZT8gdGhlbiAtPiBCdS5nbG9iYWwucGVyZm9ybWFuY2Uubm93KCkgZWxzZSAtPiBEYXRlLm5vdygpXHJcblxyXG4jIENvbWJpbmUgdGhlIGdpdmVuIG9wdGlvbnMgKGxhc3QgaXRlbSBvZiBhcmd1bWVudHMpIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9uc1xyXG5CdS5jb21iaW5lT3B0aW9ucyA9IChhcmdzLCBkZWZhdWx0T3B0aW9ucykgLT5cclxuXHRkZWZhdWx0T3B0aW9ucyA9IHt9IGlmIG5vdCBkZWZhdWx0T3B0aW9ucz9cclxuXHRnaXZlbk9wdGlvbnMgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV1cclxuXHRpZiBCdS5pc1BsYWluT2JqZWN0IGdpdmVuT3B0aW9uc1xyXG5cdFx0Zm9yIGkgb2YgZ2l2ZW5PcHRpb25zIHdoZW4gZ2l2ZW5PcHRpb25zW2ldP1xyXG5cdFx0XHRkZWZhdWx0T3B0aW9uc1tpXSA9IGdpdmVuT3B0aW9uc1tpXVxyXG5cdHJldHVybiBkZWZhdWx0T3B0aW9uc1xyXG5cclxuIyBDaGVjayBpZiBhbiB2YXJpYWJsZSBpcyBhIG51bWJlclxyXG5CdS5pc051bWJlciA9IChvKSAtPlxyXG5cdHR5cGVvZiBvID09ICdudW1iZXInXHJcblxyXG4jIENoZWNrIGlmIGFuIHZhcmlhYmxlIGlzIGEgc3RyaW5nXHJcbkJ1LmlzU3RyaW5nID0gKG8pIC0+XHJcblx0dHlwZW9mIG8gPT0gJ3N0cmluZydcclxuXHJcbiMgQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGFuIHBsYWluIG9iamVjdCwgbm90IGluc3RhbmNlIG9mIGNsYXNzL2Z1bmN0aW9uXHJcbkJ1LmlzUGxhaW5PYmplY3QgPSAobykgLT5cclxuXHRvIGluc3RhbmNlb2YgT2JqZWN0IGFuZCBvLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ09iamVjdCdcclxuXHJcbiMgQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgZnVuY3Rpb25cclxuQnUuaXNGdW5jdGlvbiA9IChvKSAtPlxyXG5cdG8gaW5zdGFuY2VvZiBPYmplY3QgYW5kIG8uY29uc3RydWN0b3IubmFtZSA9PSAnRnVuY3Rpb24nXHJcblxyXG4jIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIEFycmF5XHJcbkJ1LmlzQXJyYXkgPSAobykgLT5cclxuXHRvIGluc3RhbmNlb2YgQXJyYXlcclxuXHJcbiMgQ2xvbmUgYW4gT2JqZWN0IG9yIEFycmF5XHJcbkJ1LmNsb25lID0gKHRhcmdldCkgLT5cclxuXHRpZiB0eXBlb2YodGFyZ2V0KSAhPSAnb2JqZWN0JyBvciB0YXJnZXQgPT0gbnVsbCBvciBCdS5pc0Z1bmN0aW9uIHRhcmdldFxyXG5cdFx0cmV0dXJuIHRhcmdldFxyXG5cdGVsc2VcclxuXHRcdCMgRklYTUUgY2F1c2Ugc3RhY2sgb3ZlcmZsb3cgd2hlbiBpdHMgYSBjaXJjdWxhciBzdHJ1Y3R1cmVcclxuXHRcdGlmIEJ1LmlzQXJyYXkgdGFyZ2V0XHJcblx0XHRcdGNsb25lID0gW11cclxuXHRcdGVsc2UgaWYgQnUuaXNQbGFpbk9iamVjdCB0YXJnZXRcclxuXHRcdFx0Y2xvbmUgPSB7fVxyXG5cdFx0ZWxzZSAjIGluc3RhbmNlIG9mIGNsYXNzXHJcblx0XHRcdGNsb25lID0gT2JqZWN0LmNyZWF0ZSB0YXJnZXQuY29uc3RydWN0b3IucHJvdG90eXBlXHJcblxyXG5cdFx0Zm9yIG93biBpIG9mIHRhcmdldFxyXG5cdFx0XHRjbG9uZVtpXSA9IEJ1LmNsb25lIHRhcmdldFtpXVxyXG5cclxuXHRcdGlmIGNsb25lLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ0Z1bmN0aW9uJ1xyXG5cdFx0XHRjb25zb2xlLmxvZyhjbG9uZSk7XHJcblx0XHRyZXR1cm4gY2xvbmVcclxuXHJcbiMgVXNlIGxvY2FsU3RvcmFnZSB0byBwZXJzaXN0IGRhdGFcclxuQnUuZGF0YSA9IChrZXksIHZhbHVlKSAtPlxyXG5cdGlmIHZhbHVlP1xyXG5cdFx0bG9jYWxTdG9yYWdlWydCdS4nICsga2V5XSA9IEpTT04uc3RyaW5naWZ5IHZhbHVlXHJcblx0ZWxzZVxyXG5cdFx0dmFsdWUgPSBsb2NhbFN0b3JhZ2VbJ0J1LicgKyBrZXldXHJcblx0XHRpZiB2YWx1ZT8gdGhlbiBKU09OLnBhcnNlIHZhbHVlIGVsc2UgbnVsbFxyXG5cclxuIyBFeGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcclxuQnUucmVhZHkgPSAoY2IsIGNvbnRleHQsIGFyZ3MpIC0+XHJcblx0aWYgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnXHJcblx0XHRjYi5hcHBseSBjb250ZXh0LCBhcmdzXHJcblx0ZWxzZVxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnRE9NQ29udGVudExvYWRlZCcsIC0+IGNiLmFwcGx5IGNvbnRleHQsIGFyZ3NcclxuXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgUG9seWZpbGxcclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiMgU2hvcnRjdXQgdG8gZGVmaW5lIGEgcHJvcGVydHkgZm9yIGEgY2xhc3MuIFRoaXMgaXMgdXNlZCB0byBzb2x2ZSB0aGUgcHJvYmxlbVxyXG4jIHRoYXQgQ29mZmVlU2NyaXB0IGRpZG4ndCBzdXBwb3J0IGdldHRlcnMgYW5kIHNldHRlcnMuXHJcbiMgY2xhc3MgUGVyc29uXHJcbiMgICBAY29uc3RydWN0b3I6IChhZ2UpIC0+XHJcbiMgICAgIEBfYWdlID0gYWdlXHJcbiNcclxuIyAgIEBwcm9wZXJ0eSAnYWdlJyxcclxuIyAgICAgZ2V0OiAtPiBAX2FnZVxyXG4jICAgICBzZXQ6ICh2YWwpIC0+XHJcbiMgICAgICAgQF9hZ2UgPSB2YWxcclxuI1xyXG5GdW5jdGlvbjo6cHJvcGVydHkgPSAocHJvcCwgZGVzYykgLT5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzY1xyXG5cclxuIyBNYWtlIGEgY29weSBvZiB0aGlzIGZ1bmN0aW9uIHdoaWNoIGhhcyBhIGxpbWl0ZWQgc2hvcnRlc3QgZXhlY3V0aW5nIGludGVydmFsLlxyXG5GdW5jdGlvbjo6dGhyb3R0bGUgPSAobGltaXQgPSAwLjUpIC0+XHJcblx0Y3VyclRpbWUgPSAwXHJcblx0bGFzdFRpbWUgPSAwXHJcblxyXG5cdHJldHVybiAoKSA9PlxyXG5cdFx0Y3VyclRpbWUgPSBEYXRlLm5vdygpXHJcblx0XHRpZiBjdXJyVGltZSAtIGxhc3RUaW1lID4gbGltaXQgKiAxMDAwXHJcblx0XHRcdEBhcHBseSBudWxsLCBhcmd1bWVudHNcclxuXHRcdFx0bGFzdFRpbWUgPSBjdXJyVGltZVxyXG5cclxuIyBNYWtlIGEgY29weSBvZiB0aGlzIGZ1bmN0aW9uIHdob3NlIGV4ZWN1dGlvbiB3aWxsIGJlIGNvbnRpbnVvdXNseSBwdXQgb2ZmXHJcbiMgYWZ0ZXIgZXZlcnkgY2FsbGluZyBvZiB0aGlzIGZ1bmN0aW9uLlxyXG5GdW5jdGlvbjo6ZGVib3VuY2UgPSAoZGVsYXkgPSAwLjUpIC0+XHJcblx0YXJncyA9IG51bGxcclxuXHR0aW1lb3V0ID0gbnVsbFxyXG5cclxuXHRsYXRlciA9ID0+XHJcblx0XHRAYXBwbHkgbnVsbCwgYXJnc1xyXG5cclxuXHRyZXR1cm4gKCkgLT5cclxuXHRcdGFyZ3MgPSBhcmd1bWVudHNcclxuXHRcdGNsZWFyVGltZW91dCB0aW1lb3V0XHJcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCBsYXRlciwgZGVsYXkgKiAxMDAwXHJcblxyXG5cclxuIyBJdGVyYXRlIHRoaXMgQXJyYXkgYW5kIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBpdGVtcy5cclxuQXJyYXk6OmVhY2ggb3I9IChmbikgLT5cclxuXHRpID0gMFxyXG5cdHdoaWxlIGkgPCBAbGVuZ3RoXHJcblx0XHRmbiBAW2ldXHJcblx0XHRpKytcclxuXHRyZXR1cm4gQFxyXG5cclxuIyBJdGVyYXRlIHRoaXMgQXJyYXkgYW5kIG1hcCB0aGUgaXRlbXMgdG8gYSBuZXcgQXJyYXkuXHJcbkFycmF5OjptYXAgb3I9IChmbikgLT5cclxuXHRhcnIgPSBbXVxyXG5cdGkgPSAwXHJcblx0d2hpbGUgaSA8IEBsZW5ndGhcclxuXHRcdGFyci5wdXNoIGZuKEBbaV0pXHJcblx0XHRpKytcclxuXHRyZXR1cm4gQFxyXG5cclxuIyBEaXNwbGF5IHZlcnNpb24gaW5mby4gSXQgd2lsbCBhcHBlYXIgYXQgbW9zdCBvbmUgdGltZSBhIG1pbnV0ZS5cclxubGFzdEJvb3RUaW1lID0gQnUuZGF0YSAnbGFzdEluZm8nXHJcbmN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKVxyXG51bmxlc3MgbGFzdEJvb3RUaW1lPyBhbmQgY3VycmVudFRpbWUgLSBsYXN0Qm9vdFRpbWUgPCA2MCAqIDEwMDBcclxuXHRjb25zb2xlLmluZm8/ICdCdS5qcyB2JyArIEJ1LlZFUlNJT04gKyAnIC0gW2h0dHBzOi8vZ2l0aHViLmNvbS9qYXJ2aXNuaXUvQnUuanNdJ1xyXG5cdEJ1LmRhdGEgJ2xhc3RJbmZvJywgY3VycmVudFRpbWVcclxuIiwiIyMgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIGJveFxyXG5cclxuY2xhc3MgQnUuQm91bmRzXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cclxuXHJcblx0XHRAeDEgPSBAeTEgPSBAeDIgPSBAeTIgPSAwXHJcblx0XHRAaXNFbXB0eSA9IHRydWVcclxuXHJcblx0XHRAcG9pbnQxID0gbmV3IEJ1LlZlY3RvclxyXG5cdFx0QHBvaW50MiA9IG5ldyBCdS5WZWN0b3JcclxuXHJcblx0XHRAdXBkYXRlKClcclxuXHJcblx0Y29udGFpbnNQb2ludDogKHApIC0+XHJcblx0XHRAeDEgPCBwLnggJiYgQHgyID4gcC54ICYmIEB5MSA8IHAueSAmJiBAeTIgPiBwLnlcclxuXHJcblx0dXBkYXRlOiAtPlxyXG5cdFx0QGNsZWFyKClcclxuXHRcdHN3aXRjaCBAdGFyZ2V0LnR5cGVcclxuXHRcdFx0d2hlbiAnTGluZScsICdUcmlhbmdsZScsICdSZWN0YW5nbGUnXHJcblx0XHRcdFx0Zm9yIHYgaW4gQHRhcmdldC5wb2ludHNcclxuXHRcdFx0XHRcdEBleHBhbmRCeVBvaW50KHYpXHJcblx0XHRcdHdoZW4gJ0NpcmNsZScsICdCb3cnLCAnRmFuJ1xyXG5cdFx0XHRcdEBleHBhbmRCeUNpcmNsZSBAdGFyZ2V0XHJcblx0XHRcdFx0QHRhcmdldC5vbiAnY2VudGVyQ2hhbmdlZCcsID0+XHJcblx0XHRcdFx0XHRAY2xlYXIoKVxyXG5cdFx0XHRcdFx0QGV4cGFuZEJ5Q2lyY2xlIEB0YXJnZXRcclxuXHRcdFx0XHRAdGFyZ2V0Lm9uICdyYWRpdXNDaGFuZ2VkJywgPT5cclxuXHRcdFx0XHRcdEBjbGVhcigpXHJcblx0XHRcdFx0XHRAZXhwYW5kQnlDaXJjbGUgQHRhcmdldFxyXG5cdFx0XHR3aGVuICdQb2x5bGluZScsICdQb2x5Z29uJ1xyXG5cdFx0XHRcdGZvciB2IGluIEB0YXJnZXQudmVydGljZXNcclxuXHRcdFx0XHRcdEBleHBhbmRCeVBvaW50KHYpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLndhcm4gJ0JvdW5kczogbm90IHN1cHBvcnQgc2hhcGUgdHlwZSBcIicgKyBAdGFyZ2V0LnR5cGUgKyAnXCInXHJcblxyXG5cdGNsZWFyOiAoKSAtPlxyXG5cdFx0QHgxID0gQHkxID0gQHgyID0gQHkyID0gMFxyXG5cdFx0QGlzRW1wdHkgPSB0cnVlXHJcblxyXG5cdGV4cGFuZEJ5UG9pbnQ6ICh2KSAtPlxyXG5cdFx0aWYgQGlzRW1wdHlcclxuXHRcdFx0QGlzRW1wdHkgPSBmYWxzZVxyXG5cdFx0XHRAeDEgPSBAeDIgPSB2LnhcclxuXHRcdFx0QHkxID0gQHkyID0gdi55XHJcblx0XHRlbHNlXHJcblx0XHRcdEB4MSA9IHYueCBpZiB2LnggPCBAeDFcclxuXHRcdFx0QHgyID0gdi54IGlmIHYueCA+IEB4MlxyXG5cdFx0XHRAeTEgPSB2LnkgaWYgdi55IDwgQHkxXHJcblx0XHRcdEB5MiA9IHYueSBpZiB2LnkgPiBAeTJcclxuXHJcblx0ZXhwYW5kQnlDaXJjbGU6IChjKSAtPlxyXG5cdFx0Y3AgPSBjLmNlbnRlclxyXG5cdFx0ciA9IGMucmFkaXVzXHJcblx0XHRpZiBAaXNFbXB0eVxyXG5cdFx0XHRAaXNFbXB0eSA9IGZhbHNlXHJcblx0XHRcdEB4MSA9IGNwLnggLSByXHJcblx0XHRcdEB4MiA9IGNwLnggKyByXHJcblx0XHRcdEB5MSA9IGNwLnkgLSByXHJcblx0XHRcdEB5MiA9IGNwLnkgKyByXHJcblx0XHRlbHNlXHJcblx0XHRcdEB4MSA9IGNwLnggLSByIGlmIGNwLnggLSByIDwgQHgxXHJcblx0XHRcdEB4MiA9IGNwLnggKyByIGlmIGNwLnggKyByID4gQHgyXHJcblx0XHRcdEB5MSA9IGNwLnkgLSByIGlmIGNwLnkgLSByIDwgQHkxXHJcblx0XHRcdEB5MiA9IGNwLnkgKyByIGlmIGNwLnkgKyByID4gQHkyXHJcbiIsIiMgUGFyc2UgYW5kIHNlcmlhbGl6ZSBjb2xvclxuIyBUT0RPIFN1cHBvcnQgaHNsKDAsIDEwMCUsIDUwJSkgZm9ybWF0LlxuXG5jbGFzcyBCdS5Db2xvclxuXG4gICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgIEByID0gQGcgPSBAYiA9IDI1NVxuICAgICAgICBAYSA9IDFcblxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDFcbiAgICAgICAgICAgIGFyZyA9IGFyZ3VtZW50c1swXVxuICAgICAgICAgICAgaWYgQnUuaXNTdHJpbmcgYXJnXG4gICAgICAgICAgICAgICAgQHBhcnNlIGFyZ1xuICAgICAgICAgICAgICAgIEBhID0gY2xhbXBBbHBoYSBAYVxuICAgICAgICAgICAgZWxzZSBpZiBhcmcgaW5zdGFuY2VvZiBCdS5Db2xvclxuICAgICAgICAgICAgICAgIEBjb3B5IGFyZ1xuICAgICAgICBlbHNlICMgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAzIG9yIDRcbiAgICAgICAgICAgIEByID0gYXJndW1lbnRzWzBdXG4gICAgICAgICAgICBAZyA9IGFyZ3VtZW50c1sxXVxuICAgICAgICAgICAgQGIgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgICAgIEBhID0gYXJndW1lbnRzWzNdIG9yIDFcblxuICAgIHBhcnNlOiAoc3RyKSAtPlxuICAgICAgICBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9SR0JBXG4gICAgICAgICAgICBAciA9IHBhcnNlSW50IGZvdW5kWzFdXG4gICAgICAgICAgICBAZyA9IHBhcnNlSW50IGZvdW5kWzJdXG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50IGZvdW5kWzNdXG4gICAgICAgICAgICBAYSA9IHBhcnNlRmxvYXQgZm91bmRbNF1cbiAgICAgICAgZWxzZSBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9SR0JcbiAgICAgICAgICAgIEByID0gcGFyc2VJbnQgZm91bmRbMV1cbiAgICAgICAgICAgIEBnID0gcGFyc2VJbnQgZm91bmRbMl1cbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQgZm91bmRbM11cbiAgICAgICAgICAgIEBhID0gMVxuICAgICAgICBlbHNlIGlmIGZvdW5kID0gc3RyLm1hdGNoIFJFX1JHQkFfUEVSXG4gICAgICAgICAgICBAciA9IHBhcnNlSW50KGZvdW5kWzFdICogMjU1IC8gMTAwKVxuICAgICAgICAgICAgQGcgPSBwYXJzZUludChmb3VuZFsyXSAqIDI1NSAvIDEwMClcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQoZm91bmRbM10gKiAyNTUgLyAxMDApXG4gICAgICAgICAgICBAYSA9IHBhcnNlRmxvYXQgZm91bmRbNF1cbiAgICAgICAgZWxzZSBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9SR0JfUEVSXG4gICAgICAgICAgICBAciA9IHBhcnNlSW50KGZvdW5kWzFdICogMjU1IC8gMTAwKVxuICAgICAgICAgICAgQGcgPSBwYXJzZUludChmb3VuZFsyXSAqIDI1NSAvIDEwMClcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQoZm91bmRbM10gKiAyNTUgLyAxMDApXG4gICAgICAgICAgICBAYSA9IDFcbiAgICAgICAgZWxzZSBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9IRVgzXG4gICAgICAgICAgICBoZXggPSBmb3VuZFsxXVxuICAgICAgICAgICAgQHIgPSBwYXJzZUludCBoZXhbMF0sIDE2XG4gICAgICAgICAgICBAciA9IEByICogMTYgKyBAclxuICAgICAgICAgICAgQGcgPSBwYXJzZUludCBoZXhbMV0sIDE2XG4gICAgICAgICAgICBAZyA9IEBnICogMTYgKyBAZ1xuICAgICAgICAgICAgQGIgPSBwYXJzZUludCBoZXhbMl0sIDE2XG4gICAgICAgICAgICBAYiA9IEBiICogMTYgKyBAYlxuICAgICAgICAgICAgQGEgPSAxXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfSEVYNlxuICAgICAgICAgICAgaGV4ID0gZm91bmRbMV1cbiAgICAgICAgICAgIEByID0gcGFyc2VJbnQgaGV4LnN1YnN0cmluZygwLCAyKSwgMTZcbiAgICAgICAgICAgIEBnID0gcGFyc2VJbnQgaGV4LnN1YnN0cmluZygyLCA0KSwgMTZcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQgaGV4LnN1YnN0cmluZyg0LCA2KSwgMTZcbiAgICAgICAgICAgIEBhID0gMVxuICAgICAgICBlbHNlIGlmIENTUzNfQ09MT1JTW3N0ciA9IHN0ci50b0xvd2VyQ2FzZSgpLnRyaW0oKV0/XG4gICAgICAgICAgICBAciA9IENTUzNfQ09MT1JTW3N0cl1bMF1cbiAgICAgICAgICAgIEBnID0gQ1NTM19DT0xPUlNbc3RyXVsxXVxuICAgICAgICAgICAgQGIgPSBDU1MzX0NPTE9SU1tzdHJdWzJdXG4gICAgICAgICAgICBAYSA9IENTUzNfQ09MT1JTW3N0cl1bM11cbiAgICAgICAgICAgIEBhID0gMSB1bmxlc3MgQGE/XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJCdS5Db2xvci5wYXJzZShcXFwiI3sgc3RyIH1cXFwiKSBlcnJvci5cIlxuICAgICAgICBAXG5cbiAgICBjb3B5OiAoY29sb3IpIC0+XG4gICAgICAgIEByID0gY29sb3IuclxuICAgICAgICBAZyA9IGNvbG9yLmdcbiAgICAgICAgQGIgPSBjb2xvci5iXG4gICAgICAgIEBhID0gY29sb3IuYVxuICAgICAgICBAXG5cbiAgICBzZXRSR0I6IChyLCBnLCBiKSAtPlxuICAgICAgICBAciA9IHBhcnNlSW50IHJcbiAgICAgICAgQGcgPSBwYXJzZUludCBnXG4gICAgICAgIEBiID0gcGFyc2VJbnQgYlxuICAgICAgICBAYSA9IDFcbiAgICAgICAgQFxuXG4gICAgc2V0UkdCQTogKHIsIGcsIGIsIGEpIC0+XG4gICAgICAgIEByID0gcGFyc2VJbnQgclxuICAgICAgICBAZyA9IHBhcnNlSW50IGdcbiAgICAgICAgQGIgPSBwYXJzZUludCBiXG4gICAgICAgIEBhID0gY2xhbXBBbHBoYSBwYXJzZUZsb2F0IGFcbiAgICAgICAgQFxuXG4gICAgdG9SR0I6IC0+XG4gICAgICAgIFwicmdiKCN7IEByIH0sICN7IEBnIH0sICN7IEBiIH0pXCJcblxuICAgIHRvUkdCQTogLT5cbiAgICAgICAgXCJyZ2JhKCN7IEByIH0sICN7IEBnIH0sICN7IEBiIH0sICN7IEBhIH0pXCJcblxuXG4gICAgIyBQcml2YXRlIGZ1bmN0aW9uc1xuXG4gICAgY2xhbXBBbHBoYSA9IChhKSAtPiBCdS5jbGFtcCBhLCAwLCAxXG5cblxuICAgICMgUHJpdmF0ZSB2YXJpYWJsZXNcblxuICAgIFJFX1JHQiA9IC9yZ2JcXChcXHMqKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKVxccypcXCkvaVxuICAgIFJFX1JHQkEgPSAvcmdiYVxcKFxccyooXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspXFxzKixcXHMqKFsuXFxkXSspXFxzKlxcKS9pXG4gICAgUkVfUkdCX1BFUiA9IC9yZ2JcXChcXHMqKFxcZCspJSxcXHMqKFxcZCspJSxcXHMqKFxcZCspJVxccypcXCkvaVxuICAgIFJFX1JHQkFfUEVSID0gL3JnYmFcXChcXHMqKFxcZCspJSxcXHMqKFxcZCspJSxcXHMqKFxcZCspJVxccyosXFxzKihbLlxcZF0rKVxccypcXCkvaVxuICAgIFJFX0hFWDMgPSAvIyhbMC05QS1GXXszfSlcXHMqJC9pXG4gICAgUkVfSEVYNiA9IC8jKFswLTlBLUZdezZ9KVxccyokL2lcbiAgICBDU1MzX0NPTE9SUyA9XG4gICAgICAgIHRyYW5zcGFyZW50OiBbMCwgMCwgMCwgMF1cblxuICAgICAgICBhbGljZWJsdWU6IFsyNDAsIDI0OCwgMjU1XVxuICAgICAgICBhbnRpcXVld2hpdGU6IFsyNTAsIDIzNSwgMjE1XVxuICAgICAgICBhcXVhOiBbMCwgMjU1LCAyNTVdXG4gICAgICAgIGFxdWFtYXJpbmU6IFsxMjcsIDI1NSwgMjEyXVxuICAgICAgICBhenVyZTogWzI0MCwgMjU1LCAyNTVdXG4gICAgICAgIGJlaWdlOiBbMjQ1LCAyNDUsIDIyMF1cbiAgICAgICAgYmlzcXVlOiBbMjU1LCAyMjgsIDE5Nl1cbiAgICAgICAgYmxhY2s6IFswLCAwLCAwXVxuICAgICAgICBibGFuY2hlZGFsbW9uZDogWzI1NSwgMjM1LCAyMDVdXG4gICAgICAgIGJsdWU6IFswLCAwLCAyNTVdXG4gICAgICAgIGJsdWV2aW9sZXQ6IFsxMzgsIDQzLCAyMjZdXG4gICAgICAgIGJyb3duOiBbMTY1LCA0MiwgNDJdXG4gICAgICAgIGJ1cmx5d29vZDogWzIyMiwgMTg0LCAxMzVdXG4gICAgICAgIGNhZGV0Ymx1ZTogWzk1LCAxNTgsIDE2MF1cbiAgICAgICAgY2hhcnRyZXVzZTogWzEyNywgMjU1LCAwXVxuICAgICAgICBjaG9jb2xhdGU6IFsyMTAsIDEwNSwgMzBdXG4gICAgICAgIGNvcmFsOiBbMjU1LCAxMjcsIDgwXVxuICAgICAgICBjb3JuZmxvd2VyYmx1ZTogWzEwMCwgMTQ5LCAyMzddXG4gICAgICAgIGNvcm5zaWxrOiBbMjU1LCAyNDgsIDIyMF1cbiAgICAgICAgY3JpbXNvbjogWzIyMCwgMjAsIDYwXVxuICAgICAgICBjeWFuOiBbMCwgMjU1LCAyNTVdXG4gICAgICAgIGRhcmtibHVlOiBbMCwgMCwgMTM5XVxuICAgICAgICBkYXJrY3lhbjogWzAsIDEzOSwgMTM5XVxuICAgICAgICBkYXJrZ29sZGVucm9kOiBbMTg0LCAxMzQsIDExXVxuICAgICAgICBkYXJrZ3JheTogWzE2OSwgMTY5LCAxNjldXG4gICAgICAgIGRhcmtncmVlbjogWzAsIDEwMCwgMF1cbiAgICAgICAgZGFya2dyZXk6IFsxNjksIDE2OSwgMTY5XVxuICAgICAgICBkYXJra2hha2k6IFsxODksIDE4MywgMTA3XVxuICAgICAgICBkYXJrbWFnZW50YTogWzEzOSwgMCwgMTM5XVxuICAgICAgICBkYXJrb2xpdmVncmVlbjogWzg1LCAxMDcsIDQ3XVxuICAgICAgICBkYXJrb3JhbmdlOiBbMjU1LCAxNDAsIDBdXG4gICAgICAgIGRhcmtvcmNoaWQ6IFsxNTMsIDUwLCAyMDRdXG4gICAgICAgIGRhcmtyZWQ6IFsxMzksIDAsIDBdXG4gICAgICAgIGRhcmtzYWxtb246IFsyMzMsIDE1MCwgMTIyXVxuICAgICAgICBkYXJrc2VhZ3JlZW46IFsxNDMsIDE4OCwgMTQzXVxuICAgICAgICBkYXJrc2xhdGVibHVlOiBbNzIsIDYxLCAxMzldXG4gICAgICAgIGRhcmtzbGF0ZWdyYXk6IFs0NywgNzksIDc5XVxuICAgICAgICBkYXJrc2xhdGVncmV5OiBbNDcsIDc5LCA3OV1cbiAgICAgICAgZGFya3R1cnF1b2lzZTogWzAsIDIwNiwgMjA5XVxuICAgICAgICBkYXJrdmlvbGV0OiBbMTQ4LCAwLCAyMTFdXG4gICAgICAgIGRlZXBwaW5rOiBbMjU1LCAyMCwgMTQ3XVxuICAgICAgICBkZWVwc2t5Ymx1ZTogWzAsIDE5MSwgMjU1XVxuICAgICAgICBkaW1ncmF5OiBbMTA1LCAxMDUsIDEwNV1cbiAgICAgICAgZGltZ3JleTogWzEwNSwgMTA1LCAxMDVdXG4gICAgICAgIGRvZGdlcmJsdWU6IFszMCwgMTQ0LCAyNTVdXG4gICAgICAgIGZpcmVicmljazogWzE3OCwgMzQsIDM0XVxuICAgICAgICBmbG9yYWx3aGl0ZTogWzI1NSwgMjUwLCAyNDBdXG4gICAgICAgIGZvcmVzdGdyZWVuOiBbMzQsIDEzOSwgMzRdXG4gICAgICAgIGZ1Y2hzaWE6IFsyNTUsIDAsIDI1NV1cbiAgICAgICAgZ2FpbnNib3JvOiBbMjIwLCAyMjAsIDIyMF1cbiAgICAgICAgZ2hvc3R3aGl0ZTogWzI0OCwgMjQ4LCAyNTVdXG4gICAgICAgIGdvbGQ6IFsyNTUsIDIxNSwgMF1cbiAgICAgICAgZ29sZGVucm9kOiBbMjE4LCAxNjUsIDMyXVxuICAgICAgICBncmF5OiBbMTI4LCAxMjgsIDEyOF1cbiAgICAgICAgZ3JlZW46IFswLCAxMjgsIDBdXG4gICAgICAgIGdyZWVueWVsbG93OiBbMTczLCAyNTUsIDQ3XVxuICAgICAgICBncmV5OiBbMTI4LCAxMjgsIDEyOF1cbiAgICAgICAgaG9uZXlkZXc6IFsyNDAsIDI1NSwgMjQwXVxuICAgICAgICBob3RwaW5rOiBbMjU1LCAxMDUsIDE4MF1cbiAgICAgICAgaW5kaWFucmVkOiBbMjA1LCA5MiwgOTJdXG4gICAgICAgIGluZGlnbzogWzc1LCAwLCAxMzBdXG4gICAgICAgIGl2b3J5OiBbMjU1LCAyNTUsIDI0MF1cbiAgICAgICAga2hha2k6IFsyNDAsIDIzMCwgMTQwXVxuICAgICAgICBsYXZlbmRlcjogWzIzMCwgMjMwLCAyNTBdXG4gICAgICAgIGxhdmVuZGVyYmx1c2g6IFsyNTUsIDI0MCwgMjQ1XVxuICAgICAgICBsYXduZ3JlZW46IFsxMjQsIDI1MiwgMF1cbiAgICAgICAgbGVtb25jaGlmZm9uOiBbMjU1LCAyNTAsIDIwNV1cbiAgICAgICAgbGlnaHRibHVlOiBbMTczLCAyMTYsIDIzMF1cbiAgICAgICAgbGlnaHRjb3JhbDogWzI0MCwgMTI4LCAxMjhdXG4gICAgICAgIGxpZ2h0Y3lhbjogWzIyNCwgMjU1LCAyNTVdXG4gICAgICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiBbMjUwLCAyNTAsIDIxMF1cbiAgICAgICAgbGlnaHRncmF5OiBbMjExLCAyMTEsIDIxMV1cbiAgICAgICAgbGlnaHRncmVlbjogWzE0NCwgMjM4LCAxNDRdXG4gICAgICAgIGxpZ2h0Z3JleTogWzIxMSwgMjExLCAyMTFdXG4gICAgICAgIGxpZ2h0cGluazogWzI1NSwgMTgyLCAxOTNdXG4gICAgICAgIGxpZ2h0c2FsbW9uOiBbMjU1LCAxNjAsIDEyMl1cbiAgICAgICAgbGlnaHRzZWFncmVlbjogWzMyLCAxNzgsIDE3MF1cbiAgICAgICAgbGlnaHRza3libHVlOiBbMTM1LCAyMDYsIDI1MF1cbiAgICAgICAgbGlnaHRzbGF0ZWdyYXk6IFsxMTksIDEzNiwgMTUzXVxuICAgICAgICBsaWdodHNsYXRlZ3JleTogWzExOSwgMTM2LCAxNTNdXG4gICAgICAgIGxpZ2h0c3RlZWxibHVlOiBbMTc2LCAxOTYsIDIyMl1cbiAgICAgICAgbGlnaHR5ZWxsb3c6IFsyNTUsIDI1NSwgMjI0XVxuICAgICAgICBsaW1lOiBbMCwgMjU1LCAwXVxuICAgICAgICBsaW1lZ3JlZW46IFs1MCwgMjA1LCA1MF1cbiAgICAgICAgbGluZW46IFsyNTAsIDI0MCwgMjMwXVxuICAgICAgICBtYWdlbnRhOiBbMjU1LCAwLCAyNTVdXG4gICAgICAgIG1hcm9vbjogWzEyOCwgMCwgMF1cbiAgICAgICAgbWVkaXVtYXF1YW1hcmluZTogWzEwMiwgMjA1LCAxNzBdXG4gICAgICAgIG1lZGl1bWJsdWU6IFswLCAwLCAyMDVdXG4gICAgICAgIG1lZGl1bW9yY2hpZDogWzE4NiwgODUsIDIxMV1cbiAgICAgICAgbWVkaXVtcHVycGxlOiBbMTQ3LCAxMTIsIDIxOV1cbiAgICAgICAgbWVkaXVtc2VhZ3JlZW46IFs2MCwgMTc5LCAxMTNdXG4gICAgICAgIG1lZGl1bXNsYXRlYmx1ZTogWzEyMywgMTA0LCAyMzhdXG4gICAgICAgIG1lZGl1bXNwcmluZ2dyZWVuOiBbMCwgMjUwLCAxNTRdXG4gICAgICAgIG1lZGl1bXR1cnF1b2lzZTogWzcyLCAyMDksIDIwNF1cbiAgICAgICAgbWVkaXVtdmlvbGV0cmVkOiBbMTk5LCAyMSwgMTMzXVxuICAgICAgICBtaWRuaWdodGJsdWU6IFsyNSwgMjUsIDExMl1cbiAgICAgICAgbWludGNyZWFtOiBbMjQ1LCAyNTUsIDI1MF1cbiAgICAgICAgbWlzdHlyb3NlOiBbMjU1LCAyMjgsIDIyNV1cbiAgICAgICAgbW9jY2FzaW46IFsyNTUsIDIyOCwgMTgxXVxuICAgICAgICBuYXZham93aGl0ZTogWzI1NSwgMjIyLCAxNzNdXG4gICAgICAgIG5hdnk6IFswLCAwLCAxMjhdXG4gICAgICAgIG9sZGxhY2U6IFsyNTMsIDI0NSwgMjMwXVxuICAgICAgICBvbGl2ZTogWzEyOCwgMTI4LCAwXVxuICAgICAgICBvbGl2ZWRyYWI6IFsxMDcsIDE0MiwgMzVdXG4gICAgICAgIG9yYW5nZTogWzI1NSwgMTY1LCAwXVxuICAgICAgICBvcmFuZ2VyZWQ6IFsyNTUsIDY5LCAwXVxuICAgICAgICBvcmNoaWQ6IFsyMTgsIDExMiwgMjE0XVxuICAgICAgICBwYWxlZ29sZGVucm9kOiBbMjM4LCAyMzIsIDE3MF1cbiAgICAgICAgcGFsZWdyZWVuOiBbMTUyLCAyNTEsIDE1Ml1cbiAgICAgICAgcGFsZXR1cnF1b2lzZTogWzE3NSwgMjM4LCAyMzhdXG4gICAgICAgIHBhbGV2aW9sZXRyZWQ6IFsyMTksIDExMiwgMTQ3XVxuICAgICAgICBwYXBheWF3aGlwOiBbMjU1LCAyMzksIDIxM11cbiAgICAgICAgcGVhY2hwdWZmOiBbMjU1LCAyMTgsIDE4NV1cbiAgICAgICAgcGVydTogWzIwNSwgMTMzLCA2M11cbiAgICAgICAgcGluazogWzI1NSwgMTkyLCAyMDNdXG4gICAgICAgIHBsdW06IFsyMjEsIDE2MCwgMjIxXVxuICAgICAgICBwb3dkZXJibHVlOiBbMTc2LCAyMjQsIDIzMF1cbiAgICAgICAgcHVycGxlOiBbMTI4LCAwLCAxMjhdXG4gICAgICAgIHJlZDogWzI1NSwgMCwgMF1cbiAgICAgICAgcm9zeWJyb3duOiBbMTg4LCAxNDMsIDE0M11cbiAgICAgICAgcm95YWxibHVlOiBbNjUsIDEwNSwgMjI1XVxuICAgICAgICBzYWRkbGVicm93bjogWzEzOSwgNjksIDE5XVxuICAgICAgICBzYWxtb246IFsyNTAsIDEyOCwgMTE0XVxuICAgICAgICBzYW5keWJyb3duOiBbMjQ0LCAxNjQsIDk2XVxuICAgICAgICBzZWFncmVlbjogWzQ2LCAxMzksIDg3XVxuICAgICAgICBzZWFzaGVsbDogWzI1NSwgMjQ1LCAyMzhdXG4gICAgICAgIHNpZW5uYTogWzE2MCwgODIsIDQ1XVxuICAgICAgICBzaWx2ZXI6IFsxOTIsIDE5MiwgMTkyXVxuICAgICAgICBza3libHVlOiBbMTM1LCAyMDYsIDIzNV1cbiAgICAgICAgc2xhdGVibHVlOiBbMTA2LCA5MCwgMjA1XVxuICAgICAgICBzbGF0ZWdyYXk6IFsxMTIsIDEyOCwgMTQ0XVxuICAgICAgICBzbGF0ZWdyZXk6IFsxMTIsIDEyOCwgMTQ0XVxuICAgICAgICBzbm93OiBbMjU1LCAyNTAsIDI1MF1cbiAgICAgICAgc3ByaW5nZ3JlZW46IFswLCAyNTUsIDEyN11cbiAgICAgICAgc3RlZWxibHVlOiBbNzAsIDEzMCwgMTgwXVxuICAgICAgICB0YW46IFsyMTAsIDE4MCwgMTQwXVxuICAgICAgICB0ZWFsOiBbMCwgMTI4LCAxMjhdXG4gICAgICAgIHRoaXN0bGU6IFsyMTYsIDE5MSwgMjE2XVxuICAgICAgICB0b21hdG86IFsyNTUsIDk5LCA3MV1cbiAgICAgICAgdHVycXVvaXNlOiBbNjQsIDIyNCwgMjA4XVxuICAgICAgICB2aW9sZXQ6IFsyMzgsIDEzMCwgMjM4XVxuICAgICAgICB3aGVhdDogWzI0NSwgMjIyLCAxNzldXG4gICAgICAgIHdoaXRlOiBbMjU1LCAyNTUsIDI1NV1cbiAgICAgICAgd2hpdGVzbW9rZTogWzI0NSwgMjQ1LCAyNDVdXG4gICAgICAgIHllbGxvdzogWzI1NSwgMjU1LCAwXVxuICAgICAgICB5ZWxsb3dncmVlbjogWzE1NCwgMjA1LCA1MF1cbiIsIiMgdGhlIHNpemUgb2YgcmVjdGFuZ2xlLCBCb3VuZHMgZXRjLlxyXG5cclxuY2xhc3MgQnUuU2l6ZVxyXG5cdGNvbnN0cnVjdG9yOiAoQHdpZHRoLCBAaGVpZ2h0KSAtPlxyXG5cdFx0QHR5cGUgPSAnU2l6ZSdcclxuXHJcblx0c2V0OiAoQHdpZHRoLCBAaGVpZ2h0KSAtPlxyXG4iLCIjIDJkIHZlY3RvclxyXG5cclxuY2xhc3MgQnUuVmVjdG9yXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHggPSAwLCBAeSA9IDApIC0+XHJcblxyXG5cdHNldDogKEB4LCBAeSkgLT5cclxuIiwiIyBEZWNsYXJhdGl2ZSBmcmFtZXdvcmsgZm9yIEJ1LmpzIGFwcHNcclxuXHJcbiMjIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IyNcclxuQWxsIHN1cHBvcnRlZCBjb25zdHJ1Y3RvciBvcHRpb25zOlxyXG4oVGhlIGFwcGVhcmFuY2Ugc2VxdWVuY2UgaXMgdGhlIHByb2Nlc3Mgc2VxdWVuY2UuKVxyXG57XHJcbiAgICByZW5kZXJlcjogIyBzZXR0aW5ncyB0byB0aGUgcmVuZGVyZXJcclxuICAgIFx0Y29udGFpbmVyOiAnI2NvbnRhaW5lcicgIyBjc3Mgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciBkb20gb3IgaXRzZWxmXHJcbiAgICAgICAgY3Vyc29yOiAnY3Jvc3NoYW5kJyAjIHRoZSBkZWZhdWx0IGN1cnNvciBzdHlsZSBvbiB0aGUgPGNhbnZhcz5cclxuICAgICAgICBiYWNrZ3JvdW5kOiAncGluaycgIyB0aGUgZGVmYXVsdCBiYWNrZ3JvdW5kIG9mIHRoZSA8Y2FudmFzPlxyXG4gICAgXHRzaG93S2V5UG9pbnRzOiB0cnVlICMgd2hldGhlciB0byBzaG93IHRoZSBrZXkgcG9pbnRzIG9mIHNoYXBlcyAoaWYgdGhleSBoYXZlKS5cclxuICAgIGRhdGE6IHsgdmFyIH0gIyB2YXJpYWJsZXMgb2YgdGhpcyBCdS5qcyBhcHAsIHdpbGwgYmUgY29waWVkIHRvIHRoZSBhcHAgb2JqZWN0XHJcbiAgICBtZXRob2RzOiB7IGZ1bmN0aW9uIH0jIGZ1bmN0aW9ucyBvZiB0aGlzIEJ1LmpzIGFwcCwgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIGFwcCBvYmplY3RcclxuICAgIG9iamVjdHM6IHt9IG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB7fSAjIGFsbCB0aGUgcmVuZGVyYWJsZSBvYmplY3RzXHJcblx0aGllcmFyY2h5OiAjIGFuIHRyZWUgdGhhdCByZXByZXNlbnQgdGhlIG9iamVjdCBoaWVyYXJjaHkgb2YgdGhlIHNjZW5lLCB0aGUga2V5cyBhcmUgaW4gYG9iamVjdHNgXHJcbiAgICBldmVudHM6ICMgZXZlbnQgbGlzdGVuZXJzLCAnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJyB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgYm91bmQgdG8gPGNhbnZhcz5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICMgY2FsbGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICMgY2FsbGVkIGV2ZXJ5IGZyYW1lXHJcbn1cclxuIyM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSMjI1xyXG5cclxuY2xhc3MgQnUuQXBwXHJcblxyXG5cdCRvYmplY3RzOiB7fVxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zID0ge30pIC0+XHJcblx0XHRmb3IgayBpbiBbXCJyZW5kZXJlclwiLCBcImNhbWVyYVwiLCBcImRhdGFcIiwgXCJvYmplY3RzXCIsIFwiaGllcmFyY2h5XCIsIFwibWV0aG9kc1wiLCBcImV2ZW50c1wiXVxyXG5cdFx0XHRAb3B0aW9uc1trXSBvcj0ge31cclxuXHJcblx0XHRCdS5yZWFkeSBAaW5pdCwgQFxyXG5cclxuXHRpbml0OiAoKSAtPlxyXG5cdFx0IyByZW5kZXJlclxyXG5cdFx0QCRyZW5kZXJlciA9IG5ldyBCdS5SZW5kZXJlciBAb3B0aW9ucy5yZW5kZXJlclxyXG5cclxuXHRcdCMgZGF0YVxyXG5cdFx0aWYgQnUuaXNGdW5jdGlvbiBAb3B0aW9ucy5kYXRhXHJcblx0XHRcdEBvcHRpb25zLmRhdGEgPSBAb3B0aW9ucy5kYXRhLmFwcGx5IHRoaXNcclxuXHRcdEBba10gPSBAb3B0aW9ucy5kYXRhW2tdIGZvciBrIG9mIEBvcHRpb25zLmRhdGFcclxuXHJcblx0XHQjIG1ldGhvZHNcclxuXHRcdEBba10gPSBAb3B0aW9ucy5tZXRob2RzW2tdIGZvciBrIG9mIEBvcHRpb25zLm1ldGhvZHNcclxuXHJcblx0XHQjIG9iamVjdHNcclxuXHRcdGlmIEJ1LmlzRnVuY3Rpb24gQG9wdGlvbnMub2JqZWN0c1xyXG5cdFx0XHRAJG9iamVjdHMgPSBAb3B0aW9ucy5vYmplY3RzLmFwcGx5IHRoaXNcclxuXHRcdGVsc2VcclxuXHRcdFx0QCRvYmplY3RzW25hbWVdID0gQG9wdGlvbnMub2JqZWN0c1tuYW1lXSBmb3IgbmFtZSBvZiBAb3B0aW9ucy5vYmplY3RzXHJcblxyXG5cdFx0IyBoaWVyYXJjaHlcclxuXHRcdCMgVE9ETyB1c2UgYW4gYWxnb3JpdGhtIHRvIGF2b2lkIGNpcmN1bGFyIHN0cnVjdHVyZVxyXG5cdFx0YXNzZW1ibGVPYmplY3RzID0gKGNoaWxkcmVuLCBwYXJlbnQpID0+XHJcblx0XHRcdGZvciBvd24gbmFtZSBvZiBjaGlsZHJlblxyXG5cdFx0XHRcdHBhcmVudC5jaGlsZHJlbi5wdXNoIEAkb2JqZWN0c1tuYW1lXVxyXG5cdFx0XHRcdGFzc2VtYmxlT2JqZWN0cyBjaGlsZHJlbltuYW1lXSwgQCRvYmplY3RzW25hbWVdXHJcblx0XHRhc3NlbWJsZU9iamVjdHMgQG9wdGlvbnMuaGllcmFyY2h5LCBAJHJlbmRlcmVyLnNjZW5lXHJcblxyXG5cdFx0IyBpbml0XHJcblx0XHRAb3B0aW9ucy5pbml0Py5jYWxsIEBcclxuXHJcblx0XHQjIGV2ZW50c1xyXG5cdFx0QGV2ZW50cyA9IEBvcHRpb25zLmV2ZW50c1xyXG5cdFx0Zm9yIHR5cGUgb2YgQGV2ZW50c1xyXG5cdFx0XHRpZiB0eXBlID09ICdtb3VzZWRvd24nXHJcblx0XHRcdFx0QCRyZW5kZXJlci5kb20uYWRkRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgKGUpID0+IEBldmVudHNbJ21vdXNlZG93biddLmNhbGwgdGhpcywgZVxyXG5cdFx0XHRlbHNlIGlmIHR5cGUgPT0gJ21vdXNlbW92ZSdcclxuXHRcdFx0XHRAJHJlbmRlcmVyLmRvbS5hZGRFdmVudExpc3RlbmVyICdtb3VzZW1vdmUnLCAoZSkgPT4gQGV2ZW50c1snbW91c2Vtb3ZlJ10uY2FsbCB0aGlzLCBlXHJcblx0XHRcdGVsc2UgaWYgdHlwZSA9PSAnbW91c2V1cCdcclxuXHRcdFx0XHRAJHJlbmRlcmVyLmRvbS5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgKGUpID0+IEBldmVudHNbJ21vdXNldXAnXS5jYWxsIHRoaXMsIGVcclxuXHRcdCMgVE9ETyBhZGQgc3VwcG9ydHMgZm9yIFwia2V5ZG93bi5DdHJsK0ZcIiwgXCJtb3VzZWRvd24uTGVmdFwiXHJcblxyXG5cdFx0IyB1cGRhdGVcclxuXHRcdGlmIEBvcHRpb25zLnVwZGF0ZT9cclxuXHRcdFx0QCRyZW5kZXJlci5vbiAndXBkYXRlJywgPT4gQG9wdGlvbnMudXBkYXRlLmFwcGx5IHRoaXMsIGFyZ3VtZW50c1xyXG5cclxuXHR0cmlnZ2VyOiAodHlwZSwgYXJnKSAtPlxyXG5cdFx0QGV2ZW50c1t0eXBlXT8uY2FsbCBALCBhcmdcclxuIiwiIyBBZGQgY29sb3IgdG8gdGhlIHNoYXBlc1xyXG4jIFRoaXMgb2JqZWN0IGlzIGRlZGljYXRlZCB0byBtaXhlZC1pbiB0aGUgT2JqZWN0MkQuXHJcblxyXG5CdS5Db2xvcmZ1bCA9ICgpIC0+XHJcblx0QHN0cm9rZVN0eWxlID0gQnUuREVGQVVMVF9TVFJPS0VfU1RZTEVcclxuXHRAZmlsbFN0eWxlID0gQnUuREVGQVVMVF9GSUxMX1NUWUxFXHJcblx0QGRhc2hTdHlsZSA9IGZhbHNlXHJcblxyXG5cdEBsaW5lV2lkdGggPSAxXHJcblx0QGRhc2hPZmZzZXQgPSAwXHJcblxyXG5cdCMgU2V0IHRoZSBzdHJva2Ugc3R5bGUgb2YgdGhlIGBPYmplY3QyRGBcclxuXHRAc3Ryb2tlID0gKHYpIC0+XHJcblx0XHR2ID0gdHJ1ZSBpZiBub3Qgdj9cclxuXHRcdHN3aXRjaCB2XHJcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBzdHJva2VTdHlsZSA9IEJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFXHJcblx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAc3Ryb2tlU3R5bGUgPSBudWxsXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAc3Ryb2tlU3R5bGUgPSB2XHJcblx0XHRAXHJcblxyXG5cdCMgU2V0IHRoZSBmaWxsIHN0eWxlIG9mIHRoZSBgT2JqZWN0MkRgXHJcblx0QGZpbGwgPSAodikgLT5cclxuXHRcdHYgPSB0cnVlIGlmIG5vdCB2P1xyXG5cdFx0c3dpdGNoIHZcclxuXHRcdFx0d2hlbiBmYWxzZSB0aGVuIEBmaWxsU3R5bGUgPSBudWxsXHJcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBmaWxsU3R5bGUgPSBCdS5ERUZBVUxUX0ZJTExfU1RZTEVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdEBmaWxsU3R5bGUgPSB2XHJcblx0XHRAXHJcblxyXG5cdCMgU2V0IHRoZSBkYXNoIHN0eWxlIG9mIHRoZSBgT2JqZWN0MkRgXHJcblx0QGRhc2ggPSAodikgLT5cclxuXHRcdHYgPSB0cnVlIGlmIG5vdCB2P1xyXG5cdFx0diA9IFt2LCB2XSBpZiBCdS5pc051bWJlciB2XHJcblx0XHRzd2l0Y2ggdlxyXG5cdFx0XHR3aGVuIGZhbHNlIHRoZW4gQGRhc2hTdHlsZSA9IG51bGxcclxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gQGRhc2hTdHlsZSA9IEJ1LkRFRkFVTFRfREFTSF9TVFlMRVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGRhc2hTdHlsZSA9IHZcclxuXHRcdEBcclxuIiwiIyBBZGQgZXZlbnQgbGlzdGVuZXIgZmVhdHVyZSB0byBjdXN0b20gb2JqZWN0c1xyXG5cclxuQnUuRXZlbnQgPSAtPlxyXG5cdHR5cGVzID0ge31cclxuXHJcblx0QG9uID0gKHR5cGUsIGxpc3RlbmVyKSAtPlxyXG5cdFx0bGlzdGVuZXJzID0gdHlwZXNbdHlwZV0gb3I9IFtdXHJcblx0XHRsaXN0ZW5lcnMucHVzaCBsaXN0ZW5lciBpZiBsaXN0ZW5lcnMuaW5kZXhPZiBsaXN0ZW5lciA9PSAtMVxyXG5cclxuXHRAb25jZSA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVyLm9uY2UgPSB0cnVlXHJcblx0XHRAb24gdHlwZSwgbGlzdGVuZXJcclxuXHJcblx0QG9mZiA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVycyA9IHR5cGVzW3R5cGVdXHJcblx0XHRpZiBsaXN0ZW5lcj9cclxuXHRcdFx0aWYgbGlzdGVuZXJzP1xyXG5cdFx0XHRcdGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YgbGlzdGVuZXJcclxuXHRcdFx0XHRsaXN0ZW5lcnMuc3BsaWNlIGluZGV4LCAxIGlmIGluZGV4ID4gLTFcclxuXHRcdGVsc2VcclxuXHRcdFx0bGlzdGVuZXJzLmxlbmd0aCA9IDAgaWYgbGlzdGVuZXJzP1xyXG5cclxuXHRAdHJpZ2dlciA9ICh0eXBlLCBldmVudERhdGEpIC0+XHJcblx0XHRsaXN0ZW5lcnMgPSB0eXBlc1t0eXBlXVxyXG5cclxuXHRcdGlmIGxpc3RlbmVycz9cclxuXHRcdFx0ZXZlbnREYXRhIG9yPSB7fVxyXG5cdFx0XHRldmVudERhdGEudGFyZ2V0ID0gQFxyXG5cdFx0XHRmb3IgbGlzdGVuZXIgaW4gbGlzdGVuZXJzXHJcblx0XHRcdFx0bGlzdGVuZXIuY2FsbCB0aGlzLCBldmVudERhdGFcclxuXHRcdFx0XHRpZiBsaXN0ZW5lci5vbmNlXHJcblx0XHRcdFx0XHRsaXN0ZW5lcnMuc3BsaWNlIGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSwgMVxyXG4iLCIjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIE1pY3JvSlF1ZXJ5IC0gQSBtaWNybyB2ZXJzaW9uIG9mIGpRdWVyeVxyXG4jXHJcbiMgU3VwcG9ydGVkIGZlYXR1cmVzOlxyXG4jICAgJC4gLSBzdGF0aWMgbWV0aG9kc1xyXG4jICAgICAucmVhZHkoY2IpIC0gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHBhZ2UgaXMgbG9hZGVkXHJcbiMgICAgIC5hamF4KFt1cmwsXSBvcHRpb25zKSAtIHBlcmZvcm0gYW4gYWpheCByZXF1ZXN0XHJcbiMgICAkKHNlbGVjdG9yKSAtIHNlbGVjdCBlbGVtZW50KHMpXHJcbiMgICAgIC5vbih0eXBlLCBjYWxsYmFjaykgLSBhZGQgYW4gZXZlbnQgbGlzdGVuZXJcclxuIyAgICAgLm9mZih0eXBlLCBjYWxsYmFjaykgLSByZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXJcclxuIyAgICAgLmFwcGVuZCh0YWdOYW1lKSAtIGFwcGVuZCBhIHRhZ1xyXG4jICAgICAudGV4dCh0ZXh0KSAtIHNldCB0aGUgaW5uZXIgdGV4dFxyXG4jICAgICAuaHRtbChodG1sVGV4dCkgLSBzZXQgdGhlIGlubmVyIEhUTUxcclxuIyAgICAgLnN0eWxlKG5hbWUsIHZhbHVlKSAtIHNldCBzdHlsZSAoYSBjc3MgYXR0cmlidXRlKVxyXG4jICAgICAjLmNzcyhvYmplY3QpIC0gc2V0IHN0eWxlcyAobXVsdGlwbGUgY3NzIGF0dHJpYnV0ZSlcclxuIyAgICAgLmhhc0NsYXNzKGNsYXNzTmFtZSkgLSBkZXRlY3Qgd2hldGhlciBhIGNsYXNzIGV4aXN0c1xyXG4jICAgICAuYWRkQ2xhc3MoY2xhc3NOYW1lKSAtIGFkZCBhIGNsYXNzXHJcbiMgICAgIC5yZW1vdmVDbGFzcyhjbGFzc05hbWUpIC0gcmVtb3ZlIGEgY2xhc3NcclxuIyAgICAgLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkgLSB0b2dnbGUgYSBjbGFzc1xyXG4jICAgICAuYXR0cihuYW1lLCB2YWx1ZSkgLSBzZXQgYW4gYXR0cmlidXRlXHJcbiMgICAgIC5oYXNBdHRyKG5hbWUpIC0gZGV0ZWN0IHdoZXRoZXIgYW4gYXR0cmlidXRlIGV4aXN0c1xyXG4jICAgICAucmVtb3ZlQXR0cihuYW1lKSAtIHJlbW92ZSBhbiBhdHRyaWJ1dGVcclxuIyAgIE5vdGVzOlxyXG4jICAgICAgICAjIGlzIHBsYW5uZWQgYnV0IG5vdCBpbXBsZW1lbnRlZFxyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKChnbG9iYWwpIC0+XHJcblxyXG5cdCMgc2VsZWN0b3JcclxuXHRnbG9iYWwuJCA9IChzZWxlY3RvcikgLT5cclxuXHRcdHNlbGVjdGlvbnMgPSBbXVxyXG5cdFx0aWYgdHlwZW9mIHNlbGVjdG9yID09ICdzdHJpbmcnXHJcblx0XHRcdHNlbGVjdGlvbnMgPSBbXS5zbGljZS5jYWxsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgc2VsZWN0b3JcclxuXHRcdGpRdWVyeS5hcHBseSBzZWxlY3Rpb25zXHJcblx0XHRzZWxlY3Rpb25zXHJcblxyXG5cdGpRdWVyeSA9IC0+XHJcblxyXG5cdFx0IyBldmVudFxyXG5cdFx0QG9uID0gKHR5cGUsIGNhbGxiYWNrKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS5hZGRFdmVudExpc3RlbmVyIHR5cGUsIGNhbGxiYWNrXHJcblx0XHRcdEBcclxuXHJcblx0XHRAb2ZmID0gKHR5cGUsIGNhbGxiYWNrKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS5yZW1vdmVFdmVudExpc3RlbmVyIHR5cGUsIGNhbGxiYWNrXHJcblx0XHRcdEBcclxuXHJcblx0XHQjIERPTSBNYW5pcHVsYXRpb25cclxuXHJcblx0XHRTVkdfVEFHUyA9ICdzdmcgbGluZSByZWN0IGNpcmNsZSBlbGxpcHNlIHBvbHlsaW5lIHBvbHlnb24gcGF0aCB0ZXh0J1xyXG5cclxuXHRcdEBhcHBlbmQgPSAodGFnKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tLCBpKSA9PlxyXG5cdFx0XHRcdHRhZ0luZGV4ID0gU1ZHX1RBR1MuaW5kZXhPZiB0YWcudG9Mb3dlckNhc2UoKVxyXG5cdFx0XHRcdGlmIHRhZ0luZGV4ID4gLTFcclxuXHRcdFx0XHRcdG5ld0RvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0YWdcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRuZXdEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IHRhZ1xyXG5cdFx0XHRcdEBbaV0gPSBkb20uYXBwZW5kQ2hpbGQgbmV3RG9tXHJcblx0XHRcdEBcclxuXHJcblx0XHRAdGV4dCA9IChzdHIpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLnRleHRDb250ZW50ID0gc3RyXHJcblx0XHRcdEBcclxuXHJcblx0XHRAaHRtbCA9IChzdHIpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLmlubmVySFRNTCA9IHN0clxyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHN0eWxlID0gKG5hbWUsIHZhbHVlKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdHN0eWxlVGV4dCA9IGRvbS5nZXRBdHRyaWJ1dGUgJ3N0eWxlJ1xyXG5cdFx0XHRcdHN0eWxlcyA9IHt9XHJcblx0XHRcdFx0aWYgc3R5bGVUZXh0XHJcblx0XHRcdFx0XHRzdHlsZVRleHQuc3BsaXQoJzsnKS5lYWNoIChuKSAtPlxyXG5cdFx0XHRcdFx0XHRudiA9IG4uc3BsaXQgJzonXHJcblx0XHRcdFx0XHRcdHN0eWxlc1tudlswXV0gPSBudlsxXVxyXG5cdFx0XHRcdHN0eWxlc1tuYW1lXSA9IHZhbHVlXHJcblx0XHRcdFx0IyBjb25jYXRcclxuXHRcdFx0XHRzdHlsZVRleHQgPSAnJ1xyXG5cdFx0XHRcdGZvciBpIG9mIHN0eWxlc1xyXG5cdFx0XHRcdFx0c3R5bGVUZXh0ICs9IGkgKyAnOiAnICsgc3R5bGVzW2ldICsgJzsgJ1xyXG5cdFx0XHRcdGRvbS5zZXRBdHRyaWJ1dGUgJ3N0eWxlJywgc3R5bGVUZXh0XHJcblx0XHRcdEBcclxuXHJcblx0XHRAaGFzQ2xhc3MgPSAobmFtZSkgPT5cclxuXHRcdFx0aWYgQGxlbmd0aCA9PSAwXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdCMgaWYgbXVsdGlwbGUsIGV2ZXJ5IERPTSBzaG91bGQgaGF2ZSB0aGUgY2xhc3NcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0d2hpbGUgaSA8IEBsZW5ndGhcclxuXHRcdFx0XHRjbGFzc1RleHQgPSBAW2ldLmdldEF0dHJpYnV0ZSAnY2xhc3MnIG9yICcnXHJcblx0XHRcdFx0IyBub3QgdXNlICcgJyB0byBhdm9pZCBtdWx0aXBsZSBzcGFjZXMgbGlrZSAnYSAgIGInXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmICFjbGFzc2VzLmNvbnRhaW5zIG5hbWVcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRcdGkrK1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QGFkZENsYXNzID0gKG5hbWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0Y2xhc3NUZXh0ID0gZG9tLmdldEF0dHJpYnV0ZSAnY2xhc3MnIG9yICcnXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmIG5vdCBjbGFzc2VzLmNvbnRhaW5zIG5hbWVcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCBuYW1lXHJcblx0XHRcdFx0XHRkb20uc2V0QXR0cmlidXRlICdjbGFzcycsIGNsYXNzZXMuam9pbiAnICdcclxuXHRcdFx0QFxyXG5cclxuXHRcdEByZW1vdmVDbGFzcyA9IChuYW1lKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGNsYXNzVGV4dCA9IGRvbS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgb3IgJydcclxuXHRcdFx0XHRjbGFzc2VzID0gY2xhc3NUZXh0LnNwbGl0IFJlZ0V4cCAnICsnXHJcblx0XHRcdFx0aWYgY2xhc3Nlcy5jb250YWlucyBuYW1lXHJcblx0XHRcdFx0XHRjbGFzc2VzLnJlbW92ZSBuYW1lXHJcblx0XHRcdFx0XHRpZiBjbGFzc2VzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZG9tLnNldEF0dHJpYnV0ZSAnY2xhc3MnLCBjbGFzc2VzLmpvaW4gJyAnXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGRvbS5yZW1vdmVBdHRyaWJ1dGUgJ2NsYXNzJ1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHRvZ2dsZUNsYXNzID0gKG5hbWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0Y2xhc3NUZXh0ID0gZG9tLmdldEF0dHJpYnV0ZSAnY2xhc3MnIG9yICcnXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmIGNsYXNzZXMuY29udGFpbnMgbmFtZVxyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5yZW1vdmUgbmFtZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCBuYW1lXHJcblx0XHRcdFx0aWYgY2xhc3Nlcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRkb20uc2V0QXR0cmlidXRlICdjbGFzcycsIGNsYXNzZXMuam9pbiAnICdcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRkb20ucmVtb3ZlQXR0cmlidXRlICdjbGFzcydcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBhdHRyID0gKG5hbWUsIHZhbHVlKSA9PlxyXG5cdFx0XHRpZiB2YWx1ZT9cclxuXHRcdFx0XHRAZWFjaCAoZG9tKSAtPiBkb20uc2V0QXR0cmlidXRlIG5hbWUsIHZhbHVlXHJcblx0XHRcdFx0cmV0dXJuIEBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBAWzBdLmdldEF0dHJpYnV0ZSBuYW1lXHJcblxyXG5cdFx0QGhhc0F0dHIgPSAobmFtZSkgPT5cclxuXHRcdFx0aWYgQGxlbmd0aCA9PSAwXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdHdoaWxlIGkgPCBAbGVuZ3RoXHJcblx0XHRcdFx0aWYgbm90IEBbaV0uaGFzQXR0cmlidXRlIG5hbWVcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRcdGkrK1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHJlbW92ZUF0dHIgPSAobmFtZSkgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRkb20ucmVtb3ZlQXR0cmlidXRlIG5hbWVcclxuXHRcdFx0QFxyXG5cclxuXHRcdEB2YWwgPSA9PiBAWzBdPy52YWx1ZVxyXG5cclxuXHQjICQucmVhZHkoKVxyXG5cdGdsb2JhbC4kLnJlYWR5ID0gKG9uTG9hZCkgLT5cclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbkxvYWRcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjICQuYWpheCgpXHJcblx0I1x0b3B0aW9uczpcclxuXHQjXHRcdHVybDogc3RyaW5nXHJcblx0I1x0XHQ9PT09XHJcblx0I1x0XHRhc3luYyA9IHRydWU6IGJvb2xcclxuXHQjXHRkYXRhOiBvYmplY3QgLSBxdWVyeSBwYXJhbWV0ZXJzIFRPRE86IGltcGxlbWVudCB0aGlzXHJcblx0I1x0XHRtZXRob2QgPSBHRVQ6IFBPU1QsIFBVVCwgREVMRVRFLCBIRUFEXHJcblx0I1x0XHR1c2VybmFtZTogc3RyaW5nXHJcblx0I1x0XHRwYXNzd29yZDogc3RyaW5nXHJcblx0I1x0XHRzdWNjZXNzOiBmdW5jdGlvblxyXG5cdCNcdFx0ZXJyb3I6IGZ1bmN0aW9uXHJcblx0I1x0XHRjb21wbGV0ZTogZnVuY3Rpb25cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRnbG9iYWwuJC5hamF4ID0gKHVybCwgb3BzKSAtPlxyXG5cdFx0aWYgIW9wc1xyXG5cdFx0XHRpZiB0eXBlb2YgdXJsID09ICdvYmplY3QnXHJcblx0XHRcdFx0b3BzID0gdXJsXHJcblx0XHRcdFx0dXJsID0gb3BzLnVybFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3BzID0ge31cclxuXHRcdG9wcy5tZXRob2Qgb3I9ICdHRVQnXHJcblx0XHRvcHMuYXN5bmMgPSB0cnVlIHVubGVzcyBvcHMuYXN5bmM/XHJcblxyXG5cdFx0eGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0XHJcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gLT5cclxuXHRcdFx0aWYgeGhyLnJlYWR5U3RhdGUgPT0gNFxyXG5cdFx0XHRcdGlmIHhoci5zdGF0dXMgPT0gMjAwXHJcblx0XHRcdFx0XHRvcHMuc3VjY2VzcyB4aHIucmVzcG9uc2VUZXh0LCB4aHIuc3RhdHVzLCB4aHIgaWYgb3BzLnN1Y2Nlc3M/XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3BzLmVycm9yIHhociwgeGhyLnN0YXR1cyBpZiBvcHMuZXJyb3I/XHJcblx0XHRcdFx0XHRvcHMuY29tcGxldGUgeGhyLCB4aHIuc3RhdHVzIGlmIG9wcy5jb21wbGV0ZT9cclxuXHJcblx0XHR4aHIub3BlbiBvcHMubWV0aG9kLCB1cmwsIG9wcy5hc3luYywgb3BzLnVzZXJuYW1lLCBvcHMucGFzc3dvcmRcclxuXHRcdHhoci5zZW5kIG51bGwpIEJ1Lmdsb2JhbFxyXG4iLCIjIEJhc2UgY2xhc3Mgb2YgYWxsIHNoYXBlcyBhbmQgb3RoZXIgcmVuZGVyYWJsZSBvYmplY3RzXHJcblxyXG5jbGFzcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cclxuXHRcdEJ1LkNvbG9yZnVsLmFwcGx5IEBcclxuXHRcdEJ1LkV2ZW50LmFwcGx5IEBcclxuXHRcdEB0eXBlID0gJ09iamVjdDJEJ1xyXG5cclxuXHRcdEB2aXNpYmxlID0geWVzXHJcblx0XHRAb3BhY2l0eSA9IDFcclxuXHJcblx0XHRAcG9zaXRpb24gPSBuZXcgQnUuVmVjdG9yXHJcblx0XHRAcm90YXRpb24gPSAwXHJcblx0XHRAX3NjYWxlID0gbmV3IEJ1LlZlY3RvciAxLCAxXHJcblx0XHRAc2tldyA9IG5ldyBCdS5WZWN0b3JcclxuXHJcblx0XHQjQHRvV29ybGRNYXRyaXggPSBuZXcgQnUuTWF0cml4KClcclxuXHRcdCNAdXBkYXRlTWF0cml4IC0+XHJcblxyXG5cdFx0IyBnZW9tZXRyeSByZWxhdGVkXHJcblx0XHRAYm91bmRzID0gbnVsbCAjIHVzZWQgdG8gYWNjZWxlcmF0ZSB0aGUgaGl0IHRlc3RpbmdcclxuXHRcdEBrZXlQb2ludHMgPSBudWxsXHJcblxyXG5cdFx0IyBoaWVyYXJjaHlcclxuXHRcdEBjaGlsZHJlbiA9IFtdXHJcblx0XHRAcGFyZW50ID0gbnVsbFxyXG5cclxuXHRAcHJvcGVydHkgJ3NjYWxlJyxcclxuXHRcdGdldDogLT4gQF9zY2FsZVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRpZiBCdS5pc051bWJlciB2YWxcclxuXHRcdFx0XHRAX3NjYWxlLnggPSBAX3NjYWxlLnkgPSB2YWxcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdEBfc2NhbGUgPSB2YWxcclxuXHJcblxyXG5cdCMgQWRkIG9iamVjdChzKSB0byBjaGlsZHJlblxyXG5cdGFkZENoaWxkOiAoc2hhcGUpIC0+XHJcblx0XHRpZiBCdS5pc0FycmF5IHNoYXBlXHJcblx0XHRcdEBjaGlsZHJlbi5wdXNoIHMgZm9yIHMgaW4gc2hhcGVcclxuXHRcdGVsc2VcclxuXHRcdFx0QGNoaWxkcmVuLnB1c2ggc2hhcGVcclxuXHRcdEBcclxuXHJcblx0IyBSZW1vdmUgb2JqZWN0IGZyb20gY2hpbGRyZW5cclxuXHRyZW1vdmVDaGlsZDogKHNoYXBlKSAtPlxyXG5cdFx0aW5kZXggPSBAY2hpbGRyZW4uaW5kZXhPZiBzaGFwZVxyXG5cdFx0QGNoaWxkcmVuLnNwbGljZSBpbmRleCwgMSBpZiBpbmRleCA+IC0xXHJcblx0XHRAXHJcblxyXG5cdCMgQXBwbHkgYW4gYW5pbWF0aW9uIG9uIHRoaXMgb2JqZWN0XHJcblx0IyBUaGUgdHlwZSBvZiBgYW5pbWAgbWF5IGJlOlxyXG5cdCMgICAgIDEuIFByZXNldCBhbmltYXRpb25zOiB0aGUgYW5pbWF0aW9uIG5hbWUoc3RyaW5nIHR5cGUpLCBpZS4ga2V5IGluIGBCdS5hbmltYXRpb25zYFxyXG5cdCMgICAgIDIuIEN1c3RvbSBhbmltYXRpb25zOiB0aGUgYW5pbWF0aW9uIG9iamVjdCBvZiBgQnUuQW5pbWF0aW9uYCB0eXBlXHJcblx0IyAgICAgMy4gTXVsdGlwbGUgYW5pbWF0aW9uczogQW4gYXJyYXkgd2hvc2UgY2hpbGRyZW4gYXJlIGFib3ZlIHR3byB0eXBlc1xyXG5cdGFuaW1hdGU6IChhbmltLCBhcmdzKSAtPlxyXG5cdFx0YXJncyA9IFthcmdzXSB1bmxlc3MgQnUuaXNBcnJheSBhcmdzXHJcblx0XHRpZiBCdS5pc1N0cmluZyBhbmltXHJcblx0XHRcdGlmIGFuaW0gb2YgQnUuYW5pbWF0aW9uc1xyXG5cdFx0XHRcdEJ1LmFuaW1hdGlvbnNbYW5pbV0uYXBwbHlUbyBALCBhcmdzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJCdS5hbmltYXRpb25zW1xcXCIjeyBhbmltIH1cXFwiXSBkb2Vzbid0IGV4aXN0cy5cIlxyXG5cdFx0ZWxzZSBpZiBCdS5pc0FycmF5IGFuaW1cclxuXHRcdFx0QGFuaW1hdGUgYW5pbVtpXSwgYXJncyBmb3Igb3duIGkgb2YgYW5pbVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRhbmltLmFwcGx5VG8gQCwgYXJnc1xyXG5cdFx0QFxyXG5cclxuXHQjIENyZWF0ZSBCb3VuZHMgZm9yIHRoaXMgb2JqZWN0XHJcblx0Y3JlYXRlQm91bmRzOiAtPlxyXG5cdFx0QGJvdW5kcyA9IG5ldyBCdS5Cb3VuZHMgQFxyXG5cdFx0QFxyXG5cclxuXHQjIEhpdCB0ZXN0aW5nXHJcblx0Y29udGFpbnNQb2ludDogKHApIC0+XHJcblx0XHRpZiBAYm91bmRzPyBhbmQgbm90IEBib3VuZHMuY29udGFpbnNQb2ludCBwXHJcblx0XHRcdHJldHVybiBub1xyXG5cdFx0ZWxzZSBpZiBAX2NvbnRhaW5zUG9pbnRcclxuXHRcdFx0cmV0dXJuIEBfY29udGFpbnNQb2ludCBwXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBub1xyXG4iLCIjIFVzZWQgdG8gcmVuZGVyIGFsbCB0aGUgZHJhd2FibGUgb2JqZWN0cyB0byB0aGUgY2FudmFzXHJcblxyXG5jbGFzcyBCdS5SZW5kZXJlclxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cclxuXHRcdEJ1LkV2ZW50LmFwcGx5IEBcclxuXHRcdEB0eXBlID0gJ1JlbmRlcmVyJ1xyXG5cclxuXHRcdCMgQVBJXHJcblx0XHRAc2NlbmUgPSBuZXcgQnUuU2NlbmUoKVxyXG5cdFx0QHRpY2tDb3VudCA9IDBcclxuXHRcdEBpc1J1bm5pbmcgPSB5ZXNcclxuXHRcdEBwaXhlbFJhdGlvID0gQnUuZ2xvYmFsLmRldmljZVBpeGVsUmF0aW8gb3IgMVxyXG5cdFx0QGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcclxuXHRcdEBjb250ZXh0ID0gQGRvbS5nZXRDb250ZXh0ICcyZCdcclxuXHRcdEBjbGlwTWV0ZXIgPSBuZXcgQ2xpcE1ldGVyKCkgaWYgQ2xpcE1ldGVyP1xyXG5cclxuXHRcdCMgUmVjaWV2ZSBvcHRpb25zXHJcblx0XHRvcHRpb25zID0gQnUuY29tYmluZU9wdGlvbnMgYXJndW1lbnRzLFxyXG5cdFx0XHRjb250YWluZXI6ICdib2R5J1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAnI2VlZSdcclxuXHRcdFx0ZnBzOiA2MFxyXG5cdFx0XHRzaG93S2V5UG9pbnRzOiBub1xyXG5cdFx0XHRzaG93Qm91bmRzOiBub1xyXG5cdFx0XHRpbWFnZVNtb290aGluZzogeWVzXHJcblx0XHRAW2tdID0gb3B0aW9uc1trXSBmb3IgayBpbiBbJ2NvbnRhaW5lcicsICd3aWR0aCcsICdoZWlnaHQnLCAnZnBzJywgJ3Nob3dLZXlQb2ludHMnLCAnc2hvd0JvdW5kcyddXHJcblx0XHRAY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciBAY29udGFpbmVyIGlmIEJ1LmlzU3RyaW5nIEBjb250YWluZXJcclxuXHRcdEBmaWxsUGFyZW50ID0gbm90IEJ1LmlzTnVtYmVyIG9wdGlvbnMud2lkdGhcclxuXHJcblx0XHQjIFNldCBET00gc3R5bGVzXHJcblx0XHRpZiBub3QgQGZpbGxQYXJlbnRcclxuXHRcdFx0QGRvbS5zdHlsZS53aWR0aCA9IEB3aWR0aCArICdweCdcclxuXHRcdFx0QGRvbS5zdHlsZS5oZWlnaHQgPSBAaGVpZ2h0ICsgJ3B4J1xyXG5cdFx0XHRAZG9tLndpZHRoID0gQHdpZHRoICogQHBpeGVsUmF0aW9cclxuXHRcdFx0QGRvbS5oZWlnaHQgPSBAaGVpZ2h0ICogQHBpeGVsUmF0aW9cclxuXHRcdEBkb20uc3R5bGUuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3Igb3IgJ2RlZmF1bHQnXHJcblx0XHRAZG9tLnN0eWxlLmJveFNpemluZyA9ICdjb250ZW50LWJveCdcclxuXHRcdEBkb20uc3R5bGUuYmFja2dyb3VuZCA9IG9wdGlvbnMuYmFja2dyb3VuZFxyXG5cdFx0QGRvbS5vbmNvbnRleHRtZW51ID0gLT4gZmFsc2VcclxuXHJcblx0XHRAY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJ1xyXG5cdFx0QGNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gb3B0aW9ucy5pbWFnZVNtb290aGluZ1xyXG5cclxuXHJcblx0XHRvblJlc2l6ZSA9ID0+XHJcblx0XHRcdGNhbnZhc1JhdGlvID0gQGRvbS5oZWlnaHQgLyBAZG9tLndpZHRoXHJcblx0XHRcdGNvbnRhaW5lclJhdGlvID0gQGNvbnRhaW5lci5jbGllbnRIZWlnaHQgLyBAY29udGFpbmVyLmNsaWVudFdpZHRoXHJcblx0XHRcdGlmIGNvbnRhaW5lclJhdGlvIDwgY2FudmFzUmF0aW9cclxuXHRcdFx0XHRoZWlnaHQgPSBAY29udGFpbmVyLmNsaWVudEhlaWdodFxyXG5cdFx0XHRcdHdpZHRoID0gaGVpZ2h0IC8gY29udGFpbmVyUmF0aW9cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHdpZHRoID0gQGNvbnRhaW5lci5jbGllbnRXaWR0aFxyXG5cdFx0XHRcdGhlaWdodCA9IHdpZHRoICogY29udGFpbmVyUmF0aW9cclxuXHRcdFx0QHdpZHRoID0gQGRvbS53aWR0aCA9IHdpZHRoICogQHBpeGVsUmF0aW9cclxuXHRcdFx0QGhlaWdodCA9IEBkb20uaGVpZ2h0ID0gaGVpZ2h0ICogQHBpeGVsUmF0aW9cclxuXHRcdFx0QGRvbS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4J1xyXG5cdFx0XHRAZG9tLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCdcclxuXHRcdFx0QHJlbmRlcigpXHJcblxyXG5cdFx0aWYgQGZpbGxQYXJlbnRcclxuXHRcdFx0QHdpZHRoID0gQGNvbnRhaW5lci5jbGllbnRXaWR0aFxyXG5cdFx0XHRAaGVpZ2h0ID0gQGNvbnRhaW5lci5jbGllbnRIZWlnaHRcclxuXHRcdFx0QnUuZ2xvYmFsLndpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCBvblJlc2l6ZVxyXG5cdFx0XHRAZG9tLmFkZEV2ZW50TGlzdGVuZXIgJ0RPTU5vZGVJbnNlcnRlZCcsIG9uUmVzaXplXHJcblxyXG5cclxuXHRcdHRpY2sgPSA9PlxyXG5cdFx0XHRpZiBAaXNSdW5uaW5nXHJcblx0XHRcdFx0QGNsaXBNZXRlci5zdGFydCgpIGlmIEBjbGlwTWV0ZXI/XHJcblx0XHRcdFx0QHJlbmRlcigpXHJcblx0XHRcdFx0QHRyaWdnZXIgJ3VwZGF0ZScsIHsndGlja0NvdW50JzogQHRpY2tDb3VudH1cclxuXHRcdFx0XHRAdGlja0NvdW50ICs9IDFcclxuXHRcdFx0XHRAY2xpcE1ldGVyLnRpY2soKSBpZiBAY2xpcE1ldGVyP1xyXG5cclxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lIHRpY2tcclxuXHJcblx0XHR0aWNrKClcclxuXHJcblx0XHRhcHBlbmREb20gPSA9PlxyXG5cdFx0XHRAY29udGFpbmVyLmFwcGVuZENoaWxkIEBkb21cclxuXHRcdHNldFRpbWVvdXQgYXBwZW5kRG9tLCAxXHJcblxyXG5cdFx0QnUuYW5pbWF0aW9uUnVubmVyPy5ob29rVXAgQFxyXG5cclxuXHQjIFBhdXNlL2NvbnRpbnVlL3RvZ2dsZSB0aGUgcmVuZGVyaW5nIGxvb3BcclxuXHRwYXVzZTogLT4gQGlzUnVubmluZyA9IGZhbHNlXHJcblx0Y29udGludWU6IC0+IEBpc1J1bm5pbmcgPSB0cnVlXHJcblx0dG9nZ2xlOiAtPiBAaXNSdW5uaW5nID0gbm90IEBpc1J1bm5pbmdcclxuXHJcblxyXG5cdCMgUGVyZm9ybSB0aGUgZnVsbCByZW5kZXIgcHJvY2Vzc1xyXG5cdHJlbmRlcjogLT5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQuc2NhbGUgQHBpeGVsUmF0aW8sIEBwaXhlbFJhdGlvXHJcblx0XHRAY2xlYXJDYW52YXMoKVxyXG5cdFx0QGRyYXdTaGFwZSBAc2NlbmVcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cdFx0QFxyXG5cclxuXHQjIENsZWFyIHRoZSBjYW52YXNcclxuXHRjbGVhckNhbnZhczogLT5cclxuXHRcdEBjb250ZXh0LmNsZWFyUmVjdCAwLCAwLCBAd2lkdGgsIEBoZWlnaHRcclxuXHRcdEBcclxuXHJcblx0IyBEcmF3IGFuIGFycmF5IG9mIGRyYXdhYmxlc1xyXG5cdGRyYXdTaGFwZXM6IChzaGFwZXMpID0+XHJcblx0XHRpZiBzaGFwZXM/XHJcblx0XHRcdGZvciBzaGFwZSBpbiBzaGFwZXNcclxuXHRcdFx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdFx0XHRAZHJhd1NoYXBlIHNoYXBlXHJcblx0XHRcdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblx0XHRAXHJcblxyXG5cdCMgRHJhdyBhbiBkcmF3YWJsZSB0byB0aGUgY2FudmFzXHJcblx0ZHJhd1NoYXBlOiAoc2hhcGUpID0+XHJcblx0XHRyZXR1cm4gQCB1bmxlc3Mgc2hhcGUudmlzaWJsZVxyXG5cclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSBzaGFwZS5wb3NpdGlvbi54LCBzaGFwZS5wb3NpdGlvbi55XHJcblx0XHRAY29udGV4dC5yb3RhdGUgc2hhcGUucm90YXRpb25cclxuXHRcdHN4ID0gc2hhcGUuc2NhbGUueFxyXG5cdFx0c3kgPSBzaGFwZS5zY2FsZS55XHJcblx0XHRpZiBzeCAvIHN5ID4gMTAwIG9yIHN4IC8gc3kgPCAwLjAxXHJcblx0XHRcdHN4ID0gMCBpZiBNYXRoLmFicyhzeCkgPCAwLjAyXHJcblx0XHRcdHN5ID0gMCBpZiBNYXRoLmFicyhzeSkgPCAwLjAyXHJcblx0XHRAY29udGV4dC5zY2FsZSBzeCwgc3lcclxuXHJcblx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSAqPSBzaGFwZS5vcGFjaXR5XHJcblx0XHRpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzaGFwZS5zdHJva2VTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5saW5lV2lkdGggPSBzaGFwZS5saW5lV2lkdGhcclxuXHRcdFx0QGNvbnRleHQubGluZUNhcCA9IHNoYXBlLmxpbmVDYXAgaWYgc2hhcGUubGluZUNhcD9cclxuXHRcdFx0QGNvbnRleHQubGluZUpvaW4gPSBzaGFwZS5saW5lSm9pbiBpZiBzaGFwZS5saW5lSm9pbj9cclxuXHJcblx0XHRAY29udGV4dC5iZWdpblBhdGgoKVxyXG5cclxuXHRcdHN3aXRjaCBzaGFwZS50eXBlXHJcblx0XHRcdHdoZW4gJ1BvaW50JyB0aGVuIEBkcmF3UG9pbnQgc2hhcGVcclxuXHRcdFx0d2hlbiAnTGluZScgdGhlbiBAZHJhd0xpbmUgc2hhcGVcclxuXHRcdFx0d2hlbiAnQ2lyY2xlJyB0aGVuIEBkcmF3Q2lyY2xlIHNoYXBlXHJcblx0XHRcdHdoZW4gJ1RyaWFuZ2xlJyB0aGVuIEBkcmF3VHJpYW5nbGUgc2hhcGVcclxuXHRcdFx0d2hlbiAnUmVjdGFuZ2xlJyB0aGVuIEBkcmF3UmVjdGFuZ2xlIHNoYXBlXHJcblx0XHRcdHdoZW4gJ0ZhbicgdGhlbiBAZHJhd0ZhbiBzaGFwZVxyXG5cdFx0XHR3aGVuICdCb3cnIHRoZW4gQGRyYXdCb3cgc2hhcGVcclxuXHRcdFx0d2hlbiAnUG9seWdvbicgdGhlbiBAZHJhd1BvbHlnb24gc2hhcGVcclxuXHRcdFx0d2hlbiAnUG9seWxpbmUnIHRoZW4gQGRyYXdQb2x5bGluZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdTcGxpbmUnIHRoZW4gQGRyYXdTcGxpbmUgc2hhcGVcclxuXHRcdFx0d2hlbiAnUG9pbnRUZXh0JyB0aGVuIEBkcmF3UG9pbnRUZXh0IHNoYXBlXHJcblx0XHRcdHdoZW4gJ0ltYWdlJyB0aGVuIEBkcmF3SW1hZ2Ugc2hhcGVcclxuXHRcdFx0d2hlbiAnT2JqZWN0MkQnLCAnU2NlbmUnICMgdGhlbiBkbyBub3RoaW5nXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnZHJhd1NoYXBlcygpOiB1bmtub3duIHNoYXBlOiAnLCBzaGFwZS50eXBlLCBzaGFwZVxyXG5cclxuXHJcblx0XHRpZiBzaGFwZS5maWxsU3R5bGU/XHJcblx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9IHNoYXBlLmZpbGxTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5maWxsKClcclxuXHJcblx0XHRpZiBzaGFwZS5kYXNoU3R5bGVcclxuXHRcdFx0QGNvbnRleHQubGluZURhc2hPZmZzZXQgPSBzaGFwZS5kYXNoT2Zmc2V0XHJcblx0XHRcdEBjb250ZXh0LnNldExpbmVEYXNoPyBzaGFwZS5kYXNoU3R5bGVcclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHRcdFx0QGNvbnRleHQuc2V0TGluZURhc2ggW11cclxuXHRcdGVsc2UgaWYgc2hhcGUuc3Ryb2tlU3R5bGU/XHJcblx0XHRcdEBjb250ZXh0LnN0cm9rZSgpXHJcblxyXG5cdFx0QGRyYXdTaGFwZXMgc2hhcGUuY2hpbGRyZW4gaWYgc2hhcGUuY2hpbGRyZW4/XHJcblx0XHRAZHJhd1NoYXBlcyBzaGFwZS5rZXlQb2ludHMgaWYgQHNob3dLZXlQb2ludHNcclxuXHRcdEBkcmF3Qm91bmRzIHNoYXBlLmJvdW5kcyBpZiBAc2hvd0JvdW5kcyBhbmQgc2hhcGUuYm91bmRzP1xyXG5cdFx0QFxyXG5cclxuXHJcblxyXG5cdGRyYXdQb2ludDogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuYXJjIHNoYXBlLngsIHNoYXBlLnksIEJ1LlBPSU5UX1JFTkRFUl9TSVpFLCAwLCBNYXRoLlBJICogMlxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0xpbmU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0Lm1vdmVUbyBzaGFwZS5wb2ludHNbMF0ueCwgc2hhcGUucG9pbnRzWzBdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMV0ueCwgc2hhcGUucG9pbnRzWzFdLnlcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdDaXJjbGU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmFyYyBzaGFwZS5jeCwgc2hhcGUuY3ksIHNoYXBlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDJcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdUcmlhbmdsZTogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnBvaW50c1swXS54LCBzaGFwZS5wb2ludHNbMF0ueVxyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnBvaW50c1sxXS54LCBzaGFwZS5wb2ludHNbMV0ueVxyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnBvaW50c1syXS54LCBzaGFwZS5wb2ludHNbMl0ueVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdSZWN0YW5nbGU6IChzaGFwZSkgLT5cclxuXHRcdHJldHVybiBAZHJhd1JvdW5kUmVjdGFuZ2xlIHNoYXBlIGlmIHNoYXBlLmNvcm5lclJhZGl1cyAhPSAwXHJcblx0XHRAY29udGV4dC5yZWN0IHNoYXBlLnBvaW50TFQueCwgc2hhcGUucG9pbnRMVC55LCBzaGFwZS5zaXplLndpZHRoLCBzaGFwZS5zaXplLmhlaWdodFxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1JvdW5kUmVjdGFuZ2xlOiAoc2hhcGUpIC0+XHJcblx0XHR4MSA9IHNoYXBlLnBvaW50TFQueFxyXG5cdFx0eDIgPSBzaGFwZS5wb2ludFJCLnhcclxuXHRcdHkxID0gc2hhcGUucG9pbnRMVC55XHJcblx0XHR5MiA9IHNoYXBlLnBvaW50UkIueVxyXG5cdFx0ciA9IHNoYXBlLmNvcm5lclJhZGl1c1xyXG5cclxuXHRcdEBjb250ZXh0Lm1vdmVUbyB4MSwgeTEgKyByXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MSwgeTEsIHgxICsgciwgeTEsIHJcclxuXHRcdEBjb250ZXh0LmxpbmVUbyB4MiAtIHIsIHkxXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MiwgeTEsIHgyLCB5MSArIHIsIHJcclxuXHRcdEBjb250ZXh0LmxpbmVUbyB4MiwgeTIgLSByXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MiwgeTIsIHgyIC0gciwgeTIsIHJcclxuXHRcdEBjb250ZXh0LmxpbmVUbyB4MSArIHIsIHkyXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MSwgeTIsIHgxLCB5MiAtIHIsIHJcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblxyXG5cdFx0QGNvbnRleHQuc2V0TGluZURhc2g/IHNoYXBlLmRhc2hTdHlsZSBpZiBzaGFwZS5zdHJva2VTdHlsZT8gYW5kIHNoYXBlLmRhc2hTdHlsZVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0ZhbjogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuYXJjIHNoYXBlLmN4LCBzaGFwZS5jeSwgc2hhcGUucmFkaXVzLCBzaGFwZS5hRnJvbSwgc2hhcGUuYVRvXHJcblx0XHRAY29udGV4dC5saW5lVG8gc2hhcGUuY3gsIHNoYXBlLmN5XHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0JvdzogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuYXJjIHNoYXBlLmN4LCBzaGFwZS5jeSwgc2hhcGUucmFkaXVzLCBzaGFwZS5hRnJvbSwgc2hhcGUuYVRvXHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1BvbHlnb246IChzaGFwZSkgLT5cclxuXHRcdGZvciBwb2ludCBpbiBzaGFwZS52ZXJ0aWNlc1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8gcG9pbnQueCwgcG9pbnQueVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdQb2x5bGluZTogKHNoYXBlKSAtPlxyXG5cdFx0Zm9yIHBvaW50IGluIHNoYXBlLnZlcnRpY2VzXHJcblx0XHRcdEBjb250ZXh0LmxpbmVUbyBwb2ludC54LCBwb2ludC55XHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3U3BsaW5lOiAoc2hhcGUpIC0+XHJcblx0XHRpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0bGVuID0gc2hhcGUudmVydGljZXMubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA9PSAyXHJcblx0XHRcdFx0QGNvbnRleHQubW92ZVRvIHNoYXBlLnZlcnRpY2VzWzBdLngsIHNoYXBlLnZlcnRpY2VzWzBdLnlcclxuXHRcdFx0XHRAY29udGV4dC5saW5lVG8gc2hhcGUudmVydGljZXNbMV0ueCwgc2hhcGUudmVydGljZXNbMV0ueVxyXG5cdFx0XHRlbHNlIGlmIGxlbiA+IDJcclxuXHRcdFx0XHRAY29udGV4dC5tb3ZlVG8gc2hhcGUudmVydGljZXNbMF0ueCwgc2hhcGUudmVydGljZXNbMF0ueVxyXG5cdFx0XHRcdGZvciBpIGluIFsxLi5sZW4gLSAxXVxyXG5cdFx0XHRcdFx0QGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0XHRcdFx0XHRzaGFwZS5jb250cm9sUG9pbnRzQmVoaW5kW2kgLSAxXS54XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUuY29udHJvbFBvaW50c0JlaGluZFtpIC0gMV0ueVxyXG5cdFx0XHRcdFx0XHRcdHNoYXBlLmNvbnRyb2xQb2ludHNBaGVhZFtpXS54XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUuY29udHJvbFBvaW50c0FoZWFkW2ldLnlcclxuXHRcdFx0XHRcdFx0XHRzaGFwZS52ZXJ0aWNlc1tpXS54XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUudmVydGljZXNbaV0ueVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1BvaW50VGV4dDogKHNoYXBlKSAtPlxyXG5cdFx0Zm9udCA9IHNoYXBlLmZvbnQgb3IgQnUuREVGQVVMVF9GT05UXHJcblxyXG5cdFx0aWYgQnUuaXNTdHJpbmcgZm9udFxyXG5cdFx0XHRAY29udGV4dC50ZXh0QWxpZ24gPSBzaGFwZS50ZXh0QWxpZ25cclxuXHRcdFx0QGNvbnRleHQudGV4dEJhc2VsaW5lID0gc2hhcGUudGV4dEJhc2VsaW5lXHJcblx0XHRcdEBjb250ZXh0LmZvbnQgPSBmb250XHJcblxyXG5cdFx0XHRpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0XHRAY29udGV4dC5zdHJva2VUZXh0IHNoYXBlLnRleHQsIHNoYXBlLngsIHNoYXBlLnlcclxuXHRcdFx0aWYgc2hhcGUuZmlsbFN0eWxlP1xyXG5cdFx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9IHNoYXBlLmZpbGxTdHlsZVxyXG5cdFx0XHRcdEBjb250ZXh0LmZpbGxUZXh0IHNoYXBlLnRleHQsIHNoYXBlLngsIHNoYXBlLnlcclxuXHRcdGVsc2UgaWYgZm9udCBpbnN0YW5jZW9mIEJ1LlNwcml0ZVNoZWV0IGFuZCBmb250LnJlYWR5XHJcblx0XHRcdHRleHRXaWR0aCA9IGZvbnQubWVhc3VyZVRleHRXaWR0aCBzaGFwZS50ZXh0XHJcblx0XHRcdHhPZmZzZXQgPSBzd2l0Y2ggc2hhcGUudGV4dEFsaWduXHJcblx0XHRcdFx0d2hlbiAnbGVmdCcgdGhlbiAwXHJcblx0XHRcdFx0d2hlbiAnY2VudGVyJyB0aGVuIC10ZXh0V2lkdGggLyAyXHJcblx0XHRcdFx0d2hlbiAncmlnaHQnIHRoZW4gLXRleHRXaWR0aFxyXG5cdFx0XHR5T2Zmc2V0ID0gc3dpdGNoIHNoYXBlLnRleHRCYXNlbGluZVxyXG5cdFx0XHRcdHdoZW4gJ3RvcCcgdGhlbiAwXHJcblx0XHRcdFx0d2hlbiAnbWlkZGxlJyB0aGVuIC1mb250LmhlaWdodCAvIDJcclxuXHRcdFx0XHR3aGVuICdib3R0b20nIHRoZW4gLWZvbnQuaGVpZ2h0XHJcblx0XHRcdGZvciBpIGluIFswLi4uc2hhcGUudGV4dC5sZW5ndGhdXHJcblx0XHRcdFx0Y2hhciA9IHNoYXBlLnRleHRbaV1cclxuXHRcdFx0XHRjaGFyQml0bWFwID0gZm9udC5nZXRGcmFtZUltYWdlIGNoYXJcclxuXHRcdFx0XHRpZiBjaGFyQml0bWFwP1xyXG5cdFx0XHRcdFx0QGNvbnRleHQuZHJhd0ltYWdlIGNoYXJCaXRtYXAsIHNoYXBlLnggKyB4T2Zmc2V0LCBzaGFwZS55ICsgeU9mZnNldFxyXG5cdFx0XHRcdFx0eE9mZnNldCArPSBjaGFyQml0bWFwLndpZHRoXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0eE9mZnNldCArPSAxMFxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0ltYWdlOiAoc2hhcGUpIC0+XHJcblx0XHRpZiBzaGFwZS5yZWFkeVxyXG5cdFx0XHR3ID0gc2hhcGUuc2l6ZS53aWR0aFxyXG5cdFx0XHRoID0gc2hhcGUuc2l6ZS5oZWlnaHRcclxuXHRcdFx0ZHggPSAtdyAqIHNoYXBlLnBpdm90LnhcclxuXHRcdFx0ZHkgPSAtaCAqIHNoYXBlLnBpdm90LnlcclxuXHRcdFx0QGNvbnRleHQuZHJhd0ltYWdlIHNoYXBlLmltYWdlLCBkeCwgZHksIHcsIGhcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdCb3VuZHM6IChib3VuZHMpIC0+XHJcblx0XHRAY29udGV4dC5iZWdpblBhdGgoKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBCdS5SZW5kZXJlci5CT1VORFNfU1RST0tFX1NUWUxFXHJcblx0XHRAY29udGV4dC5zZXRMaW5lRGFzaD8gQnUuUmVuZGVyZXIuQk9VTkRTX0RBU0hfU1RZTEVcclxuXHRcdEBjb250ZXh0LnJlY3QgYm91bmRzLngxLCBib3VuZHMueTEsIGJvdW5kcy54MiAtIGJvdW5kcy54MSwgYm91bmRzLnkyIC0gYm91bmRzLnkxXHJcblx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cdFx0QFxyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBTdGF0aWMgbWVtYmVyc1xyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuIyBTdHJva2Ugc3R5bGUgb2YgYm91bmRzXHJcbkJ1LlJlbmRlcmVyLkJPVU5EU19TVFJPS0VfU1RZTEUgPSAncmVkJ1xyXG5cclxuIyBEYXNoIHN0eWxlIG9mIGJvdW5kc1xyXG5CdS5SZW5kZXJlci5CT1VORFNfREFTSF9TVFlMRSA9IFs2LCA2XVxyXG4iLCIjIFNjZW5lIGlzIHRoZSByb290IG9mIHRoZSBvYmplY3QgdHJlZVxyXG5cclxuY2xhc3MgQnUuU2NlbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ1NjZW5lJ1xyXG4iLCIjIEJvdyBzaGFwZVxyXG5cclxuY2xhc3MgQnUuQm93IGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChAY3gsIEBjeSwgQHJhZGl1cywgQGFGcm9tLCBAYVRvKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnQm93J1xyXG5cclxuXHRcdFtAYUZyb20sIEBhVG9dID0gW0BhVG8sIEBhRnJvbV0gaWYgQGFGcm9tID4gQGFUb1xyXG5cclxuXHRcdEBjZW50ZXIgPSBuZXcgQnUuUG9pbnQgQGN4LCBAY3lcclxuXHRcdEBzdHJpbmcgPSBuZXcgQnUuTGluZSBAY2VudGVyLmFyY1RvKEByYWRpdXMsIEBhRnJvbSksIEBjZW50ZXIuYXJjVG8oQHJhZGl1cywgQGFUbylcclxuXHRcdEBrZXlQb2ludHMgPSBAc3RyaW5nLnBvaW50c1xyXG5cclxuXHRcdEB1cGRhdGVLZXlQb2ludHMoKVxyXG5cdFx0QG9uICdjaGFuZ2VkJywgQHVwZGF0ZUtleVBvaW50c1xyXG5cdFx0QG9uICdjaGFuZ2VkJywgPT4gQC5ib3VuZHM/LnVwZGF0ZSgpXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuQm93IEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG9cclxuXHJcblx0dXBkYXRlS2V5UG9pbnRzOiAtPlxyXG5cdFx0QGNlbnRlci5zZXQgQGN4LCBAY3lcclxuXHRcdEBzdHJpbmcucG9pbnRzWzBdLmNvcHkgQGNlbnRlci5hcmNUbyBAcmFkaXVzLCBAYUZyb21cclxuXHRcdEBzdHJpbmcucG9pbnRzWzFdLmNvcHkgQGNlbnRlci5hcmNUbyBAcmFkaXVzLCBAYVRvXHJcblx0XHRAa2V5UG9pbnRzID0gQHN0cmluZy5wb2ludHNcclxuXHRcdEBcclxuIiwiIyBDaXJjbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkNpcmNsZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQF9yYWRpdXMgPSAxLCBjeCA9IDAsIGN5ID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ0NpcmNsZSdcclxuXHJcblx0XHRAX2NlbnRlciA9IG5ldyBCdS5Qb2ludChjeCwgY3kpXHJcblx0XHRAYm91bmRzID0gbnVsbCAjIGZvciBhY2NlbGVyYXRlIGNvbnRhaW4gdGVzdFxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBbQF9jZW50ZXJdXHJcblx0XHRAb24gJ2NlbnRlckNoYW5nZWQnLCBAdXBkYXRlS2V5UG9pbnRzXHJcblxyXG5cdGNsb25lOiAoKSAtPiBuZXcgQnUuQ2lyY2xlIEByYWRpdXMsIEBjeCwgQGN5XHJcblxyXG5cdHVwZGF0ZUtleVBvaW50czogLT5cclxuXHRcdEBrZXlQb2ludHNbMF0uc2V0IEBjeCwgQGN5XHJcblxyXG5cdCMgcHJvcGVydHlcclxuXHJcblx0QHByb3BlcnR5ICdjeCcsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyLnhcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jZW50ZXIueCA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2VudGVyQ2hhbmdlZCcsIEBcclxuXHJcblx0QHByb3BlcnR5ICdjeScsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyLnlcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jZW50ZXIueSA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2VudGVyQ2hhbmdlZCcsIEBcclxuXHJcblx0QHByb3BlcnR5ICdjZW50ZXInLFxyXG5cdFx0Z2V0OiAtPiBAX2NlbnRlclxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2NlbnRlciA9IHZhbFxyXG5cdFx0XHRAY3ggPSB2YWwueFxyXG5cdFx0XHRAY3kgPSB2YWwueVxyXG5cdFx0XHRAa2V5UG9pbnRzWzBdID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdjZW50ZXJDaGFuZ2VkJywgQFxyXG5cclxuXHRAcHJvcGVydHkgJ3JhZGl1cycsXHJcblx0XHRnZXQ6IC0+IEBfcmFkaXVzXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfcmFkaXVzID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdyYWRpdXNDaGFuZ2VkJywgQFxyXG5cdFx0XHRAXHJcbiIsIiMgRmFuIHNoYXBlXHJcblxyXG5jbGFzcyBCdS5GYW4gZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG8pIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdGYW4nXHJcblxyXG5cdFx0W0BhRnJvbSwgQGFUb10gPSBbQGFUbywgQGFGcm9tXSBpZiBAYUZyb20gPiBAYVRvXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZyA9IG5ldyBCdS5MaW5lIEBjZW50ZXIuYXJjVG8oQHJhZGl1cywgQGFGcm9tKSwgQGNlbnRlci5hcmNUbyhAcmFkaXVzLCBAYVRvKVxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBbXHJcblx0XHRcdEBzdHJpbmcucG9pbnRzWzBdXHJcblx0XHRcdEBzdHJpbmcucG9pbnRzWzFdXHJcblx0XHRcdEBjZW50ZXJcclxuXHRcdF1cclxuXHRcdEBvbiAnY2hhbmdlZCcsIEB1cGRhdGVLZXlQb2ludHNcclxuXHRcdEBvbiAnY2hhbmdlZCcsID0+IEAuYm91bmRzPy51cGRhdGUoKVxyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LkZhbiBAY3gsIEBjeSwgQHJhZGl1cywgQGFGcm9tLCBAYVRvXHJcblxyXG5cdHVwZGF0ZUtleVBvaW50czogLT5cclxuXHRcdEBjZW50ZXIuc2V0IEBjeCwgQGN5XHJcblx0XHRAc3RyaW5nLnBvaW50c1swXS5jb3B5IEBjZW50ZXIuYXJjVG8gQHJhZGl1cywgQGFGcm9tXHJcblx0XHRAc3RyaW5nLnBvaW50c1sxXS5jb3B5IEBjZW50ZXIuYXJjVG8gQHJhZGl1cywgQGFUb1xyXG5cdFx0QFxyXG4iLCIjIGxpbmUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHAxLCBwMiwgcDMsIHA0KSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnTGluZSdcclxuXHJcblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxyXG5cdFx0XHRAcG9pbnRzID0gW25ldyBCdS5Qb2ludCgpLCBuZXcgQnUuUG9pbnQoKV1cclxuXHRcdGVsc2UgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDRcclxuXHRcdFx0QHBvaW50cyA9IFtwMS5jbG9uZSgpLCBwMi5jbG9uZSgpXVxyXG5cdFx0ZWxzZSAgIyBsZW4gPj0gNFxyXG5cdFx0XHRAcG9pbnRzID0gW25ldyBCdS5Qb2ludChwMSwgcDIpLCBuZXcgQnUuUG9pbnQocDMsIHA0KV1cclxuXHJcblx0XHRAbGVuZ3RoID0gMFxyXG5cdFx0QG1pZHBvaW50ID0gbmV3IEJ1LlBvaW50KClcclxuXHRcdEBrZXlQb2ludHMgPSBAcG9pbnRzXHJcblxyXG5cdFx0QG9uIFwiY2hhbmdlZFwiLCA9PlxyXG5cdFx0XHRAbGVuZ3RoID0gQHBvaW50c1swXS5kaXN0YW5jZVRvKEBwb2ludHNbMV0pXHJcblx0XHRcdEBtaWRwb2ludC5zZXQoKEBwb2ludHNbMF0ueCArIEBwb2ludHNbMV0ueCkgLyAyLCAoQHBvaW50c1swXS55ICsgQHBvaW50c1sxXS55KSAvIDIpXHJcblxyXG5cdFx0QHRyaWdnZXIgXCJjaGFuZ2VkXCJcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5MaW5lIEBwb2ludHNbMF0sIEBwb2ludHNbMV1cclxuXHJcblx0IyBlZGl0XHJcblxyXG5cdHNldDogKGExLCBhMiwgYTMsIGE0KSAtPlxyXG5cdFx0aWYgcDQ/XHJcblx0XHRcdEBwb2ludHNbMF0uc2V0IGExLCBhMlxyXG5cdFx0XHRAcG9pbnRzWzFdLnNldCBhMywgYTRcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBvaW50c1swXSA9IGExXHJcblx0XHRcdEBwb2ludHNbMV0gPSBhMlxyXG5cdFx0QHRyaWdnZXIgXCJjaGFuZ2VkXCJcclxuXHRcdEBcclxuXHJcblx0c2V0UG9pbnQxOiAoYTEsIGEyKSAtPlxyXG5cdFx0aWYgYTI/XHJcblx0XHRcdEBwb2ludHNbMF0uc2V0IGExLCBhMlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcG9pbnRzWzBdLmNvcHkgYTFcclxuXHRcdEB0cmlnZ2VyIFwiY2hhbmdlZFwiXHJcblx0XHRAXHJcblxyXG5cdHNldFBvaW50MjogKGExLCBhMikgLT5cclxuXHRcdGlmIGEyP1xyXG5cdFx0XHRAcG9pbnRzWzFdLnNldCBhMSwgYTJcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBvaW50c1sxXS5jb3B5IGExXHJcblx0XHRAdHJpZ2dlciBcImNoYW5nZWRcIlxyXG5cdFx0QFxyXG4iLCIjIHBvaW50IHNoYXBlXHJcblxyXG5jbGFzcyBCdS5Qb2ludCBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHggPSAwLCBAeSA9IDApIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdQb2ludCdcclxuXHJcblx0XHRAbGluZVdpZHRoID0gMC41XHJcblx0XHRAX2xhYmVsSW5kZXggPSAtMVxyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LlBvaW50IEB4LCBAeVxyXG5cclxuXHRAcHJvcGVydHkgJ2xhYmVsJyxcclxuXHRcdGdldDogLT4gaWYgQF9sYWJlbEluZGV4ID4gLTEgdGhlbiBAY2hpbGRyZW5bQF9sYWJlbEluZGV4XS50ZXh0IGVsc2UgJydcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0aWYgQF9sYWJlbEluZGV4ID09IC0xXHJcblx0XHRcdFx0cG9pbnRUZXh0ID0gbmV3IEJ1LlBvaW50VGV4dCB2YWwsIEB4ICsgQnUuUE9JTlRfTEFCRUxfT0ZGU0VULCBAeSwge2FsaWduOiAnKzAnfVxyXG5cdFx0XHRcdEBjaGlsZHJlbi5wdXNoIHBvaW50VGV4dFxyXG5cdFx0XHRcdEBfbGFiZWxJbmRleCA9IEBjaGlsZHJlbi5sZW5ndGggLSAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAY2hpbGRyZW5bQF9sYWJlbEluZGV4XS50ZXh0ID0gdmFsXHJcblxyXG5cdGFyY1RvOiAocmFkaXVzLCBhcmMpIC0+XHJcblx0XHRyZXR1cm4gbmV3IEJ1LlBvaW50IEB4ICsgTWF0aC5jb3MoYXJjKSAqIHJhZGl1cywgQHkgKyBNYXRoLnNpbihhcmMpICogcmFkaXVzXHJcblxyXG5cclxuXHQjIGNvcHkgdmFsdWUgZnJvbSBvdGhlciBsaW5lXHJcblx0Y29weTogKHBvaW50KSAtPlxyXG5cdFx0QHggPSBwb2ludC54XHJcblx0XHRAeSA9IHBvaW50LnlcclxuXHRcdEB1cGRhdGVMYWJlbCgpXHJcblxyXG5cdCMgc2V0IHZhbHVlIGZyb20geCwgeVxyXG5cdHNldDogKHgsIHkpIC0+XHJcblx0XHRAeCA9IHhcclxuXHRcdEB5ID0geVxyXG5cdFx0QHVwZGF0ZUxhYmVsKClcclxuXHJcblx0dXBkYXRlTGFiZWw6IC0+XHJcblx0XHRpZiBAX2xhYmVsSW5kZXggPiAtMVxyXG5cdFx0XHRAY2hpbGRyZW5bQF9sYWJlbEluZGV4XS54ID0gQHggKyBCdS5QT0lOVF9MQUJFTF9PRkZTRVRcclxuXHRcdFx0QGNoaWxkcmVuW0BfbGFiZWxJbmRleF0ueSA9IEB5XHJcbiIsIiMgcG9seWdvbiBzaGFwZVxyXG5cclxuY2xhc3MgQnUuUG9seWdvbiBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdCMjI1xyXG4gICAgY29uc3RydWN0b3JzXHJcbiAgICAxLiBQb2x5Z29uKHBvaW50cylcclxuICAgIDIuIFBvbHlnb24oeCwgeSwgcmFkaXVzLCBuLCBvcHRpb25zKTogdG8gZ2VuZXJhdGUgcmVndWxhciBwb2x5Z29uXHJcbiAgICBcdG9wdGlvbnM6IGFuZ2xlIC0gc3RhcnQgYW5nbGUgb2YgcmVndWxhciBwb2x5Z29uXHJcblx0IyMjXHJcblx0Y29uc3RydWN0b3I6IChwb2ludHMpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdQb2x5Z29uJ1xyXG5cclxuXHRcdEB2ZXJ0aWNlcyA9IFtdXHJcblx0XHRAbGluZXMgPSBbXVxyXG5cdFx0QHRyaWFuZ2xlcyA9IFtdXHJcblxyXG5cdFx0b3B0aW9ucyA9IEJ1LmNvbWJpbmVPcHRpb25zIGFyZ3VtZW50cyxcclxuXHRcdFx0YW5nbGU6IDBcclxuXHJcblx0XHRpZiBCdS5pc0FycmF5IHBvaW50c1xyXG5cdFx0XHRAdmVydGljZXMgPSBwb2ludHMgaWYgcG9pbnRzP1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBhcmd1bWVudHMubGVuZ3RoIDwgNFxyXG5cdFx0XHRcdHggPSAwXHJcblx0XHRcdFx0eSA9IDBcclxuXHRcdFx0XHRyYWRpdXMgPSBhcmd1bWVudHNbMF1cclxuXHRcdFx0XHRuID0gYXJndW1lbnRzWzFdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR4ID0gYXJndW1lbnRzWzBdXHJcblx0XHRcdFx0eSA9IGFyZ3VtZW50c1sxXVxyXG5cdFx0XHRcdHJhZGl1cyA9IGFyZ3VtZW50c1syXVxyXG5cdFx0XHRcdG4gPSBhcmd1bWVudHNbM11cclxuXHRcdFx0QHZlcnRpY2VzID0gQnUuUG9seWdvbi5nZW5lcmF0ZVJlZ3VsYXJQb2ludHMgeCwgeSwgcmFkaXVzLCBuLCBvcHRpb25zXHJcblxyXG5cdFx0QG9uVmVydGljZXNDaGFuZ2VkKClcclxuXHRcdEBvbiAnY2hhbmdlZCcsIEBvblZlcnRpY2VzQ2hhbmdlZFxyXG5cdFx0QG9uICdjaGFuZ2VkJywgPT4gQC5ib3VuZHM/LnVwZGF0ZSgpXHJcblx0XHRAa2V5UG9pbnRzID0gQHZlcnRpY2VzXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuUG9seWdvbiBAdmVydGljZXNcclxuXHJcblx0b25WZXJ0aWNlc0NoYW5nZWQ6IC0+XHJcblx0XHRAbGluZXMgPSBbXVxyXG5cdFx0QHRyaWFuZ2xlcyA9IFtdXHJcblx0XHQjIGluaXQgbGluZXNcclxuXHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAxXHJcblx0XHRcdGZvciBpIGluIFswIC4uLiBAdmVydGljZXMubGVuZ3RoIC0gMV1cclxuXHRcdFx0XHRAbGluZXMucHVzaChuZXcgQnUuTGluZShAdmVydGljZXNbaV0sIEB2ZXJ0aWNlc1tpICsgMV0pKVxyXG5cdFx0XHRAbGluZXMucHVzaChuZXcgQnUuTGluZShAdmVydGljZXNbQHZlcnRpY2VzLmxlbmd0aCAtIDFdLCBAdmVydGljZXNbMF0pKVxyXG5cclxuXHRcdCMgaW5pdCB0cmlhbmdsZXNcclxuXHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAyXHJcblx0XHRcdGZvciBpIGluIFsxIC4uLiBAdmVydGljZXMubGVuZ3RoIC0gMV1cclxuXHRcdFx0XHRAdHJpYW5nbGVzLnB1c2gobmV3IEJ1LlRyaWFuZ2xlKEB2ZXJ0aWNlc1swXSwgQHZlcnRpY2VzW2ldLCBAdmVydGljZXNbaSArIDFdKSlcclxuXHJcblx0IyBkZXRlY3RcclxuXHJcblx0aXNTaW1wbGU6ICgpIC0+XHJcblx0XHRsZW4gPSBAbGluZXMubGVuZ3RoXHJcblx0XHRmb3IgaSBpbiBbMC4uLmxlbl1cclxuXHRcdFx0Zm9yIGogaW4gW2kgKyAxLi4ubGVuXVxyXG5cdFx0XHRcdGlmIEBsaW5lc1tpXS5pc0Nyb3NzV2l0aExpbmUoQGxpbmVzW2pdKVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHQjIGVkaXRcclxuXHJcblx0YWRkUG9pbnQ6IChwb2ludCwgaW5zZXJ0SW5kZXgpIC0+XHJcblx0XHRpZiBub3QgaW5zZXJ0SW5kZXg/XHJcblx0XHRcdCMgYWRkIHBvaW50XHJcblx0XHRcdEB2ZXJ0aWNlcy5wdXNoIHBvaW50XHJcblxyXG5cdFx0XHQjIGFkZCBsaW5lXHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAxXHJcblx0XHRcdFx0QGxpbmVzW0BsaW5lcy5sZW5ndGggLSAxXS5wb2ludHNbMV0gPSBwb2ludFxyXG5cdFx0XHRpZiBAdmVydGljZXMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMV0sIEB2ZXJ0aWNlc1swXSkpXHJcblxyXG5cdFx0XHQjIGFkZCB0cmlhbmdsZVxyXG5cdFx0XHRpZiBAdmVydGljZXMubGVuZ3RoID4gMlxyXG5cdFx0XHRcdEB0cmlhbmdsZXMucHVzaChuZXcgQnUuVHJpYW5nbGUoXHJcblx0XHRcdFx0XHRcdEB2ZXJ0aWNlc1swXVxyXG5cdFx0XHRcdFx0XHRAdmVydGljZXNbQHZlcnRpY2VzLmxlbmd0aCAtIDJdXHJcblx0XHRcdFx0XHRcdEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMV1cclxuXHRcdFx0XHQpKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAdmVydGljZXMuc3BsaWNlKGluc2VydEluZGV4LCAwLCBwb2ludClcclxuXHQjIFRPRE8gYWRkIGxpbmVzIGFuZCB0cmlhbmdsZXNcclxuXHJcblx0QGdlbmVyYXRlUmVndWxhclBvaW50cyA9IChjeCwgY3ksIHJhZGl1cywgbiwgb3B0aW9ucykgLT5cclxuXHRcdGFuZ2xlRGVsdGEgPSBvcHRpb25zLmFuZ2xlXHJcblx0XHRyID0gcmFkaXVzXHJcblx0XHRwb2ludHMgPSBbXVxyXG5cdFx0YW5nbGVTZWN0aW9uID0gTWF0aC5QSSAqIDIgLyBuXHJcblx0XHRmb3IgaSBpbiBbMCAuLi4gbl1cclxuXHRcdFx0YSA9IGkgKiBhbmdsZVNlY3Rpb24gKyBhbmdsZURlbHRhXHJcblx0XHRcdHggPSBjeCArIHIgKiBNYXRoLmNvcyhhKVxyXG5cdFx0XHR5ID0gY3kgKyByICogTWF0aC5zaW4oYSlcclxuXHRcdFx0cG9pbnRzW2ldID0gbmV3IEJ1LlBvaW50IHgsIHlcclxuXHRcdHJldHVybiBwb2ludHNcclxuIiwiIyBwb2x5bGluZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuUG9seWxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB2ZXJ0aWNlcyA9IFtdKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnUG9seWxpbmUnXHJcblxyXG5cdFx0aWYgYXJndW1lbnRzLmxlbmd0aCA+IDFcclxuXHRcdFx0dmVydGljZXMgPSBbXVxyXG5cdFx0XHRmb3IgaSBpbiBbMCAuLi4gYXJndW1lbnRzLmxlbmd0aCAvIDJdXHJcblx0XHRcdFx0dmVydGljZXMucHVzaCBuZXcgQnUuUG9pbnQgYXJndW1lbnRzW2kgKiAyXSwgYXJndW1lbnRzW2kgKiAyICsgMV1cclxuXHRcdFx0QHZlcnRpY2VzID0gdmVydGljZXNcclxuXHJcblx0XHRAbGluZXMgPSBbXVxyXG5cdFx0QGtleVBvaW50cyA9IEB2ZXJ0aWNlc1xyXG5cclxuXHRcdEBmaWxsIG9mZlxyXG5cclxuXHRcdEBvbiBcImNoYW5nZWRcIiwgPT5cclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAdXBkYXRlTGluZXMoKVxyXG5cdFx0XHRcdEBjYWxjTGVuZ3RoPygpXHJcblx0XHRcdFx0QGNhbGNQb2ludE5vcm1hbGl6ZWRQb3M/KClcclxuXHRcdEB0cmlnZ2VyIFwiY2hhbmdlZFwiXHJcblxyXG5cdGNsb25lOiAtPlxyXG5cdFx0cG9seWxpbmUgPSBuZXcgQnUuUG9seWxpbmUgQHZlcnRpY2VzXHJcblx0XHRwb2x5bGluZS5zdHJva2VTdHlsZSA9IEBzdHJva2VTdHlsZVxyXG5cdFx0cG9seWxpbmUuZmlsbFN0eWxlID0gQGZpbGxTdHlsZVxyXG5cdFx0cG9seWxpbmUuZGFzaFN0eWxlID0gQGRhc2hTdHlsZVxyXG5cdFx0cG9seWxpbmUubGluZVdpZHRoID0gQGxpbmVXaWR0aFxyXG5cdFx0cG9seWxpbmUuZGFzaE9mZnNldCA9IEBkYXNoT2Zmc2V0XHJcblx0XHRwb2x5bGluZVxyXG5cclxuXHR1cGRhdGVMaW5lczogLT5cclxuXHRcdGZvciBpIGluIFswIC4uLiBAdmVydGljZXMubGVuZ3RoIC0gMV1cclxuXHRcdFx0aWYgQGxpbmVzW2ldP1xyXG5cdFx0XHRcdEBsaW5lc1tpXS5zZXQgQHZlcnRpY2VzW2ldLCBAdmVydGljZXNbaSArIDFdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAbGluZXNbaV0gPSBuZXcgQnUuTGluZSBAdmVydGljZXNbaV0sIEB2ZXJ0aWNlc1tpICsgMV1cclxuXHRcdCMgVE9ETyByZW1vdmUgdGhlIHJlc3RcclxuXHRcdEBcclxuXHJcblx0IyBlZGl0XHJcblxyXG5cdHNldCA9IChwb2ludHMpIC0+XHJcblx0XHQjIHBvaW50c1xyXG5cdFx0Zm9yIGkgaW4gWzAgLi4uIEB2ZXJ0aWNlcy5sZW5ndGhdXHJcblx0XHRcdEB2ZXJ0aWNlc1tpXS5jb3B5IHBvaW50c1tpXVxyXG5cclxuXHRcdCMgcmVtb3ZlIHRoZSBleHRyYSBwb2ludHNcclxuXHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiBwb2ludHMubGVuZ3RoXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UgcG9pbnRzLmxlbmd0aFxyXG5cclxuXHRcdEB0cmlnZ2VyIFwiY2hhbmdlZFwiXHJcblx0XHRAXHJcblxyXG5cdGFkZFBvaW50OiAocG9pbnQsIGluc2VydEluZGV4KSAtPlxyXG5cdFx0aWYgbm90IGluc2VydEluZGV4P1xyXG5cdFx0XHQjIGFkZCBwb2ludFxyXG5cdFx0XHRAdmVydGljZXMucHVzaCBwb2ludFxyXG5cdFx0XHQjIGFkZCBsaW5lXHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAxXHJcblx0XHRcdFx0QGxpbmVzLnB1c2ggbmV3IEJ1LkxpbmUgQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAyXSwgQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAdmVydGljZXMuc3BsaWNlIGluc2VydEluZGV4LCAwLCBwb2ludFxyXG5cdFx0IyBUT0RPIGFkZCBsaW5lc1xyXG5cdFx0QHRyaWdnZXIgXCJjaGFuZ2VkXCJcclxuXHRcdEBcclxuIiwiIyByZWN0YW5nbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlJlY3RhbmdsZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ1JlY3RhbmdsZSdcclxuXHJcblx0XHRAY2VudGVyID0gbmV3IEJ1LlBvaW50IHggKyB3aWR0aCAvIDIsIHkgKyBoZWlnaHQgLyAyXHJcblx0XHRAc2l6ZSA9IG5ldyBCdS5TaXplIHdpZHRoLCBoZWlnaHRcclxuXHJcblx0XHRAcG9pbnRMVCA9IG5ldyBCdS5Qb2ludCB4LCB5XHJcblx0XHRAcG9pbnRSVCA9IG5ldyBCdS5Qb2ludCB4ICsgd2lkdGgsIHlcclxuXHRcdEBwb2ludFJCID0gbmV3IEJ1LlBvaW50IHggKyB3aWR0aCwgeSArIGhlaWdodFxyXG5cdFx0QHBvaW50TEIgPSBuZXcgQnUuUG9pbnQgeCwgeSArIGhlaWdodFxyXG5cclxuXHRcdEBwb2ludHMgPSBbQHBvaW50TFQsIEBwb2ludFJULCBAcG9pbnRSQiwgQHBvaW50TEJdXHJcblxyXG5cdFx0QGNvcm5lclJhZGl1cyA9IGNvcm5lclJhZGl1c1xyXG5cdFx0QG9uICdjaGFuZ2VkJywgPT4gQC5ib3VuZHM/LnVwZGF0ZSgpXHJcblxyXG5cdEBwcm9wZXJ0eSAnY29ybmVyUmFkaXVzJyxcclxuXHRcdGdldDogLT4gQF9jb3JuZXJSYWRpdXNcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jb3JuZXJSYWRpdXMgPSB2YWxcclxuXHRcdFx0QGtleVBvaW50cyA9IGlmIHZhbCA+IDAgdGhlbiBbXSBlbHNlIEBwb2ludHNcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5SZWN0YW5nbGUgQHBvaW50TFQueCwgQHBvaW50TFQueSwgQHNpemUud2lkdGgsIEBzaXplLmhlaWdodFxyXG5cclxuXHRzZXQ6ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSAtPlxyXG5cdFx0QGNlbnRlci5zZXQgeCArIHdpZHRoIC8gMiwgeSArIGhlaWdodCAvIDJcclxuXHRcdEBzaXplLnNldCB3aWR0aCwgaGVpZ2h0XHJcblxyXG5cdFx0QHBvaW50TFQuc2V0IHgsIHlcclxuXHRcdEBwb2ludFJULnNldCB4ICsgd2lkdGgsIHlcclxuXHRcdEBwb2ludFJCLnNldCB4ICsgd2lkdGgsIHkgKyBoZWlnaHRcclxuXHRcdEBwb2ludExCLnNldCB4LCB5ICsgaGVpZ2h0XHJcbiIsIiMgc3BsaW5lIHNoYXBlXHJcblxyXG5jbGFzcyBCdS5TcGxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHZlcnRpY2VzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnU3BsaW5lJ1xyXG5cclxuXHRcdGlmIHZlcnRpY2VzIGluc3RhbmNlb2YgQnUuUG9seWxpbmVcclxuXHRcdFx0cG9seWxpbmUgPSB2ZXJ0aWNlc1xyXG5cdFx0XHRAdmVydGljZXMgPSBwb2x5bGluZS52ZXJ0aWNlc1xyXG5cdFx0XHRwb2x5bGluZS5vbiAncG9pbnRDaGFuZ2UnLCAocG9seWxpbmUpID0+XHJcblx0XHRcdFx0QHZlcnRpY2VzID0gcG9seWxpbmUudmVydGljZXNcclxuXHRcdFx0XHRjYWxjQ29udHJvbFBvaW50cyBAXHJcblx0XHRlbHNlXHJcblx0XHRcdEB2ZXJ0aWNlcyA9IEJ1LmNsb25lIHZlcnRpY2VzXHJcblxyXG5cdFx0QGtleVBvaW50cyA9IEB2ZXJ0aWNlc1xyXG5cdFx0QGNvbnRyb2xQb2ludHNBaGVhZCA9IFtdXHJcblx0XHRAY29udHJvbFBvaW50c0JlaGluZCA9IFtdXHJcblxyXG5cdFx0QGZpbGwgb2ZmXHJcblx0XHRAc21vb3RoRmFjdG9yID0gQnUuREVGQVVMVF9TUExJTkVfU01PT1RIXHJcblx0XHRAX3Ntb290aGVyID0gbm9cclxuXHJcblx0XHRjYWxjQ29udHJvbFBvaW50cyBAXHJcblxyXG5cdEBwcm9wZXJ0eSAnc21vb3RoZXInLFxyXG5cdFx0Z2V0OiAtPiBAX3Ntb290aGVyXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdG9sZFZhbCA9IEBfc21vb3RoZXJcclxuXHRcdFx0QF9zbW9vdGhlciA9IHZhbFxyXG5cdFx0XHRjYWxjQ29udHJvbFBvaW50cyBAIGlmIG9sZFZhbCAhPSBAX3Ntb290aGVyXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuU3BsaW5lIEB2ZXJ0aWNlc1xyXG5cclxuXHRhZGRQb2ludDogKHBvaW50KSAtPlxyXG5cdFx0QHZlcnRpY2VzLnB1c2ggcG9pbnRcclxuXHRcdGNhbGNDb250cm9sUG9pbnRzIEBcclxuXHJcblx0Y2FsY0NvbnRyb2xQb2ludHMgPSAoc3BsaW5lKSAtPlxyXG5cdFx0c3BsaW5lLmtleVBvaW50cyA9IHNwbGluZS52ZXJ0aWNlc1xyXG5cclxuXHRcdHAgPSBzcGxpbmUudmVydGljZXNcclxuXHRcdGxlbiA9IHAubGVuZ3RoXHJcblx0XHRpZiBsZW4gPj0gMVxyXG5cdFx0XHRzcGxpbmUuY29udHJvbFBvaW50c0JlaGluZFswXSA9IHBbMF1cclxuXHRcdGlmIGxlbiA+PSAyXHJcblx0XHRcdHNwbGluZS5jb250cm9sUG9pbnRzQWhlYWRbbGVuIC0gMV0gPSBwW2xlbiAtIDFdXHJcblx0XHRpZiBsZW4gPj0gM1xyXG5cdFx0XHRmb3IgaSBpbiBbMS4uLmxlbiAtIDFdXHJcblx0XHRcdFx0dGhldGExID0gTWF0aC5hdGFuMiBwW2ldLnkgLSBwW2kgLSAxXS55LCBwW2ldLnggLSBwW2kgLSAxXS54XHJcblx0XHRcdFx0dGhldGEyID0gTWF0aC5hdGFuMiBwW2kgKyAxXS55IC0gcFtpXS55LCBwW2kgKyAxXS54IC0gcFtpXS54XHJcblx0XHRcdFx0bGVuMSA9IEJ1LmJldmVsIHBbaV0ueSAtIHBbaSAtIDFdLnksIHBbaV0ueCAtIHBbaSAtIDFdLnhcclxuXHRcdFx0XHRsZW4yID0gQnUuYmV2ZWwgcFtpXS55IC0gcFtpICsgMV0ueSwgcFtpXS54IC0gcFtpICsgMV0ueFxyXG5cdFx0XHRcdHRoZXRhID0gdGhldGExICsgKHRoZXRhMiAtIHRoZXRhMSkgKiBpZiBzcGxpbmUuX3Ntb290aGVyIHRoZW4gbGVuMSAvIChsZW4xICsgbGVuMikgZWxzZSAwLjVcclxuXHRcdFx0XHR0aGV0YSArPSBNYXRoLlBJIGlmIE1hdGguYWJzKHRoZXRhIC0gdGhldGExKSA+IE1hdGguUEkgLyAyXHJcblx0XHRcdFx0eEEgPSBwW2ldLnggLSBsZW4xICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguY29zKHRoZXRhKVxyXG5cdFx0XHRcdHlBID0gcFtpXS55IC0gbGVuMSAqIHNwbGluZS5zbW9vdGhGYWN0b3IgKiBNYXRoLnNpbih0aGV0YSlcclxuXHRcdFx0XHR4QiA9IHBbaV0ueCArIGxlbjIgKiBzcGxpbmUuc21vb3RoRmFjdG9yICogTWF0aC5jb3ModGhldGEpXHJcblx0XHRcdFx0eUIgPSBwW2ldLnkgKyBsZW4yICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguc2luKHRoZXRhKVxyXG5cdFx0XHRcdHNwbGluZS5jb250cm9sUG9pbnRzQWhlYWRbaV0gPSBuZXcgQnUuUG9pbnQgeEEsIHlBXHJcblx0XHRcdFx0c3BsaW5lLmNvbnRyb2xQb2ludHNCZWhpbmRbaV0gPSBuZXcgQnUuUG9pbnQgeEIsIHlCXHJcblxyXG5cdFx0XHRcdCMgYWRkIGNvbnRyb2wgbGluZXMgZm9yIGRlYnVnZ2luZ1xyXG5cdFx0XHRcdCNzcGxpbmUuY2hpbGRyZW5baSAqIDIgLSAyXSA9IG5ldyBCdS5MaW5lIHNwbGluZS52ZXJ0aWNlc1tpXSwgc3BsaW5lLmNvbnRyb2xQb2ludHNBaGVhZFtpXVxyXG5cdFx0XHRcdCNzcGxpbmUuY2hpbGRyZW5baSAqIDIgLSAxXSA9ICBuZXcgQnUuTGluZSBzcGxpbmUudmVydGljZXNbaV0sIHNwbGluZS5jb250cm9sUG9pbnRzQmVoaW5kW2ldXHJcbiIsIiMgdHJpYW5nbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlRyaWFuZ2xlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChwMSwgcDIsIHAzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnVHJpYW5nbGUnXHJcblxyXG5cdFx0aWYgYXJndW1lbnRzLmxlbmd0aCA9PSA2XHJcblx0XHRcdFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzXSA9IGFyZ3VtZW50c1xyXG5cdFx0XHRwMSA9IG5ldyBCdS5Qb2ludCB4MSwgeTFcclxuXHRcdFx0cDIgPSBuZXcgQnUuUG9pbnQgeDIsIHkyXHJcblx0XHRcdHAzID0gbmV3IEJ1LlBvaW50IHgzLCB5M1xyXG5cclxuXHRcdEBsaW5lcyA9IFtcclxuXHRcdFx0bmV3IEJ1LkxpbmUocDEsIHAyKVxyXG5cdFx0XHRuZXcgQnUuTGluZShwMiwgcDMpXHJcblx0XHRcdG5ldyBCdS5MaW5lKHAzLCBwMSlcclxuXHRcdF1cclxuXHRcdCNAY2VudGVyID0gbmV3IEJ1LlBvaW50IEJ1LmF2ZXJhZ2UocDEueCwgcDIueCwgcDMueCksIEJ1LmF2ZXJhZ2UocDEueSwgcDIueSwgcDMueSlcclxuXHRcdEBwb2ludHMgPSBbcDEsIHAyLCBwM11cclxuXHRcdEBrZXlQb2ludHMgPSBAcG9pbnRzXHJcblx0XHRAb24gJ2NoYW5nZWQnLCBAdXBkYXRlXHJcblx0XHRAb24gJ2NoYW5nZWQnLCA9PiBALmJvdW5kcz8udXBkYXRlKClcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5UcmlhbmdsZSBAcG9pbnRzWzBdLCBAcG9pbnRzWzFdLCBAcG9pbnRzWzJdXHJcblxyXG5cdHVwZGF0ZTogLT5cclxuXHRcdEBsaW5lc1swXS5wb2ludHNbMF0uY29weSBAcG9pbnRzWzBdXHJcblx0XHRAbGluZXNbMF0ucG9pbnRzWzFdLmNvcHkgQHBvaW50c1sxXVxyXG5cdFx0QGxpbmVzWzFdLnBvaW50c1swXS5jb3B5IEBwb2ludHNbMV1cclxuXHRcdEBsaW5lc1sxXS5wb2ludHNbMV0uY29weSBAcG9pbnRzWzJdXHJcblx0XHRAbGluZXNbMl0ucG9pbnRzWzBdLmNvcHkgQHBvaW50c1syXVxyXG5cdFx0QGxpbmVzWzJdLnBvaW50c1sxXS5jb3B5IEBwb2ludHNbMF1cclxuIiwiIyBVc2VkIHRvIHJlbmRlciBiaXRtYXAgdG8gdGhlIHNjcmVlblxyXG5cclxuY2xhc3MgQnUuSW1hZ2UgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB1cmwsIHggPSAwLCB5ID0gMCwgd2lkdGgsIGhlaWdodCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ0ltYWdlJ1xyXG5cclxuXHRcdEBhdXRvU2l6ZSA9IHllc1xyXG5cdFx0QHNpemUgPSBuZXcgQnUuU2l6ZVxyXG5cdFx0QHBvc2l0aW9uID0gbmV3IEJ1LlZlY3RvciB4LCB5XHJcblx0XHRAY2VudGVyID0gbmV3IEJ1LlZlY3RvciB4ICsgd2lkdGggLyAyLCB5ICsgaGVpZ2h0IC8gMlxyXG5cdFx0aWYgd2lkdGg/XHJcblx0XHRcdEBzaXplLnNldCB3aWR0aCwgaGVpZ2h0XHJcblx0XHRcdEBhdXRvU2l6ZSA9IG5vXHJcblxyXG5cdFx0QHBpdm90ID0gbmV3IEJ1LlZlY3RvciAwLjUsIDAuNVxyXG5cclxuXHRcdEBfaW1hZ2UgPSBuZXcgQnUuZ2xvYmFsLkltYWdlXHJcblx0XHRAcmVhZHkgPSBmYWxzZVxyXG5cclxuXHRcdEBfaW1hZ2Uub25sb2FkID0gKGUpID0+XHJcblx0XHRcdGlmIEBhdXRvU2l6ZVxyXG5cdFx0XHRcdEBzaXplLnNldCBAX2ltYWdlLndpZHRoLCBAX2ltYWdlLmhlaWdodFxyXG5cdFx0XHRAcmVhZHkgPSB0cnVlXHJcblxyXG5cdFx0QF9pbWFnZS5zcmMgPSBAdXJsIGlmIEB1cmw/XHJcblxyXG5cdEBwcm9wZXJ0eSAnaW1hZ2UnLFxyXG5cdFx0Z2V0OiAtPiBAX2ltYWdlXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfaW1hZ2UgPSB2YWxcclxuXHRcdFx0QHJlYWR5ID0geWVzXHJcbiIsIiMgUmVuZGVyIHRleHQgYXJvdW5kIGEgcG9pbnRcclxuXHJcbmNsYXNzIEJ1LlBvaW50VGV4dCBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdCMjI1xyXG5cdG9wdGlvbnMuYWxpZ246XHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdHwgICAtLSAgICAwLSAgICArLSAgIHxcclxuXHR8ICAgICAgICAgfOKGmTAwICAgICAgfFxyXG5cdHwgICAtMCAgLS0rLT4gICArMCAgIHxcclxuXHR8ICAgICAgICAg4oaTICAgICAgICAgIHxcclxuXHR8ICAgLSsgICAgMCsgICAgKysgICB8XHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdGZvciBleGFtcGxlOiB0ZXh0IGlzIGluIHRoZSByaWdodCB0b3Agb2YgdGhlIHBvaW50LCB0aGVuIGFsaWduID0gXCIrLVwiXHJcblx0IyMjXHJcblx0Y29uc3RydWN0b3I6IChAdGV4dCwgQHggPSAwLCBAeSA9IDApIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdQb2ludFRleHQnXHJcblx0XHRAc3Ryb2tlU3R5bGUgPSBudWxsICMgbm8gc3Ryb2tlIGJ5IGRlZmF1bHRcclxuXHRcdEBmaWxsU3R5bGUgPSBCdS5ERUZBVUxUX1RFWFRfRklMTF9TVFlMRVxyXG5cclxuXHRcdG9wdGlvbnMgPSBCdS5jb21iaW5lT3B0aW9ucyBhcmd1bWVudHMsXHJcblx0XHRcdGFsaWduOiAnMDAnXHJcblx0XHRAYWxpZ24gPSBvcHRpb25zLmFsaWduXHJcblx0XHRpZiBvcHRpb25zLmZvbnQ/XHJcblx0XHRcdEBmb250ID0gb3B0aW9ucy5mb250XHJcblx0XHRlbHNlIGlmIG9wdGlvbnMuZm9udEZhbWlseT8gb3Igb3B0aW9ucy5mb250U2l6ZT9cclxuXHRcdFx0QF9mb250RmFtaWx5ID0gb3B0aW9ucy5mb250RmFtaWx5IG9yIEJ1LkRFRkFVTFRfRk9OVF9GQU1JTFlcclxuXHRcdFx0QF9mb250U2l6ZSA9IG9wdGlvbnMuZm9udFNpemUgb3IgQnUuREVGQVVMVF9GT05UX1NJWkVcclxuXHRcdFx0QGZvbnQgPSBcIiN7IEBfZm9udFNpemUgfXB4ICN7IEBfZm9udEZhbWlseSB9XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0QGZvbnQgPSBudWxsXHJcblxyXG5cdEBwcm9wZXJ0eSAnYWxpZ24nLFxyXG5cdFx0Z2V0OiAtPiBAX2FsaWduXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfYWxpZ24gPSB2YWxcclxuXHRcdFx0QHNldEFsaWduIEBfYWxpZ25cclxuXHJcblx0QHByb3BlcnR5ICdmb250RmFtaWx5JyxcclxuXHRcdGdldDogLT4gQF9mb250RmFtaWx5XHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfZm9udEZhbWlseSA9IHZhbFxyXG5cdFx0XHRAZm9udCA9IFwiI3sgQF9mb250U2l6ZSB9cHggI3sgQF9mb250RmFtaWx5IH1cIlxyXG5cclxuXHRAcHJvcGVydHkgJ2ZvbnRTaXplJyxcclxuXHRcdGdldDogLT4gQF9mb250U2l6ZVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2ZvbnRTaXplID0gdmFsXHJcblx0XHRcdEBmb250ID0gXCIjeyBAX2ZvbnRTaXplIH1weCAjeyBAX2ZvbnRGYW1pbHkgfVwiXHJcblxyXG5cdHNldEFsaWduOiAoYWxpZ24pIC0+XHJcblx0XHRpZiBhbGlnbi5sZW5ndGggPT0gMVxyXG5cdFx0XHRhbGlnbiA9ICcnICsgYWxpZ24gKyBhbGlnblxyXG5cdFx0YWxpZ25YID0gYWxpZ24uc3Vic3RyaW5nKDAsIDEpXHJcblx0XHRhbGlnblkgPSBhbGlnbi5zdWJzdHJpbmcoMSwgMilcclxuXHRcdEB0ZXh0QWxpZ24gPSBzd2l0Y2ggYWxpZ25YXHJcblx0XHRcdHdoZW4gJy0nIHRoZW4gJ3JpZ2h0J1xyXG5cdFx0XHR3aGVuICcwJyB0aGVuICdjZW50ZXInXHJcblx0XHRcdHdoZW4gJysnIHRoZW4gJ2xlZnQnXHJcblx0XHRAdGV4dEJhc2VsaW5lID0gc3dpdGNoIGFsaWduWVxyXG5cdFx0XHR3aGVuICctJyB0aGVuICdib3R0b20nXHJcblx0XHRcdHdoZW4gJzAnIHRoZW4gJ21pZGRsZSdcclxuXHRcdFx0d2hlbiAnKycgdGhlbiAndG9wJ1xyXG5cdFx0QFxyXG4iLCIjIGFuaW1hdGlvbiBjbGFzcyBhbmQgcHJlc2V0IGFuaW1hdGlvbnNcclxuXHJcbmNsYXNzIEJ1LkFuaW1hdGlvblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XHJcblx0XHRAZnJvbSA9IG9wdGlvbnMuZnJvbVxyXG5cdFx0QHRvID0gb3B0aW9ucy50b1xyXG5cdFx0QGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiBvciAwLjVcclxuXHRcdEBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyBvciBmYWxzZVxyXG5cdFx0QHJlcGVhdCA9ICEhb3B0aW9ucy5yZXBlYXRcclxuXHRcdEBpbml0ID0gb3B0aW9ucy5pbml0XHJcblx0XHRAdXBkYXRlID0gb3B0aW9ucy51cGRhdGVcclxuXHRcdEBmaW5pc2ggPSBvcHRpb25zLmZpbmlzaFxyXG5cclxuXHRhcHBseVRvOiAodGFyZ2V0LCBhcmdzKSAtPlxyXG5cdFx0dGFzayA9IG5ldyBCdS5BbmltYXRpb25UYXNrIEAsIHRhcmdldCwgYXJnc1xyXG5cdFx0QnUuYW5pbWF0aW9uUnVubmVyLmFkZCB0YXNrXHJcblx0XHR0YXNrXHJcblxyXG5cdGlzTGVnYWw6IC0+XHJcblx0XHRyZXR1cm4gdHJ1ZSB1bmxlc3MgQGZyb20/IGFuZCBAdG8/XHJcblxyXG5cdFx0aWYgQnUuaXNQbGFpbk9iamVjdCBAZnJvbVxyXG5cdFx0XHRmb3Igb3duIGtleSBvZiBAZnJvbVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZSB1bmxlc3MgQHRvW2tleV0/XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZSB1bmxlc3MgQHRvP1xyXG5cdFx0dHJ1ZVxyXG5cclxuIyBQcmVzZXQgQW5pbWF0aW9uc1xyXG4jIFNvbWUgb2YgdGhlIGFuaW1hdGlvbnMgYXJlIGNvbnNpc3RlbnQgd2l0aCBqUXVlcnkgVUlcclxuQnUuYW5pbWF0aW9ucyA9XHJcblxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0IyBTaW1wbGVcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRmYWRlSW46IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBvcGFjaXR5ID0gYW5pbS50XHJcblxyXG5cdGZhZGVPdXQ6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBvcGFjaXR5ID0gMSAtIGFuaW0udFxyXG5cclxuXHRzcGluOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAcm90YXRpb24gPSBhbmltLnQgKiBNYXRoLlBJICogMlxyXG5cclxuXHRzcGluSW46IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRhbmltLmRhdGEuZGVzU2NhbGUgPSBhbmltLmFyZyBvciAxXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IGFuaW0udFxyXG5cdFx0XHRAcm90YXRpb24gPSBhbmltLnQgKiBNYXRoLlBJICogNFxyXG5cdFx0XHRAc2NhbGUgPSBhbmltLnQgKiBhbmltLmRhdGEuZGVzU2NhbGVcclxuXHJcblx0c3Bpbk91dDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0dXBkYXRlOiAoYW5pbSkgLT5cclxuXHRcdFx0QG9wYWNpdHkgPSAxIC0gYW5pbS50XHJcblx0XHRcdEByb3RhdGlvbiA9IGFuaW0udCAqIE1hdGguUEkgKiA0XHJcblx0XHRcdEBzY2FsZSA9IDEgLSBhbmltLnRcclxuXHJcblx0Ymxpbms6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGR1cmF0aW9uOiAwLjJcclxuXHRcdGZyb206IDBcclxuXHRcdHRvOiA1MTJcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdGQgPSBNYXRoLmZsb29yIE1hdGguYWJzKGFuaW0uY3VycmVudCAtIDI1NilcclxuXHRcdFx0QGZpbGxTdHlsZSA9IFwicmdiKCN7IGQgfSwgI3sgZCB9LCAjeyBkIH0pXCJcclxuXHJcblx0c2hha2U6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRhbmltLmRhdGEub3ggPSBAcG9zaXRpb24ueFxyXG5cdFx0XHRhbmltLmRhdGEucmFuZ2UgPSBhbmltLmFyZyBvciAyMFxyXG5cdFx0dXBkYXRlOiAoYW5pbSkgLT5cclxuXHRcdFx0QHBvc2l0aW9uLnggPSBNYXRoLnNpbihhbmltLnQgKiBNYXRoLlBJICogOCkgKiBhbmltLmRhdGEucmFuZ2UgKyBhbmltLmRhdGEub3hcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFRvZ2dsZWQ6IGRldGVjdCBhbmQgc2F2ZSBvcmlnaW5hbCBzdGF0dXNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWZmOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRkdXJhdGlvbjogMC4xNVxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9XHJcblx0XHRcdFx0b3BhY2l0eTogQG9wYWNpdHlcclxuXHRcdFx0XHRzY2FsZTogQHNjYWxlLnhcclxuXHRcdFx0YW5pbS50byA9XHJcblx0XHRcdFx0aWYgQG9wYWNpdHkgPT0gMVxyXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxyXG5cdFx0XHRcdFx0c2NhbGU6IEBzY2FsZS54ICogMS41XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxyXG5cdFx0XHRcdFx0c2NhbGU6IEBzY2FsZS54IC8gMS41XHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IGFuaW0uY3VycmVudC5vcGFjaXR5XHJcblx0XHRcdEBzY2FsZSA9IGFuaW0uY3VycmVudC5zY2FsZVxyXG5cclxuXHRjbGlwOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRpbml0OiAoYW5pbSkgLT5cclxuXHRcdFx0aWYgQHNjYWxlLnkgIT0gMFxyXG5cdFx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS55XHJcblx0XHRcdFx0YW5pbS50byA9IDBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS55XHJcblx0XHRcdFx0YW5pbS50byA9IEBzY2FsZS54XHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAc2NhbGUueSA9IGFuaW0uY3VycmVudFxyXG5cclxuXHRmbGlwWDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS54XHJcblx0XHRcdGFuaW0udG8gPSAtYW5pbS5mcm9tXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAc2NhbGUueCA9IGFuaW0uY3VycmVudFxyXG5cclxuXHRmbGlwWTogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS55XHJcblx0XHRcdGFuaW0udG8gPSAtYW5pbS5mcm9tXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAc2NhbGUueSA9IGFuaW0uY3VycmVudFxyXG5cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCMgV2l0aCBBcmd1bWVudHNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRtb3ZlVG86IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRpZiBhbmltLmFyZz9cclxuXHRcdFx0XHRhbmltLmZyb20gPSBAcG9zaXRpb24ueFxyXG5cdFx0XHRcdGFuaW0udG8gPSBwYXJzZUZsb2F0IGFuaW0uYXJnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yICdhbmltYXRpb24gbW92ZVRvIG5lZWQgYW4gYXJndW1lbnQnXHJcblx0XHR1cGRhdGU6IChhbmltKSAtPlxyXG5cdFx0XHRAcG9zaXRpb24ueCA9IGFuaW0uY3VycmVudFxyXG5cclxuXHRtb3ZlQnk6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRpZiBhbmltLmFyZ3M/XHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHBvc2l0aW9uLnhcclxuXHRcdFx0XHRhbmltLnRvID0gQHBvc2l0aW9uLnggKyBwYXJzZUZsb2F0KGFuaW0uYXJncylcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgJ2FuaW1hdGlvbiBtb3ZlVG8gbmVlZCBhbiBhcmd1bWVudCdcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBwb3NpdGlvbi54ID0gYW5pbS5jdXJyZW50XHJcblxyXG5cdGRpc2NvbG9yOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRpbml0OiAoYW5pbSkgLT5cclxuXHRcdFx0ZGVzQ29sb3IgPSBhbmltLmFyZ1xyXG5cdFx0XHRkZXNDb2xvciA9IG5ldyBCdS5Db2xvciBkZXNDb2xvciBpZiBCdS5pc1N0cmluZyBkZXNDb2xvclxyXG5cdFx0XHRhbmltLmZyb20gPSBuZXcgQnUuQ29sb3IgQGZpbGxTdHlsZVxyXG5cdFx0XHRhbmltLnRvID0gZGVzQ29sb3JcclxuXHRcdHVwZGF0ZTogKGFuaW0pIC0+XHJcblx0XHRcdEBmaWxsU3R5bGUgPSBhbmltLmN1cnJlbnQudG9SR0JBKClcclxuIiwiIyBSdW4gdGhlIGFuaW1hdGlvbiB0YXNrc1xyXG5cclxuY2xhc3MgQnUuQW5pbWF0aW9uUnVubmVyXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxyXG5cdFx0QHJ1bm5pbmdBbmltYXRpb25zID0gW11cclxuXHJcblx0YWRkOiAodGFzaykgLT5cclxuXHRcdHRhc2suaW5pdCgpXHJcblx0XHRpZiB0YXNrLmFuaW1hdGlvbi5pc0xlZ2FsKClcclxuXHRcdFx0dGFzay5zdGFydFRpbWUgPSBCdS5ub3coKVxyXG5cdFx0XHRAcnVubmluZ0FuaW1hdGlvbnMucHVzaCB0YXNrXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgJ0J1LkFuaW1hdGlvblJ1bm5lcjogYW5pbWF0aW9uIHNldHRpbmcgaXMgaWxlZ2FsOiAnLCB0YXNrLmFuaW1hdGlvblxyXG5cclxuXHR1cGRhdGU6IC0+XHJcblx0XHRub3cgPSBCdS5ub3coKVxyXG5cdFx0Zm9yIHRhc2sgaW4gQHJ1bm5pbmdBbmltYXRpb25zXHJcblx0XHRcdGNvbnRpbnVlIGlmIHRhc2suZmluaXNoZWRcclxuXHJcblx0XHRcdGFuaW0gPSB0YXNrLmFuaW1hdGlvblxyXG5cdFx0XHR0ID0gKG5vdyAtIHRhc2suc3RhcnRUaW1lKSAvIChhbmltLmR1cmF0aW9uICogMTAwMClcclxuXHRcdFx0aWYgdCA+IDFcclxuXHRcdFx0XHRmaW5pc2ggPSB0cnVlXHJcblx0XHRcdFx0aWYgYW5pbS5yZXBlYXRcclxuXHRcdFx0XHRcdHQgPSAwXHJcblx0XHRcdFx0XHR0YXNrLnN0YXJ0VGltZSA9IEJ1Lm5vdygpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyBUT0RPIHJlbW92ZSB0aGUgZmluaXNoZWQgdGFza3Mgb3V0XHJcblx0XHRcdFx0XHR0ID0gMVxyXG5cdFx0XHRcdFx0dGFzay5maW5pc2hlZCA9IHllc1xyXG5cclxuXHRcdFx0aWYgYW5pbS5lYXNpbmcgPT0gdHJ1ZVxyXG5cdFx0XHRcdHQgPSBlYXNpbmdGdW5jdGlvbnNbREVGQVVMVF9FQVNJTkdfRlVOQ1RJT05dIHRcclxuXHRcdFx0ZWxzZSBpZiBlYXNpbmdGdW5jdGlvbnNbYW5pbS5lYXNpbmddP1xyXG5cdFx0XHRcdHQgPSBlYXNpbmdGdW5jdGlvbnNbYW5pbS5lYXNpbmddIHRcclxuXHJcblx0XHRcdHRhc2sudCA9IHRcclxuXHRcdFx0dGFzay5pbnRlcnBvbGF0ZSgpXHJcblxyXG5cdFx0XHRhbmltLnVwZGF0ZS5jYWxsIHRhc2sudGFyZ2V0LCB0YXNrXHJcblx0XHRcdGlmIGZpbmlzaCB0aGVuIGFuaW0uZmluaXNoPy5jYWxsIHRhc2sudGFyZ2V0LCB0YXNrXHJcblxyXG5cdCMgSG9vayB1cCBvbiBhbiByZW5kZXJlciwgcmVtb3ZlIG93biBzZXRJbnRlcm5hbFxyXG5cdGhvb2tVcDogKHJlbmRlcmVyKSAtPlxyXG5cdFx0cmVuZGVyZXIub24gJ3VwZGF0ZScsID0+IEB1cGRhdGUoKVxyXG5cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCMgUHJpdmF0ZSB2YXJpYWJsZXNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRERUZBVUxUX0VBU0lOR19GVU5DVElPTiA9ICdxdWFkJ1xyXG5cdGVhc2luZ0Z1bmN0aW9ucyA9XHJcblx0XHRxdWFkSW46ICh0KSAtPiB0ICogdFxyXG5cdFx0cXVhZE91dDogKHQpIC0+IHQgKiAoMiAtIHQpXHJcblx0XHRxdWFkOiAodCkgLT5cclxuXHRcdFx0aWYgdCA8IDAuNVxyXG5cdFx0XHRcdDIgKiB0ICogdFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0LTIgKiB0ICogdCArIDQgKiB0IC0gMVxyXG5cclxuXHRcdGN1YmljSW46ICh0KSAtPiB0ICoqIDNcclxuXHRcdGN1YmljT3V0OiAodCkgLT4gKHQgLSAxKSAqKiAzICsgMVxyXG5cdFx0Y3ViaWM6ICh0KSAtPlxyXG5cdFx0XHRpZiB0IDwgMC41XHJcblx0XHRcdFx0NCAqIHQgKiogM1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0NCAqICh0IC0gMSkgKiogMyArIDFcclxuXHJcblx0XHRzaW5lSW46ICh0KSAtPiBNYXRoLnNpbigodCAtIDEpICogQnUuSEFMRl9QSSkgKyAxXHJcblx0XHRzaW5lT3V0OiAodCkgLT4gTWF0aC5zaW4gdCAqIEJ1LkhBTEZfUElcclxuXHRcdHNpbmU6ICh0KSAtPlxyXG5cdFx0XHRpZiB0IDwgMC41XHJcblx0XHRcdFx0KE1hdGguc2luKCh0ICogMiAtIDEpICogQnUuSEFMRl9QSSkgKyAxKSAvIDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdE1hdGguc2luKCh0IC0gMC41KSAqIE1hdGguUEkpIC8gMiArIDAuNVxyXG5cclxuXHRcdCMgVE9ETyBhZGQgcXVhcnQsIHF1aW50LCBleHBvLCBjaXJjLCBiYWNrLCBlbGFzdGljLCBib3VuY2VcclxuXHJcbiMgRGVmaW5lIHRoZSBnbG9iYWwgdW5pcXVlIGluc3RhbmNlIG9mIHRoaXMgY2xhc3NcclxuQnUuYW5pbWF0aW9uUnVubmVyID0gbmV3IEJ1LkFuaW1hdGlvblJ1bm5lclxyXG4iLCIjIEFuaW1hdGlvblRhc2sgaXMgYW4gaW5zdGFuY2Ugb2YgQW5pbWF0aW9uLCBydW4gYnkgQW5pbWF0aW9uUnVubmVyXG5cbmNsYXNzIEJ1LkFuaW1hdGlvblRhc2tcblxuICAgIGNvbnN0cnVjdG9yOiAoQGFuaW1hdGlvbiwgQHRhcmdldCwgQGFyZ3MgPSBbXSkgLT5cbiAgICAgICAgQHN0YXJ0VGltZSA9IDBcbiAgICAgICAgQGZpbmlzaGVkID0gbm9cbiAgICAgICAgQGZyb20gPSBCdS5jbG9uZSBAYW5pbWF0aW9uLmZyb21cbiAgICAgICAgQGN1cnJlbnQgPSBCdS5jbG9uZSBAYW5pbWF0aW9uLmZyb21cbiAgICAgICAgQHRvID0gQnUuY2xvbmUgQGFuaW1hdGlvbi50b1xuICAgICAgICBAZGF0YSA9IHt9XG4gICAgICAgIEB0ID0gMFxuICAgICAgICBAYXJnID0gQGFyZ3NbMF1cblxuICAgIGluaXQ6IC0+XG4gICAgICAgIEBhbmltYXRpb24uaW5pdD8uY2FsbCBAdGFyZ2V0LCBAXG4gICAgICAgIEBjdXJyZW50ID0gQnUuY2xvbmUgQGZyb21cblxuICAgIGludGVycG9sYXRlOiAtPlxuICAgICAgICBpZiBCdS5pc051bWJlciBAZnJvbVxuICAgICAgICAgICAgQGN1cnJlbnQgPSBpbnRlcnBvbGF0ZU51bSBAZnJvbSwgQHRvLCBAdFxuICAgICAgICBlbHNlIGlmIEBmcm9tIGluc3RhbmNlb2YgQnUuQ29sb3JcbiAgICAgICAgICAgIGludGVycG9sYXRlT2JqZWN0IEBmcm9tLCBAdG8sIEB0LCBAY3VycmVudFxuICAgICAgICBlbHNlIGlmIEJ1LmlzUGxhaW5PYmplY3QgQGZyb21cbiAgICAgICAgICAgIGZvciBvd24ga2V5IG9mIEBmcm9tXG4gICAgICAgICAgICAgICAgaWYgQnUuaXNOdW1iZXIgQGZyb21ba2V5XVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudFtrZXldID0gaW50ZXJwb2xhdGVOdW0gQGZyb21ba2V5XSwgQHRvW2tleV0sIEB0XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZU9iamVjdCBAZnJvbVtrZXldLCBAdG9ba2V5XSwgQHQsIEBjdXJyZW50W2tleV1cblxuICAgIGludGVycG9sYXRlTnVtID0gKGEsIGIsIHQpIC0+IGIgKiB0IC0gYSAqICh0IC0gMSlcblxuICAgIGludGVycG9sYXRlT2JqZWN0ID0gKGEsIGIsIHQsIGMpIC0+XG4gICAgICAgIGlmIGEgaW5zdGFuY2VvZiBCdS5Db2xvclxuICAgICAgICAgICAgYy5zZXRSR0JBIGludGVycG9sYXRlTnVtKGEuciwgYi5yLCB0KSwgaW50ZXJwb2xhdGVOdW0oYS5nLCBiLmcsIHQpLCBpbnRlcnBvbGF0ZU51bShhLmIsIGIuYiwgdCksIGludGVycG9sYXRlTnVtKGEuYSwgYi5hLCB0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yIFwiQW5pbWF0aW9uVGFzay5pbnRlcnBvbGF0ZU9iamVjdCgpIGRvZXNuJ3Qgc3VwcG9ydCBvYmplY3QgdHlwZTogXCIsIGFcbiIsIiMgU3ByaXRlIFNoZWV0XHJcblxyXG5jbGFzcyBCdS5TcHJpdGVTaGVldFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB1cmwpIC0+XHJcblx0XHRCdS5FdmVudC5hcHBseSBAXHJcblxyXG5cdFx0QHJlYWR5ID0gbm8gICMgSWYgdGhpcyBzcHJpdGUgc2hlZXQgaXMgbG9hZGVkIGFuZCBwYXJzZWQuXHJcblx0XHRAaGVpZ2h0ID0gMCAgIyBIZWlnaHQgb2YgdGhpcyBzcHJpdGVcclxuXHJcblx0XHRAZGF0YSA9IG51bGwgICMgVGhlIEpTT04gZGF0YVxyXG5cdFx0QGltYWdlcyA9IFtdICAjIFRoZSBgSW1hZ2VgIGxpc3QgbG9hZGVkXHJcblx0XHRAZnJhbWVJbWFnZXMgPSBbXSAgIyBQYXJzZWQgZnJhbWUgaW1hZ2VzXHJcblxyXG5cdFx0IyBsb2FkIGFuZCB0cmlnZ2VyIHBhcnNlRGF0YSgpXHJcblx0XHQkLmFqYXggQHVybCwgc3VjY2VzczogKHRleHQpID0+XHJcblx0XHRcdEBkYXRhID0gSlNPTi5wYXJzZSB0ZXh0XHJcblxyXG5cdFx0XHRpZiBub3QgQGRhdGEuaW1hZ2VzP1xyXG5cdFx0XHRcdEBkYXRhLmltYWdlcyA9IFtAdXJsLnN1YnN0cmluZyhAdXJsLmxhc3RJbmRleE9mKCcvJyksIEB1cmwubGVuZ3RoIC0gNSkgKyAnLnBuZyddXHJcblxyXG5cdFx0XHRiYXNlVXJsID0gQHVybC5zdWJzdHJpbmcgMCwgQHVybC5sYXN0SW5kZXhPZignLycpICsgMVxyXG5cdFx0XHRmb3Igb3duIGkgb2YgQGRhdGEuaW1hZ2VzXHJcblx0XHRcdFx0QGRhdGEuaW1hZ2VzW2ldID0gYmFzZVVybCArIEBkYXRhLmltYWdlc1tpXVxyXG5cclxuXHRcdFx0XHRjb3VudExvYWRlZCA9IDBcclxuXHRcdFx0XHRAaW1hZ2VzW2ldID0gbmV3IEltYWdlXHJcblx0XHRcdFx0QGltYWdlc1tpXS5vbmxvYWQgPSAoKSA9PlxyXG5cdFx0XHRcdFx0Y291bnRMb2FkZWQgKz0gMVxyXG5cdFx0XHRcdFx0QHBhcnNlRGF0YSgpIGlmIGNvdW50TG9hZGVkID09IEBkYXRhLmltYWdlcy5sZW5ndGhcclxuXHRcdFx0XHRAaW1hZ2VzW2ldLnNyYyA9IEBkYXRhLmltYWdlc1tpXVxyXG5cclxuXHRwYXJzZURhdGE6IC0+XHJcblx0XHQjIENsaXAgdGhlIGltYWdlIGZvciBldmVyeSBmcmFtZXNcclxuXHRcdGZyYW1lcyA9IEBkYXRhLmZyYW1lc1xyXG5cdFx0Zm9yIG93biBpIG9mIGZyYW1lc1xyXG5cdFx0XHRmb3IgaiBpbiBbMC4uNF1cclxuXHRcdFx0XHRpZiBub3QgZnJhbWVzW2ldW2pdP1xyXG5cdFx0XHRcdFx0ZnJhbWVzW2ldW2pdID0gaWYgZnJhbWVzW2kgLSAxXT9bal0/IHRoZW4gZnJhbWVzW2kgLSAxXVtqXSBlbHNlIDBcclxuXHRcdFx0eCA9IGZyYW1lc1tpXVswXVxyXG5cdFx0XHR5ID0gZnJhbWVzW2ldWzFdXHJcblx0XHRcdHcgPSBmcmFtZXNbaV1bMl1cclxuXHRcdFx0aCA9IGZyYW1lc1tpXVszXVxyXG5cdFx0XHRmcmFtZUluZGV4ID0gZnJhbWVzW2ldWzRdXHJcblx0XHRcdEBmcmFtZUltYWdlc1tpXSA9IGNsaXBJbWFnZSBAaW1hZ2VzW2ZyYW1lSW5kZXhdLCB4LCB5LCB3LCBoXHJcblx0XHRcdEBoZWlnaHQgPSBoIGlmIEBoZWlnaHQgPT0gMFxyXG5cclxuXHRcdEByZWFkeSA9IHllc1xyXG5cdFx0QHRyaWdnZXIgJ2xvYWRlZCdcclxuXHJcblx0Z2V0RnJhbWVJbWFnZTogKGtleSwgaW5kZXggPSAwKSAtPlxyXG5cdFx0cmV0dXJuIG51bGwgdW5sZXNzIEByZWFkeVxyXG5cdFx0YW5pbWF0aW9uID0gQGRhdGEuYW5pbWF0aW9uc1trZXldXHJcblx0XHRyZXR1cm4gbnVsbCB1bmxlc3MgYW5pbWF0aW9uP1xyXG5cclxuXHRcdHJldHVybiBAZnJhbWVJbWFnZXNbYW5pbWF0aW9uLmZyYW1lc1tpbmRleF1dXHJcblxyXG5cdG1lYXN1cmVUZXh0V2lkdGg6ICh0ZXh0KSAtPlxyXG5cdFx0d2lkdGggPSAwXHJcblx0XHRmb3IgY2hhciBpbiB0ZXh0XHJcblx0XHRcdHdpZHRoICs9IEBnZXRGcmFtZUltYWdlKGNoYXIpLndpZHRoXHJcblx0XHR3aWR0aFxyXG5cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCMgUHJpdmF0ZSBtZW1iZXJzXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnY2FudmFzJ1xyXG5cdGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCAnMmQnXHJcblxyXG5cdGNsaXBJbWFnZSA9IChpbWFnZSwgeCwgeSwgdywgaCkgLT5cclxuXHRcdGNhbnZhcy53aWR0aCA9IHdcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSBoXHJcblx0XHRjb250ZXh0LmRyYXdJbWFnZSBpbWFnZSwgeCwgeSwgdywgaCwgMCwgMCwgdywgaFxyXG5cclxuXHRcdG5ld0ltYWdlID0gbmV3IEltYWdlKClcclxuXHRcdG5ld0ltYWdlLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoKVxyXG5cdFx0cmV0dXJuIG5ld0ltYWdlXHJcbiIsIiMgR2VvbWV0cnkgQWxnb3JpdGhtIENvbGxlY3Rpb25cclxuXHJcbkJ1Lmdlb21ldHJ5QWxnb3JpdGhtID0gRyA9XHJcblxyXG5cdGluamVjdDogLT5cclxuXHRcdEBpbmplY3RJbnRvIFtcclxuXHRcdFx0J3BvaW50J1xyXG5cdFx0XHQnbGluZSdcclxuXHRcdFx0J2NpcmNsZSdcclxuXHRcdFx0J3RyaWFuZ2xlJ1xyXG5cdFx0XHQncmVjdGFuZ2xlJ1xyXG5cdFx0XHQnZmFuJ1xyXG5cdFx0XHQnYm93J1xyXG5cdFx0XHQncG9seWdvbidcclxuXHRcdFx0J3BvbHlsaW5lJ1xyXG5cdFx0XVxyXG5cclxuXHRpbmplY3RJbnRvOiAoc2hhcGVzKSAtPlxyXG5cdFx0c2hhcGVzID0gW3NoYXBlc10gaWYgQnUuaXNTdHJpbmcgc2hhcGVzXHJcblxyXG5cdFx0aWYgJ3BvaW50JyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuUG9pbnQ6OmluQ2lyY2xlID0gKGNpcmNsZSkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5DaXJjbGUgQCwgY2lyY2xlXHJcblx0XHRcdEJ1LlBvaW50OjpkaXN0YW5jZVRvID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcuZGlzdGFuY2VGcm9tUG9pbnRUb1BvaW50IEAsIHBvaW50XHJcblx0XHRcdEJ1LlBvaW50Ojppc05lYXIgPSAodGFyZ2V0LCBsaW1pdCA9IEJ1LkRFRkFVTFRfTkVBUl9ESVNUKSAtPlxyXG5cdFx0XHRcdHN3aXRjaCB0YXJnZXQudHlwZVxyXG5cdFx0XHRcdFx0d2hlbiAnUG9pbnQnXHJcblx0XHRcdFx0XHRcdEcucG9pbnROZWFyUG9pbnQgQCwgdGFyZ2V0LCBsaW1pdFxyXG5cdFx0XHRcdFx0d2hlbiAnTGluZSdcclxuXHRcdFx0XHRcdFx0Ry5wb2ludE5lYXJMaW5lIEAsIHRhcmdldCwgbGltaXRcclxuXHRcdFx0XHRcdHdoZW4gJ1BvbHlsaW5lJ1xyXG5cdFx0XHRcdFx0XHRHLnBvaW50TmVhclBvbHlsaW5lIEAsIHRhcmdldCwgbGltaXRcclxuXHRcdFx0QnUuUG9pbnQuaW50ZXJwb2xhdGUgPSBHLmludGVycG9sYXRlQmV0d2VlblR3b1BvaW50c1xyXG5cclxuXHRcdGlmICdsaW5lJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuTGluZTo6ZGlzdGFuY2VUbyA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLmRpc3RhbmNlRnJvbVBvaW50VG9MaW5lIHBvaW50LCBAXHJcblx0XHRcdEJ1LkxpbmU6OmlzVHdvUG9pbnRzU2FtZVNpZGUgPSAocDEsIHAyKSAtPlxyXG5cdFx0XHRcdEcudHdvUG9pbnRzU2FtZVNpZGVPZkxpbmUgcDEsIHAyLCBAXHJcblx0XHRcdEJ1LkxpbmU6OmZvb3RQb2ludEZyb20gPSAocG9pbnQsIHNhdmVUbykgLT5cclxuXHRcdFx0XHRHLmZvb3RQb2ludEZyb21Qb2ludFRvTGluZSBwb2ludCwgQCwgc2F2ZVRvXHJcblx0XHRcdEJ1LkxpbmU6OmdldENyb3NzUG9pbnRXaXRoID0gKGxpbmUpIC0+XHJcblx0XHRcdFx0Ry5nZXRDcm9zc1BvaW50T2ZUd29MaW5lcyBsaW5lLCBAXHJcblx0XHRcdEJ1LkxpbmU6OmlzQ3Jvc3NXaXRoTGluZSA9IChsaW5lKSAtPlxyXG5cdFx0XHRcdEcuaXNUd29MaW5lc0Nyb3NzIGxpbmUsIEBcclxuXHJcblx0XHRpZiAnY2lyY2xlJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuQ2lyY2xlOjpfY29udGFpbnNQb2ludCA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5DaXJjbGUgcG9pbnQsIEBcclxuXHJcblx0XHRpZiAndHJpYW5nbGUnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5UcmlhbmdsZTo6X2NvbnRhaW5zUG9pbnQgPSAocG9pbnQpIC0+XHJcblx0XHRcdFx0Ry5wb2ludEluVHJpYW5nbGUgcG9pbnQsIEBcclxuXHRcdFx0QnUuVHJpYW5nbGU6OmFyZWEgPSAtPlxyXG5cdFx0XHRcdEcuY2FsY1RyaWFuZ2xlQXJlYSBAXHJcblxyXG5cdFx0aWYgJ3JlY3RhbmdsZScgaW4gc2hhcGVzXHJcblx0XHRcdEJ1LlJlY3RhbmdsZTo6Y29udGFpbnNQb2ludCA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5SZWN0YW5nbGUgcG9pbnQsIEBcclxuXHJcblx0XHRpZiAnZmFuJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuRmFuOjpfY29udGFpbnNQb2ludCA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5GYW4gcG9pbnQsIEBcclxuXHJcblx0XHRpZiAnYm93JyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuQm93OjpfY29udGFpbnNQb2ludCA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5Cb3cgcG9pbnQsIEBcclxuXHJcblx0XHRpZiAncG9seWdvbicgaW4gc2hhcGVzXHJcblx0XHRcdEJ1LlBvbHlnb246Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJblBvbHlnb24gcG9pbnQsIEBcclxuXHJcblx0XHRpZiAncG9seWxpbmUnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5Qb2x5bGluZTo6bGVuZ3RoID0gMFxyXG5cdFx0XHRCdS5Qb2x5bGluZTo6cG9pbnROb3JtYWxpemVkUG9zID0gW11cclxuXHRcdFx0QnUuUG9seWxpbmU6OmNhbGNMZW5ndGggPSAoKSAtPlxyXG5cdFx0XHRcdEBsZW5ndGggPSBHLmNhbGNQb2x5bGluZUxlbmd0aCBAXHJcblx0XHRcdEJ1LlBvbHlsaW5lOjpjYWxjUG9pbnROb3JtYWxpemVkUG9zID0gLT5cclxuXHRcdFx0XHRHLmNhbGNOb3JtYWxpemVkVmVydGljZXNQb3NPZlBvbHlsaW5lIEBcclxuXHRcdFx0QnUuUG9seWxpbmU6OmdldE5vcm1hbGl6ZWRQb3MgPSAoaW5kZXgpIC0+XHJcblx0XHRcdFx0aWYgaW5kZXg/IHRoZW4gQHBvaW50Tm9ybWFsaXplZFBvc1tpbmRleF0gZWxzZSBAcG9pbnROb3JtYWxpemVkUG9zXHJcblx0XHRcdEJ1LlBvbHlsaW5lOjpjb21wcmVzcyA9IChzdHJlbmd0aCA9IDAuOCkgLT5cclxuXHRcdFx0XHRHLmNvbXByZXNzUG9seWxpbmUgQCwgc3RyZW5ndGhcclxuXHJcblx0IyBQb2ludCBpbiBzaGFwZXNcclxuXHJcblx0cG9pbnROZWFyUG9pbnQ6IChwb2ludCwgdGFyZ2V0LCBsaW1pdCA9IEJ1LkRFRkFVTFRfTkVBUl9ESVNUKSAtPlxyXG5cdFx0cG9pbnQuZGlzdGFuY2VUbyh0YXJnZXQpIDwgbGltaXRcclxuXHJcblx0cG9pbnROZWFyTGluZTogKHBvaW50LCBsaW5lLCBsaW1pdCA9IEJ1LkRFRkFVTFRfTkVBUl9ESVNUKSAtPlxyXG5cdFx0dmVydGljYWxEaXN0ID0gbGluZS5kaXN0YW5jZVRvIHBvaW50XHJcblx0XHRmb290UG9pbnQgPSBsaW5lLmZvb3RQb2ludEZyb20gcG9pbnRcclxuXHJcblx0XHRpc0JldHdlZW4xID0gZm9vdFBvaW50LmRpc3RhbmNlVG8obGluZS5wb2ludHNbMF0pIDwgbGluZS5sZW5ndGggKyBsaW1pdFxyXG5cdFx0aXNCZXR3ZWVuMiA9IGZvb3RQb2ludC5kaXN0YW5jZVRvKGxpbmUucG9pbnRzWzFdKSA8IGxpbmUubGVuZ3RoICsgbGltaXRcclxuXHJcblx0XHRyZXR1cm4gdmVydGljYWxEaXN0IDwgbGltaXQgYW5kIGlzQmV0d2VlbjEgYW5kIGlzQmV0d2VlbjJcclxuXHJcblx0cG9pbnROZWFyUG9seWxpbmU6IChwb2ludCwgcG9seWxpbmUsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHRmb3IgbGluZSBpbiBwb2x5bGluZS5saW5lc1xyXG5cdFx0XHRyZXR1cm4geWVzIGlmIEcucG9pbnROZWFyTGluZSBwb2ludCwgbGluZSwgbGltaXRcclxuXHRcdG5vXHJcblxyXG5cdHBvaW50SW5DaXJjbGU6IChwb2ludCwgY2lyY2xlKSAtPlxyXG5cdFx0ZHggPSBwb2ludC54IC0gY2lyY2xlLmN4XHJcblx0XHRkeSA9IHBvaW50LnkgLSBjaXJjbGUuY3lcclxuXHRcdHJldHVybiBCdS5iZXZlbChkeCwgZHkpIDwgY2lyY2xlLnJhZGl1c1xyXG5cclxuXHRwb2ludEluUmVjdGFuZ2xlOiAocG9pbnQsIHJlY3RhbmdsZSkgLT5cclxuXHRcdHBvaW50LnggPiByZWN0YW5nbGUucG9pbnRMVC54IGFuZFxyXG5cdFx0XHRcdHBvaW50LnkgPiByZWN0YW5nbGUucG9pbnRMVC55IGFuZFxyXG5cdFx0XHRcdHBvaW50LnggPCByZWN0YW5nbGUucG9pbnRMVC54ICsgcmVjdGFuZ2xlLnNpemUud2lkdGggYW5kXHJcblx0XHRcdFx0cG9pbnQueSA8IHJlY3RhbmdsZS5wb2ludExULnkgKyByZWN0YW5nbGUuc2l6ZS5oZWlnaHRcclxuXHJcblx0cG9pbnRJblRyaWFuZ2xlOiAocG9pbnQsIHRyaWFuZ2xlKSAtPlxyXG5cdFx0Ry50d29Qb2ludHNTYW1lU2lkZU9mTGluZShwb2ludCwgdHJpYW5nbGUucG9pbnRzWzJdLCB0cmlhbmdsZS5saW5lc1swXSkgYW5kXHJcblx0XHRcdFx0Ry50d29Qb2ludHNTYW1lU2lkZU9mTGluZShwb2ludCwgdHJpYW5nbGUucG9pbnRzWzBdLCB0cmlhbmdsZS5saW5lc1sxXSkgYW5kXHJcblx0XHRcdFx0Ry50d29Qb2ludHNTYW1lU2lkZU9mTGluZShwb2ludCwgdHJpYW5nbGUucG9pbnRzWzFdLCB0cmlhbmdsZS5saW5lc1syXSlcclxuXHJcblx0cG9pbnRJbkZhbjogKHBvaW50LCBmYW4pIC0+XHJcblx0XHRkeCA9IHBvaW50LnggLSBmYW4uY3hcclxuXHRcdGR5ID0gcG9pbnQueSAtIGZhbi5jeVxyXG5cdFx0YSA9IE1hdGguYXRhbjIocG9pbnQueSAtIGZhbi5jeSwgcG9pbnQueCAtIGZhbi5jeClcclxuXHRcdGEgKz0gTWF0aC5QSSAqIDIgd2hpbGUgYSA8IGZhbi5hRnJvbVxyXG5cdFx0cmV0dXJuIEJ1LmJldmVsKGR4LCBkeSkgPCBmYW4ucmFkaXVzICYmIGEgPiBmYW4uYUZyb20gJiYgYSA8IGZhbi5hVG9cclxuXHJcblx0cG9pbnRJbkJvdzogKHBvaW50LCBib3cpIC0+XHJcblx0XHRpZiBCdS5iZXZlbChib3cuY3ggLSBwb2ludC54LCBib3cuY3kgLSBwb2ludC55KSA8IGJvdy5yYWRpdXNcclxuXHRcdFx0c2FtZVNpZGUgPSBib3cuc3RyaW5nLmlzVHdvUG9pbnRzU2FtZVNpZGUoYm93LmNlbnRlciwgcG9pbnQpXHJcblx0XHRcdHNtYWxsVGhhbkhhbGZDaXJjbGUgPSBib3cuYVRvIC0gYm93LmFGcm9tIDwgTWF0aC5QSVxyXG5cdFx0XHRyZXR1cm4gc2FtZVNpZGUgXiBzbWFsbFRoYW5IYWxmQ2lyY2xlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRwb2ludEluUG9seWdvbjogKHBvaW50LCBwb2x5Z29uKSAtPlxyXG5cdFx0Zm9yIHRyaWFuZ2xlIGluIHBvbHlnb24udHJpYW5nbGVzXHJcblx0XHRcdGlmIHRyaWFuZ2xlLmNvbnRhaW5zUG9pbnQgcG9pbnRcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0ZmFsc2VcclxuXHJcblx0IyBEaXN0YW5jZVxyXG5cclxuXHRkaXN0YW5jZUZyb21Qb2ludFRvUG9pbnQ6IChwb2ludDEsIHBvaW50MikgLT5cclxuXHRcdEJ1LmJldmVsIHBvaW50MS54IC0gcG9pbnQyLngsIHBvaW50MS55IC0gcG9pbnQyLnlcclxuXHJcblx0ZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmU6IChwb2ludCwgbGluZSkgLT5cclxuXHRcdHAxID0gbGluZS5wb2ludHNbMF1cclxuXHRcdHAyID0gbGluZS5wb2ludHNbMV1cclxuXHRcdGEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KVxyXG5cdFx0YiA9IHAxLnkgLSBhICogcDEueFxyXG5cdFx0cmV0dXJuIE1hdGguYWJzKGEgKiBwb2ludC54ICsgYiAtIHBvaW50LnkpIC8gTWF0aC5zcXJ0KGEgKiBhICsgMSlcclxuXHJcblx0IyBQb2ludCBSZWxhdGVkXHJcblxyXG5cdGludGVycG9sYXRlQmV0d2VlblR3b1BvaW50czogKHAxLCBwMiwgaywgcDMpIC0+XHJcblx0XHR4ID0gcDEueCArIChwMi54IC0gcDEueCkgKiBrXHJcblx0XHR5ID0gcDEueSArIChwMi55IC0gcDEueSkgKiBrXHJcblxyXG5cdFx0aWYgcDM/XHJcblx0XHRcdHAzLnNldCB4LCB5XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBuZXcgQnUuUG9pbnQgeCwgeVxyXG5cclxuXHQjIFBvaW50IGFuZCBMaW5lXHJcblxyXG5cdHR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lOiAocDEsIHAyLCBsaW5lKSAtPlxyXG5cdFx0cEEgPSBsaW5lLnBvaW50c1swXVxyXG5cdFx0cEIgPSBsaW5lLnBvaW50c1sxXVxyXG5cdFx0aWYgcEEueCA9PSBwQi54XHJcblx0XHRcdCMgaWYgYm90aCBvZiB0aGUgdHdvIHBvaW50cyBhcmUgb24gdGhlIGxpbmUgdGhlbiB3ZSBjb25zaWRlciB0aGV5IGFyZSBpbiB0aGUgc2FtZSBzaWRlXHJcblx0XHRcdHJldHVybiAocDEueCAtIHBBLngpICogKHAyLnggLSBwQS54KSA+IDBcclxuXHRcdGVsc2VcclxuXHRcdFx0eTAxID0gKHBBLnkgLSBwQi55KSAqIChwMS54IC0gcEEueCkgLyAocEEueCAtIHBCLngpICsgcEEueVxyXG5cdFx0XHR5MDIgPSAocEEueSAtIHBCLnkpICogKHAyLnggLSBwQS54KSAvIChwQS54IC0gcEIueCkgKyBwQS55XHJcblx0XHRcdHJldHVybiAocDEueSAtIHkwMSkgKiAocDIueSAtIHkwMikgPiAwXHJcblxyXG5cdGZvb3RQb2ludEZyb21Qb2ludFRvTGluZTogKHBvaW50LCBsaW5lLCBzYXZlVG8gPSBuZXcgQnUuUG9pbnQpIC0+XHJcblx0XHRwMSA9IGxpbmUucG9pbnRzWzBdXHJcblx0XHRwMiA9IGxpbmUucG9pbnRzWzFdXHJcblx0XHRBID0gKHAxLnkgLSBwMi55KSAvIChwMS54IC0gcDIueClcclxuXHRcdEIgPSBwMS55IC0gQSAqIHAxLnhcclxuXHRcdG0gPSBwb2ludC54ICsgQSAqIHBvaW50LnlcclxuXHRcdHggPSAobSAtIEEgKiBCKSAvIChBICogQSArIDEpXHJcblx0XHR5ID0gQSAqIHggKyBCXHJcblxyXG5cdFx0c2F2ZVRvLnNldCB4LCB5XHJcblx0XHRyZXR1cm4gc2F2ZVRvXHJcblxyXG5cdGdldENyb3NzUG9pbnRPZlR3b0xpbmVzOiAobGluZTEsIGxpbmUyKSAtPlxyXG5cdFx0W3AxLCBwMl0gPSBsaW5lMS5wb2ludHNcclxuXHRcdFtxMSwgcTJdID0gbGluZTIucG9pbnRzXHJcblxyXG5cdFx0YTEgPSBwMi55IC0gcDEueVxyXG5cdFx0YjEgPSBwMS54IC0gcDIueFxyXG5cdFx0YzEgPSAoYTEgKiBwMS54KSArIChiMSAqIHAxLnkpXHJcblx0XHRhMiA9IHEyLnkgLSBxMS55XHJcblx0XHRiMiA9IHExLnggLSBxMi54XHJcblx0XHRjMiA9IChhMiAqIHExLngpICsgKGIyICogcTEueSlcclxuXHRcdGRldCA9IChhMSAqIGIyKSAtIChhMiAqIGIxKVxyXG5cclxuXHRcdHJldHVybiBuZXcgQnUuUG9pbnQgKChiMiAqIGMxKSAtIChiMSAqIGMyKSkgLyBkZXQsICgoYTEgKiBjMikgLSAoYTIgKiBjMSkpIC8gZGV0XHJcblxyXG5cdGlzVHdvTGluZXNDcm9zczogKGxpbmUxLCBsaW5lMikgLT5cclxuXHRcdHgxID0gbGluZTEucG9pbnRzWzBdLnhcclxuXHRcdHkxID0gbGluZTEucG9pbnRzWzBdLnlcclxuXHRcdHgyID0gbGluZTEucG9pbnRzWzFdLnhcclxuXHRcdHkyID0gbGluZTEucG9pbnRzWzFdLnlcclxuXHRcdHgzID0gbGluZTIucG9pbnRzWzBdLnhcclxuXHRcdHkzID0gbGluZTIucG9pbnRzWzBdLnlcclxuXHRcdHg0ID0gbGluZTIucG9pbnRzWzFdLnhcclxuXHRcdHk0ID0gbGluZTIucG9pbnRzWzFdLnlcclxuXHJcblx0XHRkID0gKHkyIC0geTEpICogKHg0IC0geDMpIC0gKHk0IC0geTMpICogKHgyIC0geDEpXHJcblxyXG5cdFx0aWYgZCA9PSAwXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR4MCA9ICgoeDIgLSB4MSkgKiAoeDQgLSB4MykgKiAoeTMgLSB5MSkgKyAoeTIgLSB5MSkgKiAoeDQgLSB4MykgKiB4MSAtICh5NCAtIHkzKSAqICh4MiAtIHgxKSAqIHgzKSAvIGRcclxuXHRcdFx0eTAgPSAoKHkyIC0geTEpICogKHk0IC0geTMpICogKHgzIC0geDEpICsgKHgyIC0geDEpICogKHk0IC0geTMpICogeTEgLSAoeDQgLSB4MykgKiAoeTIgLSB5MSkgKiB5MykgLyAtZFxyXG5cdFx0cmV0dXJuICh4MCAtIHgxKSAqICh4MCAtIHgyKSA8IDAgYW5kXHJcblx0XHRcdFx0XHRcdCh4MCAtIHgzKSAqICh4MCAtIHg0KSA8IDAgYW5kXHJcblx0XHRcdFx0XHRcdCh5MCAtIHkxKSAqICh5MCAtIHkyKSA8IDAgYW5kXHJcblx0XHRcdFx0XHRcdCh5MCAtIHkzKSAqICh5MCAtIHk0KSA8IDBcclxuXHJcblx0IyBQb2x5bGluZVxyXG5cclxuXHRjYWxjUG9seWxpbmVMZW5ndGg6IChwb2x5bGluZSkgLT5cclxuXHRcdGxlbiA9IDBcclxuXHRcdGlmIHBvbHlsaW5lLnZlcnRpY2VzLmxlbmd0aCA+PSAyXHJcblx0XHRcdGZvciBpIGluIFsxIC4uLiBwb2x5bGluZS52ZXJ0aWNlcy5sZW5ndGhdXHJcblx0XHRcdFx0bGVuICs9IHBvbHlsaW5lLnZlcnRpY2VzW2ldLmRpc3RhbmNlVG8gcG9seWxpbmUudmVydGljZXNbaSAtIDFdXHJcblx0XHRyZXR1cm4gbGVuXHJcblxyXG5cdGNhbGNOb3JtYWxpemVkVmVydGljZXNQb3NPZlBvbHlsaW5lOiAocG9seWxpbmUpIC0+XHJcblx0XHRjdXJyUG9zID0gMFxyXG5cdFx0cG9seWxpbmUucG9pbnROb3JtYWxpemVkUG9zWzBdID0gMFxyXG5cdFx0Zm9yIGkgaW4gWzEgLi4uIHBvbHlsaW5lLnZlcnRpY2VzLmxlbmd0aF1cclxuXHRcdFx0Y3VyclBvcyArPSBwb2x5bGluZS52ZXJ0aWNlc1tpXS5kaXN0YW5jZVRvKHBvbHlsaW5lLnZlcnRpY2VzW2kgLSAxXSkgLyBwb2x5bGluZS5sZW5ndGhcclxuXHRcdFx0cG9seWxpbmUucG9pbnROb3JtYWxpemVkUG9zW2ldID0gY3VyclBvc1xyXG5cclxuXHRjb21wcmVzc1BvbHlsaW5lOiAocG9seWxpbmUsIHN0cmVuZ3RoKSAtPlxyXG5cdFx0Y29tcHJlc3NlZCA9IFtdXHJcblx0XHRmb3Igb3duIGkgb2YgcG9seWxpbmUudmVydGljZXNcclxuXHRcdFx0aWYgaSA8IDJcclxuXHRcdFx0XHRjb21wcmVzc2VkW2ldID0gcG9seWxpbmUudmVydGljZXNbaV1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFtwQSwgcE1dID0gY29tcHJlc3NlZFstMi4uLTFdXHJcblx0XHRcdFx0cEIgPSBwb2x5bGluZS52ZXJ0aWNlc1tpXVxyXG5cdFx0XHRcdG9ibGlxdWVBbmdsZSA9IE1hdGguYWJzKE1hdGguYXRhbjIocEEueSAtIHBNLnksIHBBLnggLSBwTS54KSAtIE1hdGguYXRhbjIocE0ueSAtIHBCLnksIHBNLnggLSBwQi54KSlcclxuXHRcdFx0XHRpZiBvYmxpcXVlQW5nbGUgPCBzdHJlbmd0aCAqIHN0cmVuZ3RoICogTWF0aC5QSSAvIDJcclxuXHRcdFx0XHRcdGNvbXByZXNzZWRbY29tcHJlc3NlZC5sZW5ndGggLSAxXSA9IHBCXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0Y29tcHJlc3NlZC5wdXNoIHBCXHJcblx0XHRwb2x5bGluZS52ZXJ0aWNlcyA9IGNvbXByZXNzZWRcclxuXHRcdHBvbHlsaW5lLmtleVBvaW50cyA9IHBvbHlsaW5lLnZlcnRpY2VzXHJcblx0XHRyZXR1cm4gcG9seWxpbmVcclxuXHJcblx0IyBBcmVhIENhbGN1bGF0aW9uXHJcblxyXG5cdGNhbGNUcmlhbmdsZUFyZWE6ICh0cmlhbmdsZSkgLT5cclxuXHRcdFthLCBiLCBjXSA9IHRyaWFuZ2xlLnBvaW50c1xyXG5cdFx0cmV0dXJuIE1hdGguYWJzKCgoYi54IC0gYS54KSAqIChjLnkgLSBhLnkpKSAtICgoYy54IC0gYS54KSAqIChiLnkgLSBhLnkpKSkgLyAyXHJcblxyXG5HLmluamVjdCgpXHJcbiIsIiMgVXNlZCB0byBnZW5lcmF0ZSByYW5kb20gc2hhcGVzXHJcblxyXG5jbGFzcyBCdS5TaGFwZVJhbmRvbWl6ZXJcclxuXHJcblx0TUFSR0lOID0gMzBcclxuXHJcblx0cmFuZ2VXaWR0aDogODAwXHJcblx0cmFuZ2VIZWlnaHQ6IDQ1MFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogLT5cclxuXHJcblx0cmFuZG9tWDogLT5cclxuXHRcdEJ1LnJhbmQgTUFSR0lOLCBAcmFuZ2VXaWR0aCAtIE1BUkdJTiAqIDJcclxuXHJcblx0cmFuZG9tWTogLT5cclxuXHRcdEJ1LnJhbmQgTUFSR0lOLCBAcmFuZ2VIZWlnaHQgLSBNQVJHSU4gKiAyXHJcblxyXG5cdHJhbmRvbVJhZGl1czogLT5cclxuXHRcdEJ1LnJhbmQgNSwgTWF0aC5taW4oQHJhbmdlV2lkdGgsIEByYW5nZUhlaWdodCkgLyAyXHJcblxyXG5cdHNldFJhbmdlOiAodywgaCkgLT5cclxuXHRcdEByYW5nZVdpZHRoID0gd1xyXG5cdFx0QHJhbmdlSGVpZ2h0ID0gaFxyXG5cclxuXHRnZW5lcmF0ZTogKHR5cGUpIC0+XHJcblx0XHRzd2l0Y2ggdHlwZVxyXG5cdFx0XHR3aGVuICdjaXJjbGUnIHRoZW4gQGdlbmVyYXRlQ2lyY2xlKClcclxuXHRcdFx0d2hlbiAnYm93JyB0aGVuIEBnZW5lcmF0ZUJvdygpXHJcblx0XHRcdHdoZW4gJ3RyaWFuZ2xlJyB0aGVuIEBnZW5lcmF0ZVRyaWFuZ2xlKClcclxuXHRcdFx0d2hlbiAncmVjdGFuZ2xlJyB0aGVuIEBnZW5lcmF0ZVJlY3RhbmdsZSgpXHJcblx0XHRcdHdoZW4gJ2ZhbicgdGhlbiBAZ2VuZXJhdGVGYW4oKVxyXG5cdFx0XHR3aGVuICdwb2x5Z29uJyB0aGVuIEBnZW5lcmF0ZVBvbHlnb24oKVxyXG5cdFx0XHR3aGVuICdsaW5lJyB0aGVuIEBnZW5lcmF0ZUxpbmUoKVxyXG5cdFx0XHR3aGVuICdwb2x5bGluZScgdGhlbiBAZ2VuZXJhdGVQb2x5bGluZSgpXHJcblx0XHRcdGVsc2UgY29uc29sZS53YXJuICdub3Qgc3VwcG9ydCBzaGFwZTogJyArIHR5cGVcclxuXHRcdEByYW5nZUhlaWdodCA9IGhcclxuXHJcblx0cmFuZG9taXplOiAoc2hhcGUpIC0+XHJcblx0XHRpZiBCdS5pc0FycmF5IHNoYXBlXHJcblx0XHRcdEByYW5kb21pemUgcyBmb3IgcyBpbiBzaGFwZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzd2l0Y2ggc2hhcGUudHlwZVxyXG5cdFx0XHRcdHdoZW4gJ0NpcmNsZScgdGhlbiBAcmFuZG9taXplQ2lyY2xlIHNoYXBlXHJcblx0XHRcdFx0d2hlbiAnQm93JyB0aGVuIEByYW5kb21pemVCb3cgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdUcmlhbmdsZScgdGhlbiBAcmFuZG9taXplVHJpYW5nbGUgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdSZWN0YW5nbGUnIHRoZW4gQHJhbmRvbWl6ZVJlY3RhbmdsZSBzaGFwZVxyXG5cdFx0XHRcdHdoZW4gJ0ZhbicgdGhlbiBAcmFuZG9taXplRmFuIHNoYXBlXHJcblx0XHRcdFx0d2hlbiAnUG9seWdvbicgdGhlbiBAcmFuZG9taXplUG9seWdvbiBzaGFwZVxyXG5cdFx0XHRcdHdoZW4gJ0xpbmUnIHRoZW4gQHJhbmRvbWl6ZUxpbmUgc2hhcGVcclxuXHRcdFx0XHR3aGVuICdQb2x5bGluZScgdGhlbiBAcmFuZG9taXplUG9seWxpbmUgc2hhcGVcclxuXHRcdFx0XHRlbHNlIGNvbnNvbGUud2FybiAnbm90IHN1cHBvcnQgc2hhcGU6ICcgKyBzaGFwZS50eXBlXHJcblxyXG5cdGdlbmVyYXRlQ2lyY2xlOiAtPlxyXG5cdFx0Y2lyY2xlID0gbmV3IEJ1LkNpcmNsZSBAcmFuZG9tUmFkaXVzKCksIEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHRcdGNpcmNsZS5jZW50ZXIubGFiZWwgPSAnTydcclxuXHRcdGNpcmNsZVxyXG5cclxuXHRyYW5kb21pemVDaXJjbGU6IChjaXJjbGUpIC0+XHJcblx0XHRjaXJjbGUuY3ggPSBAcmFuZG9tWCgpXHJcblx0XHRjaXJjbGUuY3kgPSBAcmFuZG9tWSgpXHJcblx0XHRjaXJjbGUucmFkaXVzID0gQHJhbmRvbVJhZGl1cygpXHJcblx0XHRAXHJcblxyXG5cdGdlbmVyYXRlQm93OiAtPlxyXG5cdFx0YUZyb20gPSBCdS5yYW5kIE1hdGguUEkgKiAyXHJcblx0XHRhVG8gPSBhRnJvbSArIEJ1LnJhbmQgTWF0aC5QSSAvIDIsIE1hdGguUEkgKiAyXHJcblxyXG5cdFx0Ym93ID0gbmV3IEJ1LkJvdyBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tUmFkaXVzKCksIGFGcm9tLCBhVG9cclxuXHRcdGJvdy5zdHJpbmcucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHRib3cuc3RyaW5nLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0Ym93XHJcblxyXG5cdHJhbmRvbWl6ZUJvdzogKGJvdykgLT5cclxuXHRcdGFGcm9tID0gQnUucmFuZCBNYXRoLlBJICogMlxyXG5cdFx0YVRvID0gYUZyb20gKyBCdS5yYW5kIE1hdGguUEkgLyAyLCBNYXRoLlBJICogMlxyXG5cclxuXHRcdGJvdy5jeCA9IEByYW5kb21YKClcclxuXHRcdGJvdy5jeSA9IEByYW5kb21ZKClcclxuXHRcdGJvdy5yYWRpdXMgPSBAcmFuZG9tUmFkaXVzKClcclxuXHRcdGJvdy5hRnJvbSA9IGFGcm9tXHJcblx0XHRib3cuYVRvID0gYVRvXHJcblx0XHRib3cudHJpZ2dlciAnY2hhbmdlZCdcclxuXHRcdEBcclxuXHJcblx0Z2VuZXJhdGVGYW46IC0+XHJcblx0XHRhRnJvbSA9IEJ1LnJhbmQgTWF0aC5QSSAqIDJcclxuXHRcdGFUbyA9IGFGcm9tICsgQnUucmFuZCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAqIDJcclxuXHJcblx0XHRmYW4gPSBuZXcgQnUuRmFuIEByYW5kb21YKCksIEByYW5kb21ZKCksIEByYW5kb21SYWRpdXMoKSwgYUZyb20sIGFUb1xyXG5cdFx0ZmFuLmNlbnRlci5sYWJlbCA9ICdPJ1xyXG5cdFx0ZmFuLnN0cmluZy5wb2ludHNbMF0ubGFiZWwgPSAnQSdcclxuXHRcdGZhbi5zdHJpbmcucG9pbnRzWzFdLmxhYmVsID0gJ0InXHJcblx0XHRmYW5cclxuXHJcblx0cmFuZG9taXplRmFuOiBAOjpyYW5kb21pemVCb3dcclxuXHJcblx0Z2VuZXJhdGVUcmlhbmdsZTogLT5cclxuXHRcdHBvaW50cyA9IFtdXHJcblx0XHRmb3IgaSBpbiBbMC4uMl1cclxuXHRcdFx0cG9pbnRzW2ldID0gbmV3IEJ1LlBvaW50IEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHJcblx0XHR0cmlhbmdsZSA9IG5ldyBCdS5UcmlhbmdsZSBwb2ludHNbMF0sIHBvaW50c1sxXSwgcG9pbnRzWzJdXHJcblx0XHR0cmlhbmdsZS5wb2ludHNbMF0ubGFiZWwgPSAnQSdcclxuXHRcdHRyaWFuZ2xlLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0dHJpYW5nbGUucG9pbnRzWzJdLmxhYmVsID0gJ0MnXHJcblx0XHR0cmlhbmdsZVxyXG5cclxuXHRyYW5kb21pemVUcmlhbmdsZTogKHRyaWFuZ2xlKSAtPlxyXG5cdFx0dHJpYW5nbGUucG9pbnRzW2ldLnNldCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpIGZvciBpIGluIFswLi4yXVxyXG5cdFx0dHJpYW5nbGUudHJpZ2dlciAnY2hhbmdlZCdcclxuXHRcdEBcclxuXHJcblx0Z2VuZXJhdGVSZWN0YW5nbGU6IC0+XHJcblx0XHRyZWN0ID0gbmV3IEJ1LlJlY3RhbmdsZShcclxuXHRcdFx0QnUucmFuZChAcmFuZ2VXaWR0aClcclxuXHRcdFx0QnUucmFuZChAcmFuZ2VIZWlnaHQpXHJcblx0XHRcdEJ1LnJhbmQoQHJhbmdlV2lkdGggLyAyKVxyXG5cdFx0XHRCdS5yYW5kKEByYW5nZUhlaWdodCAvIDIpXHJcblx0XHQpXHJcblx0XHRyZWN0LnBvaW50TFQubGFiZWwgPSAnQSdcclxuXHRcdHJlY3QucG9pbnRSVC5sYWJlbCA9ICdCJ1xyXG5cdFx0cmVjdC5wb2ludFJCLmxhYmVsID0gJ0MnXHJcblx0XHRyZWN0LnBvaW50TEIubGFiZWwgPSAnRCdcclxuXHRcdHJlY3RcclxuXHJcblx0cmFuZG9taXplUmVjdGFuZ2xlOiAocmVjdGFuZ2xlKSAtPlxyXG5cdFx0cmVjdGFuZ2xlLnNldCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRyZWN0YW5nbGUudHJpZ2dlciAnY2hhbmdlZCdcclxuXHRcdEBcclxuXHJcblx0Z2VuZXJhdGVQb2x5Z29uOiAtPlxyXG5cdFx0cG9pbnRzID0gW11cclxuXHJcblx0XHRmb3IgaSBpbiBbMC4uM11cclxuXHRcdFx0cG9pbnQgPSBuZXcgQnUuUG9pbnQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKVxyXG5cdFx0XHRwb2ludC5sYWJlbCA9ICdQJyArIGlcclxuXHRcdFx0cG9pbnRzLnB1c2ggcG9pbnRcclxuXHJcblx0XHRuZXcgQnUuUG9seWdvbiBwb2ludHNcclxuXHJcblx0cmFuZG9taXplUG9seWdvbjogKHBvbHlnb24pIC0+XHJcblx0XHR2ZXJ0ZXguc2V0IEByYW5kb21YKCksIEByYW5kb21ZKCkgZm9yIHZlcnRleCBpbiBwb2x5Z29uLnZlcnRpY2VzXHJcblx0XHRwb2x5Z29uLnRyaWdnZXIgJ2NoYW5nZWQnXHJcblx0XHRAXHJcblxyXG5cdGdlbmVyYXRlTGluZTogLT5cclxuXHRcdGxpbmUgPSBuZXcgQnUuTGluZSBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRsaW5lLnBvaW50c1swXS5sYWJlbCA9ICdBJ1xyXG5cdFx0bGluZS5wb2ludHNbMV0ubGFiZWwgPSAnQidcclxuXHRcdGxpbmVcclxuXHJcblx0cmFuZG9taXplTGluZTogKGxpbmUpIC0+XHJcblx0XHRwb2ludC5zZXQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKSBmb3IgcG9pbnQgaW4gbGluZS5wb2ludHNcclxuXHRcdGxpbmUudHJpZ2dlciAnY2hhbmdlZCdcclxuXHRcdEBcclxuXHJcblx0Z2VuZXJhdGVQb2x5bGluZTogLT5cclxuXHRcdHBvbHlsaW5lID0gbmV3IEJ1LlBvbHlsaW5lXHJcblx0XHRmb3IgaSBpbiBbMC4uM11cclxuXHRcdFx0cG9pbnQgPSBuZXcgQnUuUG9pbnQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKVxyXG5cdFx0XHRwb2ludC5sYWJlbCA9ICdQJyArIGlcclxuXHRcdFx0cG9seWxpbmUuYWRkUG9pbnQgcG9pbnRcclxuXHRcdHBvbHlsaW5lXHJcblxyXG5cdHJhbmRvbWl6ZVBvbHlsaW5lOiAocG9seWxpbmUpIC0+XHJcblx0XHR2ZXJ0ZXguc2V0IEByYW5kb21YKCksIEByYW5kb21ZKCkgZm9yIHZlcnRleCBpbiBwb2x5bGluZS52ZXJ0aWNlc1xyXG5cdFx0cG9seWxpbmUudHJpZ2dlciAnY2hhbmdlZCdcclxuXHRcdEBcclxuIl19
