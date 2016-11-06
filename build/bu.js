// Bu.js - https://github.com/jarvisniu/Bu.js
(function() {
  var base, base1, currentTime, global, lastBootTime, previousGlobal,
    hasProp = {}.hasOwnProperty;

  previousGlobal = global;

  global = window || this;

  global.Bu = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Bu.Renderer, arguments, function(){});
  };

  Bu.global = global;

  global = previousGlobal;

  Bu.VERSION = '0.3.4';

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

  Bu.DEFAULT_BOUND_STROKE_STYLE = '#444';

  Bu.DEFAULT_BOUND_DASH_STYLE = [6, 6];

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
    if (typeof givenOptions === 'object') {
      for (i in givenOptions) {
        if (givenOptions[i] != null) {
          defaultOptions[i] = givenOptions[i];
        }
      }
    }
    return defaultOptions;
  };

  Bu.isPlainObject = function(o) {
    return o instanceof Object && o.constructor.name === 'Object';
  };

  Bu.isFunction = function(o) {
    return o instanceof Object && o.constructor.name === 'Function';
  };

  Bu.clone = function(target) {
    var clone, i;
    if (typeof target !== 'object' || target === null || Bu.isFunction(target)) {
      return target;
    } else {
      if (target instanceof Array) {
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
      var i, j, len, len1, ref, ref1, v;
      this.target = target;
      this.x1 = this.y1 = this.x2 = this.y2 = 0;
      this.isEmpty = true;
      this.point1 = new Bu.Vector;
      this.point2 = new Bu.Vector;
      this.strokeStyle = Bu.DEFAULT_BOUND_STROKE_STYLE;
      this.dashStyle = Bu.DEFAULT_BOUND_DASH_STYLE;
      this.dashOffset = 0;
      switch (this.target.type) {
        case 'Line':
        case 'Triangle':
        case 'Rectangle':
          ref = this.target.points;
          for (i = 0, len = ref.length; i < len; i++) {
            v = ref[i];
            this.expandByPoint(v);
          }
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
          this.target.on('radiusChanged', (function(_this) {
            return function() {
              _this.clear();
              return _this.expandByCircle(_this.target);
            };
          })(this));
          break;
        case 'Polyline':
        case 'Polygon':
          ref1 = this.target.vertices;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            v = ref1[j];
            this.expandByPoint(v);
          }
          break;
        default:
          console.warn('Bounds: not support shape type "' + this.target.type + '"');
      }
    }

    Bounds.prototype.containsPoint = function(p) {
      return this.x1 < p.x && this.x2 > p.x && this.y1 < p.y && this.y2 > p.y;
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
      if (arguments.length === 0) {
        this.r = this.g = this.b = 255;
        this.a = 1;
      }
      if (arguments.length === 1) {
        arg = arguments[0];
        if (typeof arg === 'string') {
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
    function Size(width1, height1) {
      this.width = width1;
      this.height = height1;
      this.type = 'Size';
    }

    Size.prototype.set = function(width, height) {
      this.width = width;
      return this.height = height;
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
    canvas: # settings to the canvas
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
      ref = ["canvas", "camera", "data", "objects", "hierarchy", "methods", "events"];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        (base = this.options)[k] || (base[k] = {});
      }
      if (document.readyState === 'complete') {
        this.init();
      } else {
        document.addEventListener('DOMContentLoaded', (function(_this) {
          return function() {
            return _this.init();
          };
        })(this));
      }
    }

    App.prototype.init = function() {
      var assembleObjects, base, k, name, ref, type;
      this.$canvas = new Bu({
        container: this.options.canvas.container,
        showKeyPoints: this.options.canvas.showKeyPoints,
        background: this.options.canvas.background
      });
      (base = this.$canvas.dom.style).cursor && (base.cursor = this.options.canvas.cursor);
      for (k in this.options.data) {
        this[k] = this.options.data[k];
      }
      for (k in this.options.methods) {
        this[k] = this.options.methods[k];
      }
      if (this.options.objects instanceof Function) {
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
            parent.push(_this.$objects[name]);
            results.push(assembleObjects(children[name], _this.$objects[name].children));
          }
          return results;
        };
      })(this);
      assembleObjects(this.options.hierarchy, this.$canvas.shapes);
      if ((ref = this.options.init) != null) {
        ref.call(this);
      }
      this.events = this.options.events;
      for (type in this.events) {
        if (type === 'mousedown') {
          this.$canvas.dom.addEventListener('mousedown', (function(_this) {
            return function(e) {
              return _this.events['mousedown'].call(_this, e);
            };
          })(this));
        } else if (type === 'mousemove') {
          this.$canvas.dom.addEventListener('mousemove', (function(_this) {
            return function(e) {
              return _this.events['mousemove'].call(_this, e);
            };
          })(this));
        } else if (type === 'mouseup') {
          this.$canvas.dom.addEventListener('mouseup', (function(_this) {
            return function(e) {
              return _this.events['mouseup'].call(_this, e);
            };
          })(this));
        }
      }
      if (this.options.update != null) {
        return this.$canvas.on('update', (function(_this) {
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
      if (typeof v === 'number') {
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
      var j, len, listener, listeners, results;
      listeners = types[type];
      if (listeners != null) {
        eventData || (eventData = {});
        eventData.target = this;
        results = [];
        for (j = 0, len = listeners.length; j < len; j++) {
          listener = listeners[j];
          listener.call(this, eventData);
          if (listener.once) {
            listeners.splice(i, 1);
            results.push(i -= 1);
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
        if (typeof val === 'number') {
          return this._scale.x = this._scale.y = val;
        } else {
          return this._scale = val;
        }
      }
    });

    Object2D.prototype.animate = function(anim, args) {
      var i;
      if (typeof anim === 'string') {
        if (anim in Bu.animations) {
          Bu.animations[anim].apply(this, args);
        } else {
          console.warn("Bu.animations[\"" + anim + "\"] doesn't exists.");
        }
      } else if (anim instanceof Array) {
        if (!(args instanceof Array)) {
          args = [args];
        }
        for (i in anim) {
          if (!hasProp.call(anim, i)) continue;
          this.animate(anim[i], args);
        }
      } else {
        anim.apply(this, args);
      }
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
      var j, k, len1, onResize, options, ref, ref1, tick;
      Bu.Event.apply(this);
      this.type = 'Renderer';
      options = Bu.combineOptions(arguments, {
        container: 'body',
        fps: 60,
        showKeyPoints: false,
        background: '#eee'
      });
      ref = ['container', 'width', 'height', 'fps', 'showKeyPoints', 'width', 'height'];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        k = ref[j];
        this[k] = options[k];
      }
      if (typeof this.container === 'string') {
        this.container = document.querySelector(this.container);
      }
      this.fillParent = typeof this.width !== 'number';
      this.tickCount = 0;
      this.isRunning = false;
      this.pixelRatio = Bu.global.devicePixelRatio || 1;
      this.dom = document.createElement('canvas');
      this.context = this.dom.getContext('2d');
      this.context.textBaseline = 'top';
      if (typeof ClipMeter !== "undefined" && ClipMeter !== null) {
        this.clipMeter = new ClipMeter();
      }
      this.shapes = [];
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
      setTimeout((function(_this) {
        return function() {
          return _this.container.appendChild(_this.dom);
        };
      })(this), 100);
      if ((ref1 = Bu.animationRunner) != null) {
        ref1.hookUp(this);
      }
      this.isRunning = true;
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

    Renderer.prototype.add = function(shape) {
      var j, len1, s;
      if (shape instanceof Array) {
        for (j = 0, len1 = shape.length; j < len1; j++) {
          s = shape[j];
          this.shapes.push(s);
        }
      } else {
        this.shapes.push(shape);
      }
      return this;
    };

    Renderer.prototype.remove = function(shape) {
      var index;
      index = this.shapes.indexOf(shape);
      if (index > -1) {
        this.shapes.splice(index, 1);
      }
      return this;
    };

    Renderer.prototype.render = function() {
      this.context.save();
      this.context.scale(this.pixelRatio, this.pixelRatio);
      this.clearCanvas();
      this.drawShapes(this.shapes);
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
        case 'Bounds':
          this.drawBounds(shape);
          break;
        case 'Group':
          break;
        default:
          console.log('drawShapes(): unknown shape: ', shape);
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
      var char, charBitmap, i, j, ref, textWidth, xOffset, yOffset;
      if (typeof shape.font === 'string') {
        this.context.textAlign = shape.textAlign;
        this.context.textBaseline = shape.textBaseline;
        this.context.font = shape.font;
        if (shape.strokeStyle != null) {
          this.context.strokeText(shape.text, shape.x, shape.y);
        }
        if (shape.fillStyle != null) {
          this.context.fillStyle = shape.fillStyle;
          this.context.fillText(shape.text, shape.x, shape.y);
        }
      } else if (shape.font instanceof Bu.SpriteSheet && shape.font.ready) {
        textWidth = shape.font.measureTextWidth(shape.text);
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
              return -shape.font.height / 2;
            case 'bottom':
              return -shape.font.height;
          }
        })();
        for (i = j = 0, ref = shape.text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          char = shape.text[i];
          charBitmap = shape.font.getFrameImage(char);
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
      if (shape.loaded) {
        w = shape.size.width;
        h = shape.size.height;
        dx = -w * shape.pivot.x;
        dy = -h * shape.pivot.y;
        this.context.drawImage(shape.image, dx, dy, w, h);
      }
      return this;
    };

    Renderer.prototype.drawBounds = function(bounds) {
      this.context.rect(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
      return this;
    };

    return Renderer;

  })();

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
    }

    Bow.prototype.clone = function() {
      return new Bu.Bow(this.cx, this.cy, this.radius, this.aFrom, this.aTo);
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
    }

    Circle.prototype.clone = function() {
      return new Bu.Circle(this.radius, this.cx, this.cy);
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
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.aFrom = aFrom;
      this.aTo = aTo;
      Fan.__super__.constructor.call(this);
      this.type = 'Fan';
      this.center = new Bu.Point(this.cx, this.cy);
      this.string = new Bu.Line(this.center.arcTo(this.radius, this.aFrom), this.center.arcTo(this.radius, this.aTo));
      this.keyPoints = [this.string.points[0], this.string.points[1], new Bu.Point(this.cx, this.cy)];
    }

    Fan.prototype.clone = function() {
      return new Bu.Fan(this.cx, this.cy, this.radius, this.aFrom, this.aTo);
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
      this.on("pointChange", (function(_this) {
        return function() {
          _this.length = _this.points[0].distanceTo(_this.points[1]);
          return _this.midpoint.set((_this.points[0].x + _this.points[1].x) / 2, (_this.points[0].y + _this.points[1].y) / 2);
        };
      })(this));
      this.trigger("pointChange", this);
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
      this.trigger("pointChange", this);
      return this;
    };

    Line.prototype.setPoint1 = function(a1, a2) {
      if (a2 != null) {
        this.points[0].set(a1, a2);
      } else {
        this.points[0].copy(a1);
      }
      this.trigger("pointChange", this);
      return this;
    };

    Line.prototype.setPoint2 = function(a1, a2) {
      if (a2 != null) {
        this.points[1].set(a1, a2);
      } else {
        this.points[1].copy(a1);
      }
      this.trigger("pointChange", this);
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
      var i, k, l, n, options, radius, ref, ref1, x, y;
      Polygon.__super__.constructor.call(this);
      this.type = 'Polygon';
      this.vertices = [];
      this.lines = [];
      this.triangles = [];
      options = Bu.combineOptions(arguments, {
        angle: 0
      });
      if (points instanceof Array) {
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
      if (this.vertices.length > 1) {
        for (i = k = 0, ref = this.vertices.length - 1; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
          this.lines.push(new Bu.Line(this.vertices[i], this.vertices[i + 1]));
        }
        this.lines.push(new Bu.Line(this.vertices[this.vertices.length - 1], this.vertices[0]));
      }
      if (this.vertices.length > 2) {
        for (i = l = 1, ref1 = this.vertices.length - 1; 1 <= ref1 ? l < ref1 : l > ref1; i = 1 <= ref1 ? ++l : --l) {
          this.triangles.push(new Bu.Triangle(this.vertices[0], this.vertices[i], this.vertices[i + 1]));
        }
      }
      this.keyPoints = this.vertices;
    }

    Polygon.prototype.clone = function() {
      return new Bu.Polygon(this.vertices);
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
      this.on("pointChange", (function(_this) {
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
      this.trigger("pointChange", this);
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
      this.trigger("pointChange", this);
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
      this.trigger("pointChange", this);
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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Triangle = (function(superClass) {
    extend(Triangle, superClass);

    function Triangle(p1, p2, p3) {
      this.clone = bind(this.clone, this);
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
    }

    Triangle.prototype.clone = function() {
      return new Bu.Triangle(this.points[0], this.points[1], this.points[2]);
    };

    return Triangle;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Group = (function(superClass) {
    extend(Group, superClass);

    function Group() {
      Group.__super__.constructor.call(this);
      this.type = 'Group';
    }

    return Group;

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
      this.image = new Bu.global.Image;
      this.loaded = false;
      this.image.onload = (function(_this) {
        return function(e) {
          if (_this.autoSize) {
            _this.size.set(_this.image.width, _this.image.height);
          }
          return _this.loaded = true;
        };
      })(this);
      this.image.src = this.url;
    }

    return Image;

  })(Bu.Object2D);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
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
      this.setContextAlign = bind(this.setContextAlign, this);
      PointText.__super__.constructor.call(this);
      this.type = 'PointText';
      this.strokeStyle = null;
      this.fillStyle = Bu.DEFAULT_TEXT_FILL_STYLE;
      options = Bu.combineOptions(arguments, {
        align: '00',
        fontFamily: 'Verdana',
        fontSize: 11
      });
      this.align = options.align;
      this._fontFamily = options.fontFamily;
      this._fontSize = options.fontSize;
      this.font = (this._fontSize + "px " + this._fontFamily) || options.font;
    }

    PointText.property('align', {
      get: function() {
        return this._align;
      },
      set: function(val) {
        this._align = val;
        return this.setContextAlign(this._align);
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

    PointText.prototype.setContextAlign = function(align) {
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
      return this.textBaseline = (function() {
        switch (alignY) {
          case '-':
            return 'bottom';
          case '0':
            return 'middle';
          case '+':
            return 'top';
        }
      })();
    };

    return PointText;

  })(Bu.Object2D);

}).call(this);

(function() {
  Bu.Animation = (function() {
    function Animation(options) {
      this.from = options.from;
      this.to = options.to;
      this.data = options.data || {};
      this.duration = options.duration || 0.5;
      this.easing = options.easing || false;
      this.repeat = !!options.repeat;
      this.init = options.init;
      this.update = options.update;
      this.finish = options.finish;
    }

    Animation.prototype.apply = function(target, args) {
      return Bu.animationRunner.add(this, target, args);
    };

    return Animation;

  })();

  Bu.animations = {
    fadeIn: new Bu.Animation({
      update: function(t) {
        return this.opacity = t;
      }
    }),
    fadeOut: new Bu.Animation({
      update: function(t) {
        return this.opacity = 1 - t;
      }
    }),
    spin: new Bu.Animation({
      update: function(t) {
        return this.rotation = t * Math.PI * 2;
      }
    }),
    spinIn: new Bu.Animation({
      init: function(anim, arg) {
        if (arg == null) {
          arg = 1;
        }
        return anim.data.ds = arg;
      },
      update: function(t, data) {
        this.opacity = t;
        this.rotation = t * Math.PI * 4;
        return this.scale = t * data.ds;
      }
    }),
    spinOut: new Bu.Animation({
      update: function(t) {
        this.opacity = 1 - t;
        this.rotation = t * Math.PI * 4;
        return this.scale = 1 - t;
      }
    }),
    blink: new Bu.Animation({
      duration: 0.2,
      from: 0,
      to: 512,
      update: function(data) {
        data = Math.floor(Math.abs(d - 256));
        return this.fillStyle = "rgb(" + data + ", " + data + ", " + data + ")";
      }
    }),
    shake: new Bu.Animation({
      init: function(anim, arg) {
        anim.data.ox = this.position.x;
        return anim.data.range = arg || 20;
      },
      update: function(t, data) {
        return this.position.x = Math.sin(t * Math.PI * 8) * data.range + data.ox;
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
      update: function(data) {
        this.opacity = data.opacity;
        return this.scale = data.scale;
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
      update: function(data) {
        return this.scale.y = data;
      }
    }),
    flipX: new Bu.Animation({
      init: function(anim) {
        anim.from = this.scale.x;
        return anim.to = -anim.from;
      },
      update: function(data) {
        return this.scale.x = data;
      }
    }),
    flipY: new Bu.Animation({
      init: function(anim) {
        anim.from = this.scale.y;
        return anim.to = -anim.from;
      },
      update: function(data) {
        return this.scale.y = data;
      }
    }),
    moveTo: new Bu.Animation({
      init: function(anim, args) {
        if (args != null) {
          anim.from = this.position.x;
          return anim.to = args;
        } else {
          return console.error('animation moveTo need an argument');
        }
      },
      update: function(data) {
        return this.position.x = data;
      }
    }),
    moveBy: new Bu.Animation({
      init: function(anim, args) {
        if (args != null) {
          anim.from = this.position.x;
          return anim.to = this.position.x + parseFloat(args);
        } else {
          return console.error('animation moveTo need an argument');
        }
      },
      update: function(data) {
        return this.position.x = data;
      }
    }),
    discolor: new Bu.Animation({
      init: function(anim, desColor) {
        if (typeof desColor === 'string') {
          desColor = new Bu.Color(desColor);
        }
        anim.from = new Bu.Color(this.fillStyle);
        return anim.to = desColor;
      },
      update: function(data) {
        return this.fillStyle = data.toRGBA();
      }
    })
  };

}).call(this);

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.AnimationRunner = (function() {
    var DEFAULT_EASING_FUNCTION, easingFunctions, initTask, interpolateNum, interpolateObject, interpolateTask, isAnimationLegal;

    function AnimationRunner() {
      this.runningAnimations = [];
    }

    AnimationRunner.prototype.add = function(anim, target, args) {
      var ref, task;
      if ((ref = anim.init) != null) {
        ref.call(target, anim, args);
      }
      if (isAnimationLegal(anim)) {
        task = {
          animation: anim,
          target: target,
          startTime: Bu.now(),
          current: anim.data,
          finished: false
        };
        this.runningAnimations.push(task);
        return initTask(task, anim);
      } else {
        return console.error('Bu.AnimationRunner: animation setting is ilegal: ', animation);
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
        if (anim.from != null) {
          interpolateTask(task, t);
          anim.update.apply(task.target, [task.current, t]);
        } else {
          anim.update.apply(task.target, [t, task.current]);
        }
        if (finish) {
          results.push((ref1 = anim.finish) != null ? ref1.call(task.target, anim) : void 0);
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

    isAnimationLegal = function(anim) {
      var key, ref;
      if (!((anim.from != null) && (anim.to != null))) {
        return true;
      }
      if (Bu.isPlainObject(anim.from)) {
        ref = anim.from;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          if (anim.to[key] == null) {
            return false;
          }
        }
      } else {
        if (anim.to == null) {
          return false;
        }
      }
      return true;
    };

    initTask = function(task, anim) {
      var key, ref, results;
      if (anim.from != null) {
        if (Bu.isPlainObject(anim.from)) {
          ref = anim.from;
          results = [];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            results.push(task.current[key] = new anim.from[key].constructor);
          }
          return results;
        } else {
          return task.current = new anim.from.constructor;
        }
      }
    };

    interpolateTask = function(task, t) {
      var anim, key, ref, results;
      anim = task.animation;
      if (typeof anim.from === 'number') {
        return task.current = interpolateNum(anim.from, anim.to, t);
      } else if (anim.from instanceof Bu.Color) {
        return interpolateObject(anim.from, anim.to, t, task.current);
      } else if (Bu.isPlainObject(anim.from)) {
        ref = anim.from;
        results = [];
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          if (typeof anim.from[key] === 'number') {
            results.push(task.current[key] = interpolateNum(anim.from[key], anim.to[key], t));
          } else {
            results.push(interpolateObject(anim.from[key], anim.to[key], t, task.current[key]));
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
        return console.error("AnimationRunner.interpolateObject() doesn't support object type: ", a);
      }
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
      if (typeof shapes === 'string') {
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
  Bu.RandomShapeGenerator = (function() {
    var MARGIN;

    MARGIN = 30;

    function RandomShapeGenerator(bu) {
      this.bu = bu;
    }

    RandomShapeGenerator.prototype.randomX = function() {
      return Bu.rand(MARGIN, this.bu.width - MARGIN * 2);
    };

    RandomShapeGenerator.prototype.randomY = function() {
      return Bu.rand(MARGIN, this.bu.height - MARGIN * 2);
    };

    RandomShapeGenerator.prototype.randomRadius = function() {
      return Bu.rand(5, Math.min(this.bu.width, this.bu.height) / 2);
    };

    RandomShapeGenerator.prototype.generate = function(type) {
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

    RandomShapeGenerator.prototype.generateCircle = function() {
      var circle;
      circle = new Bu.Circle(this.randomRadius(), this.randomX(), this.randomY());
      circle.center.label = 'O';
      return circle;
    };

    RandomShapeGenerator.prototype.generateBow = function() {
      var aFrom, aTo, bow;
      aFrom = Bu.rand(Math.PI * 2);
      aTo = aFrom + Bu.rand(Math.PI / 2, Math.PI * 2);
      bow = new Bu.Bow(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
      bow.string.points[0].label = 'A';
      bow.string.points[1].label = 'B';
      return bow;
    };

    RandomShapeGenerator.prototype.generateTriangle = function() {
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

    RandomShapeGenerator.prototype.generateRectangle = function() {
      return new Bu.Rectangle(Bu.rand(this.bu.width), Bu.rand(this.bu.height), Bu.rand(this.bu.width / 2), Bu.rand(this.bu.height / 2));
    };

    RandomShapeGenerator.prototype.generateFan = function() {
      var aFrom, aTo, fan;
      aFrom = Bu.rand(Math.PI * 2);
      aTo = aFrom + Bu.rand(Math.PI / 2, Math.PI * 2);
      fan = new Bu.Fan(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
      fan.string.points[0].label = 'A';
      fan.string.points[1].label = 'B';
      return fan;
    };

    RandomShapeGenerator.prototype.generatePolygon = function() {
      var i, j, point, points;
      points = [];
      for (i = j = 0; j <= 3; i = ++j) {
        point = new Bu.Point(this.randomX(), this.randomY());
        point.label = 'P' + i;
        points.push(point);
      }
      return new Bu.Polygon(points);
    };

    RandomShapeGenerator.prototype.generateLine = function() {
      var line;
      line = new Bu.Line(this.randomX(), this.randomY(), this.randomX(), this.randomY());
      line.points[0].label = 'A';
      line.points[1].label = 'B';
      return line;
    };

    RandomShapeGenerator.prototype.generatePolyline = function() {
      var i, j, point, polyline;
      polyline = new Bu.Polyline;
      for (i = j = 0; j <= 3; i = ++j) {
        point = new Bu.Point(this.randomX(), this.randomY());
        point.label = 'P' + i;
        polyline.addPoint(point);
      }
      return polyline;
    };

    return RandomShapeGenerator;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJ1LmNvZmZlZSIsIkJvdW5kcy5jb2ZmZWUiLCJDb2xvci5jb2ZmZWUiLCJTaXplLmNvZmZlZSIsIlZlY3Rvci5jb2ZmZWUiLCJBcHAuY29mZmVlIiwiQ29sb3JmdWwuY29mZmVlIiwiRXZlbnQuY29mZmVlIiwiTWljcm9KUXVlcnkuY29mZmVlIiwiT2JqZWN0MkQuY29mZmVlIiwiUmVuZGVyZXIuY29mZmVlIiwiQm93LmNvZmZlZSIsIkNpcmNsZS5jb2ZmZWUiLCJGYW4uY29mZmVlIiwiTGluZS5jb2ZmZWUiLCJQb2ludC5jb2ZmZWUiLCJQb2x5Z29uLmNvZmZlZSIsIlBvbHlsaW5lLmNvZmZlZSIsIlJlY3RhbmdsZS5jb2ZmZWUiLCJTcGxpbmUuY29mZmVlIiwiVHJpYW5nbGUuY29mZmVlIiwiR3JvdXAuY29mZmVlIiwiSW1hZ2UuY29mZmVlIiwiUG9pbnRUZXh0LmNvZmZlZSIsIkFuaW1hdGlvbi5jb2ZmZWUiLCJBbmltYXRpb25SdW5uZXIuY29mZmVlIiwiU3ByaXRlU2hlZXQuY29mZmVlIiwiZ2VvbWV0cnlBbGdvcml0aG0uY29mZmVlIiwiUmFuZG9tU2hhcGVHZW5lcmF0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQTtBQUFBLE1BQUEsOERBQUE7SUFBQTs7RUFBQSxjQUFBLEdBQWlCOztFQUdqQixNQUFBLEdBQVMsTUFBQSxJQUFVOztFQUduQixNQUFNLENBQUMsRUFBUCxHQUFZLFNBQUE7V0FBVTs7OztPQUFBLEVBQUUsQ0FBQyxRQUFILEVBQVksU0FBWjtFQUFWOztFQUdaLEVBQUUsQ0FBQyxNQUFILEdBQVk7O0VBR1osTUFBQSxHQUFTOztFQVFULEVBQUUsQ0FBQyxPQUFILEdBQWE7O0VBR2IsRUFBRSxDQUFDLE9BQUgsR0FBYSxJQUFJLENBQUMsRUFBTCxHQUFVOztFQUN2QixFQUFFLENBQUMsTUFBSCxHQUFZLElBQUksQ0FBQyxFQUFMLEdBQVU7O0VBR3RCLEVBQUUsQ0FBQyxvQkFBSCxHQUEwQjs7RUFDMUIsRUFB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QUFBLENBQWhDLEVBQTRDLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBNUM7TUFDWCxJQUFJLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWYsR0FBdUI7TUFDdkIsSUFBSSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFmLEdBQXVCO0FBQ3ZCLGFBQU87SUFKTTs7bUNBTWQsZ0JBQUEsR0FBa0IsU0FBQTtBQUNqQixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksRUFBRSxDQUFDO0FBQ2xCLFdBQVMsMEJBQVQ7UUFDQyxLQUFBLEdBQVksSUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVCxFQUFxQixJQUFDLENBQUEsT0FBRCxDQUFBLENBQXJCO1FBQ1osS0FBSyxDQUFDLEtBQU4sR0FBYyxHQUFBLEdBQU07UUFDcEIsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsS0FBbEI7QUFIRDtBQUlBLGFBQU87SUFOVTs7Ozs7QUF0Rm5CIiwiZmlsZSI6ImJ1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBCdS5jb2ZmZWU6IG5hbWVzcGFjZSwgY29uc3RhbnRzLCB1dGlsaXR5IGZ1bmN0aW9ucyBhbmQgcG9seWZpbGxzXHJcblxyXG4jIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIGBnbG9iYWxgIHZhcmlhYmxlLlxyXG5wcmV2aW91c0dsb2JhbCA9IGdsb2JhbFxyXG5cclxuIyBHZXQgdGhlIHJvb3Qgb2JqZWN0XHJcbmdsb2JhbCA9IHdpbmRvdyBvciBAXHJcblxyXG4jIERlZmluZSBvdXIgbmFtZXNwYWNlIGBCdWAuIEl0IGlzIGFsc28gYSBzaG9ydGN1dCB0byBjbGFzcyBgQnUuUmVuZGVyZXJgLlxyXG5nbG9iYWwuQnUgPSAoKSAtPiBuZXcgQnUuUmVuZGVyZXIgYXJndW1lbnRzLi4uXHJcblxyXG4jIFNhdmUgdGhlIHJvb3Qgb2JqZWN0IHRvIG91ciBuYW1lc3BhY2UuXHJcbkJ1Lmdsb2JhbCA9IGdsb2JhbFxyXG5cclxuIyBSZXR1cm4gYmFjayB0aGUgcHJldmlvdXMgZ2xvYmFsIHZhcmlhYmxlLlxyXG5nbG9iYWwgPSBwcmV2aW91c0dsb2JhbFxyXG5cclxuXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgQ29uc3RhbnRzXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4jIFZlcnNpb24gaW5mbyBvZiB0aGlzIGxpYnJhcnlcclxuQnUuVkVSU0lPTiA9ICcwLjMuNCdcclxuXHJcbiMgTWF0aFxyXG5CdS5IQUxGX1BJID0gTWF0aC5QSSAvIDJcclxuQnUuVFdPX1BJID0gTWF0aC5QSSAqIDJcclxuXHJcbiMgRGVmYXVsdCByZW5kZXIgc3R5bGUgb2Ygc2hhcGVzXHJcbkJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFID0gJyMwNDgnXHJcbkJ1LkRFRkFVTFRfRklMTF9TVFlMRSA9ICdyZ2JhKDY0LCAxMjgsIDE5MiwgMC41KSdcclxuQnUuREVGQVVMVF9EQVNIX1NUWUxFID0gWzgsIDRdXHJcblxyXG4jIERlZmF1bHQgcmVuZGVyIHN0eWxlIHdoZW4gdGhlbiBtb3VzZSBpcyBob3ZlcmVkIG9uXHJcbkJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFX0hPVkVSID0gJ3JnYmEoMjU1LCAxMjgsIDAsIDAuNzUpJ1xyXG5CdS5ERUZBVUxUX0ZJTExfU1RZTEVfSE9WRVIgPSAncmdiYSgyNTUsIDEyOCwgMTI4LCAwLjUpJ1xyXG5cclxuIyBUaGUgZGVmYXVsdCBjb2xvciBvZiByZW5kZXJlZCB0ZXh0LCBQb2ludFRleHQgZm9yIG5vd1xyXG5CdS5ERUZBVUxUX1RFWFRfRklMTF9TVFlMRSA9ICdibGFjaydcclxuXHJcbiMgUG9pbnQgaXMgcmVuZGVyZWQgYXMgYSBzbWFsbCBjaXJjbGUgb24gc2NyZWVuLiBUaGlzIGlzIHRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZS5cclxuQnUuUE9JTlRfUkVOREVSX1NJWkUgPSAyLjI1XHJcblxyXG4jIFBvaW50IGNhbiBoYXZlIGxhYmVsIGFzaWRlIGl0LiBUaGlzIGlzIHRoZSBvZmZzZXQgZGlzdGFuY2UgZnJvbSB0aGUgcG9pbnQuXHJcbkJ1LlBPSU5UX0xBQkVMX09GRlNFVCA9IDVcclxuXHJcbiMgRGVmYXVsdCByZW5kZXIgc3R5bGUgb2YgYm91bmRzXHJcbkJ1LkRFRkFVTFRfQk9VTkRfU1RST0tFX1NUWUxFID0gJyM0NDQnXHJcblxyXG4jIERlZmF1bHQgZGFzaCBzdHlsZSBvZiBib3VuZHNcclxuQnUuREVGQVVMVF9CT1VORF9EQVNIX1NUWUxFID0gWzYsIDZdXHJcblxyXG4jIERlZmF1bHQgc21vb3RoIGZhY3RvciBvZiBzcGxpbmUsIHJhbmdlIGluIFswLCAxXSBhbmQgMSBpcyB0aGUgc21vb3RoZXN0XHJcbkJ1LkRFRkFVTFRfU1BMSU5FX1NNT09USCA9IDAuMjVcclxuXHJcbiMgSG93IGNsb3NlIGEgcG9pbnQgdG8gYSBsaW5lIGlzIHJlZ2FyZGVkIHRoYXQgdGhlIHBvaW50IGlzICoqT04qKiB0aGUgbGluZS5cclxuQnUuREVGQVVMVF9ORUFSX0RJU1QgPSA1XHJcblxyXG4jIEVudW1lcmF0aW9uIG9mIG1vdXNlIGJ1dHRvblxyXG5CdS5NT1VTRV9CVVRUT05fTk9ORSA9IC0xXHJcbkJ1Lk1PVVNFX0JVVFRPTl9MRUZUID0gMFxyXG5CdS5NT1VTRV9CVVRUT05fTUlERExFID0gMVxyXG5CdS5NT1VTRV9CVVRUT05fUklHSFQgPSAyXHJcblxyXG5cclxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBVdGlsaXR5IGZ1bmN0aW9uc1xyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuIyBDYWxjdWxhdGUgdGhlIG1lYW4gdmFsdWUgb2YgbnVtYmVyc1xyXG5CdS5hdmVyYWdlID0gKCktPlxyXG5cdG5zID0gYXJndW1lbnRzXHJcblx0bnMgPSBhcmd1bWVudHNbMF0gaWYgdHlwZW9mIGFyZ3VtZW50c1swXSBpcyAnb2JqZWN0J1xyXG5cdHN1bSA9IDBcclxuXHRmb3IgaSBpbiBuc1xyXG5cdFx0c3VtICs9IGlcclxuXHRzdW0gLyBucy5sZW5ndGhcclxuXHJcbiMgQ2FsY3VsYXRlIHRoZSBoeXBvdGVudXNlIGZyb20gdGhlIGNhdGhldHVzZXNcclxuQnUuYmV2ZWwgPSAoeCwgeSkgLT5cclxuXHRNYXRoLnNxcnQgeCAqIHggKyB5ICogeVxyXG5cclxuIyBMaW1pdCBhIG51bWJlciBieSBtaW5pbXVtIHZhbHVlIGFuZCBtYXhpbXVtIHZhbHVlXHJcbkJ1LmNsYW1wID0gKHgsIG1pbiwgbWF4KSAtPlxyXG5cdHggPSBtaW4gaWYgeCA8IG1pblxyXG5cdHggPSBtYXggaWYgeCA+IG1heFxyXG5cdHhcclxuXHJcbiMgR2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIG51bWJlcnNcclxuQnUucmFuZCA9IChmcm9tLCB0bykgLT5cclxuXHRpZiBub3QgdG8/XHJcblx0XHR0byA9IGZyb21cclxuXHRcdGZyb20gPSAwXHJcblx0TWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pICsgZnJvbVxyXG5cclxuIyBDb252ZXJ0IGFuIGFuZ2xlIGZyb20gcmFkaWFuIHRvIGRlZ1xyXG5CdS5yMmQgPSAocikgLT4gKHIgKiAxODAgLyBNYXRoLlBJKS50b0ZpeGVkKDEpXHJcblxyXG4jIENvbnZlcnQgYW4gYW5nbGUgZnJvbSBkZWcgdG8gcmFkaWFuXHJcbkJ1LmQyciA9IChyKSAtPiByICogTWF0aC5QSSAvIDE4MFxyXG5cclxuIyBHZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wXHJcbkJ1Lm5vdyA9IGlmIEJ1Lmdsb2JhbC5wZXJmb3JtYW5jZT8gdGhlbiAtPiBCdS5nbG9iYWwucGVyZm9ybWFuY2Uubm93KCkgZWxzZSAtPiBEYXRlLm5vdygpXHJcblxyXG4jIENvbWJpbmUgdGhlIGdpdmVuIG9wdGlvbnMgKGxhc3QgaXRlbSBvZiBhcmd1bWVudHMpIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9uc1xyXG5CdS5jb21iaW5lT3B0aW9ucyA9IChhcmdzLCBkZWZhdWx0T3B0aW9ucykgLT5cclxuXHRkZWZhdWx0T3B0aW9ucyA9IHt9IGlmIG5vdCBkZWZhdWx0T3B0aW9ucz9cclxuXHRnaXZlbk9wdGlvbnMgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV1cclxuXHRpZiB0eXBlb2YgZ2l2ZW5PcHRpb25zIGlzICdvYmplY3QnXHJcblx0XHRmb3IgaSBvZiBnaXZlbk9wdGlvbnMgd2hlbiBnaXZlbk9wdGlvbnNbaV0/XHJcblx0XHRcdGRlZmF1bHRPcHRpb25zW2ldID0gZ2l2ZW5PcHRpb25zW2ldXHJcblx0cmV0dXJuIGRlZmF1bHRPcHRpb25zXHJcblxyXG4jIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhbiBwbGFpbiBvYmplY3QsIG5vdCBpbnN0YW5jZSBvZiBjbGFzcy9mdW5jdGlvblxyXG5CdS5pc1BsYWluT2JqZWN0ID0gKG8pIC0+XHJcblx0byBpbnN0YW5jZW9mIE9iamVjdCBhbmQgby5jb25zdHJ1Y3Rvci5uYW1lID09ICdPYmplY3QnXHJcblxyXG4jIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIGZ1bmN0aW9uXHJcbkJ1LmlzRnVuY3Rpb24gPSAobykgLT5cclxuXHRvIGluc3RhbmNlb2YgT2JqZWN0IGFuZCBvLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ0Z1bmN0aW9uJ1xyXG5cclxuIyBDbG9uZSBhbiBPYmplY3Qgb3IgQXJyYXlcclxuQnUuY2xvbmUgPSAodGFyZ2V0KSAtPlxyXG5cdGlmIHR5cGVvZih0YXJnZXQpICE9ICdvYmplY3QnIG9yIHRhcmdldCA9PSBudWxsIG9yIEJ1LmlzRnVuY3Rpb24gdGFyZ2V0XHJcblx0XHRyZXR1cm4gdGFyZ2V0XHJcblx0ZWxzZVxyXG5cdFx0IyBGSVhNRSBjYXVzZSBzdGFjayBvdmVyZmxvdyB3aGVuIGl0cyBhIGNpcmN1bGFyIHN0cnVjdHVyZVxyXG5cdFx0aWYgdGFyZ2V0IGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0Y2xvbmUgPSBbXVxyXG5cdFx0ZWxzZSBpZiBCdS5pc1BsYWluT2JqZWN0IHRhcmdldFxyXG5cdFx0XHRjbG9uZSA9IHt9XHJcblx0XHRlbHNlICMgaW5zdGFuY2Ugb2YgY2xhc3NcclxuXHRcdFx0Y2xvbmUgPSBPYmplY3QuY3JlYXRlIHRhcmdldC5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcclxuXHJcblx0XHRmb3Igb3duIGkgb2YgdGFyZ2V0XHJcblx0XHRcdGNsb25lW2ldID0gQnUuY2xvbmUgdGFyZ2V0W2ldXHJcblxyXG5cdFx0aWYgY2xvbmUuY29uc3RydWN0b3IubmFtZSA9PSAnRnVuY3Rpb24nXHJcblx0XHRcdGNvbnNvbGUubG9nKGNsb25lKTtcclxuXHRcdHJldHVybiBjbG9uZVxyXG5cclxuIyBVc2UgbG9jYWxTdG9yYWdlIHRvIHBlcnNpc3QgZGF0YVxyXG5CdS5kYXRhID0gKGtleSwgdmFsdWUpIC0+XHJcblx0aWYgdmFsdWU/XHJcblx0XHRsb2NhbFN0b3JhZ2VbJ0J1LicgKyBrZXldID0gSlNPTi5zdHJpbmdpZnkgdmFsdWVcclxuXHRlbHNlXHJcblx0XHR2YWx1ZSA9IGxvY2FsU3RvcmFnZVsnQnUuJyArIGtleV1cclxuXHRcdGlmIHZhbHVlPyB0aGVuIEpTT04ucGFyc2UgdmFsdWUgZWxzZSBudWxsXHJcblxyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIFBvbHlmaWxsXHJcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4jIFNob3J0Y3V0IHRvIGRlZmluZSBhIHByb3BlcnR5IGZvciBhIGNsYXNzLiBUaGlzIGlzIHVzZWQgdG8gc29sdmUgdGhlIHByb2JsZW1cclxuIyB0aGF0IENvZmZlZVNjcmlwdCBkaWRuJ3Qgc3VwcG9ydCBnZXR0ZXJzIGFuZCBzZXR0ZXJzLlxyXG4jIGNsYXNzIFBlcnNvblxyXG4jICAgQGNvbnN0cnVjdG9yOiAoYWdlKSAtPlxyXG4jICAgICBAX2FnZSA9IGFnZVxyXG4jXHJcbiMgICBAcHJvcGVydHkgJ2FnZScsXHJcbiMgICAgIGdldDogLT4gQF9hZ2VcclxuIyAgICAgc2V0OiAodmFsKSAtPlxyXG4jICAgICAgIEBfYWdlID0gdmFsXHJcbiNcclxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsIHByb3AsIGRlc2NcclxuXHJcbiMgTWFrZSBhIGNvcHkgb2YgdGhpcyBmdW5jdGlvbiB3aGljaCBoYXMgYSBsaW1pdGVkIHNob3J0ZXN0IGV4ZWN1dGluZyBpbnRlcnZhbC5cclxuRnVuY3Rpb246OnRocm90dGxlID0gKGxpbWl0ID0gMC41KSAtPlxyXG5cdGN1cnJUaW1lID0gMFxyXG5cdGxhc3RUaW1lID0gMFxyXG5cclxuXHRyZXR1cm4gKCkgPT5cclxuXHRcdGN1cnJUaW1lID0gRGF0ZS5ub3coKVxyXG5cdFx0aWYgY3VyclRpbWUgLSBsYXN0VGltZSA+IGxpbWl0ICogMTAwMFxyXG5cdFx0XHRAYXBwbHkgbnVsbCwgYXJndW1lbnRzXHJcblx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWVcclxuXHJcbiMgTWFrZSBhIGNvcHkgb2YgdGhpcyBmdW5jdGlvbiB3aG9zZSBleGVjdXRpb24gd2lsbCBiZSBjb250aW51b3VzbHkgcHV0IG9mZlxyXG4jIGFmdGVyIGV2ZXJ5IGNhbGxpbmcgb2YgdGhpcyBmdW5jdGlvbi5cclxuRnVuY3Rpb246OmRlYm91bmNlID0gKGRlbGF5ID0gMC41KSAtPlxyXG5cdGFyZ3MgPSBudWxsXHJcblx0dGltZW91dCA9IG51bGxcclxuXHJcblx0bGF0ZXIgPSA9PlxyXG5cdFx0QGFwcGx5IG51bGwsIGFyZ3NcclxuXHJcblx0cmV0dXJuICgpIC0+XHJcblx0XHRhcmdzID0gYXJndW1lbnRzXHJcblx0XHRjbGVhclRpbWVvdXQgdGltZW91dFxyXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQgbGF0ZXIsIGRlbGF5ICogMTAwMFxyXG5cclxuXHJcbiMgSXRlcmF0ZSB0aGlzIEFycmF5IGFuZCBkbyBzb21ldGhpbmcgd2l0aCB0aGUgaXRlbXMuXHJcbkFycmF5OjplYWNoIG9yPSAoZm4pIC0+XHJcblx0aSA9IDBcclxuXHR3aGlsZSBpIDwgQGxlbmd0aFxyXG5cdFx0Zm4gQFtpXVxyXG5cdFx0aSsrXHJcblx0cmV0dXJuIEBcclxuXHJcbiMgSXRlcmF0ZSB0aGlzIEFycmF5IGFuZCBtYXAgdGhlIGl0ZW1zIHRvIGEgbmV3IEFycmF5LlxyXG5BcnJheTo6bWFwIG9yPSAoZm4pIC0+XHJcblx0YXJyID0gW11cclxuXHRpID0gMFxyXG5cdHdoaWxlIGkgPCBAbGVuZ3RoXHJcblx0XHRhcnIucHVzaCBmbihAW2ldKVxyXG5cdFx0aSsrXHJcblx0cmV0dXJuIEBcclxuXHJcbiMgRGlzcGxheSB2ZXJzaW9uIGluZm8uIEl0IHdpbGwgYXBwZWFyIGF0IG1vc3Qgb25lIHRpbWUgYSBtaW51dGUuXHJcbmxhc3RCb290VGltZSA9IEJ1LmRhdGEgJ2xhc3RJbmZvJ1xyXG5jdXJyZW50VGltZSA9IERhdGUubm93KClcclxudW5sZXNzIGxhc3RCb290VGltZT8gYW5kIGN1cnJlbnRUaW1lIC0gbGFzdEJvb3RUaW1lIDwgNjAgKiAxMDAwXHJcblx0Y29uc29sZS5pbmZvPyAnQnUuanMgdicgKyBCdS5WRVJTSU9OICsgJyAtIFtodHRwczovL2dpdGh1Yi5jb20vamFydmlzbml1L0J1LmpzXSdcclxuXHRCdS5kYXRhICdsYXN0SW5mbycsIGN1cnJlbnRUaW1lXHJcbiIsIiMjIGF4aXMgYWxpZ25lZCBib3VuZGluZyBib3hcclxuXHJcbmNsYXNzIEJ1LkJvdW5kc1xyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XHJcblxyXG5cdFx0QHgxID0gQHkxID0gQHgyID0gQHkyID0gMFxyXG5cdFx0QGlzRW1wdHkgPSB0cnVlXHJcblxyXG5cdFx0QHBvaW50MSA9IG5ldyBCdS5WZWN0b3JcclxuXHRcdEBwb2ludDIgPSBuZXcgQnUuVmVjdG9yXHJcblxyXG5cdFx0QHN0cm9rZVN0eWxlID0gQnUuREVGQVVMVF9CT1VORF9TVFJPS0VfU1RZTEVcclxuXHRcdEBkYXNoU3R5bGUgPSBCdS5ERUZBVUxUX0JPVU5EX0RBU0hfU1RZTEVcclxuXHRcdEBkYXNoT2Zmc2V0ID0gMFxyXG5cclxuXHRcdHN3aXRjaCBAdGFyZ2V0LnR5cGVcclxuXHRcdFx0d2hlbiAnTGluZScsICdUcmlhbmdsZScsICdSZWN0YW5nbGUnXHJcblx0XHRcdFx0Zm9yIHYgaW4gQHRhcmdldC5wb2ludHNcclxuXHRcdFx0XHRcdEBleHBhbmRCeVBvaW50KHYpXHJcblx0XHRcdHdoZW4gJ0NpcmNsZScsICdCb3cnLCAnRmFuJ1xyXG5cdFx0XHRcdEBleHBhbmRCeUNpcmNsZSBAdGFyZ2V0XHJcblx0XHRcdFx0QHRhcmdldC5vbiAnY2VudGVyQ2hhbmdlZCcsID0+XHJcblx0XHRcdFx0XHRAY2xlYXIoKVxyXG5cdFx0XHRcdFx0QGV4cGFuZEJ5Q2lyY2xlIEB0YXJnZXRcclxuXHRcdFx0XHRAdGFyZ2V0Lm9uICdyYWRpdXNDaGFuZ2VkJywgPT5cclxuXHRcdFx0XHRcdEBjbGVhcigpXHJcblx0XHRcdFx0XHRAZXhwYW5kQnlDaXJjbGUgQHRhcmdldFxyXG5cdFx0XHR3aGVuICdQb2x5bGluZScsICdQb2x5Z29uJ1xyXG5cdFx0XHRcdGZvciB2IGluIEB0YXJnZXQudmVydGljZXNcclxuXHRcdFx0XHRcdEBleHBhbmRCeVBvaW50KHYpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLndhcm4gJ0JvdW5kczogbm90IHN1cHBvcnQgc2hhcGUgdHlwZSBcIicgKyBAdGFyZ2V0LnR5cGUgKyAnXCInXHJcblxyXG5cdGNvbnRhaW5zUG9pbnQ6IChwKSAtPlxyXG5cdFx0QHgxIDwgcC54ICYmIEB4MiA+IHAueCAmJiBAeTEgPCBwLnkgJiYgQHkyID4gcC55XHJcblxyXG5cdGNsZWFyOiAoKSAtPlxyXG5cdFx0QHgxID0gQHkxID0gQHgyID0gQHkyID0gMFxyXG5cdFx0QGlzRW1wdHkgPSB0cnVlXHJcblxyXG5cdGV4cGFuZEJ5UG9pbnQ6ICh2KSAtPlxyXG5cdFx0aWYgQGlzRW1wdHlcclxuXHRcdFx0QGlzRW1wdHkgPSBmYWxzZVxyXG5cdFx0XHRAeDEgPSBAeDIgPSB2LnhcclxuXHRcdFx0QHkxID0gQHkyID0gdi55XHJcblx0XHRlbHNlXHJcblx0XHRcdEB4MSA9IHYueCBpZiB2LnggPCBAeDFcclxuXHRcdFx0QHgyID0gdi54IGlmIHYueCA+IEB4MlxyXG5cdFx0XHRAeTEgPSB2LnkgaWYgdi55IDwgQHkxXHJcblx0XHRcdEB5MiA9IHYueSBpZiB2LnkgPiBAeTJcclxuXHJcblx0ZXhwYW5kQnlDaXJjbGU6IChjKSAtPlxyXG5cdFx0Y3AgPSBjLmNlbnRlclxyXG5cdFx0ciA9IGMucmFkaXVzXHJcblx0XHRpZiBAaXNFbXB0eVxyXG5cdFx0XHRAaXNFbXB0eSA9IGZhbHNlXHJcblx0XHRcdEB4MSA9IGNwLnggLSByXHJcblx0XHRcdEB4MiA9IGNwLnggKyByXHJcblx0XHRcdEB5MSA9IGNwLnkgLSByXHJcblx0XHRcdEB5MiA9IGNwLnkgKyByXHJcblx0XHRlbHNlXHJcblx0XHRcdEB4MSA9IGNwLnggLSByIGlmIGNwLnggLSByIDwgQHgxXHJcblx0XHRcdEB4MiA9IGNwLnggKyByIGlmIGNwLnggKyByID4gQHgyXHJcblx0XHRcdEB5MSA9IGNwLnkgLSByIGlmIGNwLnkgLSByIDwgQHkxXHJcblx0XHRcdEB5MiA9IGNwLnkgKyByIGlmIGNwLnkgKyByID4gQHkyXHJcbiIsIiMgUGFyc2UgYW5kIHNlcmlhbGl6ZSBjb2xvclxyXG4jIFRPRE8gU3VwcG9ydCBoc2woMCwgMTAwJSwgNTAlKSBmb3JtYXQuXHJcblxyXG5jbGFzcyBCdS5Db2xvclxyXG5cclxuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxyXG4gICAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMFxyXG4gICAgICAgICAgICBAciA9IEBnID0gQGIgPSAyNTVcclxuICAgICAgICAgICAgQGEgPSAxXHJcbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgICAgIGFyZyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICBpZiB0eXBlb2YgYXJnID09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICBAcGFyc2UgYXJnXHJcbiAgICAgICAgICAgICAgICBAYSA9IGNsYW1wQWxwaGEgQGFcclxuICAgICAgICAgICAgZWxzZSBpZiBhcmcgaW5zdGFuY2VvZiBCdS5Db2xvclxyXG4gICAgICAgICAgICAgICAgQGNvcHkgYXJnXHJcbiAgICAgICAgZWxzZSAjIGFyZ3VtZW50cy5sZW5ndGggPT0gMyBvciA0XHJcbiAgICAgICAgICAgIEByID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgIEBnID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgICAgIEBiID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICAgICAgIEBhID0gYXJndW1lbnRzWzNdIG9yIDFcclxuXHJcbiAgICBwYXJzZTogKHN0cikgLT5cclxuICAgICAgICBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9SR0JBXHJcbiAgICAgICAgICAgIEByID0gcGFyc2VJbnQgZm91bmRbMV1cclxuICAgICAgICAgICAgQGcgPSBwYXJzZUludCBmb3VuZFsyXVxyXG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50IGZvdW5kWzNdXHJcbiAgICAgICAgICAgIEBhID0gcGFyc2VGbG9hdCBmb3VuZFs0XVxyXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfUkdCXHJcbiAgICAgICAgICAgIEByID0gcGFyc2VJbnQgZm91bmRbMV1cclxuICAgICAgICAgICAgQGcgPSBwYXJzZUludCBmb3VuZFsyXVxyXG4gICAgICAgICAgICBAYiA9IHBhcnNlSW50IGZvdW5kWzNdXHJcbiAgICAgICAgICAgIEBhID0gMVxyXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfUkdCQV9QRVJcclxuICAgICAgICAgICAgQHIgPSBwYXJzZUludChmb3VuZFsxXSAqIDI1NSAvIDEwMClcclxuICAgICAgICAgICAgQGcgPSBwYXJzZUludChmb3VuZFsyXSAqIDI1NSAvIDEwMClcclxuICAgICAgICAgICAgQGIgPSBwYXJzZUludChmb3VuZFszXSAqIDI1NSAvIDEwMClcclxuICAgICAgICAgICAgQGEgPSBwYXJzZUZsb2F0IGZvdW5kWzRdXHJcbiAgICAgICAgZWxzZSBpZiBmb3VuZCA9IHN0ci5tYXRjaCBSRV9SR0JfUEVSXHJcbiAgICAgICAgICAgIEByID0gcGFyc2VJbnQoZm91bmRbMV0gKiAyNTUgLyAxMDApXHJcbiAgICAgICAgICAgIEBnID0gcGFyc2VJbnQoZm91bmRbMl0gKiAyNTUgLyAxMDApXHJcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQoZm91bmRbM10gKiAyNTUgLyAxMDApXHJcbiAgICAgICAgICAgIEBhID0gMVxyXG4gICAgICAgIGVsc2UgaWYgZm91bmQgPSBzdHIubWF0Y2ggUkVfSEVYM1xyXG4gICAgICAgICAgICBoZXggPSBmb3VuZFsxXVxyXG4gICAgICAgICAgICBAciA9IHBhcnNlSW50IGhleFswXSwgMTZcclxuICAgICAgICAgICAgQHIgPSBAciAqIDE2ICsgQHJcclxuICAgICAgICAgICAgQGcgPSBwYXJzZUludCBoZXhbMV0sIDE2XHJcbiAgICAgICAgICAgIEBnID0gQGcgKiAxNiArIEBnXHJcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQgaGV4WzJdLCAxNlxyXG4gICAgICAgICAgICBAYiA9IEBiICogMTYgKyBAYlxyXG4gICAgICAgICAgICBAYSA9IDFcclxuICAgICAgICBlbHNlIGlmIGZvdW5kID0gc3RyLm1hdGNoIFJFX0hFWDZcclxuICAgICAgICAgICAgaGV4ID0gZm91bmRbMV1cclxuICAgICAgICAgICAgQHIgPSBwYXJzZUludCBoZXguc3Vic3RyaW5nKDAsIDIpLCAxNlxyXG4gICAgICAgICAgICBAZyA9IHBhcnNlSW50IGhleC5zdWJzdHJpbmcoMiwgNCksIDE2XHJcbiAgICAgICAgICAgIEBiID0gcGFyc2VJbnQgaGV4LnN1YnN0cmluZyg0LCA2KSwgMTZcclxuICAgICAgICAgICAgQGEgPSAxXHJcbiAgICAgICAgZWxzZSBpZiBDU1MzX0NPTE9SU1tzdHIgPSBzdHIudG9Mb3dlckNhc2UoKS50cmltKCldP1xyXG4gICAgICAgICAgICBAciA9IENTUzNfQ09MT1JTW3N0cl1bMF1cclxuICAgICAgICAgICAgQGcgPSBDU1MzX0NPTE9SU1tzdHJdWzFdXHJcbiAgICAgICAgICAgIEBiID0gQ1NTM19DT0xPUlNbc3RyXVsyXVxyXG4gICAgICAgICAgICBAYSA9IENTUzNfQ09MT1JTW3N0cl1bM11cclxuICAgICAgICAgICAgQGEgPSAxIHVubGVzcyBAYT9cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJCdS5Db2xvci5wYXJzZShcXFwiI3sgc3RyIH1cXFwiKSBlcnJvci5cIlxyXG4gICAgICAgIEBcclxuXHJcbiAgICBjb3B5OiAoY29sb3IpIC0+XHJcbiAgICAgICAgQHIgPSBjb2xvci5yXHJcbiAgICAgICAgQGcgPSBjb2xvci5nXHJcbiAgICAgICAgQGIgPSBjb2xvci5iXHJcbiAgICAgICAgQGEgPSBjb2xvci5hXHJcbiAgICAgICAgQFxyXG5cclxuICAgIHNldFJHQjogKHIsIGcsIGIpIC0+XHJcbiAgICAgICAgQHIgPSBwYXJzZUludCByXHJcbiAgICAgICAgQGcgPSBwYXJzZUludCBnXHJcbiAgICAgICAgQGIgPSBwYXJzZUludCBiXHJcbiAgICAgICAgQGEgPSAxXHJcbiAgICAgICAgQFxyXG5cclxuICAgIHNldFJHQkE6IChyLCBnLCBiLCBhKSAtPlxyXG4gICAgICAgIEByID0gcGFyc2VJbnQgclxyXG4gICAgICAgIEBnID0gcGFyc2VJbnQgZ1xyXG4gICAgICAgIEBiID0gcGFyc2VJbnQgYlxyXG4gICAgICAgIEBhID0gY2xhbXBBbHBoYSBwYXJzZUZsb2F0IGFcclxuICAgICAgICBAXHJcblxyXG4gICAgdG9SR0I6IC0+XHJcbiAgICAgICAgXCJyZ2IoI3sgQHIgfSwgI3sgQGcgfSwgI3sgQGIgfSlcIlxyXG5cclxuICAgIHRvUkdCQTogLT5cclxuICAgICAgICBcInJnYmEoI3sgQHIgfSwgI3sgQGcgfSwgI3sgQGIgfSwgI3sgQGEgfSlcIlxyXG5cclxuXHJcbiAgICAjIFByaXZhdGUgZnVuY3Rpb25zXHJcblxyXG4gICAgY2xhbXBBbHBoYSA9IChhKSAtPiBCdS5jbGFtcCBhLCAwLCAxXHJcblxyXG5cclxuICAgICMgUHJpdmF0ZSB2YXJpYWJsZXNcclxuXHJcbiAgICBSRV9SR0IgPSAvcmdiXFwoXFxzKihcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKylcXHMqXFwpL2lcclxuICAgIFJFX1JHQkEgPSAvcmdiYVxcKFxccyooXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspXFxzKixcXHMqKFsuXFxkXSspXFxzKlxcKS9pXHJcbiAgICBSRV9SR0JfUEVSID0gL3JnYlxcKFxccyooXFxkKyklLFxccyooXFxkKyklLFxccyooXFxkKyklXFxzKlxcKS9pXHJcbiAgICBSRV9SR0JBX1BFUiA9IC9yZ2JhXFwoXFxzKihcXGQrKSUsXFxzKihcXGQrKSUsXFxzKihcXGQrKSVcXHMqLFxccyooWy5cXGRdKylcXHMqXFwpL2lcclxuICAgIFJFX0hFWDMgPSAvIyhbMC05QS1GXXszfSlcXHMqJC9pXHJcbiAgICBSRV9IRVg2ID0gLyMoWzAtOUEtRl17Nn0pXFxzKiQvaVxyXG4gICAgQ1NTM19DT0xPUlMgPVxyXG4gICAgICAgIHRyYW5zcGFyZW50OiBbMCwgMCwgMCwgMF1cclxuXHJcbiAgICAgICAgYWxpY2VibHVlOiBbMjQwLCAyNDgsIDI1NV1cclxuICAgICAgICBhbnRpcXVld2hpdGU6IFsyNTAsIDIzNSwgMjE1XVxyXG4gICAgICAgIGFxdWE6IFswLCAyNTUsIDI1NV1cclxuICAgICAgICBhcXVhbWFyaW5lOiBbMTI3LCAyNTUsIDIxMl1cclxuICAgICAgICBhenVyZTogWzI0MCwgMjU1LCAyNTVdXHJcbiAgICAgICAgYmVpZ2U6IFsyNDUsIDI0NSwgMjIwXVxyXG4gICAgICAgIGJpc3F1ZTogWzI1NSwgMjI4LCAxOTZdXHJcbiAgICAgICAgYmxhY2s6IFswLCAwLCAwXVxyXG4gICAgICAgIGJsYW5jaGVkYWxtb25kOiBbMjU1LCAyMzUsIDIwNV1cclxuICAgICAgICBibHVlOiBbMCwgMCwgMjU1XVxyXG4gICAgICAgIGJsdWV2aW9sZXQ6IFsxMzgsIDQzLCAyMjZdXHJcbiAgICAgICAgYnJvd246IFsxNjUsIDQyLCA0Ml1cclxuICAgICAgICBidXJseXdvb2Q6IFsyMjIsIDE4NCwgMTM1XVxyXG4gICAgICAgIGNhZGV0Ymx1ZTogWzk1LCAxNTgsIDE2MF1cclxuICAgICAgICBjaGFydHJldXNlOiBbMTI3LCAyNTUsIDBdXHJcbiAgICAgICAgY2hvY29sYXRlOiBbMjEwLCAxMDUsIDMwXVxyXG4gICAgICAgIGNvcmFsOiBbMjU1LCAxMjcsIDgwXVxyXG4gICAgICAgIGNvcm5mbG93ZXJibHVlOiBbMTAwLCAxNDksIDIzN11cclxuICAgICAgICBjb3Juc2lsazogWzI1NSwgMjQ4LCAyMjBdXHJcbiAgICAgICAgY3JpbXNvbjogWzIyMCwgMjAsIDYwXVxyXG4gICAgICAgIGN5YW46IFswLCAyNTUsIDI1NV1cclxuICAgICAgICBkYXJrYmx1ZTogWzAsIDAsIDEzOV1cclxuICAgICAgICBkYXJrY3lhbjogWzAsIDEzOSwgMTM5XVxyXG4gICAgICAgIGRhcmtnb2xkZW5yb2Q6IFsxODQsIDEzNCwgMTFdXHJcbiAgICAgICAgZGFya2dyYXk6IFsxNjksIDE2OSwgMTY5XVxyXG4gICAgICAgIGRhcmtncmVlbjogWzAsIDEwMCwgMF1cclxuICAgICAgICBkYXJrZ3JleTogWzE2OSwgMTY5LCAxNjldXHJcbiAgICAgICAgZGFya2toYWtpOiBbMTg5LCAxODMsIDEwN11cclxuICAgICAgICBkYXJrbWFnZW50YTogWzEzOSwgMCwgMTM5XVxyXG4gICAgICAgIGRhcmtvbGl2ZWdyZWVuOiBbODUsIDEwNywgNDddXHJcbiAgICAgICAgZGFya29yYW5nZTogWzI1NSwgMTQwLCAwXVxyXG4gICAgICAgIGRhcmtvcmNoaWQ6IFsxNTMsIDUwLCAyMDRdXHJcbiAgICAgICAgZGFya3JlZDogWzEzOSwgMCwgMF1cclxuICAgICAgICBkYXJrc2FsbW9uOiBbMjMzLCAxNTAsIDEyMl1cclxuICAgICAgICBkYXJrc2VhZ3JlZW46IFsxNDMsIDE4OCwgMTQzXVxyXG4gICAgICAgIGRhcmtzbGF0ZWJsdWU6IFs3MiwgNjEsIDEzOV1cclxuICAgICAgICBkYXJrc2xhdGVncmF5OiBbNDcsIDc5LCA3OV1cclxuICAgICAgICBkYXJrc2xhdGVncmV5OiBbNDcsIDc5LCA3OV1cclxuICAgICAgICBkYXJrdHVycXVvaXNlOiBbMCwgMjA2LCAyMDldXHJcbiAgICAgICAgZGFya3Zpb2xldDogWzE0OCwgMCwgMjExXVxyXG4gICAgICAgIGRlZXBwaW5rOiBbMjU1LCAyMCwgMTQ3XVxyXG4gICAgICAgIGRlZXBza3libHVlOiBbMCwgMTkxLCAyNTVdXHJcbiAgICAgICAgZGltZ3JheTogWzEwNSwgMTA1LCAxMDVdXHJcbiAgICAgICAgZGltZ3JleTogWzEwNSwgMTA1LCAxMDVdXHJcbiAgICAgICAgZG9kZ2VyYmx1ZTogWzMwLCAxNDQsIDI1NV1cclxuICAgICAgICBmaXJlYnJpY2s6IFsxNzgsIDM0LCAzNF1cclxuICAgICAgICBmbG9yYWx3aGl0ZTogWzI1NSwgMjUwLCAyNDBdXHJcbiAgICAgICAgZm9yZXN0Z3JlZW46IFszNCwgMTM5LCAzNF1cclxuICAgICAgICBmdWNoc2lhOiBbMjU1LCAwLCAyNTVdXHJcbiAgICAgICAgZ2FpbnNib3JvOiBbMjIwLCAyMjAsIDIyMF1cclxuICAgICAgICBnaG9zdHdoaXRlOiBbMjQ4LCAyNDgsIDI1NV1cclxuICAgICAgICBnb2xkOiBbMjU1LCAyMTUsIDBdXHJcbiAgICAgICAgZ29sZGVucm9kOiBbMjE4LCAxNjUsIDMyXVxyXG4gICAgICAgIGdyYXk6IFsxMjgsIDEyOCwgMTI4XVxyXG4gICAgICAgIGdyZWVuOiBbMCwgMTI4LCAwXVxyXG4gICAgICAgIGdyZWVueWVsbG93OiBbMTczLCAyNTUsIDQ3XVxyXG4gICAgICAgIGdyZXk6IFsxMjgsIDEyOCwgMTI4XVxyXG4gICAgICAgIGhvbmV5ZGV3OiBbMjQwLCAyNTUsIDI0MF1cclxuICAgICAgICBob3RwaW5rOiBbMjU1LCAxMDUsIDE4MF1cclxuICAgICAgICBpbmRpYW5yZWQ6IFsyMDUsIDkyLCA5Ml1cclxuICAgICAgICBpbmRpZ286IFs3NSwgMCwgMTMwXVxyXG4gICAgICAgIGl2b3J5OiBbMjU1LCAyNTUsIDI0MF1cclxuICAgICAgICBraGFraTogWzI0MCwgMjMwLCAxNDBdXHJcbiAgICAgICAgbGF2ZW5kZXI6IFsyMzAsIDIzMCwgMjUwXVxyXG4gICAgICAgIGxhdmVuZGVyYmx1c2g6IFsyNTUsIDI0MCwgMjQ1XVxyXG4gICAgICAgIGxhd25ncmVlbjogWzEyNCwgMjUyLCAwXVxyXG4gICAgICAgIGxlbW9uY2hpZmZvbjogWzI1NSwgMjUwLCAyMDVdXHJcbiAgICAgICAgbGlnaHRibHVlOiBbMTczLCAyMTYsIDIzMF1cclxuICAgICAgICBsaWdodGNvcmFsOiBbMjQwLCAxMjgsIDEyOF1cclxuICAgICAgICBsaWdodGN5YW46IFsyMjQsIDI1NSwgMjU1XVxyXG4gICAgICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiBbMjUwLCAyNTAsIDIxMF1cclxuICAgICAgICBsaWdodGdyYXk6IFsyMTEsIDIxMSwgMjExXVxyXG4gICAgICAgIGxpZ2h0Z3JlZW46IFsxNDQsIDIzOCwgMTQ0XVxyXG4gICAgICAgIGxpZ2h0Z3JleTogWzIxMSwgMjExLCAyMTFdXHJcbiAgICAgICAgbGlnaHRwaW5rOiBbMjU1LCAxODIsIDE5M11cclxuICAgICAgICBsaWdodHNhbG1vbjogWzI1NSwgMTYwLCAxMjJdXHJcbiAgICAgICAgbGlnaHRzZWFncmVlbjogWzMyLCAxNzgsIDE3MF1cclxuICAgICAgICBsaWdodHNreWJsdWU6IFsxMzUsIDIwNiwgMjUwXVxyXG4gICAgICAgIGxpZ2h0c2xhdGVncmF5OiBbMTE5LCAxMzYsIDE1M11cclxuICAgICAgICBsaWdodHNsYXRlZ3JleTogWzExOSwgMTM2LCAxNTNdXHJcbiAgICAgICAgbGlnaHRzdGVlbGJsdWU6IFsxNzYsIDE5NiwgMjIyXVxyXG4gICAgICAgIGxpZ2h0eWVsbG93OiBbMjU1LCAyNTUsIDIyNF1cclxuICAgICAgICBsaW1lOiBbMCwgMjU1LCAwXVxyXG4gICAgICAgIGxpbWVncmVlbjogWzUwLCAyMDUsIDUwXVxyXG4gICAgICAgIGxpbmVuOiBbMjUwLCAyNDAsIDIzMF1cclxuICAgICAgICBtYWdlbnRhOiBbMjU1LCAwLCAyNTVdXHJcbiAgICAgICAgbWFyb29uOiBbMTI4LCAwLCAwXVxyXG4gICAgICAgIG1lZGl1bWFxdWFtYXJpbmU6IFsxMDIsIDIwNSwgMTcwXVxyXG4gICAgICAgIG1lZGl1bWJsdWU6IFswLCAwLCAyMDVdXHJcbiAgICAgICAgbWVkaXVtb3JjaGlkOiBbMTg2LCA4NSwgMjExXVxyXG4gICAgICAgIG1lZGl1bXB1cnBsZTogWzE0NywgMTEyLCAyMTldXHJcbiAgICAgICAgbWVkaXVtc2VhZ3JlZW46IFs2MCwgMTc5LCAxMTNdXHJcbiAgICAgICAgbWVkaXVtc2xhdGVibHVlOiBbMTIzLCAxMDQsIDIzOF1cclxuICAgICAgICBtZWRpdW1zcHJpbmdncmVlbjogWzAsIDI1MCwgMTU0XVxyXG4gICAgICAgIG1lZGl1bXR1cnF1b2lzZTogWzcyLCAyMDksIDIwNF1cclxuICAgICAgICBtZWRpdW12aW9sZXRyZWQ6IFsxOTksIDIxLCAxMzNdXHJcbiAgICAgICAgbWlkbmlnaHRibHVlOiBbMjUsIDI1LCAxMTJdXHJcbiAgICAgICAgbWludGNyZWFtOiBbMjQ1LCAyNTUsIDI1MF1cclxuICAgICAgICBtaXN0eXJvc2U6IFsyNTUsIDIyOCwgMjI1XVxyXG4gICAgICAgIG1vY2Nhc2luOiBbMjU1LCAyMjgsIDE4MV1cclxuICAgICAgICBuYXZham93aGl0ZTogWzI1NSwgMjIyLCAxNzNdXHJcbiAgICAgICAgbmF2eTogWzAsIDAsIDEyOF1cclxuICAgICAgICBvbGRsYWNlOiBbMjUzLCAyNDUsIDIzMF1cclxuICAgICAgICBvbGl2ZTogWzEyOCwgMTI4LCAwXVxyXG4gICAgICAgIG9saXZlZHJhYjogWzEwNywgMTQyLCAzNV1cclxuICAgICAgICBvcmFuZ2U6IFsyNTUsIDE2NSwgMF1cclxuICAgICAgICBvcmFuZ2VyZWQ6IFsyNTUsIDY5LCAwXVxyXG4gICAgICAgIG9yY2hpZDogWzIxOCwgMTEyLCAyMTRdXHJcbiAgICAgICAgcGFsZWdvbGRlbnJvZDogWzIzOCwgMjMyLCAxNzBdXHJcbiAgICAgICAgcGFsZWdyZWVuOiBbMTUyLCAyNTEsIDE1Ml1cclxuICAgICAgICBwYWxldHVycXVvaXNlOiBbMTc1LCAyMzgsIDIzOF1cclxuICAgICAgICBwYWxldmlvbGV0cmVkOiBbMjE5LCAxMTIsIDE0N11cclxuICAgICAgICBwYXBheWF3aGlwOiBbMjU1LCAyMzksIDIxM11cclxuICAgICAgICBwZWFjaHB1ZmY6IFsyNTUsIDIxOCwgMTg1XVxyXG4gICAgICAgIHBlcnU6IFsyMDUsIDEzMywgNjNdXHJcbiAgICAgICAgcGluazogWzI1NSwgMTkyLCAyMDNdXHJcbiAgICAgICAgcGx1bTogWzIyMSwgMTYwLCAyMjFdXHJcbiAgICAgICAgcG93ZGVyYmx1ZTogWzE3NiwgMjI0LCAyMzBdXHJcbiAgICAgICAgcHVycGxlOiBbMTI4LCAwLCAxMjhdXHJcbiAgICAgICAgcmVkOiBbMjU1LCAwLCAwXVxyXG4gICAgICAgIHJvc3licm93bjogWzE4OCwgMTQzLCAxNDNdXHJcbiAgICAgICAgcm95YWxibHVlOiBbNjUsIDEwNSwgMjI1XVxyXG4gICAgICAgIHNhZGRsZWJyb3duOiBbMTM5LCA2OSwgMTldXHJcbiAgICAgICAgc2FsbW9uOiBbMjUwLCAxMjgsIDExNF1cclxuICAgICAgICBzYW5keWJyb3duOiBbMjQ0LCAxNjQsIDk2XVxyXG4gICAgICAgIHNlYWdyZWVuOiBbNDYsIDEzOSwgODddXHJcbiAgICAgICAgc2Vhc2hlbGw6IFsyNTUsIDI0NSwgMjM4XVxyXG4gICAgICAgIHNpZW5uYTogWzE2MCwgODIsIDQ1XVxyXG4gICAgICAgIHNpbHZlcjogWzE5MiwgMTkyLCAxOTJdXHJcbiAgICAgICAgc2t5Ymx1ZTogWzEzNSwgMjA2LCAyMzVdXHJcbiAgICAgICAgc2xhdGVibHVlOiBbMTA2LCA5MCwgMjA1XVxyXG4gICAgICAgIHNsYXRlZ3JheTogWzExMiwgMTI4LCAxNDRdXHJcbiAgICAgICAgc2xhdGVncmV5OiBbMTEyLCAxMjgsIDE0NF1cclxuICAgICAgICBzbm93OiBbMjU1LCAyNTAsIDI1MF1cclxuICAgICAgICBzcHJpbmdncmVlbjogWzAsIDI1NSwgMTI3XVxyXG4gICAgICAgIHN0ZWVsYmx1ZTogWzcwLCAxMzAsIDE4MF1cclxuICAgICAgICB0YW46IFsyMTAsIDE4MCwgMTQwXVxyXG4gICAgICAgIHRlYWw6IFswLCAxMjgsIDEyOF1cclxuICAgICAgICB0aGlzdGxlOiBbMjE2LCAxOTEsIDIxNl1cclxuICAgICAgICB0b21hdG86IFsyNTUsIDk5LCA3MV1cclxuICAgICAgICB0dXJxdW9pc2U6IFs2NCwgMjI0LCAyMDhdXHJcbiAgICAgICAgdmlvbGV0OiBbMjM4LCAxMzAsIDIzOF1cclxuICAgICAgICB3aGVhdDogWzI0NSwgMjIyLCAxNzldXHJcbiAgICAgICAgd2hpdGU6IFsyNTUsIDI1NSwgMjU1XVxyXG4gICAgICAgIHdoaXRlc21va2U6IFsyNDUsIDI0NSwgMjQ1XVxyXG4gICAgICAgIHllbGxvdzogWzI1NSwgMjU1LCAwXVxyXG4gICAgICAgIHllbGxvd2dyZWVuOiBbMTU0LCAyMDUsIDUwXVxyXG4iLCIjIHRoZSBzaXplIG9mIHJlY3RhbmdsZSwgQm91bmRzIGV0Yy5cclxuXHJcbmNsYXNzIEJ1LlNpemVcclxuXHRjb25zdHJ1Y3RvcjogKEB3aWR0aCwgQGhlaWdodCkgLT5cclxuXHRcdEB0eXBlID0gJ1NpemUnXHJcblxyXG5cdHNldDogKHdpZHRoLCBoZWlnaHQpIC0+XHJcblx0XHRAd2lkdGggPSB3aWR0aFxyXG5cdFx0QGhlaWdodCA9IGhlaWdodFxyXG4iLCIjIDJkIHZlY3RvclxyXG5cclxuY2xhc3MgQnUuVmVjdG9yXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHggPSAwLCBAeSA9IDApIC0+XHJcblxyXG5cdHNldDogKEB4LCBAeSkgLT5cclxuIiwiIyBEZWNsYXJhdGl2ZSBmcmFtZXdvcmsgZm9yIEJ1LmpzIGFwcHNcblxuIyMjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0jI1xuQWxsIHN1cHBvcnRlZCBjb25zdHJ1Y3RvciBvcHRpb25zOlxuKFRoZSBhcHBlYXJhbmNlIHNlcXVlbmNlIGlzIHRoZSBwcm9jZXNzIHNlcXVlbmNlLilcbntcbiAgICBjYW52YXM6ICMgc2V0dGluZ3MgdG8gdGhlIGNhbnZhc1xuICAgIFx0Y29udGFpbmVyOiAnI2NvbnRhaW5lcicgIyBjc3Mgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciBkb20gb3IgaXRzZWxmXG4gICAgICAgIGN1cnNvcjogJ2Nyb3NzaGFuZCcgIyB0aGUgZGVmYXVsdCBjdXJzb3Igc3R5bGUgb24gdGhlIDxjYW52YXM+XG4gICAgICAgIGJhY2tncm91bmQ6ICdwaW5rJyAjIHRoZSBkZWZhdWx0IGJhY2tncm91bmQgb2YgdGhlIDxjYW52YXM+XG4gICAgXHRzaG93S2V5UG9pbnRzOiB0cnVlICMgd2hldGhlciB0byBzaG93IHRoZSBrZXkgcG9pbnRzIG9mIHNoYXBlcyAoaWYgdGhleSBoYXZlKS5cbiAgICBkYXRhOiB7IHZhciB9ICMgdmFyaWFibGVzIG9mIHRoaXMgQnUuanMgYXBwLCB3aWxsIGJlIGNvcGllZCB0byB0aGUgYXBwIG9iamVjdFxuICAgIG1ldGhvZHM6IHsgZnVuY3Rpb24gfSMgZnVuY3Rpb25zIG9mIHRoaXMgQnUuanMgYXBwLCB3aWxsIGJlIGNvcGllZCB0byB0aGUgYXBwIG9iamVjdFxuICAgIG9iamVjdHM6IHt9IG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB7fSAjIGFsbCB0aGUgcmVuZGVyYWJsZSBvYmplY3RzXG5cdGhpZXJhcmNoeTogIyBhbiB0cmVlIHRoYXQgcmVwcmVzZW50IHRoZSBvYmplY3QgaGllcmFyY2h5IG9mIHRoZSBzY2VuZSwgdGhlIGtleXMgYXJlIGluIGBvYmplY3RzYFxuICAgIGV2ZW50czogIyBldmVudCBsaXN0ZW5lcnMsICdtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNldXAnIHdpbGwgYXV0b21hdGljYWxseSBiZSBib3VuZCB0byA8Y2FudmFzPlxuICAgIGluaXQ6IGZ1bmN0aW9uICMgY2FsbGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XG4gICAgdXBkYXRlOiBmdW5jdGlvbiAjIGNhbGxlZCBldmVyeSBmcmFtZVxufVxuIyM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSMjI1xuXG5jbGFzcyBCdS5BcHBcblxuXHQkb2JqZWN0czoge31cblxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zID0ge30pIC0+XG5cdFx0Zm9yIGsgaW4gW1wiY2FudmFzXCIsIFwiY2FtZXJhXCIsIFwiZGF0YVwiLCBcIm9iamVjdHNcIiwgXCJoaWVyYXJjaHlcIiwgXCJtZXRob2RzXCIsIFwiZXZlbnRzXCJdXG5cdFx0XHRAb3B0aW9uc1trXSBvcj0ge31cblxuXHRcdGlmIGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJ1xuXHRcdFx0QGluaXQoKVxuXHRcdGVsc2Vcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ0RPTUNvbnRlbnRMb2FkZWQnLCA9PiBAaW5pdCgpXG5cblx0aW5pdDogKCkgLT5cblx0XHQjIGNhbnZhc1xuXHRcdEAkY2FudmFzID0gbmV3IEJ1XG5cdFx0XHRjb250YWluZXI6IEBvcHRpb25zLmNhbnZhcy5jb250YWluZXJcblx0XHRcdHNob3dLZXlQb2ludHM6IEBvcHRpb25zLmNhbnZhcy5zaG93S2V5UG9pbnRzXG5cdFx0XHRiYWNrZ3JvdW5kOiBAb3B0aW9ucy5jYW52YXMuYmFja2dyb3VuZFxuXHRcdEAkY2FudmFzLmRvbS5zdHlsZS5jdXJzb3IgYW5kPSBAb3B0aW9ucy5jYW52YXMuY3Vyc29yXG5cblx0XHQjIGRhdGEgJiBtZXRob2RzXG5cdFx0QFtrXSA9IEBvcHRpb25zLmRhdGFba10gZm9yIGsgb2YgQG9wdGlvbnMuZGF0YVxuXHRcdEBba10gPSBAb3B0aW9ucy5tZXRob2RzW2tdIGZvciBrIG9mIEBvcHRpb25zLm1ldGhvZHNcblxuXHRcdCMgb2JqZWN0c1xuXHRcdGlmIEBvcHRpb25zLm9iamVjdHMgaW5zdGFuY2VvZiBGdW5jdGlvblxuXHRcdFx0QCRvYmplY3RzID0gQG9wdGlvbnMub2JqZWN0cy5hcHBseSB0aGlzXG5cdFx0ZWxzZVxuXHRcdFx0QCRvYmplY3RzW25hbWVdID0gQG9wdGlvbnMub2JqZWN0c1tuYW1lXSBmb3IgbmFtZSBvZiBAb3B0aW9ucy5vYmplY3RzXG5cblx0XHQjIGhpZXJhcmNoeVxuXHRcdCMgVE9ETyB1c2UgYW4gYWxnb3JpdGhtIHRvIGF2b2lkIGNpcmN1bGFyIHN0cnVjdHVyZVxuXHRcdGFzc2VtYmxlT2JqZWN0cyA9IChjaGlsZHJlbiwgcGFyZW50KSA9PlxuXHRcdFx0Zm9yIG93biBuYW1lIG9mIGNoaWxkcmVuXG5cdFx0XHRcdHBhcmVudC5wdXNoIEAkb2JqZWN0c1tuYW1lXVxuXHRcdFx0XHRhc3NlbWJsZU9iamVjdHMgY2hpbGRyZW5bbmFtZV0sIEAkb2JqZWN0c1tuYW1lXS5jaGlsZHJlblxuXHRcdGFzc2VtYmxlT2JqZWN0cyBAb3B0aW9ucy5oaWVyYXJjaHksIEAkY2FudmFzLnNoYXBlc1xuXG5cdFx0IyBpbml0XG5cdFx0QG9wdGlvbnMuaW5pdD8uY2FsbCBAXG5cblx0XHQjIGV2ZW50c1xuXHRcdEBldmVudHMgPSBAb3B0aW9ucy5ldmVudHNcblx0XHRmb3IgdHlwZSBvZiBAZXZlbnRzXG5cdFx0XHRpZiB0eXBlID09ICdtb3VzZWRvd24nXG5cdFx0XHRcdEAkY2FudmFzLmRvbS5hZGRFdmVudExpc3RlbmVyICdtb3VzZWRvd24nLCAoZSkgPT4gQGV2ZW50c1snbW91c2Vkb3duJ10uY2FsbCB0aGlzLCBlXG5cdFx0XHRlbHNlIGlmIHR5cGUgPT0gJ21vdXNlbW92ZSdcblx0XHRcdFx0QCRjYW52YXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsIChlKSA9PiBAZXZlbnRzWydtb3VzZW1vdmUnXS5jYWxsIHRoaXMsIGVcblx0XHRcdGVsc2UgaWYgdHlwZSA9PSAnbW91c2V1cCdcblx0XHRcdFx0QCRjYW52YXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNldXAnLCAoZSkgPT4gQGV2ZW50c1snbW91c2V1cCddLmNhbGwgdGhpcywgZVxuXHRcdCMgVE9ETyBhZGQgc3VwcG9ydHMgZm9yIFwia2V5ZG93bi5DdHJsK0ZcIiwgXCJtb3VzZWRvd24uTGVmdFwiXG5cblx0XHQjIHVwZGF0ZVxuXHRcdGlmIEBvcHRpb25zLnVwZGF0ZT9cblx0XHRcdEAkY2FudmFzLm9uICd1cGRhdGUnLCA9PiBAb3B0aW9ucy51cGRhdGUuYXBwbHkgdGhpcywgYXJndW1lbnRzXG5cblx0dHJpZ2dlcjogKHR5cGUsIGFyZykgLT5cblx0XHRAZXZlbnRzW3R5cGVdPy5jYWxsIEAsIGFyZ1xuIiwiIyBBZGQgY29sb3IgdG8gdGhlIHNoYXBlc1xyXG5cclxuQnUuQ29sb3JmdWwgPSAoKSAtPlxyXG5cdEBzdHJva2VTdHlsZSA9IEJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFXHJcblx0QGZpbGxTdHlsZSA9IEJ1LkRFRkFVTFRfRklMTF9TVFlMRVxyXG5cdEBkYXNoU3R5bGUgPSBmYWxzZVxyXG5cclxuXHRAbGluZVdpZHRoID0gMVxyXG5cdEBkYXNoT2Zmc2V0ID0gMFxyXG5cclxuXHRAc3Ryb2tlID0gKHYpIC0+XHJcblx0XHR2ID0gdHJ1ZSBpZiBub3Qgdj9cclxuXHRcdHN3aXRjaCB2XHJcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBzdHJva2VTdHlsZSA9IEJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFXHJcblx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAc3Ryb2tlU3R5bGUgPSBudWxsXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAc3Ryb2tlU3R5bGUgPSB2XHJcblx0XHRAXHJcblxyXG5cdEBmaWxsID0gKHYpIC0+XHJcblx0XHR2ID0gdHJ1ZSBpZiBub3Qgdj9cclxuXHRcdHN3aXRjaCB2XHJcblx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAZmlsbFN0eWxlID0gbnVsbFxyXG5cdFx0XHR3aGVuIHRydWUgdGhlbiBAZmlsbFN0eWxlID0gQnUuREVGQVVMVF9GSUxMX1NUWUxFXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAZmlsbFN0eWxlID0gdlxyXG5cdFx0QFxyXG5cclxuXHRAZGFzaCA9ICh2KSAtPlxyXG5cdFx0diA9IHRydWUgaWYgbm90IHY/XHJcblx0XHR2ID0gW3YsIHZdIGlmIHR5cGVvZiB2IGlzICdudW1iZXInXHJcblx0XHRzd2l0Y2ggdlxyXG5cdFx0XHR3aGVuIGZhbHNlIHRoZW4gQGRhc2hTdHlsZSA9IG51bGxcclxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gQGRhc2hTdHlsZSA9IEJ1LkRFRkFVTFRfREFTSF9TVFlMRVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGRhc2hTdHlsZSA9IHZcclxuXHRcdEBcclxuIiwiIyBhZGQgZXZlbnQgbGlzdGVuZXIgdG8gY3VzdG9tIG9iamVjdHNcclxuQnUuRXZlbnQgPSAtPlxyXG5cdHR5cGVzID0ge31cclxuXHJcblx0QG9uID0gKHR5cGUsIGxpc3RlbmVyKSAtPlxyXG5cdFx0bGlzdGVuZXJzID0gdHlwZXNbdHlwZV0gb3I9IFtdXHJcblx0XHRsaXN0ZW5lcnMucHVzaCBsaXN0ZW5lciBpZiBsaXN0ZW5lcnMuaW5kZXhPZiBsaXN0ZW5lciA9PSAtMVxyXG5cclxuXHRAb25jZSA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVyLm9uY2UgPSB0cnVlXHJcblx0XHRAb24gdHlwZSwgbGlzdGVuZXJcclxuXHJcblx0QG9mZiA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVycyA9IHR5cGVzW3R5cGVdXHJcblx0XHRpZiBsaXN0ZW5lcj9cclxuXHRcdFx0aWYgbGlzdGVuZXJzP1xyXG5cdFx0XHRcdGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YgbGlzdGVuZXJcclxuXHRcdFx0XHRsaXN0ZW5lcnMuc3BsaWNlIGluZGV4LCAxIGlmIGluZGV4ID4gLTFcclxuXHRcdGVsc2VcclxuXHRcdFx0bGlzdGVuZXJzLmxlbmd0aCA9IDAgaWYgbGlzdGVuZXJzP1xyXG5cclxuXHRAdHJpZ2dlciA9ICh0eXBlLCBldmVudERhdGEpIC0+XHJcblx0XHRsaXN0ZW5lcnMgPSB0eXBlc1t0eXBlXVxyXG5cclxuXHRcdGlmIGxpc3RlbmVycz9cclxuXHRcdFx0ZXZlbnREYXRhIG9yPSB7fVxyXG5cdFx0XHRldmVudERhdGEudGFyZ2V0ID0gQFxyXG5cdFx0XHRmb3IgbGlzdGVuZXIgaW4gbGlzdGVuZXJzXHJcblx0XHRcdFx0bGlzdGVuZXIuY2FsbCB0aGlzLCBldmVudERhdGFcclxuXHRcdFx0XHRpZiBsaXN0ZW5lci5vbmNlXHJcblx0XHRcdFx0XHRsaXN0ZW5lcnMuc3BsaWNlIGksIDFcclxuXHRcdFx0XHRcdGkgLT0gMVxyXG4iLCIjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIE1pY3JvSlF1ZXJ5IC0gQSBtaWNybyB2ZXJzaW9uIG9mIGpRdWVyeVxyXG4jXHJcbiMgU3VwcG9ydGVkIGZlYXR1cmVzOlxyXG4jICAgJC4gLSBzdGF0aWMgbWV0aG9kc1xyXG4jICAgICAucmVhZHkoY2IpIC0gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHBhZ2UgaXMgbG9hZGVkXHJcbiMgICAgIC5hamF4KFt1cmwsXSBvcHRpb25zKSAtIHBlcmZvcm0gYW4gYWpheCByZXF1ZXN0XHJcbiMgICAkKHNlbGVjdG9yKSAtIHNlbGVjdCBlbGVtZW50KHMpXHJcbiMgICAgIC5vbih0eXBlLCBjYWxsYmFjaykgLSBhZGQgYW4gZXZlbnQgbGlzdGVuZXJcclxuIyAgICAgLm9mZih0eXBlLCBjYWxsYmFjaykgLSByZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXJcclxuIyAgICAgLmFwcGVuZCh0YWdOYW1lKSAtIGFwcGVuZCBhIHRhZ1xyXG4jICAgICAudGV4dCh0ZXh0KSAtIHNldCB0aGUgaW5uZXIgdGV4dFxyXG4jICAgICAuaHRtbChodG1sVGV4dCkgLSBzZXQgdGhlIGlubmVyIEhUTUxcclxuIyAgICAgLnN0eWxlKG5hbWUsIHZhbHVlKSAtIHNldCBzdHlsZSAoYSBjc3MgYXR0cmlidXRlKVxyXG4jICAgICAjLmNzcyhvYmplY3QpIC0gc2V0IHN0eWxlcyAobXVsdGlwbGUgY3NzIGF0dHJpYnV0ZSlcclxuIyAgICAgLmhhc0NsYXNzKGNsYXNzTmFtZSkgLSBkZXRlY3Qgd2hldGhlciBhIGNsYXNzIGV4aXN0c1xyXG4jICAgICAuYWRkQ2xhc3MoY2xhc3NOYW1lKSAtIGFkZCBhIGNsYXNzXHJcbiMgICAgIC5yZW1vdmVDbGFzcyhjbGFzc05hbWUpIC0gcmVtb3ZlIGEgY2xhc3NcclxuIyAgICAgLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkgLSB0b2dnbGUgYSBjbGFzc1xyXG4jICAgICAuYXR0cihuYW1lLCB2YWx1ZSkgLSBzZXQgYW4gYXR0cmlidXRlXHJcbiMgICAgIC5oYXNBdHRyKG5hbWUpIC0gZGV0ZWN0IHdoZXRoZXIgYW4gYXR0cmlidXRlIGV4aXN0c1xyXG4jICAgICAucmVtb3ZlQXR0cihuYW1lKSAtIHJlbW92ZSBhbiBhdHRyaWJ1dGVcclxuIyAgIE5vdGVzOlxyXG4jICAgICAgICAjIGlzIHBsYW5uZWQgYnV0IG5vdCBpbXBsZW1lbnRlZFxyXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKChnbG9iYWwpIC0+XHJcblxyXG5cdCMgc2VsZWN0b3JcclxuXHRnbG9iYWwuJCA9IChzZWxlY3RvcikgLT5cclxuXHRcdHNlbGVjdGlvbnMgPSBbXVxyXG5cdFx0aWYgdHlwZW9mIHNlbGVjdG9yID09ICdzdHJpbmcnXHJcblx0XHRcdHNlbGVjdGlvbnMgPSBbXS5zbGljZS5jYWxsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgc2VsZWN0b3JcclxuXHRcdGpRdWVyeS5hcHBseSBzZWxlY3Rpb25zXHJcblx0XHRzZWxlY3Rpb25zXHJcblxyXG5cdGpRdWVyeSA9IC0+XHJcblxyXG5cdFx0IyBldmVudFxyXG5cdFx0QG9uID0gKHR5cGUsIGNhbGxiYWNrKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS5hZGRFdmVudExpc3RlbmVyIHR5cGUsIGNhbGxiYWNrXHJcblx0XHRcdEBcclxuXHJcblx0XHRAb2ZmID0gKHR5cGUsIGNhbGxiYWNrKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS5yZW1vdmVFdmVudExpc3RlbmVyIHR5cGUsIGNhbGxiYWNrXHJcblx0XHRcdEBcclxuXHJcblx0XHQjIERPTSBNYW5pcHVsYXRpb25cclxuXHJcblx0XHRTVkdfVEFHUyA9ICdzdmcgbGluZSByZWN0IGNpcmNsZSBlbGxpcHNlIHBvbHlsaW5lIHBvbHlnb24gcGF0aCB0ZXh0J1xyXG5cclxuXHRcdEBhcHBlbmQgPSAodGFnKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tLCBpKSA9PlxyXG5cdFx0XHRcdHRhZ0luZGV4ID0gU1ZHX1RBR1MuaW5kZXhPZiB0YWcudG9Mb3dlckNhc2UoKVxyXG5cdFx0XHRcdGlmIHRhZ0luZGV4ID4gLTFcclxuXHRcdFx0XHRcdG5ld0RvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0YWdcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRuZXdEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IHRhZ1xyXG5cdFx0XHRcdEBbaV0gPSBkb20uYXBwZW5kQ2hpbGQgbmV3RG9tXHJcblx0XHRcdEBcclxuXHJcblx0XHRAdGV4dCA9IChzdHIpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLnRleHRDb250ZW50ID0gc3RyXHJcblx0XHRcdEBcclxuXHJcblx0XHRAaHRtbCA9IChzdHIpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLmlubmVySFRNTCA9IHN0clxyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHN0eWxlID0gKG5hbWUsIHZhbHVlKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdHN0eWxlVGV4dCA9IGRvbS5nZXRBdHRyaWJ1dGUgJ3N0eWxlJ1xyXG5cdFx0XHRcdHN0eWxlcyA9IHt9XHJcblx0XHRcdFx0aWYgc3R5bGVUZXh0XHJcblx0XHRcdFx0XHRzdHlsZVRleHQuc3BsaXQoJzsnKS5lYWNoIChuKSAtPlxyXG5cdFx0XHRcdFx0XHRudiA9IG4uc3BsaXQgJzonXHJcblx0XHRcdFx0XHRcdHN0eWxlc1tudlswXV0gPSBudlsxXVxyXG5cdFx0XHRcdHN0eWxlc1tuYW1lXSA9IHZhbHVlXHJcblx0XHRcdFx0IyBjb25jYXRcclxuXHRcdFx0XHRzdHlsZVRleHQgPSAnJ1xyXG5cdFx0XHRcdGZvciBpIG9mIHN0eWxlc1xyXG5cdFx0XHRcdFx0c3R5bGVUZXh0ICs9IGkgKyAnOiAnICsgc3R5bGVzW2ldICsgJzsgJ1xyXG5cdFx0XHRcdGRvbS5zZXRBdHRyaWJ1dGUgJ3N0eWxlJywgc3R5bGVUZXh0XHJcblx0XHRcdEBcclxuXHJcblx0XHRAaGFzQ2xhc3MgPSAobmFtZSkgPT5cclxuXHRcdFx0aWYgQGxlbmd0aCA9PSAwXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdCMgaWYgbXVsdGlwbGUsIGV2ZXJ5IERPTSBzaG91bGQgaGF2ZSB0aGUgY2xhc3NcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0d2hpbGUgaSA8IEBsZW5ndGhcclxuXHRcdFx0XHRjbGFzc1RleHQgPSBAW2ldLmdldEF0dHJpYnV0ZSAnY2xhc3MnIG9yICcnXHJcblx0XHRcdFx0IyBub3QgdXNlICcgJyB0byBhdm9pZCBtdWx0aXBsZSBzcGFjZXMgbGlrZSAnYSAgIGInXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmICFjbGFzc2VzLmNvbnRhaW5zIG5hbWVcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRcdGkrK1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QGFkZENsYXNzID0gKG5hbWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0Y2xhc3NUZXh0ID0gZG9tLmdldEF0dHJpYnV0ZSAnY2xhc3MnIG9yICcnXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmIG5vdCBjbGFzc2VzLmNvbnRhaW5zIG5hbWVcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCBuYW1lXHJcblx0XHRcdFx0XHRkb20uc2V0QXR0cmlidXRlICdjbGFzcycsIGNsYXNzZXMuam9pbiAnICdcclxuXHRcdFx0QFxyXG5cclxuXHRcdEByZW1vdmVDbGFzcyA9IChuYW1lKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGNsYXNzVGV4dCA9IGRvbS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgb3IgJydcclxuXHRcdFx0XHRjbGFzc2VzID0gY2xhc3NUZXh0LnNwbGl0IFJlZ0V4cCAnICsnXHJcblx0XHRcdFx0aWYgY2xhc3Nlcy5jb250YWlucyBuYW1lXHJcblx0XHRcdFx0XHRjbGFzc2VzLnJlbW92ZSBuYW1lXHJcblx0XHRcdFx0XHRpZiBjbGFzc2VzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZG9tLnNldEF0dHJpYnV0ZSAnY2xhc3MnLCBjbGFzc2VzLmpvaW4gJyAnXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGRvbS5yZW1vdmVBdHRyaWJ1dGUgJ2NsYXNzJ1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHRvZ2dsZUNsYXNzID0gKG5hbWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0Y2xhc3NUZXh0ID0gZG9tLmdldEF0dHJpYnV0ZSAnY2xhc3MnIG9yICcnXHJcblx0XHRcdFx0Y2xhc3NlcyA9IGNsYXNzVGV4dC5zcGxpdCBSZWdFeHAgJyArJ1xyXG5cdFx0XHRcdGlmIGNsYXNzZXMuY29udGFpbnMgbmFtZVxyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5yZW1vdmUgbmFtZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCBuYW1lXHJcblx0XHRcdFx0aWYgY2xhc3Nlcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRkb20uc2V0QXR0cmlidXRlICdjbGFzcycsIGNsYXNzZXMuam9pbiAnICdcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRkb20ucmVtb3ZlQXR0cmlidXRlICdjbGFzcydcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBhdHRyID0gKG5hbWUsIHZhbHVlKSA9PlxyXG5cdFx0XHRpZiB2YWx1ZT9cclxuXHRcdFx0XHRAZWFjaCAoZG9tKSAtPiBkb20uc2V0QXR0cmlidXRlIG5hbWUsIHZhbHVlXHJcblx0XHRcdFx0cmV0dXJuIEBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBAWzBdLmdldEF0dHJpYnV0ZSBuYW1lXHJcblxyXG5cdFx0QGhhc0F0dHIgPSAobmFtZSkgPT5cclxuXHRcdFx0aWYgQGxlbmd0aCA9PSAwXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdHdoaWxlIGkgPCBAbGVuZ3RoXHJcblx0XHRcdFx0aWYgbm90IEBbaV0uaGFzQXR0cmlidXRlIG5hbWVcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRcdGkrK1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHJlbW92ZUF0dHIgPSAobmFtZSkgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRkb20ucmVtb3ZlQXR0cmlidXRlIG5hbWVcclxuXHRcdFx0QFxyXG5cclxuXHRcdEB2YWwgPSA9PiBAWzBdPy52YWx1ZVxyXG5cclxuXHQjICQucmVhZHkoKVxyXG5cdGdsb2JhbC4kLnJlYWR5ID0gKG9uTG9hZCkgLT5cclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbkxvYWRcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjICQuYWpheCgpXHJcblx0I1x0b3B0aW9uczpcclxuXHQjXHRcdHVybDogc3RyaW5nXHJcblx0I1x0XHQ9PT09XHJcblx0I1x0XHRhc3luYyA9IHRydWU6IGJvb2xcclxuXHQjXHRkYXRhOiBvYmplY3QgLSBxdWVyeSBwYXJhbWV0ZXJzIFRPRE86IGltcGxlbWVudCB0aGlzXHJcblx0I1x0XHRtZXRob2QgPSBHRVQ6IFBPU1QsIFBVVCwgREVMRVRFLCBIRUFEXHJcblx0I1x0XHR1c2VybmFtZTogc3RyaW5nXHJcblx0I1x0XHRwYXNzd29yZDogc3RyaW5nXHJcblx0I1x0XHRzdWNjZXNzOiBmdW5jdGlvblxyXG5cdCNcdFx0ZXJyb3I6IGZ1bmN0aW9uXHJcblx0I1x0XHRjb21wbGV0ZTogZnVuY3Rpb25cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRnbG9iYWwuJC5hamF4ID0gKHVybCwgb3BzKSAtPlxyXG5cdFx0aWYgIW9wc1xyXG5cdFx0XHRpZiB0eXBlb2YgdXJsID09ICdvYmplY3QnXHJcblx0XHRcdFx0b3BzID0gdXJsXHJcblx0XHRcdFx0dXJsID0gb3BzLnVybFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3BzID0ge31cclxuXHRcdG9wcy5tZXRob2Qgb3I9ICdHRVQnXHJcblx0XHRvcHMuYXN5bmMgPSB0cnVlIHVubGVzcyBvcHMuYXN5bmM/XHJcblxyXG5cdFx0eGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0XHJcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gLT5cclxuXHRcdFx0aWYgeGhyLnJlYWR5U3RhdGUgPT0gNFxyXG5cdFx0XHRcdGlmIHhoci5zdGF0dXMgPT0gMjAwXHJcblx0XHRcdFx0XHRvcHMuc3VjY2VzcyB4aHIucmVzcG9uc2VUZXh0LCB4aHIuc3RhdHVzLCB4aHIgaWYgb3BzLnN1Y2Nlc3M/XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3BzLmVycm9yIHhociwgeGhyLnN0YXR1cyBpZiBvcHMuZXJyb3I/XHJcblx0XHRcdFx0XHRvcHMuY29tcGxldGUgeGhyLCB4aHIuc3RhdHVzIGlmIG9wcy5jb21wbGV0ZT9cclxuXHJcblx0XHR4aHIub3BlbiBvcHMubWV0aG9kLCB1cmwsIG9wcy5hc3luYywgb3BzLnVzZXJuYW1lLCBvcHMucGFzc3dvcmRcclxuXHRcdHhoci5zZW5kIG51bGwpIEJ1Lmdsb2JhbFxyXG4iLCIjIGhpZXJhcmNoeSBtYW5hZ2VcclxuXHJcbmNsYXNzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxyXG5cdFx0QnUuQ29sb3JmdWwuYXBwbHkgQFxyXG5cdFx0QnUuRXZlbnQuYXBwbHkgQFxyXG5cclxuXHRcdEB2aXNpYmxlID0geWVzXHJcblx0XHRAb3BhY2l0eSA9IDFcclxuXHJcblx0XHRAcG9zaXRpb24gPSBuZXcgQnUuVmVjdG9yXHJcblx0XHRAcm90YXRpb24gPSAwXHJcblx0XHRAX3NjYWxlID0gbmV3IEJ1LlZlY3RvciAxLCAxXHJcblx0XHRAc2tldyA9IG5ldyBCdS5WZWN0b3JcclxuXHJcblx0XHQjQHRvV29ybGRNYXRyaXggPSBuZXcgQnUuTWF0cml4KClcclxuXHRcdCNAdXBkYXRlTWF0cml4IC0+XHJcblxyXG5cdFx0QGJvdW5kcyA9IG51bGwgIyBmb3IgYWNjZWxlcmF0ZSBjb250YWluIHRlc3RcclxuXHRcdEBrZXlQb2ludHMgPSBudWxsXHJcblx0XHRAY2hpbGRyZW4gPSBbXVxyXG5cdFx0QHBhcmVudCA9IG51bGxcclxuXHJcblx0QHByb3BlcnR5ICdzY2FsZScsXHJcblx0XHRnZXQ6IC0+IEBfc2NhbGVcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0aWYgdHlwZW9mIHZhbCA9PSAnbnVtYmVyJ1xyXG5cdFx0XHRcdEBfc2NhbGUueCA9IEBfc2NhbGUueSA9IHZhbFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QF9zY2FsZSA9IHZhbFxyXG5cclxuXHRhbmltYXRlOiAoYW5pbSwgYXJncykgLT5cclxuXHRcdGlmIHR5cGVvZiBhbmltID09ICdzdHJpbmcnXHJcblx0XHRcdGlmIGFuaW0gb2YgQnUuYW5pbWF0aW9uc1xyXG5cdFx0XHRcdEJ1LmFuaW1hdGlvbnNbYW5pbV0uYXBwbHkgQCwgYXJnc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiQnUuYW5pbWF0aW9uc1tcXFwiI3sgYW5pbSB9XFxcIl0gZG9lc24ndCBleGlzdHMuXCJcclxuXHRcdGVsc2UgaWYgYW5pbSBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRcdGFyZ3MgPSBbYXJnc10gdW5sZXNzIGFyZ3MgaW5zdGFuY2VvZiBBcnJheVxyXG5cdFx0XHRAYW5pbWF0ZSBhbmltW2ldLCBhcmdzIGZvciBvd24gaSBvZiBhbmltXHJcblx0XHRlbHNlXHJcblx0XHRcdGFuaW0uYXBwbHkgQCwgYXJnc1xyXG5cdFx0QFxyXG5cclxuXHRjb250YWluc1BvaW50OiAocCkgLT5cclxuXHRcdGlmIEBib3VuZHM/IGFuZCBub3QgQGJvdW5kcy5jb250YWluc1BvaW50IHBcclxuXHRcdFx0cmV0dXJuIG5vXHJcblx0XHRlbHNlIGlmIEBfY29udGFpbnNQb2ludFxyXG5cdFx0XHRyZXR1cm4gQF9jb250YWluc1BvaW50IHBcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG5vXHJcbiIsIiMgY2FudmFzIHJlbmRlcmVyXHJcblxyXG5jbGFzcyBCdS5SZW5kZXJlclxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cclxuXHRcdEJ1LkV2ZW50LmFwcGx5IEBcclxuXHRcdEB0eXBlID0gJ1JlbmRlcmVyJ1xyXG5cclxuXHRcdG9wdGlvbnMgPSBCdS5jb21iaW5lT3B0aW9ucyBhcmd1bWVudHMsXHJcblx0XHRcdGNvbnRhaW5lcjogJ2JvZHknXHJcblx0XHRcdGZwczogNjBcclxuXHRcdFx0c2hvd0tleVBvaW50czogbm9cclxuXHRcdFx0YmFja2dyb3VuZDogJyNlZWUnXHJcblx0XHRAW2tdID0gb3B0aW9uc1trXSBmb3IgayBpbiBbJ2NvbnRhaW5lcicsICd3aWR0aCcsICdoZWlnaHQnLCAnZnBzJywgJ3Nob3dLZXlQb2ludHMnLCAnd2lkdGgnLCAnaGVpZ2h0J11cclxuXHRcdEBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIEBjb250YWluZXIgaWYgdHlwZW9mIEBjb250YWluZXIgaXMgJ3N0cmluZydcclxuXHRcdEBmaWxsUGFyZW50ID0gdHlwZW9mIEB3aWR0aCAhPSAnbnVtYmVyJ1xyXG5cclxuXHRcdEB0aWNrQ291bnQgPSAwXHJcblx0XHRAaXNSdW5uaW5nID0gbm9cclxuXHRcdEBwaXhlbFJhdGlvID0gQnUuZ2xvYmFsLmRldmljZVBpeGVsUmF0aW8gb3IgMVxyXG5cdFx0QGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcclxuXHRcdEBjb250ZXh0ID0gQGRvbS5nZXRDb250ZXh0ICcyZCdcclxuXHRcdEBjb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnXHJcblx0XHRAY2xpcE1ldGVyID0gbmV3IENsaXBNZXRlcigpIGlmIENsaXBNZXRlcj9cclxuXHJcblx0XHQjIEFQSVxyXG5cdFx0QHNoYXBlcyA9IFtdXHJcblxyXG5cdFx0aWYgbm90IEBmaWxsUGFyZW50XHJcblx0XHRcdEBkb20uc3R5bGUud2lkdGggPSBAd2lkdGggKyAncHgnXHJcblx0XHRcdEBkb20uc3R5bGUuaGVpZ2h0ID0gQGhlaWdodCArICdweCdcclxuXHRcdFx0QGRvbS53aWR0aCA9IEB3aWR0aCAqIEBwaXhlbFJhdGlvXHJcblx0XHRcdEBkb20uaGVpZ2h0ID0gQGhlaWdodCAqIEBwaXhlbFJhdGlvXHJcblx0XHRAZG9tLnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yIG9yICdkZWZhdWx0J1xyXG5cdFx0QGRvbS5zdHlsZS5ib3hTaXppbmcgPSAnY29udGVudC1ib3gnXHJcblx0XHRAZG9tLnN0eWxlLmJhY2tncm91bmQgPSBvcHRpb25zLmJhY2tncm91bmRcclxuXHRcdEBkb20ub25jb250ZXh0bWVudSA9IC0+IGZhbHNlXHJcblxyXG5cdFx0b25SZXNpemUgPSA9PlxyXG5cdFx0XHRjYW52YXNSYXRpbyA9IEBkb20uaGVpZ2h0IC8gQGRvbS53aWR0aFxyXG5cdFx0XHRjb250YWluZXJSYXRpbyA9IEBjb250YWluZXIuY2xpZW50SGVpZ2h0IC8gQGNvbnRhaW5lci5jbGllbnRXaWR0aFxyXG5cdFx0XHRpZiBjb250YWluZXJSYXRpbyA8IGNhbnZhc1JhdGlvXHJcblx0XHRcdFx0aGVpZ2h0ID0gQGNvbnRhaW5lci5jbGllbnRIZWlnaHRcclxuXHRcdFx0XHR3aWR0aCA9IGhlaWdodCAvIGNvbnRhaW5lclJhdGlvXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR3aWR0aCA9IEBjb250YWluZXIuY2xpZW50V2lkdGhcclxuXHRcdFx0XHRoZWlnaHQgPSB3aWR0aCAqIGNvbnRhaW5lclJhdGlvXHJcblx0XHRcdEB3aWR0aCA9IEBkb20ud2lkdGggPSB3aWR0aCAqIEBwaXhlbFJhdGlvXHJcblx0XHRcdEBoZWlnaHQgPSBAZG9tLmhlaWdodCA9IGhlaWdodCAqIEBwaXhlbFJhdGlvXHJcblx0XHRcdEBkb20uc3R5bGUud2lkdGggPSB3aWR0aCArICdweCdcclxuXHRcdFx0QGRvbS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnXHJcblx0XHRcdEByZW5kZXIoKVxyXG5cclxuXHRcdGlmIEBmaWxsUGFyZW50XHJcblx0XHRcdEB3aWR0aCA9IEBjb250YWluZXIuY2xpZW50V2lkdGhcclxuXHRcdFx0QGhlaWdodCA9IEBjb250YWluZXIuY2xpZW50SGVpZ2h0XHJcblx0XHRcdEJ1Lmdsb2JhbC53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgb25SZXNpemVcclxuXHRcdFx0QGRvbS5hZGRFdmVudExpc3RlbmVyICdET01Ob2RlSW5zZXJ0ZWQnLCBvblJlc2l6ZVxyXG5cclxuXHJcblx0XHR0aWNrID0gPT5cclxuXHRcdFx0aWYgQGlzUnVubmluZ1xyXG5cdFx0XHRcdEBjbGlwTWV0ZXIuc3RhcnQoKSBpZiBAY2xpcE1ldGVyP1xyXG5cdFx0XHRcdEByZW5kZXIoKVxyXG5cdFx0XHRcdEB0cmlnZ2VyICd1cGRhdGUnLCB7J3RpY2tDb3VudCc6IEB0aWNrQ291bnR9XHJcblx0XHRcdFx0QHRpY2tDb3VudCArPSAxXHJcblx0XHRcdFx0QGNsaXBNZXRlci50aWNrKCkgaWYgQGNsaXBNZXRlcj9cclxuXHJcblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSB0aWNrXHJcblxyXG5cdFx0dGljaygpXHJcblxyXG5cdFx0IyBpbml0XHJcblx0XHRzZXRUaW1lb3V0ID0+XHJcblx0XHRcdEBjb250YWluZXIuYXBwZW5kQ2hpbGQgQGRvbVxyXG5cdFx0LCAxMDBcclxuXHJcblx0XHRCdS5hbmltYXRpb25SdW5uZXI/Lmhvb2tVcCBAXHJcblxyXG5cdFx0QGlzUnVubmluZyA9IHRydWVcclxuXHJcblxyXG5cdHBhdXNlOiAtPlxyXG5cdFx0QGlzUnVubmluZyA9IGZhbHNlXHJcblxyXG5cdGNvbnRpbnVlOiAtPlxyXG5cdFx0QGlzUnVubmluZyA9IHRydWVcclxuXHJcblx0dG9nZ2xlOiAtPlxyXG5cdFx0QGlzUnVubmluZyA9IG5vdCBAaXNSdW5uaW5nXHJcblxyXG5cdCNcdHByb2Nlc3NBcmdzOiAoZSkgLT5cclxuXHQjXHRcdG9mZnNldFg6IGUub2Zmc2V0WCAqIEBwaXhlbFJhdGlvXHJcblx0I1x0XHRvZmZzZXRZOiBlLm9mZnNldFkgKiBAcGl4ZWxSYXRpb1xyXG5cdCNcdFx0YnV0dG9uOiBlLmJ1dHRvblxyXG5cclxuXHRhZGQ6IChzaGFwZSkgLT5cclxuXHRcdGlmIHNoYXBlIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0QHNoYXBlcy5wdXNoIHMgZm9yIHMgaW4gc2hhcGVcclxuXHRcdGVsc2VcclxuXHRcdFx0QHNoYXBlcy5wdXNoIHNoYXBlXHJcblx0XHRAXHJcblxyXG5cdHJlbW92ZTogKHNoYXBlKSAtPlxyXG5cdFx0aW5kZXggPSBAc2hhcGVzLmluZGV4T2Ygc2hhcGVcclxuXHRcdEBzaGFwZXMuc3BsaWNlIGluZGV4LCAxIGlmIGluZGV4ID4gLTFcclxuXHRcdEBcclxuXHJcblx0cmVuZGVyOiAtPlxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC5zY2FsZSBAcGl4ZWxSYXRpbywgQHBpeGVsUmF0aW9cclxuXHRcdEBjbGVhckNhbnZhcygpXHJcblx0XHRAZHJhd1NoYXBlcyBAc2hhcGVzXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHRcdEBcclxuXHJcblx0Y2xlYXJDYW52YXM6IC0+XHJcblx0XHRAY29udGV4dC5jbGVhclJlY3QgMCwgMCwgQHdpZHRoLCBAaGVpZ2h0XHJcblx0XHRAXHJcblxyXG5cdGRyYXdTaGFwZXM6IChzaGFwZXMpID0+XHJcblx0XHRpZiBzaGFwZXM/XHJcblx0XHRcdGZvciBzaGFwZSBpbiBzaGFwZXNcclxuXHRcdFx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdFx0XHRAZHJhd1NoYXBlIHNoYXBlXHJcblx0XHRcdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblx0XHRAXHJcblxyXG5cdGRyYXdTaGFwZTogKHNoYXBlKSA9PlxyXG5cdFx0cmV0dXJuIEAgdW5sZXNzIHNoYXBlLnZpc2libGVcclxuXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUgc2hhcGUucG9zaXRpb24ueCwgc2hhcGUucG9zaXRpb24ueVxyXG5cdFx0QGNvbnRleHQucm90YXRlIHNoYXBlLnJvdGF0aW9uXHJcbiNcdFx0Y29uc29sZS5sb2cgc2hhcGVcclxuXHRcdHN4ID0gc2hhcGUuc2NhbGUueFxyXG5cdFx0c3kgPSBzaGFwZS5zY2FsZS55XHJcblx0XHRpZiBzeCAvIHN5ID4gMTAwIG9yIHN4IC8gc3kgPCAwLjAxXHJcblx0XHRcdHN4ID0gMCBpZiBNYXRoLmFicyhzeCkgPCAwLjAyXHJcblx0XHRcdHN5ID0gMCBpZiBNYXRoLmFicyhzeSkgPCAwLjAyXHJcblx0XHRAY29udGV4dC5zY2FsZSBzeCwgc3lcclxuXHJcblx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSAqPSBzaGFwZS5vcGFjaXR5XHJcblx0XHRpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzaGFwZS5zdHJva2VTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5saW5lV2lkdGggPSBzaGFwZS5saW5lV2lkdGhcclxuXHRcdFx0QGNvbnRleHQubGluZUNhcCA9IHNoYXBlLmxpbmVDYXAgaWYgc2hhcGUubGluZUNhcD9cclxuXHRcdFx0QGNvbnRleHQubGluZUpvaW4gPSBzaGFwZS5saW5lSm9pbiBpZiBzaGFwZS5saW5lSm9pbj9cclxuXHJcblx0XHRAY29udGV4dC5iZWdpblBhdGgoKVxyXG5cclxuXHRcdHN3aXRjaCBzaGFwZS50eXBlXHJcblx0XHRcdHdoZW4gJ1BvaW50JyB0aGVuIEBkcmF3UG9pbnQgc2hhcGVcclxuXHRcdFx0d2hlbiAnTGluZScgdGhlbiBAZHJhd0xpbmUgc2hhcGVcclxuXHRcdFx0d2hlbiAnQ2lyY2xlJyB0aGVuIEBkcmF3Q2lyY2xlIHNoYXBlXHJcblx0XHRcdHdoZW4gJ1RyaWFuZ2xlJyB0aGVuIEBkcmF3VHJpYW5nbGUgc2hhcGVcclxuXHRcdFx0d2hlbiAnUmVjdGFuZ2xlJyB0aGVuIEBkcmF3UmVjdGFuZ2xlIHNoYXBlXHJcblx0XHRcdHdoZW4gJ0ZhbicgdGhlbiBAZHJhd0ZhbiBzaGFwZVxyXG5cdFx0XHR3aGVuICdCb3cnIHRoZW4gQGRyYXdCb3cgc2hhcGVcclxuXHRcdFx0d2hlbiAnUG9seWdvbicgdGhlbiBAZHJhd1BvbHlnb24gc2hhcGVcclxuXHRcdFx0d2hlbiAnUG9seWxpbmUnIHRoZW4gQGRyYXdQb2x5bGluZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdTcGxpbmUnIHRoZW4gQGRyYXdTcGxpbmUgc2hhcGVcclxuXHRcdFx0d2hlbiAnUG9pbnRUZXh0JyB0aGVuIEBkcmF3UG9pbnRUZXh0IHNoYXBlXHJcblx0XHRcdHdoZW4gJ0ltYWdlJyB0aGVuIEBkcmF3SW1hZ2Ugc2hhcGVcclxuXHRcdFx0d2hlbiAnQm91bmRzJyB0aGVuIEBkcmF3Qm91bmRzIHNoYXBlXHJcblx0XHRcdHdoZW4gJ0dyb3VwJyAjIHRoZW4gZG8gbm90aGluZ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2RyYXdTaGFwZXMoKTogdW5rbm93biBzaGFwZTogJywgc2hhcGVcclxuXHJcblxyXG5cdFx0aWYgc2hhcGUuZmlsbFN0eWxlP1xyXG5cdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSBzaGFwZS5maWxsU3R5bGVcclxuXHRcdFx0QGNvbnRleHQuZmlsbCgpXHJcblxyXG5cdFx0aWYgc2hhcGUuZGFzaFN0eWxlIyBhbmQgKHNoYXBlLnR5cGUgPT0gJ1NwbGluZScgb3Igc2hhcGUudHlwZSA9PSAnUmVjdGFuZ2xlJyBhbmQgc2hhcGUuY29ybmVyUmFkaXVzID4gMClcclxuXHRcdFx0QGNvbnRleHQubGluZURhc2hPZmZzZXQgPSBzaGFwZS5kYXNoT2Zmc2V0XHJcblx0XHRcdEBjb250ZXh0LnNldExpbmVEYXNoPyBzaGFwZS5kYXNoU3R5bGVcclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHRcdFx0QGNvbnRleHQuc2V0TGluZURhc2ggW11cclxuXHRcdGVsc2UgaWYgc2hhcGUuc3Ryb2tlU3R5bGU/XHJcblx0XHRcdEBjb250ZXh0LnN0cm9rZSgpXHJcblxyXG5cdFx0QGRyYXdTaGFwZXMgc2hhcGUuY2hpbGRyZW4gaWYgc2hhcGUuY2hpbGRyZW4/XHJcblx0XHRAZHJhd1NoYXBlcyBzaGFwZS5rZXlQb2ludHMgaWYgQHNob3dLZXlQb2ludHNcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdQb2ludDogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuYXJjIHNoYXBlLngsIHNoYXBlLnksIEJ1LlBPSU5UX1JFTkRFUl9TSVpFLCAwLCBNYXRoLlBJICogMlxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0xpbmU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0Lm1vdmVUbyBzaGFwZS5wb2ludHNbMF0ueCwgc2hhcGUucG9pbnRzWzBdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMV0ueCwgc2hhcGUucG9pbnRzWzFdLnlcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdDaXJjbGU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmFyYyBzaGFwZS5jeCwgc2hhcGUuY3ksIHNoYXBlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDJcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdUcmlhbmdsZTogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnBvaW50c1swXS54LCBzaGFwZS5wb2ludHNbMF0ueVxyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnBvaW50c1sxXS54LCBzaGFwZS5wb2ludHNbMV0ueVxyXG5cdFx0QGNvbnRleHQubGluZVRvIHNoYXBlLnBvaW50c1syXS54LCBzaGFwZS5wb2ludHNbMl0ueVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdSZWN0YW5nbGU6IChzaGFwZSkgLT5cclxuXHRcdHJldHVybiBAZHJhd1JvdW5kUmVjdGFuZ2xlIHNoYXBlIGlmIHNoYXBlLmNvcm5lclJhZGl1cyAhPSAwXHJcblx0XHRAY29udGV4dC5yZWN0IHNoYXBlLnBvaW50TFQueCwgc2hhcGUucG9pbnRMVC55LCBzaGFwZS5zaXplLndpZHRoLCBzaGFwZS5zaXplLmhlaWdodFxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1JvdW5kUmVjdGFuZ2xlOiAoc2hhcGUpIC0+XHJcblx0XHR4MSA9IHNoYXBlLnBvaW50TFQueFxyXG5cdFx0eDIgPSBzaGFwZS5wb2ludFJCLnhcclxuXHRcdHkxID0gc2hhcGUucG9pbnRMVC55XHJcblx0XHR5MiA9IHNoYXBlLnBvaW50UkIueVxyXG5cdFx0ciA9IHNoYXBlLmNvcm5lclJhZGl1c1xyXG5cclxuXHRcdEBjb250ZXh0Lm1vdmVUbyB4MSwgeTEgKyByXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MSwgeTEsIHgxICsgciwgeTEsIHJcclxuXHRcdEBjb250ZXh0LmxpbmVUbyB4MiAtIHIsIHkxXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MiwgeTEsIHgyLCB5MSArIHIsIHJcclxuXHRcdEBjb250ZXh0LmxpbmVUbyB4MiwgeTIgLSByXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MiwgeTIsIHgyIC0gciwgeTIsIHJcclxuXHRcdEBjb250ZXh0LmxpbmVUbyB4MSArIHIsIHkyXHJcblx0XHRAY29udGV4dC5hcmNUbyB4MSwgeTIsIHgxLCB5MiAtIHIsIHJcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblxyXG5cdFx0QGNvbnRleHQuc2V0TGluZURhc2g/IHNoYXBlLmRhc2hTdHlsZSBpZiBzaGFwZS5zdHJva2VTdHlsZT8gYW5kIHNoYXBlLmRhc2hTdHlsZVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0ZhbjogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuYXJjIHNoYXBlLmN4LCBzaGFwZS5jeSwgc2hhcGUucmFkaXVzLCBzaGFwZS5hRnJvbSwgc2hhcGUuYVRvXHJcblx0XHRAY29udGV4dC5saW5lVG8gc2hhcGUuY3gsIHNoYXBlLmN5XHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0JvdzogKHNoYXBlKSAtPlxyXG5cdFx0QGNvbnRleHQuYXJjIHNoYXBlLmN4LCBzaGFwZS5jeSwgc2hhcGUucmFkaXVzLCBzaGFwZS5hRnJvbSwgc2hhcGUuYVRvXHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1BvbHlnb246IChzaGFwZSkgLT5cclxuXHRcdGZvciBwb2ludCBpbiBzaGFwZS52ZXJ0aWNlc1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8gcG9pbnQueCwgcG9pbnQueVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdQb2x5bGluZTogKHNoYXBlKSAtPlxyXG5cdFx0Zm9yIHBvaW50IGluIHNoYXBlLnZlcnRpY2VzXHJcblx0XHRcdEBjb250ZXh0LmxpbmVUbyBwb2ludC54LCBwb2ludC55XHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3U3BsaW5lOiAoc2hhcGUpIC0+XHJcblx0XHRpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0bGVuID0gc2hhcGUudmVydGljZXMubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA9PSAyXHJcblx0XHRcdFx0QGNvbnRleHQubW92ZVRvIHNoYXBlLnZlcnRpY2VzWzBdLngsIHNoYXBlLnZlcnRpY2VzWzBdLnlcclxuXHRcdFx0XHRAY29udGV4dC5saW5lVG8gc2hhcGUudmVydGljZXNbMV0ueCwgc2hhcGUudmVydGljZXNbMV0ueVxyXG5cdFx0XHRlbHNlIGlmIGxlbiA+IDJcclxuXHRcdFx0XHRAY29udGV4dC5tb3ZlVG8gc2hhcGUudmVydGljZXNbMF0ueCwgc2hhcGUudmVydGljZXNbMF0ueVxyXG5cdFx0XHRcdGZvciBpIGluIFsxLi5sZW4gLSAxXVxyXG5cdFx0XHRcdFx0QGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0XHRcdFx0XHRzaGFwZS5jb250cm9sUG9pbnRzQmVoaW5kW2kgLSAxXS54XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUuY29udHJvbFBvaW50c0JlaGluZFtpIC0gMV0ueVxyXG5cdFx0XHRcdFx0XHRcdHNoYXBlLmNvbnRyb2xQb2ludHNBaGVhZFtpXS54XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUuY29udHJvbFBvaW50c0FoZWFkW2ldLnlcclxuXHRcdFx0XHRcdFx0XHRzaGFwZS52ZXJ0aWNlc1tpXS54XHJcblx0XHRcdFx0XHRcdFx0c2hhcGUudmVydGljZXNbaV0ueVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1BvaW50VGV4dDogKHNoYXBlKSAtPlxyXG5cdFx0aWYgdHlwZW9mIHNoYXBlLmZvbnQgPT0gJ3N0cmluZydcclxuXHRcdFx0QGNvbnRleHQudGV4dEFsaWduID0gc2hhcGUudGV4dEFsaWduXHJcblx0XHRcdEBjb250ZXh0LnRleHRCYXNlbGluZSA9IHNoYXBlLnRleHRCYXNlbGluZVxyXG5cdFx0XHRAY29udGV4dC5mb250ID0gc2hhcGUuZm9udFxyXG5cclxuXHRcdFx0aWYgc2hhcGUuc3Ryb2tlU3R5bGU/XHJcblx0XHRcdFx0QGNvbnRleHQuc3Ryb2tlVGV4dCBzaGFwZS50ZXh0LCBzaGFwZS54LCBzaGFwZS55XHJcblx0XHRcdGlmIHNoYXBlLmZpbGxTdHlsZT9cclxuXHRcdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSBzaGFwZS5maWxsU3R5bGVcclxuXHRcdFx0XHRAY29udGV4dC5maWxsVGV4dCBzaGFwZS50ZXh0LCBzaGFwZS54LCBzaGFwZS55XHJcblx0XHRlbHNlIGlmIHNoYXBlLmZvbnQgaW5zdGFuY2VvZiBCdS5TcHJpdGVTaGVldCBhbmQgc2hhcGUuZm9udC5yZWFkeVxyXG5cdFx0XHR0ZXh0V2lkdGggPSBzaGFwZS5mb250Lm1lYXN1cmVUZXh0V2lkdGggc2hhcGUudGV4dFxyXG5cdFx0XHR4T2Zmc2V0ID0gc3dpdGNoIHNoYXBlLnRleHRBbGlnblxyXG5cdFx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gMFxyXG5cdFx0XHRcdHdoZW4gJ2NlbnRlcicgdGhlbiAtdGV4dFdpZHRoIC8gMlxyXG5cdFx0XHRcdHdoZW4gJ3JpZ2h0JyB0aGVuIC10ZXh0V2lkdGhcclxuXHRcdFx0eU9mZnNldCA9IHN3aXRjaCBzaGFwZS50ZXh0QmFzZWxpbmVcclxuXHRcdFx0XHR3aGVuICd0b3AnIHRoZW4gMFxyXG5cdFx0XHRcdHdoZW4gJ21pZGRsZScgdGhlbiAtc2hhcGUuZm9udC5oZWlnaHQgLyAyXHJcblx0XHRcdFx0d2hlbiAnYm90dG9tJyB0aGVuIC1zaGFwZS5mb250LmhlaWdodFxyXG5cdFx0XHRmb3IgaSBpbiBbMC4uLnNoYXBlLnRleHQubGVuZ3RoXVxyXG5cdFx0XHRcdGNoYXIgPSBzaGFwZS50ZXh0W2ldXHJcblx0XHRcdFx0Y2hhckJpdG1hcCA9IHNoYXBlLmZvbnQuZ2V0RnJhbWVJbWFnZSBjaGFyXHJcblx0XHRcdFx0aWYgY2hhckJpdG1hcD9cclxuXHRcdFx0XHRcdEBjb250ZXh0LmRyYXdJbWFnZSBjaGFyQml0bWFwLCBzaGFwZS54ICsgeE9mZnNldCwgc2hhcGUueSArIHlPZmZzZXRcclxuXHRcdFx0XHRcdHhPZmZzZXQgKz0gY2hhckJpdG1hcC53aWR0aFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHhPZmZzZXQgKz0gMTBcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdJbWFnZTogKHNoYXBlKSAtPlxyXG5cdFx0aWYgc2hhcGUubG9hZGVkXHJcblx0XHRcdHcgPSBzaGFwZS5zaXplLndpZHRoXHJcblx0XHRcdGggPSBzaGFwZS5zaXplLmhlaWdodFxyXG5cdFx0XHRkeCA9IC13ICogc2hhcGUucGl2b3QueFxyXG5cdFx0XHRkeSA9IC1oICogc2hhcGUucGl2b3QueVxyXG5cdFx0XHRAY29udGV4dC5kcmF3SW1hZ2Ugc2hhcGUuaW1hZ2UsIGR4LCBkeSwgdywgaFxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0JvdW5kczogKGJvdW5kcykgLT5cclxuXHRcdEBjb250ZXh0LnJlY3QgYm91bmRzLngxLCBib3VuZHMueTEsIGJvdW5kcy54MiAtIGJvdW5kcy54MSwgYm91bmRzLnkyIC0gYm91bmRzLnkxXHJcblx0XHRAXHJcbiIsIiMgQm93IHNoYXBlXHJcblxyXG5jbGFzcyBCdS5Cb3cgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG8pIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdCb3cnXHJcblxyXG5cdFx0W0BhRnJvbSwgQGFUb10gPSBbQGFUbywgQGFGcm9tXSBpZiBAYUZyb20gPiBAYVRvXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZyA9IG5ldyBCdS5MaW5lIEBjZW50ZXIuYXJjVG8oQHJhZGl1cywgQGFGcm9tKSxcclxuXHRcdFx0XHRAY2VudGVyLmFyY1RvKEByYWRpdXMsIEBhVG8pXHJcblx0XHRAa2V5UG9pbnRzID0gQHN0cmluZy5wb2ludHNcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Cb3cgQGN4LCBAY3ksIEByYWRpdXMsIEBhRnJvbSwgQGFUb1xyXG4iLCIjIENpcmNsZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuQ2lyY2xlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChAX3JhZGl1cyA9IDEsIGN4ID0gMCwgY3kgPSAwKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnQ2lyY2xlJ1xyXG5cclxuXHRcdEBfY2VudGVyID0gbmV3IEJ1LlBvaW50KGN4LCBjeSlcclxuXHRcdEBib3VuZHMgPSBudWxsICMgZm9yIGFjY2VsZXJhdGUgY29udGFpbiB0ZXN0XHJcblxyXG5cdFx0QGtleVBvaW50cyA9IFtAX2NlbnRlcl1cclxuXHJcblx0Y2xvbmU6ICgpIC0+IG5ldyBCdS5DaXJjbGUgQHJhZGl1cywgQGN4LCBAY3lcclxuXHJcblx0IyBwcm9wZXJ0eVxyXG5cclxuXHRAcHJvcGVydHkgJ2N4JyxcclxuXHRcdGdldDogLT4gQF9jZW50ZXIueFxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2NlbnRlci54ID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdjZW50ZXJDaGFuZ2VkJywgQFxyXG5cclxuXHRAcHJvcGVydHkgJ2N5JyxcclxuXHRcdGdldDogLT4gQF9jZW50ZXIueVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2NlbnRlci55ID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdjZW50ZXJDaGFuZ2VkJywgQFxyXG5cclxuXHRAcHJvcGVydHkgJ2NlbnRlcicsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfY2VudGVyID0gdmFsXHJcblx0XHRcdEBjeCA9IHZhbC54XHJcblx0XHRcdEBjeSA9IHZhbC55XHJcblx0XHRcdEBrZXlQb2ludHNbMF0gPSB2YWxcclxuXHRcdFx0QHRyaWdnZXIgJ2NlbnRlckNoYW5nZWQnLCBAXHJcblxyXG5cdEBwcm9wZXJ0eSAncmFkaXVzJyxcclxuXHRcdGdldDogLT4gQF9yYWRpdXNcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9yYWRpdXMgPSB2YWxcclxuXHRcdFx0QHRyaWdnZXIgJ3JhZGl1c0NoYW5nZWQnLCBAXHJcblx0XHRcdEBcclxuIiwiIyBGYW4gc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkZhbiBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQGN4LCBAY3ksIEByYWRpdXMsIEBhRnJvbSwgQGFUbykgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ0ZhbidcclxuXHJcblx0XHRAY2VudGVyID0gbmV3IEJ1LlBvaW50IEBjeCwgQGN5XHJcblx0XHRAc3RyaW5nID0gbmV3IEJ1LkxpbmUoXHJcblx0XHRcdFx0QGNlbnRlci5hcmNUbyBAcmFkaXVzLCBAYUZyb21cclxuXHRcdFx0XHRAY2VudGVyLmFyY1RvIEByYWRpdXMsIEBhVG9cclxuXHRcdClcclxuXHRcdEBrZXlQb2ludHMgPSBbXHJcblx0XHRcdEBzdHJpbmcucG9pbnRzWzBdXHJcblx0XHRcdEBzdHJpbmcucG9pbnRzWzFdXHJcblx0XHRcdG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0XVxyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LkZhbiBAY3gsIEBjeSwgQHJhZGl1cywgQGFGcm9tLCBAYVRvXHJcbiIsIiMgbGluZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuTGluZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAocDEsIHAyLCBwMywgcDQpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdMaW5lJ1xyXG5cclxuXHRcdGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXHJcblx0XHRcdEBwb2ludHMgPSBbbmV3IEJ1LlBvaW50KCksIG5ldyBCdS5Qb2ludCgpXVxyXG5cdFx0ZWxzZSBpZiBhcmd1bWVudHMubGVuZ3RoIDwgNFxyXG5cdFx0XHRAcG9pbnRzID0gW3AxLmNsb25lKCksIHAyLmNsb25lKCldXHJcblx0XHRlbHNlICAjIGxlbiA+PSA0XHJcblx0XHRcdEBwb2ludHMgPSBbbmV3IEJ1LlBvaW50KHAxLCBwMiksIG5ldyBCdS5Qb2ludChwMywgcDQpXVxyXG5cclxuXHRcdEBsZW5ndGggPSAwXHJcblx0XHRAbWlkcG9pbnQgPSBuZXcgQnUuUG9pbnQoKVxyXG5cdFx0QGtleVBvaW50cyA9IEBwb2ludHNcclxuXHJcblx0XHRAb24gXCJwb2ludENoYW5nZVwiLCA9PlxyXG5cdFx0XHRAbGVuZ3RoID0gQHBvaW50c1swXS5kaXN0YW5jZVRvKEBwb2ludHNbMV0pXHJcblx0XHRcdEBtaWRwb2ludC5zZXQoKEBwb2ludHNbMF0ueCArIEBwb2ludHNbMV0ueCkgLyAyLCAoQHBvaW50c1swXS55ICsgQHBvaW50c1sxXS55KSAvIDIpXHJcblxyXG5cdFx0QHRyaWdnZXIgXCJwb2ludENoYW5nZVwiLCBAXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuTGluZSBAcG9pbnRzWzBdLCBAcG9pbnRzWzFdXHJcblxyXG5cdCMgZWRpdFxyXG5cclxuXHRzZXQ6IChhMSwgYTIsIGEzLCBhNCkgLT5cclxuXHRcdGlmIHA0P1xyXG5cdFx0XHRAcG9pbnRzWzBdLnNldCBhMSwgYTJcclxuXHRcdFx0QHBvaW50c1sxXS5zZXQgYTMsIGE0XHJcblx0XHRlbHNlXHJcblx0XHRcdEBwb2ludHNbMF0gPSBhMVxyXG5cdFx0XHRAcG9pbnRzWzFdID0gYTJcclxuXHRcdEB0cmlnZ2VyIFwicG9pbnRDaGFuZ2VcIiwgQFxyXG5cdFx0QFxyXG5cclxuXHRzZXRQb2ludDE6IChhMSwgYTIpIC0+XHJcblx0XHRpZiBhMj9cclxuXHRcdFx0QHBvaW50c1swXS5zZXQgYTEsIGEyXHJcblx0XHRlbHNlXHJcblx0XHRcdEBwb2ludHNbMF0uY29weSBhMVxyXG5cdFx0QHRyaWdnZXIgXCJwb2ludENoYW5nZVwiLCBAXHJcblx0XHRAXHJcblxyXG5cdHNldFBvaW50MjogKGExLCBhMikgLT5cclxuXHRcdGlmIGEyP1xyXG5cdFx0XHRAcG9pbnRzWzFdLnNldCBhMSwgYTJcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBvaW50c1sxXS5jb3B5IGExXHJcblx0XHRAdHJpZ2dlciBcInBvaW50Q2hhbmdlXCIsIEBcclxuXHRcdEBcclxuIiwiIyBwb2ludCBzaGFwZVxyXG5cclxuY2xhc3MgQnUuUG9pbnQgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB4ID0gMCwgQHkgPSAwKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnUG9pbnQnXHJcblxyXG5cdFx0QGxpbmVXaWR0aCA9IDAuNVxyXG5cdFx0QF9sYWJlbEluZGV4ID0gLTFcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Qb2ludCBAeCwgQHlcclxuXHJcblx0QHByb3BlcnR5ICdsYWJlbCcsXHJcblx0XHRnZXQ6IC0+IGlmIEBfbGFiZWxJbmRleCA+IC0xIHRoZW4gQGNoaWxkcmVuW0BfbGFiZWxJbmRleF0udGV4dCBlbHNlICcnXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdGlmIEBfbGFiZWxJbmRleCA9PSAtMVxyXG5cdFx0XHRcdHBvaW50VGV4dCA9IG5ldyBCdS5Qb2ludFRleHQgdmFsLCBAeCArIEJ1LlBPSU5UX0xBQkVMX09GRlNFVCwgQHksIHthbGlnbjogJyswJ31cclxuXHRcdFx0XHRAY2hpbGRyZW4ucHVzaCBwb2ludFRleHRcclxuXHRcdFx0XHRAX2xhYmVsSW5kZXggPSBAY2hpbGRyZW4ubGVuZ3RoIC0gMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGNoaWxkcmVuW0BfbGFiZWxJbmRleF0udGV4dCA9IHZhbFxyXG5cclxuXHRhcmNUbzogKHJhZGl1cywgYXJjKSAtPlxyXG5cdFx0cmV0dXJuIG5ldyBCdS5Qb2ludCBAeCArIE1hdGguY29zKGFyYykgKiByYWRpdXMsIEB5ICsgTWF0aC5zaW4oYXJjKSAqIHJhZGl1c1xyXG5cclxuXHJcblx0IyBjb3B5IHZhbHVlIGZyb20gb3RoZXIgbGluZVxyXG5cdGNvcHk6IChwb2ludCkgLT5cclxuXHRcdEB4ID0gcG9pbnQueFxyXG5cdFx0QHkgPSBwb2ludC55XHJcblx0XHRAdXBkYXRlTGFiZWwoKVxyXG5cclxuXHQjIHNldCB2YWx1ZSBmcm9tIHgsIHlcclxuXHRzZXQ6ICh4LCB5KSAtPlxyXG5cdFx0QHggPSB4XHJcblx0XHRAeSA9IHlcclxuXHRcdEB1cGRhdGVMYWJlbCgpXHJcblxyXG5cdHVwZGF0ZUxhYmVsOiAtPlxyXG5cdFx0aWYgQF9sYWJlbEluZGV4ID4gLTFcclxuXHRcdFx0QGNoaWxkcmVuW0BfbGFiZWxJbmRleF0ueCA9IEB4ICsgQnUuUE9JTlRfTEFCRUxfT0ZGU0VUXHJcblx0XHRcdEBjaGlsZHJlbltAX2xhYmVsSW5kZXhdLnkgPSBAeVxyXG4iLCIjIHBvbHlnb24gc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlBvbHlnb24gZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHQjIyNcclxuICAgIGNvbnN0cnVjdG9yc1xyXG4gICAgMS4gUG9seWdvbihwb2ludHMpXHJcbiAgICAyLiBQb2x5Z29uKHgsIHksIHJhZGl1cywgbiwgb3B0aW9ucyk6IHRvIGdlbmVyYXRlIHJlZ3VsYXIgcG9seWdvblxyXG4gICAgXHRvcHRpb25zOiBhbmdsZSAtIHN0YXJ0IGFuZ2xlIG9mIHJlZ3VsYXIgcG9seWdvblxyXG5cdCMjI1xyXG5cdGNvbnN0cnVjdG9yOiAocG9pbnRzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnUG9seWdvbidcclxuXHJcblx0XHRAdmVydGljZXMgPSBbXVxyXG5cdFx0QGxpbmVzID0gW11cclxuXHRcdEB0cmlhbmdsZXMgPSBbXVxyXG5cclxuXHRcdG9wdGlvbnMgPSBCdS5jb21iaW5lT3B0aW9ucyBhcmd1bWVudHMsXHJcblx0XHRcdGFuZ2xlOiAwXHJcblxyXG5cdFx0aWYgcG9pbnRzIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0QHZlcnRpY2VzID0gcG9pbnRzIGlmIHBvaW50cz9cclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgYXJndW1lbnRzLmxlbmd0aCA8IDRcclxuXHRcdFx0XHR4ID0gMFxyXG5cdFx0XHRcdHkgPSAwXHJcblx0XHRcdFx0cmFkaXVzID0gYXJndW1lbnRzWzBdXHJcblx0XHRcdFx0biA9IGFyZ3VtZW50c1sxXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0eCA9IGFyZ3VtZW50c1swXVxyXG5cdFx0XHRcdHkgPSBhcmd1bWVudHNbMV1cclxuXHRcdFx0XHRyYWRpdXMgPSBhcmd1bWVudHNbMl1cclxuXHRcdFx0XHRuID0gYXJndW1lbnRzWzNdXHJcblx0XHRcdEB2ZXJ0aWNlcyA9IEJ1LlBvbHlnb24uZ2VuZXJhdGVSZWd1bGFyUG9pbnRzIHgsIHksIHJhZGl1cywgbiwgb3B0aW9uc1xyXG5cclxuXHRcdCMgaW5pdCBsaW5lc1xyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0Zm9yIGkgaW4gWzAgLi4uIEB2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tpXSwgQHZlcnRpY2VzW2kgKyAxXSkpXHJcblx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMV0sIEB2ZXJ0aWNlc1swXSkpXHJcblxyXG5cdFx0IyBpbml0IHRyaWFuZ2xlc1xyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDJcclxuXHRcdFx0Zm9yIGkgaW4gWzEgLi4uIEB2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdEB0cmlhbmdsZXMucHVzaChuZXcgQnUuVHJpYW5nbGUoQHZlcnRpY2VzWzBdLCBAdmVydGljZXNbaV0sIEB2ZXJ0aWNlc1tpICsgMV0pKVxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBAdmVydGljZXNcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Qb2x5Z29uIEB2ZXJ0aWNlc1xyXG5cclxuXHQjIGRldGVjdFxyXG5cclxuXHRpc1NpbXBsZTogKCkgLT5cclxuXHRcdGxlbiA9IEBsaW5lcy5sZW5ndGhcclxuXHRcdGZvciBpIGluIFswLi4ubGVuXVxyXG5cdFx0XHRmb3IgaiBpbiBbaSArIDEuLi5sZW5dXHJcblx0XHRcdFx0aWYgQGxpbmVzW2ldLmlzQ3Jvc3NXaXRoTGluZShAbGluZXNbal0pXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdCMgZWRpdFxyXG5cclxuXHRhZGRQb2ludDogKHBvaW50LCBpbnNlcnRJbmRleCkgLT5cclxuXHRcdGlmIG5vdCBpbnNlcnRJbmRleD9cclxuXHRcdFx0IyBhZGQgcG9pbnRcclxuXHRcdFx0QHZlcnRpY2VzLnB1c2ggcG9pbnRcclxuXHJcblx0XHRcdCMgYWRkIGxpbmVcclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAbGluZXNbQGxpbmVzLmxlbmd0aCAtIDFdLnBvaW50c1sxXSA9IHBvaW50XHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0QGxpbmVzLnB1c2gobmV3IEJ1LkxpbmUoQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXSwgQHZlcnRpY2VzWzBdKSlcclxuXHJcblx0XHRcdCMgYWRkIHRyaWFuZ2xlXHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAyXHJcblx0XHRcdFx0QHRyaWFuZ2xlcy5wdXNoKG5ldyBCdS5UcmlhbmdsZShcclxuXHRcdFx0XHRcdFx0QHZlcnRpY2VzWzBdXHJcblx0XHRcdFx0XHRcdEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMl1cclxuXHRcdFx0XHRcdFx0QHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdCkpXHJcblx0XHRlbHNlXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHBvaW50KVxyXG5cdCMgVE9ETyBhZGQgbGluZXMgYW5kIHRyaWFuZ2xlc1xyXG5cclxuXHRAZ2VuZXJhdGVSZWd1bGFyUG9pbnRzID0gKGN4LCBjeSwgcmFkaXVzLCBuLCBvcHRpb25zKSAtPlxyXG5cdFx0YW5nbGVEZWx0YSA9IG9wdGlvbnMuYW5nbGVcclxuXHRcdHIgPSByYWRpdXNcclxuXHRcdHBvaW50cyA9IFtdXHJcblx0XHRhbmdsZVNlY3Rpb24gPSBNYXRoLlBJICogMiAvIG5cclxuXHRcdGZvciBpIGluIFswIC4uLiBuXVxyXG5cdFx0XHRhID0gaSAqIGFuZ2xlU2VjdGlvbiArIGFuZ2xlRGVsdGFcclxuXHRcdFx0eCA9IGN4ICsgciAqIE1hdGguY29zKGEpXHJcblx0XHRcdHkgPSBjeSArIHIgKiBNYXRoLnNpbihhKVxyXG5cdFx0XHRwb2ludHNbaV0gPSBuZXcgQnUuUG9pbnQgeCwgeVxyXG5cdFx0cmV0dXJuIHBvaW50c1xyXG4iLCIjIHBvbHlsaW5lIHNoYXBlXHJcblxyXG5jbGFzcyBCdS5Qb2x5bGluZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHZlcnRpY2VzID0gW10pIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdQb2x5bGluZSdcclxuXHJcblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoID4gMVxyXG5cdFx0XHR2ZXJ0aWNlcyA9IFtdXHJcblx0XHRcdGZvciBpIGluIFswIC4uLiBhcmd1bWVudHMubGVuZ3RoIC8gMl1cclxuXHRcdFx0XHR2ZXJ0aWNlcy5wdXNoIG5ldyBCdS5Qb2ludCBhcmd1bWVudHNbaSAqIDJdLCBhcmd1bWVudHNbaSAqIDIgKyAxXVxyXG5cdFx0XHRAdmVydGljZXMgPSB2ZXJ0aWNlc1xyXG5cclxuXHRcdEBsaW5lcyA9IFtdXHJcblx0XHRAa2V5UG9pbnRzID0gQHZlcnRpY2VzXHJcblxyXG5cdFx0QGZpbGwgb2ZmXHJcblxyXG5cdFx0QG9uIFwicG9pbnRDaGFuZ2VcIiwgPT5cclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAdXBkYXRlTGluZXMoKVxyXG5cdFx0XHRcdEBjYWxjTGVuZ3RoPygpXHJcblx0XHRcdFx0QGNhbGNQb2ludE5vcm1hbGl6ZWRQb3M/KClcclxuXHRcdEB0cmlnZ2VyIFwicG9pbnRDaGFuZ2VcIiwgQFxyXG5cclxuXHRjbG9uZTogLT5cclxuXHRcdHBvbHlsaW5lID0gbmV3IEJ1LlBvbHlsaW5lIEB2ZXJ0aWNlc1xyXG5cdFx0cG9seWxpbmUuc3Ryb2tlU3R5bGUgPSBAc3Ryb2tlU3R5bGVcclxuXHRcdHBvbHlsaW5lLmZpbGxTdHlsZSA9IEBmaWxsU3R5bGVcclxuXHRcdHBvbHlsaW5lLmRhc2hTdHlsZSA9IEBkYXNoU3R5bGVcclxuXHRcdHBvbHlsaW5lLmxpbmVXaWR0aCA9IEBsaW5lV2lkdGhcclxuXHRcdHBvbHlsaW5lLmRhc2hPZmZzZXQgPSBAZGFzaE9mZnNldFxyXG5cdFx0cG9seWxpbmVcclxuXHJcblx0dXBkYXRlTGluZXM6IC0+XHJcblx0XHRmb3IgaSBpbiBbMCAuLi4gQHZlcnRpY2VzLmxlbmd0aCAtIDFdXHJcblx0XHRcdGlmIEBsaW5lc1tpXT9cclxuXHRcdFx0XHRAbGluZXNbaV0uc2V0IEB2ZXJ0aWNlc1tpXSwgQHZlcnRpY2VzW2kgKyAxXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGxpbmVzW2ldID0gbmV3IEJ1LkxpbmUgQHZlcnRpY2VzW2ldLCBAdmVydGljZXNbaSArIDFdXHJcblx0XHQjIFRPRE8gcmVtb3ZlIHRoZSByZXN0XHJcblx0XHRAXHJcblxyXG5cdCMgZWRpdFxyXG5cclxuXHRzZXQgPSAocG9pbnRzKSAtPlxyXG5cdFx0IyBwb2ludHNcclxuXHRcdGZvciBpIGluIFswIC4uLiBAdmVydGljZXMubGVuZ3RoXVxyXG5cdFx0XHRAdmVydGljZXNbaV0uY29weSBwb2ludHNbaV1cclxuXHJcblx0XHQjIHJlbW92ZSB0aGUgZXh0cmEgcG9pbnRzXHJcblx0XHRpZiBAdmVydGljZXMubGVuZ3RoID4gcG9pbnRzLmxlbmd0aFxyXG5cdFx0XHRAdmVydGljZXMuc3BsaWNlIHBvaW50cy5sZW5ndGhcclxuXHJcblx0XHRAdHJpZ2dlciBcInBvaW50Q2hhbmdlXCIsIEBcclxuXHRcdEBcclxuXHJcblx0YWRkUG9pbnQ6IChwb2ludCwgaW5zZXJ0SW5kZXgpIC0+XHJcblx0XHRpZiBub3QgaW5zZXJ0SW5kZXg/XHJcblx0XHRcdCMgYWRkIHBvaW50XHJcblx0XHRcdEB2ZXJ0aWNlcy5wdXNoIHBvaW50XHJcblx0XHRcdCMgYWRkIGxpbmVcclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAbGluZXMucHVzaCBuZXcgQnUuTGluZSBAdmVydGljZXNbQHZlcnRpY2VzLmxlbmd0aCAtIDJdLCBAdmVydGljZXNbQHZlcnRpY2VzLmxlbmd0aCAtIDFdXHJcblx0XHRlbHNlXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UgaW5zZXJ0SW5kZXgsIDAsIHBvaW50XHJcblx0XHQjIFRPRE8gYWRkIGxpbmVzXHJcblx0XHRAdHJpZ2dlciBcInBvaW50Q2hhbmdlXCIsIEBcclxuXHRcdEBcclxuIiwiIyByZWN0YW5nbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlJlY3RhbmdsZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ1JlY3RhbmdsZSdcclxuXHJcblx0XHRAY2VudGVyID0gbmV3IEJ1LlBvaW50KHggKyB3aWR0aCAvIDIsIHkgKyBoZWlnaHQgLyAyKVxyXG5cdFx0QHNpemUgPSBuZXcgQnUuU2l6ZSh3aWR0aCwgaGVpZ2h0KVxyXG5cclxuXHRcdEBwb2ludExUID0gbmV3IEJ1LlBvaW50KHgsIHkpXHJcblx0XHRAcG9pbnRSVCA9IG5ldyBCdS5Qb2ludCh4ICsgd2lkdGgsIHkpXHJcblx0XHRAcG9pbnRSQiA9IG5ldyBCdS5Qb2ludCh4ICsgd2lkdGgsIHkgKyBoZWlnaHQpXHJcblx0XHRAcG9pbnRMQiA9IG5ldyBCdS5Qb2ludCh4LCB5ICsgaGVpZ2h0KVxyXG5cclxuXHRcdEBwb2ludHMgPSBbQHBvaW50TFQsIEBwb2ludFJULCBAcG9pbnRSQiwgQHBvaW50TEJdXHJcblxyXG5cdFx0QGNvcm5lclJhZGl1cyA9IGNvcm5lclJhZGl1c1xyXG5cclxuXHRAcHJvcGVydHkgJ2Nvcm5lclJhZGl1cycsXHJcblx0XHRnZXQ6IC0+IEBfY29ybmVyUmFkaXVzXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfY29ybmVyUmFkaXVzID0gdmFsXHJcblx0XHRcdEBrZXlQb2ludHMgPSBpZiB2YWwgPiAwIHRoZW4gW10gZWxzZSBAcG9pbnRzXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuUmVjdGFuZ2xlIEBwb2ludExULngsIEBwb2ludExULnksIEBzaXplLndpZHRoLCBAc2l6ZS5oZWlnaHRcclxuIiwiIyBzcGxpbmUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlNwbGluZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAodmVydGljZXMpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdTcGxpbmUnXHJcblxyXG5cdFx0aWYgdmVydGljZXMgaW5zdGFuY2VvZiBCdS5Qb2x5bGluZVxyXG5cdFx0XHRwb2x5bGluZSA9IHZlcnRpY2VzXHJcblx0XHRcdEB2ZXJ0aWNlcyA9IHBvbHlsaW5lLnZlcnRpY2VzXHJcblx0XHRcdHBvbHlsaW5lLm9uICdwb2ludENoYW5nZScsIChwb2x5bGluZSkgPT5cclxuXHRcdFx0XHRAdmVydGljZXMgPSBwb2x5bGluZS52ZXJ0aWNlc1xyXG5cdFx0XHRcdGNhbGNDb250cm9sUG9pbnRzIEBcclxuXHRcdGVsc2VcclxuXHRcdFx0QHZlcnRpY2VzID0gQnUuY2xvbmUgdmVydGljZXNcclxuXHJcblx0XHRAa2V5UG9pbnRzID0gQHZlcnRpY2VzXHJcblx0XHRAY29udHJvbFBvaW50c0FoZWFkID0gW11cclxuXHRcdEBjb250cm9sUG9pbnRzQmVoaW5kID0gW11cclxuXHJcblx0XHRAZmlsbCBvZmZcclxuXHRcdEBzbW9vdGhGYWN0b3IgPSBCdS5ERUZBVUxUX1NQTElORV9TTU9PVEhcclxuXHRcdEBfc21vb3RoZXIgPSBub1xyXG5cclxuXHRcdGNhbGNDb250cm9sUG9pbnRzIEBcclxuXHJcblx0QHByb3BlcnR5ICdzbW9vdGhlcicsXHJcblx0XHRnZXQ6IC0+IEBfc21vb3RoZXJcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0b2xkVmFsID0gQF9zbW9vdGhlclxyXG5cdFx0XHRAX3Ntb290aGVyID0gdmFsXHJcblx0XHRcdGNhbGNDb250cm9sUG9pbnRzIEAgaWYgb2xkVmFsICE9IEBfc21vb3RoZXJcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5TcGxpbmUgQHZlcnRpY2VzXHJcblxyXG5cdGFkZFBvaW50OiAocG9pbnQpIC0+XHJcblx0XHRAdmVydGljZXMucHVzaCBwb2ludFxyXG5cdFx0Y2FsY0NvbnRyb2xQb2ludHMgQFxyXG5cclxuXHRjYWxjQ29udHJvbFBvaW50cyA9IChzcGxpbmUpIC0+XHJcblx0XHRzcGxpbmUua2V5UG9pbnRzID0gc3BsaW5lLnZlcnRpY2VzXHJcblxyXG5cdFx0cCA9IHNwbGluZS52ZXJ0aWNlc1xyXG5cdFx0bGVuID0gcC5sZW5ndGhcclxuXHRcdGlmIGxlbiA+PSAxXHJcblx0XHRcdHNwbGluZS5jb250cm9sUG9pbnRzQmVoaW5kWzBdID0gcFswXVxyXG5cdFx0aWYgbGVuID49IDJcclxuXHRcdFx0c3BsaW5lLmNvbnRyb2xQb2ludHNBaGVhZFtsZW4gLSAxXSA9IHBbbGVuIC0gMV1cclxuXHRcdGlmIGxlbiA+PSAzXHJcblx0XHRcdGZvciBpIGluIFsxLi4ubGVuIC0gMV1cclxuXHRcdFx0XHR0aGV0YTEgPSBNYXRoLmF0YW4yIHBbaV0ueSAtIHBbaSAtIDFdLnksIHBbaV0ueCAtIHBbaSAtIDFdLnhcclxuXHRcdFx0XHR0aGV0YTIgPSBNYXRoLmF0YW4yIHBbaSArIDFdLnkgLSBwW2ldLnksIHBbaSArIDFdLnggLSBwW2ldLnhcclxuXHRcdFx0XHRsZW4xID0gQnUuYmV2ZWwgcFtpXS55IC0gcFtpIC0gMV0ueSwgcFtpXS54IC0gcFtpIC0gMV0ueFxyXG5cdFx0XHRcdGxlbjIgPSBCdS5iZXZlbCBwW2ldLnkgLSBwW2kgKyAxXS55LCBwW2ldLnggLSBwW2kgKyAxXS54XHJcblx0XHRcdFx0dGhldGEgPSB0aGV0YTEgKyAodGhldGEyIC0gdGhldGExKSAqIGlmIHNwbGluZS5fc21vb3RoZXIgdGhlbiBsZW4xIC8gKGxlbjEgKyBsZW4yKSBlbHNlIDAuNVxyXG5cdFx0XHRcdHRoZXRhICs9IE1hdGguUEkgaWYgTWF0aC5hYnModGhldGEgLSB0aGV0YTEpID4gTWF0aC5QSSAvIDJcclxuXHRcdFx0XHR4QSA9IHBbaV0ueCAtIGxlbjEgKiBzcGxpbmUuc21vb3RoRmFjdG9yICogTWF0aC5jb3ModGhldGEpXHJcblx0XHRcdFx0eUEgPSBwW2ldLnkgLSBsZW4xICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguc2luKHRoZXRhKVxyXG5cdFx0XHRcdHhCID0gcFtpXS54ICsgbGVuMiAqIHNwbGluZS5zbW9vdGhGYWN0b3IgKiBNYXRoLmNvcyh0aGV0YSlcclxuXHRcdFx0XHR5QiA9IHBbaV0ueSArIGxlbjIgKiBzcGxpbmUuc21vb3RoRmFjdG9yICogTWF0aC5zaW4odGhldGEpXHJcblx0XHRcdFx0c3BsaW5lLmNvbnRyb2xQb2ludHNBaGVhZFtpXSA9IG5ldyBCdS5Qb2ludCB4QSwgeUFcclxuXHRcdFx0XHRzcGxpbmUuY29udHJvbFBvaW50c0JlaGluZFtpXSA9IG5ldyBCdS5Qb2ludCB4QiwgeUJcclxuXHJcblx0XHRcdFx0IyBhZGQgY29udHJvbCBsaW5lcyBmb3IgZGVidWdnaW5nXHJcblx0XHRcdFx0I3NwbGluZS5jaGlsZHJlbltpICogMiAtIDJdID0gbmV3IEJ1LkxpbmUgc3BsaW5lLnZlcnRpY2VzW2ldLCBzcGxpbmUuY29udHJvbFBvaW50c0FoZWFkW2ldXHJcblx0XHRcdFx0I3NwbGluZS5jaGlsZHJlbltpICogMiAtIDFdID0gIG5ldyBCdS5MaW5lIHNwbGluZS52ZXJ0aWNlc1tpXSwgc3BsaW5lLmNvbnRyb2xQb2ludHNCZWhpbmRbaV1cclxuIiwiIyB0cmlhbmdsZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuVHJpYW5nbGUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHAxLCBwMiwgcDMpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdUcmlhbmdsZSdcclxuXHJcblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoID09IDZcclxuXHRcdFx0W3gxLCB5MSwgeDIsIHkyLCB4MywgeTNdID0gYXJndW1lbnRzXHJcblx0XHRcdHAxID0gbmV3IEJ1LlBvaW50IHgxLCB5MVxyXG5cdFx0XHRwMiA9IG5ldyBCdS5Qb2ludCB4MiwgeTJcclxuXHRcdFx0cDMgPSBuZXcgQnUuUG9pbnQgeDMsIHkzXHJcblxyXG5cdFx0QGxpbmVzID0gW1xyXG5cdFx0XHRuZXcgQnUuTGluZShwMSwgcDIpXHJcblx0XHRcdG5ldyBCdS5MaW5lKHAyLCBwMylcclxuXHRcdFx0bmV3IEJ1LkxpbmUocDMsIHAxKVxyXG5cdFx0XVxyXG5cdFx0I0BjZW50ZXIgPSBuZXcgQnUuUG9pbnQgQnUuYXZlcmFnZShwMS54LCBwMi54LCBwMy54KSwgQnUuYXZlcmFnZShwMS55LCBwMi55LCBwMy55KVxyXG5cdFx0QHBvaW50cyA9IFtwMSwgcDIsIHAzXVxyXG5cdFx0QGtleVBvaW50cyA9IEBwb2ludHNcclxuXHJcblx0Y2xvbmU6ID0+IG5ldyBCdS5UcmlhbmdsZSBAcG9pbnRzWzBdLCBAcG9pbnRzWzFdLCBAcG9pbnRzWzJdXHJcbiIsIiMgR3JvdXBcclxuXHJcbmNsYXNzIEJ1Lkdyb3VwIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdHcm91cCciLCIjIGRyYXcgYml0bWFwXHJcblxyXG5jbGFzcyBCdS5JbWFnZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHVybCwgeCA9IDAsIHkgPSAwLCB3aWR0aCwgaGVpZ2h0KSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnSW1hZ2UnXHJcblxyXG5cdFx0QGF1dG9TaXplID0geWVzXHJcblx0XHRAc2l6ZSA9IG5ldyBCdS5TaXplXHJcblx0XHRAcG9zaXRpb24gPSBuZXcgQnUuVmVjdG9yIHgsIHlcclxuXHRcdEBjZW50ZXIgPSBuZXcgQnUuVmVjdG9yIHggKyB3aWR0aCAvIDIsIHkgKyBoZWlnaHQgLyAyXHJcblx0XHRpZiB3aWR0aD9cclxuXHRcdFx0QHNpemUuc2V0IHdpZHRoLCBoZWlnaHRcclxuXHRcdFx0QGF1dG9TaXplID0gbm9cclxuXHJcblx0XHRAcGl2b3QgPSBuZXcgQnUuVmVjdG9yIDAuNSwgMC41XHJcblxyXG5cdFx0QGltYWdlID0gbmV3IEJ1Lmdsb2JhbC5JbWFnZVxyXG5cdFx0QGxvYWRlZCA9IGZhbHNlXHJcblxyXG5cdFx0QGltYWdlLm9ubG9hZCA9IChlKSA9PlxyXG5cdFx0XHRpZiBAYXV0b1NpemVcclxuXHRcdFx0XHRAc2l6ZS5zZXQgQGltYWdlLndpZHRoLCBAaW1hZ2UuaGVpZ2h0XHJcblx0XHRcdEBsb2FkZWQgPSB0cnVlXHJcblxyXG5cdFx0QGltYWdlLnNyYyA9IEB1cmxcclxuIiwiIyBkcmF3IHRleHQgYnkgYSBwb2ludFxyXG5cclxuY2xhc3MgQnUuUG9pbnRUZXh0IGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0IyMjXHJcblx0b3B0aW9ucy5hbGlnbjpcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0fCAgIC0tICAgIDAtICAgICstICAgfFxyXG5cdHwgICAgICAgICB84oaZMDAgICAgICB8XHJcblx0fCAgIC0wICAtLSstPiAgICswICAgfFxyXG5cdHwgICAgICAgICDihpMgICAgICAgICAgfFxyXG5cdHwgICAtKyAgICAwKyAgICArKyAgIHxcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Zm9yIGV4YW1wbGU6IHRleHQgaXMgaW4gdGhlIHJpZ2h0IHRvcCBvZiB0aGUgcG9pbnQsIHRoZW4gYWxpZ24gPSBcIistXCJcclxuXHQjIyNcclxuXHRjb25zdHJ1Y3RvcjogKEB0ZXh0LCBAeCA9IDAsIEB5ID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ1BvaW50VGV4dCdcclxuXHRcdEBzdHJva2VTdHlsZSA9IG51bGwgIyBubyBzdHJva2UgYnkgZGVmYXVsdFxyXG5cdFx0QGZpbGxTdHlsZSA9IEJ1LkRFRkFVTFRfVEVYVF9GSUxMX1NUWUxFXHJcblxyXG5cdFx0b3B0aW9ucyA9IEJ1LmNvbWJpbmVPcHRpb25zIGFyZ3VtZW50cyxcclxuXHRcdFx0YWxpZ246ICcwMCdcclxuXHRcdFx0Zm9udEZhbWlseTogJ1ZlcmRhbmEnXHJcblx0XHRcdGZvbnRTaXplOiAxMVxyXG5cdFx0QGFsaWduID0gb3B0aW9ucy5hbGlnblxyXG5cdFx0QF9mb250RmFtaWx5ID0gb3B0aW9ucy5mb250RmFtaWx5XHJcblx0XHRAX2ZvbnRTaXplID0gb3B0aW9ucy5mb250U2l6ZVxyXG5cdFx0QGZvbnQgPSBcIiN7IEBfZm9udFNpemUgfXB4ICN7IEBfZm9udEZhbWlseSB9XCIgb3Igb3B0aW9ucy5mb250XHJcblxyXG5cdEBwcm9wZXJ0eSAnYWxpZ24nLFxyXG5cdFx0Z2V0OiAtPiBAX2FsaWduXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfYWxpZ24gPSB2YWxcclxuXHRcdFx0QHNldENvbnRleHRBbGlnbiBAX2FsaWduXHJcblxyXG5cdEBwcm9wZXJ0eSAnZm9udEZhbWlseScsXHJcblx0XHRnZXQ6IC0+IEBfZm9udEZhbWlseVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2ZvbnRGYW1pbHkgPSB2YWxcclxuXHRcdFx0QGZvbnQgPSBcIiN7IEBfZm9udFNpemUgfXB4ICN7IEBfZm9udEZhbWlseSB9XCJcclxuXHJcblx0QHByb3BlcnR5ICdmb250U2l6ZScsXHJcblx0XHRnZXQ6IC0+IEBfZm9udFNpemVcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9mb250U2l6ZSA9IHZhbFxyXG5cdFx0XHRAZm9udCA9IFwiI3sgQF9mb250U2l6ZSB9cHggI3sgQF9mb250RmFtaWx5IH1cIlxyXG5cclxuXHRzZXRDb250ZXh0QWxpZ246IChhbGlnbikgPT5cclxuXHRcdGlmIGFsaWduLmxlbmd0aCA9PSAxXHJcblx0XHRcdGFsaWduID0gJycgKyBhbGlnbiArIGFsaWduXHJcblx0XHRhbGlnblggPSBhbGlnbi5zdWJzdHJpbmcoMCwgMSlcclxuXHRcdGFsaWduWSA9IGFsaWduLnN1YnN0cmluZygxLCAyKVxyXG5cdFx0QHRleHRBbGlnbiA9IHN3aXRjaCBhbGlnblhcclxuXHRcdFx0d2hlbiAnLScgdGhlbiAncmlnaHQnXHJcblx0XHRcdHdoZW4gJzAnIHRoZW4gJ2NlbnRlcidcclxuXHRcdFx0d2hlbiAnKycgdGhlbiAnbGVmdCdcclxuXHRcdEB0ZXh0QmFzZWxpbmUgPSBzd2l0Y2ggYWxpZ25ZXHJcblx0XHRcdHdoZW4gJy0nIHRoZW4gJ2JvdHRvbSdcclxuXHRcdFx0d2hlbiAnMCcgdGhlbiAnbWlkZGxlJ1xyXG5cdFx0XHR3aGVuICcrJyB0aGVuICd0b3AnXHJcbiIsIiMgYW5pbWF0aW9uIGNsYXNzIGFuZCBwcmVzZXQgYW5pbWF0aW9uc1xyXG5cclxuY2xhc3MgQnUuQW5pbWF0aW9uXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cclxuXHRcdEBmcm9tID0gb3B0aW9ucy5mcm9tXHJcblx0XHRAdG8gPSBvcHRpb25zLnRvXHJcblx0XHRAZGF0YSA9IG9wdGlvbnMuZGF0YSBvciB7fVxyXG5cdFx0QGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiBvciAwLjVcclxuXHRcdEBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyBvciBmYWxzZVxyXG5cdFx0QHJlcGVhdCA9ICEhb3B0aW9ucy5yZXBlYXRcclxuXHRcdEBpbml0ID0gb3B0aW9ucy5pbml0XHJcblx0XHRAdXBkYXRlID0gb3B0aW9ucy51cGRhdGVcclxuXHRcdEBmaW5pc2ggPSBvcHRpb25zLmZpbmlzaFxyXG5cclxuXHRhcHBseTogKHRhcmdldCwgYXJncykgLT5cclxuXHRcdEJ1LmFuaW1hdGlvblJ1bm5lci5hZGQgQCwgdGFyZ2V0LCBhcmdzXHJcblxyXG4jIFByZXNldCBBbmltYXRpb25zXHJcbiMgU29tZSBvZiB0aGUgYW5pbWF0aW9ucyBhcmUgY29uc2lzdGVudCB3aXRoIGpRdWVyeSBVSVxyXG5CdS5hbmltYXRpb25zID1cclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFNpbXBsZVxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGZhZGVJbjogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0dXBkYXRlOiAodCkgLT5cclxuXHRcdFx0QG9wYWNpdHkgPSB0XHJcblxyXG5cdGZhZGVPdXQ6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdHVwZGF0ZTogKHQpIC0+XHJcblx0XHRcdEBvcGFjaXR5ID0gMSAtIHRcclxuXHJcblx0c3BpbjogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0dXBkYXRlOiAodCkgLT5cclxuXHRcdFx0QHJvdGF0aW9uID0gdCAqIE1hdGguUEkgKiAyXHJcblxyXG5cdHNwaW5JbjogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0sIGFyZyA9IDEpIC0+XHJcblx0XHRcdGFuaW0uZGF0YS5kcyA9IGFyZ1xyXG5cdFx0dXBkYXRlOiAodCwgZGF0YSkgLT5cclxuXHRcdFx0QG9wYWNpdHkgPSB0XHJcblx0XHRcdEByb3RhdGlvbiA9IHQgKiBNYXRoLlBJICogNFxyXG5cdFx0XHRAc2NhbGUgPSB0ICogZGF0YS5kc1xyXG5cclxuXHRzcGluT3V0OiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHR1cGRhdGU6ICh0KSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IDEgLSB0XHJcblx0XHRcdEByb3RhdGlvbiA9IHQgKiBNYXRoLlBJICogNFxyXG5cdFx0XHRAc2NhbGUgPSAxIC0gdFxyXG5cclxuXHRibGluazogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0ZHVyYXRpb246IDAuMlxyXG5cdFx0ZnJvbTogMFxyXG5cdFx0dG86IDUxMlxyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0ZGF0YSA9IE1hdGguZmxvb3IgTWF0aC5hYnMoZCAtIDI1NilcclxuXHRcdFx0QGZpbGxTdHlsZSA9IFwicmdiKCN7IGRhdGEgfSwgI3sgZGF0YSB9LCAjeyBkYXRhIH0pXCJcclxuXHJcblx0c2hha2U6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltLCBhcmcpIC0+XHJcblx0XHRcdGFuaW0uZGF0YS5veCA9IEBwb3NpdGlvbi54XHJcblx0XHRcdGFuaW0uZGF0YS5yYW5nZSA9IGFyZyBvciAyMFxyXG5cdFx0dXBkYXRlOiAodCwgZGF0YSkgLT5cclxuXHRcdFx0QHBvc2l0aW9uLnggPSBNYXRoLnNpbih0ICogTWF0aC5QSSAqIDgpICogZGF0YS5yYW5nZSArIGRhdGEub3hcclxuXHJcblx0Iy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFRvZ2dsZWQ6IGRldGVjdCBhbmQgc2F2ZSBvcmlnaW5hbCBzdGF0dXNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWZmOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRkdXJhdGlvbjogMC4xNVxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9XHJcblx0XHRcdFx0b3BhY2l0eTogQG9wYWNpdHlcclxuXHRcdFx0XHRzY2FsZTogQHNjYWxlLnhcclxuXHRcdFx0YW5pbS50byA9XHJcblx0XHRcdFx0aWYgQG9wYWNpdHkgPT0gMVxyXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxyXG5cdFx0XHRcdFx0c2NhbGU6IEBzY2FsZS54ICogMS41XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxyXG5cdFx0XHRcdFx0c2NhbGU6IEBzY2FsZS54IC8gMS41XHJcblx0XHR1cGRhdGU6IChkYXRhKSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IGRhdGEub3BhY2l0eVxyXG5cdFx0XHRAc2NhbGUgPSBkYXRhLnNjYWxlXHJcblxyXG5cdGNsaXA6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRpZiBAc2NhbGUueSAhPSAwXHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHNjYWxlLnlcclxuXHRcdFx0XHRhbmltLnRvID0gMFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHNjYWxlLnlcclxuXHRcdFx0XHRhbmltLnRvID0gQHNjYWxlLnhcclxuXHRcdHVwZGF0ZTogKGRhdGEpIC0+XHJcblx0XHRcdEBzY2FsZS55ID0gZGF0YVxyXG5cclxuXHRmbGlwWDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS54XHJcblx0XHRcdGFuaW0udG8gPSAtYW5pbS5mcm9tXHJcblx0XHR1cGRhdGU6IChkYXRhKSAtPlxyXG5cdFx0XHRAc2NhbGUueCA9IGRhdGFcclxuXHJcblx0ZmxpcFk6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRhbmltLmZyb20gPSBAc2NhbGUueVxyXG5cdFx0XHRhbmltLnRvID0gLWFuaW0uZnJvbVxyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0QHNjYWxlLnkgPSBkYXRhXHJcblxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0IyBXaXRoIEFyZ3VtZW50c1xyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdG1vdmVUbzogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0sIGFyZ3MpIC0+XHJcblx0XHRcdGlmIGFyZ3M/XHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHBvc2l0aW9uLnhcclxuXHRcdFx0XHRhbmltLnRvID0gYXJnc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciAnYW5pbWF0aW9uIG1vdmVUbyBuZWVkIGFuIGFyZ3VtZW50J1xyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0QHBvc2l0aW9uLnggPSBkYXRhXHJcblxyXG5cdG1vdmVCeTogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0sIGFyZ3MpIC0+XHJcblx0XHRcdGlmIGFyZ3M/XHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHBvc2l0aW9uLnhcclxuXHRcdFx0XHRhbmltLnRvID0gQHBvc2l0aW9uLnggKyBwYXJzZUZsb2F0KGFyZ3MpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yICdhbmltYXRpb24gbW92ZVRvIG5lZWQgYW4gYXJndW1lbnQnXHJcblx0XHR1cGRhdGU6IChkYXRhKSAtPlxyXG5cdFx0XHRAcG9zaXRpb24ueCA9IGRhdGFcclxuXHJcblx0ZGlzY29sb3I6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltLCBkZXNDb2xvcikgLT5cclxuXHRcdFx0ZGVzQ29sb3IgPSBuZXcgQnUuQ29sb3IgZGVzQ29sb3IgaWYgdHlwZW9mIGRlc0NvbG9yID09ICdzdHJpbmcnXHJcblx0XHRcdGFuaW0uZnJvbSA9IG5ldyBCdS5Db2xvciBAZmlsbFN0eWxlXHJcblx0XHRcdGFuaW0udG8gPSBkZXNDb2xvclxyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0QGZpbGxTdHlsZSA9IGRhdGEudG9SR0JBKClcclxuIiwiIyBydW4gdGhlIGFuaW1hdGlvbnNcclxuXHJcbmNsYXNzIEJ1LkFuaW1hdGlvblJ1bm5lclxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cclxuXHRcdEBydW5uaW5nQW5pbWF0aW9ucyA9IFtdXHJcblxyXG5cdGFkZDogKGFuaW0sIHRhcmdldCwgYXJncykgLT5cclxuXHRcdGFuaW0uaW5pdD8uY2FsbCB0YXJnZXQsIGFuaW0sIGFyZ3NcclxuXHRcdGlmIGlzQW5pbWF0aW9uTGVnYWwgYW5pbVxyXG5cdFx0XHR0YXNrID1cclxuXHRcdFx0XHRhbmltYXRpb246IGFuaW1cclxuXHRcdFx0XHR0YXJnZXQ6IHRhcmdldFxyXG5cdFx0XHRcdHN0YXJ0VGltZTogQnUubm93KClcclxuXHRcdFx0XHRjdXJyZW50OiBhbmltLmRhdGFcclxuXHRcdFx0XHRmaW5pc2hlZDogbm9cclxuXHRcdFx0QHJ1bm5pbmdBbmltYXRpb25zLnB1c2ggdGFza1xyXG5cdFx0XHRpbml0VGFzayB0YXNrLCBhbmltXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgJ0J1LkFuaW1hdGlvblJ1bm5lcjogYW5pbWF0aW9uIHNldHRpbmcgaXMgaWxlZ2FsOiAnLCBhbmltYXRpb25cclxuXHJcblx0dXBkYXRlOiAtPlxyXG5cdFx0bm93ID0gQnUubm93KClcclxuXHRcdGZvciB0YXNrIGluIEBydW5uaW5nQW5pbWF0aW9uc1xyXG5cdFx0XHRjb250aW51ZSBpZiB0YXNrLmZpbmlzaGVkXHJcblxyXG5cdFx0XHRhbmltID0gdGFzay5hbmltYXRpb25cclxuXHRcdFx0dCA9IChub3cgLSB0YXNrLnN0YXJ0VGltZSkgLyAoYW5pbS5kdXJhdGlvbiAqIDEwMDApXHJcblx0XHRcdGlmIHQgPiAxXHJcblx0XHRcdFx0ZmluaXNoID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIGFuaW0ucmVwZWF0XHJcblx0XHRcdFx0XHR0ID0gMFxyXG5cdFx0XHRcdFx0dGFzay5zdGFydFRpbWUgPSBCdS5ub3coKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMjIFRPRE8gcmVtb3ZlIG91dCBvZiBhcnJheVxyXG5cdFx0XHRcdFx0dCA9IDFcclxuXHRcdFx0XHRcdHRhc2suZmluaXNoZWQgPSB5ZXNcclxuXHJcblx0XHRcdGlmIGFuaW0uZWFzaW5nID09IHRydWVcclxuXHRcdFx0XHR0ID0gZWFzaW5nRnVuY3Rpb25zW0RFRkFVTFRfRUFTSU5HX0ZVTkNUSU9OXSB0XHJcblx0XHRcdGVsc2UgaWYgZWFzaW5nRnVuY3Rpb25zW2FuaW0uZWFzaW5nXT9cclxuXHRcdFx0XHR0ID0gZWFzaW5nRnVuY3Rpb25zW2FuaW0uZWFzaW5nXSB0XHJcblxyXG5cdFx0XHRpZiBhbmltLmZyb20/XHJcblx0XHRcdFx0aW50ZXJwb2xhdGVUYXNrIHRhc2ssIHRcclxuXHRcdFx0XHRhbmltLnVwZGF0ZS5hcHBseSB0YXNrLnRhcmdldCwgW3Rhc2suY3VycmVudCwgdF1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGFuaW0udXBkYXRlLmFwcGx5IHRhc2sudGFyZ2V0LCBbdCwgdGFzay5jdXJyZW50XVxyXG5cdFx0XHRpZiBmaW5pc2ggdGhlbiBhbmltLmZpbmlzaD8uY2FsbCB0YXNrLnRhcmdldCwgYW5pbVxyXG5cclxuXHQjIGhvb2sgdXAgb24gYW4gcmVuZGVyZXIsIHJlbW92ZSBvd24gc2V0SW50ZXJuYWxcclxuXHRob29rVXA6IChyZW5kZXJlcikgLT5cclxuXHRcdHJlbmRlcmVyLm9uICd1cGRhdGUnLCA9PiBAdXBkYXRlKClcclxuXHJcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBQcml2YXRlIGZ1bmN0aW9uc1xyXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0aXNBbmltYXRpb25MZWdhbCA9IChhbmltKSAtPlxyXG5cdFx0cmV0dXJuIHRydWUgdW5sZXNzIGFuaW0uZnJvbT8gYW5kIGFuaW0udG8/XHJcblxyXG5cdFx0aWYgQnUuaXNQbGFpbk9iamVjdCBhbmltLmZyb21cclxuXHRcdFx0Zm9yIG93biBrZXkgb2YgYW5pbS5mcm9tXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlIHVubGVzcyBhbmltLnRvW2tleV0/XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZSB1bmxlc3MgYW5pbS50bz9cclxuXHRcdHRydWVcclxuXHJcblx0aW5pdFRhc2sgPSAodGFzaywgYW5pbSkgLT5cclxuXHRcdCMgY3JlYXRlIHRhc2suY3VycmVudCBvYmplY3RcclxuXHRcdGlmIGFuaW0uZnJvbT9cclxuXHRcdFx0aWYgQnUuaXNQbGFpbk9iamVjdCBhbmltLmZyb21cclxuXHRcdFx0XHRmb3Igb3duIGtleSBvZiBhbmltLmZyb21cclxuXHRcdFx0XHRcdHRhc2suY3VycmVudFtrZXldID0gbmV3IGFuaW0uZnJvbVtrZXldLmNvbnN0cnVjdG9yXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0YXNrLmN1cnJlbnQgPSBuZXcgYW5pbS5mcm9tLmNvbnN0cnVjdG9yXHJcblxyXG5cdGludGVycG9sYXRlVGFzayA9ICh0YXNrLCB0KSAtPlxyXG5cdFx0YW5pbSA9IHRhc2suYW5pbWF0aW9uXHJcblx0XHRpZiB0eXBlb2YgYW5pbS5mcm9tID09ICdudW1iZXInXHJcblx0XHRcdHRhc2suY3VycmVudCA9IGludGVycG9sYXRlTnVtIGFuaW0uZnJvbSwgYW5pbS50bywgdFxyXG5cdFx0ZWxzZSBpZiBhbmltLmZyb20gaW5zdGFuY2VvZiBCdS5Db2xvclxyXG5cdFx0XHQjIHRhc2suY3VycmVudCA9IG5ldyBCdS5Db2xvciB1bmxlc3MgdGFzay5jdXJyZW50IGluc3RhbmNlb2YgQnUuQ29sb3JcclxuXHRcdFx0aW50ZXJwb2xhdGVPYmplY3QgYW5pbS5mcm9tLCBhbmltLnRvLCB0LCB0YXNrLmN1cnJlbnRcclxuXHRcdGVsc2UgaWYgQnUuaXNQbGFpbk9iamVjdCBhbmltLmZyb21cclxuXHRcdFx0Zm9yIG93biBrZXkgb2YgYW5pbS5mcm9tXHJcblx0XHRcdFx0aWYgdHlwZW9mIGFuaW0uZnJvbVtrZXldID09ICdudW1iZXInXHJcblx0XHRcdFx0XHR0YXNrLmN1cnJlbnRba2V5XSA9IGludGVycG9sYXRlTnVtIGFuaW0uZnJvbVtrZXldLCBhbmltLnRvW2tleV0sIHRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIHRhc2suY3VycmVudFtrZXldID0gbmV3IEJ1LkNvbG9yIHVubGVzcyB0YXNrLmN1cnJlbnRba2V5XSBpbnN0YW5jZW9mIEJ1LkNvbG9yXHJcblx0XHRcdFx0XHRpbnRlcnBvbGF0ZU9iamVjdCBhbmltLmZyb21ba2V5XSwgYW5pbS50b1trZXldLCB0LCB0YXNrLmN1cnJlbnRba2V5XVxyXG5cclxuXHRpbnRlcnBvbGF0ZU51bSA9IChhLCBiLCB0KSAtPiBiICogdCAtIGEgKiAodCAtIDEpXHJcblxyXG5cdGludGVycG9sYXRlT2JqZWN0ID0gKGEsIGIsIHQsIGMpIC0+XHJcblx0XHRpZiBhIGluc3RhbmNlb2YgQnUuQ29sb3JcclxuXHRcdFx0Yy5zZXRSR0JBIGludGVycG9sYXRlTnVtKGEuciwgYi5yLCB0KSwgaW50ZXJwb2xhdGVOdW0oYS5nLCBiLmcsIHQpLCBpbnRlcnBvbGF0ZU51bShhLmIsIGIuYiwgdCksIGludGVycG9sYXRlTnVtKGEuYSwgYi5hLCB0KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjb25zb2xlLmVycm9yIFwiQW5pbWF0aW9uUnVubmVyLmludGVycG9sYXRlT2JqZWN0KCkgZG9lc24ndCBzdXBwb3J0IG9iamVjdCB0eXBlOiBcIiwgYVxyXG5cclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCMgUHJpdmF0ZSB2YXJpYWJsZXNcclxuXHQjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRERUZBVUxUX0VBU0lOR19GVU5DVElPTiA9ICdxdWFkJ1xyXG5cdGVhc2luZ0Z1bmN0aW9ucyA9XHJcblx0XHRxdWFkSW46ICh0KSAtPiB0ICogdFxyXG5cdFx0cXVhZE91dDogKHQpIC0+IHQgKiAoMiAtIHQpXHJcblx0XHRxdWFkOiAodCkgLT5cclxuXHRcdFx0aWYgdCA8IDAuNVxyXG5cdFx0XHRcdDIgKiB0ICogdFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0LTIgKiB0ICogdCArIDQgKiB0IC0gMVxyXG5cclxuXHRcdGN1YmljSW46ICh0KSAtPiB0ICoqIDNcclxuXHRcdGN1YmljT3V0OiAodCkgLT4gKHQgLSAxKSAqKiAzICsgMVxyXG5cdFx0Y3ViaWM6ICh0KSAtPlxyXG5cdFx0XHRpZiB0IDwgMC41XHJcblx0XHRcdFx0NCAqIHQgKiogM1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0NCAqICh0IC0gMSkgKiogMyArIDFcclxuXHJcblx0XHRzaW5lSW46ICh0KSAtPiBNYXRoLnNpbigodCAtIDEpICogQnUuSEFMRl9QSSkgKyAxXHJcblx0XHRzaW5lT3V0OiAodCkgLT4gTWF0aC5zaW4gdCAqIEJ1LkhBTEZfUElcclxuXHRcdHNpbmU6ICh0KSAtPlxyXG5cdFx0XHRpZiB0IDwgMC41XHJcblx0XHRcdFx0KE1hdGguc2luKCh0ICogMiAtIDEpICogQnUuSEFMRl9QSSkgKyAxKSAvIDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdE1hdGguc2luKCh0IC0gMC41KSAqIE1hdGguUEkpIC8gMiArIDAuNVxyXG5cclxuXHRcdCMgVE9ETyBhZGQgcXVhcnQsIHF1aW50LCBleHBvLCBjaXJjLCBiYWNrLCBlbGFzdGljLCBib3VuY2VcclxuXHJcbiMgZ2xvYmFsIHVuaXF1ZSBpbnN0YW5jZVxyXG5CdS5hbmltYXRpb25SdW5uZXIgPSBuZXcgQnUuQW5pbWF0aW9uUnVubmVyXHJcbiIsIiMgU3ByaXRlIFNoZWV0XHJcblxyXG5jbGFzcyBCdS5TcHJpdGVTaGVldFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB1cmwpIC0+XHJcblx0XHRCdS5FdmVudC5hcHBseSBAXHJcblxyXG5cdFx0QHJlYWR5ID0gbm8gIyBJZiB0aGlzIHNwcml0ZSBzaGVldCBpcyBsb2FkZWQgYW5kIHBhcnNlZC5cclxuXHRcdEBoZWlnaHQgPSAwICMgSGVpZ2h0IG9mIHRoaXMgc3ByaXRlXHJcblxyXG5cdFx0QGRhdGEgPSBudWxsICMgVGhlIEpTT04gZGF0YVxyXG5cdFx0QGltYWdlcyA9IFtdICMgVGhlIGBJbWFnZWAgbGlzdCBsb2FkZWRcclxuXHRcdEBmcmFtZUltYWdlcyA9IFtdICMgUGFyc2VkIGZyYW1lIGltYWdlc1xyXG5cclxuXHRcdCMgbG9hZCBhbmQgdHJpZ2dlciBwYXJzZURhdGEoKVxyXG5cdFx0JC5hamF4IEB1cmwsIHN1Y2Nlc3M6ICh0ZXh0KSA9PlxyXG5cdFx0XHRAZGF0YSA9IEpTT04ucGFyc2UgdGV4dFxyXG5cclxuXHRcdFx0aWYgbm90IEBkYXRhLmltYWdlcz9cclxuXHRcdFx0XHRAZGF0YS5pbWFnZXMgPSBbQHVybC5zdWJzdHJpbmcoQHVybC5sYXN0SW5kZXhPZignLycpLCBAdXJsLmxlbmd0aCAtIDUpICsgJy5wbmcnXVxyXG5cclxuXHRcdFx0YmFzZVVybCA9IEB1cmwuc3Vic3RyaW5nIDAsIEB1cmwubGFzdEluZGV4T2YoJy8nKSArIDFcclxuXHRcdFx0Zm9yIG93biBpIG9mIEBkYXRhLmltYWdlc1xyXG5cdFx0XHRcdEBkYXRhLmltYWdlc1tpXSA9IGJhc2VVcmwgKyBAZGF0YS5pbWFnZXNbaV1cclxuXHJcblx0XHRcdFx0Y291bnRMb2FkZWQgPSAwXHJcblx0XHRcdFx0QGltYWdlc1tpXSA9IG5ldyBJbWFnZVxyXG5cdFx0XHRcdEBpbWFnZXNbaV0ub25sb2FkID0gKCkgPT5cclxuXHRcdFx0XHRcdGNvdW50TG9hZGVkICs9IDFcclxuXHRcdFx0XHRcdEBwYXJzZURhdGEoKSBpZiBjb3VudExvYWRlZCA9PSBAZGF0YS5pbWFnZXMubGVuZ3RoXHJcblx0XHRcdFx0QGltYWdlc1tpXS5zcmMgPSBAZGF0YS5pbWFnZXNbaV1cclxuXHJcblx0cGFyc2VEYXRhOiAtPlxyXG5cdFx0IyBDbGlwIHRoZSBpbWFnZSBmb3IgZXZlcnkgZnJhbWVzXHJcblx0XHRmcmFtZXMgPSBAZGF0YS5mcmFtZXNcclxuXHRcdGZvciBvd24gaSBvZiBmcmFtZXNcclxuXHRcdFx0Zm9yIGogaW4gWzAuLjRdXHJcblx0XHRcdFx0aWYgbm90IGZyYW1lc1tpXVtqXT9cclxuXHRcdFx0XHRcdGZyYW1lc1tpXVtqXSA9IGlmIGZyYW1lc1tpIC0gMV0/W2pdPyB0aGVuIGZyYW1lc1tpIC0gMV1bal0gZWxzZSAwXHJcblx0XHRcdHggPSBmcmFtZXNbaV1bMF1cclxuXHRcdFx0eSA9IGZyYW1lc1tpXVsxXVxyXG5cdFx0XHR3ID0gZnJhbWVzW2ldWzJdXHJcblx0XHRcdGggPSBmcmFtZXNbaV1bM11cclxuXHRcdFx0ZnJhbWVJbmRleCA9IGZyYW1lc1tpXVs0XVxyXG5cdFx0XHRAZnJhbWVJbWFnZXNbaV0gPSBjbGlwSW1hZ2UgQGltYWdlc1tmcmFtZUluZGV4XSwgeCwgeSwgdywgaFxyXG5cdFx0XHRAaGVpZ2h0ID0gaCBpZiBAaGVpZ2h0ID09IDBcclxuXHJcblx0XHRAcmVhZHkgPSB5ZXNcclxuXHRcdEB0cmlnZ2VyICdsb2FkZWQnXHJcblxyXG5cdGdldEZyYW1lSW1hZ2U6IChrZXksIGluZGV4ID0gMCkgLT5cclxuXHRcdGFuaW1hdGlvbiA9IEBkYXRhLmFuaW1hdGlvbnNba2V5XVxyXG5cdFx0cmV0dXJuIG51bGwgdW5sZXNzIGFuaW1hdGlvbj9cclxuXHJcblx0XHRyZXR1cm4gQGZyYW1lSW1hZ2VzW2FuaW1hdGlvbi5mcmFtZXNbaW5kZXhdXVxyXG5cclxuXHRtZWFzdXJlVGV4dFdpZHRoOiAodGV4dCkgLT5cclxuXHRcdHdpZHRoID0gMFxyXG5cdFx0Zm9yIGNoYXIgaW4gdGV4dFxyXG5cdFx0XHR3aWR0aCArPSBAZ2V0RnJhbWVJbWFnZShjaGFyKS53aWR0aFxyXG5cdFx0d2lkdGhcclxuXHJcblx0IyBTdGF0aWMgbWVtYmVyc1xyXG5cclxuXHRjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdjYW52YXMnXHJcblx0Y29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0ICcyZCdcclxuXHJcblx0Y2xpcEltYWdlID0gKGltYWdlLCB4LCB5LCB3LCBoKSAtPlxyXG5cdFx0Y2FudmFzLndpZHRoID0gd1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IGhcclxuXHRcdGNvbnRleHQuZHJhd0ltYWdlIGltYWdlLCB4LCB5LCB3LCBoLCAwLCAwLCB3LCBoXHJcblxyXG5cdFx0bmV3SW1hZ2UgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0bmV3SW1hZ2Uuc3JjID0gY2FudmFzLnRvRGF0YVVSTCgpXHJcblx0XHRyZXR1cm4gbmV3SW1hZ2VcclxuIiwiIyBHZW9tZXRyeSBBbGdvcml0aG0gR2F0aGVyXHJcblxyXG5CdS5nZW9tZXRyeUFsZ29yaXRobSA9IEcgPVxyXG5cclxuXHRpbmplY3Q6IC0+XHJcblx0XHRAaW5qZWN0SW50byBbXHJcblx0XHRcdCdwb2ludCdcclxuXHRcdFx0J2xpbmUnXHJcblx0XHRcdCdjaXJjbGUnXHJcblx0XHRcdCd0cmlhbmdsZSdcclxuXHRcdFx0J3JlY3RhbmdsZSdcclxuXHRcdFx0J2ZhbidcclxuXHRcdFx0J2JvdydcclxuXHRcdFx0J3BvbHlnb24nXHJcblx0XHRcdCdwb2x5bGluZSdcclxuXHRcdF1cclxuXHJcblx0aW5qZWN0SW50bzogKHNoYXBlcykgLT5cclxuXHRcdHNoYXBlcyA9IFtzaGFwZXNdIGlmIHR5cGVvZiBzaGFwZXMgPT0gJ3N0cmluZydcclxuXHJcblx0XHRpZiAncG9pbnQnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5Qb2ludDo6aW5DaXJjbGUgPSAoY2lyY2xlKSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkNpcmNsZSBALCBjaXJjbGVcclxuXHRcdFx0QnUuUG9pbnQ6OmRpc3RhbmNlVG8gPSAocG9pbnQpIC0+XHJcblx0XHRcdFx0Ry5kaXN0YW5jZUZyb21Qb2ludFRvUG9pbnQgQCwgcG9pbnRcclxuXHRcdFx0QnUuUG9pbnQ6OmlzTmVhciA9ICh0YXJnZXQsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHRcdFx0c3dpdGNoIHRhcmdldC50eXBlXHJcblx0XHRcdFx0XHR3aGVuICdQb2ludCdcclxuXHRcdFx0XHRcdFx0Ry5wb2ludE5lYXJQb2ludCBALCB0YXJnZXQsIGxpbWl0XHJcblx0XHRcdFx0XHR3aGVuICdMaW5lJ1xyXG5cdFx0XHRcdFx0XHRHLnBvaW50TmVhckxpbmUgQCwgdGFyZ2V0LCBsaW1pdFxyXG5cdFx0XHRcdFx0d2hlbiAnUG9seWxpbmUnXHJcblx0XHRcdFx0XHRcdEcucG9pbnROZWFyUG9seWxpbmUgQCwgdGFyZ2V0LCBsaW1pdFxyXG5cdFx0XHRCdS5Qb2ludC5pbnRlcnBvbGF0ZSA9IEcuaW50ZXJwb2xhdGVCZXR3ZWVuVHdvUG9pbnRzXHJcblxyXG5cdFx0aWYgJ2xpbmUnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5MaW5lOjpkaXN0YW5jZVRvID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcuZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUgcG9pbnQsIEBcclxuXHRcdFx0QnUuTGluZTo6aXNUd29Qb2ludHNTYW1lU2lkZSA9IChwMSwgcDIpIC0+XHJcblx0XHRcdFx0Ry50d29Qb2ludHNTYW1lU2lkZU9mTGluZSBwMSwgcDIsIEBcclxuXHRcdFx0QnUuTGluZTo6Zm9vdFBvaW50RnJvbSA9IChwb2ludCwgc2F2ZVRvKSAtPlxyXG5cdFx0XHRcdEcuZm9vdFBvaW50RnJvbVBvaW50VG9MaW5lIHBvaW50LCBALCBzYXZlVG9cclxuXHRcdFx0QnUuTGluZTo6Z2V0Q3Jvc3NQb2ludFdpdGggPSAobGluZSkgLT5cclxuXHRcdFx0XHRHLmdldENyb3NzUG9pbnRPZlR3b0xpbmVzIGxpbmUsIEBcclxuXHRcdFx0QnUuTGluZTo6aXNDcm9zc1dpdGhMaW5lID0gKGxpbmUpIC0+XHJcblx0XHRcdFx0Ry5pc1R3b0xpbmVzQ3Jvc3MgbGluZSwgQFxyXG5cclxuXHRcdGlmICdjaXJjbGUnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5DaXJjbGU6Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkNpcmNsZSBwb2ludCwgQFxyXG5cclxuXHRcdGlmICd0cmlhbmdsZScgaW4gc2hhcGVzXHJcblx0XHRcdEJ1LlRyaWFuZ2xlOjpfY29udGFpbnNQb2ludCA9IChwb2ludCkgLT5cclxuXHRcdFx0XHRHLnBvaW50SW5UcmlhbmdsZSBwb2ludCwgQFxyXG5cdFx0XHRCdS5UcmlhbmdsZTo6YXJlYSA9IC0+XHJcblx0XHRcdFx0Ry5jYWxjVHJpYW5nbGVBcmVhIEBcclxuXHJcblx0XHRpZiAncmVjdGFuZ2xlJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuUmVjdGFuZ2xlOjpjb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJblJlY3RhbmdsZSBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdmYW4nIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5GYW46Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkZhbiBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdib3cnIGluIHNoYXBlc1xyXG5cdFx0XHRCdS5Cb3c6Ol9jb250YWluc1BvaW50ID0gKHBvaW50KSAtPlxyXG5cdFx0XHRcdEcucG9pbnRJbkJvdyBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdwb2x5Z29uJyBpbiBzaGFwZXNcclxuXHRcdFx0QnUuUG9seWdvbjo6X2NvbnRhaW5zUG9pbnQgPSAocG9pbnQpIC0+XHJcblx0XHRcdFx0Ry5wb2ludEluUG9seWdvbiBwb2ludCwgQFxyXG5cclxuXHRcdGlmICdwb2x5bGluZScgaW4gc2hhcGVzXHJcblx0XHRcdEJ1LlBvbHlsaW5lOjpsZW5ndGggPSAwXHJcblx0XHRcdEJ1LlBvbHlsaW5lOjpwb2ludE5vcm1hbGl6ZWRQb3MgPSBbXVxyXG5cdFx0XHRCdS5Qb2x5bGluZTo6Y2FsY0xlbmd0aCA9ICgpIC0+XHJcblx0XHRcdFx0QGxlbmd0aCA9IEcuY2FsY1BvbHlsaW5lTGVuZ3RoIEBcclxuXHRcdFx0QnUuUG9seWxpbmU6OmNhbGNQb2ludE5vcm1hbGl6ZWRQb3MgPSAtPlxyXG5cdFx0XHRcdEcuY2FsY05vcm1hbGl6ZWRWZXJ0aWNlc1Bvc09mUG9seWxpbmUgQFxyXG5cdFx0XHRCdS5Qb2x5bGluZTo6Z2V0Tm9ybWFsaXplZFBvcyA9IChpbmRleCkgLT5cclxuXHRcdFx0XHRpZiBpbmRleD8gdGhlbiBAcG9pbnROb3JtYWxpemVkUG9zW2luZGV4XSBlbHNlIEBwb2ludE5vcm1hbGl6ZWRQb3NcclxuXHRcdFx0QnUuUG9seWxpbmU6OmNvbXByZXNzID0gKHN0cmVuZ3RoID0gMC44KSAtPlxyXG5cdFx0XHRcdEcuY29tcHJlc3NQb2x5bGluZSBALCBzdHJlbmd0aFxyXG5cclxuXHQjIFBvaW50IGluIHNoYXBlc1xyXG5cclxuXHRwb2ludE5lYXJQb2ludDogKHBvaW50LCB0YXJnZXQsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHRwb2ludC5kaXN0YW5jZVRvKHRhcmdldCkgPCBsaW1pdFxyXG5cclxuXHRwb2ludE5lYXJMaW5lOiAocG9pbnQsIGxpbmUsIGxpbWl0ID0gQnUuREVGQVVMVF9ORUFSX0RJU1QpIC0+XHJcblx0XHR2ZXJ0aWNhbERpc3QgPSBsaW5lLmRpc3RhbmNlVG8gcG9pbnRcclxuXHRcdGZvb3RQb2ludCA9IGxpbmUuZm9vdFBvaW50RnJvbSBwb2ludFxyXG5cclxuXHRcdGlzQmV0d2VlbjEgPSBmb290UG9pbnQuZGlzdGFuY2VUbyhsaW5lLnBvaW50c1swXSkgPCBsaW5lLmxlbmd0aCArIGxpbWl0XHJcblx0XHRpc0JldHdlZW4yID0gZm9vdFBvaW50LmRpc3RhbmNlVG8obGluZS5wb2ludHNbMV0pIDwgbGluZS5sZW5ndGggKyBsaW1pdFxyXG5cclxuXHRcdHJldHVybiB2ZXJ0aWNhbERpc3QgPCBsaW1pdCBhbmQgaXNCZXR3ZWVuMSBhbmQgaXNCZXR3ZWVuMlxyXG5cclxuXHRwb2ludE5lYXJQb2x5bGluZTogKHBvaW50LCBwb2x5bGluZSwgbGltaXQgPSBCdS5ERUZBVUxUX05FQVJfRElTVCkgLT5cclxuXHRcdGZvciBsaW5lIGluIHBvbHlsaW5lLmxpbmVzXHJcblx0XHRcdHJldHVybiB5ZXMgaWYgRy5wb2ludE5lYXJMaW5lIHBvaW50LCBsaW5lLCBsaW1pdFxyXG5cdFx0bm9cclxuXHJcblx0cG9pbnRJbkNpcmNsZTogKHBvaW50LCBjaXJjbGUpIC0+XHJcblx0XHRkeCA9IHBvaW50LnggLSBjaXJjbGUuY3hcclxuXHRcdGR5ID0gcG9pbnQueSAtIGNpcmNsZS5jeVxyXG5cdFx0cmV0dXJuIEJ1LmJldmVsKGR4LCBkeSkgPCBjaXJjbGUucmFkaXVzXHJcblxyXG5cdHBvaW50SW5SZWN0YW5nbGU6IChwb2ludCwgcmVjdGFuZ2xlKSAtPlxyXG5cdFx0cG9pbnQueCA+IHJlY3RhbmdsZS5wb2ludExULnggYW5kXHJcblx0XHRcdFx0cG9pbnQueSA+IHJlY3RhbmdsZS5wb2ludExULnkgYW5kXHJcblx0XHRcdFx0cG9pbnQueCA8IHJlY3RhbmdsZS5wb2ludExULnggKyByZWN0YW5nbGUuc2l6ZS53aWR0aCBhbmRcclxuXHRcdFx0XHRwb2ludC55IDwgcmVjdGFuZ2xlLnBvaW50TFQueSArIHJlY3RhbmdsZS5zaXplLmhlaWdodFxyXG5cclxuXHRwb2ludEluVHJpYW5nbGU6IChwb2ludCwgdHJpYW5nbGUpIC0+XHJcblx0XHRHLnR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lKHBvaW50LCB0cmlhbmdsZS5wb2ludHNbMl0sIHRyaWFuZ2xlLmxpbmVzWzBdKSBhbmRcclxuXHRcdFx0XHRHLnR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lKHBvaW50LCB0cmlhbmdsZS5wb2ludHNbMF0sIHRyaWFuZ2xlLmxpbmVzWzFdKSBhbmRcclxuXHRcdFx0XHRHLnR3b1BvaW50c1NhbWVTaWRlT2ZMaW5lKHBvaW50LCB0cmlhbmdsZS5wb2ludHNbMV0sIHRyaWFuZ2xlLmxpbmVzWzJdKVxyXG5cclxuXHRwb2ludEluRmFuOiAocG9pbnQsIGZhbikgLT5cclxuXHRcdGR4ID0gcG9pbnQueCAtIGZhbi5jeFxyXG5cdFx0ZHkgPSBwb2ludC55IC0gZmFuLmN5XHJcblx0XHRhID0gTWF0aC5hdGFuMihwb2ludC55IC0gZmFuLmN5LCBwb2ludC54IC0gZmFuLmN4KVxyXG5cdFx0YSArPSBNYXRoLlBJICogMiB3aGlsZSBhIDwgZmFuLmFGcm9tXHJcblx0XHRyZXR1cm4gQnUuYmV2ZWwoZHgsIGR5KSA8IGZhbi5yYWRpdXMgJiYgYSA+IGZhbi5hRnJvbSAmJiBhIDwgZmFuLmFUb1xyXG5cclxuXHRwb2ludEluQm93OiAocG9pbnQsIGJvdykgLT5cclxuXHRcdGlmIEJ1LmJldmVsKGJvdy5jeCAtIHBvaW50LngsIGJvdy5jeSAtIHBvaW50LnkpIDwgYm93LnJhZGl1c1xyXG5cdFx0XHRzYW1lU2lkZSA9IGJvdy5zdHJpbmcuaXNUd29Qb2ludHNTYW1lU2lkZShib3cuY2VudGVyLCBwb2ludClcclxuXHRcdFx0c21hbGxUaGFuSGFsZkNpcmNsZSA9IGJvdy5hVG8gLSBib3cuYUZyb20gPCBNYXRoLlBJXHJcblx0XHRcdHJldHVybiBzYW1lU2lkZSBeIHNtYWxsVGhhbkhhbGZDaXJjbGVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdHBvaW50SW5Qb2x5Z29uOiAocG9pbnQsIHBvbHlnb24pIC0+XHJcblx0XHRmb3IgdHJpYW5nbGUgaW4gcG9seWdvbi50cmlhbmdsZXNcclxuXHRcdFx0aWYgdHJpYW5nbGUuY29udGFpbnNQb2ludCBwb2ludFxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRmYWxzZVxyXG5cclxuXHQjIERpc3RhbmNlXHJcblxyXG5cdGRpc3RhbmNlRnJvbVBvaW50VG9Qb2ludDogKHBvaW50MSwgcG9pbnQyKSAtPlxyXG5cdFx0QnUuYmV2ZWwgcG9pbnQxLnggLSBwb2ludDIueCwgcG9pbnQxLnkgLSBwb2ludDIueVxyXG5cclxuXHRkaXN0YW5jZUZyb21Qb2ludFRvTGluZTogKHBvaW50LCBsaW5lKSAtPlxyXG5cdFx0cDEgPSBsaW5lLnBvaW50c1swXVxyXG5cdFx0cDIgPSBsaW5lLnBvaW50c1sxXVxyXG5cdFx0YSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpXHJcblx0XHRiID0gcDEueSAtIGEgKiBwMS54XHJcblx0XHRyZXR1cm4gTWF0aC5hYnMoYSAqIHBvaW50LnggKyBiIC0gcG9pbnQueSkgLyBNYXRoLnNxcnQoYSAqIGEgKyAxKVxyXG5cclxuXHQjIFBvaW50IFJlbGF0ZWRcclxuXHJcblx0aW50ZXJwb2xhdGVCZXR3ZWVuVHdvUG9pbnRzOiAocDEsIHAyLCBrLCBwMykgLT5cclxuXHRcdHggPSBwMS54ICsgKHAyLnggLSBwMS54KSAqIGtcclxuXHRcdHkgPSBwMS55ICsgKHAyLnkgLSBwMS55KSAqIGtcclxuXHJcblx0XHRpZiBwMz9cclxuXHRcdFx0cDMuc2V0IHgsIHlcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG5ldyBCdS5Qb2ludCB4LCB5XHJcblxyXG5cdCMgUG9pbnQgYW5kIExpbmVcclxuXHJcblx0dHdvUG9pbnRzU2FtZVNpZGVPZkxpbmU6IChwMSwgcDIsIGxpbmUpIC0+XHJcblx0XHRwQSA9IGxpbmUucG9pbnRzWzBdXHJcblx0XHRwQiA9IGxpbmUucG9pbnRzWzFdXHJcblx0XHRpZiBwQS54ID09IHBCLnhcclxuXHRcdFx0IyBpZiBib3RoIG9mIHRoZSB0d28gcG9pbnRzIGFyZSBvbiB0aGUgbGluZSB0aGVuIHdlIGNvbnNpZGVyIHRoZXkgYXJlIGluIHRoZSBzYW1lIHNpZGVcclxuXHRcdFx0cmV0dXJuIChwMS54IC0gcEEueCkgKiAocDIueCAtIHBBLngpID4gMFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR5MDEgPSAocEEueSAtIHBCLnkpICogKHAxLnggLSBwQS54KSAvIChwQS54IC0gcEIueCkgKyBwQS55XHJcblx0XHRcdHkwMiA9IChwQS55IC0gcEIueSkgKiAocDIueCAtIHBBLngpIC8gKHBBLnggLSBwQi54KSArIHBBLnlcclxuXHRcdFx0cmV0dXJuIChwMS55IC0geTAxKSAqIChwMi55IC0geTAyKSA+IDBcclxuXHJcblx0Zm9vdFBvaW50RnJvbVBvaW50VG9MaW5lOiAocG9pbnQsIGxpbmUsIHNhdmVUbyA9IG5ldyBCdS5Qb2ludCkgLT5cclxuXHRcdHAxID0gbGluZS5wb2ludHNbMF1cclxuXHRcdHAyID0gbGluZS5wb2ludHNbMV1cclxuXHRcdEEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KVxyXG5cdFx0QiA9IHAxLnkgLSBBICogcDEueFxyXG5cdFx0bSA9IHBvaW50LnggKyBBICogcG9pbnQueVxyXG5cdFx0eCA9IChtIC0gQSAqIEIpIC8gKEEgKiBBICsgMSlcclxuXHRcdHkgPSBBICogeCArIEJcclxuXHJcblx0XHRzYXZlVG8uc2V0IHgsIHlcclxuXHRcdHJldHVybiBzYXZlVG9cclxuXHJcblx0Z2V0Q3Jvc3NQb2ludE9mVHdvTGluZXM6IChsaW5lMSwgbGluZTIpIC0+XHJcblx0XHRbcDEsIHAyXSA9IGxpbmUxLnBvaW50c1xyXG5cdFx0W3ExLCBxMl0gPSBsaW5lMi5wb2ludHNcclxuXHJcblx0XHRhMSA9IHAyLnkgLSBwMS55XHJcblx0XHRiMSA9IHAxLnggLSBwMi54XHJcblx0XHRjMSA9IChhMSAqIHAxLngpICsgKGIxICogcDEueSlcclxuXHRcdGEyID0gcTIueSAtIHExLnlcclxuXHRcdGIyID0gcTEueCAtIHEyLnhcclxuXHRcdGMyID0gKGEyICogcTEueCkgKyAoYjIgKiBxMS55KVxyXG5cdFx0ZGV0ID0gKGExICogYjIpIC0gKGEyICogYjEpXHJcblxyXG5cdFx0cmV0dXJuIG5ldyBCdS5Qb2ludCAoKGIyICogYzEpIC0gKGIxICogYzIpKSAvIGRldCwgKChhMSAqIGMyKSAtIChhMiAqIGMxKSkgLyBkZXRcclxuXHJcblx0aXNUd29MaW5lc0Nyb3NzOiAobGluZTEsIGxpbmUyKSAtPlxyXG5cdFx0eDEgPSBsaW5lMS5wb2ludHNbMF0ueFxyXG5cdFx0eTEgPSBsaW5lMS5wb2ludHNbMF0ueVxyXG5cdFx0eDIgPSBsaW5lMS5wb2ludHNbMV0ueFxyXG5cdFx0eTIgPSBsaW5lMS5wb2ludHNbMV0ueVxyXG5cdFx0eDMgPSBsaW5lMi5wb2ludHNbMF0ueFxyXG5cdFx0eTMgPSBsaW5lMi5wb2ludHNbMF0ueVxyXG5cdFx0eDQgPSBsaW5lMi5wb2ludHNbMV0ueFxyXG5cdFx0eTQgPSBsaW5lMi5wb2ludHNbMV0ueVxyXG5cclxuXHRcdGQgPSAoeTIgLSB5MSkgKiAoeDQgLSB4MykgLSAoeTQgLSB5MykgKiAoeDIgLSB4MSlcclxuXHJcblx0XHRpZiBkID09IDBcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHgwID0gKCh4MiAtIHgxKSAqICh4NCAtIHgzKSAqICh5MyAtIHkxKSArICh5MiAtIHkxKSAqICh4NCAtIHgzKSAqIHgxIC0gKHk0IC0geTMpICogKHgyIC0geDEpICogeDMpIC8gZFxyXG5cdFx0XHR5MCA9ICgoeTIgLSB5MSkgKiAoeTQgLSB5MykgKiAoeDMgLSB4MSkgKyAoeDIgLSB4MSkgKiAoeTQgLSB5MykgKiB5MSAtICh4NCAtIHgzKSAqICh5MiAtIHkxKSAqIHkzKSAvIC1kXHJcblx0XHRyZXR1cm4gKHgwIC0geDEpICogKHgwIC0geDIpIDwgMCBhbmRcclxuXHRcdFx0XHRcdFx0KHgwIC0geDMpICogKHgwIC0geDQpIDwgMCBhbmRcclxuXHRcdFx0XHRcdFx0KHkwIC0geTEpICogKHkwIC0geTIpIDwgMCBhbmRcclxuXHRcdFx0XHRcdFx0KHkwIC0geTMpICogKHkwIC0geTQpIDwgMFxyXG5cclxuXHQjIFBvbHlsaW5lXHJcblxyXG5cdGNhbGNQb2x5bGluZUxlbmd0aDogKHBvbHlsaW5lKSAtPlxyXG5cdFx0bGVuID0gMFxyXG5cdFx0aWYgcG9seWxpbmUudmVydGljZXMubGVuZ3RoID49IDJcclxuXHRcdFx0Zm9yIGkgaW4gWzEgLi4uIHBvbHlsaW5lLnZlcnRpY2VzLmxlbmd0aF1cclxuXHRcdFx0XHRsZW4gKz0gcG9seWxpbmUudmVydGljZXNbaV0uZGlzdGFuY2VUbyBwb2x5bGluZS52ZXJ0aWNlc1tpIC0gMV1cclxuXHRcdHJldHVybiBsZW5cclxuXHJcblx0Y2FsY05vcm1hbGl6ZWRWZXJ0aWNlc1Bvc09mUG9seWxpbmU6IChwb2x5bGluZSkgLT5cclxuXHRcdGN1cnJQb3MgPSAwXHJcblx0XHRwb2x5bGluZS5wb2ludE5vcm1hbGl6ZWRQb3NbMF0gPSAwXHJcblx0XHRmb3IgaSBpbiBbMSAuLi4gcG9seWxpbmUudmVydGljZXMubGVuZ3RoXVxyXG5cdFx0XHRjdXJyUG9zICs9IHBvbHlsaW5lLnZlcnRpY2VzW2ldLmRpc3RhbmNlVG8ocG9seWxpbmUudmVydGljZXNbaSAtIDFdKSAvIHBvbHlsaW5lLmxlbmd0aFxyXG5cdFx0XHRwb2x5bGluZS5wb2ludE5vcm1hbGl6ZWRQb3NbaV0gPSBjdXJyUG9zXHJcblxyXG5cdGNvbXByZXNzUG9seWxpbmU6IChwb2x5bGluZSwgc3RyZW5ndGgpIC0+XHJcblx0XHRjb21wcmVzc2VkID0gW11cclxuXHRcdGZvciBvd24gaSBvZiBwb2x5bGluZS52ZXJ0aWNlc1xyXG5cdFx0XHRpZiBpIDwgMlxyXG5cdFx0XHRcdGNvbXByZXNzZWRbaV0gPSBwb2x5bGluZS52ZXJ0aWNlc1tpXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0W3BBLCBwTV0gPSBjb21wcmVzc2VkWy0yLi4tMV1cclxuXHRcdFx0XHRwQiA9IHBvbHlsaW5lLnZlcnRpY2VzW2ldXHJcblx0XHRcdFx0b2JsaXF1ZUFuZ2xlID0gTWF0aC5hYnMoTWF0aC5hdGFuMihwQS55IC0gcE0ueSwgcEEueCAtIHBNLngpIC0gTWF0aC5hdGFuMihwTS55IC0gcEIueSwgcE0ueCAtIHBCLngpKVxyXG5cdFx0XHRcdGlmIG9ibGlxdWVBbmdsZSA8IHN0cmVuZ3RoICogc3RyZW5ndGggKiBNYXRoLlBJIC8gMlxyXG5cdFx0XHRcdFx0Y29tcHJlc3NlZFtjb21wcmVzc2VkLmxlbmd0aCAtIDFdID0gcEJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjb21wcmVzc2VkLnB1c2ggcEJcclxuXHRcdHBvbHlsaW5lLnZlcnRpY2VzID0gY29tcHJlc3NlZFxyXG5cdFx0cG9seWxpbmUua2V5UG9pbnRzID0gcG9seWxpbmUudmVydGljZXNcclxuXHRcdHJldHVybiBwb2x5bGluZVxyXG5cclxuXHQjIEFyZWEgQ2FsY3VsYXRpb25cclxuXHJcblx0Y2FsY1RyaWFuZ2xlQXJlYTogKHRyaWFuZ2xlKSAtPlxyXG5cdFx0W2EsIGIsIGNdID0gdHJpYW5nbGUucG9pbnRzXHJcblx0XHRyZXR1cm4gTWF0aC5hYnMoKChiLnggLSBhLngpICogKGMueSAtIGEueSkpIC0gKChjLnggLSBhLngpICogKGIueSAtIGEueSkpKSAvIDJcclxuXHJcbkcuaW5qZWN0KClcclxuIiwiIyBnZW5lcmF0b3IgcmFuZG9tIHNoYXBlc1xyXG5cclxuY2xhc3MgQnUuUmFuZG9tU2hhcGVHZW5lcmF0b3JcclxuXHJcblx0TUFSR0lOID0gMzBcclxuXHJcblx0Y29uc3RydWN0b3I6IChAYnUpIC0+XHJcblxyXG5cdHJhbmRvbVg6IC0+XHJcblx0XHRyZXR1cm4gQnUucmFuZCBNQVJHSU4sIEBidS53aWR0aCAtIE1BUkdJTiAqIDJcclxuXHJcblx0cmFuZG9tWTogLT5cclxuXHRcdHJldHVybiBCdS5yYW5kIE1BUkdJTiwgQGJ1LmhlaWdodCAtIE1BUkdJTiAqIDJcclxuXHJcblx0cmFuZG9tUmFkaXVzOiAtPlxyXG5cdFx0cmV0dXJuIEJ1LnJhbmQgNSwgTWF0aC5taW4oQGJ1LndpZHRoLCBAYnUuaGVpZ2h0KSAvIDJcclxuXHJcblxyXG5cdGdlbmVyYXRlOiAodHlwZSkgLT5cclxuXHRcdHN3aXRjaCB0eXBlXHJcblx0XHRcdHdoZW4gJ2NpcmNsZScgdGhlbiBAZ2VuZXJhdGVDaXJjbGUoKVxyXG5cdFx0XHR3aGVuICdib3cnIHRoZW4gQGdlbmVyYXRlQm93KClcclxuXHRcdFx0d2hlbiAndHJpYW5nbGUnIHRoZW4gQGdlbmVyYXRlVHJpYW5nbGUoKVxyXG5cdFx0XHR3aGVuICdyZWN0YW5nbGUnIHRoZW4gQGdlbmVyYXRlUmVjdGFuZ2xlKClcclxuXHRcdFx0d2hlbiAnZmFuJyB0aGVuIEBnZW5lcmF0ZUZhbigpXHJcblx0XHRcdHdoZW4gJ3BvbHlnb24nIHRoZW4gQGdlbmVyYXRlUG9seWdvbigpXHJcblx0XHRcdHdoZW4gJ2xpbmUnIHRoZW4gQGdlbmVyYXRlTGluZSgpXHJcblx0XHRcdHdoZW4gJ3BvbHlsaW5lJyB0aGVuIEBnZW5lcmF0ZVBvbHlsaW5lKClcclxuXHRcdFx0ZWxzZSBjb25zb2xlLndhcm4gJ25vdCBzdXBwb3J0IHNoYXBlOiAnICsgdHlwZVxyXG5cclxuXHRnZW5lcmF0ZUNpcmNsZTogLT5cclxuXHRcdGNpcmNsZSA9IG5ldyBCdS5DaXJjbGUgQHJhbmRvbVJhZGl1cygpLCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRjaXJjbGUuY2VudGVyLmxhYmVsID0gJ08nXHJcblx0XHRyZXR1cm4gY2lyY2xlXHJcblxyXG5cdGdlbmVyYXRlQm93OiAtPlxyXG5cdFx0YUZyb20gPSBCdS5yYW5kIE1hdGguUEkgKiAyXHJcblx0XHRhVG8gPSBhRnJvbSArIEJ1LnJhbmQgTWF0aC5QSSAvIDIsIE1hdGguUEkgKiAyXHJcblxyXG5cdFx0Ym93ID0gbmV3IEJ1LkJvdyBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tUmFkaXVzKCksIGFGcm9tLCBhVG9cclxuXHRcdGJvdy5zdHJpbmcucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHRib3cuc3RyaW5nLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0cmV0dXJuIGJvd1xyXG5cclxuXHRnZW5lcmF0ZVRyaWFuZ2xlOiAtPlxyXG5cdFx0cG9pbnRzID0gW11cclxuXHRcdGZvciBpIGluIFswLi4yXVxyXG5cdFx0XHRwb2ludHNbaV0gPSBuZXcgQnUuUG9pbnQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKVxyXG5cclxuXHRcdHRyaWFuZ2xlID0gbmV3IEJ1LlRyaWFuZ2xlIHBvaW50c1swXSwgcG9pbnRzWzFdLCBwb2ludHNbMl1cclxuXHRcdHRyaWFuZ2xlLnBvaW50c1swXS5sYWJlbCA9ICdBJ1xyXG5cdFx0dHJpYW5nbGUucG9pbnRzWzFdLmxhYmVsID0gJ0InXHJcblx0XHR0cmlhbmdsZS5wb2ludHNbMl0ubGFiZWwgPSAnQydcclxuXHRcdHJldHVybiB0cmlhbmdsZVxyXG5cclxuXHRnZW5lcmF0ZVJlY3RhbmdsZTogLT5cclxuXHRcdHJldHVybiBuZXcgQnUuUmVjdGFuZ2xlKFxyXG5cdFx0XHRCdS5yYW5kKEBidS53aWR0aClcclxuXHRcdFx0QnUucmFuZChAYnUuaGVpZ2h0KVxyXG5cdFx0XHRCdS5yYW5kKEBidS53aWR0aCAvIDIpXHJcblx0XHRcdEJ1LnJhbmQoQGJ1LmhlaWdodCAvIDIpXHJcblx0XHQpXHJcblxyXG5cdGdlbmVyYXRlRmFuOiAtPlxyXG5cdFx0YUZyb20gPSBCdS5yYW5kIE1hdGguUEkgKiAyXHJcblx0XHRhVG8gPSBhRnJvbSArIEJ1LnJhbmQgTWF0aC5QSSAvIDIsIE1hdGguUEkgKiAyXHJcblxyXG5cdFx0ZmFuID0gbmV3IEJ1LkZhbiBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tUmFkaXVzKCksIGFGcm9tLCBhVG9cclxuXHRcdGZhbi5zdHJpbmcucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHRmYW4uc3RyaW5nLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0cmV0dXJuIGZhblxyXG5cclxuXHRnZW5lcmF0ZVBvbHlnb246IC0+XHJcblx0XHRwb2ludHMgPSBbXVxyXG5cclxuXHRcdGZvciBpIGluIFswLi4zXVxyXG5cdFx0XHRwb2ludCA9IG5ldyBCdS5Qb2ludCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRcdHBvaW50LmxhYmVsID0gJ1AnICsgaVxyXG5cdFx0XHRwb2ludHMucHVzaCBwb2ludFxyXG5cclxuXHRcdHJldHVybiBuZXcgQnUuUG9seWdvbiBwb2ludHNcclxuXHJcblx0Z2VuZXJhdGVMaW5lOiAtPlxyXG5cdFx0bGluZSA9IG5ldyBCdS5MaW5lIEByYW5kb21YKCksIEByYW5kb21ZKCksIEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHRcdGxpbmUucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHRsaW5lLnBvaW50c1sxXS5sYWJlbCA9ICdCJ1xyXG5cdFx0cmV0dXJuIGxpbmVcclxuXHJcblx0Z2VuZXJhdGVQb2x5bGluZTogLT5cclxuXHRcdHBvbHlsaW5lID0gbmV3IEJ1LlBvbHlsaW5lXHJcblx0XHRmb3IgaSBpbiBbMC4uM11cclxuXHRcdFx0cG9pbnQgPSBuZXcgQnUuUG9pbnQgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKVxyXG5cdFx0XHRwb2ludC5sYWJlbCA9ICdQJyArIGlcclxuXHRcdFx0cG9seWxpbmUuYWRkUG9pbnQgcG9pbnRcclxuXHRcdHJldHVybiBwb2x5bGluZVxyXG4iXX0=
