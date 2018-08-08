# animation class and preset animations

import Bu from '../base/Bu.js'
import utils from '../utils.js'

import Color from '../math/Color.js'

import AnimationTask from './AnimationTask.coffee'

class Animation

  constructor: (options) ->
    @from = options.from
    @to = options.to
    @duration = options.duration or 0.5
    @easing = options.easing or false
    @repeat = !!options.repeat
    @init = options.init
    @update = options.update
    @finish = options.finish

  applyTo: (target, args) ->
    args = [args] unless utils.isArray args
    task = new AnimationTask @, target, args
    Bu.animationRunner.add task
    task

  isLegal: ->
    return true unless @from? and @to?

    if utils.isPlainObject @from
      for own key of @from
        return false unless @to[key]?
    else
      return false unless @to?
    true

export default Animation
