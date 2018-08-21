// 2D vector

import utils from '../utils.js'

class Vector {
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  clone () {
    return new Vector(this.x, this.y)
  }

  add (v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  set (x, y) {
    this.x = x
    this.y = y
    return this
  }

  offset (dx, dy) {
    this.x += dx
    this.y += dy
    return this
  }

  copy (v) {
    this.x = v.x
    this.y = v.y
    return this
  }

  multiplyScalar (scalar) {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  project (obj) {
    this.x *= obj.scale.x
    this.y *= obj.scale.y
    // rotation
    let len = utils.bevel(this.x, this.y)
    let a = Math.atan2(this.y, this.x) + obj.rotation
    this.x = len * Math.cos(a)
    this.y = len * Math.sin(a)
    // translate
    this.x += obj.position.x
    this.y += obj.position.y
    return this
  }

  unProject (obj) {
    // translate
    this.x -= obj.position.x
    this.y -= obj.position.y
    // rotation
    let len = utils.bevel(this.x, this.y)
    let a = Math.atan2(this.y, this.x) - obj.rotation
    this.x = len * Math.cos(a)
    this.y = len * Math.sin(a)
    // scale
    this.x /= obj.scale.x
    this.y /= obj.scale.y
    return this
  }
}

export default Vector
