// Manage the user input, like mouse, keyboard, touchscreen etc

class InputManager {
  constructor () {
    this.keyStates = []

    window.addEventListener('keydown', ev => {
      this.keyStates[ev.keyCode] = true
    })
    window.addEventListener('keyup', ev => {
      this.keyStates[ev.keyCode] = false
    })
  }

  // To detect whether a key is pressed down
  isKeyDown (key) {
    const keyCode = this.keyToKeyCode(key)
    return this.keyStates[keyCode]
  }

  // Convert from keyIdentifiers/keyValues to keyCode
  keyToKeyCode (key) {
    key = keyAliasToKeyMap[key] || key
    return keyToKeyCodeMap[key]
  }

  // Recieve and bind the mouse/keyboard events listeners
  handleAppEvents (app, events) {
    const keydownListeners = {}
    const keyupListeners = {}

    window.addEventListener('keydown', ev => {
      if (keydownListeners[ev.keyCode]) {
        keydownListeners[ev.keyCode].call(app, ev)
      }
    })
    window.addEventListener('keyup', ev => {
      if (keyupListeners[ev.keyCode]) {
        keyupListeners[ev.keyCode].call(app, ev)
      }
    })

    return (() => {
      const result = []
      for (let type in events) {
        var key, keyCode
        if (['mousedown', 'mousemove', 'mouseup', 'mousewheel'].includes(type)) {
          result.push(app.$renderer.dom.addEventListener(type, events[type].bind(app)))
        } else if (['keydown', 'keyup'].includes(type)) {
          result.push(window.addEventListener(type, events[type].bind(app)))
        } else if (type.indexOf('keydown.') === 0) {
          key = type.substring(8)
          keyCode = this.keyToKeyCode(key)
          result.push(keydownListeners[keyCode] = events[type])
        } else if (type.indexOf('keyup.') === 0) {
          key = type.substring(6)
          keyCode = this.keyToKeyCode(key)
          result.push(keyupListeners[keyCode] = events[type])
        } else {
          result.push(undefined)
        }
      }
      return result
    })()
  }
}

// Map from keyIdentifiers/keyValues to keyCode
const keyToKeyCodeMap = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Shift: 16,
  Control: 17,
  Alt: 18,
  CapsLock: 20,
  Escape: 27,
  ' ': 32,  // Space
  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  Delete: 46,

  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,

  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,

  '`': 192,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  ';': 186,
  "'": 222,
  '[': 219,
  ']': 221,
  '\\': 220,
}

// Map from not standard, but commonly known keyValues/keyIdentifiers to keyCode
const keyAliasToKeyMap = {
  Ctrl: 'Control',          // 17
  Ctl: 'Control',           // 17
  Esc: 'Escape',            // 27
  Space: ' ',               // 32
  PgUp: 'PageUp',           // 33
  'Page Up': 'PageUp',      // 33
  PgDn: 'PageDown',         // 34
  'Page Down': 'PageDown',  // 34
  Left: 'ArrowLeft',        // 37
  Up: 'ArrowUp',            // 38
  Right: 'ArrowRight',      // 39
  Down: 'ArrowDown',        // 40
  Del: 'Delete',            // 46
}

export default InputManager
