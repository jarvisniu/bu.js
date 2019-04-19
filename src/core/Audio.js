// Audio

class Audio {
  constructor(url) {
    this.audio = document.createElement('audio')
    this.url = ''
    this.ready = false

    if (url) this.load(url)
  }

  load(url) {
    this.url = url
    this.audio.addEventListener('canplay', () => {
      this.ready = true
    })
    this.audio.src = url
  }

  play() {
    if (this.ready) {
      this.audio.play()
    } else {
      console.warn(`The audio file [${this.url}] is not ready.`)
    }
  }
}

export default Audio
