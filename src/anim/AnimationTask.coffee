# AnimationTask is an instance of Animation, run by AnimationRunner

class Bu.AnimationTask

    constructor: (@animation, @target, @args = []) ->
        @startTime = 0
        @finished = no
        @current = Bu.clone @animation.from
        @data = {}
        @t = 0
        @arg = @args[0]

    interpolate: (t) ->
        if typeof @animation.from == 'number'
            @current = interpolateNum @animation.from, @animation.to, t
        else if @animation.from instanceof Bu.Color
            interpolateObject @animation.from, @animation.to, t, @current
        else if Bu.isPlainObject @animation.from
            for own key of @animation.from
                if typeof @animation.from[key] == 'number'
                    @current[key] = interpolateNum @animation.from[key], @animation.to[key], t
                else
                    interpolateObject @animation.from[key], @animation.to[key], t, @current[key]

    interpolateNum = (a, b, t) -> b * t - a * (t - 1)

    interpolateObject = (a, b, t, c) ->
        if a instanceof Bu.Color
            c.setRGBA interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t)
        else
            console.error "AnimationTask.interpolateObject() doesn't support object type: ", a
