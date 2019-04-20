// move a point by dragging it

class ReactorBase {
  constructor() {
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
    this.enabled = false
  }

  enable() {
    this.addListeners()
    this.enabled = true
  }

  disable() {
    this.removeListeners()
    this.enabled = false
  }

  _onMouseDown(ev) {
    if (typeof this.onMouseDown === 'function') this.onMouseDown(ev)
  }

  _onMouseMove(ev) {
    if (typeof this.onMouseMove === 'function') this.onMouseMove(ev)
  }

  _onMouseUp(ev) {
    if (typeof this.onMouseUp === 'function') this.onMouseUp(ev)
  }

  addListeners() {
    this.bu.dom.addEventListener('mousedown', this._onMouseDown)
    this.bu.dom.addEventListener('mousemove', this._onMouseMove)
    this.bu.dom.addEventListener('mouseup', this._onMouseUp)
  }

  removeListeners() {
    this.bu.dom.removeEventListener('mousedown', this._onMouseDown)
    this.bu.dom.removeEventListener('mousemove', this._onMouseMove)
    this.bu.dom.removeEventListener('mouseup', this._onMouseUp)
  }
}

Bu.ReactorBase = ReactorBase
