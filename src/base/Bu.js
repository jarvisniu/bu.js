// Bu

// config:
//   el
//   width/height
//   imageSmoothing
//   showBounds
// data
// methods
// objects
// scene
// events
// init
// update

import Renderer from '../core/Renderer.js'
import Scene from '../core/Scene.js'

import InputManager from '../input/InputManager.js'

// Execute a callback function when the document is ready
function ready(cb, context, args) {
  if (document.readyState === 'complete') {
    cb.apply(context, args)
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      cb.apply(context, args)
    })
  }
}

class Bu {
  constructor($options = {}) {
    this.$options = $options
    for (let k of ['config', 'data', 'objects', 'methods', 'events']) {
      this.$options[k] = this.$options[k] || {}
    }
    if (this.$options.config.el) {
      this.$options.config.container = this.$options.config.el
    }
    this.$inputManager = new InputManager()
    ready(this.init, this)
    Bu.$bues.push(this)
  }

  init() {
    // scene
    let scene = new Scene()

    // renderer
    // TODO: list the config props
    this.$renderer = new Renderer(this.$options.config)
    this.$renderer.scene = scene
    scene.renderer = this.$renderer

    // data
    if (typeof this.$options.data === 'function') {
      this.$options.data = this.$options.data.apply(this)
    }
    for (let k in this.$options.data) {
      this[k] = this.$options.data[k]
    }

    // methods
    for (let k in this.$options.methods) {
      this[k] = this.$options.methods[k]
    }

    // objects
    let objects =
      typeof this.$options.objects === 'function'
        ? this.$options.objects.apply(this)
        : this.$options.objects
    for (let name in objects) {
      this[name] = objects[name]
    }

    // create default scene tree
    if (!this.$options.scene) {
      this.$options.scene = {}
      for (let name in objects) {
        this.$options.scene[name] = {}
      }
    }

    // assemble scene tree
    // TODO use an algorithm to avoid circular structure
    let assembleObjects = (children, parent) => {
      let results = []
      for (let name in children) {
        if (!children.hasOwnProperty(name)) continue
        parent.addChild(objects[name])
        results.push(assembleObjects(children[name], objects[name]))
      }
      return results
    }
    assembleObjects(this.$options.scene, this.$renderer.scene)

    // init
    if (this.$options.init) this.$options.init.call(this)

    // events
    this.$inputManager.handleAppEvents(this, this.$options.events)

    // update
    if (this.$options.update) {
      this.$renderer.on('update', () => {
        this.$options.update.apply(this, arguments)
      })
    }
  }
}

export default Bu
