# Fan shape

import Object2D from '../base/Object2D.js'

import Line from '../shapes/Line.coffee'
import Point from '../shapes/Point.coffee'

class Fan extends Object2D

  type: 'Fan'
  fillable: yes

  constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
    super()

    [@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

    @center = new Point @cx, @cy
    @string = new Line @center.arcTo(@radius, @aFrom), @center.arcTo(@radius, @aTo)

    @keyPoints = [
      @string.points[0]
      @string.points[1]
      @center
    ]
    @on 'changed', @updateKeyPoints
    @on 'changed', => @.bounds?.update()

  clone: -> new Fan @cx, @cy, @radius, @aFrom, @aTo

  updateKeyPoints: ->
    @center.set @cx, @cy
    @string.points[0].copy @center.arcTo @radius, @aFrom
    @string.points[1].copy @center.arcTo @radius, @aTo
    @

export default Fan
