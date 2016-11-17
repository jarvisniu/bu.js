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

    restart: ->
        @startTime = Bu.now()
        @finished = no

    interpolate: ->
        return unless @from?

        if Bu.isNumber @from
            @current = interpolateNum @from, @to, @t
        else if @from instanceof Bu.Color
            interpolateColor @from, @to, @t, @current
        else if @from instanceof Bu.Vector
            interpolateVector @from, @to, @t, @current
        else if Bu.isPlainObject @from
            for own key of @from
                if Bu.isNumber @from[key]
                    @current[key] = interpolateNum @from[key], @to[key], @t
                else
                    interpolateObject @from[key], @to[key], @t, @current[key]
        else
            console.error "Bu.Animation not support interpolate type: ", @from

    interpolateNum = (a, b, t) -> b * t - a * (t - 1)

    interpolateColor = (a, b, t, c) ->
        c.setRGBA interpolateNum(a.r, b.r, t), interpolateNum(a.g, b.g, t), interpolateNum(a.b, b.b, t), interpolateNum(a.a, b.a, t)

    interpolateVector = (a, b, t, c) ->
        c.x = interpolateNum a.x, b.x, t
        c.y = interpolateNum a.y, b.y, t
