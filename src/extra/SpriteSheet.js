// Sprite Sheet

import Event from '../base/Event.js'

let canvas = document.createElement('canvas')
let context = canvas.getContext('2d')
let clipImage = function(image, x, y, w, h) {
  canvas.width = w
  canvas.height = h
  context.drawImage(image, x, y, w, h, 0, 0, w, h)

  const newImage = new window.Image()
  newImage.src = canvas.toDataURL()
  return newImage
}

class SpriteSheet {
  constructor(url) {
    this.url = url
    Event.apply(this)

    this.ready = false // If this sprite sheet is loaded and parsed.
    this.height = 0 // Height of this sprite

    this.data = null // The JSON data
    this.images = [] // The `Image` list loaded
    this.frameImages = [] // Parsed frame images

    // load and trigger parseData()
    ajax(this.url, {
      success: text => {
        this.data = JSON.parse(text)

        if (this.data.images == null) {
          this.data.images = [
            this.url.substring(this.url.lastIndexOf('/'), this.url.length - 5) +
              '.png',
          ]
        }

        const baseUrl = this.url.substring(0, this.url.lastIndexOf('/') + 1)
        return (() => {
          const result = []
          for (let i of Object.keys(this.data.images || {})) {
            this.data.images[i] = baseUrl + this.data.images[i]

            var countLoaded = 0
            this.images[i] = new window.Image()
            this.images[i].onload = () => {
              countLoaded += 1
              if (countLoaded === this.data.images.length) {
                return this.parseData()
              }
            }
            result.push((this.images[i].src = this.data.images[i]))
          }
          return result
        })()
      },
    })
  }

  parseData() {
    // Clip the image for every frames
    const { frames } = this.data
    for (let i = 0; i < frames.length; i++) {
      for (var j = 0; j < 4; j++) {
        if (frames[i][j] == null) frames[i][j] = frames[i - 1][j]
      }
      frames[i][4] = frames[i][4] || 0

      const x = frames[i][0]
      const y = frames[i][1]
      const w = frames[i][2]
      const h = frames[i][3]
      const frameIndex = frames[i][4]
      this.frameImages[i] = clipImage(this.images[frameIndex], x, y, w, h)
      if (this.height === 0) {
        this.height = h
      }
    }

    this.ready = true
    return this.trigger('loaded')
  }

  getFrameImage(key, index) {
    if (index == null) {
      index = 0
    }
    if (!this.ready) {
      return null
    }
    const animation = this.data.animations[key]
    if (animation == null) {
      return null
    }

    return this.frameImages[animation.frames[index]]
  }

  measureTextWidth(text) {
    let width = 0
    for (let char of Array.from(text)) {
      width += this.getFrameImage(char).width
    }
    return width
  }
}

// ----------------------------------------------------------------------
// jQuery style ajax()
//  options:
//    url: string
//    ====
//    async = true: bool
//  data: object - query parameters
//    method = GET: POST, PUT, DELETE, HEAD
//    success: function
//    error: function
// ----------------------------------------------------------------------
const ajax = function(url, ops) {
  if (!ops) {
    if (typeof url === 'object') {
      ops = url
      ;({ url } = ops)
    } else {
      ops = {}
    }
  }
  if (!ops.method) {
    ops.method = 'GET'
  }
  if (ops.async == null) {
    ops.async = true
  }

  const xhr = new window.XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (ops.success != null) {
          return ops.success(xhr.responseText, xhr.status, xhr)
        }
      } else {
        if (ops.error != null) {
          ops.error(xhr, xhr.status)
        }
        if (ops.complete != null) {
          return ops.complete(xhr, xhr.status)
        }
      }
    }
  }

  xhr.open(ops.method, url, ops.async, ops.username, ops.password)
  return xhr.send(null)
}

export default SpriteSheet
