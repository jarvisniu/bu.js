// Manage an Object2D list and update its dashOffset

class DashFlowManager {
  constructor() {
    this.flowingObjects = []
  }

  setSpeed(target, speed) {
    target.dashFlowSpeed = speed
    const i = this.flowingObjects.indexOf(target)
    if (speed !== 0) {
      if (i === -1) {
        return this.flowingObjects.push(target)
      }
    } else {
      if (i > -1) {
        return this.flowingObjects.splice(i, 1)
      }
    }
  }

  update() {
    return Array.from(this.flowingObjects).map(
      o => (o.dashOffset += o.dashFlowSpeed),
    )
  }

  // Hook up on an renderer, remove own setInternal
  hookUp(renderer) {
    return renderer.on('update', () => this.update())
  }
}

export default DashFlowManager
