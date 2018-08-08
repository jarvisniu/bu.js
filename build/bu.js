// bu.js v0.5.0-wip - https://github.com/jarvisniu/bu.js

(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var Bu = (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// Constants and Utils Functions

// Math
var HALF_PI = Math.PI / 2;
var TWO_PI = Math.PI * 2;

// Point is rendered as a small circle on screen. This is the radius of the circle.
var POINT_RENDER_SIZE = 2.25;

// Point can have a label attached near it. This is the gap distance between them.
var POINT_LABEL_OFFSET = 5;

// Default smooth factor of spline, range in [0, 1] and 1 is the smoothest
var DEFAULT_SPLINE_SMOOTH = 0.25;

// How close a point to a line is regarded that the point is **ON** the line.
var DEFAULT_NEAR_DIST = 5;

// Enumeration of mouse buttons, used to compare with `ev.buttons` of mouse events
var MOUSE = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 4

  // Shortcut to define a property for a class. This is used to solve the problem
  // that CoffeeScript didn't support getters and setters.
  // TODO rewrite in js
  // class Person
  //   @constructor: (age) ->
  //     @_age = age

  //   @property 'age',
  //     get: -> @_age
  //     set: (val) ->
  //       @_age = val

};Function.prototype.property = function (prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

// Calculate the mean value of numbers
function average() {
  var ns = arguments;
  if (_typeof(ns[0]) === 'object') ns = ns[0];

  var sum = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var n = _step.value;

      sum += n;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return sum / ns.length;
}

// Calculate the hypotenuse from the cathetuses
function bevel(x, y) {
  return Math.sqrt(x * x + y * y);
}

// Limit a number by minimum value and maximum value
function clamp(x, min, max) {
  if (x < min) {
    x = min;
  }
  if (x > max) {
    x = max;
  }
  return x;
}

// Generate a random number between two numbers
function rand(from, to) {
  if (!to) {
    var _ref = [0, from];
    from = _ref[0];
    to = _ref[1];
  }
  return Math.random() * (to - from) + from;
}

// Convert an angle from radian to deg
function r2d(r) {
  return (r * 180 / Math.PI).toFixed(1);
}

// Convert an angle from deg to radian
function d2r(r) {
  return r * Math.PI / 180;
}

// Get the current timestamp
function now() {
  return window.performance.now();
}

// Combine the given options (last item of arguments) with the default options
function combineOptions(args, defaultOptions) {
  if (!defaultOptions) defaultOptions = {};
  var givenOptions = args[args.length - 1];
  if (isPlainObject(givenOptions)) {
    for (var i in givenOptions) {
      if (givenOptions[i] != null) defaultOptions[i] = givenOptions[i];
    }
  }
  return defaultOptions;
}

// Check if an object is an plain object, not instance of class/function
function isPlainObject(o) {
  return o instanceof Object && o.constructor.name === 'Object';
}

// Check if an object is a Array
function isArray(o) {
  return o instanceof Array;
}

// Clone an Object or Array
function clone(target) {
  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || target === null || typeof target === 'function') {
    return target;
  } else {
    if (target.clone) {
      return target.clone();
    }
    // FIXME cause stack overflow when its a circular structure
    var newObj = void 0;
    if (isArray(target)) {
      newObj = [];
    } else if (isPlainObject(target)) {
      newObj = {}; // instance of class
    } else {
      newObj = Object.create(target.constructor.prototype);
    }
    for (var i in target) {
      if (!target.hasOwnProperty(i)) continue;
      newObj[i] = clone(target[i]);
    }
    return newObj;
  }
}

// Make a copy of this function which has a limited shortest executing interval.
function throttle(fn) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

  var currTime = 0;
  var lastTime = 0;

  return function () {
    currTime = Date.now();
    if (currTime - lastTime > limit * 1000) {
      fn.apply(null, arguments);
      lastTime = currTime;
    }
  };
}

// Make a copy of this function whose execution will be continuously put off
// after every calling of this function.
function debounce(fn) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

  var args = null;
  var timeout = null;

  var later = function later() {
    fn.apply(null, args);
  };

  return function () {
    args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay * 1000);
  };
}

// Use localStorage to persist data
// TODO rename to store
function data(key, value) {
  if (value) {
    window.localStorage['Bu.' + key] = JSON.stringify(value);
  } else {
    value = window.localStorage['Bu.' + key];
    return value ? JSON.parse(value) : null;
  }
}

var utils = {
  HALF_PI: HALF_PI,
  TWO_PI: TWO_PI,
  POINT_RENDER_SIZE: POINT_RENDER_SIZE,
  POINT_LABEL_OFFSET: POINT_LABEL_OFFSET,
  DEFAULT_SPLINE_SMOOTH: DEFAULT_SPLINE_SMOOTH,
  DEFAULT_NEAR_DIST: DEFAULT_NEAR_DIST,
  MOUSE: MOUSE,

  average: average,
  bevel: bevel,
  clamp: clamp,
  rand: rand,
  r2d: r2d,
  d2r: d2r,
  now: now,
  combineOptions: combineOptions,
  isPlainObject: isPlainObject,
  isArray: isArray,
  clone: clone,
  throttle: throttle,
  debounce: debounce,
  data: data
};

// Add event listener feature to custom objects

var Event = function Event() {
  var _this = this;

  var types = {};

  this.on = function (type, listener) {
    types[type] = types[type] || [];
    var listeners = types[type];
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener);
    }
  };

  this.once = function (type, listener) {
    listener.once = true;
    _this.on(type, listener);
  };

  this.off = function (type, listener) {
    var listeners = types[type];
    if (listener) {
      if (listeners) {
        var index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      }
    } else {
      if (listeners) listeners.length = 0;
    }
  };

  this.trigger = function (type, ev) {
    var listeners = types[type];

    if (listeners) {
      ev = ev || {};
      ev.target = _this;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;

          listener.call(_this, ev);
          if (listener.once) {
            listeners.splice(listeners.indexOf(listener), 1);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };
};

// 2D vector

var Vector = function () {
  function Vector() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    classCallCheck(this, Vector);

    this.x = x;
    this.y = y;
  }

  createClass(Vector, [{
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
    value: function set$$1(x, y) {
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
      this.x *= obj.scale.x;
      this.y *= obj.scale.y;
      // rotation
      var len = utils.bevel(this.x, this.y);
      var a = Math.atan2(this.y, this.x) + obj.rotation;
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
      // translate
      this.x -= obj.position.x;
      this.y -= obj.position.y;
      // rotation
      var len = utils.bevel(this.x, this.y);
      var a = Math.atan2(this.y, this.x) - obj.rotaion;
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

// axis aligned bounding box

var Bounds = function () {
  function Bounds(target) {
    classCallCheck(this, Bounds);

    this.target = target;

    // TODO use min, max: Vector
    this.x1 = this.y1 = this.x2 = this.y2 = 0;
    this.isEmpty = true;

    this.point1 = new Vector();
    this.point2 = new Vector();

    this.update();
    this.bindEvent();
  }

  createClass(Bounds, [{
    key: 'containsPoint',
    value: function containsPoint(p) {
      return this.x1 < p.x && this.x2 > p.x && this.y1 < p.y && this.y2 > p.y;
    }
  }, {
    key: 'update',
    value: function update() {
      this.clear();
      switch (this.target.type) {
        case 'Line':
        case 'Triangle':
        case 'Rectangle':
          for (var v in this.target.points) {
            this.expandByPoint(v);
          }
          break;
        case 'Circle':
        case 'Bow':
        case 'Fan':
          this.expandByCircle(this.target);
          break;
        case 'Polyline':
        case 'Polygon':
          for (var _v in this.target.vertices) {
            this.expandByPoint(_v);
          }
          break;
        case 'Ellipse':
          this.x1 = -this.target.radiusX;
          this.x2 = this.target.radiusX;
          this.y1 = -this.target.radiusY;
          this.y2 = this.target.radiusY;
          break;
        default:
          console.warn('Bu.Bounds: not supported shape type ' + this.target.type);
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
          this.target.on('radiusChanged', this.update);
          break;
        case 'Ellipse':
          this.target.on('changed', this.update);
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
        if (v.x < this.x1) this.x1 = v.x;
        if (v.x > this.x2) this.x2 = v.x;
        if (v.y < this.y1) this.y1 = v.y;
        if (v.y > this.y2) this.y2 = v.y;
      }
      return this;
    }
  }, {
    key: 'expandByCircle',
    value: function expandByCircle(c) {
      var center = c.center;
      var radius = c.radius;
      if (this.isEmpty) {
        this.isEmpty = false;
        this.x1 = center.x - radius;
        this.x2 = center.x + radius;
        this.y1 = center.y - radius;
        this.y2 = center.y + radius;
      } else {
        if (center.x - radius < this.x1) this.x1 = center.x - radius;
        if (center.x + radius > this.x2) this.x2 = center.x + radius;
        if (center.y - radius < this.y1) this.y1 = center.y - radius;
        if (center.y + radius > this.y2) this.y2 = center.y + radius;
      }
      return this;
    }
  }]);
  return Bounds;
}();

// Add color to the shapes
// This object is dedicated to mixed-in the Object2D.

var Styled = function Styled() {
  this.strokeStyle = Styled.DEFAULT_STROKE_STYLE;
  this.fillStyle = Styled.DEFAULT_FILL_STYLE;
  this.dashStyle = false;
  this.dashFlowSpeed = 0;
  this.lineWidth = 1;

  this.dashOffset = 0;

  // Set/copy style from other style
  this.style = function (style) {
    if (typeof style === 'string') {
      style = Bu$2.styles[style];
      if (!style) {
        style = Bu$2.styles.default;
        console.warn('Styled: Bu.styles.' + style + ' doesn\'t exists, fell back to default.');
      }
    } else if (!style) {
      style = Bu$2.styles['default'];
    }
    var _arr = ['strokeStyle', 'fillStyle', 'dashStyle', 'dashFlowSpeed', 'lineWidth'];
    for (var _i = 0; _i < _arr.length; _i++) {
      var k = _arr[_i];
      this[k] = style[k];
    }
    return this;
  };

  // Set the stroke style
  this.stroke = function (v) {
    if (v == null) v = true;
    if (Bu$2.styles && v in Bu$2.styles) v = Bu$2.styles[v].strokeStyle;

    switch (v) {
      case true:
        this.strokeStyle = Styled.DEFAULT_STROKE_STYLE;
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
    if (v == null) v = true;
    if (Bu$2.styles && v in Bu$2.styles) v = Bu$2.styles[v].fillStyle;

    switch (v) {
      case false:
        this.fillStyle = null;
        break;
      case true:
        this.fillStyle = Styled.DEFAULT_FILL_STYLE;
        break;
      default:
        this.fillStyle = v;
    }
    return this;
  };

  // Set the dash style
  this.dash = function (v) {
    if (v == null) v = true;else if (Bu$2.styles && v in Bu$2.styles) v = Bu$2.styles[v].dashStyle;else if (typeof v === 'number') v = [v, v];

    switch (v) {
      case false:
        this.dashStyle = null;
        break;
      case true:
        this.dashStyle = Styled.DEFAULT_DASH_STYLE;
        break;
      default:
        this.dashStyle = v;
    }
    return this;
  };

  // Set the dash flowing speed
  this.dashFlow = function (speed) {
    if (speed === true || speed == null) speed = 1;else if (speed === false) speed = 0;

    Bu$2.dashFlowManager.setSpeed(this, speed);
    return this;
  };

  // Set the lineWidth
  this.setLineWidth = function (w) {
    this.lineWidth = w;
    return this;
  };

  return this;
};

Styled.DEFAULT_STROKE_STYLE = '#048';
Styled.DEFAULT_FILL_STYLE = 'rgba(64, 128, 192, 0.5)';
Styled.DEFAULT_DASH_STYLE = [8, 4];

// Base class of all shapes and other renderable objects

var Object2D = function () {
  function Object2D() {
    classCallCheck(this, Object2D);

    Styled.apply(this);
    Event.apply(this);

    this.visible = true;
    this.opacity = 1;

    this.position = new Vector();
    this.rotation = 0;
    this._scale = new Vector(1, 1);
    this.skew = new Vector();
    // this.toWorldMatrix = new Matrix()

    // geometry related
    this.bounds = null; // used to accelerate the hit testing
    this.keyPoints = null;

    // hierarchy
    this.children = [];
    this.parent = null;
  }

  // Translate an object


  createClass(Object2D, [{
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
      var node = this;
      while (true) {
        if (node.type === 'Scene') {
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
      if (utils.isArray(shape)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = shape[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            this.children.push(s);
            s.parent = this;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
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
      var index = this.children.indexOf(shape);
      if (index > -1) this.children.splice(index, 1);
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
      if (!utils.isArray(args)) args = [args];
      if (typeof anim === 'string') {
        if (anim in Bu$2.animations) {
          Bu$2.animations[anim].applyTo(this, args);
        } else {
          console.warn('Bu.animations["' + anim + '"] doesn\'t exists.');
        }
      } else if (utils.isArray(anim)) {
        for (var i in anim) {
          if (!anim.hasOwnProperty(i)) continue;
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
      this.bounds = new Bounds(this);
      return this;
    }

    // Hit testing with unprojections

  }, {
    key: 'hitTest',
    value: function hitTest(v) {
      var renderer = this.getScene().renderer;
      v.set.apply(v, toConsumableArray(renderer.projectToWorld(v.x, v.y)));
      v.project(renderer.camera);
      v.unProject(this);
      return this.containsPoint(v);
    }

    // Hit testing in the same coordinate

  }, {
    key: 'containsPoint',
    value: function containsPoint(p) {
      if (this.bounds && !this.bounds.containsPoint(p)) {
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
  get: function get$$1() {
    return this._scale;
  },
  set: function set$$1(val) {
    if (typeof val === 'number') {
      this._scale.x = this._scale.y = val;
      return this;
    } else {
      this._scale = val;
      return this;
    }
  }
});

// Camera: change the view range in the scene

var Camera = function (_Object2D) {
  inherits(Camera, _Object2D);

  function Camera() {
    classCallCheck(this, Camera);

    var _this = possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

    _this.type = 'Camera';
    return _this;
  }

  return Camera;
}(Object2D);

// Scene is the root of the object tree

var Scene = function (_Object2D) {
  inherits(Scene, _Object2D);

  function Scene() {
    classCallCheck(this, Scene);

    var _this = possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

    _this.type = 'Scene';
    _this.background = Bu.config.background;
    _this.renderer = null;
    return _this;
  }

  return Scene;
}(Object2D);

// Used to render all the drawable objects to the canvas
var Renderer;

Renderer = function () {
  var Renderer = function () {
    function Renderer() {
      var _this = this;

      classCallCheck(this, Renderer);

      var delayed, domBody, domHtml, j, len1, name, onResize, options, ref, _tick;
      // Draw an array of drawables
      this.drawShapes = this.drawShapes.bind(this);
      // Draw an drawable to the canvas
      this.drawShape = this.drawShape.bind(this);
      Event.apply(this);
      this.type = 'Renderer';
      // API
      this.scene = new Scene(this);
      this.camera = new Camera();
      this.tickCount = 0;
      this.isRunning = true;
      this.pixelRatio = window.devicePixelRatio || 1;
      if (typeof ClipMeter !== "undefined" && ClipMeter !== null) {
        this.clipMeter = new ClipMeter();
      }
      // Receive options
      options = utils.combineOptions(arguments, {
        container: 'body',
        showBounds: false,
        imageSmoothing: true
      });
      ref = ['container', 'width', 'height', 'showBounds'];
      // Copy options
      for (j = 0, len1 = ref.length; j < len1; j++) {
        name = ref[j];
        this[name] = options[name];
      }
      // If options.width is not given, then fillParent is true
      this.fillParent = typeof options.width !== 'number';
      // Convert width and height from dip(device independent pixels) to physical pixels
      this.pixelWidth = this.width * this.pixelRatio;
      this.pixelHeight = this.height * this.pixelRatio;
      // Set canvas dom
      this.dom = document.createElement('canvas');
      this.dom.style.cursor = Bu$2.config.cursor;
      this.dom.style.boxSizing = 'content-box';
      this.dom.oncontextmenu = function () {
        return false;
      };
      // Set context
      this.context = this.dom.getContext('2d');
      this.context.textBaseline = 'top';
      if (typeof this.container === 'string') {
        // Set container dom
        this.container = document.querySelector(this.container);
      }
      if (this.fillParent && this.container === document.body) {
        domHtml = document.querySelector('html');
        domBody = document.querySelector('body');
        domBody.style.margin = '0';
        domBody.style.overflow = 'hidden';
        domHtml.style.width = domHtml.style.height = domBody.style.width = domBody.style.height = '100%';
      }
      // Set sizes for renderer property, dom attribute and dom style
      onResize = function onResize() {
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
        window.addEventListener('resize', onResize);
        this.dom.addEventListener('DOMNodeInserted', onResize);
      }
      // Run the loop
      _tick = function tick() {
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
        return requestAnimationFrame(_tick);
      };
      _tick();
      // Append <canvas> dom into the container
      delayed = function delayed() {
        _this.container.appendChild(_this.dom);
        return _this.imageSmoothing = options.imageSmoothing;
      };
      setTimeout(delayed, 1);
      // Hook up with running components
      Bu$2.animationRunner.hookUp(this);
      Bu$2.dashFlowManager.hookUp(this);
    }

    // Pause/continue/toggle the rendering loop


    createClass(Renderer, [{
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

      // Project from DOM coordinates to world coordinates

    }, {
      key: 'projectToWorld',
      value: function projectToWorld(x, y) {
        if (!Bu$2.config.originAtCenter) {
          return [x, y];
        } else {
          return [x - this.width / 2, y - this.height / 2];
        }
      }

      // Perform the full render process

    }, {
      key: 'render',
      value: function render() {
        this.context.save();
        // Clear the canvas
        this.clearCanvas();
        if (Bu$2.config.originAtCenter) {
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
        if (Bu$2.config.showKeyPoints) {
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
        this.context.arc(shape.x, shape.y, utils.POINT_RENDER_SIZE, 0, utils.TWO_PI);
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
        this.context.arc(shape.cx, shape.cy, shape.radius, 0, utils.TWO_PI);
        return this;
      }
    }, {
      key: 'drawEllipse',
      value: function drawEllipse(shape) {
        this.context.ellipse(0, 0, shape.radiusX, shape.radiusY, 0, utils.TWO_PI, false);
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
        font = shape.font || Bu$2.config.font;
        if (typeof font === 'string') {
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
        } else if (font instanceof Bu$2.SpriteSheet && font.ready) {
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
    get: function get$$1() {
      return this._imageSmoothing;
    },
    set: function set$$1(val) {
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
      var _this = this;

      classCallCheck(this, InputManager);

      this.keyStates = [];
      window.addEventListener('keydown', function (ev) {
        return _this.keyStates[ev.keyCode] = true;
      });
      window.addEventListener('keyup', function (ev) {
        return _this.keyStates[ev.keyCode] = false;
      });
    }

    // To detect whether a key is pressed down


    createClass(InputManager, [{
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
        window.addEventListener('keydown', function (ev) {
          var ref;
          return (ref = keydownListeners[ev.keyCode]) != null ? ref.call(app, ev) : void 0;
        });
        window.addEventListener('keyup', function (ev) {
          var ref;
          return (ref = keyupListeners[ev.keyCode]) != null ? ref.call(app, ev) : void 0;
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

// Bu

// renderer:
//   width/height
//   imageSmoothing
// data
// methods
// objects
// scene
// events
// init
// update

function ready(cb, context, args) {
  if (document.readyState === 'complete') {
    cb.apply(context, args);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      cb.apply(context, args);
    });
  }
}

var Bu$2 = function () {
  function Bu() {
    var $options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Bu);

    this.$options = $options;
    var _arr = ['renderer', 'data', 'objects', 'methods', 'events'];
    for (var _i = 0; _i < _arr.length; _i++) {
      var k = _arr[_i];
      this.$options[k] = this.$options[k] || {};
    }
    if (this.$options.el) {
      this.$options.renderer.container = this.$options.el;
    }
    this.$inputManager = new InputManager$1();
    ready(this.init, this);
    Bu.$bues.push(this);
  }

  createClass(Bu, [{
    key: 'init',
    value: function init() {
      var _this = this,
          _arguments = arguments;

      // scene
      var scene = new Scene();

      // renderer
      this.$renderer = new Renderer$1(this.$options.renderer);
      this.$renderer.scene = scene;
      scene.renderer = this.$renderer;

      // data
      if (typeof this.$options.data === 'function') {
        this.$options.data = this.$options.data.apply(this);
      }
      for (var k in this.$options.data) {
        this[k] = this.$options.data[k];
      }

      // methods
      for (var _k in this.$options.methods) {
        this[_k] = this.$options.methods[_k];
      }

      // objects
      var objects = typeof this.$options.objects === 'function' ? this.$options.objects.apply(this) : this.$options.objects;
      for (var name in objects) {
        this[name] = objects[name];
      }

      // create default scene tree
      if (!this.$options.scene) {
        this.$options.scene = {};
        for (var _name in objects) {
          this.$options.scene[_name] = {};
        }
      }

      // assemble scene tree
      // TODO use an algorithm to avoid circular structure
      var assembleObjects = function assembleObjects(children, parent) {
        var results = [];
        for (var _name2 in children) {
          if (!children.hasOwnProperty(_name2)) continue;
          parent.addChild(objects[_name2]);
          results.push(assembleObjects(children[_name2], objects[_name2]));
        }
        return results;
      };
      assembleObjects(this.$options.scene, this.$renderer.scene);

      // init
      if (this.$options.init) this.$options.init.call(this);

      // events
      this.$inputManager.handleAppEvents(this, this.$options.events);

      // update
      if (this.$options.update) {
        this.$renderer.on('update', function () {
          _this.$options.update.apply(_this, _arguments);
        });
      }
    }
  }]);
  return Bu;
}();

// Run the animation tasks
var AnimationRunner;

AnimationRunner = function () {
  var DEFAULT_EASING_FUNCTION, easingFunctions;

  var AnimationRunner = function () {
    function AnimationRunner() {
      classCallCheck(this, AnimationRunner);

      this.runningAnimations = [];
    }

    createClass(AnimationRunner, [{
      key: 'add',
      value: function add(task) {
        task.init();
        if (task.animation.isLegal()) {
          task.startTime = utils.now();
          return this.runningAnimations.push(task);
        } else {
          return console.error('AnimationRunner: animation setting is illegal: ', task.animation);
        }
      }
    }, {
      key: 'update',
      value: function update() {
        var anim, finish, i, len, now, ref, ref1, results, t, task;
        now = utils.now();
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
              task.startTime = utils.now();
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
        var _this = this;

        return renderer.on('update', function () {
          return _this.update();
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
      return Math.sin((t - 1) * utils.HALF_PI) + 1;
    },
    sineOut: function sineOut(t) {
      return Math.sin(t * utils.HALF_PI);
    },
    sine: function sine(t) {
      if (t < 0.5) {
        return (Math.sin((t * 2 - 1) * utils.HALF_PI) + 1) / 2;
      } else {
        return Math.sin((t - 0.5) * Math.PI) / 2 + 0.5;
      }
    }
  };

  return AnimationRunner;
}();

// TODO add quart, quint, expo, circ, back, elastic, bounce
var AnimationRunner$1 = AnimationRunner;

// Manage an Object2D list and update its dashOffset
var DashFlowManager;

DashFlowManager = function () {
  function DashFlowManager() {
    classCallCheck(this, DashFlowManager);

    this.flowingObjects = [];
  }

  createClass(DashFlowManager, [{
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
      var _this = this;

      return renderer.on('update', function () {
        return _this.update();
      });
    }
  }]);
  return DashFlowManager;
}();

var DashFlowManager$1 = DashFlowManager;

// Parse and serialize color

var RE_HSL = /hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/i;
var RE_HSLA = /hsla\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i;
var RE_RGB = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i;
var RE_RGBA = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+)\s*,\s*([.\d]+)\s*\)/i;
var RE_RGB_PER = /rgb\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*\)/i;
var RE_RGBA_PER = /rgba\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i;
var RE_HEX3 = /#([0-9A-F]{3})\s*$/i;
var RE_HEX6 = /#([0-9A-F]{6})\s*$/i;

var CSS3_COLORS = {
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

function hsl2rgb(h, s, l) {
  var nh = h % 360 / 360;
  var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  var p = 2 * l - q;
  var t = [nh + 1 / 3, nh, nh - 1 / 3];
  var rgb = [];

  var _arr = [0, 1, 2];
  for (var _i = 0; _i < _arr.length; _i++) {
    var i = _arr[_i];
    if (t[i] < 0) t[i] += 1;
    if (t[i] > 1) t[i] -= 1;
  }

  var _arr2 = [0, 1, 2];
  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var _i3 = _arr2[_i2];
    if (t[_i3] < 1 / 6) {
      rgb[_i3] = p + (q - p) * 6 * t[_i3];
    } else if (t[_i3] < 0.5) {
      rgb[_i3] = q;
    } else if (t[_i3] < 2 / 3) {
      rgb[_i3] = p + (q - p) * 6 * (2 / 3 - t[_i3]);
    } else {
      rgb[_i3] = p;
    }

    rgb[_i3] = Math.round(rgb[_i3] * 255);
  }

  return rgb;
}

// Private functions

function clampAlpha(a) {
  return utils.clamp(a, 0, 1);
}

var Color = function () {
  function Color() {
    classCallCheck(this, Color);

    this.r = this.g = this.b = 255;
    this.a = 1;

    if (arguments.length === 1) {
      var arg = arguments[0];
      if (typeof arg === 'string') {
        this.parse(arg);
        this.a = clampAlpha(this.a);
      } else if (arg instanceof Color) {
        this.copy(arg);
      }
    } else {
      // if arguments.length == 3 or 4
      this.r = arguments[0];
      this.g = arguments[1];
      this.b = arguments[2];
      this.a = arguments[3] || 1;
    }
  }

  createClass(Color, [{
    key: 'parse',
    value: function parse(str) {
      var found = str.match(RE_RGB);
      if (found) {
        this.r = +found[1];
        this.g = +found[2];
        this.b = +found[3];
        this.a = 1;
        return this;
      }

      found = str.match(RE_HSL);
      if (found) {
        var h = +found[1];
        var s = +found[2] / 100;
        var l = +found[3] / 100;

        var _hsl2rgb = hsl2rgb(h, s, l),
            _hsl2rgb2 = slicedToArray(_hsl2rgb, 3),
            r = _hsl2rgb2[0],
            g = _hsl2rgb2[1],
            b = _hsl2rgb2[2];

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 1;
        return this;
      }

      found = str.match(RE_RGBA);
      if (found) {
        this.r = +found[1];
        this.g = +found[2];
        this.b = +found[3];
        this.a = +found[4];
        return this;
      }

      found = str.match(RE_HSLA);
      if (found) {
        var _h = +found[1];
        var _s = +found[2] / 100;
        var _l = +found[3] / 100;

        var _hsl2rgb3 = hsl2rgb(_h, _s, _l),
            _hsl2rgb4 = slicedToArray(_hsl2rgb3, 3),
            _r = _hsl2rgb4[0],
            _g = _hsl2rgb4[1],
            _b = _hsl2rgb4[2];

        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = parseFloat(found[4]);
        return this;
      }

      found = str.match(RE_RGBA_PER);
      if (found) {
        this.r = +found[1] * 255 / 100;
        this.g = +found[2] * 255 / 100;
        this.b = +found[3] * 255 / 100;
        this.a = +found[4];
        return this;
      }

      found = str.match(RE_RGB_PER);
      if (found) {
        this.r = +found[1] * 255 / 100;
        this.g = +found[2] * 255 / 100;
        this.b = +found[3] * 255 / 100;
        this.a = 1;
        return this;
      }

      found = str.match(RE_HEX3);
      if (found) {
        var hex = found[1];
        this.r = parseInt(hex[0], 16);
        this.r = this.r * 16 + this.r;
        this.g = parseInt(hex[1], 16);
        this.g = this.g * 16 + this.g;
        this.b = parseInt(hex[2], 16);
        this.b = this.b * 16 + this.b;
        this.a = 1;
        return this;
      }

      found = str.match(RE_HEX6);
      if (found) {
        var _hex = found[1];
        this.r = parseInt(_hex.substring(0, 2), 16);
        this.g = parseInt(_hex.substring(2, 4), 16);
        this.b = parseInt(_hex.substring(4, 6), 16);
        this.a = 1;
        return this;
      }

      str = str.toLowerCase().trim();
      if (CSS3_COLORS[str] != null) {
        this.r = CSS3_COLORS[str][0];
        this.g = CSS3_COLORS[str][1];
        this.b = CSS3_COLORS[str][2];
        this.a = CSS3_COLORS[str][3];
        if (this.a == null) this.a = 1;
        return this;
      }

      console.error('Color.parse("' + str + '") error.');
      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      var color = new Color();
      color.copy(this);
      return color;
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

// AnimationTask is an instance of Animation, run by AnimationRunner
var AnimationTask;
var hasProp$1 = {}.hasOwnProperty;

AnimationTask = function () {
  var interpolateColor, interpolateNum, interpolateVector;

  var AnimationTask = function () {
    function AnimationTask(animation, target) {
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      classCallCheck(this, AnimationTask);

      this.animation = animation;
      this.target = target;
      this.args = args;
      this.startTime = 0;
      this.finished = false;
      this.from = utils.clone(this.animation.from);
      this.current = utils.clone(this.animation.from);
      this.to = utils.clone(this.animation.to);
      this.data = {};
      this.t = 0;
      this.arg = this.args[0];
    }

    createClass(AnimationTask, [{
      key: 'init',
      value: function init() {
        var ref;
        if ((ref = this.animation.init) != null) {
          ref.call(this.target, this);
        }
        return this.current = utils.clone(this.from);
      }

      // Change the animation progress to the start

    }, {
      key: 'restart',
      value: function restart() {
        this.startTime = utils.now();
        return this.finished = false;
      }

      // Change the animation progress to the end

    }, {
      key: 'end',
      value: function end() {
        return this.startTime = utils.now() - this.animation.duration * 1000;
      }

      // Interpolate `current` according `from`, `to` and `t`

    }, {
      key: 'interpolate',
      value: function interpolate() {
        var key, ref, results;
        if (this.from == null) {
          return;
        }
        if (typeof this.from === 'number') {
          return this.current = interpolateNum(this.from, this.to, this.t);
        } else if (this.from instanceof Color) {
          return interpolateColor(this.from, this.to, this.t, this.current);
        } else if (this.from instanceof Vector) {
          return interpolateVector(this.from, this.to, this.t, this.current);
        } else if (utils.isPlainObject(this.from)) {
          ref = this.from;
          results = [];
          for (key in ref) {
            if (!hasProp$1.call(ref, key)) continue;
            if (typeof this.from[key] === 'number') {
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
var hasProp = {}.hasOwnProperty;

Animation = function () {
  function Animation(options) {
    classCallCheck(this, Animation);

    this.from = options.from;
    this.to = options.to;
    this.duration = options.duration || 0.5;
    this.easing = options.easing || false;
    this.repeat = !!options.repeat;
    this.init = options.init;
    this.update = options.update;
    this.finish = options.finish;
  }

  createClass(Animation, [{
    key: 'applyTo',
    value: function applyTo(target, args) {
      var task;
      if (!utils.isArray(args)) {
        args = [args];
      }
      task = new AnimationTask$1(this, target, args);
      Bu$2.animationRunner.add(task);
      return task;
    }
  }, {
    key: 'isLegal',
    value: function isLegal() {
      var key, ref;
      if (!(this.from != null && this.to != null)) {
        return true;
      }
      if (utils.isPlainObject(this.from)) {
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
    }
  }]);
  return Animation;
}();

var Animation$1 = Animation;

// Presets

Bu$2.$bues = [];

Bu$2.animationRunner = new AnimationRunner$1();
Bu$2.dashFlowManager = new DashFlowManager$1();

Bu$2.styles = {
  default: new Styled().stroke().fill(),
  hover: new Styled().stroke('hsla(0, 100%, 40%, 0.75)').fill('hsla(0, 100%, 75%, 0.5)'),
  text: new Styled().stroke(false).fill('black'),
  line: new Styled().fill(false),
  selected: new Styled().setLineWidth(2),
  dash: new Styled().dash()
};

Bu$2.animations = {

  // Simple

  fadeIn: new Animation$1({
    update: function update(anim) {
      this.opacity = anim.t;
    }
  }),

  fadeOut: new Animation$1({
    update: function update(anim) {
      this.opacity = 1 - anim.t;
    }
  }),

  spin: new Animation$1({
    update: function update(anim) {
      this.rotation = anim.t * Math.PI * 2;
    }
  }),

  spinIn: new Animation$1({
    init: function init(anim) {
      anim.data.desScale = anim.arg || 1;
    },
    update: function update(anim) {
      this.opacity = anim.t;
      this.rotation = anim.t * Math.PI * 4;
      this.scale = anim.t * anim.data.desScale;
    }
  }),

  spinOut: new Animation$1({
    update: function update(anim) {
      this.opacity = 1 - anim.t;
      this.rotation = anim.t * Math.PI * 4;
      this.scale = 1 - anim.t;
    }
  }),

  blink: new Animation$1({
    duration: 0.2,
    from: 0,
    to: 512,
    update: function update(anim) {
      var d = Math.floor(Math.abs(anim.current - 256));
      this.fillStyle = 'rgb(' + d + ', ' + d + ', ' + d + ')';
    }
  }),

  shake: new Animation$1({
    init: function init(anim) {
      anim.data.ox = this.position.x;
      anim.data.range = anim.arg || 20;
    },
    update: function update(anim) {
      this.position.x = Math.sin(anim.t * Math.PI * 8) * anim.data.range + anim.data.ox;
    }
  }),

  jump: new Animation$1({
    init: function init(anim) {
      anim.data.oy = this.position.y;
      anim.data.height = anim.arg || 100;
    },
    update: function update(anim) {
      this.position.y = -anim.data.height * Math.sin(anim.t * Math.PI) + anim.data.oy;
    }
  }),

  // Toggled: detect and save original status

  puff: new Animation$1({
    duration: 0.15,
    init: function init(anim) {
      anim.from = {
        opacity: this.opacity,
        scale: this.scale.x
      };
      anim.to = this.opacity === 1 ? {
        opacity: 0,
        scale: this.scale.x * 1.5
      } : {
        opacity: 1,
        scale: this.scale.x / 1.5
      };
    },
    update: function update(anim) {
      this.opacity = anim.current.opacity;
      this.scale = anim.current.scale;
    }
  }),

  clip: new Animation$1({
    init: function init(anim) {
      if (this.scale.y !== 0) {
        anim.from = this.scale.y;
        anim.to = 0;
      } else {
        anim.from = this.scale.y;
        anim.to = this.scale.x;
      }
    },
    update: function update(anim) {
      this.scale.y = anim.current;
    }
  }),

  flipX: new Animation$1({
    init: function init(anim) {
      anim.from = this.scale.x;
      anim.to = -anim.from;
    },
    update: function update(anim) {
      this.scale.x = anim.current;
    }
  }),

  flipY: new Animation$1({
    init: function init(anim) {
      anim.from = this.scale.y;
      anim.to = -anim.from;
    },
    update: function update(anim) {
      this.scale.y = anim.current;
    }
  }),

  // With Arguments

  moveTo: new Animation$1({
    init: function init(anim) {
      if (anim.arg != null) {
        anim.from = this.position.x;
        anim.to = parseFloat(anim.arg);
      } else {
        console.error('Bu:animations.moveTo need an argument');
      }
    },
    update: function update(anim) {
      this.position.x = anim.current;
    }
  }),

  moveBy: new Animation$1({
    init: function init(anim) {
      if (anim.args != null) {
        anim.from = this.position.x;
        anim.to = this.position.x + parseFloat(anim.args);
      } else {
        console.error('Bu:animations.moveBy need an argument');
      }
    },
    update: function update(anim) {
      this.position.x = anim.current;
    }
  }),

  discolor: new Animation$1({
    init: function init(anim) {
      var desColor = anim.arg;
      if (typeof desColor === 'string') {
        desColor = new Color(desColor);
      }
      anim.from = new Color(this.fillStyle);
      anim.to = desColor;
    },
    update: function update(anim) {
      this.fillStyle = anim.current.toRGBA();
    }
  })
};

// The size of Rectangle, Bound etc.

var Size = function () {
  function Size(width, height) {
    classCallCheck(this, Size);

    this.type = 'Size';
    this.width = width;
    this.height = height;
  }

  createClass(Size, [{
    key: 'set',
    value: function set$$1(width, height) {
      this.width = width;
      this.height = height;
    }
  }]);
  return Size;
}();

// Audio

var Audio = function () {
  function Audio(url) {
    classCallCheck(this, Audio);

    this.audio = document.createElement('audio');
    this.url = '';
    this.ready = false;

    if (url) this.load(url);
  }

  createClass(Audio, [{
    key: 'load',
    value: function load(url) {
      var _this = this;

      this.url = url;
      this.audio.addEventListener('canplay', function () {
        _this.ready = true;
      });
      this.audio.src = url;
    }
  }, {
    key: 'play',
    value: function play() {
      if (this.ready) {
        this.audio.play();
      } else {
        console.warn('The audio file [' + this.url + '] is not ready.');
      }
    }
  }]);
  return Audio;
}();

// Render text around a point
var DEFAULT_FONT_FAMILY;
var DEFAULT_FONT_SIZE;
var PointText;

DEFAULT_FONT_FAMILY = 'Verdana';

DEFAULT_FONT_SIZE = 12;

PointText = function () {
  var PointText = function (_Object2D) {
    inherits(PointText, _Object2D);

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
      classCallCheck(this, PointText);

      var options;

      var _this = possibleConstructorReturn(this, (PointText.__proto__ || Object.getPrototypeOf(PointText)).call(this));

      _this.text = text;
      _this.x = x;
      _this.y = y;
      _this.type = 'PointText';
      _this.strokeStyle = null; // no stroke by default
      _this.fillStyle = 'black';
      options = utils.combineOptions(arguments, {
        align: '00'
      });
      _this.align = options.align;
      if (options.font != null) {
        _this.font = options.font;
      } else if (options.fontFamily != null || options.fontSize != null) {
        _this._fontFamily = options.fontFamily || DEFAULT_FONT_FAMILY;
        _this._fontSize = options.fontSize || DEFAULT_FONT_SIZE;
        _this.font = _this._fontSize + 'px ' + _this._fontFamily;
      } else {
        _this.font = null;
      }
      return _this;
    }

    createClass(PointText, [{
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
  }(Object2D);

  

  PointText.property('align', {
    get: function get$$1() {
      return this._align;
    },
    set: function set$$1(val) {
      this._align = val;
      return this.setAlign(this._align);
    }
  });

  PointText.property('fontFamily', {
    get: function get$$1() {
      return this._fontFamily;
    },
    set: function set$$1(val) {
      this._fontFamily = val;
      return this.font = this._fontSize + 'px ' + this._fontFamily;
    }
  });

  PointText.property('fontSize', {
    get: function get$$1() {
      return this._fontSize;
    },
    set: function set$$1(val) {
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
  var Point = function (_Object2D) {
    inherits(Point, _Object2D);

    function Point() {
      var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      classCallCheck(this, Point);

      var _this = possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));

      _this.x = x1;
      _this.y = y1;
      _this.lineWidth = 0.5;
      _this._labelIndex = -1;
      return _this;
    }

    createClass(Point, [{
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
      value: function set$$1(x, y) {
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
          this.children[this._labelIndex].x = this.x + utils.POINT_LABEL_OFFSET;
          this.children[this._labelIndex].y = this.y;
        }
        return this;
      }
    }]);
    return Point;
  }(Object2D);

  

  Point.prototype.type = 'Point';

  Point.prototype.fillable = true;

  Point.property('label', {
    get: function get$$1() {
      if (this._labelIndex > -1) {
        return this.children[this._labelIndex].text;
      } else {
        return '';
      }
    },
    set: function set$$1(val) {
      var pointText;
      if (this._labelIndex === -1) {
        pointText = new PointText$1(val, this.x + utils.POINT_LABEL_OFFSET, this.y, {
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
  var Line = function (_Object2D) {
    inherits(Line, _Object2D);

    function Line(p1, p2, p3, p4) {
      classCallCheck(this, Line);

      var _this = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));

      if (arguments.length < 2) {
        _this.points = [new Point$1(), new Point$1()];
      } else if (arguments.length < 4) {
        _this.points = [p1.clone(), p2.clone() // len >= 4
        ];
      } else {
        _this.points = [new Point$1(p1, p2), new Point$1(p3, p4)];
      }
      _this.length = 0;
      _this.midpoint = new Point$1();
      _this.keyPoints = _this.points;
      _this.on("changed", function () {
        _this.length = _this.points[0].distanceTo(_this.points[1]);
        return _this.midpoint.set((_this.points[0].x + _this.points[1].x) / 2, (_this.points[0].y + _this.points[1].y) / 2);
      });
      _this.trigger("changed");
      return _this;
    }

    createClass(Line, [{
      key: 'clone',
      value: function clone() {
        return new Line(this.points[0], this.points[1]);
      }

      // edit

    }, {
      key: 'set',
      value: function set$$1(a1, a2, a3, a4) {
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
  }(Object2D);

  

  Line.prototype.type = 'Line';

  Line.prototype.fillable = false;

  return Line;
}();

var Line$1 = Line;

// Bow shape
var Bow;

Bow = function () {
  var Bow = function (_Object2D) {
    inherits(Bow, _Object2D);

    function Bow(cx, cy, radius, aFrom, aTo) {
      classCallCheck(this, Bow);

      var _this = possibleConstructorReturn(this, (Bow.__proto__ || Object.getPrototypeOf(Bow)).call(this));

      _this.cx = cx;
      _this.cy = cy;
      _this.radius = radius;
      _this.aFrom = aFrom;
      _this.aTo = aTo;
      if (_this.aFrom > _this.aTo) {
        var _ref = [_this.aTo, _this.aFrom];
        _this.aFrom = _ref[0];
        _this.aTo = _ref[1];
      }
      _this.center = new Point$1(_this.cx, _this.cy);
      _this.string = new Line$1(_this.center.arcTo(_this.radius, _this.aFrom), _this.center.arcTo(_this.radius, _this.aTo));
      _this.keyPoints = _this.string.points;
      _this.updateKeyPoints();
      _this.on('changed', _this.updateKeyPoints);
      _this.on('changed', function () {
        var ref;
        return (ref = _this.bounds) != null ? ref.update() : void 0;
      });
      return _this;
    }

    createClass(Bow, [{
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
  }(Object2D);

  

  Bow.prototype.type = 'Bow';

  Bow.prototype.fillable = true;

  return Bow;
}();

var Bow$1 = Bow;

// Circle shape
var Circle;

Circle = function () {
  var Circle = function (_Object2D) {
    inherits(Circle, _Object2D);

    function Circle() {
      var _radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      classCallCheck(this, Circle);

      var _this = possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));

      _this._radius = _radius;
      _this._center = new Point$1(cx, cy);
      _this.bounds = null; // for accelerate contain test
      _this.keyPoints = [_this._center];
      _this.on('centerChanged', _this.updateKeyPoints);
      return _this;
    }

    createClass(Circle, [{
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
  }(Object2D);

  

  Circle.prototype.type = 'Circle';

  Circle.prototype.fillable = true;

  // property
  Circle.property('cx', {
    get: function get$$1() {
      return this._center.x;
    },
    set: function set$$1(val) {
      this._center.x = val;
      return this.trigger('centerChanged', this);
    }
  });

  Circle.property('cy', {
    get: function get$$1() {
      return this._center.y;
    },
    set: function set$$1(val) {
      this._center.y = val;
      return this.trigger('centerChanged', this);
    }
  });

  Circle.property('center', {
    get: function get$$1() {
      return this._center;
    },
    set: function set$$1(val) {
      this._center = val;
      this.cx = val.x;
      this.cy = val.y;
      this.keyPoints[0] = val;
      return this.trigger('centerChanged', this);
    }
  });

  Circle.property('radius', {
    get: function get$$1() {
      return this._radius;
    },
    set: function set$$1(val) {
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
  var Ellipse = function (_Object2D) {
    inherits(Ellipse, _Object2D);

    function Ellipse() {
      var _radiusX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

      var _radiusY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

      classCallCheck(this, Ellipse);

      var _this = possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this));

      _this._radiusX = _radiusX;
      _this._radiusY = _radiusY;
      return _this;
    }

    return Ellipse;
  }(Object2D);

  

  Ellipse.prototype.type = 'Ellipse';

  Ellipse.prototype.fillable = true;

  // property
  Ellipse.property('radiusX', {
    get: function get$$1() {
      return this._radiusX;
    },
    set: function set$$1(val) {
      this._radiusX = val;
      return this.trigger('changed', this);
    }
  });

  Ellipse.property('radiusY', {
    get: function get$$1() {
      return this._radiusY;
    },
    set: function set$$1(val) {
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
  var Fan = function (_Object2D) {
    inherits(Fan, _Object2D);

    function Fan(cx, cy, radius, aFrom, aTo) {
      classCallCheck(this, Fan);

      var _this = possibleConstructorReturn(this, (Fan.__proto__ || Object.getPrototypeOf(Fan)).call(this));

      _this.cx = cx;
      _this.cy = cy;
      _this.radius = radius;
      _this.aFrom = aFrom;
      _this.aTo = aTo;
      if (_this.aFrom > _this.aTo) {
        var _ref = [_this.aTo, _this.aFrom];
        _this.aFrom = _ref[0];
        _this.aTo = _ref[1];
      }
      _this.center = new Point$1(_this.cx, _this.cy);
      _this.string = new Line$1(_this.center.arcTo(_this.radius, _this.aFrom), _this.center.arcTo(_this.radius, _this.aTo));
      _this.keyPoints = [_this.string.points[0], _this.string.points[1], _this.center];
      _this.on('changed', _this.updateKeyPoints);
      _this.on('changed', function () {
        var ref;
        return (ref = _this.bounds) != null ? ref.update() : void 0;
      });
      return _this;
    }

    createClass(Fan, [{
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
  }(Object2D);

  

  Fan.prototype.type = 'Fan';

  Fan.prototype.fillable = true;

  return Fan;
}();

var Fan$1 = Fan;

// triangle shape
var Triangle;

Triangle = function () {
  var Triangle = function (_Object2D) {
    inherits(Triangle, _Object2D);

    function Triangle(p1, p2, p3) {
      classCallCheck(this, Triangle);

      var x1, x2, x3, y1, y2, y3;

      var _this = possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this));

      if (arguments.length === 6) {
        var _arguments = Array.prototype.slice.call(arguments);

        x1 = _arguments[0];
        y1 = _arguments[1];
        x2 = _arguments[2];
        y2 = _arguments[3];
        x3 = _arguments[4];
        y3 = _arguments[5];

        p1 = new Point$1(x1, y1);
        p2 = new Point$1(x2, y2);
        p3 = new Point$1(x3, y3);
      }
      _this.lines = [new Line$1(p1, p2), new Line$1(p2, p3), new Line$1(p3, p1)];
      //@center = new Point average(p1.x, p2.x, p3.x), average(p1.y, p2.y, p3.y)
      _this.points = [p1, p2, p3];
      _this.keyPoints = _this.points;
      _this.on('changed', _this.update);
      _this.on('changed', function () {
        var ref;
        return (ref = _this.bounds) != null ? ref.update() : void 0;
      });
      return _this;
    }

    createClass(Triangle, [{
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
  }(Object2D);

  

  Triangle.prototype.type = 'Triangle';

  Triangle.prototype.fillable = true;

  return Triangle;
}();

var Triangle$1 = Triangle;

// polygon shape
var Polygon;

Polygon = function () {
  var Polygon = function (_Object2D) {
    inherits(Polygon, _Object2D);

    /*
      constructors
      1. Polygon(points)
      2. Polygon(x, y, radius, n, options): to generate regular polygon
        options: angle - start angle of regular polygon
    */
    function Polygon(points) {
      classCallCheck(this, Polygon);

      var n, options, radius, x, y;

      var _this = possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this));

      _this.vertices = [];
      _this.lines = [];
      _this.triangles = [];
      options = utils.combineOptions(arguments, {
        angle: 0
      });
      if (utils.isArray(points)) {
        if (points != null) {
          _this.vertices = points;
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
        _this.vertices = Polygon.generateRegularPoints(x, y, radius, n, options);
      }
      _this.onVerticesChanged();
      _this.on('changed', _this.onVerticesChanged);
      _this.on('changed', function () {
        var ref;
        return (ref = _this.bounds) != null ? ref.update() : void 0;
      });
      _this.keyPoints = _this.vertices;
      return _this;
    }

    createClass(Polygon, [{
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
        angleSection = utils.TWO_PI / n;
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
  }(Object2D);

  

  Polygon.prototype.type = 'Polygon';

  Polygon.prototype.fillable = true;

  return Polygon;
}();

var Polygon$1 = Polygon;

// polyline shape
var Polyline;

Polyline = function () {
  var Polyline = function (_Object2D) {
    inherits(Polyline, _Object2D);

    function Polyline() {
      var vertices1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      classCallCheck(this, Polyline);

      var i, j, ref, vertices;

      var _this = possibleConstructorReturn(this, (Polyline.__proto__ || Object.getPrototypeOf(Polyline)).call(this));

      _this.vertices = vertices1;
      if (arguments.length > 1) {
        vertices = [];
        for (i = j = 0, ref = arguments.length / 2; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          vertices.push(new Point$1(arguments[i * 2], arguments[i * 2 + 1]));
        }
        _this.vertices = vertices;
      }
      _this.lines = [];
      _this.keyPoints = _this.vertices;
      _this.fill(false);
      _this.on("changed", function () {
        if (_this.vertices.length > 1) {
          _this.updateLines();
          if (typeof _this.calcLength === "function") {
            _this.calcLength();
          }
          return typeof _this.calcPointNormalizedPos === "function" ? _this.calcPointNormalizedPos() : void 0;
        }
      });
      _this.trigger("changed");
      return _this;
    }

    createClass(Polyline, [{
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
  }(Object2D);

  

  Polyline.prototype.type = 'Polyline';

  Polyline.prototype.fillable = false;

  // edit
  return Polyline;
}();

var Polyline$1 = Polyline;

// rectangle shape
var Rectangle;

Rectangle = function () {
  var Rectangle = function (_Object2D) {
    inherits(Rectangle, _Object2D);

    function Rectangle(x, y, width, height) {
      var cornerRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      classCallCheck(this, Rectangle);

      var _this = possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this));

      _this.center = new Point$1(x + width / 2, y + height / 2);
      _this.size = new Size(width, height);
      _this.pointLT = new Point$1(x, y);
      _this.pointRT = new Point$1(x + width, y);
      _this.pointRB = new Point$1(x + width, y + height);
      _this.pointLB = new Point$1(x, y + height);
      _this.points = [_this.pointLT, _this.pointRT, _this.pointRB, _this.pointLB];
      _this.cornerRadius = cornerRadius;
      _this.on('changed', function () {
        var ref;
        return (ref = _this.bounds) != null ? ref.update() : void 0;
      });
      return _this;
    }

    createClass(Rectangle, [{
      key: 'clone',
      value: function clone() {
        return new Rectangle(this.pointLT.x, this.pointLT.y, this.size.width, this.size.height);
      }
    }, {
      key: 'set',
      value: function set$$1(x, y, width, height) {
        this.center.set(x + width / 2, y + height / 2);
        this.size.set(width, height);
        this.pointLT.set(x, y);
        this.pointRT.set(x + width, y);
        this.pointRB.set(x + width, y + height);
        return this.pointLB.set(x, y + height);
      }
    }]);
    return Rectangle;
  }(Object2D);

  

  Rectangle.prototype.type = 'Rectangle';

  Rectangle.prototype.fillable = true;

  Rectangle.property('cornerRadius', {
    get: function get$$1() {
      return this._cornerRadius;
    },
    set: function set$$1(val) {
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

  var Spline = function (_Object2D) {
    inherits(Spline, _Object2D);

    function Spline(vertices) {
      classCallCheck(this, Spline);

      var polyline;

      var _this = possibleConstructorReturn(this, (Spline.__proto__ || Object.getPrototypeOf(Spline)).call(this));

      if (vertices instanceof Polyline$1) {
        polyline = vertices;
        _this.vertices = polyline.vertices;
        polyline.on('pointChange', function (polyline) {
          _this.vertices = polyline.vertices;
          return calcControlPoints(_this);
        });
      } else {
        _this.vertices = utils.clone(vertices);
      }
      _this.keyPoints = _this.vertices;
      _this.controlPointsAhead = [];
      _this.controlPointsBehind = [];
      _this.fill(false);
      _this.smoothFactor = utils.DEFAULT_SPLINE_SMOOTH;
      _this._smoother = false;
      calcControlPoints(_this);
      return _this;
    }

    createClass(Spline, [{
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
  }(Object2D);

  

  Spline.prototype.type = 'Spline';

  Spline.prototype.fillable = false;

  Spline.property('smoother', {
    get: function get$$1() {
      return this._smoother;
    },
    set: function set$$1(val) {
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
        len1 = utils.bevel(p[i].y - p[i - 1].y, p[i].x - p[i - 1].x);
        len2 = utils.bevel(p[i].y - p[i + 1].y, p[i].x - p[i + 1].x);
        theta = theta1 + (theta2 - theta1) * (spline._smoother ? len1 / (len1 + len2) : 0.5);
        if (Math.abs(theta - theta1) > utils.HALF_PI) {
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
//spline.children[i * 2 - 2] = new Line spline.vertices[i], spline.controlPointsAhead[i]
//spline.children[i * 2 - 1] =  new Line spline.vertices[i], spline.controlPointsBehind[i]
var Spline$1 = Spline;

// Used to render bitmap to the screen
var Image$1;

Image$1 = function () {
  var Image = function (_Object2D) {
    inherits(Image, _Object2D);

    function Image(url) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var width = arguments[3];
      var height = arguments[4];
      classCallCheck(this, Image);

      var _this = possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this));

      _this.url = url;
      _this.type = 'Image';
      _this.autoSize = true;
      _this.size = new Size();
      _this.position = new Vector(x, y);
      _this.center = new Vector(x + width / 2, y + height / 2);
      if (width != null) {
        _this.size.set(width, height);
        _this.autoSize = false;
      }
      _this.pivot = new Vector(0.5, 0.5);
      _this._image = new window.Image();
      _this.ready = false;
      _this._image.onload = function (ev) {
        if (_this.autoSize) {
          _this.size.set(_this._image.width, _this._image.height);
        }
        return _this.ready = true;
      };
      if (_this.url != null) {
        _this._image.src = _this.url;
      }
      return _this;
    }

    return Image;
  }(Object2D);

  

  Image.property('image', {
    get: function get$$1() {
      return this._image;
    },
    set: function set$$1(val) {
      this._image = val;
      return this.ready = true;
    }
  });

  return Image;
}();

var Image$2 = Image$1;

// Sprite Sheet
var SpriteSheet;
var ajax;
var hasProp$2 = {}.hasOwnProperty;

ajax = function ajax(url, ops) {
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

SpriteSheet = function () {
  var canvas, clipImage, context;

  var SpriteSheet = function () {
    function SpriteSheet(url1) {
      var _this = this;

      classCallCheck(this, SpriteSheet);

      this.url = url1;
      Event.apply(this);
      this.ready = false; // If this sprite sheet is loaded and parsed.
      this.height = 0; // Height of this sprite
      this.data = null; // The JSON data
      this.images = []; // The `Image` list loaded
      this.frameImages = []; // Parsed frame images

      // load and trigger parseData()
      ajax(this.url, {
        success: function success(text) {
          var baseUrl, countLoaded, i, ref, results;
          _this.data = JSON.parse(text);
          if (_this.data.images == null) {
            _this.data.images = [_this.url.substring(_this.url.lastIndexOf('/'), _this.url.length - 5) + '.png'];
          }
          baseUrl = _this.url.substring(0, _this.url.lastIndexOf('/') + 1);
          ref = _this.data.images;
          results = [];
          for (i in ref) {
            if (!hasProp$2.call(ref, i)) continue;
            _this.data.images[i] = baseUrl + _this.data.images[i];
            countLoaded = 0;
            _this.images[i] = new Image();
            _this.images[i].onload = function () {
              countLoaded += 1;
              if (countLoaded === _this.data.images.length) {
                return _this.parseData();
              }
            };
            results.push(_this.images[i].src = _this.data.images[i]);
          }
          return results;
        }
      });
    }

    createClass(SpriteSheet, [{
      key: 'parseData',
      value: function parseData() {
        var frameIndex, frames, h, i, j, k, ref, w, x, y;
        // Clip the image for every frames
        frames = this.data.frames;
        for (i in frames) {
          if (!hasProp$2.call(frames, i)) continue;
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
    function MouseControl(renderer) {
      classCallCheck(this, MouseControl);

      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseWheel = this.onMouseWheel.bind(this);
      this.renderer = renderer;
      this.camera = this.renderer.camera;
      this.zoomScaleAnim = scaleAnimation.applyTo(this.camera);
      this.zoomTransAnim = translateAnimation.applyTo(this.camera);
      this.smoothZooming = true;
      this.desScale = new Vector(1, 1);
      this.renderer.dom.addEventListener('mousemove', this.onMouseMove);
      this.renderer.dom.addEventListener('mousewheel', this.onMouseWheel);
    }

    createClass(MouseControl, [{
      key: 'onMouseMove',
      value: function onMouseMove(ev) {
        var dx, dy, scale;
        if (ev.buttons === utils.MOUSE.LEFT) {
          scale = this.camera.scale.x;
          dx = -ev.movementX * scale;
          dy = -ev.movementY * scale;
          return this.camera.translate(dx, dy);
        }
      }
    }, {
      key: 'onMouseWheel',
      value: function onMouseWheel(ev) {
        var deltaScaleAll, deltaScaleStep, dx, dy, targetStyle, x, y;

        var _renderer$projectToWo = this.renderer.projectToWorld(ev.offsetX, ev.offsetY);

        var _renderer$projectToWo2 = slicedToArray(_renderer$projectToWo, 2);

        x = _renderer$projectToWo2[0];
        y = _renderer$projectToWo2[1];

        deltaScaleStep = Math.pow(1.25, -ev.wheelDelta / 120);
        this.desScale.multiplyScalar(deltaScaleStep);
        deltaScaleAll = this.desScale.x / this.camera.scale.x;
        targetStyle = getComputedStyle(ev.target);
        dx = -x * (deltaScaleAll - 1) * this.camera.scale.x;
        dy = -y * (deltaScaleAll - 1) * this.camera.scale.y;
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
        anim.arg = new Vector();
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
var hasProp$3 = {}.hasOwnProperty;

geometryAlgorithm = G = {
  inject: function inject() {
    return this.injectInto(['point', 'line', 'circle', 'ellipse', 'triangle', 'rectangle', 'fan', 'bow', 'polygon', 'polyline']);
  },
  injectInto: function injectInto(shapes) {
    if (typeof shapes === 'string') {
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
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : utils.DEFAULT_NEAR_DIST;

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
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : utils.DEFAULT_NEAR_DIST;

    return point.distanceTo(target) < limit;
  },
  pointNearLine: function pointNearLine(point, line) {
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : utils.DEFAULT_NEAR_DIST;

    var footPoint, isBetween1, isBetween2, verticalDist;
    verticalDist = line.distanceTo(point);
    footPoint = line.footPointFrom(point);
    isBetween1 = footPoint.distanceTo(line.points[0]) < line.length + limit;
    isBetween2 = footPoint.distanceTo(line.points[1]) < line.length + limit;
    return verticalDist < limit && isBetween1 && isBetween2;
  },
  pointNearPolyline: function pointNearPolyline(point, polyline) {
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : utils.DEFAULT_NEAR_DIST;

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
    return utils.bevel(dx, dy) < circle.radius;
  },
  pointInEllipse: function pointInEllipse(point, ellipse) {
    return utils.bevel(point.x / ellipse.radiusX, point.y / ellipse.radiusY) < 1;
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
      a += utils.TWO_PI;
    }
    return utils.bevel(dx, dy) < fan.radius && a > fan.aFrom && a < fan.aTo;
  },
  pointInBow: function pointInBow(point, bow) {
    var sameSide, smallThanHalfCircle;
    if (utils.bevel(bow.cx - point.x, bow.cy - point.y) < bow.radius) {
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
    return utils.bevel(point1.x - point2.x, point1.y - point2.y);
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

    var _line1$points = slicedToArray(line1.points, 2);

    p1 = _line1$points[0];
    p2 = _line1$points[1];

    var _line2$points = slicedToArray(line2.points, 2);

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
      if (!hasProp$3.call(ref, i)) continue;
      if (i < 2) {
        compressed[i] = polyline.vertices[i];
      } else {
        var _compressed$slice = compressed.slice(-2);

        var _compressed$slice2 = slicedToArray(_compressed$slice, 2);

        pA = _compressed$slice2[0];
        pM = _compressed$slice2[1];

        pB = polyline.vertices[i];
        obliqueAngle = Math.abs(Math.atan2(pA.y - pM.y, pA.x - pM.x) - Math.atan2(pM.y - pB.y, pM.x - pB.x));
        if (obliqueAngle < strength * strength * utils.HALF_PI) {
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

    var _triangle$points = slicedToArray(triangle.points, 3);

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
      classCallCheck(this, ShapeRandomizer);
    }

    createClass(ShapeRandomizer, [{
      key: 'randomX',
      value: function randomX() {
        return utils.rand(this.rangeX + MARGIN, this.rangeX + this.rangeWidth - MARGIN * 2);
      }
    }, {
      key: 'randomY',
      value: function randomY() {
        return utils.rand(this.rangeY + MARGIN, this.rangeY + this.rangeHeight - MARGIN * 2);
      }
    }, {
      key: 'randomRadius',
      value: function randomRadius() {
        return utils.rand(10, Math.min(this.rangeX + this.rangeWidth, this.rangeY + this.rangeHeight) / 2);
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
        if (utils.isArray(shape)) {
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
        ellipse = new Ellipse$1(this.randomRadius(), this.randomRadius());
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
        aFrom = utils.rand(utils.TWO_PI);
        aTo = aFrom + utils.rand(utils.HALF_PI, utils.TWO_PI);
        bow = new Bow$1(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
        bow.string.points[0].label = 'A';
        bow.string.points[1].label = 'B';
        return bow;
      }
    }, {
      key: 'randomizeBow',
      value: function randomizeBow(bow) {
        var aFrom, aTo;
        aFrom = utils.rand(utils.TWO_PI);
        aTo = aFrom + utils.rand(utils.HALF_PI, utils.TWO_PI);
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
        aFrom = utils.rand(utils.TWO_PI);
        aTo = aFrom + utils.rand(utils.HALF_PI, utils.TWO_PI);
        fan = new Fan$1(this.randomX(), this.randomY(), this.randomRadius(), aFrom, aTo);
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
          points[i] = new Point$1(this.randomX(), this.randomY());
        }
        triangle = new Triangle$1(points[0], points[1], points[2]);
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
        rect = new Rectangle$1(utils.rand(this.rangeX + this.rangeWidth), utils.rand(this.rangeY + this.rangeHeight), utils.rand(this.rangeWidth / 2), utils.rand(this.rangeHeight / 2));
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
          point = new Point$1(this.randomX(), this.randomY());
          point.label = 'P' + i;
          points.push(point);
        }
        return new Polygon$1(points);
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
        line = new Line$1(this.randomX(), this.randomY(), this.randomX(), this.randomY());
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
        polyline = new Polyline$1();
        for (i = j = 0; j <= 3; i = ++j) {
          point = new Point$1(this.randomX(), this.randomY());
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

// global config

var config = {
  originAtCenter: true,
  font: '12px Verdana',
  background: '#eee',
  showKeyPoints: false
};

var cursor = 'default';
Object.defineProperty(config, 'cursor', {
  get: function get() {
    return cursor;
  },
  set: function set(val) {
    cursor = val;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Bu$2.$bues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var bu = _step.value;

        bu.$renderer.dom.style.cursor = cursor;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
});

// Entry of bu.js

// main
var VERSION = '0.5.0-wip';

Bu$2.Bounds = Bounds;
Bu$2.Color = Color;
Bu$2.Size = Size;
Bu$2.Vector = Vector;

Bu$2.Event = Event;
Bu$2.Object2D = Object2D;
Bu$2.Styled = Styled;

Bu$2.Audio = Audio;
Bu$2.Camera = Camera;
Bu$2.Renderer = Renderer$1;
Bu$2.Scene = Scene;

Bu$2.Bow = Bow$1;
Bu$2.Circle = Circle$1;
Bu$2.Ellipse = Ellipse$1;
Bu$2.Fan = Fan$1;
Bu$2.Line = Line$1;
Bu$2.Point = Point$1;
Bu$2.Polygon = Polygon$1;
Bu$2.Polyline = Polyline$1;
Bu$2.Rectangle = Rectangle$1;
Bu$2.Spline = Spline$1;
Bu$2.Triangle = Triangle$1;

Bu$2.Image = Image$2;
Bu$2.PointText = PointText$1;

Bu$2.Animation = Animation$1;
Bu$2.AnimationRunner = AnimationRunner$1;
Bu$2.AnimationTask = AnimationTask$1;
Bu$2.DashFlowManager = DashFlowManager$1;
Bu$2.SpriteSheet = SpriteSheet$1;

Bu$2.InputManager = InputManager$1;
Bu$2.MouseControl = MouseControl$1;

Bu$2.geometryAlgorithm = geometryAlgorithm$1;
Bu$2.ShapeRandomizer = ShapeRandomizer$1;

Bu$2.config = config; // Global config
Bu$2.version = VERSION; // Version info

// utils in examples
var _arr = ['d2r', 'rand', 'MOUSE', 'POINT_RENDER_SIZE'];
for (var _i = 0; _i < _arr.length; _i++) {
  var name = _arr[_i];
  Bu$2[name] = utils[name];
}

// Output version info to the console, at most one time in a minute.
var currentTime = Date.now();
var lastTime = utils.data('version.timestamp');
if (!lastTime || currentTime - lastTime > 60 * 1000) {
  if (typeof console.info === 'function') {
    console.info('bu.js v' + Bu$2.version + ' - [https://github.com/jarvisniu/bu.js]');
  }
  utils.data('version.timestamp', currentTime);
}

return Bu$2;

}());
//# sourceMappingURL=bu.js.map
