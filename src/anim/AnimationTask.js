// AnimationTask is an instance of Animation, run by AnimationRunner

import utils from '../utils.js'

import Color from '../math/Color.js'
import Vector from '../math/Vector.js'

let interpolateNum = (a, b, t) => b * t - a * (t - 1)

let interpolateColor = (a, b, t, c) =>
  c.setRGBA(
    interpolateNum(a.r, b.r, t),
    interpolateNum(a.g, b.g, t),
    interpolateNum(a.b, b.b, t),
    interpolateNum(a.a, b.a, t),
  )

let interpolateVector = function(a, b, t, c) {
  c.x = interpolateNum(a.x, b.x, t)
  c.y = interpolateNum(a.y, b.y, t)
}

class AnimationTask {
  constructor(animation, target, args) {
    this.animation = animation
    this.target = target
    if (args == null) {
      args = []
    }
    this.args = args
    this.startTime = 0
    this.finished = false
    this.from = utils.clone(this.animation.from)
    this.current = utils.clone(this.animation.from)
    this.to = utils.clone(this.animation.to)
    this.data = {}
    this.t = 0
    this.arg = this.args[0]
  }

  init() {
    if (this.animation.init != null) {
      this.animation.init.call(this.target, this)
    }
    this.current = utils.clone(this.from)
  }

  // Change the animation progress to the start
  restart() {
    this.startTime = utils.now()
    this.finished = false
  }

  // Change the animation progress to the end
  end() {
    this.startTime = utils.now() - this.animation.duration * 1000
  }

  // Interpolate `current` according `from`, `to` and `t`
  interpolate() {
    if (this.from == null) return

    if (typeof this.from === 'number') {
      this.current = interpolateNum(this.from, this.to, this.t)
    } else if (this.from instanceof Color) {
      interpolateColor(this.from, this.to, this.t, this.current)
    } else if (this.from instanceof Vector) {
      interpolateVector(this.from, this.to, this.t, this.current)
    } else if (utils.isPlainObject(this.from)) {
      for (let key of Object.keys(this.from || {})) {
        if (typeof this.from[key] === 'number') {
          this.current[key] = interpolateNum(
            this.from[key],
            this.to[key],
            this.t,
          )
        } else {
          console.warning('NOT SUPPORTED')
          // interpolateObject(this.from[key], this.to[key], this.t, this.current[key])
        }
      }
    } else {
      return console.error(
        `Animation not support interpolate type: ${this.from}`,
      )
    }
  }
}

export default AnimationTask
