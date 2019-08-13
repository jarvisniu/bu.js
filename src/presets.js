// Presets
import Bu from './core/Bu.js'

// Global unique instances ----------------------------------------------------

import AnimationRunner from './anim/AnimationRunner.js'
import DashFlowManager from './extra/DashFlowManager.js'

// Preset Styles --------------------------------------------------------------

import Styled from './base/Styled.js'

// Preset Animations ----------------------------------------------------------

import Animation from './anim/Animation.js'
import Color from './math/Color.js'

Bu.$instances = []

Bu.animationRunner = new AnimationRunner()
Bu.dashFlowManager = new DashFlowManager()

Bu.styles = {
  default: new Styled().stroke().fill(),
  hover: new Styled()
    .stroke('hsla(0, 100%, 40%, 0.75)')
    .fill('hsla(0, 100%, 75%, 0.5)'),
  text: new Styled().stroke(false).fill('black'),
  line: new Styled().fill(false),
  selected: new Styled().setLineWidth(2),
  dash: new Styled().dash(),
}

Bu.animations = {
  // Simple

  fadeIn: new Animation({
    update: function(anim) {
      this.opacity = anim.t
    },
  }),

  fadeOut: new Animation({
    update: function(anim) {
      this.opacity = 1 - anim.t
    },
  }),

  spin: new Animation({
    update: function(anim) {
      this.rotation = anim.t * Math.PI * 2
    },
  }),

  spinIn: new Animation({
    init: function(anim) {
      anim.data.desScale = anim.arg || 1
    },
    update: function(anim) {
      this.opacity = anim.t
      this.rotation = anim.t * Math.PI * 4
      this.scale = anim.t * anim.data.desScale
    },
  }),

  spinOut: new Animation({
    update: function(anim) {
      this.opacity = 1 - anim.t
      this.rotation = anim.t * Math.PI * 4
      this.scale = 1 - anim.t
    },
  }),

  blink: new Animation({
    duration: 0.2,
    from: 0,
    to: 512,
    update: function(anim) {
      let d = Math.floor(Math.abs(anim.current - 256))
      this.fillStyle = `rgb(${d}, ${d}, ${d})`
    },
  }),

  shake: new Animation({
    init: function(anim) {
      anim.data.ox = this.position.x
      anim.data.range = anim.arg || 20
    },
    update: function(anim) {
      this.position.x =
        Math.sin(anim.t * Math.PI * 8) * anim.data.range + anim.data.ox
    },
  }),

  jump: new Animation({
    init: function(anim) {
      anim.data.oy = this.position.y
      anim.data.height = anim.arg || 100
    },
    update: function(anim) {
      this.position.y =
        -anim.data.height * Math.sin(anim.t * Math.PI) + anim.data.oy
    },
  }),

  // Toggled: detect and save original status

  puff: new Animation({
    duration: 0.15,
    init: function(anim) {
      anim.from = {
        opacity: this.opacity,
        scale: this.scale.x,
      }
      anim.to =
        this.opacity === 1
          ? {
              opacity: 0,
              scale: this.scale.x * 1.5,
            }
          : {
              opacity: 1,
              scale: this.scale.x / 1.5,
            }
    },
    update: function(anim) {
      this.opacity = anim.current.opacity
      this.scale = anim.current.scale
    },
  }),

  clip: new Animation({
    init: function(anim) {
      if (this.scale.y !== 0) {
        anim.from = this.scale.y
        anim.to = 0
      } else {
        anim.from = this.scale.y
        anim.to = this.scale.x
      }
    },
    update: function(anim) {
      this.scale.y = anim.current
    },
  }),

  flipX: new Animation({
    init: function(anim) {
      anim.from = this.scale.x
      anim.to = -anim.from
    },
    update: function(anim) {
      this.scale.x = anim.current
    },
  }),

  flipY: new Animation({
    init: function(anim) {
      anim.from = this.scale.y
      anim.to = -anim.from
    },
    update: function(anim) {
      this.scale.y = anim.current
    },
  }),

  // With Arguments

  moveTo: new Animation({
    init: function(anim) {
      if (anim.arg != null) {
        anim.from = this.position.x
        anim.to = parseFloat(anim.arg)
      } else {
        console.error('Bu:animations.moveTo need an argument')
      }
    },
    update: function(anim) {
      this.position.x = anim.current
    },
  }),

  moveBy: new Animation({
    init: function(anim) {
      if (anim.args != null) {
        anim.from = this.position.x
        anim.to = this.position.x + parseFloat(anim.args)
      } else {
        console.error('Bu:animations.moveBy need an argument')
      }
    },
    update: function(anim) {
      this.position.x = anim.current
    },
  }),

  discolor: new Animation({
    init: function(anim) {
      let desColor = anim.arg
      if (typeof desColor === 'string') {
        desColor = new Color(desColor)
      }
      anim.from = new Color(this.fillStyle)
      anim.to = desColor
    },
    update: function(anim) {
      this.fillStyle = anim.current.toRGBA()
    },
  }),
}
