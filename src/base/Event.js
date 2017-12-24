// Add event listener feature to custom objects

let Event = function () {
  let types = {}

  this.on = (type, listener) => {
    types[type] = types[type] || []
    let listeners = types[type]
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener)
    }
  }

  this.once = (type, listener) => {
    listener.once = true
    this.on(type, listener)
  }

  this.off = (type, listener) => {
    let listeners = types[type]
    if (listener) {
      if (listeners) {
        let index = listeners.indexOf(listener)
        if (index > -1) listeners.splice(index, 1)
      }
    } else {
      if (listeners) listeners.length = 0
    }
  }

  this.trigger = (type, ev) => {
    let listeners = types[type]

    if (listeners) {
      ev = ev || {}
      ev.target = this
      for (let listener of listeners) {
        listener.call(this, ev)
        if (listener.once) {
          listeners.splice(listeners.indexOf(listener), 1)
        }
      }
    }
  }
}

export default Event
