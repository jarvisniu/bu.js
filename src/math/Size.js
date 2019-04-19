// The size of Rectangle, Bound etc.

class Size {
  constructor(width, height) {
    this.type = 'Size'
    this.width = width
    this.height = height
  }

  set(width, height) {
    this.width = width
    this.height = height
  }
}

export default Size
