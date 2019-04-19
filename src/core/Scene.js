// Scene is the root of the object tree

import Object2D from '../base/Object2D.js'

class Scene extends Object2D {
  constructor() {
    super()
    this.type = 'Scene'
    this.background = Bu.config.background
    this.renderer = null
  }
}

export default Scene
