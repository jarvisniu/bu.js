// animation class and preset animations

import Bu from '../base/Bu.js'
import utils from '../utils.js'

// import Color from '../math/Color.js'

import AnimationTask from './AnimationTask.js'

class Animation {
  constructor(options) {
    this.from = options.from
    this.to = options.to
    this.duration = options.duration || 0.5
    this.easing = options.easing || false
    this.repeat = !!options.repeat
    this.init = options.init
    this.update = options.update
    this.finish = options.finish
  }

  applyTo(target, args) {
    if (!utils.isArray(args)) args = [args]
    let task = new AnimationTask(this, target, args)
    Bu.animationRunner.add(task)
    return task
  }

  isLegal() {
    if (this.from == null || this.to == null) {
      return true
    }

    if (utils.isPlainObject(this.from)) {
      for (let key of Object.keys(this.from)) {
        if (this.to[key] == null) return false
      }
    } else {
      if (this.to == null) return false
    }
    return true
  }
}

export default Animation
