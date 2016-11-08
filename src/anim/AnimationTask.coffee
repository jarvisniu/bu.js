# AnimationTask is an instance of Animation, run by AnimationRunner

class Bu.AnimationTask

    constructor: (@animation, @target, @args = []) ->
        @startTime = 0
        @finished = no
        @from = Bu.clone @animation.from
        @current = Bu.clone @animation.from
        @to = Bu.clone @animation.to
        @data = {}
        @t = 0
        @arg = @args[0]

    init: ->
        @animation.init?.call @target, @
        @current = Bu.clone @from

    interpolate: ->
        if typeof @from == 'number' # TODO Bu.isNumber
            @current = interpolateNum @from, @to, @t
        else if @from instanceof Bu.Color
            interpolateObject @from, @to, @t, @current
        else if Bu.isPlainObject @from
            for own key of @from
                if typeof @from[key] == 'number'
                    @current[key] = interpolateNum @from[key], @to[key], @t
                else
                    interpolateObject @from[key], @to[key], @t, @current[key]

    interpolateNum = (a, b, t) -> b * t - a * (t - 1)

    interpolateObject = (a, b, t, c) ->
        if a instanceof Bu.Color
            c.setRGBA interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t)
        else
            console.error "AnimationTask.interpolateObject() doesn't support object type: ", a
