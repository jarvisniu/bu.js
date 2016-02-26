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


  /*
   * constants
   */

  Bu.VERSION = '0.3.3';

  Bu.DEFAULT_STROKE_STYLE = '#048';

  Bu.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)';

  Bu.DEFAULT_DASH_STYLE = [8, 4];

  Bu.DEFAULT_SPLINE_SMOOTH = 0.25;

  Bu.DEFAULT_STROKE_STYLE_HOVER = 'rgba(255, 128, 0, 0.75)';

  Bu.DEFAULT_FILL_STYLE_HOVER = 'rgba(255, 128, 128, 0.5)';

  Bu.DEFAULT_TEXT_FILL_STYLE = 'black';

  Bu.DEFAULT_IMAGE_SIZE = 20;

  Bu.POINT_RENDER_SIZE = 2.25;

  Bu.POINT_LABEL_OFFSET = 5;

  Bu.DEFAULT_BOUND_STROKE_STYLE = '#444';

  Bu.DEFAULT_BOUND_DASH_STYLE = [6, 6];

  Bu.DEFAULT_NEAR_DIST = 5;

  Bu.MOUSE_BUTTON_NONE = -1;

  Bu.MOUSE_BUTTON_LEFT = 0;

  Bu.MOUSE_BUTTON_MIDDLE = 1;

  Bu.MOUSE_BUTTON_RIGHT = 2;


  /*
   * utility functions
   */

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
        defaultOptions[i] = givenOptions[i];
      }
    }
    return defaultOptions;
  };

  Bu.clone = function(target, deep) {
    var clone, i, results, results1;
    if (deep == null) {
      deep = false;
    }
    if (target instanceof Array) {
      clone = [];
      results = [];
      for (i in target) {
        if (!hasProp.call(target, i)) continue;
        results.push(clone[i] = target[i]);
      }
      return results;
    } else if (target instanceof Object) {
      clone = {};
      results1 = [];
      for (i in target) {
        if (!hasProp.call(target, i)) continue;
        results1.push(clone[i] = target[i]);
      }
      return results1;
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


  /*
   * polyfill
   */

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


/*
 * MicroJQuery - A micro version of jQuery
 *
 * Supported features:
 *   $. - static methods
 *     .ready(cb) - call the callback function after the page is loaded
 *     .ajax([url,] options) - perform an ajax request
 *   $(selector) - select element(s)
 *     .on(type, callback) - add an event listener
 *     .off(type, callback) - remove an event listener
 *     .append(tagName) - append a tag
 *     .text(text) - set the inner text
 *     .html(htmlText) - set the inner HTML
 *     .style(name, value) - set style (a css attribute)
 *     #.css(object) - set styles (multiple css attribute)
 *     .hasClass(className) - detect whether a class exists
 *     .addClass(className) - add a class
 *     .removeClass(className) - remove a class
 *     .toggleClass(className) - toggle a class
 *     .attr(name, value) - set an attribute
 *     .hasAttr(name) - detect whether an attribute exists
 *     .removeAttr(name) - remove an attribute
 *   Notes:
 *        # is planned but not implemented
 */

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

    /* $.ajax()
    		options:
    			url: string
    			====
    			async = true: bool
    			## data: object - query parameters TODO: implement this
    			method = GET: POST, PUT, DELETE, HEAD
    			username: string
    			password: string
    			success: function
    			error: function
    			complete: function
     */
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
      this.translate = new Bu.Vector;
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
          return this.scale = val;
        }
      }
    });

    Object2D.prototype.animate = function(anim, args) {
      var i, results;
      if (typeof anim === 'string') {
        if (anim in Bu.animations) {
          return Bu.animations[anim].apply(this, args);
        } else {
          return console.warn("Bu.animations[\"" + anim + "\"] doesn't exists.");
        }
      } else if (anim instanceof Array) {
        if (!(args instanceof Array)) {
          args = [args];
        }
        results = [];
        for (i in anim) {
          if (!hasProp.call(anim, i)) continue;
          results.push(this.animate(anim[i], args));
        }
        return results;
      } else {
        return anim.apply(this, args);
      }
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
      var onResize, options, ref, tick;
      Bu.Event.apply(this);
      this.type = 'Renderer';
      options = Bu.combineOptions(arguments, {
        width: 800,
        height: 600,
        fps: 60,
        fillParent: false,
        showKeyPoints: false,
        border: false
      });
      this.width = options.width;
      this.height = options.height;
      this.fps = options.fps;
      this.container = options.container;
      this.fillParent = options.fillParent;
      this.isShowKeyPoints = options.showKeyPoints;
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
      if ((options.border != null) && options.border) {
        this.dom.style.border = 'solid 1px gray';
      }
      this.dom.style.cursor = 'crosshair';
      this.dom.style.boxSizing = 'content-box';
      this.dom.style.background = '#eee';
      this.dom.oncontextmenu = function() {
        return false;
      };
      if ((ref = Bu.animationRunner) != null) {
        ref.hookUp(this);
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
      if (this.fillParent) {
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
      if (this.container != null) {
        if (typeof this.container === 'string') {
          this.container = document.querySelector(this.container);
        }
        setTimeout((function(_this) {
          return function() {
            return _this.container.appendChild(_this.dom);
          };
        })(this), 100);
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

    Renderer.prototype.append = function(shape) {
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
      this.context.translate(shape.translate.x, shape.translate.y);
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
      if (this.isShowKeyPoints) {
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
      this.context.rect(shape.position.x, shape.position.y, shape.size.width, shape.size.height);
      return this;
    };

    Renderer.prototype.drawRoundRectangle = function(shape) {
      var base, r, x1, x2, y1, y2;
      x1 = shape.position.x;
      x2 = shape.pointRB.x;
      y1 = shape.position.y;
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

    Bow.prototype._containsPoint = function(point) {
      var sameSide, smallThanHalfCircle;
      if (Bu.bevel(this.cx - point.x, this.cy - point.y) < this.radius) {
        sameSide = this.string.isTwoPointsSameSide(this.center, point);
        smallThanHalfCircle = this.aTo - this.aFrom < Math.PI;
        return sameSide ^ smallThanHalfCircle;
      } else {
        return false;
      }
    };

    return Bow;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Circle = (function(superClass) {
    extend(Circle, superClass);

    function Circle(cx, cy, _radius) {
      if (cx == null) {
        cx = 0;
      }
      if (cy == null) {
        cy = 0;
      }
      this._radius = _radius != null ? _radius : 1;
      Circle.__super__.constructor.call(this);
      this.type = 'Circle';
      this._center = new Bu.Point(cx, cy);
      this.bounds = null;
      this.keyPoints = [this._center];
    }

    Circle.prototype.clone = function() {
      return new Bu.Circle(this.cx, this.cy, this.radius);
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

    Circle.prototype._containsPoint = function(p) {
      var dx, dy;
      dx = p.x - this.cx;
      dy = p.y - this.cy;
      return Bu.bevel(dx, dy) < this.radius;
    };

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

    Fan.prototype._containsPoint = function(p) {
      var a, dx, dy;
      dx = p.x - this.cx;
      dy = p.y - this.cy;
      a = Math.atan2(p.y - this.cy, p.x - this.cx);
      while (a < this.aFrom) {
        a += Math.PI * 2;
      }
      return Bu.bevel(dx, dy) < this.radius && a > this.aFrom && a < this.aTo;
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
      this.length;
      this.midpoint = new Bu.Point();
      this.keyPoints = this.points;
      this.on("pointChange", (function(_this) {
        return function(e) {
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

    Line.prototype.isTwoPointsSameSide = function(p1, p2) {
      var pA, pB, y01, y02;
      pA = this.points[0];
      pB = this.points[1];
      if (pA.x === pB.x) {
        return (p1.x - pA.x) * (p2.x - pA.x) > 0;
      } else {
        y01 = (pA.y - pB.y) * (p1.x - pA.x) / (pA.x - pB.x) + pA.y;
        y02 = (pA.y - pB.y) * (p2.x - pA.x) / (pA.x - pB.x) + pA.y;
        return (p1.y - y01) * (p2.y - y02) > 0;
      }
    };

    Line.prototype.distanceTo = function(point) {
      var a, b, p1, p2;
      p1 = this.points[0];
      p2 = this.points[1];
      a = (p1.y - p2.y) / (p1.x - p2.x);
      b = p1.y - a * p1.x;
      return Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1);
    };

    Line.prototype.distanceTo2 = function(point) {
      var a, b, czX, czY, p1, p2;
      p1 = this.points[0];
      p2 = this.points[1];
      a = (p1.y - p2.y) / (p1.x - p2.x);
      b = p1.y - (p1.y - p2.y) * p1.x / (p1.x - p2.x);
      czX = (point.y + point.x / a - b) / (a + 1 / a);
      czY = a * czX + b;
      return Bu.bevel(czX - point.x, czY - point.y);
    };

    Line.prototype.footPointFrom = function(point, footPoint) {
      var A, B, m, p1, p2, x, y;
      p1 = this.points[0];
      p2 = this.points[1];
      A = (p1.y - p2.y) / (p1.x - p2.x);
      B = p1.y - A * p1.x;
      m = point.x + A * point.y;
      x = (m - A * B) / (A * A + 1);
      y = A * x + B;
      if (footPoint != null) {
        return footPoint.set(x, y);
      } else {
        return new Bu.Point(x, y);
      }
    };

    Line.prototype.getCrossPointWith = function(line) {
      var a1, a2, b1, b2, c1, c2, det, p1, p2, q1, q2;
      p1 = this.points[0];
      p2 = this.points[1];
      q1 = line.points[0];
      q2 = line.points[1];
      a1 = p2.y - p1.y;
      b1 = p1.x - p2.x;
      c1 = (a1 * p1.x) + (b1 * p1.y);
      a2 = q2.y - q1.y;
      b2 = q1.x - q2.x;
      c2 = (a2 * q1.x) + (b2 * q1.y);
      det = (a1 * b2) - (a2 * b1);
      return new Bu.Point(((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det);
    };

    Line.prototype.isCrossWithLine = function(line) {
      var d, x0, x1, x2, x3, x4, y0, y1, y2, y3, y4;
      x1 = this.points[0].x;
      y1 = this.points[0].y;
      x2 = this.points[1].x;
      y2 = this.points[1].y;
      x3 = line.points[0].x;
      y3 = line.points[0].y;
      x4 = line.points[1].x;
      y4 = line.points[1].y;
      d = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1);
      if (d === 0) {
        return false;
      } else {
        x0 = ((x2 - x1) * (x4 - x3) * (y3 - y1) + (y2 - y1) * (x4 - x3) * x1 - (y4 - y3) * (x2 - x1) * x3) / d;
        y0 = ((y2 - y1) * (y4 - y3) * (x3 - x1) + (x2 - x1) * (y4 - y3) * y1 - (x4 - x3) * (y2 - y1) * y3) / -d;
      }
      return (x0 - x1) * (x0 - x2) < 0 && (x0 - x3) * (x0 - x4) < 0 && (y0 - y1) * (y0 - y2) < 0 && (y0 - y3) * (y0 - y4) < 0;
    };

    Line.prototype.isCrossWithLine2 = function(line) {
      var da, db, dx, dy, p1, p2, q1, q2, s, t;
      p1 = this.points[0];
      p2 = this.points[1];
      q1 = line.points[0];
      q2 = line.points[1];
      dx = p2.x - p1.x;
      dy = p2.y - p1.y;
      da = q2.x - q1.x;
      db = q2.y - q1.y;
      if (da * dy - db * dx === 0) {
        return false;
      }
      s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx);
      t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy);
      return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    };

    return Line;

  })(Bu.Object2D);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Point = (function(superClass) {
    var footPoint;

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

    Point.prototype.distanceTo = function(point) {
      return Bu.bevel(this.x - point.x, this.y - point.y);
    };

    footPoint = null;

    Point.prototype.isNear = function(target, limit) {
      var i, isBetween1, isBetween2, len, line, ref, verticalDist;
      if (limit == null) {
        limit = Bu.DEFAULT_NEAR_DIST;
      }
      switch (target.type) {
        case 'Point':
          return this.distanceTo(target) < limit;
        case 'Line':
          verticalDist = target.distanceTo(this);
          if (footPoint == null) {
            footPoint = new Bu.Point;
          }
          target.footPointFrom(this, footPoint);
          isBetween1 = footPoint.distanceTo(target.points[0]) < target.length + Bu.DEFAULT_NEAR_DIST;
          isBetween2 = footPoint.distanceTo(target.points[1]) < target.length + Bu.DEFAULT_NEAR_DIST;
          return verticalDist < limit && isBetween1 && isBetween2;
        case 'Polyline':
          ref = target.lines;
          for (i = 0, len = ref.length; i < len; i++) {
            line = ref[i];
            if (this.isNear(line)) {
              return true;
            }
          }
          return false;
      }
    };

    return Point;

  })(Bu.Object2D);

  Bu.Point.interpolate = function(p1, p2, k, p3) {
    var x, y;
    x = p1.x + (p2.x - p1.x) * k;
    y = p1.y + (p2.y - p1.y) * k;
    if (p3 != null) {
      return p3.set(x, y);
    } else {
      return new Bu.Point(x, y);
    }
  };

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

    Polygon.prototype._containsPoint = function(p) {
      var k, len1, ref, triangle;
      ref = this.triangles;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        triangle = ref[k];
        if (triangle.containsPoint(p)) {
          return true;
        }
      }
      return false;
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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Bu.Polyline = (function(superClass) {
    var set;

    extend(Polyline, superClass);

    function Polyline(vertices1) {
      var i, j, ref, vertices;
      this.vertices = vertices1 != null ? vertices1 : [];
      this.calcLength = bind(this.calcLength, this);
      this.updateLines = bind(this.updateLines, this);
      this.clone = bind(this.clone, this);
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
      this.length = 0;
      this.pointNormalizedPos = [];
      this.keyPoints = this.vertices;
      this.fill(false);
      this.on("pointChange", (function(_this) {
        return function() {
          if (_this.vertices.length > 1) {
            _this.updateLines();
            _this.calcLength();
            return _this.calcPointNormalizedPos();
          }
        };
      })(this));
      this.trigger("pointChange", this);
    }

    Polyline.prototype.clone = function() {
      return new Bu.Polyline(this.vertices);
    };

    Polyline.prototype.updateLines = function() {
      var i, j, ref, results;
      results = [];
      for (i = j = 0, ref = this.vertices.length - 1; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (this.lines[i] != null) {
          results.push(this.lines[i].set(this.vertices[i], this.vertices[i + 1]));
        } else {
          results.push(this.lines[i] = new Bu.Line(this.vertices[i], this.vertices[i + 1]));
        }
      }
      return results;
    };

    Polyline.prototype.calcLength = function() {
      var i, j, len, ref;
      if (this.vertices.length < 2) {
        return this.length = 0;
      } else {
        len = 0;
        for (i = j = 1, ref = this.vertices.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
          len += this.vertices[i].distanceTo(this.vertices[i - 1]);
        }
        return this.length = len;
      }
    };

    Polyline.prototype.calcPointNormalizedPos = function() {
      var currPos, i, j, ref, results;
      currPos = 0;
      this.pointNormalizedPos[0] = 0;
      results = [];
      for (i = j = 1, ref = this.vertices.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
        currPos += this.vertices[i].distanceTo(this.vertices[i - 1]) / this.length;
        results.push(this.pointNormalizedPos[i] = currPos);
      }
      return results;
    };

    Polyline.prototype.getNormalizedPos = function(index) {
      if (index != null) {
        return this.pointNormalizedPos[index];
      } else {
        return this.pointNormalizedPos;
      }
    };

    Polyline.prototype.compress = function(strength) {
      var compressed, i, obliqueAngle, pA, pB, pM, ref, ref1;
      if (strength == null) {
        strength = 0.8;
      }
      compressed = [];
      ref = this.vertices;
      for (i in ref) {
        if (!hasProp.call(ref, i)) continue;
        if (i < 2) {
          compressed[i] = this.vertices[i];
        } else {
          ref1 = compressed.slice(-2), pA = ref1[0], pM = ref1[1];
          pB = this.vertices[i];
          obliqueAngle = Math.abs(Math.atan2(pA.y - pM.y, pA.x - pM.x) - Math.atan2(pM.y - pB.y, pM.x - pB.x));
          if (obliqueAngle < strength * strength * Math.PI / 2) {
            compressed[compressed.length - 1] = pB;
          } else {
            compressed.push(pB);
          }
        }
      }
      this.vertices = compressed;
      this.keyPoints = this.vertices;
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
      return this.trigger("pointChange", this);
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
      return this.trigger("pointChange", this);
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
      this.position = new Bu.Point(x, y);
      this.center = new Bu.Point(x + width / 2, y + height / 2);
      this.size = new Bu.Size(width, height);
      this.pointRT = new Bu.Point(x + width, y);
      this.pointRB = new Bu.Point(x + width, y + height);
      this.pointLB = new Bu.Point(x, y + height);
      this.points = [this.position, this.pointRT, this.pointRB, this.pointLB];
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
      return new Bu.Rectangle(this.position.x, this.position.y, this.size.width, this.size.height);
    };

    Rectangle.prototype.containsPoint = function(point) {
      return point.x > this.position.x && point.y > this.position.y && point.x < this.position.x + this.size.width && point.y < this.position.y + this.size.height;
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

    Triangle.prototype.area = function() {
      var a, b, c, ref;
      ref = this.points, a = ref[0], b = ref[1], c = ref[2];
      return Math.abs(((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y))) / 2;
    };

    Triangle.prototype._containsPoint = function(p) {
      return this.lines[0].isTwoPointsSameSide(p, this.points[2]) && this.lines[1].isTwoPointsSameSide(p, this.points[0]) && this.lines[2].isTwoPointsSameSide(p, this.points[1]);
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
      this.size = new Bu.Size(Bu.DEFAULT_IMAGE_SIZE, Bu.DEFAULT_IMAGE_SIZE);
      this.translate = new Bu.Vector(x, y);
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
      this.setContextAlign(this.align);
    }

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
      this.repeat = options.repeat != null ? options.repeat : false;
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
        anim.data.ox = this.translate.x;
        return anim.data.range = arg || 20;
      },
      update: function(t, data) {
        return this.translate.x = Math.sin(t * Math.PI * 8) * data.range + data.ox;
      }
    }),
    puff: new Bu.Animation({
      duration: 0.15,
      init: function(anim) {
        anim.from = {
          opacity: this.opacity,
          scale: this.scale.x
        };
        return anim.to = {
          opacity: this.opacity === 1 ? 0 : 1,
          scale: this.opacity === 1 ? this.scale.x * 1.5 : this.scale.x / 1.5
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
          anim.from = this.translate.x;
          return anim.to = args;
        } else {
          return console.error('animation moveTo need an argument');
        }
      },
      update: function(data) {
        return this.translate.x = data;
      }
    }),
    moveBy: new Bu.Animation({
      init: function(anim, args) {
        if (args != null) {
          anim.from = this.translate.x;
          return anim.to = this.translate.x + parseFloat(args);
        } else {
          return console.error('animation moveTo need an argument');
        }
      },
      update: function(data) {
        return this.translate.x = data;
      }
    })
  };

}).call(this);

(function() {
  var hasProp = {}.hasOwnProperty;

  Bu.AnimationRunner = (function() {
    function AnimationRunner() {
      this.runningAnimations = [];
    }

    AnimationRunner.prototype.add = function(animation, target, args) {
      var ref;
      this.runningAnimations.push({
        animation: animation,
        target: target,
        startTime: Bu.now(),
        current: animation.data,
        finished: false
      });
      return (ref = animation.init) != null ? ref.call(target, animation, args) : void 0;
    };

    AnimationRunner.prototype.update = function() {
      var anim, finish, i, key, len, now, ref, ref1, ref2, results, t, task;
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
        if (anim.from != null) {
          if (anim.from instanceof Object) {
            ref1 = anim.from;
            for (key in ref1) {
              if (!hasProp.call(ref1, key)) continue;
              if (key in anim.to) {
                task.current[key] = anim.to[key] * t - anim.from[key] * (t - 1);
              }
            }
          } else {
            task.current = anim.to * t - anim.from * (t - 1);
          }
          anim.update.apply(task.target, [task.current, t]);
        } else {
          anim.update.apply(task.target, [t, task.current]);
        }
        if (finish) {
          results.push((ref2 = anim.finish) != null ? ref2.call(task.target, anim) : void 0);
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

    return AnimationRunner;

  })();

  Bu.animationRunner = new Bu.AnimationRunner;

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
      circle = new Bu.Circle(this.randomX(), this.randomY(), this.randomRadius());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1LmpzIiwiQnUuY29mZmVlIiwiQm91bmRzLmNvZmZlZSIsIlNpemUuY29mZmVlIiwiVmVjdG9yLmNvZmZlZSIsIkNvbG9yZnVsLmNvZmZlZSIsIkV2ZW50LmNvZmZlZSIsIk1pY3JvSlF1ZXJ5LmNvZmZlZSIsIk9iamVjdDJELmNvZmZlZSIsIlJlbmRlcmVyLmNvZmZlZSIsIkJvdy5jb2ZmZWUiLCJDaXJjbGUuY29mZmVlIiwiRmFuLmNvZmZlZSIsIkxpbmUuY29mZmVlIiwiUG9pbnQuY29mZmVlIiwiUG9seWdvbi5jb2ZmZWUiLCJQb2x5bGluZS5jb2ZmZWUiLCJSZWN0YW5nbGUuY29mZmVlIiwiU3BsaW5lLmNvZmZlZSIsIlRyaWFuZ2xlLmNvZmZlZSIsIkltYWdlLmNvZmZlZSIsIlBvaW50VGV4dC5jb2ZmZWUiLCJBbmltYXRpb24uY29mZmVlIiwiQW5pbWF0aW9uUnVubmVyLmNvZmZlZSIsIlJhbmRvbVNoYXBlR2VuZXJhdG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLEFDRUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7O0VBQUEsY0FBQSxHQUFpQjs7RUFHakIsTUFBQSxHQUFTLE1BQUEsSUFBVTs7RUFHbkIsTUFBTSxDQUFDLEVBQVAsR0FBWSxTQUFBO1dBQVU7Ozs7T0FBQSxFQUFFLENBQUMsUUFBSCxFQUFZLFNBQVo7RUFBVjs7RUFHWixFQUFFLENBQUMsTUFBSCxHQUFZOztFQUdaLE1BQUEsR0FBUzs7O0FBR1Q7Ozs7RUFLQSxFQUFFLENBQUMsT0FBSCxHQUFhOztFQUdiLEVBQUUsQ0FBQyxvQkFBSCxHQUEwQjs7RUFDMUIsRUFBRSxDQUFDLGtCQUFILEdBQXdCOztFQUN4QixFQUFFLENBQUMsa0JBQUgsR0FBd0IsQ0FBQyxDQUFELEVBQUksQ0FBSjs7RUFHeEIsRUFBRSxDQUFDLHFCQUFILEdBQTJCOztFQUczQixFQUFFLENBQUMsMEJBQUgsR0FBZ0M7O0VBQ2hDLEVBQUUsQ0FBQyx3QkFBSCxHQUE4Qjs7RUFH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O01BQ1gsSUFBSSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFmLEdBQXVCO01BQ3ZCLElBQUksQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBZixHQUF1QjtBQUN2QixhQUFPO0lBSk07O21DQU1kLGdCQUFBLEdBQWtCLFNBQUE7QUFDakIsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLEVBQUUsQ0FBQztBQUNsQixXQUFTLDBCQUFUO1FBQ0MsS0FBQSxHQUFZLElBQUEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVQsRUFBcUIsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFyQjtRQUNaLEtBQUssQ0FBQyxLQUFOLEdBQWMsR0FBQSxHQUFNO1FBQ3BCLFFBQVEsQ0FBQyxRQUFULENBQWtCLEtBQWxCO0FBSEQ7QUFJQSxhQUFPO0lBTlU7Ozs7O0FBdEZuQiIsImZpbGUiOiJidS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiIyBCdS5jb2ZmZWU6IG5hbWVzcGFjZSwgY29uc3RhbnRzLCB1dGlsaXR5IGZ1bmN0aW9ucyBhbmQgcG9seWZpbGxzXHJcblxyXG4jIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIGBnbG9iYWxgIHZhcmlhYmxlLlxyXG5wcmV2aW91c0dsb2JhbCA9IGdsb2JhbFxyXG5cclxuIyBHZXQgdGhlIHJvb3Qgb2JqZWN0XHJcbmdsb2JhbCA9IHdpbmRvdyBvciBAXHJcblxyXG4jIERlZmluZSBvdXIgbmFtZXNwYWNlIGBCdWAuIEl0IGlzIGFsc28gYSBzaG9ydGN1dCB0byBjbGFzcyBgQnUuUmVuZGVyZXJgLlxyXG5nbG9iYWwuQnUgPSAoKSAtPiBuZXcgQnUuUmVuZGVyZXIgYXJndW1lbnRzLi4uXHJcblxyXG4jIFNhdmUgdGhlIHJvb3Qgb2JqZWN0IHRvIG91ciBuYW1lc3BhY2UuXHJcbkJ1Lmdsb2JhbCA9IGdsb2JhbFxyXG5cclxuIyBSZXR1cm4gYmFjayB0aGUgcHJldmlvdXMgZ2xvYmFsIHZhcmlhYmxlLlxyXG5nbG9iYWwgPSBwcmV2aW91c0dsb2JhbFxyXG5cclxuXHJcbiMjI1xyXG4jIGNvbnN0YW50c1xyXG4jIyNcclxuXHJcbiMgbGlicmFyeSB2ZXJzaW9uXHJcbkJ1LlZFUlNJT04gPSAnMC4zLjMnXHJcblxyXG4jIHNoYXBlcyByZWxhdGVkXHJcbkJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFID0gJyMwNDgnXHJcbkJ1LkRFRkFVTFRfRklMTF9TVFlMRSA9ICdyZ2JhKDY0LCAxMjgsIDE5MiwgMC41KSdcclxuQnUuREVGQVVMVF9EQVNIX1NUWUxFID0gWzgsIDRdXHJcblxyXG4jIGN1cnZlIHJlbGF0ZWRcclxuQnUuREVGQVVMVF9TUExJTkVfU01PT1RIID0gMC4yNSAjIHJhbmdlIGluIFswIH4gMV1cclxuXHJcbiMgaW50ZXJhY3Rpb24gcmVsYXRlZFxyXG5CdS5ERUZBVUxUX1NUUk9LRV9TVFlMRV9IT1ZFUiA9ICdyZ2JhKDI1NSwgMTI4LCAwLCAwLjc1KSdcclxuQnUuREVGQVVMVF9GSUxMX1NUWUxFX0hPVkVSID0gJ3JnYmEoMjU1LCAxMjgsIDEyOCwgMC41KSdcclxuXHJcbiMgdGV4dHMgcmVsYXRlZFxyXG5CdS5ERUZBVUxUX1RFWFRfRklMTF9TVFlMRSA9ICdibGFjaydcclxuXHJcbiMgZGVmYXVsdCBzaXplXHJcbkJ1LkRFRkFVTFRfSU1BR0VfU0laRSA9IDIwXHJcbkJ1LlBPSU5UX1JFTkRFUl9TSVpFID0gMi4yNVxyXG5CdS5QT0lOVF9MQUJFTF9PRkZTRVQgPSA1XHJcblxyXG4jIGJvdW5kcyByZWxhdGVkXHJcbkJ1LkRFRkFVTFRfQk9VTkRfU1RST0tFX1NUWUxFID0gJyM0NDQnXHJcbkJ1LkRFRkFVTFRfQk9VTkRfREFTSF9TVFlMRSA9IFs2LCA2XVxyXG5cclxuIyBjb21wdXRhdGlvbiByZWxhdGVkXHJcbkJ1LkRFRkFVTFRfTkVBUl9ESVNUID0gNVxyXG5cclxuIyBtb3VzZSBpbnRlcmFjdFxyXG5CdS5NT1VTRV9CVVRUT05fTk9ORSA9IC0xXHJcbkJ1Lk1PVVNFX0JVVFRPTl9MRUZUID0gMFxyXG5CdS5NT1VTRV9CVVRUT05fTUlERExFID0gMVxyXG5CdS5NT1VTRV9CVVRUT05fUklHSFQgPSAyXHJcblxyXG5cclxuIyMjXHJcbiMgdXRpbGl0eSBmdW5jdGlvbnNcclxuIyMjXHJcblxyXG4jIGNhbGN1bGF0ZSB0aGUgbWVhbiB2YWx1ZSBvZiBzZXZlcmFsIG51bWJlcnNcclxuQnUuYXZlcmFnZSA9ICgpLT5cclxuXHRucyA9IGFyZ3VtZW50c1xyXG5cdG5zID0gYXJndW1lbnRzWzBdIGlmIHR5cGVvZiBhcmd1bWVudHNbMF0gaXMgJ29iamVjdCdcclxuXHRzdW0gPSAwXHJcblx0Zm9yIGkgaW4gbnNcclxuXHRcdHN1bSArPSBpXHJcblx0c3VtIC8gbnMubGVuZ3RoXHJcblxyXG4jIGNhbGN1bGF0ZSB0aGUgaHlwb3RlbnVzZSBmcm9tIHRoZSBjYXRoZXR1c2VzXHJcbkJ1LmJldmVsID0gKHgsIHkpIC0+XHJcblx0TWF0aC5zcXJ0IHggKiB4ICsgeSAqIHlcclxuXHJcbiMgZ2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIG51bWJlcnNcclxuQnUucmFuZCA9IChmcm9tLCB0bykgLT5cclxuXHRpZiBub3QgdG8/XHJcblx0XHR0byA9IGZyb21cclxuXHRcdGZyb20gPSAwXHJcblx0TWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pICsgZnJvbVxyXG5cclxuIyBjb252ZXJ0IGFuIGFuZ2xlIGZyb20gcmFkaWFuIHRvIGRlZ1xyXG5CdS5yMmQgPSAocikgLT4gKHIgKiAxODAgLyBNYXRoLlBJKS50b0ZpeGVkKDEpXHJcblxyXG4jIGNvbnZlcnQgYW4gYW5nbGUgZnJvbSBkZWcgdG8gcmFkaWFuXHJcbkJ1LmQyciA9IChyKSAtPiByICogTWF0aC5QSSAvIDE4MFxyXG5cclxuIyBnZXQgY3VycmVudCB0aW1lXHJcbkJ1Lm5vdyA9IGlmIEJ1Lmdsb2JhbC5wZXJmb3JtYW5jZT8gdGhlbiAtPiBCdS5nbG9iYWwucGVyZm9ybWFuY2Uubm93KCkgZWxzZSAtPiBEYXRlLm5vdygpXHJcblxyXG4jIGNvbWJpbmUgdGhlIGdpdmVuIG9wdGlvbnMgKGxhc3QgaXRlbSBvZiBhcmd1bWVudHMpIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9uc1xyXG5CdS5jb21iaW5lT3B0aW9ucyA9IChhcmdzLCBkZWZhdWx0T3B0aW9ucykgLT5cclxuXHRkZWZhdWx0T3B0aW9ucyA9IHt9IGlmIG5vdCBkZWZhdWx0T3B0aW9ucz9cclxuXHRnaXZlbk9wdGlvbnMgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV1cclxuXHRpZiB0eXBlb2YgZ2l2ZW5PcHRpb25zIGlzICdvYmplY3QnXHJcblx0XHRmb3IgaSBvZiBnaXZlbk9wdGlvbnNcclxuXHRcdFx0ZGVmYXVsdE9wdGlvbnNbaV0gPSBnaXZlbk9wdGlvbnNbaV1cclxuXHRyZXR1cm4gZGVmYXVsdE9wdGlvbnNcclxuXHJcbiMgY2xvbmUgYW4gT2JqZWN0IG9yIEFycmF5XHJcbkJ1LmNsb25lID0gKHRhcmdldCwgZGVlcCA9IGZhbHNlKSAtPlxyXG5cdCMgVE9ETyBkZWFsIHdpdGggZGVlcFxyXG5cdGlmIHRhcmdldCBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRjbG9uZSA9IFtdXHJcblx0XHRjbG9uZVtpXSA9IHRhcmdldFtpXSBmb3Igb3duIGkgb2YgdGFyZ2V0XHJcblx0ZWxzZSBpZiB0YXJnZXQgaW5zdGFuY2VvZiBPYmplY3RcclxuXHRcdGNsb25lID0ge31cclxuXHRcdGNsb25lW2ldID0gdGFyZ2V0W2ldIGZvciBvd24gaSBvZiB0YXJnZXRcclxuXHJcbiMgdXNlIGxvY2FsU3RvcmFnZSB0byBwZXJzaXN0IGRhdGFcclxuQnUuZGF0YSA9IChrZXksIHZhbHVlKSAtPlxyXG5cdGlmIHZhbHVlP1xyXG5cdFx0bG9jYWxTdG9yYWdlWydCdS4nICsga2V5XSA9IEpTT04uc3RyaW5naWZ5IHZhbHVlXHJcblx0ZWxzZVxyXG5cdFx0dmFsdWUgPSBsb2NhbFN0b3JhZ2VbJ0J1LicgKyBrZXldXHJcblx0XHRyZXR1cm4gaWYgdmFsdWU/IHRoZW4gSlNPTi5wYXJzZSB2YWx1ZSBlbHNlIG51bGxcclxuXHJcbiMjI1xyXG4jIHBvbHlmaWxsXHJcbiMjI1xyXG5cclxuIyBTaG9ydGN1dCB0byBkZWZpbmUgYSBwcm9wZXJ0eSBmb3IgYSBjbGFzcy4gVGhpcyBpcyB1c2VkIHRvIHNvbHZlIHRoZSBwcm9ibGVtXHJcbiMgdGhhdCBDb2ZmZWVTY3JpcHQgZGlkbid0IHN1cHBvcnQgZ2V0dGVycyBhbmQgc2V0dGVycy5cclxuIyBjbGFzcyBQZXJzb25cclxuIyAgIEBjb25zdHJ1Y3RvcjogKGFnZSkgLT5cclxuIyAgICAgQF9hZ2UgPSBhZ2VcclxuI1xyXG4jICAgQHByb3BlcnR5ICdhZ2UnLFxyXG4jICAgICBnZXQ6IC0+IEBfYWdlXHJcbiMgICAgIHNldDogKHZhbCkgLT5cclxuIyAgICAgICBAX2FnZSA9IHZhbFxyXG4jXHJcbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjXHJcblxyXG4jIE1ha2UgYSBjb3B5IG9mIHRoaXMgZnVuY3Rpb24gd2hpY2ggaGFzIGEgbGltaXRlZCBzaG9ydGVzdCBleGVjdXRpbmcgaW50ZXJ2YWwuXHJcbkZ1bmN0aW9uOjp0aHJvdHRsZSA9IChsaW1pdCA9IDAuNSkgLT5cclxuXHRjdXJyVGltZSA9IDBcclxuXHRsYXN0VGltZSA9IDBcclxuXHJcblx0cmV0dXJuICgpID0+XHJcblx0XHRjdXJyVGltZSA9IERhdGUubm93KClcclxuXHRcdGlmIGN1cnJUaW1lIC0gbGFzdFRpbWUgPiBsaW1pdCAqIDEwMDBcclxuXHRcdFx0QGFwcGx5IG51bGwsIGFyZ3VtZW50c1xyXG5cdFx0XHRsYXN0VGltZSA9IGN1cnJUaW1lXHJcblxyXG4jIE1ha2UgYSBjb3B5IG9mIHRoaXMgZnVuY3Rpb24gd2hvc2UgZXhlY3V0aW9uIHdpbGwgYmUgY29udGludW91c2x5IHB1dCBvZmZcclxuIyBhZnRlciBldmVyeSBjYWxsaW5nIG9mIHRoaXMgZnVuY3Rpb24uXHJcbkZ1bmN0aW9uOjpkZWJvdW5jZSA9IChkZWxheSA9IDAuNSkgLT5cclxuXHRhcmdzID0gbnVsbFxyXG5cdHRpbWVvdXQgPSBudWxsXHJcblxyXG5cdGxhdGVyID0gPT5cclxuXHRcdEBhcHBseSBudWxsLCBhcmdzXHJcblxyXG5cdHJldHVybiAoKSAtPlxyXG5cdFx0YXJncyA9IGFyZ3VtZW50c1xyXG5cdFx0Y2xlYXJUaW1lb3V0IHRpbWVvdXRcclxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0IGxhdGVyLCBkZWxheSAqIDEwMDBcclxuXHJcblxyXG4jIEl0ZXJhdGUgdGhpcyBBcnJheSBhbmQgZG8gc29tZXRoaW5nIHdpdGggdGhlIGl0ZW1zLlxyXG5BcnJheTo6ZWFjaCBvcj0gKGZuKSAtPlxyXG5cdGkgPSAwXHJcblx0d2hpbGUgaSA8IEBsZW5ndGhcclxuXHRcdGZuIEBbaV1cclxuXHRcdGkrK1xyXG5cdHJldHVybiBAXHJcblxyXG4jIEl0ZXJhdGUgdGhpcyBBcnJheSBhbmQgbWFwIHRoZSBpdGVtcyB0byBhIG5ldyBBcnJheS5cclxuQXJyYXk6Om1hcCBvcj0gKGZuKSAtPlxyXG5cdGFyciA9IFtdXHJcblx0aSA9IDBcclxuXHR3aGlsZSBpIDwgQGxlbmd0aFxyXG5cdFx0YXJyLnB1c2ggZm4oQFtpXSlcclxuXHRcdGkrK1xyXG5cdHJldHVybiBAXHJcblxyXG4jIERpc3BsYXkgb3duIGxpYiBpbmZvLiBJdCB3aWxsIGFwcGVhciBvbmUgdGltZSBwZXIgbWludXRlIGF0IG1vc3QuXHJcbmxhc3RCb290VGltZSA9IEJ1LmRhdGEgJ2xhc3RJbmZvJ1xyXG5jdXJyZW50VGltZSA9IERhdGUubm93KClcclxudW5sZXNzIGxhc3RCb290VGltZT8gYW5kIGN1cnJlbnRUaW1lIC0gbGFzdEJvb3RUaW1lIDwgNjAgKiAxMDAwXHJcblx0Y29uc29sZS5pbmZvPyAnQnUuanMgdicgKyBCdS5WRVJTSU9OICsgJyAtIFtodHRwczovL2dpdGh1Yi5jb20vamFydmlzbml1L0J1LmpzXSdcclxuXHRCdS5kYXRhICdsYXN0SW5mbycsIGN1cnJlbnRUaW1lXHJcbiIsIiMjIGF4aXMgYWxpZ25lZCBib3VuZGluZyBib3hcclxuXHJcbmNsYXNzIEJ1LkJvdW5kc1xyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XHJcblxyXG5cdFx0QHgxID0gQHkxID0gQHgyID0gQHkyID0gMFxyXG5cdFx0QGlzRW1wdHkgPSB0cnVlXHJcblxyXG5cdFx0QHBvaW50MSA9IG5ldyBCdS5WZWN0b3JcclxuXHRcdEBwb2ludDIgPSBuZXcgQnUuVmVjdG9yXHJcblxyXG5cdFx0QHN0cm9rZVN0eWxlID0gQnUuREVGQVVMVF9CT1VORF9TVFJPS0VfU1RZTEVcclxuXHRcdEBkYXNoU3R5bGUgPSBCdS5ERUZBVUxUX0JPVU5EX0RBU0hfU1RZTEVcclxuXHRcdEBkYXNoT2Zmc2V0ID0gMFxyXG5cclxuXHRcdHN3aXRjaCBAdGFyZ2V0LnR5cGVcclxuXHRcdFx0d2hlbiAnTGluZScsICdUcmlhbmdsZScsICdSZWN0YW5nbGUnXHJcblx0XHRcdFx0Zm9yIHYgaW4gQHRhcmdldC5wb2ludHNcclxuXHRcdFx0XHRcdEBleHBhbmRCeVBvaW50KHYpXHJcblx0XHRcdHdoZW4gJ0NpcmNsZScsICdCb3cnLCAnRmFuJ1xyXG5cdFx0XHRcdEBleHBhbmRCeUNpcmNsZShAdGFyZ2V0KVxyXG5cdFx0XHRcdEB0YXJnZXQub24gJ2NlbnRlckNoYW5nZWQnLCA9PlxyXG5cdFx0XHRcdFx0QGNsZWFyKClcclxuXHRcdFx0XHRcdEBleHBhbmRCeUNpcmNsZSBAdGFyZ2V0XHJcblx0XHRcdFx0QHRhcmdldC5vbiAncmFkaXVzQ2hhbmdlZCcsID0+XHJcblx0XHRcdFx0XHRAY2xlYXIoKVxyXG5cdFx0XHRcdFx0QGV4cGFuZEJ5Q2lyY2xlIEB0YXJnZXRcclxuXHRcdFx0d2hlbiAnUG9seWxpbmUnLCAnUG9seWdvbidcclxuXHRcdFx0XHRmb3IgdiBpbiBAdGFyZ2V0LnZlcnRpY2VzXHJcblx0XHRcdFx0XHRAZXhwYW5kQnlQb2ludCh2KVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS53YXJuICdCb3VuZHM6IG5vdCBzdXBwb3J0IHNoYXBlIHR5cGUgXCInICsgQHRhcmdldC50eXBlICsgJ1wiJ1xyXG5cclxuXHRjb250YWluc1BvaW50OiAocCkgLT5cclxuXHRcdEB4MSA8IHAueCAmJiBAeDIgPiBwLnggJiYgQHkxIDwgcC55ICYmIEB5MiA+IHAueVxyXG5cclxuXHRjbGVhcjogKCkgLT5cclxuXHRcdEB4MSA9IEB5MSA9IEB4MiA9IEB5MiA9IDBcclxuXHRcdEBpc0VtcHR5ID0gdHJ1ZVxyXG5cclxuXHRleHBhbmRCeVBvaW50OiAodikgLT5cclxuXHRcdGlmIEBpc0VtcHR5XHJcblx0XHRcdEBpc0VtcHR5ID0gZmFsc2VcclxuXHRcdFx0QHgxID0gQHgyID0gdi54XHJcblx0XHRcdEB5MSA9IEB5MiA9IHYueVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAeDEgPSB2LnggaWYgdi54IDwgQHgxXHJcblx0XHRcdEB4MiA9IHYueCBpZiB2LnggPiBAeDJcclxuXHRcdFx0QHkxID0gdi55IGlmIHYueSA8IEB5MVxyXG5cdFx0XHRAeTIgPSB2LnkgaWYgdi55ID4gQHkyXHJcblxyXG5cdGV4cGFuZEJ5Q2lyY2xlOiAoYykgLT5cclxuXHRcdGNwID0gYy5jZW50ZXJcclxuXHRcdHIgPSBjLnJhZGl1c1xyXG5cdFx0aWYgQGlzRW1wdHlcclxuXHRcdFx0QGlzRW1wdHkgPSBmYWxzZVxyXG5cdFx0XHRAeDEgPSBjcC54IC0gclxyXG5cdFx0XHRAeDIgPSBjcC54ICsgclxyXG5cdFx0XHRAeTEgPSBjcC55IC0gclxyXG5cdFx0XHRAeTIgPSBjcC55ICsgclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAeDEgPSBjcC54IC0gciBpZiBjcC54IC0gciA8IEB4MVxyXG5cdFx0XHRAeDIgPSBjcC54ICsgciBpZiBjcC54ICsgciA+IEB4MlxyXG5cdFx0XHRAeTEgPSBjcC55IC0gciBpZiBjcC55IC0gciA8IEB5MVxyXG5cdFx0XHRAeTIgPSBjcC55ICsgciBpZiBjcC55ICsgciA+IEB5MlxyXG4iLCIjIHRoZSBzaXplIG9mIHJlY3RhbmdsZSwgQm91bmRzIGV0Yy5cclxuXHJcbmNsYXNzIEJ1LlNpemVcclxuXHRjb25zdHJ1Y3RvcjogKEB3aWR0aCwgQGhlaWdodCkgLT5cclxuXHRcdEB0eXBlID0gJ1NpemUnXHJcblxyXG5cdHNldDogKHdpZHRoLCBoZWlnaHQpIC0+XHJcblx0XHRAd2lkdGggPSB3aWR0aFxyXG5cdFx0QGhlaWdodCA9IGhlaWdodFxyXG4iLCIjIDJkIHZlY3RvclxyXG5cclxuY2xhc3MgQnUuVmVjdG9yXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHggPSAwLCBAeSA9IDApIC0+XHJcblxyXG5cdHNldDogKEB4LCBAeSkgLT5cclxuIiwiIyBBZGQgY29sb3IgdG8gdGhlIHNoYXBlc1xyXG5cclxuQnUuQ29sb3JmdWwgPSAoKSAtPlxyXG5cdEBzdHJva2VTdHlsZSA9IEJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFXHJcblx0QGZpbGxTdHlsZSA9IEJ1LkRFRkFVTFRfRklMTF9TVFlMRVxyXG5cdEBkYXNoU3R5bGUgPSBmYWxzZVxyXG5cclxuXHRAbGluZVdpZHRoID0gMVxyXG5cdEBkYXNoT2Zmc2V0ID0gMFxyXG5cclxuXHRAc3Ryb2tlID0gKHYpIC0+XHJcblx0XHR2ID0gdHJ1ZSBpZiBub3Qgdj9cclxuXHRcdHN3aXRjaCB2XHJcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBzdHJva2VTdHlsZSA9IEJ1LkRFRkFVTFRfU1RST0tFX1NUWUxFXHJcblx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAc3Ryb2tlU3R5bGUgPSBudWxsXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAc3Ryb2tlU3R5bGUgPSB2XHJcblx0XHRAXHJcblxyXG5cdEBmaWxsID0gKHYpIC0+XHJcblx0XHR2ID0gdHJ1ZSBpZiBub3Qgdj9cclxuXHRcdHN3aXRjaCB2XHJcblx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAZmlsbFN0eWxlID0gbnVsbFxyXG5cdFx0XHR3aGVuIHRydWUgdGhlbiBAZmlsbFN0eWxlID0gQnUuREVGQVVMVF9GSUxMX1NUWUxFXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAZmlsbFN0eWxlID0gdlxyXG5cdFx0QFxyXG5cclxuXHRAZGFzaCA9ICh2KSAtPlxyXG5cdFx0diA9IHRydWUgaWYgbm90IHY/XHJcblx0XHR2ID0gW3YsIHZdIGlmIHR5cGVvZiB2IGlzICdudW1iZXInXHJcblx0XHRzd2l0Y2ggdlxyXG5cdFx0XHR3aGVuIGZhbHNlIHRoZW4gQGRhc2hTdHlsZSA9IG51bGxcclxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gQGRhc2hTdHlsZSA9IEJ1LkRFRkFVTFRfREFTSF9TVFlMRVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGRhc2hTdHlsZSA9IHZcclxuXHRcdEBcclxuIiwiIyBhZGQgZXZlbnQgbGlzdGVuZXIgdG8gY3VzdG9tIG9iamVjdHNcclxuQnUuRXZlbnQgPSAtPlxyXG5cdHR5cGVzID0ge31cclxuXHJcblx0QG9uID0gKHR5cGUsIGxpc3RlbmVyKSAtPlxyXG5cdFx0bGlzdGVuZXJzID0gdHlwZXNbdHlwZV0gb3I9IFtdXHJcblx0XHRsaXN0ZW5lcnMucHVzaCBsaXN0ZW5lciBpZiBsaXN0ZW5lcnMuaW5kZXhPZiBsaXN0ZW5lciA9PSAtMVxyXG5cclxuXHRAb25jZSA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVyLm9uY2UgPSB0cnVlXHJcblx0XHRAb24gdHlwZSwgbGlzdGVuZXJcclxuXHJcblx0QG9mZiA9ICh0eXBlLCBsaXN0ZW5lcikgLT5cclxuXHRcdGxpc3RlbmVycyA9IHR5cGVzW3R5cGVdXHJcblx0XHRpZiBsaXN0ZW5lcj9cclxuXHRcdFx0aWYgbGlzdGVuZXJzP1xyXG5cdFx0XHRcdGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YgbGlzdGVuZXJcclxuXHRcdFx0XHRsaXN0ZW5lcnMuc3BsaWNlIGluZGV4LCAxIGlmIGluZGV4ID4gLTFcclxuXHRcdGVsc2VcclxuXHRcdFx0bGlzdGVuZXJzLmxlbmd0aCA9IDAgaWYgbGlzdGVuZXJzP1xyXG5cclxuXHRAdHJpZ2dlciA9ICh0eXBlLCBldmVudERhdGEpIC0+XHJcblx0XHRsaXN0ZW5lcnMgPSB0eXBlc1t0eXBlXVxyXG5cclxuXHRcdGlmIGxpc3RlbmVycz9cclxuXHRcdFx0ZXZlbnREYXRhIG9yPSB7fVxyXG5cdFx0XHRldmVudERhdGEudGFyZ2V0ID0gQFxyXG5cdFx0XHRmb3IgbGlzdGVuZXIgaW4gbGlzdGVuZXJzXHJcblx0XHRcdFx0bGlzdGVuZXIuY2FsbCB0aGlzLCBldmVudERhdGFcclxuXHRcdFx0XHRpZiBsaXN0ZW5lci5vbmNlXHJcblx0XHRcdFx0XHRsaXN0ZW5lcnMuc3BsaWNlIGksIDFcclxuXHRcdFx0XHRcdGkgLT0gMVxyXG4iLCIjIyNcclxuIyBNaWNyb0pRdWVyeSAtIEEgbWljcm8gdmVyc2lvbiBvZiBqUXVlcnlcclxuI1xyXG4jIFN1cHBvcnRlZCBmZWF0dXJlczpcclxuIyAgICQuIC0gc3RhdGljIG1ldGhvZHNcclxuIyAgICAgLnJlYWR5KGNiKSAtIGNhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBwYWdlIGlzIGxvYWRlZFxyXG4jICAgICAuYWpheChbdXJsLF0gb3B0aW9ucykgLSBwZXJmb3JtIGFuIGFqYXggcmVxdWVzdFxyXG4jICAgJChzZWxlY3RvcikgLSBzZWxlY3QgZWxlbWVudChzKVxyXG4jICAgICAub24odHlwZSwgY2FsbGJhY2spIC0gYWRkIGFuIGV2ZW50IGxpc3RlbmVyXHJcbiMgICAgIC5vZmYodHlwZSwgY2FsbGJhY2spIC0gcmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyXHJcbiMgICAgIC5hcHBlbmQodGFnTmFtZSkgLSBhcHBlbmQgYSB0YWdcclxuIyAgICAgLnRleHQodGV4dCkgLSBzZXQgdGhlIGlubmVyIHRleHRcclxuIyAgICAgLmh0bWwoaHRtbFRleHQpIC0gc2V0IHRoZSBpbm5lciBIVE1MXHJcbiMgICAgIC5zdHlsZShuYW1lLCB2YWx1ZSkgLSBzZXQgc3R5bGUgKGEgY3NzIGF0dHJpYnV0ZSlcclxuIyAgICAgIy5jc3Mob2JqZWN0KSAtIHNldCBzdHlsZXMgKG11bHRpcGxlIGNzcyBhdHRyaWJ1dGUpXHJcbiMgICAgIC5oYXNDbGFzcyhjbGFzc05hbWUpIC0gZGV0ZWN0IHdoZXRoZXIgYSBjbGFzcyBleGlzdHNcclxuIyAgICAgLmFkZENsYXNzKGNsYXNzTmFtZSkgLSBhZGQgYSBjbGFzc1xyXG4jICAgICAucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSAtIHJlbW92ZSBhIGNsYXNzXHJcbiMgICAgIC50b2dnbGVDbGFzcyhjbGFzc05hbWUpIC0gdG9nZ2xlIGEgY2xhc3NcclxuIyAgICAgLmF0dHIobmFtZSwgdmFsdWUpIC0gc2V0IGFuIGF0dHJpYnV0ZVxyXG4jICAgICAuaGFzQXR0cihuYW1lKSAtIGRldGVjdCB3aGV0aGVyIGFuIGF0dHJpYnV0ZSBleGlzdHNcclxuIyAgICAgLnJlbW92ZUF0dHIobmFtZSkgLSByZW1vdmUgYW4gYXR0cmlidXRlXHJcbiMgICBOb3RlczpcclxuIyAgICAgICAgIyBpcyBwbGFubmVkIGJ1dCBub3QgaW1wbGVtZW50ZWRcclxuIyMjXHJcblxyXG4oKGdsb2JhbCkgLT5cclxuXHJcblx0IyBzZWxlY3RvclxyXG5cdGdsb2JhbC4kID0gKHNlbGVjdG9yKSAtPlxyXG5cdFx0c2VsZWN0aW9ucyA9IFtdXHJcblx0XHRpZiB0eXBlb2Ygc2VsZWN0b3IgPT0gJ3N0cmluZydcclxuXHRcdFx0c2VsZWN0aW9ucyA9IFtdLnNsaWNlLmNhbGwgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCBzZWxlY3RvclxyXG5cdFx0alF1ZXJ5LmFwcGx5IHNlbGVjdGlvbnNcclxuXHRcdHNlbGVjdGlvbnNcclxuXHJcblx0alF1ZXJ5ID0gLT5cclxuXHJcblx0XHQjIGV2ZW50XHJcblx0XHRAb24gPSAodHlwZSwgY2FsbGJhY2spID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLmFkZEV2ZW50TGlzdGVuZXIgdHlwZSwgY2FsbGJhY2tcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBvZmYgPSAodHlwZSwgY2FsbGJhY2spID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0ZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIgdHlwZSwgY2FsbGJhY2tcclxuXHRcdFx0QFxyXG5cclxuXHRcdCMgRE9NIE1hbmlwdWxhdGlvblxyXG5cclxuXHRcdFNWR19UQUdTID0gJ3N2ZyBsaW5lIHJlY3QgY2lyY2xlIGVsbGlwc2UgcG9seWxpbmUgcG9seWdvbiBwYXRoIHRleHQnXHJcblxyXG5cdFx0QGFwcGVuZCA9ICh0YWcpID0+XHJcblx0XHRcdEBlYWNoIChkb20sIGkpID0+XHJcblx0XHRcdFx0dGFnSW5kZXggPSBTVkdfVEFHUy5pbmRleE9mIHRhZy50b0xvd2VyQ2FzZSgpXHJcblx0XHRcdFx0aWYgdGFnSW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0bmV3RG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIHRhZ1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG5ld0RvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgdGFnXHJcblx0XHRcdFx0QFtpXSA9IGRvbS5hcHBlbmRDaGlsZCBuZXdEb21cclxuXHRcdFx0QFxyXG5cclxuXHRcdEB0ZXh0ID0gKHN0cikgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRkb20udGV4dENvbnRlbnQgPSBzdHJcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBodG1sID0gKHN0cikgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRkb20uaW5uZXJIVE1MID0gc3RyXHJcblx0XHRcdEBcclxuXHJcblx0XHRAc3R5bGUgPSAobmFtZSwgdmFsdWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0c3R5bGVUZXh0ID0gZG9tLmdldEF0dHJpYnV0ZSAnc3R5bGUnXHJcblx0XHRcdFx0c3R5bGVzID0ge31cclxuXHRcdFx0XHRpZiBzdHlsZVRleHRcclxuXHRcdFx0XHRcdHN0eWxlVGV4dC5zcGxpdCgnOycpLmVhY2ggKG4pIC0+XHJcblx0XHRcdFx0XHRcdG52ID0gbi5zcGxpdCAnOidcclxuXHRcdFx0XHRcdFx0c3R5bGVzW252WzBdXSA9IG52WzFdXHJcblx0XHRcdFx0c3R5bGVzW25hbWVdID0gdmFsdWVcclxuXHRcdFx0XHQjIGNvbmNhdFxyXG5cdFx0XHRcdHN0eWxlVGV4dCA9ICcnXHJcblx0XHRcdFx0Zm9yIGkgb2Ygc3R5bGVzXHJcblx0XHRcdFx0XHRzdHlsZVRleHQgKz0gaSArICc6ICcgKyBzdHlsZXNbaV0gKyAnOyAnXHJcblx0XHRcdFx0ZG9tLnNldEF0dHJpYnV0ZSAnc3R5bGUnLCBzdHlsZVRleHRcclxuXHRcdFx0QFxyXG5cclxuXHRcdEBoYXNDbGFzcyA9IChuYW1lKSA9PlxyXG5cdFx0XHRpZiBAbGVuZ3RoID09IDBcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0IyBpZiBtdWx0aXBsZSwgZXZlcnkgRE9NIHNob3VsZCBoYXZlIHRoZSBjbGFzc1xyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHR3aGlsZSBpIDwgQGxlbmd0aFxyXG5cdFx0XHRcdGNsYXNzVGV4dCA9IEBbaV0uZ2V0QXR0cmlidXRlICdjbGFzcycgb3IgJydcclxuXHRcdFx0XHQjIG5vdCB1c2UgJyAnIHRvIGF2b2lkIG11bHRpcGxlIHNwYWNlcyBsaWtlICdhICAgYidcclxuXHRcdFx0XHRjbGFzc2VzID0gY2xhc3NUZXh0LnNwbGl0IFJlZ0V4cCAnICsnXHJcblx0XHRcdFx0aWYgIWNsYXNzZXMuY29udGFpbnMgbmFtZVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdFx0aSsrXHJcblx0XHRcdEBcclxuXHJcblx0XHRAYWRkQ2xhc3MgPSAobmFtZSkgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRjbGFzc1RleHQgPSBkb20uZ2V0QXR0cmlidXRlICdjbGFzcycgb3IgJydcclxuXHRcdFx0XHRjbGFzc2VzID0gY2xhc3NUZXh0LnNwbGl0IFJlZ0V4cCAnICsnXHJcblx0XHRcdFx0aWYgbm90IGNsYXNzZXMuY29udGFpbnMgbmFtZVxyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoIG5hbWVcclxuXHRcdFx0XHRcdGRvbS5zZXRBdHRyaWJ1dGUgJ2NsYXNzJywgY2xhc3Nlcy5qb2luICcgJ1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHJlbW92ZUNsYXNzID0gKG5hbWUpID0+XHJcblx0XHRcdEBlYWNoIChkb20pIC0+XHJcblx0XHRcdFx0Y2xhc3NUZXh0ID0gZG9tLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBvciAnJ1xyXG5cdFx0XHRcdGNsYXNzZXMgPSBjbGFzc1RleHQuc3BsaXQgUmVnRXhwICcgKydcclxuXHRcdFx0XHRpZiBjbGFzc2VzLmNvbnRhaW5zIG5hbWVcclxuXHRcdFx0XHRcdGNsYXNzZXMucmVtb3ZlIG5hbWVcclxuXHRcdFx0XHRcdGlmIGNsYXNzZXMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRkb20uc2V0QXR0cmlidXRlICdjbGFzcycsIGNsYXNzZXMuam9pbiAnICdcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0ZG9tLnJlbW92ZUF0dHJpYnV0ZSAnY2xhc3MnXHJcblx0XHRcdEBcclxuXHJcblx0XHRAdG9nZ2xlQ2xhc3MgPSAobmFtZSkgPT5cclxuXHRcdFx0QGVhY2ggKGRvbSkgLT5cclxuXHRcdFx0XHRjbGFzc1RleHQgPSBkb20uZ2V0QXR0cmlidXRlICdjbGFzcycgb3IgJydcclxuXHRcdFx0XHRjbGFzc2VzID0gY2xhc3NUZXh0LnNwbGl0IFJlZ0V4cCAnICsnXHJcblx0XHRcdFx0aWYgY2xhc3Nlcy5jb250YWlucyBuYW1lXHJcblx0XHRcdFx0XHRjbGFzc2VzLnJlbW92ZSBuYW1lXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoIG5hbWVcclxuXHRcdFx0XHRpZiBjbGFzc2VzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdGRvbS5zZXRBdHRyaWJ1dGUgJ2NsYXNzJywgY2xhc3Nlcy5qb2luICcgJ1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGRvbS5yZW1vdmVBdHRyaWJ1dGUgJ2NsYXNzJ1xyXG5cdFx0XHRAXHJcblxyXG5cdFx0QGF0dHIgPSAobmFtZSwgdmFsdWUpID0+XHJcblx0XHRcdGlmIHZhbHVlP1xyXG5cdFx0XHRcdEBlYWNoIChkb20pIC0+IGRvbS5zZXRBdHRyaWJ1dGUgbmFtZSwgdmFsdWVcclxuXHRcdFx0XHRyZXR1cm4gQFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIEBbMF0uZ2V0QXR0cmlidXRlIG5hbWVcclxuXHJcblx0XHRAaGFzQXR0ciA9IChuYW1lKSA9PlxyXG5cdFx0XHRpZiBAbGVuZ3RoID09IDBcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0d2hpbGUgaSA8IEBsZW5ndGhcclxuXHRcdFx0XHRpZiBub3QgQFtpXS5oYXNBdHRyaWJ1dGUgbmFtZVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdFx0aSsrXHJcblx0XHRcdEBcclxuXHJcblx0XHRAcmVtb3ZlQXR0ciA9IChuYW1lKSA9PlxyXG5cdFx0XHRAZWFjaCAoZG9tKSAtPlxyXG5cdFx0XHRcdGRvbS5yZW1vdmVBdHRyaWJ1dGUgbmFtZVxyXG5cdFx0XHRAXHJcblxyXG5cdFx0QHZhbCA9ID0+IEBbMF0/LnZhbHVlXHJcblxyXG5cdCMgJC5yZWFkeSgpXHJcblx0Z2xvYmFsLiQucmVhZHkgPSAob25Mb2FkKSAtPlxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnRE9NQ29udGVudExvYWRlZCcsIG9uTG9hZFxyXG5cclxuXHQjIyMgJC5hamF4KClcclxuXHRcdG9wdGlvbnM6XHJcblx0XHRcdHVybDogc3RyaW5nXHJcblx0XHRcdD09PT1cclxuXHRcdFx0YXN5bmMgPSB0cnVlOiBib29sXHJcblx0XHRcdCMjIGRhdGE6IG9iamVjdCAtIHF1ZXJ5IHBhcmFtZXRlcnMgVE9ETzogaW1wbGVtZW50IHRoaXNcclxuXHRcdFx0bWV0aG9kID0gR0VUOiBQT1NULCBQVVQsIERFTEVURSwgSEVBRFxyXG5cdFx0XHR1c2VybmFtZTogc3RyaW5nXHJcblx0XHRcdHBhc3N3b3JkOiBzdHJpbmdcclxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb25cclxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uXHJcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvblxyXG5cdCMjI1xyXG5cdGdsb2JhbC4kLmFqYXggPSAodXJsLCBvcHMpIC0+XHJcblx0XHRpZiAhb3BzXHJcblx0XHRcdGlmIHR5cGVvZiB1cmwgPT0gJ29iamVjdCdcclxuXHRcdFx0XHRvcHMgPSB1cmxcclxuXHRcdFx0XHR1cmwgPSBvcHMudXJsXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvcHMgPSB7fVxyXG5cdFx0b3BzLm1ldGhvZCBvcj0gJ0dFVCdcclxuXHRcdG9wcy5hc3luYyA9IHRydWUgdW5sZXNzIG9wcy5hc3luYz9cclxuXHJcblx0XHR4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3RcclxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAtPlxyXG5cdFx0XHRpZiB4aHIucmVhZHlTdGF0ZSA9PSA0XHJcblx0XHRcdFx0aWYgeGhyLnN0YXR1cyA9PSAyMDBcclxuXHRcdFx0XHRcdG9wcy5zdWNjZXNzIHhoci5yZXNwb25zZVRleHQsIHhoci5zdGF0dXMsIHhociBpZiBvcHMuc3VjY2Vzcz9cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvcHMuZXJyb3IgeGhyLCB4aHIuc3RhdHVzIGlmIG9wcy5lcnJvcj9cclxuXHRcdFx0XHRcdG9wcy5jb21wbGV0ZSB4aHIsIHhoci5zdGF0dXMgaWYgb3BzLmNvbXBsZXRlP1xyXG5cclxuXHRcdHhoci5vcGVuIG9wcy5tZXRob2QsIHVybCwgb3BzLmFzeW5jLCBvcHMudXNlcm5hbWUsIG9wcy5wYXNzd29yZFxyXG5cdFx0eGhyLnNlbmQgbnVsbCkgQnUuZ2xvYmFsXHJcbiIsIiMgaGllcmFyY2h5IG1hbmFnZVxyXG5cclxuY2xhc3MgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6ICgpIC0+XHJcblx0XHRCdS5Db2xvcmZ1bC5hcHBseSBAXHJcblx0XHRCdS5FdmVudC5hcHBseSBAXHJcblxyXG5cdFx0QHZpc2libGUgPSB5ZXNcclxuXHRcdEBvcGFjaXR5ID0gMVxyXG5cclxuXHRcdEB0cmFuc2xhdGUgPSBuZXcgQnUuVmVjdG9yXHJcblx0XHRAcm90YXRpb24gPSAwXHJcblx0XHRAX3NjYWxlID0gbmV3IEJ1LlZlY3RvciAxLCAxXHJcblx0XHRAc2tldyA9IG5ldyBCdS5WZWN0b3JcclxuXHJcblx0XHQjQHRvV29ybGRNYXRyaXggPSBuZXcgQnUuTWF0cml4KClcclxuXHRcdCNAdXBkYXRlTWF0cml4IC0+XHJcblxyXG5cdFx0QGJvdW5kcyA9IG51bGwgIyBmb3IgYWNjZWxlcmF0ZSBjb250YWluIHRlc3RcclxuXHRcdEBrZXlQb2ludHMgPSBudWxsXHJcblx0XHRAY2hpbGRyZW4gPSBbXVxyXG5cdFx0QHBhcmVudCA9IG51bGxcclxuXHJcblx0QHByb3BlcnR5ICdzY2FsZScsXHJcblx0XHRnZXQ6IC0+IEBfc2NhbGVcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0aWYgdHlwZW9mIHZhbCA9PSAnbnVtYmVyJ1xyXG5cdFx0XHRcdEBfc2NhbGUueCA9IEBfc2NhbGUueSA9IHZhbFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QHNjYWxlID0gdmFsXHJcblxyXG5cdGFuaW1hdGU6IChhbmltLCBhcmdzKSAtPlxyXG5cdFx0aWYgdHlwZW9mIGFuaW0gPT0gJ3N0cmluZydcclxuXHRcdFx0aWYgYW5pbSBvZiBCdS5hbmltYXRpb25zXHJcblx0XHRcdFx0QnUuYW5pbWF0aW9uc1thbmltXS5hcHBseSBALCBhcmdzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJCdS5hbmltYXRpb25zW1xcXCIjeyBhbmltIH1cXFwiXSBkb2Vzbid0IGV4aXN0cy5cIlxyXG5cdFx0ZWxzZSBpZiBhbmltIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0YXJncyA9IFthcmdzXSB1bmxlc3MgYXJncyBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRcdEBhbmltYXRlIGFuaW1baV0sIGFyZ3MgZm9yIG93biBpIG9mIGFuaW1cclxuXHRcdGVsc2VcclxuXHRcdFx0YW5pbS5hcHBseSBALCBhcmdzXHJcblxyXG5cdGNvbnRhaW5zUG9pbnQ6IChwKSAtPlxyXG5cdFx0aWYgQGJvdW5kcz8gYW5kIG5vdCBAYm91bmRzLmNvbnRhaW5zUG9pbnQgcFxyXG5cdFx0XHRyZXR1cm4gbm9cclxuXHRcdGVsc2UgaWYgQF9jb250YWluc1BvaW50XHJcblx0XHRcdHJldHVybiBAX2NvbnRhaW5zUG9pbnQgcFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gbm9cclxuIiwiIyBjYW52YXMgcmVuZGVyZXJcclxuXHJcbmNsYXNzIEJ1LlJlbmRlcmVyXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxyXG5cdFx0QnUuRXZlbnQuYXBwbHkgQFxyXG5cdFx0QHR5cGUgPSAnUmVuZGVyZXInXHJcblxyXG5cdFx0b3B0aW9ucyA9IEJ1LmNvbWJpbmVPcHRpb25zIGFyZ3VtZW50cyxcclxuXHRcdFx0d2lkdGg6IDgwMFxyXG5cdFx0XHRoZWlnaHQ6IDYwMFxyXG5cdFx0XHRmcHM6IDYwXHJcblx0XHRcdGZpbGxQYXJlbnQ6IG9mZlxyXG5cdFx0XHRzaG93S2V5UG9pbnRzOiBub1xyXG5cdFx0XHRib3JkZXI6IG9mZlxyXG5cdFx0QHdpZHRoID0gb3B0aW9ucy53aWR0aFxyXG5cdFx0QGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XHJcblx0XHRAZnBzID0gb3B0aW9ucy5mcHNcclxuXHRcdEBjb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lclxyXG5cdFx0QGZpbGxQYXJlbnQgPSBvcHRpb25zLmZpbGxQYXJlbnRcclxuXHRcdEBpc1Nob3dLZXlQb2ludHMgPSBvcHRpb25zLnNob3dLZXlQb2ludHNcclxuXHJcblx0XHRAdGlja0NvdW50ID0gMFxyXG5cdFx0QGlzUnVubmluZyA9IG5vXHJcblxyXG5cdFx0QHBpeGVsUmF0aW8gPSBCdS5nbG9iYWwuZGV2aWNlUGl4ZWxSYXRpbyBvciAxXHJcblxyXG5cdFx0QGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcclxuXHRcdEBjb250ZXh0ID0gQGRvbS5nZXRDb250ZXh0ICcyZCdcclxuXHRcdEBjb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnXHJcblx0XHRAY2xpcE1ldGVyID0gbmV3IENsaXBNZXRlcigpIGlmIENsaXBNZXRlcj9cclxuXHJcblx0XHQjIEFQSVxyXG5cdFx0QHNoYXBlcyA9IFtdXHJcblxyXG5cdFx0aWYgbm90IEBmaWxsUGFyZW50XHJcblx0XHRcdEBkb20uc3R5bGUud2lkdGggPSBAd2lkdGggKyAncHgnXHJcblx0XHRcdEBkb20uc3R5bGUuaGVpZ2h0ID0gQGhlaWdodCArICdweCdcclxuXHRcdFx0QGRvbS53aWR0aCA9IEB3aWR0aCAqIEBwaXhlbFJhdGlvXHJcblx0XHRcdEBkb20uaGVpZ2h0ID0gQGhlaWdodCAqIEBwaXhlbFJhdGlvXHJcblx0XHRAZG9tLnN0eWxlLmJvcmRlciA9ICdzb2xpZCAxcHggZ3JheScgaWYgb3B0aW9ucy5ib3JkZXI/IGFuZCBvcHRpb25zLmJvcmRlclxyXG5cdFx0QGRvbS5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJ1xyXG5cdFx0QGRvbS5zdHlsZS5ib3hTaXppbmcgPSAnY29udGVudC1ib3gnXHJcblx0XHRAZG9tLnN0eWxlLmJhY2tncm91bmQgPSAnI2VlZSdcclxuXHRcdEBkb20ub25jb250ZXh0bWVudSA9IC0+IGZhbHNlXHJcblxyXG5cdFx0QnUuYW5pbWF0aW9uUnVubmVyPy5ob29rVXAgQFxyXG5cclxuXHRcdG9uUmVzaXplID0gPT5cclxuXHRcdFx0Y2FudmFzUmF0aW8gPSBAZG9tLmhlaWdodCAvIEBkb20ud2lkdGhcclxuXHRcdFx0Y29udGFpbmVyUmF0aW8gPSBAY29udGFpbmVyLmNsaWVudEhlaWdodCAvIEBjb250YWluZXIuY2xpZW50V2lkdGhcclxuXHRcdFx0aWYgY29udGFpbmVyUmF0aW8gPCBjYW52YXNSYXRpb1xyXG5cdFx0XHRcdGhlaWdodCA9IEBjb250YWluZXIuY2xpZW50SGVpZ2h0XHJcblx0XHRcdFx0d2lkdGggPSBoZWlnaHQgLyBjb250YWluZXJSYXRpb1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0d2lkdGggPSBAY29udGFpbmVyLmNsaWVudFdpZHRoXHJcblx0XHRcdFx0aGVpZ2h0ID0gd2lkdGggKiBjb250YWluZXJSYXRpb1xyXG5cdFx0XHRAd2lkdGggPSBAZG9tLndpZHRoID0gd2lkdGggKiBAcGl4ZWxSYXRpb1xyXG5cdFx0XHRAaGVpZ2h0ID0gQGRvbS5oZWlnaHQgPSBoZWlnaHQgKiBAcGl4ZWxSYXRpb1xyXG5cdFx0XHRAZG9tLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnXHJcblx0XHRcdEBkb20uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4J1xyXG5cdFx0XHRAcmVuZGVyKClcclxuXHJcblx0XHRpZiBAZmlsbFBhcmVudFxyXG5cdFx0XHRCdS5nbG9iYWwud2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIG9uUmVzaXplXHJcblx0XHRcdEBkb20uYWRkRXZlbnRMaXN0ZW5lciAnRE9NTm9kZUluc2VydGVkJywgb25SZXNpemVcclxuXHJcblxyXG5cdFx0dGljayA9ID0+XHJcblx0XHRcdGlmIEBpc1J1bm5pbmdcclxuXHRcdFx0XHRAY2xpcE1ldGVyLnN0YXJ0KCkgaWYgQGNsaXBNZXRlcj9cclxuXHRcdFx0XHRAcmVuZGVyKClcclxuXHRcdFx0XHRAdHJpZ2dlciAndXBkYXRlJywgeyd0aWNrQ291bnQnOiBAdGlja0NvdW50fVxyXG5cdFx0XHRcdEB0aWNrQ291bnQgKz0gMVxyXG5cdFx0XHRcdEBjbGlwTWV0ZXIudGljaygpIGlmIEBjbGlwTWV0ZXI/XHJcblxyXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgdGlja1xyXG5cclxuXHRcdHRpY2soKVxyXG5cclxuXHRcdCMgaW5pdFxyXG5cdFx0aWYgQGNvbnRhaW5lcj9cclxuXHRcdFx0QGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgQGNvbnRhaW5lciBpZiB0eXBlb2YgQGNvbnRhaW5lciBpcyAnc3RyaW5nJ1xyXG5cdFx0XHRzZXRUaW1lb3V0ID0+XHJcblx0XHRcdFx0QGNvbnRhaW5lci5hcHBlbmRDaGlsZCBAZG9tXHJcblx0XHRcdCwgMTAwXHJcblx0XHRAaXNSdW5uaW5nID0gdHJ1ZVxyXG5cclxuXHJcblx0cGF1c2U6IC0+XHJcblx0XHRAaXNSdW5uaW5nID0gZmFsc2VcclxuXHJcblx0Y29udGludWU6IC0+XHJcblx0XHRAaXNSdW5uaW5nID0gdHJ1ZVxyXG5cclxuXHR0b2dnbGU6IC0+XHJcblx0XHRAaXNSdW5uaW5nID0gbm90IEBpc1J1bm5pbmdcclxuXHJcbiNcdHByb2Nlc3NBcmdzOiAoZSkgLT5cclxuI1x0XHRvZmZzZXRYOiBlLm9mZnNldFggKiBAcGl4ZWxSYXRpb1xyXG4jXHRcdG9mZnNldFk6IGUub2Zmc2V0WSAqIEBwaXhlbFJhdGlvXHJcbiNcdFx0YnV0dG9uOiBlLmJ1dHRvblxyXG5cclxuXHRhcHBlbmQ6IChzaGFwZSkgLT5cclxuXHRcdGlmIHNoYXBlIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0QHNoYXBlcy5wdXNoIHMgZm9yIHMgaW4gc2hhcGVcclxuXHRcdGVsc2VcclxuXHRcdFx0QHNoYXBlcy5wdXNoIHNoYXBlXHJcblx0XHRAXHJcblxyXG5cclxuXHRyZW5kZXI6IC0+XHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnNjYWxlIEBwaXhlbFJhdGlvLCBAcGl4ZWxSYXRpb1xyXG5cdFx0QGNsZWFyQ2FudmFzKClcclxuXHRcdEBkcmF3U2hhcGVzIEBzaGFwZXNcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cdFx0QFxyXG5cclxuXHRjbGVhckNhbnZhczogLT5cclxuXHRcdEBjb250ZXh0LmNsZWFyUmVjdCAwLCAwLCBAd2lkdGgsIEBoZWlnaHRcclxuXHRcdEBcclxuXHJcblx0ZHJhd1NoYXBlczogKHNoYXBlcykgPT5cclxuXHRcdGlmIHNoYXBlcz9cclxuXHRcdFx0Zm9yIHNoYXBlIGluIHNoYXBlc1xyXG5cdFx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRcdEBkcmF3U2hhcGUgc2hhcGVcclxuXHRcdFx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHRcdEBcclxuXHJcblx0ZHJhd1NoYXBlOiAoc2hhcGUpID0+XHJcblx0XHRyZXR1cm4gQCB1bmxlc3Mgc2hhcGUudmlzaWJsZVxyXG5cclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSBzaGFwZS50cmFuc2xhdGUueCwgc2hhcGUudHJhbnNsYXRlLnlcclxuXHRcdEBjb250ZXh0LnJvdGF0ZSBzaGFwZS5yb3RhdGlvblxyXG5cdFx0c3ggPSBzaGFwZS5zY2FsZS54XHJcblx0XHRzeSA9IHNoYXBlLnNjYWxlLnlcclxuXHRcdGlmIHN4IC8gc3kgPiAxMDAgb3Igc3ggLyBzeSA8IDAuMDFcclxuXHRcdFx0c3ggPSAwIGlmIE1hdGguYWJzKHN4KSA8IDAuMDJcclxuXHRcdFx0c3kgPSAwIGlmIE1hdGguYWJzKHN5KSA8IDAuMDJcclxuXHRcdEBjb250ZXh0LnNjYWxlIHN4LCBzeVxyXG5cclxuXHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhICo9IHNoYXBlLm9wYWNpdHlcclxuXHRcdGlmIHNoYXBlLnN0cm9rZVN0eWxlP1xyXG5cdFx0XHRAY29udGV4dC5zdHJva2VTdHlsZSA9IHNoYXBlLnN0cm9rZVN0eWxlXHJcblx0XHRcdEBjb250ZXh0LmxpbmVXaWR0aCA9IHNoYXBlLmxpbmVXaWR0aFxyXG5cdFx0XHRAY29udGV4dC5saW5lQ2FwID0gc2hhcGUubGluZUNhcCBpZiBzaGFwZS5saW5lQ2FwP1xyXG5cdFx0XHRAY29udGV4dC5saW5lSm9pbiA9IHNoYXBlLmxpbmVKb2luIGlmIHNoYXBlLmxpbmVKb2luP1xyXG5cclxuXHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblxyXG5cdFx0c3dpdGNoIHNoYXBlLnR5cGVcclxuXHRcdFx0d2hlbiAnUG9pbnQnIHRoZW4gQGRyYXdQb2ludCBzaGFwZVxyXG5cdFx0XHR3aGVuICdMaW5lJyB0aGVuIEBkcmF3TGluZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdDaXJjbGUnIHRoZW4gQGRyYXdDaXJjbGUgc2hhcGVcclxuXHRcdFx0d2hlbiAnVHJpYW5nbGUnIHRoZW4gQGRyYXdUcmlhbmdsZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdSZWN0YW5nbGUnIHRoZW4gQGRyYXdSZWN0YW5nbGUgc2hhcGVcclxuXHRcdFx0d2hlbiAnRmFuJyB0aGVuIEBkcmF3RmFuIHNoYXBlXHJcblx0XHRcdHdoZW4gJ0JvdycgdGhlbiBAZHJhd0JvdyBzaGFwZVxyXG5cdFx0XHR3aGVuICdQb2x5Z29uJyB0aGVuIEBkcmF3UG9seWdvbiBzaGFwZVxyXG5cdFx0XHR3aGVuICdQb2x5bGluZScgdGhlbiBAZHJhd1BvbHlsaW5lIHNoYXBlXHJcblx0XHRcdHdoZW4gJ1NwbGluZScgdGhlbiBAZHJhd1NwbGluZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdQb2ludFRleHQnIHRoZW4gQGRyYXdQb2ludFRleHQgc2hhcGVcclxuXHRcdFx0d2hlbiAnSW1hZ2UnIHRoZW4gQGRyYXdJbWFnZSBzaGFwZVxyXG5cdFx0XHR3aGVuICdCb3VuZHMnIHRoZW4gQGRyYXdCb3VuZHMgc2hhcGVcclxuXHRcdFx0ZWxzZSBjb25zb2xlLmxvZyAnZHJhd1NoYXBlcygpOiB1bmtub3duIHNoYXBlOiAnLCBzaGFwZVxyXG5cclxuXHJcblx0XHRpZiBzaGFwZS5maWxsU3R5bGU/XHJcblx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9IHNoYXBlLmZpbGxTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5maWxsKClcclxuXHJcblx0XHRpZiBzaGFwZS5kYXNoU3R5bGUjIGFuZCAoc2hhcGUudHlwZSA9PSAnU3BsaW5lJyBvciBzaGFwZS50eXBlID09ICdSZWN0YW5nbGUnIGFuZCBzaGFwZS5jb3JuZXJSYWRpdXMgPiAwKVxyXG5cdFx0XHRAY29udGV4dC5saW5lRGFzaE9mZnNldCA9IHNoYXBlLmRhc2hPZmZzZXRcclxuXHRcdFx0QGNvbnRleHQuc2V0TGluZURhc2g/IHNoYXBlLmRhc2hTdHlsZVxyXG5cdFx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cdFx0XHRAY29udGV4dC5zZXRMaW5lRGFzaCBbXVxyXG5cdFx0ZWxzZSBpZiBzaGFwZS5zdHJva2VTdHlsZT9cclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHJcblx0XHRAZHJhd1NoYXBlcyBzaGFwZS5jaGlsZHJlbiBpZiBzaGFwZS5jaGlsZHJlbj9cclxuXHRcdEBkcmF3U2hhcGVzIHNoYXBlLmtleVBvaW50cyBpZiBAaXNTaG93S2V5UG9pbnRzXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3UG9pbnQ6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmFyYyBzaGFwZS54LCBzaGFwZS55LCBCdS5QT0lOVF9SRU5ERVJfU0laRSwgMCwgTWF0aC5QSSAqIDJcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdMaW5lOiAoc2hhcGUpIC0+XHJcblx0XHRAY29udGV4dC5tb3ZlVG8gc2hhcGUucG9pbnRzWzBdLngsIHNoYXBlLnBvaW50c1swXS55XHJcblx0XHRAY29udGV4dC5saW5lVG8gc2hhcGUucG9pbnRzWzFdLngsIHNoYXBlLnBvaW50c1sxXS55XHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3Q2lyY2xlOiAoc2hhcGUpIC0+XHJcblx0XHRAY29udGV4dC5hcmMgc2hhcGUuY3gsIHNoYXBlLmN5LCBzaGFwZS5yYWRpdXMsIDAsIE1hdGguUEkgKiAyXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3VHJpYW5nbGU6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMF0ueCwgc2hhcGUucG9pbnRzWzBdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMV0ueCwgc2hhcGUucG9pbnRzWzFdLnlcclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5wb2ludHNbMl0ueCwgc2hhcGUucG9pbnRzWzJdLnlcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3UmVjdGFuZ2xlOiAoc2hhcGUpIC0+XHJcblx0XHRyZXR1cm4gQGRyYXdSb3VuZFJlY3RhbmdsZSBzaGFwZSBpZiBzaGFwZS5jb3JuZXJSYWRpdXMgIT0gMFxyXG5cdFx0QGNvbnRleHQucmVjdCBzaGFwZS5wb3NpdGlvbi54LCBzaGFwZS5wb3NpdGlvbi55LCBzaGFwZS5zaXplLndpZHRoLCBzaGFwZS5zaXplLmhlaWdodFxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1JvdW5kUmVjdGFuZ2xlOiAoc2hhcGUpIC0+XHJcblx0XHR4MSA9IHNoYXBlLnBvc2l0aW9uLnhcclxuXHRcdHgyID0gc2hhcGUucG9pbnRSQi54XHJcblx0XHR5MSA9IHNoYXBlLnBvc2l0aW9uLnlcclxuXHRcdHkyID0gc2hhcGUucG9pbnRSQi55XHJcblx0XHRyID0gc2hhcGUuY29ybmVyUmFkaXVzXHJcblxyXG5cdFx0QGNvbnRleHQubW92ZVRvIHgxLCB5MSArIHJcclxuXHRcdEBjb250ZXh0LmFyY1RvIHgxLCB5MSwgeDEgKyByLCB5MSwgclxyXG5cdFx0QGNvbnRleHQubGluZVRvIHgyIC0gciwgeTFcclxuXHRcdEBjb250ZXh0LmFyY1RvIHgyLCB5MSwgeDIsIHkxICsgciwgclxyXG5cdFx0QGNvbnRleHQubGluZVRvIHgyLCB5MiAtIHJcclxuXHRcdEBjb250ZXh0LmFyY1RvIHgyLCB5MiwgeDIgLSByLCB5MiwgclxyXG5cdFx0QGNvbnRleHQubGluZVRvIHgxICsgciwgeTJcclxuXHRcdEBjb250ZXh0LmFyY1RvIHgxLCB5MiwgeDEsIHkyIC0gciwgclxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHJcblx0XHRAY29udGV4dC5zZXRMaW5lRGFzaD8gc2hhcGUuZGFzaFN0eWxlIGlmIHNoYXBlLnN0cm9rZVN0eWxlPyBhbmQgc2hhcGUuZGFzaFN0eWxlXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3RmFuOiAoc2hhcGUpIC0+XHJcblx0XHRAY29udGV4dC5hcmMgc2hhcGUuY3gsIHNoYXBlLmN5LCBzaGFwZS5yYWRpdXMsIHNoYXBlLmFGcm9tLCBzaGFwZS5hVG9cclxuXHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS5jeCwgc2hhcGUuY3lcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3Qm93OiAoc2hhcGUpIC0+XHJcblx0XHRAY29udGV4dC5hcmMgc2hhcGUuY3gsIHNoYXBlLmN5LCBzaGFwZS5yYWRpdXMsIHNoYXBlLmFGcm9tLCBzaGFwZS5hVG9cclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRAXHJcblxyXG5cclxuXHRkcmF3UG9seWdvbjogKHNoYXBlKSAtPlxyXG5cdFx0Zm9yIHBvaW50IGluIHNoYXBlLnZlcnRpY2VzXHJcblx0XHRcdEBjb250ZXh0LmxpbmVUbyBwb2ludC54LCBwb2ludC55XHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd1BvbHlsaW5lOiAoc2hhcGUpIC0+XHJcblx0XHRmb3IgcG9pbnQgaW4gc2hhcGUudmVydGljZXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvIHBvaW50LngsIHBvaW50LnlcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdTcGxpbmU6IChzaGFwZSkgLT5cclxuXHRcdGlmIHNoYXBlLnN0cm9rZVN0eWxlP1xyXG5cdFx0XHRsZW4gPSBzaGFwZS52ZXJ0aWNlcy5sZW5ndGhcclxuXHRcdFx0aWYgbGVuID09IDJcclxuXHRcdFx0XHRAY29udGV4dC5tb3ZlVG8gc2hhcGUudmVydGljZXNbMF0ueCwgc2hhcGUudmVydGljZXNbMF0ueVxyXG5cdFx0XHRcdEBjb250ZXh0LmxpbmVUbyBzaGFwZS52ZXJ0aWNlc1sxXS54LCBzaGFwZS52ZXJ0aWNlc1sxXS55XHJcblx0XHRcdGVsc2UgaWYgbGVuID4gMlxyXG5cdFx0XHRcdEBjb250ZXh0Lm1vdmVUbyBzaGFwZS52ZXJ0aWNlc1swXS54LCBzaGFwZS52ZXJ0aWNlc1swXS55XHJcblx0XHRcdFx0Zm9yIGkgaW4gWzEuLmxlbiAtIDFdXHJcblx0XHRcdFx0XHRAY29udGV4dC5iZXppZXJDdXJ2ZVRvKFxyXG5cdFx0XHRcdFx0XHRzaGFwZS5jb250cm9sUG9pbnRzQmVoaW5kW2kgLSAxXS54LFxyXG5cdFx0XHRcdFx0XHRzaGFwZS5jb250cm9sUG9pbnRzQmVoaW5kW2kgLSAxXS55LFxyXG5cdFx0XHRcdFx0XHRzaGFwZS5jb250cm9sUG9pbnRzQWhlYWRbaV0ueCxcclxuXHRcdFx0XHRcdFx0c2hhcGUuY29udHJvbFBvaW50c0FoZWFkW2ldLnksXHJcblx0XHRcdFx0XHRcdHNoYXBlLnZlcnRpY2VzW2ldLngsXHJcblx0XHRcdFx0XHRcdHNoYXBlLnZlcnRpY2VzW2ldLnlcclxuXHRcdFx0XHRcdClcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdQb2ludFRleHQ6IChzaGFwZSkgLT5cclxuXHRcdEBjb250ZXh0LnRleHRBbGlnbiA9IHNoYXBlLnRleHRBbGlnblxyXG5cdFx0QGNvbnRleHQudGV4dEJhc2VsaW5lID0gc2hhcGUudGV4dEJhc2VsaW5lXHJcblx0XHRAY29udGV4dC5mb250ID0gc2hhcGUuZm9udFxyXG5cclxuXHRcdGlmIHNoYXBlLnN0cm9rZVN0eWxlP1xyXG5cdFx0XHRAY29udGV4dC5zdHJva2VUZXh0IHNoYXBlLnRleHQsIHNoYXBlLngsIHNoYXBlLnlcclxuXHRcdGlmIHNoYXBlLmZpbGxTdHlsZT9cclxuXHRcdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gc2hhcGUuZmlsbFN0eWxlXHJcblx0XHRcdEBjb250ZXh0LmZpbGxUZXh0IHNoYXBlLnRleHQsIHNoYXBlLngsIHNoYXBlLnlcclxuXHRcdEBcclxuXHJcblxyXG5cdGRyYXdJbWFnZTogKHNoYXBlKSAtPlxyXG5cdFx0aWYgc2hhcGUubG9hZGVkXHJcblx0XHRcdHcgPSBzaGFwZS5zaXplLndpZHRoXHJcblx0XHRcdGggPSBzaGFwZS5zaXplLmhlaWdodFxyXG5cdFx0XHRkeCA9IC13ICogc2hhcGUucGl2b3QueFxyXG5cdFx0XHRkeSA9IC1oICogc2hhcGUucGl2b3QueVxyXG5cdFx0XHRAY29udGV4dC5kcmF3SW1hZ2Ugc2hhcGUuaW1hZ2UsIGR4LCBkeSwgdywgaFxyXG5cdFx0QFxyXG5cclxuXHJcblx0ZHJhd0JvdW5kczogKGJvdW5kcykgLT5cclxuXHRcdEBjb250ZXh0LnJlY3QgYm91bmRzLngxLCBib3VuZHMueTEsIGJvdW5kcy54MiAtIGJvdW5kcy54MSwgYm91bmRzLnkyIC0gYm91bmRzLnkxXHJcblx0XHRAXHJcbiIsIiMgQm93IHNoYXBlXHJcblxyXG5jbGFzcyBCdS5Cb3cgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG8pIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdCb3cnXHJcblxyXG5cdFx0W0BhRnJvbSwgQGFUb10gPSBbQGFUbywgQGFGcm9tXSBpZiBAYUZyb20gPiBAYVRvXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZyA9IG5ldyBCdS5MaW5lIEBjZW50ZXIuYXJjVG8oQHJhZGl1cywgQGFGcm9tKSxcclxuXHRcdFx0XHRAY2VudGVyLmFyY1RvKEByYWRpdXMsIEBhVG8pXHJcblx0XHRAa2V5UG9pbnRzID0gQHN0cmluZy5wb2ludHNcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Cb3cgQGN4LCBAY3ksIEByYWRpdXMsIEBhRnJvbSwgQGFUb1xyXG5cclxuXHRfY29udGFpbnNQb2ludDogKHBvaW50KSAtPlxyXG5cdFx0aWYgQnUuYmV2ZWwoQGN4IC0gcG9pbnQueCwgQGN5IC0gcG9pbnQueSkgPCBAcmFkaXVzXHJcblx0XHRcdHNhbWVTaWRlID0gQHN0cmluZy5pc1R3b1BvaW50c1NhbWVTaWRlKEBjZW50ZXIsIHBvaW50KVxyXG5cdFx0XHRzbWFsbFRoYW5IYWxmQ2lyY2xlID0gQGFUbyAtIEBhRnJvbSA8IE1hdGguUElcclxuXHRcdFx0cmV0dXJuIHNhbWVTaWRlIF4gc21hbGxUaGFuSGFsZkNpcmNsZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuIiwiIyBDaXJjbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkNpcmNsZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoY3ggPSAwLCBjeSA9IDAsIEBfcmFkaXVzID0gMSkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ0NpcmNsZSdcclxuXHJcblx0XHRAX2NlbnRlciA9IG5ldyBCdS5Qb2ludChjeCwgY3kpXHJcblx0XHRAYm91bmRzID0gbnVsbCAjIGZvciBhY2NlbGVyYXRlIGNvbnRhaW4gdGVzdFxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBbQF9jZW50ZXJdXHJcblxyXG5cdGNsb25lOiAoKSAtPiBuZXcgQnUuQ2lyY2xlIEBjeCwgQGN5LCBAcmFkaXVzXHJcblxyXG5cdCMgcHJvcGVydHlcclxuXHJcblx0QHByb3BlcnR5ICdjeCcsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyLnhcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jZW50ZXIueCA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2VudGVyQ2hhbmdlZCcsIEBcclxuXHJcblx0QHByb3BlcnR5ICdjeScsXHJcblx0XHRnZXQ6IC0+IEBfY2VudGVyLnlcclxuXHRcdHNldDogKHZhbCkgLT5cclxuXHRcdFx0QF9jZW50ZXIueSA9IHZhbFxyXG5cdFx0XHRAdHJpZ2dlciAnY2VudGVyQ2hhbmdlZCcsIEBcclxuXHJcblx0QHByb3BlcnR5ICdjZW50ZXInLFxyXG5cdFx0Z2V0OiAtPiBAX2NlbnRlclxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2NlbnRlciA9IHZhbFxyXG5cdFx0XHRAY3ggPSB2YWwueFxyXG5cdFx0XHRAY3kgPSB2YWwueVxyXG5cdFx0XHRAa2V5UG9pbnRzWzBdID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdjZW50ZXJDaGFuZ2VkJywgQFxyXG5cclxuXHRAcHJvcGVydHkgJ3JhZGl1cycsXHJcblx0XHRnZXQ6IC0+IEBfcmFkaXVzXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfcmFkaXVzID0gdmFsXHJcblx0XHRcdEB0cmlnZ2VyICdyYWRpdXNDaGFuZ2VkJywgQFxyXG5cdFx0XHRAXHJcblxyXG5cdCMgcG9pbnQgcmVsYXRlZFxyXG5cdF9jb250YWluc1BvaW50OiAocCkgLT5cclxuXHRcdGR4ID0gcC54IC0gQGN4XHJcblx0XHRkeSA9IHAueSAtIEBjeVxyXG5cdFx0cmV0dXJuIEJ1LmJldmVsKGR4LCBkeSkgPCBAcmFkaXVzXHJcbiIsIiMgRmFuIHNoYXBlXHJcblxyXG5jbGFzcyBCdS5GYW4gZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBjeCwgQGN5LCBAcmFkaXVzLCBAYUZyb20sIEBhVG8pIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdGYW4nXHJcblxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCBAY3gsIEBjeVxyXG5cdFx0QHN0cmluZyA9IG5ldyBCdS5MaW5lKFxyXG5cdFx0XHRcdEBjZW50ZXIuYXJjVG8gQHJhZGl1cywgQGFGcm9tXHJcblx0XHRcdFx0QGNlbnRlci5hcmNUbyBAcmFkaXVzLCBAYVRvXHJcblx0XHQpXHJcblx0XHRAa2V5UG9pbnRzID0gW1xyXG5cdFx0XHRAc3RyaW5nLnBvaW50c1swXVxyXG5cdFx0XHRAc3RyaW5nLnBvaW50c1sxXVxyXG5cdFx0XHRuZXcgQnUuUG9pbnQgQGN4LCBAY3lcclxuXHRcdF1cclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5GYW4gQGN4LCBAY3ksIEByYWRpdXMsIEBhRnJvbSwgQGFUb1xyXG5cclxuXHRfY29udGFpbnNQb2ludDogKHApIC0+XHJcblx0XHRkeCA9IHAueCAtIEBjeFxyXG5cdFx0ZHkgPSBwLnkgLSBAY3lcclxuXHRcdGEgPSBNYXRoLmF0YW4yKHAueSAtIEBjeSwgcC54IC0gQGN4KVxyXG5cdFx0YSArPSBNYXRoLlBJICogMiB3aGlsZSBhIDwgQGFGcm9tXHJcblx0XHRyZXR1cm4gQnUuYmV2ZWwoZHgsIGR5KSA8IEByYWRpdXMgJiYgYSA+IEBhRnJvbSAmJiBhIDwgQGFUb1xyXG4iLCIjIGxpbmUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LkxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHAxLCBwMiwgcDMsIHA0KSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnTGluZSdcclxuXHJcblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxyXG5cdFx0XHRAcG9pbnRzID0gW25ldyBCdS5Qb2ludCgpLCBuZXcgQnUuUG9pbnQoKV1cclxuXHRcdGVsc2UgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDRcclxuXHRcdFx0QHBvaW50cyA9IFtwMS5jbG9uZSgpLCBwMi5jbG9uZSgpXVxyXG5cdFx0ZWxzZSAgIyBsZW4gPj0gNFxyXG5cdFx0XHRAcG9pbnRzID0gW25ldyBCdS5Qb2ludChwMSwgcDIpLCBuZXcgQnUuUG9pbnQocDMsIHA0KV1cclxuXHJcblx0XHRAbGVuZ3RoXHJcblx0XHRAbWlkcG9pbnQgPSBuZXcgQnUuUG9pbnQoKVxyXG5cdFx0QGtleVBvaW50cyA9IEBwb2ludHNcclxuXHJcblx0XHRAb24gXCJwb2ludENoYW5nZVwiLCAoZSkgPT5cclxuXHRcdFx0QGxlbmd0aCA9IEBwb2ludHNbMF0uZGlzdGFuY2VUbyhAcG9pbnRzWzFdKVxyXG5cdFx0XHRAbWlkcG9pbnQuc2V0KChAcG9pbnRzWzBdLnggKyBAcG9pbnRzWzFdLngpIC8gMiwgKEBwb2ludHNbMF0ueSArIEBwb2ludHNbMV0ueSkgLyAyKVxyXG5cclxuXHRcdEB0cmlnZ2VyIFwicG9pbnRDaGFuZ2VcIiwgQFxyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LkxpbmUgQHBvaW50c1swXSwgQHBvaW50c1sxXVxyXG5cclxuXHQjIGVkaXRcclxuXHJcblx0c2V0OiAoYTEsIGEyLCBhMywgYTQpIC0+XHJcblx0XHRpZiBwND9cclxuXHRcdFx0QHBvaW50c1swXS5zZXQgYTEsIGEyXHJcblx0XHRcdEBwb2ludHNbMV0uc2V0IGEzLCBhNFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcG9pbnRzWzBdID0gYTFcclxuXHRcdFx0QHBvaW50c1sxXSA9IGEyXHJcblx0XHRAdHJpZ2dlciBcInBvaW50Q2hhbmdlXCIsIEBcclxuXHRcdEBcclxuXHJcblx0c2V0UG9pbnQxOiAoYTEsIGEyKSAtPlxyXG5cdFx0aWYgYTI/XHJcblx0XHRcdEBwb2ludHNbMF0uc2V0IGExLCBhMlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcG9pbnRzWzBdLmNvcHkgYTFcclxuXHRcdEB0cmlnZ2VyIFwicG9pbnRDaGFuZ2VcIiwgQFxyXG5cdFx0QFxyXG5cclxuXHRzZXRQb2ludDI6IChhMSwgYTIpIC0+XHJcblx0XHRpZiBhMj9cclxuXHRcdFx0QHBvaW50c1sxXS5zZXQgYTEsIGEyXHJcblx0XHRlbHNlXHJcblx0XHRcdEBwb2ludHNbMV0uY29weSBhMVxyXG5cdFx0QHRyaWdnZXIgXCJwb2ludENoYW5nZVwiLCBAXHJcblx0XHRAXHJcblxyXG5cdCMgcG9pbnQgcmVsYXRlZFxyXG5cclxuXHRpc1R3b1BvaW50c1NhbWVTaWRlOiAocDEsIHAyKSAtPlxyXG5cdFx0cEEgPSBAcG9pbnRzWzBdXHJcblx0XHRwQiA9IEBwb2ludHNbMV1cclxuXHRcdGlmIHBBLnggPT0gcEIueFxyXG5cdFx0XHQjIGlmIGJvdGggb2YgdGhlIHR3byBwb2ludHMgYXJlIG9uIHRoZSBsaW5lIHRoZW4gd2UgY29uc2lkZXIgdGhleSBhcmUgaW4gdGhlIHNhbWUgc2lkZVxyXG5cdFx0XHRyZXR1cm4gKHAxLnggLSBwQS54KSAqIChwMi54IC0gcEEueCkgPiAwXHJcblx0XHRlbHNlXHJcblx0XHRcdHkwMSA9IChwQS55IC0gcEIueSkgKiAocDEueCAtIHBBLngpIC8gKHBBLnggLSBwQi54KSArIHBBLnlcclxuXHRcdFx0eTAyID0gKHBBLnkgLSBwQi55KSAqIChwMi54IC0gcEEueCkgLyAocEEueCAtIHBCLngpICsgcEEueVxyXG5cdFx0XHRyZXR1cm4gKHAxLnkgLSB5MDEpICogKHAyLnkgLSB5MDIpID4gMFxyXG5cclxuXHRkaXN0YW5jZVRvOiAocG9pbnQpIC0+XHJcblx0XHRwMSA9IEBwb2ludHNbMF1cclxuXHRcdHAyID0gQHBvaW50c1sxXVxyXG5cdFx0YSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpXHJcblx0XHRiID0gcDEueSAtIGEgKiBwMS54XHJcblx0XHRyZXR1cm4gTWF0aC5hYnMoYSAqIHBvaW50LnggKyBiIC0gcG9pbnQueSkgLyBNYXRoLnNxcnQoYSAqIGEgKyAxKVxyXG5cclxuXHQjIHRoaXMgb25lIGlzIGluZmVycmVkIGJ5IG15c2VsZlxyXG5cdGRpc3RhbmNlVG8yOiAocG9pbnQpIC0+XHJcblx0XHRwMSA9IEBwb2ludHNbMF1cclxuXHRcdHAyID0gQHBvaW50c1sxXVxyXG5cdFx0YSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpXHJcblx0XHRiID0gcDEueSAtIChwMS55IC0gcDIueSkgKiBwMS54IC8gKHAxLnggLSBwMi54KVxyXG5cdFx0Y3pYID0gKHBvaW50LnkgKyBwb2ludC54IC8gYSAtIGIpIC8gKGEgKyAxIC8gYSlcclxuXHRcdGN6WSA9IGEgKiBjelggKyBiXHJcblx0XHRyZXR1cm4gQnUuYmV2ZWwoY3pYIC0gcG9pbnQueCwgY3pZIC0gcG9pbnQueSlcclxuXHJcblx0IyBnZXQgZm9vdCBwb2ludCBmcm9tIGEgcG9pbnRcclxuXHQjIHNhdmUgdG8gZm9vdFBvaW50IG9yIGNyZWF0ZSBhIG5ldyBwb2ludFxyXG5cdGZvb3RQb2ludEZyb206IChwb2ludCwgZm9vdFBvaW50KSAtPlxyXG5cdFx0cDEgPSBAcG9pbnRzWzBdXHJcblx0XHRwMiA9IEBwb2ludHNbMV1cclxuXHRcdEEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KVxyXG5cdFx0QiA9IChwMS55IC0gQSAqIHAxLngpXHJcblx0XHRtID0gcG9pbnQueCArIEEgKiBwb2ludC55XHJcblx0XHR4ID0gKG0gLSBBICogQikgLyAoQSAqIEEgKyAxKVxyXG5cdFx0eSA9IEEgKiB4ICsgQlxyXG5cclxuXHRcdGlmIGZvb3RQb2ludD9cclxuXHRcdFx0Zm9vdFBvaW50LnNldCh4LCB5KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gbmV3IEJ1LlBvaW50KHgsIHkpXHJcblxyXG5cdCMgbGluZSByZWxhdGVkXHJcblxyXG5cdGdldENyb3NzUG9pbnRXaXRoOiAobGluZSkgLT5cclxuXHRcdHAxID0gQHBvaW50c1swXVxyXG5cdFx0cDIgPSBAcG9pbnRzWzFdXHJcblx0XHRxMSA9IGxpbmUucG9pbnRzWzBdXHJcblx0XHRxMiA9IGxpbmUucG9pbnRzWzFdXHJcblxyXG5cdFx0YTEgPSBwMi55IC0gcDEueVxyXG5cdFx0YjEgPSBwMS54IC0gcDIueFxyXG5cdFx0YzEgPSAoYTEgKiBwMS54KSArIChiMSAqIHAxLnkpXHJcblx0XHRhMiA9IHEyLnkgLSBxMS55XHJcblx0XHRiMiA9IHExLnggLSBxMi54XHJcblx0XHRjMiA9IChhMiAqIHExLngpICsgKGIyICogcTEueSlcclxuXHRcdGRldCA9IChhMSAqIGIyKSAtIChhMiAqIGIxKVxyXG5cclxuXHRcdHJldHVybiBuZXcgQnUuUG9pbnQgKChiMiAqIGMxKSAtIChiMSAqIGMyKSkgLyBkZXQsICgoYTEgKiBjMikgLSAoYTIgKiBjMSkpIC8gZGV0XHJcblxyXG5cdCMgd2hldGhlciBjcm9zcyB3aXRoIGFub3RoZXIgbGluZVxyXG5cdGlzQ3Jvc3NXaXRoTGluZTogKGxpbmUpIC0+XHJcblx0XHR4MSA9IEBwb2ludHNbMF0ueFxyXG5cdFx0eTEgPSBAcG9pbnRzWzBdLnlcclxuXHRcdHgyID0gQHBvaW50c1sxXS54XHJcblx0XHR5MiA9IEBwb2ludHNbMV0ueVxyXG5cdFx0eDMgPSBsaW5lLnBvaW50c1swXS54XHJcblx0XHR5MyA9IGxpbmUucG9pbnRzWzBdLnlcclxuXHRcdHg0ID0gbGluZS5wb2ludHNbMV0ueFxyXG5cdFx0eTQgPSBsaW5lLnBvaW50c1sxXS55XHJcblx0XHRkID0gKHkyIC0geTEpICogKHg0IC0geDMpIC0gKHk0IC0geTMpICogKHgyIC0geDEpXHJcblx0XHRpZiBkID09IDBcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHgwID0gKCh4MiAtIHgxKSAqICh4NCAtIHgzKSAqICh5MyAtIHkxKSArICh5MiAtIHkxKSAqICh4NCAtIHgzKSAqIHgxIC0gKHk0IC0geTMpICogKHgyIC0geDEpICogeDMpIC8gZFxyXG5cdFx0XHR5MCA9ICgoeTIgLSB5MSkgKiAoeTQgLSB5MykgKiAoeDMgLSB4MSkgKyAoeDIgLSB4MSkgKiAoeTQgLSB5MykgKiB5MSAtICh4NCAtIHgzKSAqICh5MiAtIHkxKSAqIHkzKSAvIC1kXHJcblx0XHRyZXR1cm4gKHgwIC0geDEpICogKHgwIC0geDIpIDwgMCBhbmRcclxuXHRcdFx0XHQoeDAgLSB4MykgKiAoeDAgLSB4NCkgPCAwIGFuZFxyXG5cdFx0XHRcdCh5MCAtIHkxKSAqICh5MCAtIHkyKSA8IDAgYW5kXHJcblx0XHRcdFx0KHkwIC0geTMpICogKHkwIC0geTQpIDwgMFxyXG5cclxuXHQjIFRPRE8gdGVzdFxyXG5cdGlzQ3Jvc3NXaXRoTGluZTI6IChsaW5lKSAtPlxyXG5cdFx0cDEgPSBAcG9pbnRzWzBdXHJcblx0XHRwMiA9IEBwb2ludHNbMV1cclxuXHRcdHExID0gbGluZS5wb2ludHNbMF1cclxuXHRcdHEyID0gbGluZS5wb2ludHNbMV1cclxuXHJcblx0XHRkeCA9IHAyLnggLSBwMS54XHJcblx0XHRkeSA9IHAyLnkgLSBwMS55XHJcblx0XHRkYSA9IHEyLnggLSBxMS54XHJcblx0XHRkYiA9IHEyLnkgLSBxMS55XHJcblxyXG5cdFx0IyBzZWdtZW50cyBhcmUgcGFyYWxsZWxcclxuXHRcdGlmIGRhICogZHkgLSBkYiAqIGR4ID09IDBcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0cyA9IChkeCAqIChxMS55IC0gcDEueSkgKyBkeSAqIChwMS54IC0gcTEueCkpIC8gKGRhICogZHkgLSBkYiAqIGR4KVxyXG5cdFx0dCA9IChkYSAqIChwMS55IC0gcTEueSkgKyBkYiAqIChxMS54IC0gcDEueCkpIC8gKGRiICogZHggLSBkYSAqIGR5KVxyXG5cclxuXHRcdHJldHVybiBzID49IDAgJiYgcyA8PSAxIGFuZCB0ID49IDAgJiYgdCA8PSAxXHJcbiIsIiMgcG9pbnQgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlBvaW50IGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChAeCA9IDAsIEB5ID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ1BvaW50J1xyXG5cclxuXHRcdEBsaW5lV2lkdGggPSAwLjVcclxuXHRcdEBfbGFiZWxJbmRleCA9IC0xXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuUG9pbnQgQHgsIEB5XHJcblxyXG5cdEBwcm9wZXJ0eSAnbGFiZWwnLFxyXG5cdFx0Z2V0OiAtPiBpZiBAX2xhYmVsSW5kZXggPiAtMSB0aGVuIEBjaGlsZHJlbltAX2xhYmVsSW5kZXhdLnRleHQgZWxzZSAnJ1xyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRpZiBAX2xhYmVsSW5kZXggPT0gLTFcclxuXHRcdFx0XHRwb2ludFRleHQgPSBuZXcgQnUuUG9pbnRUZXh0IHZhbCwgQHggKyBCdS5QT0lOVF9MQUJFTF9PRkZTRVQsIEB5LCB7YWxpZ246ICcrMCd9XHJcblx0XHRcdFx0QGNoaWxkcmVuLnB1c2ggcG9pbnRUZXh0XHJcblx0XHRcdFx0QF9sYWJlbEluZGV4ID0gQGNoaWxkcmVuLmxlbmd0aCAtIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdEBjaGlsZHJlbltAX2xhYmVsSW5kZXhdLnRleHQgPSB2YWxcclxuXHJcblx0YXJjVG86IChyYWRpdXMsIGFyYykgLT5cclxuXHRcdHJldHVybiBuZXcgQnUuUG9pbnQgQHggKyBNYXRoLmNvcyhhcmMpICogcmFkaXVzLCBAeSArIE1hdGguc2luKGFyYykgKiByYWRpdXNcclxuXHJcblxyXG5cdCMgY29weSB2YWx1ZSBmcm9tIG90aGVyIGxpbmVcclxuXHRjb3B5OiAocG9pbnQpIC0+XHJcblx0XHRAeCA9IHBvaW50LnhcclxuXHRcdEB5ID0gcG9pbnQueVxyXG5cdFx0QHVwZGF0ZUxhYmVsKClcclxuXHJcblx0IyBzZXQgdmFsdWUgZnJvbSB4LCB5XHJcblx0c2V0OiAoeCwgeSkgLT5cclxuXHRcdEB4ID0geFxyXG5cdFx0QHkgPSB5XHJcblx0XHRAdXBkYXRlTGFiZWwoKVxyXG5cclxuXHR1cGRhdGVMYWJlbDogLT5cclxuXHRcdGlmIEBfbGFiZWxJbmRleCA+IC0xXHJcblx0XHRcdEBjaGlsZHJlbltAX2xhYmVsSW5kZXhdLnggPSBAeCArIEJ1LlBPSU5UX0xBQkVMX09GRlNFVFxyXG5cdFx0XHRAY2hpbGRyZW5bQF9sYWJlbEluZGV4XS55ID0gQHlcclxuXHJcblx0IyBwb2ludCByZWxhdGVkXHJcblxyXG5cdGRpc3RhbmNlVG86IChwb2ludCkgLT5cclxuXHRcdEJ1LmJldmVsKEB4IC0gcG9pbnQueCwgQHkgLSBwb2ludC55KVxyXG5cclxuXHRmb290UG9pbnQgPSBudWxsXHJcblxyXG5cdGlzTmVhcjogKHRhcmdldCwgbGltaXQgPSBCdS5ERUZBVUxUX05FQVJfRElTVCkgLT5cclxuXHRcdHN3aXRjaCB0YXJnZXQudHlwZVxyXG5cdFx0XHR3aGVuICdQb2ludCcgdGhlbiBAZGlzdGFuY2VUbyh0YXJnZXQpIDwgbGltaXRcclxuXHRcdFx0d2hlbiAnTGluZSdcclxuXHRcdFx0XHR2ZXJ0aWNhbERpc3QgPSB0YXJnZXQuZGlzdGFuY2VUbyBAXHJcblxyXG5cdFx0XHRcdGZvb3RQb2ludCA9IG5ldyBCdS5Qb2ludCB1bmxlc3MgZm9vdFBvaW50P1xyXG5cdFx0XHRcdHRhcmdldC5mb290UG9pbnRGcm9tIEAsIGZvb3RQb2ludFxyXG5cclxuXHRcdFx0XHRpc0JldHdlZW4xID0gZm9vdFBvaW50LmRpc3RhbmNlVG8odGFyZ2V0LnBvaW50c1swXSkgPCB0YXJnZXQubGVuZ3RoICsgQnUuREVGQVVMVF9ORUFSX0RJU1RcclxuXHRcdFx0XHRpc0JldHdlZW4yID0gZm9vdFBvaW50LmRpc3RhbmNlVG8odGFyZ2V0LnBvaW50c1sxXSkgPCB0YXJnZXQubGVuZ3RoICsgQnUuREVGQVVMVF9ORUFSX0RJU1RcclxuXHJcblx0XHRcdFx0cmV0dXJuIHZlcnRpY2FsRGlzdCA8IGxpbWl0IGFuZCBpc0JldHdlZW4xIGFuZCBpc0JldHdlZW4yXHJcblx0XHRcdHdoZW4gJ1BvbHlsaW5lJ1xyXG5cdFx0XHRcdGZvciBsaW5lIGluIHRhcmdldC5saW5lc1xyXG5cdFx0XHRcdFx0cmV0dXJuIHllcyBpZiBAaXNOZWFyIGxpbmVcclxuXHRcdFx0XHRyZXR1cm4gbm9cclxuXHJcbkJ1LlBvaW50LmludGVycG9sYXRlID0gKHAxLCBwMiwgaywgcDMpIC0+XHJcblx0eCA9IHAxLnggKyAocDIueCAtIHAxLngpICoga1xyXG5cdHkgPSBwMS55ICsgKHAyLnkgLSBwMS55KSAqIGtcclxuXHJcblx0aWYgcDM/XHJcblx0XHRwMy5zZXQgeCwgeVxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBuZXcgQnUuUG9pbnQgeCwgeVxyXG4iLCIjIHBvbHlnb24gc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlBvbHlnb24gZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHQjIyNcclxuICAgIGNvbnN0cnVjdG9yc1xyXG4gICAgMS4gUG9seWdvbihwb2ludHMpXHJcbiAgICAyLiBQb2x5Z29uKHgsIHksIHJhZGl1cywgbiwgb3B0aW9ucyk6IHRvIGdlbmVyYXRlIHJlZ3VsYXIgcG9seWdvblxyXG4gICAgXHRvcHRpb25zOiBhbmdsZSAtIHN0YXJ0IGFuZ2xlIG9mIHJlZ3VsYXIgcG9seWdvblxyXG5cdCMjI1xyXG5cdGNvbnN0cnVjdG9yOiAocG9pbnRzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnUG9seWdvbidcclxuXHJcblx0XHRAdmVydGljZXMgPSBbXVxyXG5cdFx0QGxpbmVzID0gW11cclxuXHRcdEB0cmlhbmdsZXMgPSBbXVxyXG5cclxuXHRcdG9wdGlvbnMgPSBCdS5jb21iaW5lT3B0aW9ucyBhcmd1bWVudHMsXHJcblx0XHRcdGFuZ2xlOiAwXHJcblxyXG5cdFx0aWYgcG9pbnRzIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0QHZlcnRpY2VzID0gcG9pbnRzIGlmIHBvaW50cz9cclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgYXJndW1lbnRzLmxlbmd0aCA8IDRcclxuXHRcdFx0XHR4ID0gMFxyXG5cdFx0XHRcdHkgPSAwXHJcblx0XHRcdFx0cmFkaXVzID0gYXJndW1lbnRzWzBdXHJcblx0XHRcdFx0biA9IGFyZ3VtZW50c1sxXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0eCA9IGFyZ3VtZW50c1swXVxyXG5cdFx0XHRcdHkgPSBhcmd1bWVudHNbMV1cclxuXHRcdFx0XHRyYWRpdXMgPSBhcmd1bWVudHNbMl1cclxuXHRcdFx0XHRuID0gYXJndW1lbnRzWzNdXHJcblx0XHRcdEB2ZXJ0aWNlcyA9IEJ1LlBvbHlnb24uZ2VuZXJhdGVSZWd1bGFyUG9pbnRzIHgsIHksIHJhZGl1cywgbiwgb3B0aW9uc1xyXG5cclxuXHRcdCMgaW5pdCBsaW5lc1xyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0Zm9yIGkgaW4gWzAgLi4uIEB2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tpXSwgQHZlcnRpY2VzW2kgKyAxXSkpXHJcblx0XHRcdEBsaW5lcy5wdXNoKG5ldyBCdS5MaW5lKEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMV0sIEB2ZXJ0aWNlc1swXSkpXHJcblxyXG5cdFx0IyBpbml0IHRyaWFuZ2xlc1xyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDJcclxuXHRcdFx0Zm9yIGkgaW4gWzEgLi4uIEB2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdEB0cmlhbmdsZXMucHVzaChuZXcgQnUuVHJpYW5nbGUoQHZlcnRpY2VzWzBdLCBAdmVydGljZXNbaV0sIEB2ZXJ0aWNlc1tpICsgMV0pKVxyXG5cclxuXHRcdEBrZXlQb2ludHMgPSBAdmVydGljZXNcclxuXHJcblx0Y2xvbmU6IC0+IG5ldyBCdS5Qb2x5Z29uIEB2ZXJ0aWNlc1xyXG5cclxuXHQjIGRldGVjdFxyXG5cclxuXHRpc1NpbXBsZTogKCkgLT5cclxuXHRcdGxlbiA9IEBsaW5lcy5sZW5ndGhcclxuXHRcdGZvciBpIGluIFswLi4ubGVuXVxyXG5cdFx0XHRmb3IgaiBpbiBbaSArIDEuLi5sZW5dXHJcblx0XHRcdFx0aWYgQGxpbmVzW2ldLmlzQ3Jvc3NXaXRoTGluZShAbGluZXNbal0pXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdCMgZWRpdFxyXG5cclxuXHRhZGRQb2ludDogKHBvaW50LCBpbnNlcnRJbmRleCkgLT5cclxuXHRcdGlmIG5vdCBpbnNlcnRJbmRleD9cclxuXHRcdFx0IyBhZGQgcG9pbnRcclxuXHRcdFx0QHZlcnRpY2VzLnB1c2ggcG9pbnRcclxuXHJcblx0XHRcdCMgYWRkIGxpbmVcclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAbGluZXNbQGxpbmVzLmxlbmd0aCAtIDFdLnBvaW50c1sxXSA9IHBvaW50XHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0QGxpbmVzLnB1c2gobmV3IEJ1LkxpbmUoQHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXSwgQHZlcnRpY2VzWzBdKSlcclxuXHJcblx0XHRcdCMgYWRkIHRyaWFuZ2xlXHJcblx0XHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiAyXHJcblx0XHRcdFx0QHRyaWFuZ2xlcy5wdXNoKG5ldyBCdS5UcmlhbmdsZShcclxuXHRcdFx0XHRcdFx0QHZlcnRpY2VzWzBdXHJcblx0XHRcdFx0XHRcdEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMl1cclxuXHRcdFx0XHRcdFx0QHZlcnRpY2VzW0B2ZXJ0aWNlcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRcdCkpXHJcblx0XHRlbHNlXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHBvaW50KVxyXG5cdCMgVE9ETyBhZGQgbGluZXMgYW5kIHRyaWFuZ2xlc1xyXG5cclxuXHQjIHBvaW50IHJlbGF0ZWRcclxuXHJcblx0X2NvbnRhaW5zUG9pbnQ6IChwKSAtPlxyXG5cdFx0Zm9yIHRyaWFuZ2xlIGluIEB0cmlhbmdsZXNcclxuXHRcdFx0aWYgdHJpYW5nbGUuY29udGFpbnNQb2ludCBwXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRAZ2VuZXJhdGVSZWd1bGFyUG9pbnRzID0gKGN4LCBjeSwgcmFkaXVzLCBuLCBvcHRpb25zKSAtPlxyXG5cdFx0YW5nbGVEZWx0YSA9IG9wdGlvbnMuYW5nbGVcclxuXHRcdHIgPSByYWRpdXNcclxuXHRcdHBvaW50cyA9IFtdXHJcblx0XHRhbmdsZVNlY3Rpb24gPSBNYXRoLlBJICogMiAvIG5cclxuXHRcdGZvciBpIGluIFswIC4uLiBuXVxyXG5cdFx0XHRhID0gaSAqIGFuZ2xlU2VjdGlvbiArIGFuZ2xlRGVsdGFcclxuXHRcdFx0eCA9IGN4ICsgciAqIE1hdGguY29zKGEpXHJcblx0XHRcdHkgPSBjeSArIHIgKiBNYXRoLnNpbihhKVxyXG5cdFx0XHRwb2ludHNbaV0gPSBuZXcgQnUuUG9pbnQgeCwgeVxyXG5cdFx0cmV0dXJuIHBvaW50c1xyXG4iLCIjIHBvbHlsaW5lIHNoYXBlXHJcblxyXG5jbGFzcyBCdS5Qb2x5bGluZSBleHRlbmRzIEJ1Lk9iamVjdDJEXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQHZlcnRpY2VzID0gW10pIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdQb2x5bGluZSdcclxuXHJcblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoID4gMVxyXG5cdFx0XHR2ZXJ0aWNlcyA9IFtdXHJcblx0XHRcdGZvciBpIGluIFswIC4uLiBhcmd1bWVudHMubGVuZ3RoIC8gMl1cclxuXHRcdFx0XHR2ZXJ0aWNlcy5wdXNoIG5ldyBCdS5Qb2ludCBhcmd1bWVudHNbaSAqIDJdLCBhcmd1bWVudHNbaSAqIDIgKyAxXVxyXG5cdFx0XHRAdmVydGljZXMgPSB2ZXJ0aWNlc1xyXG5cclxuXHRcdEBsaW5lcyA9IFtdXHJcblx0XHRAbGVuZ3RoID0gMFxyXG5cdFx0QHBvaW50Tm9ybWFsaXplZFBvcyA9IFtdXHJcblx0XHRAa2V5UG9pbnRzID0gQHZlcnRpY2VzXHJcblxyXG5cdFx0QGZpbGwgb2ZmXHJcblxyXG5cdFx0QG9uIFwicG9pbnRDaGFuZ2VcIiwgPT5cclxuXHRcdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRAdXBkYXRlTGluZXMoKVxyXG5cdFx0XHRcdEBjYWxjTGVuZ3RoKClcclxuXHRcdFx0XHRAY2FsY1BvaW50Tm9ybWFsaXplZFBvcygpXHJcblx0XHRAdHJpZ2dlciBcInBvaW50Q2hhbmdlXCIsIEBcclxuXHJcblx0Y2xvbmU6ID0+IG5ldyBCdS5Qb2x5bGluZSBAdmVydGljZXNcclxuXHJcblx0dXBkYXRlTGluZXM6ID0+XHJcblx0XHRmb3IgaSBpbiBbMCAuLi4gQHZlcnRpY2VzLmxlbmd0aCAtIDFdXHJcblx0XHRcdGlmIEBsaW5lc1tpXT9cclxuXHRcdFx0XHRAbGluZXNbaV0uc2V0IEB2ZXJ0aWNlc1tpXSwgQHZlcnRpY2VzW2kgKyAxXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0QGxpbmVzW2ldID0gbmV3IEJ1LkxpbmUgQHZlcnRpY2VzW2ldLCBAdmVydGljZXNbaSArIDFdXHJcblx0IyBUT0RPIHJlbW92ZSB0aGUgcmVzdFxyXG5cclxuXHRjYWxjTGVuZ3RoOiA9PlxyXG5cdFx0aWYgQHZlcnRpY2VzLmxlbmd0aCA8IDJcclxuXHRcdFx0QGxlbmd0aCA9IDBcclxuXHRcdGVsc2VcclxuXHRcdFx0bGVuID0gMFxyXG5cdFx0XHRmb3IgaSBpbiBbMSAuLi4gQHZlcnRpY2VzLmxlbmd0aF1cclxuXHRcdFx0XHRsZW4gKz0gQHZlcnRpY2VzW2ldLmRpc3RhbmNlVG8gQHZlcnRpY2VzW2kgLSAxXVxyXG5cdFx0XHRAbGVuZ3RoID0gbGVuXHJcblxyXG5cdGNhbGNQb2ludE5vcm1hbGl6ZWRQb3M6ICgpIC0+XHJcblx0XHRjdXJyUG9zID0gMFxyXG5cdFx0QHBvaW50Tm9ybWFsaXplZFBvc1swXSA9IDBcclxuXHRcdGZvciBpIGluIFsxIC4uLiBAdmVydGljZXMubGVuZ3RoXVxyXG5cdFx0XHRjdXJyUG9zICs9IEB2ZXJ0aWNlc1tpXS5kaXN0YW5jZVRvKEB2ZXJ0aWNlc1tpIC0gMV0pIC8gQGxlbmd0aFxyXG5cdFx0XHRAcG9pbnROb3JtYWxpemVkUG9zW2ldID0gY3VyclBvc1xyXG5cclxuXHRnZXROb3JtYWxpemVkUG9zOiAoaW5kZXgpIC0+XHJcblx0XHRpZiBpbmRleD9cclxuXHRcdFx0cmV0dXJuIEBwb2ludE5vcm1hbGl6ZWRQb3NbaW5kZXhdXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBAcG9pbnROb3JtYWxpemVkUG9zXHJcblxyXG5cdGNvbXByZXNzOiAoc3RyZW5ndGggPSAwLjgpIC0+XHJcblx0XHRjb21wcmVzc2VkID0gW11cclxuXHRcdGZvciBvd24gaSBvZiBAdmVydGljZXNcclxuXHRcdFx0aWYgaSA8IDJcclxuXHRcdFx0XHRjb21wcmVzc2VkW2ldID0gQHZlcnRpY2VzW2ldXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRbcEEsIHBNXSA9IGNvbXByZXNzZWRbLTIuLi0xXVxyXG5cdFx0XHRcdHBCID0gQHZlcnRpY2VzW2ldXHJcblx0XHRcdFx0b2JsaXF1ZUFuZ2xlID0gTWF0aC5hYnMoTWF0aC5hdGFuMihwQS55IC0gcE0ueSwgcEEueCAtIHBNLngpIC0gTWF0aC5hdGFuMihwTS55IC0gcEIueSwgcE0ueCAtIHBCLngpKVxyXG5cdFx0XHRcdGlmIG9ibGlxdWVBbmdsZSA8IHN0cmVuZ3RoICogc3RyZW5ndGggKiBNYXRoLlBJIC8gMlxyXG5cdFx0XHRcdFx0Y29tcHJlc3NlZFtjb21wcmVzc2VkLmxlbmd0aCAtIDFdID0gcEJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjb21wcmVzc2VkLnB1c2ggcEJcclxuXHRcdEB2ZXJ0aWNlcyA9IGNvbXByZXNzZWRcclxuXHRcdEBrZXlQb2ludHMgPSBAdmVydGljZXNcclxuXHRcdEBcclxuXHJcblx0IyBlZGl0XHJcblxyXG5cdHNldCA9IChwb2ludHMpIC0+XHJcblx0XHQjIHBvaW50c1xyXG5cdFx0Zm9yIGkgaW4gWzAgLi4uIEB2ZXJ0aWNlcy5sZW5ndGhdXHJcblx0XHRcdEB2ZXJ0aWNlc1tpXS5jb3B5IHBvaW50c1tpXVxyXG5cclxuXHRcdCMgcmVtb3ZlIHRoZSBleHRyYSBwb2ludHNcclxuXHRcdGlmIEB2ZXJ0aWNlcy5sZW5ndGggPiBwb2ludHMubGVuZ3RoXHJcblx0XHRcdEB2ZXJ0aWNlcy5zcGxpY2UgcG9pbnRzLmxlbmd0aFxyXG5cclxuXHRcdEB0cmlnZ2VyIFwicG9pbnRDaGFuZ2VcIiwgQFxyXG5cclxuXHRhZGRQb2ludDogKHBvaW50LCBpbnNlcnRJbmRleCkgLT5cclxuXHRcdGlmIG5vdCBpbnNlcnRJbmRleD9cclxuXHRcdFx0IyBhZGQgcG9pbnRcclxuXHRcdFx0QHZlcnRpY2VzLnB1c2ggcG9pbnRcclxuXHRcdFx0IyBhZGQgbGluZVxyXG5cdFx0XHRpZiBAdmVydGljZXMubGVuZ3RoID4gMVxyXG5cdFx0XHRcdEBsaW5lcy5wdXNoIG5ldyBCdS5MaW5lIEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMl0sIEB2ZXJ0aWNlc1tAdmVydGljZXMubGVuZ3RoIC0gMV1cclxuXHRcdGVsc2VcclxuXHRcdFx0QHZlcnRpY2VzLnNwbGljZSBpbnNlcnRJbmRleCwgMCwgcG9pbnRcclxuXHRcdCMgVE9ETyBhZGQgbGluZXNcclxuXHRcdEB0cmlnZ2VyIFwicG9pbnRDaGFuZ2VcIiwgQFxyXG4iLCIjIHJlY3RhbmdsZSBzaGFwZVxyXG5cclxuY2xhc3MgQnUuUmVjdGFuZ2xlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6ICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJSYWRpdXMgPSAwKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnUmVjdGFuZ2xlJ1xyXG5cclxuXHRcdEBwb3NpdGlvbiA9IG5ldyBCdS5Qb2ludCh4LCB5KVxyXG5cdFx0QGNlbnRlciA9IG5ldyBCdS5Qb2ludCh4ICsgd2lkdGggLyAyLCB5ICsgaGVpZ2h0IC8gMilcclxuXHRcdEBzaXplID0gbmV3IEJ1LlNpemUod2lkdGgsIGhlaWdodClcclxuXHJcblx0XHRAcG9pbnRSVCA9IG5ldyBCdS5Qb2ludCh4ICsgd2lkdGgsIHkpXHJcblx0XHRAcG9pbnRSQiA9IG5ldyBCdS5Qb2ludCh4ICsgd2lkdGgsIHkgKyBoZWlnaHQpXHJcblx0XHRAcG9pbnRMQiA9IG5ldyBCdS5Qb2ludCh4LCB5ICsgaGVpZ2h0KVxyXG5cclxuXHRcdEBwb2ludHMgPSBbQHBvc2l0aW9uLCBAcG9pbnRSVCwgQHBvaW50UkIsIEBwb2ludExCXVxyXG5cclxuXHRcdEBjb3JuZXJSYWRpdXMgPSBjb3JuZXJSYWRpdXNcclxuXHJcblx0QHByb3BlcnR5ICdjb3JuZXJSYWRpdXMnLFxyXG5cdFx0Z2V0OiAtPiBAX2Nvcm5lclJhZGl1c1xyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2Nvcm5lclJhZGl1cyA9IHZhbFxyXG5cdFx0XHRAa2V5UG9pbnRzID0gaWYgdmFsID4gMCB0aGVuIFtdIGVsc2UgQHBvaW50c1xyXG5cclxuXHRjbG9uZTogLT4gbmV3IEJ1LlJlY3RhbmdsZSBAcG9zaXRpb24ueCwgQHBvc2l0aW9uLnksIEBzaXplLndpZHRoLCBAc2l6ZS5oZWlnaHRcclxuXHJcblx0Y29udGFpbnNQb2ludDogKHBvaW50KSAtPlxyXG5cdFx0cmV0dXJuIHBvaW50LnggPiBAcG9zaXRpb24ueCBhbmRcclxuXHRcdFx0XHRwb2ludC55ID4gQHBvc2l0aW9uLnkgYW5kXHJcblx0XHRcdFx0cG9pbnQueCA8IEBwb3NpdGlvbi54ICsgQHNpemUud2lkdGggYW5kXHJcblx0XHRcdFx0cG9pbnQueSA8IEBwb3NpdGlvbi55ICsgQHNpemUuaGVpZ2h0XHJcbiIsIiMgc3BsaW5lIHNoYXBlXHJcblxyXG5jbGFzcyBCdS5TcGxpbmUgZXh0ZW5kcyBCdS5PYmplY3QyRFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHZlcnRpY2VzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnU3BsaW5lJ1xyXG5cclxuXHRcdGlmIHZlcnRpY2VzIGluc3RhbmNlb2YgQnUuUG9seWxpbmVcclxuXHRcdFx0cG9seWxpbmUgPSB2ZXJ0aWNlc1xyXG5cdFx0XHRAdmVydGljZXMgPSBwb2x5bGluZS52ZXJ0aWNlc1xyXG5cdFx0XHRwb2x5bGluZS5vbiAncG9pbnRDaGFuZ2UnLCAocG9seWxpbmUpID0+XHJcblx0XHRcdFx0QHZlcnRpY2VzID0gcG9seWxpbmUudmVydGljZXNcclxuXHRcdFx0XHRjYWxjQ29udHJvbFBvaW50cyBAXHJcblx0XHRlbHNlXHJcblx0XHRcdEB2ZXJ0aWNlcyA9IEJ1LmNsb25lIHZlcnRpY2VzXHJcblxyXG5cdFx0QGtleVBvaW50cyA9IEB2ZXJ0aWNlc1xyXG5cdFx0QGNvbnRyb2xQb2ludHNBaGVhZCA9IFtdXHJcblx0XHRAY29udHJvbFBvaW50c0JlaGluZCA9IFtdXHJcblxyXG5cdFx0QGZpbGwgb2ZmXHJcblx0XHRAc21vb3RoRmFjdG9yID0gQnUuREVGQVVMVF9TUExJTkVfU01PT1RIXHJcblx0XHRAX3Ntb290aGVyID0gbm9cclxuXHJcblx0XHRjYWxjQ29udHJvbFBvaW50cyBAXHJcblxyXG5cdEBwcm9wZXJ0eSAnc21vb3RoZXInLFxyXG5cdFx0Z2V0OiAtPiBAX3Ntb290aGVyXHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdG9sZFZhbCA9IEBfc21vb3RoZXJcclxuXHRcdFx0QF9zbW9vdGhlciA9IHZhbFxyXG5cdFx0XHRjYWxjQ29udHJvbFBvaW50cyBAIGlmIG9sZFZhbCAhPSBAX3Ntb290aGVyXHJcblxyXG5cdGNsb25lOiAtPiBuZXcgQnUuU3BsaW5lIEB2ZXJ0aWNlc1xyXG5cclxuXHRhZGRQb2ludDogKHBvaW50KSAtPlxyXG5cdFx0QHZlcnRpY2VzLnB1c2ggcG9pbnRcclxuXHRcdGNhbGNDb250cm9sUG9pbnRzIEBcclxuXHJcblx0Y2FsY0NvbnRyb2xQb2ludHMgPSAoc3BsaW5lKSAtPlxyXG5cdFx0c3BsaW5lLmtleVBvaW50cyA9IHNwbGluZS52ZXJ0aWNlc1xyXG5cclxuXHRcdHAgPSBzcGxpbmUudmVydGljZXNcclxuXHRcdGxlbiA9IHAubGVuZ3RoXHJcblx0XHRpZiBsZW4gPj0gMVxyXG5cdFx0XHRzcGxpbmUuY29udHJvbFBvaW50c0JlaGluZFswXSA9IHBbMF1cclxuXHRcdGlmIGxlbiA+PSAyXHJcblx0XHRcdHNwbGluZS5jb250cm9sUG9pbnRzQWhlYWRbbGVuIC0gMV0gPSBwW2xlbiAtIDFdXHJcblx0XHRpZiBsZW4gPj0gM1xyXG5cdFx0XHRmb3IgaSBpbiBbMS4uLmxlbiAtIDFdXHJcblx0XHRcdFx0dGhldGExID0gTWF0aC5hdGFuMiBwW2ldLnkgLSBwW2kgLSAxXS55LCBwW2ldLnggLSBwW2kgLSAxXS54XHJcblx0XHRcdFx0dGhldGEyID0gTWF0aC5hdGFuMiBwW2kgKyAxXS55IC0gcFtpXS55LCBwW2kgKyAxXS54IC0gcFtpXS54XHJcblx0XHRcdFx0bGVuMSA9IEJ1LmJldmVsIHBbaV0ueSAtIHBbaSAtIDFdLnksIHBbaV0ueCAtIHBbaSAtIDFdLnhcclxuXHRcdFx0XHRsZW4yID0gQnUuYmV2ZWwgcFtpXS55IC0gcFtpICsgMV0ueSwgcFtpXS54IC0gcFtpICsgMV0ueFxyXG5cdFx0XHRcdHRoZXRhID0gdGhldGExICsgKHRoZXRhMiAtIHRoZXRhMSkgKiBpZiBzcGxpbmUuX3Ntb290aGVyIHRoZW4gbGVuMSAvIChsZW4xICsgbGVuMikgZWxzZSAwLjVcclxuXHRcdFx0XHR0aGV0YSArPSBNYXRoLlBJIGlmIE1hdGguYWJzKHRoZXRhIC0gdGhldGExKSA+IE1hdGguUEkgLyAyXHJcblx0XHRcdFx0eEEgPSBwW2ldLnggLSBsZW4xICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguY29zKHRoZXRhKVxyXG5cdFx0XHRcdHlBID0gcFtpXS55IC0gbGVuMSAqIHNwbGluZS5zbW9vdGhGYWN0b3IgKiBNYXRoLnNpbih0aGV0YSlcclxuXHRcdFx0XHR4QiA9IHBbaV0ueCArIGxlbjIgKiBzcGxpbmUuc21vb3RoRmFjdG9yICogTWF0aC5jb3ModGhldGEpXHJcblx0XHRcdFx0eUIgPSBwW2ldLnkgKyBsZW4yICogc3BsaW5lLnNtb290aEZhY3RvciAqIE1hdGguc2luKHRoZXRhKVxyXG5cdFx0XHRcdHNwbGluZS5jb250cm9sUG9pbnRzQWhlYWRbaV0gPSBuZXcgQnUuUG9pbnQgeEEsIHlBXHJcblx0XHRcdFx0c3BsaW5lLmNvbnRyb2xQb2ludHNCZWhpbmRbaV0gPSBuZXcgQnUuUG9pbnQgeEIsIHlCXHJcblxyXG5cdFx0XHRcdCMgYWRkIGNvbnRyb2wgbGluZXMgZm9yIGRlYnVnZ2luZ1xyXG5cdFx0XHRcdCNzcGxpbmUuY2hpbGRyZW5baSAqIDIgLSAyXSA9IG5ldyBCdS5MaW5lIHNwbGluZS52ZXJ0aWNlc1tpXSwgc3BsaW5lLmNvbnRyb2xQb2ludHNBaGVhZFtpXVxyXG5cdFx0XHRcdCNzcGxpbmUuY2hpbGRyZW5baSAqIDIgLSAxXSA9ICBuZXcgQnUuTGluZSBzcGxpbmUudmVydGljZXNbaV0sIHNwbGluZS5jb250cm9sUG9pbnRzQmVoaW5kW2ldXHJcbiIsIiMgdHJpYW5nbGUgc2hhcGVcclxuXHJcbmNsYXNzIEJ1LlRyaWFuZ2xlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChwMSwgcDIsIHAzKSAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHR5cGUgPSAnVHJpYW5nbGUnXHJcblxyXG5cdFx0aWYgYXJndW1lbnRzLmxlbmd0aCA9PSA2XHJcblx0XHRcdFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzXSA9IGFyZ3VtZW50c1xyXG5cdFx0XHRwMSA9IG5ldyBCdS5Qb2ludCB4MSwgeTFcclxuXHRcdFx0cDIgPSBuZXcgQnUuUG9pbnQgeDIsIHkyXHJcblx0XHRcdHAzID0gbmV3IEJ1LlBvaW50IHgzLCB5M1xyXG5cclxuXHRcdEBsaW5lcyA9IFtcclxuXHRcdFx0bmV3IEJ1LkxpbmUocDEsIHAyKVxyXG5cdFx0XHRuZXcgQnUuTGluZShwMiwgcDMpXHJcblx0XHRcdG5ldyBCdS5MaW5lKHAzLCBwMSlcclxuXHRcdF1cclxuXHRcdCNAY2VudGVyID0gbmV3IEJ1LlBvaW50IEJ1LmF2ZXJhZ2UocDEueCwgcDIueCwgcDMueCksIEJ1LmF2ZXJhZ2UocDEueSwgcDIueSwgcDMueSlcclxuXHRcdEBwb2ludHMgPSBbcDEsIHAyLCBwM11cclxuXHRcdEBrZXlQb2ludHMgPSBAcG9pbnRzXHJcblxyXG5cdGNsb25lOiA9PiBuZXcgQnUuVHJpYW5nbGUgQHBvaW50c1swXSwgQHBvaW50c1sxXSwgQHBvaW50c1syXVxyXG5cclxuXHQjIFRPRE8gdGVzdFxyXG5cdGFyZWE6ICgpIC0+XHJcblx0XHRbYSwgYiwgY10gPSBAcG9pbnRzXHJcblx0XHRyZXR1cm4gTWF0aC5hYnMoKChiLnggLSBhLngpICogKGMueSAtIGEueSkpIC0gKChjLnggLSBhLngpICogKGIueSAtIGEueSkpKSAvIDJcclxuXHJcblx0X2NvbnRhaW5zUG9pbnQ6IChwKSAtPlxyXG5cdFx0cmV0dXJuIEBsaW5lc1swXS5pc1R3b1BvaW50c1NhbWVTaWRlKHAsIEBwb2ludHNbMl0pIGFuZFxyXG5cdFx0XHRcdEBsaW5lc1sxXS5pc1R3b1BvaW50c1NhbWVTaWRlKHAsIEBwb2ludHNbMF0pIGFuZFxyXG5cdFx0XHRcdEBsaW5lc1syXS5pc1R3b1BvaW50c1NhbWVTaWRlKHAsIEBwb2ludHNbMV0pXHJcbiIsIiMgZHJhdyBiaXRtYXBcclxuXHJcbmNsYXNzIEJ1LkltYWdlIGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0Y29uc3RydWN0b3I6IChAdXJsLCB4ID0gMCwgeSA9IDAsIHdpZHRoLCBoZWlnaHQpIC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdHlwZSA9ICdJbWFnZSdcclxuXHJcblx0XHRAYXV0b1NpemUgPSB5ZXNcclxuXHRcdEBzaXplID0gbmV3IEJ1LlNpemUgQnUuREVGQVVMVF9JTUFHRV9TSVpFLCBCdS5ERUZBVUxUX0lNQUdFX1NJWkVcclxuXHRcdEB0cmFuc2xhdGUgPSBuZXcgQnUuVmVjdG9yIHgsIHlcclxuXHRcdEBjZW50ZXIgPSBuZXcgQnUuVmVjdG9yIHggKyB3aWR0aCAvIDIsIHkgKyBoZWlnaHQgLyAyXHJcblx0XHRpZiB3aWR0aD9cclxuXHRcdFx0QHNpemUuc2V0IHdpZHRoLCBoZWlnaHRcclxuXHRcdFx0QGF1dG9TaXplID0gbm9cclxuXHJcblx0XHRAcGl2b3QgPSBuZXcgQnUuVmVjdG9yIDAuNSwgMC41XHJcblxyXG5cdFx0QGltYWdlID0gbmV3IEJ1Lmdsb2JhbC5JbWFnZVxyXG5cdFx0QGxvYWRlZCA9IGZhbHNlXHJcblxyXG5cdFx0QGltYWdlLm9ubG9hZCA9IChlKSA9PlxyXG5cdFx0XHRpZiBAYXV0b1NpemVcclxuXHRcdFx0XHRAc2l6ZS5zZXQgQGltYWdlLndpZHRoLCBAaW1hZ2UuaGVpZ2h0XHJcblx0XHRcdEBsb2FkZWQgPSB0cnVlXHJcblxyXG5cdFx0QGltYWdlLnNyYyA9IEB1cmxcclxuIiwiIyBkcmF3IHRleHQgYnkgYSBwb2ludFxyXG5cclxuY2xhc3MgQnUuUG9pbnRUZXh0IGV4dGVuZHMgQnUuT2JqZWN0MkRcclxuXHJcblx0IyMjXHJcblx0b3B0aW9ucy5hbGlnbjpcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0fCAgIC0tICAgIDAtICAgICstICAgfFxyXG5cdHwgICAgICAgICB84oaZMDAgICAgICB8XHJcblx0fCAgIC0wICAtLSstPiAgICswICAgfFxyXG5cdHwgICAgICAgICDihpMgICAgICAgICAgfFxyXG5cdHwgICAtKyAgICAwKyAgICArKyAgIHxcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Zm9yIGV4YW1wbGU6IHRleHQgaXMgaW4gdGhlIHJpZ2h0IHRvcCBvZiB0aGUgcG9pbnQsIHRoZW4gYWxpZ24gPSBcIistXCJcclxuXHQjIyNcclxuXHRjb25zdHJ1Y3RvcjogKEB0ZXh0LCBAeCA9IDAsIEB5ID0gMCkgLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0eXBlID0gJ1BvaW50VGV4dCdcclxuXHRcdEBzdHJva2VTdHlsZSA9IG51bGwgIyBubyBzdHJva2UgYnkgZGVmYXVsdFxyXG5cdFx0QGZpbGxTdHlsZSA9IEJ1LkRFRkFVTFRfVEVYVF9GSUxMX1NUWUxFXHJcblxyXG5cdFx0b3B0aW9ucyA9IEJ1LmNvbWJpbmVPcHRpb25zIGFyZ3VtZW50cyxcclxuXHRcdFx0YWxpZ246ICcwMCdcclxuXHRcdFx0Zm9udEZhbWlseTogJ1ZlcmRhbmEnXHJcblx0XHRcdGZvbnRTaXplOiAxMVxyXG5cdFx0QGFsaWduID0gb3B0aW9ucy5hbGlnblxyXG5cdFx0QF9mb250RmFtaWx5ID0gb3B0aW9ucy5mb250RmFtaWx5XHJcblx0XHRAX2ZvbnRTaXplID0gb3B0aW9ucy5mb250U2l6ZVxyXG5cdFx0QGZvbnQgPSBcIiN7IEBfZm9udFNpemUgfXB4ICN7IEBfZm9udEZhbWlseSB9XCIgb3Igb3B0aW9ucy5mb250XHJcblxyXG5cdFx0QHNldENvbnRleHRBbGlnbiBAYWxpZ25cclxuXHJcblx0QHByb3BlcnR5ICdmb250RmFtaWx5JyxcclxuXHRcdGdldDogLT4gQF9mb250RmFtaWx5XHJcblx0XHRzZXQ6ICh2YWwpIC0+XHJcblx0XHRcdEBfZm9udEZhbWlseSA9IHZhbFxyXG5cdFx0XHRAZm9udCA9IFwiI3sgQF9mb250U2l6ZSB9cHggI3sgQF9mb250RmFtaWx5IH1cIlxyXG5cclxuXHRAcHJvcGVydHkgJ2ZvbnRTaXplJyxcclxuXHRcdGdldDogLT4gQF9mb250U2l6ZVxyXG5cdFx0c2V0OiAodmFsKSAtPlxyXG5cdFx0XHRAX2ZvbnRTaXplID0gdmFsXHJcblx0XHRcdEBmb250ID0gXCIjeyBAX2ZvbnRTaXplIH1weCAjeyBAX2ZvbnRGYW1pbHkgfVwiXHJcblxyXG5cdHNldENvbnRleHRBbGlnbjogKGFsaWduKSA9PlxyXG5cdFx0aWYgYWxpZ24ubGVuZ3RoID09IDFcclxuXHRcdFx0YWxpZ24gPSAnJyArIGFsaWduICsgYWxpZ25cclxuXHRcdGFsaWduWCA9IGFsaWduLnN1YnN0cmluZygwLCAxKVxyXG5cdFx0YWxpZ25ZID0gYWxpZ24uc3Vic3RyaW5nKDEsIDIpXHJcblx0XHRAdGV4dEFsaWduID0gc3dpdGNoIGFsaWduWFxyXG5cdFx0XHR3aGVuICctJyB0aGVuICdyaWdodCdcclxuXHRcdFx0d2hlbiAnMCcgdGhlbiAnY2VudGVyJ1xyXG5cdFx0XHR3aGVuICcrJyB0aGVuICdsZWZ0J1xyXG5cdFx0QHRleHRCYXNlbGluZSA9IHN3aXRjaCBhbGlnbllcclxuXHRcdFx0d2hlbiAnLScgdGhlbiAnYm90dG9tJ1xyXG5cdFx0XHR3aGVuICcwJyB0aGVuICdtaWRkbGUnXHJcblx0XHRcdHdoZW4gJysnIHRoZW4gJ3RvcCdcclxuIiwiIyBhbmltYXRpb25cclxuXHJcbmNsYXNzIEJ1LkFuaW1hdGlvblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XHJcblx0XHRAZnJvbSA9IG9wdGlvbnMuZnJvbVxyXG5cdFx0QHRvID0gb3B0aW9ucy50b1xyXG5cdFx0QGRhdGEgPSBvcHRpb25zLmRhdGEgb3Ige31cclxuXHRcdEBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gb3IgMC41XHJcblx0XHRAcmVwZWF0ID0gaWYgb3B0aW9ucy5yZXBlYXQ/IHRoZW4gb3B0aW9ucy5yZXBlYXQgZWxzZSBmYWxzZVxyXG5cdFx0QGluaXQgPSBvcHRpb25zLmluaXRcclxuXHRcdEB1cGRhdGUgPSBvcHRpb25zLnVwZGF0ZVxyXG5cdFx0QGZpbmlzaCA9IG9wdGlvbnMuZmluaXNoXHJcblxyXG5cdGFwcGx5OiAodGFyZ2V0LCBhcmdzKSAtPlxyXG5cdFx0QnUuYW5pbWF0aW9uUnVubmVyLmFkZCBALCB0YXJnZXQsIGFyZ3NcclxuXHJcbiMgcHJlZmFiIGFuaW1hdGlvbnNcclxuIyBUaGUgbmFtZXMgYXJlIGFjY29yZGluZyB0byBqUXVlcnkgVUlcclxuQnUuYW5pbWF0aW9ucyA9XHJcblxyXG5cdCMgc2ltcGxlXHJcblxyXG5cdGZhZGVJbjogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0dXBkYXRlOiAodCkgLT5cclxuXHRcdFx0QG9wYWNpdHkgPSB0XHJcblxyXG5cdGZhZGVPdXQ6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdHVwZGF0ZTogKHQpIC0+XHJcblx0XHRcdEBvcGFjaXR5ID0gMSAtIHRcclxuXHJcblx0c3BpbjogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0dXBkYXRlOiAodCkgLT5cclxuXHRcdFx0QHJvdGF0aW9uID0gdCAqIE1hdGguUEkgKiAyXHJcblxyXG5cdHNwaW5JbjogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0sIGFyZyA9IDEpIC0+XHJcblx0XHRcdGFuaW0uZGF0YS5kcyA9IGFyZ1xyXG5cdFx0dXBkYXRlOiAodCwgZGF0YSkgLT5cclxuXHRcdFx0QG9wYWNpdHkgPSB0XHJcblx0XHRcdEByb3RhdGlvbiA9IHQgKiBNYXRoLlBJICogNFxyXG5cdFx0XHRAc2NhbGUgPSB0ICogZGF0YS5kc1xyXG5cclxuXHRzcGluT3V0OiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHR1cGRhdGU6ICh0KSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IDEgLSB0XHJcblx0XHRcdEByb3RhdGlvbiA9IHQgKiBNYXRoLlBJICogNFxyXG5cdFx0XHRAc2NhbGUgPSAxIC0gdFxyXG5cclxuXHRibGluazogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0ZHVyYXRpb246IDAuMlxyXG5cdFx0ZnJvbTogMFxyXG5cdFx0dG86IDUxMlxyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0ZGF0YSA9IE1hdGguZmxvb3IgTWF0aC5hYnMoZCAtIDI1NilcclxuXHRcdFx0QGZpbGxTdHlsZSA9IFwicmdiKCN7IGRhdGEgfSwgI3sgZGF0YSB9LCAjeyBkYXRhIH0pXCJcclxuXHJcblx0c2hha2U6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltLCBhcmcpIC0+XHJcblx0XHRcdGFuaW0uZGF0YS5veCA9IEB0cmFuc2xhdGUueFxyXG5cdFx0XHRhbmltLmRhdGEucmFuZ2UgPSBhcmcgb3IgMjBcclxuXHRcdHVwZGF0ZTogKHQsIGRhdGEpIC0+XHJcblx0XHRcdEB0cmFuc2xhdGUueCA9IE1hdGguc2luKHQgKiBNYXRoLlBJICogOCkgKiBkYXRhLnJhbmdlICsgZGF0YS5veFxyXG5cclxuXHQjIHRvZ2dsZTogZGV0ZWN0IGFuZCBzYXZlIG9yaWdpbmFsIHN0YXR1c1xyXG5cclxuXHRwdWZmOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRkdXJhdGlvbjogMC4xNVxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9XHJcblx0XHRcdFx0b3BhY2l0eTogQG9wYWNpdHlcclxuXHRcdFx0XHRzY2FsZTogQHNjYWxlLnhcclxuXHRcdFx0YW5pbS50byA9XHJcblx0XHRcdFx0b3BhY2l0eTogaWYgQG9wYWNpdHkgPT0gMSB0aGVuIDAgZWxzZSAxXHJcblx0XHRcdFx0c2NhbGU6IGlmIEBvcGFjaXR5ID09IDEgdGhlbiBAc2NhbGUueCAqIDEuNSBlbHNlIEBzY2FsZS54IC8gMS41XHJcblx0XHR1cGRhdGU6IChkYXRhKSAtPlxyXG5cdFx0XHRAb3BhY2l0eSA9IGRhdGEub3BhY2l0eVxyXG5cdFx0XHRAc2NhbGUgPSBkYXRhLnNjYWxlXHJcblxyXG5cdGNsaXA6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRpZiBAc2NhbGUueSAhPSAwXHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHNjYWxlLnlcclxuXHRcdFx0XHRhbmltLnRvID0gMFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0YW5pbS5mcm9tID0gQHNjYWxlLnlcclxuXHRcdFx0XHRhbmltLnRvID0gQHNjYWxlLnhcclxuXHRcdHVwZGF0ZTogKGRhdGEpIC0+XHJcblx0XHRcdEBzY2FsZS55ID0gZGF0YVxyXG5cclxuXHRmbGlwWDogbmV3IEJ1LkFuaW1hdGlvblxyXG5cdFx0aW5pdDogKGFuaW0pIC0+XHJcblx0XHRcdGFuaW0uZnJvbSA9IEBzY2FsZS54XHJcblx0XHRcdGFuaW0udG8gPSAtYW5pbS5mcm9tXHJcblx0XHR1cGRhdGU6IChkYXRhKSAtPlxyXG5cdFx0XHRAc2NhbGUueCA9IGRhdGFcclxuXHJcblx0ZmxpcFk6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltKSAtPlxyXG5cdFx0XHRhbmltLmZyb20gPSBAc2NhbGUueVxyXG5cdFx0XHRhbmltLnRvID0gLWFuaW0uZnJvbVxyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0QHNjYWxlLnkgPSBkYXRhXHJcblxyXG5cdCMgd2l0aCBhcmd1bWVudHNcclxuXHJcblx0bW92ZVRvOiBuZXcgQnUuQW5pbWF0aW9uXHJcblx0XHRpbml0OiAoYW5pbSwgYXJncykgLT5cclxuXHRcdFx0aWYgYXJncz9cclxuXHRcdFx0XHRhbmltLmZyb20gPSBAdHJhbnNsYXRlLnhcclxuXHRcdFx0XHRhbmltLnRvID0gYXJnc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciAnYW5pbWF0aW9uIG1vdmVUbyBuZWVkIGFuIGFyZ3VtZW50J1xyXG5cdFx0dXBkYXRlOiAoZGF0YSkgLT5cclxuXHRcdFx0QHRyYW5zbGF0ZS54ID0gZGF0YVxyXG5cclxuXHRtb3ZlQnk6IG5ldyBCdS5BbmltYXRpb25cclxuXHRcdGluaXQ6IChhbmltLCBhcmdzKSAtPlxyXG5cdFx0XHRpZiBhcmdzP1xyXG5cdFx0XHRcdGFuaW0uZnJvbSA9IEB0cmFuc2xhdGUueFxyXG5cdFx0XHRcdGFuaW0udG8gPSBAdHJhbnNsYXRlLnggKyBwYXJzZUZsb2F0KGFyZ3MpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yICdhbmltYXRpb24gbW92ZVRvIG5lZWQgYW4gYXJndW1lbnQnXHJcblx0XHR1cGRhdGU6IChkYXRhKSAtPlxyXG5cdFx0XHRAdHJhbnNsYXRlLnggPSBkYXRhXHJcbiIsIiMgcnVuIHRoZSBhbmltYXRpb25zXHJcblxyXG5jbGFzcyBCdS5BbmltYXRpb25SdW5uZXJcclxuXHJcblx0Y29uc3RydWN0b3I6ICgpIC0+XHJcblx0XHRAcnVubmluZ0FuaW1hdGlvbnMgPSBbXVxyXG5cclxuXHRhZGQ6IChhbmltYXRpb24sIHRhcmdldCwgYXJncykgLT5cclxuXHRcdEBydW5uaW5nQW5pbWF0aW9ucy5wdXNoXHJcblx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uXHJcblx0XHRcdHRhcmdldDogdGFyZ2V0XHJcblx0XHRcdHN0YXJ0VGltZTogQnUubm93KClcclxuXHRcdFx0Y3VycmVudDogYW5pbWF0aW9uLmRhdGFcclxuXHRcdFx0ZmluaXNoZWQ6IG5vXHJcblx0XHRhbmltYXRpb24uaW5pdD8uY2FsbCB0YXJnZXQsIGFuaW1hdGlvbiwgYXJnc1xyXG5cclxuXHR1cGRhdGU6IC0+XHJcblx0XHRub3cgPSBCdS5ub3coKVxyXG5cdFx0Zm9yIHRhc2sgaW4gQHJ1bm5pbmdBbmltYXRpb25zXHJcblx0XHRcdGNvbnRpbnVlIGlmIHRhc2suZmluaXNoZWRcclxuXHJcblx0XHRcdGFuaW0gPSB0YXNrLmFuaW1hdGlvblxyXG5cdFx0XHR0ID0gKG5vdyAtIHRhc2suc3RhcnRUaW1lKSAvIChhbmltLmR1cmF0aW9uICogMTAwMClcclxuXHRcdFx0aWYgdCA+IDFcclxuXHRcdFx0XHRmaW5pc2ggPSB0cnVlXHJcblx0XHRcdFx0aWYgYW5pbS5yZXBlYXRcclxuXHRcdFx0XHRcdHQgPSAwXHJcblx0XHRcdFx0XHR0YXNrLnN0YXJ0VGltZSA9IEJ1Lm5vdygpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyMgVE9ETyByZW1vdmUgb3V0IG9mIGFycmF5XHJcblx0XHRcdFx0XHR0ID0gMVxyXG5cdFx0XHRcdFx0dGFzay5maW5pc2hlZCA9IHllc1xyXG5cclxuXHRcdFx0aWYgYW5pbS5mcm9tP1xyXG5cdFx0XHRcdGlmIGFuaW0uZnJvbSBpbnN0YW5jZW9mIE9iamVjdFxyXG5cdFx0XHRcdFx0Zm9yIG93biBrZXkgb2YgYW5pbS5mcm9tIHdoZW4ga2V5IG9mIGFuaW0udG9cclxuXHRcdFx0XHRcdFx0dGFzay5jdXJyZW50W2tleV0gPSBhbmltLnRvW2tleV0gKiB0IC0gYW5pbS5mcm9tW2tleV0gKiAodCAtIDEpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGFzay5jdXJyZW50ID0gYW5pbS50byAqIHQgLSBhbmltLmZyb20gKiAodCAtIDEpXHJcblx0XHRcdFx0YW5pbS51cGRhdGUuYXBwbHkgdGFzay50YXJnZXQsIFt0YXNrLmN1cnJlbnQsIHRdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRhbmltLnVwZGF0ZS5hcHBseSB0YXNrLnRhcmdldCwgW3QsIHRhc2suY3VycmVudF1cclxuXHRcdFx0aWYgZmluaXNoIHRoZW4gYW5pbS5maW5pc2g/LmNhbGwgdGFzay50YXJnZXQsIGFuaW1cclxuXHJcblx0IyBob29rIHVwIG9uIGFuIHJlbmRlcmVyLCByZW1vdmUgb3duIHNldEludGVybmFsXHJcblx0aG9va1VwOiAocmVuZGVyZXIpIC0+XHJcblx0XHRyZW5kZXJlci5vbiAndXBkYXRlJywgPT4gQHVwZGF0ZSgpXHJcblxyXG4jIGdsb2JhbCB1bmlxdWUgaW5zdGFuY2VcclxuQnUuYW5pbWF0aW9uUnVubmVyID0gbmV3IEJ1LkFuaW1hdGlvblJ1bm5lclxyXG4iLCIjIGdlbmVyYXRvciByYW5kb20gc2hhcGVzXHJcblxyXG5jbGFzcyBCdS5SYW5kb21TaGFwZUdlbmVyYXRvclxyXG5cclxuXHRNQVJHSU4gPSAzMFxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBidSkgLT5cclxuXHJcblx0cmFuZG9tWDogLT5cclxuXHRcdHJldHVybiBCdS5yYW5kIE1BUkdJTiwgQGJ1LndpZHRoIC0gTUFSR0lOICogMlxyXG5cclxuXHRyYW5kb21ZOiAtPlxyXG5cdFx0cmV0dXJuIEJ1LnJhbmQgTUFSR0lOLCBAYnUuaGVpZ2h0IC0gTUFSR0lOICogMlxyXG5cclxuXHRyYW5kb21SYWRpdXM6IC0+XHJcblx0XHRyZXR1cm4gQnUucmFuZCA1LCBNYXRoLm1pbihAYnUud2lkdGgsIEBidS5oZWlnaHQpIC8gMlxyXG5cclxuXHJcblx0Z2VuZXJhdGU6ICh0eXBlKSAtPlxyXG5cdFx0c3dpdGNoIHR5cGVcclxuXHRcdFx0d2hlbiAnY2lyY2xlJyB0aGVuIEBnZW5lcmF0ZUNpcmNsZSgpXHJcblx0XHRcdHdoZW4gJ2JvdycgdGhlbiBAZ2VuZXJhdGVCb3coKVxyXG5cdFx0XHR3aGVuICd0cmlhbmdsZScgdGhlbiBAZ2VuZXJhdGVUcmlhbmdsZSgpXHJcblx0XHRcdHdoZW4gJ3JlY3RhbmdsZScgdGhlbiBAZ2VuZXJhdGVSZWN0YW5nbGUoKVxyXG5cdFx0XHR3aGVuICdmYW4nIHRoZW4gQGdlbmVyYXRlRmFuKClcclxuXHRcdFx0d2hlbiAncG9seWdvbicgdGhlbiBAZ2VuZXJhdGVQb2x5Z29uKClcclxuXHRcdFx0d2hlbiAnbGluZScgdGhlbiBAZ2VuZXJhdGVMaW5lKClcclxuXHRcdFx0d2hlbiAncG9seWxpbmUnIHRoZW4gQGdlbmVyYXRlUG9seWxpbmUoKVxyXG5cdFx0XHRlbHNlIGNvbnNvbGUud2FybiAnbm90IHN1cHBvcnQgc2hhcGU6ICcgKyB0eXBlXHJcblxyXG5cdGdlbmVyYXRlQ2lyY2xlOiAtPlxyXG5cdFx0Y2lyY2xlID0gbmV3IEJ1LkNpcmNsZSBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpLCBAcmFuZG9tUmFkaXVzKClcclxuXHRcdGNpcmNsZS5jZW50ZXIubGFiZWwgPSAnTydcclxuXHRcdHJldHVybiBjaXJjbGVcclxuXHJcblx0Z2VuZXJhdGVCb3c6IC0+XHJcblx0XHRhRnJvbSA9IEJ1LnJhbmQgTWF0aC5QSSAqIDJcclxuXHRcdGFUbyA9IGFGcm9tICsgQnUucmFuZCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAqIDJcclxuXHJcblx0XHRib3cgPSBuZXcgQnUuQm93IEByYW5kb21YKCksIEByYW5kb21ZKCksIEByYW5kb21SYWRpdXMoKSwgYUZyb20sIGFUb1xyXG5cdFx0Ym93LnN0cmluZy5wb2ludHNbMF0ubGFiZWwgPSAnQSdcclxuXHRcdGJvdy5zdHJpbmcucG9pbnRzWzFdLmxhYmVsID0gJ0InXHJcblx0XHRyZXR1cm4gYm93XHJcblxyXG5cdGdlbmVyYXRlVHJpYW5nbGU6IC0+XHJcblx0XHRwb2ludHMgPSBbXVxyXG5cdFx0Zm9yIGkgaW4gWzAuLjJdXHJcblx0XHRcdHBvaW50c1tpXSA9IG5ldyBCdS5Qb2ludCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblxyXG5cdFx0dHJpYW5nbGUgPSBuZXcgQnUuVHJpYW5nbGUgcG9pbnRzWzBdLCBwb2ludHNbMV0sIHBvaW50c1syXVxyXG5cdFx0dHJpYW5nbGUucG9pbnRzWzBdLmxhYmVsID0gJ0EnXHJcblx0XHR0cmlhbmdsZS5wb2ludHNbMV0ubGFiZWwgPSAnQidcclxuXHRcdHRyaWFuZ2xlLnBvaW50c1syXS5sYWJlbCA9ICdDJ1xyXG5cdFx0cmV0dXJuIHRyaWFuZ2xlXHJcblxyXG5cdGdlbmVyYXRlUmVjdGFuZ2xlOiAtPlxyXG5cdFx0cmV0dXJuIG5ldyBCdS5SZWN0YW5nbGUoXHJcblx0XHRcdEJ1LnJhbmQoQGJ1LndpZHRoKVxyXG5cdFx0XHRCdS5yYW5kKEBidS5oZWlnaHQpXHJcblx0XHRcdEJ1LnJhbmQoQGJ1LndpZHRoIC8gMilcclxuXHRcdFx0QnUucmFuZChAYnUuaGVpZ2h0IC8gMilcclxuXHRcdClcclxuXHJcblx0Z2VuZXJhdGVGYW46IC0+XHJcblx0XHRhRnJvbSA9IEJ1LnJhbmQgTWF0aC5QSSAqIDJcclxuXHRcdGFUbyA9IGFGcm9tICsgQnUucmFuZCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAqIDJcclxuXHJcblx0XHRmYW4gPSBuZXcgQnUuRmFuIEByYW5kb21YKCksIEByYW5kb21ZKCksIEByYW5kb21SYWRpdXMoKSwgYUZyb20sIGFUb1xyXG5cdFx0ZmFuLnN0cmluZy5wb2ludHNbMF0ubGFiZWwgPSAnQSdcclxuXHRcdGZhbi5zdHJpbmcucG9pbnRzWzFdLmxhYmVsID0gJ0InXHJcblx0XHRyZXR1cm4gZmFuXHJcblxyXG5cdGdlbmVyYXRlUG9seWdvbjogLT5cclxuXHRcdHBvaW50cyA9IFtdXHJcblxyXG5cdFx0Zm9yIGkgaW4gWzAuLjNdXHJcblx0XHRcdHBvaW50ID0gbmV3IEJ1LlBvaW50IEByYW5kb21YKCksIEByYW5kb21ZKClcclxuXHRcdFx0cG9pbnQubGFiZWwgPSAnUCcgKyBpXHJcblx0XHRcdHBvaW50cy5wdXNoIHBvaW50XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBCdS5Qb2x5Z29uIHBvaW50c1xyXG5cclxuXHRnZW5lcmF0ZUxpbmU6IC0+XHJcblx0XHRsaW5lID0gbmV3IEJ1LkxpbmUgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKSwgQHJhbmRvbVgoKSwgQHJhbmRvbVkoKVxyXG5cdFx0bGluZS5wb2ludHNbMF0ubGFiZWwgPSAnQSdcclxuXHRcdGxpbmUucG9pbnRzWzFdLmxhYmVsID0gJ0InXHJcblx0XHRyZXR1cm4gbGluZVxyXG5cclxuXHRnZW5lcmF0ZVBvbHlsaW5lOiAtPlxyXG5cdFx0cG9seWxpbmUgPSBuZXcgQnUuUG9seWxpbmVcclxuXHRcdGZvciBpIGluIFswLi4zXVxyXG5cdFx0XHRwb2ludCA9IG5ldyBCdS5Qb2ludCBAcmFuZG9tWCgpLCBAcmFuZG9tWSgpXHJcblx0XHRcdHBvaW50LmxhYmVsID0gJ1AnICsgaVxyXG5cdFx0XHRwb2x5bGluZS5hZGRQb2ludCBwb2ludFxyXG5cdFx0cmV0dXJuIHBvbHlsaW5lXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
