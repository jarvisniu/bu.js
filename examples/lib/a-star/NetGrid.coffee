###*
# NetGrid - a net consists of square blocks.
# @param w - Width of the grid net.
# @param h - Height of the grid net.
# @constructor
###

AStar.NetGrid = (w, h) ->
  _self = this
  @engine = null

  @width = w or 20
  @height = h or 10
  @count = @width * @height

  @nodes = []

  # for engine
  @startNode = null
  @endNode = null

  # setters

  @setStart = (x, y) ->
    node = @getNode(x, y)
    return if node.state != AStar.NODE_STATE_DEFAULT
    if @startNode?
      return if @startNode.position.x == x && @startNode.position.y == y
      @startNode.state = AStar.NODE_STATE_DEFAULT
      @engine.trigger 'nodeChanged', @startNode.position

    @startNode = node
    node.state = AStar.NODE_STATE_START
    @engine.trigger 'nodeChanged', node.position

  @setEnd = (x, y) ->
    node = @getNode(x, y)
    return if node.state != AStar.NODE_STATE_DEFAULT
    if @endNode?
      return if @endNode.position.x == x && @endNode.position.y == y
      @endNode.state = AStar.NODE_STATE_DEFAULT
      @engine.trigger 'nodeChanged', @endNode.position

    @endNode = node
    node.state = AStar.NODE_STATE_END
    @engine.trigger 'nodeChanged', node.position

  # getters

  @getNode = (x, y) ->
    @nodes[x] or= []
    if not @nodes[x][y]?
      @nodes[x][y] = new AStar.Node this
      @nodes[x][y].position.x = x
      @nodes[x][y].position.y = y
    @nodes[x][y]

  @getNeighboursOf = (node) ->
    return node.neighbours if node.neighbours

    x = node.position.x
    y = node.position.y

    xFrom = x - 1
    xTo = x + 1

    yFrom = y - 1
    yTo = y + 1


    xFrom = 0 if xFrom < 0
    xFrom = @width - 1 if xFrom > @width - 1
    xTo = 0 if xTo < 0
    xTo = @width - 1 if xTo > @width - 1

    yFrom = 0 if yFrom < 0
    yFrom = @height - 1  if yFrom > @height - 1
    yTo = 0 if yTo < 0
    yTo = @height - 1 if yTo > @height - 1

    node.neighbours = []

    for i in [xFrom..xTo]
      for j in [yFrom..yTo]
        neighbour = @getNode(i, j)
        # not itself
        continue if i == x and j == y
        # not obstacle
        continue if neighbour.state == AStar.NODE_STATE_OBSTACLE
        # When move on the diagonals, four blocks must be all reachable.
        if (i - x) * (j - y) != 0
          continue if @getNode(x, j).state == AStar.NODE_STATE_OBSTACLE or @getNode(i, y).state == AStar.NODE_STATE_OBSTACLE

        node.neighbours.push neighbour
    node.neighbours

  @calcShortestDistance = (node1, node2) ->
    dx = Math.abs(node1.position.x - (node2.position.x))
    dy = Math.abs(node1.position.y - (node2.position.y))

    distance = Math.abs(dx - dy) + Math.min(dx, dy) * 1.414

    return distance
  return this
