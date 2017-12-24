# Audio

class Audio

  constructor: (url) ->
    @audio = document.createElement 'audio'
    @url = ''
    @ready = no

    @load url if url

  load: (url) ->
    @url = url
    @audio.addEventListener 'canplay', =>
      @ready = yes
    @audio.src = url

  play: ->
    if @ready
      @audio.play()
    else
      console.warn "The audio file #{ @url } hasn't been ready."

export default Audio
