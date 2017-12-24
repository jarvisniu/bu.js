# AnimationTask is an instance of Animation, run by AnimationRunner

import utils from '../utils.js'

import Color from '../math/Color.coffee'
import Vector from '../math/Vector.coffee'

class AnimationTask

  constructor: (@animation, @target, @args = []) ->
    @startTime = 0
    @finished = no
    @from = utils.clone @animation.from
    @current = utils.clone @animation.from
    @to = utils.clone @animation.to
    @data = {}
    @t = 0
    @arg = @args[0]

  init: ->
    @animation.init?.call @target, @
    @current = utils.clone @from

# Change the animation progress to the start
  restart: ->
    @startTime = utils.now()
    @finished = no

# Change the animation progress to the end
  end: ->
    @startTime = utils.now() - @animation.duration * 1000

# Interpolate `current` according `from`, `to` and `t`
  interpolate: ->
    return unless @from?

    if typeof @from == 'number'
      @current = interpolateNum @from, @to, @t
    else if @from instanceof Color
      interpolateColor @from, @to, @t, @current
    else if @from instanceof Vector
      interpolateVector @from, @to, @t, @current
    else if utils.isPlainObject @from
      for own key of @from
        if typeof @from[key] == 'number'
          @current[key] = interpolateNum @from[key], @to[key], @t
        else
          interpolateObject @from[key], @to[key], @t, @current[key]
    else
      console.error "Animation not support interpolate type: ", @from

  interpolateNum = (a, b, t) -> b * t - a * (t - 1)

  interpolateColor = (a, b, t, c) ->
    c.setRGBA interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t)

  interpolateVector = (a, b, t, c) ->
    c.x = interpolateNum a.x, b.x, t
    c.y = interpolateNum a.y, b.y, t

export default AnimationTask
