// Parse and serialize color

import utils from '../utils.js'

const RE_HSL = /hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/i
const RE_HSLA = /hsla\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i
const RE_RGB = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i
const RE_RGBA = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+)\s*,\s*([.\d]+)\s*\)/i
const RE_RGB_PER = /rgb\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*\)/i
const RE_RGBA_PER = /rgba\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i
const RE_HEX3 = /#([0-9A-F]{3})\s*$/i
const RE_HEX6 = /#([0-9A-F]{6})\s*$/i

const CSS3_COLORS = {
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
  yellowgreen: [154, 205, 50],
}

function hsl2rgb (h, s, l) {
  let nh = h % 360 / 360
  let q = l < 0.5 ? l * (1 + s) : l + s - (l * s)
  let p = 2 * l - q
  let t = [nh + 1 / 3, nh, nh - 1 / 3]
  let rgb = []

  for (let i of [0, 1, 2]) {
    if (t[i] < 0) t[i] += 1
    if (t[i] > 1) t[i] -= 1
  }

  for (let i of [0, 1, 2]) {
    if (t[i] < 1 / 6) {
      rgb[i] = p + (q - p) * 6 * t[i]
    } else if (t[i] < 0.5) {
      rgb[i] = q
    } else if (t[i] < 2 / 3) {
      rgb[i] = p + (q - p) * 6 * (2 / 3 - t[i])
    } else {
      rgb[i] = p
    }

    rgb[i] = Math.round(rgb[i] * 255)
  }

  return rgb
}

// Private functions -----------------------------------------------------------

// function rgb2hsl (r, g, b) {
//   let max = Math.max(r, g, b)
//   let min = Math.min(r, g, b)

//   let h
//   if (max === min) {
//     h = 0
//   } else if (max === r && g >= b) {
//     h = 60 * (g - b) / (max - min)
//   } else if (max === r && g < b) {
//     h = 60 * (g - b) / (max - min) + 360
//   } else if (max === g) {
//     h = 60 * (b - r) / (max - min) + 120
//   } else { // if max == b
//     h = 60 * (r - g) / (max - min) + 240
//   }

//   let l = 0.5 * (max + min)

//   let s
//   if (l === 0 || max === min) {
//     s = 0
//   } else if (l > 0 && l <= 0.5) {
//     s = (max - min) / (2 * l)
//   } else { // if l > 0.5
//     s = (max - min) / (2 - 2 * l)
//   }

//   return [h, s, l]
// }

function clampAlpha (a) {
  return utils.clamp(a, 0, 1)
}

class Color {
  constructor () {
    this.r = this.g = this.b = 255
    this.a = 1

    if (arguments.length === 1) {
      let arg = arguments[0]
      if (typeof arg === 'string') {
        this.parse(arg)
        this.a = clampAlpha(this.a)
      } else if (arg instanceof Color) {
        this.copy(arg)
      }
    } else {
      // if arguments.length == 3 or 4
      this.r = arguments[0]
      this.g = arguments[1]
      this.b = arguments[2]
      this.a = arguments[3] || 1
    }
  }

  parse (str) {
    let found = str.match(RE_RGB)
    if (found) {
      this.r = +found[1]
      this.g = +found[2]
      this.b = +found[3]
      this.a = 1
      return this
    }

    found = str.match(RE_HSL)
    if (found) {
      let h = +found[1]
      let s = +found[2] / 100
      let l = +found[3] / 100
      let [r, g, b] = hsl2rgb(h, s, l)
      this.r = r
      this.g = g
      this.b = b
      this.a = 1
      return this
    }

    found = str.match(RE_RGBA)
    if (found) {
      this.r = +found[1]
      this.g = +found[2]
      this.b = +found[3]
      this.a = +found[4]
      return this
    }

    found = str.match(RE_HSLA)
    if (found) {
      let h = +found[1]
      let s = +found[2] / 100
      let l = +found[3] / 100
      let [r, g, b] = hsl2rgb(h, s, l)
      this.r = r
      this.g = g
      this.b = b
      this.a = parseFloat(found[4])
      return this
    }

    found = str.match(RE_RGBA_PER)
    if (found) {
      this.r = +found[1] * 255 / 100
      this.g = +found[2] * 255 / 100
      this.b = +found[3] * 255 / 100
      this.a = +found[4]
      return this
    }

    found = str.match(RE_RGB_PER)
    if (found) {
      this.r = +found[1] * 255 / 100
      this.g = +found[2] * 255 / 100
      this.b = +found[3] * 255 / 100
      this.a = 1
      return this
    }

    found = str.match(RE_HEX3)
    if (found) {
      let hex = found[1]
      this.r = parseInt(hex[0], 16)
      this.r = this.r * 16 + this.r
      this.g = parseInt(hex[1], 16)
      this.g = this.g * 16 + this.g
      this.b = parseInt(hex[2], 16)
      this.b = this.b * 16 + this.b
      this.a = 1
      return this
    }

    found = str.match(RE_HEX6)
    if (found) {
      let hex = found[1]
      this.r = parseInt(hex.substring(0, 2), 16)
      this.g = parseInt(hex.substring(2, 4), 16)
      this.b = parseInt(hex.substring(4, 6), 16)
      this.a = 1
      return this
    }

    str = str.toLowerCase().trim()
    if (CSS3_COLORS[str] != null) {
      this.r = CSS3_COLORS[str][0]
      this.g = CSS3_COLORS[str][1]
      this.b = CSS3_COLORS[str][2]
      this.a = CSS3_COLORS[str][3]
      if (this.a == null) {
        this.a = 1
      }
      return this
    }

    console.error(`Color.parse("${ str }") error.`)
    return this
  }

  clone () {
    let color = new Color()
    color.copy(this)
    return color
  }

  copy (color) {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a
    return this
  }

  setRGB (r, g, b) {
    this.r = parseInt(r)
    this.g = parseInt(g)
    this.b = parseInt(b)
    this.a = 1
    return this
  }

  setRGBA (r, g, b, a) {
    this.r = parseInt(r)
    this.g = parseInt(g)
    this.b = parseInt(b)
    this.a = clampAlpha(parseFloat(a))
    return this
  }

  toRGB () {
    return `rgb(${ this.r }, ${ this.g }, ${ this.b })`
  }

  toRGBA () {
    return `rgba(${ this.r }, ${ this.g }, ${ this.b }, ${ this.a })`
  }
}

export default Color
