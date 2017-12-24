# Bow shape

import Object2D from '../base/Object2D.js'

import Line from '../shapes/Line.coffee'
import Point from '../shapes/Point.coffee'

class Bow extends Object2D

  type: 'Bow'
  fillable: yes

  constructor: (@cx, @cy, @radius, @aFrom, @aTo) ->
    super()

    [@aFrom, @aTo] = [@aTo, @aFrom] if @aFrom > @aTo

    @center = new Point @cx, @cy
    @string = new Line @center.arcTo(@radius, @aFrom), @center.arcTo(@radius, @aTo)
    @keyPoints = @string.points

    @updateKeyPoints()
    @on 'changed', @updateKeyPoints
    @on 'changed', => @.bounds?.update()

  clone: -> new Bow @cx, @cy, @radius, @aFrom, @aTo

  updateKeyPoints: ->
    @center.set @cx, @cy
    @string.points[0].copy @center.arcTo @radius, @aFrom
    @string.points[1].copy @center.arcTo @radius, @aTo
    @keyPoints = @string.points
    @

export default Bow
