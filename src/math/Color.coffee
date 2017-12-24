# Parse and serialize color
# TODO Support hsl(0, 100%, 50%) format.

import utils from '../utils.js'

class Color

  constructor: () ->
    @r = @g = @b = 255
    @a = 1

    if arguments.length == 1
      arg = arguments[0]
      if typeof arg == 'string'
        @parse arg
        @a = clampAlpha @a
      else if arg instanceof Color
        @copy arg
    else # if arguments.length == 3 or 4
      @r = arguments[0]
      @g = arguments[1]
      @b = arguments[2]
      @a = arguments[3] or 1

  parse: (str) ->
    if found = str.match RE_RGB
      @r = +found[1]
      @g = +found[2]
      @b = +found[3]
      @a = 1
    else if found = str.match RE_HSL
      h = +found[1]
      s = +found[2] / 100
      l = +found[3] / 100
      [@r, @g, @b] = hsl2rgb h, s, l
      @a = 1
    else if found = str.match RE_RGBA
      @r = +found[1]
      @g = +found[2]
      @b = +found[3]
      @a = +found[4]
    else if found = str.match RE_HSLA
      h = +found[1]
      s = +found[2] / 100
      l = +found[3] / 100
      [@r, @g, @b] = hsl2rgb h, s, l
      @a = parseFloat found[4]
    else if found = str.match RE_RGBA_PER
      @r = +found[1] * 255 / 100
      @g = +found[2] * 255 / 100
      @b = +found[3] * 255 / 100
      @a = +found[4]
    else if found = str.match RE_RGB_PER
      @r = +found[1] * 255 / 100
      @g = +found[2] * 255 / 100
      @b = +found[3] * 255 / 100
      @a = 1
    else if found = str.match RE_HEX3
      hex = found[1]
      @r = parseInt hex[0], 16
      @r = @r * 16 + @r
      @g = parseInt hex[1], 16
      @g = @g * 16 + @g
      @b = parseInt hex[2], 16
      @b = @b * 16 + @b
      @a = 1
    else if found = str.match RE_HEX6
      hex = found[1]
      @r = parseInt hex.substring(0, 2), 16
      @g = parseInt hex.substring(2, 4), 16
      @b = parseInt hex.substring(4, 6), 16
      @a = 1
    else if CSS3_COLORS[str = str.toLowerCase().trim()]?
      @r = CSS3_COLORS[str][0]
      @g = CSS3_COLORS[str][1]
      @b = CSS3_COLORS[str][2]
      @a = CSS3_COLORS[str][3]
      @a = 1 unless @a?
    else
      console.error "Color.parse(\"#{ str }\") error."
    @

  clone: ->
    (new Color).copy @

  copy: (color) ->
    @r = color.r
    @g = color.g
    @b = color.b
    @a = color.a
    @

  setRGB: (r, g, b) ->
    @r = parseInt r
    @g = parseInt g
    @b = parseInt b
    @a = 1
    @

  setRGBA: (r, g, b, a) ->
    @r = parseInt r
    @g = parseInt g
    @b = parseInt b
    @a = clampAlpha parseFloat a
    @

  toRGB: ->
    "rgb(#{ @r }, #{ @g }, #{ @b })"

  toRGBA: ->
    "rgba(#{ @r }, #{ @g }, #{ @b }, #{ @a })"


  # Private functions

  clampAlpha = (a) -> utils.clamp a, 0, 1

  hsl2rgb = (h, s, l) ->
    h %= 360
    h /= 360

    q = if l < 0.5 then l * (1 + s) else l + s - (l * s)
    p = 2 * l - q
    t = [h + 1 / 3, h, h - 1 / 3]
    rgb = []

    for i in [0..2]
      t[i] += 1 if t[i] < 0
      t[i] -= 1 if t[i] > 1

    for i in [0..2]
      if t[i] < 1 / 6
        rgb[i] = p + (q - p) * 6 * t[i]
      else if t[i] < 0.5
        rgb[i] = q
      else if t[i] < 2 / 3
        rgb[i] = p + (q - p) * 6 * (2 / 3 - t[i])
      else
        rgb[i] = p

      rgb[i] = Math.round rgb[i] * 255
    rgb

  rgb2hsl = (r, g, b) ->
    max = Math.max r, g, b
    min = Math.min r, g, b

    h = if max == min
      0
    else if max == r and g >= b
      60 * (g - b) / (max - min)
    else if max == r and g < b
      60 * (g - b) / (max - min) + 360
    else if max == g
      60 * (b - r) / (max - min) + 120
    else  # if max == b
      60 * (r - g) / (max - min) + 240

    l = 0.5 * (max + min)

    s = if l == 0 or max == min
      0
    else if l > 0 and l <= 0.5
      (max - min) / (2 * l)
    else  # if l > 0.5
      (max - min) / (2 - 2 * l)

    [h, s, l]

  # Private variables

  RE_HSL = /hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/i
  RE_HSLA = /hsla\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i
  RE_RGB = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i
  RE_RGBA = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+)\s*,\s*([.\d]+)\s*\)/i
  RE_RGB_PER = /rgb\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*\)/i
  RE_RGBA_PER = /rgba\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\s*,\s*([.\d]+)\s*\)/i
  RE_HEX3 = /#([0-9A-F]{3})\s*$/i
  RE_HEX6 = /#([0-9A-F]{6})\s*$/i
  CSS3_COLORS =
    transparent: [0, 0, 0, 0]

    aliceblue: [240, 248, 255]
    antiquewhite: [250, 235, 215]
    aqua: [0, 255, 255]
    aquamarine: [127, 255, 212]
    azure: [240, 255, 255]
    beige: [245, 245, 220]
    bisque: [255, 228, 196]
    black: [0, 0, 0]
    blanchedalmond: [255, 235, 205]
    blue: [0, 0, 255]
    blueviolet: [138, 43, 226]
    brown: [165, 42, 42]
    burlywood: [222, 184, 135]
    cadetblue: [95, 158, 160]
    chartreuse: [127, 255, 0]
    chocolate: [210, 105, 30]
    coral: [255, 127, 80]
    cornflowerblue: [100, 149, 237]
    cornsilk: [255, 248, 220]
    crimson: [220, 20, 60]
    cyan: [0, 255, 255]
    darkblue: [0, 0, 139]
    darkcyan: [0, 139, 139]
    darkgoldenrod: [184, 134, 11]
    darkgray: [169, 169, 169]
    darkgreen: [0, 100, 0]
    darkgrey: [169, 169, 169]
    darkkhaki: [189, 183, 107]
    darkmagenta: [139, 0, 139]
    darkolivegreen: [85, 107, 47]
    darkorange: [255, 140, 0]
    darkorchid: [153, 50, 204]
    darkred: [139, 0, 0]
    darksalmon: [233, 150, 122]
    darkseagreen: [143, 188, 143]
    darkslateblue: [72, 61, 139]
    darkslategray: [47, 79, 79]
    darkslategrey: [47, 79, 79]
    darkturquoise: [0, 206, 209]
    darkviolet: [148, 0, 211]
    deeppink: [255, 20, 147]
    deepskyblue: [0, 191, 255]
    dimgray: [105, 105, 105]
    dimgrey: [105, 105, 105]
    dodgerblue: [30, 144, 255]
    firebrick: [178, 34, 34]
    floralwhite: [255, 250, 240]
    forestgreen: [34, 139, 34]
    fuchsia: [255, 0, 255]
    gainsboro: [220, 220, 220]
    ghostwhite: [248, 248, 255]
    gold: [255, 215, 0]
    goldenrod: [218, 165, 32]
    gray: [128, 128, 128]
    green: [0, 128, 0]
    greenyellow: [173, 255, 47]
    grey: [128, 128, 128]
    honeydew: [240, 255, 240]
    hotpink: [255, 105, 180]
    indianred: [205, 92, 92]
    indigo: [75, 0, 130]
    ivory: [255, 255, 240]
    khaki: [240, 230, 140]
    lavender: [230, 230, 250]
    lavenderblush: [255, 240, 245]
    lawngreen: [124, 252, 0]
    lemonchiffon: [255, 250, 205]
    lightblue: [173, 216, 230]
    lightcoral: [240, 128, 128]
    lightcyan: [224, 255, 255]
    lightgoldenrodyellow: [250, 250, 210]
    lightgray: [211, 211, 211]
    lightgreen: [144, 238, 144]
    lightgrey: [211, 211, 211]
    lightpink: [255, 182, 193]
    lightsalmon: [255, 160, 122]
    lightseagreen: [32, 178, 170]
    lightskyblue: [135, 206, 250]
    lightslategray: [119, 136, 153]
    lightslategrey: [119, 136, 153]
    lightsteelblue: [176, 196, 222]
    lightyellow: [255, 255, 224]
    lime: [0, 255, 0]
    limegreen: [50, 205, 50]
    linen: [250, 240, 230]
    magenta: [255, 0, 255]
    maroon: [128, 0, 0]
    mediumaquamarine: [102, 205, 170]
    mediumblue: [0, 0, 205]
    mediumorchid: [186, 85, 211]
    mediumpurple: [147, 112, 219]
    mediumseagreen: [60, 179, 113]
    mediumslateblue: [123, 104, 238]
    mediumspringgreen: [0, 250, 154]
    mediumturquoise: [72, 209, 204]
    mediumvioletred: [199, 21, 133]
    midnightblue: [25, 25, 112]
    mintcream: [245, 255, 250]
    mistyrose: [255, 228, 225]
    moccasin: [255, 228, 181]
    navajowhite: [255, 222, 173]
    navy: [0, 0, 128]
    oldlace: [253, 245, 230]
    olive: [128, 128, 0]
    olivedrab: [107, 142, 35]
    orange: [255, 165, 0]
    orangered: [255, 69, 0]
    orchid: [218, 112, 214]
    palegoldenrod: [238, 232, 170]
    palegreen: [152, 251, 152]
    paleturquoise: [175, 238, 238]
    palevioletred: [219, 112, 147]
    papayawhip: [255, 239, 213]
    peachpuff: [255, 218, 185]
    peru: [205, 133, 63]
    pink: [255, 192, 203]
    plum: [221, 160, 221]
    powderblue: [176, 224, 230]
    purple: [128, 0, 128]
    red: [255, 0, 0]
    rosybrown: [188, 143, 143]
    royalblue: [65, 105, 225]
    saddlebrown: [139, 69, 19]
    salmon: [250, 128, 114]
    sandybrown: [244, 164, 96]
    seagreen: [46, 139, 87]
    seashell: [255, 245, 238]
    sienna: [160, 82, 45]
    silver: [192, 192, 192]
    skyblue: [135, 206, 235]
    slateblue: [106, 90, 205]
    slategray: [112, 128, 144]
    slategrey: [112, 128, 144]
    snow: [255, 250, 250]
    springgreen: [0, 255, 127]
    steelblue: [70, 130, 180]
    tan: [210, 180, 140]
    teal: [0, 128, 128]
    thistle: [216, 191, 216]
    tomato: [255, 99, 71]
    turquoise: [64, 224, 208]
    violet: [238, 130, 238]
    wheat: [245, 222, 179]
    white: [255, 255, 255]
    whitesmoke: [245, 245, 245]
    yellow: [255, 255, 0]
    yellowgreen: [154, 205, 50]

export default Color
