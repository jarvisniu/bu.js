// Run the animation tasks

import utils from '../utils.js'

let DEFAULT_EASING_FUNCTION = 'quad'

let easingFunctions = {
  quadIn (t) {
    return t * t
  },
  quadOut (t) {
    return t * (2 - t)
  },
  quad (t) {
    if (t < 0.5) {
      return 2 * t * t
    } else {
      return ((-2 * t * t) + (4 * t)) - 1
    }
  },

  cubicIn (t) {
    return Math.pow(t, 3)
  },
  cubicOut (t) {
    return Math.pow((t - 1), 3) + 1
  },
  cubic (t) {
    if (t < 0.5) {
      return 4 * Math.pow(t, 3)
    } else {
      return (4 * Math.pow((t - 1), 3)) + 1
    }
  },

  sineIn (t) {
    return Math.sin((t - 1) * utils.HALF_PI) + 1
  },
  sineOut (t) {
    return Math.sin(t * utils.HALF_PI)
  },
  sine (t) {
    if (t < 0.5) {
      return (Math.sin(((t * 2) - 1) * utils.HALF_PI) + 1) / 2
    } else {
      return (Math.sin((t - 0.5) * Math.PI) / 2) + 0.5
    }
  },
}

class AnimationRunner {
  constructor () {
    this.runningAnimations = []
  }

  add (task) {
    task.init()
    if (task.animation.isLegal()) {
      task.startTime = utils.now()
      return this.runningAnimations.push(task)
    } else {
      return console.error('AnimationRunner: animation setting is illegal: ', task.animation)
    }
  }

  update () {
    const now = utils.now()
    for (let task of Array.from(this.runningAnimations)) {
      var finish
      if (task.finished) continue

      const anim = task.animation
      let t = (now - task.startTime) / (anim.duration * 1000)
      if (t >= 1) {
        finish = true
        if (anim.repeat) {
          t = 0
          task.startTime = utils.now()
        } else {
          // TODO remove the finished tasks out
          t = 1
          task.finished = true
        }
      }

      if (anim.easing === true) {
        t = easingFunctions[DEFAULT_EASING_FUNCTION](t)
      } else if (easingFunctions[anim.easing] != null) {
        t = easingFunctions[anim.easing](t)
      }

      task.t = t
      task.interpolate()

      anim.update.call(task.target, task)
      if (finish) {
        if (anim.finish != null) anim.finish.call(task.target, task)
      }
    }
  }

  // Hook up on an renderer, remove own setInternal
  hookUp (renderer) {
    return renderer.on('update', () => this.update())
  }
}

// TODO add quart, quint, expo, circ, back, elastic, bounce

export default AnimationRunner
